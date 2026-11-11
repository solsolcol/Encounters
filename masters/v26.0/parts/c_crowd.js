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
    const SIT = { seiza: [0.4, 6.8] }, WAI = [0.15, 0.85];
    function buildCrowd() {
      planCrowd();
      for (const key of DEVOTEES) crowdDrivers[key] = {
        A: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: 0.07 + 0.11 * DEVOTEES.indexOf(key) }),
        B: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: 0.55 + 0.09 * DEVOTEES.indexOf(key), rate: 0.86 }),
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
    }
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
    }
    buildCrowd();

