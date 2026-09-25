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
for (const key of ['ch3', 'e2c1', 'e2c2', 'e2c3', 'e2c4', 'e2c5']) {
  where = key;
  await p.goto(PAGE + '?ch=' + key);
  await p.click('#startBtn');
  await toPlay(p, 180000);
  await p.waitForTimeout(4000);

  const r = await p.evaluate(() => {
    const E = window.__enc, B = E.blockers, S = E.stage, D = window.__CHAPTERS__[E.chapterKey()];
    const BN = D.bounds, ST = 0.06;
    const hit = (x, z) => {
      if (x < BN.minX || x > BN.maxX || z < BN.minZ || z > BN.maxZ) return true;
      for (const b of B) if (x >= b.min.x && x <= b.max.x && z >= b.min.z && z <= b.max.z && 1.0 >= b.min.y && 1.0 <= b.max.y) return true;
      return false;
    };
    const nx = Math.floor((BN.maxX - BN.minX) / ST) + 1, nz = Math.floor((BN.maxZ - BN.minZ) / ST) + 1;
    const blocked = new Uint8Array(nx * nz), seen = new Uint8Array(nx * nz);
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++)
      blocked[i * nz + j] = hit(BN.minX + i * ST, BN.minZ + j * ST) ? 1 : 0;
    const cell = (x, z) => Math.round((x - BN.minX) / ST) * nz + Math.round((z - BN.minZ) / ST);
    const q = [cell(D.spawn.x, D.spawn.z)]; seen[q[0]] = 1;
    for (let h = 0; h < q.length; h++) {
      const k = q[h], i = (k / nz) | 0, j = k % nz;
      for (const [di, dj] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const a = i + di, b2 = j + dj; if (a < 0 || a >= nx || b2 < 0 || b2 >= nz) continue;
        const m = a * nz + b2; if (seen[m] || blocked[m]) continue; seen[m] = 1; q.push(m);
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
    targets.push({ what: 'the pile (his bed)', x: S.pile ? S.pile.pos.x : D.stage.pile.x, z: S.pile ? S.pile.pos.z : D.stage.pile.z, r: 1.6 });
    if (typeof S.LINE_X === 'number') targets.push({ what: 'the fall-in line', x: S.LINE_X + 0.2, z: 0, r: 1.2 });
    for (const h of (S.hotspots || [])) targets.push({ what: 'hotspot ' + (h.id || h.prompt), x: h.pos.x, z: h.pos.z, r: Math.max(0.8, (h.radius || 1.5) - 0.3) });
    return { targets: targets.map(t => ({ ...t, reach: near(t.x, t.z, t.r) })),
             spawnFree: !blocked[cell(D.spawn.x, D.spawn.z)] };
  });

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
  for (const t of r.targets)
    ok(`${key}: can WALK to ${t.what}`, t.reach, t.reach ? '' : `(${t.x.toFixed(2)}, ${t.z.toFixed(2)}) unreachable on foot`);
}

await br.close();

/* one line per distinct message, with how many frames threw it */
const tally = new Map();
for (const e of errs) tally.set(e, (tally.get(e) || 0) + 1);
ok('no chapter throws while it plays', tally.size === 0);
for (const [msg, n] of tally) console.log(`     ${n}x  ${msg}`);

console.log(bad ? `\n${bad} FAILED` : '\nevery target is walkable, and nothing throws');
process.exit(bad ? 1 : 0);
