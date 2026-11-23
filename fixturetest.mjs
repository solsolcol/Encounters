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
import sharp from 'sharp';                                 // v27.0: the vision's hands read off the picture

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
/* v27.0 (Chad, 18 Nov: "I think the aim button is pointless and you can remove it"): a weapon with no zoom (the fixture's
   declares none) draws no AIM; and with no icon declared its fire button keeps its word */
K.weaponNoAimWithoutZoom = await p.evaluate(() => {
  const b = document.body, aim = document.getElementById('aimBtn'), fb = document.getElementById('fireBtn');
  const word = fb.querySelector('[data-t="hud.fire"]'), ico = fb.querySelector('.wpnIco-spray');
  const r = { noAim: b.classList.contains('wpnNoAim'), aimHidden: getComputedStyle(aim).display === 'none',
              word: getComputedStyle(word).display !== 'none', ico: getComputedStyle(ico).display === 'none', icoClass: !b.classList.contains('wpnIco-spray') };
  console.log('weaponNoAimWithoutZoom', JSON.stringify(r));
  return r.noAim && r.aimHidden && r.word && r.ico && r.icoClass;
});
/* v27.0 (the sixty-seventh seam, R140): THE FIRE BUTTON'S GLOW. Never asked (the rifle, as here), the button is exactly as
   it was: no class, no animation, nothing drawn round it. Asked while it can be pressed: the breathing (wpnBreath) and the
   light round it (::before, wpnGlow) in the water's colour, the gold when the water is gold; still while the chapter's
   rule refuses the shot (wpnBlocked), back when it allows it; let go by kit.weaponGlow(false). (kitReset's clear and the
   refusal with no weapon are proved with the kit's other clears, below) */
K.weaponGlowSeam = await p.evaluate(() => {
  const E = window.__enc, b = document.body, fb = document.getElementById('fireBtn'), R = {};
  const anim = () => getComputedStyle(fb).animationName, ring = () => getComputedStyle(fb, '::before');
  R.offByDefault = !b.classList.contains('wpnGlow') && anim() === 'none' && ring().content === 'none' && E.weaponGlowOn() === false;
  R.asked = E.kit.weaponGlow(true) === true && b.classList.contains('wpnGlow') && E.weaponGlowOn() === true;
  R.breathes = /wpnBreath/.test(anim()) && /wpnGlow/.test(ring().animationName) && ring().content !== 'none';
  R.waterColour = /150, 225, 255/.test(ring().boxShadow);
  E.kit.sprayColor(0xffc24a);
  /* (the gold is the engine's own reading of the water's colour, three's linear values, as the button's border has it:
     the light is read against the button's own --wg, never a typed number) */
  { const wg = fb.style.getPropertyValue('--wg'); R.goldColour = !!wg && ring().boxShadow.includes(wg.split(',').map(Number).join(', '))
      && !/150, 225, 255/.test(ring().boxShadow); }
  E.kit.sprayColor(null);
  R.colourBack = /150, 225, 255/.test(ring().boxShadow) && !fb.style.getPropertyValue('--wg');
  E.kit.weaponBlock('No.');
  R.stillWhenRefused = anim() === 'none' && ring().content === 'none';
  E.kit.weaponBlock(null);
  R.backWhenAllowed = /wpnBreath/.test(anim());
  R.letGo = E.kit.weaponGlow(false) === true && !b.classList.contains('wpnGlow') && anim() === 'none' && ring().content === 'none';
  console.log('weaponGlowSeam', JSON.stringify(R));
  return Object.values(R).every(v => v === true);
});
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

/* v27.0: HIS OWN HANDS (the fifty-first seam), proved over the rifle the fixture declares: a weapon of `hands: 'own'`
   forced out takes the hands into its pose and the left hand holds what kit.weaponHold gave it; FIRE spends a round,
   flicks (p rises above 0 and comes back), throws drops and still reports to the chapter; the HUD says the chapter's
   words; RELOAD dips (p below 0), owns the hands until the dip is done and fills the bowl again with no magazine
   counted; a chapter's refusal is said under the reticle and nothing is filled; put away, the pose and the bowl go;
   and the rifle's declaration comes back as it was */
/* (v27.0: a trace of sanity and state while the checks run, printed when a check finds the run already lost: the
   fixture's own ghost drains on wall time, and run 5 and 6 fainted somewhere between here and the amulet) */
await p.evaluate(() => { const E = window.__enc; window.__sanTrace = []; let ls = null, lst = null;
  setInterval(() => { const s = Math.round(E.stats.sanity), st = E.getState();
    if (ls === null || Math.abs(s - ls) >= 3 || st !== lst) { window.__sanTrace.push([Math.round(performance.now() / 1000), s, st, window.__lbl || '']); ls = s; lst = st; } }, 500); });
const lbl = (l) => p.evaluate(x => { window.__lbl = x; }, l);
await lbl('own');
K.ownSeam = await p.evaluate(async () => {
  const E = window.__enc, R = {};
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const poll = async (fn, ms) => { const t0 = performance.now(); while (!fn()) { if (performance.now() - t0 > ms) return false; await frames(1); } return true; };
  const rifle = window.__CHAPTERS__.chtest.weapon;
  R.declared = E.weaponDeclare({ hands: 'own', pose: 'bowl', rounds: 3, endless: true, fireGap: 0.05, spray: { count: 6 },
                                 words: { fire: 'FLICK', reload: 'DIP' }, shot: 'uiclick', reload: 'uiclick', empty: 'uiclick' });
  const bowl = E.camera.clone(); bowl.name = 'bowlproxy';            // any Object3D will do for the hand to carry
  E.kit.weaponHold(bowl, { pos: [0, -0.04, -0.12] });
  E.kit.weaponOut(true);
  R.posed = await poll(() => { const s = E.ownState(); return s.shown && s.pose === 'bowl' && s.held; }, 60000);
  R.words = E.ownState().fire.startsWith('FLICK');
  let maxP = 0;
  const logA = E.weaponLog.length;
  R.fires = E.kit.fire() === true && E.ownState().rounds === 2 && E.ownState().anim === 'flick';
  R.flicks = await poll(() => { maxP = Math.max(maxP, E.ownState().p); return E.ownState().anim === null; }, 60000) && maxP > 0.5;
  R.logged = E.weaponLog.length === logA + 1 && E.weaponLog[E.weaponLog.length - 1].empty !== true;   // the round went through the shot path (onShot is called on it)
  /* (18 Nov) the drops are thrown inside fire() itself and live half a second: read them on the spot. Two frames first
     (four seconds on a loaded software renderer) let them land and fade before the first look, and the check failed on
     a flick the game had thrown (the drives saw every one) */
  const fired2 = E.kit.fire(), d0 = E.ownState().drops; await frames(2);
  R.thrown = fired2 === true && (d0 > 0 || await poll(() => E.ownState().drops > 0 || E.ownState().drawn > 0, 20000));
  /* the dip */
  let minP = 0;
  R.dips = E.kit.reload() === true && E.ownState().rounds === 3 && E.ownState().busy === 'reload';
  R.dipBlocksFire = E.kit.fire() === false;
  R.dipDone = await poll(() => { minP = Math.min(minP, E.ownState().p); return E.ownState().busy === null && E.ownState().anim === null; }, 60000) && minP < -0.5;
  R.fullNoop = E.kit.reload() === false;                                   // a full bowl: nothing to do
  /* a refusal where he stands: said, nothing filled */
  E.kit.fire(); await frames(1);
  const st = E.stage, had = st.reloadRefusal; st.reloadRefusal = () => 'Dip it in the large bowl.';
  R.refused = E.kit.reload() === false && E.ownState().rounds === 2 && (document.getElementById('nofire').textContent || '') === 'Dip it in the large bowl.';
  st.reloadRefusal = had;
  /* (v27.0, R133, R136) the reload button drawn unless a declaration says otherwise; then a refill that is a TAP ON THE
     STAGE'S MARK (stage.reloadHits), the button gone, R still reloading, and the dry flick's words for a mouse */
  const rb = document.getElementById('reloadBtn'), px0 = E.pitch.rotation.x;   // (its flicks kick the view up: put back below)
  R.buttonByDefault = !document.body.classList.contains('wpnNoReload') && getComputedStyle(rb).display !== 'none';
  R.noButton = E.weaponDeclare({ hands: 'own', pose: 'bowl', rounds: 3, endless: true, fireGap: 0.05, reloadButton: false, dipSecs: [0, 0, 0],
                                 words: { fire: 'FLICK', reload: 'DIP', empty: 'Press R to reload.', emptyTouch: 'Tap the mark.' },
                                 shot: 'uiclick', reload: 'uiclick', empty: 'uiclick' })
    && await poll(() => document.body.classList.contains('weaponUp'), 60000)
    && document.body.classList.contains('wpnNoReload') && getComputedStyle(rb).display === 'none';
  const hadHits = st.reloadHits;
  st.reloadHits = (x, y) => Math.hypot(x - 40, y - 40) < 12;
  R.noHitsBefore = typeof hadHits !== 'function';
  R.tapSpent = E.kit.fire() === true && E.ownState().rounds === 2;
  R.tapMisses = E.weaponReloadTap(300, 300) === false && E.ownState().rounds === 2;
  R.tapReloads = E.weaponReloadTap(40, 40) === true && E.ownState().rounds === 3;
  R.tapFullIsTheMarks = E.weaponReloadTap(40, 40) === true && E.ownState().rounds === 3;   // the mark's tap, the bowl full
  await poll(() => E.ownState().busy === null, 60000);
  st.reloadHits = hadHits;
  R.tapNeedsHits = E.weaponReloadTap(40, 40) === false;                                     // a stage without one: as it was
  R.keyStillReloads = await (async () => { await new Promise(r => setTimeout(r, 80)); return E.kit.fire() === true && E.ownState().rounds === 2
    && await poll(() => E.ownState().busy === null, 60000) && E.kit.reload() === true && E.ownState().rounds === 3; })();
  /* dry: the mouse's words (this page has no touch), never the touch screen's */
  await poll(() => E.ownState().busy === null, 60000);
  for (let i = 0; i < 3; i++) { E.kit.fire(); await new Promise(r => setTimeout(r, 80)); }
  E.kit.fire();
  R.dryWords = (document.getElementById('nofire').textContent || '') === 'Press R to reload.';
  E.pitch.rotation.x = px0;   // (five flicks' kicks, 0.06 rad, carried into the bed's test and lifted the bed out of view)
  /* put away */
  E.kit.weaponOut(false);
  R.putAway = await poll(() => { const s = E.ownState(); return !s.shown && !s.held && s.pose !== 'bowl'; }, 60000);
  /* and the rifle back as it was */
  E.kit.weaponOut(null);
  R.rifleBack = E.weaponDeclare(rifle) && E.ownState().fire.startsWith('FIRE') && E.kitDebug().weapon.rounds === 3
    && !document.body.classList.contains('wpnNoReload');                                 // (R133) and its reload button with it
  /* and taken down while out (weaponOut(null) puts an undeclared-item weapon out again), the hands are given back too:
     the bowl's pose eases away instead of standing (it stood, and the praying hands below found it) */
  R.poseGiven = await poll(() => E.ownState().pose !== 'bowl' && !E.ownState().shown, 60000);
  window.__ownSeam = R;
  return Object.values(R).every(v => v === true);
}).catch((e) => { console.log('ownSeam threw', e && e.message); return false; });
if (!K.ownSeam) console.log('ownSeam parts:', JSON.stringify(await p.evaluate(() => window.__ownSeam || null)));

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
await lbl('pray');
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

/* v26.0: THE PLAY LENS (the forty-seventh seam) — kit.lens(40) narrows the world's lens in play and kit.lens(null)
   gives the world's own back; until a chapter asks, nothing here writes the lens at all (took is false and the angle is
   the world's); a film takes the lens at its start, and the chapter's borrowed one is let go there */
K.lensSeam = await p.evaluate(async () => {
  const E = window.__enc;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const a = E.lens();
  E.kit.lens(40, { secs: 0 }); await frames(3);
  const b = E.lens();
  E.kit.lens(null, { secs: 0 }); await frames(3);
  const c = E.lens();
  return a.took === false && a.fov === 72 && b.took === true && Math.abs(b.fov - 40) < 1e-6 && c.took === false && c.fov === 72;
}).catch(() => false);
/* it eases (some angle between the two is drawn on the way), and arrives exactly */
K.lensEases = await p.evaluate(async () => {
  const E = window.__enc; const seen = new Set();
  E.kit.lens(50, { secs: 1.2 });
  const t0 = performance.now();
  await new Promise(res => { const f = () => { seen.add(+E.lens().fov.toFixed(2)); if (performance.now() - t0 > 4000 || E.lens().fov === 50) res(); else requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const mid = [...seen].some(v => v < 72 && v > 50), end = E.lens().fov === 50;
  E.kit.lens(null, { secs: 0 }); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  return mid && end && E.lens().fov === 72;
}).catch(() => false);
/* THE HUSH (the forty-eighth seam) — kit.hush(1) lays a low-pass between the background bus and the master, and at 0
   the filter is OUT of the path again (wired false: the bus goes to the master as it always did); a chapter that never
   asks never has the node made */
K.hushSeam = await p.evaluate(async () => {
  const E = window.__enc;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const a = E.hush();
  E.kit.hush(1, { secs: 0 }); await frames(3);
  const b = E.hush();
  E.kit.hush(0.5, { secs: 0 }); await frames(2);
  const m = E.hush();
  E.kit.hush(0, { secs: 0 }); await frames(3);
  const c = E.hush();
  /* (with no sound yet the bus does not exist and nothing can be wired: then only the level is checked) */
  const wired = !b.bus || (b.wired === true && b.hz <= 430 && m.wired === true && m.hz > 430 && m.hz < 18000 && c.wired === false);
  return a.k === 0 && a.wired === false && a.node === false && b.k === 1 && m.k === 0.5 && c.k === 0 && wired;
}).catch(() => false);
/* THE DRAWING BUDGET (the forty-ninth seam, v26.1) — a chapter's `render.phoneRatio` lets a phone draw it at that many
   pixels a point (never more than its screen has); a chapter that declares nothing has a phone's own (2 since v26.1,
   Chad's "full sharpness"); a desktop keeps its 2 whatever is declared. The function both ways, and this page's renderer
   at what it gives the fixture here */
K.renderSeam = await p.evaluate(() => {
  const E = window.__enc, f = E.pixelRatioFor, fx = window.__CHAPTERS__.chtest, none = {};
  return !!(fx && fx.render && fx.render.phoneRatio === 1.9) && f(fx, true, 3) === 1.9 && f(fx, true, 1.5) === 1.5
      && f(none, true, 3) === 2 && f(null, true, 3) === 2 && f(none, true, 1.5) === 1.5 && f(fx, false, 3) === 2 && f(none, false, 1) === 1
      && E.renderer.getPixelRatio() === f(fx, false, devicePixelRatio);
}).catch(() => false);
await settle();

/* v27.0: SPIRIT VISION (the fiftieth seam) — a chapter that declares `vision` has the eye on its HUD (body.hasVision) and
   V: V opens it (on, its wave going out), a held radius is the radius drawn and its openness the first six metres of it,
   the pass draws every frame while the wave is out (`drawn`) and stops the frame it is home (the world drawn straight to
   the screen again), a hold let go while it is shut runs home, the eye button closes it as V does; the spirit handed to
   ctx.spirit lives on the vision's own layer, which the world's lens never draws; and the pass itself built and ran
   (`ok`, no error). (kitReset shutting it is proved at the end, with the others a reset clears.) */
await lbl('vision');
K.visionSeam = await p.evaluate(async () => {
  const E = window.__enc, R = {};
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const poll = async (fn, ms) => { const t0 = performance.now(); while (!fn()) { if (performance.now() - t0 > ms) return false; await frames(1); } return true; };
  const s0 = E.vision();
  R.declared = s0.decl === true && s0.on === false && s0.r === 0 && s0.drawn === 0;
  const sp = E.chapterWorld().getObjectByName('spirit');
  R.spiritLayer = !!sp && sp.layers.mask === (1 << 9) && !E.camera.layers.test(sp.layers);
  R.hud = document.body.classList.contains('hasVision') && !!document.getElementById('visionBtn');
  document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', key: 'v', bubbles: true }));
  await frames(2);
  const s1 = E.vision(); R.keyOpens = s1.on === true && s1.dir === 1 && s1.switches === 1;
  E.kit.vision({ r: 3, moving: false }); await frames(3);
  const s2 = E.vision(); R.held = s2.r === 3 && Math.abs(s2.k - 0.5) < 1e-3;
  await frames(3);
  const s3 = E.vision(); R.passRuns = s3.drawn > s2.drawn && s3.ok === true && s3.err === null;
  /* closed by the eye button over the hold: the hold is let go and the wave runs home from 3 m */
  /* (read on the same tick: from 3 m the wave is home in 0.14 s of its clock, which two drawn frames of this box's
     capped 0.1 s already pass, so a read two frames later found it home and called the press a failure) */
  E.kit.vision(null);
  document.getElementById('visionBtn').click();
  const s4 = E.vision(); R.buttonCloses = s4.on === false && s4.dir === -1 && s4.switches === 2;
  R.home = await poll(() => E.vision().r === 0 && E.vision().dir === 0, 90000);
  const d0 = E.vision().drawn; await frames(4);
  R.passStops = E.vision().drawn === d0;
  /* a hold let go while shut runs home, never out */
  E.kit.vision({ r: 2, moving: true }); await frames(2);
  E.kit.vision(null);
  R.releaseHome = E.vision().dir === -1 && await poll(() => E.vision().r === 0, 90000);
  /* (R131) a LOCK keeps his sight as it is: opened, then locked, a press of the eye (its button, and V) is refused (still
     on, the switch count unmoved), the lock's own words said under the reticle, the eye lit as in use (`locked`, never the
     dimmed `held`), and its wave left to run out (never held at a radius); kit.vision(false) lets it go and closes it */
  E.kit.vision(true); E.kit.vision({ lock: true, why: 'fixture lock words' }); await frames(2);
  const sw0 = E.vision().switches;
  document.getElementById('visionBtn').click();
  document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', key: 'v', bubbles: true }));
  await frames(2);
  const s5 = E.kit.vision(), vb = document.getElementById('visionBtn'), nf = document.getElementById('nofire');
  R.lockRefuses = s5.on === true && s5.held === true && E.vision().switches === sw0;
  R.lockWords = !!nf && nf.textContent === 'fixture lock words';
  R.lockLit = vb.classList.contains('locked') && vb.classList.contains('on') && !vb.classList.contains('held');
  R.lockWaveRuns = await poll(() => E.vision().r > 3, 90000);
  E.kit.vision(false); await frames(2);
  R.lockLets = E.kit.vision().held === false && E.kit.vision().on === false && !vb.classList.contains('locked');
  R.lockHome = await poll(() => E.vision().r === 0 && E.vision().dir === 0, 90000);
  window.__visionSeam = R;
  return Object.values(R).every(v => v === true);
}).catch(() => false);
if (!K.visionSeam) console.log('visionSeam parts:', JSON.stringify(await p.evaluate(() => window.__visionSeam || null)));
await settle();

/* v27.0: HIS HANDS UNDER THE VISION ARE THE HANDS DRAWN THIS FRAME. A film may hold the vision open while it hides his hands
   (episode 4 chapter 4's trance): the hands' target is cleared and nothing is drawn into it, and a multisample target that
   is cleared and never rendered to is never resolved, so its texture kept play's last hands and the picture showed them
   (seen first in the chapter's own photographs, 18 Nov). Proved on the picture itself: the hands' corner with the vision
   held open and his hands shown, then hidden (it must change), then hidden with the vision's gate switched off, the old
   way (it must look as the shown one did: so the check is seen to catch the fault in the same run) */
await lbl('vision-hands');
{
  const corner = async () => { const vp = p.viewportSize();
    const b = await p.screenshot({ clip: { x: Math.round(vp.width * 0.5), y: Math.round(vp.height * 0.55), width: Math.round(vp.width * 0.45), height: Math.round(vp.height * 0.4) } });
    return (await sharp(b).raw().toBuffer({ resolveWithObject: true })).data; };
  const diff = (a, b) => { let t = 0; for (let i = 0; i < a.length; i++) t += Math.abs(a[i] - b[i]); return t / a.length; };
  const fr = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  await p.evaluate(() => window.__enc.kit.vision({ r: 60, moving: false })); await fr(4);
  const shown = await corner(); await fr(4);
  /* (18 Nov: the picture is never still (the hands breathe, a spirit flickers), and two shown pictures with nothing changed
     between them differed by 1.5 to 1.7 (tools/probes/visionhands.mjs), more than a quarter of the hidden hands' 6: the
     check failed on its own noise. That noise is measured in the run, and the two answers are judged against it) */
  const shown2 = await corner();
  await p.evaluate(() => { window.__enc.handsRoot.visible = false; }); await fr(4);
  const hidden = await corner();
  const gated = await p.evaluate(() => window.__enc.visionGate(false)); await fr(4);
  const stale = await corner();
  await p.evaluate(() => { const E = window.__enc; E.visionGate(true); E.handsRoot.visible = true; E.kit.vision(null); E.kit.vision(false); }); await fr(4);
  const dHidden = diff(shown, hidden), dStale = diff(shown, stale), dNoise = diff(shown, shown2);
  K.visionHandsHidden = gated && dHidden > 3 && dHidden > 2.5 * dNoise && dStale < Math.max(dHidden * 0.25, 1.6 * dNoise + 0.3);
  console.log('vision-hands: shown vs hidden', dHidden.toFixed(2), '| shown vs hidden the old way', dStale.toFixed(2), '| shown vs shown (its noise)', dNoise.toFixed(2));
}
await settle();

/* v27.0: THE STAKES AND THE CALL (Chad, 18 Nov: episode 4 chapter 4's holy-water fight) — the fifty-fourth to fifty-sixth
   seams and the eye button's two asks, on a chapter the engine has never seen. HEALTH (54): absent, no bar; asked, its
   label the chapter's, its fill the share asked and a fall marked `hit`; over the place `at` names while it is in view,
   at the screen's edge (its arrow) when it is behind the lens; null takes it off. THE EDGE (56): a colour at the screen's
   edges at the share asked, and gone again. THE WATER'S COLOUR: held, and given back. THE EYE (visionUrge): 'open' asks
   while the sight is shut, 'close' only while it is open, false neither. THE SHOWCASE (55): golden, its three lines the
   chapter's, no Close to press, gone by itself after `auto`, the chapter told once; the plain splash after it is the
   sheet's own again */
await lbl('stakes');
K.stakesHealth = await p.evaluate(async () => {
  const E = window.__enc, el = document.getElementById('lifeBar');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const off0 = !el.classList.contains('on') && E.stakes().life.on === false;
  E.camera.updateMatrixWorld();
  const V = E.camera.position.constructor, eye = new V().setFromMatrixPosition(E.camera.matrixWorld), fw = E.camera.getWorldDirection(new V());
  const ahead = [eye.x + fw.x * 3, eye.y + fw.y * 3, eye.z + fw.z * 3], behind = [eye.x - fw.x * 3, eye.y - fw.y * 3, eye.z - fw.z * 3];
  let at = ahead;
  E.kit.health({ label: 'Her', k: 1, at: () => at }); await frames(4);
  const on = el.classList.contains('on') && el.querySelector('.lbName').textContent === 'Her' && !el.classList.contains('edge');
  E.kit.health({ k: 0.5 }); await frames(4);
  const half = /^50(\.0)?%$/.test(el.querySelector('.lbFill').style.width) && el.classList.contains('hit') && E.stakes().life.k === 0.5;
  at = behind; await frames(4);
  const edge = el.classList.contains('edge') && el.classList.contains('on');
  E.kit.health(null); await frames(4);
  const off = !el.classList.contains('on') && E.stakes().life.on === false;
  console.log('stakesHealth', JSON.stringify({ off0, on, half, edge, off }));
  return off0 && on && half && edge && off;
}).catch(e => { console.log('stakesHealth threw', e.message); return false; });
K.stakesEdge = await p.evaluate(async () => {
  const E = window.__enc, el = document.getElementById('edgeGlow');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const until = async (f, ms) => { const t0 = performance.now(); while (!f() && performance.now() - t0 < ms) await frames(1); return f(); };
  const off0 = el.classList.contains('hide') && E.stakes().edge.k === 0;
  E.kit.edge({ color: [255, 200, 90], k: 0.8, secs: 0.05 });
  const on = await until(() => !el.classList.contains('hide') && Math.abs(parseFloat(el.style.opacity) - 0.8) < 0.01, 20000)
    && /255,200,90/.test(el.style.background.replace(/\s/g, ''));
  E.kit.edge(null);
  const gone = await until(() => el.classList.contains('hide') && E.stakes().edge.k === 0, 20000);
  console.log('stakesEdge', JSON.stringify({ off0, on, gone }));
  return off0 && on && gone;
}).catch(e => { console.log('stakesEdge threw', e.message); return false; });
K.stakesSpray = await p.evaluate(() => {
  const E = window.__enc, s0 = E.stakes().spray;
  const a = E.kit.sprayColor(0xffc24a, { size: 1.6 }), s1 = E.stakes().spray;
  const b = E.kit.sprayColor(null), s2 = E.stakes().spray;
  return a === true && b === true && s0.col === null && s0.scale === 1 && s1.col === 0xffc24a && Math.abs(s1.scale - 1.6) < 1e-9 && s2.col === null && s2.scale === 1;
}).catch(() => false);
K.stakesUrge = await p.evaluate(async () => {
  const E = window.__enc, b = document.getElementById('visionBtn');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const until = async (f, ms) => { const t0 = performance.now(); while (!f() && performance.now() - t0 < ms) await frames(1); return f(); };
  const shut0 = E.vision().on === false;
  E.kit.visionUrge('open'); await frames(3);
  const open = b.classList.contains('urge') && !b.classList.contains('urgeClose');
  E.kit.visionUrge('close'); await frames(3);
  const closeWhileShut = !b.classList.contains('urge') && !b.classList.contains('urgeClose');
  E.kit.vision(true); await until(() => E.vision().on, 20000); await frames(2);
  const closeWhileOpen = b.classList.contains('urgeClose') && !b.classList.contains('urge');
  E.kit.visionUrge(false); await frames(3);
  const none = !b.classList.contains('urge') && !b.classList.contains('urgeClose') && E.stakes().urge === false;
  E.kit.vision(false); await until(() => E.vision().r === 0 && E.vision().dir === 0, 90000);
  const words = !!b.dataset.open && !!b.dataset.close;
  console.log('stakesUrge', JSON.stringify({ shut0, open, closeWhileShut, closeWhileOpen, none, words }));
  return shut0 && open && closeWhileShut && closeWhileOpen && none && words;
}).catch(e => { console.log('stakesUrge threw', e.message); return false; });
/* v27.0 (19 Nov, R95/R96): THE STRAIN OF HIS SIGHT, the fifty-ninth seam: absent, no ring; asked, the ring on the eye
   button's edge filled by the share asked (its dash offset the circle's length times what is left), red only from the
   mark `warn`, beating only once full; null takes it off, and kitReset would too */
K.stakesStrain = await p.evaluate(async () => {
  const E = window.__enc, b = document.getElementById('visionBtn'), ring = b && b.querySelector('.strainRing'), fill = ring && ring.querySelector('.srFill');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const C = 2 * Math.PI * 21.5, off = () => parseFloat(fill.style.strokeDashoffset);
  const shown = () => b.classList.contains('strain') && getComputedStyle(ring).display !== 'none';
  const off0 = !!ring && !!fill && !b.classList.contains('strain') && getComputedStyle(ring).display === 'none' && E.stakes().strain === null;
  E.kit.visionStrain(0.5, { warn: 0.85 }); await frames(3);
  const half = shown() && Math.abs(off() - C * 0.5) < 0.2 && !b.classList.contains('strainHot') && !b.classList.contains('strainFull') && E.stakes().strain === 0.5;
  E.kit.visionStrain(0.9); await frames(3);
  const hot = shown() && Math.abs(off() - C * 0.1) < 0.2 && b.classList.contains('strainHot') && !b.classList.contains('strainFull') && E.stakes().strainWarn === 0.85;
  E.kit.visionStrain(1.25); await frames(3);
  const full = shown() && off() < 0.01 && b.classList.contains('strainHot') && b.classList.contains('strainFull');
  E.kit.visionStrain(0); await frames(3);
  const empty = shown() && Math.abs(off() - C) < 0.2 && !b.classList.contains('strainHot');
  E.kit.visionStrain(null); await frames(3);
  const gone = !b.classList.contains('strain') && !b.classList.contains('strainHot') && getComputedStyle(ring).display === 'none' && E.stakes().strain === null;
  console.log('stakesStrain', JSON.stringify({ off0, half, hot, full, empty, gone }));
  return off0 && half && hot && full && empty && gone;
}).catch(e => { console.log('stakesStrain threw', e.message); return false; });
K.stakesShowcase = await p.evaluate(async () => {
  const E = window.__enc, el = document.getElementById('unlock');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const until = async (f, ms) => { const t0 = performance.now(); while (!f() && performance.now() - t0 < ms) await frames(1); return f(); };
  const label0 = el.querySelector('.unLabel').textContent, sub0 = 'Added to your bag';
  let told = 0;
  /* (auto 6 s, not 1.2: on a box drawing a frame a second, the three frames waited for before the look is read outlast a
     1.2 s showing, and build 20's run read a splash already gone: the game was right, the wait was the fault) */
  /* (18 Nov: auto 20 s. With two software renderers on the box three frames took longer than 6 s, and the look was read
     after the showing had gone: the same fault as build 20's, one step further) */
  const shown = E.kit.unlock('amulet', { gold: true, auto: 20, label: 'L1', name: 'N1', sub: 'S1', sound: 'itemunlock', onClose: () => { told++; } });
  await frames(3);
  const look = E.getState() === 'unlock' && el.classList.contains('gold') && el.querySelector('.unLabel').textContent === 'L1'
    && document.getElementById('unName').textContent === 'N1' && el.querySelector('.unSub').textContent === 'S1'
    && getComputedStyle(document.getElementById('unClose')).visibility === 'hidden';
  const t0 = performance.now();
  const gone = await until(() => E.getState() === 'play', 60000) && told === 1 && performance.now() - t0 > 600 && E.unlockState().id === null;
  await until(() => el.classList.contains('hide'), 5000);
  const plain = E.kit.unlock('amulet'); await frames(3);
  const back = !el.classList.contains('gold') && el.querySelector('.unLabel').textContent === label0 && el.querySelector('.unSub').textContent === sub0
    && getComputedStyle(document.getElementById('unClose')).visibility !== 'hidden';
  await new Promise(r => setTimeout(r, 900)); E.unlockClose('key');
  const closed = await until(() => E.getState() === 'play', 20000);
  console.log('stakesShowcase', JSON.stringify({ shown, look, gone, told, plain, back, closed, label0 }));
  return shown && look && gone && plain && back && closed;
}).catch(e => { console.log('stakesShowcase threw', e.message); return false; });
await settle();
/* v27.0 (seam 55, Chad 18 Nov: "no need for text at the top and bottom ... different from the 'item unlocked' effect. It
   should not totally obscure the whole screen"): `showcase` draws its own layer, not the splash: no word in it, nothing
   laid over the room (its layer is transparent where it has no light), the splash hidden; it flares before it goes, goes
   by itself, says so once, and hands play back */
K.stakesShowcaseOwn = await p.evaluate(async () => {
  const E = window.__enc, sc = document.getElementById('showcase'), un = document.getElementById('unlock');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const until = async (f, ms) => { const t0 = performance.now(); while (!f() && performance.now() - t0 < ms) await frames(1); return f(); };
  let told = 0;
  /* (auto 6 s, as the splash's check above: three frames on a slow box outlasted 1.6 s) */
  const shown = E.kit.unlock('amulet', { showcase: true, auto: 6, sound: 'itemunlock', onClose: () => { told++; } });
  await frames(3);
  const look = E.getState() === 'unlock' && !sc.classList.contains('hide') && un.classList.contains('hide') && sc.textContent.trim() === ''
    && getComputedStyle(sc).backgroundColor === 'rgba(0, 0, 0, 0)' && E.stakes().show === 'amulet' && !!document.getElementById('scCv')
    && !sc.classList.contains('sw') && getComputedStyle(sc.querySelector('.scShaft')).display !== 'none';
  const flared = await until(() => sc.classList.contains('flare') || E.getState() === 'play', 20000) && sc.classList.contains('flare');
  const gone = await until(() => E.getState() === 'play', 20000) && told === 1 && E.unlockState().id === null && E.stakes().show === null;
  const hidden = await until(() => sc.classList.contains('hide'), 5000);
  /* (R122) the same showcase asked to gather the Castlevania way (`gather: 'swirl'`): its own class on the layer (its shaft
     hidden, its birth held back: shell.html), and it flares, goes by itself and says so once, as the plain one does; the
     plain one above wore none of it */
  let told2 = 0;
  const swirl = E.kit.unlock('amulet', { showcase: true, gather: 'swirl', auto: 7, sound: 'itemunlock', onClose: () => { told2++; } });
  await frames(3);
  const swLook = E.getState() === 'unlock' && sc.classList.contains('sw') && getComputedStyle(sc.querySelector('.scShaft')).display === 'none';
  const swFlared = await until(() => sc.classList.contains('flare') || E.getState() === 'play', 30000) && sc.classList.contains('flare');
  const swGone = await until(() => E.getState() === 'play', 30000) && told2 === 1 && E.unlockState().id === null;
  console.log('stakesShowcaseOwn', JSON.stringify({ shown, look, flared, gone, told, hidden, swirl, swLook, swFlared, swGone }));
  return shown && look && flared && gone && hidden && swirl && swLook && swFlared && swGone;
}).catch(e => { console.log('stakesShowcaseOwn threw', e.message); return false; });
await settle();
/* v27.0 (seam 57, Chad 18 Nov: "empowers with a golden glow that spreads throughout the scene, tracing every item and
   silhouette similar to how the spirit vision works"): kit.wave goes out from him on wall time with his sight SHUT, drawn
   by the vision's pass (its frame count rises while the sight is shut), and ends by itself; null stops one at once */
K.stakesWave = await p.evaluate(async () => {
  const E = window.__enc;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const until = async (f, ms) => { const t0 = performance.now(); while (!f() && performance.now() - t0 < ms) await frames(1); return f(); };
  const v0 = E.vision(), w0 = E.stakes().wave;
  const off0 = !v0.on && v0.r === 0 && w0.on === false;
  /* (8 s, not 0.9: the wave runs on wall time, and on a box drawing a frame a second it had ended before its first read) */
  const ok = E.kit.wave({ color: 0xffc552, secs: 8, reach: 12 });
  await frames(3);
  const w1 = E.stakes().wave, d1 = E.vision().drawn;
  await frames(4);
  const w2 = E.stakes().wave, d2 = E.vision().drawn;
  const going = w1.on && w2.on && w2.R >= w1.R && w2.M > 0 && d2 > d1 && !E.vision().on;
  const ended = await until(() => E.stakes().wave.on === false, 20000) && E.stakes().wave.R === 0;
  const again = E.kit.wave({ secs: 5 }); await frames(2);
  const stopped = again && E.kit.wave(null) && E.stakes().wave.on === false;
  console.log('stakesWave', JSON.stringify({ off0, ok, w1, w2, d1, d2, going, ended, stopped }));
  return off0 && ok && going && ended && stopped;
}).catch(e => { console.log('stakesWave threw', e.message); return false; });
await settle();
/* v27.0 (seam 58, Chad 18 Nov, R50: "When looking at the old photo, i want the old photo to pop up in the middle of the
   screen in its full high resolution so that the player can actually see what it is, with a button to close it once the
   player is done seeing it."): A PICTURE, LOOKED AT. A picture the build does not carry is refused. The fixture's own
   spot, woken with a picture's key and pressed by a real E, opens kit.picture: a state of its own, nothing opening over it
   (not a second picture, not a splash), the world not drawn under it, and the very E that opened it refused by its guard;
   the picture drawn WHOLE at its own aspect from its own bytes (an episode-4 photograph, on the hosted build the suite
   drives), inside the window and centred, Close under it, its canvas at the screen's pixels and never past the file's own;
   past the guard a real click on Close shuts it, the chapter is told once, play and the world's drawing come back, the
   spot is retired, and the picture and its pixels are let go. Opened again from the kit, Esc shuts it */
await lbl('picture');
const picFrom = await p.evaluate(() => { const e = window.__enc;
  return { x: e.yaw.position.x, y: e.yaw.position.y, z: e.yaw.position.z, ry: e.yaw.rotation.y, px: e.pitch.rotation.x, cov: e.worldCovered() }; });
K.pictureRefusesUnknown = await p.evaluate(() => { const E = window.__enc;
  return E.getState() === 'play' && E.kit.picture('no_such_picture') === false && E.kit.pictureOpen() === false && E.getState() === 'play'; });
await p.evaluate(() => { const h = window.__enc.stage.hotspots.find(x => x.id === 'photo'); h.armed = 'w4t_oldphoto'; });
await aimFrom9(6, -4);
await until(() => window.__enc.kitDebug().hotspot === 'photo', 20000).catch(() => {});
K.pictureOffered = (await spotNow()) === 'photo';
await p.keyboard.press('KeyE');
K.pictureOpens = await until(() => window.__enc.getState() === 'picture', 20000).then(() => true, () => false)
  && await p.evaluate(() => { const E = window.__enc, el = document.getElementById('picture'), s = E.pictureState();
    return s.key === 'w4t_oldphoto' && s.open && E.kit.pictureOpen() === true && !el.classList.contains('hide')
      && document.body.classList.contains('pictureopen') && E.worldCovered() === true
      && E.kit.picture('w4t_oldphoto') === false && E.kit.unlock('amulet') === false && E.getState() === 'picture'; });
/* (the E that opened it reached the window's own keys as well, and its guard refused it: still open) */
K.pictureGuards = await p.evaluate(() => window.__enc.pictureState().guarded >= 1 && window.__enc.getState() === 'picture');
const picLook = await until(() => { const s = window.__enc.pictureState(), bx = document.querySelector('#picture .picBox');
    return s.drawn > 0 && !document.getElementById('picture').classList.contains('wait') && bx.getAnimations().every(a => a.playState === 'finished'); }, 30000)
  .then(() => p.evaluate(() => {
    const s = window.__enc.pictureState(), cv = document.getElementById('picImg'), r = cv.getBoundingClientRect(), b = document.getElementById('picClose').getBoundingClientRect();
    const d = cv.getContext('2d').getImageData(cv.width >> 1, cv.height >> 1, 1, 1).data;
    return { s, r: { l: r.left, t: r.top, w: r.width, h: r.height }, b: { t: b.top, bt: b.bottom, l: b.left, rt: b.right }, a: d[3], vw: innerWidth, vh: innerHeight };
  }), () => null);
K.pictureWhole = !!picLook && !!picLook.s.nat && (() => { const { s, r, b, a, vw, vh } = picLook;
  return Math.abs(r.w / r.h - s.nat.w / s.nat.h) < 0.01                                                // whole, at its own aspect
    && r.l >= 0 && r.t >= 0 && r.l + r.w <= vw && r.t + r.h <= vh && Math.abs(r.l + r.w / 2 - vw / 2) < 2   // inside the window, centred
    && b.t >= r.t + r.h && b.bt <= vh && b.l >= 0 && b.rt <= vw                                       // Close under it, on the screen
    && s.canvas.w <= s.nat.w && s.canvas.h <= s.nat.h && r.w <= s.nat.w + 0.5 && s.canvas.w >= Math.round(r.w) - 1   // its own pixels at most; the screen's
    && a === 255; })();
if (!K.pictureWhole) console.log('picture', JSON.stringify(picLook));
await until(() => (window.__enc.pictureState().age || 0) > 700, 20000).catch(() => {});   // past the guard, certainly
await p.click('#picClose', { force: true }).catch(err => console.log('picClose click failed:', err.message.split('\n')[0]));
K.pictureClosesOnButton = await until(() => window.__enc.getState() === 'play' && window.__enc.pictureState().key === null, 20000).then(() => true, () => false)
  && await p.evaluate((cov) => { const E = window.__enc, h = E.stage.hotspots.find(x => x.id === 'photo');
    return h.seen === 1 && h.done === true && E.kit.pictureOpen() === false && !document.body.classList.contains('pictureopen') && E.worldCovered() === cov; }, picFrom.cov);
K.pictureLetsGo = await until(() => document.getElementById('picture').classList.contains('hide'), 20000).then(() => true, () => false)
  && await p.evaluate(() => { const s = window.__enc.pictureState(); return s.nat === null && s.canvas.w === 0 && s.canvas.h === 0; });
const picEsc = await p.evaluate(() => { window.__picTold = 0; return window.__enc.kit.picture('w4t_oldphoto', { onClose: () => { window.__picTold++; } }); });
await until(() => (window.__enc.pictureState().age || 0) > 700, 20000).catch(() => {});
await p.keyboard.press('Escape');
K.pictureEsc = picEsc && await until(() => window.__enc.getState() === 'play' && window.__picTold === 1, 20000).then(() => true, () => false);
/* (whatever happened above, the window is not left up over the checks that follow, and he stands where he stood) */
await p.evaluate((f) => { const e = window.__enc; if (e.kit.pictureOpen()) e.pictureClose('click');
  e.yaw.position.set(f.x, f.y, f.z); e.yaw.rotation.y = f.ry; e.pitch.rotation.x = f.px; }, picFrom);
await settle();

/* v22.0: THE COLD (the thirty-third, -fourth and -fifth seams) — kit.chill shows the edge layer with a blur and
   puts a filter on the canvas, and at 0 takes both away entirely; kit.pulse beats on the wall clock at the rate
   asked (a beat is counted as it lands), its erratic heart comes early and drops beats, and null hands the monitor
   back; kit.smear lays the last frame over this one (it draws and copies, with no GL error) and at 0 frees its
   texture. Before and after, nothing of any of them is left: no layer, no filter, no heart, no texture */
await lbl('cold');
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
  /* v25.0: THE FOG — the same cold in grey when a chapter names the tint, and the Yin shop's blue again the moment it
     is unset (an unnamed tint paints the very strings it always did; the browser reads a colour back with spaces) */
  const blue0 = /104,\s*158,\s*232/.test(c1.chill.tintBg) && c1.chill.tint === null;
  E.kit.chill(1, { secs: 0, tint: 'grey' });
  await frames(3);
  const cg = E.cold();
  const grey = /156,\s*158,\s*162/.test(cg.chill.tintBg) && !/104,\s*158,\s*232/.test(cg.chill.tintBg) && cg.chill.tint !== null;
  E.kit.chill(1, { secs: 0, tint: null });
  await frames(3);
  const blue1 = /104,\s*158,\s*232/.test(E.cold().chill.tintBg) && E.cold().chill.tint === null;
  const fog = blue0 && grey && blue1;
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
  console.log('coldSeam', JSON.stringify({ clean0, chilled, fog, beats, wild, smeared, clean, smear: s1 }));
  return clean0 && chilled && fog && beats && wild && smeared && clean;
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
    // v26.0: a breath's reports, its level and its states (each state's first moment on the event's own clock), the same way
    if (o.breathTag) { const t = o.breathTag, G = window[t] = { reps: [], enough: [], idle: [], levels: 0, max: 0, states: [] }, lead = o.breathLead;
      o.onBreath = (r) => { G.reps.push(r); return lead; };
      o.onEnough = (i) => { G.enough.push(i); };
      o.onIdle = (i) => { G.idle.push(i); };
      o.onLevel = (k, held, i, st, gk) => { G.levels++; G.max = Math.max(G.max, k); if (gk != null) G.gk = Math.max(G.gk || 0, gk); const L = G.states[G.states.length - 1];
        if (!L || L[0] !== st || L[1] !== i) G.states.push([st, i, window.__enc.kitDebug().event.t]); }; }
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
/* (v27.0: sanity PINNED. The fixture's own ghost drains it on wall time all through these checks, about 0.8 a second on
   this box (the trace of run 7: 92 at 46 s down to 0 at 204 s, through every block); since the checks of seams 50 to 52
   wait for what they prove, the run is longer, and it fainted before the amulet. Nothing here tests sanity) */
await p.evaluate(() => { window.__enc.stats.sanity = 100; });
await lbl('events');
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
const beatAnswered = r.sum, beatRun = r;
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
/* v27.0 · S52: HOLD THE ROOM. A guard opens on its briefing with its own picture (the eye, the wave, the shape, the
   drop, the fingertip); START, a real tap, answers { ok: true } at once and PLAY comes back (no evopen); the objective's
   bar stands at the share kit.bar gives, steps aside on null, and the reset at the end clears it */
await lbl('guard');
r = await runEvent({ kind: 'guard', brief: 'Keep the room.', label: 'HOLD THE ROOM' }, async () => {
  K.guardIllustrates = await p.evaluate(() => {
    const dm = document.getElementById('evDemo');
    return dm.className === 'guard' && getComputedStyle(dm).display !== 'none'
      && getComputedStyle(dm.querySelector('.dhs')).display !== 'none' && getComputedStyle(dm.querySelector('.dhe')).display !== 'none';
  });
  await tapOnce();                      // START
});
K.guardHandsBack = r.kind === 'guard' && r.ok === true
  && await p.evaluate(() => !document.body.classList.contains('evopen') && window.__enc.getState() === 'play');
/* (polled, never a count of frames, v8.7; the order that stood before is put back as it was, with no COMPLETE either
   way: a first version set its own over it and cleared it after, so the box said COMPLETE twice, the bar rightly stood
   aside under that banner and failed, and the timer's check further on found no order left to paint its box) */
K.guardBar = await p.evaluate(async () => {
  const E = window.__enc;
  const until = (f, ms = 30000) => new Promise(rs => { const t0 = performance.now();
    const g = () => (f() ? rs(true) : performance.now() - t0 > ms ? rs(false) : requestAnimationFrame(g)); requestAnimationFrame(g); });
  const prev = E.kitDebug().objective;
  E.kit.objective('Keep the room', { complete: false });
  E.kit.bar(0.5);
  const el = document.getElementById('objBar');
  const shown = await until(() => !el.classList.contains('hide') && Math.abs(parseFloat(el.firstElementChild.style.width) - 50) < 0.6);
  E.kit.bar(null);
  const gone = await until(() => el.classList.contains('hide')) && E.kitBar() === null;
  E.kit.bar(0.8);                       // left standing for the reset at the end to clear
  E.kit.objective(prev, { complete: false });
  return shown && gone && E.kitBar() === 0.8;
});
await p.evaluate(() => { window.__enc.stats.sanity = 100; });   // (pinned again: see the note before the events)
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
if (!K.evHeartbeatRewardsTiming) console.log('heartbeat answered:', JSON.stringify({ sum: beatRun.sum, band: beatRun.band, hits: beatRun.hits, misses: beatRun.misses }), 'missed:', JSON.stringify({ sum: r.sum, band: r.band }));
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
await lbl('hotspot');
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

await p.evaluate(() => { window.__enc.stats.sanity = 100; });   // (pinned again: see the note before the events)
await lbl('bed');
// pose: the bed lies him down, walking stops, the neck narrows; the bed stands him up
await p.evaluate(() => { const e = window.__enc; e.yaw.position.set(6, 1.62, 7.8); e.yaw.rotation.y = 0; e.pitch.rotation.x = 0; });   // (build 54: the view too, not what earlier steps left)
await settle();
K.poseLies = await p.evaluate(() => window.__enc.kitDebug().hotspot === 'bed' && window.__enc.interactNow() === true)
  && await p.waitForFunction(() => window.__enc.kitDebug().pose === 'lying' && window.__enc.kitDebug().eyeY < 0.7, null, { timeout: 60000 }).then(() => true).catch(() => false);
/* (v27.0 build 54) when the bed does not lie him down, say what the page held: the state, the spot the badge named, the
   pose and the eye, where he stood and looked (the three pose checks failed together once under two browsers' load) */
if (!K.poseLies) console.log('bed:', JSON.stringify(await p.evaluate(() => { const e = window.__enc, d = e.kitDebug();
  return { st: e.getState(), hotspot: d.hotspot, pose: d.pose, eyeY: d.eyeY, at: [+e.yaw.position.x.toFixed(2), +e.yaw.position.z.toFixed(2)],
           ry: +e.yaw.rotation.y.toFixed(3), px: +e.pitch.rotation.x.toFixed(3), ev: !!d.event }; })));
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

/* (v27.0: sanity PINNED here too. The fixture's own ghost drains it on WALL time while she is present, and the checks
   added before this point (HOLD THE ROOM's) moved her timeline: run 5's player fainted between the pin to 60 above and
   the amulet below, so the splash was refused and every check after it read a run already lost. The clock below
   measures its own cost from wherever sanity stands, and the amulet's ward checks set their own) */
await p.evaluate(() => { window.__enc.stats.sanity = 60; });
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
if (!K.tapTakesTheThing || !K.unlockOpens) console.log('first splash:', JSON.stringify({ relicAt, took: K.tapTakesTheThing, opens: K.unlockOpens, trace: await p.evaluate(() => window.__sanTrace),
  now: await p.evaluate(() => { const e = window.__enc; return { state: e.getState(), unlock: e.unlockState(), sanity: e.stats.sanity, ev: !!e.kitDebug().event }; }) }));
await p.waitForTimeout(900);
await p.keyboard.press('Enter');
K.unlockClosesOnKey = await until(() => window.__enc.getState() === 'play' && window.__enc.unlockState().id === null)
  .then(() => true, () => false);
K.tapRetires = !!relicAt && await p.evaluate(a => window.__enc.hotspotTap(a.cx, a.cy) === false, relicAt);   // `once`
// a second splash, closed by its own button
/* (v27.0: a refused splash is a false check with the reason printed, never a crash of the whole harness: a click on a
   button that never showed threw, and every check after it went unreported) */
const unlock2 = await p.evaluate(() => window.__enc.kit.unlock('amulet'));
if (!unlock2) console.log('second splash refused:', JSON.stringify(await p.evaluate(() => {
  const e = window.__enc; return { state: e.getState(), unlock: e.unlockState(), sanity: e.stats.sanity, ev: !!e.kitDebug().event };
})));
await p.waitForTimeout(900);
if (unlock2) await p.click('#unClose', { force: true }).catch(err => console.log('unClose click failed:', err.message.split('\n')[0]));
K.unlockClosesOnButton = !!unlock2 && await until(() => window.__enc.getState() === 'play' && window.__enc.unlockState().id === null)
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
/* v25.5: THE FORTY-THIRD SEAM — a film's fade in a colour. The fixture's `flash` film lays a white over the screen, takes
   it off, then fades to half black: the fade's element is white while the white stands (at full strength at least
   once), and the black's own colour whenever a plain fade stands and after the film; and a film with no coloured fade
   (the phone's, just above) never moved the colour at all */
K.fadeColour = await p.evaluate(() => { const e = window.__enc, el = document.getElementById('cineFade'); window.__fcDone = null;
  window.__fc = { white: 0, whiteWrong: 0, black: 0, blackWrong: 0, inline0: el.style.background };
  const ok = e.kit.film('flash', { onDone: () => { window.__fcDone = true; } });
  const f = () => { const cs = getComputedStyle(el), op = +cs.opacity, bg = cs.backgroundColor, t = e.cine.active() ? e.cine.t() : -1, F = window.__fc;
    if (t > 0.75 && t < 1.45) { if (bg === 'rgb(255, 255, 255)' && op > 0.95) F.white++; else F.whiteWrong++; }
    if (t > 2.6 && t < 3.3 && op > 0.02) { if (bg === 'rgb(0, 0, 0)') F.black++; else F.blackWrong++; }
    if (!window.__fcDone) requestAnimationFrame(f); };
  requestAnimationFrame(f);
  return ok; })
  && await until(() => window.__fcDone === true && window.__enc.getState() === 'play', 60000).then(() => true, () => false)
  && await p.evaluate(() => { const F = window.__fc, el = document.getElementById('cineFade');
    return F.inline0 === '' && F.white >= 1 && F.whiteWrong === 0 && F.black >= 1 && F.blackWrong === 0
      && el.style.background === '' && getComputedStyle(el).backgroundColor === 'rgb(0, 0, 0)'; });
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
/* v24.24: a NEW list set while the old list's entry 0 is still up shows ITS words (the painter compared only the index,
   so the old words stayed — episode 4 chapter 1's back-to-back lines). Windows of seconds, for a slow box */
await p.evaluate(() => window.__enc.kit.captions([{ at: 0, end: 20, text: 'List A' }]));
K.captionListA = await until(() => document.getElementById('caption').querySelector('.capMain').textContent === 'List A'
  && document.getElementById('caption').classList.contains('on'), 15000).then(() => true, () => false);
await p.evaluate(() => window.__enc.kit.captions([{ at: 0, end: 20, text: 'List B' }]));
K.captionListReplaced = await until(() => document.getElementById('caption').querySelector('.capMain').textContent === 'List B'
  && document.getElementById('caption').classList.contains('on'), 15000).then(() => true, () => false);
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
await p.evaluate(() => window.__enc.kit.vision(true));   // v27.0: Spirit Vision open as the film begins, so its close is seen
K.filmSkip = await filmGo();
K.visionClosedByFilm = await p.evaluate(() => { const v = window.__enc.vision(); return v.decl === true && v.on === false && v.r === 0 && v.dir === 0 && !document.body.classList.contains('visionOn'); });
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
/* S46 · BREATH (v26.0), OPEN AND CLOSE: hold to open, let go to close. Every check drives the real press path and waits
   on the event's own state, never a stopwatch (this box draws a frame a second; a held frame credits a second at most,
   so each band here is far wider than that). */
{
  const inBand = () => { const d = window.__enc.kitDebug().event; return !d || ((d.bState === 'open' || d.bState === 'pull') && d.bk >= d.bE); };
  const stateIs = (st) => { const d = window.__enc.kitDebug().event; return !d || d.bState === st; };
  const tag = () => p.evaluate(() => window.__br);
  /* let go inside the band: closed in time; the gain is paid on the spot; the chapter was told the band was reached and
     was handed the level every frame; the ring stood on the screen */
  /* (what a breath paid is read from its own REPORT, at the moment it charged: the fixture's ghost drains sanity the whole
     time and a worn amulet may soak a cost, so the bars themselves are no measure here. Awareness nothing else moves.) */
  const awWas = await p.evaluate(() => { const a = window.__enc.stats.awareness; window.__enc.stats.awareness = 50; return a; });   // (room to gain; put back below)
  let aw0 = 50;
  r = await runEvent({ kind: 'breath', breaths: [{ enough: 0.4, edge: 60, told: true }], lead: 0.1, gain: 2, cost: 2, breathTag: '__br', at: { sx: 0.5, sy: 0.6 } }, async () => {
    await untilEv(stateIs, 'wait');
    K.breathRing = await p.evaluate(() => { const el = document.getElementById('evBreath'); return !!el && !el.classList.contains('hide') && el.classList.contains('live'); });
    await press(); await untilEv(inBand);
    K.breathToldClose = await p.evaluate(() => document.getElementById('evPrompt').textContent === 'CLOSE');
    await release();
  });
  let G = await tag();
  K.breathClosed = r.kind === 'breath' && r.ok === true && r.closed === 1 && r.held === 0 && r.unopened === 0 && r.breaths[0].result === 'closed' && r.score === 1;
  K.breathGainPaid = Math.abs(await p.evaluate(() => window.__enc.stats.awareness) - (aw0 + 2)) < 1e-9 && r.breaths[0].gain === 2 && r.breaths[0].paid === undefined;
  await p.evaluate((a) => { window.__enc.stats.awareness = a; }, awWas);
  K.breathCallbacks = G.reps.length === 1 && G.enough.join() === '0' && G.levels > 0 && G.max > 0 && G.max < 1;
  /* held to the edge: it is closed FOR him (the cost paid on the spot), the level falls though the finger is still down,
     and the next breath does not begin until that finger has lifted; then it is his again */
  r = await runEvent({ kind: 'breath', breaths: [{ enough: 0.2, edge: 1.2 }, { enough: 0.4, edge: 60 }], lead: 0.1, gain: 0, cost: 3, breathTag: '__br' }, async () => {
    await untilEv(stateIs, 'wait'); await press();
    await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || (d.bi === 1 && d.bState === 'lead' && d.bk <= 0); });
    K.breathHeldPaid = await p.evaluate(() => { const q = window.__br.reps; return q.length === 1 && q[0].result === 'held' && q[0].paid === -3; });   // (charged already: his finger is still down)
    await settle(); await settle();
    K.breathWaitsForLift = await p.evaluate(() => { const d = window.__enc.kitDebug().event; return !!d && d.bi === 1 && d.bState === 'lead'; });
    await release(); await untilEv(stateIs, 'wait'); await press(); await untilEv(inBand); await release();
  });
  G = await tag();
  K.breathHeld = r.held === 1 && r.closed === 1 && r.breaths[0].result === 'held' && r.breaths[0].paid === -3 && r.breaths[1].result === 'closed' && r.ok === true && Math.abs(r.score - 0.5) < 1e-9;
  /* let go under the band: not opened; that breath is taken once more (and a tap shorter than a frame is still a try);
     the second time it counts, whatever he did; nothing is paid */
  aw0 = await p.evaluate(() => window.__enc.stats.awareness);
  r = await runEvent({ kind: 'breath', breaths: [{ enough: 40, edge: 60 }], lead: 0.1, breathTag: '__br' }, async () => {
    await untilEv(stateIs, 'wait');
    await p.evaluate(() => { window.__enc.evPress(); window.__enc.evRelease(); });        // down and up in one task: no frame saw it down
    await untilEv(() => window.__br.reps.length >= 1);
    await untilEv(stateIs, 'wait'); await press(); await untilEv(stateIs, 'open'); await release();
  });
  G = await tag();
  K.breathUnopened = r.unopened === 1 && r.closed === 0 && r.breaths.length === 1 && r.ok === false && G.reps.length === 2 && G.reps[0].again === true && G.reps[1].again === false;
  K.breathUnopenedFree = Math.abs(await p.evaluate(() => window.__enc.stats.awareness) - aw0) < 1e-9 && G.reps.every(q => q.gain === undefined && q.paid === undefined);
  /* E holds it as a finger does */
  r = await runEvent({ kind: 'breath', breaths: [{ enough: 0.4, edge: 60 }], lead: 0.1, gain: 0 }, async () => {
    await untilEv(stateIs, 'wait'); await p.keyboard.down('KeyE'); await untilEv(inBand); await p.keyboard.up('KeyE');
  });
  K.breathKey = r.closed === 1;
  /* a breath that pulls goes on opening after he lets go, then is his */
  r = await runEvent({ kind: 'breath', breaths: [{ enough: 0.4, edge: 60, pull: 0.6 }], lead: 0.1, gain: 0, breathTag: '__br' }, async () => {
    await untilEv(stateIs, 'wait'); await press(); await untilEv(inBand); await release();
  });
  G = await tag();
  K.breathPull = r.closed === 1 && G.states.some(q => q[0] === 'pull');
  /* the chapter's answer to a report is how long the next breath waits (the length of what it then says) */
  r = await runEvent({ kind: 'breath', breaths: [{ enough: 0.4, edge: 60 }, { enough: 0.4, edge: 60 }], lead: 0.1, gain: 0, breathTag: '__br', breathLead: 1.4 }, async () => {
    for (let k = 0; k < 2; k++) { await untilEv((i) => { const d = window.__enc.kitDebug().event; return !d || (d.bi === i && d.bState === 'wait'); }, k); await press(); await untilEv(inBand); await release(); }
  });
  G = await tag();
  { const lead1 = G.states.find(q => q[0] === 'lead' && q[1] === 1), wait1 = G.states.find(q => q[0] === 'wait' && q[1] === 1);
    K.breathLeadIsTheChapters = r.closed === 2 && !!lead1 && !!wait1 && wait1[2] - lead1[2] >= 1.4 - 1e-6; }
  /* nobody touches it: the chapter is told once, and as long again later the breath is counted; it never soft-locks */
  r = await runEvent({ kind: 'breath', breaths: [{ enough: 0.4, edge: 60 }], lead: 0.1, idle: 0.5, breathTag: '__br' }, null);
  G = await tag();
  K.breathNeverLocks = r.unopened === 1 && r.ok === false && G.idle.join() === '0' && G.reps.length === 1 && G.reps[0].again === false;
}
/* S49 · THE GATE (v26.3), OPEN AND CLOSE BY HAND: a drag up opens it, the lights come in as fast as it stands open, a
   drag down shuts it. The breath's bookkeeping under it (S46), so the same proofs, each by REAL pointer events on the
   overlay (one finger, its own id) and the real keyboard, waiting on the event's own state (gk, bk, bState) */
const gateDrag = async (k, id = 21) => { const L = k * 0.34 * C.h, y0 = C.y + L / 2;     // (k of the gate's span: up opens)
  await ptr('pointerdown', C.x, y0, { id }); for (let i = 1; i <= 8; i++) await ptr('pointermove', C.x, y0 - L * i / 8, { id }); await ptr('pointerup', C.x, y0 - L, { id }); };
{
  const st = (s) => { const d = window.__enc.kitDebug().event; return !d || d.bState === s; };
  const inBandG = () => { const d = window.__enc.kitDebug().event; return !d || (d.bState === 'open' && d.bk >= d.bE); };
  const tag = () => p.evaluate(() => window.__br);
  /* shut with enough come in: closed (the gain paid on the spot); the drag opened it; told, the word is CLOSE and the
     finger shows the way down; the chapter was handed the level and the gate every frame */
  const awWas = await p.evaluate(() => { const a = window.__enc.stats.awareness; window.__enc.stats.awareness = 50; return a; });
  r = await runEvent({ kind: 'gate', breaths: [{ enough: 0.4, edge: 60, told: true }], lead: 0.1, gain: 2, cost: 2, breathTag: '__br', at: { sx: 0.5, sy: 0.6 } }, async () => {
    await untilEv(st, 'wait');
    K.gateShown = await p.evaluate(() => { const el = document.getElementById('evGate'); return !!el && !el.classList.contains('hide') && el.classList.contains('live'); });
    await gateDrag(1); await untilEv(inBandG);
    K.gateOpensByDrag = await p.evaluate(() => window.__enc.kitDebug().event.gk >= 0.9);
    K.gateToldClose = await p.evaluate(() => document.getElementById('evPrompt').textContent === 'CLOSE' && document.getElementById('evGate').classList.contains('told'));
    await gateDrag(-1);
  });
  let G = await tag();
  K.gateClosed = r.kind === 'gate' && r.ok === true && r.closed === 1 && r.held === 0 && r.unopened === 0 && r.breaths[0].result === 'closed' && r.score === 1;
  K.gateGainPaid = Math.abs(await p.evaluate(() => window.__enc.stats.awareness) - 52) < 1e-9 && r.breaths[0].gain === 2 && r.breaths[0].paid === undefined;
  await p.evaluate((a) => { window.__enc.stats.awareness = a; }, awWas);
  K.gateCallbacks = G.reps.length === 1 && G.enough.join() === '0' && G.levels > 0 && G.max > 0 && G.max < 1 && G.gk >= 0.9;
  /* left wide open: they crowd him, it is shut FOR him (the cost on the spot), and the next breath waits for the finger
     still down to lift; then it is his again */
  r = await runEvent({ kind: 'gate', breaths: [{ enough: 0.2, edge: 1.2 }, { enough: 0.4, edge: 60 }], lead: 0.1, gain: 0, cost: 3, breathTag: '__br' }, async () => {
    await untilEv(st, 'wait');
    await ptr('pointerdown', C.x, C.y + 0.2 * C.h, { id: 22 }); for (let i = 1; i <= 8; i++) await ptr('pointermove', C.x, C.y + 0.2 * C.h - 0.4 * C.h * i / 8, { id: 22 });
    await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || (d.bi === 1 && d.bState === 'lead' && d.bk <= 0); });
    K.gateHeldPaid = await p.evaluate(() => { const q = window.__br.reps; return q.length === 1 && q[0].result === 'held' && q[0].paid === -3; });
    await settle(); await settle();
    K.gateWaitsForLift = await p.evaluate(() => { const d = window.__enc.kitDebug().event; return !!d && d.bi === 1 && d.bState === 'lead'; });
    await ptr('pointerup', C.x, C.y - 0.2 * C.h, { id: 22 });
    await untilEv(st, 'wait'); await gateDrag(1); await untilEv(inBandG); await gateDrag(-1);
  });
  K.gateHeld = r.held === 1 && r.closed === 1 && r.breaths[0].result === 'held' && r.breaths[0].paid === -3 && r.breaths[1].result === 'closed' && r.ok === true && Math.abs(r.score - 0.5) < 1e-9;
  /* a tap moves nothing (a drag opens it); shut before enough has come: not opened, that breath taken once more, and the
     second time it counts; nothing is paid */
  const aw0 = await p.evaluate(() => window.__enc.stats.awareness);
  r = await runEvent({ kind: 'gate', breaths: [{ enough: 40, edge: 60 }], lead: 0.1, breathTag: '__br' }, async () => {
    await untilEv(st, 'wait');
    await ptr('pointerdown', C.x, C.y, { id: 23 }); await ptr('pointerup', C.x, C.y, { id: 23 }); await settle();
    K.gateTapMovesNothing = await p.evaluate(() => { const d = window.__enc.kitDebug().event; return !!d && d.bState === 'wait' && d.gk === 0 && window.__br.reps.length === 0; });
    await gateDrag(1); await untilEv(st, 'open'); await gateDrag(-1);
    await untilEv(() => window.__br.reps.length >= 1);
    await untilEv(st, 'wait'); await gateDrag(1); await untilEv(st, 'open'); await gateDrag(-1);
  });
  G = await tag();
  K.gateUnopened = r.unopened === 1 && r.closed === 0 && r.breaths.length === 1 && r.ok === false && G.reps.length === 2 && G.reps[0].again === true && G.reps[1].again === false;
  K.gateUnopenedFree = Math.abs(await p.evaluate(() => window.__enc.stats.awareness) - aw0) < 1e-9 && G.reps.every(q => q.gain === undefined && q.paid === undefined);
  /* W held opens it, S held shuts it */
  r = await runEvent({ kind: 'gate', breaths: [{ enough: 0.4, edge: 60 }], lead: 0.1, gain: 0 }, async () => {
    await untilEv(st, 'wait'); await p.keyboard.down('KeyW'); await untilEv(inBandG); await p.keyboard.up('KeyW');
    await p.keyboard.down('KeyS'); await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || d.bState !== 'open'; }); await p.keyboard.up('KeyS');
  });
  K.gateKeys = r.closed === 1;
  /* a gate that pulls: once it is enough it creeps open while he lets go, and a drag down shuts it only part as far */
  r = await runEvent({ kind: 'gate', breaths: [{ enough: 0.4, edge: 60, pull: 1 }], lead: 0.1, gain: 0, breathTag: '__br' }, async () => {
    await untilEv(st, 'wait'); await gateDrag(0.5); await untilEv(inBandG);
    const g0 = (await evd()).gk; await settle(); await settle(); const g1 = (await evd()).gk;
    K.gatePullCreeps = g1 > g0 + 0.01 && await p.evaluate(() => document.getElementById('evGate').classList.contains('pull'));
    await gateDrag(-1); const d1 = await evd(); K.gatePullHeavy = !!d1 && d1.bState === 'open' && d1.gk > 0.2;
    for (let k = 0; k < 4; k++) { const d = await evd(); if (!d || d.bState !== 'open') break; await gateDrag(-1); }
  });
  K.gatePull = r.closed === 1;
  /* the chapter's answer to a report is how long the next breath waits */
  r = await runEvent({ kind: 'gate', breaths: [{ enough: 0.4, edge: 60 }, { enough: 0.4, edge: 60 }], lead: 0.1, gain: 0, breathTag: '__br', breathLead: 1.4 }, async () => {
    for (let k = 0; k < 2; k++) { await untilEv((i) => { const d = window.__enc.kitDebug().event; return !d || (d.bi === i && d.bState === 'wait'); }, k); await gateDrag(1); await untilEv(inBandG); await gateDrag(-1); }
  });
  G = await tag();
  { const lead1 = G.states.find(q => q[0] === 'lead' && q[1] === 1), wait1 = G.states.find(q => q[0] === 'wait' && q[1] === 1);
    K.gateLeadIsTheChapters = r.closed === 2 && !!lead1 && !!wait1 && wait1[2] - lead1[2] >= 1.4 - 1e-6; }
  /* nobody touches it: the chapter is told once, and as long again later the breath is counted; it never soft-locks */
  r = await runEvent({ kind: 'gate', breaths: [{ enough: 0.4, edge: 60 }], lead: 0.1, idle: 0.5, breathTag: '__br' }, null);
  G = await tag();
  K.gateNeverLocks = r.unopened === 1 && r.ok === false && G.idle.join() === '0' && G.reps.length === 1 && G.reps[0].again === false;
}
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
for (const [kind, pic, extra] of [['craft', 'twist', { steps: [{ g: 'tap' }] }], ['yield', 'press', { fill: 0.2 }], ['surface', 'surface', { secs: 0.6 }],
                                  ['breath', 'breath', { breaths: [{ enough: 0.3, edge: 60 }], lead: 0.1 }],     // (v26.0: and a ring opening under a held finger)
                                  ['gate', 'gate', { breaths: [{ enough: 0.3, edge: 60 }], lead: 0.1 }]]) {      // (v26.3: and a gate dragged open and shut)
  let shown = false;
  r = await runEvent(Object.assign({ kind, brief: 'How it is played.' }, extra), async () => {
    shown = await p.evaluate(pic => { const dm = document.getElementById('evDemo');
      return dm.className === pic && getComputedStyle(dm).display !== 'none'; }, pic);
    await tapOnce();                      // START
    if (kind === 'craft') { await p.waitForTimeout(300); await tapOnce(); }
    if (kind === 'yield') { await press(); await untilEv(evGone, null, 30000); await release(); }
    if (kind === 'breath') { await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || d.bState === 'wait'; }); await press();
      await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || (d.bState === 'open' && d.bk >= d.bE); }); await release(); }
    if (kind === 'gate') { await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || d.bState === 'wait'; }); await gateDrag(1);
      await untilEv(() => { const d = window.__enc.kitDebug().event; return !d || (d.bState === 'open' && d.bk >= d.bE); }); await gateDrag(-1); }
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

/* ---- v28.0: THE TAG MODE AND ITS SEAMS (60 to 65), on the fixture's plain-shapes fight --------------------------------
   docs/V28.0-SEAMS.md is the reference; docs/V28.0-E4C5-PLAN.md §12 the proofs asked of each seam. The parts of every check
   are kept in window.__tag (and printed when one fails). Real input wherever a player's input is the thing proved: the keys
   and the mouse through the browser (CDP), the touches on the phone page below; the fixture's own verbs where the chapter is
   the one that acts. Sanity is never compared live (the fixture's ghost drains it on wall time): what the mode HOLDS is
   compared with what a save would write, and what a retry gives back is read the moment the card hands back */
await lbl('tag');
/* (sanity PINNED for the whole block, as every block before it is: her drain runs on wall time, about 0.8 a second, and
   these checks wait for what they prove, minutes in all. Nothing here tests sanity but the red edge, which sets its own
   and puts it back, with the pin held off while it looks) */
await p.evaluate(() => { const E = window.__enc; E.stats.sanity = 100;
  window.__tagPin = setInterval(() => { if (!window.__noPin && E.stats.sanity < 50) E.stats.sanity = 100; }, 1000); });
/* (the mouse free, as a player who presses Esc has it: under the walk's pointer lock every click is the lens's, and a
   button of the chapter's own is pressed by its key there; the block's clicks are a free mouse's) */
await p.evaluate(() => document.exitPointerLock?.());
await p.waitForFunction(() => !document.pointerLockElement, null, { timeout: 20000 }).catch(() => {});
/* (a trace of the mode's state while the block runs, printed when a check of it fails: [seconds, state, on, live, played,
   a minigame open, the check last begun]) */
await p.evaluate(() => { const E = window.__enc; window.__tagTrace = []; let last = '';
  window.__tagTraceT = setInterval(() => { const T = E.tag(), s = [E.getState(), T.on, T.live, T.played, !!E.kitDebug().event].join(' ');
    if (s !== last) { window.__tagTrace.push([Math.round(performance.now() / 100) / 10, s, window.__lbl || '']); last = s; if (window.__tagTrace.length > 400) window.__tagTrace.shift(); } }, 150); });
const tagParts = {};
const TAG_HELP = `
  const E = window.__enc, kit = E.kit, st = E.stage, F = st.fight;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const poll = async (fn, ms) => { const t0 = performance.now(); while (!fn()) { if (performance.now() - t0 > ms) return false; await frames(1); } return true; };
  const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;
  const logSince = (n) => E.tag().log.slice(n);
`;
const tagEval = (body, arg) => p.evaluate(new Function('arg', 'return (async () => {' + TAG_HELP + body + '})();'), arg);
const tagCheckSrc = async (name, body, arg) => {
  await p.evaluate(n => { window.__lbl = 'tag.' + n; }, name);
  const r = await tagEval(body, arg).catch(e => ({ threw: String(e && e.message || e) }));
  tagParts[name] = r;
  /* (a part named with a leading _ is a reading kept for the log, never part of the verdict) */
  const ok = !!r && typeof r === 'object' && !r.threw && Object.entries(r).every(([k, v]) => k[0] === '_' || v === true);
  if (!ok) console.log('tag ' + name + ' parts:', JSON.stringify(r));
  return ok;
};
const tagUntil = (body, ms = 30000) => p.waitForFunction(new Function('return (() => {' + TAG_HELP + body + '})();'), null, { timeout: ms, polling: 100 }).then(() => true, () => false);

/* 61 · A BUTTON OF THE CHAPTER'S OWN: shown in the column above the eye (21 Nov: the eye a row lower), pressed by a click and by its key, its wait refusing
   a press, its lock said and never pressed, hidden under the menu; (in the mode, hidden: below; kitReset: at the end) */
await tagEval(`window.__nose = []; kit.button('nose', { label: 'SNIFF', key: 'KeyN', onPress: r => window.__nose.push(r) }); await frames(3); return true;`);
K.buttonShown = await tagCheckSrc('button', `
  const R = {}, b = document.querySelector('.cBtn'), eye = document.getElementById('visionBtn');
  R.made = !!b && E.buttons().length === 1 && E.buttons()[0].shown;
  const rb = b.getBoundingClientRect(), re = eye.getBoundingClientRect();
  /* (21 Nov) the chapter's button stands ABOVE the eye, the eye a row lower, so the eye's ask hangs below it in free space */
  R.aboveTheEye = Math.abs(rb.left - re.left) < 1 && rb.bottom + 4 <= re.top && rb.width === re.width;
  R.label = b.querySelector('.invLabel span').textContent === 'SNIFF' && b.getAttribute('aria-label') === 'SNIFF';
  return R;`);
await p.click('.cBtn');
await p.keyboard.press('KeyN');
K.buttonPressed = await tagUntil(`return window.__nose.length >= 2;`, 20000)
  && await tagCheckSrc('buttonPressed', `
  const R = {}; R.byTap = window.__nose[0].by === 'tap' && window.__nose[0].id === 'nose'; R.byKey = window.__nose[1].by === 'key';
  kit.button('nose', { wait: 0.5 }); await frames(2);
  R.ringDrawn = document.querySelector('.cBtn').classList.contains('waiting');
  return R;`);
await p.click('.cBtn');
await p.waitForTimeout(950);                 // (past the refusal's own pause of 0.9 s, so the lock's words are not held back)
K.buttonWaitRefuses = await tagCheckSrc('buttonWait', `
  const R = {}; await frames(2);
  R.notTold = window.__nose.length === 2 && E.buttons()[0].presses === 2;
  kit.button('nose', { wait: 0, locked: 'Your nose is full.' }); await frames(2);
  return R;`);
await p.click('.cBtn');
K.buttonLockSays = await tagCheckSrc('buttonLock', `
  const R = {}; await frames(2);
  R.notTold = window.__nose.length === 2;
  R.said = document.getElementById('nofire').textContent === 'Your nose is full.';
  kit.button('nose', { locked: null });
  return R;`);
await p.keyboard.press('KeyM');
K.buttonHiddenUnderMenu = await tagUntil(`return E.getState() === 'menu';`, 20000)
  && await tagCheckSrc('buttonMenu', `await frames(2); return { hidden: getComputedStyle(document.querySelector('.cBtn')).display === 'none' };`);
await p.keyboard.press('KeyM');
await tagUntil(`return E.getState() === 'play';`, 20000);

/* 62 · the 'sour' tint on the cold (not a seam: one more colour of the thirty-third), and nothing drawn at 0 */
K.chillSour = await tagCheckSrc('sour', `
  const R = {};
  kit.chill(0.6, { tint: 'sour', secs: 0 }); await frames(3);
  const c = E.cold().chill;
  /* (the colours as the page reads them back: a browser writes rgba() with spaces, as the fog's check reads them) */
  R.tinted = c.tint === '150,166,128 128,146,104 52,64,40' && c.shown && /128,\\s*146,\\s*104/.test(c.tintBg) && /52,\\s*64,\\s*40/.test(c.tintBg)
    && !/104,\\s*158,\\s*232/.test(c.tintBg);
  kit.chill(0, { secs: 0, tint: null }); await frames(3);
  const d = E.cold().chill;
  R.goneAtZero = !d.shown && d.tint === null && d.filter === '';
  return R;`);

/* 64 · THE BRIEF'S PICTURE (\`tag\`): the fight is briefed by a guard event whose picture is the mode's own (two figures, the
   ring passing between them, a fingertip on the switch); START opens the fight */
await tagEval(`kit.give('rifle'); kit.equip('rifle'); return true;`);
await tagUntil(`return document.body.classList.contains('weaponUp');`, 20000);
await tagEval(`window.__briefR = null; st.fightBrief().then(r => { window.__briefR = r; }); return true;`);
await p.waitForFunction(() => { const d = window.__enc.kitDebug(); return !!(d.event && d.event.briefing); }, null, { timeout: 30000 });
K.tagPicture = await tagCheckSrc('picture', `
  const R = {}, dm = document.getElementById('evDemo');
  R.named = dm.className === 'tag' && getComputedStyle(dm).display !== 'none';
  R.drawn = ['dka', 'dkb', 'dkr', 'dks', 'dkf'].every(c => getComputedStyle(dm.querySelector('.' + c)).display === 'block');
  R.notOpenYet = !kit.tag().on;
  return R;`);
await tapOnce();                             // START
K.tagOpensFromBrief = await tagUntil(`return window.__briefR === true && kit.tag().on && kit.tag().live;`, 30000);

/* 60 · OPEN: the rig as it stood is held, the lens behind and above the played one, the first person's HUD aside */
K.tagOpen = await tagCheckSrc('open', `
  const R = {}; await frames(3);
  const T = E.tag(), A = st.fightBodies.a, B = st.fightBodies.b;
  R.played = T.played === 'a' && T.live && T.decl;
  R.boom = near(T.lens[0], A.position.x) && near(T.lens[1], A.position.y + 3.1) && near(T.lens[2], A.position.z + 4.0) && T.boomK === 1;
  R.pivot = near(E.yaw.position.x, A.position.x, 1e-9) && near(E.yaw.position.z, A.position.z, 1e-9) && near(E.yaw.position.y, A.position.y + 1.62, 1e-9);
  R.heading = E.yaw.rotation.y === 0 && near(E.pitch.rotation.x, -26 * Math.PI / 180, 1e-12) && E.camera.fov === 72;
  R.hud = getComputedStyle(document.getElementById('tagHud')).display === 'block'
    && document.querySelector('#tagA0 .tgLbl').textContent === 'ZAP' && document.querySelector('#tagA1 .tgLbl').textContent === 'RING'
    && document.getElementById('tagA2').classList.contains('hide') && document.querySelector('#tagSw .tgName').textContent === 'VIOLET'
    && document.querySelector('#tagSw').getAttribute('aria-label').endsWith('VIOLET');
  R.asideFirstPerson = !document.body.classList.contains('weaponUp') && ['invBtn', 'visionBtn', 'torchBtn'].every(id => getComputedStyle(document.getElementById(id)).display === 'none')
    && getComputedStyle(document.querySelector('.cBtn')).display === 'none' && document.getElementById('interact').classList.contains('hide');
  const vm0 = E.vmPasses(); await frames(3);
  R.handsNotDrawn = E.vmPasses() === vm0;
  const san = E.stats.sanity; window.__noPin = true; E.stats.sanity = 30; await frames(3);
  const pn = document.getElementById('panic');
  R.noRedEdge = +pn.style.opacity === 0 && !pn.classList.contains('critical') && E.stats.sanity < 31;
  E.stats.sanity = san; window.__noPin = false;
  R.rigSeenBefore = Array.isArray(F.rig0) && F.rig0.length === 16 * 4 + 7 && F.rig0[16 * 4 + 1] === 0 && F.rig0[16 * 4 + 2] === 0 && F.rig0[16 * 4 + 3] === 0;
  const s0 = E.tagSave0(), cd = E.checkpointData();
  R.saveHeld = !!s0 && JSON.stringify(cd.stats) === JSON.stringify(s0.st.stats) && cd.at.x === s0.at.x && cd.at.z === s0.at.z && cd.phase === s0.st.phase;
  R.refusedTwice = kit.tag({ bodies: [{ id: 'x', obj: A }] }) === false;
  return R;`);
/* v28.0 (R41): the crane where nothing holds the lens: exactly the boom's lens and its pitch */
K.tagCraneOpen = await tagCheckSrc('craneOpen', `
  E.tagCrane({ max: 60 }); await frames(2);
  const T = E.tag(), A = st.fightBodies.a;
  const R = { lens: near(T.lens[0], A.position.x) && near(T.lens[1], A.position.y + 3.1) && near(T.lens[2], A.position.z + 4.0) && T.boomK === 1,
              pitch: near(E.pitch.rotation.x, -26 * Math.PI / 180, 1e-12) && T.pitchNow === 26, _p: [E.pitch.rotation.x, T.pitchNow, T.boomK] };
  E.tagCrane(null); await frames(1);
  return R;`);

/* the walk BY THE SCREEN (W is away down the court, D to its right), the other body still; the look dead */
const walkKey = async (key, body, ms = 40000) => { await p.keyboard.down(key); const ok = await tagUntil(body, ms); await p.keyboard.up(key); return ok; };
await tagEval(`window.__w0 = { a: st.fightBodies.a.position.clone(), b: st.fightBodies.b.position.clone(), y: E.yaw.rotation.y, p: E.pitch.rotation.x }; return true;`);
const wMoved = await walkKey('KeyW', `return window.__w0.a.z - st.fightBodies.a.position.z > 0.08;`);
const dMoved = await walkKey('KeyD', `return st.fightBodies.a.position.x - window.__w0.a.x > 0.08;`);
await p.mouse.move(200, 200); await p.mouse.move(700, 420, { steps: 6 }); await p.mouse.move(890, 300, { steps: 4 });
K.tagWalk = wMoved && dMoved && await tagCheckSrc('walk', `
  const R = {}, w = window.__w0, A = st.fightBodies.a, B = st.fightBodies.b; await frames(4);
  R.awayDownTheCourt = A.position.z < w.a.z - 0.08;
  R.toItsRight = A.position.x > w.a.x + 0.08;
  R.otherStill = B.position.x === w.b.x && B.position.z === w.b.z;
  R.rigFollows = near(E.yaw.position.x, A.position.x, 1e-9) && near(E.yaw.position.z, A.position.z, 1e-9);
  R.facesItsWalk = Math.abs(Math.atan2(Math.sin(A.rotation.y - Math.PI / 2), Math.cos(A.rotation.y - Math.PI / 2))) < Math.abs(Math.atan2(Math.sin(Math.PI - Math.PI / 2), Math.cos(Math.PI - Math.PI / 2))) - 0.05;
  R.lookDead = E.yaw.rotation.y === w.y && E.pitch.rotation.x === w.p && !document.pointerLockElement;
  return R;`);

/* the acts: a key, a click on a button, the main act by a click on the world; one act a frame, the main first */
await tagEval(`window.__n0 = E.tag().log.length; return true;`);
await p.keyboard.press('Space');
const keyActs = await tagUntil(`return logSince(window.__n0).some(r => r.act === 'zap' && r.phase === 'up');`, 20000);
K.tagActByKey = keyActs && await tagCheckSrc('actKey', `
  const L = logSince(window.__n0);
  return { downThenUp: L.length === 2 && L[0].act === 'zap' && L[0].phase === 'down' && L[0].by === 'key' && L[0].who === 'a' && L[1].phase === 'up' };`);
await tagEval(`window.__n0 = E.tag().log.length; return true;`);
await p.click('#tagA1');
K.tagActByButton = await tagUntil(`return logSince(window.__n0).some(r => r.act === 'ring' && r.phase === 'down');`, 20000)
  && await tagCheckSrc('actButton', `
  await frames(2);
  const R = {}, L = logSince(window.__n0);
  R.told = L[0].act === 'ring' && L[0].by === 'click';
  R.ringWaits = E.tag().acts.ring.wait > 0.9 && document.getElementById('tagA1').classList.contains('waiting');
  return R;`);
await tagEval(`window.__n0 = E.tag().log.length; window.__r0 = E.tag().refused; return true;`);
await p.click('#tagA1');
K.tagWaitRefuses = await tagUntil(`return E.tag().refused > window.__r0;`, 20000)
  && await tagCheckSrc('actWait', `return { notTold: logSince(window.__n0).length === 0 };`);
K.tagOneActAFrame = await tagCheckSrc('oneAFrame', `
  const n0 = E.tag().log.length, d0 = E.tag().dropped;
  const ev = (type, id, pid) => document.getElementById(id).dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: pid, pointerType: 'touch', isPrimary: pid === 31, button: 0 }));
  ev('pointerdown', 'tagA1', 32); ev('pointerdown', 'tagA0', 31);      // (the second one in, but the main: it is the one)
  await frames(3);
  ev('pointerup', 'tagA0', 31); ev('pointerup', 'tagA1', 32);
  await frames(3);
  const L = logSince(n0);
  return { one: L.length === 2 && L[0].act === 'zap' && L[0].phase === 'down' && L[0].by === 'tap' && L[1].act === 'zap' && L[1].phase === 'up',
           dropped: E.tag().dropped === d0 + 1 };`);
await p.waitForTimeout(950);
K.tagLockSays = await tagCheckSrc('lockSays', `
  const n0 = E.tag().log.length;
  kit.tagAct('zap', { blocked: 'Not now.' }); await frames(2);
  const dim = document.getElementById('tagA0').classList.contains('blocked');
  document.getElementById('tagA0').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 33, pointerType: 'mouse', button: 0 }));
  await frames(3);
  document.getElementById('tagA0').dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 33, pointerType: 'mouse', button: 0 }));
  await frames(2);
  const R = { dim, notTold: logSince(n0).length === 0, said: document.getElementById('nofire').textContent === 'Not now.' };
  kit.tagAct('zap', { blocked: null, wait: 0.5 }); await frames(2);
  R.waitRing = document.getElementById('tagA0').classList.contains('waiting') && Math.abs(parseFloat(document.querySelector('#tagA0 .tgWait').style.strokeDashoffset) - 295.31 * 0.5) < 0.2;
  kit.tagAct('zap', { wait: 0, pulse: true }); await frames(2);
  R.asks = document.getElementById('tagA0').classList.contains('pulse');
  kit.tagAct('zap', { pulse: false });
  return R;`);

/* a pick: a click on a target's mark (the mouse is free); a click on the world elsewhere is the main act */
const markAt = await tagEval(`
  await frames(2);
  for (const m of E.tag().marks) { const el = document.elementFromPoint(m.x, m.y); if (el && el.id === 'scene') return m; }
  return null;`);
await tagEval(`window.__n0 = E.tag().log.length; return true;`);
if (markAt) await p.mouse.click(markAt.x, markAt.y);
K.tagPickByClick = !!markAt && await tagUntil(`return logSince(window.__n0).some(r => r.act === 'target');`, 20000)
  && await tagCheckSrc('pick', `
  const L = logSince(window.__n0);
  return { picked: L.length === 1 && L[0].id === arg.id && L[0].by === 'click' && F.picked === arg.id };`, markAt);
const emptyAt = await tagEval(`
  await frames(2);
  for (const [x, y] of [[120, 330], [200, 260], [90, 420], [300, 200], [160, 480]]) {
    const el = document.elementFromPoint(x, y);
    if (el && el.id === 'scene' && E.tag().marks.every(m => Math.hypot(m.x - x, m.y - y) > m.r + 12)) return { x, y };
  }
  return null;`);
await tagEval(`window.__n0 = E.tag().log.length; return true;`);
if (emptyAt) await p.mouse.click(emptyAt.x, emptyAt.y);
K.tagMainByClick = !!emptyAt && await tagUntil(`return logSince(window.__n0).some(r => r.act === 'zap' && r.phase === 'up');`, 20000)
  && await tagCheckSrc('mainClick', `const L = logSince(window.__n0); return { main: L[0].act === 'zap' && L[0].by === 'click', tired: st.fightTargets.some(t => t.tired) };`);

/* a hidden act: TAKE stands only while a tired one is within reach; its key does nothing until then; the count */
K.tagHiddenAct = await tagCheckSrc('hidden', `
  const R = {}, A = st.fightBodies.a;
  const n0 = E.tag().log.length;
  R.hiddenNow = document.getElementById('tagA2').classList.contains('hide');
  return R;`);
await p.keyboard.press('KeyE');
K.tagHiddenKeyNothing = await tagCheckSrc('hiddenKey', `await frames(3); return { nothing: !E.tag().log.slice(-1)[0] || E.tag().log.slice(-1)[0].act !== 'take' };`);
await tagEval(`const A = st.fightBodies.a, T = st.fightTargets.find(t => t.tired && !t.taken); T.m.position.set(A.position.x + 1.0, 1.0, A.position.z - 0.4); return true;`);
await tagUntil(`return !document.getElementById('tagA2').classList.contains('hide');`, 20000);
await tagEval(`window.__n0 = E.tag().log.length; return true;`);
await p.keyboard.press('KeyE');
K.tagTakeAndCount = await tagUntil(`return logSince(window.__n0).some(r => r.act === 'take' && r.phase === 'down') && F.left === 2;`, 20000)
  && await tagCheckSrc('count', `
  await frames(3);
  const dots = [...document.querySelectorAll('#tagCount i')];
  return { dots: dots.length === 3 && dots.filter(d => d.classList.contains('lit')).length === 2 && getComputedStyle(document.getElementById('tagCount')).display === 'flex',
           label: document.querySelector('#tagA2 .tgLbl').textContent === 'TAKE' };`);

/* THE SWITCH: by its key; the lens glides from behind one to behind the other (never a jump); a second inside the lock is
   refused; past it, back */
/* (sampled from the page's own frames, from before the press: on a fast frame the whole glide is over before a poll from
   outside could see it; inside the lock — the first frame and the second after the switch, a tenth of a second of the
   mode's clock at most each — a switch asked by the verb and one by the key are both refused) */
await tagEval(`
  window.__n0 = E.tag().log.length; window.__gs = []; window.__lockTries = null;
  const A = st.fightBodies.a, B = st.fightBodies.b;
  window.__gA = [A.position.x, A.position.y + 3.1, A.position.z + 4]; window.__gB = [B.position.x, B.position.y + 3.1, B.position.z + 4];
  let after = -1;
  const f = () => {
    const T = E.tag(); window.__gs.push({ p: T.played, g: T.gliding, l: T.lens, lock: T.lock });
    if (T.played === 'b') {
      after++;
      if (after === 0) window.__lockTries = { verb: kit.tagSwitch() === false };
      if (after === 1) { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyF' })); }
      if (after === 3) window.__lockTries.key = E.tag().played === 'b' && E.tag().lock > 0;
    }
    if (window.__gs.length < 600 && !(after > 3 && !T.gliding)) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
  return true;`);
await p.keyboard.press('KeyF');
const swOk = await tagUntil(`return E.tag().played === 'b' && !E.tag().gliding && window.__lockTries && window.__lockTries.key !== undefined;`, 30000);
K.tagSwitch = swOk && await tagCheckSrc('switch', `
  await frames(3);
  const R = {}, L = logSince(window.__n0), gB = window.__gB;
  const d = (l) => Math.hypot(l[0] - gB[0], l[1] - gB[1], l[2] - gB[2]);
  const tot = Math.hypot(window.__gA[0] - gB[0], window.__gA[1] - gB[1], window.__gA[2] - gB[2]);
  const glide = window.__gs.filter(s => s.p === 'b' && s.g).map(s => d(s.l));
  R.told = L.length === 1 && L[0].act === 'switch' && L[0].from === 'a' && L[0].to === 'b' && L[0].by === 'key';
  /* the switch's own frame shows the lens exactly where it stood (behind the one left: no jump), then every frame nearer
     the new one's boom, and it ends there */
  R.glided = glide.length >= 3 && glide.every((v, i) => i === 0 || v <= glide[i - 1] + 1e-9) && glide[1] < tot - 1e-6 && d(E.tag().lens) < 1e-6;
  R.notAJump = glide.length >= 2 && Math.abs(glide[0] - tot) < 1e-3;
  R.lockRefusedVerb = !!window.__lockTries && window.__lockTries.verb === true;
  R.lockRefusedKey = !!window.__lockTries && window.__lockTries.key === true && L.length === 1;
  R.buttonsChangeHands = document.querySelector('#tagA0 .tgLbl').textContent === 'GRIP' && document.querySelector('#tagSw .tgName').textContent === 'GOLD'
    && document.querySelector('#tagA1 .tgLbl').textContent === 'SNIFF' && document.getElementById('tagA2').classList.contains('hide');
  return R;`);
await tagUntil(`return E.tag().lock === 0;`, 30000);
await tagEval(`window.__n0 = E.tag().log.length; return true;`);
await p.keyboard.press('KeyF');
K.tagSwitchBack = await tagUntil(`return E.tag().played === 'a' && logSince(window.__n0).length === 1;`, 20000);

/* a press held does not cross a switch: its up is said as cut, and its lift afterwards says nothing (the one who arrives
   never spends it) */
await tagUntil(`return E.tag().lock === 0;`, 30000);
K.tagHoldCut = await tagCheckSrc('holdCut', `
  const n0 = E.tag().log.length, el = document.getElementById('tagA0');
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 41, pointerType: 'touch', isPrimary: true, button: 0 }));
  const down = await poll(() => logSince(n0).some(r => r.act === 'zap' && r.phase === 'down'), 20000);
  const sw = kit.tagSwitch();
  await frames(2);
  el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 41, pointerType: 'touch', isPrimary: true, button: 0 }));
  await frames(3);
  const L = logSince(n0);
  return { down, sw, cut: L.length === 3 && L[1].act === 'zap' && L[1].phase === 'up' && L[1].cut === 'switch' && L[2].act === 'switch',
           nothingAfter: !L.some(r => r.act === 'grip') };`);

/* the bodies: never closer than their two discs; stopped by the walls (the engine's own test, from where each stands) */
await tagUntil(`return E.tag().lock === 0;`, 30000);
await tagEval(`kit.tagSwitch('a'); return true;`);
await tagUntil(`return E.tag().played === 'a' && !E.tag().gliding;`, 30000);
await tagEval(`const B = st.fightBodies.b; kit.tagPlace('a', B.position.x, B.position.z + 1.4, {}); window.__minD = 9;
  window.__apart = setInterval(() => { const A = st.fightBodies.a, B2 = st.fightBodies.b; window.__minD = Math.min(window.__minD, Math.hypot(A.position.x - B2.position.x, A.position.z - B2.position.z)); }, 30);
  await frames(2); return true;`);
await p.keyboard.down('KeyW');
await tagUntil(`return window.__minD < 0.97;`, 30000);
await p.waitForTimeout(1500);
await p.keyboard.up('KeyW');
await tagEval(`kit.tagPlace('a', -10.2, 3, {}); await frames(2); window.__minX = 0; window.__inWall = false;
  window.__wallT = setInterval(() => { const A = st.fightBodies.a; window.__minX = Math.min(window.__minX, A.position.x); if (E.tagBlocked(A.position.x, A.position.z)) window.__inWall = true; }, 30); return true;`);
await p.keyboard.down('KeyA');
await tagUntil(`return st.fightBodies.a.position.x < -10.85;`, 30000);
await p.waitForTimeout(1500);
await p.keyboard.up('KeyA');
K.tagBodiesKept = await tagCheckSrc('kept', `
  clearInterval(window.__apart); clearInterval(window.__wallT);
  const T = E.tag();
  return { apart: window.__minD >= 0.84 - 1e-6 && window.__minD < 0.97, wall: window.__minX >= -11 && window.__minX < -10.85 && !window.__inWall,
           _minD: window.__minD, _minX: window.__minX, _st: [E.getState(), T.on, T.live, T.played, !!E.kitDebug().event, T.t] };`);

/* the lens kept out of a wall: the violet one stands where his boom would pass through the pillar; switched to, the lens
   stands in front of it, never inside a blocker, and inside the chapter's box */
await tagEval(`kit.tagPlace('a', st.fightHome.a[0], st.fightHome.a[1], {}); kit.tagPlace('b', -3.2, 5.0, {}); await frames(2); return true;`);
await tagUntil(`return E.tag().lock === 0;`, 30000);
await p.keyboard.press('KeyF');
await tagUntil(`return E.tag().played === 'b' && !E.tag().gliding;`, 30000);
K.tagLensClear = await tagCheckSrc('lensClear', `
  await frames(3);
  const T = E.tag(), L = new (E.yaw.position.constructor)(...T.lens);
  return { pulledIn: T.boomK < 0.95, inFront: L.z < st.pillar.position.z - 0.4 - 0.28, notInABlocker: !E.blockers.some(b => b.containsPoint(L)),
           insideBox: L.x >= -10.4 && L.x <= 10.4 && L.z >= -10.4 && L.z <= 10.2,
           _lens: T.lens, _boomK: T.boomK, _b: [st.fightBodies.b.position.x, st.fightBodies.b.position.z], _st: [E.getState(), T.on, T.live, T.played, T.t] };`);

/* v28.0 (R41): THE CRANE (a chapter's `crane`): the same hold with it on keeps the lens's height and turns it down to keep
   his head where the whole boom puts it on the screen, never past its `max`; off again, the pull along the line and the
   boom's own pitch, exactly */
K.tagCrane = await tagCheckSrc('crane', `
  E.tagCrane({ max: 60 }); await frames(3);
  const T = E.tag(), B = st.fightBodies.b, bm = T.boom, V = E.yaw.position.constructor, L = new V(...T.lens);
  const H = new V(B.position.x, B.position.y + 1.6, B.position.z), deg = -E.pitch.rotation.x * 180 / Math.PI, e0 = Math.atan2(bm.up - 1.6, bm.back);
  E.camera.updateMatrixWorld(true); const hp = H.clone().project(E.camera), want = Math.tan(bm.pitch * Math.PI / 180 - e0) / Math.tan(E.camera.fov * Math.PI / 360);
  const R = { held: T.boomK < 0.95, height: near(L.y, B.position.y + bm.up, 1e-9), inFront: L.z < st.pillar.position.z - 0.4 - 0.28,
              notInABlocker: !E.blockers.some(b => b.containsPoint(L)), steeper: deg > bm.pitch + 1 && deg <= 60 + 1e-9 && near(deg, T.pitchNow, 1e-9),
              headKept: deg >= 60 - 1e-9 || Math.abs(hp.y - want) < 0.01, _deg: deg, _hp: [hp.x, hp.y], _want: want, _lens: T.lens };
  E.tagCrane(null); await frames(3);
  const T2 = E.tag();
  R.offExact = near(E.pitch.rotation.x, -bm.pitch * Math.PI / 180, 1e-12) && T2.lens[1] < B.position.y + bm.up - 0.05;
  R._off = [E.pitch.rotation.x, T2.lens];
  return R;`);

/* the other one's mark at the screen's edge while he is out of the picture: his name, his share */
/* (the gold one carries no share of the fixture's own; one is given here, so its ring is seen drawn, and taken back) */
await tagEval(`kit.tagPlace('a', -3.2, 10.3, {}); kit.tagBody('a', { share: 0.5 }); await frames(3); return true;`);
K.tagMate = await tagCheckSrc('mate', `
  await poll(() => document.getElementById('tagMate').classList.contains('on'), 20000);
  await frames(2);
  const el = document.getElementById('tagMate'), r = el.getBoundingClientRect(), T = E.tag();
  const R = { shown: el.classList.contains('on') && el.querySelector('.tmName').textContent === 'GOLD',
           onScreen: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight,
           share: !el.classList.contains('noShare') && Math.abs(parseFloat(el.querySelector('.tmArc').style.strokeDashoffset) - 50.27 * 0.5) < 0.2,
           _cls: el.className, _a: [st.fightBodies.a.position.x, st.fightBodies.a.position.z], _st: [E.getState(), T.on, T.live, T.played, T.t] };
  kit.tagBody('a', { share: null }); await frames(2);
  R.shareGone = el.classList.contains('noShare');
  return R;`);
await tagEval(`kit.tagPlace('a', st.fightHome.a[0], st.fightHome.a[1], {}); kit.tagPlace('b', st.fightHome.b[0], st.fightHome.b[1], {}); await frames(2); return true;`);

/* under a minigame, the menu and a hidden tab NOTHING moves and the mode's clock stands; a held key's walk stops */
await tagUntil(`return E.tag().lock === 0;`, 30000);
await tagEval(`kit.tagSwitch('a'); return true;`);
await tagUntil(`return E.tag().played === 'a' && !E.tag().gliding;`, 30000);
await p.keyboard.down('KeyW');
await tagUntil(`return st.fightBodies.a.position.z < st.fightHome.a[1] - 0.05;`, 30000);
await p.keyboard.press('KeyM');
await tagUntil(`return E.getState() === 'menu';`, 20000);
const menu0 = await tagEval(`await frames(2); return { z: st.fightBodies.a.position.z, t: E.tag().t };`);
await p.waitForTimeout(2500);
const menu1 = await tagEval(`await frames(2); return { z: st.fightBodies.a.position.z, t: E.tag().t, hud: getComputedStyle(document.getElementById('tagHud')).display, boom: E.tag().wrote };`);
await p.keyboard.up('KeyW');
await p.keyboard.press('KeyM');
await tagUntil(`return E.getState() === 'play' && E.tag().live;`, 20000);
K.tagStillUnderMenu = menu0.z === menu1.z && menu0.t === menu1.t && menu1.hud === 'none' && menu1.boom === true;
if (!K.tagStillUnderMenu) console.log('tag menu', JSON.stringify({ menu0, menu1 }));
K.tagStillUnderPanel = await tagCheckSrc('panel', `
  window.__evr = null; kit.event({ kind: 'tap', secs: 30 }).then(r => { window.__evr = r; });
  await frames(2);
  const a = { z: st.fightBodies.a.position.z, t: E.tag().t };
  await new Promise(r => setTimeout(r, 1500)); await frames(2);
  const R = { stood: st.fightBodies.a.position.z === a.z && E.tag().t === a.t && !E.tag().live, hidden: getComputedStyle(document.getElementById('tagHud')).display === 'none' };
  kit.abortEvent(); await poll(() => window.__evr !== null && E.tag().live, 20000);
  R.back = E.tag().live;
  return R;`);
K.tagStillHidden = await tagCheckSrc('hiddenTab', `
  await frames(2);
  const t0 = E.tag().t;
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  await new Promise(r => setTimeout(r, 1500));
  delete document.hidden;
  await frames(1);
  const dt = E.tag().t - t0;
  return { atMostATenth: dt <= 0.1 + 1e-9, back: E.tag().live };`);

/* A FILM INSIDE IT: under the film no boom at all (the film places the lens by the rig alone); after it the mode is as it
   was: on, the lens behind the played one again, the hands not drawn, the save still the one it opened on, the bodies where
   the film left them */
K.tagFilmInside = await tagCheckSrc('film', `
  const R = {}, A = st.fightBodies.a, B = st.fightBodies.b;
  /* (both at rest first: a walk let go under the menu above coasts on for a moment once play is back, as his own does) */
  let still = 0; await poll(() => { still = E.tag().bodies.every(b => b.v === 0) ? still + 1 : 0; return still >= 3; }, 20000);
  const a0 = [A.position.x, A.position.z, B.position.x, B.position.z], s0 = JSON.stringify(E.tagSave0());
  window.__filmDone = null;
  R.started = kit.film('probe', { onDone: () => { window.__filmDone = true; kit.fade(0, 0.2); } }) === true;
  let zero = true, n = 0;
  await poll(() => { if (E.getState() === 'cine') { n++; const c = E.camera.position; if (c.x !== 0 || c.y !== 0 || c.z !== 0) zero = false; } return window.__filmDone && E.getState() === 'play'; }, 90000);
  R.noBoomInFilm = zero && n >= 2;
  await poll(() => kit.getFade() < 0.02, 30000); await frames(3);
  const T = E.tag();
  R.modeBack = T.on && T.live && T.wrote && near(T.lens[0], A.position.x) && near(T.lens[1], A.position.y + 3.1) && near(T.lens[2], A.position.z + 4.0);
  const vm0 = E.vmPasses(); await frames(3);
  R.handsStillOff = E.vmPasses() === vm0;
  R.saveStillHeld = JSON.stringify(E.tagSave0()) === s0 && JSON.stringify(E.checkpointData().stats) === JSON.stringify(JSON.parse(s0).st.stats);
  R.bodiesStay = A.position.x === a0[0] && A.position.z === a0[1] && B.position.x === a0[2] && B.position.z === a0[3];
  R._a0 = a0; R._a1 = [A.position.x, A.position.z, B.position.x, B.position.z]; R._v = E.tag().bodies.map(b => b.v);
  return R;`);

/* 65 · A LOSS THAT BEGINS AGAIN: the card (its own state, the chapter's words), its guard, and on BEGIN AGAIN the run as the
   mode held it; five running leave the same fight as the first (and from the third the second button) */
const retryOnce = async (i) => {
  await tagEval(`kit.award('sanity', -7); kit.award('awareness', -3); window.__lr = null; const pr = st.fightLose(); window.__lrOk = !!pr && typeof pr.then === 'function'; if (window.__lrOk) pr.then(r => { window.__lr = r; }); return true;`);
  await tagUntil(`return E.getState() === 'retry';`, 20000);
  const card = await tagEval(`
    const early = E.retryPress('again');
    const c = document.getElementById('retryCard');
    return { early, open: !c.classList.contains('hide') && E.retryState().open, label: document.getElementById('rtLabel').textContent,
             line: document.getElementById('rtLine').textContent, again: document.getElementById('rtAgain').textContent,
             more: !document.getElementById('rtMore').classList.contains('hide') ? document.getElementById('rtMore').textContent : null,
             hud: getComputedStyle(document.getElementById('tagHud')).display };`);
  await p.waitForTimeout(800);
  const useMore = i === 4;
  await p.click(useMore ? '#rtMore' : '#rtAgain');
  await tagUntil(`return E.getState() === 'play' && window.__lr !== null && E.tag().live;`, 20000);
  const after = await tagEval(`await frames(2);
    const s0 = E.tagSave0();
    return { atRetry: F.atRetry, held: { s: s0.st.stats.sanity, a: s0.st.stats.awareness, w: s0.st.stats.wisdom, phase: s0.st.phase },
             restarts: F.restarts, last: F.lastRetry, told: window.__lr && window.__lr.button, presses: E.retryState().presses,
             fight: F.atRetryFight, played: E.tag().played, count: E.tag().count };`);
  return { card, after, useMore };
};
const retries = [];
for (let i = 0; i < 5; i++) retries.push(await retryOnce(i));
K.tagRetry = retries.every((r, i) => r.card.early === false && r.card.open && r.card.label === 'The room was lost' && r.card.again === 'BEGIN AGAIN'
    && r.card.line === 'Begin the fight again from where it opened.' && r.card.hud === 'none'
    && (i < 2 ? r.card.more === null : r.card.more === 'AN EASIER WAY')
    && r.after.atRetry.s === r.after.held.s && r.after.atRetry.a === r.after.held.a && r.after.atRetry.w === r.after.held.w && r.after.atRetry.phase === r.after.held.phase
    && r.after.restarts === i + 1 && r.after.presses === i + 1 && r.after.told === (r.useMore ? 'more' : 'again') && r.after.last === r.after.told
    && typeof r.after.fight === 'string' && r.after.fight === retries[0].after.fight && r.after.count && r.after.count.left === 3);
if (!K.tagRetry) console.log('tag retries', JSON.stringify(retries));

/* 69 · THE BOOM CHANGED WHILE THE MODE IS ON (kit.tagBoom, v28.0: chapter 5's roomy end, R46): never asked, the boom is
   the declaration's; laid at once it reads as laid; eased, part way it stands between the two; null eases back and lets go,
   the declaration's bit for bit again (a desktop here: its `boom`, not the portrait's) */
K.tagBoomOver = await tagCheckSrc('boomOver', `
  const R = {}, D = () => E.tag().boom;
  const b0 = D();
  R.asDeclared = b0.back === 4.0 && b0.up === 3.1 && b0.pitch === 26;
  R.laid = kit.tagBoom({ back: 6, up: 4.5, pitch: 34 }, { secs: 0 }) === true;
  const b1 = D(); R.atOnce = b1.back === 6 && b1.up === 4.5 && b1.pitch === 34 && b1.fov === b0.fov;
  R.letGo = kit.tagBoom(null, { secs: 0 }) === true;
  const b2 = D(); R.backExact = Object.is(b2.back, b0.back) && Object.is(b2.up, b0.up) && Object.is(b2.pitch, b0.pitch) && Object.is(b2.fov, b0.fov);
  kit.tagBoom({ back: 8 }, { secs: 3 });
  await poll(() => D().back > b0.back + 0.3, 30000);
  const bm = D(); R.eased = bm.back > b0.back && bm.back < 8 && bm.up === b0.up && bm.pitch === b0.pitch;
  kit.tagBoom(null, { secs: 0 }); const b3 = D();
  R.backAgain = Object.is(b3.back, b0.back) && Object.is(b3.up, b0.up);
  R.refusedBad = kit.tagBoom('far') === false;
  return R;`);
/* 63 · THE CAPTION IN THE MODE, and every overlap of what the mode adds, by bounding box (a desktop of 900 x 600 here; the
   phone's 390 x 844 and a low phone's 360 x 780 below) */
const TAG_HUD_MINE = ['#tagA0', '#tagA1', '#tagA2', '#tagSw', '#tagCount', '#tagMate', '#caption', '#nofire'];
const TAG_HUD_ALL = TAG_HUD_MINE.concat(['#stats', '#mute', '#menuBtn', '#volWrap', '#objective .obox']);
/* (the measure is ARMED before the press that says the refusal's words, and taken by the page itself in the very task the
   words go up (a watcher on their class), each thing where it stands risen: their rise (0.3 s from nothing, from the frame
   after) and the caption's set aside for the measure and given back. On a slow page the round trips between a touch, its
   acknowledgement and a measure from out here outlasted the words' 2.2 s) */
const tagArm = (pg, MINE = TAG_HUD_MINE, ALL = TAG_HUD_ALL) => pg.evaluate(([mine, all]) => {
  window.__tagOv = null;
  const nf = document.getElementById('nofire'), cp = document.getElementById('caption');
  const measure = (how) => {
    const on = id => { const el = document.getElementById(id); return !!el && el.classList.contains('on'); };
    const keep = [nf.style.animation, cp.style.transition, cp.style.animation];
    nf.style.animation = 'none'; cp.style.transition = 'none'; cp.style.animation = 'none'; void nf.offsetWidth; void cp.offsetWidth;
    const up = { caption: on('caption'), nofire: on('nofire'), words: nf.textContent, take: !document.getElementById('tagA2').classList.contains('hide'),
                 mate: document.getElementById('tagMate').classList.contains('on'), how };
    const shown = el => { for (let a = el; a && a !== document.documentElement; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
    const box = s => { const el = document.querySelector(s); if (!el || !shown(el)) return null; const r = el.getBoundingClientRect(); return r.width >= 1 && r.height >= 1 ? { s, x: r.left, y: r.top, w: r.width, h: r.height } : null; };
    const B = all.map(box).filter(Boolean), bad = [], off = [];
    for (const a of B) if (a.x < -0.5 || a.y < -0.5 || a.x + a.w > innerWidth + 0.5 || a.y + a.h > innerHeight + 0.5) off.push(a.s);
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      const a = B[i], b = B[j]; if (!mine.includes(a.s) && !mine.includes(b.s)) continue;
      if (a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5) bad.push(a.s + ' x ' + b.s);
    }
    nf.style.animation = keep[0]; cp.style.transition = keep[1]; cp.style.animation = keep[2];
    window.__tagOv = { measured: B.map(b => b.s), bad, off, boxes: B, up };
  };
  if (window.__tagOvMo) window.__tagOvMo.disconnect();
  const mo = window.__tagOvMo = new MutationObserver(() => {
    if (!window.__tagOv && nf.classList.contains('on') && cp.classList.contains('on')) { mo.disconnect(); measure('as the words went up'); }
  });
  mo.observe(nf, { attributes: true, attributeFilter: ['class'] });
  return true;
}, [MINE, ALL]);
const tagRead = (pg) => pg.waitForFunction(() => !!window.__tagOv, null, { timeout: 20000, polling: 100 })
  .then(() => pg.evaluate(() => window.__tagOv), () => pg.evaluate(() => { if (window.__tagOvMo) window.__tagOvMo.disconnect();
    return { measured: [], bad: ['the refusal\'s words never went up'], off: [], up: { nofire: document.getElementById('nofire').className } }; }));
await p.waitForTimeout(950);
/* (everything the mode can put up at once: the caption, TAKE beside a tired one, the other one's mark at the edge while he
   is behind the lens, the count, and a refusal's words, the refusal last so its words are measured standing) */
await tagEval(`
  const A = st.fightBodies.a, T = st.fightTargets[1]; T.tired = true; T.taken = false; T.hidden = false; T.m.position.set(A.position.x + 1, 1, A.position.z - 0.4);
  kit.tagPlace('b', A.position.x + 0.6, A.position.z + 5.0, {});
  kit.captions([{ at: 0, end: 60, text: 'A line said while the fight is on, long enough to wrap a little.' }]);
  kit.tagAct('zap', { blocked: 'Not now.' });
  await poll(() => document.getElementById('caption').classList.contains('on') && !document.getElementById('tagA2').classList.contains('hide')
    && document.getElementById('tagMate').classList.contains('on'), 20000);
  return true;`);
await tagArm(p);
await tagEval(`
  document.getElementById('tagA0').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 51, pointerType: 'mouse', button: 0 }));
  await frames(2);
  document.getElementById('tagA0').dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 51, pointerType: 'mouse', button: 0 }));
  return true;`);
const ovD = await tagRead(p);
K.tagHudDesktop = ovD.bad.length === 0 && ovD.off.length === 0 && ['#tagA0', '#tagA1', '#tagA2', '#tagSw', '#tagMate', '#caption', '#nofire', '#tagCount'].every(s => ovD.measured.includes(s));
console.log('tag HUD 900x600:', JSON.stringify({ bad: ovD.bad, off: ovD.off, measured: ovD.measured, up: ovD.up }));
await tagEval(`kit.tagPlace('a', st.fightHome.a[0], st.fightHome.a[1], {}); kit.tagPlace('b', st.fightHome.b[0], st.fightHome.b[1], {}); await frames(2); return true;`);
await tagEval(`kit.captions(null); kit.tagAct('zap', { blocked: null }); await frames(2); return true;`);

/* LEFT: the rig bit for bit as it was the instant the mode opened (every matrix, the lens, the turns), no boom, the hands
   drawn again, the first person's HUD back, the save moving again */
K.tagLeave = await tagCheckSrc('leave', `
  const R = {};
  R.left = st.fightEnd('restore') === true && !kit.tag().on;
  R.rigExact = Array.isArray(F.rig0) && Array.isArray(F.rig1) && F.rig0.length === F.rig1.length && F.rig0.every((v, i) => Object.is(v, F.rig1[i]));
  R.noBoom = E.camera.position.x === 0 && E.camera.position.y === 0 && E.camera.position.z === 0 && !E.tag().wrote;
  await frames(3);
  const vm0 = E.vmPasses(); await frames(3);
  R.handsBack = E.vmPasses() > vm0;
  R.hudBack = !document.body.classList.contains('tagOn') && getComputedStyle(document.getElementById('tagHud')).display === 'none'
    && document.body.classList.contains('weaponUp') && getComputedStyle(document.getElementById('visionBtn')).display !== 'none'
    && getComputedStyle(document.querySelector('.cBtn')).display !== 'none';
  R.saveMoves = !E.tagSave0() && JSON.stringify(E.checkpointData().stats) === JSON.stringify(E.worldState().stats);
  R.refusedAfter = kit.tagAct('zap', { wait: 0.5 }) === false && kit.tagSwitch() === false && kit.retry({}) === false && kit.tagBoom({ back: 6 }) === false;
  return R;`);
await tagEval(`kit.take('rifle'); kit.button('nose', null); await frames(2); return true;`);
K.buttonGone = await tagCheckSrc('buttonGone', `await frames(2); return { gone: !document.querySelector('.cBtn') && E.buttons().length === 0 && !document.body.classList.contains('hasCBtn') };`);

/* v28.0 (the films' builder, measured): A FILM FROM PLAY THAT KEEPS ITS OWN VIEW gives the arm back on play's first frame, as
   the film found it (restoreWorld hides it for a scene's card; play has none) — read by the page on that very frame; and a
   film that does not keep its view is untouched: an arm hidden in play before it is hidden after it, as it always was */
const filmArm = (key, hideBefore) => tagEval(`
  await frames(2);
  E.armR.visible = !arg.hide; await frames(2);
  const before = E.armNow().rv;
  window.__armFirst = null; window.__filmDone = null; let was = E.getState();
  const f = () => { const s = E.getState(); if (was === 'cine' && s === 'play' && window.__armFirst === null) window.__armFirst = E.armNow().rv; was = s;
                    if (window.__armFirst === null) requestAnimationFrame(f); };
  requestAnimationFrame(f);
  const started = kit.film(arg.key, { onDone: () => { window.__filmDone = true; kit.fade(0, 0.2); } }) === true;
  await poll(() => window.__filmDone && E.getState() === 'play' && window.__armFirst !== null, 90000);
  await poll(() => kit.getFade() < 0.02, 30000); await frames(2);
  const r = { started, before, first: window.__armFirst, after: E.armNow().rv };
  E.armR.visible = true; await frames(2);
  return r;`, { key, hide: hideBefore });
const kvShown = await filmArm('keepView', false), kvHidden = await filmArm('keepView', true), nkHidden = await filmArm('probe', true);
K.filmKeepViewArmBack = kvShown.started && kvShown.before === true && kvShown.first === true && kvShown.after === true
  && kvHidden.started && kvHidden.before === false && kvHidden.first === false;
K.filmNoKeepArmUntouched = nkHidden.started && nkHidden.before === false && nkHidden.first === false && nkHidden.after === false;
if (!K.filmKeepViewArmBack || !K.filmNoKeepArmUntouched) console.log('film arm', JSON.stringify({ kvShown, kvHidden, nkHidden }));
await p.evaluate((parts) => { window.__tag = parts; }, tagParts);
if (Object.entries(K).some(([k, v]) => /^(tag|button|chillSour)/.test(k) && v !== true))
  console.log('tag trace', JSON.stringify(await p.evaluate(() => window.__tagTrace)));
await p.evaluate(() => { clearInterval(window.__tagPin); clearInterval(window.__tagTraceT); window.__enc.stats.sanity = 100; window.__enc.stats.awareness = 50; });
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
await p.evaluate(() => { window.__enc.kit.handPose('cross', 1, { secs: 0 }); window.__enc.kit.rain(1); window.__enc.kit.lens(44, { secs: 0 }); window.__enc.kit.hush(1, { secs: 0 }); });   // (v24.0: and rain, for the reset to clear; v26.0: a borrowed lens and a hush)
await p.evaluate(() => { const k = window.__enc.kit; k.health({ label: 'x', k: 0.5, at: () => [0, 1, 0] }); k.edge({ k: 1, secs: 0.01 }); k.sprayColor(0xff0000); k.visionUrge('open'); k.weaponGlow(true); });   // (v27.0: the stakes, for the reset to clear; seam 67: and the fire button's glow)
await until(() => window.__enc.hpose().on && window.__enc.armNow().lv, 20000).catch(() => {});
await p.evaluate(() => window.__enc.kitReset());
await p.waitForTimeout(400);
K.hposeClearedByReset = await p.evaluate(() => { const e = window.__enc, a = e.armNow(); return e.hpose().on === false && a.lv === false; });
K.rainClearedByReset = await p.evaluate(() => { const w = window.__enc.wxState(); return !w.visible && w.k === 0 && w.thunder === 0; });   // v24.0 (S45)
K.lensClearedByReset = await p.evaluate(() => { const l = window.__enc.lens(); return l.took === false && l.fov === 72; });               // v26.0 (S47)
K.hushClearedByReset = await p.evaluate(() => { const h = window.__enc.hush(); return h.k === 0 && h.wired === false; });                 // v26.0 (S48)
K.barClearedByReset = await p.evaluate(() => window.__enc.kitBar() === null);                                                       // v27.0 (S52)
K.stakesClearedByReset = await p.evaluate(() => { const q = window.__enc.stakes(); return q.life.on === false && q.edge.to === 0 && q.edge.k === 0 && q.spray.col === null && q.spray.scale === 1 && q.urge === false && q.wave.on === false && q.show === null; });   // v27.0 (S54, S56, S55, S57)
K.glowClearedByReset = await p.evaluate(() => !document.body.classList.contains('wpnGlow') && window.__enc.weaponGlowOn() === false);   // v27.0 (seam 67)
/* v27.0 (S50): a chapter that declares no vision takes the seam down (no eye, no state, no class): what setChapter's
   kitReset does on a real change of chapter. The swap above is rebuildStage alone, which builds the next stage and keeps
   the chapter (CH), so the fixture's own declaration is taken away for a moment instead, and put back */
K.visionGoneWithChapter = await p.evaluate(() => {
  const E = window.__enc, C = window.__CHAPTERS__.chtest, had = C.vision;
  delete C.vision; E.kitReset();
  const v = E.vision();
  const gone = v.decl === false && v.on === false && v.r === 0 && !document.body.classList.contains('hasVision') && !document.body.classList.contains('visionOn');
  C.vision = had; E.kitReset();
  return gone && E.vision().decl === true && document.body.classList.contains('hasVision');
});
/* v27.0 (seam 67): with no weapon there is no button to glow: kit.weaponGlow refused, nothing drawn (the fixture's own weapon
   taken away for a moment, as the vision's is above, and put back) */
K.glowNeedsWeapon = await p.evaluate(() => {
  const E = window.__enc, C = window.__CHAPTERS__.chtest, had = C.weapon;
  delete C.weapon; E.kitReset();
  const refused = E.kit.weaponGlow(true) === false && !document.body.classList.contains('wpnGlow') && E.weaponGlowOn() === false;
  C.weapon = had; E.kitReset();
  return refused && E.kit.weaponGlow(true) === true && E.kit.weaponGlow(false) === true && !document.body.classList.contains('wpnGlow');
});

/* v27.0 (the fifty-third seam): THE CHAPTER'S OWN LOSS, last of all (Retry begins the chapter again, and nothing after
   this reads the run). Refused outside play; from play, its film (the fixture's own) and its two lines on the card, his
   nerve NOT emptied by it (the loss is the chapter's, not his nerve's); an own loss with no lines has the sheet's two; and
   Retry gives play back */
K.loseRefusedOutsidePlay = await p.evaluate(() => { const E = window.__enc, st = E.getState(); return st !== 'play' && E.kit.lose({ say: 'x' }) === false && E.getState() === st; });
await p.evaluate(() => window.__enc.restart());
K.loseOwn = await until(() => window.__enc.getState() === 'play', 120000).then(async () => {
  await p.evaluate(() => { window.__enc.stats.sanity = 80; });
  const took = await p.evaluate(() => window.__enc.kit.lose({ film: 'probe', say: 'Her life ran out.', teaching: 'See first.' }));
  const lost = await until(() => window.__enc.getState() === 'lost', 120000).then(() => true, () => false);
  /* (the teaching is TYPED onto the card after its first line: it is read once written, never the moment the card opens;
     build 20's run, on a slow box, read it empty and failed a card that was right) */
  await until(() => /See first\./.test(document.getElementById('overTeach').textContent), 60000).catch(() => {});
  const L = await p.evaluate(() => ({ say: document.getElementById('overSay').textContent, teach: document.getElementById('overTeach').textContent, san: window.__enc.stats.sanity }));
  console.log('loseOwn', JSON.stringify({ took, lost, L }));
  return took === true && lost && L.say === 'Her life ran out.' && /See first\./.test(L.teach) && L.san > 0;
}, () => false);
/* (v27.0, seam 66: the card's buttons answer only once it is ready, as a player's finger only finds them then: the harness
   waits for that, where it had pressed the instant the card opened) */
const lostReady = (id = 'retryBtn') => p.waitForFunction((id) => { const b = document.getElementById(id);
  return window.__enc.getState() === 'lost' && !!b && !b.classList.contains('waiting') && !b.classList.contains('hide'); }, id, { timeout: 120000 }).then(() => true, () => false);
await lostReady();
await p.evaluate(() => document.getElementById('retryBtn').click());
K.loseRetry = await until(() => window.__enc.getState() === 'play', 120000).then(() => true, () => false);
K.loseSheetLines = K.loseRetry && await p.evaluate(() => window.__enc.kit.lose({})) === true
  && await until(() => window.__enc.getState() === 'lost', 120000).then(() => true, () => false)
  && await p.evaluate(() => { const s = document.getElementById('overSay').textContent; return s.length > 0 && s !== 'Her life ran out.'; });
await lostReady();
await p.evaluate(() => document.getElementById('retryBtn').click());
await until(() => window.__enc.getState() === 'play', 120000).catch(() => {});

/* v27.0 (the sixty-sixth seam): A LOSS THAT BEGINS AGAIN AT THE CHAPTER'S HELD POINT (Chad, R139, R144). Held in play, the
   save IS the held run while the run moves on; a loss that asks for it keeps it, its card offers Restart chapter under
   Retry, a press before the card is ready is no press, and Retry pressed twice at once (a double tap) lands ONCE, at the
   held phase, stats, earnings and place (never the chapter's start), up from black, with the point let go; Restart
   chapter is the chapter's start; a loss that does not ask, or asks with nothing held, is the chapter's start with no
   second button; refused outside play; null lets the point go and the save follows the run; kitReset lets it go */
{
  const R = {}, FILM = { film: 'probe', say: 'Her life ran out.', teaching: 'See first.' };
  const holdAt = () => p.evaluate(() => { const E = window.__enc, k = E.kit;
    E.stats.sanity = 66; k.setPhase('held:1'); k.conduct({ note: 'Held note.' });
    E.yaw.position.set(1.25, 1.62, 2.5); E.yaw.rotation.y = 0.4;
    return k.losePoint() === true; });
  const moveOn = () => p.evaluate(() => { const E = window.__enc, k = E.kit;
    E.stats.sanity = 41; k.setPhase('after'); k.conduct({ note: 'After note.' }); E.yaw.position.set(3, 1.62, 4); });
  const lostBy = async (o) => await p.evaluate((o) => window.__enc.kit.lose(o), o) === true && await until(() => window.__enc.getState() === 'lost', 120000).then(() => true, () => false);
  R.held = await holdAt();
  await moveOn();
  R.saveIsHeld = await p.evaluate(() => { const E = window.__enc, h = E.loseHold(), cd = E.checkpointData();
    return !!h && h.ch === 'chtest' && h.st.phase === 'held:1' && h.st.stats.sanity === 66 && h.at.x === 1.25
      && cd.phase === 'held:1' && cd.stats.sanity === 66 && cd.at.x === 1.25 && cd.at.z === 2.5
      && cd.conduct.notes.includes('Held note.') && !cd.conduct.notes.includes('After note.')
      && E.checkpointData({ at: null }).phase === null; });                  // (a save that names its place is never the held one)
  R.lostHeld = await lostBy({ ...FILM, resume: true });
  R.refusedOutsidePlay = await p.evaluate(() => window.__enc.kit.losePoint() === false && window.__enc.loseAgainHeld() === true);
  R.earlyPressIgnored = await p.evaluate(() => { const b = document.getElementById('retryBtn');
    if (!b.classList.contains('waiting')) return null;                         // (the card was ready already: nothing to try)
    b.click(); return window.__enc.getState() === 'lost'; });
  R.cardReady = await lostReady() && await lostReady('restartChBtn');
  R.secondButton = await p.evaluate(() => { const b = document.getElementById('restartChBtn');
    return getComputedStyle(b).display !== 'none' && b.textContent.trim().length > 0; });
  R.retryOnce = await p.evaluate(() => { const E = window.__enc, b = document.getElementById('retryBtn');
    b.click(); b.click();                                                      // a double tap: the second finds play
    const k = E.kit, at = E.yaw.position;
    return E.getState() === 'play' && k.getPhase() === 'held:1' && E.stats.sanity === 66
      && Math.abs(at.x - 1.25) < 1e-6 && Math.abs(at.z - 2.5) < 1e-6 && Math.abs(E.yaw.rotation.y - 0.4) < 1e-6
      && k.getConduct().notes.includes('Held note.') && !k.getConduct().notes.includes('After note.')
      && E.loseHold() === null && E.loseAgainHeld() === false && k.getFade() > 0.9; });
  R.upFromBlack = await until(() => window.__enc.kit.getFade() === 0, 120000).then(() => true, () => false);
  R.stillHeldPhase = await p.evaluate(() => window.__enc.kit.getPhase() === 'held:1');
  /* Restart chapter: the chapter's start */
  R.held2 = await holdAt(); await moveOn();
  R.lostHeld2 = await lostBy({ ...FILM, resume: true });
  R.restartReady = await lostReady('restartChBtn');
  R.restartIsStart = await p.evaluate(() => { const E = window.__enc;
    document.getElementById('restartChBtn').click();
    return E.getState() === 'play' && E.kit.getPhase() === null && E.stats.sanity === 100 && E.loseHold() === null && E.loseAgainHeld() === false; });
  /* a loss that does not ask: the chapter's start, no second button, though a point is held */
  R.held3 = await holdAt();
  R.lostPlain = await lostBy({ ...FILM });
  R.plainCard = await lostReady() && await p.evaluate(() => window.__enc.loseAgainHeld() === false
    && getComputedStyle(document.getElementById('restartChBtn')).display === 'none');
  R.plainRetryIsStart = await p.evaluate(() => { const E = window.__enc; document.getElementById('retryBtn').click();
    return E.getState() === 'play' && E.kit.getPhase() === null && E.loseHold() === null; });
  /* a loss that asks with nothing held: the same */
  R.lostNothingHeld = await lostBy({ ...FILM, resume: true });
  R.nothingHeldCard = await lostReady() && await p.evaluate(() => window.__enc.loseAgainHeld() === false
    && getComputedStyle(document.getElementById('restartChBtn')).display === 'none');
  R.nothingHeldRetryIsStart = await p.evaluate(() => { const E = window.__enc; document.getElementById('retryBtn').click();
    return E.getState() === 'play' && E.kit.getPhase() === null; });
  /* let go by null (the save follows the run again) and by kitReset */
  R.nullLetsGo = await holdAt() && await p.evaluate(() => { const E = window.__enc, k = E.kit;
    k.setPhase('moved'); const heldSave = E.checkpointData().phase === 'held:1';
    k.losePoint(null); return heldSave && E.loseHold() === null && E.checkpointData().phase === 'moved'; });
  R.resetLetsGo = await holdAt() && await p.evaluate(() => { const E = window.__enc; E.kitReset(); return E.loseHold() === null; });
  await p.evaluate(() => { const E = window.__enc; E.kit.setPhase(null); E.stats.sanity = 100; });
  console.log('losePointSeam', JSON.stringify(R));
  K.losePointSeam = Object.entries(R).every(([k, v]) => v === true || (k === 'earlyPressIgnored' && v === null));
}

/* v28.0 (seams 60, 61, 65): kitReset takes an open tag mode down (no boom, no class, the rig left to whoever resets: a
   restart, a Continue, a change of chapter), with every button of the chapter's own and a retry card; and a chapter that
   declares no `tag` has none: kit.tag refused, nothing drawn (what setChapter's kitReset does on a real change of chapter;
   the fixture's declaration is taken away for a moment and put back, as the vision's proof does). Two bare points stand
   for the bodies here: the stage is chapter 1's since the swap above */
K.tagResetClears = await p.evaluate(async () => {
  const E = window.__enc, kit = E.kit;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const O = E.yaw.constructor, a = new O(), b = new O();
  a.position.set(E.yaw.position.x, 0, E.yaw.position.z); b.position.set(E.yaw.position.x + 1.5, 0, E.yaw.position.z + 0.4);
  E.scene.add(a); E.scene.add(b);
  const opened = kit.tag({ bodies: [{ id: 'a', obj: a }, { id: 'b', obj: b }] }) === true;
  kit.button('x', { label: 'X' });
  await frames(3);
  const wasOn = E.tag().wrote && E.camera.position.length() > 1 && document.body.classList.contains('tagOn') && !!document.querySelector('.cBtn');
  E.kitReset();
  await frames(3);
  const T = E.tag();
  const cleared = !T.on && !T.wrote && E.camera.position.x === 0 && E.camera.position.y === 0 && E.camera.position.z === 0
    && !document.body.classList.contains('tagOn') && !document.querySelector('.cBtn') && T.decl === true && !E.retryState().open;
  E.scene.remove(a); E.scene.remove(b);
  return opened && wasOn && cleared;
}).catch(() => false);
K.tagGoneWithChapter = await p.evaluate(() => {
  const E = window.__enc, C = window.__CHAPTERS__.chtest, had = C.tag;
  delete C.tag; E.kitReset();
  const a = new (E.yaw.constructor)();
  const gone = E.tag().decl === false && E.kit.tag({ bodies: [{ id: 'a', obj: a }] }) === false && !E.kit.tag().on && !E.tag().wrote;
  C.tag = had; E.kitReset();
  return gone && E.tag().decl === true;
}).catch(() => false);

/* ---- v28.0: THE TAG MODE ON A PHONE (a touch page of 390 x 844, as his phone lays it out; real touches with their own
   timestamps, CDP): a finger already down when the mode opens is not its stick; the stick moves the played one by the screen;
   a drag on the right turns nothing; a tap on a target's mark is a pick even in the stick's half; a button by a tap; the
   upright screen's own boom and lens; and every overlap of what the mode adds, at 390 x 844 and at a low phone's 360 x 780 */
{
  const pctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const pp = await pctx.newPage();
  pp.on('pageerror', e => errs.push('phone pageerror: ' + e.message));
  pp.setDefaultNavigationTimeout(180000); pp.setDefaultTimeout(120000);
  const pEval = (body, arg) => pp.evaluate(new Function('arg', 'return (async () => {' + TAG_HELP + body + '})();'), arg);
  const pUntil = (body, ms = 30000) => pp.waitForFunction(new Function('return (() => {' + TAG_HELP + body + '})();'), null, { timeout: ms, polling: 100 }).then(() => true, () => false);
  const pCheck = async (name, body, arg) => {
    const r = await pEval(body, arg).catch(e => ({ threw: String(e && e.message || e) }));
    tagParts['phone.' + name] = r;
    const ok = !!r && typeof r === 'object' && !r.threw && Object.entries(r).every(([k, v]) => k[0] === '_' || v === true);
    if (!ok) console.log('tag phone ' + name + ' parts:', JSON.stringify(r));
    return ok;
  };
  for (const k of ['tagPhoneOpen', 'tagPhoneStaleFinger', 'tagPhoneStick', 'tagPhoneNoLook', 'tagPhonePickInStickHalf', 'tagPhoneButton', 'tagHudPhone', 'tagHudLowPhone',
                   'tagPartyShown', 'tagPartyFilm', 'tagPartyTap', 'tagPartyHere', 'tagPartyLock', 'tagPartyAsk', 'tagPartyTab', 'tagPartyHudPhone', 'tagPartyHudLowPhone', 'tagPartyHudWide']) K[k] = false;
  try {
    /* (a phone page boots slower than the desktop's on a shared box: the budgets are tools/probes/boot.mjs's kind, and the
       time it took is printed; a Start the tap did not take is said, and pressed as that probe presses it) */
    const tp0 = Date.now();
    await pp.goto(PAGE + sep + 'ch=chtest', { waitUntil: 'load', timeout: 300000 });
    await pp.waitForFunction(() => !!window.__enc, null, { timeout: 300000, polling: 500 });
    await pp.tap('#startBtn');
    const left = await pp.waitForFunction(() => window.__enc.getState() !== 'title', null, { timeout: 60000, polling: 500 }).then(() => true, () => false);
    if (!left) { console.log('tag phone: the tap on Start was not taken', JSON.stringify(await pp.evaluate(() => ({ st: window.__enc.getState(),
      at: (() => { const r = document.getElementById('startBtn').getBoundingClientRect(), el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return el ? (el.id || el.className) : null; })() }))));
      await pp.evaluate(() => document.getElementById('startBtn').click()); }
    await pp.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 900000, polling: 500 });
    console.log('tag phone: in play after ' + Math.round((Date.now() - tp0) / 1000) + ' s');
    await pp.evaluate(() => { const E = window.__enc; E.stats.sanity = 100;      // (pinned, as the desktop block is)
      setInterval(() => { if (E.stats.sanity < 50) E.stats.sanity = 100; }, 1000); });
    const cdp = await pctx.newCDPSession(pp);
    /* (a touch carries its own time, as a finger's does: on this box the page answers one CDP touch a slow frame later, so
       two sent back to back land half a second apart, and a tap read by its events' own times (v24.2) was a long press) */
    const touch = (type, pts, ts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y, id]) => ({ x, y, id, radiusX: 4, radiusY: 4, force: 1 })),
                                                                           ...(ts ? { timestamp: ts } : {}) });
    const tap = async (x, y, id) => { const ts = Date.now() / 1000; await touch('touchStart', [[x, y, id]], ts); await touch('touchEnd', [], ts + 0.09); };
    /* a finger down on the stick's half BEFORE the mode opens */
    await touch('touchStart', [[80, 700, 1]]);
    await touch('touchMove', [[80, 694, 1]]);
    K.tagPhoneOpen = await pCheck('open', `
      const R = {}; R.stickBefore = document.getElementById('stick').classList.contains('on');
      R.opened = st.fightOpen() === true; await frames(3);
      const T = E.tag(), A = st.fightBodies.a;
      R.uprightBoom = near(T.lens[0], A.position.x) && near(T.lens[1], A.position.y + 3.4) && near(T.lens[2], A.position.z + 4.4) && E.camera.fov === 74
        && near(E.pitch.rotation.x, -26 * Math.PI / 180, 1e-12) && T.boom.back === 4.4;
      R.staleTaken = T.stale >= 1 && !document.getElementById('stick').classList.contains('on');
      window.__p0 = { a: [A.position.x, A.position.z] };
      return R;`);
    await touch('touchMove', [[80, 640, 1]]);
    await pp.waitForTimeout(1500);
    await touch('touchMove', [[80, 600, 1]]);
    await pp.waitForTimeout(1000);
    K.tagPhoneStaleFinger = await pCheck('stale', `await frames(3); const A = st.fightBodies.a; return { notMoved: A.position.x === window.__p0.a[0] && A.position.z === window.__p0.a[1] };`);
    await touch('touchEnd', []);
    /* a fresh finger on the stick: the played one walks away down the court; the other stands */
    await pEval(`const B = st.fightBodies.b; window.__p1 = { a: [st.fightBodies.a.position.x, st.fightBodies.a.position.z], b: [B.position.x, B.position.z] }; return true;`);
    await touch('touchStart', [[80, 700, 2]]);
    await touch('touchMove', [[80, 676, 2]]);
    await touch('touchMove', [[80, 650, 2]]);
    const walked = await pUntil(`return window.__p1.a[1] - st.fightBodies.a.position.z > 0.08;`, 40000);
    await touch('touchEnd', []);
    K.tagPhoneStick = walked && await pCheck('stick', `
      await frames(2); const A = st.fightBodies.a, B = st.fightBodies.b;
      return { away: A.position.z < window.__p1.a[1] - 0.08 && Math.abs(A.position.x - window.__p1.a[0]) < 0.02, otherStill: B.position.x === window.__p1.b[0] && B.position.z === window.__p1.b[1],
               stickGone: !document.getElementById('stick').classList.contains('on') };`);
    /* a drag on the right turns nothing */
    await touch('touchStart', [[300, 520, 3]]);
    for (const [x, y] of [[280, 480], [240, 430], [200, 380]]) await touch('touchMove', [[x, y, 3]]);
    await touch('touchEnd', []);
    K.tagPhoneNoLook = await pCheck('noLook', `await frames(3); return { still: E.yaw.rotation.y === 0 && near(E.pitch.rotation.x, -26 * Math.PI / 180, 1e-12) };`);
    /* a target's mark in the stick's half: a tap there is a pick, and never the stick */
    const pm = await pEval(`
      const A = st.fightBodies.a, T = st.fightTargets[0]; T.tired = false; T.taken = false; T.hidden = false;
      T.m.position.set(A.position.x - 1.2, 1.0, A.position.z - 2.5);
      await frames(3);
      const m = E.tag().marks.find(k => k.id === T.id);
      window.__n0 = E.tag().log.length; window.__p2 = [A.position.x, A.position.z];
      /* (the stick watched while the finger is down, by the page itself: a read from out here between the two touches
         would hold the finger down longer than a tap) */
      const sk = document.getElementById('stick'); window.__stickSeen = sk.classList.contains('on');
      window.__stickMo = new MutationObserver(() => { if (sk.classList.contains('on')) window.__stickSeen = true; }); window.__stickMo.observe(sk, { attributes: true });
      const at = m && document.elementFromPoint(m.x, m.y);
      return { m: m && m.x < innerWidth * 0.45 && at && at.id === 'scene' ? m : null,
               seen: m ? { x: m.x, y: m.y, r: m.r, at: at ? (at.id || at.className) : null, W: innerWidth } : null };`).then(r => { tagParts['phone.pickAt'] = r.seen; return r.m; });
    if (pm) {
      const ts = Date.now() / 1000;
      await touch('touchStart', [[pm.x, pm.y, 4]], ts);
      await touch('touchEnd', [], ts + 0.09);
      tagParts['phone.pickStick'] = await pp.evaluate(() => { window.__stickMo.disconnect(); return window.__stickSeen; });
    }
    if (!pm || tagParts['phone.pickStick'] !== false) console.log('tag phone pick', JSON.stringify({ at: tagParts['phone.pickAt'], stick: tagParts['phone.pickStick'] }));
    K.tagPhonePickInStickHalf = !!pm && tagParts['phone.pickStick'] === false
      && await pUntil(`return logSince(window.__n0).some(r => r.act === 'target');`, 20000)
      && await pCheck('pick', `
        await frames(2); const L = logSince(window.__n0), A = st.fightBodies.a;
        return { picked: L.length === 1 && L[0].id === 't1' && L[0].by === 'tap' && F.picked === 't1', notMoved: A.position.x === window.__p2[0] && A.position.z === window.__p2[1] };`);
    /* a button, by a tap */
    const bA0 = await pEval(`window.__n0 = E.tag().log.length; const r = document.getElementById('tagA0').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };`);
    await tap(bA0.x, bA0.y, 5);
    K.tagPhoneButton = await pUntil(`return logSince(window.__n0).some(r => r.act === 'zap' && r.phase === 'up');`, 20000)
      && await pCheck('button', `const L = logSince(window.__n0); return { tapped: L[0].act === 'zap' && L[0].phase === 'down' && L[0].by === 'tap', noClick: !L.some(r => r.by === 'click') };`);
    /* every overlap of what the mode adds, the caption up, a refusal said, TAKE shown, the other one's mark up */
    const phoneHud = async (label, party) => {
      await pEval(`
        const A = st.fightBodies.a, T = st.fightTargets[1]; T.tired = true; T.taken = false; T.hidden = false; T.m.position.set(A.position.x + 1, 1, A.position.z - 0.4);
        kit.tagPlace('b', A.position.x + 0.6, A.position.z + 5.4, {});
        kit.captions([{ at: 0, end: 60, text: 'A line said while the fight is on, long enough to wrap onto two lines here.' }]);
        kit.tagAct('zap', { blocked: 'Not now.' }); await frames(3); return true;`);
      /* (the caption, TAKE and the other one's mark first; the refusal LAST, so its words, up for 2.2 s, are measured
         standing: on a slow box four things waited for together outlast them) */
      await pUntil(`return document.getElementById('caption').classList.contains('on')
        && !document.getElementById('tagA2').classList.contains('hide') && document.getElementById('tagMate').classList.contains('on');`, 30000);
      await new Promise(r => setTimeout(r, 950));
      const r0 = await pEval(`const r = document.getElementById('tagA0').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };`);
      const sw = party ? '#tagParty' : '#tagSw', mine = TAG_HUD_MINE.map(x => x === '#tagSw' ? sw : x), all = TAG_HUD_ALL.map(x => x === '#tagSw' ? sw : x);
      await tagArm(pp, mine, all);
      await tap(r0.x, r0.y, 6);
      const ov = await tagRead(pp);
      console.log('tag HUD ' + label + ':', JSON.stringify({ bad: ov.bad, off: ov.off, measured: ov.measured, up: ov.up }));
      return ov.bad.length === 0 && ov.off.length === 0 && ['#tagA0', '#tagA1', '#tagA2', sw, '#tagCount', '#tagMate', '#caption', '#nofire', '#stats', '#objective .obox'].every(s => ov.measured.includes(s))
        && (!party || !ov.measured.includes('#tagSw'));
    };
    K.tagHudPhone = await phoneHud('390x844');
    await pp.setViewportSize({ width: 360, height: 780 });
    await pEval(`await frames(4); return true;`);
    K.tagHudLowPhone = await phoneHud('360x780');
    /* v28.0 · THE PARTY LIST (the sixty-eighth seam; Chad's R49 and R50): the same fight opened with `party` and Tab for its
       key. Its tiles drawn (the played one lit, the round button not drawn); a REAL TAP on the other's tile switches to that
       one; a tap on the played one's tile only bumps it; a tap inside the switch's lock is refused and shakes the tile; the
       switch's ask makes the other tile call; Tab switches and never moves the browser's focus; and every overlap of what
       the mode puts up, the list in place of the round button, on this phone, a low phone and a desktop's width */
    await pEval(`kit.captions(null); kit.tagAct('zap', { blocked: null }); st.fightEnd('restore'); await frames(2); return true;`);
    await pp.setViewportSize({ width: 390, height: 844 });
    K.tagPartyShown = await pCheck('partyShown', `
      await frames(2);
      const R = {};
      R.opened = st.fightOpen({ party: true, keys: { switch: 'Tab' } }) === true;
      await poll(() => { const s0 = kit.tagState(); return s0.live && s0.party && s0.party.tiles.length === 2; }, 20000);
      await frames(4);
      const P0 = kit.tagState().party, cs = getComputedStyle(document.getElementById('tagParty'));
      R.tiles = P0.tiles.length === 2 && P0.tiles[0].id === 'a' && P0.tiles[0].on && !P0.tiles[1].on && P0.tiles[0].name === 'GOLD' && P0.tiles[1].title === 'THE SECOND';
      R.pics = P0.tiles.every(t => t.pic);
      R.shown = cs.display === 'flex' && getComputedStyle(document.getElementById('tagSw')).display === 'none';
      const r = document.querySelector('#tagParty .tpTile[data-id="b"]').getBoundingClientRect();
      R.atEdge = Math.abs(r.right - innerWidth) < 1 && r.top > innerHeight * 0.3 && r.bottom < innerHeight * 0.55;
      return R;`);
    /* (and GONE under a film played from the mode, back as play comes back: R47's lab, 23 Nov, found the list standing over
       the Naga's film, its showing rule naming one class more than the hiding ones and so outweighing them) */
    K.tagPartyFilm = await pCheck('partyFilm', `
      const R = {};
      R.started = kit.film('flash') === true;
      R.cine = await poll(() => E.getState() === 'cine', 30000);
      await frames(3);
      R.hidden = getComputedStyle(document.getElementById('tagParty')).display === 'none';
      R.back = await poll(() => E.getState() === 'play', 180000);
      await frames(4);
      R.shownAgain = getComputedStyle(document.getElementById('tagParty')).display === 'flex' && kit.tagState().on;
      return R;`);
    const tb = await pEval(`window.__n0 = E.tag().log.length; window.__pn = kit.tagState().party; const r = document.querySelector('#tagParty .tpTile[data-id="b"]').getBoundingClientRect(); return { x: r.left + r.width * 0.6, y: r.top + r.height / 2 };`);
    await tap(tb.x, tb.y, 7);
    K.tagPartyTap = await pUntil(`return kit.tagState().played === 'b';`, 20000)
      && await pCheck('partyTap', `
        await frames(2); const L = logSince(window.__n0), P0 = kit.tagState().party;
        return { told: L.some(r => r.act === 'switch' && r.to === 'b' && r.by === 'tap'), lit: P0.tiles[1].on && !P0.tiles[0].on, took: P0.took === window.__pn.took + 1 };`);
    /* the played one's tile: a bump, nothing switched (after the switch's lock has run) */
    await pEval(`await poll(() => kit.tagState().lock === 0, 20000); window.__n0 = E.tag().log.length; window.__pn = kit.tagState().party; return true;`);
    const tb2 = await pEval(`const r = document.querySelector('#tagParty .tpTile[data-id="b"]').getBoundingClientRect(); return { x: r.left + r.width * 0.6, y: r.top + r.height / 2 };`);
    await tap(tb2.x, tb2.y, 8);
    K.tagPartyHere = await pCheck('partyHere', `
      await frames(4);
      return { still: kit.tagState().played === 'b', none: !logSince(window.__n0).some(r => r.act === 'switch'), bump: kit.tagState().party.here === window.__pn.here + 1 };`);
    /* inside the lock: refused, and the tile it would have gone to shakes */
    K.tagPartyLock = await pCheck('partyLock', `
      const f0 = E.tag().refused, n0 = kit.tagState().party.nope;
      const sw = kit.tagSwitch('a');
      const el = document.querySelector('#tagParty .tpTile[data-id="b"]');
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 61, pointerType: 'touch' }));
      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 61, pointerType: 'touch' }));
      await frames(3);
      return { switched: sw === true, held: kit.tagState().played === 'a', refused: E.tag().refused === f0 + 1, shook: kit.tagState().party.nope === n0 + 1 };`);
    /* the switch's ask: the other tile calls (its row's chevrons too) */
    K.tagPartyAsk = await pCheck('partyAsk', `
      kit.tagAct('switch', { pulse: true }); await frames(3);
      const P0 = kit.tagState().party, row = document.querySelector('#tagParty .tpTile[data-id="b"]').parentElement;
      const r = { asks: P0.tiles[1].ask && !P0.tiles[0].ask, row: row.classList.contains('ask') };
      kit.tagAct('switch', { pulse: false }); await frames(3);
      r.stops = !kit.tagState().party.tiles[1].ask;
      return r;`);
    /* Tab: the switch, and the browser's focus never moved */
    await pEval(`await poll(() => kit.tagState().lock === 0, 20000); window.__tabDP = null;
      window.addEventListener('keydown', e => { if (e.code === 'Tab') setTimeout(() => { window.__tabDP = e.defaultPrevented; }, 0); }, { once: true });
      window.__n0 = E.tag().log.length; return true;`);
    await pp.keyboard.press('Tab');
    K.tagPartyTab = await pUntil(`return kit.tagState().played === 'b';`, 20000)
      && await pCheck('partyTab', `await frames(2); return { told: logSince(window.__n0).some(r => r.act === 'switch' && r.by === 'key'), kept: window.__tabDP === true };`);
    K.tagPartyHudPhone = await phoneHud('party 390x844', true);
    await pp.setViewportSize({ width: 360, height: 780 });
    await pEval(`await frames(4); return true;`);
    K.tagPartyHudLowPhone = await phoneHud('party 360x780', true);
    await pp.setViewportSize({ width: 900, height: 600 });
    await pEval(`await frames(4); return true;`);
    K.tagPartyHudWide = await phoneHud('party 900x600', true);
    await pEval(`kit.captions(null); kit.tagAct('zap', { blocked: null }); st.fightEnd('restore'); await frames(2); return true;`);
  } catch (e) {
    console.log('tag phone threw', e && e.message);
    K.tagPhoneRan = false;
  }
  await pctx.close().catch(() => {});
}
await p.evaluate((parts) => { window.__tag = parts; }, tagParts).catch(() => {});
out.kit = K;

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
