import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const b = await chromium.launch(LAUNCH);
const p = await b.newPage({viewport:{width:480,height:320}});
p.on('pageerror',e=>console.log('ERR',e.message));
// the page is 4.5 MB and two of these run at once on a two-core box;
// the default 30 s navigation timeout is not enough for that
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto(PAGE); await p.waitForTimeout(3000);
await p.click('#startBtn'); await p.waitForTimeout(900);
// the chapter card holds the screen for about four seconds after Start;
// wait for the game to actually be playable rather than for a stopwatch
await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                        null, { timeout: 90000, polling: 120 });

// step the motion system on a fixed clock, independent of render speed
const run = (frames, speed, strafe, lx, ly) => p.evaluate(a => {
  const [n, speed, strafe, lx, ly] = a, e = window.__enc, dt = 1/60, out = [];
  for (let i = 0; i < n; i++) {
    e.updateViewmodel(dt, i*dt, speed, strafe, lx, ly);
    out.push([e.handsRoot.position.x, e.handsRoot.position.y,
              e.handsRoot.rotation.y, e.handsRoot.rotation.z]);
  }
  return out;
}, [frames, speed, strafe, lx, ly]);

const amp = a => [0,1,2,3].map(i =>
  +(Math.max(...a.map(r=>r[i])) - Math.min(...a.map(r=>r[i]))).toFixed(4));

console.log('idle 3s (breathing only) x,y,yaw,roll:', amp(await run(180, 0.02, 0, 0, 0)));
console.log('walk 3s @2.5 m/s        x,y,yaw,roll:', amp(await run(180, 2.5,  0, 0, 0)));
console.log('run  3s @4.4 m/s        x,y,yaw,roll:', amp(await run(180, 4.4,  0, 0, 0)));
console.log('strafing right          x,y,yaw,roll:', amp(await run(90, 2.5, 1, 0, 0)));

// look-lag: turn hard, then let go and check it recovers
await run(60, 0, 0, 0, 0);
const turning = await run(30, 0, 0, -0.02, 0);
const settling = await run(120, 0, 0, 0, 0);
console.log('sway peak while turning :', +Math.max(...turning.map(r=>Math.abs(r[0]))).toFixed(4));
console.log('sway after 2s of no turn:', +Math.abs(settling.at(-1)[0]).toFixed(5));
await b.close();
