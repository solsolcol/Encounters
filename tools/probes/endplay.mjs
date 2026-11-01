/* v24.5: a chapter's ending PLAYED THROUGH WITH THE SOUND ON (a phone-sized touch context, as on Chad's phone): the
   decision opened by the stage's own applyPhase(PHASE) once the chapter has booted (or the engine's handle), the option
   TAPPED on its button, and the scene left to run on its own clock to the card. Reports the voice log on the audio
   clock (none over another), the cues heard, the scene's length, the card, every page error; photographs every
   EVERY seconds of the scene's clock and the card.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... CH=e3c5 PHASE=decide OPT=B [EVERY=8] [OUT=dir] node tools/probes/endplay.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e3c5', PHASE = process.env.PHASE || 'decide', OPT = process.env.OPT || 'A';
const EVERY = +(process.env.EVERY || 8);
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';   // (v24.5: desktop — a mouse clicks Start and the option)
const OUT = (process.env.OUT || '/tmp/endplay') + '-' + CH + '-' + OPT + (PHONE ? '' : '-desktop');
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const press = (x, y) => (PHONE ? p.touchscreen.tap(Math.round(x), Math.round(y)) : p.mouse.click(x, y));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
{ const r = await p.locator('#startBtn').boundingBox(); await press(r.x + r.width / 2, r.y + r.height / 2); }
await toPlay(p, 1500000);
await p.waitForTimeout(8000);                                       // the chapter's first frames (v9.3: boot before driving a phase)
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), PHASE);
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 120000, polling: 500 })
  .catch(() => p.evaluate(() => window.__enc.decide()));
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
await p.waitForTimeout(3000);
const v0 = await p.evaluate(() => window.__enc.voices().length), c0 = await p.evaluate(() => window.__enc.stings().length);
/* (v24.5) the panel rises 40 px into place (a 0.45 s CSS animation, which a starved headless box can hold at its first
   frame for seconds): read the option's place only once that has finished, or a tap aimed at B lands on C */
await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const r = B[i] && B[i].getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, n: B.length } : null; }, 'ABCD'.indexOf(OPT));
await press(bt.x, bt.y);
log('tapped', OPT, 'of', bt.n);
/* (v24.24) THE SUBTITLES: every caption that goes up is recorded in the page as it happens (its words, when, and the
   voice last started then), and photographed from here the first time it is seen */
const CAPWATCH = () => p.evaluate(() => {
  if (window.__caps) return;
  const c = document.getElementById('caption'); window.__caps = [];
  if (!c) return;
  new MutationObserver(() => {
    const on = c.classList.contains('on'), t = (c.querySelector('.capMain') || c).textContent.trim(), L = window.__caps, last = L[L.length - 1];
    let v = null; try { const V = window.__enc.voices(); v = V.length ? V[V.length - 1].name : null; } catch { /* */ }
    if (on && t && (!last || last.text !== t || last.off)) L.push({ text: t, at: +(performance.now() / 1000).toFixed(2), voice: v });
    else if (!on && last && !last.off) last.off = +(performance.now() / 1000).toFixed(2);
  }).observe(c, { attributes: true, childList: true, subtree: true, characterData: true });
});
const capSeen = new Set();
const capShot = async (shotFn) => {
  const cap = await p.evaluate(() => { const c = document.getElementById('caption'); return c && c.classList.contains('on') ? (c.querySelector('.capMain') || c).textContent.trim() : ''; });
  if (cap && !capSeen.has(cap)) {
    capSeen.add(cap); console.log('  caption', capSeen.size, JSON.stringify(cap));
    /* a new line RISES on (capSwap: from 15 % over 0.42 s, which a starved box can hold for seconds) — the photograph
       waits for it to finish, or it shows the words faded and reads as a fault (v24.24) */
    await p.waitForFunction(() => { const c = document.getElementById('caption');
      return !c || !c.classList.contains('on') || (c.getAnimations().every(a => a.playState === 'finished') && +getComputedStyle(c).opacity > 0.95); },
      null, { timeout: 30000, polling: 150 }).catch(() => {});
    await shotFn('cap' + String(capSeen.size).padStart(2, '0'));
  }
};
const capReport = async () => { const L = await p.evaluate(() => window.__caps || []);
  console.log('CAPTIONS', L.length, '|', L.map(q => `${q.at}–${q.off || '?'} [${q.voice}] ${q.text}`).join(' || ')); };
await CAPWATCH();
await p.waitForFunction(() => window.__enc.cine.active(), null, { timeout: 600000, polling: 300 });
let next = 0.5, maxT = 0;
const tStart = Date.now();
while (Date.now() - tStart < 90 * 60 * 1000) {
  const s = await p.evaluate(() => ({ st: window.__enc.getState(), on: window.__enc.cine.active(), t: window.__enc.cine.active() ? window.__enc.cine.t() : null }));
  if (s.on && s.t !== null) {
    maxT = Math.max(maxT, s.t);
    if (s.t >= next) { try { await p.screenshot({ path: `${OUT}/t${String(Math.round(s.t)).padStart(3, '0')}.jpg`, quality: 60, timeout: 240000 }); } catch { /* */ } next = s.t + EVERY; }
  }
  await capShot((tag) => p.screenshot({ path: `${OUT}/${tag}.jpg`, quality: 60, timeout: 240000 }).catch(() => {}));
  if (!s.on && ['result', 'complete'].includes(s.st)) { log('the card, scene reached', maxT.toFixed(1)); break; }
  await p.waitForTimeout(700);
}
await p.waitForTimeout(6000);
try { await p.screenshot({ path: `${OUT}/card.jpg`, quality: 60, timeout: 240000 }); } catch { /* */ }
await capReport();
const V = (await p.evaluate(() => window.__enc.voices())).slice(v0);
const over = [];
for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
  const a = V[i], c = V[j], aEnd = a.t1 === null ? Infinity : a.t1;
  if (c.t0 < aEnd - 0.05 && c.t0 >= a.t0) over.push(`${a.name}(${a.t0.toFixed(1)}–${a.t1 === null ? '?' : a.t1.toFixed(1)}) × ${c.name}(${c.t0.toFixed(1)})`);
}
log('VOICES', V.length, 'heard;', over.length ? 'OVERLAPS: ' + over.join('; ') : 'none over another', '|', V.map(v => `${v.name}@${v.t0.toFixed(1)}-${v.t1 === null ? '?' : v.t1.toFixed(1)}`).join(' '));
const cues = (await p.evaluate(() => window.__enc.stings().map(s => s.kind || s.name || s))).slice(c0);
log('CUES', cues.length, cues.join(' '));
log('result', errs.length ? 'ERRORS' : over.length ? 'OVERLAPS' : 'PASS');
console.log('errs', JSON.stringify(errs));
await b.close();
console.log('exit');
