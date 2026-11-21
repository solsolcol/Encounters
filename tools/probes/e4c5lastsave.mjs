/* v28.0 (E4C5, R25, the lead's check of 21 Nov): THE FIGHT'S LAST STAGE BEGUN AGAIN AND CONTINUED, now that the rules no longer
   put the two back at the fight's first places when the Naga's film ends (they stay where it left them, off the walls). By
   the real entry path (?ch= reads and writes no save: v18.4), on a phone page (390 x 844 at 2, a touch context):
     1. into the fight by a Continue (a save of the game's own making given the phase 'fight:'), START tapped on the brief;
     2. the rules set in the last stage (lab.toLast: five gathered, three laid where the Naga lays them), Grandmaster Pho put
        0.3 m off a side wall and his student 0.5 m off the far one (lab.place), and the frames read: both eased in until
        1.1 m off every wall, never more than the rules' pace a frame (no snap), the drawn bodies where the rules have them;
     3. the game's own save made there: it is the run as the fight opened (the phase 'fight:', the first-person place);
     4. a loss there (his sanity taken under the rules' line), the card's BEGIN AGAIN tapped: the two at the fight's first
        places, the drawn bodies with them, the rules begun again;
     5. a Continue from the save of 3: the brief, the two at the fight's first places.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [OUT=dir] node tools/probes/e4c5lastsave.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5lastsave';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], res = {};
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|has no take/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const ok = (k, v, d) => { res[k] = { ok: !!v, d }; say(v ? 'ok  ' : 'FAIL', k, d === undefined ? '' : JSON.stringify(d).slice(0, 400)); };
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const boot = async () => { await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 }); await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 }); await frames(3); };
const W = (l) => ({ x: -8.5 - l.x, z: -8.7 - l.z });                      // (the court's frame: c_cast.js courtWorld)
const F = () => p.evaluate(() => window.__enc.stage.snap().story.fight);
const TS = () => p.evaluate(() => window.__enc.kit.tagState());
const LAB = (f, ...a) => p.evaluate(([f, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[f] ? L[f](...a) : 'no ' + f; }, [f, a]);
const tapAt = async (r, what) => { if (!r) throw new Error('nothing to tap: ' + what); await p.touchscreen.tap(r.x, r.y); say('tap', what); };
const rectOf = (id) => p.evaluate((id) => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return b.width > 0 ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; }, id);
const briefUp = () => p.waitForFunction(() => { const E = window.__enc; try { return E.kit.eventActive() && E.kit.tagState().on && E.stage.snap().story.fight.stage === 'brief'; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
async function continueFrom(save) {
  await p.evaluate((s) => localStorage.setItem('mz.encounters.checkpoint', JSON.stringify(s)), save);
  await boot();
  await tapAt(await rectOf('startBtn'), 'Continue');
  await p.waitForFunction(() => ['play', 'decide'].includes(window.__enc.getState()), null, { timeout: 1500000, polling: 300 });
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
}
/* where the drawn bodies stand against the rules' places, and how far each is off the nearer court wall */
const bodies = async () => { const f = await F(), ts = await TS(); const pb = ts.bodies.find(q => q.id === 'pho'), zb = ts.bodies.find(q => q.id === 'zavier');
  const gap = (l) => Math.min(1.95 - Math.abs(l.x), l.z + 3.0, 3.0 - l.z), pw = W(f.pho), zw = W(f.zav);
  return { stage: f.stage, pho: f.pho, zav: f.zav, gapPho: +gap(f.pho).toFixed(3), gapZav: +gap(f.zav).toFixed(3),
           drawnOff: +Math.max(Math.hypot(pb.x - pw.x, pb.z - pw.z), Math.hypot(zb.x - zw.x, zb.z - zw.z)).toFixed(3), live: ts.live, played: ts.played }; };
/* ---- a first game, then a Continue into the fight */
await boot(); await p.evaluate(() => window.__enc.clearCheckpoint()); await boot();
await tapAt(await rectOf('startBtn'), 'New game');
await toPlay(p, 1500000); await frames(6);
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const base = await p.evaluate(() => window.__enc.loadCheckpoint());
const s1 = JSON.parse(JSON.stringify(base)); s1.ch = 'e4c5'; s1.phase = 'fight:'; s1.at = { x: -8.5, y: 1.6, z: -10.6, ry: Math.PI }; s1.stats.sanity = 83;
await continueFrom(s1);
await briefUp(); await sleep(1500);
const first = await bodies();
ok('1 the brief: the two at the fight\'s first places', Math.hypot(first.pho.x - 1.15, first.pho.z - 2.0) < 0.02 && Math.hypot(first.zav.x, first.zav.z - 0.7) < 0.02 && first.drawnOff < 0.03, first);
for (let i = 0; i < 40; i++) { const r = await rectOf('evBtn'); if (r) { await tapAt(r, 'START'); } await sleep(700); if ((await TS()).live) break; }
await p.waitForFunction(() => window.__enc.kit.tagState().live && !window.__enc.kit.eventActive(), null, { timeout: 300000, polling: 300 });
/* 2 · the last stage, the two put near the walls, the frames read */
say('toLast', await LAB('toLast'));
say('place', await LAB('place', 'pho', 1.65, 1.2), await LAB('place', 'zav', -0.3, -2.5));
const rows = []; let prev = null, worst = 0;
for (let i = 0; i < 90; i++) { await frames(1); const r = await bodies(); r.t = (await F()).t; rows.push(r);
  if (prev) { const dt = Math.max(1e-3, r.t - prev.t), step = Math.max(Math.hypot(r.pho.x - prev.pho.x, r.pho.z - prev.pho.z), Math.hypot(r.zav.x - prev.zav.x, r.zav.z - prev.zav.z));
    worst = Math.max(worst, step / dt); }
  prev = r; if (r.gapPho >= 1.099 && r.gapZav >= 1.099 && i > 8) break; }
const last = rows[rows.length - 1];
ok('2 the last stage: both eased off the walls to 1.1 m', last.stage === 'last' && last.gapPho >= 1.099 && last.gapZav >= 1.099, { from: rows[0], to: last, frames: rows.length });
ok('2 never a snap: no faster than the rules\' 0.6 m a second', worst <= 0.6 * 1.05 + 0.05, { fastest: +worst.toFixed(3) });
ok('2 the drawn bodies where the rules have them', rows.every(r => r.drawnOff < 0.05), { worst: Math.max(...rows.map(r => r.drawnOff)) });
await p.screenshot({ path: OUT + '/2-last-stage.png', timeout: 300000 });
/* 3 · the save made in the last stage */
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const held = await p.evaluate(() => window.__enc.loadCheckpoint());
ok('3 the save made there is the run as the fight opened', held && held.phase === 'fight:' && held.at && Math.hypot(held.at.x + 8.5, held.at.z + 10.6) < 0.1, held && { phase: held.phase, at: held.at, sanity: held.stats && held.stats.sanity });
/* 4 · a loss there, BEGIN AGAIN */
await p.evaluate(() => { const E = window.__enc, s = E.kit.stat('sanity'); E.kit.award('sanity', 5 - s); });
await p.waitForFunction(() => window.__enc.getState() === 'retry', null, { timeout: 300000, polling: 300 });
await sleep(1200);
const lostAt = await bodies();
await tapAt(await rectOf('rtAgain'), 'BEGIN AGAIN');
await p.waitForFunction(() => window.__enc.getState() === 'play' && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 300 });
await sleep(1500); await frames(6);
const again = await bodies();
ok('4 BEGIN AGAIN after a loss in the last stage: the two at the fight\'s first places', Math.hypot(again.pho.x - 1.15, again.pho.z - 2.0) < 0.02 && Math.hypot(again.zav.x, again.zav.z - 0.7) < 0.02, { lostAt, again });
ok('4 and the drawn bodies with them', again.drawnOff < 0.03, again);
ok('4 the rules begun again', ['fight', 'brief'].includes(again.stage), again.stage);
await p.screenshot({ path: OUT + '/4-begun-again.png', timeout: 300000 });
/* 5 · a Continue from the save of 3 */
await continueFrom(held);
await briefUp(); await sleep(1500); await frames(4);
const cont = await bodies();
ok('5 a Continue from the save made in the last stage: the brief, the two at the fight\'s first places', cont.stage === 'brief' && Math.hypot(cont.pho.x - 1.15, cont.pho.z - 2.0) < 0.02 && Math.hypot(cont.zav.x, cont.zav.z - 0.7) < 0.02 && cont.drawnOff < 0.03, cont);
await p.screenshot({ path: OUT + '/5-continued.png', timeout: 300000 });
fs.writeFileSync(OUT + '/lastsave.json', JSON.stringify({ res, errs, rows }, null, 1));
for (const e of errs.slice(0, 12)) say(e);
const bad = Object.values(res).filter(r => !r.ok).length;
say('failures', bad, 'errors', errs.length);
await b.close();
process.exit(bad || errs.length ? 1 : 0);
