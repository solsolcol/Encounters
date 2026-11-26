/* v28.0 (R186) · the table's look spots at the seat, read once: state, classes, the engine's offered spot, each spot's
   enabled / reach / place on the screen and its angle from the middle (one-off debug, kept as a probe for the next time)
     ENC_DIST=<snapshot> CHROMIUM_PATH=... node tools/probes/e4c5tabledbg.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage();
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.applyPhase('table:m'));
await p.waitForTimeout(6000);
await p.keyboard.press('KeyV');
await p.waitForTimeout(5000);
const read = () => p.evaluate(() => { const E = window.__enc; let cam = null; E.yaw.traverse(o => { if (!cam && o.isCamera) cam = o; });
  E.yaw.updateMatrixWorld(true); const C = cam.getWorldPosition(new cam.position.constructor()), F = cam.getWorldDirection(new cam.position.constructor());
  const out = { state: E.getState(), body: document.body.className, hotspot: E.kitDebug().hotspot, yaw: E.yaw.rotation.y, pitch: E.pitch.rotation.x, pos: [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z], fov: cam.fov,
    vision: E.kit.vision ? E.kit.vision() : null, spots: [] };
  for (const h of E.stage.hotspots) { if (!/^look/.test(h.id)) continue; const T = new cam.position.constructor(h.pos.x - C.x, h.pos.y - C.y, h.pos.z - C.z).normalize();
    const n = new cam.position.constructor(h.pos.x, h.pos.y, h.pos.z).project(cam);
    out.spots.push({ id: h.id, en: h.enabled(), done: !!h.done, aimDot: !!h.aimDot, aim: h.aim, d: +Math.hypot(E.yaw.position.x - h.pos.x, E.yaw.position.z - h.pos.z).toFixed(2), off: +Math.acos(Math.max(-1, Math.min(1, F.dot(T)))).toFixed(3), ndc: [+n.x.toFixed(3), +n.y.toFixed(3), +n.z.toFixed(3)] }); }
  return out; });
console.log('SEAT', JSON.stringify(await read()));
/* turned down onto the middle mark, by the pitch alone, in small steps: what the engine offers at each */
for (const dp of [-0.1, -0.2, -0.3, -0.4, -0.5, -0.6]) {
  await p.evaluate((dp) => { const E = window.__enc; E.__p0 = E.__p0 ?? E.pitch.rotation.x; E.pitch.rotation.x = E.__p0 + dp; }, dp);
  await p.waitForTimeout(2500);
  const r = await read(); console.log('PITCH', dp, JSON.stringify({ pitch: r.pitch, hotspot: r.hotspot, offs: r.spots.map(s => s.off), ndc: r.spots.map(s => s.ndc), body: /aimdot/.test(r.body) }));
  console.log('  more', JSON.stringify(await p.evaluate(() => { const E = window.__enc, k = E.kitDebug(), it = document.getElementById('interact'), tx = document.getElementById('itxt');
    return { ev: k.event ? Object.keys(k.event).slice(0, 6) : null, hotspots: k.hotspots, interactHidden: it ? it.classList.contains('hide') : 'none', itxt: tx ? tx.textContent : null,
             near: [...document.querySelectorAll('#hotmarks .hmark')].filter(m => m.style.display !== 'none').map(m => m.className + '@' + m.style.transform), st: E.getState(),
             pile: E.stage.pile ? { d: +E.stage.pile.dist().toFixed(2), inView: E.stage.pile.inView() } : null }; })));
}
await b.close();
