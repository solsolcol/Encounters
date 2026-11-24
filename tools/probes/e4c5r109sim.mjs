/* v28.0 (E4C5, R109/R114) · THE PHONE'S STALE DEPTH, MADE HERE: Spirit Vision reads the world's depth every frame; on a phone
   whose browser offers WEBGL_multisampled_render_to_texture, three never resolved it (src/vision.js), so the depth texture
   kept an old picture while the colour moved on. This browser never offers that extension, so the fault is made by hand:
   at the table, his sight open on his teacher, the depth's resolve is taken out of every blit after that moment (the
   colour's left in), then the look is turned and pictured. The fix keeps the vision's target off that extension, which this
   browser never offers, so this probe shows the fault with or without it: it proves the SYMPTOM (a print of him fixed on
   the screen while the room turns), which is what Chad saw on his phone.
     ENC_DIST=<snapshot> OUT=<dir> node tools/probes/e4c5r109sim.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5r109sim'; fs.mkdirSync(OUT, { recursive: true });
const SEAT = [0, 239.2, Math.PI, 1.02];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('table'));
await p.waitForFunction(() => window.__enc.stage.phase === 'table' && window.__enc.getState() === 'play', null, { timeout: 300000, polling: 500 });
const look = (turn, pitch) => p.evaluate(([x, z, ry, up, pt]) => { const E = window.__enc; E.yaw.position.set(x, up, z); E.yaw.rotation.y = ry; E.pitch.rotation.x = pt; }, [SEAT[0], SEAT[1], SEAT[2] + turn, SEAT[3], pitch]);
const pic = async (name) => { await frames(5); const f = `${OUT}/${name}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); };
await look(0, -0.3); await frames(6);
await p.evaluate(() => window.__enc.kit.vision(true));
await p.waitForFunction(() => { const v = window.__enc.vision(); return v.on && v.dir === 0; }, null, { timeout: 300000, polling: 300 });
await look(0, -0.3); await pic('open-0');
/* the phone's fault: from here the depth is never resolved again (only the colour is) */
say('freeze', await p.evaluate(() => { const c = document.querySelector('canvas'); const gl = c.getContext('webgl2'); if (!gl) return 'no gl';
  const blit = gl.blitFramebuffer.bind(gl); let n = 0;
  gl.blitFramebuffer = (a, b2, c2, d, e, f, g, h, mask, filter) => { if (mask & gl.DEPTH_BUFFER_BIT) n++; return blit(a, b2, c2, d, e, f, g, h, mask & ~gl.DEPTH_BUFFER_BIT, filter); };
  window.__depthDropped = () => n; return 'depth resolve dropped'; }));
for (const t of [-0.6, 0.6]) { await look(t, -0.3); await frames(4); await look(t, -0.3); await pic(`stale-${t}`); }
say('depth blits dropped', await p.evaluate(() => window.__depthDropped ? window.__depthDropped() : -1));
say('errors', errs.length ? errs.join(' / ') : 'none');
await b.close();
