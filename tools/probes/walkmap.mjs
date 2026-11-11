/* v25.5 · WHERE HE CAN WALK, AS A MAP (the audit of 9 to 11 Nov 2026; Chad, 10 Nov: "do not allow the player to exit the
   shop in the gameplay, i was able to walk out of the shop into other shops"). walktest's own flood of the real collision
   grid (the chapter's blockers and its bounds, from the spawn and every arrival the stage names), written out cell by
   cell so it can be drawn: a wall that is not solid cannot be photographed, and this is its picture.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... KEY=e4c2 OUT=<file.json> node tools/probes/walkmap.mjs
   then  python3 -I tools/probes/walkmap.py <out.png> <title>=<file.json> [<title>=<file.json> ...]
   The JSON holds the grid (its origin, its step, how many cells each way), a row of characters for each line of cells
   ('#' blocked, '.' open and never reached, 'o' reached), the stage's keepIn box if it names one, and the spawn. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const KEY = process.env.KEY || 'e4c2', OUT = process.env.OUT || `/tmp/walkmap-${KEY}.json`;
const b = await chromium.launch(LAUNCH);
const p = await (await b.newContext()).newPage();
p.setDefaultNavigationTimeout(180000);
await p.goto(PAGE + '?ch=' + KEY);
await p.click('#startBtn');
await toPlay(p, 600000);
await p.waitForTimeout(4000);
const r = await p.evaluate(() => {
  const E = window.__enc, B = E.blockers, S = E.stage, D = window.__CHAPTERS__[E.chapterKey()];
  const BN = D.bounds, ST = 0.06, G = E.groundAt || (() => 0);
  const hit = (x, z) => {
    if (x < BN.minX || x > BN.maxX || z < BN.minZ || z > BN.maxZ) return true;
    const y = 1.0 + G(x, z);
    for (const q of B) if (x >= q.min.x && x <= q.max.x && z >= q.min.z && z <= q.max.z && y >= q.min.y && y <= q.max.y) return true;
    return false;
  };
  const nx = Math.floor((BN.maxX - BN.minX) / ST) + 1, nz = Math.floor((BN.maxZ - BN.minZ) / ST) + 1;
  const blocked = new Uint8Array(nx * nz), seen = new Uint8Array(nx * nz);
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) blocked[i * nz + j] = hit(BN.minX + i * ST, BN.minZ + j * ST) ? 1 : 0;
  const cell = (x, z) => Math.round((x - BN.minX) / ST) * nz + Math.round((z - BN.minZ) / ST);
  const q = [cell(D.spawn.x, D.spawn.z)]; seen[q[0]] = 1;
  for (const a of (S.arrivals || [])) { const k = cell(a.x, a.z); if (!blocked[k] && !seen[k]) { seen[k] = 1; q.push(k); } }
  for (let h = 0; h < q.length; h++) { const k = q[h], i = (k / nz) | 0, j = k % nz;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, c = j + dj; if (a < 0 || a >= nx || c < 0 || c >= nz) continue;
      const m = a * nz + c; if (seen[m] || blocked[m]) continue;
      if (G(BN.minX + a * ST, BN.minZ + c * ST) - G(BN.minX + i * ST, BN.minZ + j * ST) > 0.4) continue;
      seen[m] = 1; q.push(m); } }
  const rows = [];
  for (let j = 0; j < nz; j++) { let s = ''; for (let i = 0; i < nx; i++) { const k = i * nz + j; s += blocked[k] ? '#' : seen[k] ? 'o' : '.'; } rows.push(s); }
  return { key: E.chapterKey(), minX: BN.minX, minZ: BN.minZ, st: ST, nx, nz, rows, reached: q.length, area: +(q.length * ST * ST).toFixed(1),
           keepIn: S.keepIn || null, spawn: [D.spawn.x, D.spawn.z] };
});
fs.writeFileSync(OUT, JSON.stringify(r));
console.log('wrote', OUT, r.key, 'cells reached', r.reached, 'area', r.area, 'square metres', r.keepIn ? 'keepIn ' + JSON.stringify(r.keepIn) : 'no keepIn');
await b.close();
