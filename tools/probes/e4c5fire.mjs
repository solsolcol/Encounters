/* v28.0 (E4C5, R44 and R45): THE PRAI ON FIRE, photographed. Chad, of build 35's pictures: "That does not look like flame
   edge to me, where are the flames? Its just an orange edge"; "I meant the flame edge has to look like its on fire."
   The fight set out through its lab (c_fightstage.js FS_LAB) and the lesson begun; the page's clock SLOWED (STEP_MS a drawn
   frame, filmlive.mjs's way) so the flames move as a phone draws them; two Prai set near the lens (one coming, one pressing
   at the cage) and photographed through the fight's own lens on a phone (390 x 844 CSS pixels at two device pixels a
   point, a touch context), three moments a few frames apart; then CLOSE (the tag mode left, the lens 1.3 m from one of them,
   level with its chest, a 40 degree lens) from in front and from beside it, the same three moments. OUT/<n>-<what>.png.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [OUT=dir] [STEP_MS=33] [CLOSE=1] node tools/probes/e4c5fire.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5fire'; fs.mkdirSync(OUT, { recursive: true });
const STEP_MS = +(process.env.STEP_MS || 33), CLOSE = process.env.CLOSE !== '0';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], warns = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /e4c5|THREE\.WebGL|shader|program/i.test(m.text())) warns.push(m.type() + ' ' + m.text().slice(0, 300)); });
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
await frames(4);
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
say('start', await lab('start'));
await frames(4);
if (STEP_MS) await p.evaluate((STEP_MS) => {
  const realNow = performance.now.bind(performance), realRaf = window.requestAnimationFrame.bind(window);
  window.__virt = realNow(); performance.now = () => window.__virt;
  window.requestAnimationFrame = (cb) => realRaf(() => cb(window.__virt + 5000));
  const tick = () => { window.__virt += STEP_MS; realRaf(tick); }; realRaf(tick);
}, STEP_MS);
let n = 0;
async function pic(what) {
  const f = `${OUT}/${String(++n).padStart(2, '0')}-${what}.png`;
  await p.screenshot({ path: f, timeout: 300000 }); say('pic', f);
}
/* the two of them where the lens sees the court whole; two Prai near it */
await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6);
await frames(8);
for (let i = 1; i <= 9; i++) await lab('prai', i, 'gathered');
await lab('prai', 2, 'coming', -0.35, -0.2); await lab('prai', 3, 'pressing', 1.0, -1.3);
await frames(30);
await pic('fight-a'); await frames(5); await pic('fight-b'); await frames(5); await pic('fight-c');
if (CLOSE) {
  /* (close: the tag mode left, so the lens is the probe's; the rules held still, Prai 2 where it stands) */
  await lab('prai', 2, 'pressing', -0.35, -0.2);
  await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null); });
  await frames(4);
  const where = await p.evaluate(() => { const E = window.__enc; const out = [];
    E.scene.traverse(o => { const U = o.isSkinnedMesh && o.material && o.material.uniforms; if (U && U.uC && U.uA && o.visible && U.uA.value > 0.5 && U.uC.value.y > 0.5) out.push(U.uC.value.toArray()); });
    return out; });
  say('fire bodies at', JSON.stringify(where.map(a => a.map(x => +x.toFixed(2)))));
  if (where.length) {
    /* (the nearest burning body to where the fight's lens stood) */
    const tgt = where[0];
    for (const [k, ang] of [['front', 0], ['side', Math.PI / 2]]) {
      await p.evaluate(([tg, ang]) => { const E = window.__enc, c = E.yaw.position;
        /* (toward the lens's side of the court: the gate end is +z in the world's own frame here, so the body is seen from
           where the player stands; turned by `ang` round it) */
        const d = 1.3, x = tg[0] + Math.sin(ang) * d, z = tg[2] + Math.cos(ang) * d;
        c.x = x; c.z = z; E.yaw.rotation.y = Math.atan2(-(tg[0] - x), -(tg[2] - z)); E.pitch.rotation.x = Math.atan2(tg[1] + 0.05 - (E.camera.getWorldPosition(new c.constructor()).y), d);
        const k = E.kit; if (k.lens) k.lens(40, { secs: 0 }); }, [tgt, ang]);
      await frames(6); await pic(`close-${k}-a`); await frames(5); await pic(`close-${k}-b`);
    }
  }
}
say('RESULT pictures', n, 'errors', errs.length, 'warnings', warns.length);
for (const e of errs.slice(0, 6)) say(e);
for (const w of warns.slice(0, 12)) say(w);
await b.close();
