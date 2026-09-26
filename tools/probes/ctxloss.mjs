/* v15: THE LOST-CONTEXT DRILL. iOS drops a page's WebGL context under memory
   pressure; three restores it by re-uploading what the CPU still holds, which
   leaves out the room environment (a PMREM render target) and the shadow maps.
   With the engine's loop held, this draws the SAME frame before the loss and
   after the restore and compares every pixel — with the fix (OPT.ctxRestore)
   and, in a second page, without it, so the drill shows what it guards.
   Usage: node tools/probes/ctxloss.mjs <chapter…> */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) for (const fix of [true, false]) {
  const ctx = await b.newContext({ viewport: { width: 960, height: 600 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {           // a rAF that can be held, so the world stands still
    const raf = window.requestAnimationFrame.bind(window), held = [];
    window.__hold = false;
    window.requestAnimationFrame = (f) => window.__hold ? (held.push(f), 0) : raf(f);
    window.__release = () => { window.__hold = false; const h = held.splice(0); for (const f of h) raf(f); };
  });
  try {
    await p.goto(PAGE + '?ch=' + ch + (fix ? '' : '&opt=ctxRestore:0'), { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await toPlay(p, 900000);
    await p.waitForTimeout(8000);
    const r = await p.evaluate(async () => {
      const E = window.__enc, R = E.renderer, gl = R.getContext();
      window.__hold = true;
      await new Promise(res => setTimeout(res, 400));      // the loop has stopped asking for frames
      const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
      const draw = (first) => {
        /* the first draw settles the shadow maps; after the restore, the maps
           are redrawn only if the engine asked for it — as its frame would */
        R.shadowMap.needsUpdate = first || E.shadowDirty > 0;
        R.render(E.scene, E.camera);
        const px = new Uint8Array(W * H * 4);
        gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
        return px;
      };
      const a = draw(true);
      const ext = gl.getExtension('WEBGL_lose_context');
      const lost = new Promise(res => R.domElement.addEventListener('webglcontextlost', res, { once: true }));
      ext.loseContext(); await lost;
      const back = new Promise(res => R.domElement.addEventListener('webglcontextrestored', res, { once: true }));
      ext.restoreContext(); await back;
      await new Promise(res => setTimeout(res, 50));
      const b2 = draw(false);
      let diff = 0, maxd = 0;
      for (let i = 0; i < a.length; i += 4) {
        const d = Math.max(Math.abs(a[i] - b2[i]), Math.abs(a[i + 1] - b2[i + 1]), Math.abs(a[i + 2] - b2[i + 2]));
        if (d) { diff++; if (d > maxd) maxd = d; }
      }
      window.__release();
      return { pixels: W * H, diff, maxd, envReady: !!E.scene.environment };
    });
    console.log(`${ch} ${fix ? 'WITH the fix   ' : 'WITHOUT the fix'}: ${r.diff} of ${r.pixels} pixels differ after the restore (max ${r.maxd}/255)` +
                (errs.length ? '  ERRORS ' + errs.slice(0, 2).join(' | ') : ''));
  } catch (e) { console.log(ch + ': PROBE FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
await b.close();
