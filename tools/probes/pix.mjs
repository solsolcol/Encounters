/* v15: THE PIXEL-IDENTITY PROOF. In play, the world frozen between two renders in
   ONE task (nothing advances), draw the same frame with an optimization OFF and
   ON at eight headings and compare every pixel. Also reports the triangles each
   drew. Usage: node tools/probes/pix.mjs <optFlag> <chapter...> */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const flag = process.argv[2]; const chs = process.argv.slice(3);
const b = await chromium.launch(LAUNCH);
let bad = 0;
for (const ch of chs) {
  const PHONE = !!process.env.PHONE;
  const p = await (await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 } : { viewport: { width: 960, height: 600 } })).newPage();
  p.setDefaultNavigationTimeout(240000);
  try {
    await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load' });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 300000 }).catch(() => p.tap('#startBtn')); await toPlay(p, 900000);
    await p.waitForTimeout(3000);
    const r = await p.evaluate(async (flag) => {
      const E = window.__enc, R = E.renderer, gl = R.getContext(), cam = E.camera;
      const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
      const shot = () => { R.shadowMap.needsUpdate = false; E.cullInstances(false); if (flag === 'shadowTrim') E.shadowCasterSync(); R.render(E.scene, cam);
        const px = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px); return { px, tris: R.info.render.triangles, calls: R.info.render.calls }; };
      const base = E.yaw.rotation.y, out = [];
      for (let q = 0; q < 8; q++) {
        E.yaw.rotation.y = base + q * Math.PI / 4;
        E.opt[flag] = false; const A = shot();
        E.opt[flag] = true; const B = shot();
        let diff = 0, maxd = 0;
        for (let i = 0; i < A.px.length; i++) { const d = Math.abs(A.px[i] - B.px[i]); if (d) { diff++; if (d > maxd) maxd = d; } }
        out.push({ q, diff, maxd, trisOff: A.tris, trisOn: B.tris, callsOff: A.calls, callsOn: B.calls });
      }
      E.yaw.rotation.y = base; E.opt[flag] = true;
      return { W, H, out };
    }, flag);
    for (const o of r.out) { if (o.diff) bad++; console.log(`${ch} ${flag} heading ${o.q * 45}: ${o.diff ? 'DIFF ' + o.diff + ' bytes (max ' + o.maxd + ')' : 'identical'} | tris ${o.trisOff} -> ${o.trisOn} (${o.trisOff ? Math.round(100 * (1 - o.trisOn / o.trisOff)) : 0}% less) | calls ${o.callsOff} -> ${o.callsOn}`); }
  } catch (e) { console.log(ch + ': FAILED ' + e.message.split('\n')[0]); bad++; }
  await p.context().close();
}
console.log(bad ? `\n${bad} NOT IDENTICAL` : '\nevery frame identical');
await b.close();
process.exit(bad ? 1 : 0);
