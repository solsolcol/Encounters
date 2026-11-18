/* v27.0 (R51) · WHY A PROGRAM IS MADE AGAIN ON SCREEN. A chapter's opening film is started (as progs.mjs starts it), and
   at the film's first step and at a later one (AT, seconds of the film) every program the renderer holds for each
   material named in NAMES is listed with its cache key; for each material whose program was made again at AT, the key it
   was warmed with and the key it was drawn with are compared part by part, so the one setting that differs is named.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone AT=14.5 NAMES='BPY_PBRSource,BakedMaterial' node tools/probes/progdiff.mjs e4c4 */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const ch = process.argv[2] || 'e4c4', AT = +(process.env.AT || 14.5), NAMES = (process.env.NAMES || 'BPY_PBRSource').split(',');
const b = await chromium.launch(LAUNCH);
const ctx = process.env.VIEW === 'phone' ? await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })
                                         : await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.click('#startBtn', { timeout: 120000 });
await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 900000, polling: 200 });
const keys = (names) => p.evaluate((names) => { const E = window.__enc; return E.renderer.info.programs.filter(q => names.some(n => q.name === n || q.name.startsWith(n))).map(q => ({ id: q.id, name: q.name, key: String(q.cacheKey) })); }, names);
const frames = (k) => p.evaluate((k) => new Promise(res => { let n = 0; const f = () => (++n >= k ? res() : requestAnimationFrame(f)); requestAnimationFrame(f); }), k);
await p.evaluate(() => window.__enc.cine.seek(0)); await frames(3);
const before = await keys(NAMES);
const lights0 = await p.evaluate(() => { const n = {}; window.__enc.scene.traverse(o => { if (o.isLight) { const k = o.type + (o.visible ? '' : '(hidden)') + (o.castShadow ? '+sh' : ''); n[k] = (n[k] || 0) + 1; } }); return n; });
await p.evaluate((t) => window.__enc.cine.seek(t), AT); await frames(3);
const after = await keys(NAMES);
const lights1 = await p.evaluate(() => { const n = {}; window.__enc.scene.traverse(o => { if (o.isLight) { const k = o.type + (o.visible ? '' : '(hidden)') + (o.castShadow ? '+sh' : ''); n[k] = (n[k] || 0) + 1; } }); return n; });
console.log('lights at 0:', JSON.stringify(lights0)); console.log('lights at ' + AT + ':', JSON.stringify(lights1));
const had = new Set(before.map(q => q.id));
for (const q of after.filter(q => !had.has(q.id))) {
  const twin = before.filter(o => o.name === q.name);
  console.log(`made at ${AT}: ${q.name}; programs of that name before: ${twin.length}`);
  for (const o of twin) {
    const A = o.key.split(','), B = q.key.split(','), diff = [];
    for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) diff.push(`#${i}: ${String(A[i]).slice(0, 60)} -> ${String(B[i]).slice(0, 60)}`);
    console.log('   vs warmed: ' + (diff.length ? diff.join(' | ') : 'the same key'));
  }
}
if (errs.length) console.log('ERRORS', errs.slice(0, 3).join(' | '));
await b.close();
