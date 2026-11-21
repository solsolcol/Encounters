/* v28.0 (E4C5, M8, R25: "the characters walking speed feels sluggish, make it faster and more responsive"): THE FIGHT'S WALK,
   MEASURED BY THE REAL STICK. On a phone page (390 x 844 at 2, a touch context) the fight set out and START tapped by touch;
   then for Grandmaster Pho, and for Master Zavier through the real switch (shown by the lab where the build has one): set
   down at a clear start in the rules' own frame (lab.place, where the build has it; an older build walks him from where the
   fight puts him, LEFT toward his student), the stick pushed by CDP touches (down at x 100, then 52 px aside: the stick's
   whole travel, or REACH px), held until he has covered RUN metres or the frames run out, let go. Every drawn frame read:
   the mode's clock, his place, the engine's reading of his pace, his takes (lab.gait: which, their weights and rates) and
   each foot's place in the world. Read from that: the pace held, the time from the stick to 63, 90 and 98 % of it, the
   time from letting go to standing, and each planted foot's drift (a foot within 2 cm of its lowest over two frames or
   more: what his feet slide). A picture of each at full pace, full size. OUT/walk.json holds every frame.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [REACH=52] [RUN=2.4] node tools/probes/e4c5walk.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5walk', REACH = +(process.env.REACH || 52), RUN = +(process.env.RUN || 2.4);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|has no take/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const cdp = await ctx.newCDPSession(p);
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const tapEl = async (id) => { const r = await p.evaluate((id) => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, id); if (r) await p.touchscreen.tap(r.x, r.y); return !!r; };
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await sleep(900);
await p.waitForFunction(() => { const e = document.getElementById('evBtn'), r = e && e.getBoundingClientRect(); return !!r && r.width > 0 && e.textContent.trim().length > 0; }, null, { timeout: 180000, polling: 300 });
await tapEl('evBtn');
await p.waitForFunction(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'learn' && window.__enc.kit.tagState().live; }, null, { timeout: 300000, polling: 300 });
const caps = await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab || {}; return { place: typeof L.place === 'function', swapOn: typeof L.swapOn === 'function', gait: typeof L.gait === 'function' }; });
say('the build\'s lab', JSON.stringify(caps));
/* every drawn frame: the mode's clock, both bodies, his takes, his feet */
await p.evaluate(() => {
  const E = window.__enc, rec = window.__walk = { on: false, rows: [] };
  const C = E.stage.plan.FLOOR.cast, V = C.pho.group.position.constructor, v = new V();
  const foot = (P, side) => { const B = P.bone[side + 'Foot'] || P.bone['mixamorig:' + side + 'Foot']; if (!B) return null; B.getWorldPosition(v); return [+v.x.toFixed(4), +v.y.toFixed(4), +v.z.toFixed(4)]; };
  const tick = () => { if (rec.on) { const ts = E.kit.tagState(), L = E.stage.snap().story.fight.lab;
      rec.rows.push({ t: ts.t, played: ts.played, live: ts.live, bodies: ts.bodies.map(q => ({ id: q.id, x: q.x, z: q.z, v: q.v, ry: q.ry })),
        gait: L && L.gait ? L.gait() : { pho: { cur: C.pho.cur } },
        feet: { pho: [foot(C.pho, 'Left'), foot(C.pho, 'Right')], zav: [foot(C.zav, 'Left'), foot(C.zav, 'Right')] } }); }
    requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});
const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 7, radiusX: 4, radiusY: 4, force: 1 }] });
async function walk(who, dir, from) {
  const id = who === 'pho' ? 'pho' : 'zavier';
  if (from && caps.place) { await p.evaluate(([w, x, z]) => window.__enc.stage.snap().story.fight.lab.place(w, x, z), [who, from[0], from[1]]); await frames(3); }
  await p.evaluate(() => { window.__walk.rows = []; window.__walk.on = true; });
  await frames(2);
  const x0 = 100, y0 = 640;
  await touch('touchStart', x0, y0); await frames(1);
  await touch('touchMove', x0 + dir[0] * REACH, y0 + dir[1] * REACH);
  const mark = await p.evaluate(() => window.__walk.rows.length);
  let held = 0;
  for (let i = 0; i < 60; i++) { await frames(1); held++;
    const r = await p.evaluate(([id, m]) => { const R = window.__walk.rows; if (R.length <= m) return null; const a = R[m - 1] || R[0], z = R[R.length - 1], A = a.bodies.find(q => q.id === id), Z = z.bodies.find(q => q.id === id); return { d: Math.hypot(Z.x - A.x, Z.z - A.z), v: Z.v, n: R.length - m }; }, [id, mark]);
    if (r && (r.d >= RUN || (r.n > 6 && r.v < 0.02))) break;
    if (held === 12) { const f = `${OUT}/${who}-full-pace.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); } }
  const letGo = await p.evaluate(() => window.__walk.rows.length);
  await touch('touchEnd', 0, 0);
  for (let i = 0; i < 10; i++) await frames(1);
  const rows = await p.evaluate(() => { window.__walk.on = false; return window.__walk.rows; });
  return { who, id, dir, from, mark, letGo, rows };
}
function read(run) {
  const { id, rows, mark, letGo } = run, who = run.who;
  const B = rows.map(r => ({ t: r.t, ...r.bodies.find(q => q.id === id), g: r.gait && r.gait[who === 'pho' ? 'pho' : 'zav'], f: r.feet[who === 'pho' ? 'pho' : 'zav'] }));
  /* the ground covered frame to frame (what the eye sees), against the mode's clock */
  const sp = []; for (let i = 1; i < B.length; i++) { const dt = B[i].t - B[i - 1].t; sp.push({ t: B[i].t, s: dt > 0 ? Math.hypot(B[i].x - B[i - 1].x, B[i].z - B[i - 1].z) / dt : 0, v: B[i].v, g: B[i].g }); }
  const t0 = B[Math.max(0, mark - 1)].t;                       // (the last frame before the stick reached the page)
  const tL = B[Math.min(B.length - 1, letGo - 1)].t;
  const moving = sp.filter(q => q.t > t0 && q.t <= tL);
  const pace = moving.length >= 3 ? Math.max(...moving.slice(-4).map(q => q.s)) : Math.max(0, ...moving.map(q => q.s));
  const at = (k) => { const q = moving.find(q => q.s >= k * pace); return q ? +(q.t - t0).toFixed(3) : null; };
  const after = sp.filter(q => q.t > tL), stop = after.find(q => q.s < 0.05 * pace);
  /* each planted foot's drift: within 2 cm of its lowest over two frames or more, while he moves */
  const drift = [];
  for (const j of [0, 1]) { const ys = B.filter(q => q.f && q.f[j]).map(q => q.f[j][1]); if (!ys.length) continue; const lo = Math.min(...ys);
    let run = null; const close = () => { if (run && run.n >= 2) drift.push({ foot: j ? 'right' : 'left', from: +run.t0.toFixed(2), frames: run.n, slid: +Math.hypot(run.x1 - run.x0, run.z1 - run.z0).toFixed(3) }); run = null; };
    for (const q of B) { if (!(q.t > t0 && q.t <= tL) || !q.f || !q.f[j]) { close(); continue; } const [x, y, z] = q.f[j];
      if (y < lo + 0.02) { if (!run) run = { t0: q.t, x0: x, z0: z, n: 0 }; run.n++; run.x1 = x; run.z1 = z; } else close(); }
    close(); }
  return { who, pace: +pace.toFixed(3), to63: at(0.63), to90: at(0.9), to98: at(0.98), stopIn: stop ? +(stop.t - tL).toFixed(3) : null,
           frames: moving.length, frameDt: moving.length > 1 ? +((moving[moving.length - 1].t - moving[0].t) / (moving.length - 1)).toFixed(3) : null,
           takes: [...new Set(moving.map(q => q.g && q.g.cur).filter(Boolean))], drift,
           curve: moving.map(q => [+(q.t - t0).toFixed(2), +q.s.toFixed(2), q.g ? q.g.cur : '', q.g && q.g.ts ? q.g.ts : null]) };
}
const res = { caps, runs: [] };
/* Grandmaster Pho: from (-1.45, 2.45), the stick full right (the court's +x, past his student at 1.75 m); an older build
   (no lab.place): from where the fight puts him, LEFT toward his student's cage */
const r1 = await walk('pho', caps.place ? [1, 0] : [-1, 0], caps.place ? [-1.45, 2.45] : null);
res.runs.push(read(r1)); say('PHO', JSON.stringify(res.runs[0], (k, v) => k === 'curve' ? undefined : v)); say('   curve', JSON.stringify(res.runs[0].curve));
/* Master Zavier, through the real switch */
if (caps.swapOn) await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.swapOn());
await frames(3);
await tapEl('tagSw').catch(() => null);
const sw = await p.waitForFunction(() => window.__enc.kit.tagState().played === 'zavier', null, { timeout: 120000, polling: 300 }).then(() => true).catch(() => false);
say('switched to Master Zavier', sw);
let r2 = null;
if (sw) { await p.waitForFunction(() => !window.__enc.kit.tagState().gliding, null, { timeout: 60000, polling: 300 }).catch(() => null);
  r2 = await walk('zav', [1, 0], caps.place ? [-1.45, -1.9] : null);
  res.runs.push(read(r2)); say('ZAV', JSON.stringify(res.runs[1], (k, v) => k === 'curve' ? undefined : v)); say('   curve', JSON.stringify(res.runs[1].curve)); }
fs.writeFileSync(OUT + '/walk.json', JSON.stringify({ res, raw: [r1, r2].filter(Boolean), errs }, null, 1));
for (const e of errs.slice(0, 10)) say(e);
say('errors', errs.length);
await b.close();
