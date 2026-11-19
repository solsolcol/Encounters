/* v27.0 build 48 (R107): THE SHOWCASE'S DRAWN LIGHT, read back. The chapter booted to play on a phone-sized touch context,
   the showcase opened straight from the kit (kit.unlock('amulet', { showcase: true, auto: 5.2 })) and slowed SLOW times
   (window.__enc.showSlow, and the page's CSS animations the same through the browser's animation domain); at each moment of
   AT (seconds of the showcase) the engine's own drawing surface for its gathering lines (#scFx) is read: its size in
   pixels and on the page, how it is laid out, and how many of its pixels carry any light, and the screen is photographed
   (OUT/lab-<t>.png). Every page error is printed; the run exits non-zero on one or if the surface never carries light.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [SLOW=40] [AT=0.3,0.6,1.0] [DSF=2] node tools/probes/e4c4showlab.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4showlab'; fs.mkdirSync(OUT, { recursive: true });
const SLOW = +(process.env.SLOW || 40), DSF = +(process.env.DSF || 2);
const AT = (process.env.AT || '0.3,0.6,1.0').split(',').map(Number);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });
const cdp = await ctx.newCDPSession(p);
await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000); await p.waitForTimeout(3000);
await p.evaluate((f) => window.__enc.showSlow(f), SLOW);
/* (CSS=0 leaves the page's own animations at speed: the browser's animation domain slows the frame clock too) */
if (process.env.CSS !== '0') { await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW }); }
console.log('the frame clock against the page clock (ms):', JSON.stringify(await p.evaluate(() => new Promise(r => requestAnimationFrame((ts) => r({ raf: Math.round(ts), now: Math.round(performance.now()) }))))));
/* every drawing call on the showcase's surface counted (which calls, and the last alpha and composite each was made with) */
await p.evaluate(() => { const P = CanvasRenderingContext2D.prototype, cnt = window.__scCount = {};
  for (const k of ['clearRect', 'stroke', 'drawImage', 'arc', 'fillRect']) { const f = P[k];
    P[k] = function (...a) { if (this.canvas && this.canvas.id === 'scFx') { cnt[k] = (cnt[k] || 0) + 1; cnt.lastAlpha = this.globalAlpha; cnt.op = this.globalCompositeOperation; } return f.apply(this, a); }; } });
/* (and every error the page raises in its frames, caught where it is thrown: the wrapped clearRect is the first call of the
   showcase's drawing, so whatever throws after it is in that drawing) */
await p.evaluate(() => { window.__scErr = []; window.addEventListener('error', (e) => { window.__scErr.push(String(e.message) + ' @' + e.lineno + ':' + e.colno); }); });
const ok = await p.evaluate(() => window.__enc.kit.unlock('amulet', { showcase: true, auto: 5.2 }));
console.log('opened', ok);
let lit = 0;
for (const t of AT) {
  await p.waitForFunction((t) => { const s = window.__enc.showT(); return s == null || s >= t; }, t, { timeout: 600000, polling: 'raf' });
  const r = await p.evaluate(() => { const cv = document.getElementById('scFx'), cs = getComputedStyle(cv), sc = getComputedStyle(document.getElementById('showcase'));
    const g = cv.getContext('2d'); let n = 0, max = 0;
    if (cv.width && cv.height) { const d = g.getImageData(0, 0, cv.width, cv.height).data; for (let i = 3; i < d.length; i += 4) { if (d[i] > 8) n++; if (d[i] > max) max = d[i]; } }
    const bb = cv.getBoundingClientRect();
    return { t: +window.__enc.showT().toFixed(2), size: [cv.width, cv.height], client: [cv.clientWidth, cv.clientHeight], rect: [Math.round(bb.x), Math.round(bb.y), Math.round(bb.width), Math.round(bb.height)],
             display: cs.display, opacity: cs.opacity, visibility: cs.visibility, z: cs.zIndex, showcase: { cls: document.getElementById('showcase').className, opacity: sc.opacity, display: sc.display },
             litPixels: n, maxAlpha: max, calls: window.__scCount, errs: (window.__scErr || []).slice(0, 3) }; });
  console.log('at', t, JSON.stringify(r));
  if (r.litPixels > 0) lit++;
  await p.screenshot({ path: `${OUT}/lab-${t.toFixed(2)}.png`, timeout: 240000 });
}
console.log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length || !lit ? 1 : 0);
