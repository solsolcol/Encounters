/* v26.0: EPISODE 4 CHAPTER 3, WALKED IN EVERY ONE OF ITS GROUNDS. walktest floods a chapter's collision once, as its
   first frame has it; this chapter has three grounds he walks on (the gathering, the blessings, the next morning), each
   with its own people standing in his way, and its finger-driver steps him to each press (a teleport cannot see a sealed
   route: v7.4). So: for each phase a player can stand in, the chapter is put there the way a Continue lands (the stage
   reset, the phase set, the next live frame applying it), and the REAL collision list of that moment is flooded from
   WHERE THAT PHASE PUTS HIM (never from anywhere else: a route is from where he is), on walktest's own grid and rule
   (a point a metre up, blocked inside any box or outside the chapter's bounds). Then every thing that phase offers him
   (each hotspot that is live) must have open, reached floor within its own reach; the place he must walk ONTO (the
   zone's ring) must itself be reached; and nothing reached may lie outside the ground the stage says he stays on.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [PH='arrive|baisri|...'] [OUT=dir] node tools/probes/e4c3walk.mjs
   Prints a line a phase and writes <OUT>/<phase>.txt, the flood as a map ('#' blocked, 'o' reached, '.' open and not
   reached, 'T' a target, 'S' where he stands). Exits 1 if anything a phase offers cannot be walked to, or he can leave. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c3walk';
fs.mkdirSync(OUT, { recursive: true });
/* (the phases he walks in: at `place`, `knelt` and after, he kneels and presses from where he is) */
const PH = (process.env.PH || 'arrive|baisri|tables|check|check:t|check:a|dawn').split('|');
const b = await chromium.launch(LAUNCH);
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })).newPage();
p.setDefaultTimeout(600000); p.setDefaultNavigationTimeout(600000);
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
await p.goto(PAGE + '?ch=e4c3');
await p.waitForFunction(() => !!window.__enc);
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { const i = window.__enc.stage.info(); return i.applied && !i.waiting.length && window.__enc.stage.dayClock.t > 1; } catch { return false; } }, null, { polling: 500 });
let bad = 0;
for (const ph of PH) {
  if (ph !== 'arrive') await p.evaluate((ph) => { const E = window.__enc; E.stage.reset(); E.kit.setPhase(ph.includes(':') ? ph : ph + ':'); }, ph);
  await p.waitForFunction((ph) => { const i = window.__enc.stage.info(); return i.phase === ph.split(':')[0] && i.applied && window.__enc.stage.dayClock.t > 1.2; }, ph, { polling: 300 });
  /* (a phase that opens with lines holds him until they are said: the ground is read when he is free to walk) */
  await p.waitForFunction(() => { const i = window.__enc.stage.info(); return !i.busy && !i.pending && !i.queued; }, null, { polling: 300, timeout: 240000 }).catch(() => {});
  const r = await p.evaluate(() => {
    const E = window.__enc, B = E.blockers, S = E.stage, D = window.__CHAPTERS__[E.chapterKey()], BN = D.bounds, ST = 0.06, G = E.groundAt || (() => 0);
    const hit = (x, z) => { if (x < BN.minX || x > BN.maxX || z < BN.minZ || z > BN.maxZ) return true; const y = 1.0 + G(x, z);
      for (const q of B) if (x >= q.min.x && x <= q.max.x && z >= q.min.z && z <= q.max.z && y >= q.min.y && y <= q.max.y) return true; return false; };
    const nx = Math.floor((BN.maxX - BN.minX) / ST) + 1, nz = Math.floor((BN.maxZ - BN.minZ) / ST) + 1, blocked = new Uint8Array(nx * nz), seen = new Uint8Array(nx * nz);
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) blocked[i * nz + j] = hit(BN.minX + i * ST, BN.minZ + j * ST) ? 1 : 0;
    const cell = (x, z) => Math.max(0, Math.min(nx - 1, Math.round((x - BN.minX) / ST))) * nz + Math.max(0, Math.min(nz - 1, Math.round((z - BN.minZ) / ST)));
    const me = { x: E.yaw.position.x, z: E.yaw.position.z }, q = [cell(me.x, me.z)], meBlocked = !!blocked[q[0]]; seen[q[0]] = 1;
    for (let h = 0; h < q.length; h++) { const k = q[h], i = (k / nz) | 0, j = k % nz;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, c = j + dj; if (a < 0 || a >= nx || c < 0 || c >= nz) continue;
        const m = a * nz + c; if (seen[m] || blocked[m]) continue; seen[m] = 1; q.push(m); } }
    const near = (x, z, rad) => { for (let dx = -rad; dx <= rad; dx += ST) for (let dz = -rad; dz <= rad; dz += ST) { if (Math.hypot(dx, dz) > rad) continue;
      const px = x + dx, pz = z + dz; if (px < BN.minX || px > BN.maxX || pz < BN.minZ || pz > BN.maxZ) continue; if (seen[cell(px, pz)]) return true; } return false; };
    const T = [];
    for (const h of (S.hotspots || [])) { if (h.done || (h.enabled && !h.enabled())) continue;
      T.push({ what: h.id, x: h.pos.x, z: h.pos.z, r: Math.max(0.8, (h.radius || 1.5) - 0.3), any: !!h.anyView }); }
    /* the ring he must walk ONTO (his place on the mats, once his respects are paid; the place to kneel before his teacher) */
    const I0 = S.info(), PL = (S.dbg && S.dbg.places) || {}, ring = I0.phase === 'tables' ? PL.PLACE : I0.phase === 'dawn' ? PL.KNEEL2 : null;
    const K = S.keepIn; let out = 0, far = 0;
    if (K) for (let k = 0; k < seen.length; k++) if (seen[k]) { const x = BN.minX + ((k / nz) | 0) * ST, z = BN.minZ + (k % nz) * ST, d = Math.max(K.minX - x, x - K.maxX, K.minZ - z, z - K.maxZ); if (d > 1e-6) { out++; far = Math.max(far, d); } }
    const I = S.info(), o = document.getElementById('objective');
    const rows = []; const stepC = 4;                                            // a character a 24 cm
    for (let j = 0; j < nz; j += stepC) { let row = ''; for (let i = 0; i < nx; i += stepC) { const k = i * nz + j; row += blocked[k] ? '#' : seen[k] ? 'o' : '.'; } rows.push(row); }
    const mark = (x, z, ch) => { const i = Math.round((x - BN.minX) / ST / stepC), j = Math.round((z - BN.minZ) / ST / stepC); if (rows[j] && i >= 0 && i < rows[j].length) rows[j] = rows[j].slice(0, i) + ch + rows[j].slice(i + 1); };
    for (const t of T) mark(t.x, t.z, 'T'); mark(me.x, me.z, 'S');
    return { phase: I.phase, look: I.look, obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
             me: [+me.x.toFixed(2), +me.z.toFixed(2)], meBlocked, reached: q.length, area: +(q.length * ST * ST).toFixed(1), blockers: B.length,
             targets: T.map(t => ({ what: t.what, at: [+t.x.toFixed(2), +t.z.toFixed(2)], r: +t.r.toFixed(2), reach: t.any || near(t.x, t.z, t.r) })),
             out, far: +far.toFixed(2), keep: K ? K.what : null, map: rows.join('\n'),
             zone: ring ? { at: [+ring.x.toFixed(2), +ring.z.toFixed(2)], reach: near(ring.x, ring.z, 0.35) } : null };
  });
  fs.writeFileSync(`${OUT}/${ph.replace(/[^a-z0-9]/gi, '_')}.txt`, `${ph}: he stands at ${r.me}; '#' blocked, 'o' reached, '.' open and not reached, 'T' a target, 'S' himself (a character is 24 cm; north is up)\n${r.map}\n`);
  const miss = r.targets.filter(t => !t.reach), zoneBad = r.zone && !r.zone.reach;
  const ok = !r.meBlocked && !miss.length && !zoneBad && !r.out;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${ph.padEnd(9)} "${r.obj}": he stands at ${r.me}${r.meBlocked ? ' INSIDE A BLOCKER' : ''}; ${r.area} m2 walked of ${r.blockers} blockers' ground; ` +
    `${r.targets.map(t => `${t.what}${t.reach ? '' : ' NOT REACHED (' + t.at + ')'}`).join(', ') || 'nothing offered'}` +
    `${r.zone ? `; the ring at ${r.zone.at}${r.zone.reach ? '' : ' NOT REACHED'}` : ''}${r.out ? `; HE CAN LEAVE ${r.keep}: ${r.out} cells, ${r.far} m out` : ''}`);
}
console.log('errs', JSON.stringify(errs));
console.log(bad || errs.length ? `${bad} phases with a fault` : `every phase's ground walked: ${PH.join(', ')}`);
await b.close();
process.exit(bad || errs.length ? 1 : 0);
