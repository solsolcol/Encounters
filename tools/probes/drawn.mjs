/* v26.0 · WHAT A FRAME DRAWS: the triangles and the draw calls the GPU is really handed in one frame of play, counted
   at the WebGL calls themselves (three's own counter resets on each of the engine's two renders a frame, and a
   chapter's census counts every visible mesh whether or not the lens holds it: neither is what a phone pays for).
   Each view is taken the way play reaches it: the chapter booted, the lens placed, a few frames let pass.
     CHROMIUM_PATH=... node tools/probes/drawn.mjs <chapter> ['name:x,y,z,yawDeg,pitchDeg;...']
   With no views the chapter's own spawn is measured, and a slow turn of the head through a full circle from it (the
   most and the least a player standing there can ask for). yaw 0 looks north (-z), 90 west. */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const ch = process.argv[2], VIEWS = (process.argv[3] || '').split(';').filter(Boolean).map(s => { const [name, r] = s.split(':'); const n = r.split(',').map(Number); return { name, x: n[0], y: n[1], z: n[2], yaw: n[3], pitch: n[4] || 0 }; });
if (!ch) { console.error('drawn.mjs <chapter> [views]'); process.exit(1); }
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => {
  const C = window.__drawn = { tris: 0, calls: 0 };
  for (const G of [WebGL2RenderingContext.prototype, WebGLRenderingContext.prototype]) {
    const de = G.drawElements, da = G.drawArrays, dei = G.drawElementsInstanced, dai = G.drawArraysInstanced;
    const n = (mode, count) => (mode === 4 ? count / 3 : mode === 5 || mode === 6 ? Math.max(0, count - 2) : 0);
    G.drawElements = function (mode, count, ...r) { C.tris += n(mode, count); C.calls++; return de.call(this, mode, count, ...r); };
    G.drawArrays = function (mode, first, count) { C.tris += n(mode, count); C.calls++; return da.call(this, mode, first, count); };
    if (dei) G.drawElementsInstanced = function (mode, count, type, off, inst) { C.tris += n(mode, count) * inst; C.calls++; return dei.call(this, mode, count, type, off, inst); };
    if (dai) G.drawArraysInstanced = function (mode, first, count, inst) { C.tris += n(mode, count) * inst; C.calls++; return dai.call(this, mode, first, count, inst); };
  }
});
await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(6000);
/* one frame's worth: the counters zeroed at one animation frame and read at the next but one (so a whole frame lies between) */
const oneFrame = () => p.evaluate(() => new Promise(res => { requestAnimationFrame(() => { const C = window.__drawn; C.tris = 0; C.calls = 0; let k = 0;
  const step = () => { if (++k >= 3) res({ tris: Math.round(C.tris / 3), calls: Math.round(C.calls / 3) }); else requestAnimationFrame(step); }; requestAnimationFrame(step); }); }));
const place = (v) => p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; if (v.x != null) E.yaw.position.set(v.x, v.y, v.z); E.yaw.rotation.y = v.yaw * d; E.pitch.rotation.x = (v.pitch || 0) * d; }, v);
const settle = () => p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 6 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
const out = [];
if (VIEWS.length) for (const v of VIEWS) { await place(v); await settle(); out.push([v.name, await oneFrame()]); }
else { const at = await p.evaluate(() => { const E = window.__enc; return { x: E.yaw.position.x, y: E.yaw.position.y, z: E.yaw.position.z, yaw: E.yaw.rotation.y * 180 / Math.PI }; });
  for (let k = 0; k < 8; k++) { await place({ yaw: at.yaw + k * 45, pitch: 0 }); await settle(); out.push(['spawn+' + k * 45, await oneFrame()]); } }
for (const [name, r] of out) console.log(ch.padEnd(8), name.padEnd(12), String(r.tris).padStart(9), 'triangles', String(r.calls).padStart(5), 'draw calls');
const worst = out.reduce((a, [, r]) => Math.max(a, r.tris), 0);
console.log(ch.padEnd(8), 'MOST'.padEnd(12), String(worst).padStart(9), 'triangles in one frame;', errs.length ? 'PAGE ERRORS ' + JSON.stringify(errs).slice(0, 300) : 'no page error');
await b.close();
