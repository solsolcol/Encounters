/* v28.0 (E4C5, R34): WHERE THE BIND IS DRAWN, read in numbers. The fight set out through its lab as e4c5r34.mjs does; then
   the rules' place of every Prai (and its body's place in the world), Master Zavier's and Grandmaster Pho's, the cage's;
   then the bind begun on the lab's Prai as the game begins it (lab.moment labBind), and the places of its bubble, its
   orbit rings, its seal on the paving, its lock ring, the bolt's two ends, and which way Master Zavier faces against the
   way to the Prai. One JSON report, OUT/bindat.json.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [CHFILE=<chapter.js>] node tools/probes/e4c5bindat.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5bindat'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
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
await frames(4);
const read = () => p.evaluate(() => { const E = window.__enc, F = E.stage.snap().story.fight, ts = E.kit.tagState(), C = E.stage.plan.FLOOR.cast;
  const r2 = (v) => v == null ? null : +(+v).toFixed(3), vec = (o) => o ? [r2(o.x), r2(o.y), r2(o.z)] : null;
  const out = { stage: F.stage, who: F.who, bodies: ts.bodies, prai: F.prai || null, zav: C.zav ? { pos: vec(C.zav.group.position), ry: r2(C.zav.group.rotation.y) } : null,
                pho: C.pho ? { pos: vec(C.pho.group.position), ry: r2(C.pho.group.rotation.y) } : null };
  /* the court's effects: every visible mesh of the fight's group with its world place and scale */
  const fx = []; E.stage.snap().story.fight.lab && 0;
  let g = null; E.yaw.parent && E.yaw.parent.traverse(o => { if (!g && o.name === 'fightFX') g = o; });
  return out; });
res = {};
var res;
res.before = await read();
res.bind = await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; return L.moment('labBind', 0.5); });
await frames(4);
res.after = await read();
/* the bind's own pieces, by the fight's report of them where the chapter gives it (fightSnap): else the scene's meshes */
res.fxMeshes = await p.evaluate(() => { const E = window.__enc, out = []; let root = E.yaw; while (root.parent) root = root.parent;
  root.traverse(o => { if (!o.isMesh || !o.visible || !o.material) return; const m = o.material; if (!(m.blending === 2 || m.transparent)) return;
    const w = o.getWorldPosition(new o.position.constructor()); const s = o.getWorldScale(new o.position.constructor());
    if (Math.abs(w.y) > 6) return; out.push({ name: o.name || o.geometry.type, at: [w.x, w.y, w.z].map(v => +v.toFixed(2)), s: [s.x, s.y, s.z].map(v => +v.toFixed(2)) }); });
  return out.slice(0, 120); });
fs.writeFileSync(OUT + '/bindat.json', JSON.stringify({ res, errs }, null, 1));
console.log(JSON.stringify({ zav: res.after.zav, pho: res.after.pho, prai: res.after.prai, bodies: res.after.bodies }).slice(0, 3000));
console.log('errors', errs.length);
await b.close();
