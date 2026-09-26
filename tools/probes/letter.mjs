/* v15: the LETTERBOX scissor, proven: inside the visible band (between the two
   bars' rects) the scissored frame must equal the full frame pixel for pixel.
   Also reports whether the band was armed and its share of the canvas. */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH);
let bad = 0;
for (const [ch, vw, vh] of [['ch1', 960, 600], ['e2c1', 390, 844], ['ch3', 960, 600]]) {
  const p = await (await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 })).newPage();
  p.setDefaultNavigationTimeout(240000);
  await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load' });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.click('#startBtn', { timeout: 300000 });
  await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 600000 });
  await p.waitForFunction(() => !!window.__enc.letterbox(), null, { timeout: 120000, polling: 200 }).catch(() => {});
  for (const t of [8, 16, 24]) {
    await p.evaluate(tt => window.__enc.cine.seek(tt), t);
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const E = window.__enc, R = E.renderer, gl = R.getContext(), L = E.letterbox();
      if (!L) return { armed: false };
      const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, pr = R.getPixelRatio();
      const shot = (sc) => { R.shadowMap.needsUpdate = false; E.cullInstances(false);
        if (sc) { R.setScissor(0, L.y, L.w, L.h); R.setScissorTest(true); }
        R.render(E.scene, E.camera); R.setScissorTest(false);
        const px = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px); return px; };
      const A = shot(false), B = shot(true);
      const y0 = Math.ceil(L.y * pr), y1 = Math.floor((L.y + L.h) * pr);   // GL rows, bottom-up
      let diff = 0;
      for (let y = y0; y < y1; y++) for (let x = 0; x < W * 4; x++) { const i = y * W * 4 + x; if (A[i] !== B[i]) diff++; }
      return { armed: true, band: +(L.h / (H / pr)).toFixed(3), rows: y1 - y0, diff };
    });
    if (!r.armed) { console.log(`${ch} t=${t}: letterbox not armed`); bad++; continue; }
    if (r.diff) bad++;
    console.log(`${ch} ${vw}x${vh} t=${t}: band ${Math.round(r.band * 100)}% of the height (${r.rows} rows) — ${r.diff ? 'DIFF ' + r.diff : 'identical inside the band'}`);
  }
  await p.context().close();
}
console.log(bad ? `\n${bad} PROBLEMS` : '\nletterbox proven');
await b.close(); process.exit(bad ? 1 : 0);
