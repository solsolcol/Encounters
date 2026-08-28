import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [name, opts] of [['phone', devices['iPhone 13']], ['desktop', {viewport:{width:1440,height:860}}]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(1800);
  const fits = await p.evaluate(()=>{ const c=document.querySelector('#title .card');
    return { cardH:Math.round(c.scrollHeight), viewH:innerHeight, bodyOverflowX: document.documentElement.scrollWidth>innerWidth }; });
  await p.screenshot({path:`f-${name}-title.png`});
  await (name==='phone'? p.tap('#startBtn') : p.click('#startBtn')); await p.waitForTimeout(400);
  await p.evaluate(()=>{ const e=window.__enc; e.yaw.position.set(1.4,1.62,6.0); e.yaw.rotation.y=0.26; });
  await p.waitForTimeout(2400); await p.screenshot({path:`f-${name}-world.png`});
  // walk in until the decision fires
  await p.evaluate(()=>{ window.__enc.yaw.position.set(-1.0,1.62,-1.5); });
  let fired=false;
  for(let i=0;i<130 && !fired;i++){ await p.keyboard.down('KeyW'); await p.waitForTimeout(250);
    fired = await p.$eval('#decide',e=>!e.classList.contains('hide')); }
  await p.keyboard.up('KeyW'); await p.waitForTimeout(900);
  await p.screenshot({path:`f-${name}-decide.png`});
  console.log(name, '| decision fired:', fired, '| title fits:', fits, '| errors:', errs.length?errs:'none');
  await ctx.close();
}
await b.close();
