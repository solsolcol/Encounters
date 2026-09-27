/* v15.2: THE FONTS, PROVEN. The test browser is the WIN/LINUX class (its
   user agent is HeadlessChrome on Linux, which Google answers exactly as it
   answers Chrome on Windows). Loads the hosted page twice — as built, and
   with `?fonts=google` (Google's own link) — in a context that lets the
   test browser reach Google through the sandbox's proxy, writes the same
   specimen in every family, weight and style the game asks for (with the
   Pali letters the teachings use) on a plain ground, waits until every face
   has loaded, and compares the two renderings pixel for pixel. Also asserts
   the built page asked Google for NOTHING and loaded its faces from
   /assets/fonts/, and that the Google leg really did load Google's (a leg
   that fell back to a system font would compare equal to nothing useful).
   Usage: node tools/probes/fontproof.mjs                                   */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { LAUNCH, PAGE } from '../../testlib.mjs';

const SPEC = [
  ['Archivo', 400, 'normal'], ['Archivo', 500, 'normal'], ['Archivo', 600, 'normal'],
  ['Inter', 400, 'normal'], ['Inter', 500, 'normal'], ['Inter', 600, 'normal'], ['Inter', 700, 'normal'],
  ['Cormorant Garamond', 500, 'normal'], ['Cormorant Garamond', 600, 'normal'], ['Cormorant Garamond', 500, 'italic'],
  ['JetBrains Mono', 400, 'normal'], ['JetBrains Mono', 500, 'normal'], ['JetBrains Mono', 700, 'normal'],
];
const TEXT = 'The Hell Note — 3 AM · 0123456789 · saṅkhāra vedanā manasikāra diṭṭhupādāna · “Wat Lahanrai” Ωé';

/* `--as=<label>` borrows a browser's user agent from tools/fontuas.txt, so
   the phone and Mac classes are exercised too (this Chromium still draws the
   text; what changes is which class the page picks and what Google answers) */
const AS = (process.argv.find(a => a.startsWith('--as=')) || '').slice(5);
const AS_UA = AS ? readFileSync(new URL('../fontuas.txt', import.meta.url), 'utf8').split('\n')
  .find(l => l.startsWith(AS + '|'))?.slice(AS.length + 1) : null;
if (AS && !AS_UA) throw new Error('no such browser in tools/fontuas.txt: ' + AS);
const b = await chromium.launch(LAUNCH);
const shots = {}, reqs = {};
for (const mode of ['self', 'google']) {
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 }, ignoreHTTPSErrors: true, deviceScaleFactor: 1,
                                   ...(AS_UA ? { userAgent: AS_UA } : {}) });
  /* the sandbox's proxy drops some of Chromium's own connections to Google,
     so the Google leg is fetched by curl — AS THIS BROWSER (its own user
     agent), byte for byte what Google answers it — and handed to the page */
  const UA = AS_UA || await b.newPage().then(async q => { const u = await q.evaluate(() => navigator.userAgent); await q.close(); return u; });
  await ctx.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    const u = route.request().url();
    const body = execFileSync('curl', ['-sS', '--fail', '--retry', '3', '--compressed', '-A', UA, u], { maxBuffer: 32 << 20 });
    const type = /googleapis/.test(u) ? 'text/css; charset=utf-8' : /\.woff2$/.test(u) ? 'font/woff2' : /\.woff$/.test(u) ? 'font/woff' : 'font/ttf';
    await route.fulfill({ status: 200, headers: { 'content-type': type, 'access-control-allow-origin': '*' }, body });
  });
  const p = await ctx.newPage();
  reqs[mode] = [];
  p.on('requestfinished', r => { const u = r.url(); if (/\.(woff2?|ttf)(\?|$)|fonts\.g|\/fonts\//.test(u)) reqs[mode].push(u); });
  p.on('requestfailed', r => { const u = r.url(); if (/\.(woff2?|ttf)(\?|$)|fonts\.g|\/fonts\//.test(u)) reqs[mode].push('FAILED ' + u + ' ' + (r.failure() || {}).errorText); });
  await p.goto(PAGE + (mode === 'google' ? '?fonts=google' : ''), { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  const faces = await p.evaluate(async ([SPEC, TEXT]) => {
    const box = document.createElement('div');
    box.id = 'fontSpecimen';
    box.style.cssText = 'position:fixed;left:0;top:0;width:1100px;padding:12px;background:#10131a;color:#e8e2d4;' +
                        'z-index:2147483647;font-size:22px;line-height:1.5;';
    for (const [fam, w, st] of SPEC) {
      const d = document.createElement('div');
      d.textContent = `${fam} ${w} ${st}: ${TEXT}`;
      d.style.cssText = `font-family:"${fam}";font-weight:${w};font-style:${st};white-space:nowrap;`;
      box.appendChild(d);
    }
    document.body.appendChild(box);
    await document.fonts.ready;
    const errs = [];
    await Promise.all(SPEC.map(([fam, w, st]) => document.fonts.load(`${st} ${w} 22px "${fam}"`, TEXT)
      .catch(e => errs.push(`${fam} ${w} ${st}: ${e.message}`))));
    if (errs.length) return { errs, faces: [...document.fonts].map(f => `${f.family} ${f.weight} ${f.style} ${f.unicodeRange.slice(0, 12)} ${f.status}`) };
    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    return SPEC.map(([fam, w, st]) => ({ face: `${fam} ${w} ${st}`, ok: document.fonts.check(`${st} ${w} 22px "${fam}"`, TEXT) }));
  }, [SPEC, TEXT]);
  if (faces.errs) { console.log(mode, 'FONT LOAD ERRORS', faces.errs, '\n', reqs[mode].slice(0, 10), '\n', faces.faces.filter(f => /error/.test(f)).slice(0, 10)); process.exit(1); }
  if (mode === 'self') shots.sheet = await p.evaluate(() => [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.getAttribute('href')));
  const el = await p.$('#fontSpecimen');
  shots[mode] = { png: await el.screenshot(), faces };
  await ctx.close();
}
await b.close();

const raw = async (png) => sharp(png).raw().toBuffer({ resolveWithObject: true });
const A = await raw(shots.self.png), B = await raw(shots.google.png);
let diff = 0, ink = 0;
const n = Math.min(A.data.length, B.data.length);
for (let i = 0; i < n; i += A.info.channels) {
  let d = false;
  for (let c = 0; c < A.info.channels; c++) if (A.data[i + c] !== B.data[i + c]) d = true;
  if (d) diff++;
  if (A.data[i] > 60) ink++;
}
const selfGoogle = reqs.self.filter(u => /googleapis|gstatic/.test(u));
const selfLocal = reqs.self.filter(u => /\/assets\/fonts\//.test(u));
const googleGot = reqs.google.filter(u => /gstatic/.test(u));
const out = {
  sameSize: A.info.width === B.info.width && A.info.height === B.info.height,
  size: `${A.info.width}x${A.info.height}`,
  pixelsDiffer: diff, inkPixels: ink,
  selfFacesLoaded: shots.self.faces.every(f => f.ok), googleFacesLoaded: shots.google.faces.every(f => f.ok),
  selfAskedGoogle: selfGoogle.length, selfLoadedLocal: selfLocal.length, googleLegFonts: googleGot.length,
  as: AS || 'this browser', selfStylesheet: shots.sheet,
};
console.log(JSON.stringify(out, null, 1));
if (!out.selfFacesLoaded) console.log('self faces:', JSON.stringify(shots.self.faces));
if (!out.googleFacesLoaded) console.log('google faces:', JSON.stringify(shots.google.faces));
const pass = out.sameSize && diff === 0 && ink > 5000 && out.selfFacesLoaded && out.googleFacesLoaded
          && selfGoogle.length === 0 && selfLocal.length > 0 && googleGot.length > 0;
console.log(pass ? 'PASS' : 'FAIL');
process.exit(pass ? 0 : 1);
