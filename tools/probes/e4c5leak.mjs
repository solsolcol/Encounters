/* v28.0 (E4C5, M6): WHERE THE WALK GETS OUT. The walk test's own flood (walktest.mjs FLOOD: the engine's blockers, the
   chapter's bounds and ground, 6 cm cells) from the spawn (or PHASE's start, set as a Continue lands it), and every reached
   cell outside stage.keepIn that touches a reached cell inside it: the breaches, grouped to 0.3 m, with the blockers
   nearest each. ENC_DIST=<snapshot> CHROMIUM_PATH=... [PHASE=hunt] node tools/probes/e4c5leak.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH);
const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, { timeout: 900000, polling: 500 });
if (process.env.PHASE) { await p.evaluate((ph) => window.__enc.stage.setPhase(ph), process.env.PHASE); await p.waitForTimeout(3000); }
const r = await p.evaluate(() => {
  const E = window.__enc, B = E.blockers, S = E.stage, D = window.__CHAPTERS__[E.chapterKey()], BN = D.bounds, ST = 0.06, G = E.groundAt || (() => 0);
  const hit = (x, z) => { if (x < BN.minX || x > BN.maxX || z < BN.minZ || z > BN.maxZ) return true; const y = 1.0 + G(x, z);
    for (const b of B) if (x >= b.min.x && x <= b.max.x && z >= b.min.z && z <= b.max.z && y >= b.min.y && y <= b.max.y) return true; return false; };
  const nx = Math.floor((BN.maxX - BN.minX) / ST) + 1, nz = Math.floor((BN.maxZ - BN.minZ) / ST) + 1;
  const blocked = new Uint8Array(nx * nz), seen = new Uint8Array(nx * nz);
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) blocked[i * nz + j] = hit(BN.minX + i * ST, BN.minZ + j * ST) ? 1 : 0;
  const cell = (x, z) => Math.round((x - BN.minX) / ST) * nz + Math.round((z - BN.minZ) / ST);
  const from = { x: E.yaw.position.x, z: E.yaw.position.z };
  const q = [cell(from.x, from.z)]; seen[q[0]] = 1;
  for (let h = 0; h < q.length; h++) { const k = q[h], i = (k / nz) | 0, j = k % nz;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, c = j + dj; if (a < 0 || a >= nx || c < 0 || c >= nz) continue;
      const m = a * nz + c; if (seen[m] || blocked[m]) continue; seen[m] = 1; q.push(m); } }
  const KB = S.keepIn.boxes, inside = (x, z) => KB.some(b => x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ);
  const out = new Map();
  for (let k = 0; k < seen.length; k++) { if (!seen[k]) continue; const i = (k / nz) | 0, j = k % nz, x = BN.minX + i * ST, z = BN.minZ + j * ST;
    if (inside(x, z)) continue;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const m = (i + di) * nz + (j + dj); if (!seen[m]) continue;
      const x2 = BN.minX + (i + di) * ST, z2 = BN.minZ + (j + dj) * ST; if (!inside(x2, z2)) continue;
      const key = (Math.round(x / 0.3) * 0.3).toFixed(1) + ',' + (Math.round(z / 0.3) * 0.3).toFixed(1); out.set(key, (out.get(key) || 0) + 1); } }
  return { from, reached: q.length, breaches: [...out.entries()].slice(0, 40) };
});
console.log(JSON.stringify(r, null, 1));
console.log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
