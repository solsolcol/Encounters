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

for (const key of ['e2c1']) {
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

  ok(`${key}: spawn is on open floor`, r.spawnFree);
  for (const t of r.targets)
    ok(`${key}: can WALK to ${t.what}`, t.reach, t.reach ? '' : `(${t.x.toFixed(2)}, ${t.z.toFixed(2)}) unreachable on foot`);
}

await br.close();
console.log(bad ? `\n${bad} unreachable` : '\nevery target is walkable');
process.exit(bad ? 1 : 0);
