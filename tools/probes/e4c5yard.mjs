/* v28.0 (E4C5, R37): THE FIGHT IN THE BIGGER YARD, photographed through the fight's own lens on a phone (390 x 844 at 2 px a
   point, a touch context). Chad, R37: "increase the total walkable area size of the entire fight sequence area by at least 50%
   bigger ... Think about every possible thing, object, cutscene, framing, camera angling". The fight set out through its lab
   (c_fightstage.js FS_LAB), the tag mode on, then each of the two played in turn and set (lab.place) at the yard's new
   reaches: the gate end's middle and its two corners by the planters, the two side walls at the middle, the house end; at
   each, the picture as the player sees it, the lens's place in the world and how much of its boom the walls left it (the
   mode's own boomK), and where the one played stands. OUT/yard.json holds every row; OUT/<who>-<n>-<where>.png the pictures.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [OUT=dir] [WHO=pho,zavier] node tools/probes/e4c5yard.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5yard'; fs.mkdirSync(OUT, { recursive: true });
const WHO = (process.env.WHO || 'pho,zavier').split(',');
/* the places, in the court's frame (x across, + to the west; z down it, + toward the gate): c_fightrules.js NUM */
const SPOTS = [['gate-mid', 0, 4.25], ['gate-west', 1.4, 4.25], ['gate-east', -1.4, 4.25], ['west-mid', 2.05, 0.8], ['east-mid', -2.05, 0.8], ['house', 0, -2.25]];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
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
await frames(4);
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
const res = { rows: [], errs };
let n = 0;
for (const who of WHO) {
  await p.evaluate((who) => window.__enc.kit.tagSwitch(who, { force: true }), who);
  await p.waitForFunction((who) => { const t = window.__enc.kit.tagState(); return t.played === who && !t.gliding; }, who, { timeout: 120000, polling: 200 });
  const other = who === 'pho' ? 'zav' : 'pho';
  for (const [where, x, z] of SPOTS) {
    /* (the other one set where he cannot stand in the lens's line: across the court from the spot, nearer the house) */
    await lab('place', other, x > 0 ? -1.6 : 1.6, -1.6);
    await lab('place', who === 'pho' ? 'pho' : 'zav', x, z);
    await frames(30);                                        // (the boom eased out after a wall drew it in: about a second)
    const st = await p.evaluate(() => { const E = window.__enc, t = E.kit.tagState(); let cam = null; E.pitch.traverse(o => { if (!cam && o.isCamera) cam = o; });
      const V = cam.position.constructor, w = new V(); cam.updateWorldMatrix(true, false); cam.getWorldPosition(w);
      const T2 = typeof E.tag === 'function' ? E.tag() : null;              // (the engine's own read: its boom's share and, R41, the crane's pitch)
      return { played: t.played, bodies: t.bodies, lens: w.toArray().map(v => +v.toFixed(2)), boomK: T2 ? +(+T2.boomK).toFixed(2) : null,
               pitch: +(-E.pitch.rotation.x * 180 / Math.PI).toFixed(1), crane: T2 ? T2.crane : null }; });
    const f = `${OUT}/${who}-${String(++n).padStart(2, '0')}-${where}.png`;
    await p.screenshot({ path: f, timeout: 300000 });
    res.rows.push({ who, where, at: [x, z], ...st, f }); say('pic', f, JSON.stringify(st.lens), 'boomK', st.boomK, 'pitch', st.pitch);
  }
}
fs.writeFileSync(OUT + '/yard.json', JSON.stringify(res, null, 1));
say('RESULT pictures', res.rows.length, 'errors', errs.length);
for (const e of errs.slice(0, 6)) say(e);
await b.close();
