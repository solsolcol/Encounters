/* v26.18 · the ?diag screen photographed (its five colour rows: page, 2D canvas, WebGL, WebGL from a decoded picture, a
   page picture), scrolled to its foot, with the page's errors. CHROMIUM_PATH=... ENC_DIST=<dist> node tools/probes/diagshot.mjs <out.png> */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: 'dark' });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' || /diag/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 200)); });
await p.goto(PAGE + '?ch=ch1&diag', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!document.getElementById('diagBox'), null, { timeout: 240000, polling: 300 });
await p.waitForTimeout(3000);
const rows = await p.evaluate(() => { const box = document.getElementById('diagBox'); const cs = box.querySelectorAll('canvas'); const im = box.querySelector('img');
  return { canvases: cs.length, img: !!(im && im.complete && im.naturalWidth), text: [...box.querySelectorAll('div')].map(d => d.textContent).filter(t => /Colour check/.test(t))[0] }; });
await p.evaluate(() => { const b = document.getElementById('diagBox'); b.scrollTop = b.scrollHeight; });
await p.waitForTimeout(500);
await p.screenshot({ path: process.argv[2] });
console.log(JSON.stringify(rows), errs.join(' / ') || 'no errors');
await b.close();
