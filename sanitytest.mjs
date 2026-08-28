/* Sanity drains while she is there, harder up close, and running out ends it. */
import { chromium, devices } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const b = await chromium.launch(LAUNCH);
for (const [label, opts] of [['desktop',{viewport:{width:480,height:320}}],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
// the page is 4.5 MB and two of these run at once on a two-core box;
// the default 30 s navigation timeout is not enough for that
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto(PAGE); await p.waitForTimeout(3500);
await (label==='phone' ? p.tap('#startBtn') : p.click('#startBtn')); await p.waitForTimeout(3000);
// the chapter card holds the screen for about four seconds after Start;
// wait for the game to actually be playable rather than for a stopwatch
await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                        null, { timeout: 90000, polling: 120 });

const shown = id => p.$eval('#'+id, e=>!e.classList.contains('hide'));
const out = {};

// The drain rate is a pure function of where everyone is, so it can be read
// off directly rather than waiting on a 1 fps software renderer.
out.rates = await p.evaluate(()=>{
  const e = window.__enc, r = {};
  const settle = ()=>{ for(let i=0;i<300;i++) e.updateGhost(1/60); };
  // she is not there at all until you are near the burner
  e.yaw.position.set(0,1.62,17); e.yaw.updateMatrixWorld(true); settle();
  r.hiddenAtSpawn = +e.ghostDrainRate().toFixed(2);
  // now inside, fully revealed. Read the rate straight off her position
  // rather than stepping her, so each figure is the distance it says it is.
  e.yaw.position.set(-1,1.62,-1.4); e.yaw.updateMatrixWorld(true); settle();
  const at = d => { e.ghost.position.set(-1, 0, -1.4 - d);
                    return +e.ghostDrainRate().toFixed(2); };
  r.at16m = at(16); r.at10m = at(10); r.at6m = at(6); r.at3m = at(3);
  return r;
});
out.risesAsSheCloses = out.rates.at16m < out.rates.at10m
                    && out.rates.at10m < out.rates.at6m
                    && out.rates.at6m < out.rates.at3m;
out.zeroBeforeSheAppears = out.rates.hiddenAtSpawn === 0;

// the banner, the beating bar, and the vignette
// Stood in the deck with her right there, but not close enough to the burner
// for the decision to open on its own — so what is measured is the drain.
await p.evaluate(()=>{ const e=window.__enc; e.yaw.position.set(-1,1.62,-1.4);
  e.yaw.updateMatrixWorld(true);
  for(let i=0;i<300;i++) e.updateGhost(1/60);
  e.ghost.position.set(-2.0,0,-4.0); });
await p.waitForTimeout(3500);
out.bannerUp = await shown('haunt');
out.bannerText = (await p.$eval('#haunt .hbadge', e=>e.textContent)).replace(/\s+/g,' ').trim();
out.barBeats = await p.$eval('#bSan', e=>e.classList.contains('drain'));
out.sanityFalling = await p.evaluate(()=>window.__enc.stats.sanity) < 100;

// the drain stops while the decision is open — the choices are not timed
await p.evaluate(()=>window.__enc.interactPile()); await p.waitForTimeout(1200);
const s1 = await p.evaluate(()=>window.__enc.stats.sanity);
await p.waitForTimeout(3500);
const s2 = await p.evaluate(()=>window.__enc.stats.sanity);
out.frozenWhileDeciding = Math.abs(s2 - s1) < 0.01;
out.bannerDownWhileDeciding = !(await shown('haunt'));

// and running out ends the game
await p.evaluate(()=>{ window.__enc.dismissDecision(); window.__enc.stats.sanity = 0.4; });
// the renderer here manages about a frame a second, so wait for the state
// rather than for a stopwatch — reading mid-frame is what makes this flaky
for (let i = 0; i < 30; i++) {
  if (await p.evaluate(()=>window.__enc.getState()) === 'lost') break;
  await p.waitForTimeout(1000);
}
out.state = await p.evaluate(()=>window.__enc.getState());
out.lostScreen = await shown('over');
out.hudHidden = !(await shown('hud'));
out.retryButton = await p.$eval('#retryBtn', e=>e.textContent.trim());

console.log(label.padEnd(8), JSON.stringify(out));
console.log('   errors:', errs.length?errs:'none');
await ctx.close();
}
await b.close();
