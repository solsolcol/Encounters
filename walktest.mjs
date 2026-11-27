/* WALKTEST — the harness that would have caught v7.1's wall.
   Every other harness TELEPORTS the camera, so a chapter whose only route
   is sealed passes all twenty-three of them. This one flood-fills the REAL
   collision grid the way collide() reads it and asserts that everything the
   chapter asks the player to reach can actually be walked to.            */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from './testlib.mjs';

let bad = 0;
const ok = (name, pass, note = '') => { console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${note ? '  ' + note : ''}`); if (!pass) bad++; };

const br = await chromium.launch(LAUNCH);
const p = await (await br.newContext()).newPage();
p.setDefaultNavigationTimeout(180000);
/* (v26.0: and an action's own wait. A click's default is 30 s, and with other pages drawing on the same box Start's
   click outwaited it: a harness polls and never times a thing, v8.7) */
p.setDefaultTimeout(240000);

/* v14.0: this harness walks INTO every episode-2 chapter and lets it run,
   which makes it the one place a PER-FRAME throw can be caught. It was not
   being caught: e2c5 declared `fireLight: null` — honest, an afternoon camp
   apron has no fire — and updateViewmodel read its position every frame, so
   the chapter threw a TypeError sixty times a second. Silent on screen, and
   invisible to all 24 harnesses, because not one of them listened. Now one
   does. Errors are attributed to whichever chapter is loading or playing. */
let where = 'boot';
const errs = [];
p.on('pageerror', e => errs.push(where + ': ' + e.message));

/* v14.7: and episode 1 chapter 3, the first base-game chapter with a HOTSPOT
   (the amulet on the auntie's table, which must be reached before the altar
   opens) and with new per-frame code to catch a throw in */
/* v23.0: and episode 3 chapter 5 (a preview chapter until its sound is recorded — `?ch=` still opens it): the counter
   in World S where play begins, and his room, which the home film puts him down inside the door of */
/* v24.0: and episode 4 chapter 1 (a preview while it is built): the compound, from beside the pickup at the gate to the
   receiving room's door, and the room itself, where pressing that door puts him down */
/* v25.0: and episode 4 chapter 2: his shop, from behind the counter to the stand by the door, the light switch, the
   shutter's pull and the mat on the customers' floor */
const KEYS = ['ch3', 'e2c1', 'e2c2', 'e2c3', 'e2c4', 'e2c5', 'e3c1', 'e3c2', 'e3c3', 'e3c4', 'e3c5', 'e4c1', 'e4c2', 'e4c3', 'e4c4', 'e4c5', 'e5c1'];
/* WALK_ONLY=e3c3 walks one chapter (a re-check after a fix, not the release run) */
for (const key of (process.env.WALK_ONLY ? KEYS.filter(k => process.env.WALK_ONLY.split(',').includes(k)) : KEYS)) {
  where = key;
  await p.goto(PAGE + '?ch=' + key);
  await p.click('#startBtn');
  await toPlay(p, 180000);
  await p.waitForTimeout(4000);

  /* v26.18: the flood is a function of the ground it is asked for: null is the first frame (from the spawn and every
     arrival), a later ground's name floods from where that ground has put him (see `grounds` below) */
  const FLOOD = (g) => {
    const E = window.__enc, B = E.blockers, S = E.stage, D = window.__CHAPTERS__[E.chapterKey()];
    const BN = D.bounds, ST = 0.06;
    /* v16.4: the ground (the engine's groundAt seam) — collision samples 1.0 m
       above the ground, and no step may rise more than STEP_UP (0.4) */
    const G = E.groundAt || (() => 0);
    const hit = (x, z) => {
      if (x < BN.minX || x > BN.maxX || z < BN.minZ || z > BN.maxZ) return true;
      const y = 1.0 + G(x, z);
      for (const b of B) if (x >= b.min.x && x <= b.max.x && z >= b.min.z && z <= b.max.z && y >= b.min.y && y <= b.max.y) return true;
      return false;
    };
    const nx = Math.floor((BN.maxX - BN.minX) / ST) + 1, nz = Math.floor((BN.maxZ - BN.minZ) / ST) + 1;
    const blocked = new Uint8Array(nx * nz), seen = new Uint8Array(nx * nz);
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++)
      blocked[i * nz + j] = hit(BN.minX + i * ST, BN.minZ + j * ST) ? 1 : 0;
    const cell = (x, z) => Math.round((x - BN.minX) / ST) * nz + Math.round((z - BN.minZ) / ST);
    /* v21.0: a chapter with a SECOND WORLD that a scene change carries him to
       (e3c3's shrine — the trance film puts him at its door) names where he
       ARRIVES, and the walk floods from there too: every place in that world
       must be walkable from where he is put down. (A teleport is not a route:
       the arrival itself must be open floor, and nothing else is assumed.) */
    const arrivals = g ? [] : (S.arrivals || []).map(a => ({ ...a, k: cell(a.x, a.z) }));
    const from = g ? { x: E.yaw.position.x, z: E.yaw.position.z } : D.spawn;
    const q = [cell(from.x, from.z)]; seen[q[0]] = 1;
    const fromFree = !blocked[q[0]];
    for (const a of arrivals) if (!blocked[a.k] && !seen[a.k]) { seen[a.k] = 1; q.push(a.k); }
    for (let h = 0; h < q.length; h++) {
      const k = q[h], i = (k / nz) | 0, j = k % nz;
      for (const [di, dj] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const a = i + di, b2 = j + dj; if (a < 0 || a >= nx || b2 < 0 || b2 >= nz) continue;
        const m = a * nz + b2; if (seen[m] || blocked[m]) continue;
        if (G(BN.minX + a * ST, BN.minZ + b2 * ST) - G(BN.minX + i * ST, BN.minZ + j * ST) > 0.4) continue;
        seen[m] = 1; q.push(m);
      }
    }
    /* can the player stand within `r` of this point? */
    const near = (x, z, rad) => {
      for (let dx = -rad; dx <= rad; dx += ST) for (let dz = -rad; dz <= rad; dz += ST) {
        if (Math.hypot(dx, dz) > rad) continue;
        const px = x + dx, pz = z + dz;
        if (px < BN.minX || px > BN.maxX || pz < BN.minZ || pz > BN.maxZ) continue;
        if (seen[cell(px, pz)]) return true;
      }
      return false;
    };
    const targets = [];
    if (!g) {
    /* v16.4: a chapter whose decision object is behind a scene change (e3c1's
       Ajarn is in the private room, entered through a door) names where it is
       REACHED from — the door must be walkable, the room is a teleport */
    if (S.pileVia) targets.push({ what: 'the pile, via ' + S.pileVia.what, x: S.pileVia.x, z: S.pileVia.z, r: 1.2 });
    else targets.push({ what: 'the pile (his bed)', x: S.pile ? S.pile.pos.x : D.stage.pile.x, z: S.pile ? S.pile.pos.z : D.stage.pile.z, r: 1.6 });
    /* v21.0: and when the pile's world is one he ARRIVES in, the pile itself
       too — a decision closed with Step back is reopened by walking back to it */
    if (S.pileVia && arrivals.length && S.pile) targets.push({ what: 'the pile itself, from the arrival', x: S.pile.pos.x, z: S.pile.pos.z, r: 1.6 });
    if (typeof S.LINE_X === 'number') targets.push({ what: 'the fall-in line', x: S.LINE_X + 0.2, z: 0, r: 1.2 });
    }
    /* (v26.18: a hotspot that names a later ground, `ground`, is tried in that ground and not here) */
    for (const h of (S.hotspots || [])) if ((h.ground || null) === (g || null))
      targets.push({ what: 'hotspot ' + (h.id || h.prompt), x: h.pos.x, z: h.pos.z, r: Math.max(0.8, (h.radius || 1.5) - 0.3) });
    const named = (S.grounds || []).map(q => q.what);
    const undeclared = g ? [] : (S.hotspots || []).filter(h => h.ground && !named.includes(h.ground)).map(h => (h.id || h.prompt) + ' (' + h.ground + ')');
    /* v25.5: A CHAPTER MAY NAME THE GROUND HE MUST STAY ON (`stage.keepIn = { what, minX, maxX, minZ, maxZ }`), and no
       cell the flood reaches may lie outside it. Chad, of episode 4 chapter 2: "do not allow the player to exit the shop
       in the gameplay, i was able to walk out of the shop into other shops". v25.5 walled the open front and tried it at
       the front; the side walls beside the cabinets were pictures, and through them the flood reached the whole of the
       chapter's bounds (257 square metres, where the shop's own free floor is 17). A way OUT is the opposite fault to v7.1's sealed route, and
       the same flood sees it. A chapter that names nothing is not asked */
    let keep = null;
    const K = S.keepIn;
    /* (v26.18: a ground of several boxes, `boxes`: a cell is out when it is outside every one, by the nearest one) */
    if (K) { let n = 0, far = null, fd = 0; const KB = K.boxes || [K];
      for (let k = 0; k < seen.length; k++) if (seen[k]) { const x = BN.minX + ((k / nz) | 0) * ST, z = BN.minZ + (k % nz) * ST;
        const d = Math.min(...KB.map(b => Math.max(b.minX - x, x - b.maxX, b.minZ - z, z - b.maxZ)));
        if (d > 1e-6) { n++; if (d > fd) { fd = d; far = [x, z]; } } }
      keep = { what: K.what || 'its ground', n, far, area: n * ST * ST }; }
    return { targets: targets.map(t => ({ ...t, reach: near(t.x, t.z, t.r) })),
             spawnFree: fromFree, keep, undeclared, from: [+from.x.toFixed(2), +from.z.toFixed(2)],
             arrivals: arrivals.map(a => ({ what: a.what, free: !blocked[a.k] })) };
  };
  const r = await p.evaluate(FLOOD, null);

  /* v14.1: NOTHING IN THE WORLD MAY BE NaN. An InstancedMesh composed with a
     non-finite scale renders as shards and reports a null bounding sphere, so
     it is invisible to every other check — e2c5 shipped 51 NaN trees that way.
     This is the one harness that has a live scene per chapter. */
  const nan = await p.evaluate(() => {
    const bad = [];
    window.__enc.scene.traverse(o => {
      if (o.isInstancedMesh && o.instanceMatrix) {
        const a = o.instanceMatrix.array;
        let n = 0;
        for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) n++;
        if (n) bad.push(((o.parent && o.parent.name) || o.name || o.type) + ' ' + n + '/' + a.length);
      }
      if (o.isMesh || o.isInstancedMesh) {
        const v = o.position;
        if (!Number.isFinite(v.x) || !Number.isFinite(v.y) || !Number.isFinite(v.z))
          bad.push((o.name || o.type) + ' position');
      }
    });
    return bad;
  });
  ok(`${key}: nothing in the world is NaN`, nan.length === 0, nan.slice(0, 4).join(', '));

  /* v14.16: and no model it loads failed — the loader records a parse that
     failed, or a chapter's own onLoad that threw half-way through placing
     its model, and says so on the console; a chapter's `() => {}` onError
     used to be the end of it (the v12.2 rifle, the v8.5 capsules) */
  const lerr = await p.evaluate(() => window.__enc.loads().log.filter(l => l.err).map(l => `${l.key} (${l.kind}): ${l.err}`));
  ok(`${key}: every model it loads lands`, lerr.length === 0, lerr.slice(0, 4).join(' | '));

  ok(`${key}: spawn is on open floor`, r.spawnFree);
  for (const a of r.arrivals) ok(`${key}: ${a.what} is on open floor`, a.free);
  for (const t of r.targets)
    ok(`${key}: can WALK to ${t.what}`, t.reach, t.reach ? '' : `(${t.x.toFixed(2)}, ${t.z.toFixed(2)}) unreachable on foot`);
  if (r.keep) ok(`${key}: cannot walk out of ${r.keep.what}`, r.keep.n === 0,
    r.keep.n ? `${r.keep.area.toFixed(1)} square metres reached outside it, as far as (${r.keep.far[0].toFixed(2)}, ${r.keep.far[1].toFixed(2)})` : '');
  if (r.undeclared.length) ok(`${key}: every hotspot's ground is one the chapter names`, false, r.undeclared.join(', '));
  /* v26.18: A CHAPTER WHOSE GROUND CHANGES NAMES ITS LATER GROUNDS (`stage.grounds = [{ what, enter(), ready() }]`).
     Episode 4 chapter 3's next morning opens a gate and a hall the first frame keeps shut, and the hall's three places
     were "unreachable on foot" from the first frame (true, and not a fault). Each later ground is put in place by the
     chapter's own enter() (the way a Continue lands: the stage reset, the phase set), waited for by its ready(), and
     flooded again on the collision of that moment, from where it has put him: its hotspots (those naming it, `ground`)
     must be walkable, and the ground he is kept on then (stage.keepIn, read in that ground) must hold */
  const grounds = await p.evaluate(() => (window.__enc.stage.grounds || []).map(q => q.what));
  for (let gi = 0; gi < grounds.length; gi++) {
    const gname = grounds[gi];
    await p.evaluate((gi) => window.__enc.stage.grounds[gi].enter(), gi);
    const came = await p.waitForFunction((gi) => { try { return !!window.__enc.stage.grounds[gi].ready(); } catch { return false; } }, gi, { polling: 300, timeout: 600000 }).then(() => true, () => false);
    ok(`${key}: ${gname} is put in place`, came);
    if (!came) continue;
    const rg = await p.evaluate(FLOOD, gname);
    ok(`${key}: ${gname}: where it puts him (${rg.from}) is on open floor`, rg.spawnFree);
    if (!rg.targets.length) ok(`${key}: ${gname}: names a hotspot to walk to`, false);
    for (const t of rg.targets)
      ok(`${key}: ${gname}: can WALK to ${t.what}`, t.reach, t.reach ? '' : `(${t.x.toFixed(2)}, ${t.z.toFixed(2)}) unreachable on foot`);
    if (rg.keep) ok(`${key}: ${gname}: cannot walk out of ${rg.keep.what}`, rg.keep.n === 0,
      rg.keep.n ? `${rg.keep.area.toFixed(1)} square metres reached outside it, as far as (${rg.keep.far[0].toFixed(2)}, ${rg.keep.far[1].toFixed(2)})` : '');
  }
}

await br.close();

/* one line per distinct message, with how many frames threw it */
const tally = new Map();
for (const e of errs) tally.set(e, (tally.get(e) || 0) + 1);
ok('no chapter throws while it plays', tally.size === 0);
for (const [msg, n] of tally) console.log(`     ${n}x  ${msg}`);

console.log(bad ? `\n${bad} FAILED` : '\nevery target is walkable, and nothing throws');
process.exit(bad ? 1 : 0);
