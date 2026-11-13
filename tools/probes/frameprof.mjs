/* v26.5 · WHERE A FRAME'S TIME GOES, measured (Chad, 13 Nov 2026: "Think about how to optimize this chapter with
   absolutely no compression or reduction in detail or visual tricks or lod, or hiding things or risking a degraded
   presentation at the slightest, think about how to optimize on a low level engine optimization or bare metal
   optimization to improve performance and efficiency in this chapter without touching anything visual.")

   Measure first, before anything moves (v8.4). The chapter is booted on a phone's frame as e4c3beats boots it, the lens
   put at each spot named, and the page's main thread sampled by Chrome's own profiler (CDP Profiler, every 200 us) while
   the game runs there for SECS seconds of wall time. Reported per spot: the frames drawn and the main thread's time a
   frame, split by function (self time, the top TOP of them) and by kind (the engine's renderer, the animation, the
   chapter's own ticks, the garbage collector, the rest), the draw calls and triangles of one frame of the world, and the
   heap's growth over the window (what the collector will have to take back). This box draws in software, so the GPU's
   own cost is not what a phone's is: the CPU side is what this measures, and that is the side a phone heats with.

     CHROMIUM_PATH=... [SECS=8] [TOP=40] [SPOTS=spawn,masters,crowd,tables] OUT=<file.json> node tools/probes/frameprof.mjs
*/
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const SECS = +(process.env.SECS || 8), TOP = +(process.env.TOP || 40), OUT = process.env.OUT || '/tmp/frameprof.json';
const WANT = (process.env.SPOTS || 'spawn,masters,crowd,tables').split(',');
const ALLOC = !!process.env.ALLOC;
/* where the lens stands: [x, z, yaw deg, pitch deg] (yaw 0 looks north, -z; 90 west). The masters' row is before the brown
   hermit's sofa; the crowd's spot is where nine people stand within 2.2 m (measured, v26.4: x -6.4, z 4.6); the tables
   are the offering tables with their candles and haze */
const SPOTS = { spawn: null, masters: [-9.45, -2.2, 90, -20], crowd: [-6.4, 4.6, 0, -15], tables: [0.2, -8.2, 0, -10] };
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c3', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.dayClock.t > 0.5; } catch { return false; } }, null, { timeout: 600000, polling: 500 });
log('in play');
const cdp = await ctx.newCDPSession(p);
await cdp.send('Profiler.enable');
await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
const report = { secs: SECS, spots: {} };
for (const name of WANT) {
  const at = SPOTS[name];
  if (at) await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; E.yaw.position.x = v[0]; E.yaw.position.z = v[1]; E.yaw.rotation.y = v[2] * d; E.pitch.rotation.x = v[3] * d; }, at);
  await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
  /* one frame of the world, counted (the renderer's info resets on each of the engine's renders: read straight after one) */
  const info = await p.evaluate(() => { const E = window.__enc, R = E.renderer; R.render(E.scene, E.camera); return { calls: R.info.render.calls, triangles: R.info.render.triangles, programs: (R.info.programs || []).length, geometries: R.info.memory.geometries, textures: R.info.memory.textures }; });
  const heap0 = await p.evaluate(() => (performance.memory ? performance.memory.usedJSHeapSize : 0));
  await p.evaluate(() => { window.__fp = 0; const f = () => { window.__fp++; window.__fpr = requestAnimationFrame(f); }; window.__fpr = requestAnimationFrame(f); });
  if (ALLOC) await cdp.send('HeapProfiler.startSampling', { samplingInterval: 1024 });
  await cdp.send('Profiler.start');
  const t0 = Date.now(); await new Promise(r => setTimeout(r, SECS * 1000)); const wall = (Date.now() - t0) / 1000;
  const { profile } = await cdp.send('Profiler.stop');
  /* ALLOC=1: where the frame makes memory it throws away (the heap's own sampler, every 1 KB allocated): the sites by
     bytes a frame, so the speed-up that removes them reuses exactly those (v26.6 plan, item 1) */
  let alloc = null;
  if (ALLOC) { const { profile: hp } = await cdp.send('HeapProfiler.stopSampling'); const by = new Map();
    const walk = (n) => { const c = n.callFrame, file = (c.url || '').split('/').pop().replace(/\.[0-9a-f]{8,}\./, '.'), key = (c.functionName || '(anonymous)') + ' ' + file + ':' + (c.lineNumber + 1);
      const self = (n.selfSize || 0); if (self) by.set(key, (by.get(key) || 0) + self); for (const ch of n.children || []) walk(ch); };
    walk(hp.head); alloc = by; }
  const frames = await p.evaluate(() => { cancelAnimationFrame(window.__fpr); return window.__fp; });
  const heap1 = await p.evaluate(() => (performance.memory ? performance.memory.usedJSHeapSize : 0));
  /* self time by node, then by function */
  const byId = new Map(profile.nodes.map(n => [n.id, n])), self = new Map();
  for (let i = 0; i < profile.samples.length; i++) { const dt = (profile.timeDeltas[i + 1] || 0) / 1000; self.set(profile.samples[i], (self.get(profile.samples[i]) || 0) + dt); }
  const byFn = new Map(), kinds = { idle: 0, gc: 0, program: 0, chapter: 0, engine: 0, other: 0 };
  for (const [id, ms] of self) { const n = byId.get(id), c = n.callFrame, file = (c.url || '').split('/').pop().replace(/\.[0-9a-f]{8,}\./, '.');
    const key = (c.functionName || '(anonymous)') + ' ' + file + ':' + (c.lineNumber + 1);
    byFn.set(key, (byFn.get(key) || 0) + ms);
    if (c.functionName === '(idle)') kinds.idle += ms; else if (c.functionName === '(garbage collector)') kinds.gc += ms; else if (c.functionName === '(program)') kinds.program += ms;
    else if (/e4c3/.test(file)) kinds.chapter += ms; else if (/bundle|main/.test(file)) kinds.engine += ms; else kinds.other += ms; }
  const per = (ms) => +(ms / Math.max(1, frames)).toFixed(3);
  const top = [...byFn].filter(([k]) => !/^\(idle\)/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, TOP).map(([k, ms]) => ({ fn: k, msFrame: per(ms), share: +(ms / (wall * 1000)).toFixed(3) }));
  report.spots[name] = { frames, fps: +(frames / wall).toFixed(2), info, heapGrowthMB: +((heap1 - heap0) / 1e6).toFixed(2), msFrame: Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, per(v)])), top };
  if (alloc) report.spots[name].allocKBFrame = [...alloc].sort((a, b) => b[1] - a[1]).slice(0, TOP).map(([k, b]) => ({ fn: k, kbFrame: +(b / 1024 / Math.max(1, frames)).toFixed(2) }));
  log(name, JSON.stringify({ frames, fps: report.spots[name].fps, info, msFrame: report.spots[name].msFrame }));
}
report.errs = errs;
fs.writeFileSync(OUT, JSON.stringify(report, null, 1));
log('written', OUT, 'errs', errs.length);
await b.close();
