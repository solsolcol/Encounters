/* Walking it again.

   Both end screens now restart the chapter in place instead of reloading the
   page. So the two things to prove are that the page really did NOT reload
   (a sentinel dropped on window has to survive), and that what comes back is
   a genuinely fresh run: fresh numbers, back on the grass, her gone, the
   black cleared, and the heap still openable.                              */
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });

const openPage = async () => {
  const p = await b.newPage({ viewport: { width: 500, height: 340 } });
  p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(90000);
  await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(4000);
  await p.click('#startBtn');
  await p.waitForFunction(() => window.__enc && window.__enc.getState() === 'play',
                          null, { timeout: 90000, polling: 120 });
  return p;
};

// stand at the heap and open the decision, the way a player would
const goToPile = async p => {
  await p.evaluate(() => { const e = window.__enc;
    e.yaw.position.set(-0.4, 1.62, -3.4);
    e.yaw.rotation.y = Math.atan2(-(e.PILE_POS.x + 0.4), -(e.PILE_POS.z + 3.4));
    e.yaw.updateMatrixWorld(true);
    for (let k = 0; k < 300; k++) e.updateGhost(1 / 60); });
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.__enc.interactPile());
  await p.waitForTimeout(1200);                        // clear the stray-tap guard
};

const stateOf = p => p.evaluate(() => ({
  state: window.__enc.getState(),
  ...window.__enc.stats,
  cam: window.__enc.yaw.position.toArray().map(v => +v.toFixed(2)),
  yawRot: +window.__enc.yaw.rotation.y.toFixed(3),
  reveal: window.__enc.getReveal(),
  fade: +getComputedStyle(document.getElementById('cineFade')).opacity,
  panic: +getComputedStyle(document.getElementById('panic')).opacity,
  hudUp: !document.getElementById('hud').classList.contains('hide'),
  completeUp: !document.getElementById('complete').classList.contains('hide'),
  overUp: !document.getElementById('over').classList.contains('hide'),
  resultUp: !document.getElementById('result').classList.contains('hide'),
  survived: window.__noReload === true,
}));

/* ---- the finished-the-chapter path: result -> complete -> walk it again */
{
  const p = await openPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = { path: 'complete' };
  await goToPile(p);
  await p.click('#choices .choice:nth-child(1)');       // pick up: costs sanity, ends black
  await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 30000, polling: 100 });
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.__enc.cine.skip());
  await p.waitForTimeout(900);
  await p.click('#nextBtn');                            // close the file -> complete screen
  await p.waitForTimeout(800);
  const end = await stateOf(p);
  out.reachedComplete = end.state === 'complete' && end.completeUp;
  out.spentSomething = end.sanity < 100;

  await p.evaluate(() => { window.__noReload = true; });
  await p.click('#againBtn');
  await p.waitForTimeout(1500);
  const r = await stateOf(p);
  out.noReload = r.survived;                            // the sentinel is still there
  out.playing = r.state === 'play';
  out.screensDown = !r.completeUp && !r.resultUp && !r.overUp;
  out.hudBack = r.hudUp;
  out.statsReset = r.sanity === 100 && r.awareness === 50 && r.wisdom === 50;
  out.backAtSpawn = r.cam[0] === 0 && r.cam[2] === 17 && Math.abs(r.yawRot) < 0.001;
  out.ghostGone = r.reveal === 0;
  out.blackCleared = r.fade < 0.05 && r.panic < 0.05;

  // and it is really playable again, not just showing a HUD
  await goToPile(p);
  out.decisionOpensAgain = await p.$eval('#decide', e => !e.classList.contains('hide'));
  out.choosableAgain = await p.evaluate(() => window.__enc.getState() === 'decide');
  console.log(JSON.stringify(out), '| errors:', errs.length ? errs : 'none');
  await p.close();
}

/* ---- the lost-your-nerve path: sanity to zero -> walk it again */
{
  const p = await openPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = { path: 'lost' };
  // stand in front of her and let it run out
  await p.evaluate(() => { const e = window.__enc;
    e.yaw.position.set(-1.6, 1.62, -9.5);
    e.yaw.updateMatrixWorld(true);
    e.stats.sanity = 3; });
  await p.waitForFunction(() => window.__enc.getState() === 'lost',
                          null, { timeout: 90000, polling: 200 });
  const end = await stateOf(p);
  out.reachedOver = end.overUp;
  out.vignetteFull = end.panic > 0.9;

  await p.evaluate(() => { window.__noReload = true; });
  await p.click('#retryBtn');
  await p.waitForFunction(() => window.__enc.getState() === 'play',
                          null, { timeout: 60000, polling: 100 });
  await p.waitForTimeout(1500);
  const r = await stateOf(p);
  out.noReload = r.survived;
  out.playing = r.state === 'play';
  out.screensDown = !r.overUp && !r.completeUp;
  out.hudBack = r.hudUp;
  out.statsReset = r.sanity === 100 && r.awareness === 50 && r.wisdom === 50;
  out.backAtSpawn = r.cam[0] === 0 && r.cam[2] === 17;
  out.ghostGone = r.reveal === 0;
  out.vignetteCleared = r.panic < 0.05;
  out.drainCanRun = await p.evaluate(() => typeof window.__enc.ghostDrainRate() === 'number');

  await goToPile(p);
  out.decisionOpensAgain = await p.$eval('#decide', e => !e.classList.contains('hide'));
  console.log(JSON.stringify(out), '| errors:', errs.length ? errs : 'none');
  await p.close();
}
await b.close();
