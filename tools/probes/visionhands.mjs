/* v27.0 · the fixture's vision-hands measure, with its NOISE FLOOR (two shown pictures with nothing changed between) */
/* v28.0 (build 118): OUT=dir also saves each run's two shown pictures whole (runN-shown.png, runN-shown2.png) and prints the
   vision's state and the body's classes after the second, to see what a large noise is made of */
const OUT = process.env.OUT || '';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 900, height: 600 } });
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(120000);
await p.goto(PAGE + (PAGE.includes('?') ? '&' : '?') + 'ch=chtest', { waitUntil: 'load' });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.click('#startBtn');
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 300000 });
const corner = async () => { const vp = p.viewportSize();
  const b = await p.screenshot({ clip: { x: Math.round(vp.width * 0.5), y: Math.round(vp.height * 0.55), width: Math.round(vp.width * 0.45), height: Math.round(vp.height * 0.4) } });
  return (await sharp(b).raw().toBuffer({ resolveWithObject: true })).data; };
const diff = (a, b) => { let t = 0; for (let i = 0; i < a.length; i++) t += Math.abs(a[i] - b[i]); return t / a.length; };
const fr = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
for (let run = 0; run < 2; run++) {
  await p.evaluate(() => window.__enc.kit.vision({ r: 60, moving: false })); await fr(4);
  const shown = await corner(); if (OUT) await p.screenshot({ path: `${OUT}/run${run}-shown.png` }); await fr(4);
  const shown2 = await corner();
  if (OUT) { await p.screenshot({ path: `${OUT}/run${run}-shown2.png` });
    console.log('state', JSON.stringify(await p.evaluate(() => ({ v: window.__enc.kit.vision(), body: document.body.className })))); }
  await p.evaluate(() => { window.__enc.handsRoot.visible = false; }); await fr(4);
  const hidden = await corner();
  const gated = await p.evaluate(() => window.__enc.visionGate(false)); await fr(4);
  const stale = await corner();
  await p.evaluate(() => { const E = window.__enc; E.visionGate(true); E.handsRoot.visible = true; E.kit.vision(null); E.kit.vision(false); }); await fr(4);
  /* the same, with the spirit's flicker and the hands' sway out of it: the spirit hidden */
  console.log('run', run, 'gated', gated, '| shown vs shown2 (noise)', diff(shown, shown2).toFixed(2), '| shown vs hidden', diff(shown, hidden).toFixed(2),
              '| shown vs stale', diff(shown, stale).toFixed(2), '| shown2 vs stale', diff(shown2, stale).toFixed(2));
}
await b.close();
