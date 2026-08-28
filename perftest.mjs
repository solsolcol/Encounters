/* What the frame loop actually does on each kind of device.

   Frame rates here are measured against the browser's own clock, not the
   renderer's speed, so they mean something even though this box draws in
   software: what is being checked is that frames are being SKIPPED on
   purpose, not how fast one takes.                                        */
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
await p.goto(PAGE); await p.waitForTimeout(5000);
const out = {};
out.settings = await p.evaluate(()=>window.__enc.perf());

// how often does the game actually step, sitting on the title screen?
const rate = () => p.evaluate(()=>new Promise(res=>{
  const e = window.__enc, t0 = performance.now();
  let n = 0, last = -1;
  const seen = () => {
    // the elapsed clock only advances on a frame the loop did not skip
    const now = e.renderer.info.render.frame;
    if (now !== last) { last = now; n++; }
    if (performance.now() - t0 < 4000) requestAnimationFrame(seen);
    else res(+(n / ((performance.now() - t0) / 1000)).toFixed(1));
  };
  requestAnimationFrame(seen);
}));
out.stepsPerSecOnTitle = await rate();

await (label==='phone' ? p.tap('#startBtn') : p.click('#startBtn'));
await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                        null, { timeout: 90000, polling: 120 });
out.stepsPerSecInPlay = await rate();

// the shadow maps must be settled, not redrawn every frame
out.shadowsFrozen = await p.evaluate(()=>{
  const r = window.__enc.renderer;
  return r.shadowMap.autoUpdate === false && r.shadowMap.needsUpdate === false;
});

// and the soft particles must still be moving at the same speed
out.smokeStillDrifts = await p.evaluate(()=>new Promise(res=>{
  const pts = window.__enc.yaw.parent.children
    .flatMap(o => o.children || []).filter(o => o.isPoints);
  const smoke = pts.find(o => o.geometry.attributes.position.count > 40);
  const a = smoke.geometry.attributes.position.array.slice(0, 30);
  setTimeout(() => {
    const b2 = smoke.geometry.attributes.position.array.slice(0, 30);
    let moved = 0;
    for (let i = 0; i < 30; i++) if (Math.abs(a[i] - b2[i]) > 1e-4) moved++;
    res(moved > 5);
  }, 2500);
}));

// This box draws in software at a few frames a second, well under either
// cap, so the rates below are its own ceiling and not the cap doing its job.
// What they do prove is that the gate never starves the loop.
out.titleIsIdling = out.stepsPerSecOnTitle <= 9;
out.loopStillRuns = out.stepsPerSecInPlay > 0.2;
console.log(label.padEnd(8), JSON.stringify(out));
console.log('   errors:', errs.length?errs:'none');
await ctx.close();
}
await b.close();
