/* v26.18 · the ?diag screen photographed, its colour rows and the values under them read (rows: page, 2D canvas, WebGL,
   WebGL from the browser's own decode of a picture, a page picture, a worker's decode, the game's way, and a recorded
   video three ways), with the page's errors. It waits for the last row (the video's) to be written, never a fixed time.
   QS= more of the address (`&picsim=dim`: his phone's dimming, played here).
     CHROMIUM_PATH=... ENC_DIST=<dist> [QS=...] node tools/probes/diagshot.mjs <out-prefix> */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.argv[2] || '/tmp/diag';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: 'dark' });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' || /diag/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 200)); });
await p.goto(PAGE + '?ch=ch1&diag' + (process.env.QS || ''), { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!document.getElementById('diagBox'), null, { timeout: 240000, polling: 300 });
await p.waitForFunction(() => [...document.querySelectorAll('#diagBox div')].some(d => /^(10 video|8 video:)/.test(d.textContent)), null, { timeout: 180000, polling: 300 });
const lines = await p.evaluate(() => [...document.querySelectorAll('#diagBox div')].map(d => d.textContent).filter(t => /^\s*([0-9]+ |check:)/.test(t)));
await p.evaluate(() => { const box = document.getElementById('diagBox'); const t = [...box.querySelectorAll('div')].find(d => /^Colour check/.test(d.textContent)); box.scrollTop = t.offsetTop - 8; });
await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
await p.screenshot({ path: OUT + '-1.png' });
await p.evaluate(() => { const box = document.getElementById('diagBox'); box.scrollTop = box.scrollHeight; });
await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
await p.screenshot({ path: OUT + '-2.png' });
console.log(lines.join('\n')); console.log(errs.join(' / ') || 'no errors');
await b.close();
process.exit(errs.some(e => /PAGEERROR/.test(e)) ? 1 : 0);
