/* v25.0: episode 4 chapter 2 PHOTOGRAPHED IN PLAY — the shop by day, at closing time, lit, and the clearing — each view
   reached the way play reaches it (the bookmark applied once the chapter has booted, v9.3), the lens placed and the
   frame let settle (wall-clock eases), the page's errors counted. Views are `name:phase:x,y,z,yawDeg,pitchDeg`; the phase
   is a bookmark (`shop`, `night`, `night:hl,r`, `clearing:k,b,tA`, `decide`), or `-` to stay.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop [OUT=dir] [SETTLE=1500] [VIEWS='...;...'] node tools/probes/e4c2shots.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const SETTLE = +(process.env.SETTLE || 1500);
const OUT = (process.env.OUT || '/tmp/e4c2shots') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const DEF = [
  'day-spawn:shop:-0.25,1.62,-2.3,180,-6',
  'day-back:-:0.45,1.62,-2.5,150,-35',
  'day-door:-:0.2,1.62,-0.4,200,-4',
  'day-left:-:0.3,1.62,0.6,92,-8',
  'night-turn:night:-0.25,1.62,-2.55,180,-4',
  'night-near:-:0.9,1.62,0.9,200,4',
  'lit:night:hl,r:-0.25,1.62,-2.0,180,-6',
  'clear-stand:clearing:-0.95,1.62,1.25,-30,-21',
  'clear-kneel:clearing:k,b,tA,x:0,0.88,0.78,0,-6',
  'decide:decide:0,0.88,0.78,0,-6'
];
const VIEWS = (process.env.VIEWS ? process.env.VIEWS.split(';') : DEF).map(s => {
  const parts = s.split(':'); const name = parts[0], nums = parts[parts.length - 1].split(',').map(Number);
  const phase = parts.slice(1, -1).join(':');
  return { name, phase, x: nums[0], y: nums[1], z: nums[2], yaw: nums[3], pitch: nums[4] };
});
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=e4c2', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(6000);                                         // the chapter's first frames (v9.3)
const frames = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
for (const v of VIEWS) {
  if (v.phase && v.phase !== '-') {
    await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), v.phase);
    await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 300 });
    await frames(4); await p.waitForTimeout(2500);
  }
  await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180;
    E.yaw.position.set(v.x, v.y, v.z); E.yaw.rotation.y = v.yaw * d; E.pitch.rotation.x = v.pitch * d; }, v);
  await frames(3);
  if (SETTLE) await p.waitForTimeout(SETTLE);
  await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180;           // (again: a phase's own placing may have moved him)
    E.yaw.position.set(v.x, v.y, v.z); E.yaw.rotation.y = v.yaw * d; E.pitch.rotation.x = v.pitch * d; }, v);
  await frames(3);
  const s = await p.evaluate(() => { const E = window.__enc, S = E.stage;
    return { st: E.getState(), phase: S.phase, info: S.info ? S.info() : null,
             cast: S.castInfo ? Object.fromEntries(Object.entries(S.castInfo()).map(([k, c]) => [k, c && { ready: c.ready, vis: c.vis, pos: c.pos }])) : null }; });
  await p.screenshot({ path: `${OUT}/${v.name}.jpg`, quality: 72, timeout: 240000 });
  console.log(el(), v.name, JSON.stringify(s).slice(0, 600));
}
console.log(el(), 'errs', JSON.stringify(errs));
await b.close();
