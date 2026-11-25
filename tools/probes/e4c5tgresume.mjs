/* v28.0 (E4C5, R153): A CONTINUE AT THE TOGETHER BUTTON, by the real entry path (a save of the game's own making, the page
   reloaded, Continue tapped, on a phone: ?ch= reads and writes no save, v18.4). Chad, 25 Nov 2026: "If i refresh the browser
   right after the naga cutscene has completed and proceeded to the bag the remaining prais, and i press 'continue' game from
   the title screen, i want it to continue from the part where the 'together' button shows up on the screen."
     1. THE BOOKMARK TAKEN: a Continue into the fight ('fight:'), START tapped, the fight brought to the edge of its surge
        (lab.toEdge: six in the bag, the fight stage); the rules' own surge then marks the phase 'fight:tg' and the mode's
        hold is taken again (the held run says 'fight:tg'); TOGETHER tapped; the Naga's film begins, and saves first: the
        save on disk says 'fight:tg';
     2. A REFRESH IN THE BAGGING: the film over and the last stage up, the page reloaded and Continue tapped: the court, no
        brief, the surge (six in the bag, three left), "Press TOGETHER for the final attack.", the TOGETHER button shown and
        live, Grandmaster Pho played; a picture of it;
     3. ON FROM THERE: TOGETHER tapped, the Naga's film, the last three bagged, the table: the fight over and the save a
        plain one again.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] node tools/probes/e4c5tgresume.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5tgresume';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], res = {};
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|no line|has no take/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const ok = (k, v, d) => { res[k] = { ok: !!v, d }; say(v ? 'ok  ' : 'FAIL', k, d === undefined ? '' : JSON.stringify(d).slice(0, 300)); };
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const boot = async () => { await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 }); await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 }); await frames(3); };
const wait = (fn, arg, secs = 600) => p.waitForFunction(fn, arg, { timeout: secs * 1000, polling: 400 });
const F = () => p.evaluate(() => window.__enc.stage.snap().story.fight);
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
const tapAt = async (sel) => { const r = await p.evaluate((sel) => { const e = sel.startsWith('#') || sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel); if (!e) return null;
  const b = e.getBoundingClientRect(); return b.width > 2 ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; }, sel); if (r) await p.touchscreen.tap(r.x, r.y); return !!r; };
const objText = () => p.evaluate(() => ((document.querySelector('#objective .obox') || document.querySelector('#objective') || {}).textContent || '').replace(/\s+/g, ' ').trim());
const callShown = () => p.evaluate(() => { const e = document.querySelector('.tagBtn.call'); return !!e && e.getBoundingClientRect().width > 10 && getComputedStyle(e).display !== 'none'; });
const saved = () => p.evaluate(() => { const s = window.__enc.loadCheckpoint(); return s ? { ch: s.ch, phase: s.phase } : null; });
async function continueFrom(save) {
  if (save) await p.evaluate((s) => localStorage.setItem('mz.encounters.checkpoint', JSON.stringify(s)), save);
  await boot();
  await tapAt('startBtn');
  await wait(() => ['play', 'decide'].includes(window.__enc.getState()), null, 1500);
  await wait(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, 900);
}
async function togetherAndFilm(tag) {
  await wait(() => { const e = document.querySelector('.tagBtn.call'); return !!e && e.getBoundingClientRect().width > 10 && getComputedStyle(e).display !== 'none' && !e.classList.contains('locked'); }, null, 300);
  await sleep(600);
  ok(tag + ': TOGETHER tapped', await tapAt('.tagBtn.call'));
  await wait(() => !!(window.__enc.kit.filmPlaying && window.__enc.kit.filmPlaying()), null, 600);
  say(tag + ': the Naga film playing');
}
/* ---- a first game, so the title has a save of the game's own making to change */
await boot();
await p.evaluate(() => window.__enc.clearCheckpoint());
await boot();
await tapAt('startBtn');
await toPlay(p, 1500000);
await frames(6);
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const base = await p.evaluate(() => window.__enc.loadCheckpoint());
/* 1 · the bookmark taken at the surge */
const s1 = JSON.parse(JSON.stringify(base)); s1.ch = 'e4c5'; s1.phase = 'fight:'; s1.at = { x: -8.5, y: 1.6, z: -10.6, ry: Math.PI }; s1.stats.sanity = 83;
await continueFrom(s1);
await wait(() => { const E = window.__enc; try { return E.kit.eventActive() && E.kit.tagState().on && E.stage.snap().story.fight.stage === 'brief'; } catch { return false; } }, null, 600);
await sleep(900);
await wait(() => { const e = document.getElementById('evBtn'), r = e && e.getBoundingClientRect(); return !!r && r.width > 0 && e.textContent.trim().length > 0; }, null, 180);
await tapAt('evBtn');
await wait(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'learn'; }, null, 90);
ok('1: before the surge the phase is the fight\'s start', (await p.evaluate(() => window.__enc.stage.snap().story.phase)) === 'fight' && !(await p.evaluate(() => window.__enc.stage.snap().story.found.includes('tg'))));
ok('1: the fight brought to the edge of its surge', await lab('toEdge'));
await wait(() => window.__enc.stage.snap().story.fight.stage === 'surge', null, 120);
const held = await p.evaluate(() => { const E = window.__enc, h = E.tagSave0 ? E.tagSave0() : null; return { found: E.stage.snap().story.found, held: h ? h.st.phase : null, at: h ? h.at : null }; });
ok('1: the surge marks the phase (tg) and the mode holds it', held.found.includes('tg') && held.held === 'fight:tg', held);
await togetherAndFilm('1');
const s1film = await saved();
ok('1: the save written as the Naga film begins says fight:tg', s1film && s1film.ch === 'e4c5' && s1film.phase === 'fight:tg', s1film);
await wait(() => { const E = window.__enc, f = E.stage.snap().story.fight; return f && f.stage === 'last' && E.getState() === 'play' && !(E.kit.filmPlaying && E.kit.filmPlaying()); }, null, 1500);
await sleep(2500);
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());   // (what the 8 s autosave writes in the bagging)
const s1last = await saved();
ok('1: in the bagging the save still says fight:tg', s1last && s1last.phase === 'fight:tg', s1last);
await p.screenshot({ path: OUT + '/1-bagging-before-refresh.png', timeout: 300000 });
/* 2 · the refresh in the bagging, and Continue */
await continueFrom(null);
await sleep(1500); await frames(6);
const f2 = await F(), st2 = await p.evaluate(() => { const E = window.__enc; return { phase: E.stage.snap().story.phase, found: E.stage.snap().story.found, ev: E.kit.eventActive(), tag: E.kit.tagState() }; });
ok('2: landed in the fight, its bookmark found', st2.phase === 'fight' && st2.found.includes('tg'), { phase: st2.phase, found: st2.found });
ok('2: no brief', !st2.ev, st2.ev);
ok('2: the surge, six in the bag and three left', f2.stage === 'surge' && f2.left === 3 && f2.prai.filter(q => q.st === 'gathered').length === 6 && f2.prai.filter(q => q.st === 'shape').length === 3, { stage: f2.stage, left: f2.left, prai: f2.prai.map(q => q.st).join(',') });
ok('2: the mode on and live, Grandmaster Pho played', st2.tag.on && st2.tag.live && st2.tag.played === 'pho', { on: st2.tag.on, live: st2.tag.live, played: st2.tag.played });
await wait(() => { const e = document.querySelector('.tagBtn.call'); return !!e && e.getBoundingClientRect().width > 10 && getComputedStyle(e).display !== 'none'; }, null, 120);
const obj = await objText();
ok('2: the order is TOGETHER\'s', /TOGETHER/.test(obj), obj);
ok('2: the TOGETHER button shown', await callShown());
await sleep(1200); await frames(4);
await p.screenshot({ path: OUT + '/2-continued-at-together.png', timeout: 300000 });
/* 3 · on from there */
await togetherAndFilm('3');
await wait(() => { const E = window.__enc, f = E.stage.snap().story.fight; return f && f.stage === 'last' && E.getState() === 'play' && !(E.kit.filmPlaying && E.kit.filmPlaying()); }, null, 1500);
let bagged = false;
for (let i = 0; i < 40 && !bagged; i++) {
  const sel = await p.evaluate(() => { const e = [...document.querySelectorAll('.tagBtn')].find(e => /BAG/.test(e.textContent || '') && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 4 && !e.classList.contains('locked'));
    return e ? (e.id ? '#' + e.id : null) : null; });
  if (sel) bagged = await tapAt(sel); else await sleep(1500);
}
ok('3: BAG tapped in the last stage', bagged);
await wait(() => { const E = window.__enc; return E.stage.snap().story.phase === 'table' && E.getState() === 'play'; }, null, 2400);
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const s3 = await saved();
ok('3: the fight over, at the table, the save a plain one', s3 && /^table/.test(s3.phase || ''), s3);
ok('no page errors', errs.length === 0, errs.slice(0, 6));
fs.writeFileSync(OUT + '/result.json', JSON.stringify({ res, errs }, null, 1));
const bad = Object.entries(res).filter(([, v]) => !v.ok).map(([k]) => k);
say(bad.length ? 'FAILED: ' + bad.join(' | ') : 'ALL PASSED');
await b.close();
process.exit(bad.length ? 1 : 0);
