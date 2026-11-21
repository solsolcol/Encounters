/* v28.0 (E4C5, R25/R26: the lead's acceptance of Grandmaster Pho's grip, 21 Nov 2026: "clipscan the together, bag-tied and
   preparation films with the new grip, and show zero stick-through-body pairs"). Each film reached from play as
   e4c5films.mjs reaches it (its bookmark applied, the kit's film started once the black is down), sought forward from its
   start in STEP s (a seek applies the tracks it passes and undoes none, so the way is forward only), and at every moment
   where the Naga stick is drawn with a body within 2.5 m of it, clipscan's own measure (its ANALYSE, read from
   clipscan.mjs so the two never differ) over the stick and those bodies, every other surface hidden for the measure and
   given back: the pairs whose surfaces cross, with where the stick is (in his hand, planted, another's) and how far his
   grip is laid (its k). A moment's row is written whether it has pairs or not, so a moment never measured is never read
   as a clean one.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [JOBS=prepare,together,bagtied] [STEP=0.2] [FROM=0]
       [UNTIL=1e9] [OUT=dir] node tools/probes/e4c5gripclip.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const JOBS = (process.env.JOBS || 'prepare,together,bagtied').split(',').filter(Boolean), STEP = +(process.env.STEP || 0.2);
const FROM = +(process.env.FROM || 0), UNTIL = +(process.env.UNTIL || 1e9);
const OUT = process.env.OUT || '/tmp/e4c5gripclip'; fs.mkdirSync(OUT, { recursive: true });
const WAY = { devotee: 'walk', prepare: 'hunt', together: 'fight', bagtied: 'fight', collector: 'table' };
const CS = fs.readFileSync(new URL('./clipscan.mjs', import.meta.url), 'utf8'), A0 = CS.indexOf('const ANALYSE = '), A1 = CS.indexOf('\n};\n', A0);
if (A0 < 0 || A1 < 0) throw new Error('e4c5gripclip: clipscan.mjs no longer has its ANALYSE where this reads it');
const ANALYSE_SRC = CS.slice(A0 + 'const ANALYSE = '.length, A1 + 2);
const CHSRC = process.env.CHFILE ? fs.readFileSync(process.env.CHFILE, 'utf8') : null;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (p, n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
/* the measure at this moment, in the page: the stick and every body within 2.5 m of it, the rest hidden for it */
const CLIP = ([src]) => {
  const E = window.__enc, scene = E.scene, g = E.stage.things && E.stage.things.nagaStaff, S5 = E.stage.films && E.stage.films.STICK5;
  const seen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  if (!g || !seen(g)) return { skip: 'no stick drawn' };
  const V = g.position.constructor, at = new V(); g.updateWorldMatrix(true, true); at.set(0.083, 0.7, -0.005).applyMatrix4(g.matrixWorld);
  const layer = (q) => q === scene || (q.children && q.children.length > 25);
  const rootOf = (o) => { let q = o; while (q.parent && !layer(q.parent)) { if (q.userData && q.userData.model) return q; q = q.parent; } return q; };
  let gm = null; g.traverse(o => { if (!gm && o.isMesh) gm = o; });
  const keep = new Set([g]); if (gm) keep.add(rootOf(gm)); const near = [];
  scene.traverse(o => { if (!o.isSkinnedMesh || !seen(o)) return; const r = rootOf(o); if (keep.has(r)) return; const q = new V(); r.getWorldPosition(q);
    const d = Math.hypot(q.x - at.x, q.z - at.z); if (d < 2.5) { keep.add(r); near.push(+d.toFixed(2)); } });
  const who = S5 ? S5.who : null, k = S5 && S5.grip && S5.grip.k ? +S5.grip.k().toFixed(2) : null;
  if (!near.length) return { skip: 'no body near', who, k };
  const under = (o) => { for (let q = o; q; q = q.parent) if (keep.has(q)) return true; return false; };
  const hid = []; scene.traverse(o => { if ((o.isMesh || o.isLine || o.isPoints || o.isSprite) && o.visible && !under(o)) { o.visible = false; hid.push(o); } });
  let r; try { r = (0, eval)('(' + src + ')')([0.1, 4, 0.05, at.x, at.z]); } finally { for (const o of hid) o.visible = true; }
  return { who, k, near, objects: r.objects, pairs: r.pairs.map(q => ({ hits: q.hits, rest: q.rest, at: q.at, a: q.a.label.slice(0, 48), b: q.b.label.slice(0, 48) })) };
};
async function reach(p, job) {
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
  if (CHSRC) await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC }));
  await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  await toPlay(p, 1500000); await p.waitForTimeout(8000);
  const ph = WAY[job];
  await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), ph);
  await p.waitForFunction((ph) => window.__enc.stage.phase === ph && window.__enc.getState() === 'play', ph, { timeout: 600000, polling: 500 });
  await p.evaluate(() => { window.__fsClear = 0; });
  await p.waitForFunction(() => { const o = parseFloat(getComputedStyle(document.getElementById('cineFade')).opacity) || 0, now = performance.now();
    if (o >= 0.02) { window.__fsClear = 0; return false; } if (!window.__fsClear) window.__fsClear = now; return now - window.__fsClear > 2500; }, null, { timeout: 900000, polling: 250 });
  await p.waitForTimeout(1500);
  /* (his grip turned on through the fight's lab, as the probes of the acts do: a chapter file with GRIP_ON already true is the same) */
  log(job, 'grip on', await p.evaluate(() => { try { const L = window.__enc.stage.snap().story.fight.lab; return L.gripOn ? L.gripOn() : 'no gripOn'; } catch (e) { return 'lab: ' + e.message; } }));
  log(job, 'film started', await p.evaluate((k) => window.__enc.kit.film(k), job));
  await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine' && window.__enc.cine.t() > 0.2, null, { timeout: 1500000, polling: 250 });
  return errs;
}
const all = {};
for (const job of JOBS) {
  const p = await ctx.newPage(); let errs = [];
  try {
    errs = await reach(p, job);
    await p.waitForFunction(() => { try { return !!window.__enc.stage.ready(); } catch { return true; } }, null, { timeout: 300000, polling: 500 }).catch(() => {});
    const dur = await p.evaluate(() => window.__enc.cine.dur()); log(job, 'dur', dur.toFixed(2));
    const rows = []; let measured = 0, withPairs = 0;
    for (let t = Math.max(0, FROM); t <= Math.min(dur - 0.05, UNTIL) + 1e-6; t += STEP) { const tt = +t.toFixed(3);
      await p.evaluate((t) => window.__enc.cine.seek(t), tt); await frames(p, 3);
      const r = await p.evaluate(CLIP, [ANALYSE_SRC]); r.t = tt; rows.push(r);
      if (!r.skip) { measured++; if (r.pairs.length) { withPairs++; log(job, tt, r.who, 'k', r.k, 'PAIRS', r.pairs.map(q => `${q.a} x ${q.b}: ${q.hits} at ${JSON.stringify(q.at)}`).join(' | ')); } } }
    const byPair = {}; for (const r of rows) for (const q of (r.pairs || [])) { const key = q.a + ' x ' + q.b; const B = byPair[key] || (byPair[key] = { moments: 0, hits: 0, first: r.t, last: r.t }); B.moments++; B.hits += q.hits; B.last = r.t; }
    all[job] = { dur, step: STEP, measured, withPairs, byPair, errs };
    fs.writeFileSync(`${OUT}/${job}.json`, JSON.stringify({ job, dur, step: STEP, rows, errs }, null, 0));
    log(job, 'measured', measured, 'moments of', rows.length, '; with pairs', withPairs, JSON.stringify(byPair), 'errors', errs.length);
  } catch (e) { log(job, 'FAILED', String(e).slice(0, 300)); all[job] = { failed: String(e).slice(0, 300), errs }; }
  await p.close();
}
fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(all, null, 1));
const bad = Object.values(all).filter(j => j.failed || j.withPairs || (j.errs && j.errs.length)).length;
log('films with pairs, a failure or an error:', bad);
await b.close();
process.exit(bad ? 1 : 0);
