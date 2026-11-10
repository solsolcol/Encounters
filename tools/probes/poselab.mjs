/* v25.3 · THE POSE LAB (Chad, 10 Nov 2026, of Lersi Chin's wai: "Look at how ridiculous this looks, and you said it looks
   natural"). A body's pose is judged FULL SIZE, from in front of it, from beside it and through the film's own lens on a
   phone's shape, never on a contact sheet: this boots the game ONCE (a minute and more on a box without a GPU) on dist/ or
   a snapshot (ENC_DIST), plays into one phase and stays open, so each look at a pose costs a few seconds.

   Jobs dropped into $LABDIR/jobs/ as JSON are run in the order of their names (tools/probes/poselab-job.py writes one
   and waits for its answer):
     { id, vp: [w, h], eval: 'js run in the page (may return a value)', frames: n, read: 'js run after the frames',
       shots: [{ name, cam: [ox, oy, oz, fov, aimK, aimDy] | null }], quit: true }
   A shot's `cam` is a REVIEW CAMERA that rides the body: it looks at a point between his chest and his head (aimK: 0 his
   chest, 1 his head, 0.35 when left out; aimDy lifts it) from an offset in his body's own frame (ox to his left, oy up,
   oz before him), so [0, 0.05, 1.6, 34] is square in front and [1.5, 0.05, 0.3, 34] is from beside his left. Every
   overlay and the hands' pass are hidden for review cameras. `cam: null` is the game's own lens, as the player sees it
   (set vp to a phone's shape, 780x1688, for the phone's frame at full size). `cam: { pos, at, fov }` is a FREE camera
   in the room's own metres (fov 72 at a phone's shape is what a player standing at `pos` and looking at `at` sees):
   for a prop, a shelf, a place.
   Each job answers $LABDIR/out/<id>.json ({ ret, errs }) and writes $LABDIR/out/<id>-<shot>.jpg.

   A FILM'S FRAME FUNCTION SETS THE BODY EVERY FRAME, so a pose set by a job inside a film is overwritten before it is
   drawn: pose freely from a PLAY phase, and photograph a film's own poses by seeking the film.

     LABDIR=<dir> [ENC_DIST=<snapshot>] [CH=e4c2] [PHASE=clearing:k,b] [WHO=lersi] CHROMIUM_PATH=... node tools/probes/poselab.mjs
   (tools/probes/poselab.sh makes the snapshot with the chapter's scratch handles and restarts the lab.) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
if (!process.env.LABDIR) { console.error('LABDIR is not set'); process.exit(2); }
const DIR = process.env.LABDIR + '/', JOBS = DIR + 'jobs/', OUT = DIR + 'out/';
const CH = process.env.CH || 'e4c2', PHASE = process.env.PHASE || 'clearing:k,b', WHO = process.env.WHO || 'lersi';
fs.mkdirSync(JOBS, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 900, height: 1100 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
const log = (...a) => { const s = el() + ' ' + a.join(' '); console.log(s); fs.appendFileSync(DIR + 'lab.log', s + '\n'); };
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 240000 });
await frames(6);
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), PHASE);
await p.waitForFunction((who) => { const c = window.__enc.stage.cast; return !c || !c[who] || c[who].ready; }, WHO, { timeout: 240000 });
await frames(6);
await p.evaluate((who) => {
  const E = window.__enc, R = E.renderer, orig = R.render.bind(R);
  const cam = new E.camera.constructor(40, innerWidth / innerHeight, 0.05, 80);
  const V3 = E.camera.position.constructor, Q = E.camera.quaternion.constructor;
  const c = new V3(), off = new V3(), q = new Q(), hd = new V3();
  R.render = (sc, cm) => {
    const rv = window.__rev; if (!rv) return orig(sc, cm);
    if (sc !== E.scene) return;                               // the hands' pass is not drawn for a review camera
    if (!Array.isArray(rv)) {                                 // a FREE camera: { pos, at, fov } in the room's own metres
      cam.position.set(rv.pos[0], rv.pos[1], rv.pos[2]); cam.fov = rv.fov || 72; cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix();
      cam.lookAt(rv.at[0], rv.at[1], rv.at[2]); cam.updateMatrixWorld(true);
      return orig(sc, cam);
    }
    const P = E.stage.cast && E.stage.cast[who]; if (!P || !P.ready) return orig(sc, cm);
    P.group.updateWorldMatrix(true, true);
    (P.spine || P.hips).getWorldPosition(c); P.group.getWorldQuaternion(q);
    if (P.head) P.head.getWorldPosition(hd); else hd.copy(c);
    const aim = c.clone().lerp(hd, rv[4] == null ? 0.35 : rv[4]); aim.y += rv[5] || 0;
    off.set(rv[0], rv[1], rv[2]).applyQuaternion(q);
    cam.position.copy(aim).add(off); cam.fov = rv[3] || 40; cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix();
    cam.lookAt(aim); cam.updateMatrixWorld(true);
    return orig(sc, cam);
  };
  const st = document.createElement('style'); st.id = 'revHide';
  st.textContent = 'body * { visibility: hidden !important; } canvas { visibility: visible !important; }';
  window.__revStyle = st;
}, WHO);
log('READY state', await p.evaluate(() => window.__enc.getState()), 'errs', JSON.stringify(errs));
fs.writeFileSync(DIR + 'READY', el());
for (;;) {
  const list = fs.readdirSync(JOBS).filter(f => f.endsWith('.json')).sort();
  if (!list.length) { await new Promise(r => setTimeout(r, 700)); continue; }
  const f = list[0]; let job;
  try { job = JSON.parse(fs.readFileSync(JOBS + f, 'utf8')); } catch (e) { log('bad job', f, e.message); fs.unlinkSync(JOBS + f); continue; }
  fs.unlinkSync(JOBS + f);
  if (job.quit) break;
  const id = job.id || f.replace('.json', ''); let ret = null;
  try {
    if (job.vp) { await p.setViewportSize({ width: job.vp[0], height: job.vp[1] }); await frames(2); }
    if (job.eval) ret = await p.evaluate(job.eval);
    await frames(job.frames || 3);
    if (job.read) ret = await p.evaluate(job.read);
    for (const s of job.shots || []) {
      await p.evaluate((v) => { window.__rev = v; if (v) document.head.appendChild(window.__revStyle); else if (window.__revStyle.parentNode && !window.__keepHide) window.__revStyle.remove(); }, s.cam || null);
      await frames(2);
      await p.screenshot({ path: `${OUT}${id}-${s.name}.jpg`, quality: 82, timeout: 240000 });
    }
    await p.evaluate(() => { window.__rev = null; });
  } catch (e) { ret = { error: String(e && e.message || e).slice(0, 400) }; }
  fs.writeFileSync(`${OUT}${id}.json`, JSON.stringify({ ret, errs: errs.splice(0) }));
  log('job', id, 'done', JSON.stringify(ret).slice(0, 300));
}
await b.close();
