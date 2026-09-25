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

/* v8.7: A CHANGE OF OBJECTIVE IS TWO BEATS — the old one COMPLETE, then the
   new one — and both flash. The engine owns it, so the fixture gets it for
   free: nothing in the chapter asks. `{ complete: false }` is the escape
   for a change that is not a completion, and it must skip the banner. */
/* WATCHED, never polled and never sampled.

   v8.7 replaced two fixed waits here with polling and wrote down that a fixed
   wait is a coin toss. Polling is a SMALLER coin: the banner is 1.35 s of
   wall time, and under the runner — which pipes stdout and runs harnesses in
   pairs — the round trip from `kit.objective()` to the first poll can exceed
   that, so the beat has already been replaced by the next order and the check
   reports a banner that did in fact play. Measured: this exact check passed
   standalone and failed twice under `runtests`, with `objNextLands` true both
   times, which is the proof that the queue ran and the poll simply arrived
   late.

   So the observer goes in BEFORE the trigger and records what the box said
   while it wore the class. A transient DOM state is watched; only a settled
   one is polled.

   And it records ANY matching mutation, not the first one that carries the
   class: v8.8 made the words slide out and back in, so the sequence is
   `done out` (still the OLD order), then `done in` (OBJECTIVE COMPLETE),
   then `done`. Reading only the first is reading the box mid-swap — measured
   on the real build, `dbg-objbeat.mjs`. */
const until = (fn, ms = 30000) => p.waitForFunction(fn, null, { timeout: ms });
/* v9.4: SAMPLED ON WALL TIME, every 40 ms. Two earlier shapes were both
   coin tosses on a loaded box and both are worth writing down:
   - a MutationObserver callback is batched to a microtask, so it can run
     after several later mutations have landed and then read a `textContent`
     that has already moved on from the record that woke it;
   - a requestAnimationFrame sampler only ever looks ON a frame, and this
     state lives BETWEEN them. Measured in the engine: `swapObjText` writes
     the words 230 ms after the beat starts, on a setTimeout — wall time —
     while the `done` class is cleared by the next PAINT. At 1 fps that
     overlap is a whole second; below ~0.7 fps the next frame lands after
     the words and the pair never co-occurs on any frame at all.
   The banner is correct on any real device; it is this box that cannot be
   watched frame by frame. So sample the way the thing itself is timed.  */
const watchObj = () => p.evaluate(() => {
  window.__sawBanner = false; window.__sawDone = false;
  const box = document.querySelector('#objective .obox');
  const txt = document.getElementById('objTxt');
  window.__objTick = setInterval(() => {
    if (!box.classList.contains('done')) return;
    window.__sawDone = true;
    if (txt.textContent.toUpperCase().includes('COMPLETE')) window.__sawBanner = true;
  }, 40);
});
const stopObj = () => p.evaluate(() => clearInterval(window.__objTick));
await watchObj();
await p.evaluate(() => window.__enc.kit.objective('Second order'));
K.objNextLands = await until(() => {
  const box = document.querySelector('#objective .obox');
  return !!box && !box.classList.contains('done')
    && document.getElementById('objTxt').textContent === 'Second order'
    && window.__enc.kitDebug().objective === 'Second order';
}).then(() => true, () => false);
K.objDoneBanner = await p.evaluate(() => window.__sawBanner === true);
await stopObj();
// and `complete: false` must skip the banner entirely — sampled every frame,
// because a banner that flickered past between two polls would go unnoticed
await watchObj();
await p.evaluate(() => window.__enc.kit.objective('Third order', { complete: false }));
await until(() => document.getElementById('objTxt').textContent === 'Third order').catch(() => {});
K.objNoFalseComplete = await p.evaluate(() =>
  window.__sawDone === false && document.getElementById('objTxt').textContent === 'Third order');
await stopObj();
await p.evaluate(() => window.__enc.kit.objective('Find the marker on the floor', { complete: false }));
await until(() => document.getElementById('objTxt').textContent.includes('marker')).catch(() => {});

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
/* v11.0: a hotspot SEEN BY LOOKING — the fixture's `mark` (dwell 0.5 s,
   aim 0.25 rad) fires with no press once the reticle has rested on it. Aim
   the lens at it from the spawn, poll for its conduct note (never a fixed
   wait, v8.7's law), and check that looking AWAY leaves it unfired first. */
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(0, 1.62, 2); e.yaw.rotation.y = Math.PI; e.pitch.rotation.x = 0; });
await settle();
K.dwellNotYet = await p.evaluate(() => !window.__enc.kitDebug().conduct.notes.includes('You looked at the mark.'));
await p.evaluate(() => { const e = window.__enc; e.yaw.rotation.y = 0; e.pitch.rotation.x = 0; });
await until(() => window.__enc.kitDebug().conduct.notes.includes('You looked at the mark.'), 20000).catch(() => {});
K.dwellFires = await p.evaluate(() => window.__enc.kitDebug().conduct.notes.includes('You looked at the mark.'));

// torch: declared → the button is on the body, F toggles it, off again after
K.torchDeclared = await p.evaluate(() => {
  const d = window.__enc.kitDebug();
  return document.body.classList.contains('hasTorch') && !!d.torch && d.torch.on === false;
});
await p.keyboard.press('KeyF'); await settle();
K.torchToggles = ((await dbg()).torch || {}).on === true;
await p.keyboard.press('KeyF'); await settle();

/* v12.0: RIFLE MODE. The fixture declares a weapon with no model on the item
   `rifle`: nothing is out until the item is in the hand slot; equipping it
   puts `weaponUp` on the body; a shot from the spawn's line of sight hits
   the fixture's target and the chapter is told; three rounds run out; a
   reload costs the one spare magazine; taking the item away holsters it. */
K.weaponDeclared = await p.evaluate(() => {
  const d = window.__enc.kitDebug();
  return !!d.weapon && d.weapon.avail === false && d.weapon.rounds === 3 && d.weapon.mags === 1
    && !document.body.classList.contains('weaponUp');
});
K.weaponNotOutUnequipped = await p.evaluate(() => window.__enc.kit.fire() === false);
/* v13.1: the MUZZLE FLASH defaults to nothing. The fixture declares no
   `flash` key, so the engine must create no cone at all — which is the
   whole proof that the seam is opt-in and that episode 1, which declares
   no weapon whatever, cannot reach it. (A flash is checked here by its
   ABSENCE because the fixture's weapon has no model to hang one on; the
   cone itself is verified by render on the chapter that declares it.) */
K.weaponNoFlashByDefault = await p.evaluate(() => {
  const w = window.__enc.weaponProp && window.__enc.weaponProp();
  if (w) { let n = 0; w.traverse(o => { if (o.isMesh && o.material && o.material.blending === 2) n++; }); if (n) return false; }
  return !window.__enc.kitDebug().weapon.flash;
});
await p.evaluate(() => { window.__enc.kit.give('rifle'); window.__enc.kit.equip('rifle'); });
await until(() => document.body.classList.contains('weaponUp') && document.body.classList.contains('hasWeapon'), 15000).catch(() => {});
K.weaponOutWhenEquipped = await p.evaluate(() => document.body.classList.contains('weaponUp') && window.__enc.kitDebug().weapon.avail === true);
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(0, 1.62, 9); e.yaw.rotation.y = 0; e.pitch.rotation.x = 0; });
await settle();
K.weaponHits = await p.evaluate(() => {
  const e = window.__enc; const ok = e.kit.fire();
  const d = e.kitDebug();
  return ok === true && d.weapon.rounds === 2 && d.conduct.notes.includes('You hit the target.');
});
/* v14.3: THE REFUSED SHOT. A chapter may forbid firing (Chad, on the live
   range: "disable shooting until the player actually reaches lane 6 ... The
   HUD ui should say something like 'Shooting only allowed at lane 6' if
   player tries to shoot anywhere else"), and the promise is not only that
   the press is eaten but that the reason is ON THE SCREEN — a dead trigger
   with nothing to read is what v12.2 spent a release fixing. Nothing is
   spent either: the round count must be exactly where it was. The fixture
   proves the seam so the chapter cannot hide a bug in it (v12.0's rule),
   and episode 1 declares no weapon, so none of it can run there. */
K.weaponBlockRefuses = await p.evaluate(() => {
  const e = window.__enc;
  e.kit.weaponBlock('NOT FROM HERE');
  const ok = e.kit.fire();
  const d = e.kitDebug(), el = document.getElementById('nofire');
  return ok === false && d.weapon.rounds === 2 && d.weapon.block === 'NOT FROM HERE'
    && document.body.classList.contains('wpnBlocked')
    && !!el && el.classList.contains('on') && el.textContent === 'NOT FROM HERE';
});
K.weaponBlockClears = await p.evaluate(() => {
  const e = window.__enc;
  e.kit.weaponBlock(null);
  const el = document.getElementById('nofire');
  return e.kitDebug().weapon.block === null && !document.body.classList.contains('wpnBlocked')
    && !!el && !el.classList.contains('on');
});
/* v12.2: POLLED, not waited. The rounds go to zero inside weaponFire(), but
   the pill's `empty` class is painted by weaponFrame — so on a box drawing
   about one frame a second a 120 ms wait can land BEFORE any frame has run
   and read a pill that is correct but not yet repainted. Measured: rounds 0
   and `weaponEmptyRefuses` true in the same breath, with the class still
   off. That is v8.7's law (a fixed wait in a harness is a coin toss) met in
   the one check written after it. The assertion is unchanged — both halves
   still have to be true — it is only given a frame to happen on.
   `fireGap` is 0.34 s, so the presses are spaced past it as well. */
await p.waitForTimeout(400);
await p.keyboard.press('Space'); await p.waitForTimeout(400);
await p.keyboard.press('Space'); await p.waitForTimeout(400);
await until(() => { const d = window.__enc.kitDebug(); return d.weapon.rounds === 0
  && document.getElementById('ammo').classList.contains('empty'); }, 20000).catch(() => {});
K.weaponRunsDry = await p.evaluate(() => { const d = window.__enc.kitDebug(); return d.weapon.rounds === 0 && document.getElementById('ammo').classList.contains('empty'); });
K.weaponEmptyRefuses = await p.evaluate(() => window.__enc.kit.fire() === false && window.__enc.kitDebug().weapon.rounds === 0);
await p.keyboard.press('KeyR'); await settle();
K.weaponReloads = await p.evaluate(() => { const d = window.__enc.kitDebug(); return d.weapon.rounds === 3 && d.weapon.mags === 0; });
K.weaponInSave = await p.evaluate(() => { const st = window.__enc.worldState(); return !!st.weapon && st.weapon.rounds === 3 && st.weapon.mags === 0; });
await p.evaluate(() => window.__enc.kit.take('rifle'));
await until(() => !document.body.classList.contains('weaponUp'), 15000).catch(() => {});
K.weaponHolsters = await p.evaluate(() => !document.body.classList.contains('weaponUp') && window.__enc.kitDebug().weapon.avail === false);

// v7.1: a fade in play — the kit's black goes up and comes down on the cutscene element
K.fadeInPlay = await p.evaluate(() => { window.__enc.kit.fade(1, 0.2); return true; })
  .then(() => p.waitForFunction(() => window.__enc.kitDebug().fade > 0.95, null, { timeout: 30000 }))
  .then(() => p.evaluate(() => +getComputedStyle(document.getElementById('cineFade')).opacity > 0.95))
  .then(up => p.evaluate(() => { window.__enc.kit.fade(0, 0.2); return true; })
    .then(() => p.waitForFunction(() => window.__enc.kitDebug().fade < 0.05, null, { timeout: 30000 }))
    .then(() => p.evaluate(() => +getComputedStyle(document.getElementById('cineFade')).opacity < 0.05))
    .then(down => up && down))
  .catch(() => false);
await settle();

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
/* v9.3: the heartbeat is GRADED now, so a press is scored on how close to
   the beat it lands rather than merely inside a window. Beats at 0.5 and
   1.0; pressing as near them as a 0.05 s clock allows must come out ahead. */
r = await runEvent({ kind: 'heartbeat', n: 2, bpm: 120, win: 0.34, zone: 1, lead: 0.5 },
                   async () => { await untilT(0.5); await tapOnce(); await untilT(1.0); await tapOnce(); });
const beatAnswered = r.sum;
K.evHeartbeat = r.band.length === 2;
/* and MISSING both beats must HURT — the whole of Chad's v9.3 note */
const san0 = await p.evaluate(() => window.__enc.stats.sanity);
r = await runEvent({ kind: 'heartbeat', n: 2, bpm: 120, win: 0.2, zone: 1, lead: 0.4,
                     penalty: { stat: 'sanity', per: 1 }, award: { stat: 'sanity', per: 1 } },
                   null);                                    // never press at all: runEvent waits it out
K.evHeartMissHurts = r.ok === false && r.sum < 0;
/* the point of the whole v9.3 change: answering beats BEATS ignoring them.
   Asserted as a comparison, not as an absolute band, because this box steps
   its clock 0.05 s a frame and a fixed window would be a coin toss (v8.7). */
K.evHeartbeatRewardsTiming = beatAnswered > r.sum;
K.evHeartMissCostsSanity = await p.evaluate(s0 => window.__enc.stats.sanity < s0, san0);
/* v9.3: wait until the CURRENT sequence item's slot clock has reached t */
const untilSlot = (t) => p.waitForFunction(
  (tt) => { const d = window.__enc.kitDebug(); return !!(d.event && d.event.slotT >= tt); },
  t, { timeout: 60000 });
const untilDot = () => p.waitForFunction(() => !document.getElementById('evDot').classList.contains('hide'), null, { timeout: 60000 });
r = await runEvent({ kind: 'focus', targets: [{ sx: 0.5, sy: 0.5 }, { sx: 0.5, sy: 0.5 }], each: 2 }, async () => { await untilDot(); await tapOnce(); await untilIdx(1); await untilDot(); await tapOnce(); });
K.evFocus = r.ok === true && r.hits === 2;
/* v9.3: a sequence item has a WINDOW. It opens `lead` into the slot, so a
   press has to WAIT for it — the old test tapped on the first frame and
   passed, which is exactly the "any tap is a hit" bug Chad found. */
r = await runEvent({ kind: 'sequence', items: [{ label: 'a' }, { label: 'b' }], each: 2, lead: 0.3, zone: 1 },
                   async () => { await untilSlot(0.9); await tapOnce(); await untilIdx(1); await untilSlot(0.9); await tapOnce(); });
const inWindow = r.sum;
K.evSequence = r.band.length === 2;
/* and a press BEFORE the window opens is the worst band there is */
const san1 = await p.evaluate(() => window.__enc.stats.sanity);
r = await runEvent({ kind: 'sequence', items: [{ label: 'a' }, { label: 'b' }], each: 2, lead: 0.8, zone: 1,
                     penalty: { stat: 'sanity', per: 1 }, award: { stat: 'awareness', per: 1 } },
                   async () => { await tapOnce(); await untilIdx(1); await tapOnce(); });
K.evSeqEarlyIsBroken = r.ok === false && r.sum <= -8 && r.band.every(b => b === -4);
/* and pressing INSIDE the window must be worth more than jabbing early —
   the one claim Chad's note actually rests on */
K.evSeqRewardsTiming = inWindow > r.sum;
K.evSeqEarlyCostsSanity = await p.evaluate(s0 => window.__enc.stats.sanity < s0, san1);
/* v9.4: A FLAT `missCost` is paid per miss and never refunded. Chad:
   "Missed beats will deal 5 sanity damage each." The ladder's own failing
   bands are -2 and -4, so netting a flat cost against them can come out
   POSITIVE after a run of misses and hand sanity back for failing — which is
   what this asserts cannot happen. Two beats, never answered: -10 exactly,
   and the end award adds nothing. */
/* sanity is PINNED first: a dozen sanity-costing checks have already run by
   here, `kitAward` clamps at 0, and at 0 `lose()` fires — so an unpinned
   assertion is both wrong and destructive. `__enc.stats` is the live object. */
await p.evaluate(() => { window.__enc.stats.sanity = 60; });
const sanF = await p.evaluate(() => window.__enc.stats.sanity);
r = await runEvent({ kind: 'heartbeat', n: 2, bpm: 120, win: 0.2, zone: 1, lead: 0.4,
                     missCost: 5, penalty: { stat: 'sanity' },
                     award: { stat: 'sanity', per: 1, lo: 0, hi: 8 } }, null);
/* asserted on the EVENT's own numbers, and on the stat only as an
   inequality. A stat is not a ledger: measured, sanity fell 14.74 for two
   missed beats — 10 of flat cost plus 4.74 of the fixture's own continuous
   drain, which runs under every assertion and in fractions. The ladder's
   report is the exact thing under test. */
K.evMissCostFlat = r.band.length === 2 && r.band.every(b => b === -4) && r.sum === -8
  && await p.evaluate(s0 => window.__enc.stats.sanity <= s0 - 10, sanF);
K.evMissCostNeverRefunds = r.delta === 0;
/* v9.4: THE BEATS ACCELERATE. Chad: "It should get faster and faster per
   beat." The schedule is laid out once, up front, so it is readable — each
   gap must be strictly shorter than the one before it, floored at
   `minPeriod`. */
K.evBeatsAccelerate = await p.evaluate(async () => {
  const e = window.__enc;
  const pr = e.kit.event({ kind: 'heartbeat', n: 5, bpm: 60, win: 0.05, lead: 0.5,
                           accel: 0.8, minPeriod: 0.3 });
  await new Promise(r => setTimeout(r, 60));
  const b = e.evState().beats.slice();
  e.kit.abortEvent(); await pr;
  const gaps = b.slice(1).map((t, i) => +(t - b[i]).toFixed(3));
  return b.length === 5 && gaps.length === 4
    && gaps.every((g, i) => i === 0 || g <= gaps[i - 1] + 1e-6)
    && gaps[gaps.length - 1] >= 0.299;
});
/* v9.4 · DRAG AND MATCH. Chad: "have the player drag item icons on the left
   to the right ... Matching wrong icons damages awareness." Both halves are
   asserted: a right drop locks a slot and a wrong one is paid at once. */
const awM = await p.evaluate(() => window.__enc.stats.awareness);
r = await runEvent({ kind: 'match', pairs: [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }],
                     secs: 30, fast: 0, slow: 0.05, wrongCost: 3,
                     penalty: { stat: 'awareness' },
                     award: { stat: 'awareness', lo: -5, hi: 9 } }, async () => {
  K.evMatchBuilds = await p.evaluate(() =>
    document.querySelectorAll('#evSrc .mtile').length === 2
    && document.querySelectorAll('#evDst .mslot').length === 2
    && document.getElementById('event').classList.contains('match'));
  // a WRONG drop: 'a' onto b's slot — paid on the spot, nothing locked
  await p.evaluate(() => window.__enc.evDrop('a', 'b'));
  K.evMatchWrongCosts = await p.evaluate(a0 =>
    window.__enc.stats.awareness === a0 - 3
    && window.__enc.kitDebug().event.wrong === 1
    && window.__enc.kitDebug().event.done === 0, awM);
  await p.evaluate(() => { window.__enc.evDrop('a', 'a'); window.__enc.evDrop('b', 'b'); });
});
/* `slow` 0.05 s is past before the first drop, so the score floors at 0 and
   the award pays its floor -- the speed mapping, asserted at one end of it */
K.evMatchCompletes = r.ok === true && r.hits === 2 && r.misses === 1;
K.evMatchScoresSpeed = r.score === 0 && r.delta === -5;
/* v8.7: a BRIEFED event holds everything until START is pressed. The proof
   that it holds is the clock: `each` is a fifth of a second here, so an
   unbriefed run would have missed both items long before the press. */
r = await runEvent({ kind: 'sequence', items: [{ label: 'a' }, { label: 'b' }], each: 0.2,
                     lead: 0.04, zone: 1, brief: 'Two of them. Tap each.' }, async () => {
  K.evBriefHolds = await p.evaluate(() => {
    const d = window.__enc.kitDebug();
    return !!(d.event && d.event.briefing) && d.event.t === 0
      && document.getElementById('event').classList.contains('brief')
      && document.getElementById('evPrompt').textContent === 'Two of them. Tap each.';
  });
  await p.waitForTimeout(900);          // the clock must NOT have moved under the briefing
  K.evBriefStopsClock = await p.evaluate(() => window.__enc.kitDebug().event.t === 0);
  await tapOnce();                      // START
  K.evBriefStarts = await p.evaluate(() => {
    const d = window.__enc.kitDebug();
    return !!d.event && !d.event.briefing && !document.getElementById('event').classList.contains('brief');
  });
  await untilSlot(0.06); await tapOnce(); await untilIdx(1); await untilSlot(0.06); await tapOnce();
});
K.evBriefRuns = r.band.length === 2;
// the award: the fixture's panel hotspot opens a sequence worth up to +6 awareness
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(6, 1.62, -4.2); e.yaw.rotation.y = 0; });
await settle();
K.eventFromHotspot = await p.evaluate(() => {
  const e = window.__enc; window.__aw0 = e.stats.awareness; window.__evR = null;
  return e.kitDebug().hotspot === 'panel' && e.interactNow() === true;
});
await p.waitForFunction(() => { const d = window.__enc.kitDebug(); return !!(d.event && d.event.started); }, null, { timeout: 30000 });
K.hotspotEventBriefs = await p.evaluate(() => !!window.__enc.kitDebug().event.briefing);   // v8.7
await tapOnce();                                                                          // START
for (let i = 0; i < 3; i++) { await tapOnce(); await untilIdx(i + 1); }
await p.waitForFunction(() => !window.__enc.kitDebug().event, null, { timeout: 60000 });
/* v9.3: the fixture's panel sequence is GRADED, so the award is whatever the
   ladder earned rather than a flat +6. The promise is that an award lands and
   the hotspot retires — the size of it is the chapter's business. */
K.eventAwards = await p.evaluate(() => window.__enc.stats.awareness !== window.__aw0 && window.__enc.kitDebug().hotspot === null);   // once: retired

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
/* v9.4: POLLED, not sampled after a fixed wait. The waypoint is painted by
   the FRAME, and under the full runner this box can take longer than 700 ms
   to produce one — the check passed standalone and failed in the suite,
   which is the v8.7 law exactly: a fixed wait in a harness is a coin toss,
   which is worse than no check. */
K.waypointShown = await until(() => !document.getElementById('waypoint').classList.contains('hide'))
  .then(() => true, () => false);
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

/* ---- v14.7: THE AMULET -----------------------------------------------------
   Three engine seams, on a chapter the engine has never seen: a hotspot
   answered by a TAP ON THE THING (`hits`, through hotspotTap), the ITEM
   UNLOCKED splash (kit.unlock) with its guard, and the WARD a worn amulet
   puts in front of sanity. Every check that reads a number does it inside
   ONE evaluate: a frame between two reads could let the fixture's own ghost
   take a bite, and a check that passes by luck is worse than none. */
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(-6, 1.62, 7.5); e.yaw.rotation.y = 0; e.pitch.rotation.x = -0.5; });
await settle();
const relicAt = await p.evaluate(() => {
  const h = window.__enc.stage.hotspots.find(x => x.id === 'relic');
  for (let y = 0.05; y < 0.97; y += 0.02) for (let x = 0.05; x < 0.97; x += 0.02) {
    const cx = x * innerWidth, cy = y * innerHeight;
    if (h.hits(cx, cy)) return { cx, cy };
  }
  return null;
});
K.tapMissesElsewhere = await p.evaluate(() => window.__enc.hotspotTap(3, 3) === false && window.__enc.getState() === 'play');
/* the tap and the guard in ONE evaluate: the press that took it must not also
   close it, and on a box that takes seconds over the splash's first frame a
   second round trip could arrive after the guard has run out */
K.tapTakesTheThing = !!relicAt && await p.evaluate(a => {
  const e = window.__enc;
  window.__guarded = false;
  const took = e.hotspotTap(a.cx, a.cy) === true;
  window.__guarded = took && e.unlockClose('key') === false && e.getState() === 'unlock';
  return took;
}, relicAt);
K.unlockGuards = await p.evaluate(() => window.__guarded === true);
K.unlockOpens = await p.evaluate(() => {
  const e = window.__enc;
  return e.getState() === 'unlock' && e.unlockState().id === 'amulet' && e.kit.has('amulet')
    && !document.getElementById('unlock').classList.contains('hide')
    && document.getElementById('unName').textContent.length > 0;
});
await p.waitForTimeout(900);
await p.keyboard.press('Enter');
K.unlockClosesOnKey = await until(() => window.__enc.getState() === 'play' && window.__enc.unlockState().id === null)
  .then(() => true, () => false);
K.tapRetires = !!relicAt && await p.evaluate(a => window.__enc.hotspotTap(a.cx, a.cy) === false, relicAt);   // `once`
// a second splash, closed by its own button
await p.evaluate(() => window.__enc.kit.unlock('amulet'));
await p.waitForTimeout(900);
await p.click('#unClose', { force: true });
K.unlockClosesOnButton = await until(() => window.__enc.getState() === 'play' && window.__enc.unlockState().id === null)
  .then(() => true, () => false);
// carried is not worn: no protection, no yellow
K.wardNotWhileCarried = await p.evaluate(() => {
  const e = window.__enc;
  return e.ward().worn === null && e.ward().left === 0 && e.kit.wardLeft() === 0
    && !document.getElementById('bArm').classList.contains('on') && !document.getElementById('vSan').dataset.arm;
});
/* worn: fifteen, drawn over the red's right end with `+15`; an award is taken
   by the amulet whole; off again the effect goes and the charge STAYS (a
   carried amulet protects nothing and loses nothing); back on it is where it
   was, never refilled; a sighting spills what the amulet cannot hold into
   sanity; spent, everything reaches sanity */
K.wardTakesFirst = await p.evaluate(() => {
  const e = window.__enc, bar = document.getElementById('bArm'), num = document.getElementById('vSan');
  e.kit.equip('amulet');
  const drawn = e.ward().left === 15 && bar.classList.contains('on') && num.dataset.arm === '+15';
  const s0 = e.stats.sanity, fx0 = e.ward();
  e.kitAward('sanity', -6);
  const soaked = e.stats.sanity === s0 && e.ward().left === 9 && num.dataset.arm === '+9';
  // v14.11: that hit CRACKED it (once) and did not break it
  const cracked = e.ward().cracks === fx0.cracks + 1 && e.ward().breaks === fx0.breaks && !e.ward().banner;
  e.kit.take('amulet'); e.kit.give('amulet');                  // off, into the bag
  e.kitAward('sanity', -2);
  const offKeeps = e.ward().left === 0 && e.ward().charge === 9 && Math.abs(e.stats.sanity - (s0 - 2)) < 1e-6
    && !bar.classList.contains('on');
  e.kit.equip('amulet');
  const backOn = e.ward().left === 9;
  const fx1 = e.ward();
  e.applyChunk('close');                                       // 10: nine to the amulet, one to sanity
  const spills = e.ward().left === 0 && Math.abs(e.stats.sanity - (s0 - 3)) < 1e-6 && !num.dataset.arm;
  // v14.11: the emptying hit BREAKS it — once, with the banner up — and does not crack it too
  const broke = e.ward().breaks === fx1.breaks + 1 && e.ward().cracks === fx1.cracks && e.ward().banner;
  e.kitAward('sanity', -2);
  const spent = Math.abs(e.stats.sanity - (s0 - 5)) < 1e-6;
  // and a spent amulet neither cracks nor breaks again
  const quiet = e.ward().breaks === fx1.breaks + 1 && e.ward().cracks === fx1.cracks;
  window.__wardFx = { drawn, soaked, cracked, offKeeps, backOn, spills, broke, spent, quiet };
  return drawn && soaked && cracked && offKeeps && backOn && spills && broke && spent && quiet;
});
/* the bleed (kit.hurt) is per frame: sampled every 30 ms, sanity may not
   move while the amulet still holds anything. The sampler STOPS the bleed
   itself, in the page, the moment the amulet is empty and sanity has moved:
   stopped from here, a loaded box let several half-second frames of bleed
   through before the stop arrived and fainted the run (decisionOpens then
   failed, far from any decision code). */
await p.evaluate(() => {
  const e = window.__enc, st = e.worldState();
  st.ward = { charge: 15, ep: st.ward.ep, enter: 15 };         // full again, as a save would bring it
  st.stats.sanity = Math.max(st.stats.sanity, 60);             // and far from a faint, whatever came before
  e.applyState(st);
  window.__s0 = e.stats.sanity; window.__bleed = []; window.__bleedDone = false; window.__fxB = e.ward();
  window.__bleedT = setInterval(() => {
    const c = e.ward().charge, s = e.stats.sanity;
    window.__bleed.push([c, s]);
    if (c === 0 && s < window.__s0 - 0.5) { e.kit.hurt(null); clearInterval(window.__bleedT); window.__bleedDone = true; }
  }, 30);
  e.kit.hurt({ perSec: 10 });
});
await until(() => window.__bleedDone === true, 90000).catch(() => {});
K.wardBleedsFirst = await p.evaluate(() => {
  const e = window.__enc; e.kit.hurt(null); clearInterval(window.__bleedT);
  const b = window.__bleed;
  return window.__bleedDone === true && b.length > 0 && b.every(([c, s]) => s >= window.__s0 - 1e-6 || c === 0)
    && e.ward().charge === 0 && e.stats.sanity < window.__s0 && e.getState() === 'play'
    // v14.11: a bleed cracks it on its batched ticks, and breaks it exactly once
    && e.ward().cracks > window.__fxB.cracks && e.ward().breaks === window.__fxB.breaks + 1;
});
// the lens level again, as the block found it: the walk to the pile below sets only the yaw
await p.evaluate(() => { window.__enc.pitch.rotation.x = 0; });
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
