/* v26.2 · FEET IN THE GROUND, measured (Chad, 13 Nov 2026: "You didn't notice many masters have their feet sunk clipping
   into the ground?"). clipscan.mjs leaves the ground out (everything stands on it), so a sole under it was never a pair.
   For each phase named, the chapter is put there and every visible person is posed on the frame, at N moments SPAN s apart
   (a take moves a foot: one still can miss the dip): for each foot, the lowest of the skin that rides it (half its weight
   or more on that side's foot or toe bones) and the floor under that point (the ground, or the top of a rug, a mat or a
   carpet the chapter lays there: what a ray straight down from 0.5 m first meets among the flat things); and the lowest
   of all that person's skin (a robe's hem). A foot more than a centimetre under its floor is listed, deepest first.
     CHROMIUM_PATH=... [CH=e4c3] [PHASES=",festival,dawn,decide"] [N=8] [SPAN=0.6] [OUT=file.json] node tools/probes/feetscan.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c3', N = +(process.env.N || 8), SPAN = +(process.env.SPAN || 0.6), OUT = process.env.OUT || '/tmp/feetscan.json';
const LIST = (process.env.PHASES != null ? process.env.PHASES : ',festival,dawn,decide').split(',').map(x => x.trim());
/* LEVEL=1: every person and crowd member measured in that skin (the near body, what a player walking up to them sees),
   whatever the lens draws from where the probe stands; unset, what is drawn is what is measured (v26.3) */
const LEVEL = process.env.LEVEL != null ? +process.env.LEVEL : null;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [], warns = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') warns.push(m.text().slice(0, 300)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.dayClock.t > 0.5; } catch { return false; } }, null, { timeout: 600000, polling: 500 });
const MEASURE = (LV) => {
  const E = window.__enc, scene = E.scene, V3 = scene.position.constructor; scene.updateMatrixWorld(true);
  const saved = [];
  if (LV != null) for (const P of ((E.stage.dbg && E.stage.dbg.people) || [])) for (const X of [P].concat(P.members || [])) { if (!X.lv) continue;
    const want = X.lv[LV] ? LV : (X.lv[1] ? 1 : -1); for (let i = 0; i < 4; i++) if (X.lv[i]) for (const m of X.lv[i]) { saved.push([m, m.visible]); m.visible = i === want && !(X === P && P.driver); } }
  const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  /* the floors: every visible flat thing (a rug, a mat, a carpet: under 6 cm tall, its top under 0.3 m), as boxes */
  const floors = [];
  scene.traverse(o => { if (!o.isMesh || o.isSkinnedMesh || !vis(o) || !o.geometry) return; if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld); if (bb.max.y - bb.min.y < 0.06 && bb.max.y < 0.3 && bb.max.y > 0.001 && (bb.max.x - bb.min.x) > 0.3) floors.push(bb); });
  const floorAt = (x, z) => { let y = E.groundAt ? E.groundAt(x, z) || 0 : 0; for (const f of floors) if (x >= f.min.x && x <= f.max.x && z >= f.min.z && z <= f.max.z) y = Math.max(y, f.max.y); return y; };
  const out = [], v = new V3();
  /* each person named: a cast member by the stage's own map (dbg.cast), a crowd member by its seat's body */
  const names = new Map(), C = (E.stage.dbg && E.stage.dbg.cast) || {};
  for (const k in C) if (C[k] && C[k].group) names.set(C[k].group, 'cast:' + k + (C[k].cur ? '[' + C[k].cur + ']' : ''));
  const nameOf = (o) => { for (let q = o; q; q = q.parent) if (names.has(q)) return names.get(q); return null; };
  scene.traverse(o => { if (!o.isSkinnedMesh || !vis(o) || !o.skeleton) return;
    let root = o; while (root.parent && root.parent !== scene && !names.has(root) && root.parent.children.length <= 25) root = root.parent;
    const name = nameOf(o) || ('crowd ' + (o.name || ''));
    o.skeleton.update();
    const pos = o.geometry.attributes.position, si = o.geometry.attributes.skinIndex, sw = o.geometry.attributes.skinWeight; if (!pos || !si || !sw) return;
    const side = o.skeleton.bones.map(bn => { const m = /^(?:mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.exec(bn.name); return m ? m[1] : null; });
    const low = { Left: [Infinity, 0, 0], Right: [Infinity, 0, 0] }; let all = Infinity, allAt = [0, 0];
    for (let i = 0; i < pos.count; i++) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld);
      if (v.y < all) { all = v.y; allAt = [v.x, v.z]; }
      const w = { Left: 0, Right: 0 }; for (let c = 0; c < 4; c++) { const sd = side[si.getComponent(i, c)]; if (sd) w[sd] += sw.getComponent(i, c); }
      for (const sd of ['Left', 'Right']) if (w[sd] >= 0.5 && v.y < low[sd][0]) low[sd] = [v.y, v.x, v.z]; }
    const rec = { who: name.slice(0, 60), at: [+root.position.x.toFixed(2), +root.position.z.toFixed(2)], hem: +(all - floorAt(allAt[0], allAt[1])).toFixed(3) };
    for (const sd of ['Left', 'Right']) if (low[sd][0] < Infinity) rec[sd] = +(low[sd][0] - floorAt(low[sd][1], low[sd][2])).toFixed(3);
    out.push(rec); });
  for (const [m, v] of saved) m.visible = v;
  return out;
};
const res = {};
/* (and what each body's takes were read as, where the chapter sets them down: P.groundRep, P.seated, P.rise) */
res.rep = await p.evaluate(() => { const L = (window.__enc.stage.dbg && window.__enc.stage.dbg.people) || [];
  return L.map(q => ({ key: q.key, driver: !!q.driver, cur: q.cur, ground: q.groundRep || null, seated: q.seated || null, rise: q.rise ? Object.keys(q.rise) : null })); });
for (const ph of LIST) {
  if (ph) { await p.evaluate((ph) => { const E = window.__enc; if (E.cine && E.cine.active && E.cine.active() && E.cine.skip) E.cine.skip(); E.stage.reset(); E.kit.setPhase(ph); }, ph);
    await p.waitForFunction((ph) => { const E = window.__enc; return E.stage.info().phase === ph.split(':')[0] && E.stage.dayClock.t > 0.3 && !(E.cine && E.cine.active && E.cine.active()); }, ph, { timeout: 600000, polling: 300 }).catch(() => log('phase', ph, 'not reached as play'));
  }
  await p.waitForFunction(() => { try { const i = window.__enc.stage.info(); return !i.waiting || !i.waiting.length; } catch { return false; } }, null, { timeout: 600000, polling: 1000 }).catch(() => {});
  const worst = new Map();
  for (let k = 0; k < N; k++) {
    const t0 = await p.evaluate(() => window.__enc.stage.dayClock.t);
    await p.waitForFunction(([t0, s]) => window.__enc.stage.dayClock.t >= t0 + s, [t0, SPAN], { timeout: 300000, polling: 200 }).catch(() => {});
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    for (const r of await p.evaluate(MEASURE, LEVEL)) { const key = r.who + '@' + r.at.join(','), w = worst.get(key) || { who: r.who, at: r.at, Left: 9, Right: 9, hem: 9 };
      for (const f of ['Left', 'Right', 'hem']) if (r[f] != null) w[f] = Math.min(w[f], r[f]); worst.set(key, w); }
  }
  const rows = [...worst.values()].sort((a, c) => Math.min(a.Left, a.Right) - Math.min(c.Left, c.Right));
  res[ph || 'start'] = rows;
  log(ph || 'start', rows.length, 'people;', rows.filter(r => Math.min(r.Left, r.Right) < -0.01).length, 'with a foot over a centimetre under its floor');
  for (const r of rows.filter(r => Math.min(r.Left, r.Right) < -0.01)) log('   ', r.who, '@', r.at.join(','), 'feet', r.Left, r.Right, 'lowest skin', r.hem);
}
res.warns = warns; fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log('errs', JSON.stringify(errs));
await b.close();
