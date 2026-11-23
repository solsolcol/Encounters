/* v28.0 (E4C5, R43): THE NINE ALIVE, photographed through the fight's own lens on a phone (390 x 844 CSS pixels at 2 device
   pixels a point, a touch context). Chad, R43: "add animations to the prais, walking animations, passive idle animations and
   animations when getting hit or binded, with sound effects and voices when getting hit or binded. Also add a red flaming
   effect to every prai around their silhouette. The prais also have some automatic walking logic that slowly walks around,
   taking into account body collision with other prais and models, pathfinding". The fight set out through its lab
   (c_fightstage.js FS_LAB), the tag mode live, the two of them placed so a Prai walks across the lens; then one at a time a
   Prai is set coming (it walks to him), struck by the fire (setback: its flinch), bound (its struggle in the bubble),
   chased (its stagger back), and two set coming side by side (they keep apart). At each, the picture, and every Prai's
   state, take, rate and speed (lab.praiRead). OUT/prai.json holds every row; OUT/<n>-<what>.png the pictures.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [OUT=dir] node tools/probes/e4c5prai.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5prai'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], warns = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') warns.push(m.type() + ' ' + m.text().slice(0, 200)); });
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
const lab0 = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
say('start', await lab0('start'));                       // (the lesson begun: in the brief the rules do not step and the nine are not drawn)
await frames(6);
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
const res = { rows: [], errs, warns };
let n = 0;
async function pic(what) {
  const f = `${OUT}/${String(++n).padStart(2, '0')}-${what}.png`;
  const read = await lab('praiRead');
  await p.screenshot({ path: f, timeout: 300000 });
  res.rows.push({ what, f, prai: read.filter(r => r.vis) }); say('pic', f, JSON.stringify(read.filter(r => r.vis)));
}
/* (the lens behind Grandmaster Pho at the gate end, his student to the right: a Prai from the house's far corner walks
   across the picture to him) */
await lab('place', 'pho', -0.4, 3.0);
await lab('place', 'zav', 1.3, 0.9);
await frames(30);
await lab('prai', 1, 'gathered');                        // (the lesson's Prai out of the way)
await lab('prai', 2, 'coming', -1.9, -2.0);
await frames(45); await pic('walk-a');
await frames(30); await pic('walk-b');
await frames(30); await pic('walk-c');
/* (a fire's setback: its flinch, its cry) */
await lab('hit', 2, 'setback'); await frames(8); await pic('setback-flinch');
await frames(20); await pic('setback-after');
/* (bound: its struggle in the bubble) */
await lab('prai', 2, 'bound'); await lab('hit', 2, 'bind'); await frames(40); await pic('bound-a');
await frames(25); await pic('bound-b');
/* (chased: it staggers back toward the house and sinks) */
await lab('prai', 2, 'coming', 0.2, -0.6); await frames(30);
await lab('prai', 2, 'fleeing'); await lab('hit', 2, 'chased'); await frames(10); await pic('chased-stagger');
/* (two coming side by side: they keep apart) */
await lab('prai', 2, 'coming', -1.5, -2.3); await lab('prai', 3, 'coming', -1.3, -2.25);
await frames(60); await pic('two-apart-a');
await frames(45); await pic('two-apart-b');
/* (near: the flame round its silhouette, close to the lens) */
await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6);
await lab('prai', 3, 'gathered'); await lab('prai', 2, 'coming', -0.2, -0.4); await frames(40); await pic('near-flame');
fs.writeFileSync(OUT + '/prai.json', JSON.stringify(res, null, 1));
say('RESULT pictures', res.rows.length, 'errors', errs.length, 'warnings', warns.length);
for (const e of errs.slice(0, 6)) say(e);
for (const w of warns.slice(0, 10)) say(w);
await b.close();
