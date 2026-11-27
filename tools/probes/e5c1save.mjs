/* v29.0 (E5C1 PLAY, CP6.5): EPISODE 5 CHAPTER 1'S SAVES, BY THE REAL ENTRY PATH (?ch= reads and writes no save: v18.4). On
   a phone page (390 x 844 at 2, a touch context): a save of the game's own making given each phase in turn ('room:w,l',
   'room:w,l,p,g,h,k', 'breaking:', 'night:', 'night:u,f', 'ask:'), the page reloaded and Continue TAPPED on the title; what
   each lands on is read (the phase and its receipts, where he is and how he holds himself, the order up, the event's brief,
   the decision) and photographed. Then a SAME-SITTING Continue (the menu, Back to the title screen, Continue, all tapped)
   from the night with the pressure up: it must land where a reload's does. Then a REPLAY (stage.reset, what a same-chapter
   replay runs: v8.1) from the night: the play's state read against a fresh start's, key by key.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [CHFILE=<e5c1.js>] node tools/probes/e5c1save.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e5c1save'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], res = {};
if (process.env.CHFILE) { const CHSRC = fs.readFileSync(process.env.CHFILE, 'utf8');
  await p.route(new RegExp('/assets/e5c1\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|no line|has no take/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const ok = (k, v, d) => { res[k] = { ok: !!v, d }; say(v ? 'ok  ' : 'FAIL', k, d === undefined ? '' : JSON.stringify(d).slice(0, 300)); };
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const boot = async () => { await p.goto(PAGE, { waitUntil: 'load', timeout: 300000 }); await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 }); await frames(3); };
const tapEl = async (id) => { await p.waitForFunction((id) => { const e = document.getElementById(id), r = e && e.getBoundingClientRect(); return !!r && r.width > 0; }, id, { timeout: 300000, polling: 300 });
  const r = await p.evaluate((id) => { const e = document.getElementById(id); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, id); await p.touchscreen.tap(r.x, r.y); };
const landed = async () => {
  await p.waitForFunction(() => ['play', 'decide'].includes(window.__enc.getState()) || (window.__enc.kit && window.__enc.kit.eventActive && window.__enc.kit.eventActive()), null, { timeout: 1500000, polling: 300 });
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
  await sleep(2500); await frames(6);
};
const read = () => p.evaluate(() => { const E = window.__enc, S = E.stage, i = S.info();
  return { state: E.getState(), phase: i.story.phase, found: i.story.found.join(','), saved: E.kit.getPhase(), at: [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z].map(v => +v.toFixed(2)),
           pose: E.kit.getPose(), ev: !!E.kit.eventActive(), obj: ((document.querySelector('#objective .obox') || {}).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70),
           vis: (E.kit.vision() || {}).on, chant: i.story.chant, p: i.story.pressure,
           takes: Object.fromEntries(Object.entries(S.dbg.cast).map(([k, P]) => [k, P.hidden ? '-' : P.cur])) }; });
async function continueFrom(save) {
  await p.evaluate((s) => localStorage.setItem('mz.encounters.checkpoint', JSON.stringify(s)), save);
  await boot(); await tapEl('startBtn'); await landed();
}
/* a first game, so the title has a save of the game's own making to change */
await boot(); await p.evaluate(() => window.__enc.clearCheckpoint()); await boot();
await tapEl('startBtn'); await toPlay(p, 1500000); await frames(6);
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const base = await p.evaluate(() => window.__enc.loadCheckpoint());
say('base save', JSON.stringify(base).slice(0, 200));
const CASES = [
  ['room:w,l', (r) => r.phase === 'room' && r.found === 'w,l' && r.pose === 'lying' && Math.abs(r.at[1] - 1.12) < 0.05 && /Watch Grace/.test(r.obj) && r.takes.grace === 'gsofa' && r.takes.marcus === 'Sitting_Answering_Questions'],
  ['room:w,l,p,g,h,k', (r) => r.phase === 'room' && r.found === 'w,l,p,g,h,k' && /Spirit Vision/.test(r.obj)],
  ['breaking:', (r) => r.phase === 'breaking' && r.ev && r.vis && r.chant.on && r.takes.grace === 'gsofa' && r.takes.marcus === 'Idle_3'],
  ['night:', (r) => r.phase === 'night' && r.found === '' && r.pose === 'lying' && r.at[0] > 306 && /Get up/.test(r.obj)],
  ['night:u,f', (r) => r.phase === 'night' && r.found === 'u,f' && r.pose === 'standing' && /phone/.test(r.obj)],
  ['ask:', (r) => r.phase === 'ask' && r.state === 'decide']
];
let n = 0;
for (const [ph, want] of CASES) {
  const s = JSON.parse(JSON.stringify(base)); s.ch = 'e5c1'; s.phase = ph; s.at = { x: 1.45, y: 1.12, z: 1.9, ry: 0.41 };
  await continueFrom(s); const r = await read();
  ok('continue ' + ph, want(r), r);
  await p.screenshot({ path: `${OUT}/${++n}-continue-${ph.replace(/[:,]/g, '_')}.png`, timeout: 300000 });
}
/* a same-sitting Continue from the night, the pressure up: the menu, the title, Continue, all tapped */
{ const s = JSON.parse(JSON.stringify(base)); s.ch = 'e5c1'; s.phase = 'night:u'; s.at = { x: 306.7, y: 1.62, z: -0.48, ry: 2.17 };
  await continueFrom(s); await sleep(9000); const before = await read();
  await tapEl('menuBtn'); await sleep(800); await tapEl('menuTitle'); await sleep(1500); await tapEl('startBtn'); await landed();
  const r = await read();
  ok('same-sitting continue: lands at the night\'s start, as a reload does', r.phase === 'night' && r.found === 'u' && r.pose === 'standing' && Math.hypot(r.at[0] - 306.7, r.at[2] + 0.48) < 0.1, { before, r });
  await p.screenshot({ path: `${OUT}/${++n}-samesitting.png`, timeout: 300000 }); }
/* a replay: reset from the night, then the room again, read against a fresh start */
{ const fresh = await p.evaluate(() => { const E = window.__enc; E.kit.setPhase(null); E.stage.reset(); return null; });
  await frames(10); await sleep(1500);
  const A = await p.evaluate(() => { const E = window.__enc, S = E.stage; return { story: S.info().story, press: E.kit.pressState(), pulse: E.kit.getPulse(), lens: null, beds: Object.fromEntries(S.beds ? Object.entries(S.beds.mix).map(([k, v]) => [k, +v.toFixed(2)]) : []) }; });
  ok('replay: the play\'s state back to a fresh start', A.story.found.length === 0 && A.story.pressure === 0 && !A.story.chant.on && A.story.brk.spills === 0 && A.story.grace.ups === 0 && A.story.night.waves === 0 && A.press.k === 0 && !A.pulse, A); }
/* a REAL replay (v8.2, v7.3: every way into a chapter): from the night with the pressure up, the menu, Select a chapter,
   this chapter, Play it, all tapped; the opening (skipped as a player may) and the room read key by key against what a fresh
   start of the room is: nothing found, no pressure, no chant, no event, nothing in his hands, the three seated at rest */
{ const s = JSON.parse(JSON.stringify(base)); s.ch = 'e5c1'; s.phase = 'night:u'; s.at = { x: 306.7, y: 1.62, z: -0.48, ry: 2.17 };
  await p.evaluate(() => localStorage.setItem('mz.encounters.progress', JSON.stringify({ reached: 'e5c1' })));
  await continueFrom(s); await sleep(9000);
  await tapEl('menuBtn'); await sleep(800); await tapEl('menuChapters'); await sleep(1500);
  const tile = await p.evaluate(() => { const e = document.querySelector('#chList .chTile[data-ch="e5c1"]'); if (!e) return null; e.scrollIntoView({ block: 'center', inline: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (tile) { await p.touchscreen.tap(tile.x, tile.y); await sleep(900); await tapEl('chYes'); }
  await toPlay(p, 1500000); await landed(); await sleep(3000);
  const R = await p.evaluate(() => { const E = window.__enc, S = E.stage, i = S.info(), c = S.dbg.cast;
    return { state: E.getState(), story: i.story, saved: E.kit.getPhase(), pose: E.kit.getPose(), press: E.kit.pressState().k, pulse: !!E.kit.getPulse(), vis: (E.kit.vision() || {}).on,
             ev: !!E.kit.eventActive(), at: [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z].map(v => +v.toFixed(2)),
             takes: { pho: c.pho.cur, grace: c.grace.cur, marcus: c.marcus.cur }, hidden: { grace: c.grace.hidden, marcus: c.marcus.hidden },
             beds: Object.fromEntries(Object.entries(S.beds.mix).map(([k, v]) => [k, +v.toFixed(2)])) }; });
  const fresh = R.story.phase === 'room' && R.story.found.length === 0 && R.story.pressure === 0 && !R.story.chant.on && !R.story.chant.done && R.story.brk.spills === 0 && R.story.brk.shares.length === 0
    && R.story.grace.ups === 0 && !R.story.grace.up && R.story.night.waves === 0 && !R.story.night.tip && R.press === 0 && !R.pulse && !R.vis && !R.ev && R.pose === 'lying'
    && Math.hypot(R.at[0] - 1.45, R.at[2] - 1.9) < 0.05 && R.takes.grace === 'gsofa' && R.takes.marcus === 'Sitting_Answering_Questions' && !R.hidden.grace && R.beds.three === 0 && R.beds.m6a === 0;
  ok('replay by the selector: the room as a fresh start', !!tile && fresh, R);
  await p.screenshot({ path: `${OUT}/${++n}-replay-selector.png`, timeout: 300000 }); }
fs.writeFileSync(OUT + '/save.json', JSON.stringify({ res, errs }, null, 1));
for (const e of errs.slice(0, 12)) say(e);
const bad = Object.values(res).filter(r => !r.ok).length;
say('failures', bad, 'errors', errs.length);
await b.close(); process.exit(bad || errs.length ? 1 : 0);
