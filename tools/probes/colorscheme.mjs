/* v26.18 · WHAT A COLOUR-SCHEME DECLARATION CHANGES (Chad, 17 Nov 2026, of Samsung Internet's forced dark: "Try the one
   line change but make sure it does not affect or break anything unintended").

   UI (the default): the page is loaded once per context (a phone and a desktop, the reader's own preference light, then
   dark), and on each screen it is photographed as built, then with the declaration laid over it LIVE (the meta's content
   and a style element at the end of the head), photographed again, and the two compared byte for byte; the world's
   canvas, the title's film and the HUD's heart line are hidden and every animation held, so only the declaration can
   differ. Every element's computed color-scheme, colour and background are read both ways too. Screens: the title, the
   chapter list, the credits (scrolled), play with its HUD (and a desktop's volume slider), the bag, the pause menu, and
   ?diag. The pictures are kept in OUT for a reader.

   FORCE=1: Chromium's own forced dark (--blink-settings=forceDarkModeEnabled=true), the phone's preference dark: the
   page loaded as built and as the variant (the served page rewritten AT LOAD, so the browser decides on it as it would),
   and the HUD's three bars read in each.

   VARIANT=v2 (the change: :root light dark, body pinned only light, a no-op dark rule), v1 (no body pin: the check's own
   proof, which must show a difference where a browser draws its own controls dark).
     CHROMIUM_PATH=... ENC_DIST=<snapshot of dist> OUT=<dir> [VARIANT=v2] [FORCE=1] node tools/probes/colorscheme.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';

const OUT = process.env.OUT || '/tmp/colorscheme', VARIANT = process.env.VARIANT || 'v2', FORCE = !!process.env.FORCE;
fs.mkdirSync(OUT, { recursive: true });
const CSS = {
  v2: ':root{color-scheme:light dark}body{color-scheme:only light}@media (prefers-color-scheme: dark){:root{color-scheme:light dark}}',
  v1: ':root{color-scheme:light dark}',
};
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const b = await chromium.launch(FORCE ? { ...LAUNCH, args: [...LAUNCH.args, '--blink-settings=forceDarkModeEnabled=true'] } : LAUNCH);
const CTX = {
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
  desk: { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 },
};
let fails = 0;

async function open(ctxName, scheme, rewrite) {
  const ctx = await b.newContext({ ...CTX[ctxName], colorScheme: scheme });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  if (rewrite) await p.route(u => new URL(u).pathname === '/', async (route) => {
    const r = await route.fetch(); let html = await r.text();
    const n = (html.match(/only light/g) || []).length;
    html = html.replace('<meta name="color-scheme" content="only light">', '<meta name="color-scheme" content="light dark">')
               .replace('</body>', `<style id="csVariant">${CSS[VARIANT]}</style>\n</body>`);   // (after the shell's own styles, which are in the body)
    log('  (the page rewritten at load:', n, 'declarations found)');
    await route.fulfill({ response: r, body: html, headers: { ...r.headers(), 'content-type': 'text/html; charset=utf-8' } });
  });
  return { ctx, p, errs };
}
const frames = (p, n = 2) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const hideMoving = (p) => p.evaluate(() => { if (document.getElementById('csHide')) return; const s = document.createElement('style'); s.id = 'csHide';
  s.textContent = '#scene,#titleVid,#ecg,#grade{visibility:hidden!important}'; document.head.appendChild(s); });
/* (every element the page draws: the root and the body's whole tree. The head's are never drawn, and inherit the root's) */
const dumpCS = (p) => p.evaluate(() => [document.documentElement, document.body, ...document.body.querySelectorAll('*')].filter(el => el.id !== 'csVariant' && el.id !== 'csHide').map((el, i) => { const c = getComputedStyle(el);
  return (el.id || el.tagName + '#' + i) + '|' + c.colorScheme + '|' + c.color + '|' + c.backgroundColor + '|' + c.borderTopColor + '|' + c.accentColor; }));
const apply = (p) => p.evaluate((css) => {
  const m = document.querySelector('meta[name="color-scheme"]'); if (m) { m.dataset.was = m.content; m.content = 'light dark'; }
  const s = document.createElement('style'); s.id = 'csVariant'; s.textContent = css; document.body.appendChild(s); }, CSS[VARIANT]);   // (the shell's styles are in the body: after them, or the variant loses the cascade)
const revert = (p) => p.evaluate(() => { document.getElementById('csVariant')?.remove();
  const m = document.querySelector('meta[name="color-scheme"]'); if (m && m.dataset.was) m.content = m.dataset.was; });

async function both(p, tag, name) {
  await hideMoving(p); await frames(p, 3);
  const a = await p.screenshot({ animations: 'disabled' }), ca = await dumpCS(p);
  await apply(p); await frames(p, 3);
  /* (the variant must have taken: a declaration that loses the cascade changes nothing, and "identical" would be a lie) */
  const took = await p.evaluate(() => [getComputedStyle(document.documentElement).colorScheme, getComputedStyle(document.body).colorScheme]);
  if (!/dark/.test(took[0])) { fails++; log(tag, name, 'VARIANT NOT APPLIED: root', took[0]); }
  const v = await p.screenshot({ animations: 'disabled' }), cv = await dumpCS(p);
  await revert(p); await frames(p, 2);
  fs.writeFileSync(`${OUT}/${tag}-${name}-asbuilt.png`, a); fs.writeFileSync(`${OUT}/${tag}-${name}-${VARIANT}.png`, v);
  const same = Buffer.compare(a, v) === 0;
  const cs = ca.map((x, i) => [x, cv[i]]).filter(([x, y]) => x !== y);
  const csOther = cs.filter(([x]) => !/^HTML#/.test(x));
  if (!same || csOther.length) fails++;
  log(tag, name, same ? 'pixels identical' : 'PIXELS DIFFER', '| drawn elements whose style differs:', cs.length,
      cs.map(([x, y]) => x.split('|')[0] + ' ' + x.split('|')[1] + '→' + y.split('|')[1]).slice(0, 6).join('; '));
}
const shown = (p, id) => p.waitForFunction((id) => { const e = document.getElementById(id); return e && !e.classList.contains('hide') && e.offsetParent !== null; }, id, { timeout: 120000, polling: 200 });

if (!FORCE) {
  /* (CTXS=desk-dark,... runs only those) */
  const only = (process.env.CTXS || '').split(',').filter(Boolean);
  for (const ctxName of ['phone', 'desk']) for (const scheme of ['light', 'dark']) {
    if (only.length && !only.includes(`${ctxName}-${scheme}`)) continue;
    const tag = `${ctxName}-${scheme}`, { ctx, p, errs } = await open(ctxName, scheme, false);
    await p.goto(PAGE + '?ch=ch1', { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await shown(p, 'startBtn'); await both(p, tag, 'title');
    await p.click('#chaptersBtn'); await shown(p, 'chClose'); await both(p, tag, 'chapters'); await p.click('#chClose'); await frames(p, 3);
    await p.click('#creditsLink'); await shown(p, 'credClose');
    await p.evaluate(() => { const c = document.querySelector('#credits .credCard'); if (c) c.scrollTop = 120; });
    await both(p, tag, 'credits'); await p.click('#credClose'); await frames(p, 3);
    await p.evaluate(() => document.getElementById('startBtn').click());
    await toPlay(p, 900000); await frames(p, 6); await both(p, tag, 'hud');
    await p.evaluate(() => document.getElementById('invBtn').click()); await frames(p, 6); await both(p, tag, 'bag');
    await p.keyboard.press('Escape'); await frames(p, 4);
    await p.evaluate(() => document.getElementById('menuBtn').click()); await shown(p, 'menuResume'); await both(p, tag, 'menu');
    await p.goto(PAGE + '?ch=ch1&diag', { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!document.getElementById('diagBox'), null, { timeout: 240000, polling: 300 });
    await both(p, tag, 'diag');
    if (errs.length) { fails++; log(tag, 'PAGE ERRORS', errs.slice(0, 3).join(' / ')); }
    await ctx.close();
  }
} else {
  /* the HUD's bars, as built and as the variant, under Chromium's own forced dark */
  for (const rewrite of [false, true]) {
    const tag = rewrite ? VARIANT : 'asbuilt', { ctx, p } = await open('phone', 'dark', rewrite);
    await p.goto(PAGE + '?ch=ch1', { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.evaluate(() => document.getElementById('startBtn').click());
    await toPlay(p, 900000); await frames(p, 6); await hideMoving(p); await frames(p, 3);
    fs.writeFileSync(`${OUT}/force-${tag}-hud.png`, await p.screenshot({ animations: 'disabled' }));
    const used = await p.evaluate(() => [getComputedStyle(document.documentElement).colorScheme, getComputedStyle(document.body).colorScheme,
      matchMedia('(prefers-color-scheme: dark)').matches]);
    log('forced dark', tag, 'root / body color-scheme and prefers-dark:', JSON.stringify(used), '->', `force-${tag}-hud.png`);
    await ctx.close();
  }
}
await b.close();
log(fails ? `${fails} screen(s) NOT identical` : 'every screen identical');
process.exit(fails ? 1 : 0);
