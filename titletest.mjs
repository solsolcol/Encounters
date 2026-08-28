/* The title screen's logo, the button, and the chapter card on the way in. */
import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [label, opts] of [['desktop',{viewport:{width:1280,height:860}}],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(4000);
const out = {};

// the logo actually painted — check the canvas has non-transparent pixels
out.logo = await p.evaluate(()=>{
  const c = document.getElementById('logo');
  if (!c) return 'canvas gone (fell back to the heading)';
  const g = c.getContext('2d');
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let lit = 0;
  for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 8) lit++;
  return { w: c.width, h: c.height, litSamples: lit,
           cssWidth: Math.round(c.getBoundingClientRect().width) };
});
out.headingHidden = await p.$eval('#title h1', e=>e.classList.contains('hide'))
                    .catch(()=>'no heading element');
out.startLabel = (await p.$eval('#startBtn', e=>e.textContent)).trim();

// Watch for the exact moment the title screen is taken away, and record how
// opaque the black was right then. If that is ever below 1 the player gets a
// flash of the scene between the two screens.
await p.evaluate(()=>{
  const t = document.getElementById('title'), c = document.getElementById('chapter');
  window.__cover = null;
  new MutationObserver(() => {
    if (window.__cover === null && t.classList.contains('hide'))
      window.__cover = +getComputedStyle(c).opacity;
  }).observe(t, { attributes: true, attributeFilter: ['class'] });
});

// the card: black, then the words, then gone
await (label==='phone' ? p.tap('#startBtn') : p.click('#startBtn'));
// wait for the black to actually arrive rather than for a stopwatch — this
// renderer's frames are far apart and the fade is frame-driven
await p.waitForFunction(
  ()=>+getComputedStyle(document.getElementById('chapter')).opacity > 0.9,
  null, { timeout: 30000, polling: 80 });
out.blackWhenTitleWentAway = await p.evaluate(()=>window.__cover);
out.cardUp = await p.evaluate(()=>{
  const c = document.getElementById('chapter');
  return { shown: !c.classList.contains('hide'),
           opacity: +getComputedStyle(c).opacity,
           text: c.textContent.replace(/\s+/g,' ').trim(),
           bg: getComputedStyle(c).backgroundColor };
});
out.stateDuringCard = await p.evaluate(()=>window.__enc.getState());
out.hudHiddenDuringCard = await p.$eval('#hud', e=>e.classList.contains('hide'));
if (label === 'desktop') await p.screenshot({path:'t2-card.png'});

await p.waitForTimeout(5200);
out.cardGone = await p.$eval('#chapter', e=>e.classList.contains('hide'));
out.stateAfter = await p.evaluate(()=>window.__enc.getState());
out.hudShownAfter = !(await p.$eval('#hud', e=>e.classList.contains('hide')));
// and the player did not drift while the card was up
out.stillAtSpawn = await p.evaluate(()=>Math.abs(window.__enc.yaw.position.z - 17) < 0.01);

console.log(label.padEnd(8), JSON.stringify(out));
console.log('   errors:', errs.length?errs:'none');
await ctx.close();
}
await b.close();
