/* v28.0 (R186) · WHERE EACH OF THE TABLE'S THREE LOOK MARKS IS TRIGGERED, AS A MAP OF THE SCREEN. Seated at the table in
   the table's phase with the first smell found ('table:m') and his sight opened by the key a desktop player presses (V), the
   view is laid where the table seats him; then for every 8th pixel of the screen the engine's own rule (main.js
   nearestHotspot's pressAim branch: the angle from the middle of the screen to each spot as a share of its own cone, the
   nearest under 1 winning, in its reach and on the screen) is asked as if that pixel were turned to the middle of the
   screen. Written: the picture (OUT/aim-<view>.png), the map (OUT/aim-<view>.json: the grid of ids), each mark's place
   and its area in pixels; and five aims checked against the engine itself (its kitDebug().hotspot after a drawn frame).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [VIEW=desk|wide|phone] [OUT=dir] node tools/probes/e4c5aimmap.mjs (through bslot) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const SHAPES = { desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
                 wide: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
                 phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } };
const VIEW = process.env.VIEW || 'desk', OUT = process.env.OUT || '/tmp/e4c5aimmap'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH); const ctx = await b.newContext(SHAPES[VIEW]); const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.applyPhase('table:m'));
await p.waitForTimeout(6000);
await p.keyboard.press('KeyV');
await p.waitForTimeout(4000);
const ids = ['look1', 'look2', 'look3'];
const res = await p.evaluate((ids) => {
  const E = window.__enc, list = E.stage.hotspots.filter(h => ids.includes(h.id));
  let cam = null; E.yaw.traverse(o => { if (!cam && o.isCamera) cam = o; });
  E.yaw.updateMatrixWorld(true);
  const C = new cam.position.constructor(), F = new cam.position.constructor(), T = new cam.position.constructor(), R = new cam.position.constructor();
  cam.getWorldPosition(C);
  const on = list.map(h => ({ id: h.id, en: typeof h.enabled === 'function' ? !!h.enabled() : true, aim: h.aim, pos: h.pos }));
  const proj = (x, y, z) => { R.set(x, y, z).project(cam); return R; };
  const pick = (dir) => { let best = null, bk = Infinity;
    for (const h of list) { if (h.done || (typeof h.enabled === 'function' && !h.enabled())) continue;
      const d = Math.hypot(E.yaw.position.x - h.pos.x, E.yaw.position.z - h.pos.z); if (!(d < (h.radius || 2.2))) continue;
      const n = proj(h.pos.x, h.pos.y ?? 1.0, h.pos.z); if (!(n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97)) continue;
      T.set(h.pos.x - C.x, (h.pos.y ?? 1.0) - C.y, h.pos.z - C.z).normalize();
      const k = Math.acos(Math.max(-1, Math.min(1, dir.dot(T)))) / (h.aim || 0.10);
      if (k < 1 && k < bk) { best = h.id; bk = k; } }
    return best; };
  const W = innerWidth, H = innerHeight, S = 8, grid = [];
  for (let y = S / 2; y < H; y += S) { const row = [];
    for (let x = S / 2; x < W; x += S) { F.set(x / W * 2 - 1, -(y / H * 2 - 1), 0.5).unproject(cam).sub(C).normalize(); row.push(pick(F)); }
    grid.push(row); }
  const area = {}; for (const r of grid) for (const v of r) if (v) area[v] = (area[v] || 0) + S * S;
  const marks = list.map(h => { const q = proj(h.pos.x, (h.pos.y ?? 1.0) + (h.markY ?? 0.55), h.pos.z); return { id: h.id, x: (q.x * 0.5 + 0.5) * W, y: (-q.y * 0.5 + 0.5) * H }; });
  return { W, H, S, grid, area, marks, on, phase: E.stage.info().phase, vision: (E.kit.vision && E.kit.vision()) || null, yaw: E.yaw.rotation.y, pitch: E.pitch.rotation.x,
           dot: (() => { const d = document.getElementById('aimDot'); return d ? getComputedStyle(d).display : 'none (no element)'; })() };
}, ids);
fs.writeFileSync(`${OUT}/aim-${VIEW}.json`, JSON.stringify(res));
await p.screenshot({ path: `${OUT}/aim-${VIEW}.png` });
console.log('MAP', VIEW, JSON.stringify({ area: res.area, marks: res.marks, on: res.on.map(o => [o.id, o.en, o.aim]), phase: res.phase, dot: res.dot }));
/* five aims checked against the engine itself: each mark turned to the middle of the screen, and two between them */
const base = { yaw: res.yaw, pitch: res.pitch };
const checks = [];
for (const [lbl, mx, my] of [['look1', null, null], ['look2', null, null], ['look3', null, null], ['mid12', 0.5, null], ['above2', null, -40]]) {
  const m = res.marks.find(q => q.id === (lbl.startsWith('look') ? lbl : lbl === 'mid12' ? 'look1' : 'look2'));
  let tx = m.x, ty = m.y;
  if (lbl === 'mid12') { const m2 = res.marks.find(q => q.id === 'look2'); tx = (m.x + m2.x) / 2 + 6; ty = (m.y + m2.y) / 2; }
  if (lbl === 'above2') ty = m.y - 40;
  /* (turn the view so that screen point comes to the middle: the angle each way from the lens's own focal length) */
  await p.evaluate(([tx, ty, base]) => { const E = window.__enc; let cam = null; E.yaw.traverse(o => { if (!cam && o.isCamera) cam = o; });
    const f = (innerHeight / 2) / Math.tan(cam.fov * Math.PI / 360);
    E.yaw.rotation.y = base.yaw - Math.atan((tx - innerWidth / 2) / f); E.pitch.rotation.x = base.pitch - Math.atan((ty - innerHeight / 2) / f); }, [tx, ty, base]);
  await p.waitForTimeout(2500);
  const got = await p.evaluate(() => window.__enc.kitDebug().hotspot);
  checks.push([lbl, got]);
}
console.log('ENGINE', JSON.stringify(checks));
await p.evaluate((base) => { window.__enc.yaw.rotation.y = base.yaw; window.__enc.pitch.rotation.x = base.pitch; }, base);
console.log('errors', JSON.stringify(errs.filter(e => !/favicon|net::ERR/.test(e))));
await b.close();
