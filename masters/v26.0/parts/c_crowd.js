    /* ================================================================ THE CROWD OF DAY ONE (the plan's §3.3; photographs 1, 8, 10, 12)
       Devotees in white on the turf: most sit on their heels in loose rows facing the offering tables, some stand at the
       edges and talk. Eight bodies were made for them; a crowd of copies reads as copies, so WHO SITS WHERE IS SOLVED
       (Chad's rule, v5.29): a balanced deal of the eight over the places, then a seeded local search that swaps two
       people whenever the swap puts the same body further from its own copies; every other one is mirrored and each is a
       little taller or shorter. `stage.crowdStats()` reports what the solve reached, so the claim can be checked.

       Each body has three drivers (c_cast.js): two sitting at different moments of the same take, one standing. So the
       people of one body do not all breathe together, and the whole crowd is twenty-four mixers. */
    const DEVOTEES = ['e4deva', 'e4devb', 'e4devc', 'e4devd', 'e4deve', 'e4devf', 'e4devg', 'e4devh'];
    const crowdSeats = [];                                                       // { x, z, ry, kind: 'sit' | 'stand', body, mirror, s, drv }
    const crowdDrivers = {};                                                     // key -> { sitA, sitB, stand }
    const crowdBlock = [];
    function planCrowd() {
      const R = rng(41203);
      const aim = (x, z) => faceTo(x, z, 0, -11.2);                              // toward the offering tables
      /* the sitting blocks: a jittered grid in each, and only so many of its places taken (loose rows, small groups) */
      const block = (x0, x1, z0, z1, n) => { const cells = [];
        for (let z = z0; z <= z1 + 1e-6; z += 1.18) for (let x = x0 + ((Math.round((z - z0) / 1.18) % 2) ? 0.5 : 0); x <= x1 + 1e-6; x += 1.08) cells.push([x, z]);
        for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
        for (const [x, z] of cells.slice(0, n)) { const px = x + (R() - 0.5) * 0.3, pz = z + (R() - 0.5) * 0.3;
          crowdSeats.push({ x: px, z: pz, ry: aim(px, pz) + (R() - 0.5) * 0.3, kind: 'sit' }); } };
      block(-8.2, -2.4, 2.6, 6.6, 12);          // south-west of the middle
      block(2.2, 5.4, 1.4, 5.2, 6);             // south-east, short of the chief canopy
      block(-6.4, -2.4, -6.6, -2.8, 8);         // north-west, before the west tent
      block(2.4, 6.4, -7.2, -3.6, 6);           // north-east, before the monks
      /* those who stand: in twos and threes at the edges, turned to one another or to the tables */
      const pair = (x, z, n, r = 0.55) => { const a0 = R() * 6.283;
        for (let i = 0; i < n; i++) { const a = a0 + i * 6.283 / n, px = x + Math.sin(a) * r, pz = z + Math.cos(a) * r;
          crowdSeats.push({ x: px, z: pz, ry: n > 1 ? faceTo(px, pz, x, z) + (R() - 0.5) * 0.4 : aim(px, pz), kind: 'stand' }); } };
      pair(-8.6, 10.6, 2); pair(9.6, 3.6, 3, 0.62); pair(8.9, 6.2, 1); pair(-9.6, -8.4, 2); pair(4.4, -8.9, 2); pair(-1.9, 10.9, 1);
      /* THE SOLVE: bodies dealt evenly, then swaps that part a body from its copies. The cost of a pair of the same body
         falls with the square of the distance between them inside six metres */
      const N = crowdSeats.length, body = new Int32Array(N);
      const order = Array.from({ length: N }, (_, i) => i);
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      order.forEach((seat, k) => { body[seat] = k % DEVOTEES.length; });
      const pairCost = (i, j) => { if (body[i] !== body[j]) return 0; const d = Math.hypot(crowdSeats[i].x - crowdSeats[j].x, crowdSeats[i].z - crowdSeats[j].z); return d < 6 ? (6 - d) * (6 - d) : 0; };
      const costOf = (i) => { let c = 0; for (let j = 0; j < N; j++) if (j !== i) c += pairCost(i, j); return c; };
      let swaps = 0;
      for (let it = 0; it < 6000; it++) { const a = Math.floor(R() * N), b = Math.floor(R() * N); if (a === b || body[a] === body[b]) continue;
        const before = costOf(a) + costOf(b); let t = body[a]; body[a] = body[b]; body[b] = t;
        if (costOf(a) + costOf(b) < before - 1e-9) swaps++; else { t = body[a]; body[a] = body[b]; body[b] = t; } }
      crowdSeats.forEach((s, i) => { s.body = body[i]; s.mirror = R() < 0.5; s.s = 0.955 + R() * 0.085; s.half = R() < 0.5 ? 'A' : 'B'; });
      crowdSeats.swaps = swaps;
    }
    function crowdStats() {
      const N = crowdSeats.length, per = DEVOTEES.map(() => 0); let near = Infinity, sum = 0, touching = 0;
      for (let i = 0; i < N; i++) { per[crowdSeats[i].body]++; let best = Infinity;
        for (let j = 0; j < N; j++) if (j !== i && crowdSeats[j].body === crowdSeats[i].body) best = Math.min(best, Math.hypot(crowdSeats[i].x - crowdSeats[j].x, crowdSeats[i].z - crowdSeats[j].z));
        near = Math.min(near, best); sum += best; if (best < 1.6) touching++; }
      return { people: N, sitting: crowdSeats.filter(s => s.kind === 'sit').length, standing: crowdSeats.filter(s => s.kind === 'stand').length,
               perBody: per, nearestSameBody: +near.toFixed(2), meanNearestSameBody: +(sum / N).toFixed(2), sameBodyWithin1m6: touching, swaps: crowdSeats.swaps, drivers: Object.keys(crowdDrivers).length * 3 };
    }
    function buildCrowd() {
      planCrowd();
      const SIT = { seiza: [0.4, 6.8] };                                         // the kneeling sit, back and forth over nearly its whole length
      for (const key of DEVOTEES) crowdDrivers[key] = {
        A: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: 0.07 + 0.11 * DEVOTEES.indexOf(key) }),
        B: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: 0.55 + 0.09 * DEVOTEES.indexOf(key), rate: 0.86 }),
        S: mkDriver(key, { take: 'Idle_3', centre: true, phase: 0.13 * DEVOTEES.indexOf(key) }) };
      for (const s of crowdSeats) { const D = crowdDrivers[DEVOTEES[s.body]][s.kind === 'stand' ? 'S' : s.half];
        s.member = mkMember(D, s.x, s.z, s.ry, { s: s.s, mirror: s.mirror, parent: dayOne, blobW: s.kind === 'stand' ? 0.8 : 0.95, blobD: s.kind === 'stand' ? 0.7 : 1.0 });
        /* a person is a thing he walks round: a column from the ground (collide() samples at a metre) */
        const r = 0.3; crowdBlock.push(new THREE.Box3(new THREE.Vector3(s.x - r, 0, s.z - r), new THREE.Vector3(s.x + r, 1.5, s.z + r))); }
    }
    /* the crowd's columns stand only while the crowd does: the engine walks the very list it was handed, so each box is
       lifted clear of his head height when the crowd is gone, and set down again when it is back */
    function crowdSolid(on) { for (const b of crowdBlock) { b.min.y = on ? 0 : 60; b.max.y = on ? 1.5 : 61; } }
    buildCrowd();

