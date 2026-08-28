import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
const ctx = await b.newContext({ ...devices['iPhone 13'] });
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(2000);
await p.screenshot({path:'m1-title.png'});
console.log('touch detected:', await p.evaluate(()=>matchMedia('(pointer: coarse)').matches));
await p.tap('#startBtn'); await p.waitForTimeout(600);
await p.evaluate(()=>{ window.__enc.yaw.position.set(1.4,1.62,5.4); window.__enc.yaw.rotation.y=0.3; });
await p.waitForTimeout(2200); await p.screenshot({path:'m2-world.png'});
await p.evaluate(()=>{ window.__enc.yaw.position.set(-1.2,1.62,3.0); });
await p.touchscreen.tap(60,600); await p.waitForTimeout(300);
// nudge trigger by walking
await p.evaluate(()=>{ window.__enc.yaw.position.set(-2.0,1.62,2.6); });
await p.waitForTimeout(1600); await p.screenshot({path:'m3-decide.png'});
console.log('decide visible:', await p.$eval('#decide',e=>!e.classList.contains('hide')));
console.log('errors:', errs.length?errs:'none');
await b.close();
