import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [tag,opts] of [['d',{viewport:{width:1100,height:780}}],['p',devices['iPhone 13']]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  p.setDefaultNavigationTimeout(180000);
  await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(5500);
  await p.screenshot({path:`n-${tag}-title.png`});
  await ctx.close();
}
await b.close();
