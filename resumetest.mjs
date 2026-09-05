/* Save and resume, from the player's side.

   The promise is small and absolute: you never lose ground. Close the tab
   mid-chapter, come back, press the big button, and you are standing where
   you were with the stats you had. Starting over is possible but never
   accidental.

   What this drives, in order:
     1. a first-ever boot offers Start game and nothing else
     2. playing writes a save by itself — no button, no prompt
     3. a reload turns the big button into Continue and says what is waiting
     4. Continue puts you back at the same spot, facing the same way, with
        the same stats and the same inventory
     5. New game asks first, and Cancel really cancels
     6. New game confirmed wipes the save and starts from the beginning
     7. fainting rewrites the save to the START of the chapter, so Continue
        after a faint is a restart and not a rewind three seconds back
     8. a save naming a chapter this build no longer has never bricks the
        boot — same rule as ?ch=

   It reloads the page repeatedly on purpose: a save that only works without
   a reload is not a save.                                                 */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from './testlib.mjs';

const errs = [];
const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 900, height: 600 } });
p.on('pageerror', e => errs.push('ERR ' + e.message));
p.setDefaultNavigationTimeout(180000);
p.setDefaultTimeout(90000);

const out = {};
const boot = async () => {
  await p.goto(PAGE, { waitUntil: 'load' });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.waitForTimeout(1500);
};
const play = async () => {
  await p.click('#startBtn');
  await toPlay(p);                 // v6.4: through the film, the card, into play
};
const titleBits = () => p.evaluate(() => ({
  btn: document.getElementById('startBtn')?.textContent.trim(),
  newGame: !document.getElementById('newGameBtn')?.classList.contains('hide'),
  note: document.getElementById('resumeNote')?.classList.contains('hide')
    ? null : document.getElementById('resumeNote')?.textContent,
}));

// --- 1. a first-ever boot ---------------------------------------------------
await boot();
await p.evaluate(() => { window.__enc.clearCheckpoint(); });
await boot();
{
  const t = await titleBits();
  out.freshSaysStart = t.btn === 'Start game';
  out.freshHidesNewGame = t.newGame === false;
  out.freshHidesNote = t.note === null;
  out.freshHasNoSave = await p.evaluate(() => window.__enc.loadCheckpoint() === null);
}

// --- 2. playing writes a save on its own -----------------------------------
await play();
out.savedOnEnteringPlay = await p.evaluate(() => !!window.__enc.loadCheckpoint());
await p.evaluate(() => {
  window.__enc.yaw.position.set(3.5, 1.62, -4.25);
  window.__enc.yaw.rotation.y = 1.1;
  window.__enc.stats.awareness = 73;
  window.__enc.stats.wisdom = 61;
  window.__enc.invAdd('note');
});
// force one rather than waiting out the throttle; the throttle itself is
// checked below by letting the loop write one unaided
await p.evaluate(() => window.__enc.saveCheckpoint());
out.saveHasPosition = await p.evaluate(() => {
  const s = window.__enc.loadCheckpoint();
  return !!s && s.v === 2 && Math.abs(s.at.x - 3.5) < 0.01
    && Math.abs(s.at.z + 4.25) < 0.01 && Math.abs(s.at.ry - 1.1) < 0.01;
});
// the throttled autosave in the frame loop must fire by itself
out.autosaveRunsUnaided = await p.evaluate(async () => {
  const e = window.__enc;
  const before = e.loadCheckpoint().t;
  e.yaw.position.set(1.0, 1.62, -2.0);
  await new Promise(r => setTimeout(r, 11000));      // AUTOSAVE_MS is 8 s
  const after = e.loadCheckpoint();
  return after.t > before && Math.abs(after.at.x - 1.0) < 0.01;
});

// --- 3 + 4. reload, Continue, land where you were ---------------------------
await boot();
{
  const t = await titleBits();
  out.reloadSaysContinue = t.btn === 'Continue';
  out.reloadShowsNewGame = t.newGame === true;
  out.reloadNamesChapter = typeof t.note === 'string' && t.note.includes('Chapter 1');
}
/* Watch for the FIRST frame of the resumed run. The saved spot is inside the
   deck, well within her trigger radius, so she will quite properly appear a
   moment later — that is play, not a restore. What resume must never do is
   put her back mid-appearance, so the thing to measure is the instant the
   run begins, not a second and a half into it. */
await p.evaluate(() => {
  window.__firstReveal = null; window.__playFrames = [];   // v6.4: the first frames, for the record
  const tick = () => {
    if (window.__firstReveal === null && window.__enc.getState() === 'play') {
      window.__firstReveal = window.__enc.getReveal();
    }
    if (window.__enc.getState() === 'play' && window.__playFrames.length < 4)
      window.__playFrames.push([+performance.now().toFixed(0), +window.__enc.getReveal().toFixed(3)]);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await play();
await p.waitForTimeout(1200);
out.resumedExactly = await p.evaluate(() => {
  const e = window.__enc, y = e.yaw;
  return Math.abs(y.position.x - 1.0) < 0.05 && Math.abs(y.position.z + 2.0) < 0.05
    && e.stats.awareness === 73 && e.stats.wisdom === 61
    && e.inv().bag.includes('note');
});
out.ghostRearmed = await p.evaluate(() => window.__firstReveal === 0);
if (!out.ghostRearmed) console.log('first reveal:', await p.evaluate(() => JSON.stringify({ first: window.__firstReveal, frames: window.__playFrames }))); // v6.4

// --- 5. New game asks first, and Cancel cancels -----------------------------
await boot();
await p.click('#newGameBtn');
await p.waitForTimeout(400);
out.confirmAppears = await p.evaluate(() =>
  !document.getElementById('newConfirm').classList.contains('hide'));
await p.click('#newNo');
await p.waitForTimeout(400);
out.cancelKeepsSave = await p.evaluate(() =>
  document.getElementById('newConfirm').classList.contains('hide')
  && !!window.__enc.loadCheckpoint()
  && window.__enc.getState() === 'title');

// --- 6. New game confirmed wipes and restarts -------------------------------
await p.click('#newGameBtn');
await p.waitForTimeout(400);
await p.click('#newYes');
await toPlay(p);                 // v6.4: through the film, the card, into play
await p.waitForTimeout(800);
out.newGameResets = await p.evaluate(() => {
  const e = window.__enc;
  return e.stats.awareness === 50 && e.stats.wisdom === 50 && e.stats.sanity === 100;
});
out.newGameBackAtSpawn = await p.evaluate(() => {
  const c = window.__enc.chapter;
  return Math.abs(window.__enc.yaw.position.z - c.spawn.z) < 0.5;
});

// --- 7. fainting is a restart, not a rewind ---------------------------------
await p.evaluate(() => {
  window.__enc.yaw.position.set(2.0, 1.62, -6.0);   // deep in the deck
  window.__enc.stats.awareness = 12;
});
await p.evaluate(() => window.__enc.saveCheckpoint());
await p.evaluate(() => window.__enc.lose());
await p.waitForFunction(() => window.__enc.getState() === 'lost', null, { timeout: 90000 });
out.faintSavesChapterStart = await p.evaluate(() => {
  const s = window.__enc.loadCheckpoint();
  return !!s && s.at === null && s.ch === 'ch1' && s.stats.sanity === 100;
});

/* --- 7b. an explicit ?ch= link outranks the save, and must not eat it -----
   Asking for a chapter by name and being resumed into a different one is
   wrong for a player and worse for a harness, which would otherwise inherit
   whatever run the browser profile happened to be holding. But the save is
   only HIDDEN, never cleared: opening a deep link must not delete a real
   run behind the player's back — no confirm appeared and nobody asked. */
{
  const sep = PAGE.includes('?') ? '&' : '?';
  await p.goto(PAGE, { waitUntil: 'load' });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.evaluate(() => window.__enc.saveCheckpoint());   // a run worth keeping
  const before = await p.evaluate(() => localStorage.getItem('mz.encounters.checkpoint'));

  await p.goto(PAGE + sep + 'ch=chtest', { waitUntil: 'load' });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.waitForTimeout(1200);
  out.deepLinkIgnoresSave = await p.evaluate(() =>
    document.getElementById('startBtn').textContent.trim() === 'Start game'
    && document.getElementById('newGameBtn').classList.contains('hide'));
  await play();
  out.deepLinkPlaysItsChapter = await p.evaluate(() => window.__enc.chapter.id === 99);
  out.deepLinkKeptTheSave = await p.evaluate(prev =>
    localStorage.getItem('mz.encounters.checkpoint') !== null
    && JSON.parse(localStorage.getItem('mz.encounters.checkpoint')).ch === 'ch1'
    && prev !== null, before);
}

// --- 8. a save for a chapter this build no longer has ------------------------
await p.evaluate(() => {
  localStorage.setItem('mz.encounters.checkpoint', JSON.stringify({
    v: 2, ch: 'chapter-that-was-deleted',
    stats: { sanity: 40, awareness: 40, wisdom: 40 },
    inv: { gear: {}, bag: [] }, at: { x: 0, y: 1.62, z: 0, ry: 0 }, done: false, t: 1
  }));
});
await boot();
out.goneChapterFallsBack = await p.evaluate(() =>
  !!window.__enc && window.__enc.getState() === 'title'
  && document.getElementById('startBtn').textContent.trim() === 'Start game');
await play();
out.stillPlayableAfterGoneChapter = await p.evaluate(() =>
  window.__enc.getState() === 'play' && window.__enc.worldState().ch === 'ch1');

console.log(JSON.stringify(out, null, 1));
const MUST = ['freshSaysStart', 'freshHidesNewGame', 'freshHidesNote', 'freshHasNoSave',
  'savedOnEnteringPlay', 'saveHasPosition', 'autosaveRunsUnaided',
  'reloadSaysContinue', 'reloadShowsNewGame', 'reloadNamesChapter',
  'resumedExactly', 'ghostRearmed', 'confirmAppears', 'cancelKeepsSave',
  'newGameResets', 'newGameBackAtSpawn', 'faintSavesChapterStart',
  'deepLinkIgnoresSave', 'deepLinkPlaysItsChapter', 'deepLinkKeptTheSave',
  'goneChapterFallsBack', 'stillPlayableAfterGoneChapter'];
for (const k of MUST) if (out[k] !== true) errs.push(`ERR resume promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
