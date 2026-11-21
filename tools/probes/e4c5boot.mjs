/* v28.0 · chapter 5 BOOTS (the deploy's gate, v21.1): ?ch=e4c5, Start, the opening film skipped to play, then each of
   the play phases applied (walk, hunt, fight's start held off: only its stations), every page error captured, and the
   walkable map's read (stage.nav5: on, its counts) where the build has one.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... node tools/probes/e4c5boot.mjs   (through tools/bslot.sh) */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
const out = { booted: true };
for (const ph of ['walk', 'hunt']) {
  await p.evaluate((ph) => window.__enc.stage.setPhase(ph), ph);
  await new Promise(r => setTimeout(r, 4000));
  out[ph] = await p.evaluate(() => { const E = window.__enc, n = E.stage.nav5; return { phase: E.stage.info().phase, nav: n ? { on: n.on, counts: n.counts() } : null }; });
}
out.errs = errs;
console.log('BOOT ' + JSON.stringify(out));
await b.close();
process.exit(errs.filter(e => !/favicon|net::ERR/.test(e)).length ? 1 : 0);
