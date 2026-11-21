/* v28.0 (E4C5, M8): THE CLEANSING'S LOOK, each of its moments photographed full size from the fight's own camera on a phone
   (390 x 844 CSS at 2 px/pt, a touch context): the court as the brief leaves it (the nine standing, the cage, the trance),
   then each moment set out by the fight's own effects through its lab (c_fightstage.js FS_LAB: begun as its event begins
   it, run on its own frame to the moment, held): the ruby fireball in flight, its burst where it lands, a tired one's
   ruby in its bubble, the violet bind and its bubble, the gold gathering into his shoulders, the golden wheel going out,
   the streak to the bag. One picture each, full size (OUT/look-<n>-<moment>.png).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [ONLY=labBall,labWheel] node tools/probes/e4c5look.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5look';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.open());
await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
await frames(3);
let n = 0;
const shot = async (name) => { const f = `${OUT}/look-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); };
await shot('court');
const ALL = [['labBall', 0.32], ['labLand', 0.12], ['labTired', 0.15], ['labBind', 0.5], ['labGather', 0.7], ['labWheel', 0.35], ['labStreak', 0.45]];
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
for (const [m, secs] of ALL) {
  if (ONLY.length && !ONLY.includes(m)) continue;
  const ok = await p.evaluate(([m, secs]) => window.__enc.stage.snap().story.fight.lab.moment(m, secs), [m, secs]);
  if (!ok) { say('no moment', m); continue; }
  await frames(3); await shot(m);
}
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.clear());
for (const e of errs.slice(0, 10)) say(e);
say('errors', errs.length);
await b.close();
