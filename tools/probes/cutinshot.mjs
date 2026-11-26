/* v28.0 (R185) · THE CUT-IN PHOTOGRAPHED (kit.cutIn, the seventy-eighth seam) on each screen shape, as episode 4 chapter 5's
   TOGETHER calls it (its two portraits, its word, 2.0 s): ?ch=e4c5, Start, the opening film skipped to play, the cut-in
   asked for, and photographed as its own clock passes each moment of TIMES (its animations' currentTime, read, never set),
   with the measure of what it laid: the band's height and slant main.js wrote, each band's box and its picture's drawn size.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [VIEWS=phone,desk,wide] [TIMES=0.15,0.45,0.9,1.4,1.8] [OUT=dir]
       node tools/probes/cutinshot.mjs   (through tools/bslot.sh) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const SHAPES = { phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
                 low: { viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
                 desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
                 laptop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
                 wide: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
                 tall: { viewport: { width: 1024, height: 1366 }, deviceScaleFactor: 1, hasTouch: true } };
const VIEWS = (process.env.VIEWS || 'phone,desk,wide').split(',').filter(Boolean);
const TIMES = (process.env.TIMES || '0.15,0.45,0.9,1.4,1.8').split(',').map(Number);
const OUT = process.env.OUT || '/tmp/cutinshot'; fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(...a);
const b = await chromium.launch(LAUNCH);
let bad = 0;
for (const v of VIEWS) {
  const ctx = await b.newContext(SHAPES[v]); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  await toPlay(p, 1500000);
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
  await p.waitForTimeout(3000);
  /* (the pictures loaded before the cut-in is asked for, as the fight's TOGETHER has them: the chapter declares them) */
  const asked = await p.evaluate(() => window.__enc.kit.cutIn({ a: 'p5cutpho', b: 'p5cutzav', word: 'TOGETHER', secs: 2.0 }));
  log(v, 'asked', asked);
  const at = () => p.evaluate(() => { const r = document.getElementById('cutIn'); if (!r || !r.classList.contains('on')) return -1;
    const A = r.getAnimations({ subtree: true }); return A.length ? (+A[0].currentTime || 0) / 1000 : -1; });
  for (const T of TIMES) {
    let t = await at(); const t0 = Date.now();
    while (t >= 0 && t < T && Date.now() - t0 < 600000) { await p.waitForTimeout(40); t = await at(); }
    if (t < 0) { log(v, 'the cut-in ended before', T); bad++; break; }
    const f = `${OUT}/cutin-${v}-${T.toFixed(2)}.png`; await p.screenshot({ path: f });
    const m = await p.evaluate(() => { const r = document.getElementById('cutIn'), cs = getComputedStyle(r);
      const box = (el) => { if (!el) return null; const q = el.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)]; };
      const band = (c) => { const B = r.querySelector('.ciBand.' + c), P = B && B.querySelector('.ciPic'), I = P && P.querySelector('img');
        return { band: box(B), pic: box(P), img: I ? { nat: [I.naturalWidth, I.naturalHeight], box: box(I) } : (P ? P.tagName : null), clip: P ? getComputedStyle(P).clipPath : null }; };
      const A = r.getAnimations({ subtree: true });
      return { t: A.length ? (+A[0].currentTime || 0) / 1000 : -1, wide: r.classList.contains('wide'), H: cs.getPropertyValue('--ciH').trim(), E: cs.getPropertyValue('--ciE').trim(),
               a: band('a'), b: band('b'), word: box(r.querySelector('.ciWord')), win: [innerWidth, innerHeight] }; });
    log(v, 'picture', f, JSON.stringify(m));
  }
  log(v, 'errors', JSON.stringify(errs.filter(e => !/favicon|net::ERR/.test(e))));
  await ctx.close();
}
await b.close();
process.exit(bad ? 1 : 0);
