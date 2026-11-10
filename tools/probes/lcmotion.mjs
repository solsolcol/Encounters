/* v25.2 · LERSI CHIN'S MOVEMENT SEEN FROM BESIDE HIM (Chad, 10 Nov 2026: "lersi chin's animations, poses, body all look very
   awkward and bad, his wai pose, he spraying water and taking water bowl, etc is all extremely bad ... the actions are all
   very abrupt and sudden and not natural"). A film is run and photographed every STEP seconds from review cameras that ride
   his body (CAMS: front, a three-quarter from his left front; side, square to his right; back, over his right shoulder),
   (and `film`, the film's own lens, as the player sees it): the hands' pass and every overlay are set aside for the
   review cameras' photographs, the world drawn through
   the review lens in the renderer's own call (after every frame function, so the film's own pose is what is seen).
   A first pass reads his arm blend (gripK) and his head's bow over the whole film and keeps only the stretches where his
   arms are posed or his head bows, with MARGIN seconds either side (or T0..T1 when given), so the sequences hold the
   actions; it also writes the per-step numbers (motion.json) — a pose that arrives in one step shows as a jump there.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... FILM=visit|exam|clear|end:A..D [PHASE=...] VIEW=phone|desktop [STEP=0.2]
     [CAMS=front,side] [MARGIN=0.8] [T0= T1=] [TIMES=t,t,...] OUT=dir node tools/probes/lcmotion.mjs
   T0..T1 limits both passes to that stretch (the first pass of a whole film at 0.2 s is slow on a box without a GPU);
   TIMES photographs exactly those moments. Each row carries `miss`: how far a hand stopped short of where it was sent. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const FILM = process.env.FILM || 'clear', VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const STEP = +(process.env.STEP || 0.2), MARGIN = +(process.env.MARGIN || 0.8);
const CAMS = (process.env.CAMS || 'front,side').split(',');
const OUT = (process.env.OUT || '/tmp/lcmotion') + '-' + FILM.replace(':', '') + '-' + VIEW; fs.mkdirSync(OUT, { recursive: true });
/* each film's way in: a bookmark that starts it, or play then kit.film */
const WAY = { visit: { phase: 'visit' }, exam: { phase: 'clearing:k,b,tA' }, clear: { phase: 'clearing:k,b,tA,x', film: 'clear' } };
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c2', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000); await p.waitForTimeout(6000);
if (FILM.startsWith('end:')) {
  const OPT = FILM.slice(4);
  await p.evaluate(() => window.__enc.stage.applyPhase('decide'));
  await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
  await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
  const pt = await p.evaluate((i) => { const els = [...document.querySelectorAll('#choices button.choice')]; const r = els[i] && els[i].getBoundingClientRect(); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(OPT));
  if (PHONE) await p.touchscreen.tap(pt.x, pt.y); else await p.mouse.click(pt.x, pt.y);
} else {
  const w = WAY[FILM] || {}, ph = process.env.PHASE || w.phase;
  await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), ph);
  if (w.film) {
    await p.waitForFunction((ph) => window.__enc.getState() === 'play', ph, { timeout: 600000, polling: 500 });
    await p.waitForTimeout(3000);
    await p.evaluate((k) => window.__enc.kit.film(k), w.film);
  }
}
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 500 });
await p.waitForFunction(() => window.__enc.cine.t() > 0.2, null, { timeout: 600000, polling: 300 });
const dur = await p.evaluate(() => window.__enc.cine.dur());
log('film', FILM, 'dur', dur);
/* the review lens, laid on in the renderer's own call; the hands' pass skipped and every overlay hidden while it is on */
await p.evaluate(() => {
  const E = window.__enc, R = E.renderer, orig = R.render.bind(R);
  const cam = new E.camera.constructor(40, innerWidth / innerHeight, 0.05, 80);
  const V3 = E.camera.position.constructor, Q = E.camera.quaternion.constructor;
  const c = new V3(), off = new V3(), q = new Q(), hd = new V3();
  window.__revCam = cam;
  R.render = (sc, cm) => {
    const rv = window.__rev; if (!rv) return orig(sc, cm);
    if (sc !== E.scene) return;                                       // the hands' pass: not his
    const P = E.stage.cast && E.stage.cast.lersi; if (!P || !P.ready) return orig(sc, cm);
    P.group.updateWorldMatrix(true, true);
    (P.spine || P.hips).getWorldPosition(c); P.group.getWorldQuaternion(q);
    if (P.head) P.head.getWorldPosition(hd); else hd.copy(c);
    const aim = c.clone().lerp(hd, 0.35);
    off.set(rv[0], rv[1], rv[2]).applyQuaternion(q);
    cam.position.copy(aim).add(off); cam.fov = rv[3] || 40; cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix();
    cam.lookAt(aim); cam.updateMatrixWorld(true);
    return orig(sc, cam);
  };
  const st = document.createElement('style'); st.id = 'revHide';
  st.textContent = 'body * { visibility: hidden !important; } canvas { visibility: visible !important; }';
  window.__revStyle = st;
});
/* pass 1: his arms and head over the whole film */
const rows = [];
const TIMES = process.env.TIMES ? process.env.TIMES.split(',').map(Number) : null;
const A0 = TIMES ? 0 : (process.env.T0 ? Math.max(0, +process.env.T0) : 0), A1 = process.env.T1 ? Math.min(dur, +process.env.T1) : dur;
const steps = TIMES || (() => { const a = []; for (let t = A0; t <= A1 + 1e-6; t += STEP) a.push(+t.toFixed(3)); return a; })();
for (const t of steps) {
  await p.evaluate((t) => window.__enc.cine.seek(t), t);
  await frames(2);
  const r = await p.evaluate(() => { const S = window.__enc.stage, c = S.castInfo ? S.castInfo().lersi : null, P = S.cast && S.cast.lersi;
    return c ? { gripK: c.gripK, grip: c.grip, vis: c.vis, pos: c.pos, bow: P ? +(P.bowNow || 0).toFixed(3) : 0, miss: c.miss, lookW: c.lookW } : null; });
  rows.push({ t: +t.toFixed(2), ...(r || {}) });
}
fs.writeFileSync(`${OUT}/motion.json`, JSON.stringify(rows));
let keep;
if (TIMES || process.env.T0) keep = () => true;
else { const on = rows.filter(r => r.vis && ((r.gripK || 0) > 0.001 || (r.bow || 0) > 0.02)).map(r => r.t);
  keep = (t) => on.some(u => Math.abs(u - t) <= MARGIN + 1e-6); }
/* the jumps: the arm blend's biggest step-to-step change (a pose arriving in one step) */
let worst = { d: 0 };
for (let i = 1; i < rows.length; i++) { const d = Math.abs((rows[i].gripK || 0) - (rows[i - 1].gripK || 0)); if (d > worst.d) worst = { d: +d.toFixed(3), t: rows[i].t }; }
log('posed steps', rows.filter(r => (r.gripK || 0) > 0.001).length, 'of', rows.length, '| biggest arm-blend step', JSON.stringify(worst));
/* pass 2: the photographs */
const CAM = { front: [0.55, 0.12, 1.25, 40], side: [-1.35, 0.1, 0.12, 38], back: [-0.5, 0.35, -0.95, 42] };
await p.evaluate(() => document.head.appendChild(window.__revStyle));
let n = 0;
for (const r of rows) {
  if (!keep(r.t)) continue;
  await p.evaluate((t) => window.__enc.cine.seek(t), r.t);
  await frames(2);
  for (const k of CAMS) {
    await p.evaluate((v) => { window.__rev = v; }, CAM[k] || null);            // 'film': the film's own lens, his eyes
    await frames(2);
    await p.screenshot({ path: `${OUT}/${k}-${String(Math.round(r.t * 100)).padStart(5, '0')}.jpg`, quality: 70, timeout: 240000 });
    n++;
  }
  await p.evaluate(() => { window.__rev = null; });
}
log('photographs', n, 'errs', JSON.stringify(errs));
await b.close();
