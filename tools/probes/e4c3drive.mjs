/* v26.0: episode 4 chapter 3 PLAYED THROUGH BY A FINGER on a phone-sized touch context (390 x 844, sound on, as on Chad's
   phone): tools/probes/e4c2drive.mjs's method, its helpers copied whole. Every order is pressed the way a thumb presses
   it (the lens turned onto the thing and the player stood within its reach, then a CDP touch TAP on the interact badge,
   the thing itself or its mark; only if all three are refused, the engine's E path, reported as FALLBACK). He never
   moves while he kneels (the press is made from where he is). OPEN AND CLOSE is played by the finger itself: START
   tapped, then each breath a touch HELD (a CDP touchStart, the finger really down) until the level is past "enough"
   and let go, well short of the edge; the close's one breath, inside the ending's film, the same way. Since v26.3 it is
   a GATE: each breath a touch DRAGGED UP a gate's span (CDP touchStart, touchMoves, touchEnd), left open until the
   lights are past "enough", then dragged DOWN until it is shut (openGate). The decision is a
   tap on OPT. Films: WATCH=1 watches every one; otherwise the opening and the films from play are skipped by a TAP on
   the Skip button once it is offered (the real skip path), and the ENDING is always watched whole.
   Reports: the phases with the objective on screen and the beds at each; every press and how it landed; the breaths; the
   voice log (none over another); the captions (the chant's); the cues and how each sounded; every page error.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... OPT=A|B|C|D [WATCH=1] [OUT=dir] node tools/probes/e4c3drive.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT = process.env.OPT || 'A', OPT_I = 'ABCD'.indexOf(OPT), WATCH = !!process.env.WATCH;
const OUT = process.env.OUT || '/tmp/e4c3drive';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|has no take|no pose/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
const wait = (ms) => p.waitForTimeout(ms);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const tap = (x, y) => p.touchscreen.tap(Math.round(x), Math.round(y));
let tid = 1;
/* a touch through the browser's own pipeline, carrying the finger's own timestamp (v24.2: a hold counts the time the
   finger was really down) */
const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, timestamp: Date.now() / 1000,
  touchPoints: type === 'touchEnd' ? [] : [{ x: Math.round(x), y: Math.round(y), id: tid, radiusX: 8, radiusY: 8, force: 1 }] });
let shotN = 0;
const shot = async (tag) => { try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.jpg`, quality: 65, timeout: 240000 }); } catch { /* a slow frame */ } };
const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null;
  const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
  let vis = r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none';
  for (let a = e; a && vis; a = a.parentElement) if (a.classList && a.classList.contains('hide')) vis = false;
  return vis ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, dis: !!e.disabled, txt: e.textContent.trim().slice(0, 30) } : null; }, sel);

await p.goto(PAGE + '?ch=e4c3', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
log('version', await p.evaluate(() => (document.body.innerText.match(/v2\d\.\d+/) || ['?'])[0]), 'OPT', OPT, WATCH ? 'every film watched' : 'films from play skipped by the Skip button; the ending watched');
{ const sb = await box('#startBtn'); await tap(sb.x, sb.y); }
/* the opening film: waited for (never toPlay's own skip: the finger skips it, or it is watched) */
await p.waitForFunction(() => window.__enc.getState() === 'cine' || window.__enc.getState() === 'play', null, { timeout: 1500000, polling: 300 });
log('started:', await p.evaluate(() => window.__enc.getState()));

const info = () => p.evaluate(() => {
  const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
  let ev = null; try { const q = E.kitDebug().event; ev = q ? { kind: q.kind, briefing: q.briefing, bState: q.bState, bk: q.bk, bE: q.bE, bi: q.bi, down: q.down } : null; } catch { ev = { kind: '?' }; }
  const o = document.getElementById('objective');
  let beds = {}; try { const M = E.stage.amb().beds; for (const k in M) if (M[k] > 0.01) beds[k] = +M[k].toFixed(2); } catch { /* */ }
  let knelt = false; try { knelt = !!E.stage.dbg.play.knelt; } catch { /* */ }
  /* WHAT IS IN HIS HANDS IS DRAWN (M8: the opening film hid his hands and nothing showed them again, so the bai sri
     Ton gives him was held and never seen until the festival's film had ended; every check passed, because none
     asked): while the chapter says he holds it and it is not down under the frame, its meshes must be drawn */
  let held = null; try { const D = E.stage.dbg; if (D.play.bai && D.play.baiP > -0.5) { let o = D.handBai, vis = true; while (o) { if (!o.visible) vis = false; o = o.parent; } held = vis; } } catch { /* */ }
  return { st: E.getState(), phase: i.phase, ev, knelt, held,
           obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
           cine: E.cine.active() ? +E.cine.t().toFixed(1) : null, dur: E.cine.active() ? +E.cine.dur().toFixed(1) : null, skip: E.cine.active() && E.cine.skipShown(),
           beds, queued: i.queued, pending: i.pending, busy: i.busy, voices: E.voices().length };
});
const spots = () => p.evaluate(() => {
  const H = (window.__enc.stage && window.__enc.stage.hotspots) || [];
  return H.filter(h => h && !h.done && (!h.enabled || h.enabled()))
          .map(h => ({ id: h.id, x: h.pos.x, y: h.pos.y, z: h.pos.z, r: h.radius || 1.6, aim: h.aim || 0, hits: !!h.hits,
                       mark: h.mark !== false, pressAim: !!h.pressAim, anyView: !!h.anyView }));
});
/* turn onto the thing and stand within its reach: what a drag and a walk do (the walk itself is walktest's) */
async function aimAt(s, move = true) {
  await p.evaluate(([s, move]) => {
    const E = window.__enc, Y = E.yaw, P = E.pitch;
    let dx = s.x - Y.position.x, dz = s.z - Y.position.z, d = Math.hypot(dx, dz);
    if (move && d > s.r * 0.7) { const k = (d - s.r * 0.55) / d; Y.position.x += dx * k; Y.position.z += dz * k;
                                 dx = s.x - Y.position.x; dz = s.z - Y.position.z; d = Math.hypot(dx, dz); }
    Y.rotation.y = Math.atan2(-dx, -dz);
    P.rotation.x = Math.max(-1.2, Math.min(1.2, Math.atan2(s.y - Y.position.y, Math.max(0.05, d))));
  }, [s, move]);
  await frames(3);
}
/* did the press land? the spot is no longer offered, or something opened (a line, a panel, a film, a phase) */
async function gone(id) {
  return p.evaluate((id) => { const E = window.__enc, H = E.stage.hotspots.find(h => h.id === id);
    const st = E.getState(); let i = {}; try { i = E.stage.info(); } catch { /* */ }
    return st !== 'play' || !H || (H.enabled && !H.enabled()) || !!i.pending || i.queued > 0 || !!i.busy; }, id);
}
async function press(s, knelt) {
  await aimAt(s, !knelt && !s.anyView);
  /* 1 · the badge, as a thumb taps it */
  const bg = await box('#interact .ibadge');
  if (bg) { await tap(bg.x, bg.y); await frames(2); if (await gone(s.id)) return 'badge'; }
  /* 2 · the thing itself (hits), 3 · its mark */
  const at = await p.evaluate((id) => window.__enc.hotMarkAt(id), s.id);
  if (s.hits) {
    const q = await p.evaluate((s) => { const E = window.__enc; const c = E.camera; c.updateMatrixWorld(); const v = c.position.clone().set(s.x, s.y, s.z).project(c);
      return v.z < 1 ? { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight } : null; }, s);
    if (q && q.x > 4 && q.y > 4 && q.x < W - 4 && q.y < H - 4) { await tap(q.x, q.y); await frames(2); if (await gone(s.id)) return 'thing'; }
  }
  if (s.mark && at && at.z < 1 && at.x > 4 && at.y > 4 && at.x < W - 4 && at.y < H - 4) { await tap(at.x, at.y); await frames(2); if (await gone(s.id)) return 'mark'; }
  /* nothing a finger can press: the engine's E path, and it is reported */
  const ok = await p.evaluate(() => window.__enc.interactNow());
  return ok ? 'FALLBACK(E)' : 'REFUSED';
}
/* THE SUBTITLES (the chant's): every caption that goes up is recorded in the page as it happens */
await p.evaluate(() => {
  if (window.__caps) return;
  const c = document.getElementById('caption'); window.__caps = [];
  if (!c) return;
  new MutationObserver(() => {
    const on = c.classList.contains('on'), t = (c.querySelector('.capMain') || c).textContent.trim(), L = window.__caps, last = L[L.length - 1];
    if (on && t && (!last || last.text !== t || last.off)) L.push({ text: t, at: +(performance.now() / 1000).toFixed(2) });
    else if (!on && last && !last.off) last.off = +(performance.now() / 1000).toFixed(2);
  }).observe(c, { attributes: true, childList: true, subtree: true, characterData: true });
});
/* ONE BREATH, by the finger: down when it may be opened, held until the level is past "enough" (bE) with a margin and
   short of the edge (1), then up. Reported with what the engine made of it */
const breaths = [];
async function breathe(I) {
  const x = W * 0.5, y = H * 0.74;
  await touch('touchStart', x, y);
  const t0 = Date.now();
  const top = await p.waitForFunction(() => { const e = window.__enc.kitDebug().event; if (!e) return 'gone';
    return (e.bState === 'pull' || e.bk >= Math.min(0.92, (e.bE || 0.5) + 0.14)) ? String(e.bk) : false; }, null, { timeout: 180000, polling: 120 }).then(h => h.jsonValue(), () => 'timeout');
  await touch('touchEnd', x, y); tid++;
  breaths.push(`breath ${I.ev.bi + 1}: held ${((Date.now() - t0) / 1000).toFixed(1)} s of the box's time, let go at level ${isNaN(+top) ? top : (+top).toFixed(2)} (enough from ${(I.ev.bE || 0).toFixed(2)})`);
  log('  ' + breaths[breaths.length - 1]);
  await wait(1200);
}
/* v26.3 · ONE BREATH OF THE GATE, by the finger: a touch put down below the middle and DRAGGED UP a gate's span in short
   moves (it opens), left until the lights are past "enough" (bE) with a margin and short of the edge, then dragged DOWN
   until it is shut (a gate that pulls takes more than one drag). Reported with what the engine made of it */
async function openGate(I) {
  const x = W * 0.5, span = 0.34 * H;
  const dragBy = async (dy) => { const y0 = H * 0.55 - dy / 2; await touch('touchStart', x, y0);
    for (let i = 1; i <= 10; i++) { await touch('touchMove', x, y0 + dy * i / 10); await wait(30); }
    await touch('touchEnd', x, y0 + dy); tid++; };
  const t0 = Date.now();
  await dragBy(-span);
  const top = await p.waitForFunction(() => { const e = window.__enc.kitDebug().event; if (!e) return 'gone';
    return (e.bState !== 'open' || e.bk >= Math.min(0.92, (e.bE || 0.5) + 0.14)) ? String(e.bk) : false; }, null, { timeout: 180000, polling: 120 }).then(h => h.jsonValue(), () => 'timeout');
  let drags = 0;
  for (; drags < 6; drags++) { const e = await p.evaluate(() => window.__enc.kitDebug().event); if (!e || e.bState !== 'open') break; await dragBy(span); }
  breaths.push(`gate ${I.ev.bi + 1}: open ${((Date.now() - t0) / 1000).toFixed(1)} s of the box's time, shut from level ${isNaN(+top) ? top : (+top).toFixed(2)} (enough from ${(I.ev.bE || 0).toFixed(2)}) by ${drags} drag(s) down`);
  log('  ' + breaths[breaths.length - 1]);
  await wait(1200);
}
const phases = [], bedsAt = {}, presses = [], unseen = [];
let last = '', idle = 0, decided = false, cardAt = 0, lastCine = -1, lastVoices = 0, skips = [], films = [];
const TMAX = 150 * 60 * 1000;
while (Date.now() - T0 < TMAX) {
  const I = await info();
  const key = `${I.st}|${I.phase}|${I.obj}|${I.ev ? I.ev.kind + (I.ev.briefing ? ':brief' : '') : ''}`;
  if (key !== last) {
    log(I.st, I.phase, JSON.stringify(I.obj), I.cine !== null ? `film ${I.cine} of ${I.dur}` : '', JSON.stringify(I.beds), I.ev ? 'event ' + I.ev.kind : '');
    if (I.st === 'play' && I.held === false && !unseen.includes(I.phase)) unseen.push(I.phase);
    if (I.phase && phases[phases.length - 1] !== I.phase) { phases.push(I.phase); bedsAt[I.phase] = I.beds; await shot(I.phase.replace(/[^a-z0-9]/gi, '_')); }
    last = key; idle = 0;
  }
  /* anything moving is not being stuck: a film's clock, a new voice */
  if (I.cine !== null && I.cine !== lastCine) { lastCine = I.cine; idle = 0; }
  if (I.voices !== lastVoices) { lastVoices = I.voices; idle = 0; }
  /* an event: its brief's START tapped; a breath breathed */
  if (I.ev) {
    if (I.ev.briefing) { await shot('brief-' + I.ev.kind); const bt = await box('#evBtn'); if (bt) { await tap(bt.x, bt.y); log('  START tapped'); } await wait(1200); continue; }
    if (I.ev.kind === 'breath') { if (I.ev.bState === 'wait' && !I.ev.down) { await breathe(I); await shot('breath' + (I.ev.bi + 1)); } else await wait(400); idle = 0; continue; }
    if (I.ev.kind === 'gate') { if (I.ev.bState === 'wait' && !I.ev.down) { await openGate(I); await shot('gate' + (I.ev.bi + 1)); } else await wait(400); idle = 0; continue; }
  }
  if (I.st === 'cine') {
    if (!films.length || films[films.length - 1].k !== (decided ? 'ending' : I.phase || 'opening') + ':' + I.dur) films.push({ k: (decided ? 'ending' : I.phase || 'opening') + ':' + I.dur, at: Date.now() });
    if (!WATCH && !decided && I.skip) { const sk = await box('#cineSkip'); if (sk) { await tap(sk.x, sk.y); skips.push(`${I.phase || 'opening'}@${I.cine}`); log('  Skip tapped at', I.cine); await wait(1500); continue; } }
    await wait(1000); idle += 1; continue;
  }
  if (I.st === 'decide' && !decided) {
    await wait(2500); await shot('decision');
    await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 }).catch(() => {});
    const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')];
      const r = B[i] && B[i].getBoundingClientRect(); return { n: B.length, txt: B[i] ? B[i].textContent.trim().slice(0, 40) : null, at: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null }; }, OPT_I);
    if (bt.at) await tap(bt.at.x, bt.at.y);
    log('decision: tapped', OPT, JSON.stringify(bt.txt), 'of', bt.n); decided = true; await wait(1500); continue;
  }
  if ((I.st === 'result' || I.st === 'complete') && !cardAt) { cardAt = Date.now(); log('the card'); await wait(2500); await shot('card'); }
  if (cardAt && Date.now() - cardAt > 12000) break;
  if (I.st === 'play' && !I.pending && !I.queued && !I.busy) {
    const S = await spots();
    if (S.length) {
      const s = S[0], how = await press(s, I.knelt);
      presses.push(`${I.phase}:${s.id}=${how}`);
      log('  pressed', s.id, how);
      await wait(how === 'REFUSED' ? 1500 : 2500);
      if (how === 'REFUSED') idle += 1.5;
      continue;
    }
  }
  await wait(1000); idle += 1;
  if (idle > 420) { log('STUCK', JSON.stringify(I)); await shot('stuck'); break; }
}
const caps = await p.evaluate(() => window.__caps || []);
console.log('CAPTIONS', caps.length, '|', caps.map(q => `${q.at}-${q.off || '?'} ${q.text}`).join(' || '));
/* the voice log, on the audio clock: nothing starts while another is still sounding */
const V = await p.evaluate(() => window.__enc.voices());
const over = [];
for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
  const a = V[i], c = V[j], aEnd = a.t1 === null ? Infinity : a.t1;
  if (c.t0 < aEnd - 0.05 && c.t0 >= a.t0) over.push(`${a.name}(${a.t0.toFixed(1)}-${a.t1 === null ? '?' : a.t1.toFixed(1)}) x ${c.name}(${c.t0.toFixed(1)})`);
}
log('VOICES', V.length, 'heard;', over.length ? 'OVERLAPS: ' + over.join('; ') : 'none over another', '|', V.map(v => v.name).join(' '));
const cues = await p.evaluate(() => window.__enc.stings().map(s => s.kind + (s.how === 'sample' ? '' : '(' + s.how + ')')));
const silent = cues.filter(c => /\(/.test(c));
log('CUES', cues.length, silent.length ? 'NOT FROM A SAMPLE: ' + silent.join(' ') : 'every one from its sample', '|', cues.join(' '));
log('PHASES', phases.join(' > '));
log('PRESSES', presses.join(' '));
/* what the ENGINE made of the breaths (on this box a frame can take seconds, and the time a finger was really down is
   counted whole: a breath let go at 0.7 may be past its edge by the frame that sees the release; a phone's frame is
   a thirtieth of a second) */
const bres = await p.evaluate(() => { try { return window.__enc.stage.dbg.play.breath; } catch { return null; } });
log('BREATHS', breaths.join(' | '), '| the engine counted:', JSON.stringify(bres));
log('SKIPPED', skips.join(' ') || '(none: every film watched)');
log('BEDS', JSON.stringify(bedsAt));
log('HELD', unseen.length ? 'THE BAI SRI IS HELD AND NOT DRAWN in: ' + unseen.join(' ') : 'what he holds is drawn wherever he holds it');
/* a press that was refused and then landed on the next try is a retry (the first contact of a phase can race the line
   that opens it); a press that needed the engine's E path, or was never accepted, is the fault */
const badPress = presses.some((x, i) => /FALLBACK/.test(x) || (/REFUSED/.test(x) && !presses.slice(i + 1).some(y => y.split('=')[0] === x.split('=')[0] && !/REFUSED|FALLBACK/.test(y))));
log('result', errs.length ? 'ERRORS' : !cardAt ? 'DID NOT REACH THE CARD' : unseen.length ? 'REACHED THE CARD, but what he holds was not drawn' : over.length ? 'REACHED THE CARD, but a voice ran over another' : silent.length ? 'REACHED THE CARD, but a cue made no sound' : badPress ? 'REACHED THE CARD, but a press needed the E path' : 'PASS');
console.log('errs', JSON.stringify(errs));
await b.close();
process.exit(errs.length || !cardAt || over.length ? 1 : 0);
