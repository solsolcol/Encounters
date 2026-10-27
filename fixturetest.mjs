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
/* v22.0: 700 ms AND three drawn frames. A teleport is noticed by the frame loop (the hotspot under the lens, the bed
   in reach), and on a loaded box one frame outlasts 700 ms — the fixed wait alone failed hotspotBadge, hotspotFires,
   poseLies, poseStands, conductWaits and conductOnCard together, all six reading a frame that had not run yet (the
   v8.7 law: a fixed wait in a harness is a coin toss) */
const settle = async () => {
  await p.waitForTimeout(700);
  await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
};
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

/* v21.9: THE TWENTY-EIGHTH SEAM — a spot answered by a PRESS on what you look
   at (`pressAim`; Chad, of episode 3 chapter 3's shop: "I don't want this auto
   timer, instead the user either has to tap it, click it, or press E"). The
   fixture's sign and plaque sit 0.12 rad apart from the spawn, inside each
   other's 0.25 cones. Proven: neither is offered with the reticle off them; the
   badge names the one the reticle is NEARER; resting on one runs no timer at
   all; E presses it; and a tap on the other's mark presses that one. */
const aimFrom9 = (x, z) => p.evaluate(([x, z]) => { const e = window.__enc; e.yaw.position.set(0, 1.62, 9);
  e.yaw.rotation.y = Math.atan2(-x, -(z - 9)); e.pitch.rotation.x = 0; }, [x, z]);
const spotNow = () => p.evaluate(() => window.__enc.kitDebug().hotspot);
const readNotes = () => p.evaluate(() => window.__enc.kitDebug().conduct.notes.filter(n => n === 'You read the sign.' || n === 'You read the plaque.'));
await p.evaluate(() => { for (const h of window.__enc.stage.hotspots) if (h.id === 'sign' || h.id === 'plaque') h.armed = true; });
await aimFrom9(0, -8); await settle();
K.pressNotOffAim = !['sign', 'plaque'].includes(await spotNow());
await aimFrom9(-10.5, 0);
await until(() => window.__enc.kitDebug().hotspot === 'sign', 20000).catch(() => {});
K.pressOffered = (await spotNow()) === 'sign';
await aimFrom9(-10.5, -2.5);
await until(() => window.__enc.kitDebug().hotspot === 'plaque', 20000).catch(() => {});
K.pressNearerCone = (await spotNow()) === 'plaque';
await aimFrom9(-10.5, 0);
await until(() => window.__enc.kitDebug().hotspot === 'sign', 20000).catch(() => {});
await p.waitForTimeout(2500);   // a NEGATIVE: nothing may fire, and no look-timer may even start
K.pressNoTimer = (await readNotes()).length === 0
  && await p.evaluate(() => { const h = window.__enc.stage.hotspots.find(x => x.id === 'sign'); return !h.done && !(h.dwellT > 0); });
await p.keyboard.press('KeyE');
await until(() => window.__enc.kitDebug().conduct.notes.includes('You read the sign.'), 20000).catch(() => {});
K.pressE = (await readNotes()).join('|') === 'You read the sign.';
await aimFrom9(-4, 0); await settle();   // the plaque's mark on screen, the reticle well off it
K.pressTapMark = await p.evaluate(() => {
  const e = window.__enc, m = e.hotMarkAt('plaque');
  if (!m || m.z > 1 || e.hotspotTap(3, 3) !== false) return false;
  return e.hotspotTap(m.x, m.y) === true && e.kitDebug().conduct.notes.includes('You read the plaque.');
});

/* v24.0: a spot with NO MARK (`mark: false`): arming it adds no mark to the screen, a tap where its mark would be does
   nothing, and with the reticle on it the badge still names it and E presses it */
const markCount = () => p.evaluate(() => [...document.querySelectorAll('#hotmarks .hmark')].filter(m => m.style.display !== 'none').length);
await aimFrom9(4, 0); await settle();   // the clue on screen, the reticle well off it
const marksBefore = await markCount();
await p.evaluate(() => { const h = window.__enc.stage.hotspots.find(x => x.id === 'clue'); h.armed = true; });
await settle();
K.noMarkDrawn = (await markCount()) === marksBefore;
K.noMarkTap = await p.evaluate(() => { const e = window.__enc, m = e.hotMarkAt('clue'); return !!m && m.z < 1 && e.hotspotTap(m.x, m.y) === false; });
await aimFrom9(10.5, 0);
await until(() => window.__enc.kitDebug().hotspot === 'clue', 20000).catch(() => {});
K.noMarkBadge = (await spotNow()) === 'clue';
await p.keyboard.press('KeyE');
await until(() => window.__enc.kitDebug().conduct.notes.includes('You found the clue.'), 20000).catch(() => {});
K.noMarkPress = await p.evaluate(() => window.__enc.kitDebug().conduct.notes.includes('You found the clue.'));

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

// v16.1: a scene change warmed under the black — kit.warm() resolves with a time, and the loading word is gone after
K.warmUnderBlack = await p.evaluate(() => { window.__enc.kit.fade(1, 0.1); return true; })
  .then(() => p.waitForFunction(() => window.__enc.kitDebug().fade > 0.95, null, { timeout: 30000 }))
  .then(() => p.evaluate(() => window.__enc.kit.warm().then(ms => Number.isFinite(ms) && ms >= 0)))
  .then(ok => p.evaluate(() => document.getElementById('worldLoad').classList.contains('hide')).then(h => ok && h))
  .then(ok => p.evaluate(() => { window.__enc.kit.fade(0, 0.1); return true; })
    .then(() => p.waitForFunction(() => window.__enc.kitDebug().fade < 0.05, null, { timeout: 30000 }))
    .then(() => ok))
  .catch(() => false);
await settle();

// v16.4: THE GROUND — the stage's groundAt: the eye rides a platform, a ramp is walkable, a wall is not
K.groundSeam = await p.evaluate(async () => {
  const E = window.__enc, near = (a, b, e = 0.03) => Math.abs(a - b) < e;
  const read = E.groundAt(9.3, 0) === 0.9 && near(E.groundAt(7.1, 0), 0.45) && E.groundAt(0, 9) === 0;
  E.yaw.position.set(9.3, 1.62, 0);
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  await frames(4);
  const rides = near(E.yaw.position.y, 0.9 + 1.62, 0.06);
  E.yaw.position.set(7.9, 1.62, 0);   await frames(2);
  const ramp = !E.collideAt(8.3, 0);                 // up the ramp onto the platform: 0.12 m, a step
  E.yaw.position.set(8.0, 1.62, 1.0); await frames(2);
  const wall = E.collideAt(8.35, 1.0);               // straight at its side from the floor: 0.9 m, a wall
  E.yaw.position.set(0, 1.62, 9);     await frames(4);
  const back = near(E.yaw.position.y, 1.62, 0.06);
  return read && rides && ramp && wall && back;
}).catch(() => false);
await settle();

// v16.5: THE PRAYING HANDS — kit.pray brings both hands to scChant's clasp and takes them back to the rest exactly
K.praySeam = await p.evaluate(async () => {
  const E = window.__enc;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  await frames(2);
  const rest = E.prayDebug();
  /* v19.3: the left hand is a copy of the right, and the right's root is the
     torch and rifle swap's switch: a copy made while a rifle was out came out
     HIDDEN for the rest of the session. Made here with the right hand's root
     hidden, it must still be drawn when the clasp comes up. */
  const root = E.rightHand().parent, was = root.visible;
  root.visible = false; E.prayArmRebuild(); root.visible = was;
  E.kit.pray(true, { secs: 0.05 });
  const t0 = performance.now();
  while (E.prayDebug().k < 1 && performance.now() - t0 < 30000) await frames(1);
  const up = E.prayDebug();
  const clasp = up.k === 1 && up.left && up.leftDrawn && Math.abs(up.ay - (-0.235)) < 0.002 && E.kit.praying();
  E.kit.pray(false, { secs: 0.05 });
  const t1 = performance.now();
  while ((E.prayDebug().k > 0 || E.prayDebug().left) && performance.now() - t1 < 30000) await frames(1);
  await frames(2);
  const down = E.prayDebug();
  return clasp && !down.left && !E.kit.praying() && down.ax === rest.ax && down.ay === rest.ay;
}).catch(() => false);
await settle();

/* v23.0: A CHAPTER IN THE WORKS (the forty-second seam) — a chapter that declares `preview` is registered and out of
   the run: never the next chapter, and on the selector a locked stop that says so. Proven on a chapter of the run
   that is NOT in the works, made so for a moment and put back, so the proof holds whichever chapter is in the works
   (or none): with episode 1 chapter 2 in the works, chapter 1's next is chapter 3, and chapter 2's stop is locked and
   marked; put back, chapter 1's next is chapter 2 again. */
K.previewSeam = await p.evaluate(() => {
  const E = window.__enc, C = window.__CHAPTERS__;
  if (!C || !C.ch1 || !C.ch2 || !C.ch3 || !E.chapterNext || !E.chapterStops) return false;
  const before = E.chapterNext('ch1') === 'ch2' && !E.isPreview('ch2');
  const had = Object.prototype.hasOwnProperty.call(C.ch2, 'preview'), was = C.ch2.preview;
  C.ch2.preview = true;
  let held = false;
  try {
    const row = (E.chapterStops(1) || []).find(x => x && x.k === 'ch2');
    held = E.isPreview('ch2') && E.chapterNext('ch1') === 'ch3' && !!row && row.s === 'locked' && row.preview === true;
  } finally { if (had) C.ch2.preview = was; else delete C.ch2.preview; }
  const back = E.chapterNext('ch1') === 'ch2' && !E.isPreview('ch2');
  return before && held && back;
}).catch(() => false);
await settle();

/* v22.0: THE TREMBLE (the thirty-second seam) — kit.tremble(1) shakes the
   viewmodel's root a little every frame (the offset moves and is non-zero),
   and back at 0 nothing at all is laid on: the offset is exactly zero, so a
   chapter that never calls it draws what it always drew */
K.trembleSeam = await p.evaluate(async () => {
  const E = window.__enc;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const still0 = E.tremble();
  E.kit.tremble(1, { secs: 0 });
  await frames(3);
  const a = E.tremble(); await frames(2); const b = E.tremble();
  const shakes = a.k === 1 && (Math.abs(a.ox) + Math.abs(a.or)) > 0 && (a.ox !== b.ox || a.or !== b.or);
  E.kit.tremble(0, { secs: 0 });
  await frames(3);
  const c = E.tremble();
  return still0.ox === 0 && still0.or === 0 && shakes && c.k === 0 && c.ox === 0 && c.oy === 0 && c.or === 0;
}).catch(() => false);
await settle();

/* v22.0: THE COLD (the thirty-third, -fourth and -fifth seams) — kit.chill shows the edge layer with a blur and
   puts a filter on the canvas, and at 0 takes both away entirely; kit.pulse beats on the wall clock at the rate
   asked (a beat is counted as it lands), its erratic heart comes early and drops beats, and null hands the monitor
   back; kit.smear lays the last frame over this one (it draws and copies, with no GL error) and at 0 frees its
   texture. Before and after, nothing of any of them is left: no layer, no filter, no heart, no texture */
K.coldSeam = await p.evaluate(async () => {
  const E = window.__enc;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const until = async (f, ms) => { const t0 = performance.now(); while (!f() && performance.now() - t0 < ms) await frames(1); return f(); };
  const c0 = E.cold();
  const clean0 = !c0.chill.shown && c0.chill.filter === '' && !c0.pulse && !c0.smear.tex;
  E.kit.chill(1, { secs: 0 });
  await frames(3);
  const c1 = E.cold();
  const chilled = c1.chill.shown && /blur\(/.test(c1.chill.backdrop) && /saturate/.test(c1.chill.filter);
  E.kit.pulse({ bpm: 150, secs: 0.05 });
  const b0 = E.cold().beats.beats;
  const beats = await until(() => E.cold().beats.beats - b0 >= 3, 20000);      // 150 a minute: ~2.5 beats a second
  E.kit.pulse({ bpm: 120, erratic: 1 });
  const e0 = E.cold().beats;
  const wild = await until(() => { const e = E.cold().beats; return e.early > e0.early && e.dropped >= e0.dropped && e.beats - e0.beats >= 6; }, 30000);
  E.kit.smear(1, { secs: 0 });
  await until(() => E.cold().smear.copied > 3, 20000);
  const s1 = E.cold().smear;
  const smeared = s1.ok && s1.copied > 3 && s1.drawn > 2 && s1.tex;
  E.kit.chill(0, { secs: 0 }); E.kit.pulse(null); E.kit.smear(0, { secs: 0 });
  await frames(3);
  const c2 = E.cold();
  const clean = !c2.chill.shown && c2.chill.filter === '' && !c2.pulse && !c2.smear.tex;
  console.log('coldSeam', JSON.stringify({ clean0, chilled, beats, wild, smeared, clean, smear: s1 }));
  return clean0 && chilled && beats && wild && smeared && clean;
}).catch(e => { console.log('coldSeam threw', e.message); return false; });
await settle();

/* v21.0: A THING IN HIS HAND (the twenty-seventh seam) — kit.hold puts an
   object on the right arm (so it is drawn in the hands' pass), at the clasp's
   middle when asked, lets go on hold(null), and a new hold replaces the old */
K.holdSeam = await p.evaluate(async () => {
  const E = window.__enc;
  const arm = E.armR, Obj = arm.constructor;
  const a = new Obj(), b = new Obj();
  E.kit.hold(a, { clasp: true, lift: 0.02 });
  const clasp = a.parent === arm && E.kit.holding() === a && [a.position.x, a.position.y, a.position.z].every(Number.isFinite)
    && Math.hypot(a.position.x, a.position.y, a.position.z) < 0.4;
  E.kit.hold(b, { pos: [0, 0, -0.1] });
  const swap = a.parent === null && b.parent === arm && E.kit.holding() === b && b.position.z === -0.1;
  E.kit.hold(null);
  const off = b.parent === null && E.kit.holding() === null;
  /* held at the clasp with the hands IN the clasp, the thing sits on the plane
     where the palms meet — the middle between the two hands, in the arm's own
     frame x ≈ the clasp's centre line (v21.0 review) */
  E.kit.pray(true, { secs: 0 });
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));   // the frame lays the clasp
  const c = new Obj(); E.kit.hold(c, { clasp: true });
  c.updateWorldMatrix(true, false);
  const w = c.position.clone(); c.getWorldPosition(w);                  // the hands' pass is drawn from its origin, looking down -z
  const mid = c.parent === arm && E.prayDebug().k === 1 && Math.abs(w.x) < 0.02 && w.z < 0;
  E.kit.hold(null); E.kit.pray(false, { secs: 0 });
  /* v23.0: `bare` — a thing carried with the hand out of sight: the hand's model hidden on the frame while it is held,
     shown again the moment it is let go (the hand's root is the right hand model's parent) */
  const frame2 = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const hm = E.rightHand && E.rightHand() ? E.rightHand().parent : null;
  const d = new Obj(); E.kit.hold(d, { bare: true }); await frame2();
  const bareHid = !!hm && hm.visible === false && d.parent === arm;
  E.kit.hold(null); await frame2();
  const bareBack = !!hm && hm.visible === true && d.parent === null;
  return clasp && swap && off && mid && c.parent === null && bareHid && bareBack;
}).catch(() => false);
await settle();

/* v18.0: THE HANDS TAKEN (the twenty-fourth seam) — kit.hands lifts both
   hands out of the clasp into the gesture by k, sways the lens with them, and
   gives every bit of it back at zero: the arm where the engine leaves it, the
   roll level, the left arm hidden */
K.handsSeam = await p.evaluate(async () => {
  const E = window.__enc;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  await frames(2);
  const rest = E.prayDebug();
  E.kit.hands(1, { secs: 0.05 });
  const t0 = performance.now();
  while (E.kit.getHands() < 1 && performance.now() - t0 < 30000) await frames(1);
  await frames(3);
  const up = E.prayDebug();
  const moved = Math.hypot(up.ax - rest.ax, up.ay - rest.ay) > 0.02 && up.left;   // the gesture lifts the arm; x alone can come back near rest
  let rolled = 0;
  for (let i = 0; i < 6; i++) { await frames(1); rolled = Math.max(rolled, Math.abs(E.camRoll())); }
  E.kit.hands(0, { secs: 0.05 });
  const t1 = performance.now();
  while (E.kit.getHands() > 0 && performance.now() - t1 < 30000) await frames(1);
  await frames(3);
  const down = E.prayDebug();
  return moved && rolled > 0.001 && E.camRoll() === 0 && !down.left && down.ax === rest.ax && down.ay === rest.ay;
}).catch(() => false);
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
  await p.evaluate(o => {
    window.__evR = null;
    // a callback cannot cross into the page, so a check names a counter instead
    if (o.slipTag) { const t = o.slipTag; o.onSlip = () => { window[t] = (window[t] || 0) + 1; window.__sanAtSlip = window.__enc.stats.sanity; }; }
    // v23.0: a craft's steps and its foam, the same way
    if (o.stepTag) { const t = o.stepTag; o.onStep = i => { (window[t] = window[t] || []).push(i); }; }
    if (o.foamTag) { const t = o.foamTag; o.onFoam = () => { window[t] = (window[t] || 0) + 1; }; }
    // v21.2: a steady focus target's ready() reads a flag the check flips
    if (o.readyTag) { const t = o.readyTag; o.targets = o.targets.map(q => Object.assign({}, q, { ready: () => !!window[t] })); }
    // a rapid-tap event is tapped from inside the page, on its own timer
    const tap = o.tapEvery ? setInterval(() => { window.__enc.evPress(); window.__enc.evRelease(); }, o.tapEvery) : 0;
    /* v19.4: or on the EVENT's own clock — one tap every `tapEveryT` event
       seconds. The event clock steps at most 0.25 s a drawn frame, so on this
       one-frame-a-second box real-time taps outrun a bar that drains on it; a
       rate test must tap on the clock the bar drains on */
    let tapT = 0;
    if (o.tapEveryT) { let next = o.tapEveryT; const f = () => { if (window.__evR !== null) return; const d = window.__enc.kitDebug().event;
      if (d && d.started && !d.briefing && d.t >= next) { window.__enc.evPress(); window.__enc.evRelease(); next += o.tapEveryT; }
      tapT = requestAnimationFrame(f); }; tapT = requestAnimationFrame(f); }
    /* v23.0 CP10: or one press at each of `pressAtT`'s event times, on the event's own clock, from inside the page — a
       graded beat pressed through a round trip from the harness lands late on a loaded box and scores as a miss (the
       heartbeat check below failed two pair runs in three that way) */
    let pressT = 0;
    if (o.pressAtT) {                 // (on the frame NEAREST the beat — the grade is |t − beat|, early or late alike — since a
      const ts = o.pressAtT.slice();  //  loaded box steps this clock up to 0.25 s a frame, and the first frame past it can be that late)
      let prev = null, step = 0;
      const f = () => { if (window.__evR !== null) return; const d = window.__enc.kitDebug().event;
        if (d && d.started && !d.briefing && ts.length) {
          if (prev !== null && d.t > prev) step = d.t - prev;
          prev = d.t;
          if (d.t + step / 2 >= ts[0]) { ts.shift(); window.__enc.evPress(); window.__enc.evRelease(); }
        }
        pressT = requestAnimationFrame(f); };
      pressT = requestAnimationFrame(f);
    }
    window.__enc.kit.event(o).then(r => { if (tap) clearInterval(tap); if (tapT) cancelAnimationFrame(tapT); if (pressT) cancelAnimationFrame(pressT); window.__evR = r; });
  }, opts);
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
   1.0; pressing as near them as the event's clock allows must come out ahead
   (v23.0 CP10: pressed from inside the page on that clock — `pressAtT` —
   because through a round trip from here the presses landed late on a loaded
   box and scored as misses) */
r = await runEvent({ kind: 'heartbeat', n: 2, bpm: 120, win: 0.34, zone: 1, lead: 0.5, pressAtT: [0.5, 1.0] });
const beatAnswered = r.sum;
K.evHeartbeat = r.band.length === 2;
/* v18.0: RESIST (the twenty-fifth seam), a RAPID-TAP fight since 3 Oct.
   Never tapped, the danger runs past `grace` and it is LOST on that frame:
   the chapter is told (onSlip), ok is false and the loss is PAID (lo). Tapped
   faster than it asks the whole way, it is WON and pays. The rates here are
   slow on purpose — this box draws about one frame a second, and the taps
   are real-time stamps fired from the page between frames. */
r = await runEvent({ kind: 'resist', secs: 3, rate0: 2, rate1: 2, window: 1, grace: 0.6, lead: 0.2,
                     award: { stat: 'awareness', lo: -3, hi: 2 }, slipTag: '__slips' }, null);
K.evResistSlips = r.kind === 'resist' && !r.ok && r.delta === -3 && await p.evaluate(() => window.__slips >= 1);
r = await runEvent({ kind: 'resist', secs: 2.5, rate0: 0.8, rate1: 0.8, window: 3, grace: 3, lead: 0.2,
                     award: { stat: 'awareness', lo: -3, hi: 2 }, slipTag: '__slips2', tapEvery: 120 }, null);
K.evResistHeld = r.kind === 'resist' && r.ok && r.delta > 0 && await p.evaluate(() => !window.__slips2);
/* v19.4: the DRAINING BAR — tapped, but slower than the hold rate (2 a second
   of the event's clock against 4: each tap refills a quarter, the bar drains a
   full one a second), it still runs dry and is LOST; a real loss, not a
   timeout */
r = await runEvent({ kind: 'resist', secs: 6, rate0: 4, rate1: 4, empty: 1.0, grace: 1.0, lead: 0.2,
                     award: { stat: 'awareness', lo: -3, hi: 2 }, slipTag: '__slips3', tapEveryT: 0.5 }, null);
K.evResistSlowLoses = r.kind === 'resist' && !r.ok && await p.evaluate(() => window.__slips3 >= 1);
/* v22.0: STEADY (the thirty-first seam). Left alone, the tremor carries the
   mark out of its ring and it SLIPS — lost on that frame, the chapter told
   (onSlip), the floor paid. Answered — a finger down on the overlay and real
   pointer moves that drag the mark back toward the middle every frame — it
   is HELD to the end and pays. Real PointerEvents on the overlay, the v18.3
   law: a minigame probe drives the REAL input path. */
r = await runEvent({ kind: 'steady', secs: 4, amp0: 1.3, amp1: 1.6, tug0: 0.5, tug1: 0.6, grace: 0.5, lead: 0.2,
                     award: { stat: 'awareness', lo: -3, hi: 2 }, slipTag: '__sslip' }, null);
K.evSteadySlips = r.kind === 'steady' && !r.ok && r.delta === -3 && await p.evaluate(() => window.__sslip >= 1);
r = await runEvent({ kind: 'steady', secs: 2.5, amp0: 0.5, amp1: 0.7, tug0: 0.2, tug1: 0.3, grace: 0.8, lead: 0.2,
                     award: { stat: 'awareness', lo: -3, hi: 2 } }, async () => {
  await p.evaluate(() => new Promise(done => {
    const host = document.getElementById('event');
    let x = 200, y = 420, down = false;
    const fire = (type, cx, cy) => host.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', pointerId: 7, isPrimary: true, clientX: cx, clientY: cy, bubbles: true, cancelable: true }));
    const f = () => {
      if (window.__evR !== null) { if (down) fire('pointerup', x, y); return done(); }
      const d = window.__enc.kitDebug().event;
      if (d && d.started && !d.briefing && d.R) {
        if (!down) { fire('pointerdown', x, y); down = true; }
        else { x -= d.mx; y -= d.my; fire('pointermove', x, y); }   // drag the mark back onto the centre
      }
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }));
});
K.evSteadyHeld = r.kind === 'steady' && r.ok && r.score >= 0.6 && r.delta > 0;
/* and its briefing SHOWS the game (Chad's v18.2 rule): the kind's own picture */
r = await runEvent({ kind: 'steady', secs: 0.4, lead: 0.1, grace: 5, brief: 'Keep it in the ring.' }, async () => {
  K.evSteadyIllustrates = await p.evaluate(() => {
    const dm = document.getElementById('evDemo');
    return dm.className === 'steady' && getComputedStyle(dm).display !== 'none'
      && getComputedStyle(dm.querySelector('.dqm')).display !== 'none' && getComputedStyle(dm.querySelector('.dqf')).display !== 'none';
  });
  await tapOnce();                      // START
});
/* v22.0: a TIMED event's own words — `waitWord` until the window opens, `goWord` after */
r = await runEvent({ kind: 'timed', open: 0.5, close: 3, waitWord: 'Hold...', goWord: 'LET GO' }, async () => {
  const before = await p.evaluate(() => document.getElementById('evBtn').textContent);
  await untilT(0.55);
  await p.waitForFunction(() => document.getElementById('evBtn').textContent === 'LET GO', null, { timeout: 20000 }).catch(() => {});
  const after = await p.evaluate(() => document.getElementById('evBtn').textContent);
  K.evTimedWords = before === 'Hold...' && after === 'LET GO';
  await tapOnce();
});
K.evTimedWordsPress = r.ok === true;
/* v18.3: TWO THUMBS. A second finger landing while the first is still down
   is a tap — it was dropped, because the event was still "down". Real
   pointer events on the overlay, the second before the first lifts. */
r = await runEvent({ kind: 'resist', secs: 2, rate0: 0.5, rate1: 0.5, window: 1, grace: 5, lead: 0.1,
                     award: { stat: 'awareness', lo: -3, hi: 2 } }, async () => {
  K.evResistTwoThumbs = await p.evaluate(() => {
    const host = document.getElementById('event');
    const fire = (type, id, x) => host.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', pointerId: id, isPrimary: id === 1, clientX: x, clientY: 500, bubbles: true, cancelable: true }));
    fire('pointerdown', 1, 100); fire('pointerdown', 2, 300); fire('pointerup', 1, 100); fire('pointerup', 2, 300);
    return window.__enc.kitDebug().event.taps === 2;
  });
});
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
  /* v18.2: a briefing that names no picture still SHOWS its game — the
     kind's own (EV_DEMO: a sequence is the bar), drawn, not hidden */
  K.evBriefIllustrates = await p.evaluate(() => {
    const dm = document.getElementById('evDemo');
    return dm.className === 'bar' && getComputedStyle(dm).display !== 'none'
      && getComputedStyle(dm.querySelector('.dbar')).display !== 'none';
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
/* v14.13 · THE MINIGAME GUARD. Chad, of the LP Tim Khun Paen: "Reduce all
   kinds of damage from minigame events by 50% ... across all minigames
   globally, once equipped ... whether it is sanity, awareness, or wisdom."
   Proven on AWARENESS, which nothing drains, so every number is exact: a
   chapter's own minigame price, a wrong drop, a run of flat-priced misses,
   graded early presses with the ladder's end-netting, a losing payout, and
   a chapter's banked price — each half with the amulet worn and whole
   without it. Gains, and anything that is not a minigame, are untouched. */
const guardAw = v => p.evaluate(x => { window.__enc.stats.awareness = x; }, v);
const aw = () => p.evaluate(() => window.__enc.stats.awareness);
K.guardOffIsWhole = await p.evaluate(() => {
  const e = window.__enc; e.stats.awareness = 50;
  e.kitAward('awareness', -4, { minigame: true });
  return e.evGuard().guard === 0 && e.stats.awareness === 46;
});
K.guardWorn = await p.evaluate(() => {
  const e = window.__enc; e.kit.give('timkp'); e.kit.equip('timkp');
  return e.kit.equipped('timkp') && e.evGuard().guard === 0.5;
});
K.guardHalvesOnlyMinigame = await p.evaluate(() => {
  const e = window.__enc; e.stats.awareness = 50;
  e.kitAward('awareness', -4, { minigame: true }); const half = e.stats.awareness === 48;
  e.kitAward('awareness', -4); const whole = e.stats.awareness === 44;          // not a minigame
  e.kitAward('awareness', 4, { minigame: true }); const gain = e.stats.awareness === 48;   // a gain
  e.stats.wisdom = 50; e.kitAward('wisdom', -6, { minigame: true });
  return half && whole && gain && e.stats.wisdom === 47;
});
await guardAw(50);
r = await runEvent({ kind: 'match', pairs: [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }],
                     secs: 30, fast: 0, slow: 0.05, wrongCost: 4,
                     penalty: { stat: 'awareness' }, award: { stat: 'awareness', lo: -6, hi: 9 } }, async () => {
  await p.evaluate(() => window.__enc.evDrop('a', 'b'));
  K.guardMatchWrongHalf = (await aw()) === 48;
  await p.evaluate(() => { window.__enc.evDrop('a', 'a'); window.__enc.evDrop('b', 'b'); });
});
K.guardPayoutHalf = r.full === -6 && r.delta === -3 && (await aw()) === 45;
await guardAw(50);
r = await runEvent({ kind: 'heartbeat', n: 2, bpm: 120, win: 0.2, zone: 1, lead: 0.4,
                     missCost: 4, penalty: { stat: 'awareness' },
                     award: { stat: 'awareness', per: 1, lo: 0, hi: 8 } }, null);
K.guardMissCostHalf = r.band.length === 2 && r.delta === 0 && (await aw()) === 46;
await guardAw(50);
r = await runEvent({ kind: 'sequence', items: [{ label: 'a' }, { label: 'b' }], each: 2, lead: 0.8, zone: 1,
                     penalty: { stat: 'awareness', per: 1 }, award: { stat: 'awareness', per: 1 } },
                   async () => { await tapOnce(); await untilIdx(1); await tapOnce(); });
/* two BROKEN presses, -4 each on the ladder: -2 each paid on the spot, and
   the end nets the FULL ladder against the FULL price, so owes nothing more */
K.guardGradedHalf = r.sum === -8 && r.delta === 0 && (await aw()) === 46;
K.guardConductHalf = await p.evaluate(() => {
  const e = window.__enc, a0 = e.kit.getConduct().a;
  e.kit.conduct({ a: -4, minigame: true }); const half = e.kit.getConduct().a === a0 - 2;
  e.kit.conduct({ a: 2 });                                     // put the card back as it was
  return half && e.kit.getConduct().a === a0;
});
K.guardOffAgain = await p.evaluate(() => {
  const e = window.__enc; e.kit.take('timkp'); e.stats.awareness = 50;
  e.kitAward('awareness', -4, { minigame: true });
  return e.evGuard().guard === 0 && e.stats.awareness === 46 && !e.kit.has('timkp');
});
/* v17.6: CHOOSE ONE (kit.choose) and the three Sak Yant. The window opens
   in its own state with one card per item and Confirm asleep; Confirm is
   refused with nothing picked and inside the 0.6 s guard; a pick and a
   confirm answer the Promise with that id and hand back play. Then the
   items themselves: a yant worn cannot be moved out of its box, and each
   guard cuts only its own kind of harm (sanity measured with the amulet
   off, so its ward is not in the sum). */
K.chooseOpens = await p.evaluate(() => {
  const e = window.__enc;
  window.__chose = undefined;
  e.kit.choose(['yanthahtaew', 'yantgaoyord']).then(id => { window.__chose = id; });
  const st = e.chooseState();
  const ok = document.getElementById('choOk');
  const refusedEmpty = e.chooseClose('key') === false;
  e.chooseSel(1);
  const refusedGuard = e.chooseClose('key') === false;
  return e.getState() === 'choose' && st.ids.length === 2
    && document.querySelectorAll('#choList .choCard').length === 2
    && !document.getElementById('choose').classList.contains('hide')
    && refusedEmpty && refusedGuard && !ok.disabled
    && document.querySelector('#choList .choCard.on')?.dataset.i === '1';
});
await p.waitForTimeout(800);
/* v17.6b: Confirm SEALS first — the window stays, in its own state, while
   the effect plays, and only then answers and hands back play */
K.chooseSeals = await p.evaluate(() => {
  const e = window.__enc;
  const ok = e.chooseClose('key') === true;
  const st = e.chooseState();
  return ok && st.sealing === true && e.getState() === 'choose' && window.__chose === undefined
    && document.getElementById('choose').classList.contains('sealing');
});
K.chooseAnswers = await until(() => window.__chose === 'yantgaoyord' && window.__enc.getState() === 'play'
                                    && window.__enc.chooseState().ids === null, 60000).then(() => true, () => false);
K.yantGuards = await p.evaluate(() => {
  const e = window.__enc, k = e.kit;
  const hadAm = k.has('amulet'), wornAm = k.equipped('amulet');
  if (hadAm) k.take('amulet');
  const res = {};
  // Gao Yord (v17.6b): a sudden hit, not a minigame's, is cut by 40 %; a minigame's is not
  k.give('yantgaoyord'); k.equip('yantgaoyord');
  e.stats.sanity = 80; e.kitAward('sanity', -10); res.shock = Math.abs(e.stats.sanity - 74) < 1e-9;
  e.stats.sanity = 80; e.kitAward('sanity', -10, { minigame: true }); res.shockNotMini = e.stats.sanity === 70;
  // fixed: a worn yant does not leave its box
  e.invMove('gear', 'body'); res.fixed = k.equipped('yantgaoyord');
  // Hah Taew Chat Petch: the drain guard reads 0.35, the shock guard is gone with Gao Yord
  k.equip('yanthahtaew'); res.drain = e.guards().drain === 0.35 && e.guards().shock === 0;
  e.stats.sanity = 80; e.kitAward('sanity', -10); res.hahNotShock = e.stats.sanity === 70;
  // Sroi Sangwan: the minigame guard at 0.3
  k.equip('yantsroi'); e.stats.awareness = 50;
  e.kitAward('awareness', -10, { minigame: true }); res.ev = e.guards().ev === 0.3 && Math.abs(e.stats.awareness - 43) < 1e-9;
  for (const y of ['yanthahtaew', 'yantsroi', 'yantgaoyord']) k.take(y);
  if (hadAm) { k.give('amulet'); if (wornAm) k.equip('amulet'); k.urge(null); }
  res.clean = !k.has('yanthahtaew') && !k.has('yantsroi') && !k.has('yantgaoyord') && e.guards().drain === 0;
  e.stats.sanity = 100; e.stats.awareness = 50;
  window.__yg = res;
  return Object.values(res).every(Boolean);
});
if (!K.yantGuards) console.log('yant guards', JSON.stringify(await p.evaluate(() => window.__yg)));
/* v24.0 · S47: PICK — a few plain options in the choose window, compact and swatched; refused with nothing picked and
   inside the guard; a pick and a confirm answer at once (no seal) and hand back play */
K.pickOpens = await p.evaluate(() => {
  const e = window.__enc;
  window.__picked = undefined;
  e.kit.pick([{ id: 'sun', label: 'Sunday', color: '#d9342b' }, { id: 'mon', label: 'Monday', color: '#f2c94c', sub: 'yellow' }],
             { title: 'What day were you born?' }).then(id => { window.__picked = id; });
  const st = e.chooseState(), el = document.getElementById('choose');
  const refusedEmpty = e.chooseClose('key') === false;
  e.chooseSel(1);
  const refusedGuard = e.chooseClose('key') === false;
  return e.getState() === 'choose' && st.ids.length === 2 && el.classList.contains('pick')
    && document.querySelectorAll('#choList .pickSw').length === 2 && refusedEmpty && refusedGuard;
});
await p.waitForTimeout(800);
K.pickAnswers = await p.evaluate(() => {
  const e = window.__enc;
  const ok = e.chooseClose('key') === true;
  return ok && e.chooseState().sealing === false;
}) && await until(() => window.__picked === 'mon' && window.__enc.getState() === 'play'
                       && !document.getElementById('choose').classList.contains('pick'), 30000).then(() => true, () => false);

/* v24.0 · S43: THE LEDGER — a write opens the book in its own state with two lines on the page; a REAL click on the
   FACT line inks it and answers 'fact', hands back play and keeps the entry; the same id again answers at once; the
   entry rides worldState and comes back through applyState */
K.ledgerOpens = await p.evaluate(() => {
  const e = window.__enc;
  window.__led = undefined;
  e.kit.ledger.write('fx1', { page: 'test', title: 'WHAT I SAW', prompt: 'the table',
                              fact: 'The cup was moved along the table.', meaning: 'Someone moved the cup to warn me.',
                              brief: 'Write down what you saw.' }).then(k => { window.__led = k; });
  const st = e.ledgerState();
  return e.getState() === 'ledger' && st.open === true && st.mode === 'write' && st.rects === 2
    && !document.getElementById('ledHint').classList.contains('hide');
});
await until(() => window.__enc.ledgerState().k >= 0.99, 30000).catch(() => {});
await p.waitForTimeout(700);
const ledFact = await p.evaluate(() => { const e = window.__enc, st = e.ledgerState(); const i = st.order.indexOf('fact'); return e.ledgerRectScreen(i); });
K.ledgerRectOnScreen = !!ledFact && ledFact.which === 'fact' && ledFact.x > 0 && ledFact.y > 0;
if (ledFact) await p.mouse.click(ledFact.x, ledFact.y);
K.ledgerWrites = await until(() => window.__led === 'fact' && window.__enc.getState() === 'play', 60000).then(() => true, () => false)
  && await p.evaluate(() => { const en = window.__enc.ledgerState().entries; return en.length === 1 && en[0].kind === 'fact' && en[0].id === 'fx1'; });
K.ledgerOnce = await p.evaluate(async () => {
  const e = window.__enc;
  const k = await e.kit.ledger.write('fx1', { page: 'test', fact: 'a', meaning: 'b' });
  return k === 'fact' && e.getState() === 'play' && e.ledgerState().open === false;
});
K.ledgerSaved = await p.evaluate(() => {
  const e = window.__enc, st = e.worldState();
  const inSave = st.ledger && st.ledger.entries.length === 1 && st.ledger.entries[0].kind === 'fact';
  e.kit.ledger.clear();
  const cleared = e.ledgerState().entries.length === 0;
  e.applyState(st);
  const back = e.ledgerState().entries;
  return inSave && cleared && back.length === 1 && back[0].id === 'fx1';
});
K.ledgerBookDown = await until(() => window.__enc.ledgerState().drawn === false, 30000).then(() => true, () => false);

/* v24.0 · S45: RAIN mounts and goes; LIGHTNING lifts the lights it already has and gives them back exactly */
/* (the rain is drawn by the frame: two frames, then look) */
K.rainMounts = await p.evaluate(async () => { const e = window.__enc; e.kit.rain(1); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); const w = e.wxState(); return w.visible && w.k === 1; });
K.lightningLifts = await p.evaluate(() => new Promise(res => {
  const e = window.__enc, h0 = e.wxState().hemi;
  e.kit.lightning({ power: 1, near: 1 });
  let seen = false, lvl = 0, n = 0;
  const f = () => { const w = e.wxState(); if (w.flash && w.hemi > h0 * 1.2) seen = true;
    lvl = Math.max(lvl, e.kit.flashNow());       // (and a chapter can read how bright it is, to light what it painted)
    if (++n > 400) return res(false);
    if (seen && !w.flash) return res(Math.abs(w.hemi - h0) < 1e-6 && lvl > 0.2 && e.kit.flashNow() === 0);
    requestAnimationFrame(f); };
  requestAnimationFrame(f);
}));
K.rainStops = await p.evaluate(async () => { const e = window.__enc; e.kit.rain(0); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); const w = e.wxState(); return !w.visible && w.k === 0; });

/* v24.0 · S44: WHAT CHANGED? — a baseline with no tap, a round where one thing changed (a right tap pays awareness, a
   wrong tap costs sanity, each on the spot), a round where nothing changed and nothing is tapped; apply() runs in the
   dark, onPhase reports each phase */
K.changeRounds = await p.evaluate(() => new Promise(res => {
  const e = window.__enc, cam = e.camera;
  cam.updateMatrixWorld(); const m = cam.matrixWorld.elements;
  const P = { x: m[12], y: m[13], z: m[14] }, fl = Math.hypot(m[8], m[10]) || 1, F = { x: -m[8] / fl, z: -m[10] / fl };
  const at = (dx, dy) => ({ x: P.x + F.x * 3 - F.z * dx, y: P.y + dy, z: P.z + F.z * 3 + F.x * dx });   // 3 m ahead, dx to the right
  const A = at(-0.6, 0), Bp = at(0.6, -0.2);
  e.stats.sanity = 90; e.stats.awareness = 50;
  const log = [], applied = [], paid = {};
  let tapped = false;
  /* each tap is paid ON THE SPOT, so each is measured across its own press (the fixture's world may drain sanity over
     the seconds the event runs; a worn amulet takes a hit before sanity does) */
  const charge = () => (e.ward ? (e.ward().charge || 0) : 0);
  e.kit.event({ kind: 'change', lead: 0.2, dark: 0.35, lit: 1.4, hit: 3, falseCost: 3, miss: 1,
    spots: [{ id: 'a', pos: A }, { id: 'b', pos: Bp }], rounds: [[], ['a'], []],
    apply: r => applied.push(r), onPhase: (r, ph) => log.push(r + ph) }).then(r => {
      res(r.right === 1 && r.wrong === 1 && r.missed === 0 && applied.join() === '1,2'
          && log.includes('1lit') && log.includes('2lit') && log[log.length - 1] === '3end'
          && paid.right === 3 && Math.abs(paid.wrong - 3) < 1e-9);
    });
  const tick = () => {
    const c = e.changeState(); if (!c) return;
    if (c.round === 1 && c.phase === 'lit' && !tapped) {   // (both taps in the one frame that sees it lit: a slow box may show it once)
      tapped = true;
      const a0 = e.stats.awareness, s = e.changeSpotScreen(A); e.evPress(s.x, s.y); e.evRelease(); paid.right = e.stats.awareness - a0;
      const s0 = e.stats.sanity, w0 = charge(); e.evPress(8, 8); e.evRelease(); paid.wrong = (s0 - e.stats.sanity) + (w0 - charge());
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}));
await p.evaluate(() => { const e = window.__enc; e.stats.sanity = 100; e.stats.awareness = 50; });
/* v24.0 · S48: A PHONE IN A FILM — its chat shows while the film runs (a message from them, then his own sent) and is
   gone when the film ends */
K.phoneInFilm = await p.evaluate(() => { const e = window.__enc; window.__phDone = null; window.__phSeen = 0;
  const ok = e.kit.film('phone', { onDone: () => { window.__phDone = true; } });
  const f = () => { const ph = e.filmPhoneState(); if (ph && ph.shown) window.__phSeen = Math.max(window.__phSeen, ph.msgs); if (!window.__phDone) requestAnimationFrame(f); };
  requestAnimationFrame(f);
  return ok; })
  && await until(() => window.__phDone === true && window.__enc.getState() === 'play', 60000).then(() => true, () => false)
  && await p.evaluate(() => window.__phSeen >= 1 && window.__enc.filmPhoneState().shown === false);
/* v24.0 · S46: A CHAPTER'S OWN KIT — the fixture plants a stand of two kinds of its own (a cone, a post) through the
   engine's plantTrees; it lands with one instanced mesh a kind, every spot planted (one marked `always`) */
K.kitStand = await until(() => { const k = window.__enc.stage.kitStandInfo && window.__enc.stage.kitStandInfo(); return !!k && k.parts === 2; }, 60000).then(() => true, () => false)
  && await p.evaluate(() => { const k = window.__enc.stage.kitStandInfo(); return k.planted === 3 && k.inst === 3 && k.kinds === 'cone,post'; });
/* v21.10: THE TWENTY-NINTH SEAM — kit.gallery. It opens in a state of its own on
   the first page not yet read, refuses a turn inside its guard, counts a page
   READ only after it has stood on screen (wall time), turns by a real click on
   the arrow and by real keys, says NEXT until every page is read and then
   CONTINUE, answers the Promise with seenAll true and hands back play; opened
   again with two pages read it starts on the third, and (v21.30) Esc closes
   nothing early — the window stays and says why, and there is no X; a probe's
   close answers seenAll false and the reading so far; opened with every page
   read it is already done, and at its very end Esc is Close gallery. A picture is drawn from its own bytes (an episode-3
   portrait, on the hosted build the suite drives). */
const GAL_PAGES = [
  { id: 'ga', name: 'First master', aka: 'Aka one', plaque: 'Plaque one', lived: '1900 – 1980', era: 'Era one', temple: 'Temple one',
    known: ['Known a', 'Known b', 'Known c'], story: ['Story one, first paragraph.', 'Story one, second.'],
    images: [{ key: 'mstr_lptimpray', mime: 'image/jpeg' }, { key: 'mstr_lptimbench', mime: 'image/jpeg' }] },
  { id: 'gb', name: 'Second master', lived: '1800 – 1880', known: ['Known d'], story: 'Story two.',
    images: [{ key: 'mstr_lpthuad', mime: 'image/png', own: true }] },
  { id: 'gc', name: 'Third master', story: 'Story three, with no picture at all.' },
];
/* (v21.26: the same pages under their own ids, the third with a story too long to stand on the screen — it cannot count
   until it is scrolled, so "Esc closes it early" no longer races the page counting on a loaded box) */
const GAL_LONG = Array.from({ length: 14 }, (_, k) => `Paragraph ${k + 1} of a story long enough to scroll: the words run on past the foot of the column, line after line, so the end of it is somewhere below.`);
const ESC_PAGES = GAL_PAGES.map(q => ({ ...q, id: 'e' + q.id, ...(q.id === 'gc' ? { story: GAL_LONG } : {}) }));
K.galleryOpens = await p.evaluate((pages) => {
  const e = window.__enc;
  window.__gal = undefined;
  /* (v21.26: when page 1 counts is stamped in the page, so a loaded box cannot make it look early — v21.27: from BEFORE
     the window opens: the 1.2 s runs from inside kit.gallery, and stamped after it the work of opening came off the
     measure, leaving 50 ms of margin on a loaded box) */
  window.__galRead0 = null;
  const tOpen = performance.now();
  e.kit.gallery({ pages, label: 'Probe gallery' }).then(r => { window.__gal = r; });
  const iv = setInterval(() => {
    const s0 = e.galleryState();
    if (s0.seen.includes(0)) { window.__galRead0 = performance.now() - tOpen; clearInterval(iv); }
    else if (!s0.open) clearInterval(iv);
  }, 20);
  const st = e.galleryState();
  e.galleryGo(1);                                              // inside the guard: refused
  const held = e.galleryState().i === 0;
  return e.getState() === 'gallery' && st.open && st.n === 3 && st.i === 0 && !st.done && held
    && e.kit.galleryOpen() === true
    && !document.getElementById('gallery').classList.contains('hide')
    && document.querySelectorAll('#galThumbs .galThumb').length === 3
    && document.getElementById('galName').textContent === 'First master'
    && document.querySelectorAll('#galPips button').length === 2
    && document.getElementById('galGo').textContent === 'Next';
}, GAL_PAGES);
/* a page is not read at once, and is read after it has stood (v21.26: measured in the page — it counts no sooner than
   GAL_DWELL after the window opened; a separate round trip read it as "already read" on a loaded box) */
/* (v21.27: and until the page's own watcher has written WHEN — polling `seen` alone could see the page count before
   the 20 ms watcher did, and read the stamp as null: a pass reported as a fail, the stamp 2568 ms a moment later) */
K.galleryReadsOne = await until(() => window.__enc.galleryState().seen.includes(0) && window.__galRead0 != null, 30000).then(() => true, () => false);
K.galleryNotAtOnce = await p.evaluate(() => window.__galRead0 != null && window.__galRead0 >= 750);   // (v21.30: GAL_DWELL 800, was 1200)
if (!K.galleryNotAtOnce) console.log('gallery not at once', await p.evaluate(() => window.__galRead0));
K.galleryPicture = await until(() => {
  const cv = document.getElementById('galImg'); if (!cv || !cv.width) return false;
  const g = cv.getContext('2d'), d = g.getImageData(cv.width >> 1, cv.height >> 1, 1, 1).data;
  return cv.width > 60 && d[3] === 255;                        // the photograph is drawn, opaque
}, 30000).then(() => true, () => false);
await p.waitForTimeout(500);                                   // past the guard, certainly
await p.click('#galNext');                                     // a real click on the arrow
K.galleryClickTurns = await until(() => window.__enc.galleryState().i === 1, 15000).then(() => true, () => false);
K.galleryReadsTwo = await until(() => window.__enc.galleryState().seen.includes(1), 30000).then(() => true, () => false);
await p.keyboard.press('End');                                 // a real key: the last page
K.galleryKeyTurns = await until(() => window.__enc.galleryState().i === 2, 15000).then(() => true, () => false);
K.galleryDone = await until(() => {
  const st = window.__enc.galleryState();
  return st.done && st.seen.length === 3 && document.getElementById('galBox').classList.contains('done')
    && document.getElementById('galGo').textContent === 'Close gallery' && document.getElementById('galGo').classList.contains('fin');
}, 30000).then(() => true, () => false);
await p.waitForTimeout(900);                                   // (v21.23: the close is not taken in the 0.8 s after the last page counts)
await p.keyboard.press('Enter');                               // Close gallery (v21.25: it was CONTINUE)
K.galleryAnswers = await until(() => window.__gal && window.__enc.getState() === 'play' && !window.__enc.galleryState().open, 30000)
  .then(() => p.evaluate(() => window.__gal.seenAll === true && window.__gal.seen.join() === 'ga,gb,gc'), () => false);
await p.waitForTimeout(800);                                   // (v21.23: the window does not reopen within 0.6 s of a close)
K.galleryResumes = await p.evaluate((pages) => {
  const e = window.__enc;
  window.__gal = undefined;
  e.kit.gallery({ pages, seen: ['ega', 'egb'] }).then(r => { window.__gal = r; });
  const st = e.galleryState();
  return st.open && st.i === 2 && st.seen.length === 2 && !st.done;
}, ESC_PAGES);
await p.waitForTimeout(600);
/* v21.30 · Esc CLOSES NOTHING EARLY (Chad: "do not allow the player to close the window, remove the X button ... they
   must finish the entire experience and read everything, before they can close at the very end"): pressed with a page
   still unread the window stays and its hint says why — and the X is not there at all. (The probe's own close then
   answers the reading so far, as a chapter torn down in the middle of the gallery would be answered) */
await p.keyboard.press('Escape');
await p.waitForTimeout(1200);
K.galleryEscStays = await p.evaluate(() => window.__gal === undefined && window.__enc.getState() === 'gallery' && window.__enc.kit.galleryOpen()
  && /closes at the end/.test(document.getElementById('galHint').textContent));
K.galleryNoX = await p.evaluate(() => !document.getElementById('galX') && !document.querySelector('#gallery .galX'));
if (!K.galleryEscStays) console.log('gallery esc', JSON.stringify(await p.evaluate(() => ({ gal: window.__gal, st: window.__enc.getState(), hint: document.getElementById('galHint').textContent }))));
await p.evaluate(() => window.__enc.galleryClose('x'));
K.galleryProbeCloseAnswers = await until(() => window.__gal && window.__enc.getState() === 'play', 30000)
  .then(() => p.evaluate(() => window.__gal.seenAll === false && window.__gal.seen.join() === 'ega,egb'), () => false);
await p.waitForTimeout(800);
/* v21.25: every page read, it opens DONE on the first page — and NEXT is still NEXT there (not the close), the
   next page by name; two presses inside one turn turn once; the close is only on the last page */
K.galleryAllReadOpensDone = await p.evaluate((pages) => {
  const e = window.__enc;
  window.__gal = undefined;
  e.kit.gallery({ pages, seen: ['ga', 'gb', 'gc'] }).then(r => { window.__gal = r; });
  const st = e.galleryState();
  return st.open && st.done && st.i === 0 && document.getElementById('galGo').textContent === 'Next'
    && document.getElementById('galEndN').textContent === 'Second master' && !st.next.close && !st.next.locked;
}, GAL_PAGES);
await p.waitForTimeout(600);
/* two presses inside one turn, both in ONE task: on a box drawing a frame a second, two real clicks 120 ms apart land
   a second or more apart (each waits for the button to hold still over two frames), past GAL_TURN, and the second
   rightly turns again — so the gap itself is pressed here, and a real click turns the next page */
await p.evaluate(() => { const g = document.getElementById('galGo'); g.click(); g.click(); });
await p.waitForTimeout(250);
K.galleryOneTurnAtATime = await p.evaluate(() => window.__enc.galleryState().i === 1 && window.__enc.galleryState().open);
await p.waitForTimeout(600);
await p.click('#galGo');
K.galleryCloseOnlyOnLast = await until(() => {
  const st = window.__enc.galleryState(), go = document.getElementById('galGo');
  return st.open && st.i === 2 && go.textContent === 'Close gallery' && go.classList.contains('fin') && st.next.close;
}, 15000).then(() => true, () => false);
if (!K.galleryOneTurnAtATime || !K.galleryCloseOnlyOnLast) console.log('gallery turns', JSON.stringify(await p.evaluate(() => window.__enc.galleryState())));
await p.waitForTimeout(600);
/* v21.30: at the very end — the last page, every story read — Esc is Close gallery, as Enter is (the X that closed it
   here until v21.30 is gone). (A window a failed check above already closed is not pressed: the check fails, the run
   goes on) */
const endOpen = await p.evaluate(() => window.__enc.kit.galleryOpen());
if (endOpen) await p.keyboard.press('Escape');
K.galleryEscAtEndCloses = endOpen && await until(() => window.__gal && window.__enc.getState() === 'play', 30000)
  .then(() => p.evaluate(() => window.__gal.seenAll === true && !window.__enc.kit.galleryOpen()), () => false);
if (!K.galleryEscAtEndCloses) await p.evaluate(() => window.__enc.galleryClose('x')).catch(() => {});
/* v21.25 · NEXT IS ALWAYS THE NEXT PAGE (Chad: "if i accidentally moved to the next monk and moved back to the previous
   one, the next button [went] to the next monk after the next ... if i already finished all monks and went back to an
   earlier one, the button below becomes continue, and ends the whole window"). Page 1 visited and read, back to page 0:
   NEXT opens page 1, never 2. Every page read and back on page 0: NEXT, not the close, and it opens page 1. */
await p.waitForTimeout(800);
await p.evaluate((pages) => { window.__gal = undefined; window.__enc.kit.gallery({ pages, label: 'Order' }).then(r => { window.__gal = r; }); }, GAL_PAGES);
await until(() => window.__enc.galleryState().seen.includes(0), 30000).catch(() => {});
await p.waitForTimeout(550);
await p.click('#galNext');                                     // on to page 1 ...
await until(() => window.__enc.galleryState().seen.includes(1), 30000).catch(() => {});
await p.waitForTimeout(550);
await p.click('#galPrev');                                     // ... and back
await until(() => window.__enc.galleryState().i === 0, 15000).catch(() => {});
const ord0 = await p.evaluate(() => ({ go: document.getElementById('galGo').textContent, end: document.getElementById('galEndN').textContent }));
await p.waitForTimeout(550);
await p.click('#galGo');
K.galleryNextNeverSkips = await until(() => window.__enc.galleryState().i === 1, 15000).then(() => true, () => false)
  && ord0.go === 'Next' && ord0.end === 'Second master';
await p.waitForTimeout(550);
await p.click('#galGo');                                       // page 2, the last
await until(() => window.__enc.galleryState().done, 30000).catch(() => {});
await p.waitForTimeout(950);
await p.click('#galPrev'); await p.waitForTimeout(550); await p.click('#galPrev');
await until(() => window.__enc.galleryState().i === 0, 15000).catch(() => {});
const ord1 = await p.evaluate(() => ({ go: document.getElementById('galGo').textContent, fin: document.getElementById('galGo').classList.contains('fin'),
                                      end: document.getElementById('galEndN').textContent, done: window.__enc.galleryState().done }));
await p.waitForTimeout(550);
await p.click('#galGo');
K.galleryDoneStillNext = await until(() => window.__enc.galleryState().i === 1 && window.__enc.galleryState().open, 15000).then(() => true, () => false)
  && ord1.done && ord1.go === 'Next' && !ord1.fin && ord1.end === 'Second master';
if (!K.galleryNextNeverSkips || !K.galleryDoneStillNext) console.log('gallery order', JSON.stringify({ ord0, ord1, st: await p.evaluate(() => window.__enc.galleryState()) }));
await p.evaluate(() => window.__enc.galleryClose('x'));
await until(() => window.__enc.getState() === 'play' && !window.__enc.kit.galleryOpen(), 30000).catch(() => {});
/* v21.23: THE GALLERY'S WHEEL (Chad: "when i tried on desktop and mouse scroll to the bottom, it immediately jumped to
   the bottom of the next page"). On pages whose stories scroll: a spin from the top stops at the END of the story and
   turns nothing; a fresh pull from the end turns ONCE, to the page NEXT would open, and that page opens at its TOP —
   the rest of the spin never reaches it; a spin over the portrait scrolls the story; one sideways swipe turns one page;
   the end mark names where it leads. Every burst is dispatched in ONE synchronous task, so no stall on a loaded box
   can split a spin into two gestures; the quiet between bursts is a wait, and a stall only lengthens it. Where the
   window lets an event through, the browser's own scroll is applied by hand (an untrusted event does not scroll). */
const LONG = Array.from({ length: 14 }, (_, k) => `Paragraph ${k + 1} of a story long enough to scroll: the words run on past the foot of the column, line after line, so the end of it is somewhere below.`);
const WHEEL_PAGES = [
  { id: 'wa', name: 'Wheel one', story: LONG },
  { id: 'wb', name: 'Wheel two', story: LONG },
  { id: 'wc', name: 'Wheel three', story: LONG },
];
/* v21.25 · A STORY IS READ, NOT SCROLLED PAST (Chad: "i dont want players to just mindlessly and quickly scroll through
   all the stories or to spam next, or spam flip"). A long story spun to its end at once is NOT read: its reading
   cursor climbs at the reading pace and no faster; while it does, every way forward is refused — NEXT, the end mark,
   the → arrow and key, End, a digit, a later thumbnail, the wheel's pull, a sideways swipe on the wheel, a finger's
   swipe — and ← round to the last page too, and each says why; Esc still closes the window. */
await p.waitForTimeout(800);
await p.evaluate((pages) => { window.__gal = undefined; window.__enc.kit.gallery({ pages, label: 'Lock' }).then(r => { window.__gal = r; }); }, WHEEL_PAGES);
await p.waitForTimeout(900);                                    // past the guard
const L = await p.evaluate(async () => {
  const E = window.__enc, sleep = ms => new Promise(r => setTimeout(r, ms)), G = () => E.galleryState();
  const sc = () => { const rt = document.getElementById('galRight'); return getComputedStyle(rt).display === 'contents' ? document.getElementById('galPage') : rt; };
  const story = document.getElementById('galStory');
  const wheel = (el, n, dy, dx = 0) => {
    for (let k = 0; k < n; k++) {
      const r = el.getBoundingClientRect();
      const ev = new WheelEvent('wheel', { deltaY: dy, deltaX: dx, bubbles: true, cancelable: true, clientX: r.left + 5, clientY: r.top + 5 });
      el.dispatchEvent(ev);
      if (!ev.defaultPrevented && dy) { const s = sc(); if (s.contains(el) && !s.classList.contains('hold')) s.scrollTop += dy; }
    }
  };
  const out = {};
  wheel(story, 60, 100);                                       // spun straight to the end
  await sleep(1500);
  const a = G(), c1 = a.cur;
  out.atEnd = sc().scrollTop >= sc().scrollHeight - sc().clientHeight - 2;
  out.notRead = a.i === 0 && a.seen.length === 0 && a.next.locked && !a.next.close;
  out.shown = document.getElementById('galGo').classList.contains('locked') && document.getElementById('galEnd').classList.contains('locked');
  out.cursorPaced = c1 > 0.02 && c1 < 0.9 && a.words > 150;
  const tries = {};
  const stays = async (name, fn) => { await sleep(560); fn(); await sleep(150); tries[name] = G().i === 0; };
  await stays('next', () => document.getElementById('galGo').click());
  out.nopeSays = /fills up as you read/i.test(document.getElementById('galHint').textContent) && !document.getElementById('galHint').classList.contains('gone');
  await stays('endMark', () => document.getElementById('galEndGo').click());
  await stays('arrow', () => document.getElementById('galNext').click());
  const kd = code => document.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true, cancelable: true }));
  await stays('keyRight', () => kd('ArrowRight'));
  await stays('keyEnd', () => kd('End'));
  await stays('digit', () => kd('Digit3'));
  await stays('enter', () => kd('Enter'));
  await stays('thumb', () => document.querySelector('#galThumbs .galThumb[data-i="1"]').click());
  out.nopeOnThumb = document.querySelector('#galThumbs .galThumb[data-i="1"]').classList.contains('nope');   // v21.26: the one pressed shakes
  await stays('pull', async () => { wheel(story, 8, 100); });
  await sleep(400);
  await stays('wheelSide', () => wheel(story, 30, 0, 12));
  /* v21.27: a sideways swipe that did not turn leaves the wheel free — the story scrolls back up at once (v21.26 locked
     every wheel event for 0.7 s and more after it, turned or not) */
  out.sideFree = (() => {
    const r = story.getBoundingClientRect();
    const up = new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true, clientX: r.left + 5, clientY: r.top + 5 });
    story.dispatchEvent(up);
    return !up.defaultPrevented;
  })();
  await sleep(400);
  const body = document.getElementById('galBody');
  const pe = (type, id, x) => body.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', isPrimary: true,
    clientX: x, clientY: 300, bubbles: true, cancelable: true }));
  await stays('swipe', () => { pe('pointerdown', 9, 600); pe('pointermove', 9, 480); pe('pointermove', 9, 330); pe('pointerup', 9, 330); });
  await stays('backStops', () => document.getElementById('galPrev').click());   // ← on the first page (v21.26: it stops; it went round)
  out.tries = tries;
  out.allRefused = Object.values(tries).every(Boolean);
  out.thumbLocked = document.querySelector('#galThumbs .galThumb[data-i="2"]').classList.contains('locked');
  const c2 = G().cur;
  out.cursorClimbs = c2 > c1;
  out.curEnd = c2;
  return out;
});
K.galleryLongNotReadAtOnce = !!(L.atEnd && L.notRead && L.shown && L.cursorPaced);
K.galleryLockedRefusesAll = !!(L.allRefused && L.cursorClimbs && L.thumbLocked);
K.galleryRefusedSwipeFreesWheel = !!L.sideFree;
K.galleryLockedSaysWhy = !!L.nopeSays;
if (!K.galleryLongNotReadAtOnce || !K.galleryLockedRefusesAll || !K.galleryLockedSaysWhy) console.log('gallery lock', JSON.stringify(L));
await p.keyboard.press('Escape');                               // v21.30: and Esc does not let him out early
await p.waitForTimeout(900);
K.galleryLockedEscStays = await p.evaluate(() => window.__gal === undefined && window.__enc.getState() === 'gallery' && window.__enc.kit.galleryOpen());
await p.evaluate(() => window.__enc.galleryClose('x'));         // (the probe's own close: the reading so far, none)
K.galleryLockedProbeAnswers = await until(() => window.__gal && window.__enc.getState() === 'play', 30000)
  .then(() => p.evaluate(() => window.__gal.seenAll === false && window.__gal.seen.length === 0), () => false);
K.galleryNopeOnPressed = !!L.nopeOnThumb;
/* v21.26: a window closed by accident and opened again finds the page's reading where it was (it went back to 0) */
await p.waitForTimeout(800);
K.galleryReadingKept = await p.evaluate((pages) => {
  window.__enc.kit.gallery({ pages, label: 'Lock again' });
  const st = window.__enc.galleryState();
  return st.open && st.i === 0 && st.cur >= 0.02;
}, WHEEL_PAGES).then(ok => ok && L.curEnd > 0.02);
if (!K.galleryReadingKept) console.log('gallery reading kept', JSON.stringify({ curEnd: L.curEnd, st: await p.evaluate(() => window.__enc.galleryState()) }));
await p.waitForTimeout(600);
await p.evaluate(() => window.__enc.galleryClose('x'));
await until(() => window.__enc.getState() === 'play' && !window.__enc.kit.galleryOpen(), 30000).catch(() => {});
await p.waitForTimeout(800);
/* (the wheel's own mechanics below, on pages already read — the reading is proved above) */
await p.evaluate((pages) => { window.__gal = undefined; window.__enc.kit.gallery({ pages, label: 'Wheel', seen: ['wa', 'wb', 'wc'] }).then(r => { window.__gal = r; }); }, WHEEL_PAGES);
await p.waitForTimeout(900);                                    // past the guard
const W = await p.evaluate(async () => {
  const E = window.__enc, sleep = ms => new Promise(r => setTimeout(r, ms));
  const sc = () => { const pg = document.getElementById('galPage'); return getComputedStyle(pg).overflowY === 'auto' ? pg : document.getElementById('galRight'); };
  const burst = (el, n, dy, dx = 0) => {
    for (let k = 0; k < n; k++) {
      const r = el.getBoundingClientRect();
      const ev = new WheelEvent('wheel', { deltaY: dy, deltaX: dx, bubbles: true, cancelable: true, clientX: r.left + 5, clientY: r.top + 5 });
      el.dispatchEvent(ev);
      /* (the browser's own scroll, as a real one does it: not when cancelled, and never on a held column — v21.23's
         hold makes it unscrollable, which is what stops even an uncancellable event) */
      if (!ev.defaultPrevented && dy) { const s = sc(); if (s.contains(el) && !s.classList.contains('hold')) s.scrollTop += dy; }
    }
  };
  const st = () => ({ i: E.galleryState().i, top: Math.round(sc().scrollTop), max: sc().scrollHeight - sc().clientHeight });
  const out = {};
  out.scrolls = st().max > 300;
  burst(document.getElementById('galStory'), 40, 100);          // a fast spin, on well past the end
  await sleep(500);
  const s1 = st(); out.spinStopsAtEnd = s1.i === 0 && s1.top >= s1.max - 2;
  out.endNames = document.getElementById('galEndN')?.textContent === 'Wheel two';
  burst(document.getElementById('galStory'), 8, 100);           // a fresh pull from the end
  out.holdOnTurn = sc().classList.contains('hold');             // (v21.23: the new page held while the spin goes on)
  await sleep(1100);
  const s2 = st(); out.pullTurnsOnce = s2.i === 1; out.newPageAtTop = s2.top === 0;
  /* (and given back once the wheel is quiet — by the window's own frame, the first drawn after the quiet: polled, since
     on a loaded box a frame can come later than any fixed wait's margin, and a fixed wait is then a coin toss — v8.7) */
  for (const tq = performance.now(); sc().classList.contains('hold') && performance.now() - tq < 8000; ) await sleep(100);
  out.holdReleased = !sc().classList.contains('hold');
  burst(document.getElementById('galImg'), 3, 100);             // a spin over the portrait: the story scrolls
  await sleep(500);
  const s3 = st(); out.portraitScrolls = s3.i === 1 && s3.top === 300;
  await sleep(500);
  burst(document.getElementById('galStory'), 30, 0, 12);        // one sideways swipe
  await sleep(1100);
  out.swipeTurnsOne = st().i === 2;
  /* a held key's repeats turn nothing (held, → ran the pages round at the keyboard's repeat rate); a press does */
  const kd = (code, repeat) => document.dispatchEvent(new KeyboardEvent('keydown', { code, repeat, bubbles: true, cancelable: true }));
  const i0 = st().i;
  kd('ArrowLeft', true); kd('ArrowLeft', true); kd('ArrowLeft', true);
  out.repeatTurnsNothing = st().i === i0;
  kd('ArrowLeft', false);
  out.pressTurns = st().i === (i0 + 2) % 3;
  await sleep(700);                                             // (v21.25: one turn at a time — past GAL_TURN)
  /* touch: a second finger is a pinch, never a swipe; a swipe the system took over (pointercancel) turns nothing; a
     swipe lifted turns one page, and leaves the page unshifted */
  const body = document.getElementById('galBody');
  const pe = (type, id, x) => body.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', isPrimary: id === 1,
    clientX: x, clientY: 300, bubbles: true, cancelable: true }));
  const i1 = st().i;
  pe('pointerdown', 1, 400); pe('pointerdown', 2, 520); pe('pointermove', 2, 420); pe('pointermove', 2, 260);
  pe('pointerup', 2, 260); pe('pointerup', 1, 400);
  out.pinchTurnsNothing = st().i === i1;
  pe('pointerdown', 3, 600); pe('pointermove', 3, 480); pe('pointermove', 3, 330); pe('pointercancel', 3, 330);
  out.cancelTurnsNothing = st().i === i1;
  pe('pointerdown', 4, 600); pe('pointermove', 4, 480); pe('pointermove', 4, 330); pe('pointerup', 4, 330);
  out.swipeLiftedTurns = st().i === (i1 + 1) % 3;
  const pg = document.getElementById('galPage');
  out.swipeLeavesNoShift = !pg.classList.contains('drag') && !pg.style.transform;
  return out;
});
K.galleryWheelScrolls = W.scrolls;
K.galleryWheelStopsAtEnd = W.spinStopsAtEnd;
K.galleryWheelEndNames = W.endNames;
K.galleryWheelPullOnce = W.pullTurnsOnce;
K.galleryWheelNewPageTop = W.newPageAtTop;
K.galleryWheelHold = !!(W.holdOnTurn && W.holdReleased);
K.galleryWheelPortrait = W.portraitScrolls;
K.galleryWheelSwipeOne = W.swipeTurnsOne;
K.galleryKeyRepeatTurnsNothing = W.repeatTurnsNothing && W.pressTurns;
K.galleryPinchTurnsNothing = W.pinchTurnsNothing;
K.gallerySwipeCancelTurnsNothing = W.cancelTurnsNothing;
K.gallerySwipeTurnsOne = W.swipeLiftedTurns && W.swipeLeavesNoShift;
if (!Object.values(W).every(Boolean)) console.log('gallery wheel', JSON.stringify(W));
await p.evaluate(() => window.__enc.galleryClose('x'));       // (the X's own path: play again, as the film below needs)
await until(() => window.__enc.getState() === 'play' && !window.__enc.kit.galleryOpen(), 30000).catch(() => {});
await p.waitForTimeout(500);
/* v21.26: THE ARROWS STOP AT THE ENDS — every page read, on the last page → stays (the way on is Close gallery; it went
   round to the first master), and on the first page ← stays */
await p.evaluate(() => { if (window.__enc.kit.galleryOpen()) window.__enc.galleryClose('x'); });
await until(() => window.__enc.getState() === 'play' && !window.__enc.kit.galleryOpen(), 30000).catch(() => {});
await p.waitForTimeout(800);
/* (v21.27: in braces — returned, the window's own promise was the evaluate's answer, and it waits for the window to
   CLOSE: the run hung here for good, since only the next step closes it) */
await p.evaluate((pages) => { window.__enc.kit.gallery({ pages, label: 'Ends', seen: pages.map(q => q.id), start: 2 }); }, WHEEL_PAGES);
await p.waitForTimeout(900);
await p.keyboard.press('ArrowRight');
await p.waitForTimeout(700);
const endR = await p.evaluate(() => ({ i: window.__enc.galleryState().i, go: document.getElementById('galGo').textContent, nextLocked: document.getElementById('galNext').classList.contains('locked') }));
await p.keyboard.press('Home');
await until(() => window.__enc.galleryState().i === 0, 15000).catch(() => {});
await p.waitForTimeout(700);
await p.keyboard.press('ArrowLeft');
await p.waitForTimeout(700);
const endL = await p.evaluate(() => ({ i: window.__enc.galleryState().i, prevLocked: document.getElementById('galPrev').classList.contains('locked') }));
K.galleryArrowsStopAtEnds = endR.i === 2 && endR.go === 'Close gallery' && endR.nextLocked && endL.i === 0 && endL.prevLocked;
if (!K.galleryArrowsStopAtEnds) console.log('gallery ends', JSON.stringify({ endR, endL }));
await p.evaluate(() => window.__enc.galleryClose('x'));
await until(() => window.__enc.getState() === 'play' && !window.__enc.kit.galleryOpen(), 30000).catch(() => {});
/* v21.27: ONE NOTCH NEVER TURNS. A page whose last line came on screen since the last frame counts INSIDE the wheel
   event, and is pulled on like any other — two notches, then the rest of the spin held. v21.26 read the lock as of the
   last frame and pressed NEXT to say why, and NEXT, counting the page, turned it on the one notch with nothing to hold
   the spin. Opened and spun in ONE task, with no frame between (a busy wait past the page's 0.8 s — 1.2 until v21.30), so a loaded box
   cannot change what is tested. */
await p.waitForTimeout(800);
const NOTCH_PAGES = [
  { id: 'na', name: 'Notch one', story: 'A short story.' },
  { id: 'nb', name: 'Notch two', story: 'A short story.' },
  { id: 'nc', name: 'Notch three', story: 'A short story.' },
];
const N = await p.evaluate((pages) => {
  const E = window.__enc;
  E.kit.gallery({ pages, label: 'Notch' });
  const story = document.getElementById('galStory');
  const notch = () => {
    const r = story.getBoundingClientRect();
    const ev = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true, clientX: r.left + 5, clientY: r.top + 5 });
    story.dispatchEvent(ev); return ev.defaultPrevented;
  };
  const s0 = E.galleryState(), before = { open: s0.open, i: s0.i, seen: s0.seen.length };
  const t0 = performance.now(); while (performance.now() - t0 < 1500) { /* no frame runs */ }
  notch();
  const one = E.galleryState();
  notch();
  const two = E.galleryState();
  const third = notch();
  const held = ['galPage', 'galRight'].some(id => document.getElementById(id).classList.contains('hold'));
  return { before, oneI: one.i, oneSeen: one.seen.includes(0), twoI: two.i, held, third };
}, NOTCH_PAGES);
K.galleryWheelNotchNoTurn = N.before.open && N.before.i === 0 && N.before.seen === 0 && N.oneI === 0 && N.oneSeen
  && N.twoI === 1 && N.held && N.third;
if (!K.galleryWheelNotchNoTurn) console.log('gallery notch', JSON.stringify(N));
await p.waitForTimeout(800);
await p.evaluate(() => window.__enc.galleryClose('x'));
await until(() => window.__enc.getState() === 'play' && !window.__enc.kit.galleryOpen(), 30000).catch(() => {});
/* v21.30: THE THIRTIETH SEAM — kit.captions. Two lines, each in its own window of wall time: the first up at once with
   its words and its meaning under them, then the second; null takes it down. (Windows of seconds, not tenths: on a box
   drawing a frame a second a tenth-of-a-second window is never painted at all) */
await p.evaluate(() => window.__enc.kit.captions([{ at: 0, end: 6, text: 'Line one', sub: 'Meaning one' }, { at: 8, end: 16, text: 'Line two', sub: 'Meaning two' }]));
K.captionFirst = await until(() => { const el = document.getElementById('caption');
  return el.classList.contains('on') && el.querySelector('.capMain').textContent === 'Line one' && el.querySelector('.capSub').textContent === 'Meaning one'
    && getComputedStyle(el).display !== 'none'; }, 15000).then(() => true, () => false);
K.captionSecond = await until(() => { const el = document.getElementById('caption');
  return el.classList.contains('on') && el.querySelector('.capMain').textContent === 'Line two' && el.querySelector('.capSub').textContent === 'Meaning two'; }, 30000)
  .then(() => true, () => false);
await p.evaluate(() => window.__enc.kit.captions(null));
K.captionCleared = await until(() => !document.getElementById('caption').classList.contains('on') && window.__enc.kit.captionNow() === null, 15000)
  .then(() => true, () => false);
/* v21.0: THE TWENTY-SIXTH SEAM — kit.film. From play, a declared film runs
   (state cine, the HUD hidden); at its end the state is PLAY again, no card;
   the black it ended on is the kit's, the chapter's onDone ran under it and
   put the player where it said; and a kit.fade lifts it. Then again, SKIPPED
   past the 3.0 s mark: the same hand-back. */
const filmGo = () => p.evaluate(() => {
  const e = window.__enc;
  window.__filmDone = null;
  const at = { x: e.yaw.position.x + 1.5, z: e.yaw.position.z - 1.0 };
  window.__filmAt = at;
  const ok = e.kit.film('probe', { onDone: (r) => {
    e.yaw.position.x = at.x; e.yaw.position.z = at.z;
    window.__filmDone = { st: e.getState(), fade: e.kit.getFade(), skipped: !!r.skipped };
    e.kit.fade(0, 0.3);
  } });
  return ok && e.getState() === 'cine' && document.getElementById('hud').classList.contains('hide')
    && e.kit.filmPlaying() === 'probe';
});
const filmBack = (skipped) => until(() => window.__filmDone && window.__enc.getState() === 'play', 60000).then(() => p.evaluate((sk) => {
  const e = window.__enc, d = window.__filmDone, at = window.__filmAt;
  return d.st === 'play' && d.fade > 0.9 && d.skipped === sk && e.kit.filmPlaying() === null
    && Math.abs(e.yaw.position.x - at.x) < 1e-6 && Math.abs(e.yaw.position.z - at.z) < 1e-6
    && !document.getElementById('hud').classList.contains('hide')
    && e.handsRoot.visible === true;          // v21.1: the film hid them; play always shows them
}, skipped), () => false);
const posFilm0 = await p.evaluate(() => ({ x: window.__enc.yaw.position.x, z: window.__enc.yaw.position.z }));
K.filmFromPlay = await filmGo();
K.filmBackToPlay = await filmBack(false);
K.filmFadeLifts = await until(() => window.__enc.kit.getFade() < 0.02, 30000).then(() => true, () => false);
K.filmSkip = await filmGo();
if (K.filmSkip) {
  /* a DECLARED film is refused while the game is not in play (here: another
     film is running) — the 'nope' check below only proves an undeclared key */
  K.filmRefusedOutOfPlay = await p.evaluate(() => { const e = window.__enc; return e.getState() === 'cine' && e.kit.film('probe') === false; });
  await until(() => window.__enc.cine.t() > 3.05, 60000).catch(() => {});
  await p.evaluate(() => window.__enc.cine.skip());
  K.filmSkip = await filmBack(true);
}
K.filmRefusedUndeclared = await p.evaluate(() => window.__enc.kit.film('nope') === false);
await until(() => window.__enc.kit.getFade() < 0.02, 30000).catch(() => {});
await p.evaluate((q) => { const e = window.__enc; e.yaw.position.x = q.x; e.yaw.position.z = q.z; }, posFilm0);
/* v21.0: FOCUS, GRADED (opt-in) — a thing noticed at once is a high band; a
   tap on nothing is BROKEN and costs the penalty stat THERE AND THEN; a
   briefing with no demo of its own shows the kind's picture, 'spot' */
/* the miss is priced in AWARENESS here, which nothing but a minigame guard
   touches (none is worn by now) — sanity would be soaked by the amulet's ward */
const awG = await p.evaluate(() => { window.__enc.stats.awareness = 40; return 40; });
r = await runEvent({ kind: 'focus', graded: true, targets: [{ sx: 0.5, sy: 0.5, label: 'here' }, { sx: 0.5, sy: 0.5 }], each: 3,
                     missCost: 3, penalty: { stat: 'awareness' }, award: { stat: 'sanity', per: 1, hi: 6 } },
                   async () => {
  await untilDot();
  K.focusLabel = await p.evaluate(() => document.querySelector('#evDot .dlab').textContent === 'here'
    && document.getElementById('evDot').classList.contains('graded'));
  await tapOnce();                                                            // at the centre, at once: a high band
  await untilIdx(1); await untilDot();
  await p.evaluate(() => { window.__enc.evPress(5, 5); window.__enc.evRelease(); });   // the corner: nothing there
  await untilIdx(1);
  await p.evaluate(() => { window.__enc.evPress(); window.__enc.evRelease(); });
});
K.focusGraded = r.kind === 'focus' && r.band.length >= 2 && r.band[0] >= 1 && r.band.includes(-4);
K.focusMissCosts = await p.evaluate((a0) => Math.abs(window.__enc.stats.awareness - (a0 - 3)) < 1e-9, awG);
/* v21.1: a graded light the player never turns to still expires — out of
   sight for `lost` seconds running it is MISSED, as if its ring had closed
   (the event used to wait for ever). Both lights stand behind the lens */
const behind = await p.evaluate(() => { const e = window.__enc, ry = e.yaw.rotation.y;
  return { x: e.yaw.position.x + Math.sin(ry) * 6, y: 1.2, z: e.yaw.position.z + Math.cos(ry) * 6 }; });
r = await runEvent({ kind: 'focus', graded: true, targets: [behind, behind], each: 3, lost: 1.0,
                     missCost: 0, penalty: { stat: 'awareness' }, award: { stat: 'sanity', per: 1, hi: 6 } });
K.focusUnseenExpires = r.kind === 'focus' && Array.isArray(r.band) && r.band.length === 2 && r.band.every(b => b === -4);
if (!K.focusUnseenExpires) console.log('unseen focus', JSON.stringify(r));
/* (the briefing is put up on the event's FIRST FRAME, not by kit.event, so
   wait for it — and read what is drawn: the class AND its pieces shown) */
await p.evaluate(() => { window.__enc.kit.event({ kind: 'focus', brief: 'probe', targets: [{ sx: 0.5, sy: 0.5 }] }); });
K.focusSpotDemo = await until(() => { const d = window.__enc.kitDebug(); return !!(d.event && d.event.briefing); }, 30000)
  .then(() => p.evaluate(() => {
    const dm = document.getElementById('evDemo');
    return dm.className === 'spot' && getComputedStyle(dm).display !== 'none'
      && getComputedStyle(dm.querySelector('.dspot')).display !== 'none'
      && getComputedStyle(dm.querySelector('.dret')).display === 'none';
  }), () => false);
await p.evaluate(() => window.__enc.kit.abortEvent());
/* v21.2: A STEADY LIGHT (opt-in, e3c3's STAY PRESENT). Until its target says
   ready() nothing is shown and nothing runs — no life, no charge, however long
   it waits; once ready it comes on with its flash ('pop'), and a tap scores a
   band; a light never made ready is skipped after `waitMax`, NOT charged */
await p.evaluate(() => { window.__rdy = false; window.__enc.stats.awareness = 40; });
r = await runEvent({ kind: 'focus', graded: true, steady: true, readyTag: '__rdy', targets: [{ sx: 0.5, sy: 0.5, label: 'still' }], each: 2,
                     gap: 0, waitMax: 60, missCost: 3, penalty: { stat: 'awareness' }, award: { stat: 'sanity', per: 1, hi: 6 } },
                   async () => {
  await untilT(2.5);                                                      // past a whole life: had it run, it would be MISSED now
  K.focusSteadyWaits = await p.evaluate(() => { const d = window.__enc.kitDebug().event, s = window.__enc.evState();
    return !!d && document.getElementById('evDot').classList.contains('hide') && s.idx === 0 && s.band.length === 0 && s.placed === false; });
  await p.evaluate(() => { window.__rdy = true; });
  await untilDot();
  K.focusSteadyPops = await p.evaluate(() => { const c = document.getElementById('evDot').classList;
    return c.contains('pop') && c.contains('steady') && c.contains('graded') && document.querySelector('#evDot .dlab').textContent === 'still'; });
  await tapOnce();
});
K.focusSteadyHit = r.kind === 'focus' && r.band.length === 1 && r.band[0] >= 1;
if (!K.focusSteadyHit) console.log('steady focus', JSON.stringify(r));
await p.evaluate(() => { window.__never = false; });
r = await runEvent({ kind: 'focus', graded: true, steady: true, readyTag: '__never', targets: [{ sx: 0.5, sy: 0.5 }], each: 2,
                     waitMax: 1.5, missCost: 3, penalty: { stat: 'awareness' }, award: { stat: 'sanity', per: 1, hi: 6 } });
K.focusSteadyNeverFree = r.kind === 'focus' && r.band.length === 0 && await p.evaluate(() => Math.abs(window.__enc.stats.awareness - 40) < 1e-9);
K.focusSteadyLookGoes = await p.evaluate(() => !document.getElementById('evDot').classList.contains('steady'));
/* ---------------------------------------------------------------- v23.0 · S37–S41
   The hands-on kinds and the poses, for episode 3 chapter 5 — each by REAL pointer events on the overlay (v18.3: a
   minigame probe drives the real input path), and the keys by the real keyboard. */
const ptr = (type, x, y, o = {}) => p.evaluate(([type, x, y, o]) => {
  document.getElementById('event').dispatchEvent(new PointerEvent(type, { pointerType: o.pt || 'touch', pointerId: o.id || 11,
    isPrimary: true, clientX: x, clientY: y, bubbles: true, cancelable: true }));
}, [type, x, y, o]);
const evd = () => p.evaluate(() => window.__enc.kitDebug().event);
const untilEv = (fn, arg, ms = 30000) => p.waitForFunction(fn, arg, { timeout: ms, polling: 50 }).then(() => true, () => false);
const evGone = () => !window.__enc.kitDebug().event;
const siAt = n => { const d = window.__enc.kitDebug().event; return !d || d.si >= n; };
/* a twist: a finger round the point (cx, cy) at radius 120 px, `turns` of a circle in 15° moves, either way; `fast`
   puts every move in one task (no time between them, so the care is spoilt) */
const twist = (cx, cy, turns, dir = 1, fast = false) => p.evaluate(([cx, cy, turns, dir, fast]) => new Promise(done => {
  const host = document.getElementById('event');
  const fire = (type, a) => host.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', pointerId: 11, isPrimary: true,
    clientX: cx + 120 * Math.cos(a), clientY: cy + 120 * Math.sin(a), bubbles: true, cancelable: true }));
  const n = Math.ceil(turns * 24) + 2; let i = 0;
  fire('pointerdown', 0);
  if (fast) { for (i = 1; i <= n; i++) fire('pointermove', dir * i * Math.PI / 12); fire('pointerup', dir * n * Math.PI / 12); return done(); }
  const f = () => { i++; fire('pointermove', dir * i * Math.PI / 12); if (i >= n) { fire('pointerup', dir * i * Math.PI / 12); done(); } else setTimeout(f, 40); };
  setTimeout(f, 40);
}), [cx, cy, turns, dir, fast]);
const C = await p.evaluate(() => ({ x: innerWidth * 0.5, y: innerHeight * 0.5, w: innerWidth, h: innerHeight }));
await p.evaluate(() => { window.__steps = []; window.__foam = 0; });
/* S37 · CRAFT: five steps in order — a twist, a slide down, two taps, a hold, a flick — each by a finger */
r = await runEvent({ kind: 'craft', at: { sx: 0.5, sy: 0.5 }, fast: 720, minR: 40,
                     steps: [{ g: 'twist', turns: 1 }, { g: 'slide', dir: 'down', len: 0.2 }, { g: 'tap', n: 2 }, { g: 'hold', secs: 0.4 }, { g: 'swipe', dir: 'side', dist: 0.2 }],
                     stepTag: '__steps' }, async () => {
  /* the hint is drawn AT the prop, with the step's own class */
  K.craftHint = await p.waitForFunction(([cx, cy]) => { const el = document.getElementById('evCraft');
    if (!el || el.classList.contains('hide') || el.className.indexOf('g-twist') < 0) return false;
    const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(el.style.transform || ''); return !!m && Math.abs(+m[1] - cx) < 2 && Math.abs(+m[2] - cy) < 2; },
    [C.x, C.y], { timeout: 20000, polling: 100 }).then(() => true, () => false);
  await twist(C.x, C.y, 1.15, 1);
  K.craftTwist = await untilEv(siAt, 1);
  // a slide the WRONG way does nothing
  await ptr('pointerdown', C.x, C.y); await ptr('pointermove', C.x, C.y - 200); await ptr('pointerup', C.x, C.y - 200);
  K.craftSlideWrongWay = (await evd()).si === 1 && (await evd()).sk === 0;
  await ptr('pointerdown', C.x, C.y); for (let k = 1; k <= 5; k++) await ptr('pointermove', C.x, C.y + 45 * k); await ptr('pointerup', C.x, C.y + 225);
  K.craftSlide = await untilEv(siAt, 2);
  await ptr('pointerdown', C.x, C.y); await ptr('pointerup', C.x, C.y);
  K.craftTapOne = (await evd()).si === 2;
  await ptr('pointerdown', C.x, C.y); await ptr('pointerup', C.x, C.y);
  K.craftTap = await untilEv(siAt, 3);
  await ptr('pointerdown', C.x, C.y);
  K.craftHold = await untilEv(siAt, 4);
  await ptr('pointerup', C.x, C.y);
  // a flick needs its SPEED: a slow drag begins again from where it is; a quick one completes it
  K.craftSwipeNeedsSpeed = await p.evaluate(([cx, cy, w]) => new Promise(done => {
    const host = document.getElementById('event');
    const fire = (type, x) => host.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', pointerId: 11, isPrimary: true, clientX: x, clientY: cy, bubbles: true, cancelable: true }));
    fire('pointerdown', cx - 150);
    setTimeout(() => { fire('pointermove', cx - 150 + w * 0.3); const slow = window.__enc.kitDebug().event.si === 4; fire('pointerup', cx - 150 + w * 0.3); done(slow); }, 900);
  }), [C.x, C.y, C.w]);
  await p.evaluate(([cx, cy, w]) => {
    const host = document.getElementById('event');
    const fire = (type, x) => host.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', pointerId: 11, isPrimary: true, clientX: x, clientY: cy, bubbles: true, cancelable: true }));
    fire('pointerdown', cx - 150); fire('pointermove', cx - 150 + w * 0.3); fire('pointerup', cx - 150 + w * 0.3);
  }, [C.x, C.y, C.w]);
});
K.craftDone = r.kind === 'craft' && r.ok === true && r.care === true
  && await p.evaluate(() => JSON.stringify(window.__steps) === '[0,1,2,3,4]');
/* the twist counts EITHER way, and too fast spoils the care (the cap foams over) */
r = await runEvent({ kind: 'craft', at: { sx: 0.5, sy: 0.5 }, steps: [{ g: 'twist', turns: 0.6 }], foamTag: '__foam' }, async () => {
  await twist(C.x, C.y, 0.75, -1, true);
});
K.craftTwistOtherWay = r.ok === true;
K.craftTooFastFoams = r.care === false && await p.evaluate(() => window.__foam >= 1);
/* keys: E held turns a twist; a press taps */
r = await runEvent({ kind: 'craft', at: { sx: 0.5, sy: 0.5 }, keyRate: 720, steps: [{ g: 'twist', turns: 0.5 }, { g: 'tap', n: 1 }] }, async () => {
  await p.keyboard.down('KeyE');
  await untilEv(siAt, 1);
  await p.keyboard.up('KeyE');
  await p.keyboard.press('Space');
});
K.craftKeys = r.ok === true;
/* S38 · YIELD: a held finger fills it; let go, it waits; held again, it is full */
r = await runEvent({ kind: 'yield', fill: 1.2, at: { sx: 0.5, sy: 0.5 } }, async () => {
  K.yieldRing = await p.evaluate(() => !document.getElementById('evYield').classList.contains('hide'));
  await ptr('pointerdown', C.x, C.y);
  await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || d.yk >= 0.3; });
  await ptr('pointerup', C.x, C.y);
  const a = (await evd()).yk; await p.waitForTimeout(1500); const d = await evd();
  K.yieldPauses = !!d && Math.abs(d.yk - a) < 1e-6;
  await ptr('pointerdown', C.x, C.y);
  await untilEv(evGone, null, 30000);
  await ptr('pointerup', C.x, C.y);
});
K.yieldFills = r.kind === 'yield' && r.ok === true;
r = await runEvent({ kind: 'yield', fill: 0.4, auto: true, autoAfter: 0.3 }, null);           // nobody touches it: it lets go by itself
K.yieldAuto = r.ok === true;
r = await runEvent({ kind: 'yield', fill: 0.4 }, async () => { await p.keyboard.down('KeyE'); await untilEv(evGone, null, 30000); await p.keyboard.up('KeyE'); });
K.yieldKey = r.ok === true;
r = await runEvent({ kind: 'yield', fill: 0.4 }, async () => { await ptr('pointerdown', C.x, C.y, { pt: 'mouse', id: 1 }); await untilEv(evGone, null, 30000); await ptr('pointerup', C.x, C.y, { pt: 'mouse', id: 1 }); });
K.yieldMouse = r.ok === true;
/* (CP7) a yield that fills by itself once pressed latches a press shorter than a frame: down and up in one task, with no
   frame between them — on a slow phone a quick tap — and it still fills (the latch was read on the frame) */
r = await runEvent({ kind: 'yield', fill: 0.4, auto: true, autoAfter: 9999 }, async () => {
  await p.evaluate(([x, y]) => { const el = document.getElementById('event');
    for (const type of ['pointerdown', 'pointerup']) el.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', pointerId: 13,
      isPrimary: true, clientX: x, clientY: y, bubbles: true, cancelable: true })); }, [C.x, C.y]);
  await untilEv(evGone, null, 30000);
});
K.yieldAutoTapLatched = r.ok === true;
/* S39 · SURFACE: a finger dragging up climbs back; left alone it slips — sanity paid, never under the floor — and
   after `secs` it gives up for him (never a soft-lock) */
r = await runEvent({ kind: 'surface', secs: 40, start: 0.3, sink: 0.04, pull: 0.04, goal: 0.8, hold: 0.2, lead: 0.2 }, async () => {
  K.surfaceGauge = await p.evaluate(() => !document.getElementById('evSurface').classList.contains('hide'));
  for (let i = 0; i < 12; i++) {
    await ptr('pointerdown', C.x, C.y + 150); for (let k = 1; k <= 4; k++) await ptr('pointermove', C.x, C.y + 150 - 75 * k); await ptr('pointerup', C.x, C.y - 150);
    if (await p.evaluate(() => window.__evR !== null)) break;
  }
});
K.surfaceDragWins = r.kind === 'surface' && r.ok === true && !r.gaveUp && r.score > 0;
/* (the fixture's own ghost drains sanity the whole time, so the slip is read from what IT charged, and the floor at
   the moment it charged) */
await p.evaluate(() => { window.__enc.stats.sanity = 30; window.__sanAtSlip = null; });
r = await runEvent({ kind: 'surface', secs: 2.4, start: 0.3, sink: 0.6, pull: 0.2, pullGap0: 0.5, pullGap1: 0.6, floorK: 0.2, slip: 25, minSanity: 10, lead: 0.1,
                     slipTag: '__surfSlip' }, null);
const sanFloor = await p.evaluate(() => window.__sanAtSlip);
K.surfaceGivesUp = r.ok === true && r.gaveUp === true && r.score === 0;
K.surfaceSlipCosts = r.slips >= 1 && r.slipPaid > 0;
K.surfaceFloorHolds = sanFloor !== null && sanFloor >= 10 - 1e-9;
await p.evaluate(() => { window.__enc.stats.sanity = 100; });
r = await runEvent({ kind: 'surface', secs: 40, start: 0.5, sink: 0.02, pull: 0.02, goal: 0.8, hold: 0.2, keyRise: 0.08, lead: 0.2 }, async () => {
  for (let i = 0; i < 40; i++) { await p.keyboard.press('KeyW'); if (await p.evaluate(() => window.__evR !== null)) break; }
});
K.surfaceKeys = r.ok === true && !r.gaveUp;
/* and INSIDE A FILM: the climb film pauses on it (api.eventWait), then goes on and hands back to play */
K.surfaceInFilm = await p.evaluate(() => { window.__climbR = null; const e = window.__enc;
  return e.kit.film('climb', { onDone: () => e.kit.fade(0, 0.3) }); });
if (K.surfaceInFilm) {
  K.surfaceInFilm = await until(() => window.__climbR !== null && window.__enc.getState() === 'play', 90000).then(() => true, () => false)
    && await p.evaluate(() => window.__climbR.kind === 'surface' && window.__climbR.ok === true);
  await until(() => window.__enc.kit.getFade() < 0.02, 30000).catch(() => {});
}
/* and each briefing SHOWS its game (Chad's v18.2 rule): the kind's own picture — a fingertip circling a cap, a ring
   filling under a pressing finger, a mark climbing its gauge */
for (const [kind, pic, extra] of [['craft', 'twist', { steps: [{ g: 'tap' }] }], ['yield', 'press', { fill: 0.2 }], ['surface', 'surface', { secs: 0.6 }]]) {
  let shown = false;
  r = await runEvent(Object.assign({ kind, brief: 'How it is played.' }, extra), async () => {
    shown = await p.evaluate(pic => { const dm = document.getElementById('evDemo');
      return dm.className === pic && getComputedStyle(dm).display !== 'none'; }, pic);
    await tapOnce();                      // START
    if (kind === 'craft') { await p.waitForTimeout(300); await tapOnce(); }
    if (kind === 'yield') { await press(); await untilEv(evGone, null, 30000); await release(); }
  });
  K['brief_' + kind] = shown && r.ok === true;
}
/* S41 · a film with noSkip: past the 3.0 s mark there is no Skip button, and the keys and the skip do nothing; it
   ends by itself and hands back. The same film without it shows its Skip (unchanged). */
K.noSkipFilm = await p.evaluate(() => { const e = window.__enc; window.__filmDone = null;
  return e.kit.film('probe', { noSkip: true, onDone: (r) => { window.__filmDone = { skipped: !!r.skipped }; e.kit.fade(0, 0.3); } }); });
if (K.noSkipFilm) {
  await until(() => window.__enc.cine.t() > 3.1, 60000).catch(() => {});
  K.noSkipNoButton = await p.evaluate(() => window.__enc.cine.noSkip() === true && window.__enc.cine.skipShown() === false);
  await p.keyboard.press('Escape'); await p.keyboard.press('Space');
  await p.evaluate(() => document.getElementById('cineSkip').click());     // even a click on the (hidden) button
  K.noSkipIgnoresKeys = await p.evaluate(() => window.__enc.getState() === 'cine');
  K.noSkipEndsItself = await until(() => window.__filmDone && window.__enc.getState() === 'play', 60000).then(() => true, () => false)
    && await p.evaluate(() => window.__filmDone.skipped === false);
  await until(() => window.__enc.kit.getFade() < 0.02, 30000).catch(() => {});
}
K.skipStillShows = await p.evaluate(() => { const e = window.__enc; window.__filmDone = null;
  return e.kit.film('probe', { onDone: () => { window.__filmDone = true; e.kit.fade(0, 0.3); } }); });
if (K.skipStillShows) {
  await until(() => window.__enc.cine.t() > 3.1, 60000).catch(() => {});
  K.skipStillShows = await p.evaluate(() => window.__enc.cine.noSkip() === false && window.__enc.cine.skipShown() === true);
  await p.evaluate(() => document.getElementById('cineSkip').click());
  await until(() => window.__filmDone && window.__enc.getState() === 'play', 60000).catch(() => {});
  await until(() => window.__enc.kit.getFade() < 0.02, 30000).catch(() => {});
}
/* S41 · sealedBefore: a chapter's read-only question to the progress store */
K.sealedBefore = await p.evaluate(() => {
  const KEY = 'mz.encounters.progress', was = localStorage.getItem(KEY), st = window.__enc.stage;
  try {
    localStorage.setItem(KEY, JSON.stringify({ reached: 'ch2', sealed: { ch1: { score: 70, rank: 'B' } }, t: Date.now() }));
    return st.sealedBefore('ch1') === true && st.sealedBefore('ch2') === false;
  } finally { if (was === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, was); }
});
/* S40 · THE POSES. From idle, asking for k 0 writes nothing at all (bit for bit); every pose draws (the arm moves, a
   two-handed pose shows the left hand, a one-handed one does not); eased in and back out, the arm ends EXACTLY where
   it began; kit.pray on over a pose eases to the clasp and hands it to kit.pray; the child's clasp is lower; the
   left hand holds a thing and lets it go; kitReset clears a pose. */
await until(() => window.__enc.getState() === 'play', 30000).catch(() => {});
const arm0 = await p.evaluate(() => window.__enc.armNow());
await p.evaluate(() => window.__enc.kit.handPose('reach', 0));
await p.waitForTimeout(700);
K.hposeZeroWritesNothing = JSON.stringify(await p.evaluate(() => window.__enc.armNow())) === JSON.stringify(arm0)
  && await p.evaluate(() => window.__enc.hpose().on === false);
const POSES = { reach: false, place: false, bottle: true, straw: true, lighter: true, hips: true, cross: true, peek: true, mouth: true, pray: true, small: true };
let drew = true;
await p.evaluate(a0 => { window.__a0 = a0; }, arm0);
for (const [name, two] of Object.entries(POSES)) {
  await p.evaluate(n => window.__enc.kit.handPose(n, 1, { secs: 0 }), name);
  const ok = await p.waitForFunction(([n, two]) => { const e = window.__enc, a = e.armNow(), h = e.hpose();
    return h.on && h.name === n && a.lv === two && Math.hypot(a.rp[0] - window.__a0.rp[0], a.rp[1] - window.__a0.rp[1], a.rp[2] - window.__a0.rp[2]) > 0.005; },
    [name, two], { timeout: 20000, polling: 100 }).then(() => true, () => false);
  if (!ok) { drew = false; console.log('pose did not draw', name, JSON.stringify(await p.evaluate(() => ({ h: window.__enc.hpose(), a: window.__enc.armNow() })))); }
}
K.hposeEachDraws = drew;
await p.evaluate(() => window.__enc.kit.handPose(null, 0, { secs: 0.3 }));
await until(() => window.__enc.hpose().on === false, 20000).catch(() => {});
await p.waitForTimeout(400);
K.hposeBackExactly = await p.evaluate(a0 => {
  // the same turn: the same four numbers, or all four negated (a slerp may land on either)
  const a = window.__enc.armNow(), same = (q, r) => q.every((v, i) => v === r[i]) || q.every((v, i) => v === -r[i]);
  return a.rp.every((v, i) => v === a0.rp[i]) && same(a.rq, a0.rq) && a.rf.every((q, i) => same(q, a0.rf[i])) && a.lv === false;
}, arm0);
await p.evaluate(() => window.__enc.kit.handPose('lighter', 1, { secs: 0.2 }));
await until(() => window.__enc.hpose().u >= 1, 20000).catch(() => {});
await p.evaluate(() => window.__enc.kit.pray(true, { secs: 0.3 }));
K.hposeToPray = await until(() => { const e = window.__enc; return e.hpose().on === false && e.prayDebug().k === 1 && e.kit.praying(); }, 20000).then(() => true, () => false);
await p.evaluate(() => window.__enc.kit.pray(false, { secs: 0 }));
await p.waitForTimeout(400);
await p.evaluate(() => window.__enc.kit.pray(true, { secs: 0, small: true }));
K.praySmall = await until(() => Math.abs(window.__enc.prayDebug().ay - (-0.33)) < 1e-3, 20000).then(() => true, () => false);
await p.evaluate(() => window.__enc.kit.pray(false, { secs: 0 }));
K.holdLeft = await p.evaluate(() => { const e = window.__enc, o = new (e.handsRoot.constructor)();
  e.kit.hold(o, { hand: 'left' }); const a = e.armNow(), held = a.heldL && e.kit.holding('left') === o && !e.kit.holding();
  e.kit.hold(null); const b = e.armNow(); return held && !b.heldL && !b.held; });
/* (CP6) where a palm is — kit.handPalm, by the very rule a pose's `rel` is measured with: at the bottle pose the right
   palm stands `rel` from the left (a palm read off the arm's own frame was 10 cm out) — and `sx`, both hands moved
   across so the named palm stands at that share of the half-width at its depth, on any screen */
await p.evaluate(() => window.__enc.kit.handPose('bottle', 1, { secs: 0, p: 0 }));
await until(() => { const h = window.__enc.hpose(); return h.on && h.name === 'bottle' && h.u >= 1; }, 20000).catch(() => {});
/* (CP7: both POLL — read after a fixed wait they failed under a loaded box, where 0.3 s can hold no drawn frame and the
   0.6 s ease to `sx` is two thirds done after 0.4: the v8.7 law, written into CP6's own checks) */
K.handPalmRel = await until(() => { const e = window.__enc, L = e.kit.handPalm('left'), R = e.kit.handPalm('right');
  if (!L || !R) return false;
  const rel = e.hposeTable.bottle.r.rel;
  return Math.hypot(R.x - L.x - rel[0], R.y - L.y - rel[1], R.z - L.z - rel[2]) < 0.01; }, 20000).then(() => true, () => false);
await p.evaluate(() => window.__enc.kit.handPose('bottle', 1, { p: 0, sx: 0.3 }));
K.handPoseSx = await until(() => { const R = window.__enc.kit.handPalm('right'); if (!R) return false;
  const share = R.x / (Math.tan(26 * Math.PI / 180) * Math.abs(R.z) * (innerWidth / innerHeight));
  return Math.abs(share - 0.3) < 0.05; }, 20000).then(() => true, () => false);
await p.evaluate(() => window.__enc.kit.handPose(null, 0, { secs: 0 }));
await until(() => window.__enc.hpose().on === false, 20000).catch(() => {});
/* a film takes a pose back on its first frame (it draws its own with api.handPose) */
await p.evaluate(() => window.__enc.kit.handPose('cross', 1, { secs: 0 }));
await until(() => window.__enc.hpose().on && window.__enc.armNow().lv, 20000).catch(() => {});
K.hposeTakenByFilm = await p.evaluate(() => { const e = window.__enc; window.__filmDone = null;
  const ok = e.kit.film('probe', { onDone: () => { window.__filmDone = true; e.kit.fade(0, 0.3); } });
  return ok && e.hpose().on === false; });
await until(() => window.__filmDone && window.__enc.getState() === 'play', 60000).catch(() => {});
await until(() => window.__enc.kit.getFade() < 0.02, 30000).catch(() => {});
K.hposeFilmHandsBack = await p.evaluate(a0 => { const a = window.__enc.armNow(); return a.lv === false && a.rp.every((v, i) => v === a0.rp[i]); }, arm0);
await p.evaluate(() => { window.__enc.stats.sanity = 100; window.__enc.stats.awareness = 50; });
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
/* v23.0 · S40: and kitReset clears a pose (here, at the end — it clears the conduct the card above read) */
await p.evaluate(() => { window.__enc.kit.handPose('cross', 1, { secs: 0 }); window.__enc.kit.rain(1); });   // (v24.0: and rain, for the reset to clear)
await until(() => window.__enc.hpose().on && window.__enc.armNow().lv, 20000).catch(() => {});
await p.evaluate(() => window.__enc.kitReset());
await p.waitForTimeout(400);
K.hposeClearedByReset = await p.evaluate(() => { const e = window.__enc, a = e.armNow(); return e.hpose().on === false && a.lv === false; });
K.rainClearedByReset = await p.evaluate(() => { const w = window.__enc.wxState(); return !w.visible && w.k === 0 && w.thunder === 0; });   // v24.0 (S45)

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
