/* v15: on a PHONE (touch + narrow: LOW), which chapters have any shadow caster at all? */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); p.setDefaultNavigationTimeout(240000);
  try {
    await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load' });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.tap('#startBtn', { timeout: 300000 }).catch(() => p.click('#startBtn'));
    await toPlay(p, 900000); await p.waitForTimeout(3000);
    const r = await p.evaluate(() => {
      const E = window.__enc; let casters = 0, visCasters = 0, receivers = 0, lightsCasting = [];
      E.scene.traverse(o => {
        if (o.isLight && o.castShadow) lightsCasting.push(o.type);
        if (!(o.isMesh || o.isPoints)) return;
        let vis = true; for (let q = o; q; q = q.parent) if (!q.visible) { vis = false; break; }
        if (o.castShadow) { casters++; if (vis) visCasters++; }
        if (o.receiveShadow) receivers++;
      });
      return { low: E.perf ? E.perf().capMs : null, casters, visCasters, receivers, lightsCasting };
    });
    console.log(`${ch} (phone): casters ${r.casters} (visible ${r.visCasters}), receivers ${r.receivers}, lights casting [${r.lightsCasting}]`);
  } catch (e) { console.log(ch + ': FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
await b.close();
