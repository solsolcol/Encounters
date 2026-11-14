/* v26.11 · WHERE THE LOAD'S TIME GOES ON THE THREAD THAT DRAWS (the speed-ups' third, "loading on other cores": Chad, 13 Nov
   2026, "think true engine level, multithreading, bare metal optimization, removing overhead"). Measure first (v8.4).

   The page is opened on a phone's frame (a touch device, v14.5) with Chrome's own profiler sampling the main thread from
   before the page loads until play begins (Start pressed, the opening film skipped as testlib's toPlay does), and every
   long task (50 ms or more without a break: a stall, were the world on screen) recorded with when it began and how long
   it held the thread. Reported: the wall time to play, the main thread's busy time by kind (the models' parse, the
   pictures' decode and upload, the shaders, the chapter's own building, the collector, the rest) and the top functions by
   self time, and the long tasks. This box draws in software, so an upload or a shader's compile costs what SwiftShader
   makes it cost, not a phone's; the JavaScript is the same code a phone runs.

     CHROMIUM_PATH=... [CH=e4c3] [TOP=40] [QS='&opt=...'] [EVAL=<file>] OUT=<file.json> node tools/probes/loadprof.mjs
*/
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c3', TOP = +(process.env.TOP || 40), OUT = process.env.OUT || '/tmp/loadprof.json';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });
await p.addInitScript(() => {
  window.__long = [];
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__long.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch {}
});
const cdp = await ctx.newCDPSession(p);
await cdp.send('Profiler.enable');
await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
await cdp.send('Profiler.start');
const T0 = Date.now();
await p.goto(PAGE + '?ch=' + CH + (process.env.QS || ''), { waitUntil: 'load', timeout: 600000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 600000 });
const tBoot = Date.now() - T0;
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1800000);
await p.waitForFunction(() => { try { return window.__enc.getState() === 'play'; } catch { return false; } }, null, { timeout: 600000, polling: 200 });
const tPlay = Date.now() - T0;
const { profile } = await cdp.send('Profiler.stop');
const long = await p.evaluate(() => window.__long);
/* (EVAL=<file>: an expression read from a file, evaluated once play has begun, its answer kept in the report: a census) */
const extra = process.env.EVAL ? await p.evaluate(new Function('const E = window.__enc; return (' + fs.readFileSync(process.env.EVAL, 'utf8') + ');')).catch(e => 'THREW ' + e.message) : null;

/* self time by node, then by function and by kind */
const nodes = new Map(); for (const n of profile.nodes) nodes.set(n.id, n);
const self = new Map(); const dts = profile.timeDeltas; let total = 0;
for (let i = 0; i < profile.samples.length; i++) { const id = profile.samples[i], dt = (dts[i + 1] || 0) / 1000; self.set(id, (self.get(id) || 0) + dt); total += dt; }
const fn = new Map(), kind = new Map();
const kindOf = (cf) => {
  const nm = cf.functionName || '', url = cf.url || '';
  if (nm === '(idle)') return 'idle';
  if (nm === '(garbage collector)') return 'gc';
  if (nm === '(program)') return 'program';
  if (/texImage2D|texSubImage2D|texStorage2D|uploadTexture|generateMipmap|compressedTexImage/i.test(nm)) return 'pictures: upload';
  if (/compileShader|linkProgram|getProgramParameter|getShaderParameter|getProgramInfoLog|WebGLProgram|getUniforms|fetchAttributeLocations/i.test(nm)) return 'shaders';
  if (/createImageBitmap|decode|ImageBitmap|loadTextureImage|loadImageSource/i.test(nm)) return 'pictures: decode';
  if (/GLTF|parse|loadBuffer|loadAccessor|loadMesh|loadNode|loadSkin|loadAnimation|JSON/i.test(nm) && !/e4c3|e\dc\d|ch\d/.test(url)) return 'models: parse';
  if (/\/chapters\/|e4c3|e\dc\d\.|\/ch\d/.test(url) || /e4c3\./.test(url)) return 'the chapter';
  if (/three|game\.|bundle/.test(url)) return 'engine and three';
  return 'other';
};
for (const [id, ms] of self) {
  const n = nodes.get(id), cf = n.callFrame, key = (cf.functionName || '(anon)') + ' ' + (cf.url || '').split('/').pop() + ':' + (cf.lineNumber + 1);
  fn.set(key, (fn.get(key) || 0) + ms); const k = kindOf(cf); kind.set(k, (kind.get(k) || 0) + ms);
}
const out = {
  ch: CH, qs: process.env.QS || '', msToBoot: tBoot, msToPlay: tPlay, msSampled: Math.round(total),
  kinds: Object.fromEntries([...kind].sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, Math.round(v)])),
  top: [...fn].sort((a, b) => b[1] - a[1]).slice(0, TOP).map(([k, v]) => ({ fn: k, ms: Math.round(v) })),
  longTasks: { count: long.length, msTotal: long.reduce((s, x) => s + x[1], 0), longest: long.slice().sort((a, b) => b[1] - a[1]).slice(0, 12) },
  extra, errs,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('to play', (tPlay / 1000).toFixed(0) + 's', 'main thread', JSON.stringify(out.kinds), 'long tasks', out.longTasks.count, out.longTasks.msTotal + 'ms', 'errs', errs.length);
await b.close();
process.exit(errs.length ? 1 : 0);
