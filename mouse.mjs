import { chromium, devices } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const b = await chromium.launch(LAUNCH);

async function trial(label, ctxOpts, blockLock){
  const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  if (blockLock) await p.addInitScript(() => {
    // simulate a host iframe that does not grant pointer-lock permission
    HTMLCanvasElement.prototype.requestPointerLock = function(){ throw new Error('blocked'); };
  });
  await p.goto(PAGE); await p.waitForTimeout(2500);
  await p.click('#startBtn'); await p.waitForTimeout(700);
  const before = await p.evaluate(()=>window.__enc.yaw.rotation.y);

  // drag-to-look: press, move, release
  await p.mouse.move(700, 400);
  await p.mouse.down();
  for (let i=0;i<8;i++){ await p.mouse.move(700 - i*22, 400); await p.waitForTimeout(45); }
  await p.mouse.up();
  await p.waitForTimeout(500);
  const after = await p.evaluate(()=>window.__enc.yaw.rotation.y);

  // and confirm it stops when the button is released
  await p.mouse.move(300, 400); await p.waitForTimeout(400);
  const idle = await p.evaluate(()=>window.__enc.yaw.rotation.y);

  console.log(`${label.padEnd(24)} turned: ${(after-before).toFixed(4)} rad` +
              `   drift after release: ${(idle-after).toFixed(4)}` +
              `   hint: "${await p.$eval('#hintTxt',e=>e.textContent)}"` +
              `   errors: ${errs.length?errs[0]:'none'}`);
  await ctx.close();
}

await trial('desktop, lock allowed', {viewport:{width:1280,height:760}});
await trial('desktop, lock BLOCKED', {viewport:{width:1280,height:760}}, true);
await trial('touch laptop, blocked', {viewport:{width:1280,height:760}, hasTouch:true}, true);
await trial('phone', {...devices['iPhone 13']});
await b.close();
