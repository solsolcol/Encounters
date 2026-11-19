/* v27.0 build 46 (Chad, 19 Nov 2026, R106: "ravi still does a weird head spin at the end before pho says 'see a doctor', just
   dont make ravi turn his head"): RAVI'S HEAD THROUGH THE CLOSE, in each ending. The decision opened from a phase jump
   (kept), the option's own button tapped by a finger, and the close (the last CL_END seconds of the ending's film: z_tail.js
   CL, the same close in every ending) sought every STEP seconds: his face's direction in the world (the head's turn applied
   to its rest, as lookNow reads it) against his body's facing (his group's turn), as a yaw; how far it turns between two
   moments, and how far it stands off his body. A SPIN is a turn of more than SPIN degrees between two moments; the run
   fails on one (and on any page error). The close opens on a cut (its first key), so the step across it is not a turn. WIN, if given, reads only that stretch of the close (seconds of the close).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OPTS=ABCD] [STEP=0.1] [SPIN=6] [WIN=19,26] node tools/probes/e4c4ravi.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPTS = (process.env.OPTS || 'ABCD').split(''), STEP = +(process.env.STEP || 0.1), SPIN = +(process.env.SPIN || 6);
const WIN = (process.env.WIN || '').split(',').filter(Boolean).map(Number);
const CL_END = 32.6, Z1 = 23.0;                                   // (z_tail.js CL: the close's length, and his teacher's word)
const b = await chromium.launch(LAUNCH);
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
let bad = 0;
for (const OPT of OPTS) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });
  await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  await toPlay(p, 1500000); await p.waitForTimeout(6000);
  await p.evaluate(() => window.__enc.stage.applyPhase('kept'));
  await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
  await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
  const bt = await p.evaluate((i) => { const r = document.querySelectorAll('#choices button.choice')[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, 'ABCD'.indexOf(OPT));
  await p.touchscreen.tap(bt.x, bt.y);
  await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.1, null, { timeout: 300000, polling: 300 });
  const dur = await p.evaluate(() => window.__enc.cine.dur());
  const rows = await p.evaluate(({ dur, CL_END, STEP, WIN }) => {
    const E = window.__enc, P = E.stage.dbg.cast.ravi, V = E.camera.position.constructor, Q = E.camera.quaternion.constructor;
    const f = new V(), q = new Q(), out = [];
    const c0 = WIN.length === 2 ? WIN[0] : 0, c1 = WIN.length === 2 ? WIN[1] : CL_END;
    for (let c = c0; c <= c1 + 1e-6; c += STEP) {
      E.cine.seek(dur - CL_END + c);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldQuaternion(q); f.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(q);
      const face = Math.atan2(f.x, f.z) * 180 / Math.PI, body = P.group.rotation.y * 180 / Math.PI;
      let off = face - body; while (off > 180) off -= 360; while (off < -180) off += 360;
      out.push({ c: +c.toFixed(2), face: +face.toFixed(1), off: +off.toFixed(1), pitch: +(Math.asin(Math.max(-1, Math.min(1, f.y))) * 180 / Math.PI).toFixed(1) });
    }
    return out;
  }, { dur, CL_END, STEP, WIN });
  let maxStep = { d: 0 }, maxOff = { a: 0 };
  const CUT = 0.15;                                              // (the step across the close's opening cut)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i - 1].c < CUT) continue;
    let d = rows[i].face - rows[i - 1].face; while (d > 180) d -= 360; while (d < -180) d += 360;
    if (Math.abs(d) > Math.abs(maxStep.d)) maxStep = { d: +d.toFixed(1), at: rows[i].c };
    if (Math.abs(rows[i].off) > Math.abs(maxOff.a)) maxOff = { a: rows[i].off, at: rows[i].c };
  }
  const spins = []; for (let i = 1; i < rows.length; i++) { if (rows[i - 1].c < CUT) continue; let d = rows[i].face - rows[i - 1].face; while (d > 180) d -= 360; while (d < -180) d += 360; if (Math.abs(d) > SPIN) spins.push({ at: rows[i].c, d: +d.toFixed(1) }); }
  const z1 = rows.filter(r => r.c >= Z1 - 2 && r.c <= Z1 + 1.5);
  log(OPT, 'film', dur.toFixed(2), 's; the close sought', rows.length, 'times; the most his face turns in', STEP, 's:', JSON.stringify(maxStep),
      '; the farthest it stands off his body:', JSON.stringify(maxOff), '; spins (over', SPIN, 'degrees a step):', spins.length ? JSON.stringify(spins) : 'none');
  log(OPT, 'before and through his teacher\'s word (close', Z1 - 2, 'to', Z1 + 1.5, '): face yaw', z1.map(r => r.face).join(' '), '| off his body', z1.map(r => r.off).join(' '));
  if (spins.length || errs.length) bad++;
  if (errs.length) log(OPT, 'errors', errs.join('\n'));
  await ctx.close();
}
await b.close();
log(bad ? `RESULT ${bad} ending(s) with a spin or an error` : 'RESULT no spin in any close, no error');
process.exit(bad ? 1 : 0);
