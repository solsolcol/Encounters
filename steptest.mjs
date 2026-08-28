/* Opening the decision, leaving it, and opening it again.

   Nothing opens by itself: the heap is the only way in. So the first check is
   that standing right next to it, doing nothing, leaves the panel shut.      */
import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [label, opts] of [['desktop',{viewport:{width:1280,height:760}}],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(3500);
await (label==='phone' ? p.tap('#startBtn') : p.click('#startBtn')); await p.waitForTimeout(3000);
// the chapter card holds the screen for about four seconds after Start;
// wait for the game to actually be playable rather than for a stopwatch
await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                        null, { timeout: 90000, polling: 120 });

const open = () => p.$eval('#decide', e=>!e.classList.contains('hide'));
const st   = () => p.evaluate(()=>window.__enc.getState());
// Face the heap as well as stand near it. A portrait phone sees about 37
// degrees across, so a target a step off the centre line is simply not on
// screen — and then there is nothing to tap.
const put  = (x,z) => p.evaluate(([x,z])=>{ const e=window.__enc;
  e.yaw.position.set(x,1.62,z);
  e.yaw.rotation.y = Math.atan2(-(e.PILE_POS.x - x), -(e.PILE_POS.z - z));
  e.yaw.updateMatrixWorld(true); }, [x,z]);
// act on the heap the way a player would, not through the debug hook
const act = async () => {
  if (label === 'phone') {
    const h = await p.evaluate(()=>{ const n=window.__enc.pileScreen();
      return { x:(n.x*.5+.5)*innerWidth, y:(-n.y*.5+.5)*innerHeight }; });
    await p.touchscreen.tap(Math.round(h.x), Math.round(h.y));
  } else {
    await p.keyboard.press('KeyE');
  }
  await p.waitForTimeout(2500);
};
const out = {};

// standing right on top of it, doing nothing at all
await put(-1, -3.6); await p.waitForTimeout(3500);
out.stayShutUntilYouAct = !(await open());

await act();
out.opensWhenYouAct = await open();

await (label==='phone' ? p.tap('#stepBack') : p.click('#stepBack')); await p.waitForTimeout(2500);
out.closesOnStepBack = !(await open());
out.stateAfterClose = await st();

await p.waitForTimeout(3000);                               // still standing there
out.staysClosedWhileNear = !(await open());

await put(-1, 3.0); await p.waitForTimeout(3000);           // walk right away
out.staysClosedAwayFromIt = !(await open());

await put(-1, -3.6); await p.waitForTimeout(3000);          // and back in
out.stillShutOnReturn = !(await open());
await act();
out.reopensWhenYouActAgain = await open();

// Escape closes it too (desktop only — no key on a phone)
if (label === 'desktop') {
  await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  out.escapeCloses = !(await open());
  await act();
}
// and the choices still work afterwards
await p.waitForTimeout(1500);
await (label==='phone' ? p.tap('#choices .choice') : p.click('#choices .choice'));
await p.waitForTimeout(3000);
out.choiceStillWorks = await p.$eval('#result', e=>!e.classList.contains('hide'));

console.log(label.padEnd(8), JSON.stringify(out), '| errors:', errs.length?errs:'none');
await ctx.close();
}
await b.close();
