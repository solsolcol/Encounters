/* The pile of hell notes as an interactable: highlight, prompt, key, tap. */
import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});

for (const [label, opts] of [['desktop',{viewport:{width:520,height:360}}],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(3500);
await (label==='phone' ? p.tap('#startBtn') : p.click('#startBtn')); await p.waitForTimeout(3000);
// the chapter card holds the screen for about four seconds after Start;
// wait for the game to actually be playable rather than for a stopwatch
await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                        null, { timeout: 90000, polling: 120 });

const shown = id => p.$eval('#'+id, e=>!e.classList.contains('hide'));
const put = (x,z,ry=0) => p.evaluate(([x,z,ry])=>{ const e=window.__enc;
  e.yaw.position.set(x,1.62,z); e.yaw.rotation.y=ry; }, [x,z,ry]);
const out = {};

// far away: no highlight, no prompt
await put(0, 12); await p.waitForTimeout(3000);
out.glowFar = +(await p.evaluate(()=>window.__enc.pileGlow())).toFixed(3);
out.promptFar = await shown('interact');

// close and facing it, but not yet inside the burner's own trigger, so the
// panel is not open and the prompt has the screen to itself
await put(0.5, -1.6); await p.waitForTimeout(3000);
out.glowNear = +(await p.evaluate(()=>window.__enc.pileGlow())).toFixed(3);
out.promptNear = await shown('interact');
out.burningPromptHidden = !(await shown('prompt'));
out.promptText = (await p.$eval('#interact .ibadge', e=>e.textContent)).replace(/\s+/g,' ').trim();

// facing away: prompt goes, highlight stays (it is a world object)
await put(0.5, -1.6, Math.PI); await p.waitForTimeout(3000);
out.promptFacingAway = await shown('interact');
out.glowFacingAway = +(await p.evaluate(()=>window.__enc.pileGlow())).toFixed(3) > 0;

// dismiss whatever is open, then act on the pile
await put(0.2, -3.4, 0); await p.waitForTimeout(2500);
await p.evaluate(()=>window.__enc.dismissDecision()); await p.waitForTimeout(2000);
out.closedBeforeAct = !(await shown('decide'));

if (label === 'desktop') {
  await p.keyboard.press('KeyE'); await p.waitForTimeout(2000);
  out.eOpensIt = await shown('decide');
  out.eDidNotPickAChoice = !(await shown('result'));
} else {
  const hit = await p.evaluate(()=>{ const n = window.__enc.pileScreen();
    return { x:(n.x*0.5+0.5)*innerWidth, y:(-n.y*0.5+0.5)*innerHeight, z:n.z }; });
  out.pileOnScreen = hit.z < 1;
  await p.touchscreen.tap(Math.round(hit.x), Math.round(hit.y)); await p.waitForTimeout(2500);
  out.tapOpensIt = await shown('decide');
  out.tapDidNotPickAChoice = !(await shown('result'));
}

// and it does not fire from across the deck
await p.evaluate(()=>window.__enc.dismissDecision()); await p.waitForTimeout(2000);
await put(0, 12); await p.waitForTimeout(2500);
out.actFromAfarRefused = await p.evaluate(()=>window.__enc.interactPile()) === false;

// the step-back button is red with white text
const css = await p.evaluate(()=>{ const s=getComputedStyle(document.getElementById('stepBack'));
  return { bg:s.backgroundColor, fg:s.color }; });
out.stepBackColours = css;

console.log(label.padEnd(8), JSON.stringify(out, null, 0));
console.log('   errors:', errs.length?errs:'none');
await ctx.close();
}
await b.close();
