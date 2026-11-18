/* v27.0 · A ROOM FROM ABOVE, for staging a film before it is shot: the chapter booted through the title, a bookmark applied
   (or none), the eye set high in the room looking straight down (the kit's lying pose frees the pitch), a lab picture a
   thousand pixels or more a side; every person's and spirit's group printed in world metres beside it, so a path, a
   stand and a lens can be laid out on the plan before a frame is photographed.
     CHROMIUM_PATH=... CH=e4c4 [PHASE=bless] [AT='x,y,z'] [FOV=100] [SIZE=1200] [VIS=0] OUT=file.jpg node tools/probes/topview.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c4', OUT = process.env.OUT || '/tmp/topview.jpg', SIZE = +(process.env.SIZE || 1200);
const AT = (process.env.AT || '1.0,2.55,2.6').split(',').map(Number), FOV = +(process.env.FOV || 100);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
if (process.env.PHASE) { await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE);
  await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 300 }); }
await p.waitForTimeout(+(process.env.SETTLE || 3000));
await p.addStyleTag({ content: 'body * { visibility: hidden !important; } canvas { visibility: visible !important; }' });
if (process.env.VIS === '1') { await p.evaluate(() => window.__enc.kit.vision(true));
  await p.waitForFunction(() => { const v = window.__enc.kit.vision(); return v && v.on && v.dir === 0; }, null, { timeout: 240000, polling: 200 }); }
const frames = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const place = () => p.evaluate(({ AT, FOV }) => { const E = window.__enc, hs = E.handsRoot; if (hs) hs.visible = false;
  E.kit.pose('lying', { y: AT[1], yaw: 0, span: Math.PI, pitchLo: -1.5705, pitchHi: 1.5705, secs: 0.05 });
  E.yaw.position.set(AT[0], AT[1], AT[2]); E.yaw.rotation.y = 0; E.pitch.rotation.x = -Math.PI / 2 + 1e-4;
  const cam = E.pitch.children.find(o => o.isCamera); if (cam) { cam.fov = FOV; cam.updateProjectionMatrix(); } }, { AT, FOV });
await place(); await frames(4); await p.waitForTimeout(400); await place(); await frames(3);
await p.screenshot({ path: OUT, quality: 92, timeout: 240000 });
const who = await p.evaluate(() => { const S = window.__enc.stage, r = {};
  for (const k of ['p4amma', 'p4ravi', 'p4mala', 'pho#0', 'pho#1', 'p4oppress', 'p4appa']) { const [key, i] = k.split('#'); const P = S.person && S.person(key, +(i || 0)); if (!P) continue;
    const g = P.group.position; r[k] = { at: [g.x, g.y, g.z].map(v => +v.toFixed(2)), ry: +P.group.rotation.y.toFixed(2), vis: P.group.visible }; }
  return r; });
console.log(JSON.stringify(who));
console.log('errors', errs.length, errs.slice(0, 3).join(' | '));
await b.close();
