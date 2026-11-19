/* v27.0 build 44 (Chad, 19 Nov 2026, R103/R104): episode 4 chapter 4's OPENING FILM, sought on its own clock on a phone
   (390 x 844 CSS points, a touch context; pictures drawn at DSF device pixels a point, 2 by default).
     CUTS (R104, "when the camera switches to ravi for him to say come in, it is not a smooth transition, it sorts of
       jumps"): from FROM to UNTIL every STEP seconds, the lens's place and aim, the black's opacity and Ravi's place are
       read at each moment; wherever the lens or Ravi JUMPS between two moments (the lens more than 0.15 m or 3 degrees in
       one step, Ravi more than 0.05 m), the black at the later moment must be whole (0.98 or more), so no jump is ever
       seen. A row for each jump; the run fails on one seen.
     SHOTS=t1,t2,... : the picture at each of those moments, into OUT (the estate from her corridor, the gate, the door).
   Every page error and console error is printed; the run exits non-zero on one, or on a jump seen.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [DSF=2] [FROM=19.5] [UNTIL=26.5] [STEP=0.05] [SHOTS=...]
       node tools/probes/e4c4open.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4open';
fs.mkdirSync(OUT, { recursive: true });
const DSF = +(process.env.DSF || 2), FROM = +(process.env.FROM || 19.5), UNTIL = +(process.env.UNTIL || 26.5), STEP = +(process.env.STEP || 0.05);
const SHOTS = (process.env.SHOTS || '').split(',').filter(Boolean).map(Number);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 300 });
await p.waitForFunction(() => window.__enc.cine.t() > 0.2, null, { timeout: 600000, polling: 300 });
await frames(4);
const dur = await p.evaluate(() => window.__enc.cine.dur());
log('the opening film, dur', dur.toFixed(2));
/* the cuts: every moment read */
const rows = await p.evaluate(({ from, until, step }) => {
  const E = window.__enc, cam = E.camera, V = cam.position.constructor, d = new V(), w = new V(), out = [];
  const fadeEl = document.getElementById('cineFade');
  for (let t = from; t <= until + 1e-6; t += step) {
    E.cine.seek(t); cam.updateMatrixWorld(true); cam.getWorldDirection(d); cam.getWorldPosition(w);
    let rv = null; try { const P = E.stage.dbg.cast.ravi; if (P && P.group) rv = P.group.position.toArray().map(v => +v.toFixed(3)); } catch { }
    out.push({ t: +t.toFixed(2), pos: w.toArray().map(v => +v.toFixed(3)), dir: d.toArray().map(v => +v.toFixed(4)),
               fade: +(+(fadeEl && fadeEl.style.opacity || 0)).toFixed(3), ravi: rv, shot: E.stage.dbg.FM ? E.stage.dbg.FM.shot : null });
  }
  return out;
}, { from: FROM, until: UNTIL, step: STEP });
const jumps = [];
for (let i = 1; i < rows.length; i++) {
  const A = rows[i - 1], B = rows[i];
  const dp = Math.hypot(B.pos[0] - A.pos[0], B.pos[1] - A.pos[1], B.pos[2] - A.pos[2]);
  const ang = Math.acos(Math.max(-1, Math.min(1, A.dir[0] * B.dir[0] + A.dir[1] * B.dir[1] + A.dir[2] * B.dir[2]))) * 180 / Math.PI;
  const dr = A.ravi && B.ravi ? Math.hypot(B.ravi[0] - A.ravi[0], B.ravi[2] - A.ravi[2]) : 0;
  if (dp > 0.15 || ang > 3 || dr > 0.05) jumps.push({ at: B.t, lens: +dp.toFixed(3), deg: +ang.toFixed(2), ravi: +dr.toFixed(3), black: B.fade, seen: B.fade < 0.98 });
}
for (const j of jumps) log(j.seen ? 'SEEN JUMP' : 'jump under the black', JSON.stringify(j));
log('the black between', FROM, 'and', UNTIL, ':', rows.filter(r => r.fade > 0.01).map(r => r.t + ':' + r.fade).join(' '));
fs.writeFileSync(`${OUT}/cuts.json`, JSON.stringify(rows));
/* the pictures */
if (SHOTS.length) {
  await p.evaluate(() => { const s = document.createElement('style'); s.textContent = '#caption{display:none !important}'; document.head.append(s); });
  for (const t of SHOTS) {
    await p.evaluate((t) => { const el = document.getElementById('cineFade'); if (el) el.style.opacity = '0'; window.__enc.cine.seek(t); }, t);
    await frames(3); await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/open-${t.toFixed(1).padStart(5, '0')}.png`, timeout: 240000 });
  }
  log(SHOTS.length, 'pictures in', OUT);
}
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length || jumps.some(j => j.seen) ? 1 : 0);
