/* v27.0 build 45 (Chad, 19 Nov 2026, R105): SPIRIT VISION'S TRACER, photographed at the same radii before and after, on a
   phone (390 x 844 CSS points drawn at DSF device pixels a point, 2 by default, a touch context), in play in her living
   room (the opening film let go by the Skip path, testlib's toPlay).
     A build with the engine's still (E.visionStill, build 45 on): the wave put where it would be at each radius going OUT,
       its trail's clock at that moment (so the outlines it has crossed keep what they keep), then once it has reached its
       end and AGE seconds on (the trail fading), and going HOME at two radii.
     A build without it (build 44): the same radii HELD with the front moving (kit.vision({ r, moving: true })): the old
       wave as it was, its band only (it had no trail).
   Every picture is OUT/tracer-<what>.png. Page errors, console errors and a vision that is not drawing are printed, and
   the run exits non-zero on any.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [DSF=2] [VIEW=x,y,z,yawDeg,pitchDeg] node tools/probes/e4c4tracer.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4tracer';
fs.mkdirSync(OUT, { recursive: true });
const DSF = +(process.env.DSF || 2);
const VIEW = (process.env.VIEW || '').split(',').filter(Boolean).map(Number);
const RADII = [1.5, 3, 6, 12, 30];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /spirit vision: off|failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 300)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(4000);
if (VIEW.length === 5) await p.evaluate(([x, y, z, yd, pd]) => { const E = window.__enc; E.yaw.position.set(x, y, z); E.yaw.rotation.y = yd * Math.PI / 180; E.pitch.rotation.x = pd * Math.PI / 180; }, VIEW);
const still = await p.evaluate(() => typeof window.__enc.visionStill === 'function');
log('the build', still ? 'has the still (after)' : 'has no still (before): radii held');
const shot = async (name) => { await frames(3); await p.waitForTimeout(400); await frames(2);
  await p.screenshot({ path: `${OUT}/tracer-${name}.png`, timeout: 240000 }); };
const vis = () => p.evaluate(() => window.__enc.vision());
if (still) {
  /* the radius's own time on the curve (main.js visCurve, 0.3u + 0.7u^3 of rmax 70) */
  const tOf = (r, secs) => { const f = r / 70; let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (0.3 * m + 0.7 * m * m * m < f) lo = m; else hi = m; } return secs * (lo + hi) / 2; };
  for (const r of RADII) {
    const t = tOf(r, 2.2);
    log('out at', r, 'm:', JSON.stringify(await p.evaluate((t) => window.__enc.visionStill({ t, dir: 1 }), t)));
    await shot(`out-${String(r).padStart(4, '0')}`);
  }
  for (const age of [0.35, 0.9]) {
    await p.evaluate((age) => window.__enc.visionStill({ t: 2.2, dir: 1, age }), age);
    await shot(`end-age${age}`);
  }
  for (const r of [12, 3]) {
    const u = (() => { const f = r / 70; let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (0.3 * m + 0.7 * m * m * m < f) lo = m; else hi = m; } return (lo + hi) / 2; })();
    const t = (1 - u) * 1.6;
    log('home at', r, 'm:', JSON.stringify(await p.evaluate((t) => window.__enc.visionStill({ t, dir: -1 }), t)));
    await shot(`home-${String(r).padStart(4, '0')}`);
  }
  await p.evaluate(() => window.__enc.visionStill(null));
} else {
  for (const r of RADII) {
    await p.evaluate((r) => window.__enc.kit.vision({ r, moving: true }), r);
    await shot(`out-${String(r).padStart(4, '0')}`);
  }
  await p.evaluate(() => window.__enc.kit.vision(null));
}
const v = await vis();
log('the vision:', JSON.stringify(v));
if (!v.ok || v.err) errs.push('VISION NOT DRAWING ' + JSON.stringify(v));
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length ? 1 : 0);
