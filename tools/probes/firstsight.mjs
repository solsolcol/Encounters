/* v15: does HER FIRST APPEARANCE compile shaders mid-play? ch1: into play, count
   programs, walk in facing the deck (ghosttest's first-sight spot), let the REAL
   frame loop run, and count programs created and the longest frame. */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const ch = process.argv[2] || 'ch1';
const b = await chromium.launch(LAUNCH);
const p = await (await b.newContext({ viewport: { width: 960, height: 600 } })).newPage();
p.setDefaultNavigationTimeout(240000);
await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load' });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.click('#startBtn', { timeout: 300000 }); await toPlay(p, 900000);
await p.waitForTimeout(8000);
const r = await p.evaluate(async () => {
  const E = window.__enc, gl = E.renderer.getContext();
  let made = 0; const cp = gl.createProgram.bind(gl); gl.createProgram = () => { made++; return cp(); };
  const lightsVis = () => { let n = 0; E.scene.traverse(o => { if (o.isLight && !o.isAmbientLight) { let v = true; for (let q = o; q; q = q.parent) if (!q.visible) { v = false; break; } if (v) n++; } }); return n; };
  const before = { progs: E.renderer.info.programs.length, lights: lightsVis(), ghostLightVis: (E.ghost.children.find(o => o.isLight) || {}).visible };
  E.yaw.position.set(-1, 1.62, -1.6); E.yaw.rotation.y = 0; E.yaw.updateMatrixWorld(true);
  const t0 = performance.now(); let last = t0, worst = 0, frames = 0, sawHer = false;
  await new Promise(res => { const f = () => { const now = performance.now(); worst = Math.max(worst, now - last); last = now; frames++;
    if (E.getReveal() > 0.3) sawHer = true; if (now - t0 < 20000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
  return { before, after: { progs: E.renderer.info.programs.length, lights: lightsVis(), ghostLightVis: (E.ghost.children.find(o => o.isLight) || {}).visible }, made, frames, worstMs: Math.round(worst), sawHer };
});
console.log(JSON.stringify(r));
await b.close();
