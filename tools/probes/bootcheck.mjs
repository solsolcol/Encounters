/* bootcheck.mjs (v29.0, 27 Nov 2026) A CHAPTER SEEN TO BOOT before a deploy (CLAUDE.md: deploy first means once the changed chapter
   has been seen to boot): ?ch=<CH> on a phone (390 x 844, touch, two pixels a point), Start, its opening film seen running
   (a picture 9 s in), then play (a picture), every page error and console error counted.
     ENC_DIST=<snapshot> CHROMIUM_PATH=/opt/pw-browsers/chromium CH=e5c1 OUT=<dir> sh tools/bslot.sh node tools/probes/bootcheck.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
import fs from 'node:fs';
const OUT = process.env.OUT || '/tmp/bootcheck'; fs.mkdirSync(OUT, { recursive: true });
const CH = process.env.CH || 'e5c1';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const t0 = Date.now();
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await p.waitForFunction(() => { try { const s = window.__enc.getState(); return s === 'cine' || s === 'play'; } catch { return false; } }, null, { timeout: 900000 });
const st1 = await p.evaluate(() => window.__enc.getState());
console.log('after Start:', st1, 'at', ((Date.now() - t0) / 1000).toFixed(0), 's');
if (st1 === 'cine') { await p.waitForTimeout(9000); await p.screenshot({ path: OUT + '/film.png' }); }
await toPlay(p, 900000);
await p.waitForTimeout(4000);
await p.screenshot({ path: OUT + '/play.png' });
console.log("state", await p.evaluate(() => window.__enc.getState()), 'total', ((Date.now() - t0) / 1000).toFixed(0), 's');
console.log('errors', errs.length); for (const e of errs.slice(0, 12)) console.log(' ', e);
await b.close();
