/* Walking it again.

   Both end screens now restart the chapter in place instead of reloading the
   page. So the two things to prove are that the page really did NOT reload
   (a sentinel dropped on window has to survive), and that what comes back is
   a genuinely fresh run: fresh numbers, back on the grass, her gone, the
   black cleared, and the heap still openable.                              */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const b = await chromium.launch(LAUNCH);

const openPage = async () => {
  const p = await b.newPage({ viewport: { width: 500, height: 340 } });
  p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(90000);
  await p.goto(PAGE); await p.waitForTimeout(4000);
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
/* ---- v6.3: the LAST chapter of a case: complete -> the EPISODE card -> the title.
   Results for chapters 1-4 seeded on the progress store, chapter 5 played to
   its end through finish(): the card must tally the five, rank the mean, light
   the trail to case 2, and — with no case 2 written — send the run to the title. */
{
  const p = await b.newPage({ viewport: { width: 500, height: 700 } });
  p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(150000);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = { path: 'episode' };
  await p.goto(PAGE); await p.waitForTimeout(4000);
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.evaluate(() => { const e = window.__enc; e.clearCheckpoint(); try { localStorage.removeItem('mz.encounters.progress'); } catch {}
    e.markReached('ch5'); e.markSealed('ch1', 91, 'S'); e.markSealed('ch2', 62, 'B'); e.markSealed('ch3', 84, 'A+'); e.markSealed('ch4', 45, 'C'); });
  await p.evaluate(() => window.__enc.startChapter('ch5'));
  await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 150000, polling: 120 });
  await p.waitForTimeout(800);
  await p.evaluate(() => window.__enc.cine.skip());
  await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 150000, polling: 120 });
  await p.waitForTimeout(600);
  await p.evaluate(() => { const e = window.__enc; e.stats.sanity = 100; e.stats.awareness = 70; e.stats.wisdom = 70; e.finish(); });   // 30 + 21 + 28 = 79 -> A
  await p.waitForTimeout(800);
  out.sealedCardUp = await p.evaluate(() => window.__enc.getState() === 'complete' && !document.getElementById('complete').classList.contains('hide'));
  out.ch5OnRecord = await p.evaluate(() => { const r = window.__enc.sealed().ch5; return !!r && r.rank === 'A' && r.score === 79; });
  await p.click('#againBtn');
  await p.waitForTimeout(7500);                          // the choreography runs about six seconds
  out.episodeCardUp = await p.evaluate(() => window.__enc.getState() === 'complete'
    && !document.getElementById('episode').classList.contains('hide') && document.getElementById('complete').classList.contains('hide'));
  out.tallied = await p.evaluate(() => {
    const st = [...document.querySelectorAll('#epTally .epStop')];
    const ranks = st.map(x => x.querySelector('.r').textContent).join(','), scores = st.map(x => x.querySelector('.s').textContent).join(',');
    return st.length === 5 && ranks === 'S,B,A+,C,A' && scores === '91%,62%,84%,45%,79%' && st.every(x => x.classList.contains('in'));
  });
  out.episodeScore = await p.evaluate(() => document.getElementById('epScore').textContent === '72%'   // (91+62+84+45+79)/5 = 72.2
    && document.getElementById('epRank').textContent === 'A' && document.getElementById('epRank').classList.contains('glow'));
  out.stamped = await p.evaluate(() => document.getElementById('epStamp').classList.contains('stampin'));
  out.trailToCaseTwo = await p.evaluate(() => {
    const done = [...document.querySelectorAll('#epMap g.done')], next = document.querySelector('#epMap g.next');
    return done.length === 1 && done[0].dataset.ep === '1' && done[0].querySelector('.msT').textContent === 'A'
      && !!next && next.dataset.ep === '2' && document.getElementById('epMap').classList.contains('in')
      && document.querySelectorAll('#epMap g.locked').length === 8;
  });
  out.saysNextCase = await p.evaluate(() => /Episode 2/.test(document.getElementById('epNext').textContent));
  out.buttonToTitle = await p.evaluate(() => { const b = document.getElementById('epBtn'); return !b.disabled && b.classList.contains('in') && b.textContent === 'Back to the title screen'; });
  await p.click('#epBtn'); await p.waitForTimeout(800);
  out.backOnTitle = await p.evaluate(() => window.__enc.getState() === 'title' && !document.getElementById('title').classList.contains('hide')
    && document.getElementById('episode').classList.contains('hide') && document.getElementById('hud').classList.contains('hide'));
  out.runMarkedDone = await p.evaluate(() => { const s = window.__enc.loadCheckpoint(); return !!s && s.done === true && s.at === null; });
  console.log(JSON.stringify(out), '| errors:', errs.length ? errs : 'none');
  /* runtests reads the exit code and an "errors: [" line, not the booleans —
     so a false one here is turned into both, the way menutest reports */
  const bad = Object.entries(out).filter(([k, v]) => k !== 'path' && v !== true).map(([k]) => k);
  if (bad.length) { console.log('errors: [episode card: ' + bad.join(', ') + ']'); process.exitCode = 1; }
  await p.close();
}

await b.close();
