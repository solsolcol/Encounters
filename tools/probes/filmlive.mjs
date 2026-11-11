/* v25.5 · A FILM'S LENS WHILE THE FILM RUNS (the audit of 9 to 11 Nov 2026). framecheck seeks a film, and a seek freezes
   every body in it: a shot whose aim or fit follows a LIVING head (`headOf`, `faceOf`) is measured there against a
   head that does not move, so the sway a talking take gives the picture cannot be seen (v25.5: the woman's "listening"
   take swung a phone's whole picture a third of its width, and every seek passed it). This probe lets the film PLAY
   and writes down, at every drawn frame between FROM and UNTIL seconds of the film's own clock, the lens, where the
   camera looks (its turn and its tilt, in degrees) and where each named subject stands on the screen.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop FILM=open|call|visit|exam|clear | OPT=A|B|C|D
       FROM=<s> UNTIL=<s> [STEP_MS=50] OUT=<file.json> node tools/probes/filmlive.mjs
   It prints, for the window: how many frames were drawn, the lens's range, the look's range in turn and tilt, the
   largest change between two drawn frames, and the same as a share of the frame's half-width (what the background
   moves by on the screen). A held shot of people who only talk should move its background a few hundredths at most.
   The film is played from its start (nothing is sought), so the bodies are in the takes the film gave them.
   THE CLOCK IS SLOWED FOR THE WINDOW. A box with no graphics card draws one or two frames a second, and the film's
   clock and the cast's both run on the wall's (each taking at most half a second a frame): left alone, three seconds
   of film are seven frames, and nothing between them is seen. From half a second before FROM the page's clock
   (`performance.now`, and the time handed to every frame) is made to advance exactly STEP_MS a drawn frame, so the
   film and the bodies move together one twentieth of a second at a time, as a phone at twenty frames a second
   draws them, however long each frame takes here. STEP_MS=0 leaves the wall's own clock. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const KEY = process.env.OPT ? 'end:' + process.env.OPT : (process.env.FILM || 'visit');
const FROM = +(process.env.FROM || 0), UNTIL = +(process.env.UNTIL || 1e9), STEP_MS = +(process.env.STEP_MS ?? 50);
const OUT = process.env.OUT || `/tmp/filmlive-${VIEW}-${KEY.replace(':', '')}.json`;
const WAY = { call: { phase: 'night', film: 'call' }, visit: { phase: 'visit' }, exam: { phase: 'clearing:k,b,tA' },
              clear: { phase: 'clearing:k,b,tA,x', film: 'clear' } };
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c2', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
if (KEY !== 'open') {
  await toPlay(p, 1500000); await p.waitForTimeout(6000);
  if (KEY.startsWith('end:')) {
    await p.evaluate(() => window.__enc.stage.applyPhase('decide'));
    await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
    await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
    const pt = await p.evaluate((i) => { const els = [...document.querySelectorAll('#choices button.choice')]; const r = els[i] && els[i].getBoundingClientRect(); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(KEY.slice(4)));
    if (PHONE) await p.touchscreen.tap(pt.x, pt.y); else await p.mouse.click(pt.x, pt.y);
  } else {
    const w = WAY[KEY];
    await p.waitForFunction(() => !window.__enc.kit.getFade || window.__enc.kit.getFade() < 0.01, null, { timeout: 120000, polling: 250 }).catch(() => {});
    await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), w.phase);
    if (w.film) {
      await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 500 });
      await p.waitForTimeout(2500);
      await p.evaluate((k) => window.__enc.kit.film(k), w.film);
    }
  }
}
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 200 });
log('film', KEY, 'running; sampling', FROM, 'to', UNTIL);
/* the recorder: one row a drawn frame, written in the page so no frame is missed between two calls from here */
await p.evaluate(({ FROM, UNTIL, STEP_MS }) => {
  const E = window.__enc, cam = E.camera, V = cam.position.constructor, v = new V(), d = new V();
  const rows = window.__live = []; window.__liveDone = false;
  const realNow = performance.now.bind(performance), realRaf = window.requestAnimationFrame.bind(window);
  let virt = 0, slow = false;
  /* the slowed clock: one STEP_MS a drawn frame, for everything that asks the page what time it is. The time handed
     to a frame runs five seconds AHEAD of it by the same steps: the engine's frame limiter compares one frame's
     handed time with the last one's, and the last one before this was the browser's own, about a second later than
     the page's clock said (a frame takes that long here): handed the page's clock, the engine skipped some twenty
     frames until it caught up, then leapt half a second */
  const slowDown = () => {
    slow = true; virt = realNow();
    performance.now = () => virt;
    window.requestAnimationFrame = (cb) => realRaf(() => cb(virt + 5000));
    const tick = () => { virt += STEP_MS; realRaf(tick); };
    realRaf(tick);
  };
  const f = () => {
    if (!E.cine.active()) { window.__liveDone = true; return; }
    const t = E.cine.t();
    if (t > UNTIL) { window.__liveDone = true; return; }
    if (STEP_MS && !slow && t >= FROM - 0.5) slowDown();
    if (t >= FROM) {
      cam.updateMatrixWorld(true); cam.getWorldDirection(d);
      const row = { t: +t.toFixed(3), w: +realNow().toFixed(0), fov: +cam.fov.toFixed(3), eye: [+cam.position.x.toFixed(3), +cam.position.y.toFixed(3), +cam.position.z.toFixed(3)],
                    yaw: +(Math.atan2(-d.x, -d.z) * 180 / Math.PI).toFixed(3), pitch: +(Math.asin(d.y) * 180 / Math.PI).toFixed(3), asp: +cam.aspect.toFixed(3), s: {}, xyz: {} };
      const sub = E.stage.subjects ? E.stage.subjects() : {};
      for (const [k, q] of Object.entries(sub)) { if (!/face/.test(k)) continue;
        v.set(q[0], q[1], q[2]).applyMatrix4(cam.matrixWorldInverse); const front = v.z < -0.05; v.applyMatrix4(cam.projectionMatrix);
        row.s[k] = [+v.x.toFixed(3), +v.y.toFixed(3), front ? 1 : 0, q[3]];
        /* where that face is in the world, and where its body's own mark is (a take may hold a head off its mark) */
        const P = E.stage.cast && E.stage.cast[k.split('.')[0]];
        row.xyz[k] = [q[0], q[1], q[2]].concat(P && P.group ? [+P.group.position.x.toFixed(3), +P.group.position.z.toFixed(3)] : []); }
      rows.push(row);
    }
    realRaf(f);
  };
  realRaf(f);
}, { FROM, UNTIL, STEP_MS });
await p.waitForFunction(() => window.__liveDone, null, { timeout: 1500000, polling: 500 });
const rows = await p.evaluate(() => window.__live);
fs.writeFileSync(OUT, JSON.stringify({ view: VIEW, film: KEY, from: FROM, until: UNTIL, rows, errs }));
const rng = (k) => { const a = rows.map(r => r[k]); return [Math.min(...a), Math.max(...a)]; };
if (rows.length > 1) {
  const fv = rng('fov'), yw = rng('yaw'), pt = rng('pitch');
  const half = (r) => Math.atan(Math.tan(r.fov * Math.PI / 360) * r.asp) * 180 / Math.PI;      // half the frame's width, in degrees
  let dY = 0, dP = 0, dF = 0;
  for (let i = 1; i < rows.length; i++) { dY = Math.max(dY, Math.abs(rows[i].yaw - rows[i - 1].yaw)); dP = Math.max(dP, Math.abs(rows[i].pitch - rows[i - 1].pitch)); dF = Math.max(dF, Math.abs(rows[i].fov - rows[i - 1].fov)); }
  const hw = half(rows[0]), secs = rows[rows.length - 1].t - rows[0].t, wall = (rows[rows.length - 1].w - rows[0].w) / 1000;
  log(`${rows.length} frames over ${secs.toFixed(2)} s of film (${wall.toFixed(1)} s on the wall)`);
  log(`lens ${fv[0]} to ${fv[1]} (largest step ${dF.toFixed(3)})`);
  log(`turn ${yw[0]} to ${yw[1]} deg = ${((yw[1] - yw[0]) / hw).toFixed(3)} of the half-width (largest step ${dY.toFixed(3)} deg)`);
  log(`tilt ${pt[0]} to ${pt[1]} deg (largest step ${dP.toFixed(3)} deg)`);
}
log('wrote', OUT, 'errs', JSON.stringify(errs));
await b.close();
