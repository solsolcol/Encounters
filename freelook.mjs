import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
const ctx = await b.newContext({viewport:{width:1280,height:760}});
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
// simulate a host that refuses pointer lock — the case we are fixing
await p.addInitScript(()=>{ HTMLCanvasElement.prototype.requestPointerLock =
  function(){ throw new Error('blocked'); }; });
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(2500);
await p.click('#startBtn'); await p.waitForTimeout(700);
const Y = () => p.evaluate(()=>window.__enc.yaw.rotation.y);
const P = () => p.evaluate(()=>window.__enc.yaw.children[0].rotation.x);

// 1. move the mouse with NO button held
await p.mouse.move(640, 380); await p.waitForTimeout(250);
let a = await Y();
for (let i=1;i<=8;i++){ await p.mouse.move(640 - i*20, 380); await p.waitForTimeout(45); }
await p.waitForTimeout(300);
console.log('move, no button held  :', (await Y() - a).toFixed(4), 'rad');

// 2. vertical
a = await P();
for (let i=1;i<=6;i++){ await p.mouse.move(480, 380 - i*18); await p.waitForTimeout(45); }
await p.waitForTimeout(250);
console.log('vertical look         :', (await P() - a).toFixed(4), 'rad');

// 3. park at the left edge and hold: should keep turning
await p.mouse.move(8, 380); await p.waitForTimeout(150);
a = await Y(); await p.waitForTimeout(1400);
console.log('held at left edge     :', (await Y() - a).toFixed(4), 'rad over 1.4s');

// 4. same at the right edge, opposite direction
await p.mouse.move(1272, 380); await p.waitForTimeout(150);
a = await Y(); await p.waitForTimeout(1400);
console.log('held at right edge    :', (await Y() - a).toFixed(4), 'rad over 1.4s');

// 5. with the decision panel open the camera must NOT follow the cursor
await p.mouse.move(640, 380);
await p.evaluate(()=>{ window.__enc.yaw.position.set(-2.0,1.62,2.0); });
await p.keyboard.down('KeyW'); await p.waitForTimeout(2500); await p.keyboard.up('KeyW');
await p.waitForTimeout(800);
const open = await p.$eval('#decide', e=>!e.classList.contains('hide'));
a = await Y();
for (let i=1;i<=8;i++){ await p.mouse.move(640 - i*40, 500); await p.waitForTimeout(45); }
await p.waitForTimeout(400);
console.log('panel open, cursor moved:', (await Y() - a).toFixed(4), 'rad  (panel open:', open, ')');
console.log('errors:', errs.length?errs:'none');
await b.close();
