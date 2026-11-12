    /* ================================================================ THE CROWD OF DAY ONE (the plan's §3.3; photographs 1, 8, 10, 12)
       Devotees in white on the turf. Eight bodies were made for them; a crowd of copies reads as copies, so WHO SITS WHERE
       IS SOLVED (Chad's rule, v5.29): a balanced deal of the eight over the places, then a seeded local search that swaps
       two people whenever the swap puts the same body further from its own copies; every other one is mirrored and each
       is a little taller or shorter. `stage.crowdStats()` reports what the solve reached, so the claim can be checked.

       Each body has three drivers (c_cast.js): two kneeling at different moments, one standing. So the people of one
       body do not all breathe together, and the whole crowd is twenty-four mixers.

       THE PHOTOGRAPHS SHOW THREE CROWDS, NOT ONE (the tracker's §12 "Formations"), so the same forty-seven people have a
       FORMATION for each: `arrive` (photograph 10: loose kneeling rows facing the offering tables, a line waiting at
       them, twos and threes at the edges), and `bless` (photographs 1, 5, 6, 11, 12: a throng kneeling before each
       master's seat, friends standing behind, a line at Grandmaster Pho's bench). A person keeps his body, his size and
       whether he kneels or stands; which seat he takes in a formation is solved the same way. A formation is changed in
       the black or on a cut, never under the player's eye (v24.12). Day two has nobody on the turf but two far off. */
    const DEVOTEES = ['e4deva', 'e4devb', 'e4devc', 'e4devd', 'e4deve', 'e4devf', 'e4devg', 'e4devh'];
    const crowdSeats = [];                                                       // the people: { kind: 'sit' | 'stand', body, mirror, s, half, member, at: { formation: seat } }
    const FORMS = { arrive: [], bless: [], photo: [] };
    /* the group's photograph (photograph 8): twelve kneel in one row before the offering tables, facing south */
    const PHOTO = { x0: -3.3, dx: 0.6, z: -5.2 };                                     // each: [{ x, z, ry, kind }]
    const crowdDrivers = {};                                                     // key -> { A, B, S }
    const crowdBlock = [], dawnBlock = [];
    let formNow = '';
    /* the line of sight from where Grandmaster Pho sits to the one who kneels to him, and the line that waits behind */
    const LANE = { a0: -0.35, a1: 1.45 };
    function planCrowd() {
      const R = rng(41203);
      const aim = (x, z) => faceTo(x, z, 0, -11.2);                              // toward the offering tables
      const A = FORMS.arrive, Bf = FORMS.bless;
      /* ---- ARRIVE. The sitting blocks: a jittered grid in each, and only so many of its places taken (loose rows) */
      const block = (x0, x1, z0, z1, n) => { const cells = [];
        for (let z = z0; z <= z1 + 1e-6; z += 1.18) for (let x = x0 + ((Math.round((z - z0) / 1.18) % 2) ? 0.5 : 0); x <= x1 + 1e-6; x += 1.08) cells.push([x, z]);
        for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
        for (const [x, z] of cells.slice(0, n)) { const px = x + (R() - 0.5) * 0.3, pz = z + (R() - 0.5) * 0.3;
          A.push({ x: px, z: pz, ry: aim(px, pz) + (R() - 0.5) * 0.3, kind: 'sit' }); } };
      block(-8.2, -3.4, 2.6, 6.6, 12);          // south-west of the middle (clear of his own place at its north-east corner)
      block(2.2, 5.4, 1.4, 5.2, 6);             // south-east, short of the chief canopy
      block(-6.4, -2.4, -6.6, -2.8, 8);         // north-west, before the west tent
      block(2.4, 6.4, -7.2, -3.6, 6);           // north-east, before the monks
      /* those who stand: in twos and threes at the edges, turned to one another or to the tables */
      const pair = (F, x, z, n, r = 0.55) => { const a0 = R() * 6.283;
        for (let i = 0; i < n; i++) { const a = a0 + i * 6.283 / n, px = x + Math.sin(a) * r, pz = z + Math.cos(a) * r;
          F.push({ x: px, z: pz, ry: n > 1 ? faceTo(px, pz, x, z) + (R() - 0.5) * 0.4 : aim(px, pz), kind: 'stand' }); } };
      pair(A, -8.6, 10.6, 2); pair(A, 9.6, 3.6, 3, 0.62); pair(A, 8.9, 6.2, 1); pair(A, -9.6, -8.4, 2); pair(A, 4.4, -8.9, 2); pair(A, -1.9, 10.9, 1);
      /* the line waiting its turn at the offering tables (photograph 10), east of the middle so the way up it is his */
      for (let i = 0; i < 4; i++) { const px = 1.55 + (R() - 0.5) * 0.16, pz = -8.5 + i * 0.92 + (R() - 0.5) * 0.1; A.push({ x: px, z: pz, ry: aim(px, pz) + (R() - 0.5) * 0.16, kind: 'stand' }); }

      /* ---- BLESS. A throng kneels before each master's seat and faces him; their friends stand behind */
      const sitTo = (x, z, tx, tz) => Bf.push({ x: x + (R() - 0.5) * 0.18, z: z + (R() - 0.5) * 0.18, ry: faceTo(x, z, tx, tz) + (R() - 0.5) * 0.22, kind: 'sit' });
      const standTo = (x, z, tx, tz) => Bf.push({ x, z, ry: faceTo(x, z, tx, tz) + (R() - 0.5) * 0.3, kind: 'stand' });
      const bA = (a, b) => benchAt(a, b), PH = PHO_AT;
      /* before Grandmaster Pho's bench, either side of the lane the line comes up (ten) */
      for (const [a, b] of [[-1.55, 2.0], [-0.95, 2.35], [-2.65, 2.15], [-2.1, 2.95], [-1.4, 3.1], [2.0, 3.25], [2.5, 2.4], [-1.75, 4.0], [1.9, 4.2], [2.7, 3.5]]) { const [x, z] = bA(a, b); sitTo(x, z, PH[0], PH[1]); }
      /* before the hermit in brown and the master in red, on the mats under the west tent (nine); the two places right
         before their sofas are kept for those who go up */
      const iWest = Bf.length;
      for (const [x, z] of [[-8.3, -3.1], [-8.2, -1.55], [-8.3, 0.0], [-7.4, -2.6], [-7.3, -1.3], [-7.4, -0.2], [-7.3, 0.85], [-6.4, -2.0], [-6.3, -0.8]]) sitTo(x, z, -10.2, z > -1.6 ? -0.95 : -2.2);
      /* before the hermit in the yellow shawl (five) */
      for (const [x, z] of [[-8.4, 4.2], [-8.3, 5.8], [-7.4, 4.0], [-7.5, 5.1], [-7.4, 6.2]]) sitTo(x, z, -10.2, 5.0);
      /* before the monks' row (five) */
      for (const [x, z] of [[8.4, -3.4], [8.5, -2.2], [8.4, -1.0], [7.4, -2.8], [7.5, -1.6]]) sitTo(x, z, 10.2, -2.0);
      /* on the open turf, facing the tables (three) */
      const iOpen = Bf.length;
      for (const [x, z] of [[-3.4, -5.6], [-2.3, -5.1], [2.6, -5.4]]) sitTo(x, z, 0, -11.2);
      /* the line at his bench, behind the place the player stands (three); friends at the throng's edge (three) */
      for (const [a, b] of [[0.9, 4.2], [0.98, 5.1], [0.84, 6.0]]) { const [x, z] = bA(a, b); standTo(x, z, PH[0], PH[1]); }
      for (const [a, b] of [[-2.9, 3.7], [3.0, 3.2], [3.3, 2.1]]) { const [x, z] = bA(a, b); standTo(x, z, PH[0], PH[1]); }
      /* behind the kneelers at the west tents (three); at the tables (two); by the monks (one); talking at the edges (three) */
      standTo(-5.5, -2.9, -10.2, -2.2); standTo(-5.4, -0.4, -10.2, -0.95); standTo(-6.3, 5.2, -10.2, 5.0);
      standTo(1.3, -8.7, 0, -11.2); standTo(-1.6, -8.8, 0, -11.2);
      standTo(6.5, -0.3, 10.2, -2.0);
      pair(Bf, -8.7, 10.6, 2); pair(Bf, 9.5, 4.0, 1);
      for (const k of ['sit', 'stand']) if (A.filter(s => s.kind === k).length !== Bf.filter(s => s.kind === k).length)
        console.warn('the crowd: ' + A.filter(s => s.kind === k).length + ' ' + k + ' at the way in, ' + Bf.filter(s => s.kind === k).length + ' at the blessing');

      /* THE SOLVE. A formation's cost: a pair of the same body costs the square of what they lack of six metres apart.
         ARRIVE deals the bodies evenly over its seats, then swaps bodies; each later formation gives the same people
         its own seats of their kind, then swaps two people's seats (same kind) while that parts copies further. */
      const N = A.length, body = new Int32Array(N);
      const order = Array.from({ length: N }, (_, i) => i);
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      order.forEach((seat, k) => { body[seat] = k % DEVOTEES.length; });
      const solve = (seatOf, canSwap, swap) => { let swaps = 0;
        const pairCost = (i, j) => { if (body[i] !== body[j]) return 0; const a = seatOf(i), b = seatOf(j), d = Math.hypot(a.x - b.x, a.z - b.z); return d < 6 ? (6 - d) * (6 - d) : 0; };
        const costOf = (i) => { let c = 0; for (let j = 0; j < N; j++) if (j !== i) c += pairCost(i, j); return c; };
        for (let it = 0; it < 6000; it++) { const a = Math.floor(R() * N), b = Math.floor(R() * N); if (a === b || !canSwap(a, b)) continue;
          const before = costOf(a) + costOf(b); swap(a, b);
          if (costOf(a) + costOf(b) < before - 1e-9) swaps++; else swap(a, b); }
        return swaps; };
      const swapsA = solve((i) => A[i], (a, b) => body[a] !== body[b], (a, b) => { const t = body[a]; body[a] = body[b]; body[b] = t; });
      for (let i = 0; i < N; i++) crowdSeats.push({ kind: A[i].kind, body: body[i], mirror: R() < 0.5, s: 0.955 + R() * 0.085, half: R() < 0.5 ? 'A' : 'B', at: { arrive: A[i] } });
      /* bless: the people of each kind onto that kind's seats in order, then the swaps */
      const seatB = new Int32Array(N); { const free = { sit: [], stand: [] }; Bf.forEach((s, k) => free[s.kind].push(k)); for (let i = 0; i < N; i++) seatB[i] = free[crowdSeats[i].kind].shift(); }
      const swapsB = solve((i) => Bf[seatB[i]], (a, b) => crowdSeats[a].kind === crowdSeats[b].kind && body[a] !== body[b], (a, b) => { const t = seatB[a]; seatB[a] = seatB[b]; seatB[b] = t; });
      for (let i = 0; i < N; i++) crowdSeats[i].at.bless = Bf[seatB[i]];
      /* PHOTO (photograph 8: "Twelve devotees in white kneel in a row on bright green turf, hands joined. Behind them
         stand eleven masters"): the blessing's ground, but the nine who knelt before the west tent's two masters and the
         three on the open turf kneel in one row before the offering tables, turned to the one who takes the picture.
         Everyone keeps his blessing seat's kind; then the same swaps, so no body kneels beside itself. (Made after
         everything above: the stream's numbers for the way in and the blessing are the ones they were.) */
      const Pf = FORMS.photo; for (const s0 of Bf) Pf.push(Object.assign({}, s0));
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => iWest + i).concat([iOpen, iOpen + 1, iOpen + 2]).forEach((si, k) => {
        Pf[si] = { x: PHOTO.x0 + k * PHOTO.dx + (R() - 0.5) * 0.07, z: PHOTO.z + (R() - 0.5) * 0.09, ry: (R() - 0.5) * 0.1, kind: 'sit' }; });
      const seatP = Int32Array.from(seatB);
      const swapsP = solve((i) => Pf[seatP[i]], (a, b) => crowdSeats[a].kind === crowdSeats[b].kind && body[a] !== body[b], (a, b) => { const t = seatP[a]; seatP[a] = seatP[b]; seatP[b] = t; });
      for (let i = 0; i < N; i++) crowdSeats[i].at.photo = Pf[seatP[i]];
      crowdSeats.swaps = { arrive: swapsA, bless: swapsB, photo: swapsP };
    }
    function crowdStats(form = formNow || 'arrive') {
      const N = crowdSeats.length, per = DEVOTEES.map(() => 0); let near = Infinity, sum = 0, touching = 0;
      const at = (i) => crowdSeats[i].at[form];
      for (let i = 0; i < N; i++) { per[crowdSeats[i].body]++; let best = Infinity;
        for (let j = 0; j < N; j++) if (j !== i && crowdSeats[j].body === crowdSeats[i].body) best = Math.min(best, Math.hypot(at(i).x - at(j).x, at(i).z - at(j).z));
        near = Math.min(near, best); sum += best; if (best < 1.6) touching++; }
      return { formation: form, people: N, sitting: crowdSeats.filter(s => s.kind === 'sit').length, standing: crowdSeats.filter(s => s.kind === 'stand').length,
               perBody: per, nearestSameBody: +near.toFixed(2), meanNearestSameBody: +(sum / N).toFixed(2), sameBodyWithin1m6: touching, swaps: crowdSeats.swaps[form], drivers: Object.keys(crowdDrivers).length * 3 };
    }
    /* each kneeling driver's rest: A sits on the heels, B sits too at the way in and holds a kneeling wai at the blessing
       (the krap's first second, back and forth); the bows of the homage are spans on both */
    const SIT = { seiza: SEIZA_WIN }, WAI = [0.15, 0.85];
    /* (each driver starts at its own place round the kneel's slower cycle: a person's clock starts at ten times its phase, so
       the phases are spread over 3.4 to keep the kneelers as far apart round it as they were round the take's own 13.6 s) */
    const SITSPREAD = SEIZA_WIN[2] / 10;
    function buildCrowd() {
      planCrowd();
      for (const key of DEVOTEES) crowdDrivers[key] = {
        A: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: (0.07 + 0.11 * DEVOTEES.indexOf(key)) * SITSPREAD }),
        B: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: (0.55 + 0.09 * DEVOTEES.indexOf(key)) * SITSPREAD, rate: 0.86 }),
        S: mkDriver(key, { take: 'Idle_3', centre: true, phase: 0.13 * DEVOTEES.indexOf(key) }) };
      for (const s of crowdSeats) { const D = crowdDrivers[DEVOTEES[s.body]][s.kind === 'stand' ? 'S' : s.half], p = s.at.arrive;
        s.member = mkMember(D, p.x, p.z, p.ry, { s: s.s, mirror: s.mirror, parent: dayOne, blobW: s.kind === 'stand' ? 0.8 : 0.95, blobD: s.kind === 'stand' ? 0.7 : 1.0 });
        /* a person is a thing he walks round: a column from the ground (collide() samples at a metre) */
        const r = 0.3; s.block = new THREE.Box3(new THREE.Vector3(p.x - r, 0, p.z - r), new THREE.Vector3(p.x + r, 1.5, p.z + r)); crowdBlock.push(s.block); }
      formNow = 'arrive';
      /* day two: two people far off by the offering tables, clearing up (the ground is not quite empty: §4.3) */
      for (const [key, x, z, ry] of [['e4devb', -3.3, -9.25, 2.6], ['e4devh', 3.9, -9.3, -2.2]]) { mkMember(crowdDrivers[key].S, x, z, ry, { parent: dayTwo, blobW: 0.8, blobD: 0.7 });
        dawnBlock.push(new THREE.Box3(new THREE.Vector3(x - 0.3, 60, z - 0.3), new THREE.Vector3(x + 0.3, 61, z + 0.3))); }
    }
    /* THE FORMATION, by name: every member onto his seat in it, his column with him; the kneelers' second driver to the
       pose the formation asks. Called in the black or on a cut. */
    function setFormation(name) {
      if (!FORMS[name]) return;
      formNow = name;
      const on = dayOne.visible, r = 0.3;
      for (const s of crowdSeats) { const p = s.at[name]; s.member.group.position.set(p.x, 0, p.z); s.member.group.rotation.y = p.ry; s.member.lvNow = -1;
        s.block.min.set(p.x - r, on ? 0 : 60, p.z - r); s.block.max.set(p.x + r, on ? 1.5 : 61, p.z + r); }
      for (const key of DEVOTEES) { const D = crowdDrivers[key];
        if (name === 'bless' || name === 'photo') hold(D.B, 'prostrate', WAI[0], WAI[1], 0); else rest(D.B, 0);
        rest(D.A, 0); rest(D.S, 0); }
      { let sx = 0, sz = 0; for (const s of crowdSeats) { sx += s.at[name].x; sz += s.at[name].z; } crowdMid.x = sx / crowdSeats.length; crowdMid.z = sz / crowdSeats.length; }
      kidsForm(name); dancersForm(name); extrasLive();
    }
    /* (the middle of the crowd as it sits now: the crowd's own noise is fullest there, d_play.js mixBeds) */
    const crowdMid = { x: 0, z: 0 };
    /* THE WHOLE GROUND BOWS (the homage): every kneeling driver makes the krap once, from the kneeling wai down to the
       ground and back, over `secs`; the members follow because they are drawn from its bones. Then each is back at rest */
    const KRAP = { from: 0.2, to: 6.75 };
    function crowdBow(secs, last) {
      for (const key of DEVOTEES) for (const h of ['A', 'B']) { const D = crowdDrivers[key][h];
        span(D, 'prostrate', KRAP.from, KRAP.to, secs * (h === 'B' ? 1.0 : 0.96), { fade: 0.5, hold: last ? 0 : -0.35, then: last ? (P) => rest(P, 0.9) : null }); }
    }
    /* the crowd's columns stand only while the crowd does: the engine walks the very list it was handed, so each box is
       lifted clear of his head height when the crowd is gone, and set down again when it is back */
    function crowdSolid(on) { for (const b of crowdBlock) { b.min.y = on ? 0 : 60; b.max.y = on ? 1.5 : 61; }
      const two = dayTwo.visible; for (const b of dawnBlock) { b.min.y = two ? 0 : 60; b.max.y = two ? 1.5 : 61; }
      crowdLive(); }
    /* a driver nobody wears on this day is not run (twenty-four mixers for a crowd that is not drawn are a phone's heat
       for nothing: v15.0) */
    function crowdLive() {
      for (const P of people) { if (!P.driver) continue;
        P.idle = !P.members.some(m => m.group.visible && (!m.group.parent || m.group.parent.visible)); }
      extrasLive();
    }
    buildCrowd();

    /* ================================================================ THE WOMAN WITH THE TAPER
       (the plan's 4.1 P1: "a woman ahead of him lighting hers with a long taper"; photograph 10: at the head of the line
       that waits at the offering tables a woman in white holds a long yellow taper to the candles on the front step.)
       Found unbuilt by the audit of 12 Nov. A person of her own at the head of the game's line while the ground gathers
       (the `arrive` formation), nobody of the photograph copied: the young woman with the ponytail (the long-haired
       woman's body stands third in that same line: counted). Her LEFT hand carries the taper, the side he comes up on:
       its tip goes from one small candle's wick to the next, is drawn back, and goes again, on the day's own clock; her
       elbow stays at her side and her eyes are on the flame. The taper is a real model (w3taper, 0.70 m) laid along her
       fingers, and a flame stands on its tip. */
    /* (`hinge`: her left elbow's own, measured off her takes in her upper arm's frame (masters/v26.1/make.sh): 'prostrate'
       bends it 128.6 degrees about (0.607, 0, -0.794), 'seiza' 27 degrees within 6 degrees of that; her standing take is
       straight-armed and gives none. `wrist`: where her wrist rests from her shoulder, to her right, up and before her, in
       metres: the upper arm hanging, the forearm reaching forward level (her arm is 0.46 m to the wrist); it follows the
       wick by `follow`: half its way to her left or right, half its rise. `hold`: a probe's seam, a moment of her round
       to stand at; null in play) */
    const TAPER = { at: [1.5, -9.25], held: 0.12, len: 0.70, T: 12.5, slant: 0.32, hinge: [0.607, 0, -0.794], wrist: [-0.03, -0.20, 0.25], follow: [0.5, 0.5] };
    const taper = (() => {
      const y = TABLES.tops[0] + 0.245;
      const P = mkPerson('e4devf', TAPER.at[0], TAPER.at[1], Math.PI, { take: 'Idle_3', phase: 0.63, parent: dayOne, hidden: true, blobW: 0.8, blobD: 0.7 });
      const g = stand('w3taper', 0, -40, 0, 0, { parent: dayOne, near: true }); g.visible = false;
      const gF = new THREE.PlaneGeometry(1, 1); gF.translate(0, 0.5, 0);
      const fl = new THREE.Mesh(gF, B({ map: tex(makeFlame(THREE, cnv)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }));
      fl.renderOrder = 4; fl.visible = false; fl.frustumCulled = false; dayOne.add(fl); owned.push(fl);
      cast.taper = P; castBlock.taper = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
      /* two wicks of the front row (b_world2.js: every 0.33 m along z -10.09), and the taper held up between them (v26.1:
         it was drawn back 15 cm and up 20; with a taper this long that brought her hand to her shoulder, the elbow folded
         141 degrees and the wrist bent 74: measured, and moved out to where her arm holds it at rest) */
      return { P, g, fl, on: false, W: [[1.32, y, -10.09], [0.99, y, -10.09], [1.15, y + 0.12, -10.03]], grip: { L: { at: [0, 0, 0], f: [0, 0, -1], n: [1, -0.25, 0], out: 0.1, down: 0.5, aft: 0.3 } }, tip: new THREE.Vector3(), hold: null };
    })();
    /* where the taper's tip is asked to be at a moment of her round (seconds), eased from stop to stop */
    const _tpA = [0, 0, 0];
    function taperAim(t) {
      const W = taper.W, u = ((t % TAPER.T) + TAPER.T) % TAPER.T;
      /* at the first wick 3 s; over to the second 1.5; there 3; drawn back 1.5; held back 2; down to the first 1.5 */
      const leg = (a, b, k, lift) => { const e = smo(c01(k)); _tpA[0] = lp(a[0], b[0], e); _tpA[1] = lp(a[1], b[1], e) + lift * Math.sin(Math.PI * e); _tpA[2] = lp(a[2], b[2], e); return _tpA; };
      if (u < 3) return leg(W[0], W[0], 0, 0);
      if (u < 4.5) return leg(W[0], W[1], (u - 3) / 1.5, 0.05);
      if (u < 7.5) return leg(W[1], W[1], 0, 0);
      if (u < 9) return leg(W[1], W[2], (u - 7.5) / 1.5, 0);
      if (u < 11) return leg(W[2], W[2], 0, 0);
      return leg(W[2], W[0], (u - 11) / 1.5, 0);
    }
    const _tpS = new THREE.Vector3(), _tpF = new THREE.Vector3(), _tpN = new THREE.Vector3(), _tpP = new THREE.Vector3(), _tpQ = new THREE.Quaternion(), _tpY = new THREE.Vector3(0, 1, 0), _tpC = new THREE.Vector3(),
          _tpT = new THREE.Vector3(), _tpW = new THREE.Vector3();
    const _tpR = new THREE.Vector3(), _tpU = new THREE.Vector3(), _tpB = new THREE.Vector3(), _tpPole = new THREE.Vector3(), _tpG = new THREE.Vector3(), _tpE = new THREE.Vector3(),
          _tpHf = new THREE.Vector3(), _tpHn = new THREE.Vector3(), _tpHa = new THREE.Vector3(), _tpHd = new THREE.Vector3(), _tpM = new THREE.Matrix4(), _tpM2 = new THREE.Matrix4(),
          _tpQ2 = new THREE.Quaternion(), _tpQ3 = new THREE.Quaternion(), _tpAim = new THREE.Vector3(), _tpD = new THREE.Vector3();
    /* her hand from her forearm's line: the fingers along it, bent ten degrees down at the wrist; the palm to her right (her
       middle: this is her left hand) and a little down, so the first finger and the thumb are on top (across, for a left
       hand, runs from the little finger to the first: armsOf); the taper out along the fingers and a little toward the
       thumb (TAPER.slant) */
    function taperHand(fore, asIs) {
      if (asIs) _tpHf.copy(fore); else _tpHf.copy(fore).addScaledVector(_tpU, -0.18).normalize();
      _tpHn.copy(_tpR).addScaledVector(_tpU, -0.3); _tpHn.addScaledVector(_tpHf, -_tpHn.dot(_tpHf)).normalize();
      _tpHa.crossVectors(_tpHn, _tpHf).normalize();
      _tpHd.copy(_tpHf).addScaledVector(_tpHa, TAPER.slant).normalize();
    }
    function taperTick(t) {
      const T = taper, P = T.P;
      if (!T.on || !P.ready || !dayOne.visible) { if (T.g.visible) { T.g.visible = false; T.fl.visible = false; } return; }
      const As = armsOf(P), a = As && As.L; if (!a) return;
      /* HOW SHE HOLDS IT, v26.1 (Chad, 12 Nov 2026: "The lady standing at the front of the altar lighting the candles have
         very weird distorted arms and hands while lighting the candle"). Photographed from her side, the old ask had her
         elbow solved by the shortest arc and her hand then turned to whatever the taper's line asked: the wrist folded
         back over the forearm and the taper ran through the hand at her waist. Now it is solved as a person holds a taper
         to a candle on a table before her, from the hand outward and in one pass (a first try moved the wrist by what the
         tip missed and solved again: the taper's half-metre lever swung the tip further each round, and her hand rose
         over her head):
         1. her wrist's RESTING PLACE is taken from her own shoulder (TAPER.wrist): the upper arm hanging, the forearm
            reaching forward level, the elbow near a right angle (a first try set the hand a fixed way back from each wick:
            the far wick, 0.4 m to her left, was then out of her reach, and the near one folded the wrist 54 degrees);
         2. the TAPER'S LINE is from that place to the wick; the hand is turned to carry it as a pen is held: the fingers
            along the line less the slant toward the thumb, the palm toward her middle and a little down, so the thumb
            and the first finger are on top;
         3. the WRIST is where that hand, so turned, puts the taper's tip on the wick; the arm is solved to it once,
            bending about its own measured hinge (armHinge; TAPER.hinge), the elbow down, a little out and back */
      /* (taperAim answers an array, read here as a point: copied as it was, v26.1's first build solved her arm from NaN and
         she stood with no left arm and no taper) */
      const Q = _tpAim.fromArray(taperAim(T.hold != null ? T.hold : t)), Lt = TAPER.len - TAPER.held + 0.012;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_tpQ);
      _tpR.set(-1, 0, 0).applyQuaternion(_tpQ); _tpU.set(0, 1, 0); _tpB.set(0, 0, 1).applyQuaternion(_tpQ);   // her right, up, her front
      _tpPole.copy(_tpU).multiplyScalar(-1).addScaledVector(_tpR, -0.35).addScaledVector(_tpB, -0.25).normalize();   // the elbow: down, out to her left, back
      hingeOf(a, 1, TAPER.hinge);
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }   // (armsBack gives them back before the mixer: v11.5)
      /* 1. her wrist's resting place (and where the wick takes it: a wick off to her left turns the forearm that way, not
         the wrist; a raised one raises the hand. Measured on the first pass of this: the wick 0.35 m to her left bent the
         wrist 45 degrees sideways, the raised one 42 degrees up) */
      a.up.getWorldPosition(_tpS); _tpC.copy(Q).sub(_tpS);
      const side = _tpC.dot(_tpR) - TAPER.wrist[0], rise = Q.y - taper.W[0][1];
      _tpS.addScaledVector(_tpR, TAPER.wrist[0] + TAPER.follow[0] * side).addScaledVector(_tpU, TAPER.wrist[1] + TAPER.follow[1] * rise).addScaledVector(_tpB, TAPER.wrist[2]);
      /* 2. the taper's line, and the hand turned to carry it (the fingers' line found in three rounds: it leans off the
         taper by the slant, which is measured about the fingers themselves) */
      _tpD.copy(Q).sub(_tpS).normalize(); _tpHf.copy(_tpD);
      for (let it = 0; it < 3; it++) { taperHand(_tpHf, true); _tpHf.copy(_tpD).addScaledVector(_tpHa, -TAPER.slant).normalize(); }
      taperHand(_tpHf, true);
      /* 3. the wrist that puts the tip on the wick, and the arm to it */
      _tpG.copy(Q).addScaledVector(_tpHd, -Lt).addScaledVector(_tpHf, -a.palm * 0.85).addScaledVector(_tpHa, -0.02).addScaledVector(_tpHn, -0.012);
      armHinge(a, _tpG, _tpPole);
      /* the hand turned to it: its own measured axes (across, palm, fingers) onto the ones asked */
      _tpM.makeBasis(_tpHa, _tpHn, _tpHf); _tpM2.makeBasis(a.aL, a.nL, a.fL).transpose(); _tpM.multiply(_tpM2); _tpQ2.setFromRotationMatrix(_tpM);
      a.hand.parent.getWorldQuaternion(_tpQ3); a.hand.quaternion.copy(_tpQ3.invert().multiply(_tpQ2)); a.hand.updateWorldMatrix(false, true);
      /* THE ANSWER: the taper lies where the hand came to be, between the thumb and the first finger */
      a.hand.getWorldPosition(_tpS); a.hand.getWorldQuaternion(_tpQ);
      _tpF.copy(a.fL).applyQuaternion(_tpQ).normalize(); _tpN.copy(a.nL).applyQuaternion(_tpQ).normalize(); _tpW.crossVectors(_tpN, _tpF);
      _tpT.copy(_tpF).addScaledVector(_tpW, TAPER.slant).normalize();
      _tpP.copy(_tpS).addScaledVector(_tpF, a.palm * 0.85).addScaledVector(_tpW, 0.02).addScaledVector(_tpN, 0.012);
      T.g.position.copy(_tpP).addScaledVector(_tpT, -TAPER.held); T.g.quaternion.setFromUnitVectors(_tpY, _tpT); T.g.visible = true;
      T.tip.copy(_tpP).addScaledVector(_tpT, Lt);
      curlFingers(P, 'L', 0.62);
      camera.getWorldPosition(_tpC);
      const fk = 0.84 + 0.11 * Math.sin(t * 9.1) + 0.05 * Math.sin(t * 23.7);
      T.fl.position.copy(T.tip); T.fl.rotation.set(0, Math.atan2(_tpC.x - T.tip.x, _tpC.z - T.tip.z), 0.06 * Math.sin(t * 2.3)); T.fl.scale.set(0.026 * (1.12 - 0.12 * fk), 0.062 * fk, 1); T.fl.visible = true;
    }

    /* ================================================================ THE CHILDREN
       (the plan's 4.1: "a full ground, children running"; 3.7: "children among them"; photographs 1 and 11: a small girl
       among the people in white.) Found unbuilt by the same audit. A girl of seven and a boy of five, made here end to
       end like every person (masters/v26.0/people; nobody in a photograph is copied). WHILE THE GROUND GATHERS (the
       `arrive` formation) they chase one another along one line across the open turf south of the rows, between two
       places where they stop for breath: beside Ton's table, inside the first frame he sees, and on the turf before the
       chief canopy. The first run comes IN, so they are seen running in play's first seconds. AT THE BLESSINGS (`bless`,
       `photo`) each stands by a grown person at a master's seat, as the photographs have them.
       A running child is not solid: each stops short of him, and of the other, and waits. Their state is a run's, so it
       is integrated on the wall clock while he plays (frozen under a panel), set again by every setFormation (reset()
       names one), and in a film of the gathering they are not drawn (a film is its own clock's: v6.4). */
    const KID = { gap: 0.7, V: 2.5, acc: 4.5, restW: 7.5, restE: 9.5, lag: 0.9, give: 1.25 };
    /* (each: where the child stands, and what it faces: the girl beside the man at the edge of the throng before
       Grandmaster Pho's bench, the boy beside the one who stands behind the kneelers at the west tent) */
    const KID_STAND = [(() => { const [x, z] = benchAt(-3.5, 3.45); return [x, z, PHO_AT[0], PHO_AT[1]]; })(), [-5.0, 0.15, -10.17, -0.95]];
    const kidPath = (() => {
      const pts = [[-4.15, 7.3], [-1.6, 6.95], [0.6, 7.6], [1.25, 9.4], [0.3, 11.1]], out = [], N = 14;
      const cr = (p0, p1, p2, p3, t) => 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
      for (let i = 0; i < pts.length - 1; i++) { const a = pts[Math.max(0, i - 1)], b0 = pts[i], c = pts[i + 1], d = pts[Math.min(pts.length - 1, i + 2)];
        for (let k = 0; k < N; k++) out.push([cr(a[0], b0[0], c[0], d[0], k / N), cr(a[1], b0[1], c[1], d[1], k / N), 0]); }
      out.push([pts[pts.length - 1][0], pts[pts.length - 1][1], 0]);
      let L = 0; for (let i = 1; i < out.length; i++) { L += Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]); out[i][2] = L; }
      return { pts: out, L };
    })();
    /* the place s metres along it, and the way it runs there (west to east) */
    function kidAt(s, o) {
      const A = kidPath.pts; s = Math.max(0, Math.min(kidPath.L, s)); let i = 1; while (i < A.length - 1 && A[i][2] < s) i++;
      const a = A[i - 1], b0 = A[i], dl = Math.max(1e-6, b0[2] - a[2]), k = (s - a[2]) / dl;
      o.x = lp(a[0], b0[0], k); o.z = lp(a[1], b0[1], k); o.hx = (b0[0] - a[0]) / dl; o.hz = (b0[1] - a[1]) / dl; return o;
    }
    const kids = [['e4girl', 0.3, 'Run_02'], ['e4boy', 0.71, 'Run_03']].map(([key, phase, run], i) => {
      const P = mkPerson(key, 0, 0, 0, { take: 'Idle_3', phase, parent: dayOne, hidden: true, blobW: 0.55, blobD: 0.5, lodK: 0.66, pace: true });
      P.noBlock = true; cast[i ? 'boy' : 'girl'] = P; castBlock[i ? 'boy' : 'girl'] = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
      return { P, i, s: 0, v: 0, to: 0, wait: 0, run, moving: false, ry: 0, looks: false };
    });
    const kidsDir = { ph: '', t: 0, hold: false, toss: null, stops: 0 };
    const _ko = { x: 0, z: 0, hx: 0, hz: 1 }, _ko2 = { x: 0, z: 0, hx: 0, hz: 1 };
    function kidsForm(name) {
      const run = name === 'arrive';
      kidsDir.ph = run ? 'runW' : ''; kidsDir.t = 0; kidsDir.hold = false; kidsDir.toss = null; kidsDir.stops = 0;
      for (const K of kids) { const P = K.P; K.v = 0; K.moving = false; K.looks = false; P.noBlock = run; P.rate = 1;
        whenReady(P, () => { gaze(P, null); rest(P, 0); });
        if (run) { K.s = Math.min(kidPath.L, kidPath.L * 0.62 + K.i * 1.5); K.to = K.i * KID.gap; K.wait = 0.15 + K.i * 0.35;
          kidAt(K.s, _ko); K.ry = Math.atan2(-_ko.hx, -_ko.hz); put(P, _ko.x, _ko.z, K.ry); }
        else { const [x, z, tx, tz] = KID_STAND[K.i]; K.ry = faceTo(x, z, tx, tz); put(P, x, z, K.ry); } }
    }
    function kidsTick(wdt, st) {
      const D = kidsDir; if (!D.ph || !dayOne.visible) return;
      /* (not drawn in a film of the gathering; held as they are under a panel, their running stopped with them) */
      const drawn = st !== 'cine';
      for (const K of kids) { const P = K.P; if (P.ready && P.group.visible !== drawn) { P.group.visible = drawn; P.hidden = !drawn; } }
      if (st !== 'play') { for (const K of kids) if (K.moving) K.P.rate = 0; return; }
      D.t += wdt;
      const running = D.ph === 'runW' || D.ph === 'runE', dir = D.ph === 'runE' ? 1 : -1;
      let there = true;
      for (const K of kids) {
        const P = K.P; if (!P.ready) { there = false; continue; }
        const O = kids[1 - K.i]; let want = 0;
        kidAt(K.s, _ko);
        const px = yaw.position.x - _ko.x, pz = yaw.position.z - _ko.z, pd = Math.hypot(px, pz);
        if (running) { const left = Math.abs(K.to - K.s);
          if (K.wait > 0) K.wait -= wdt;
          else if (left > 0.02) { want = Math.min(KID.V, Math.sqrt(2 * KID.acc * left));
            /* he is in the way, or the other child is: slower, then stopped short, and waiting */
            if ((px * _ko.hx + pz * _ko.hz) * dir > -0.2 && pd < KID.give + 0.75) want *= c01((pd - KID.give) / 0.75);
            const ds = (O.s - K.s) * dir; if (ds > 0 && ds < 1.05) want *= c01((ds - 0.55) / 0.5); }
          if (left > 0.05) there = false; }
        K.v = want > K.v ? Math.min(want, K.v + KID.acc * wdt) : Math.max(want, K.v - KID.acc * 1.6 * wdt);
        if (K.v > 0) { K.s += dir * Math.min(K.v * wdt, Math.abs(K.to - K.s)); kidAt(K.s, _ko); }
        const mv = K.v > 0.35;
        if (mv !== K.moving) { K.moving = mv; take(P, mv ? K.run : 'Idle_3', mv ? 0.18 : 0.3); if (!mv) P.rate = 1; }
        /* (the run's own rate from the ground covered: v7.1) */
        if (K.moving) P.rate = Math.max(0.6, Math.min(1.3, K.v / ((P.pace && P.pace[K.run]) || KID.V)));
        /* running, a child faces the way it runs; stopped, it turns to the other child; and it looks at a grown man who comes near */
        let ry = K.ry;
        if (K.v > 0.05) ry = Math.atan2(_ko.hx * dir, _ko.hz * dir);
        else if (Math.abs(O.s - K.s) > 0.2) { kidAt(O.s, _ko2); ry = Math.atan2(_ko2.x - _ko.x, _ko2.z - _ko.z); }
        const dq = Math.atan2(Math.sin(ry - K.ry), Math.cos(ry - K.ry)); K.ry += Math.max(-7 * wdt, Math.min(7 * wdt, dq));
        P.group.position.set(_ko.x, 0, _ko.z); P.group.rotation.y = K.ry;
        const looks = !K.moving && pd < 3.2;
        if (looks !== K.looks) { K.looks = looks; gaze(P, looks ? 'lens' : null, { reach: 0.9, secs: 0.7 }); }
      }
      if (running && (there || D.t > 14)) { D.ph = D.ph === 'runW' ? 'restW' : 'restE'; D.t = 0;
        /* AT EVERY STOP THEY PLAY WITH THE PETALS (Chad, 12 Nov 2026: "The kids only play with the flowers once, and never
           again. I want the kids to play the flowers more often as they loop running around. It should happen more than
           once, and keep looping it every cycle"): a second after they stop, one jumps for joy and throws a handful up over
           the other, and the other answers a moment later; who throws first changes from stop to stop (d_play.js kidThrow).
           Not when they have come to watch him with Ton (kidsCall holds them: the girl's own throw is that stop's) */
        D.stops++; const a = D.stops % 2, b = 1 - a;
        D.toss = D.hold ? null : [{ i: a, at: 1.0 }, { i: b, at: 2.7 }]; }
      else if (!running && D.toss && D.toss.length && !D.hold && D.t >= D.toss[0].at) {
        const T0 = D.toss.shift(); kidThrow(kids[T0.i], kids[1 - T0.i]); }
      else if (!running && !D.hold && D.t > (D.ph === 'restW' ? KID.restW : KID.restE)) {
        const east = D.ph === 'restW'; D.ph = east ? 'runE' : 'runW'; D.t = 0;
        /* whoever stands further along goes first; the other gives chase a moment later */
        const order = kids.slice().sort((p, q) => east ? q.s - p.s : p.s - q.s);
        order[0].to = east ? kidPath.L : 0; order[0].wait = 0;
        order[1].to = east ? kidPath.L - KID.gap : KID.gap; order[1].wait = KID.lag; }
    }
    /* THE CHILDREN COME TO SEE (the plan's §3.7, picture 2: "a handful of petals thrown beside him (play)"). When he
       speaks to Ton they run to their place by Ton's table, wherever their chase has them, and stay there while the two
       men talk (children watch a stranger being given something); when the bai sri is in his hands the girl jumps for
       joy and throws up a handful of the petals that lie everywhere (d_play.js kidsToss, which owns the clock and the
       sound). Then their chase goes on. */
    function kidsCall() {
      const D = kidsDir; if (formNow !== 'arrive' || !D.ph) return;
      D.hold = true; D.toss = null;
      if (D.ph === 'restW') { D.t = 0; return; }
      if (D.ph === 'runW') return;                                               // (already on their way there)
      D.ph = 'runW'; D.t = 0;
      const order = kids.slice().sort((p, q) => p.s - q.s);
      order[0].to = 0; order[0].wait = 0; order[1].to = KID.gap; order[1].wait = KID.lag;
    }

    /* ================================================================ THE DANCERS ON THE GROUND
       THEY LOOP (Chad, 12 Nov 2026: "can you make the dancers dance more often in a looping manner going/dancing from
       one end of the venue, then dancing to the other end, then repeat and loop, during the gameplay sequence. The real
       full dance happens in the cutscene, while this looping walk dance is just like a simple walk and dance at the same
       time, looping for more visual flair."). This is the later word on the dancers in play, and it replaces what the
       release's closing pass built from the plan's §3.7 (a file that set off as the bai sri came into his hands,
       stood at his way until he came up past the first tent, crossed once and waited before the masters' tent).
       All of day one's play the six go up and down the open band between the rows in three pairs, in their WALK-DANCE
       (c_cast.js: a walk with the arms out and rising and falling in turn, written for them), from the east end of the
       band to the west end, where each turns about by way of the offering tables, stands a breath, and comes back; and
       again. The film's dance is its own stretch, on its own cut:
         `loop`   while the ground gathers and through his respects (the formation `arrive`), and again at the blessings
                  (`bless`: a shorter band, short of those who kneel before the west tent);
         `still`  for the homage: when the chant begins they stop where they are, turn to the offering tables and
                  stand, as the whole ground does (dancersStill);
         `dance`  the film's dance, on their dance places (the film poses the drivers and shows the group itself);
         `home`   any other ground of day one (the photograph): resting in three pairs by the monks' tent.
       Which of these it is on a Continue is read from the formation (dancersForm), never stored: a loop begins at the
       band's east end. A file is one thing: if he steps into its way the whole of it stops and waits for him, and goes
       on when he is clear (so nobody walks through anybody, and each column is solid wherever she is). The two drivers
       walk on the spot and the members travel (c_cast.js WALKS), each driver's rate from the ground the file covers
       (v7.1); pairs are one of each body, the two bodies half a stride apart so no pair steps together. A walking
       dancer is turned by her take's own heading, so her steps fall along the file's line (eased in and out with the
       take: standing, she faces the way she stands). On the ground all six are worn the same way round (a troupe's
       shawls lie on the same shoulder; the film's dance mirrors every other one, as it did). */
    const DWALK = { z: -0.75, lat: 0.42, gap: 1.25, x0: 2.2, x1: { arrive: -7.0, bless: -3.9 }, rate: 0.72, halt: 1.15, up: 0.6, down: 1.6, take: 'walkdance',
                    turn: 1.5, rest: 0.9, first: 1.2 };
    const DHOME = [[7.35, 1.05], [8.15, 1.0], [7.3, 1.95], [8.2, 2.0], [7.75, 2.85], [8.55, 2.8]];
    /* (d: how far the file has come from the band's east end; dir: +1 going west, -1 coming back; at: 'walk', or 'turn'
       at an end, t seconds into it) */
    const dancersDir = { ph: 'loop', d: 0, dir: 1, at: 'turn', t: 0, v: 0, walking: false, clear: 0, n: 0, wk: 0, laps: 0 };
    const danceBlock = dancers.m.map(() => new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0)));
    const dancerSpot = (i, d) => { const pair = i >> 1, side = i & 1 ? 1 : -1; return [DWALK.x0 + pair * DWALK.gap - d, DWALK.z + side * DWALK.lat]; };
    const dLen = () => DWALK.x0 - (formNow === 'bless' ? DWALK.x1.bless : DWALK.x1.arrive);
    const NORTH = Math.PI, facing = (dir) => (dir > 0 ? -Math.PI / 2 : Math.PI / 2);     // (a body at 0 faces +z: west is -90 degrees, the tables' way 180)
    function dancersPlace() {
      /* (their columns stand wherever day one is the ground, shown or put away for a film; never on the next morning) */
      const D = dancersDir, on = dayOne.visible, r = 0.3;
      dancers.m.forEach((M0, i) => { let x, z, ry;
        if (D.ph === 'dance') { [x, z] = dancers.at[i]; ry = dancers.ry; }
        else if (D.ph === 'home') { [x, z] = DHOME[i]; const o = DHOME[i ^ 1]; ry = faceTo(x, z, o[0], o[1]) + (i & 1 ? 0.25 : -0.2); }
        else { [x, z] = dancerSpot(i, D.d); ry = D.ph === 'still' ? NORTH : facing(D.dir); }
        M0.group.position.set(x, 0, z); M0.group.rotation.y = ry; M0.lvNow = -1;
        M0.group.scale.x = D.ph === 'dance' && M0.o.mirror ? -M0.s : M0.s;
        danceBlock[i].min.set(x - r, on && D.ph !== 'dance' ? 0 : 60, z - r); danceBlock[i].max.set(x + r, on && D.ph !== 'dance' ? 1.5 : 61, z + r); });
    }
    /* where they are for this formation: on a ground they loop on, at the band's east end and about to set off west */
    function dancersForm(name = formNow) {
      const D = dancersDir; D.v = 0; D.clear = 0; D.walking = false; D.wk = 0; D.n++;
      D.ph = name === 'arrive' || name === 'bless' ? 'loop' : 'home';
      D.d = 0; D.dir = 1; D.at = 'turn'; D.t = DWALK.turn + DWALK.rest - DWALK.first; D.laps = 0;   // (they stand a moment, then set off)
      for (const Dr of [dancers.A, dancers.B]) { Dr.rate = 1; rest(Dr, 0); }
      for (const M0 of dancers.m) M0.turn = null;
      dancersPlace();
    }
    /* the film's dance: on their dance places (the film poses the drivers and shows the group itself) */
    function dancersDance() { const D = dancersDir; D.ph = 'dance'; D.v = 0; D.walking = false; D.wk = 0; for (const M0 of dancers.m) M0.turn = null; dancersPlace(); }
    /* THE HOMAGE: they stop where they are and turn to the offering tables (d_play.js, as the chant begins) */
    function dancersStill() {
      const D = dancersDir; if (D.ph !== 'loop') return;
      D.ph = 'still'; D.v = 0; D.wk = 0;
      if (D.walking) { D.walking = false; for (const Dr of [dancers.A, dancers.B]) { Dr.rate = 1; rest(Dr, 0.6); } }
      for (const M0 of dancers.m) M0.turn = { from: M0.group.rotation.y, to: NORTH, t: 0, secs: 1.3 };
    }
    function dancersTick(wdt, st) {
      const D = dancersDir;
      if (st === 'cine') return;                                                 // (a film shows or hides them itself: y_stage.js)
      const show = dayOne.visible;
      /* (shown, and solid, exactly while day one is the ground: a film puts the group away without telling this, and the
         night between changes the day inside a film, so what was last done is kept here and not read off the group) */
      if (danceG.visible !== show || D.shown !== show) { D.shown = show; danceG.visible = show; dancers.A.idle = dancers.B.idle = !show; dancersPlace(); }
      if (!show || st !== 'play') { if (D.walking) { dancers.A.rate = 0; dancers.B.rate = 0; } return; }
      if (D.ph === 'dance') dancersForm();                                       // (the film is over and nothing has said where they are: where the formation has them)
      if (D.ph !== 'loop') return;
      const A = dancers.A, B2 = dancers.B; if (!A.ready || !B2.ready) return;
      /* (a probe's still: tools/probes/e4c3beats.mjs holds the file in mid-step to photograph a walk on a box that draws a
         frame a second; never set in play) */
      if (D.freeze) { A.rate = 0; B2.rate = 0; return; }
      const TK = DWALK.take, L = dLen(), r = 0.3;
      /* (each body's own pace over the ground and the way its walk goes from its own front: c_cast.js `pace`. The file
         goes at the slower body's pace, slowed to a dance's, and each take is slowed to the file, so both walk with
         their feet planted) */
      const pA = (A.pace && A.pace[TK]) || 0.9, pB = (B2.pace && B2.pace[TK]) || 0.9, V = Math.min(pA, pB) * DWALK.rate;
      const hOf = (Dr) => (Dr.heading && Dr.heading[TK] != null ? Dr.heading[TK] : 0);
      if (D.at === 'turn') {
        /* at an end: stopped, each turns about (by way of the offering tables), they stand a breath, and set off again */
        D.t += wdt;
        if (D.t >= DWALK.turn + DWALK.rest) { D.at = 'walk'; D.clear = 1; }
      } else {
        /* is he in their way? within reach of any of them, or just ahead of the two who lead */
        let near = false; const px = yaw.position.x, pz = yaw.position.z, lead = D.dir > 0 ? 0 : dancers.m.length - 2;
        for (let i = 0; i < dancers.m.length && !near; i++) { const [x, z] = dancerSpot(i, D.d); if (Math.hypot(px - x, pz - z) < DWALK.halt) near = true; }
        { const [lx] = dancerSpot(lead, D.d); if (Math.hypot(px - (lx - D.dir * 0.75), pz - DWALK.z) < 1.0) near = true; }
        D.clear = near ? 0 : D.clear + wdt;
        /* (they slow into the end of the band: no faster than a stop from there asks) */
        const left = D.dir > 0 ? L - D.d : D.d, cap = Math.sqrt(Math.max(0, 2 * DWALK.down * 0.5 * left)) + 0.04;
        const want = near ? 0 : (D.v < 0.01 && D.clear < 0.4 ? 0 : Math.min(V, cap));   // (stopped for him, they wait a moment after he is clear)
        D.v = want > D.v ? Math.min(want, D.v + DWALK.up * wdt) : Math.max(want, D.v - DWALK.down * wdt);
        D.d = Math.max(0, Math.min(L, D.d + D.dir * D.v * wdt));
        if ((D.dir > 0 ? L - D.d : D.d) < 1e-3) {                                // the end of the band: they stop, and turn about
          D.v = 0; D.at = 'turn'; D.t = 0; D.laps++;
          dancers.m.forEach((M0) => { M0.turn = { from: M0.group.rotation.y, dq: -D.dir * Math.PI, t: 0, secs: DWALK.turn }; });
          D.dir = -D.dir; }
      }
      const mv = D.at === 'walk' && D.v > 0.08;
      if (mv !== D.walking) { D.walking = mv;
        if (mv) { take(A, TK, 0.5, true); take(B2, TK, 0.5, true); if (B2.acts[TK]) B2.acts[TK].time = B2.acts[TK].getClip().duration * 0.5; }
        else { A.rate = 1; B2.rate = 1; rest(A, 0.5); rest(B2, 0.5); } }
      if (D.walking) { A.rate = Math.max(0.35, Math.min(1.2, D.v / pA)); B2.rate = Math.max(0.35, Math.min(1.2, D.v / pB)); }
      D.wk = D.walking ? Math.min(1, D.wk + wdt / 0.5) : Math.max(0, D.wk - wdt / 0.5);
      /* (a body is turned so that its WALK goes along the band, not its front: by the take's own heading, eased in with the take) */
      const wkS = D.wk * D.wk * (3 - 2 * D.wk);
      dancers.m.forEach((M0, i) => { const [x, z] = dancerSpot(i, D.d); M0.group.position.set(x, 0, z); if (D.at === 'walk' && !M0.turn) M0.group.rotation.y = facing(D.dir) - hOf(M0.D) * wkS;
        danceBlock[i].min.set(x - r, 0, z - r); danceBlock[i].max.set(x + r, 1.5, z + r); });
    }
    /* (a turn, eased: about at an end of the band (`dq`, the way round given), or to a facing by the shorter way (`to`);
       apart from the walk's own tick so it runs on after the state has changed) */
    function dancersTurn(wdt) {
      for (const M0 of dancers.m) { const T = M0.turn; if (!T) continue; T.t = Math.min(1, T.t + wdt / (T.secs || 0.9));
        const k = T.t * T.t * (3 - 2 * T.t), dq = T.dq != null ? T.dq : Math.atan2(Math.sin(T.to - T.from), Math.cos(T.to - T.from));
        M0.group.rotation.y = T.from + dq * k; if (T.t >= 1) M0.turn = null; }
    }

    /* WHO OF THESE IS THERE: the woman with the taper only while the ground gathers; the children all of day one (in
       their chase, kidsTick draws them); none on any other day. Each one's own flag is set (a hidden person is not
       run, and castSolid stands a column only under one who is drawn: the children's only while they stand still) */
    function extrasLive() {
      const one = dayOne.visible, tp = one && formNow === 'arrive';
      taper.on = tp; taper.P.hidden = !tp; if (taper.P.ready) taper.P.group.visible = tp;
      if (!tp) { taper.g.visible = false; taper.fl.visible = false; }
      for (const K of kids) { if (one && kidsDir.ph) continue; K.P.hidden = !one; if (K.P.ready) K.P.group.visible = one; }
      castSolid();
    }
    whenReady(taper.P, (P) => { gaze(P, taper.W[0], { reach: 0.6, secs: 0.01, down: 0 }); extrasLive(); });
    for (const K of kids) whenReady(K.P, extrasLive);
    kidsForm('arrive'); dancersForm('arrive');

