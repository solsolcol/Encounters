/* v28.0 (E4C5, R25/R26: the lead's acceptance of Grandmaster Pho's grip, 21 Nov 2026: "clipscan the together, bag-tied and
   preparation films with the new grip, and show zero stick-through-body pairs"). Each film reached from play as
   e4c5films.mjs reaches it (its bookmark applied, the kit's film started once the black is down), sought forward from its
   start in STEP s (a seek applies the tracks it passes and undoes none, so the way is forward only), and at every moment
   where the Naga stick is drawn with a body within 2.5 m of it, clipscan's own measure (its ANALYSE, read from
   clipscan.mjs so the two never differ) over the stick and those bodies, every other surface hidden for the measure and
   given back: the pairs whose surfaces cross, with where the stick is (in his hand, planted, another's) and how far his
   grip is laid (its k). A moment's row is written whether it has pairs or not, so a moment never measured is never read
   as a clean one.
   HIS HAND ON IT IS A GRIP, NOT A CLIP, only as far as the lead's bar (21 Nov: "fingers and palm closed round the shaft,
   touching it (a few millimetres of contact, not 1.2 to 1.6 cm into it)"): where a pair's crossings all lie within his
   right hand's own skin (its box, 1 cm round) while the stick is his, and no point of that hand is more than GRIPMM
   (default 4) millimetres into the shaft (each point against the stick's own surface, by the facing there), the pair is
   his grip's CONTACT; any other crossing is THROUGH, a fault.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [JOBS=prepare,together,bagtied] [STEP=0.2] [FROM=0]
       [UNTIL=1e9] [OUT=dir] node tools/probes/e4c5gripclip.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const JOBS = (process.env.JOBS || 'prepare,together,bagtied').split(',').filter(Boolean), STEP = +(process.env.STEP || 0.2);
const FROM = +(process.env.FROM || 0), UNTIL = +(process.env.UNTIL || 1e9);
const OUT = process.env.OUT || '/tmp/e4c5gripclip'; fs.mkdirSync(OUT, { recursive: true });
const GRIPMM = +(process.env.GRIPMM || 4);
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
  let r; try { r = (0, eval)('(' + src + ')')([0.1, 1000, 0.05, at.x, at.z]); } finally { for (const o of hid) o.visible = true; }
  return { who, k, near, objects: r.objects, pairs: r.pairs.map(q => ({ hits: q.hits, rest: q.rest, at: q.at, a: q.a.label.slice(0, 48), b: q.b.label.slice(0, 48) })) };
};
/* once a page: the stick's surface (its points and facings in its own frame, hashed by 2 cm cells) and, for each skin of his,
   the points his right hand carries (half their weight or more on a RightHand bone) */
const PREP = () => { const E = window.__enc, g = E.stage.things && E.stage.things.nagaStaff, P = E.stage.plan && E.stage.plan.FLOOR && E.stage.plan.FLOOR.cast && E.stage.plan.FLOOR.cast.pho;
  if (!g || !P) return 'no stick or no Grandmaster Pho';
  const V = g.position.constructor; g.updateWorldMatrix(true, true); const inv = g.matrixWorld.clone().invert();
  const pts = [], nrm = []; const v = new V(), n = new V();
  g.traverse(o => { if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    const pa = o.geometry.attributes.position, na = o.geometry.attributes.normal, M = inv.clone().multiply(o.matrixWorld), NM = M.clone(); NM.setPosition(0, 0, 0);
    for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(M); pts.push(v.x, v.y, v.z);
      if (na) { n.fromBufferAttribute(na, i).applyMatrix4(NM).normalize(); nrm.push(n.x, n.y, n.z); } else nrm.push(0, 0, 0); } });
  const H = new Map(), C = 0.02, key = (x, y, z) => Math.floor(x / C) + ',' + Math.floor(y / C) + ',' + Math.floor(z / C);
  for (let i = 0; i < pts.length / 3; i++) { const k = key(pts[3 * i], pts[3 * i + 1], pts[3 * i + 2]); let a = H.get(k); if (!a) H.set(k, a = []); a.push(i); }
  const hands = [];
  P.group.traverse(o => { if (!o.isSkinnedMesh) return; const A = o.geometry.attributes, si = A.skinIndex, sw = A.skinWeight, hb = o.skeleton.bones.map(b => /RightHand/.test(b.name)), idx = [];
    for (let i = 0; i < A.position.count; i++) { let w = 0; for (let q = 0; q < 4; q++) if (hb[si.getComponent(i, q)]) w += sw.getComponent(i, q); if (w >= 0.5) idx.push(i); }
    if (idx.length) hands.push({ o, idx }); });
  window.__gc = { pts, nrm, H, C, hands }; return 'stick ' + pts.length / 3 + ' points, hand points ' + hands.map(h => h.idx.length).join('+'); };
/* his right hand now: its skin's box in the world, and how far its deepest point is into the shaft (mm) */
const HAND = () => { const E = window.__enc, g = E.stage.things.nagaStaff, S = window.__gc; if (!S) return null;
  const V = g.position.constructor; g.updateWorldMatrix(true, true); const inv = g.matrixWorld.clone().invert(), ws = new V().setFromMatrixColumn(g.matrixWorld, 0).length();
  const seen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const v = new V(), u = new V(), lo = [9e9, 9e9, 9e9], hi = [-9e9, -9e9, -9e9]; let deep = -9, inside = 0, cnt = 0; const C = S.C;
  for (const { o, idx } of S.hands) { if (!seen(o)) continue; o.skeleton.update();
    for (const i of idx) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld); cnt++;
      lo[0] = Math.min(lo[0], v.x); lo[1] = Math.min(lo[1], v.y); lo[2] = Math.min(lo[2], v.z); hi[0] = Math.max(hi[0], v.x); hi[1] = Math.max(hi[1], v.y); hi[2] = Math.max(hi[2], v.z);
      u.copy(v).applyMatrix4(inv); let bd = 0.03 / ws, bj = -1; const cx = Math.floor(u.x / C), cy = Math.floor(u.y / C), cz = Math.floor(u.z / C);
      for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let c = -1; c <= 1; c++) { const L = S.H.get((cx + a) + ',' + (cy + b2) + ',' + (cz + c)); if (!L) continue;
        for (const j of L) { const d = Math.hypot(u.x - S.pts[3 * j], u.y - S.pts[3 * j + 1], u.z - S.pts[3 * j + 2]); if (d < bd) { bd = d; bj = j; } } }
      if (bj < 0) continue;
      const into = -((u.x - S.pts[3 * bj]) * S.nrm[3 * bj] + (u.y - S.pts[3 * bj + 1]) * S.nrm[3 * bj + 1] + (u.z - S.pts[3 * bj + 2]) * S.nrm[3 * bj + 2]) * ws;
      if (into > deep) deep = into; if (into > 0.001) inside++; } }
  return cnt ? { box: [lo, hi], deepMm: +(deep * 1000).toFixed(1), inside } : null; };
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
    const dur = await p.evaluate(() => window.__enc.cine.dur()); log(job, 'dur', dur.toFixed(2), '|', await p.evaluate(PREP));
    const rows = []; let measured = 0, withPairs = 0;
    for (let t = Math.max(0, FROM); t <= Math.min(dur - 0.05, UNTIL) + 1e-6; t += STEP) { const tt = +t.toFixed(3);
      await p.evaluate((t) => window.__enc.cine.seek(t), tt); await frames(p, 3);
      const r = await p.evaluate(CLIP, [ANALYSE_SRC]); r.t = tt; rows.push(r);
      if (!r.skip) { measured++;
        if (r.pairs.length) { const h = await p.evaluate(HAND); r.hand = h;
          const inBox = (at) => h && at[0].every((x, i) => x >= h.box[0][i] - 0.01) && at[1].every((x, i) => x <= h.box[1][i] + 0.01);
          for (const q of r.pairs) q.kind = (r.who === 'pho' || r.who === 'planted') && r.k > 0.5 && inBox(q.at) && h.deepMm <= GRIPMM ? 'contact' : 'THROUGH';
          const through = r.pairs.filter(q => q.kind === 'THROUGH');
          if (through.length) withPairs++;
          log(job, tt, r.who, 'k', r.k, through.length ? 'THROUGH' : 'contact', 'hand', h ? h.deepMm + ' mm, ' + h.inside + ' in' : '-', r.pairs.map(q => `${q.kind} ${q.a} x ${q.b}: ${q.hits} at ${JSON.stringify(q.at)}`).join(' | ')); } } }
    const byPair = {}; for (const r of rows) for (const q of (r.pairs || [])) { const key = q.kind + ' ' + q.a + ' x ' + q.b; const B = byPair[key] || (byPair[key] = { moments: 0, hits: 0, first: r.t, last: r.t, deepMm: 0 }); B.moments++; B.hits += q.hits; B.last = r.t; if (r.hand) B.deepMm = Math.max(B.deepMm, r.hand.deepMm); }
    all[job] = { dur, step: STEP, measured, withPairs, byPair, errs };
    fs.writeFileSync(`${OUT}/${job}.json`, JSON.stringify({ job, dur, step: STEP, rows, errs }, null, 0));
    log(job, 'measured', measured, 'moments of', rows.length, '; with a crossing that is not his grip\'s contact', withPairs, JSON.stringify(byPair), 'errors', errs.length);
  } catch (e) { log(job, 'FAILED', String(e).slice(0, 300)); all[job] = { failed: String(e).slice(0, 300), errs }; }
  await p.close();
}
fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(all, null, 1));
const bad = Object.values(all).filter(j => j.failed || j.withPairs || (j.errs && j.errs.length)).length;
log('films with pairs, a failure or an error:', bad);
await b.close();
process.exit(bad ? 1 : 0);
