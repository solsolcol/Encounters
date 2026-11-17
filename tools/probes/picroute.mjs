/* v26.18 · THE PICTURES A BROWSER DIMS, PROVED HERE (Chad, 17 Nov 2026: his Samsung Internet decodes every picture at
   0.70 of itself). For each mode the page is opened on a light chapter and asked what the picture check measured and
   chose, then three of the game's own pictures (a JPEG, a WebP with alpha or not, a PNG) are decoded THE GAME'S WAY and
   their pixels handed back here, to be compared with the same pictures decoded in the plain mode:
     plain          no simulation: the check must find nothing and keep the browser's own decode (route native);
     dim            ?picsim=dim, his phone as measured (the page's decodes 0.7): route worker, pixels IDENTICAL to plain;
     dimall         ?picsim=dimall (the worker's too): route readback, every value within 1 of plain;
     dim-off        ?picsim=dim&opt=picRoute:0, his phone as it was: the pictures 0.7 (the simulation itself proved);
   It exits non-zero if any of that does not hold.
     CHROMIUM_PATH=... ENC_DIST=<snapshot of dist> node tools/probes/picroute.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { LAUNCH, PAGE } from '../../testlib.mjs';

const DIST = process.env.ENC_DIST || 'dist';
const pick = (re) => fs.readdirSync(path.join(DIST, 'assets')).filter(f => re.test(f)).map(f => 'assets/' + f).sort((a, b) => fs.statSync(path.join(DIST, a)).size - fs.statSync(path.join(DIST, b)).size)[0];
const PICS = [pick(/^icontorch\..*\.jpg$/), pick(/^w3t_sign\..*\.webp$/), pick(/\.png$/)].filter(Boolean);
const MODES = { plain: '', dim: '&picsim=dim', dimall: '&picsim=dimall', 'dim-off': '&picsim=dim&opt=picRoute:0' };
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const b = await chromium.launch(LAUNCH);
const got = {};
let fails = 0;
for (const [mode, q] of Object.entries(MODES)) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(PAGE + '?ch=ch1' + q, { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  const r = await p.evaluate(async (pics) => {
    const out = { route: await window.__enc.picRoute(), pics: [] };
    for (const u of pics) {
      const blob = await (await fetch(u)).blob();
      const bmp = await createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
      /* (read back as a texture holds it, unpremultiplied: a 2D canvas would lose the colour under every clear pixel) */
      const cv = document.createElement('canvas'); cv.width = cv.height = 1;
      const gl = cv.getContext('webgl'), t = gl.createTexture(), fb = gl.createFramebuffer(), d = new Uint8Array(bmp.width * bmp.height * 4);
      gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      gl.readPixels(0, 0, bmp.width, bmp.height, gl.RGBA, gl.UNSIGNED_BYTE, d);
      gl.getExtension('WEBGL_lose_context').loseContext();
      let s = '';
      for (let i = 0; i < d.length; i += 8192) s += String.fromCharCode.apply(null, d.subarray(i, i + 8192));
      out.pics.push({ u, w: bmp.width, h: bmp.height, b64: btoa(s) });
    }
    return out;
  }, PICS);
  got[mode] = r;
  log(mode, 'route', r.route.route, JSON.stringify(r.route.m), r.route.why || '', errs.length ? 'ERRORS ' + errs.slice(0, 2).join(' / ') : '');
  if (errs.length) fails++;
  await ctx.close();
}
await b.close();
const px = (o) => Buffer.from(o.b64, 'base64');
const cmp = (A, B) => { let max = 0, sum = 0, n = 0, ratio = 0, rn = 0;
  for (let i = 0; i < A.length; i += 4) for (let k = 0; k < 4; k++) { const e = Math.abs(A[i + k] - B[i + k]); if (e > max) max = e; sum += e; n++; if (k < 3 && A[i + k] > 40) { ratio += B[i + k] / A[i + k]; rn++; } }
  return { max, mean: +(sum / n).toFixed(3), ratio: +(ratio / rn).toFixed(3) }; };
const want = { plain: 'native', dim: 'worker', dimall: 'readback', 'dim-off': 'native' };
/* (alpha is compared too: k runs to 4; the ratio is read on colour only, where a value is over 40) */
for (const mode of Object.keys(MODES)) {
  const r = got[mode]; if (r.route.route !== want[mode]) { fails++; log(mode, 'ROUTE', r.route.route, 'wanted', want[mode]); }
  if (mode === 'plain') continue;
  r.pics.forEach((o, i) => {
    const c = cmp(px(got.plain.pics[i]), px(o)), name = path.basename(o.u);
    const ok = mode === 'dim' ? c.max === 0 : mode === 'dimall' ? c.max <= 1 : Math.abs(c.ratio - 0.7) < 0.02;
    if (!ok) fails++;
    log(mode, name, o.w + 'x' + o.h, 'against plain: max', c.max, 'mean', c.mean, 'ratio', c.ratio, ok ? 'ok' : 'FAIL');
  });
}
log(fails ? fails + ' FAILED' : 'all held');
process.exit(fails ? 1 : 0);
