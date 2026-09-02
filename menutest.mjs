/* The pause menu and the chapter selector (v5.12).

   What this drives, in order:
     1. the title screen has a Chapters button; on a fresh profile only
        chapter 1 is open, every later chapter is shown locked
     2. in play the gear button sits under the mute button and the
        inventory button under that, one column, same size
     3. M opens the menu; the walk is frozen while it is up; the round
        buttons step aside; Escape closes it
     4. the gear toggles it too; Return to the game returns
     5. Back to the title screen saves where you stood, brings the title
        up and the HUD down, and Continue then lands you on that spot
     6. reaching chapter 2 opens it in the selector; picking it from the
        menu asks first, then plays its opening film, then the chapter
     7. and that film has its SOUND: every cue it fires finds a decoded
        sample — the v5.13 fix for the silent replayed film              */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';

const errs = [];
const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 900, height: 600 } });
p.on('pageerror', e => errs.push('ERR ' + e.message));
p.setDefaultNavigationTimeout(180000);
p.setDefaultTimeout(120000);
const out = {};
const st = () => p.evaluate(() => window.__enc.getState());
const at = () => p.evaluate(() => ({ x: window.__enc.yaw.position.x, z: window.__enc.yaw.position.z }));
const tiles = () => p.evaluate(() => [...document.querySelectorAll('#chList .chTile')]
  .map(el => ({ ch: el.dataset.ch, locked: el.classList.contains('locked') })));
const hidden = id => p.evaluate(i => document.getElementById(i).classList.contains('hide'), id);

await p.goto(PAGE, { waitUntil: 'load' });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => { window.__enc.clearCheckpoint(); try { localStorage.removeItem('mz.encounters.progress'); } catch {} });
await p.waitForTimeout(600);

// --- 1. the title's selector, fresh profile --------------------------------
await p.click('#chaptersBtn'); await p.waitForTimeout(300);
out.titleOpensChapters = !(await hidden('chapters'));
{ const t = await tiles(); out.freshOnlyFirstOpen = t.length >= 2 && !t[0].locked && t.slice(1).every(x => x.locked); }
await p.click('#chClose'); await p.waitForTimeout(200);
out.closeCloses = await hidden('chapters');

// --- 2. play: the column of round buttons ----------------------------------
await p.click('#startBtn');
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 150000 });
await p.waitForTimeout(800);
out.buttonsStacked = await p.evaluate(() => {
  const r = id => document.getElementById(id).getBoundingClientRect();
  const m = r('mute'), g = r('menuBtn'), i = r('invBtn');
  return g.height > 30 && g.top >= m.bottom - 1 && i.top >= g.bottom - 1
    && Math.abs(g.left - m.left) < 2 && Math.abs(i.left - m.left) < 2;
});

// --- 3. M opens, freezes, Escape closes -------------------------------------
await p.keyboard.press('KeyM'); await p.waitForTimeout(300);
out.mOpens = (await st()) === 'menu' && !(await hidden('menu'));
out.roundButtonsHidden = await p.evaluate(() => getComputedStyle(document.getElementById('mute')).display === 'none');
const p0 = await at();
await p.keyboard.down('KeyW'); await p.waitForTimeout(900); await p.keyboard.up('KeyW');
const p1 = await at();
out.frozenWhileOpen = Math.hypot(p1.x - p0.x, p1.z - p0.z) < 1e-4;
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
out.escapeCloses = (await st()) === 'play' && (await hidden('menu'));

// --- 4. the gear toggles it; Return to the game returns ----------------------
await p.evaluate(() => document.exitPointerLock());   // the game took the mouse back for looking; a click needs a cursor
await p.waitForTimeout(400);
await p.click('#menuBtn'); await p.waitForTimeout(300);
out.tapOpens = (await st()) === 'menu';
await p.click('#menuResume'); await p.waitForTimeout(300);
out.resumeReturns = (await st()) === 'play';

// --- 5. back to the title, and Continue comes back to the same spot ----------
await p.keyboard.down('KeyW'); await p.waitForTimeout(1200); await p.keyboard.up('KeyW');
await p.waitForTimeout(400);
const before = await at();
await p.keyboard.press('KeyM'); await p.waitForTimeout(250);
await p.click('#menuTitle'); await p.waitForTimeout(600);
out.backToTitle = (await st()) === 'title' && !(await hidden('title')) && (await hidden('hud'))
  && await p.evaluate(() => getComputedStyle(document.getElementById('menuBtn')).display === 'none');
out.savedOnLeaving = await p.evaluate(() => { const s = window.__enc.loadCheckpoint(); return !!(s && s.at && Number.isFinite(s.at.x)); });
out.titleSaysContinue = (await p.$eval('#startBtn', e => e.textContent.trim())) === 'Continue';
await p.click('#startBtn');
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 150000 });
await p.waitForTimeout(500);
const after = await at();
out.continueLandsThere = Math.hypot(after.x - before.x, after.z - before.z) < 0.05;

// --- 6. the selector from the menu: reached opens, ask, film, chapter --------
await p.evaluate(() => { window.__enc.markReached('ch2'); window.__enc.setMuted(false); });
await p.keyboard.press('KeyM'); await p.waitForTimeout(250);
await p.click('#menuChapters'); await p.waitForTimeout(300);
{ const t = await tiles(); out.reachedOpensIt = t.length >= 3 && !t[0].locked && !t[1].locked && t[2].locked; }
await p.click('#chList .chTile[data-ch="ch2"]'); await p.waitForTimeout(300);
out.asksFirst = !(await hidden('chAsk'));
await p.click('#chYes');
await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 150000 });
out.opensOnItsFilm = await p.evaluate(() => window.__enc.chapterKey() === 'ch2');
// --- 7. the film is heard: wait for its first cues, none may have missed its sample
await p.waitForFunction(() => window.__enc.stings().length >= 2, null, { timeout: 120000 }).catch(() => {});
{
  const st6 = await p.evaluate(() => window.__enc.stings());
  out.filmHasItsSound = st6.length >= 2 && st6.every(s => s.how === 'sample' || s.how === 'step' || s.how === 'synth');
  if (!out.filmHasItsSound) console.log('cues:', JSON.stringify(st6));
}
await p.evaluate(() => window.__enc.cine.skip());
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 150000 });
out.thenPlaysIt = await p.evaluate(() => window.__enc.chapterKey() === 'ch2')
  && (await hidden('menu')) && (await hidden('chapters'));

console.log(JSON.stringify(out, null, 1));
console.log('errors:', errs.length ? errs : 'none');
const bad = Object.entries(out).filter(([, v]) => v !== true).map(([k]) => k);
console.log(bad.length ? 'FAILED: ' + bad.join(', ') : 'all menu checks passed');
await b.close();
process.exit(bad.length || errs.length ? 1 : 0);
