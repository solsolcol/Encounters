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

/* ---- v7.0: THE PLAY KIT, on a world the engine has never seen -------------
   Every seam a chapter may declare, driven by STATE on a box that runs at a
   frame a second: an event's clock is game time (dt clamped to 0.05 s), so
   every duration below is tiny and every wait is a poll. */
const K = {};
const dbg = () => p.evaluate(() => window.__enc.kitDebug());
const settle = () => p.waitForTimeout(700);
// the objective set from INSIDE build() reached the HUD; the phase is kept and saved
K.objectiveShown = await p.evaluate(() => {
  const el = document.getElementById('objective');
  return !!el && !el.classList.contains('hide')
    && document.getElementById('objTxt').textContent.includes('marker');
});
K.phaseKept = await p.evaluate(() => window.__enc.kit.getPhase() === 'room' && window.__enc.worldState().phase === 'room');

// hotspots: stand at the switch, facing it — the badge names it, E flips it, conduct is banked
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(-6, 1.62, -4.2); e.yaw.rotation.y = 0; });
await settle();
K.hotspotBadge = await p.evaluate(() => {
  const d = window.__enc.kitDebug();
  return d.hotspot === 'switch' && !document.getElementById('interact').classList.contains('hide')
    && document.getElementById('itxt').textContent === 'Flip the switch';
});
K.hotspotFires = await p.evaluate(() => window.__enc.interactNow() === true && window.__enc.kitDebug().conduct.a === 3);
// away from every hotspot the badge goes back to the chapter's own words
await p.evaluate(() => { window.__enc.yaw.position.set(0, 1.62, 9); window.__enc.yaw.rotation.y = 0; });
await settle();
K.badgeRestored = await p.evaluate(() => {
  const d = window.__enc.kitDebug();
  return d.hotspot === null && document.getElementById('itxt').textContent !== 'Flip the switch';
});

// torch: declared → the button is on the body, F toggles it, off again after
K.torchDeclared = await p.evaluate(() => {
  const d = window.__enc.kitDebug();
  return document.body.classList.contains('hasTorch') && !!d.torch && d.torch.on === false;
});
await p.keyboard.press('KeyF'); await settle();
K.torchToggles = ((await dbg()).torch || {}).on === true;
await p.keyboard.press('KeyF'); await settle();

// presence: an unseen thing drains the bar, and the banner uses the chapter's words for it
K.presenceDrains = await p.evaluate(() => { window.__enc.kit.presence(1); return window.__enc.stats.sanity; })
  .then(s0 => p.waitForFunction(x => window.__enc.stats.sanity < x - 0.3, s0, { timeout: 60000 }))
  .then(() => p.evaluate(() => {
    const banner = document.getElementById('haunt');
    const words = document.querySelector('#haunt [data-t="hud.ghostAlarm"]').textContent;
    // the fixture keeps HER, and when she is draining too her words win the
    // banner — the rule is "hers first, the chapter's unseen thing otherwise"
    const hers = window.__enc.ghostDrainRate() > 0;
    window.__enc.kit.presence(0);
    return !banner.classList.contains('hide') && words === (hers ? 'Ghost spotted!' : 'Something is in the room.');
  })).catch(() => false);
await settle();
// with the chapter's presence at zero the banner goes — unless HER drain is what is showing it
K.presenceStops = await p.evaluate(() => window.__enc.kitDebug().presence === 0
  && (document.getElementById('haunt').classList.contains('hide') || window.__enc.ghostDrainRate() > 0));

// events: one system, eight kinds, each resolved by state
async function runEvent(opts, drive) {
  await p.evaluate(o => { window.__evR = null; window.__enc.kit.event(o).then(r => { window.__evR = r; }); }, opts);
  // started — or already over, for a kind that can resolve on its first frame
  await p.waitForFunction(() => { const d = window.__enc.kitDebug(); return window.__evR !== null || !!(d.event && d.event.started); }, null, { timeout: 30000 });
  if (drive && await p.evaluate(() => window.__evR === null)) await drive();
  await p.waitForFunction(() => window.__evR !== null, null, { timeout: 90000 });
  return p.evaluate(() => window.__evR);
}
const press = () => p.evaluate(() => window.__enc.evPress());
const release = () => p.evaluate(() => window.__enc.evRelease());
const tapOnce = async () => { await press(); await release(); };
const untilT = t => p.waitForFunction(x => { const d = window.__enc.kitDebug(); return !!d.event && d.event.t >= x; }, t, { timeout: 60000 });
const untilIdx = i => p.waitForFunction(x => { const d = window.__enc.kitDebug(); return !d.event || d.event.idx >= x; }, i, { timeout: 60000 });
let r;
r = await runEvent({ kind: 'tap', secs: 3 }, tapOnce);                      K.evTap = r.ok === true && r.kind === 'tap';
r = await runEvent({ kind: 'tap', secs: 0.15 });                           K.evTapTimesOut = r.ok === false;
r = await runEvent({ kind: 'timed', open: 0.15, close: 0.9 }, tapOnce);    K.evTimedEarly = r.ok === false && r.early === true;
r = await runEvent({ kind: 'timed', open: 0.15, close: 0.9 }, async () => { await untilT(0.16); await tapOnce(); });
K.evTimed = r.ok === true;
r = await runEvent({ kind: 'mash', secs: 0.3, start: 0.5, decay: 0.3, gain: 0.2 }, async () => { for (let i = 0; i < 4; i++) { await tapOnce(); await p.waitForTimeout(150); } });
K.evMash = r.ok === true && r.hits >= 3;
r = await runEvent({ kind: 'mash', secs: 2, start: 0.2, decay: 6, gain: 0.1 });   K.evMashFails = r.ok === false;
r = await runEvent({ kind: 'hold', secs: 0.25, grace: 2 }, press);         K.evHold = r.ok === true; await release();
r = await runEvent({ kind: 'hold', secs: 2, grace: 2 }, async () => { await press(); await settle(); await release(); });
K.evHoldReleased = r.ok === false;
r = await runEvent({ kind: 'stabilise', secs: 0.25, grace: 2 }, press);    K.evStabilise = r.ok === true && r.score >= 0.9; await release();
// beats at 0.5 and 1.0 with ±0.2 windows: wide enough for a clock that steps 0.05 a frame
r = await runEvent({ kind: 'heartbeat', n: 2, bpm: 120, win: 0.2, lead: 0.5 }, async () => { await untilT(0.35); await tapOnce(); await untilT(0.85); await tapOnce(); });
K.evHeartbeat = r.ok === true && r.hits === 2;
const untilDot = () => p.waitForFunction(() => !document.getElementById('evDot').classList.contains('hide'), null, { timeout: 60000 });
r = await runEvent({ kind: 'focus', targets: [{ sx: 0.5, sy: 0.5 }, { sx: 0.5, sy: 0.5 }], each: 2 }, async () => { await untilDot(); await tapOnce(); await untilIdx(1); await untilDot(); await tapOnce(); });
K.evFocus = r.ok === true && r.hits === 2;
r = await runEvent({ kind: 'sequence', items: [{ label: 'a' }, { label: 'b' }], each: 2 }, async () => { await tapOnce(); await untilIdx(1); await tapOnce(); });
K.evSequence = r.ok === true && r.hits === 2;
// the award: the fixture's panel hotspot opens a sequence worth up to +6 awareness
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(6, 1.62, -4.2); e.yaw.rotation.y = 0; });
await settle();
K.eventFromHotspot = await p.evaluate(() => {
  const e = window.__enc; window.__aw0 = e.stats.awareness; window.__evR = null;
  return e.kitDebug().hotspot === 'panel' && e.interactNow() === true;
});
await p.waitForFunction(() => { const d = window.__enc.kitDebug(); return !!(d.event && d.event.started); }, null, { timeout: 30000 });
for (let i = 0; i < 3; i++) { await tapOnce(); await untilIdx(i + 1); }
await p.waitForFunction(() => !window.__enc.kitDebug().event, null, { timeout: 60000 });
K.eventAwards = await p.evaluate(() => window.__enc.stats.awareness === window.__aw0 + 6 && window.__enc.kitDebug().hotspot === null);   // once: retired

// pose: the bed lies him down, walking stops, the neck narrows; the bed stands him up
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(6, 1.62, 7.8); e.yaw.rotation.y = 0; });
await settle();
K.poseLies = await p.evaluate(() => window.__enc.kitDebug().hotspot === 'bed' && window.__enc.interactNow() === true)
  && await p.waitForFunction(() => window.__enc.kitDebug().pose === 'lying' && window.__enc.kitDebug().eyeY < 0.7, null, { timeout: 60000 }).then(() => true).catch(() => false);
await p.keyboard.down('KeyW'); await p.waitForTimeout(1500); await p.keyboard.up('KeyW');
K.poseStopsWalking = await p.evaluate(() => Math.abs(window.__enc.yaw.position.z - 7.8) < 0.05);
K.poseStands = await p.evaluate(() => window.__enc.interactNow() === true)
  && await p.waitForFunction(() => window.__enc.kitDebug().pose === 'standing' && window.__enc.kitDebug().eyeY > 1.6, null, { timeout: 60000 }).then(() => true).catch(() => false);

// daylight in play: a tween lands on its target
K.daylightTweens = await p.evaluate(() => { window.__enc.kit.daylight({ fog: [0x000000, 0.05], stars: 0 }, 0.2); return true; })
  && await p.waitForFunction(() => window.__enc.kitDebug().daylightTween === null
      && Math.abs(window.__enc.chapterWorld().parent.fog.density - 0.05) < 1e-4, null, { timeout: 60000 }).then(() => true).catch(() => false);

// timer and waypoint
K.timerFires = await p.evaluate(() => { window.__tf = false; window.__enc.kit.timer(0.2, () => { window.__tf = true; }); return true; })
  && await p.waitForFunction(() => window.__tf === true && document.getElementById('objTimer').classList.contains('hide'), null, { timeout: 60000 }).then(() => true).catch(() => false);
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(0, 1.62, 9); e.yaw.rotation.y = 0; e.kit.waypoint({ x: 0, y: 1, z: 0 }); });
await settle();
K.waypointShown = await p.evaluate(() => !document.getElementById('waypoint').classList.contains('hide'));
await p.evaluate(() => window.__enc.kit.waypoint(null));

// the decision clock: armed, it drains under the panel and costs sanity when it runs out
await p.evaluate(() => {
  const c = window.__enc.chapter;
  window.__enc.yaw.position.set(c.shrine.x + 1.2, 1.62, c.shrine.z + 2.6);
  window.__enc.yaw.rotation.y = Math.PI;
  window.__enc.kit.decisionClock(0.2);
});
await settle();
K.clockRuns = await p.evaluate(() => { const e = window.__enc; window.__s0 = e.stats.sanity; e.interactPile(); return e.getState() === 'decide' && !document.getElementById('dclock').classList.contains('hide'); })
  && await p.waitForFunction(() => { const d = window.__enc.kitDebug(); return !!d.clock && d.clock.fired; }, null, { timeout: 60000 }).then(() => true).catch(() => false);
K.clockCosts = await p.evaluate(() => Math.abs(window.__enc.stats.sanity - (window.__s0 - 8)) < 0.01);
await p.evaluate(() => window.__enc.dismissDecision());
await settle();
K.clockGone = await p.evaluate(() => window.__enc.getState() === 'play' && window.__enc.kitDebug().clock === null);
// and the conduct banked at the switch is still there for the card
K.conductWaits = (await dbg()).conduct.a === 3;
out.kit = K;

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
// v7.0: what play did is on the card — the switch flipped, +3 awareness
out.conductOnCard = await p.evaluate(() => {
  const el = document.getElementById('conduct');
  return !!el && !el.classList.contains('hide') && el.textContent.includes('light on') && el.textContent.includes('+3');
});
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
if (out.conductOnCard !== true) errs.push('ERR fixture promise broken: conductOnCard');
for (const [k, v] of Object.entries(out.kit || {})) if (v !== true) errs.push(`ERR play kit promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
