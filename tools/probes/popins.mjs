/* v14.15 — the CONTINUE path: a saved run, reload, Continue — what pops in */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  try {
    await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await toPlay(p, 600000);
    const st = await p.evaluate(() => { const e = window.__enc; return JSON.stringify(Object.assign(e.worldState(), { at: { x: e.yaw.position.x, y: e.yaw.position.y, z: e.yaw.position.z, ry: e.yaw.rotation.y }, done: false, t: Date.now() })); });
    const key = await p.evaluate(() => 'mz.encounters.checkpoint');
    await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
    await p.evaluate(([k, v]) => localStorage.setItem(k, v), [key, st]);
    await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await toPlay(p, 600000);
    await p.waitForTimeout(45000);
    const L = await p.evaluate(() => window.__enc.loads());
    const late = L.log.filter(r => r.late && r.kind === 'parse');
    const secs = r => ((r.t1 - L.revealAt) / 1000).toFixed(1);
    console.log(`${ch} CONTINUE: parses ${L.log.filter(r => r.kind === 'parse').length}, LATE ${late.length} [${late.map(r => r.key + '+' + secs(r) + 's').join(', ')}]`);
  } catch (e) { console.log(ch + ': PROBE FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
await b.close();
