import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [name, opts] of [['phone', devices['iPhone 13']], ['desktop', {viewport:{width:1440,height:860}}]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  // the page is 4.5 MB and two of these run at once on a two-core box;
  // the default 30 s navigation timeout is not enough for that
  p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
  await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(1800);
  const fits = await p.evaluate(()=>{ const c=document.querySelector('#title .card');
    return { cardH:Math.round(c.scrollHeight), viewH:innerHeight, bodyOverflowX: document.documentElement.scrollWidth>innerWidth }; });
  await p.screenshot({path:`f-${name}-title.png`});
  // The headless renderer is software and this box is shared, so the first
  // seconds after start go on shader compilation rather than frames. Warm up
  // before timing anything, or the walk below measures the container.
  await (name==='phone'? p.tap('#startBtn') : p.click('#startBtn')); await p.waitForTimeout(4000);
  // the chapter card holds the screen for about four seconds after Start;
  // wait for the game to actually be playable rather than for a stopwatch
  await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                          null, { timeout: 90000, polling: 120 });
  await p.evaluate(()=>{ const e=window.__enc; e.yaw.position.set(1.4,1.62,6.0); e.yaw.rotation.y=0.26; });
  await p.waitForTimeout(2400); await p.screenshot({path:`f-${name}-world.png`});
  // Walk in until the heap is in reach, then act on it. Nothing opens by
  // itself any more, so reaching it and opening it are two separate checks.
  await p.evaluate(()=>{ window.__enc.yaw.position.set(-1.0,1.62,-1.5); });
  let reached=false;
  for(let i=0;i<300 && !reached;i++){ await p.keyboard.down('KeyW'); await p.waitForTimeout(250);
    reached = await p.evaluate(()=>window.__enc.pileDist() < window.__enc.INTERACT_R); }
  await p.keyboard.up('KeyW'); await p.waitForTimeout(900);
  const openedItself = await p.$eval('#decide',e=>!e.classList.contains('hide'));
  if (name === 'phone') {
    // a portrait phone sees about 37 degrees across, so aim at the heap first
    // or there is nothing on screen to tap
    await p.evaluate(()=>{ const e=window.__enc;
      e.yaw.rotation.y = Math.atan2(-(e.PILE_POS.x - e.yaw.position.x),
                                    -(e.PILE_POS.z - e.yaw.position.z));
      e.yaw.updateMatrixWorld(true); });
    await p.waitForTimeout(2000);
    const h = await p.evaluate(()=>{ const n=window.__enc.pileScreen();
      return { x:(n.x*.5+.5)*innerWidth, y:(-n.y*.5+.5)*innerHeight }; });
    await p.touchscreen.tap(Math.round(h.x), Math.round(h.y));
  } else {
    await p.keyboard.press('KeyE');
  }
  await p.waitForTimeout(2500);
  const fired = await p.$eval('#decide',e=>!e.classList.contains('hide'));
  await p.screenshot({path:`f-${name}-decide.png`});
  console.log(name, '| reached the heap:', reached, '| opened on its own:', openedItself,
              '| opened when acted on:', fired,
              '| title fits:', fits, '| errors:', errs.length?errs:'none');
  await ctx.close();
}
await b.close();
