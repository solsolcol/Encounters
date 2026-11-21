/* v28.0 (E4C5, M8): GRANDMASTER PHO'S THREE ACT TAKES SET DOWN BY HIS OWN FEET, proved (the lead's word, R23). On a phone
   page (390 x 844 at 2, a touch context), the fight set out and its brief taken down through the fight's lab; then for
   each act's played window (the fire's mage_soell_cast_7 since R25, the gold's Charged_Spell_Cast, the bag's mage_soell_cast_8: the
   windows of c_fightstage.js FS_PHO_TAKE) his body held at 13 moments by the chapter's own pose (lab.pose: every law of
   his and his feet's curve), and at each the lowest of the skin that rides each foot (half its weight or more on that
   side's foot or toe bones) and the lowest of all his skin, against the court's floor: the feetscan way, over the window.
   Then his body photographed full size from his front and his left side (the court's open side) at the gold's crouch and
   top, the bag's draw and the fire's throw and its held hand. OUT/ground.json holds every number; the pictures are OUT/<take>-<t>-<side>.png.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] node tools/probes/e4c5ground.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5ground';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
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
await frames(2);
const ground = await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.groundOn());   // (the curves made, the gold's and the bag's takes on)
say('ground curves', JSON.stringify(Object.fromEntries(Object.entries(ground || {}).filter(([k]) => /the fight/.test(k)))));
const FEET = () => p.evaluate(() => {
  const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, V = P.group.position.constructor, v = new V(), out = { L: 9, R: 9, all: 9 };
  P.group.updateWorldMatrix(true, true);
  const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const floor = E.groundAt ? (E.groundAt(P.group.position.x, P.group.position.z) || 0) : 0;
  P.group.traverse(o => { if (!o.isSkinnedMesh || !vis(o)) return; const G = o.geometry, sk = o.skeleton, si = G.attributes.skinIndex, sw = G.attributes.skinWeight, pos = G.attributes.position;
    const side = sk.bones.map(bn => { const r = /^(?:mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.exec(bn.name); return r ? r[1][0] : null; });
    for (let i = 0; i < pos.count; i++) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld); const y = v.y - floor; if (y < out.all) out.all = y;
      let wl = 0, wr = 0; for (let j = 0; j < 4; j++) { const sd = side[si.getComponent(i, j)], w = sw.getComponent(i, j); if (sd === 'L') wl += w; else if (sd === 'R') wr += w; }
      if (wl >= 0.5 && y < out.L) out.L = y; if (wr >= 0.5 && y < out.R) out.R = y; } });
  for (const k in out) out[k] = +out[k].toFixed(4);
  return out; });
const WIN = [['mage_soell_cast_7', 0.45, 2.20], ['Charged_Spell_Cast', 0.50, 2.60], ['mage_soell_cast_8', 0.00, 0.40]];
const res = { ground, windows: {} };
for (const [name, a, z] of WIN) {
  const rows = [];
  for (let i = 0; i <= 12; i++) { const t = +(a + (z - a) * i / 12).toFixed(3);
    await p.evaluate(([n, t]) => window.__enc.stage.snap().story.fight.lab.pose(n, t), [name, t]); await frames(2);
    const f = await FEET(); rows.push({ t, ...f }); }
  const lo = (k) => Math.min(...rows.map(r => r[k])), hi = (k) => Math.max(...rows.map(r => r[k]));
  res.windows[name] = { rows, L: [lo('L'), hi('L')], R: [lo('R'), hi('R')], all: [lo('all'), hi('all')] };
  say('FEET', name, a + '..' + z, 'left', JSON.stringify(res.windows[name].L), 'right', JSON.stringify(res.windows[name].R), 'all', JSON.stringify(res.windows[name].all));
  for (const r of rows) say('   ', String(r.t).padStart(5), 'L', r.L, 'R', r.R, 'all', r.all);
}
/* the pictures: his front (3.0 m before him, toward the house) and his left side (2.6 m, the court's open side) */
await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null); });
for (const [name, t] of [['Charged_Spell_Cast', 1.0], ['Charged_Spell_Cast', 2.0], ['mage_soell_cast_8', 0.4], ['mage_soell_cast_7', 0.95], ['mage_soell_cast_7', 1.3]]) {
  for (const side of ['front', 'side']) {
    await p.evaluate(([n, t, side]) => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho; E.stage.snap().story.fight.lab.pose(n, t);
      const g = P.group.position, ry = P.group.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), lx = Math.cos(ry), lz = -Math.sin(ry);
      if (side === 'side') { E.yaw.position.set(g.x + lx * 2.6, 1.3, g.z + lz * 2.6); E.yaw.rotation.y = Math.atan2(lx, lz); }
      else { E.yaw.position.set(g.x + fx * 3.0, 1.35, g.z + fz * 3.0); E.yaw.rotation.y = Math.atan2(fx, fz); }
      E.pitch.rotation.x = -0.05; }, [name, t, side]);
    await frames(3);
    const f = `${OUT}/${name}-${t}-${side}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f);
  }
}
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.pose(null));
fs.writeFileSync(OUT + '/ground.json', JSON.stringify({ res, errs }, null, 1));
for (const e of errs.slice(0, 10)) say(e);
say('errors', errs.length);
await b.close();
