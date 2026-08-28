import { chromium, devices } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const b = await chromium.launch(LAUNCH);
for (const [tag,opts] of [['d',{viewport:{width:1100,height:780}}],['p',devices['iPhone 13']]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  p.setDefaultNavigationTimeout(180000);
  await p.goto(PAGE); await p.waitForTimeout(5500);
  await p.screenshot({path:`n-${tag}-title.png`});
  await ctx.close();
}
await b.close();
