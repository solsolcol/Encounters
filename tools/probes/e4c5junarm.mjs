/* v28.0 (E4C5, R145) · JUN'S ARM ACROSS THE OPENING'S HAND-OVER: Chad, 25 Nov 2026: "right after the chapter title text ends
   and the game goes into the playable section, jun's arm is spinning for a split second". ?ch=e4c5 on a phone (390 x 844,
   a touch context), Start, and the opening film let PLAY TO ITS OWN END (never skipped: the skip is another path), through
   the chapter card, into play for PLAYSECS seconds. Every drawn frame from FROM seconds before the film's end it writes, as
   the frame was drawn (an animation-frame callback queued after the engine's, so after its render):
     the engine's state, the chapter's phase, the film's clock, Jun's take (P.cur) and his film hold (P.filmT), whether his
     arms carry a laid pose (P.arms.L.wrote), whether he and the duffel are drawn, his LEFT upper arm's, forearm's and hand's
     local turns, and his upper arm's line in his body's frame; then the turn from the frame before (degrees).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=<file.json>] [FROM=4] [PLAYSECS=8] [DPR=1] node tools/probes/e4c5junarm.mjs
   (through tools/bslot.sh) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const FROM = +(process.env.FROM || 4), PLAYSECS = +(process.env.PLAYSECS || 8), DPR = +(process.env.DPR || 1);
const OUT = process.env.OUT || 'junarm.json';
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /threw|CARRY5/.test(m.text())) errs.push('CONSOLE ' + m.type() + ' ' + m.text().slice(0, 300)); });
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
console.log(el(), 'loaded');
await p.evaluate(({ FROM }) => {
  const E = window.__enc, rows = []; window.__junRows = rows;
  let prev = null;
  const q = (b) => b ? [b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w].map(v => +v.toFixed(5)) : null;
  const ang = (a, b) => { if (!a || !b) return null; const d = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]); return +(2 * Math.acos(Math.min(1, d)) * 180 / Math.PI).toFixed(2); };
  const f = () => {
    requestAnimationFrame(f);
    try {
      const st = E.getState(), S = E.stage; if (!S || !S.films || !S.films.people) return;
      const cineOn = st === 'cine' && E.cine && E.cine.active(), ct = cineOn ? E.cine.t() : null;
      const P = S.films.people().find(x => /jun/.test(x.key)); if (!P || !P.ready) return;
      const dur = E.cine && E.cine.dur ? E.cine.dur() : null;
      if (st === 'title') return;
      if (cineOn && !(window.__junSeen || (dur && ct > dur - FROM))) return;
      window.__junSeen = true;
      const bone = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const up = bone(/LeftArm$/), fo = bone(/LeftForeArm$/), ha = bone(/LeftHand$/);
      let line = null;
      if (up && fo) { up.updateWorldMatrix(true, false); fo.updateWorldMatrix(true, false);
        const a = up.getWorldPosition(up.position.clone()), c = fo.getWorldPosition(up.position.clone());
        const v = c.sub(a); P.group.updateWorldMatrix(true, false); const qi = P.group.getWorldQuaternion(up.quaternion.clone()).invert(); v.applyQuaternion(qi).normalize();
        line = [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)]; }
      const row = { now: +performance.now().toFixed(1), st, phase: S.phase, ct: ct == null ? null : +ct.toFixed(3), cur: P.cur, filmT: P.filmT == null ? null : +(+P.filmT).toFixed(3),
        wrote: !!(P.arms && P.arms.L && P.arms.L.wrote), vis: P.group.visible, duffel: !!(S.things && S.things.duffel && S.things.duffel.visible),
        up: q(up), fore: q(fo), hand: q(ha), line };
      /* (and Ton's RIGHT arm, which carries the wrapped staff by the same draw-time lay) */
      const TN = S.films.people().find(x => /ton/.test(x.key));
      if (TN && TN.ready) { const tb = (re) => { for (const n in TN.bone) if (re.test(n)) return TN.bone[n]; return null; };
        row.tUp = q(tb(/RightArm$/)); row.tFore = q(tb(/RightForeArm$/)); row.tHand = q(tb(/RightHand$/)); row.tCur = TN.cur; }
      if (prev) { row.dUp = ang(prev.up, row.up); row.dFore = ang(prev.fore, row.fore); row.dHand = ang(prev.hand, row.hand);
        if (row.tUp && prev.tUp) { row.tdUp = ang(prev.tUp, row.tUp); row.tdFore = ang(prev.tFore, row.tFore); row.tdHand = ang(prev.tHand, row.tHand); } }
      prev = row; rows.push(row);
    } catch (e) { if (!window.__junErr) window.__junErr = String(e && e.stack || e); }
  };
  requestAnimationFrame(f);
}, { FROM });
await p.evaluate(() => document.getElementById('startBtn').click());
console.log(el(), 'started');
await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 250 });
console.log(el(), 'film on');
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 1500000, polling: 250 });
console.log(el(), 'play');
await p.waitForTimeout(PLAYSECS * 1000);
const res = await p.evaluate(() => ({ rows: window.__junRows, err: window.__junErr || null }));
fs.writeFileSync(OUT, JSON.stringify({ rows: res.rows, err: res.err, errs }, null, 0));
console.log(el(), 'rows', res.rows.length, 'err', res.err);
await b.close();
