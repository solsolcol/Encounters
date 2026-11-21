/* v28.0 (E4C5, R25): EVERY PERSON OF THE PLAY, FRAME BY FRAME. Chad (R25): "jerky motions, characters vanishing and
   reappearing". The chapter's play is run on a phone (390 x 844, a touch context) and every drawn frame each person's place,
   turn, visibility, level of detail and take are written down while he walks: the walkway (Ton, Jun and their teacher
   following him to the gate, then his teacher walking on ahead when he stands still), the hunt (from his door into the
   court and back, his sight opened there: his teacher comes beside him), and the table (seated). Then each person's record
   is read for: a JUMP (moved further in a frame than a walk can), a SNAP of the turn, a body SHOWN or HIDDEN while it is in
   the lens (a flicker), and a LEVEL switched while it is in the lens near (a pop). His own walk is laid on by the probe a
   frame at a time at a walking pace (the walk test walks the ground; this reads the people round him).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] node tools/probes/e4c5motion.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5motion';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
const T0 = Date.now(), logf = fs.createWriteStream(OUT + '/log.txt');
const log = (...a) => { const s = ((Date.now() - T0) / 1000).toFixed(0) + 's ' + a.join(' '); console.log(s); logf.write(s + '\n'); };
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, { timeout: 900000, polling: 500 });
/* the recorder, in the page: every frame, every person */
await p.evaluate(() => {
  const E = window.__enc, F = E.stage.plan.FLOOR, cam = E.camera, V = new cam.position.constructor();
  window.__mot = { rec: [], on: false, walk: null };
  const names = ['pho', 'phoS', 'ton', 'jun', 'koh', 'col'];
  const tick = () => {
    const M = window.__mot;
    if (M.walk) { const W = M.walk, now = performance.now(), dt = Math.min(0.1, (now - (W.last || now)) / 1000); W.last = now;
      if (W.i < W.path.length) { const [tx, tz] = W.path[W.i], y = E.yaw.position, dx = tx - y.x, dz = tz - y.z, d = Math.hypot(dx, dz), st = 1.3 * dt;
        if (d <= st) { y.x = tx; y.z = tz; W.i++; } else { y.x += dx / d * st; y.z += dz / d * st; E.yaw.rotation.y = Math.atan2(-dx, -dz); } }
      else M.walk = null; }
    if (M.on) {
      cam.updateMatrixWorld();
      const row = { t: performance.now() / 1000, st: E.getState(), me: [E.yaw.position.x, E.yaw.position.z] };
      for (const n of names) { const P = F.cast[n]; if (!P || !P.group) continue; const g = P.group.position;
        let seen = false; if (P.group.visible) { V.set(g.x, g.y + 1.0, g.z).project(cam); seen = V.z < 1 && Math.abs(V.x) < 1.1 && Math.abs(V.y) < 1.1; }
        row[n] = [+g.x.toFixed(3), +g.z.toFixed(3), +P.group.rotation.y.toFixed(3), P.group.visible ? 1 : 0, P.lvNow, P.cur || '', seen ? 1 : 0, P.ready ? 1 : 0]; }
      M.rec.push(row);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
async function phase(ph) {
  await p.evaluate((ph) => { const E = window.__enc; if (E.cine && E.cine.active && E.cine.active() && E.cine.skip) E.cine.skip(); E.stage.reset(); E.kit.setPhase(ph); }, ph);
  await p.waitForFunction((ph) => { const E = window.__enc; return E.getState() === 'play' && E.stage.info().phase === ph.split(':')[0] && E.stage.info().applied && E.stage.dayClock.t > 0.3; }, ph, { timeout: 600000, polling: 300 });
  await frames(6);
}
const walkPath = (path) => p.evaluate((path) => { window.__mot.walk = { path, i: 0, last: 0 }; }, path);
const walkDone = () => p.waitForFunction(() => !window.__mot.walk, null, { timeout: 900000, polling: 300 });
const rec = (on) => p.evaluate((on) => { window.__mot.on = on; }, on);
const take = async (name) => { const R = await p.evaluate(() => { const r = window.__mot.rec; window.__mot.rec = []; return r; }); fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(R)); log(name, R.length, 'frames'); return R; };
const runs = {};
const ONLY = process.env.RUNS ? process.env.RUNS.split(',') : null, want = (k) => !ONLY || ONLY.includes(k);
/* the walkway, both asked: he walks it to the gate; then, back at the start, he stands still until his teacher walks on */
if (want('walk')) { await phase('walk:t,j,e'); await rec(true);
await walkPath([[0.1, -3], [0.1, -8], [0.05, -13.8], [-1.5, -14.9], [-7.6, -15.1]]); await walkDone();
await new Promise(r => setTimeout(r, 4000)); runs.walk = await take('walk'); }
if (want('ahead')) { await phase('walk:t,j,e'); await rec(true);
const sn = async () => log('  story', JSON.stringify(await p.evaluate(() => { const S = window.__enc.stage, s = S.snap().story; return { t: S.dayClock.t, walkers: s.walkers, idle: s.walkIdle, given: s.given, phase: s.phase, found: s.found }; })));
await sn();
await p.waitForFunction(() => window.__enc.stage.dayClock.t > 52, null, { timeout: 1500000, polling: 1000 }).catch(() => log('  the walkway clock did not reach 52 s'));
await sn(); await new Promise(r => setTimeout(r, 3000)); await sn(); runs.ahead = await take('ahead'); }
if (want('hunt')) {
/* the hunt: from his door into the court, his sight opened there, and back */
await phase('hunt:s1'); await rec(true);
await walkPath([[-8.5, -6.5], [-8.6, -9.5]]); await walkDone();
await p.evaluate(() => window.__enc.visionToggle()); await new Promise(r => setTimeout(r, 9000));
await p.evaluate(() => window.__enc.visionToggle()); await walkPath([[-8.4, -7.0], [-7.9, -5.2]]); await walkDone();
await new Promise(r => setTimeout(r, 3000)); runs.hunt = await take('hunt'); }
/* the table: seated */
if (want('table')) { await phase('table:'); await rec(true); await new Promise(r => setTimeout(r, 12000)); runs.table = await take('table'); }
/* the reading */
const names = ['pho', 'phoS', 'ton', 'jun', 'koh', 'col'];
const out = [];
for (const k in runs) { const R = runs[k];
  for (const n of names) { let jumps = 0, snaps = 0, flick = 0, pops = 0, shown = 0, hidden = 0, slides = 0; const notes = [];
    for (let i = 1; i < R.length; i++) { const a = R[i - 1][n], c = R[i][n]; if (!a || !c || R[i].st !== 'play' || R[i - 1].st !== 'play') continue;
      const dt = Math.max(0.001, R[i].t - R[i - 1].t), d = Math.hypot(c[0] - a[0], c[1] - a[1]);
      const dr = Math.abs(Math.atan2(Math.sin(c[2] - a[2]), Math.cos(c[2] - a[2])));
      /* a SLIDE: carried over the ground in a take that is not a walk */
      if (a[3] && c[3] && d / dt > 0.3 && d < 0.5 && !/Walk|Run/.test(c[5])) { slides++; if (notes.length < 6) notes.push(`slides ${(d / dt).toFixed(2)} m/s in ${c[5]} at f${i}`); }
      if (a[3] && c[3] && d > Math.max(0.15, 2.2 * dt)) { jumps++; if (notes.length < 6) notes.push(`jump ${d.toFixed(2)} m in ${dt.toFixed(2)} s at f${i} seen ${a[6]}${c[6]}`); }
      if (a[3] && c[3] && dr > Math.max(0.35, 6 * dt) && (a[6] || c[6])) { snaps++; if (notes.length < 6) notes.push(`turn ${dr.toFixed(2)} rad in ${dt.toFixed(2)} s at f${i}`); }
      if (a[3] !== c[3]) { if (c[3]) shown++; else hidden++; if (a[6] || c[6] || (c[3] && R[i + 1] && R[i + 1][n] && R[i + 1][n][6])) { flick++; if (notes.length < 6) notes.push(`${c[3] ? 'shown' : 'hidden'} in the lens at f${i}`); } }
      if (a[4] !== c[4] && a[3] && c[3] && (a[6] || c[6])) { pops++; if (notes.length < 6) notes.push(`level ${a[4]}->${c[4]} in the lens at f${i}, ${Math.hypot(c[0] - R[i].me[0], c[1] - R[i].me[1]).toFixed(1)} m`); } }
    const any = R.some(r => r[n] && r[n][3]);
    if (any || shown || hidden) out.push(`${k} ${n}: jumps ${jumps}, slides ${slides}, snaps ${snaps}, shown/hidden in the lens ${flick} (shown ${shown}, hidden ${hidden}), level pops ${pops}${notes.length ? ' | ' + notes.join('; ') : ''}`); } }
for (const s of out) log('READ', s);
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close(); process.exit(0);
