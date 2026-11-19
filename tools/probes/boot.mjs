/* v27.0 build 46: A QUICK BOOT CHECK. The chapter (CH, e4c4 by default) started from the title on a phone-sized touch context and
   reached play (the opening film let go by testlib's toPlay); every page error and console error printed, and the run
   exits non-zero on one. What it proves is only that the build boots the chapter: deploy first means once the changed
   chapter has been seen to boot (v21.1).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CH=e4c4] node tools/probes/boot.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });
await p.goto(PAGE + '?ch=' + (process.env.CH || 'e4c4'), { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(3000);
console.log('state', await p.evaluate(() => window.__enc.getState()), 'showSlow', await p.evaluate(() => typeof window.__enc.showSlow));
console.log('errors', errs.length ? errs.join('\n') : 'none');
await b.close(); process.exit(errs.length ? 1 : 0);
