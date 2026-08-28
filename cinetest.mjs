/* The cutscenes: each choice plays a scene, the scene can be skipped, and
   the world comes back exactly once with the numbers applied.

   Everything runs through the real UI — the choice buttons themselves — and
   the scene is then skipped, because at one software frame a second nobody
   waits out four eight-second films. One scene (Leave it, the shortest) is
   also allowed to finish on its own clock, to prove natural completion.    */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const b = await chromium.launch(LAUNCH);

const EXPECT = [                       // sanity/awareness/wisdom deltas per choice
  { d: [-20, -10, -15], fadeDark: true,  ghostGone: false },
  { d: [-30, -15, -25], fadeDark: true,  ghostGone: false },
  { d: [5, 25, 15],     fadeDark: true,  ghostGone: false },
  { d: [15, 15, 25],    fadeDark: false, ghostGone: true },
];

for (let i = 0; i < 4; i++) {
  const p = await b.newPage({ viewport: { width: 500, height: 340 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(90000);
  await p.goto(PAGE); await p.waitForTimeout(4000);
  await p.click('#startBtn');
  await p.waitForFunction(() => window.__enc && window.__enc.getState() === 'play',
                          null, { timeout: 90000, polling: 120 });
  const out = { choice: 'ABCD'[i] };

  // walk up and open the decision for real
  await p.evaluate(() => { const e = window.__enc;
    e.yaw.position.set(-0.4, 1.62, -3.4);
    e.yaw.rotation.y = Math.atan2(-(e.PILE_POS.x + 0.4), -(e.PILE_POS.z + 3.4));
    e.yaw.updateMatrixWorld(true);
    for (let k = 0; k < 300; k++) e.updateGhost(1 / 60); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.__enc.interactPile());
  await p.waitForTimeout(1200);                       // clear the stray-tap guard
  const before = await p.evaluate(() => ({ ...window.__enc.stats,
    cam: window.__enc.yaw.position.toArray().map(v => +v.toFixed(3)) }));

  await p.click(`#choices .choice:nth-child(${i + 1})`);
  await p.waitForFunction(() => window.__enc.getState() === 'cine',
                          null, { timeout: 30000, polling: 100 });
  out.sceneStarts = true;
  out.letterboxOn = await p.evaluate(() => document.body.classList.contains('cine'));
  out.hudHidden = await p.$eval('#hud', e => e.classList.contains('hide'));
  out.duration = await p.evaluate(() => +window.__enc.cine.dur().toFixed(1));
  // numbers must NOT be applied yet — the scene comes first
  out.deltasWaitForScene = await p.evaluate(
    (b2) => window.__enc.stats.sanity === b2.sanity, before);

  if (i === 2) {                                      // let this one play out
    await p.waitForFunction(() => window.__enc.getState() === 'result',
                            null, { timeout: 120000, polling: 200 });
    out.finishedOnItsOwn = true;
  } else {
    await p.waitForTimeout(1500);
    await p.evaluate(() => window.__enc.cine.skip());
    await p.waitForTimeout(800);
  }

  out.cardShown = await p.$eval('#result', e => !e.classList.contains('hide'));
  out.state = await p.evaluate(() => window.__enc.getState());
  const after = await p.evaluate(() => ({ ...window.__enc.stats,
    cam: window.__enc.yaw.position.toArray().map(v => +v.toFixed(3)),
    reveal: window.__enc.getReveal(),
    fade: +getComputedStyle(document.getElementById('cineFade')).opacity,
    letterbox: document.body.classList.contains('cine'),
    drumUp: Math.abs(window.__enc.renderer ? 0 : 0) === 0 }));
  const e = EXPECT[i];
  out.deltasAppliedOnce =
    Math.round(after.sanity - before.sanity) === e.d[0] &&
    Math.round(after.awareness - before.awareness) === e.d[1] &&
    Math.round(after.wisdom - before.wisdom) === e.d[2];
  out.cameraRestored = after.cam.every((v, k) => Math.abs(v - before.cam[k]) < 0.01);
  out.fadeAsScripted = e.fadeDark ? after.fade > 0.95 : after.fade < 0.05;
  out.ghostAsScripted = e.ghostGone ? after.reveal === 0 : after.reveal > 0;
  out.letterboxOff = !after.letterbox;

  console.log(JSON.stringify(out), '| errors:', errs.length ? errs : 'none');
  await p.close();
}
await b.close();
