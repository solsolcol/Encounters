/* v28.0 (E4C5, M8): THE CLEANSING'S SAVE, CONTINUE AND REPLAY (the plan's 5.11; docs/V28.0-SEAMS.md 1.6), by the real
   entry path (?ch= reads and writes no save: v18.4). On a phone page (390 x 844 at 2, a touch context):
     1. A CONTINUE INTO THE FIGHT: a save of the game's own making given the phase 'fight:' (the play helper's technique,
        tools/probes/e4c5resume.mjs), the page reloaded, Continue tapped: it lands at the fight's BRIEF with the mode on
        behind it, the rules new, the two at the fight's places, his sanity as saved;
     2. THE HELD SAVE: START tapped, the fight played a few seconds (FIRE when it asks), the game's own save made
        (saveCheckpoint): it is the run as it stood at START (the phase 'fight:', his sanity then, the first-person place a
        Continue lands at), never the fight as it stands;
     3. A CONTINUE FROM THAT SAVE (reloaded, tapped): the brief again, nothing of the last fight in it;
     4. A REPLAY's reset (stage.reset, what a same-chapter replay runs; v8.1) with the fight under way: nothing of the
        fight left (the mode, its effects, its loops, the nine), and the fight set out again reads as the first did.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] node tools/probes/e4c5save.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5save';
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
const W = (l) => ({ x: -8.5 - l.x, z: -8.7 - l.z });                      // (the court's frame: c_cast.js courtWorld)
const F = () => p.evaluate(() => window.__enc.stage.snap().story.fight);
const TS = () => p.evaluate(() => window.__enc.kit.tagState());
const briefUp = async () => { try { await p.waitForFunction(() => { const E = window.__enc; try { return E.kit.eventActive() && E.kit.tagState().on && E.stage.snap().story.fight.stage === 'brief'; } catch { return false; } }, null, { timeout: 300000, polling: 250 }); }
  catch (e) { const d = await p.evaluate(() => { const E = window.__enc; let f = null; try { f = E.stage.snap().story.fight; } catch (x) { } return { state: E.getState(), info: E.stage.info(), ev: E.kit.eventActive(), tag: E.kit.tagState(), f }; });
    say('NO BRIEF', JSON.stringify(d).slice(0, 900)); await p.screenshot({ path: OUT + '/no-brief.png', timeout: 300000 }); throw e; } };
const tapEl = async (id) => { const r = await p.evaluate((id) => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, id); if (r) await p.touchscreen.tap(r.x, r.y); return !!r; };
const start = async () => { await sleep(900); await p.waitForFunction(() => { const e = document.getElementById('evBtn'), r = e && e.getBoundingClientRect(); return !!r && r.width > 0 && e.textContent.trim().length > 0; }, null, { timeout: 180000, polling: 300 }); /* (the brief laid out: its first frame builds it) */ await tapEl('evBtn'); await p.waitForFunction(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'learn'; }, null, { timeout: 90000, polling: 200 }); };
async function continueFrom(save) {
  await p.evaluate((s) => localStorage.setItem('mz.encounters.checkpoint', JSON.stringify(s)), save);
  await boot();
  await tapEl('startBtn');
  await p.waitForFunction(() => ['play', 'decide'].includes(window.__enc.getState()), null, { timeout: 1500000, polling: 300 });
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
}
/* what a fresh brief must read */
async function briefRead(tag) {
  await briefUp(); await sleep(1500); await frames(4);
  const f = await F(), ts = await TS(), san = await p.evaluate(() => window.__enc.stats.sanity);
  const pw = W(f.pho), zw = W(f.zav), pb = ts.bodies.find(q => q.id === 'pho'), zb = ts.bodies.find(q => q.id === 'zavier');
  ok(tag + ': the brief, the mode on behind it and not live', f.on && f.stage === 'brief' && ts.on && !ts.live, { stage: f.stage, on: ts.on, live: ts.live });
  ok(tag + ': the rules new', f.t === 0 && f.stats.fires === 0 && f.left === 9 && f.losses === 0, { t: f.t, stats: f.stats, left: f.left });
  ok(tag + ': the two where the rules put them', Math.hypot(pb.x - pw.x, pb.z - pw.z) < 0.03 && Math.hypot(zb.x - zw.x, zb.z - zw.z) < 0.03, { pb, pw, zb, zw });
  ok(tag + ': Grandmaster Pho played', ts.played === 'pho', ts.played);
  ok(tag + ': no effect drawn but the court', f.fx === 0, { fxOn: f.fxOn, fx: f.fx });
  ok(tag + ': the nine standing for the brief', f.praiShown === 9, f.praiShown);
  return { f, ts, san };
}
/* ---- a first game, so the title has a save of the game's own making to change */
await boot();
await p.evaluate(() => window.__enc.clearCheckpoint());
await boot();
await tapEl('startBtn');
await toPlay(p, 1500000);
await frames(6);
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const base = await p.evaluate(() => window.__enc.loadCheckpoint());
say('base save', JSON.stringify(base).slice(0, 160));
/* 1 · a Continue into the fight */
/* (a save with no `at` is one written at a chapter's boundary: resumeRun drops its phase and plays the opening film. A run
   in progress has one; the chapter places him itself for the fight) */
const s1 = JSON.parse(JSON.stringify(base)); s1.ch = 'e4c5'; s1.phase = 'fight:'; s1.at = { x: -8.5, y: 1.6, z: -10.6, ry: Math.PI }; s1.stats.sanity = 83;
await continueFrom(s1);
const A = await briefRead('continue');
ok('continue: his sanity as saved', Math.abs(A.san - 83) < 0.01, A.san);
await p.screenshot({ path: OUT + '/1-continue-brief.png', timeout: 300000 });
/* 2 · the held save */
await start();
const sStart = await p.evaluate(() => window.__enc.stats.sanity);
for (let i = 0; i < 60; i++) { const f = await F(); if (f.need && f.need.act === 'FIRE' && f.need.ready) { await tapEl('tagA0'); break; } await sleep(400); }
await p.waitForFunction(() => window.__enc.stage.snap().story.fight.t > 6, null, { timeout: 300000, polling: 500 });
const f2 = await F();
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const held = await p.evaluate(() => window.__enc.loadCheckpoint());
ok('held: the phase is the fight\'s', held && held.phase === 'fight:', held && held.phase);
ok('held: his sanity as at START', held && Math.abs(held.stats.sanity - sStart) < 0.01, { saved: held && held.stats.sanity, atStart: sStart, now: await p.evaluate(() => window.__enc.stats.sanity) });
ok('held: lands in first person at the fight\'s place', held && held.at && Math.hypot(held.at.x + 8.5, held.at.z + 10.6) < 0.1, held && held.at);
ok('the fight had moved on (so the hold is a hold)', f2.t > 6 && f2.stage === 'learn', { t: f2.t, stats: f2.stats, stage: f2.stage });
await p.screenshot({ path: OUT + '/2-before-save.png', timeout: 300000 });
/* 3 · a Continue from it */
await continueFrom(held);
const B = await briefRead('continue again');
ok('continue again: his sanity as held', Math.abs(B.san - held.stats.sanity) < 0.01, { now: B.san, held: held.stats.sanity });
await p.screenshot({ path: OUT + '/3-continue-again.png', timeout: 300000 });
/* 4 · a replay's reset, the fight under way */
await start(); await p.waitForFunction(() => window.__enc.stage.snap().story.fight.t > 4, null, { timeout: 300000, polling: 500 });
const pre = await F();
await p.evaluate(() => { const E = window.__enc; E.kit.setPhase(null); E.stage.reset(); });   // (a replay: the chapter from its start)
await frames(8); await sleep(800);
const after = await p.evaluate(() => { const E = window.__enc; return { f: E.stage.snap().story.fight, ts: E.kit.tagState(), state: E.getState(), obj: ((document.querySelector('#objective .obox') || {}).textContent || '').trim(), cap: ((document.getElementById('caption') || {}).textContent || '').trim() }; });
ok('replay: was a fight under way', pre.stage === 'learn' && pre.t > 4, { stage: pre.stage, t: pre.t });
ok('replay: the mode left', !after.ts.on, after.ts.on);
ok('replay: the controller back to nothing', !after.f.on && !after.f.stage, after.f);
ok('replay: no effect, no loop', !after.f.fxOn && after.f.fx === 0 && after.f.loops === 0 && !after.f.stems, after.f);
ok('replay: no objective and no caption of the fight', !/Prai|bind|bag|fire/i.test(after.obj + ' ' + after.cap), { obj: after.obj, cap: after.cap });
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
const C = await briefRead('after the replay');
ok('after the replay: reads as the first', JSON.stringify(C.f.hud) === JSON.stringify(A.f.hud) && JSON.stringify(C.f.prai) === JSON.stringify(A.f.prai), { a: A.f.hud, c: C.f.hud });
await p.screenshot({ path: OUT + '/4-after-replay.png', timeout: 300000 });
fs.writeFileSync(OUT + '/save.json', JSON.stringify({ res, errs, held }, null, 1));
for (const e of errs.slice(0, 12)) say(e);
const bad = Object.values(res).filter(r => !r.ok).length;
say('failures', bad, 'errors', errs.length);
await b.close();
process.exit(bad || errs.length ? 1 : 0);
