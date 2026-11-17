/* v27.0 · SPIRIT VISION'S LAB: any chapter booted (CH), played to, and a list of steps run against it, each beat
   photographed at a drawn frame. `?visionlab` gives a chapter that declares no `vision` the engine's default one, so the
   pass can be judged in any lit or dark place the game already has before the chapter it was made for exists.

     CHROMIUM_PATH=... CH=e2c1 VIEW=phone|low|desk OUT=<dir> [QS='&opt=...'] node tools/probes/visionlab.mjs <steps.json>

   steps.json: [ step, ... ], each one of
     { "frames": 6 }                      that many drawn frames (the vision runs on the wall's clock: a frame a second
                                          on a box without a graphics chip, so a wave is HELD with a radius to be judged)
     { "ms": 1500 }                       that much wall time, then three drawn frames
     { "view": [x, y, z, yawDeg, pitchDeg] }   the lens placed (y null keeps the height)
     { "look": [yawDeg, pitchDeg] }       the lens turned only
     { "eval": "E.vision({ r: 3, moving: true })" }   anything on window.__enc (E), its answer logged
     { "shot": "name" }                   a photograph (three drawn frames first)
     { "until": "E.vision().r === 0", "ms": 60000 }   polled until true
   Page errors and console errors are printed at the end, and the run exits non-zero if there were any. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const STEPS = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const CH = process.env.CH || 'e2c1', VIEW = process.env.VIEW || 'phone', OUT = process.env.OUT || '/tmp/visionlab';
fs.mkdirSync(OUT, { recursive: true });
/* high resolution, always (Chad, 12 Nov 2026): a phone's window at its CSS size drawn at two pixels to one */
const DSF = +process.env.DSF || 2;
const PHONES = { phone: [390, 844], low: [360, 780], land: [844, 390] };
const b = await chromium.launch(LAUNCH);
const ctx = PHONES[VIEW] ? await b.newContext({ viewport: { width: PHONES[VIEW][0], height: PHONES[VIEW][1] }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true })
                         : await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: DSF });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 260)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=' + CH + '&visionlab' + (process.env.QS || ''), { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await frames(4);
log('in play', CH, VIEW, JSON.stringify(await p.evaluate(() => window.__enc.vision && window.__enc.vision())));
let n = 0;
for (const s of STEPS) {
  try {
    if (s.frames) await frames(s.frames);
    else if (s.ms) { await p.waitForTimeout(s.ms); await frames(3); }
    else if (s.view) { await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; E.yaw.position.x = v[0]; if (v[1] != null) E.yaw.position.y = v[1]; E.yaw.position.z = v[2]; E.yaw.rotation.y = v[3] * d; E.pitch.rotation.x = (v[4] || 0) * d; }, s.view); await frames(3); }
    else if (s.look) { await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; E.yaw.rotation.y = v[0] * d; E.pitch.rotation.x = (v[1] || 0) * d; }, s.look); await frames(3); }
    else if (s.eval) { const r = await p.evaluate(new Function('const E = window.__enc; return (' + s.eval + ');')).catch(e => 'THREW ' + e.message); if (r !== undefined && r !== null) log('eval', String(s.eval).slice(0, 70), '->', JSON.stringify(r).slice(0, 1600)); }
    else if (s.until) { const ok = await p.waitForFunction(new Function('const E = window.__enc; try { return !!(' + s.until + '); } catch (e) { return false; }'), null, { timeout: s.ms || 300000, polling: 300 }).then(() => true, () => false); log('until', s.until, ok ? 'ok' : 'TIMED OUT'); }
    if (s.shot) { await frames(3); await p.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}-${s.shot}.png`, timeout: 240000 }).catch(() => log('shot failed', s.shot)); log('shot', s.shot); }
  } catch (e) { log('STEP FAILED', JSON.stringify(s), e.message.split('\n')[0]); }
}
log('errors', errs.length); for (const e of errs.slice(0, 20)) console.log('  ', e);
await b.close();
process.exit(errs.length ? 1 : 0);
