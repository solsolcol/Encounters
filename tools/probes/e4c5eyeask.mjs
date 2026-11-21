/* The eye's ask beside a chapter's own button (v28.0, 21 Nov; PLAY's finding: the eye's "OPEN" lay over SMELL's top).
   Episode 4 chapter 5 in play, the eye asked to open (kit.visionUrge) with a chapter button under it (its own SMELL, or one
   made here), the ask measured as a box at the eye's smallest, its rest and its largest size (0.9, 1, 1.32) against every
   other HUD box on screen, on a phone (390 x 844, touch) and a desktop (1280 x 800); a full-size picture of the column each.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... node tools/probes/e4c5eyeask.mjs   (through tools/bslot.sh)  OUT=<dir for pictures> */
import { chromium } from 'playwright';
import fs from 'fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5eyeask'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const report = {};
for (const [name, opt] of [['phone', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }],
                           ['desktop', { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }]]) {
  const ctx = await b.newContext(opt); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  await toPlay(p, 1500000);
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
  await p.evaluate(() => window.__enc.stage.setPhase('hunt'));
  await new Promise(r => setTimeout(r, 6000));
  /* the ask held on, a chapter button under the eye (its own if it has one showing), every animation stopped */
  await p.evaluate(() => {
    const K = window.__enc.kit; window.__askHold = true;
    const tick = () => { if (!window.__askHold) return; try { K.visionUrge('open'); } catch {} requestAnimationFrame(tick); }; tick();
    const shown = [...document.querySelectorAll('.cBtn')].filter(e => getComputedStyle(e).display !== 'none');
    if (!shown.length) K.button('probeSmell', { label: 'SMELL', key: 'n' });
    const st = document.createElement('style'); st.id = 'askFreeze';
    st.textContent = '.visionBtn,.visionBtn::after,.cBtn{animation:none!important;transition:none!important}'; document.head.appendChild(st);
  });
  await new Promise(r => setTimeout(r, 1500));
  report[name] = { errs };
  for (const s of [0.9, 1, 1.32]) {
    const m = await p.evaluate((s) => {
      const vb = document.getElementById('visionBtn');
      vb.style.transform = 'scale(' + s + ')';
      const cs = getComputedStyle(vb, '::after');
      const R = (e) => { const r = e.getBoundingClientRect(); return { x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
      vb.style.transform = 'none'; const base = vb.getBoundingClientRect(); vb.style.transform = 'scale(' + s + ')';
      /* the ask's box from its own used values, laid about the eye's centre at the eye's scale */
      const w = parseFloat(cs.width) + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight),
            h = parseFloat(cs.height) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const beside = cs.right !== 'auto' && cs.left === 'auto';
      let lx, ly;
      if (beside) { lx = -parseFloat(cs.right) - w + base.width; ly = base.height / 2 - h / 2; lx = base.width - (parseFloat(cs.right) + w); }
      else { lx = base.width / 2 - w / 2; ly = parseFloat(cs.top); }
      const cx = base.width / 2, cy = base.height / 2;
      const ask = { x: +(base.left + cx + (lx - cx) * s).toFixed(1), y: +(base.top + cy + (ly - cy) * s).toFixed(1), w: +(w * s).toFixed(1), h: +(h * s).toFixed(1) };
      const eye = R(vb);
      /* every other HUD box on screen: the buttons, the objective, the captions, the hearts, the marks' labels */
      const others = [];
      for (const e of document.querySelectorAll('body *')) {
        if (e === vb || vb.contains(e) || e.closest('#visionBtn')) continue;
        const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) continue;
        if (e.tagName === 'CANVAS' || e.tagName === 'SCRIPT' || e.tagName === 'STYLE') continue;
        const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
        if (r.width > innerWidth * 0.9 && r.height > innerHeight * 0.9) continue;   // (full-screen layers)
        const hit = !(r.right <= ask.x || r.left >= ask.x + ask.w || r.bottom <= ask.y || r.top >= ask.y + ask.h);
        if (hit && !e.contains(vb)) others.push({ el: (e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + [...e.classList].join('.')).slice(0, 60), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
      }
      const cbs = [...document.querySelectorAll('.cBtn')].filter(e => getComputedStyle(e).display !== 'none').map(R);
      return { scale: s, beside, ask, eye, cbtns: cbs, overlaps: others, text: cs.content };
    }, s);
    report[name]['s' + s] = m;
  }
  await p.evaluate(() => { document.getElementById('visionBtn').style.transform = 'scale(1.32)'; });
  const vw = opt.viewport.width;
  await p.screenshot({ path: OUT + '/' + name + '-column.png', clip: { x: Math.max(0, vw - 260), y: 60, width: 260, height: 420 } });
  await p.evaluate(() => { document.getElementById('visionBtn').style.transform = ''; window.__askHold = false; });
  await ctx.close();
}
console.log(JSON.stringify(report, null, 1));
await b.close();
