/* The floating damage numbers, and the halved drain. */
import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [label, opts] of [['desktop',{viewport:{width:480,height:320}}],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
// the page is 4.5 MB and two of these run at once on a two-core box;
// the default 30 s navigation timeout is not enough for that
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(3500);
await (label==='phone' ? p.tap('#startBtn') : p.click('#startBtn')); await p.waitForTimeout(3000);
// the chapter card holds the screen for about four seconds after Start;
// wait for the game to actually be playable rather than for a stopwatch
await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                        null, { timeout: 90000, polling: 120 });
const out = {};

out.rates = await p.evaluate(()=>{
  const e = window.__enc, r = {};
  for(let i=0;i<300;i++) e.updateGhost(1/60);
  e.yaw.position.set(-1,1.62,-1.4); e.yaw.updateMatrixWorld(true);
  for(let i=0;i<300;i++) e.updateGhost(1/60);
  const at = d => { e.ghost.position.set(-1,0,-1.4-d); return +e.ghostDrainRate().toFixed(2); };
  r.at16m = at(16); r.at3m = at(3);
  return r;
});
out.halved = out.rates.at16m === 0.55 && out.rates.at3m === 2.5;

// stand in front of her and watch the numbers come off
await p.evaluate(()=>{ const e=window.__enc; e.yaw.position.set(-1,1.62,-1.4);
  e.yaw.updateMatrixWorld(true); for(let i=0;i<300;i++) e.updateGhost(1/60);
  e.ghost.position.set(-2.0,0,-4.0);
  window.__seen = 0;
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (n.textContent && /\d/.test(n.textContent)) { window.__seen++; window.__last = n.textContent; }
  }))).observe(document.getElementById('ticks'), { childList: true });
});
// This renderer manages about a frame a second, so simulated time crawls;
// give it long enough to bleed a whole point rather than assuming 60 fps.
await p.waitForTimeout(30000);
out.sanityNow = +(await p.evaluate(()=>window.__enc.stats.sanity)).toFixed(1);
out.lastTick = await p.evaluate(()=>window.__last || null);
out.ticksSeen = await p.evaluate(()=>window.__seen);
out.tickLooksRight = await p.evaluate(()=>{
  const el = document.createElement('span'); // sample the computed style of a tick
  document.getElementById('ticks').appendChild(el);
  const s = getComputedStyle(el);
  const r = { size: s.fontSize, colour: s.color };
  el.remove(); return r;
});
out.warning = (await p.$eval('#haunt .hbadge', e=>e.textContent)).replace(/\s+/g,' ').trim();
out.fonts = await p.evaluate(()=>({
  banner: getComputedStyle(document.querySelector('.hbadge')).fontFamily.split(',')[0],
  bannerSize: getComputedStyle(document.querySelector('.hbadge')).fontSize,
  statLabel: getComputedStyle(document.querySelector('.stat .n')).fontSize,
  statValue: getComputedStyle(document.querySelector('.stat .v')).fontSize,
  choice: getComputedStyle(document.querySelector('.choice')).fontSize,
  prompt: getComputedStyle(document.querySelector('.ibadge')).fontSize }));
// the banner must not sit on top of the stat block
out.bannerClearsHud = await p.evaluate(()=>{
  const h = document.querySelector('.hbadge').getBoundingClientRect();
  const s = document.getElementById('stats').getBoundingClientRect();
  return h.top >= s.bottom - 1 || h.left >= s.right - 1;
});
console.log(label.padEnd(8), JSON.stringify(out));
console.log('   errors:', errs.length?errs:'none');
await ctx.close();
}
await b.close();
