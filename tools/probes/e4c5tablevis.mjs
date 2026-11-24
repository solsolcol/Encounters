/* v28.0 (E4C5, R109) · THE TABLE IN SPIRIT VISION, the look turned: Chad, 24 Nov 2026: "when i open spirit vision and move
   the camera around, i can see a faint print of pho stuck in the middle of the screen no matter where i move it". The
   chapter booted on a phone (390 x 844 CSS at 2 px a point, a touch context), the table phase set as a Continue lands it,
   the lens on his seat; a picture with the sight shut, then the sight opened (kit.vision) and its wave let home, and a
   picture at each turn of the look (TURNS, radians from the table; PITCH up or down). A print that rides the lens stands
   in the same place in every picture while the room moves under it.
     ENC_DIST=<snapshot> OUT=<dir> [TURNS=0,-0.7,0.7,-1.4] [PITCH=-0.5] node tools/probes/e4c5tablevis.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5tablevis'; fs.mkdirSync(OUT, { recursive: true });
const TURNS = (process.env.TURNS || '0,-0.7,0.7,-1.4').split(',').map(Number), PITCH = +(process.env.PITCH || -0.5);
const SEAT = [0, 239.2, Math.PI, 1.02];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /warn/i.test(m.type()) && /vision|bloom|smear/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('table'));
await p.waitForFunction(() => window.__enc.stage.phase === 'table' && window.__enc.getState() === 'play', null, { timeout: 300000, polling: 500 });
await frames(8);
const look = (turn, pitch) => p.evaluate(([x, z, ry, up, pt]) => { const E = window.__enc; E.yaw.position.set(x, up, z); E.yaw.rotation.y = ry; E.pitch.rotation.x = pt; }, [SEAT[0], SEAT[1], SEAT[2] + turn, SEAT[3], pitch]);
const pic = async (name) => { await frames(5); const f = `${OUT}/${name}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); };
await look(0, PITCH); await frames(6); await look(0, PITCH); await pic('shut-0');
say('vision', JSON.stringify(await p.evaluate(() => window.__enc.kit.vision(true))));
await p.waitForFunction(() => { const v = window.__enc.vision(); return v.on && v.dir === 0; }, null, { timeout: 300000, polling: 300 });
say('vision state', JSON.stringify(await p.evaluate(() => window.__enc.vision())));
for (const t of TURNS) { await look(t, PITCH); await frames(4); await look(t, PITCH); await pic(`open-${t}`); }
await look(0, 0.25); await frames(4); await look(0, 0.25); await pic('open-up');
/* MOVING (MOVE=1): the look turned a little every drawn frame while the picture is taken, as a finger drags it */
if (process.env.MOVE !== '0') for (const [nm, dy, dp] of [['move-left', 0.035, 0], ['move-right', -0.035, 0], ['move-down', 0, -0.03]]) {
  await look(0, PITCH); await frames(3);
  await p.evaluate(([dy, dp]) => { const E = window.__enc; window.__mv = true; const f = () => { if (!window.__mv) return; E.yaw.rotation.y += dy; E.pitch.rotation.x += dp; requestAnimationFrame(f); }; requestAnimationFrame(f); }, [dy, dp]);
  await frames(4); const f = `${OUT}/${nm}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f);
  await p.evaluate(() => { window.__mv = false; }); await frames(2); }
say('errors', errs.length ? errs.join(' / ') : 'none');
await b.close();
