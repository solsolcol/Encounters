    /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)
       Every body here was made for this chapter end to end (a reference on white in an A pose, Meshy at its highest
       settings, its rig with fingers, the library's takes and written ones: masters/v26.0/make.sh §1 to §3), prepped in
       real metres with its feet on the origin and its face along +z. Nobody is a block figure: a person is not drawn at
       all until its model has landed (v21.16).

       A PERSON is a group with the rig cloned into it and one mixer. Its takes all run, each at a weight; `take()` names
       the one that should be full and the rest ease out. A take may hold the body off its own origin (v25.5: measured
       per take, at its first moment), so each is brought back onto the person's spot as its weight rises. In a film a
       person is posed by the film's clock (`pose()`: the take and the moment, absolute, so a seek lands on the same
       picture: v6.4); in play the wall clock runs them.

       ONE SKELETON, SEVERAL SKINS (the tracker's §5 "The levels"). A person's file holds the body drawn from near by;
       `<key>m` and `<key>f` are the same body rebuilt lighter (Meshy's own remesh at 8,000 and 2,500 triangles, the
       rig laid on each by tools/riglod.mjs), and `<key>h` is the generator's own model with every triangle: for the two
       he speaks to face to face, and since v26.4 for the four seated masters and the woman lighting the candles (Chad, 13
       Nov 2026, of the brown hermit drawn from his 30,665-triangle body where he stood over him: "Why is the brown lersi
       so blocky here"; "30k triangles up close should never have been allowed"; and, told what a full body costs a
       phone: "Only the important people like ton, candle lighter female, seated masters, pho, and those that already are
       built this way can retain."). A crowd's driver takes none: its members never draw one.
       Each lighter or fuller skin is bound to the near body's own bones by name, so it
       wears every take and costs no skeleton; which one is drawn is chosen every frame from the lens (and so at a cut
       from the cut's own lens: v24.22), with a little slack so a person standing on a boundary does not flicker. */
    const people = [];
    /* NO SHRUNKEN COPIES OF A GENERATED BODY'S PAINT (v5.11's law, found again on 12 Nov: photographed on a phone's frame,
       every dark head on the turf was speckled white, a child's most of all). A generated body's sheet is hundreds of
       small patches packed edge to edge, each padded into its neighbours: black hair lies flush against white cloth.
       Every shrunken copy of the sheet averages one patch with the next, so a head drawn small is sampled from white
       and black mixed, along every seam of its hair. Plain sampling of the sheet itself never reaches past a texel,
       and the padding makes that texel the patch's own colour. Every body this chapter made (keys e4...), at every
       level; Chad's own models (Grandmaster Pho, the monk) are as he gave them and are not touched. */
    const NOMIP = /^e4/;
    /* v26.1 · A SHEET LAID OUT AGAIN WITH ROOM BETWEEN ITS CHARTS IS DRAWN WITH MIPMAPS (Chad, 12 Nov 2026: the faces
       "absolutely butchered", "really bad" on a 720p phone, "absolutely horrendous" on his own phone). Drawn without them, a
       face with more texels than the phone has pixels was SAMPLED: it sparkled and crawled as anything moved, and a still
       picture hides that. Every level of every body this chapter made is now baked into a sheet with a margin round each
       chart (masters/v26.0/people.sh REPAINT, tools/repaint.py), named `repainted`: such a sheet takes mipmaps and a
       little anisotropy, because averaging it can no longer bleed one chart into the next (v5.11's own answer). A sheet of
       any other name is drawn as it was. */
    /* (and A FACE BAKED ON A SHEET OF ITS OWN, `detail` (v26.3, Ton's: Chad, 13 Nov 2026, "the male character that the player
       keeps talking to, his face is too low res and compressed and blocky looking, improve it"). His full model kept the
       generator's flush charts (the repaint overlapped on its 310,000 triangles), so it was drawn without mipmaps, and from
       where he is talked to his face had three texels a pixel, sampled. His head's charts are baked by Blender into a 2048
       sheet of their own with a gutter round each (tools/rebake.py DETHANDS=0, masters/v26.3/make.sh), 1.6 times the
       texels, so it takes mipmaps as a repainted sheet does. Grandmaster Pho's own `detail` is his and is not touched) */
    function sheetOf(key, t) {
      if (t.name === 'repainted' || (t.name === 'detail' && NOMIP.test(key))) { t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4; t.needsUpdate = true; return t; }
      return NOMIP.test(key) ? noMip(THREE, t) : t;
    }
    /* (the children's runs and their skip too: c_crowd.js) */
    const WALKS = /^(walkdance|Run_02|Run_03)$/;                                 // (the takes that travel: the dancers' walk-dance, the children's two runs)
    /* (the full model's reach was 2.7 m until 12 Nov. Photographed at 2.55 m at both levels, on a phone's frame and a
       desktop's, magnified: no difference to be seen at that distance, and the full model is 310,000 triangles. At
       2.2 m (taken up inside 2.05, let go past 2.35, measured from the lens) it is drawn where he has walked up to
       talk, which is what it was made for: the view from his place in the line, where the woman at the bench stood
       inside the old reach, went from 832,000 triangles to 563,000. It was NOT the spawn's weight, as I first wrote:
       from the spawn Ton was already outside the old reach's own taking-up (2.51 m from the lens). That was the
       sandals behind him: c_zfx.js) */
    /* (v26.1: the near body drawn to 7 m, where it was 5.4, and the mid to 14, where it was 11.5: Chad, 12 Nov 2026, "even on
       the phone, i want a higher rendering budget". Each body's paint is laid out with margins and drawn with mipmaps
       now (sheetOf, above), and the face has three times the robe's share of each sheet: where the near body hands over,
       its face is drawn at about the mid body's own detail, so nothing pops; measured on the brown hermit, 1,091 texels a
       metre on the near face and 186 on the mid's, against a phone's 166 pixels a metre of a face at 7 m) */
    const LEVELS = [['h', 2.2], ['', 7.0], ['m', 14], ['f', Infinity]];         // each skin's suffix and how far it is drawn to
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _lens = new THREE.Vector3();
    /* the soft dark under a body (a phone draws no shadows, so a contact shadow is painted: v9.3) */
    const blobTex = (() => { const [c, x] = cnv(64); const g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
      x.clearRect(0, 0, 64, 64);
      g.addColorStop(0, 'rgba(0,0,0,0.62)'); g.addColorStop(0.55, 'rgba(0,0,0,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const blobGeo = new THREE.PlaneGeometry(1, 1); blobGeo.rotateX(-Math.PI / 2);        // (dispose() finds it through the world, as it finds every geometry)
    const blobMat = B({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const blob = (parent, w = 0.85, d = 0.7) => { const m = new THREE.Mesh(blobGeo, blobMat); m.position.y = 0.014; m.scale.set(w, 1, d); m.renderOrder = 2; parent.add(m); return m; };

    /* A WALK THAT IS NOT A LOOP, MADE ONE (o.loops: { take: [from, to, blend] }). A written take (text-to-motion) starts
       from standing and stops in mid-stride: played round, it jumps at its end. So one whole cycle of it is cut out, from
       a heel's strike to the same heel's next (tools/probes/gait.mjs reads the strikes), where the pace has settled; the
       hips' travel over that cycle is taken out evenly (the group travels: WALKS, below), and over the last `blend`
       seconds every joint is eased onto what it was doing one cycle earlier, so the end IS the start. v5.20: what is
       missing is made from what the file has. */
    const _lqa = new THREE.Quaternion(), _lqb = new THREE.Quaternion();
    function loopOf(clip, t0, t1, blend) {
      const L = t1 - t0, N = Math.max(8, Math.round(L * 30)), times = new Float32Array(N + 1); let travel = null;
      for (let i = 0; i <= N; i++) times[i] = L * i / N;
      const tracks = clip.tracks.map(tr => { const n = tr.getValueSize(), it = tr.createInterpolant(new Float32Array(n)), isQ = /\.quaternion$/.test(tr.name), hip = /Hips\.position$/.test(tr.name);
        const at = (t) => Array.from(it.evaluate(Math.max(0, Math.min(clip.duration, t))));
        const a0 = hip ? at(t0) : null, a1 = hip ? at(t1) : null;
        if (hip) travel = [a1[0] - a0[0], a1[2] - a0[2]];
        const val = (t) => { const v = at(t); if (hip) { const k = (t - t0) / L; v[0] -= (a1[0] - a0[0]) * k; v[2] -= (a1[2] - a0[2]) * k; } return v; };
        const out = new Float32Array((N + 1) * n);
        for (let i = 0; i <= N; i++) { const a = val(t0 + times[i]), w = blend > 0 ? smo(c01((times[i] - (L - blend)) / blend)) : 0;
          if (w > 0) { const b = val(t0 + times[i] - L);
            if (isQ) { _lqa.fromArray(a).slerp(_lqb.fromArray(b), w).toArray(a); } else for (let k = 0; k < n; k++) a[k] += (b[k] - a[k]) * w; }
          out.set(a, i * n); }
        return new tr.constructor(tr.name, times, out); });
      const made = new THREE.AnimationClip(clip.name, L, tracks); made.travel = travel;
      return made;
    }
    function mkPerson(key, x, z, ry, o = {}) {
      const P = { key, o, group: new THREE.Group(), ready: false, acts: {}, w: {}, off: {}, offY: {}, cur: o.take || 'Idle_3', fade: 0.4, win: o.win || null,
                  mixer: null, model: null, head: null, hips: null, bone: {}, lv: [null, null, null, null], lvNow: -1, force: null, members: [],
                  hidden: !!o.hidden, driver: !!o.driver, filmT: null, rate: o.rate || 1, phase: o.phase || 0, clock: (o.phase || 0) * 10, then: [],
                  span: null, gaze: null, gazeK: 0, rest: { take: o.take || 'Idle_3', win: o.win ? Object.assign({}, o.win) : null }, talkTake: o.talk || null, actN: 0 };
      P.group.position.set(x, o.y || 0, z); P.group.rotation.y = ry; P.group.visible = false; (o.parent || world).add(P.group);
      people.push(P);
      if (!have(key)) { waiting.add(key); return P; }
      parseOnce(key).then(({ scene: src, animations }) => {
        if (!alive) return;
        const m = cloneSkinned(src), skins = [];
        m.traverse(q => {
          if (q.isSkinnedMesh) { q.castShadow = false; q.receiveShadow = false; q.frustumCulled = false; skins.push(q); }
          if (q.isBone) { P.bone[q.name] = q; if (/^(mixamorig:?)?Head$/.test(q.name)) P.head = q; if (/^(mixamorig:?)?Hips$/.test(q.name)) P.hips = q; }
        });
        if (o.s) m.scale.multiplyScalar(o.s);
        for (const q of skins) for (const mm of [].concat(q.material)) if (mm && mm.map) sheetOf(key, mm.map);
        P.group.add(m); P.model = m; P.lv[1] = skins;
        P.mixer = new THREE.AnimationMixer(m);
        for (const clip0 of animations) {
          let clip = clip0;
          if (o.loops && o.loops[clip0.name]) clip = loopOf(clip0, o.loops[clip0.name][0], o.loops[clip0.name][1], o.loops[clip0.name][2]);
          /* a walk is walked ON THE SPOT here: the group is what travels (so a path is a path), and the take's own
             travel over the ground is taken out of its hips (their sway and their rise kept) */
          if (WALKS.test(clip.name)) { if (clip === clip0) clip = clip0.clone(); const tr0 = clip.tracks.find(t => /Hips\.position$/.test(t.name));
            if (tr0) { const v = tr0.values, n = v.length / 3, x0 = v[0], z0 = v[2], x1 = v[(n - 1) * 3], z1 = v[(n - 1) * 3 + 2];
              for (let i = 0; i < n; i++) { const k = n > 1 ? i / (n - 1) : 0; v[i * 3] -= (x1 - x0) * k; v[i * 3 + 2] -= (z1 - z0) * k; }
              /* (what was taken out, over the take's length, in the hips' own frame: a loop cut from a longer take has
                 handed on its share. A take that really travels is paced by this, exactly: `pace`, below) */
              (P.travel = P.travel || {})[clip.name] = [(clip.travel ? clip.travel[0] : 0) + (x1 - x0), (clip.travel ? clip.travel[1] : 0) + (z1 - z0)]; } }
          const a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[clip.name] = a; P.w[clip.name] = 0;
        }
        /* A TAKE MADE FROM TWO (o.mix: [[name, upper, lower, at]]): the upper body of one take on the legs of another, held
           at one of its moments. Two of the written takes are right above the waist and wrong below it (the arms rising
           wide of photograph 12 kneel with the shins in the air: the tracker's §5), and a body's own grounded kneel is
           already in its file (v5.20: what is missing is made from what the file has). Hips and legs from `lower` at
           `at` seconds, held; everything above from `upper`, as it moves */
        if (o.mix) for (const [name, up, low, at] of o.mix) { const U = animations.find(c => c.name === up), L = animations.find(c => c.name === low);
          if (!U || !L) { console.warn(key + ': no take to mix ' + name + ' from (' + up + ', ' + low + ')'); continue; }
          const LOWER = /^(Hips|(Left|Right)(UpLeg|Leg|Foot|Toe\w*))\./, tracks = U.tracks.filter(t => !LOWER.test(t.name)).map(t => t.clone());
          for (const t of L.tracks) { if (!LOWER.test(t.name)) continue; const n = t.getValueSize(), T = t.times; let i = 0; while (i < T.length - 1 && T[i + 1] <= (at || 0)) i++;
            const v = Array.from(t.values.slice(i * n, i * n + n)); tracks.push(new t.constructor(t.name, [0, U.duration], v.concat(v))); }
          const clip = new THREE.AnimationClip(name, U.duration, tracks), a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[name] = a; P.w[name] = 0; }
        /* where each take holds the hips at its first moment (or at its window's start), from the person's own spot */
        if (P.hips) { const base = {};
          for (const name in P.acts) { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.group.updateWorldMatrix(true, true);
            P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); base[name] = [_pv.x, _pv.z, _pv.y]; }
          const ref = o.centre ? [0, 0] : (base[o.ref || 'Idle_3'] || [0, 0]);    // centre: the hips themselves on the spot (a sitter on his seat)
          for (const name in base) P.off[name] = (o.keepOff && o.keepOff.test(name)) ? [0, 0] : [base[name][0] - ref[0], base[name][1] - ref[1]];
          /* A SITTER'S SEAT (o.seat: { y: the seat's top, over: how far the hips ride above it, takes: which takes sit }):
             every sitting take holds the hips at its own height (measured: Grandmaster Pho's talk sits 3 cm lower than
             his rest), so each is brought to the one height the seat asks for, and changing take never lifts him off
             it or sinks him through it (v16.8) */
          if (o.seat) for (const name in base) if (!o.seat.takes || o.seat.takes.test(name)) P.offY[name] = base[name][2] - (o.seat.y + (o.seat.over != null ? o.seat.over : 0.1)); }
        /* SEATED BY HIS OWN BODY (Chad, 12 Nov 2026, of the monks: "their body is clipping through the seats"; v16.8: a
           sitter is seated on his posed skin). A hip joint held a fixed way over a seat seats nobody: where a rig's hip
           joints ride in its body is the rig's own (Chad's monk's sit 17 cm over his knees in every seated take he
           has, Grandmaster Pho's 6: tools/probes/sitread.mjs), and so is how long its legs are. The three monks sat
           with their hips at the middle of a chair 0.93 m deep, their shins coming down through its seat and their
           soles a hand's length under the ground. Two ways, each read from the take posed at its window's start:
           o.seat.legs ({ edge, r, apron, sole }): a man on a CHAIR. He is set down by his SOLES (the lowest of what
             rides his feet stands `sole` from the ground: a seated man's feet reach the floor, whatever the seat),
             and brought forward until his SHINS (knee joint to ankle joint, read at the seat's top and at the foot of
             its apron) stand a calf's half-thickness `r` past the seat's front face, `edge` ahead of his spot. What
             is drawn of a robe below his thighs lies in the seat, as cloth does.
           o.seat.floor ({ sink }): a man sitting CROSS-LEGGED on a seat's top, in a take made for the floor: the
             lowest of all his skin (its second hundredth: the crossed ankles go under, as episode 3's cushion has
             them) is set `sink` into the seat's top.
           (updateMatrixWorld, not updateWorldMatrix: only the former is a skinned mesh's own, and it is there that
           the matrix a posed point is brought back through is made again. Without it every point came back in the
           world's frame and was moved by the group once more: a first build of this seated the monks metres from their
           chairs, caught by the boot check's printed numbers) */
        if (P.hips && o.seat && (o.seat.legs || o.seat.floor || o.seat.down) && skins[0] && skins[0].skeleton) for (const name in P.acts) { if (o.seat.takes && !o.seat.takes.test(name)) continue;
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.model.position.set(0, 0, 0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
          const ys = [], feet = [];
          for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
            const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name));
            for (let i = 0; i < pos.count; i++) { q.getVertexPosition(i, _pv); _pv.applyMatrix4(q.matrixWorld); P.group.worldToLocal(_pv); ys.push(_pv.y);
              let fw = 0; for (let c = 0; c < 4; c++) if (foot[si.getComponent(i, c)]) fw += sw.getComponent(i, c); if (fw >= 0.5) feet.push(_pv.y); } }
          if (ys.length < 30) { console.warn(key + ': too little skin to seat him by'); continue; }
          /* (his spot in the model's own frame: what `centre` or `ref` set for this take) */
          const oz = P.off[name] ? P.off[name][1] : 0, rec = {}; let lift = 0, fwd = 0;
          if (o.seat.floor) { ys.sort((u, v2) => u - v2); const low = ys[Math.floor(ys.length * 0.02)]; lift = (o.seat.y - (o.seat.floor.sink != null ? o.seat.floor.sink : 0.01)) - low; rec.low = +low.toFixed(3); }
          else if (o.seat.down) { const keepLegs = P.restLegs, r = seatDown(P, name, o.seat, skins); if (!r) { P.restLegs = keepLegs; continue; }
            P.restLegs = keepLegs && name !== (o.take || 'Idle_3') ? keepLegs : r.legs; P.offY[name] = -r.lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - r.fwd];
            (P.seated = P.seated || {})[name] = r.rep; continue; }
          else { const K = o.seat.legs, bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
            if (!feet.length) { console.warn(key + ': nothing rides his feet to set him down by'); continue; }
            let sole = Infinity; for (const y of feet) if (y < sole) sole = y;
            lift = (K.sole != null ? K.sole : -0.005) - sole;
            let back = Infinity, thigh = Infinity;
            for (const sd of ['Left', 'Right']) { const kn = bone(sd + 'Leg'), an = bone(sd + 'Foot'); if (!kn || !an) continue;
              kn.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ky = _pv.y + lift, kz = _pv.z - oz;
              an.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ay = _pv.y + lift, az = _pv.z - oz;
              P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); thigh = Math.min(thigh, (ky + _pv.y + lift) / 2 - o.seat.y);
              for (const h of [o.seat.y, o.seat.y - (K.apron != null ? K.apron : 0.14)]) { const t = ky > ay ? Math.max(0, Math.min(1, (ky - h) / (ky - ay))) : 0; back = Math.min(back, kz + t * (az - kz)); } }
            if (!(back < Infinity)) { console.warn(key + ': no knees and ankles to seat him by'); continue; }
            fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
            rec.sole = +sole.toFixed(3); rec.back = +back.toFixed(3); rec.thigh = +thigh.toFixed(3);
            /* (a thigh's own half-thickness is some 8 cm: an axis nearer the seat than 4 is a body in the wood) */
            if (thigh < 0.04) console.warn(key + ': set down by his soles, his thighs lie in the seat (their axis ' + (thigh * 100).toFixed(0) + ' cm over it): this seat is too high for this take'); }
          if (!(Math.abs(lift) < 0.8) || fwd > 0.45) { console.warn(key + ': the seat read from his body is not a seat (up ' + lift.toFixed(2) + ' m, forward ' + fwd.toFixed(2) + ' m): left on his hips'); continue; }
          P.offY[name] = -lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - fwd];
          rec.lift = +lift.toFixed(3); rec.fwd = +fwd.toFixed(3); (P.seated = P.seated || {})[name] = rec; }
        /* FEET ON THE GROUND (Chad, 13 Nov 2026: "You didn't notice many masters have their feet sunk clipping into the
           ground?"). A take holds a body at its own height, and a take made on another body (the library's, a written
           one) keeps that body's hips: on legs of another length the soles go under the ground. Measured by
           tools/probes/feetscan.mjs at the morning's start: 57 of 67 people had a foot more than a centimetre under
           the turf, the standing cast 3 to 6 cm, the crowd to 6. So every take that does not sit is set down by the
           body's own lowest contact over the part of it that is played (its window, or the whole take): a STANDING
           take by its soles (what rides the feet), a LOW one (a kneel, a bow to the ground: the hips at under 0.75 of
           their standing height, so a man kneeling upright counts) by the lowest of all its skin. It is set GROUND_SOLE into the ground under the
           person's spot (a body sinks a little into what it rests on, v9.3). This is the measure SINK and the dancers'
           o.sink took by hand, each once on one body, and it replaces them where it is made (groundTakes, below) */
        if (P.hips && o.seat && o.seat.rise && skins[0] && skins[0].skeleton) riseCurve(P, o.seat.rise, skins);
        if (P.hips && skins[0] && skins[0].skeleton) groundTakes(P, skins);
        if (o.headDamp) headDampInit(P);
        /* THE GROUND A WALK OR A RUN COVERS IN A SECOND (o.pace: asked for by whoever moves the group, who drives the take's
           rate from the ground covered: v7.1). The library's walks and runs come on the spot (their hips travel nowhere:
           measured, a few millimetres a second), so the pace is read from the foot that is down: under a body that stays
           where it is, a planted foot goes back at the pace the body would go forward. Each foot at thirty-two moments of
           the take, in the person's own frame; a foot is down while it is within 3.5 cm of the lowest either reaches.
           A TAKE THAT TRAVELS (the dancers' written walk: nine tenths of a metre in the two seconds kept of it) is not read that way: its pace is the
           travel taken out of its hips over its length, exactly, and `heading` the way that travel went from the body's
           own front (this walk goes 21 degrees to her left). Moved at that pace along that line, the hips do over the
           ground just what the take had them do, and a planted foot stays where it was planted. Read from the foot
           that is down, this slow walk gave half its pace (0.21 m a second for 0.46: the foot is flat while the body
           waits over it, and the body's advance comes as the heel lifts), and the file crossed with every foot
           sliding back a hand's length a step: measured in the game on 12 Nov, a planted foot 17 cm in one stance */
        if (o.pace) { const LF = P.bone.LeftFoot || P.bone['mixamorig:LeftFoot'], RF = P.bone.RightFoot || P.bone['mixamorig:RightFoot'];
          if (LF && RF) for (const name in P.acts) { if (!WALKS.test(name)) continue;
            const A = P.acts[name], d = A.getClip().duration, N = 32, F = [[], []];
            const tv = P.travel && P.travel[name];
            if (tv && P.hips && P.hips.parent) { const par = P.hips.parent; P.group.updateWorldMatrix(true, true);
              _pv.set(tv[0], 0, tv[1]); par.localToWorld(_pv); P.group.worldToLocal(_pv); const ax = _pv.x, az = _pv.z;
              _pv.set(0, 0, 0); par.localToWorld(_pv); P.group.worldToLocal(_pv);
              const dx = ax - _pv.x, dz = az - _pv.z, sp = Math.hypot(dx, dz) / d;
              if (sp > 0.05) { (P.pace = P.pace || {})[name] = sp; (P.heading = P.heading || {})[name] = Math.atan2(dx, dz); continue; } }
            for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            for (let i = 0; i <= N; i++) { A.time = Math.min(d - 1e-4, d * i / N); P.mixer.update(0); P.group.updateWorldMatrix(true, true);
              [LF, RF].forEach((b, j) => { b.getWorldPosition(_pv); P.group.worldToLocal(_pv); F[j].push([_pv.y, _pv.z]); }); }
            let lo = Infinity; for (const f of F) for (const q of f) lo = Math.min(lo, q[0]);
            let back = 0, n = 0; for (const f of F) for (let i = 0; i < N; i++) if (f[i][0] < lo + 0.035 && f[i + 1][0] < lo + 0.035) { back += f[i][1] - f[i + 1][1]; n++; }
            if (n > 2 && back > 0) (P.pace = P.pace || {})[name] = back / (n * d / N); } }
        if (!P.acts[P.cur]) { console.warn(key + ' has no take ' + P.cur + ' (it has: ' + Object.keys(P.acts).join(', ') + ')'); P.cur = Object.keys(P.acts)[0]; }
        for (const k in P.acts) { P.w[k] = k === P.cur ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); P.acts[k].time = (P.phase * P.acts[k].getClip().duration) % P.acts[k].getClip().duration; }
        /* (for a look: which way the face looks, from the head's BIND turn, never from the bone's own axes: v6.8. Every
           body here is prepped with its face along +z in its bind pose, so the head's turn since its bind, applied to
           +z, is the face's direction now) */
        if (P.head && skins[0] && skins[0].skeleton) { const sk = skins[0].skeleton, bi = sk.bones.indexOf(P.head);
          if (bi >= 0) { const bm = new THREE.Matrix4().copy(sk.boneInverses[bi]).invert().premultiply(skins[0].bindMatrix);
            P.headRest = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bm)).invert(); } }
        P.ready = true; P.group.visible = !P.hidden && !P.driver;
        if (!P.driver && !o.noBlob) P.blob = blob(P.group, o.blobW || 0.85, o.blobD || 0.7);
        personSettle(P); windowTime(P); P.mixer.update(0);
        if (o.handsOn) restHands(P, o.handsOn);
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, 1);
        if (o.look) o.look(m);
        if (o.skins !== false) for (const i of [0, 2, 3]) if (i || !P.driver) addLevel(P, i);
        const L = P.then; P.then = []; for (const f of L) f(P);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return P;
    }
    /* one more skin of a person, bound to the bones the near body already has */
    function addLevel(P, i) {
      const named = P.o.skins && P.o.skins[i], key = named || (P.o.skins ? null : P.key + LEVELS[i][0]);
      if (!key) return;
      if (!have(key)) { if (i !== 0 || named) waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive || !P.model) return;
        const made = [];
        src.traverse(sm => { if (!sm.isSkinnedMesh) return;
          const bones = sm.skeleton.bones.map(b => P.bone[b.name]);
          if (bones.some(b => !b)) { console.warn(key + ': a bone of it is not on ' + P.key); return; }
          let mat = sm.material;
          if (!mat.map) { let near = null; for (const q of P.lv[1]) for (const nm of [].concat(q.material)) if (nm.name === mat.name) near = nm; if (near) mat = near; }
          if (mat.map) sheetOf(P.key, mat.map);
          const mesh = new THREE.SkinnedMesh(sm.geometry, mat);
          mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.visible = false;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton(bones, sm.skeleton.boneInverses), sm.bindMatrix); made.push(mesh); });
        if (!made.length) return;
        P.lv[i] = made; P.lvNow = -1;
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, i);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    const whenReady = (P, fn) => { if (!P) return; if (P.ready) fn(P); else P.then.push(fn); };
    /* the model slid so the body stands on the person's spot whatever its takes' own offsets, by their weights */
    /* (and set down: two written takes hold the whole body a few centimetres over the ground, measured on a devotee) */
    const SINK = { prostrate: 0.046, offer: 0.049 };
    /* FEET ON THE GROUND, read (mkPerson, above). For each take a body has that does not sit: the lowest of what touches
       the ground over the part of it that is played, and the height that sets that GROUND_SOLE under the person's spot
       (P.offY, with P.grounded saying it was read; P.groundRep keeps what was read, for a probe: feet, all, hips as a
       share of their standing height, low, off). The skin is read where it stands furthest out: of each bone's share of
       it, the points furthest along 64 ways (the feet's) or 14 (the rest's), because the lowest point of a posed body is
       one of its outermost, so a body is read at a thousand points and not at its tens of thousands, each exactly posed
       (getVertexPosition), at GROUND_N moments of a window or GROUND_NW of a whole take. Bodies of one file wearing a
       take in one window share a reading (groundMemo): a crowd of drivers costs it once */
    const GROUND_SOLE = -0.003, GROUND_N = 8, GROUND_NW = 12, GROUND_LOW = 0.75, groundMemo = new Map(), groundPts = new Map();
    const _grV = new THREE.Vector3(), _grI = new THREE.Matrix4(), _grM = new THREE.Matrix4();
    function sphereDirs(n) { const out = [], g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = g * i; out.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return out; }
    const DIRS_FOOT = sphereDirs(64), DIRS_BODY = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].concat([-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x / Math.sqrt(3), y / Math.sqrt(3), z / Math.sqrt(3)]))));
    function groundPoints(P, skins) {
      if (groundPts.has(P.key)) return groundPts.get(P.key);
      /* (each point is kept as WHICH skin and which of its vertices, never the skin itself: every person of one file shares
         this list, and read through the first one's mesh, a crowd's driver was read in somebody else's pose: v26.2) */
      const out = { foot: [], body: [] };
      for (let si0 = 0; si0 < skins.length; si0++) { const q = skins[si0], pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name)), best = new Map();
        for (let i = 0; i < pos.count; i++) { let bj = -1, bw = -1, fw = 0;
          for (let c = 0; c < 4; c++) { const w = sw.getComponent(i, c), j = si.getComponent(i, c); if (w > bw) { bw = w; bj = j; } if (foot[j]) fw += w; }
          const isF = fw >= 0.5, key2 = bj * 2 + (isF ? 1 : 0), D = isF ? DIRS_FOOT : DIRS_BODY;
          let B = best.get(key2); if (!B) best.set(key2, B = { f: isF, v: new Float64Array(D.length).fill(-Infinity), i: new Int32Array(D.length).fill(-1) });
          const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          for (let d = 0; d < D.length; d++) { const u = x * D[d][0] + y * D[d][1] + z * D[d][2]; if (u > B.v[d]) { B.v[d] = u; B.i[d] = i; } } }
        for (const B of best.values()) { const seen = new Set(); for (const i of B.i) if (i >= 0 && !seen.has(i)) { seen.add(i); (B.f ? out.foot : out.body).push([si0, i]); } } }
      groundPts.set(P.key, out); return out;
    }
    function groundTakes(P, skins) {
      const o = P.o, seatT = (nm) => !!o.seat && (!o.seat.takes || o.seat.takes.test(nm));
      const sk = skins[0].skeleton, hi = sk.bones.indexOf(P.hips); if (hi < 0) return;
      P.model.position.set(0, 0, 0);
      const poseAt = (A, t) => { A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true); _grI.copy(P.group.matrixWorld).invert(); };
      const only = (name) => { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0); };
      const momentsOf = (name) => { const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], N = W ? GROUND_N : GROUND_NW, ts = [];
        for (let i = 0; i < N; i++) ts.push(W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : Math.min(d - 1e-3, d * i / (N - 1)));
        return ts; };
      /* (the hips' standing height: the highest they stand in any of this body's takes that do not sit. Read from the
         bind pose it came out at 2 to 15 cm on these files, and every take was left as it was: v26.2's first build) */
      let standH = groundPts.has(P.key + '|H') ? groundPts.get(P.key + '|H') : -Infinity;
      if (!(standH > -Infinity)) { for (const name in P.acts) { if (seatT(name)) continue; only(name);
          for (const t of momentsOf(name)) { poseAt(P.acts[name], t); standH = Math.max(standH, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); } }
        groundPts.set(P.key + '|H', standH); }
      if (!(standH > 0.3)) { if (standH > -Infinity) console.warn(P.key + ': no standing height to read its takes against (' + standH.toFixed(2) + ')'); return; }
      const PTS = groundPoints(P, skins);
      const lowOf = (list) => { let m = Infinity; const mats = new Map();
        for (const [k, i] of list) { const q = skins[k]; if (!q) continue; let M = mats.get(q); if (!M) { M = new THREE.Matrix4().multiplyMatrices(_grI, q.matrixWorld); mats.set(q, M); }
          q.getVertexPosition(i, _grV); _grV.applyMatrix4(M); if (_grV.y < m) m = _grV.y; } return m; };
      for (const name in P.acts) { if (seatT(name)) continue;
        const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], memo = P.key + '|' + name + '|' + (W ? W[0] + ',' + W[1] : '');
        let R = groundMemo.get(memo);
        if (!R) { const ts = momentsOf(name); only(name);
          let hipsLo = Infinity; for (const t of ts) { poseAt(A, t); hipsLo = Math.min(hipsLo, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); }
          const low = hipsLo < GROUND_LOW * standH; let feet = Infinity, all = Infinity;
          for (let n = 0; n < ts.length; n++) { poseAt(A, ts[n]); feet = Math.min(feet, lowOf(PTS.foot));
            if (low || n === 0) all = Math.min(all, feet, lowOf(PTS.body)); }
          const contact = low ? all : feet;
          R = { feet: +feet.toFixed(4), all: +all.toFixed(4), hips: +(hipsLo / standH).toFixed(2), low, off: +(contact - GROUND_SOLE).toFixed(4) };
          if (!(Math.abs(R.off) < 0.2)) { console.warn(P.key + ': ' + name + ' read as standing ' + R.off.toFixed(3) + ' m off the ground: left as it was'); R.skip = true; }
          groundMemo.set(memo, R); }
        (P.groundRep = P.groundRep || {})[name] = R;
        if (R.skip) continue;
        P.offY[name] = R.off; (P.grounded = P.grounded || {})[name] = true; }
    }
    /* A RISE FROM A SEAT, on the ground (o.seat.rise: the name of the take he stands up in). Seated he is set on his seat
       by his bottom and his legs are laid down to the ground (seatDown); stood up he is set down by his soles, as any
       standing take is. Between, the take's own hips say how far he has risen: at each of 25 moments of it the height his
       hips have climbed from where he sits to the highest they reach, eased, takes him from the one height to the other
       (P.rise[name], read in personSettle at the take's own moment). Grandmaster Pho rises from his bench in play and in
       the films: on his seat's height his soles stood 7 cm under the ground the whole way up */
    function riseCurve(P, name, skins) {
      const A = P.acts[name]; if (!A || !(P.offY[name] != null)) return;
      const PTS = groundPoints(P, skins), d = A.getClip().duration, N = 25, ts = [], hs = [], fs = [];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
      P.model.position.set(0, 0, 0);
      for (let i = 0; i < N; i++) { const t = Math.min(d - 1e-3, d * i / (N - 1)); A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
        _grI.copy(P.group.matrixWorld).invert(); let m = Infinity;
        for (const [k, j] of PTS.foot) { const q = skins[k]; if (!q) continue; _grM.multiplyMatrices(_grI, q.matrixWorld); q.getVertexPosition(j, _grV); _grV.applyMatrix4(_grM); if (_grV.y < m) m = _grV.y; }
        ts.push(t); hs.push(P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); fs.push(m); }
      const W = P.win && P.win[name], t0 = W ? W[0] : 0; let h0 = hs[0]; for (let i = 0; i < N; i++) if (ts[i] <= t0) h0 = hs[i];
      const h1 = Math.max(...hs), seat = P.offY[name], off = [];
      if (!(h1 - h0 > 0.15)) { console.warn(P.key + ': ' + name + ' does not rise (' + (h1 - h0).toFixed(2) + ' m): left on its seat'); return; }
      const ks = [];
      for (let i = 0; i < N; i++) { const u = Math.max(0, Math.min(1, ((hs[i] - h0) / (h1 - h0) - 0.15) / 0.7)), k = u * u * (3 - 2 * u);
        off.push(seat + k * ((fs[i] - GROUND_SOLE) - seat)); ks.push(k); }
      (P.rise = P.rise || {})[name] = { ts, off, k: ks };
      (P.groundRep = P.groundRep || {})[name] = { seat: +seat.toFixed(4), stood: +(fs[N - 1] - GROUND_SOLE).toFixed(4), rise: +(h1 - h0).toFixed(3) };
    }
    /* HEAD TURNS RESTRAINED (o.headDamp: { take: [k, reference take] }; Chad, 13 Nov 2026: "for the audience looking left
       and right, i think the angle to left and right is too extreme, and can be slightly restrained", and "When
       grandmaster pho talks, his head also moves too much to the right, i think the head movement can be greatly
       restrained"). Measured (tools/probes/headturn.mjs): the kneel's look round swept the face from 54 degrees to one
       side to 61 to the other, and Grandmaster Pho's talk turned his face up to 56 degrees to his right. So while a take
       named here is worn, the turns of the upper chest, the neck and the head are laid `k` of the way from a reference to
       where the take puts them: the reference is that take's own middle (the mean of those turns over its window: the look
       round about its centre) or another take's (his talk about his rest, which faces his front). The motion is the
       take's, smaller, and nothing else moves. Laid after the mixer has posed the body every frame (the mixer writes those
       turns again each frame), in play and in a film's pose alike, before a look (gaze) is laid over it */
    const _hdQ = new THREE.Quaternion();
    function headDampInit(P) {
      const D = P.o.headDamp, bones = [];
      for (const nm of ['Spine2', 'Neck', 'Head']) { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) { bones.push(P.bone[n]); break; } }
      if (!D || !bones.length) return;
      const meanOf = (name) => { const A = P.acts[name]; if (!A) return null; const d = A.getClip().duration, W = P.win && P.win[name], N = 24, acc = bones.map(() => [0, 0, 0, 0]), first = [];
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        for (let i = 0; i < N; i++) { A.time = W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : d * i / N; P.mixer.update(0);
          bones.forEach((b, j) => { const q = b.quaternion; if (i === 0) first[j] = q.clone();
            const s = q.x * first[j].x + q.y * first[j].y + q.z * first[j].z + q.w * first[j].w < 0 ? -1 : 1; acc[j][0] += q.x * s; acc[j][1] += q.y * s; acc[j][2] += q.z * s; acc[j][3] += q.w * s; }); }
        return acc.map(v => new THREE.Quaternion(v[0], v[1], v[2], v[3]).normalize()); };
      P.hd = { bones, take: {} };
      for (const name in D) { const spec = [].concat(D[name]), M = P.acts[name] ? meanOf(spec[1] || name) : null; if (M) P.hd.take[name] = { k: +spec[0], M }; }
    }
    function headDampLay(P) {
      const H = P.hd; if (!H) return;
      let best = null, bw = 0, cut = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (w > 0) { cut += w * (1 - H.take[n].k); if (w > bw) { bw = w; best = n; } } }
      if (!best || !(cut > 1e-4)) return;
      const M = H.take[best].M, kk = 1 - Math.min(1, cut);
      H.bones.forEach((b, j) => { _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); });
      H.bones[0].updateWorldMatrix(false, true);
    }
    function riseOff(R, t, which = 'off') {
      const ts = R.ts, V = R[which], n = ts.length; if (t <= ts[0]) return V[0]; if (t >= ts[n - 1]) return V[n - 1];
      let i = 1; while (i < n - 1 && ts[i] < t) i++; const u = (t - ts[i - 1]) / (ts[i] - ts[i - 1]); return V[i - 1] + (V[i] - V[i - 1]) * u;
    }
    function personSettle(P) {
      if (!P.model) return; let ox = 0, oz = 0, oy = 0, rk = 0;
      /* (o.sink: a body's own measure for a take: the same written walk lays one dancer's feet 2.5 cm under the turf and
         the other's 1 cm over it: gait.mjs, each ankle against where it stands at rest) */
      const SK = P.o.sink;
      for (const k in P.w) { const w = P.w[k], f = P.off[k]; if (w > 0 && f) { ox += f[0] * w; oz += f[1] * w; }
        const sk = P.grounded && P.grounded[k] ? 0 : (SK && SK[k] != null ? SK[k] : SINK[k]); if (w > 0 && sk) oy += sk * w;
        const oyk = P.rise && P.rise[k] ? riseOff(P.rise[k], P.acts[k].time) : P.offY[k]; if (w > 0 && oyk) oy += oyk * w;
        if (w > 0 && P.rise && P.rise[k]) rk += w * riseOff(P.rise[k], P.acts[k].time, 'k'); }
      P.riseK = rk;
      P.model.position.x = -ox; P.model.position.z = -oz; P.model.position.y = -oy;
    }
    /* A WINDOW of a take (o.win: { take: [from, length, seconds] }): a take that is right only for part of its length is
       played back and forth inside that part, eased at both ends (the seated idle leans far forward for five of its ten
       seconds: only its upright ends are a master's rest). The window may run past the take's end: it wraps.
       THERE AND BACK TAKES `seconds` (Chad, 12 Nov 2026: "grandmaster pho is bobbing and bouncing too much in his
       passive pose, slow down the bobbing significantly"). Unsaid, it is twice the window's own length, the take's own
       pace: and a SHORT window at the take's own pace is a bob (his rest was 0.3 s of a take there and back every
       0.6 s: his head at 15 cm a second, measured by tools/probes/windowread.mjs; held half risen on 0.28 s of the rise
       it went 16 cm there and back every 0.56 s). A window that is a REST says its seconds. */
    function windowTime(P) {
      if (!P.win) return;
      for (const name in P.win) { const A = P.acts[name]; if (!A || !(P.w[name] > 0)) continue;
        const W = P.win[name], [from, len] = W, d = A.getClip().duration, u = (P.clock / (W[2] > 0 ? W[2] : len * 2)) % 1, k = 0.5 - 0.5 * Math.cos(u * 2 * Math.PI);
        A.time = (((from + k * len) % d) + d) % d; A.timeScale = 0; }
    }
    /* which take a person wears from now on (eased over `fade` seconds); `restart` begins it at its start */
    function take(P, name, fade = 0.4, restart = false) {
      if (!P) return false;
      if (!P.ready) { P.cur = name; P.then.push(() => take(P, name, 0, restart)); return true; }
      if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return false; }
      if (restart || P.cur !== name) { if (restart || P.w[name] < 0.01) P.acts[name].time = 0; }
      if (P.span && P.span.name !== name) P.span = null;
      if (!(P.win && P.win[name]) && !(P.span && P.span.name === name)) P.acts[name].timeScale = 1;       // (a take once windowed runs again when its window is gone)
      P.cur = name; P.fade = fade; P.filmT = null;
      if (!(fade > 0)) { for (const k in P.acts) { P.w[k] = k === name ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); } personSettle(P); }
      return true;
    }
    /* a film's pose: this take at this moment of its own length (held at its end, or wrapped if `loop`), absolutely */
    /* (a take a body does not have fails silently and the man stands as he was: v11.2. A film that asks for one is
       told so once, in the console, where every probe of this chapter reads it) */
    const _noTake = new Set();
    function noTake(P, name) { const k = P.key + ':' + name; if (_noTake.has(k)) return; _noTake.add(k); console.warn(P.key + ' has no take ' + name + ' (a film asked for it; it has: ' + Object.keys(P.acts).join(', ') + ')'); }
    function pose(P, name, t, loop = false, name2 = null, k2 = 0, t2 = 0) {
      if (!P || !P.ready) return;
      if (!P.acts[name]) { noTake(P, name); return; }
      if (name2 && !P.acts[name2]) noTake(P, name2);
      for (const k in P.acts) { const w = k === name ? 1 - (name2 ? k2 : 0) : (k === name2 ? k2 : 0); P.w[k] = w; P.acts[k].setEffectiveWeight(w); }
      const A = P.acts[name], d = A.getClip().duration; A.time = loop ? ((t % d) + d) % d : Math.max(0, Math.min(d - 1e-3, t));
      if (name2 && P.acts[name2]) { const A2 = P.acts[name2], d2 = A2.getClip().duration; A2.time = Math.max(0, Math.min(d2 - 1e-3, t2)); }
      P.cur = name; P.filmT = t; armsBack(P); personSettle(P); P.mixer.update(0);
      if (P.hd) headDampLay(P);
      if (P.restLegs) seatLegsLay(P);
      if (P.restHands && !(P.layK > 0)) restHandsLay(P);
      if (!P.htLate) handsTrue(P);
    }
    function put(P, x, z, ry, y = 0) { if (!P) return; P.group.position.set(x, y, z); if (ry != null) P.group.rotation.y = ry; }
    const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);                 // the turn that faces a +z-facing body at a point
    /* every frame of play: weights eased on the wall clock, takes run, bodies settled */
    function peopleTick(wdt, live) {
      for (const P of people) {
        if (!P.ready || (!P.group.visible && !P.driver) || (P.driver && P.idle)) continue;
        if (P.filmT != null && !live) continue;                                  // a film holds its people where it posed them
        if (P.filmT != null) { P.filmT = null; }
        let moved = false;
        for (const k in P.acts) { const to = k === P.cur ? 1 : 0, w = P.w[k];
          if (w !== to) { const st = P.fade > 0 ? wdt / P.fade : 1; P.w[k] = to > w ? Math.min(to, w + st) : Math.max(to, w - st); P.acts[k].setEffectiveWeight(P.w[k]); moved = true; } }
        if (moved) personSettle(P);
        P.clock += wdt * P.rate; windowTime(P);
        if (P.span) spanTick(P, wdt);
        if (P.rise) personSettle(P);
        armsBack(P);
        P.mixer.update(wdt * P.rate);
        if (P.hd) headDampLay(P);
        if (P.gaze || P.gazeK > 0) gazeTick(P, wdt);
        if (P.lay || P.layK > 0) layTick(P, wdt);
        if (P.restLegs) seatLegsLay(P);
        if (P.restHands && !(P.layK > 0)) restHandsLay(P);
        if (!P.htLate) handsTrue(P);
      }
    }
    /* A TAKE PLAYED ONCE between two of its own moments, over `secs` seconds, eased at both ends (t1 may be before t0:
       a rise played backwards is a sitting down), then HELD on a small window at its end (o.hold: seconds of the take,
       back and forth from where it stopped; negative runs back; o.holdSecs: how long that takes there and back, where
       the hold is a stillness and not a beat) or handed on (o.then). A rise from a seat, a throw, a
       bow. Its window and its end are the person's own state, so reset() need only name a take again. */
    function span(P, name, t0, t1, secs, o = {}) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return; }
        if (P.win && P.win[name]) delete P.win[name];
        P.span = { name, t0, t1, secs: Math.max(0.05, secs), u: 0, hold: o.hold != null ? o.hold : 0, holdSecs: o.holdSecs > 0 ? o.holdSecs : 0, then: o.then || null, n: ++P.actN };
        take(P, name, o.fade != null ? o.fade : 0.4); P.acts[name].time = t0; P.acts[name].timeScale = 0; });
    }
    function spanTick(P, wdt) {
      const Sp = P.span, A = P.acts[Sp.name]; if (!A) { P.span = null; return; }
      Sp.u = Math.min(1, Sp.u + wdt / Sp.secs);                                 // (wall seconds, whatever the person's own rate: a bow is in time with the ground)
      const d = A.getClip().duration; A.time = Math.max(0, Math.min(d - 1e-3, Sp.t0 + (Sp.t1 - Sp.t0) * smo(Sp.u))); A.timeScale = 0;
      if (Sp.u < 1) return;
      P.span = null;
      if (Sp.hold) { (P.win = P.win || {})[Sp.name] = Sp.holdSecs > 0 ? [Sp.t1, Sp.hold, Sp.holdSecs] : [Sp.t1, Sp.hold]; P.clock = 0; }
      if (Sp.then) Sp.then(P);
    }
    /* a take with a window of its own from now on (a pose held: both hands laid forward), or with none (it runs whole);
       `secs`, where said, is how long the window takes there and back (windowTime) */
    function hold(P, name, from, len, fade = 0.5, secs = 0) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) return; P.span = null; ++P.actN;
        if (len == null) { if (P.win) delete P.win[name]; } else { (P.win = P.win || {})[name] = secs > 0 ? [from, len, secs] : [from, len]; P.clock = 0; }
        take(P, name, fade); if (len == null) P.acts[name].timeScale = 1; });
    }
    /* back to the take a person was built in, and its window */
    function rest(P, fade = 0.6) {
      if (!P) return;
      whenReady(P, () => { P.span = null; ++P.actN; const R = P.rest;
        if (R.win && R.win[R.take]) { (P.win = P.win || {})[R.take] = R.win[R.take]; P.clock = 0; }
        take(P, R.take, fade); });
    }
    /* a person who speaks plays his talking take from the line's own start, and goes back to rest after it (v11.4);
       whatever he is given to do meanwhile wins (the act's number has moved on) */
    function talk(P, secs, name) {
      if (!P) return;
      whenReady(P, () => { const tk = name || P.talkTake; if (!tk || !P.acts[tk]) return;
        if (P.win && P.win[tk]) delete P.win[tk];
        P.span = null; const n = ++P.actN; take(P, tk, 0.35); P.acts[tk].timeScale = 1;
        after(Math.max(0.4, secs - 0.15), () => { if (P.actN === n) rest(P, 0.5); }); });
    }
    /* A LOOK (v6.9): the head eased onto a point (or the lens) within a neck's reach, laid on after the mixer has
       written the take and so never stacked (the take writes the head again before the next look is laid). The face's
       own direction is the head's turn since its bind (headRest), not the bone's axes. */
    const _lkq = new THREE.Quaternion(), _lkq2 = new THREE.Quaternion(), _lkq3 = new THREE.Quaternion(), _lkv = new THREE.Vector3(), _lkv2 = new THREE.Vector3(), _lkz = new THREE.Vector3();
    function gaze(P, target, o = {}) { if (!P) return; P.gaze = target ? { target, reach: o.reach != null ? o.reach : 0.75, secs: o.secs || 0.9, down: o.down != null ? o.down : 0.03 } : null; if (!target) P.gazeOut = o.secs || 0.9; }
    function gazeTick(P, wdt) {
      const G = P.gaze, secs = G ? G.secs : (P.gazeOut || 0.9);
      P.gazeK = G ? Math.min(1, P.gazeK + wdt / secs) : Math.max(0, P.gazeK - wdt / secs);
      const L = G || P.gazeLast; if (G) P.gazeLast = G;
      if (!L || !(P.gazeK > 0) || !P.head || !P.headRest) return;
      const tg = L.target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(L.target[0], L.target[1], L.target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      /* the face's direction now, in the world: the head's turn since its bind, applied to +z */
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      _lkv2.sub(_lkv); _lkv2.y -= L.down * _lkv2.length(); _lkv2.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(_lkv2)))); if (ang < 1e-3) return;
      const k = smo(P.gazeK) * Math.min(1, L.reach / ang);
      _lkq3.setFromUnitVectors(_lkz, _lkv2); _lkq2.identity().slerp(_lkq3, k);        // the turn, in the world
      /* onto the head bone: world' = turn * world, so local' = parentWorld^-1 * turn * world */
      const par = P.head.parent; par.getWorldQuaternion(_lkq3);
      P.head.quaternion.copy(_lkq3.invert().multiply(_lkq2).multiply(_lkq));
    }
    /* a film's look: the head turned onto a point (or the lens) by k, now, with no clock of its own (after pose()) */
    function lookNow(P, target, k = 1, reach = 0.75, down = 0.03) {
      if (!P || !P.ready || !P.head || !P.headRest || !(k > 0)) return;
      const tg = target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(target[0], target[1], target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      tg.sub(_lkv); tg.y -= down * tg.length(); tg.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(tg)))); if (ang < 1e-3) return;
      _lkq3.setFromUnitVectors(_lkz, tg); _lkq2.identity().slerp(_lkq3, smo(c01(k)) * Math.min(1, reach / ang));
      P.head.parent.getWorldQuaternion(_lkq3);
      P.head.quaternion.copy(_lkq3.invert().multiply(_lkq2).multiply(_lkq));
    }
    /* HANDS LAID ON A THING (photograph 5: the kneeling man raises his bai sri in both hands and the seated master "has
       both his hands on it too": that is the empowerment, Chad's §0). A take holds a body's hands where that body's own
       motion puts them, and no two takes of two bodies put four hands on one bowl. So the BOWL is the truth and the
       hands go to it: each arm solved as two bones onto its wrist's place, the elbow down and out (v24.21's solver,
       below), and the hand turned so its palm lies on the thing with its fingers along it. Laid on after the take has
       posed the body, and UNDONE before the mixer runs again (the v11.5 law: the mixer writes a bone only when its
       take's value changes, so a turn left in a bone would be turned again from itself).
       A hand's own axes are MEASURED on the body, once (v25.3: "each hand's own surface and thumb side"), from its
       bind pose: armsOf. */
//@@COPY 2236-2257 :: const _ia = new THREE.Vector3(), _ib = new THREE.Vector3(), _ic = new THREE.Vector3(), _it = new THREE.Vector3(), _ie = new THREE.Vector3(),
    const ARMS = { L: ['LeftArm', 'LeftForeArm', 'LeftHand'], R: ['RightArm', 'RightForeArm', 'RightHand'] };
    const _hb = new THREE.Vector3(), _hf = new THREE.Vector3(), _hn = new THREE.Vector3(), _ha = new THREE.Vector3(), _hW = new THREE.Vector3(), _hP = new THREE.Vector3(),
          _hL = new THREE.Vector3(), _hm = new THREE.Matrix4(), _hm2 = new THREE.Matrix4(), _hq = new THREE.Quaternion(), _hq2 = new THREE.Quaternion();
    function armsOf(P) {
      if (P.arms !== undefined) return P.arms;
      P.arms = null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const skins = P.lv[1]; if (!skins || !skins.length) return null;
      /* (a bone's place and turn in the bind pose, from whichever skin is bound to it) */
      const bindOf = (b) => { if (!b) return null; for (const sm of skins) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; };
      const at = (b) => { const m = bindOf(b); return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
      const out = {}, v = new THREE.Vector3();
      for (const sd of ['L', 'R']) {
        const S0 = sd === 'L' ? 'Left' : 'Right', side = sd === 'L' ? 1 : -1;
        const up = bone(S0 + 'Arm'), fore = bone(S0 + 'ForeArm'), hand = bone(S0 + 'Hand'); if (!up || !fore || !hand) return null;
        const mh = bindOf(hand), ph = at(hand), pf = at(fore); if (!mh || !ph || !pf) return null;
        let f, nrm, palm;
        const pMid = at(bone(S0 + 'HandMiddle1')), pOut = at(bone(S0 + 'HandPinky1')) || at(bone(S0 + 'HandRing1')), pIn = at(bone(S0 + 'HandIndex1')) || pMid;
        if (pMid && pOut && pIn) {
          /* A RIG WITH FINGERS: the fingers' line runs from the wrist to the middle finger's root; across the palm runs
             from the little finger's root to the first finger's; the palm faces their cross (a left hand held out flat,
             fingers along +x and thumb to +z, faces down: +x cross +z; a right hand is its mirror) */
          f = pMid.clone().sub(ph); palm = 0.55 * f.length(); f.normalize();
          const ac = pIn.clone().sub(pOut); ac.addScaledVector(f, -ac.dot(f)).normalize();
          nrm = new THREE.Vector3().crossVectors(f, ac).multiplyScalar(side).normalize();
        } else {
          /* A RIG WITH NONE: the forearm's line carried on; the palm's normal is the thin axis of the skin the hand bone
             carries, about that line, signed to face down and in (as an A pose or a T pose holds a palm) */
          f = ph.clone().sub(pf).normalize();
          const u = new THREE.Vector3(0, 1, 0); if (Math.abs(f.y) > 0.9) u.set(0, 0, 1); u.addScaledVector(f, -u.dot(f)).normalize(); const w = new THREE.Vector3().crossVectors(f, u);
          let n = 0, su = 0, sw = 0, suu = 0, sww = 0, suw = 0, len = 0;
          for (const sm of skins) { const hi = sm.skeleton.bones.indexOf(hand), g = sm.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sk = g.attributes.skinWeight; if (hi < 0 || !si || !sk) continue;
            for (let i = 0; i < pos.count; i++) { let wt = 0; for (let j = 0; j < 4; j++) if (si.getComponent(i, j) === hi) wt += sk.getComponent(i, j);
              if (wt < 0.6) continue;
              v.fromBufferAttribute(pos, i).applyMatrix4(sm.bindMatrix).sub(ph); const a = v.dot(u), b = v.dot(w); len = Math.max(len, v.dot(f));
              n++; su += a; sw += b; suu += a * a; sww += b * b; suw += a * b; } }
          if (n < 12) { console.warn(P.key + ': the ' + sd + ' hand has no fingers and no skin of its own to measure'); return null; }
          const cuu = suu / n - (su / n) * (su / n), cww = sww / n - (sw / n) * (sw / n), cuw = suw / n - (su / n) * (sw / n), th = 0.5 * Math.atan2(2 * cuw, cuu - cww) + Math.PI / 2;
          nrm = u.clone().multiplyScalar(Math.cos(th)).addScaledVector(w, Math.sin(th)).normalize();
          const ref = nrm.x * -side - nrm.y;                                     // (down and in: the left hand is at +x of a body that faces +z)
          if (Math.abs(ref) < 0.2) console.warn(P.key + ': the ' + sd + ' palm faces neither down nor in at rest (' + ref.toFixed(2) + '): its side is a guess');
          if (ref < 0) nrm.negate();
          palm = 0.3 * Math.max(0.12, Math.min(0.24, len));
        }
        const ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(mh)).invert();
        const fL = f.clone().applyQuaternion(ri), nL = nrm.clone().applyQuaternion(ri), aL = new THREE.Vector3().crossVectors(nL, fL);
        out[sd] = { up, fore, hand, fL, nL, aL, palm, side, fingers: !!(pMid && pOut && pIn), wrote: false, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qHand: new THREE.Quaternion() };
      }
      P.arms = out; return out;
    }
    /* (before a body's mixer runs: what was laid on its arms is taken off) */
    function armsBack(P) { const HT0 = P.ht; if (HT0 && HT0.on) { for (const R of HT0.W) if (R.on) { R.fore.quaternion.copy(R.sf); R.hand.quaternion.copy(R.sh); R.on = false; }
        for (const R of HT0.J) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; }
        for (const R of HT0.K) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; } HT0.on = false; }
      const LG = P.restLegs; if (LG && LG.wrote) { for (const sd in LG.R) { const r = LG.R[sd]; r.up.quaternion.copy(r.qUp); r.fore.quaternion.copy(r.qFore); r.foot.quaternion.copy(r.qFoot);
        if (r.gUp) r.gUp.quaternion.copy(r.qGUp); if (r.gLow) r.gLow.quaternion.copy(r.qGLow); } LG.wrote = false; }
      const A = P.arms; if (!A) return; for (const sd in A) { const a = A[sd];
      if (a.curled) { for (const F of a.fing) F.b.quaternion.copy(F.q); if (a.fingRest) { for (const F of a.fingRest) F.b.quaternion.copy(F.q); a.fingRest = null; } a.curled = false; }
      if (!a.wrote) continue; a.up.quaternion.copy(a.qUp); a.fore.quaternion.copy(a.qFore); a.hand.quaternion.copy(a.qHand); a.wrote = false; } }
    /* A HAND CLOSED ROUND A THING (the woman with the taper): each finger's three joints turned by `th` radians toward
       the palm's own facing, about the hand's own measured across-axis as it lies in the world now. Laid on after
       handTo() and taken off by armsBack() before the mixer runs again, as every laid pose is (v11.5). A rig with no
       finger bones is left as it is. */
    function curlFingers(P, sd, th) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a) return;
      if (!a.fing) { a.fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'Hand' + f + i] || P.bone['mixamorig:' + S0 + 'Hand' + f + i]; if (b) a.fing.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.fing.length) return;
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.curled = true; }
      a.hand.getWorldQuaternion(_hq); _hf.copy(a.fL).applyQuaternion(_hq); _hn.copy(a.nL).applyQuaternion(_hq); _ha.crossVectors(_hf, _hn).normalize();
      for (const F of a.fing) { _hq.setFromAxisAngle(_ha, th * (F.i === 3 ? 0.7 : 1)); F.b.parent.getWorldQuaternion(_hq2);
        /* world' = turn * world, so local' = parentWorld^-1 * turn * parentWorld * local */
        F.b.quaternion.premultiply(_hq2).premultiply(_hq).premultiply(_hq2.invert()); }
    }
    /* ONE HAND onto a thing, by k: its palm's middle at `at` (a point of the thing's surface), its fingers along `f`,
       its palm facing `n` (into the thing). o: { back: how far behind the palm's middle the wrist is, in metres (the
       hand's own measure unless said); off: how far the wrist stands off the surface; out, down: the elbow's side,
       from the shoulder } */
    function handTo(P, sd, at, f, n, k = 1, o = {}) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !(k > 0)) return false;
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      P.group.updateWorldMatrix(true, true);
      const ks = smo(c01(k));
      _hf.set(f[0], f[1], f[2]).normalize(); _hn.set(n[0], n[1], n[2]); _hn.addScaledVector(_hf, -_hn.dot(_hf)).normalize();
      _hW.set(at[0], at[1], at[2]).addScaledVector(_hf, -(o.back != null ? o.back : a.palm)).addScaledVector(_hn, -(o.off != null ? o.off : 0.022));
      a.hand.getWorldPosition(_hb); _hW.set(lp(_hb.x, _hW.x, ks), lp(_hb.y, _hW.y, ks), lp(_hb.z, _hW.z, ks));
      a.up.getWorldPosition(_hP); P.group.getWorldQuaternion(_hq); _hL.set(1, 0, 0).applyQuaternion(_hq);
      _hP.addScaledVector(_hL, a.side * (o.out != null ? o.out : 0.3)); _hP.y -= (o.down != null ? o.down : 0.32);
      /* (o.aft: the elbow drawn behind the body too, for a hand held at the hip: the woman with the taper. Absent, nothing moves) */
      if (o.aft) { _hL.set(0, 0, 1).applyQuaternion(_hq); _hP.addScaledVector(_hL, -o.aft); }
      armTo(a, _hW, _hP);
      _ha.crossVectors(_hn, _hf); _hm.makeBasis(_ha, _hn, _hf); _hm2.makeBasis(a.aL, a.nL, a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
      a.hand.parent.getWorldQuaternion(_hq2); _hq.premultiply(_hq2.invert());
      if (ks < 0.999) a.hand.quaternion.slerp(_hq, ks); else a.hand.quaternion.copy(_hq);
      a.hand.updateWorldMatrix(false, true);
      return true;
    }
    /* both hands, from a grip (baiGrip below) */
    function handsTo(P, grip, k = 1) { if (!grip) return; for (const sd of ['L', 'R']) if (grip[sd]) handTo(P, sd, grip[sd].at, grip[sd].f, grip[sd].n, k, grip[sd]); }
    /* WHERE TWO HANDS LIE ON A BAI SRI that stands at `c` (the middle of its foot, in the world) drawn at size s, for a
       body at `from` (so "forward" is from the body to the bowl). ON it (a master's: the palms down and in on the tiers
       of marigold above the bowl's rim, the fingers forward and a little down) or UNDER it (the one who offers it: the
       palms up and in under the bowl's swell, the fingers forward and up). The bowl's measures are the model's own
       (tools/probes/bands.mjs: the foot 0.09 m wide, the swell 0.13 at 0.15 m, the rim 0.19 at 0.21, tiers above) */
    function baiGrip(c, s, from, how = 'on') {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]]) {
        if (how === 'on') { const r = 0.128 * s, y = 0.285 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.035, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.035],
                      f: [F[0] * 0.9 - Lf[0] * sg * 0.32, -0.3, F[1] * 0.9 - Lf[1] * sg * 0.32], n: [-Lf[0] * sg * 0.62, -0.78, -Lf[1] * sg * 0.62], out: 0.3, down: 0.3 }; }
        else { const r = 0.112 * s, y = 0.105 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.03, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.03],
                      f: [F[0] * 0.85 - Lf[0] * sg * 0.22, 0.48, F[1] * 0.85 - Lf[1] * sg * 0.22], n: [-Lf[0] * sg * 0.8, 0.55, -Lf[1] * sg * 0.8], out: 0.22, down: 0.4 }; }
      }
      return out;
    }
    /* WHERE TWO HANDS CARRY A TRAY that stands at `c` (the middle of its foot, in the world), its foot r in radius, for a
       body at `from`: the palms up under its foot at either side, the fingers forward and a little in */
    function trayGrip(c, r, from) {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]])
        out[sd] = { at: [c[0] + Lf[0] * sg * r * 0.84 - F[0] * 0.03, c[1] - 0.004, c[2] + Lf[1] * sg * r * 0.84 - F[1] * 0.03],
                    f: [F[0] * 0.92 - Lf[0] * sg * 0.3, 0.1, F[1] * 0.92 - Lf[1] * sg * 0.3], n: [-Lf[0] * sg * 0.25, 0.95, -Lf[1] * sg * 0.25], out: 0.2, down: 0.42 };
      return out;
    }
    /* in play: a body's hands eased onto a grip and off it again (a grip may be a function, answering where the thing
       is now); in a film handsTo() is called by the film's own clock */
    function lay(P, grip, o = {}) { if (!P) return; if (grip) { P.lay = { grip, secs: o.secs || 0.8 }; P.layLast = P.lay; } else { P.lay = null; P.layOut = o.secs || 0.8; } }
    function layTick(P, wdt) {
      const G = P.lay, secs = G ? G.secs : (P.layOut || 0.8);
      P.layK = G ? Math.min(1, (P.layK || 0) + wdt / secs) : Math.max(0, (P.layK || 0) - wdt / secs);
      const L = G || P.layLast; if (!L || !(P.layK > 0)) return;
      handsTo(P, typeof L.grip === 'function' ? L.grip() : L.grip, P.layK);
    }
    /* HIS HANDS AT REST (o.handsOn; Chad, 12 Nov 2026, of the three monks as they first went live: "Look at the arms
       and hands of those monks, its completely unacceptable, how did that pass your review?"). MINE, both times: a
       seated take lays a body's hands where the body it was made on had its thighs, and on these robed bodies they went
       into the cloth; my first fix sent each palm flat onto the lap whatever the arm had to do (the wrists broke back,
       the elbows flared, the fingers stood stiff: claws), and my second moved the take's own arm as little as it could
       (the take's fingers closed into fists on the robe; Chad's monk's hands hung in the air before his knees). Both
       went past me in small pictures; and my third, the first laid as below, sent both elbows back and IN, inside his
       flank, the forearms out through the roll of his robe at the waist (an elbow bent toward a point behind the wrist,
       and by the shortest arc), seen only when the pictures were opened full size. So a rest is now DESIGNED as a body
       rests, and every one is photographed full size, high res, from before him, from each side and close on each
       hand, before it is built on (tracker §15.5).
       how 'lap': THE PALMS ON THE THIGHS, THE ELBOWS AT HIS SIDES. Each palm's middle on what is drawn of his lap (his
         body without his arms, read as heights up to 30 cm over his hip joints: `top`), wherever along the thigh leaves
         the reach from shoulder to wrist `ratio` of the arm's length (0.87, an elbow bent as an arm at rest bends it),
         the thigh's middle preferred where it cannot be had (or at `at`, if given); `out` to its outer side. The elbow
         behind the line from shoulder to wrist and below it, turned out from his side a step at a time until the upper
         arm and the forearm, each swept at its own thickness, clear what is drawn of him; the arm solved about its own
         elbow's hinge, read off his take (armHinge). The fingers carried on along the forearm's own line seen from
         above, a quarter of the way toward the thigh's, following the cloth's slope, the palm facing the cloth; the
         wrist `off` above it. Fingers with bones are his file's own at rest (the bind pose: a relaxed open hand), each
         joint curled by `curl` toward the palm, the little finger most. Measured once, on the take he rests in at its
         window's start, and reported (P.restRep: where, the reach, how far turned out, the wrist's bend).
       A HAND OF ONE PIECE (Chad's monk: no finger bones; each hand is his scan's, open, the fingers spread and a little
         cupped: tools/probes/handaxes.mjs, and photographed) is laid the same way by its own measured axes (handAxes).
         Palms joined before his chest were tried first, episode 3's solve and then one of mine, and refused by
         photograph: open spread fingers cannot press flat, and from in front the two hands showed as two open palms
         side by side.
       Laid every frame after the mixer has posed him, and taken off before it runs again (armsBack: the v11.5 law) */
    const _rhA = new THREE.Vector3(), _rhB = new THREE.Vector3(), _rhC = new THREE.Vector3(), _rhD = new THREE.Vector3(), _rhQ = new THREE.Quaternion(), _rhQ2 = new THREE.Quaternion();
    const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'];
    /* (a bone's turn in its parent in the bind pose, from the skin's own inverse binds) */
    function bindLocal(P, b) {
      for (const sm of P.lv[1] || []) { const sk = sm.skeleton, i = sk.bones.indexOf(b), ip = b.parent ? sk.bones.indexOf(b.parent) : -1; if (i < 0 || ip < 0) continue;
        const m = new THREE.Matrix4().copy(sk.boneInverses[ip]).multiply(new THREE.Matrix4().copy(sk.boneInverses[i]).invert());     // (the parent's bind inverted, times this bone's bind)
        const q = new THREE.Quaternion(); m.decompose(new THREE.Vector3(), q, new THREE.Vector3()); return q; }
      return null;
    }
    /* A MAN SITTING ON A CHAIR AS PHOTOGRAPH 2'S MONKS SIT (o.seat.down: { y, sink, edge, r, apron, sole }): his bottom
       on the seat, his feet flat on the ground below his knees, whatever take he sits in. Chad's monk's chair-sits
       perch, made for a seat some 8 cm higher than this chair's (his hip joints 17 cm over his knees, his thighs sloping
       thirty-three degrees: sitread.mjs), so set down by his soles his bottom hung over the seat, and set on the seat his
       feet went under the ground. So his bottom is set on the seat (the second hundredth of the skin his hips and
       thighs carry, `sink` into it), and each LEG is solved as two bones (armTo, the arms' own solver) from his hip
       joint to where the take puts that ankle, on the ground (its sole `sole` from it), the knee forward; each foot
       keeps the turn the take gives it in the world. Then he is brought forward until his shins, between the seat's
       top and the foot of its apron, stand `r` past its front face (`edge` ahead of his spot), feet and all. Laid every
       frame after the mixer has posed him and taken off before it runs again (armsBack), as a hand's grip is */
    function seatDown(P, name, SE, skins) {
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const v = new THREE.Vector3(), loc = (b) => { b.getWorldPosition(v); return P.group.worldToLocal(v.clone()); };
      const under = [], feet = { Left: [], Right: [] };
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const role = q.skeleton.bones.map(b => /^(mixamorig:?)?(Hips|(Left|Right)UpLeg)$/.test(b.name) ? 'U' : /^(mixamorig:?)?Left(Foot|Toe\w*)$/.test(b.name) ? 'Left' : /^(mixamorig:?)?Right(Foot|Toe\w*)$/.test(b.name) ? 'Right' : '');
        for (let i = 0; i < pos.count; i++) { const w = { U: 0, Left: 0, Right: 0 }; for (let c = 0; c < 4; c++) { const r = role[si.getComponent(i, c)]; if (r) w[r] += sw.getComponent(i, c); }
          if (w.U < 0.5 && w.Left < 0.5 && w.Right < 0.5) continue; q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          if (w.U >= 0.5) under.push([v.y, v.z, v.x]); else feet[w.Left >= 0.5 ? 'Left' : 'Right'].push([v.x, v.y, v.z]); } }
      const H = loc(P.hips), K = SE.down, legs = { R: {}, wrote: false, keepKnee: K.knees === 'keep', tuck: K.tuck !== false };
      /* (his bottom: `hipOver` under his hip joints. Read from his skin it cannot be: his scan is his robe, and what
         hangs lowest under his hips in a seated take is the robe's skirt, 24 to 31 cm down (measured twice, and lifted
         off the chair both times: photographed). A seated man's hip joints stand some 12 to 15 cm over the seat
         (measured on the two new monks in the library's chair-sit: 15, in thick robes) */
      const bottom = H.y - (K.hipOver != null ? K.hipOver : 0.13), drop = bottom - (SE.y - (K.sink != null ? K.sink : 0.01));
      for (const S0 of ['Left', 'Right']) { const up = bone(S0 + 'UpLeg'), fore = bone(S0 + 'Leg'), foot = bone(S0 + 'Foot'); if (!up || !fore || !foot || !feet[S0].length) { console.warn(P.key + ': no ' + S0 + ' leg to seat'); return null; }
        const A0 = loc(foot), K0 = loc(fore);
        let sole = Infinity; for (const q of feet[S0]) if (q[1] < sole) sole = q[1];
        let footQ = P.group.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(foot.getWorldQuaternion(new THREE.Quaternion()));
        /* A FOOT LAID FLAT (K.flat: v26.2 debug, the masters' feet on the ground). A chair-sit made for a higher seat
           holds the foot toe down; set on the ground as the take has it, the foot stood on its toes. So the foot is turned
           about its own breadth until the lowest of its heel and the lowest of its toes are level (the sole flat on the
           ground), the turn taken at the ankle, and the ankle set by the sole so turned */
        if (K.flat) { const toe = bone(S0 + 'ToeBase'), T0 = toe ? loc(toe) : null;
          if (T0) { const fd = new THREE.Vector3(T0.x - A0.x, 0, T0.z - A0.z); if (fd.lengthSq() > 1e-6) { fd.normalize();
            let s0 = Infinity, s1 = -Infinity; for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z; if (u < s0) s0 = u; if (u > s1) s1 = u; }
            const span = s1 - s0, heel = [0, Infinity], toes = [0, Infinity];
            for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z;
              if (u < s0 + 0.3 * span && q[1] < heel[1]) { heel[0] = u; heel[1] = q[1]; } if (u > s1 - 0.3 * span && q[1] < toes[1]) { toes[0] = u; toes[1] = q[1]; } }
            if (span > 0.08 && heel[1] < Infinity && toes[1] < Infinity && toes[0] - heel[0] > 0.05) {
              const d3 = new THREE.Vector3().copy(fd).multiplyScalar(toes[0] - heel[0]); d3.y = toes[1] - heel[1]; d3.normalize();
              const qF = new THREE.Quaternion().setFromUnitVectors(d3, fd); footQ = qF.clone().multiply(footQ);
              sole = Infinity; const pv = new THREE.Vector3();
              for (const q of feet[S0]) { pv.set(q[0] - A0.x, q[1] - A0.y, q[2] - A0.z).applyQuaternion(qF); if (pv.y + A0.y < sole) sole = pv.y + A0.y; }
              (legs.flat = legs.flat || {})[S0] = +(Math.atan2(d3.y, Math.hypot(d3.x, d3.z)) * 180 / Math.PI).toFixed(1); } } } }
        /* (the ankle where the take has it across the ground, its sole on it; the knee's pole well ahead of the take's knee) */
        legs.R[S0] = { up, fore, foot, ank: new THREE.Vector3(A0.x, A0.y - sole + (K.sole != null ? K.sole : -0.005), A0.z), pole: new THREE.Vector3(K0.x * 1.15, K0.y + 0.1, K0.z + 0.6),
          footQ, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qFoot: new THREE.Quaternion(),
          /* (a body whose legs are a graft on bones of their own beside its own legs: Grandmaster Pho's, leggraft.mjs,
             thigh and shin hung from his hips. They are turned as his own legs are turned, or his shins would stay
             where the take has them while his feet went where the seat lays them) */
          gUp: bone(S0 + 'LegGraftUp'), gLow: bone(S0 + 'LegGraftLow'), qGUp: new THREE.Quaternion(), qGLow: new THREE.Quaternion() }; }
      /* lowered by `drop`: the targets in the group's frame are where the ground is, so they do not move with him */
      P.restLegs = legs; P.model.position.set(0, -drop, 0); P.group.updateMatrixWorld(true); seatLegsLay(P);
      /* forward until the shins clear the seat's front face */
      let back = Infinity; const apron = K.apron != null ? K.apron : 0.14;
      for (const S0 in legs.R) { const r = legs.R[S0], Kn = loc(r.fore), An = loc(r.foot);
        for (const h of [SE.y, SE.y - apron]) { const t = Kn.y > An.y ? Math.max(0, Math.min(1, (Kn.y - h) / (Kn.y - An.y))) : 0; back = Math.min(back, Kn.z + t * (An.z - Kn.z) - H.z); } }
      const fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
      /* (measured with his model at the group's origin; played, it stands where `centre` puts his hips, `off`, and
         `fwd` further forward: the feet go with him) */
      const off = P.off[name] || [0, 0];
      for (const S0 in legs.R) { const r = legs.R[S0]; r.ank.x -= off[0]; r.ank.z += fwd - off[1]; r.pole.x -= off[0]; r.pole.z += fwd - off[1]; }
      armsBack(P); P.model.position.set(0, 0, 0); P.group.updateMatrixWorld(true);
      return { legs, lift: -drop, fwd, rep: { bottom: +bottom.toFixed(3), drop: +drop.toFixed(3), fwd: +fwd.toFixed(3), shins: +back.toFixed(3), flat: legs.flat || null } };
    }
    const _slA = new THREE.Vector3(), _slB = new THREE.Vector3(), _slQ = new THREE.Quaternion();
    const _slQ1 = new THREE.Quaternion(), _slQ2 = new THREE.Quaternion(), _slQ3 = new THREE.Quaternion(), _slQ4 = new THREE.Quaternion(), _slQd = new THREE.Quaternion(), _slQp = new THREE.Quaternion();
    /* (how far he wears a take that SITS, by the takes' weights: a seated man's legs are laid only while he sits. In the
       late afternoon's photograph the masters stand in Idle_3, and laid there their feet were pinned to where they
       sit: v26.2 debug. A fade between a seat and a stand lays them that share of the way) */
    const _slT = new THREE.Quaternion();
    function seatShare(P) { const so = P.o.seat; if (!so || !so.takes) return 1 - (P.riseK || 0); let k = 0; for (const n in P.w) if (so.takes.test(n)) k += P.w[n]; return Math.min(1, k) * (1 - (P.riseK || 0)); }
    /* THE SHIN SWUNG, THE KNEE KEPT (o.seat.down.knees 'keep': Grandmaster Pho). His robe below the waist is cloth baked
       round each take's own thighs (robesim, robeshell: v24.47), so legs laid from the hip (armTo) lifted his knees
       through it: skin through the white, photographed (v26.2 debug). So his thigh stays as the take has it and only the
       shin turns about the knee, the ankle brought to the height the seat lays it at, kept to the take's own reach
       aside, the rest of its reach forward or (`tuck`) back under the seat: a man sitting with his feet drawn in */
    const _skK = new THREE.Vector3(), _skA = new THREE.Vector3(), _skF = new THREE.Vector3(), _skL = new THREE.Vector3(), _skN = new THREE.Vector3(), _skQ = new THREE.Quaternion(), _skP = new THREE.Quaternion();
    function shinTo(r, yT, tuck) {
      r.fore.getWorldPosition(_skK); r.foot.getWorldPosition(_skA);
      const L = _skK.distanceTo(_skA); if (!(L > 1e-4)) return;
      const dy = Math.max(-L + 1e-4, Math.min(L - 1e-4, yT - _skK.y));
      _skF.set(0, 0, 1).applyQuaternion(_slQ); _skF.y = 0; _skF.normalize();            // (the body's front, flat)
      const ax = _skA.x - _skK.x, az = _skA.z - _skK.z, along = ax * _skF.x + az * _skF.z;
      _skL.set(ax - along * _skF.x, 0, az - along * _skF.z);                            // (the take's reach aside, kept)
      const room = L * L - dy * dy - _skL.lengthSq(), c = room > 0 ? Math.sqrt(room) * (tuck ? -1 : Math.sign(along) || 1) : 0;
      _skN.set(_skK.x + _skL.x + _skF.x * c, _skK.y + dy, _skK.z + _skL.z + _skF.z * c);
      _skA.sub(_skK).normalize(); _skN.sub(_skK).normalize();
      _skQ.setFromUnitVectors(_skA, _skN); r.fore.getWorldQuaternion(_skP); _skQ.multiply(_skP);
      r.fore.parent.getWorldQuaternion(_skP); r.fore.quaternion.copy(_skP.invert().multiply(_skQ)); r.fore.updateWorldMatrix(false, true);
    }
    function seatLegsLay(P) {
      const LG = P.restLegs; if (!LG) return;
      const share = seatShare(P); if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_slQ);
      for (const S0 in LG.R) { const r = LG.R[S0];
        if (!LG.wrote) { r.qUp.copy(r.up.quaternion); r.qFore.copy(r.fore.quaternion); r.qFoot.copy(r.foot.quaternion);
          if (r.gUp) r.qGUp.copy(r.gUp.quaternion); if (r.gLow) r.qGLow.copy(r.gLow.quaternion); }
        if (r.gUp) { r.up.getWorldQuaternion(_slQ1); r.fore.getWorldQuaternion(_slQ2); r.gUp.getWorldQuaternion(_slQ3); if (r.gLow) r.gLow.getWorldQuaternion(_slQ4); }
        _slA.copy(r.ank); P.group.localToWorld(_slA); _slB.copy(r.pole); P.group.localToWorld(_slB);
        if (LG.keepKnee) shinTo(r, _slA.y, LG.tuck); else armTo({ up: r.up, fore: r.fore, hand: r.foot }, _slA, _slB);
        r.foot.parent.getWorldQuaternion(_hq2); _hq.copy(_slQ).multiply(r.footQ); r.foot.quaternion.copy(_hq2.invert().multiply(_hq)); r.foot.updateWorldMatrix(false, true);
        /* (a graft's thigh turned in the world as his own thigh was, and its shin as his own shin: D = after x before^-1) */
        if (r.gUp) { r.up.getWorldQuaternion(_slQd).multiply(_slQ1.invert()); _slQ3.premultiply(_slQd);
          r.gUp.parent.getWorldQuaternion(_slQp); r.gUp.quaternion.copy(_slQp.invert().multiply(_slQ3)); r.gUp.updateWorldMatrix(false, true);
          if (r.gLow) { r.fore.getWorldQuaternion(_slQd).multiply(_slQ2.invert()); _slQ4.premultiply(_slQd);
            r.gLow.parent.getWorldQuaternion(_slQp); r.gLow.quaternion.copy(_slQp.invert().multiply(_slQ4)); r.gLow.updateWorldMatrix(false, true); } }
        /* (part of the way, while he goes from sitting to standing or back: each turn eased from the take's own) */
        if (share < 0.999) { for (const [b, q0] of [[r.up, r.qUp], [r.fore, r.qFore], [r.foot, r.qFoot], [r.gUp, r.qGUp], [r.gLow, r.qGLow]]) { if (!b) continue;
            _slT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_slT, share); }
          r.up.updateWorldMatrix(false, true); if (r.gUp) r.gUp.updateWorldMatrix(false, true); } }
      LG.wrote = true;
    }
    /* A HAND OF ONE PIECE, MEASURED (tools/probes/handaxes.mjs reads the same from the file): its skin in the hand bone's
       own bind frame, and its three axes (the longest is the fingers' line, signed toward the tip bone; the shortest, the
       palm's facing, signed toward his middle as his arms hang at his sides in the bind pose); how long the hand is
       along its fingers and how far the palm's skin stands from the bone. Chad's monk's tip bone lies 27 to 31 degrees
       off his fingers' line: laid by it, his two hands met only at the heels, in a V */
    function handAxes(P, A, sd) {
      const a = A[sd], hand = a.hand, tip = hand.children.find(ch => ch.isBone), pts = [], S0 = sd === 'L' ? 'Left' : 'Right', v = new THREE.Vector3(); let ri = null;
      for (const o of P.lv[1] || []) { if (!o.skeleton) continue; const bi = o.skeleton.bones.indexOf(hand), ti = tip ? o.skeleton.bones.indexOf(tip) : -1, sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight; if (bi < 0 || !sI || !sW) continue;
        const bw = new THREE.Matrix4().copy(o.skeleton.boneInverses[bi]).invert(); if (!ri) ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bw)).invert();
        const pos = o.geometry.attributes.position, bwI = o.skeleton.boneInverses[bi];
        for (let i = 0; i < pos.count; i++) { let w = 0; for (let k = 0; k < 4; k++) { const j = sI.getComponent(i, k); if (j === bi || (ti >= 0 && j === ti)) w += sW.getComponent(i, k); } if (w < 0.6) continue;
          v.fromBufferAttribute(pos, i).applyMatrix4(o.bindMatrix).applyMatrix4(bwI); pts.push(v.clone()); } }
      if (pts.length < 30 || !ri) { console.warn(P.key + ': too little skin on his ' + S0 + ' hand to measure'); return null; }
      const mean = new THREE.Vector3(); for (const q of pts) mean.add(q); mean.multiplyScalar(1 / pts.length);
      const Cv = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const q of pts) { const d = [q.x - mean.x, q.y - mean.y, q.z - mean.z]; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] += d[r] * d[c]; }
      const axes = []; for (let e = 0; e < 3; e++) { let x = [0.3 + e, 0.7, 0.2 - e];
        for (let it = 0; it < 300; it++) { x = [0, 1, 2].map(r => Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]); const l = Math.hypot(x[0], x[1], x[2]) || 1; x = x.map(u => u / l); }
        const lam = [0, 1, 2].reduce((sm, r) => sm + (Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]) * x[r], 0); axes.push(new THREE.Vector3(x[0], x[1], x[2]));
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] -= lam * x[r] * x[c]; }
      const fL = axes[0].clone(); if (tip ? fL.dot(tip.position) < 0 : fL.dot(a.fL) < 0) fL.negate();
      let len = 0; for (const q of pts) len = Math.max(len, q.dot(fL));
      const nL = axes[2].clone().addScaledVector(fL, -axes[2].dot(fL)).normalize();
      { const bw = nL.clone().applyQuaternion(ri.clone().invert()); if (bw.x * (S0 === 'Left' ? 1 : -1) > 0) nL.negate(); }
      const ds = pts.map(q => q.dot(nL)).sort((x, y) => x - y);
      return { fL, nL, aL: new THREE.Vector3().crossVectors(nL, fL).normalize(), len, depth: ds[Math.floor(ds.length * 0.97)] };
    }
    function restHands(P, K = {}) {
      const A = P && P.ready ? armsOf(P) : null, skins = P.lv[1]; P.restHands = null; P.restRep = null;
      if (!A || !skins || !skins.length) return null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
      /* (his legs where his seat lays them: the lap the hands lie on is theirs) */
      if (P.restLegs) { seatLegsLay(P); P.group.updateMatrixWorld(true); }
      /* (the take's own turns kept, so that what is solved here is taken off again: armsBack) */
      for (const sd in A) { const a = A[sd]; a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      const loc = (b, out) => { b.getWorldPosition(out); return P.group.worldToLocal(out); };
      const R = {}, rep = {};
      /* how 'lap': his body without his arms, as heights over the ground on a grid in his own frame */
      const CELL = 0.012, X0 = -0.6, Z0 = -0.6, NX = 100, NZ = 112, H = new Float32Array(NX * NZ).fill(-Infinity), v = new THREE.Vector3();
      /* (and the same points in cells of 3 cm, so an arm can be swept through him at its own thickness: clearSeg) */
      const VC = 0.03, vox = new Map(), vk = (x, y, z) => ((Math.floor(x / VC) + 512) * 1024 + (Math.floor(y / VC) + 512)) * 1024 + (Math.floor(z / VC) + 512);
      /* (the heights are his LAP's: nothing over his hip joints by more than 30 cm is read into them. Sought nearer his
         hips, a palm's place came under his face, and the highest thing drawn there was his nose) */
      const hipB = bone('Hips'), LAPTOP = hipB ? loc(hipB, new THREE.Vector3()).y + 0.3 : Infinity;
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const arm = q.skeleton.bones.map(b => /(Shoulder|Arm|Hand)/.test(b.name));
        for (let i = 0; i < pos.count; i++) { let a = 0; for (let c = 0; c < 4; c++) if (arm[si.getComponent(i, c)]) a += sw.getComponent(i, c); if (a > 0.3) continue;
          q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          { const k = vk(v.x, v.y, v.z); let L = vox.get(k); if (!L) vox.set(k, L = []); L.push(v.x, v.y, v.z); }
          if (v.y > LAPTOP) continue;
          const cx = Math.round((v.x - X0) / CELL), cz = Math.round((v.z - Z0) / CELL); if (cx < 0 || cz < 0 || cx >= NX || cz >= NZ) continue; if (v.y > H[cz * NX + cx]) H[cz * NX + cx] = v.y; } }
      const H2 = new Float32Array(NX * NZ); for (let cz = 0; cz < NZ; cz++) for (let cx = 0; cx < NX; cx++) { let m = -Infinity; for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const x = cx + dx, z = cz + dz; if (x >= 0 && z >= 0 && x < NX && z < NZ && H[z * NX + x] > m) m = H[z * NX + x]; } H2[cz * NX + cx] = m; }
      const top = (x, z) => { const cx = Math.round((x - X0) / CELL), cz = Math.round((z - Z0) / CELL); return cx < 0 || cz < 0 || cx >= NX || cz >= NZ ? -Infinity : H2[cz * NX + cx]; };
      const OUT = K.out != null ? K.out : 0.01, TURN = K.turn != null ? K.turn : 0.2, OFF0 = K.off != null ? K.off : 0.022, RATIO = K.ratio != null ? K.ratio : 0.87;
      const CURL = K.curl || [0.22, 0.38, 0.22], SPREAD = [1.0, 1.06, 1.14, 1.24];
      /* (is anything drawn of him within r of p? and is a segment clear of him at that thickness, from `from` of its
         length on, a ball of radius skipR about skipC aside: the cloth a palm lies on) */
      const nearBody = (p, r) => { const n = Math.ceil(r / VC), cx = Math.floor(p.x / VC), cy = Math.floor(p.y / VC), cz = Math.floor(p.z / VC), r2 = r * r;
        for (let dx = -n; dx <= n; dx++) for (let dy = -n; dy <= n; dy++) for (let dz = -n; dz <= n; dz++) {
          const L = vox.get(((cx + dx + 512) * 1024 + (cy + dy + 512)) * 1024 + (cz + dz + 512)); if (!L) continue;
          for (let i = 0; i < L.length; i += 3) { const x = L[i] - p.x, y = L[i + 1] - p.y, z = L[i + 2] - p.z; if (x * x + y * y + z * z < r2) return true; } }
        return false; };
      const clearSeg = (A0, B0, r, from, skipC, skipR) => { const p = new THREE.Vector3();
        for (let s = 0; s <= 12; s++) { const u = from + (1 - from) * s / 12; p.lerpVectors(A0, B0, u); if (skipC && p.distanceTo(skipC) < skipR) continue; if (nearBody(p, r)) return false; }
        return true; };
      for (const [sd, S0, sg] of [['L', 'Left', 1], ['R', 'Right', -1]]) {
        const a = A[sd], bu = bone(S0 + 'UpLeg'), bk = bone(S0 + 'Leg'); if (!bu || !bk) continue;
        const U = loc(bu, new THREE.Vector3()), Kn = loc(bk, new THREE.Vector3()), Sh = loc(a.up, new THREE.Vector3()), E0 = loc(a.fore, new THREE.Vector3()), W0 = loc(a.hand, new THREE.Vector3());
        const la = Sh.distanceTo(E0), lb = E0.distanceTo(W0), th = new THREE.Vector3(Kn.x - U.x, 0, Kn.z - U.z).normalize(), across = new THREE.Vector3(th.z, 0, -th.x); if (across.x * sg < 0) across.negate();
        const HM = a.fingers ? null : handAxes(P, A, sd), PALM = HM ? HM.len * 0.45 : a.palm, OFF = HM ? Math.max(0.015, HM.depth) : OFF0;
        const phi = -sg * TURN, fh = new THREE.Vector3(th.x * Math.cos(phi) + th.z * Math.sin(phi), 0, -th.x * Math.sin(phi) + th.z * Math.cos(phi));
        let best = null;
        /* (WHERE ON THE THIGH. With `at`, the palm there or as near it as his arm reaches. Without, wherever along the
           thigh leaves his elbow bent as a resting arm is bent: the reach from his shoulder to his wrist `ratio` of the
           arm's whole length (0.87: about 120 degrees inside the elbow). At a fixed share of the thigh, the long arms of
           the two monks made here reached their knees all but straight: photographed full size, 12 Nov) */
        /* (the hand's frame with its palm's middle at Cp and its fingers toward d seen from above: the fingers following
           the cloth's slope along d, the palm facing the cloth. A hand at rest lies within twenty degrees of level along
           its fingers, and its palm within twenty-five of facing straight down: the cloth's slope is followed only that far) */
        const frameAt = (Cp, d) => { const e = 0.03, cx = Cp.x, cz = Cp.z, sl = (top(cx + d.x * e, cz + d.z * e) - top(cx - d.x * e, cz - d.z * e)) / (2 * e), gx = (top(cx + 0.025, cz) - top(cx - 0.025, cz)) / 0.05, gz = (top(cx, cz + 0.025) - top(cx, cz - 0.025)) / 0.05;
          if (!isFinite(sl) || !isFinite(gx) || !isFinite(gz)) return null;
          const f = new THREE.Vector3(d.x, Math.max(-0.36, Math.min(0.15, sl)), d.z).normalize(), nS = new THREE.Vector3(-gx, 1, -gz).normalize();
          if (nS.y < Math.cos(0.44)) { const hz = Math.hypot(nS.x, nS.z) || 1; nS.set(nS.x / hz * Math.sin(0.44), Math.cos(0.44), nS.z / hz * Math.sin(0.44)); }
          /* (K.palmUp, v26.6: THE PALM TURNED UP, the hand's back on the cloth, for a body whose take holds its forearms
             rolled palm up: the hermit in the pale yellow shawl's wrists stood wrung 56 to 77 degrees at every setting of
             a palm laid down. A seated sage's hands rest so on his knees as often as palm down. Absent, all as it was) */
          const n = K.palmUp ? nS.clone() : nS.clone().negate(); n.addScaledVector(f, -n.dot(f)).normalize();
          /* (K.palmTilt, v26.6: { L, R } radians, the palm turned about the fingers' line toward his middle, the hand on its
             little finger's edge that much: a resting hand lies so as often as flat, and the forearm turns that much less.
             Absent, flat as before) */
          const tilt = K.palmTilt && K.palmTilt[sd]; if (tilt) n.applyAxisAngle(f, sg * (K.palmUp ? -tilt : tilt)).normalize();
          return { f, n, W: Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, K.palmUp ? OFF : -OFF) }; };
        const ts = K.at != null ? Array.from({ length: 13 }, (_, k) => K.at - 0.04 * k) : Array.from({ length: 15 }, (_, k) => 0.28 + 0.04 * k);
        for (const t of ts) {
          /* (on the CREST of what is drawn over the thigh: the highest point across its line within six centimetres of
             `out`, the inner one where two are within 4 mm. Laid where the robe falls away down the thigh's outer side,
             a hand followed that slope and hung down it, fingers to the floor: photographed on monk B's left, 12 Nov) */
          /* (`inner`: how far toward his middle the crest may be sought. On a robe that drapes one lap over both knees the
             crest is between them, and both hands went to it, one on the other: photographed on Chad's monk) */
          let cx = 0, cz = 0, cy = -Infinity;
          for (let o = -(K.inner != null ? K.inner : 0.06); o <= 0.0601; o += 0.01) { const x = U.x + (Kn.x - U.x) * t + across.x * (OUT + o), z = U.z + (Kn.z - U.z) * t + across.z * (OUT + o), y = top(x, z); if (y > cy + 0.004) { cx = x; cz = z; cy = y; } }
          if (!(cy > 0.05)) continue;
          const Cp = new THREE.Vector3(cx, cy, cz), fr = frameAt(Cp, fh); if (!fr) continue;
          const { f, n, W } = fr, dS = W.distanceTo(Sh);
          if (dS > la + lb - 0.012 || dS < Math.abs(la - lb) + 0.03) continue;
          /* (and nearer the thigh's middle where the reach cannot be had: where every place on it left his arm straighter
             than that, the nearest to his shoulder was his hip crease, and his elbow went out to his side as a hand on a
             hip does: Chad's monk's right, photographed full size, 12 Nov) */
          const score = K.at != null ? 0 : Math.abs(dS / (la + lb) - RATIO) + 0.25 * Math.abs(t - 0.55);
          if (!best || score < best.score) best = { t, Cp, W, f, n, score, ratio: dS / (la + lb) };
          if (K.at != null) break; }
        if (!best) { console.warn(P.key + ': his ' + S0 + ' hand cannot reach his thigh: left as the take has it'); continue; }
        /* (his elbow's HINGE, read off the take he rests in. The takes on these rigs keep the forearm in one plane of the
           upper arm's frame, 0.0 degrees out of it at every key (masters/v25.3/measure/hinge.cjs, run on each monk's
           file: the tracker's §15.3), so one flexed moment names it; and the forearm's turn about its own line is kept as
           the take has it, as theirs never roll it) */
        if (!a.hinge) { const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
          const h = new THREE.Vector3().crossVectors(uL, dL); if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6); h.normalize();
          const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
          a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) }; }
        /* THE ELBOW (12 Nov, the first pictures of it seen full size: both elbows had gone back and IN, inside his flank,
           and each forearm came out through the roll of his robe at his waist). An arm at rest has its elbow behind the
           line from the shoulder to the wrist and below it, turned out from the side only as far as it must be: so it is
           turned out from straight behind a step at a time until the upper arm and the forearm, each swept at its own
           thickness, pass clear of what is drawn of him without his arms (the cloth under the palm aside). The arm is
           then solved as an arm, about its own elbow's hinge (armHinge) */
        const back = th.clone().negate();
        const findElbow = (Wt, Cpt) => { const T = Wt.clone().sub(Sh).normalize(), dW = Math.min(Sh.distanceTo(Wt), la + lb - 1e-3), ca = (la * la + dW * dW - lb * lb) / (2 * la * dW), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
          let B = across.clone();
          for (let psi = 0.35; psi <= 1.56; psi += 0.087) {
            const Bp = back.clone().multiplyScalar(Math.cos(psi)).addScaledVector(across, Math.sin(psi)); Bp.y -= 0.4;
            Bp.addScaledVector(T, -Bp.dot(T)); if (Bp.lengthSq() < 1e-8) continue; B = Bp.normalize();
            const E = Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa);
            if (clearSeg(Sh, E, 0.045, 0.3) && clearSeg(E, Wt, 0.035, 0, Cpt, 0.12)) return { pdir: B, psi, E, clear: true }; }
          return { pdir: B, psi: 1.56, E: Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa), clear: false }; };
        let el = findElbow(best.W, best.Cp);
        /* (THE HAND ALONG ITS FOREARM: its fingers carried on along the forearm's own line seen from above, a quarter of
           the way toward the thigh's, and the elbow found again for that wrist. Laid along the thigh while the forearm came
           in from his side, each wrist was bent sideways, by up to fifty degrees: photographed full size, 12 Nov) */
        /* (K.along, v26.7: the forearm's share of that line; K.alongIt, how many times the step is taken, the elbow
           found again for each new wrist; K.handYaw { L, R }, radians the line is then turned about the upright before
           the hand is laid along it. At a quarter toward the thigh, the hermit in the pale yellow shawl's left hand,
           palm up, stood bent 35 degrees toward its little finger, the end of a real wrist's range (jointscan, v26.7's
           build); the whole way along the forearm four times over, the elbow moved each time and left the wrist bent 38
           to 47 degrees toward the thumb and the forearm wrung 115 to 122. Absent, a share of 0.75 and one step, as before) */
        { const SH = K.along != null ? K.along : 0.75, IT = K.alongIt || 1, YW = K.handYaw && K.handYaw[sd];
          for (let it = 0; it < IT; it++) { const fa = best.W.clone().sub(el.E); fa.y = 0;
            if (!(fa.lengthSq() > 1e-6)) break; const d2 = fa.normalize().multiplyScalar(SH).addScaledVector(th, 1 - SH); d2.y = 0; d2.normalize();
            if (YW) d2.applyAxisAngle(new THREE.Vector3(0, 1, 0), YW); const fr = frameAt(best.Cp, d2);
            if (!(fr && fr.W.distanceTo(Sh) < la + lb - 0.012)) break; best.f = fr.f; best.n = fr.n; best.W = fr.W; el = findElbow(best.W, best.Cp); } }
        /* (K.flexMax, v26.3: THE WRIST KEPT NEAR STRAIGHT. The brown hermit's body is short from hip to shoulder, so his
           elbow hangs at the height of his knees and his forearm climbs to them; his hand, laid along the cloth where it
           falls away over the knee, was bent down at the wrist 40 degrees (measured, tools/probes/jointscan.mjs; a real
           man's palm rests on top of the knee with the wrist near straight and only the fingers curving down over it:
           masters/v26.3/make.sh). So the hand is turned up about its own across-axis, its palm's middle where it was,
           until it bends toward the palm no more than flexMax from the forearm's line, the elbow found again each time) */
        if (K.flexMax != null) for (let it = 0; it < 4; it++) {
          const e = best.W.clone().sub(el.E).normalize(), f = best.f, n = best.n, ne = n.clone().addScaledVector(e, -n.dot(e)); if (ne.lengthSq() < 1e-8) break; ne.normalize();
          const flex = Math.atan2(f.dot(ne), f.dot(e)); if (flex <= K.flexMax + 0.005) break;
          const ax = new THREE.Vector3().crossVectors(n, f).normalize(), q = new THREE.Quaternion().setFromAxisAngle(ax, flex - K.flexMax);
          best.f = f.clone().applyQuaternion(q).normalize(); best.n = n.clone().applyQuaternion(q).normalize();
          best.W = best.Cp.clone().addScaledVector(best.f, -PALM).addScaledVector(best.n, K.palmUp ? OFF : -OFF);
          el = findElbow(best.W, best.Cp); }
        /* (K.wristSolve, v26.7: THE HAND'S LINE SOLVED AGAINST ITS FOREARM. Laid along a line of fixed shares (above),
           the hermit in the pale yellow shawl's left wrist, palm up, stood 35 degrees toward its little finger; a whole
           share, 40 the same way; turned 26 degrees by hand either way, 35 toward the thumb or 50 toward the little
           finger, the forearm wrung past its range (jointscan, v26.7): each new wrist moves the elbow found for it. So
           the hand's line over the cloth is tried every four degrees within sixty either side of where it stands, the
           elbow found for each, and the one kept whose wrist is nearest straight with its forearm turned within a
           forearm's range and its elbow clear of him, each measured as tools/probes/jointscan.mjs measures it) */
        if (K.wristSolve) { const wsUp = new THREE.Vector3(0, 1, 0), wsD0 = new THREE.Vector3(best.f.x, 0, best.f.z), DG = 180 / Math.PI;
          if (wsD0.lengthSq() > 1e-8) { wsD0.normalize(); let wsPick = null;
            for (let wsK = -15; wsK <= 15; wsK++) { const wsFr = frameAt(best.Cp, wsD0.clone().applyAxisAngle(wsUp, wsK * 4 / DG)); if (!wsFr || wsFr.W.distanceTo(Sh) >= la + lb - 0.012) continue;
              const wsEl = findElbow(wsFr.W, best.Cp); if (!wsEl.clear) continue;
              const wsE = wsFr.W.clone().sub(wsEl.E).normalize(), wsU = wsEl.E.clone().sub(Sh).normalize(), wsRad = new THREE.Vector3().crossVectors(wsFr.n, wsFr.f).multiplyScalar(sg);
              const wsRe = wsRad.clone().addScaledVector(wsE, -wsRad.dot(wsE)).normalize(), wsNe = wsFr.n.clone().addScaledVector(wsE, -wsFr.n.dot(wsE)).normalize();
              const wsDev = Math.atan2(wsFr.f.dot(wsRe), wsFr.f.dot(wsE)) * DG, wsFlex = Math.atan2(wsFr.f.dot(wsNe), wsFr.f.dot(wsE)) * DG;
              const wsMed = new THREE.Vector3().crossVectors(wsU, wsE).normalize().multiplyScalar(sg), wsDn = wsU.clone().addScaledVector(wsE, -wsU.dot(wsE)).normalize();
              const wsTurn = Math.atan2(wsNe.dot(wsDn), wsNe.dot(wsMed)) * DG;
              const wsC = Math.max(0, Math.abs(wsDev) - 8) ** 2 + 2 * Math.max(0, Math.abs(wsTurn) - 85) ** 2 + Math.max(0, Math.abs(wsFlex) - 25) ** 2 + 0.01 * wsK * wsK;
              if (!wsPick || wsC < wsPick.c) wsPick = { c: wsC, fr: wsFr, el: wsEl, dev: wsDev, turn: wsTurn, flex: wsFlex, yaw: wsK * 4 }; }
            if (wsPick) { best.f = wsPick.fr.f; best.n = wsPick.fr.n; best.W = wsPick.fr.W; el = wsPick.el;
              best.solve = { yaw: wsPick.yaw, dev: +wsPick.dev.toFixed(1), turn: +wsPick.turn.toFixed(1), flex: +wsPick.flex.toFixed(1) }; } } }
        if (!el.clear) console.warn(P.key + ': his ' + S0 + ' arm finds no way clear of his body: laid turned out as far as was tried');
        const pdir = el.pdir, psiAt = el.psi;
        /* the fingers: his file's own at rest, each joint curled toward the palm about the hand's own across-axis,
           worked out once in the hand's own frame */
        /* (K.gather, v26.3: THE FINGERS TOGETHER. A hand at rest on a knee holds its fingers side by side; the brown
           hermit's file rests them apart, and laid from it his fingers stood 12 to 16 degrees apart, gaps a rake's:
           Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?". Each finger's first joint is turned
           about the palm's facing toward the middle finger's line, by `gather` of what it stands apart at rest) */
        let gat = null;
        if (K.gather) { const mh = bindWorldOf(P, a.hand); if (mh) { const rh = new THREE.Quaternion(); mh.decompose(new THREE.Vector3(), rh, new THREE.Vector3()); rh.invert();
          const dirOf = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), b2 = bone(S0 + 'Hand' + fn + '2'), m1 = b1 && bindWorldOf(P, b1), m2 = b2 && bindWorldOf(P, b2); if (!m1 || !m2) return null;
            const dd = new THREE.Vector3().setFromMatrixPosition(m2).sub(new THREE.Vector3().setFromMatrixPosition(m1)).applyQuaternion(rh); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)); };
          const tl = FINGERS.map(dirOf), tm = tl[1]; if (tm != null) gat = tl.map(t0 => t0 == null ? 0 : -K.gather * (t0 - tm));
          /* (K.converge: TOUCHING, NOT ONLY PARALLEL. Drawn together to his middle finger's line, his fingers lay side by
             side with a gap between each, being thinner than his knuckles are apart (photographed, v26.3, after the
             scan read them 0 to 2 degrees apart). A resting hand's fingers aim a little in, at a point some way before
             the middle knuckle, and touch: each finger's first joint is turned to aim at that point, K.converge metres
             before the middle knuckle along the middle finger's line) */
          if (K.converge && tm != null) { const kn = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), m1 = b1 && bindWorldOf(P, b1); return m1 ? new THREE.Vector3().setFromMatrixPosition(m1) : null; };
            const pm = kn('Middle'), ph0 = new THREE.Vector3().setFromMatrixPosition(mh); if (pm) {
              const toH = (w) => w.clone().sub(ph0).applyQuaternion(rh), pmH = toH(pm);
              const cH = pmH.clone().addScaledVector(a.fL, Math.cos(tm) * K.converge).addScaledVector(a.aL, Math.sin(tm) * K.converge);
              gat = FINGERS.map((fn, fi) => { const pk = kn(fn); if (!pk || tl[fi] == null) return 0; const dd = cH.clone().sub(toH(pk)); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)) - tl[fi]; }); } } } }
        /* (a finger's three turns at a curl of k times CURL: kept, so that K.drape can find each finger's own) */
        const fingerQs = (fi, k) => { const out = []; let rel = new THREE.Quaternion(); const ax = a.aL.clone();
          for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'Hand' + FINGERS[fi] + j); if (!b) break; const q0 = bindLocal(P, b); if (!q0) break;
            /* (this joint's parent turned in the hand's frame is `rel`; the across-axis in that parent's frame) */
            /* (toward the palm is a turn the other way about the across-axis: armsOf's aL is the palm's facing crossed
               with the fingers' line, and a finger turned about the fingers' line crossed with the palm's facing goes
               toward the palm) */
            const axP = ax.clone().applyQuaternion(rel.clone().invert()).normalize(), ang = CURL[j - 1] * SPREAD[fi] * k;
            const qj = new THREE.Quaternion().setFromAxisAngle(axP, -ang);
            if (j === 1 && gat) qj.multiply(new THREE.Quaternion().setFromAxisAngle(a.nL, gat[fi]));
            qj.multiply(q0);
            out.push({ b, q: qj, fi }); rel = rel.multiply(qj); }
          return out; };
        const fing = []; for (let fi = 0; fi < FINGERS.length; fi++) fing.push(...fingerQs(fi, 1));
        /* (K.thumb 'bind', v26.7: THE THUMB AS HIS FILE RESTS IT. A take's thumb is posed for the hand it was made with,
           and a palm turned up carries it with the palm: the hermit in the pale yellow shawl's thumbs stood lifted 42
           degrees off his palms and turned across them, toward his little fingers, pointing up (measured; the reference
           picture's lie out beside the palm, barely lifted). His file's own rest has each thumb 26 degrees out from his
           index finger and 11 to 18 off the palm: laid so, joint by joint, while the rest is laid. Absent, the take's) */
        if (K.thumb === 'bind') for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'HandThumb' + j), q0 = b && bindLocal(P, b); if (q0) fing.push({ b, q: q0, fi: -1 }); }
        R[sd] = { W: best.W, pdir, f: best.f, n: best.n, fing, fingerQs };
        /* (a hand of one piece is laid by its own measured axes: armsOf's, for a hand with no finger bones, is the
           forearm's line carried on) */
        if (!a.fingers) { const m = handAxes(P, A, sd); if (m) { R[sd].fL = m.fL; R[sd].nL = m.nL; R[sd].aL = m.aL; } }
        rep[sd] = { at: +best.t.toFixed(2), reach: +best.ratio.toFixed(3), turnedOut: +(psiAt * 180 / Math.PI).toFixed(0), palm: best.Cp.toArray().map(u => +u.toFixed(3)) }; if (best.solve) rep[sd].solve = best.solve; }
      P.restHands = { how: 'lap', R }; P.restRep = rep;
      /* (once laid, the elbow and the wrist's bend are read and reported: what a picture of it must agree with) */
      restHandsLay(P); P.group.updateMatrixWorld(true);
      /* (K.drape, v26.3: EACH FINGER CURLED UNTIL ITS TIP RESTS ON WHAT IS DRAWN OF HIS LAP, r over it: a palm on top of a
         knee has its fingers curving down over the kneecap's front, each as far as it reaches the cloth, no further and no
         less. Found finger by finger by halving, on the curl from 0.3 to `max` times CURL) */
      if (K.drape && !K.palmUp) { for (const sd in R) { const S0 = sd === 'L' ? 'Left' : 'Right', r = R[sd]; if (!r.fingerQs) continue; const kk = [];
          for (let fi = 0; fi < FINGERS.length; fi++) {
            const t4 = bone(S0 + 'Hand' + FINGERS[fi] + '4'), t3 = bone(S0 + 'Hand' + FINGERS[fi] + '3'); if (!t3) { kk.push(null); continue; }
            const tipAt = (out) => { if (t4) t4.getWorldPosition(out); else { t3.getWorldPosition(out); const e3 = t3.matrixWorld.elements; out.add(new THREE.Vector3(e3[4], e3[5], e3[6]).normalize().multiplyScalar(0.02)); } return P.group.worldToLocal(out); };
            const tryK = (kv) => { const qs = r.fingerQs(fi, kv); for (const F of qs) F.b.quaternion.copy(F.q); if (qs[0]) qs[0].b.updateWorldMatrix(false, true); const tp = tipAt(new THREE.Vector3()); return tp.y - top(tp.x, tp.z) - (K.drape.r != null ? K.drape.r : 0.008); };
            if (!isFinite(tryK(1))) { kk.push(null); for (const F of r.fing) if (F.fi === fi) F.b.quaternion.copy(F.q); continue; }
            let lo = K.drape.min != null ? K.drape.min : 0.3, hi = K.drape.max || 2, k = 1;
            for (let it = 0; it < 12; it++) { k = 0.5 * (lo + hi); const gk = tryK(k); if (!isFinite(gk)) break; if (gk > 0) lo = k; else hi = k; }
            kk.push(+k.toFixed(2)); r.fing = r.fing.filter(F => F.fi !== fi).concat(r.fingerQs(fi, k)); }
          rep[sd].drape = kk; }
        restHandsLay(P); P.group.updateMatrixWorld(true); }
      for (const sd in R) { const a = A[sd]; loc(a.up, _rhA); loc(a.fore, _rhB); loc(a.hand, _rhC);
        const fa = _rhC.clone().sub(_rhB).normalize(), bend = Math.acos(Math.max(-1, Math.min(1, fa.dot(R[sd].f)))) * 180 / Math.PI;
        rep[sd].elbow = _rhB.toArray().map(u => +u.toFixed(3)); rep[sd].elbowOut = +((Math.abs(_rhB.x) - Math.abs(_rhA.x))).toFixed(3); rep[sd].wristBend = +bend.toFixed(0); }
      armsBack(P); P.group.updateMatrixWorld(true); return rep;
    }
    /* AN ARM SOLVED AS AN ARM (v25.3's law; episode 4 chapter 2's armSolve, made for any rig whose hinge has been read):
       the elbow on the pole's side of the reach, the upper arm's line run to it with its hinge square to the arm's plane
       (so the shoulder rolls, as a shoulder does), and the forearm flexed about that hinge onto the wrist, its turn about
       its own line kept as the take has it. armTo (chapter 1's) turns each bone by the shortest arc, which bends an
       elbow sideways, out of its hinge: the monks' first rest */
    const _ahS = new THREE.Vector3(), _ahE = new THREE.Vector3(), _ahW = new THREE.Vector3(), _ahT = new THREE.Vector3(), _ahP = new THREE.Vector3(),
          _ahU = new THREE.Vector3(), _ahH = new THREE.Vector3(), _ahZ = new THREE.Vector3(), _ahV = new THREE.Vector3(), _ahZl = new THREE.Vector3(),
          _ahM = new THREE.Matrix4(), _ahM2 = new THREE.Matrix4(), _ahQ = new THREE.Quaternion(), _ahQp = new THREE.Quaternion();
    /* AN ELBOW'S HINGE read off the pose its arm stands in now (the takes on these rigs keep the forearm in one plane of the
       upper arm's frame: masters/v25.3/measure/hinge.cjs), as restHands reads it for the monks; kept on the arm. Read
       before anything is laid on the arm (v26.1, for the woman with the taper) */
    /* (v26.1: `hm`, a hinge MEASURED off another of the body's takes, in the upper arm's own frame. One who stands with her
       arms straight gives no hinge from her rest, and the guess put her elbow's crease 16 degrees off the one her own
       takes bend it about) */
    function hingeOf(a, sg, hm) {
      if (a.hinge) return a.hinge;
      const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
      const h = hm ? new THREE.Vector3().fromArray(hm) : new THREE.Vector3().crossVectors(uL, dL);
      if (hm) h.addScaledVector(uL, -h.dot(uL)); else if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6);
      h.normalize();
      const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
      a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) };
      return a.hinge;
    }
    /* (the class of v26.1's first taper: a point that is not a number never reaches a bone. Once NaN is written into an
       arm it stays there, for the take does not write it back, and the arm is not drawn; so it is refused, and said) */
    const armBad = new Set();
    function armHinge(a, target, pdir) {
      if (!(Number.isFinite(target.x + target.y + target.z) && Number.isFinite(pdir.x + pdir.y + pdir.z))) {
        if (!armBad.has(a)) { armBad.add(a); console.warn('armHinge: a target that is not a number, refused'); } return; }
      const G = a.hinge; if (!G) { armTo(a, target, _ahP.copy(target).add(pdir)); return; }
      a.up.updateWorldMatrix(true, true);
      a.up.getWorldPosition(_ahS); a.fore.getWorldPosition(_ahE); a.hand.getWorldPosition(_ahW);
      const la = _ahS.distanceTo(_ahE), lb = _ahE.distanceTo(_ahW);
      _ahT.copy(target).sub(_ahS); const d0 = _ahT.length(); if (d0 < 1e-5 || la < 1e-5 || lb < 1e-5) return;
      _ahT.divideScalar(d0); const d = THREE.MathUtils.clamp(d0, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _ahP.copy(pdir).addScaledVector(_ahT, -pdir.dot(_ahT)); if (_ahP.lengthSq() < 1e-10) return; _ahP.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _ahU.copy(_ahT).multiplyScalar(ca).addScaledVector(_ahP, sa);                       // the upper arm's line
      _ahH.crossVectors(_ahP, _ahT).normalize(); _ahZ.crossVectors(_ahU, _ahH);           // its hinge, flexion positive
      _ahV.copy(_ahT).multiplyScalar(d).addScaledVector(_ahU, -la).normalize();          // the forearm's line
      _ahZl.crossVectors(G.uL, G.h);
      _ahM.makeBasis(_ahU, _ahH, _ahZ); _ahM2.makeBasis(G.uL, G.h, _ahZl).transpose(); _ahM.multiply(_ahM2);
      _ahQ.setFromRotationMatrix(_ahM); a.up.parent.getWorldQuaternion(_ahQp); a.up.quaternion.copy(_ahQ.premultiply(_ahQp.invert()));
      a.up.updateWorldMatrix(false, true);
      a.fore.quaternion.setFromAxisAngle(G.h, Math.acos(THREE.MathUtils.clamp(_ahU.dot(_ahV), -1, 1))).multiply(G.rest);
      a.fore.updateWorldMatrix(false, true);
    }
    /* (every frame, after the take has posed him) */
    /* (laid while he RESTS, by the rest take's weight: v26.3, the brown hermit, whose films bless with his hands (handson,
       petals, palmover) out of the same rest. A body with one take, the monks, rests in it always) */
    const _rhT = new THREE.Quaternion();
    function restHandsLay(P) {
      const RH = P.restHands, A = RH ? armsOf(P) : null; if (!A) return;
      const rt = P.rest && P.rest.take, share = rt && P.w[rt] != null ? Math.min(1, P.w[rt]) : 1; if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_rhQ);
      for (const sd in RH.R) { const a = A[sd], r = RH.R[sd];
        if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
        _rhA.copy(r.W); P.group.localToWorld(_rhA); _rhB.copy(r.pdir).applyQuaternion(_rhQ);
        armHinge(a, _rhA, _rhB);
        _rhC.copy(r.f).applyQuaternion(_rhQ); _rhD.copy(r.n).applyQuaternion(_rhQ);
        _ha.crossVectors(_rhD, _rhC); _hm.makeBasis(_ha, _rhD, _rhC); _hm2.makeBasis(r.aL || a.aL, r.nL || a.nL, r.fL || a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
        a.hand.parent.getWorldQuaternion(_hq2); a.hand.quaternion.copy(_hq2.invert().multiply(_hq)); a.hand.updateWorldMatrix(false, true);
        if (r.fing.length) { if (!a.fing) a.fing = []; if (!a.curled) { a.fingRest = r.fing.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: 1 })); a.curled = true; }
          for (const F of r.fing) F.b.quaternion.copy(F.q); }
        /* (part of the way, while a gesture fades in or out: each turn eased from the take's own) */
        if (share < 0.999) { for (const [b, q0] of [[a.up, a.qUp], [a.fore, a.qFore], [a.hand, a.qHand]]) { _rhT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_rhT, share); }
          if (a.fingRest) for (const F of a.fingRest) { _rhT.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_rhT, share); }
          a.up.updateWorldMatrix(false, true); } }
    }
    /* THE HANDS HELD TRUE (v26.3: Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?", and of my
       answer, "Stop pretending you know what is the problem"). MEASURED on every person (tools/probes/jointscan.mjs),
       two faults that no real hand makes:
       1. FINGERS BENT SIDEWAYS at their middle and end joints, which are hinges (the brown hermit's grip in v26.2: 54 to
          70 degrees; the hermit in white, the master in white and two of the crowd's bodies in their takes, 30 to 50):
          a take made on another body and carried over by turns puts a finger's bend into a joint whose rest stands
          differently. Each such joint keeps only its turn about its own hinge (the knuckles' line as the body stands at
          rest, in the joint's parent's frame), and never bends backward past HT.back.
       2. A HAND WRUNG ROUND ON ITS FOREARM (my lap rest for the brown hermit: 77 and 111 degrees; the seated takes, 50 to
          64): a rig with no twist bones carries the forearm's whole turn at the wrist, and the skin there twists like a
          sweet's wrapper (the taper woman's, v26.3's first fix of her arm). A forearm turns along its length, so HT.roll of
          the hand's turn about the forearm's line beyond HT.free is laid on the forearm, about its own line, and the hand
          turned back by as much: the hand stays exactly where and as it was.
       3. A FINGER ROLLED ON ITS OWN LINE at its knuckle, which no finger does more than a few degrees: what a take
          carried over by turns leaves there turns the whole finger's bend aside. Its knuckle keeps its bend and its
          spread, and loses the roll.
       Laid last of a body's lays, on every body drawn and on a crowd's drivers (whose bones its members wear; a first
       pass laid it on the near skins only, and the joint scan, which reads every body from wherever it stands, read the
       far ones unmended), and taken off before the mixer runs again (armsBack: the v11.5 law). A body whose
       arm is laid after the people's own tick (the taper woman's, taperTick) says so (P.htLate) and is held true there,
       after it: laid under that lay, the wrist's share would be saved as that lay's rest and laid again every frame */
    const HT = { free: 25 * Math.PI / 180, roll: 0.5, back: -5 * Math.PI / 180 };
    const _htQ = new THREE.Quaternion(), _htQ2 = new THREE.Quaternion();
    function bindWorldOf(P, b) { for (const sm of P.lv[1] || []) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; }
    function handsTrueInit(P) {
      P.ht = null; const out = { J: [], W: [], K: [], on: false };
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      for (const [S0, side] of [['Left', 1], ['Right', -1]]) {
        const hand = bone(S0 + 'Hand'), fore = bone(S0 + 'ForeArm'); if (!hand || !fore) continue;
        /* (the wrist: the forearm's line in its own frame, and the hand's turn in it at rest) */
        const qh0 = bindLocal(P, hand);
        if (qh0 && hand.parent === fore && hand.position.lengthSq() > 1e-10) out.W.push({ fore, hand, qh0, ax: hand.position.clone().normalize(), sf: new THREE.Quaternion(), sh: new THREE.Quaternion(), on: false });
        /* (the fingers: the knuckles' line and the palm's facing at rest, in the bind's world) */
        const at = (n) => { const b = bone(S0 + 'Hand' + n), m = b ? bindWorldOf(P, b) : null; return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
        const pI = at('Index1'), pM = at('Middle1'), pK = at('Pinky1') || at('Ring1'), mh = bindWorldOf(P, hand); if (!pI || !pM || !pK || !mh) continue;
        const ph = new THREE.Vector3().setFromMatrixPosition(mh), f = pM.clone().sub(ph).normalize(), kl = pI.clone().sub(pK); kl.addScaledVector(f, -kl.dot(f)).normalize();
        const nrm = new THREE.Vector3().crossVectors(f, kl).multiplyScalar(side).normalize();
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) {
          const k1 = bone(S0 + 'Hand' + fn + '1'), k2 = bone(S0 + 'Hand' + fn + '2'), q1 = k1 && bindLocal(P, k1);
          if (k1 && k2 && q1 && k2.parent === k1 && k2.position.lengthSq() > 1e-12) out.K.push({ b: k1, q0: q1, ax: k2.position.clone().normalize(), sv: new THREE.Quaternion(), on: false }); }
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) for (let j = 2; j <= 3; j++) {
          const b = bone(S0 + 'Hand' + fn + j); if (!b || !b.parent) continue;
          const q0 = bindLocal(P, b), mp = bindWorldOf(P, b.parent); if (!q0 || !mp) continue;
          const rp = new THREE.Quaternion(); mp.decompose(new THREE.Vector3(), rp, new THREE.Vector3()); rp.invert();
          const u = b.position.clone(); if (u.lengthSq() < 1e-12) continue; u.normalize();
          const ax = kl.clone().applyQuaternion(rp); ax.addScaledVector(u, -ax.dot(u)); if (ax.lengthSq() < 1e-8) continue; ax.normalize();
          /* (which way about it closes the finger: its next bone turned a little about it, against the palm's facing) */
          const ch = b.children.find(x => x.isBone), c = (ch && ch.position.lengthSq() > 1e-12 ? ch.position.clone() : new THREE.Vector3(0, 1, 0)).normalize().applyQuaternion(q0);
          const np = nrm.clone().applyQuaternion(rp), sg = Math.sign(new THREE.Vector3().crossVectors(ax, c).dot(np)) || 1;
          out.J.push({ b, q0, ax, sg, max: (j === 2 ? 115 : 95) * Math.PI / 180, sv: new THREE.Quaternion(), on: false }); }
      }
      if (out.J.length || out.W.length || out.K.length) P.ht = out;
    }
    function handsTrue(P) {
      if (P.ht === undefined) handsTrueInit(P);
      const H = P.ht; if (!H || H.on) return;
      H.on = true;
      /* 0. each knuckle: its turn from the rest with its roll about the finger's own line taken out (swing kept) */
      for (const R of H.K) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert().multiply(b.quaternion);                                         // (its turn from the rest, in its own frame)
        const d = _htQ.x * R.ax.x + _htQ.y * R.ax.y + _htQ.z * R.ax.z, tl = Math.hypot(d, _htQ.w); if (!(tl > 1e-9)) continue;
        _htQ2.set(R.ax.x * d / tl, R.ax.y * d / tl, R.ax.z * d / tl, _htQ.w / tl);                // (the roll)
        b.quaternion.copy(R.q0).multiply(_htQ.multiply(_htQ2.invert())); }
      /* 1. each finger's middle and end joint: only its turn about its own hinge, from the rest */
      for (const R of H.J) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert(); _htQ2.copy(b.quaternion).multiply(_htQ);                       // (its turn from the rest, in its parent's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let ang = 2 * Math.atan2(d, _htQ2.w); if (ang > Math.PI) ang -= 2 * Math.PI; if (ang < -Math.PI) ang += 2 * Math.PI;
        const fl = Math.max(HT.back, Math.min(R.max, ang * R.sg));
        b.quaternion.setFromAxisAngle(R.ax, fl * R.sg).multiply(R.q0); }
      /* 2. the hand's turn about the forearm's line, shared with the forearm */
      for (const R of H.W) { R.sf.copy(R.fore.quaternion); R.sh.copy(R.hand.quaternion); R.on = true;
        _htQ.copy(R.qh0).invert(); _htQ2.copy(R.hand.quaternion).multiply(_htQ);                // (the hand's turn from its rest, in the forearm's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let tw = 2 * Math.atan2(d, _htQ2.w); if (tw > Math.PI) tw -= 2 * Math.PI; if (tw < -Math.PI) tw += 2 * Math.PI;
        if (Math.abs(tw) <= HT.free) continue;
        const mv = HT.roll * tw;
        _htQ.setFromAxisAngle(R.ax, mv); R.fore.quaternion.multiply(_htQ);
        _htQ.setFromAxisAngle(R.ax, -mv); R.hand.quaternion.premultiply(_htQ); }
    }
    /* the middle of a person's two hands, in the world (what a raised bowl is stood on) */
    const HANDS = { L: /^(mixamorig:?)?LeftHand$/, R: /^(mixamorig:?)?RightHand$/ };
    function handsMid(P, out) {
      if (!P || !P.ready) return null;
      if (!P.handL) for (const n in P.bone) { if (HANDS.L.test(n)) P.handL = P.bone[n]; if (HANDS.R.test(n)) P.handR = P.bone[n]; }
      if (!P.handL || !P.handR) return null;
      P.group.updateWorldMatrix(true, true);
      P.handL.getWorldPosition(out); P.handR.getWorldPosition(_lkv); return out.add(_lkv).multiplyScalar(0.5);
    }
    /* where a take would hold a person's hands at one of its moments, in the person's own frame (measured, then the
       take the person wears is put back): a body is stood where two pairs of hands can meet on one bowl */
    function handsAt(P, name, t, out, sd) {
      if (!P || !P.ready || !P.acts[name]) return null;
      armsBack(P);
      const keep = {}; for (const k in P.acts) { keep[k] = [P.acts[k].getEffectiveWeight(), P.acts[k].time]; P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      const w0 = Object.assign({}, P.w); for (const k in P.w) P.w[k] = k === name ? 1 : 0;
      P.acts[name].time = t; personSettle(P); P.mixer.update(0);
      const ok = handsMid(P, out); if (ok && sd) (sd === 'L' ? P.handL : P.handR).getWorldPosition(out);      // (sd: that one hand, not the middle of the two)
      if (ok) P.group.worldToLocal(out);
      for (const k in P.acts) { P.acts[k].setEffectiveWeight(keep[k][0]); P.acts[k].time = keep[k][1]; }
      Object.assign(P.w, w0); personSettle(P); P.mixer.update(0);
      return ok ? out : null;
    }

    /* THE CROWD (the tracker's §12). Forty-odd people cannot each have a skeleton on a phone. Each of the eight devotee
       bodies has a few DRIVERS instead: a person nobody sees, with its mixer, wearing one take at one phase. A MEMBER of
       the crowd is that body's skins drawn again from the driver's bones, wherever the member sits (three's detached
       bind mode: the pose comes from the bones, the place from the member's own group; episode 1 chapter 3's crowd,
       v5.21). So the whole crowd breathes, sways and bows on a score of mixers. A driver stands at the world's origin,
       unturned, or every member would be thrown by its place. */
    const crowd = [];
    function mkDriver(key, o = {}) { return mkPerson(key, 0, 0, 0, Object.assign({ driver: true }, o)); }
    function mkMember(D, x, z, ry, o = {}) {
      const s = o.s || 1, M0 = { D, group: new THREE.Group(), lv: [null, null, null, null], lvNow: -1, s, o };
      M0.group.position.set(x, o.y || 0, z); M0.group.rotation.y = ry; M0.group.scale.set(o.mirror ? -s : s, s, s); (o.parent || world).add(M0.group);
      if (!o.noBlob) M0.blob = blob(M0.group, (o.blobW || 0.95) / s, (o.blobD || 0.9) / s);
      crowd.push(M0); D.members.push(M0);
      for (let i = 1; i < 4; i++) if (D.lv[i]) memberSkin(M0, i);
      return M0;
    }
    function memberSkin(M0, i) {
      const src = M0.D.lv[i]; if (!src || M0.lv[i]) return;
      M0.lv[i] = src.map(sm => { const c = sm.clone(); c.bindMode = 'detached'; c.bindMatrix.identity(); c.bindMatrixInverse.identity();
        c.frustumCulled = false; c.visible = false; M0.group.add(c); return c; });
      M0.lvNow = -1;
      if (ctx.cullBySphere) ctx.cullBySphere(M0.group, 0, 0.75, 0, 1.6);         // a sitter or a stander, and room for a bow
    }

    /* WHICH SKIN IS DRAWN, every frame, from the lens. b: a boundary is crossed only 7 % past it (no flicker). A missing
       skin is stood in for by the next fuller one that is there. `force` (a film's close shot) names a level outright. */
    function levelFor(now, d, max) {
      let lv = 0;
      for (let i = 0; i < 3; i++) { const b = LEVELS[i][1]; if (now > i ? !(d < b * 0.93) : d > b * 1.07) lv++; }
      return Math.max(lv, max);
    }
    function showLevel(X, want) {
      let k = want; while (k > 1 && !X.lv[k]) k--;                                // the far skins fall back on the near one
      if (!X.lv[k]) k = 1;
      if (!X.lv[k]) return;
      if (k === X.lvShown && X.lvNow === want) return;
      for (let i = 0; i < 4; i++) if (X.lv[i]) for (const m of X.lv[i]) m.visible = i === k;
      X.lvShown = k; X.lvNow = want;
    }
    function peopleLevels(cam = camera) {
      cam.getWorldPosition(_lens);
      for (const P of people) { if (!P.ready || P.driver) { if (P.driver && P.ready && P.lvShown !== -2) { for (let i = 0; i < 4; i++) if (P.lv[i]) for (const m of P.lv[i]) m.visible = false; P.lvShown = -2; } continue; }
        if (!P.group.visible) continue;
        /* (o.lodK: a child is two thirds of a grown body's height, and is drawn at each level two thirds as far) */
        const g = P.group.position, d = Math.hypot(g.x - _lens.x, g.y + 1.0 - _lens.y, g.z - _lens.z) / (P.o.lodK || 1);
        showLevel(P, P.force != null ? P.force : levelFor(P.lvNow < 0 ? 3 : P.lvNow, d, P.lv[0] ? 0 : 1)); }
      for (const M0 of crowd) { if (!M0.group.visible || !M0.D.ready) continue;
        const g = M0.group.position, d = Math.hypot(g.x - _lens.x, g.y + 0.8 - _lens.y, g.z - _lens.z);
        showLevel(M0, levelFor(M0.lvNow < 0 ? 3 : M0.lvNow, d, 1)); }
    }

    /* THE CAST OF DAY ONE AND DAY TWO. Who they are is the plan's §3.3. Each stands or sits where the photographs put
       their kind: the masters under their tents on the west side, the monks under the east one, Grandmaster Pho under the
       gold. (The crowd, the dancers and those who go up are placed by the play and the films.) */
    const cast = {};
    const SIT_E = Math.PI / 2, SIT_W = -Math.PI / 2;                            // seated facing east; facing west
    const REST = { Chair_Sit_Idle_M: [9.4, 2.85] };                             // the seated idle's upright window (it wraps its end)
    /* THE KNEEL'S WINDOW, there and back in 34 seconds (Chad, 12 Nov 2026: "The audience's facing left and right animation
       plays too fast and can be slowed down"). The take's own pace sent the head 24 cm round its look to either side and
       back in 13.6 s, at up to 11 cm a second (tools/probes/windowread.mjs on e4deva); at 34 s it is 4.4 at its fastest:
       a calm look round. Every kneeler wears it: the crowd (c_crowd.js SIT), the young man, Ton when he kneels */
    const SEIZA_WIN = [0.4, 6.8, 34];
    /* (and its look round RESTRAINED, a little: Chad, 13 Nov 2026, "slightly restrained so they are not looking so far
       left and so far right". 0.6 of the take's own turn about its middle: the face swept 54 and 61 degrees either side,
       now about 33 and 36 (headDamp, headturn.mjs). Every kneeler wears it with the window) */
    const SEIZA_LOOK = { seiza: [0.6] };
    const PHO_AT = benchAt(0.46, 0.04);                                          // Grandmaster Pho's place: the bench's east end
    /* each seat's top in metres, MEASURED on its model (tools/probes/seatmeasure.mjs: the sofa's cushion 0.46 and sat
       into by 3 cm; the bench's slats 0.40 and the chair's seat 0.39, each at the size b_world2.js draws it) */
    /* (v26.2 debug: the bench made again, its first seat's slats having come back from the generator torn and wavy. Its
       frame's top is where the old slats were, 0.40 of its file, and its slats lie 4 to 5 cm inside it, 0.35: the two who
       sit on it keep their height, on the frame, their robes over the slats, so nothing they sit in moved) */
    /* (the monks' armchair is drawn at 1.11 of its file, where its seat's top is 0.42 m up: 0.466. It was written here
       as 0.43, the file's own, and the three sat four centimetres into it: measured from the chair's own mesh, 12 Nov) */
    const SEATS = { sofa: 0.43, bench: 0.44, chair: 0.466 };
    /* (v26.2 debug: THE MASTERS' FEET ON THE GROUND. Set on their seats by their hips, the sitters on the sofas and the
       bench had their soles 3 to 8.5 cm under the ground: feetscan.mjs. So they sit as the monk in the middle sits
       (o.seat.down): the bottom where it was (hipOver 0.11 with sink 0.01 puts the hip joints 0.10 over the seat, the
       height they were given), each leg solved down to the ground from there, and nobody moved forward (edge: a sofa
       and a bench are not his chair)) */
    const MASTER_DOWN = { hipOver: 0.11, sink: 0.01, sole: GROUND_SOLE, edge: -9, flat: true };
    /* (and brought forward until their shins clear the front of what they sit on, as the monks are: Chad, 13 Nov 2026, "This
       lersi is clipping into the seat", of the hermit in white in this build's own test, his shins laid down through his
       sofa's cushion and his toes out of its front. `edge` is that front's distance ahead of the sitter's spot, measured on
       the models as drawn (tools/probes/glbbox.mjs): a sofa 0.846 m deep at x -10.25, its sitters at -10.17, its cushion's
       face 2 cm inside its arms; the bench 0.712 deep, the master in white 4 cm before its middle) */
    const SOFA_DOWN = Object.assign({}, MASTER_DOWN, { edge: 0.423 - 0.08 - 0.02 }), BENCH_DOWN = Object.assign({}, MASTER_DOWN, { edge: 0.356 - 0.04 });
    function buildCast() {
      const tonAt = [TON_TABLE.x + 1.25, TON_TABLE.z + 0.35];
      /* (lodK 1.25: his full model drawn to 2.75 m, not 2.2: he is talked to from 1.9 to 2.3 m, where the lighter body's soft
         face was what was seen. In the line he stands 1.8 m from the player, inside the old reach: no new cost there) */
      cast.ton = mkPerson('e4ton', tonAt[0], tonAt[1], faceTo(tonAt[0], tonAt[1], DATA.spawn.x, DATA.spawn.z), { take: 'Idle_3', talk: 'Stand_and_Chat', headDamp: SEIZA_LOOK, lodK: 1.25 });
      cast.ton.home = { x: tonAt[0], z: tonAt[1], ry: faceTo(tonAt[0], tonAt[1], DATA.spawn.x, DATA.spawn.z) };
      /* the woman at his bench stands by the low table at his right hand, turned to those who kneel (photograph 6) */
      { const [ax, az] = benchAt(1.95, 0.95), [kx, kz] = benchAt(0.3, 1.9);
        cast.aunt = mkPerson('e4bench', ax, az, faceTo(ax, az, kx, kz), { take: 'Idle_3', phase: 0.4, talk: 'Stand_and_Chat' });
        cast.aunt.home = { x: ax, z: az, ry: faceTo(ax, az, kx, kz) }; }
      /* THE YOUNG MAN WHO GOES UP at Grandmaster Pho's bench (photographs 5 and 6): the man in the group's shirt, a
         person of his own (he raises his bai sri, and goes somewhere the player cannot follow). Stood by the play, where
         his raised hands and the master's can meet on one bowl (ymPlace) */
      cast.ym = mkPerson('e4devg', PHO_AT[0], PHO_AT[1] - 1.4, 0, { take: 'seiza', centre: true, win: { seiza: SEIZA_WIN }, headDamp: SEIZA_LOOK, hidden: true, blobW: 0.95, blobD: 1.0 });
      /* (each on his sofa: its cushion's top is SEATS.sofa, his hips a little forward of the sofa's own middle) */
      const seat = (key, x, z, phase) => { const P = mkPerson(key, x, z, SIT_E, { take: 'Chair_Sit_Idle_M', centre: true, win: REST, phase, blobW: 1.0, blobD: 1.1,
        seat: { y: SEATS.sofa, takes: /^(Chair_Sit|Sitting_|handson|petals|palmover)/, down: SOFA_DOWN } }); P.home = { x, z, ry: SIT_E }; return P; };
      /* (THE BROWN HERMIT'S HANDS ON HIS LAP: Chad, 13 Nov 2026, "the brown lersi hands and arms look weird". His seated
         rest hung both arms straight down through his lap, the fingers out under the robe between his knees, as the
         monks' did before their hands were laid (o.handsOn, 'lap': palms on the thighs, elbows at his sides). The same
         rest, his; his gestures in the films are his takes', and he rests between them) */
      cast.hermitA = seat('e4hermita', -10.17, -2.2, 0.1);
      /* (v26.3: and his hands as a real man's rest on his knees, from the measure and a photograph of one: the fingers
         together, the wrist within eight degrees of straight, each finger curled down over the knee until it rests on it;
         the wrist's turn shared with the forearm, as every body's is now: handsTrue) */
      /* (his fingers are thin for his knuckles' spread, so laid over the knee they show a gap between each, whatever their
         aim (photographed, v26.3). Curled under into a loose hand further back on the thigh, they dug into the robe as if
         clutching it (photographed the same day): worse, and taken back out. What stands is the palm on the knee and the
         fingers over it, the gaps said to Chad) */
      cast.hermitA.o.handsOn = { how: 'lap', gather: 1, converge: 0.11, curl: [0.30, 0.60, 0.30], flexMax: 8 * Math.PI / 180, drape: { r: 0.008, min: 0.8, max: 1.5 } };
      cast.red = seat('e4red', -10.17, -0.95, 0.55);
      /* (v26.5: Chad, 13 Nov 2026, "Look at the fingers of the red master, its butchered". His seated rest hung his left
         hand down into his trousers, the cloth cutting the fingers off (photographed on both bodies; his joints measured
         within a real hand's ranges: the cloth, not the bones). The brown hermit's rest as it stood, solved on his body,
         set his hands at his belly with his elbows 4 to 9 cm behind his shoulders (jointscan); with the palm at his knee
         (`at` 1.0 along the thigh), as a seated man's rests (the photograph of one, v26.3), every joint of both arms
         measures within a real body's at every moment sampled. A copy each, so no man's rest is another's) */
      const kneeRest = () => { const A = cast.hermitA.o.handsOn; return Object.assign({}, A, { curl: A.curl.slice(), drape: Object.assign({}, A.drape), at: 1.0 }); };
      cast.red.o.handsOn = kneeRest();
      /* the second master in white sits at Grandmaster Pho's left on the same bench (photographs 1, 5, 6) */
      { const [wx, wz] = benchAt(-0.52, 0.04);
        cast.white = mkPerson('e4white', wx, wz, BENCH.ry, { take: 'Chair_Sit_Idle_M', centre: true, win: REST, phase: 0.8, blobW: 1.0, blobD: 1.1,
          seat: { y: SEATS.bench, takes: /^(Chair_Sit|Sitting_|handson|petals|palmover)/, down: BENCH_DOWN } }); cast.white.home = { x: wx, z: wz, ry: BENCH.ry }; }
      /* (and the master in white's: his seated rest sank his right hand into his thigh, photographed from his side; the
         same rest at his knee measures within a real body's too) */
      cast.white.o.handsOn = kneeRest();
      cast.hermitB = seat('e4hermitb', -10.17, 5.0, 0.3);
      /* (v26.6: his seated rest hung both forearms into his robe, his fingertips out of it before his knees (found
         photographing his full body, v26.5). A palm laid down on his knee wrung his wrists 56 to 77 degrees at every
         setting: his take holds his forearms rolled palm up. So his hands rest palm up on his knees, the backs of his
         hands on his robe, as a seated sage's often do. Measured (jointscan) on the running game: flat palm up at the knee,
         his right forearm turned 102 to 106 degrees, past a forearm's; each hand tipped 20 degrees onto its little
         finger's edge (palmTilt), the forearms clear, an elbow 3 to 4 cm behind his shoulder at one moment in four; the
         palm 0.16 of his thigh further on (`at` 1.16, over the front of the knee), every joint within a real body's at
         all twelve moments sampled on the running game; built, his right forearm read 100.2 degrees at one moment in
         eight, so tipped 23 degrees (0.40): within a real body's at all sixteen moments sampled) */
      /* (v26.7, set beside its reference picture (masters/v26.3/make.sh): his fingers curled as the brown hermit's are
         over a kneecap stood cupped like a beggar's, 33 to 53 degrees at their middle joints, where the picture's lie
         gently curved; his thumbs stood up off his palms; his left wrist was bent 35 degrees toward its little finger.
         So his fingers are curled about half as much at the middle and end joints (curl), his thumbs rest as his file
         rests them (thumb), and each hand's line over his knee is solved against its forearm (wristSolve)) */
      cast.hermitB.o.handsOn = Object.assign(kneeRest(), { palmUp: true, palmTilt: { L: -0.40, R: -0.40 }, at: 1.16, curl: [0.30, 0.32, 0.16], thumb: 'bind', wristSolve: true });
      /* GRANDMASTER PHO (Chad's own model, prepared over v24.38 to v24.56: masters/v24.56/PLAN.md), on his bench under
         the gold canopy, facing the offering tables and those who kneel to him. His look is D, Chad's pick ("unlit, except for the robe", v24.52):
         lookD below. His rest is the first half second of his seated take, back and forth (the rest of it is talk). Far
         across the turf he is drawn from a lighter cut of the same body (permissive: fit for distance only, v21.8). */
      /* (his rest, judged on every seated take of his file at its first and last moments: the start of his rise from
         a seat, where he sits upright with both hands on his knees; its first third of a second, back and forth. His
         talk take holds both hands out before his chest from its first frame: that is talk, not rest) */
      /* (and that third of a second is there and back in PHO_BREATH seconds, a slow breath: at the take's own pace it
         was a bob every 0.6 s, his head at 15 cm a second. Now 1.5 at its fastest: windowread.mjs) */
      const PHO_BREATH = 6;
      /* (HIS HEAD WHEN HE TALKS, GREATLY RESTRAINED: Chad, 13 Nov 2026, "When grandmaster pho talks, his head also moves too
         much to the right, i think the head movement can be greatly restrained". His talk turned his face from 5 degrees
         to his left to 56 to his right (headturn.mjs); now 0.3 of that turn, about his rest, which faces his front) */
      const PHO_TALK_HEAD = { Sitting_Answering_Questions: [0.3, 'Sit_to_Stand_Transition_M'] };
      cast.pho = mkPerson('pho', PHO_AT[0], PHO_AT[1], BENCH.ry, { take: 'Sit_to_Stand_Transition_M', centre: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] }, seat: { y: SEATS.bench, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { knees: 'keep', tuck: true }), rise: 'Sit_to_Stand_Transition_M' }, skins: { 3: 'phof' }, look: lookD, blobW: 1.1, blobD: 1.2,
        talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD });
      cast.pho.home = { x: PHO_AT[0], z: PHO_AT[1], ry: BENCH.ry };
      /* THE MONKS' ROW under the east tent, on chairs, facing the turf (photograph 2): THREE DIFFERENT MONKS (Chad,
         12 Nov 2026: "the 3 monks are the same model, can we have different monks? And their body is clipping through
         the seats"). His own monk (declared: `reuse`) keeps the middle chair, his far skin episode 3's row; either
         side of him sit two made here end to end (an older, heavy monk in deep maroon and a slim young one in a dark
         reddish brown: photograph 2's row is mixed, and the tracker's §5 has their ids).
         THE TWO NEW MONKS wear the library's seated idle and sit as men sit on a chair: set down by their soles and
         brought forward by their shins (o.seat.legs), which on a seat 0.93 m deep is its front; their hands laid on
         their laps where the robe is drawn (o.handsOn). Each rests on 1.3 s of the idle's upright end (10.0 to 0.6 s
         of it: the head goes 4 cm a way; the masters' longer window catches the start of its lean, 18 cm), there and
         back in seven and a half and six and a half seconds, so no two breathe together: windowread.mjs.
         HIS MONK SITS ON THE CHAIR WITH HIS FEET DOWN, as photograph 2's monks sit (cross-legged on it was tried and
         refused by photograph: his feet went through the chair's sides). Every chair-sit his file has perches, made
         for a seat some 8 cm higher (the hip joints 17 cm over the knees, the thighs sloping thirty-three degrees:
         sitread.mjs), so his bottom is set on the seat and each leg solved down to the ground from it (o.seat.down,
         seatDown). His hands are laid on his thighs as the others' are; he rests on 0.6 s of his thumbs-up take
         where its end runs into its start, the thumb down (sitread.mjs), there and back in nine seconds */
      const MONK_SEAT = { y: SEATS.chair, takes: /^Chair_Sit/, legs: { edge: MONKS.x - (MONKS.chair - MONKS.half), r: 0.055, apron: 0.14, sole: -0.005 } };
      const MONK_HANDS = { how: 'lap' };
      cast.monks = [
        mkPerson('e4monkb', MONKS.x, MONKS.zs[0], SIT_W, { take: 'Chair_Sit_Idle_M', centre: true, win: { Chair_Sit_Idle_M: [10.0, 1.3, 7.5] }, phase: 0.05, seat: MONK_SEAT, handsOn: MONK_HANDS, blobW: 1.0, blobD: 1.1 }),
        mkPerson('monkshop', MONKS.x, MONKS.zs[1], SIT_W, { take: 'Sit_Thumbs_Up_Right', centre: true, win: { Sit_Thumbs_Up_Right: [3.5, 0.6, 9] }, phase: 0.5,
          seat: { y: SEATS.chair, takes: /^Sit_Thumbs/, down: { edge: MONKS.x - (MONKS.chair - MONKS.half), r: 0.055, apron: 0.14, sole: -0.005, sink: 0.01 } },
          handsOn: { how: 'lap', out: 0.035, inner: 0, turn: 0.2 }, skins: { 3: 'monkrow' }, blobW: 1.0, blobD: 1.1 }),
        mkPerson('e4monkc', MONKS.x, MONKS.zs[2], SIT_W, { take: 'Chair_Sit_Idle_M', centre: true, win: { Chair_Sit_Idle_M: [10.0, 1.3, 6.5] }, phase: 0.85, seat: MONK_SEAT, handsOn: MONK_HANDS, blobW: 1.0, blobD: 1.1 })];
    }
    /* LOOK D on Grandmaster Pho: after the tone mapping, the scan's own colour is laid back wherever the texel is
       saturated (his skin, his beads, the gold) and over the whole of his face-and-hands part; the white robe keeps the
       scene's light and its folds. `level` scales the laid colour to the hour (an unlit colour ignores the sun: at dawn
       or by candle it must be dimmed by hand): look() sets it. tools/probes/phoingame.mjs is where it was proved.
       `lift` (M8): THE MAN IN WHITE MUST READ WHITE. Day two is a backlit dawn (its sun behind his bench): the robe,
       lit only by the sky there, came out mid-grey under a face laid at 0.86, in every close shot of the morning: a
       teacher in grey, darker than his own skin. So where the robe's lit colour falls under nine tenths of its own
       colour at that hour, it is lifted `lift` of the way back to it: never past it, and nothing where the sun already
       has it brighter. Its folds stay: they are the light's (kept in part) and the scan's own. Photographed at 0, 0.4,
       0.55 and 0.75 in the morning's close shot and at 0 and 0.55 on day one (masters/v26.0: the tracker's log, M8):
       0.55 is white with its folds; 0.75 is whiter and flat. Under his canopy he sits in shade on day one too, and is
       lifted there as well: among three hundred in white, he is the one who reads as white. */
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
    buildCast();
    /* THE DANCERS (§4.1 P3: "dancers in traditional thai clothes ... dancing to show respect to the tewadas", Chad). Six
       women in white and gold on the open turf, in two rows of three, turned to Grandmaster Pho's canopy: two bodies,
       each drawn three times from one hidden driver (they dance in unison, as a troupe does), every other one mirrored.
       The film of the festival poses the two drivers from its own clock. In PLAY they are on the ground all of day one
       (c_crowd.js, "the dancers on the ground": they wait, they cross ahead of him, they stand by after their dance), so
       a driver rests in its stand and its walk's pace is measured; the film stands them on their dance places. */
    const danceG = new THREE.Group(); danceG.visible = false; world.add(danceG);
    const DANCE = { c: [0.2, -2.6], gap: 1.35, row: 0.75 };
    /* THEIR WALK-DANCE is written for them (masters/v26.0/people/MOTIONS.txt `walkdance2`; Chad, 12 Nov 2026: "this
       looping walk dance is just like a simple walk and dance at the same time"): she walks with small steps, both
       arms out from her sides, rising and falling in turn. Two of its cycles, heel to heel (4.633 to 7.4 s: gait.mjs,
       where its pace has settled: 0.92 m a second, straight ahead within a degree), made a loop; the file walks it
       slowed to a dance's pace (c_crowd.js DWALK.rate). The walk written for their one crossing, `procession`, went
       with that crossing (its take is out of their files; the motion is kept in masters/v26.0/src). The library's
       walk on them was a stride: photographed crossing the ground, and refused. */
    const DLOOP = { walkdance: [4.633, 7.4, 0.35] };
    /* (each body's feet set on the turf by her own measure, gait.mjs: in this walk the second dancer's ankles never come
       lower than 10.5 cm, where they stand at 8.3 at rest: she walked two and a half centimetres over the grass. The
       first dancer's come to 7.5 and 8.1 against 8.1: left as they are) */
    const dancers = { A: mkDriver('e4dancera', { take: 'Idle_3', pace: true, loops: DLOOP }),
                      B: mkDriver('e4dancerb', { take: 'Idle_3', pace: true, phase: 0.37, loops: DLOOP, sink: { walkdance: 0.024 } }), at: [], ry: 0, m: [] };
    { const fx = PHO_AT[0] - DANCE.c[0], fz = PHO_AT[1] - DANCE.c[1], fl = Math.hypot(fx, fz), f = [fx / fl, fz / fl], r = [f[1], -f[0]], ry = Math.atan2(f[0], f[1]);
      for (let row = 0; row < 2; row++) for (let k = -1; k <= 1; k++) { const x = DANCE.c[0] + f[0] * (row ? -DANCE.row : DANCE.row) + r[0] * k * DANCE.gap, z = DANCE.c[1] + f[1] * (row ? -DANCE.row : DANCE.row) + r[1] * k * DANCE.gap;
        const D = (row + k + 2) % 2 ? dancers.B : dancers.A;
        dancers.m.push(mkMember(D, x, z, ry, { parent: danceG, mirror: k === 1 || (row === 1 && k === 0), s: 0.97 + 0.02 * ((row * 3 + k + 4) % 3), blobW: 0.8, blobD: 0.7 })); dancers.at.push([x, z]); }
      dancers.ry = ry; }
    /* THOSE WHO GO UP at the west tent in the film (photographs 11 and 12): a woman who raises her bai sri to the hermit
       and goes quite still; a man heaped with petals whose arms rise wide (his own take's upper body on a grounded
       kneel: o.mix). Each is stood where his hands and the master's can meet (meetHands) */
    cast.goA = mkPerson('e4deva', -9.2, -2.2, Math.PI / 2 * -1, { take: 'seiza', centre: true, hidden: true, blobW: 0.95, blobD: 1.0 });
    cast.goB = mkPerson('e4devc', -9.2, -0.95, Math.PI / 2 * -1, { take: 'seiza', centre: true, hidden: true, blobW: 0.95, blobD: 1.0, mix: [['armsup', 'armsopen', 'seiza', 0.5]] });
    /* PETALS LYING ON A BODY (photograph 12: "heaped with petals from his hair to his lap"). Each petal is laid on the
       body's own surface in its bind pose and given to the bone under it (the crown to the head, the shoulders to the
       collar bones, the lap to the thighs: a thigh's front is its top when a man kneels), so it rides him as he moves,
       and no height is guessed: the top of his hair and of his shoulders and the front of his thighs are read from his
       own skin. (My first heap was seventy clusters at heights typed in his group's frame: they stood inside his head
       and his shoulders, and the photograph showed a man with a few petals in his lap.) */
    function petalsOn(P, o = {}) {
      const skins = P.lv[1]; if (!skins || !skins.length) return null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const bindOf = (b) => { if (!b) return null; for (const sm of skins) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; };
      const at = (b) => { const m = bindOf(b); return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
      const pts = [], v = new THREE.Vector3();
      for (const sm of skins) { const pos = sm.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(sm.bindMatrix); pts.push(v.x, v.y, v.z); } }
      /* the skin's top over a spot of the floor plan, and its front before a spot of the body's front view */
      const topAt = (x, z, r, y0, y1) => { let m = -Infinity; const r2 = r * r; for (let i = 0; i < pts.length; i += 3) { const y = pts[i + 1]; if (y <= m || y < y0 || y > y1) continue; const dx = pts[i] - x, dz = pts[i + 2] - z; if (dx * dx + dz * dz <= r2) m = y; } return m; };
      const frontAt = (x, y, r, z0, z1) => { let m = -Infinity; const r2 = r * r; for (let i = 0; i < pts.length; i += 3) { const z = pts[i + 2]; if (z <= m || z < z0 || z > z1) continue; const dx = pts[i] - x, dy = pts[i + 1] - y; if (dx * dx + dy * dy <= r2) m = z; } return m; };
      const rnd = rng(o.seed || 9911), col = new THREE.Color(), e = new THREE.Euler(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0), nn = new THREE.Vector3(), made = [];
      /* one bone's petals: `spots` answers [x, y, z, nx, ny, nz] in the bind pose, or null where there is no skin */
      const strew = (b, n, spots) => { const mb = bindOf(b); if (!mb) return; const inv = mb.clone().invert(), im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), petalAirMat, n); let k = 0;
        for (let i = 0; i < n * 3 && k < n; i++) { const sp = spots(); if (!sp) continue;
          nn.set(sp[3], sp[4], sp[5]).normalize(); q.setFromUnitVectors(up, nn); e.set(-Math.PI / 2 + (rnd() - 0.5) * 0.5, rnd() * 6.283, (rnd() - 0.5) * 0.5, 'YXZ'); q.multiply(q2.setFromEuler(e));
          const sz = (o.s || 0.042) * (0.75 + rnd() * 0.6);
          m4.compose(v.set(sp[0], sp[1], sp[2]).addScaledVector(nn, 0.004 + rnd() * 0.006), q, _ws.set(sz, sz, sz)).premultiply(inv);
          im.setMatrixAt(k, m4); im.setColorAt(k, col.setHSL(0.105 + rnd() * 0.04, 0.98, 0.5 + rnd() * 0.06, THREE.SRGBColorSpace)); k++; }
        im.count = k; _ws.set(1, 1, 1); im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.frustumCulled = false; b.add(im); owned.push(im); made.push(im); };
      /* his hair: a cap round the crown, and forward onto his fringe (his face lifts in the trance: the crown tips
         away from whoever stands before him) */
      const ph = at(P.head);
      if (ph && o.head) strew(P.head, o.head, () => { const a = rnd() * 6.283, d = 0.1 * Math.sqrt(rnd()), dx = Math.cos(a) * d, dz = Math.sin(a) * d + 0.035, y = topAt(ph.x + dx, ph.z + dz, 0.022, ph.y + 0.04, ph.y + 0.45);
        return y > -1e9 ? [ph.x + dx, y, ph.z + dz, dx * 7, 1, dz * 7] : null; });
      /* his chest: a few caught in the folds of his shirt, high on it */
      const sp = bone('Spine2') || bone('Spine02') || bone('Spine1') || bone('Spine01'), pn = at(bone('LeftArm')), pm = at(bone('RightArm'));
      if (sp && pn && pm && o.chest) { const cy = (pn.y + pm.y) / 2, cx = (pn.x + pm.x) / 2, hw = Math.abs(pn.x - pm.x) / 2;
        strew(sp, o.chest, () => { const x = cx + (rnd() - 0.5) * 2 * hw * 0.8, y = cy - 0.03 - rnd() * 0.2, z = frontAt(x, y, 0.024, pn.z - 0.05, pn.z + 0.3);
          return z > -1e9 ? [x, y, z, (x - cx) * 2, 0.5, 1] : null; }); }
      /* his shoulders: along each collar bone, from beside the neck out to the arm */
      if (o.shoulders) for (const S0 of ['Left', 'Right']) { const cb = bone(S0 + 'Shoulder'), pa = at(bone(S0 + 'Arm')), pc = at(cb); if (!cb || !pa || !pc) continue;
        strew(cb, o.shoulders, () => { const u = 0.25 + rnd() * 0.8, x = pc.x + (pa.x - pc.x) * u, z = pc.z + (pa.z - pc.z) * u + (rnd() - 0.5) * 0.09, y = topAt(x, z, 0.022, pa.y - 0.06, pa.y + 0.14);
          return y > -1e9 ? [x, y, z, (pa.x - pc.x) * 0.6, 1, (z - pa.z) * 3] : null; }); }
      /* his lap: down the front of each thigh (which is its top, kneeling) */
      if (o.lap) for (const S0 of ['Left', 'Right']) { const tb = bone(S0 + 'UpLeg'), p0 = at(tb), p1 = at(bone(S0 + 'Leg')); if (!tb || !p0 || !p1) continue;
        strew(tb, o.lap, () => { const u = 0.06 + rnd() * 0.84, x = p0.x + (p1.x - p0.x) * u + (rnd() - 0.5) * 0.11, y = p0.y + (p1.y - p0.y) * u, z = frontAt(x, y, 0.024, p0.z - 0.02, p0.z + 0.3);
          return z > -1e9 ? [x, y, z, (x - p0.x) * 4, 0, 1] : null; }); }
      return made;
    }
    whenReady(cast.goB, (P) => { cast.goB.heap = petalsOn(P, { head: 64, shoulders: 30, chest: 14, lap: 60, seed: 9911 }); });
    /* a kneeler stood where his raised hands and a master's laid forward stand over one another (both measured on the
       bodies at the moments named); answers the two heights */
    const _mha = new THREE.Vector3(), _mhb = new THREE.Vector3();
    function meetHands(M0, mTake, mT, K0, kTake, kT) {
      const hp = handsAt(M0, mTake, mT, _mha), hy = handsAt(K0, kTake, kT, _mhb);
      if (!hp || !hy) return null;
      M0.group.updateWorldMatrix(true, false); M0.group.localToWorld(hp); K0.group.updateWorldMatrix(true, false); K0.group.localToWorld(hy);
      K0.group.position.x += hp.x - hy.x; K0.group.position.z += hp.z - hy.z;
      return { master: hp.y, kneeler: hy.y };
    }
    /* those of the cast who STAND where he walks are things he walks round: a column each, set where its person stands
       (the engine walks the very list it was handed, so a box is moved in place, and lifted clear when its person is
       not on the ground) */
    /* THE FOUR WHO WAIT THEIR TURN (ending C: "An old man. Two women. A young man ... Nobody is in distress; they are
       waiting"): people of their own, so each can look where he looks. The other endings borrow them: one kneels to
       Grandmaster Pho in ending B's afternoon while two wait; two roll mats and one carries one in ending A. Hidden
       until an ending stands them (a hidden person is not run: peopleTick) */
    const WAIT_AT = [[2.3, 3.0], [2.95, 3.35], [3.5, 3.85], [4.2, 4.05]].map(([a, b]) => benchAt(a, b));
    cast.wait = ['e4devh', 'e4deve', 'e4devb', 'e4devc'].map((key, i) => { const [x, z] = WAIT_AT[i];
      const P = mkPerson(key, x, z, faceTo(x, z, PHO_AT[0], PHO_AT[1]), { take: 'Idle_3', hidden: true, phase: 0.17 + 0.23 * i, blobW: 0.8, blobD: 0.7 });
      P.home = { x, z, ry: faceTo(x, z, PHO_AT[0], PHO_AT[1]) }; return P; });
    const castBlock = {};
    for (const k of ['ton', 'aunt']) castBlock[k] = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
    function castSolid() { for (const k in castBlock) { const P = cast[k], b = castBlock[k], on = !!(P && P.group.visible && !P.hidden && !P.noBlock), g = P.group.position, r = 0.45;
      b.min.set(g.x - r, on ? 0 : 60, g.z - r); b.max.set(g.x + r, on ? 1.5 : 61, g.z + r); } }
    for (const k in castBlock) whenReady(cast[k], castSolid);


