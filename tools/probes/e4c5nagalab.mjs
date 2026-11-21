/* v28.0 (E4C5, FILMS-2) · THE NAGA'S LAB: episode 4 chapter 5's TOGETHER film (the Naga rising and laying its body round
   the court) booted ONCE on a phone (390 x 844 CSS, DPR 2 unless said, a touch context) and kept open, so each look at the
   Naga costs a seek and a picture, never a boot (one is about eight minutes on a box without a GPU). The film is reached as
   tools/probes/e4c5films.mjs reaches it (Start, play, the fight's phase applied, the film started by the kit once the black
   is down); the chapter is served from CHFILE when given (a chapter assembled apart from the tree: a chapter file is copied
   into the build byte for byte, so a chapter-only change needs no build).

   Jobs dropped into $LABDIR/jobs/ as JSON are run in the order of their names:
     { id, eval: 'js run in the page first (may return a value)', t: [film seconds], pics: true, measure: true, quit: true }
   For each moment: the film sought there, three frames drawn, SETTLE ms, then (pics) a full-size picture
   $LABDIR/out/<id>-<t>.png, and (measure) the Naga against the lens: the nearest of its points to the lens (metres), how
   many of its points stand within 0.5 m and 1 m of the lens, its extent on this screen (NDC), its triangles drawn and
   whether it is shown. Each job answers $LABDIR/out/<id>.json ({ ret, rows, errs }).
   The page's handle on the Naga: stage.films.NAGA5 (its `lab()` the laid state: geometry, draws, normals).
     LABDIR=<dir> ENC_DIST=<snapshot> CHFILE=<chapter.js> CHROMIUM_PATH=... [DPR=2] [SETTLE=900] node tools/probes/e4c5nagalab.mjs
   (through tools/bslot.sh: it holds one of the box's two browser slots while it is open) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
if (!process.env.LABDIR) { console.error('LABDIR is not set'); process.exit(2); }
const DIR = process.env.LABDIR + '/', JOBS = DIR + 'jobs/', OUT = DIR + 'out/';
fs.mkdirSync(JOBS, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
const DPR = +(process.env.DPR || 2), SETTLE = +(process.env.SETTLE || 900);
const DIST = process.env.ENC_DIST || 'dist';
const CHSRC = process.env.CHFILE ? fs.readFileSync(process.env.CHFILE, 'utf8') : null;
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
const log = (...a) => { const s = el() + ' ' + a.join(' '); console.log(s); fs.appendFileSync(DIR + 'lab.log', s + '\n'); };
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.type() + ' ' + m.text().slice(0, 300)); });
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
if (CHSRC) await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC }));
log('boot', DIST, process.env.CHFILE || '(the build\'s own chapter)');
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000); await p.waitForTimeout(8000);
await p.evaluate(() => window.__enc.stage.applyPhase('fight'));
await p.waitForFunction(() => window.__enc.stage.phase === 'fight' && window.__enc.getState() === 'play', null, { timeout: 600000, polling: 500 });
await p.evaluate(() => { window.__fsClear = 0; });
await p.waitForFunction(() => { const o = parseFloat(getComputedStyle(document.getElementById('cineFade')).opacity) || 0, now = performance.now();
  if (o >= 0.02) { window.__fsClear = 0; return false; } if (!window.__fsClear) window.__fsClear = now; return now - window.__fsClear > 2500; }, null, { timeout: 900000, polling: 250 });
await p.waitForTimeout(1500);
log('film started', await p.evaluate(() => window.__enc.kit.film('together')));
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine' && window.__enc.cine.t() > 0.2, null, { timeout: 1500000, polling: 250 });
await p.waitForFunction(() => { try { return !!window.__enc.stage.ready() && window.__enc.stage.films.NAGA5.ready(); } catch { return false; } }, null, { timeout: 300000, polling: 500 });
await p.addStyleTag({ content: '#caption{display:none !important}' }).catch(() => {});
/* the Naga against the lens, in the page */
await p.evaluate(() => {
  window.__nagaMeasure = () => {
    const E = window.__enc, N = E.stage.films.NAGA5, st = N.lab && N.lab(), cam = E.camera;
    if (!st || !st.ready || !st.geo) return { ready: false };
    const V3 = cam.position.constructor, v = new V3(), w = new V3();
    cam.updateMatrixWorld(true); cam.getWorldPosition(w);
    const P = st.geo.attributes.position.array, n = P.length / 3; let dmin = 1e9, near05 = 0, near1 = 0, on = 0; const ext = [9, -9, 9, -9];
    for (let i = 0; i < n; i += 3) { v.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); const d = v.distanceTo(w); if (d < dmin) dmin = d; if (d < 0.5) near05++; if (d < 1) near1++;
      v.project(cam); if (v.z <= -1 || v.z >= 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) continue; on++;
      if (v.x < ext[0]) ext[0] = v.x; if (v.x > ext[1]) ext[1] = v.x; if (v.y < ext[2]) ext[2] = v.y; if (v.y > ext[3]) ext[3] = v.y; }
    let shown = true; for (let q = st.meshes ? st.meshes[1] : null; q; q = q.parent) if (!q.visible) shown = false;
    return { ready: true, shown, dmin: +dmin.toFixed(3), near05, near1, onScreen: on, ext: ext.map(x => +x.toFixed(3)), lens: [+w.x.toFixed(2), +w.y.toFixed(2), +w.z.toFixed(2), +cam.fov.toFixed(1)],
             shot: E.stage.films.shot ? E.stage.films.shot() : '', laid: st.laid };
  };
});
log('ready', JSON.stringify(errs.slice(0, 4)));
const done = new Set();
for (;;) {
  const list = fs.readdirSync(JOBS).filter(f => f.endsWith('.json') && !done.has(f)).sort();
  if (!list.length) { await new Promise(r => setTimeout(r, 1500)); continue; }
  const f = list[0]; done.add(f);
  let job; try { job = JSON.parse(fs.readFileSync(JOBS + f, 'utf8')); } catch (e) { log('bad job', f, String(e)); continue; }
  const id = job.id || f.replace(/\.json$/, ''); const e0 = errs.length, res = { id, ret: null, rows: [], errs: [] };
  log('job', id);
  try {
    if (job.eval) res.ret = await p.evaluate((src) => { try { return (0, eval)(src); } catch (e) { return 'EVAL THREW ' + e.message; } }, job.eval);
    for (const t of job.t || []) {
      await p.evaluate((t) => window.__enc.cine.seek(t), t); await frames(3); await p.waitForTimeout(SETTLE);
      const row = { t };
      if (job.measure !== false) row.m = await p.evaluate(() => window.__nagaMeasure());
      if (job.pics !== false) { const pf = `${OUT}${id}-${String(t.toFixed(2)).padStart(6, '0')}.png`; await p.screenshot({ path: pf, timeout: 300000 }); row.pic = pf; }
      res.rows.push(row); log(id, 't', t, JSON.stringify(row.m || {}).slice(0, 220));
    }
  } catch (e) { res.errs.push('JOB FAILED ' + String(e).slice(0, 300)); log('job failed', id, String(e).slice(0, 200)); }
  res.errs.push(...errs.slice(e0));
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(res, null, 1));
  if (job.quit) break;
}
log('quit', 'errors', errs.length);
await b.close();
