/* v24.5: episode 3 chapter 5 PLAYED THROUGH BY A FINGER on a phone-sized touch context (sound on, as on Chad's phone)
   — the probe the v24.2 real-finger run was (its one-off died with its container) and the v24.3 key-driven one is not.
   Every order is pressed the way a thumb presses it: the lens turned onto the thing and the player within its reach
   (what a drag and a walk do), then a touch TAP on the interact badge, or on the thing itself (`hits`), or on its mark;
   only if all three are refused does it fall back to the engine's E path and say FALLBACK. Every minigame is played
   through the browser's own touch pipeline (CDP Input.dispatchTouchEvent, each touch carrying a finger's timestamp):
   a craft step read off the screen (#evCraft's g-* class and its point) — a TWIST circled round the point, a SLIDE
   dragged along its way, TAPs, a HOLD held, a SWIPE flicked; a YIELD held; COME BACK climbed by upward strokes; a
   briefing's START, the unlock splash's Close and the decision's option tapped. Reports the voice log (none over
   another), the cues, the phases, every press and how it landed, the beds at each phase, every page error.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... OPT=A|B|C|D [OUT=dir] node tools/probes/e3c5finger.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT = process.env.OPT || 'A', OPT_I = 'ABCD'.indexOf(OPT);
const OUT = process.env.OUT || '/tmp/e3c5finger';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
const wait = (ms) => p.waitForTimeout(ms);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const tap = (x, y) => p.touchscreen.tap(Math.round(x), Math.round(y));
let tid = 1;
const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, timestamp: Date.now() / 1000,
  touchPoints: type === 'touchEnd' ? [] : [{ x: Math.round(x), y: Math.round(y), id: tid, radiusX: 8, radiusY: 8, force: 1 }] });
async function stroke(pts, gap) { await touch('touchStart', pts[0][0], pts[0][1]); for (const q of pts.slice(1)) { await wait(gap); await touch('touchMove', q[0], q[1]); } await wait(gap); await touch('touchEnd'); tid++; }
let shotN = 0;
const shot = async (tag) => { try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.jpg`, quality: 65, timeout: 240000 }); } catch { /* a slow frame */ } };
const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null;
  const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
  let vis = r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none';
  for (let a = e; a && vis; a = a.parentElement) if (a.classList && a.classList.contains('hide')) vis = false;
  return vis ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, dis: !!e.disabled, txt: e.textContent.trim().slice(0, 30) } : null; }, sel);

await p.goto(PAGE + '?ch=e3c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
log('version', await p.evaluate(() => (document.body.innerText.match(/v2\d\.\d+/) || ['?'])[0]), 'OPT', OPT);
{ const sb = await box('#startBtn'); await tap(sb.x, sb.y); }
await toPlay(p, 1500000);
log('in play');

const info = () => p.evaluate(() => {
  const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
  let ev = null; try { ev = E.evState ? E.evState() : null; } catch { ev = { kind: '?' }; }
  const host = document.getElementById('event');
  const evOn = !!ev || !!(host && !host.classList.contains('hide') && /\b(craft|yield|surface)\b/.test(host.className));
  const kind = ev && ev.kind !== '?' ? ev.kind : (host && (host.className.match(/\b(craft|yield|surface)\b/) || [])[1]) || null;
  const o = document.getElementById('objective');
  const B = window.__CHAPTERS__.e3c5.ambience.beds, beds = {};
  for (const r of B) if (r[1] > 0.01) beds[r[0]] = +r[1].toFixed(2);
  return { st: E.getState(), phase: i.phase, world: i.world, evOn, kind,
           obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
           cine: E.cine.active() ? +E.cine.t().toFixed(1) : null, beds };
});
const spots = () => p.evaluate(() => {
  const H = (window.__enc.stage && window.__enc.stage.hotspots) || [];
  return H.filter(h => h && !h.done && (!h.enabled || h.enabled()))
          .map(h => ({ id: h.id, x: h.pos.x, y: h.pos.y, z: h.pos.z, r: h.radius || 1.6, hits: !!h.hits, mark: h.mark !== false }));
});
async function landed(id) {
  return p.evaluate((id) => { const E = window.__enc, Hs = E.stage.hotspots.find(h => h.id === id);
    const st = E.getState(); return st !== 'play' || !Hs || (Hs.enabled && !Hs.enabled()) || !!Hs.done; }, id);
}
async function press(s) {
  await p.evaluate((s) => {
    const E = window.__enc, Y = E.yaw, P = E.pitch;
    let dx = s.x - Y.position.x, dz = s.z - Y.position.z, d = Math.hypot(dx, dz);
    if (d > s.r * 0.7) { const k = (d - s.r * 0.55) / d; Y.position.x += dx * k; Y.position.z += dz * k;
                         dx = s.x - Y.position.x; dz = s.z - Y.position.z; d = Math.hypot(dx, dz); }
    Y.rotation.y = Math.atan2(-dx, -dz);
    P.rotation.x = Math.atan2(s.y - Y.position.y, Math.max(0.05, d));
  }, s);
  await frames(3);
  const bg = await box('#interact .ibadge');
  if (bg) { await tap(bg.x, bg.y); await frames(2); if (await landed(s.id)) return 'badge'; }
  if (s.hits) {
    const q = await p.evaluate((s) => { const E = window.__enc, c = E.camera; c.updateMatrixWorld(); const v = c.position.clone().set(s.x, s.y, s.z).project(c);
      return v.z < 1 ? { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight } : null; }, s);
    if (q && q.x > 4 && q.y > 4 && q.x < W - 4 && q.y < H - 4) { await tap(q.x, q.y); await frames(2); if (await landed(s.id)) return 'thing'; }
  }
  const at = await p.evaluate((id) => window.__enc.hotMarkAt(id), s.id);
  if (s.mark && at && at.z < 1 && at.x > 4 && at.y > 4 && at.x < W - 4 && at.y < H - 4) { await tap(at.x, at.y); await frames(2); if (await landed(s.id)) return 'mark'; }
  const ok = await p.evaluate(() => window.__enc.interactNow());
  return ok ? 'FALLBACK(E)' : 'REFUSED';
}
/* the step on screen: its gesture (#evCraft's class), its point (its transform) and its way (--cang) */
const craftStep = () => p.evaluate(() => {
  const c = document.getElementById('evCraft'); if (!c || c.classList.contains('hide')) return null;
  const g = (c.className.match(/g-(\w+)/) || [])[1];
  const m = (c.style.transform || '').match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
  return { g, x: m ? +m[1] : innerWidth / 2, y: m ? +m[2] : innerHeight * 0.62, ang: parseFloat(c.style.getPropertyValue('--cang')) || 0,
           k: parseFloat(c.style.getPropertyValue('--ck')) || 0, prompt: document.getElementById('evPrompt').textContent.trim() };
});
async function startIfBrief() {
  const bt = await box('#evBtn');
  if (bt && /start/i.test(bt.txt)) { await tap(bt.x, bt.y); log('    START'); await wait(900); return true; }
  return false;
}
async function playEvent(kind) {
  log('  event', kind);
  await wait(900);
  await startIfBrief();
  const t0 = Date.now(), alive = async () => (await info()).evOn;
  if (kind === 'yield') {
    const y = await p.evaluate(() => { const c = document.getElementById('evYield'); const m = c && (c.style.transform || '').match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/); return m ? { x: +m[1], y: +m[2] } : { x: innerWidth / 2, y: innerHeight * 0.6 }; });
    await touch('touchStart', y.x, y.y);
    while (Date.now() - t0 < 120000 && await alive()) await wait(600);
    await touch('touchEnd'); tid++;
  } else if (kind === 'surface') {
    while (Date.now() - t0 < 150000 && await alive()) {
      await stroke([[W / 2, H * 0.72], [W / 2, H * 0.64], [W / 2, H * 0.56], [W / 2, H * 0.48], [W / 2, H * 0.40], [W / 2, H * 0.32]], 30);
      await wait(120);
    }
  } else {
    let lastG = '', n = 0;
    while (Date.now() - t0 < 240000 && await alive()) {
      const s = await craftStep();
      if (!s || !s.g) { await wait(500); continue; }
      if (s.g + s.prompt !== lastG) { log('    step', s.g, JSON.stringify(s.prompt), 'at', s.x.toFixed(0), s.y.toFixed(0)); lastG = s.g + s.prompt; n = 0; }
      if (++n > 25) { log('    STEP NOT TAKING', JSON.stringify(s)); await shot('step-stuck'); break; }
      const a = s.ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a);
      if (s.g === 'twist') {
        const R = 64, pts = [];
        for (let d = 0; d <= 400; d += 20) pts.push([s.x + R * Math.cos(d * Math.PI / 180), s.y + R * Math.sin(d * Math.PI / 180)]);
        await stroke(pts, 60);
      } else if (s.g === 'slide') {
        const L = H * 0.32, pts = [];
        for (let i = 0; i <= 8; i++) pts.push([s.x + ux * L * i / 8, s.y + uy * L * i / 8]);
        await stroke(pts, 50);
      } else if (s.g === 'tap') { await tap(s.x, s.y); await wait(350); }
      else if (s.g === 'hold') { await touch('touchStart', s.x, s.y); await wait(2600); await touch('touchEnd'); tid++; }
      else if (s.g === 'swipe') {
        const L = W * 0.5, pts = [];
        for (let i = 0; i <= 5; i++) pts.push([s.x + ux * L * i / 5, s.y + uy * L * i / 5]);
        await stroke(pts, 16);
      }
      await wait(700);
    }
  }
  log('  event over', kind, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}

const phases = [], bedsAt = {}, presses = [];
let last = '', idle = 0, decided = false, cardAt = 0;
const TMAX = 110 * 60 * 1000;
while (Date.now() - T0 < TMAX) {
  const I = await info();
  const key = `${I.st}|${I.phase}|${I.obj}`;
  if (key !== last) {
    log(I.st, I.phase, I.world, JSON.stringify(I.obj), I.cine !== null ? 'cine ' + I.cine : '', JSON.stringify(I.beds));
    if (I.phase && phases[phases.length - 1] !== I.phase) { phases.push(I.phase); bedsAt[I.phase] = I.beds; await shot(I.phase.replace(/[^a-z0-9]/gi, '_')); }
    last = key; idle = 0;
  }
  if (I.evOn && I.kind) { await playEvent(I.kind); continue; }
  if (I.st === 'decide' && !decided) {
    await wait(2500); await shot('decision');
    const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')];
      const r = B[i] && B[i].getBoundingClientRect(); return { n: B.length, at: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null }; }, OPT_I);
    if (bt.at) await tap(bt.at.x, bt.at.y);
    log('decision: tapped', OPT, 'of', bt.n); decided = true; continue;
  }
  if ((I.st === 'result' || I.st === 'complete') && !cardAt) { cardAt = Date.now(); log('the card'); await shot('card'); }
  if (cardAt && Date.now() - cardAt > 15000) break;
  if (I.st === 'unlock') { await wait(1200); const c = await box('#unClose'); if (c) { await tap(c.x, c.y); log('  unlock: Close'); } await wait(900); continue; }
  if (I.st === 'play') {
    const S = await spots();
    if (S.length) {
      const s = S[0], how = await press(s);
      presses.push(`${I.phase}:${s.id}=${how}`);
      log('  pressed', s.id, how);
      await wait(how === 'REFUSED' ? 1500 : 2500);
      if (how === 'REFUSED') idle += 1.5;
      continue;
    }
  }
  await wait(1000); idle += 1;
  if (idle > 300) { log('STUCK', JSON.stringify(I)); await shot('stuck'); break; }
}

const V = await p.evaluate(() => window.__enc.voices());
const over = [];
for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
  const a = V[i], c = V[j], aEnd = a.t1 === null ? Infinity : a.t1;
  if (c.t0 < aEnd - 0.05 && c.t0 >= a.t0) over.push(`${a.name}(${a.t0.toFixed(1)}–${a.t1 === null ? '?' : a.t1.toFixed(1)}) × ${c.name}(${c.t0.toFixed(1)})`);
}
log('VOICES', V.length, 'heard;', over.length ? 'OVERLAPS: ' + over.join('; ') : 'none over another', '|', V.map(v => v.name).join(' '));
const cues = await p.evaluate(() => window.__enc.stings().map(s => s.kind || s.name || s));
log('CUES', cues.length, cues.join(' '));
log('PHASES', phases.join(' → '));
log('PRESSES', presses.join(' '));
log('BEDS', JSON.stringify(bedsAt));
log('result', errs.length ? 'ERRORS' : (cardAt ? (presses.some(x => /FALLBACK|REFUSED/.test(x)) ? 'REACHED THE CARD, but a press needed the E path' : 'PASS') : 'DID NOT REACH THE CARD'));
console.log('errs', JSON.stringify(errs));
await b.close();
console.log('exit');
