/* v24.5: episode 4 chapter 1's storm (WHAT CHANGED?) MEASURED on a screen: the bookmark 'storm~fri' applied once the
   chapter has booted, the brief's START tapped (or clicked), and at each round's LIT flash the frame photographed with
   every change's SCORED spot (where a tap counts, within tol) and where the thing is DRAWN — her head and hips, the
   clock's dial and bob — projected and reported; the photographs are written with the scored circles drawn on them by
   ImageMagick, so what is scored and what is seen can be compared by eye.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop [OUT=dir] node tools/probes/e4c1storm.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const OUT = (process.env.OUT || '/tmp/e4c1storm') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(8000);
await p.evaluate(() => window.__enc.stage.applyPhase('storm~fri'));
await p.waitForFunction(() => { const h = document.getElementById('event'); return h && !h.classList.contains('hide'); }, null, { timeout: 600000, polling: 300 });
await p.waitForTimeout(1500);
const sb = await p.evaluate(() => { const e = document.getElementById('evBtn'); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
if (PHONE) await p.touchscreen.tap(Math.round(sb.x), Math.round(sb.y)); else await p.mouse.click(sb.x, sb.y);
log('START');
const done = new Set();
const t0 = Date.now();
while (Date.now() - t0 < 600000) {
  const S = await p.evaluate(() => {
    const E = window.__enc, c = E.changeState(); if (!c) return null;
    const st = E.stage, cam = E.camera; cam.updateMatrixWorld();
    const scr = (v) => { const q = v.clone().project(cam); return { x: +((q.x + 1) / 2 * innerWidth).toFixed(0), y: +((1 - q.y) / 2 * innerHeight).toFixed(0), z: +q.z.toFixed(3), ndc: +q.x.toFixed(2) }; };
    const out = { round: c.round, phase: c.phase, right: c.right, wrong: c.wrong, missed: c.missed, spots: {} };
    for (const k of Object.keys(st.play.chg)) out.spots[k] = E.changeSpotScreen(st.play.chg[k].pos);
    const H = st.herState, P = H && H.P;
    if (P && P.head) { const v = P.head.getWorldPosition(cam.position.clone()); out.herHead = scr(v); }
    if (P && P.model) { let hip = null; P.model.traverse(o => { if (!hip && o.isBone && /Hips$/.test(o.name)) hip = o; });
                        if (hip) out.herHips = scr(hip.getWorldPosition(cam.position.clone())); out.herVis = P.group.visible; out.herK = +H.k.toFixed(2);
                        out.herGroup = scr(P.group.getWorldPosition(cam.position.clone())); }
    out.tol = +(0.09 * Math.min(innerWidth, innerHeight)).toFixed(0);
    return out;
  });
  if (!S) break;
  const key = S.round + S.phase;
  if (S.phase === 'lit' && !done.has(key)) {
    done.add(key);
    await p.waitForTimeout(400);
    const f = `${OUT}/round${S.round}.png`;
    await p.screenshot({ path: f, timeout: 240000 });
    log('round', S.round, JSON.stringify(S));
    const draw = [];
    for (const [k, q] of Object.entries(S.spots)) if (q) draw.push('-stroke', k === 'her' ? 'magenta' : k === 'clock' ? 'yellow' : k === 'cup' ? 'cyan' : 'lime', '-fill', 'none', '-draw', `circle ${q.x},${q.y} ${q.x + S.tol},${q.y}`);
    if (S.herHead) draw.push('-stroke', 'red', '-fill', 'none', '-draw', `rectangle ${S.herHead.x - 6},${S.herHead.y - 6} ${S.herHead.x + 6},${S.herHead.y + 6}`);
    try { execFileSync('convert', [f, '-strokewidth', '2', ...draw, f.replace('.png', '-marked.jpg')]); } catch (e) { log('convert failed', e.message); }
  }
  if (S.round >= 4 && S.phase !== 'lit' && done.has('4lit')) break;
  await p.waitForTimeout(150);
}
log('errs', JSON.stringify(errs));
await b.close();
