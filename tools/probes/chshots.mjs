/* v27.0: a chapter PHOTOGRAPHED IN PLAY from named places (episode 4 chapter 3's probe, e4c3shots.mjs, made general for
   any chapter, and its phone drawn at TWO device pixels a point as the house's photographs are: "NO SMALL PICTURE IS EVER A
   CHECK", v26.0). The chapter booted through the title as play reaches it, a bookmark or a look applied, the lens placed,
   the frame let settle; the page's errors counted and the world's census printed (stage.census, the thing itself).
   A view is `name:what:x,y,z,yawDeg,pitchDeg[,fovDeg]`: `what` a bookmark for stage.applyPhase, `look=NAME` for a look,
   or `-` to stay. yaw 0 looks along -z, 90 along -x, -90 along +x, 180 along +z.
     CHROMIUM_PATH=... CH=e4c4 VIEW=phone|desktop|photo [OUT=dir] [SETTLE=1200] [HUD=0] [VIEWS='...;...'] node tools/probes/chshots.mjs
   VIEW=phone is 390 x 844 points drawn at 2 (780 x 1688 pixels); desktop 1280 x 800; photo 1200 x 900. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const SETTLE = +(process.env.SETTLE || 1200);
const CH = process.env.CH || 'e4c4';
const OUT = (process.env.OUT || '/tmp/' + CH + 'shots') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const DEF = [                                                          // (episode 4 chapter 4's flat)
  'door:-:0,1.62,0.6,180,-4',
  'altar:-:0.4,1.62,2.6,167,-8',
  'back:-:0.5,1.62,4.3,0,-6',
  'tv:-:2.0,1.62,3.4,60,-6',
  'hers:-:1.6,1.62,1.8,-90,-6',
  'dining:-:4.2,1.62,4.3,180,-6',
  'gate:-:0.3,1.52,-1.0,180,-4',
  'corridor:-:2.0,1.52,-1.2,90,-2'
];
const VIEWS = (process.env.VIEWS ? process.env.VIEWS.split(';') : DEF).map(s => {
  const parts = s.split(':'); const name = parts[0], nums = parts[parts.length - 1].split(',').map(Number);
  return { name, what: parts.slice(1, -1).join(':'), x: nums[0], y: nums[1], z: nums[2], yaw: nums[3], pitch: nums[4], fov: nums[5] || 0 };
});
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
                               : VIEW === 'photo' ? { viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 }
                               : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(5000);                                         // the chapter's first frames (v9.3)
if (process.env.HUD === '0') await p.addStyleTag({ content: '#hud, #objective, #reticle, .hudel { opacity: 0 !important; }' });
const frames = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const place = (v) => p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180;
  E.yaw.position.set(v.x, v.y, v.z); E.yaw.rotation.y = v.yaw * d; E.pitch.rotation.x = v.pitch * d;
  const cam = E.pitch.children.find(o => o.isCamera);
  if (cam) { const f = v.fov || 72; if (Math.abs(cam.fov - f) > 1e-3) { cam.fov = f; cam.updateProjectionMatrix(); } } }, v);
for (const v of VIEWS) {
  if (v.what && v.what !== '-') {
    if (v.what.startsWith('look=')) await p.evaluate((n) => window.__enc.stage.look(n, 0), v.what.slice(5));
    else { await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), v.what);
      await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 300 }); }
    await frames(4); await p.waitForTimeout(1500);
  }
  await place(v); await frames(3);
  if (SETTLE) await p.waitForTimeout(SETTLE);
  await place(v); await frames(3);
  const s = await p.evaluate(() => { const E = window.__enc, S = E.stage; return { st: E.getState(), phase: S.phase, info: S.info ? S.info() : null, census: S.census ? S.census() : null }; });
  await p.screenshot({ path: `${OUT}/${v.name}.jpg`, quality: 92, timeout: 240000 });
  console.log(el(), v.name, JSON.stringify(s).slice(0, 700));
}
const extra = await p.evaluate(() => { const S = window.__enc.stage; return { crowd: S.crowdStats ? S.crowdStats() : null, who: S.who ? S.who() : null }; });
console.log(el(), 'crowd', JSON.stringify(extra.crowd));
console.log(el(), 'who', JSON.stringify(extra.who));
console.log(el(), 'errs', JSON.stringify(errs));
await b.close();
