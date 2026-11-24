/* v28.0 (E4C5, R110-R117) · THE FIGHT'S HUD AND CAMERA, PHOTOGRAPHED: Chad, 24 Nov 2026, "the camera view can still be placed
   slightly higher ... many ability buttons have the text misaligned or overflowing the button area ... improve how the icons
   of the ability buttons look like" (then R116/R117: the icons painted again in the manner of World of Warcraft's). The fight
   begun through its lab (its brief photographed first), each of the two played in turn (Grandmaster Pho's FIRE, SHOCKWAVE
   and BAG; Master Zavier's BIND and SHIELD), the hold's four orders laid on the objective as the fight says them, and the
   surge with its TOGETHER call. VIEW=phone is 390 x 844 CSS at 2 px a point in a touch context; VIEW=desk 1280 x 720 at 2.
   With the pictures, each act button's word measured against its button (the word's box inside the button's, in CSS px).
     ENC_DIST=<snapshot> OUT=<dir> [VIEW=phone|desk] node tools/probes/e4c5r110fight.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5r110fight'; fs.mkdirSync(OUT, { recursive: true });
const VIEW = process.env.VIEW || 'phone';
const b = await chromium.launch(LAUNCH);
const ctx = VIEW === 'phone' ? await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })
                             : await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const shot = async (name) => { await frames(4); await p.screenshot({ path: `${OUT}/${VIEW}-${name}.png`, timeout: 300000 }); say('pic', name); };
/* every shown act button: its word's box against the button's own, and whether a picture fills it */
const fit = () => p.evaluate(() => [...document.querySelectorAll('.tagBtn')].filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0).map(e => {
  const r = e.getBoundingClientRect(), L = e.querySelector('.tgLbl'), q = L ? L.getBoundingClientRect() : null, img = e.querySelector('.tgArt img');
  const word = L ? L.textContent : '';
  return { word, btn: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
           lbl: q ? [Math.round(q.x), Math.round(q.y), Math.round(q.width), Math.round(q.height)] : null,
           scroll: L ? L.scrollWidth : 0, font: L ? getComputedStyle(L).fontSize : '', inside: q ? (q.left >= r.left - 0.5 && q.right <= r.right + 0.5) : null,
           art: !!img, artLoaded: img ? (img.complete && img.naturalWidth > 0) : null };
}));
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await shot('brief');
await lab('open');
await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
say('start', JSON.stringify(await lab('start')));
await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6);
await lab('swapOn');
await p.waitForTimeout(4000);
await shot('pho-played');
const fitPho = await fit(); say('fit pho', JSON.stringify(fitPho));
/* (R120: every one of his act buttons at once, as the open fight shows them: the chapter's own repaint held for one picture
   while the three are laid with their words and pictures through the kit itself) */
const allActs = async (name, acts) => { await p.evaluate((acts) => { const K = window.__enc.kit; K.__ta = K.__ta || K.tagAct; const o = K.__ta;
  for (const [id, label, art] of acts) o.call(K, id, { hidden: false, blocked: null, wait: 0, fill: 0, pulse: false, on: false, call: false, label, art });
  K.tagAct = () => true; }, acts); await p.waitForTimeout(700); await shot(name); say('fit ' + name, JSON.stringify(await fit()));
  await p.evaluate(() => { const K = window.__enc.kit; if (K.__ta) { K.tagAct = K.__ta; delete K.__ta; } }); };
await allActs('pho-three', [['flame', 'FIRE', 'p5icofire'], ['shock', 'SHOCKWAVE', 'p5icoshock'], ['bag', 'BAG', 'p5icobag']]);
await p.keyboard.press('Tab'); await p.waitForTimeout(3500);
await shot('zav-played');
const fitZav = await fit(); say('fit zav', JSON.stringify(fitZav));
await allActs('zav-two', [['bind', 'BIND', 'p5icobind'], ['lend', 'SHIELD', 'p5icoshield']]);
/* the hold's orders as the fight says them, longest first, each laid on the objective for one picture */
const W = await p.evaluate(() => { const s = window.__enc.stage; return s && s.words ? s.words : null; });
for (const [k, txt] of [['objFight3w', "Keep them bound. Pho's SHOCKWAVE is charging."], ['objFight3g', "Use Pho's SHOCKWAVE now! It takes every bound Prai."],
                         ['objFight2b', 'Now switch to Pho. FIRE at the bound Prai, then BAG it.']]) {
  await p.evaluate((t) => window.__enc.kit.objective(t, { complete: false }), txt); await p.waitForTimeout(600);
  await shot('obj-' + k);
}
say('toSurge', JSON.stringify(await lab('toSurge')));
await p.waitForTimeout(9000);
await shot('surge');
say('fit surge', JSON.stringify(await fit()));
fs.writeFileSync(`${OUT}/${VIEW}-fit.json`, JSON.stringify({ pho: fitPho, zav: fitZav }, null, 1));
say('errors', errs.length ? errs.join(' / ') : 'none');
await b.close();
process.exit(errs.length ? 1 : 0);
