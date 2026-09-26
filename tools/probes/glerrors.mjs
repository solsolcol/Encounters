/* v15: GL ERRORS, BY PHASE. A draw the driver rejects (GL_INVALID_OPERATION —
   e.g. a shadow sampler with no depth texture bound) is a draw that did not
   happen: an object missing for that frame. This loads a chapter, walks it
   through the curtain, the film and ten seconds of play, and counts the
   WebGL errors the page reports in each — with OPT switches from the address
   (`OPT=lightSets:0`), so a change can be blamed or cleared.
   Usage: [OPT=…] node tools/probes/glerrors.mjs <chapter…> */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) {
  const ctx = await b.newContext({ viewport: { width: 960, height: 600 } });
  const p = await ctx.newPage();
  let phase = 'load';
  const count = {}, sample = {};
  p.on('console', m => {
    const t = m.text();
    if (!/GL_INVALID|WebGL:|GL ERROR/i.test(t)) return;
    count[phase] = (count[phase] || 0) + 1;
    if (!sample[phase]) sample[phase] = t.slice(0, 160);
  });
  try {
    await p.goto(PAGE + '?ch=' + ch + (process.env.OPT ? '&opt=' + process.env.OPT : ''), { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    phase = 'curtain';
    await p.click('#startBtn', { timeout: 120000 });
    await p.waitForFunction(() => ['cine', 'play'].includes(window.__enc.getState()), null, { timeout: 900000, polling: 200 });
    phase = 'film';
    await toPlay(p, 900000);
    phase = 'play';
    await p.waitForTimeout(10000);
    console.log(`${ch}${process.env.OPT ? ' [' + process.env.OPT + ']' : ''}: ` + JSON.stringify(count) +
                (Object.keys(sample).length ? '\n   ' + Object.entries(sample).map(([k, v]) => k + ': ' + v).join('\n   ') : ''));
  } catch (e) { console.log(ch + ': PROBE FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
await b.close();
