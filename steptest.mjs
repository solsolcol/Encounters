/* Walking away from the decision and walking back into it. */
import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [label, opts] of [['desktop',{viewport:{width:1280,height:760}}],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(3500);
await (label==='phone' ? p.tap('#startBtn') : p.click('#startBtn')); await p.waitForTimeout(3000);

const open = () => p.$eval('#decide', e=>!e.classList.contains('hide'));
const st   = () => p.evaluate(()=>window.__enc.getState());
const put  = (x,z) => p.evaluate(([x,z])=>{ const e=window.__enc; e.yaw.position.set(x,1.62,z); }, [x,z]);
const out = {};

await put(-1, -4.6); await p.waitForTimeout(3000);          // inside 4.5 m
out.opensOnApproach = await open();

await (label==='phone' ? p.tap('#stepBack') : p.click('#stepBack')); await p.waitForTimeout(2000);
out.closesOnStepBack = !(await open());
out.stateAfterClose = await st();

await p.waitForTimeout(3000);                              // still standing there
out.staysClosedWhileNear = !(await open());

await put(-1, 3.0); await p.waitForTimeout(3000);           // walk out past 7.5 m
out.staysClosedAwayFromIt = !(await open());

await put(-1, -4.6); await p.waitForTimeout(3000);          // and back in
out.reopensOnReturn = await open();

// Escape closes it too (desktop only — no key on a phone)
if (label === 'desktop') {
  await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  out.escapeCloses = !(await open());
}
// and the choices still work afterwards
await put(-1, 3.0); await p.waitForTimeout(3000);
await put(-1, -4.6); await p.waitForTimeout(3000);
await (label==='phone' ? p.tap('#choices .choice') : p.click('#choices .choice'));
await p.waitForTimeout(3000);
out.choiceStillWorks = await p.$eval('#result', e=>!e.classList.contains('hide'));

console.log(label.padEnd(8), JSON.stringify(out), '| errors:', errs.length?errs:'none');
await ctx.close();
}
await b.close();
