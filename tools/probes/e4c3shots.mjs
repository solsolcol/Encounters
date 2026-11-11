/* v26.0: episode 4 chapter 3 PHOTOGRAPHED IN PLAY: the ground of the Wai Kru from named places, each reached the way play
   reaches it (the chapter booted, a bookmark or a look applied, the lens placed, the frame let settle), the page's errors
   counted, and the world's own census printed (meshes, triangles, pictures: stage.census, which counts the thing itself).
   A view is `name:what:x,y,z,yawDeg,pitchDeg[,fovDeg]`. `what` is a bookmark for stage.applyPhase (`arrive`, `dawn`, ...),
   `look=NAME` for one of the chapter's looks (DAY1, NIGHT, DAWN, AFTERNOON, DUSK), or `-` to stay. yaw 0 looks north (-z),
   90 looks west, -90 east, 180 south. A lens (fov, the vertical angle) is given to take one of Chad's photographs again
   from where its camera stood; without one the play lens stands.
     CHROMIUM_PATH=... [ENC_DIST=<snapshot>] VIEW=phone|desktop|photo [OUT=dir] [SETTLE=1200] [HUD=0] [VIEWS='...;...'] node tools/probes/e4c3shots.mjs
   VIEW=photo is a 4:3 frame (1200 x 900), the shape of his photographs, for laying a picture beside its photograph. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const SETTLE = +(process.env.SETTLE || 1200);
const OUT = (process.env.OUT || '/tmp/e4c3shots') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const DEF = [
  'spawn:arrive:-4,1.62,11.2,0,-3',
  'middle:-:0,1.62,3,0,2',
  'tables:-:0,1.62,-7.2,0,2',
  'chief:-:3.6,1.62,6.6,-135,-4',
  'west:-:-4,1.62,0,90,-2',
  'east:-:4,1.62,-1,-90,-2',
  'back:-:0,1.62,-8,180,-2'
];
const VIEWS = (process.env.VIEWS ? process.env.VIEWS.split(';') : DEF).map(s => {
  const parts = s.split(':'); const name = parts[0], nums = parts[parts.length - 1].split(',').map(Number);
  return { name, what: parts.slice(1, -1).join(':'), x: nums[0], y: nums[1], z: nums[2], yaw: nums[3], pitch: nums[4], fov: nums[5] || 0 };
});
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                               : VIEW === 'photo' ? { viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 }
                               : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=e4c3', { waitUntil: 'load', timeout: 240000 });
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
  await p.screenshot({ path: `${OUT}/${v.name}.jpg`, quality: 80, timeout: 240000 });
  console.log(el(), v.name, JSON.stringify(s).slice(0, 700));
}
console.log(el(), 'errs', JSON.stringify(errs));
await b.close();
