/* Can the engine play a chapter it has never seen?

   Everything else in the suite drives chapter 1, which the engine grew up
   around — so "the engine is chapter-agnostic" is a claim no other harness
   can test. This one boots `?ch=chtest`: a chapter with a different world, a
   different stage, no location model and no assets of its own, built from a
   file main.js contains no reference to.

   It plays the loop end to end — spawn, reach the thing, open the decision,
   pick, watch the cutscene, land on the outcome card — and then swaps back
   to chapter 1 in place via rebuildStage(), which is exactly the path a real
   chapter advance will take. If the engine ever grows a hidden dependency on
   chapter 1 specifically, this is the harness that goes red.

   It is also cheap on purpose: primitives, no GLB, so under SwiftShader it
   costs a fraction of what the same walk costs in the void deck.          */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';

const errs = [];
const sep = PAGE.includes('?') ? '&' : '?';

const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 900, height: 600 } });
p.on('pageerror', e => errs.push('pageerror: ' + e.message));

/* v5.31: the same navigation budget every other harness gives the page —
   Playwright's default 30 s is not enough for the boot preloads on a box that
   is running two browsers, and this harness failed twice on nothing else */
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(120000);
await p.goto(PAGE + sep + 'ch=chtest', { waitUntil: 'load' });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });

const out = {};
out.bootedFixture = await p.evaluate(() => window.__enc.chapter.id === 99);
out.noChapterAssets = await p.evaluate(() => window.__enc.chapter.assets.length === 0);
// the fixture has walls, so the engine got blockers out of a world it did not build
out.blockersFromChapter = await p.evaluate(() => window.__enc.blockers.length >= 4);
out.cardShowsFixture = await p.evaluate(() =>
  (document.getElementById('chapTitle')?.textContent || '').includes('Empty Room'));

await p.click('#startBtn');
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 120000 });
out.reachesPlay = true;

// walk to the thing (teleport: this is not a movement test)
await p.evaluate(() => {
  const c = window.__enc.chapter;
  window.__enc.yaw.position.set(c.shrine.x + 1.2, 1.62, c.shrine.z + 2.6);
  window.__enc.yaw.rotation.y = Math.PI;      // face back toward the shrine
});
await p.waitForTimeout(1500);
out.inReach = await p.evaluate(() => window.__enc.pileDist() < window.__enc.INTERACT_R);

// the decision opens on a chapter the engine has never seen
out.decisionOpens = await p.evaluate(() => {
  window.__enc.interactPile();
  return window.__enc.getState() === 'decide';
});
out.fixtureWords = await p.evaluate(() =>
  (document.getElementById('qtext')?.textContent || '').includes('marker on the floor'));

// pick one and let its scene run. The wait is not padding: pick() ignores
// anything inside 340 ms of the panel opening, because the panel appears
// under wherever the finger already was and a stray event is not a decision.
await p.waitForTimeout(700);
await p.evaluate(() => window.__enc.pick(2));
await p.waitForTimeout(1200);
out.cutscenePlays = await p.evaluate(() => window.__enc.getState() === 'cine');
await p.waitForFunction(() => window.__enc.getState() !== 'cine', null, { timeout: 60000 });
await p.waitForTimeout(1200);
out.reachesOutcome = await p.evaluate(() => window.__enc.getState() === 'result');
// the teaching writes itself a letter at a time, and only after the stat rows
// have finished animating — so poll for it rather than guessing a duration
out.fixtureTeaching = await p.waitForFunction(() =>
  (document.getElementById('teach')?.textContent || '').includes('Looking costs nothing'),
  null, { timeout: 60000 }).then(() => true).catch(() => false);

// and the world survives being swapped back to the real chapter, in place
out.swapsBack = await p.evaluate(() => {
  const chapters = window.__CHAPTERS__;
  if (!chapters || !chapters.ch1) return false;
  window.__enc.rebuildStage(chapters.ch1);
  return !!window.__enc.chapterWorld() && window.__enc.blockers.length > 0;
});
await p.waitForTimeout(1500);
out.aliveAfterSwap = await p.evaluate(() =>
  isFinite(window.__enc.pileDist()) && window.__enc.getState() !== 'error');

console.log(JSON.stringify(out, null, 1));
const MUST = ['bootedFixture', 'noChapterAssets', 'blockersFromChapter', 'cardShowsFixture',
              'reachesPlay', 'inReach', 'decisionOpens', 'fixtureWords', 'cutscenePlays',
              'reachesOutcome', 'fixtureTeaching', 'swapsBack', 'aliveAfterSwap'];
for (const k of MUST) if (out[k] !== true) errs.push(`ERR fixture promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
