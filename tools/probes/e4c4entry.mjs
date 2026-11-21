/* v27.0 (Chad, 21 Nov 2026, R144: "does it introduce any potential bugs, where player who never experienced the start
   before goes straight to the holy water fight? or player who wants to restart the entire chapter somehow goes straight to
   the holy water fight?"): EVERY WAY INTO EPISODE 4 CHAPTER 4, each from a fresh page with the save and the chapter
   progress a player would have (seeded as the game writes them), pressed by real taps on a phone-sized touch page:
     natural   what chapter 3's end writes (the save at chapter 4's start), Continue: its opening film, then its start
     selector  a run in chapter 3, the title's Chapters, chapter 4, Play it: its opening film, then its start
     heldsel   a save left at the fight's start by a loss, the title's Chapters, chapter 4, Play it: its START, never the fight
     heldnew   the same save, New game and its yes: episode 1's start, the save gone
     after     what chapter 4's end writes (chapter 5's start), Chapters, chapter 4, Play it: its start
     heldvia   a save left at the fight's start: Continue (the fight's brief), START (the fight held, on the page and in the
               save), then the in-play menu's Chapters into another chapter (episode 4 chapter 2) and from there the menu's
               Chapters into chapter 4: its start, never the fight, nothing held
     old-*     saves as v27.0 wrote them before this build (no `y`), Continue: history, the sight, the blessing before the
               water (his teacher's why said once, then the order), the blessing with the water (the fight's brief), the
               room kept (the trance)
   Each reports where it landed (the first state, the phase the chapter applied, the order on screen, anything held) and
   every page error; the run exits non-zero on a check that fails.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [ONLY=natural,selector,...] [OUT=dir] node tools/probes/e4c4entry.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4entry';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844;
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const ST = { sanity: 100, awareness: 50, wisdom: 50 };
const SPAWN = { x: 0.15, y: 1.62, z: 1.0, ry: Math.PI };
const base = (o) => ({ v: 2, stats: ST, inv: { gear: {}, bag: [] }, conduct: { s: 0, a: 0, notes: [] }, choices: {}, done: false, t: 1, ...o });
const HELD = base({ ch: 'e4c4', phase: 'bless:r,m,f,o,a,k,v,l1,l2,l3,w,y', at: { x: 0.9, y: 1.62, z: 3.0, ry: 2.4 }, stats: { sanity: 88, awareness: 54, wisdom: 52 } });
const CASES = {
  natural:  { save: base({ ch: 'e4c4', at: null, phase: null }), reached: 'e4c4', how: 'continue', want: { film: true, phase: 'history' } },
  selector: { save: base({ ch: 'e4c3', phase: null, at: { x: 0, y: 1.62, z: 0, ry: 0 } }), reached: 'e4c4', how: 'selector', want: { film: true, phase: 'history' } },
  heldsel:  { save: HELD, reached: 'e4c4', how: 'selector', want: { film: true, phase: 'history' } },
  heldnew:  { save: HELD, reached: 'e4c4', how: 'newgame', want: { ch: 'ch1' } },
  after:    { save: base({ ch: 'e4c5', at: null, phase: null }), reached: 'e4c5', how: 'selector', want: { film: true, phase: 'history' } },
  heldvia:  { save: HELD, reached: 'e4c5', how: 'via', want: { film: true, phase: 'history' } },
  'old-history': { save: base({ ch: 'e4c4', phase: 'history:r,m', at: SPAWN }), reached: 'e4c4', how: 'continue', want: { film: false, phase: 'history', obj: /history/i } },
  'old-sight':   { save: base({ ch: 'e4c4', phase: 'sight:r,m,f,o,a,k,v,l1', at: SPAWN }), reached: 'e4c4', how: 'continue', want: { film: false, phase: 'sight' } },
  'old-bless':   { save: base({ ch: 'e4c4', phase: 'bless:r,m,f,o,a,k,v,l1,l2,l3', at: SPAWN }), reached: 'e4c4', how: 'continue', want: { film: false, phase: 'bless', why: true, obj: /Take the holy water/ } },
  'old-water':   { save: base({ ch: 'e4c4', phase: 'bless:r,m,f,o,a,k,v,l1,l2,l3,w', at: SPAWN }), reached: 'e4c4', how: 'continue', want: { film: false, phase: 'bless', brief: true } },
  'old-kept':    { save: base({ ch: 'e4c4', phase: 'kept:r,m,f,o,a,k,v,l1,l2,l3,w', at: SPAWN }), reached: 'e4c4', how: 'continue', want: { film: false, phase: 'kept', trance: true } }
};
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(CASES);
const b = await chromium.launch(LAUNCH);
const checks = {}, results = {};
for (const name of ONLY) {
  const C = CASES[name];
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  await ctx.addInitScript(([s, r]) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s);
    localStorage.setItem('mz.encounters.progress', JSON.stringify({ reached: r, t: 1 })); sessionStorage.setItem('seeded', '1'); } }, [JSON.stringify(C.save), C.reached]);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 250 }).then(() => true, () => false);
  const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    let vis = r.width > 2 && r.height > 2 && cs.display !== 'none' && cs.visibility !== 'hidden'; for (let a = e; a && vis; a = a.parentElement) if (a.classList && a.classList.contains('hide')) vis = false;
    return vis ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, sel);
  const tap = async (sel) => { const q = await box(sel); if (!q) return false; await p.touchscreen.tap(Math.round(q.x), Math.round(q.y)); return true; };
  await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc && !!document.getElementById('startBtn'), null, { timeout: 240000 });
  const title = await p.evaluate(() => ({ btn: document.getElementById('startBtn').textContent.trim(), note: (document.getElementById('resumeNote') || {}).textContent || '' }));
  let pressed = false;
  if (C.how === 'continue') pressed = await tap('#startBtn');
  else if (C.how === 'newgame') { pressed = await tap('#newGameBtn') && await until(() => !document.getElementById('newConfirm').classList.contains('hide'), 30000) && await tap('#newYes'); }
  else if (C.how === 'via') {
    /* Continue into the fight's brief, its START (the fight held), then the in-play menu into chapter 2 and back to 4 */
    const menuTo = async (key) => await tap('#menuBtn') && await until(() => window.__enc.getState() === 'menu', 60000) && await tap('#menuChapters')
      && await until((k) => !!document.querySelector(`#chList .chTile[data-ch="${k}"]`), 60000, key) && await tap(`#chList .chTile[data-ch="${key}"]`)
      && await until(() => !document.getElementById('chAsk').classList.contains('hide'), 30000) && await tap('#chYes');
    const skipFilm = async () => { await until(() => ['cine', 'play'].includes(window.__enc.getState()), 1800000);
      if (await p.evaluate(() => window.__enc.getState() === 'cine')) { await until(() => !window.__enc.cine.active() || window.__enc.cine.t() > 3.2, 600000); await tap('#cineSkip'); }
      return until(() => window.__enc.getState() === 'play', 1800000); };
    const held = await tap('#startBtn') && await until(() => { const q = window.__enc.kitDebug().event; return !!q && q.kind === 'guard' && !!q.briefing; }, 1800000)
      && await p.waitForTimeout(1500).then(() => tap('#evBtn')) && await until(() => !!window.__enc.loseHold(), 600000);
    log(name, 'the fight held:', held);
    const in2 = held && await menuTo('e4c2') && await skipFilm() && await until(() => window.__enc.chapterKey() === 'e4c2' && window.__enc.loseHold() === null, 600000);
    log(name, 'in chapter 2, nothing held:', in2);
    await p.waitForTimeout(3000);
    pressed = in2 && await menuTo('e4c4');
  }
  else if (C.how === 'selector') {
    pressed = await tap('#chaptersBtn') && await until(() => !!document.querySelector('#chList .chTile[data-ch="e4c4"]'), 60000)
      && await tap('#chList .chTile[data-ch="e4c4"]') && await until(() => !document.getElementById('chAsk').classList.contains('hide'), 30000) && await tap('#chYes');
  }
  /* where it landed: a film first or straight into play, then the phase the chapter applies */
  const first = await until(() => ['cine', 'play'].includes(window.__enc.getState()), 1800000).then(() => p.evaluate(() => window.__enc.getState()));
  let film = first === 'cine';
  if (film) {
    /* the opening (or the trance) watched to its Skip and skipped, as a thumb does */
    await until(() => !window.__enc.cine.active() || window.__enc.cine.t() > 3.2, 600000);
    await tap('#cineSkip');
  }
  const inPlay = await until(() => { const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
    return E.getState() === 'play' && (typeof E.stage.info !== 'function' || !!i.applied); }, 1800000);   // (episode 1's stages have no info())
  if (C.want.why) await until(() => window.__enc.stage.info().heard.includes('ph4k4') && !window.__enc.stage.dbg.play.busy, 1800000);
  if (C.want.brief) await until(() => { const q = window.__enc.kitDebug().event; return !!q && q.kind === 'guard' && !!q.briefing; }, 600000);
  const trance = C.want.trance ? await until(() => window.__enc.getState() === 'cine', 600000) : null;
  await p.waitForTimeout(2500);
  const R = await p.evaluate(() => { const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
    const o = document.getElementById('objective'), q = E.kitDebug().event;
    let s = null; try { s = JSON.parse(localStorage.getItem('mz.encounters.checkpoint')); } catch { /* */ }
    return { ch: E.chapterKey ? E.chapterKey() : null, state: E.getState(), phase: i.phase || null, kitPhase: E.kit.getPhase(),
             obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
             brief: !!q && q.kind === 'guard' && !!q.briefing, held: E.loseHold ? E.loseHold() : null,
             why: (E.voices() || []).filter(v => /^ph4k/.test(v.name)).map(v => v.name), saved: s ? { ch: s.ch, phase: s.phase, at: s.at } : null }; });
  results[name] = { title, pressed, first, film, ...R, trance };
  log(name, JSON.stringify(results[name]));
  try { await p.screenshot({ path: `${OUT}/${name}.png`, timeout: 240000 }); } catch { /* a slow frame */ }
  const w = C.want;
  let ok = pressed && inPlay && R.held === null && errs.length === 0;
  if (w.ch) ok = ok && R.saved && R.saved.ch === w.ch;
  else {
    ok = ok && R.phase === w.phase && (w.film === undefined || film === w.film);
    if (w.obj) ok = ok && w.obj.test(R.obj || '');
    if (w.why) ok = ok && R.why.length === 4 && R.why.join(',') === 'ph4k1,ph4k2,ph4k3,ph4k4';
    if (w.brief) ok = ok && R.brief && R.why.length === 0;
    if (w.phase === 'history') ok = ok && R.ch === 'e4c4' && !R.brief && R.why.length === 0 && (!R.saved || !R.saved.phase || /^history/.test(R.saved.phase));
    if (w.trance) ok = ok && trance === true;
  }
  checks[name] = ok;
  if (errs.length) log(name, 'ERRORS', errs.join(' | '));
  await ctx.close();
}
log('CHECKS', JSON.stringify(checks));
await b.close();
process.exit(Object.values(checks).every(v => v === true) ? 0 : 1);
