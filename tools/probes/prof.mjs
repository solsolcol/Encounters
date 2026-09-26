/* v15 M0 — THE BASELINE PROFILE. For each chapter: into play, settle, then 20 s
   of play with the view slowly turning (deterministic), measured three ways:
   CDP Performance metrics (script / layout / style / task time per second),
   a CPU sampling profile (self time by function, GC included), and the
   renderer's own counters summed over BOTH passes per frame. Output: one JSON
   per run (argv[2] = label) so before/after can be diffed. */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const label = process.argv[2] || 'run';
const chs = process.argv.slice(3);
const SECS = +(process.env.SECS || 20);
const b = await chromium.launch(LAUNCH);
const out = {};
for (const ch of chs) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  p.setDefaultNavigationTimeout(240000);
  const errs = []; p.on('pageerror', e => errs.push(e.message.split('\n')[0]));
  try {
    await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load' });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 300000 });
    await toPlay(p, 900000);
    await p.waitForTimeout(6000);
    await p.evaluate(() => {
      const E = window.__enc, r = E.renderer;
      const acc = window.__acc = { frames: 0, calls: 0, tris: 0, renders: 0, maxCalls: 0 };
      if (!r.__wrapped) {
        const orig = r.render.bind(r); r.__wrapped = true;
        r.render = (s, c) => { orig(s, c); acc.renders++; acc.calls += r.info.render.calls; acc.tris += r.info.render.triangles; };
      }
      let last = 0;
      const f = () => { if (!window.__accStop) { acc.frames++; requestAnimationFrame(f); } };
      requestAnimationFrame(f);
      window.__turn = setInterval(() => { E.yaw.rotation.y += 0.02; }, 100);
    });
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Performance.enable');
    const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
    await cdp.send('Profiler.start');
    const w0 = Date.now();
    await p.waitForTimeout(SECS * 1000);
    const { profile } = await cdp.send('Profiler.stop');
    const wall = (Date.now() - w0) / 1000;
    const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
    const acc = await p.evaluate(() => { window.__accStop = true; clearInterval(window.__turn);
      const r = window.__enc.renderer; return { ...window.__acc, programs: r.info.programs ? r.info.programs.length : -1,
        geometries: r.info.memory.geometries, textures: r.info.memory.textures,
        heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : -1 }; });
    // self time per function from the sampling profile
    const byId = new Map(profile.nodes.map(n => [n.id, n]));
    const self = new Map();
    const dts = profile.timeDeltas; let total = 0;
    for (let i = 0; i < profile.samples.length; i++) {
      const n = byId.get(profile.samples[i]); const dt = (dts[i] || 0) / 1000; total += dt;
      const cf = n.callFrame; const url = (cf.url || '').split('/').pop().split('?')[0];
      const k = `${cf.functionName || '(anon)'} ${url}:${cf.lineNumber + 1}`;
      self.set(k, (self.get(k) || 0) + dt);
    }
    const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, v]) => [k, +(v / wall).toFixed(2)]);
    const d = k => (m1[k] || 0) - (m0[k] || 0);
    const res = {
      wall: +wall.toFixed(1), fps: +(acc.frames / wall).toFixed(2),
      perSec: { script: +(d('ScriptDuration') / wall * 1000).toFixed(1), task: +(d('TaskDuration') / wall * 1000).toFixed(1),
                layout: +(d('LayoutDuration') / wall * 1000).toFixed(1), style: +(d('RecalcStyleDuration') / wall * 1000).toFixed(1),
                layouts: +(d('LayoutCount') / wall).toFixed(1), styles: +(d('RecalcStyleCount') / wall).toFixed(1) },
      gcMsPerSec: +((self.get('(garbage collector) :0') || 0) / wall).toFixed(2),
      idleMsPerSec: +((self.get('(idle) :0') || 0) / wall).toFixed(1),
      perFrame: { renders: +(acc.renders / Math.max(1, acc.frames)).toFixed(2), calls: Math.round(acc.calls / Math.max(1, acc.frames)), tris: Math.round(acc.tris / Math.max(1, acc.frames)) },
      programs: acc.programs, geometries: acc.geometries, textures: acc.textures, heapMB: acc.heapMB,
      top, errs,
    };
    out[ch] = res;
    console.log(`${ch}: fps ${res.fps} | ms/s script ${res.perSec.script} task ${res.perSec.task} layout ${res.perSec.layout} style ${res.perSec.style} gc ${res.gcMsPerSec} | per frame ${res.perFrame.renders} renders, ${res.perFrame.calls} calls, ${res.perFrame.tris} tris | progs ${res.programs} geos ${res.geometries} tex ${res.textures} heap ${res.heapMB} MB | errs ${errs.length}`);
  } catch (e) { console.log(ch + ': PROBE FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
writeFileSync(`prof-${label}.json`, JSON.stringify(out, null, 1));
await b.close();
