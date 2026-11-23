/* v28.0 (E4C5, R41 and R43's check of it): GRANDMASTER PHO'S ELBOW SWING MEASURED AS A MOVE. The swing that lifts his
   elbow with his fist on the Naga stick (c_fightstage.js swing5) goes on from where it stood a moment ago: at most 150
   degrees a second, and to the other side only once it is back near nought. That holds only between frames drawn within
   a quarter second of each other, so on a box with no graphics card (a frame a second or slower) every frame solves
   afresh and e4c5hands' dense measure cannot see the move at all. Here the page's clock is SLOWED as filmlive.mjs slows
   it (performance.now, and the time handed to every frame, advance exactly STEP_MS a drawn frame), and each take is
   played through on that clock (lab.pose at the clock's own time), so the swing runs as a phone at 1000/STEP_MS frames a
   second runs it. At every drawn frame: the swing, the wrist it leaves (wd toward thumb/little finger, wf bent palm/back),
   the cost with the swing and without it. It prints per take: frames, the largest change of the swing between two
   frames, every change of side and how near nought it was, the frames where the swing left the wrist WORSE than none,
   and the wrist's range against its margins (wd -32 to 22, wf -50 to 60).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [TAKES=a,b] [STEP_MS=33] [OUT=file.json]
       node tools/probes/e4c5swinglive.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const STEP_MS = +(process.env.STEP_MS || 33);
const OUT = process.env.OUT || '/tmp/e4c5swinglive.json';
const TAKES = (process.env.TAKES || 'Charged_Spell_Cast,mage_soell_cast_7,mage_soell_cast_8,Charged_Spell_Cast_1,Talk_with_Hands_Open').split(',');
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 1, hasTouch: true, isMobile: false });
const p = await ctx.newPage(); const errs = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.open());
await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
await frames(4);
const durs = await p.evaluate(() => { const P = window.__enc.stage.plan.FLOOR.cast.pho; return P && P.acts ? Object.fromEntries(Object.entries(P.acts).map(([n, a]) => [n, +a.getClip().duration.toFixed(3)])) : {}; });
const sw0 = await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; return L.gripSwing ? L.gripSwing() : 'no gripSwing'; });
say('swing seam', JSON.stringify(sw0 && sw0.on));
/* (the slowed clock, once for the whole run: filmlive.mjs's, word for word in what it does) */
await p.evaluate((STEP_MS) => {
  const realNow = performance.now.bind(performance), realRaf = window.requestAnimationFrame.bind(window);
  window.__virt = realNow(); window.__realRaf = realRaf;
  performance.now = () => window.__virt;
  window.requestAnimationFrame = (cb) => realRaf(() => cb(window.__virt + 5000));
  const tick = () => { window.__virt += STEP_MS; realRaf(tick); };
  realRaf(tick);
}, STEP_MS);
await frames(6);
const res = { STEP_MS, takes: {}, errs };
for (const take of TAKES) {
  const D = durs[take]; if (!D) { say('no take', take); res.takes[take] = { err: 'no take' }; continue; }
  /* (one row a drawn frame, written in the page: the pose set at the clock's own time, the swing read a frame after) */
  await p.evaluate(({ take, D }) => {
    const L = window.__enc.stage.snap().story.fight.lab, rows = window.__sw = []; window.__swDone = false;
    const v0 = window.__virt; let prevT = null;
    const f = () => {
      const s = L.gripSwing(), last = s && s.last;
      if (prevT != null) rows.push(last ? { t: prevT, th: last.th, wd: last.wd, wf: last.wf, cost: last.cost, c0: last.at0 ? last.at0.cost : null } : { t: prevT, none: true });
      const t = (window.__virt - v0) / 1000;
      if (t > D) { L.pose(null); window.__swDone = true; return; }
      L.pose(take, t); prevT = +t.toFixed(3);
      window.__realRaf(f);
    };
    window.__realRaf(f);
  }, { take, D });
  await p.waitForFunction(() => window.__swDone, null, { timeout: 1800000, polling: 500 });
  const rows = await p.evaluate(() => window.__sw);
  const sw = rows.filter(r => !r.none);
  let maxStep = 0, maxAt = null, flips = [], worse = [], wd = [1e9, -1e9], wf = [1e9, -1e9], over = 0;
  for (let i = 0; i < sw.length; i++) { const r = sw[i];
    wd = [Math.min(wd[0], r.wd), Math.max(wd[1], r.wd)]; wf = [Math.min(wf[0], r.wf), Math.max(wf[1], r.wf)];
    if (r.wd > 22 || r.wd < -32 || r.wf > 60 || r.wf < -50) over++;
    if (r.c0 != null && r.cost > r.c0 + 1e-6 && Math.abs(r.th) > 0.01) worse.push([r.t, r.th, +r.cost.toFixed(1), +r.c0.toFixed(1)]);
    if (i) { const a = sw[i - 1], st = Math.abs(r.th - a.th); if (st > maxStep) { maxStep = st; maxAt = [a.t, a.th, r.t, r.th]; }
      if (Math.sign(a.th) && Math.sign(r.th) && Math.sign(a.th) !== Math.sign(r.th)) flips.push([a.t, a.th, r.t, r.th]); } }
  const lim = 150 * STEP_MS / 1000 + 0.25;
  res.takes[take] = { D, frames: rows.length, swungFrames: sw.filter(r => Math.abs(r.th) > 0.01).length, maxStep: +maxStep.toFixed(2), maxAt, limit: +lim.toFixed(2),
                      flips, worse: worse.slice(0, 20), worseN: worse.length, wd: wd.map(x => +x.toFixed(1)), wf: wf.map(x => +x.toFixed(1)), overMargin: over, rows };
  say(take, 'frames', rows.length, 'swung', res.takes[take].swungFrames, 'max step', maxStep.toFixed(2), '(limit', lim.toFixed(2) + ')', 'at', JSON.stringify(maxAt),
      'flips', JSON.stringify(flips), 'worse', worse.length, 'wd', JSON.stringify(res.takes[take].wd), 'wf', JSON.stringify(res.takes[take].wf), 'past margin', over);
}
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
say('RESULT', Object.entries(res.takes).map(([k, v]) => `${k}: step ${v.maxStep}/${v.limit} flips ${v.flips ? v.flips.length : '-'} worse ${v.worseN}`).join(' | '), 'errors', errs.length);
for (const e of errs.slice(0, 6)) say(e);
await b.close();
