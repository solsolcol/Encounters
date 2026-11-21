/* v27.0 (R139 to R144, 21 Nov 2026): THE CONTROLS for the sixty-sixth and sixty-seventh seams. Episode 1 (ch1, the void
   deck) and episode 2 chapter 4 (e2c4, the rifle on the range) never ask for either, so each must be exactly as it was:
   booted by ?ch= on a phone-sized touch page; e2c4's rifle given and brought up, and its FIRE button read as the page
   computes it (no wpnGlow class, its animation, transform, shadow, border and the light layer it does not have) and
   photographed full size; then in each chapter his nerve taken to nothing (the engine's own faint, the only loss either
   has): the faint film, the card with Retry alone (no Restart chapter), nothing held, Retry: the chapter's start (no
   phase, the stats of its start), play again. Every page error counted. Run it on the build to test and on the one before
   (ENC_DIST), and compare the two JSON lines it writes (the button's computed look must be the same).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [ONLY=ch1,e2c4] node tools/probes/e4c4controls.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4controls';
fs.mkdirSync(OUT, { recursive: true });
const KEYS = (process.env.ONLY || 'ch1,e2c4').split(',');
const b = await chromium.launch(LAUNCH);
const checks = {}, looks = {};
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
for (const key of KEYS) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 250 }).then(() => true, () => false);
  await p.goto(PAGE + '?ch=' + key, { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 240000 });
  { const r = await p.evaluate(() => { const e = document.getElementById('startBtn').getBoundingClientRect(); return { x: e.left + e.width / 2, y: e.top + e.height / 2 }; });
    await p.touchscreen.tap(Math.round(r.x), Math.round(r.y)); }
  await toPlay(p, 1200000);
  checks[key + ':play'] = await until(() => window.__enc.getState() === 'play', 1200000);
  if (key === 'e2c4') {
    await p.evaluate(() => { const k = window.__enc.kit; k.give('rifle'); k.equip('rifle'); });
    checks[key + ':rifleUp'] = await until(() => document.body.classList.contains('weaponUp'), 120000);
    await frames(3);
    looks[key] = await p.evaluate(() => { const fb = document.getElementById('fireBtn'), cs = getComputedStyle(fb), be = getComputedStyle(fb, '::before'), r = fb.getBoundingClientRect();
      return { glowClass: document.body.classList.contains('wpnGlow'), glowOn: window.__enc.weaponGlowOn ? window.__enc.weaponGlowOn() : null,
               anim: cs.animationName, transform: cs.transform, shadow: cs.boxShadow, border: cs.borderColor, position: cs.position, before: be.content,
               rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], wg: fb.style.getPropertyValue('--wg') }; });
    log(key, 'the rifle\'s FIRE button:', JSON.stringify(looks[key]));
    checks[key + ':buttonAsItWas'] = looks[key].glowClass === false && looks[key].anim === 'none' && looks[key].before === 'none' && !looks[key].wg;
    try { await p.screenshot({ path: `${OUT}/${key}-fire.png`, timeout: 240000 }); } catch { /* a slow frame */ }
  }
  /* the engine's own faint: his nerve to nothing */
  await p.evaluate(() => window.__enc.kit.award('sanity', -200));
  checks[key + ':faint'] = await until(() => window.__enc.getState() === 'lost', 1200000);
  checks[key + ':cardReady'] = await until(() => { const b = document.getElementById('retryBtn'); return !!b && !b.classList.contains('waiting'); }, 600000);
  /* (the build before this one has no second button and no held point: read as absent) */
  const card = await p.evaluate(() => { const E = window.__enc, rc = document.getElementById('restartChBtn');
    return { restart: rc ? getComputedStyle(rc).display : 'absent', held: E.loseHold ? E.loseHold() : null, again: E.loseAgainHeld ? E.loseAgainHeld() : false }; });
  log(key, 'the card:', JSON.stringify(card));
  checks[key + ':retryAlone'] = (card.restart === 'none' || card.restart === 'absent') && card.held === null && card.again === false;
  try { await p.screenshot({ path: `${OUT}/${key}-lost.png`, timeout: 240000 }); } catch { /* a slow frame */ }
  await p.evaluate(() => document.getElementById('retryBtn').click());
  checks[key + ':retryIsStart'] = await until(() => window.__enc.getState() === 'play', 600000)
    && await p.evaluate(() => window.__enc.kit.getPhase() === null && window.__enc.stats.sanity === 100);
  checks[key + ':noPageErrors'] = errs.length === 0;
  if (errs.length) log(key, 'ERRORS', errs.join(' | '));
  await ctx.close();
}
console.log('LOOKS ' + JSON.stringify(looks));
log('CHECKS', JSON.stringify(checks));
await b.close();
process.exit(Object.values(checks).every(v => v === true) ? 0 : 1);
