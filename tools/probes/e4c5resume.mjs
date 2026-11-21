/* v28.0 (E4C5, M7): A CONTINUE AT EVERY PHASE AND MARK of the play, through the title's own button. For each phase string
   (the save's only receipt, v7.3) a save is written as the game writes one (the game's own record, its chapter and phase
   set), the page is RELOADED, Continue pressed (a real tap on a phone), and what play lands on is read: the phase, what
   is found, the order on the screen, SMELL's button, where he stands and how high his eye is, who is shown, the eye; and
   a picture of each. Then the same phase string Continued a second time, from the save the first one wrote (a Continue
   that loses a receipt loses it here).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [MARKS=walk:t,hunt:s1] node tools/probes/e4c5resume.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5resume';
fs.mkdirSync(OUT, { recursive: true });
const MARKS = (process.env.MARKS || 'walk:,walk:t,walk:t;j;e;d,hunt:,hunt:s1;a,hunt:s2;s3;n,table:,table:m;k2,ask:').split(',').map(s => s.replace(/;/g, ','));
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|no line/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), logf = fs.createWriteStream(OUT + '/log.txt');
const log = (...a) => { const s = ((Date.now() - T0) / 1000).toFixed(0) + 's ' + a.join(' '); console.log(s); logf.write(s + '\n'); };
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const boot = async () => { await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 }); await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 }); await frames(3); };
/* a first game, so the title has a save of the game's own making to change */
await boot();
await p.evaluate(() => window.__enc.clearCheckpoint());
await boot();
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await frames(6);
await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
const base = await p.evaluate(() => window.__enc.loadCheckpoint());
log('base save', JSON.stringify(base).slice(0, 200));
const read = () => p.evaluate(() => { const E = window.__enc, S = E.stage, sn = S.snap().story, k = E.kitDebug ? E.kitDebug() : {};
  const shown = {}; for (const n of ['pho', 'phoS', 'ton', 'jun', 'koh', 'col']) { const P = S.plan && S.plan.FLOOR && S.plan.FLOOR.cast[n]; shown[n] = P && P.group ? (P.group.visible ? 1 : 0) : '-'; }
  return { ch: E.chapterKey ? E.chapterKey() : '', state: E.getState(), phase: sn.phase, found: sn.found.join(','), saved: k.phase, pose: k.pose, eye: k.eyeY, rooted: k.rooted,
           at: [+E.yaw.position.x.toFixed(2), +E.yaw.position.z.toFixed(2), +E.yaw.rotation.y.toFixed(2)],
           obj: ((document.querySelector('#objective, #obj, .objective') || {}).textContent || '').replace(/\s+/g, ' ').trim(),
           smellBtn: !!document.querySelector('.cBtn'), vis: E.kit && E.kit.vision ? JSON.stringify(E.kit.vision()) : '', shown, decide: E.getState() === 'decide' }; });
async function continueFrom(save) {
  await p.evaluate((s) => localStorage.setItem('mz.encounters.checkpoint', JSON.stringify(s)), save);
  await boot();
  const r = await p.evaluate(() => { const e = document.getElementById('startBtn'); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, t: e.textContent.trim() }; });
  await p.touchscreen.tap(r.x, r.y);
  await p.waitForFunction(() => ['play', 'decide'].includes(window.__enc.getState()), null, { timeout: 1500000, polling: 300 });
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
  await frames(10);
  return r.t;
}
let n = 0;
for (const mark of MARKS) {
  const ph = mark.split(':')[0];
  const save = JSON.parse(JSON.stringify(base));
  save.ch = 'e4c5'; save.phase = mark;
  /* (a save with no `at` is one written at a chapter's boundary: resumeRun lands it at the opening. A save of play
     carries where he stood; the chapter puts him at his phase's start itself) */
  const AT = { walk: [0, 0.25, 0], hunt: [-7.9, -5.05, Math.PI + 0.2], fight: [-8.5, -10.6, Math.PI], table: [0, 239.2, Math.PI], ask: [0, 239.2, Math.PI] }[ph];
  save.at = { x: AT[0], y: 1.62, z: AT[1], ry: AT[2] };
  const btn = await continueFrom(save);
  const r1 = await read();
  log('MARK', mark, 'button', JSON.stringify(btn), JSON.stringify(r1));
  try { await p.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}-${mark.replace(/[:,]/g, '_')}.png`, timeout: 240000 }); } catch { log('  (no picture)'); }
  /* the same again, from the save this Continue made */
  await p.evaluate(() => window.__enc.saveCheckpoint && window.__enc.saveCheckpoint());
  const again = await p.evaluate(() => window.__enc.loadCheckpoint());
  if (!again || again.ch !== 'e4c5') { log('  SECOND: no e4c5 save', JSON.stringify(again).slice(0, 160)); continue; }
  await continueFrom(again);
  const r2 = await read();
  const same = r2.phase === r1.phase && r2.found === r1.found && Math.hypot(r2.at[0] - r1.at[0], r2.at[1] - r1.at[1]) < 0.3;
  log('  AGAIN', same ? 'same' : 'DIFFERS', JSON.stringify(r2));
}
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close(); process.exit(errs.length ? 1 : 0);
