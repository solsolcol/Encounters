/* v15: what a chapter HOLDS on the GPU once it is in play — three's own
   counters (geometries, textures, programs), the parses the load tracker saw,
   and the texel bytes of every distinct texture image the world and the
   viewmodel reference (w × h × 4, × 4/3 when mipmapped). Also the bone-texture
   uploads over 40 drawn frames (texSubImage2D on a FLOAT texture), which is
   what OPT.boneSkip removes for a skeleton that did not move.
   Usage: node tools/probes/gpumem.mjs <chapter…> */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    const G = WebGL2RenderingContext.prototype, sub = G.texSubImage2D;
    window.__floatUploads = 0;
    G.texSubImage2D = function (...a) { if (a[7] === 0x1406) window.__floatUploads++; return sub.apply(this, a); };
  });
  try {
    await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await toPlay(p, 900000);
    await p.waitForTimeout(20000);
    const r = await p.evaluate(async () => {
      const E = window.__enc, R = E.renderer, info = R.info;
      const seen = new Set(); let bytes = 0;
      const add = (root) => root.traverse(o => {
        const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        for (const m of ms) for (const k in m) {
          const t = m[k]; if (!t || !t.isTexture || t.isDataTexture) continue;
          const src = t.source, img = src && src.data; if (!img || seen.has(src)) continue;
          seen.add(src);
          const w = img.width || 0, h = img.height || 0;
          bytes += w * h * 4 * (t.generateMipmaps && t.minFilter !== 1006 && t.minFilter !== 1003 ? 4 / 3 : 1);
        }
      });
      add(E.scene);
      const L = E.loads ? E.loads() : { log: [] };
      const f0 = window.__floatUploads, n0 = info.render.frame;
      await new Promise(res => { let n = 0; const step = () => (++n >= 40 ? res() : requestAnimationFrame(step)); requestAnimationFrame(step); });
      return { geos: info.memory.geometries, tex: info.memory.textures, progs: info.programs.length,
               parses: L.log.filter(x => x.kind === 'parse').length, images: seen.size, texMB: +(bytes / 1048576).toFixed(1),
               boneUploadsPerFrame: +((window.__floatUploads - f0) / Math.max(1, info.render.frame - n0) * 2).toFixed(2) };
    });
    console.log(ch + ': ' + JSON.stringify(r));
  } catch (e) { console.log(ch + ': PROBE FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
await b.close();
