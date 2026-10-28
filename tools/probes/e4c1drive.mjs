/* v24.5: episode 4 chapter 1 PLAYED THROUGH BY A FINGER on a phone-sized touch context (sound on, as on Chad's phone).
   Every order is pressed the way a thumb presses it — the lens turned onto the thing (what a drag does) and the player
   stood within its reach (what walking does; walktest proves the walk), then a CDP touch TAP on the interact badge, or on
   the thing itself (`hits`), or on its mark; only if all three are refused does it fall back to the engine's E path and
   say FALLBACK (a thing a finger could not press). The ledger's lines, the day of his birth (the pick), the tray (the
   choose window and its Confirm), the unlock splash's Close, WHAT CHANGED?'s START and its taps, and the decision's
   option are all touch taps on their own screen positions. Reports: the voice log (none over another), the cues, the
   phases with the objective on screen, the beds at each phase, every press and how it landed, every page error.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... OPT=A|B|C|D ASK=all|none LED=fact|meaning CHG=right|none|wrong [OUT=dir]
     node tools/probes/e4c1drive.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT = process.env.OPT || 'A', OPT_I = 'ABCD'.indexOf(OPT);
const ASK = process.env.ASK || 'all', LED = process.env.LED || 'fact', CHG = process.env.CHG || 'right';
const OUT = process.env.OUT || '/tmp/e4c1drive';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
const wait = (ms) => p.waitForTimeout(ms);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const tap = (x, y) => p.touchscreen.tap(Math.round(x), Math.round(y));
let shotN = 0;
const shot = async (tag) => { try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.jpg`, quality: 65, timeout: 240000 }); } catch { /* a slow frame */ } };
const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null;
  const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
  let vis = r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none';
  for (let a = e; a && vis; a = a.parentElement) if (a.classList && a.classList.contains('hide')) vis = false;
  return vis ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, dis: !!e.disabled } : null; }, sel);

await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
log('version', await p.evaluate(() => (document.body.innerText.match(/v2\d\.\d+/) || ['?'])[0]), 'OPT', OPT, 'ASK', ASK, 'LED', LED, 'CHG', CHG);
{ const sb = await box('#startBtn'); await tap(sb.x, sb.y); }
await toPlay(p, 1500000);
log('in play');

const info = () => p.evaluate(() => {
  const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
  let ev = null; try { ev = E.evState ? E.evState() : null; } catch { ev = { kind: '?' }; }
  const host = document.getElementById('event');
  const evOn = !!ev || !!(host && !host.classList.contains('hide'));
  const o = document.getElementById('objective');
  const B = window.__CHAPTERS__.e4c1.ambience.beds, beds = {};
  for (const r of B) if (r[1] > 0.01) beds[r[0]] = +r[1].toFixed(2);
  let led = null; try { led = E.ledgerState(); } catch { /* */ }
  let chg = null; try { chg = E.changeState(); } catch { /* */ }
  return { st: E.getState(), phase: i.phase, world: i.world, evOn, kind: ev ? ev.kind : null, chg,
           led: led && led.open ? { mode: led.mode, rects: led.rects } : null,
           obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
           cine: E.cine.active() ? +E.cine.t().toFixed(1) : null, beds, queued: i.queued, pending: i.pending };
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
    P.rotation.x = Math.atan2(s.y - (Y.position.y + 0), Math.max(0.05, d));
  }, [s, move]);
  await frames(3);
}
async function press(s) {
  const kneeling = await p.evaluate(() => { const S = window.__enc.stage; return !!(S.play && S.play.state && S.play.state.kneeling); });
  await aimAt(s, !kneeling);
  /* 1 · the badge, as a thumb taps it */
  const bg = await box('#interact .ibadge');
  if (bg) { await tap(bg.x, bg.y); await frames(2); if (await gone(s.id)) return 'badge'; }
  /* 2 · the thing itself (hits), 3 · its mark */
  const at = await p.evaluate((id) => window.__enc.hotMarkAt(id), s.id);
  if (s.hits) {
    const q = await p.evaluate((s) => { const E = window.__enc; const H = E.stage.hotspots.find(h => h.id === s.id);
      const c = E.camera; c.updateMatrixWorld(); const v = c.position.clone().set(s.x, s.y, s.z).project(c);
      return v.z < 1 ? { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight } : null; }, s);
    if (q && q.x > 4 && q.y > 4 && q.x < W - 4 && q.y < H - 4) { await tap(q.x, q.y); await frames(2); if (await gone(s.id)) return 'thing'; }
  }
  if (s.mark && at && at.z < 1 && at.x > 4 && at.y > 4 && at.x < W - 4 && at.y < H - 4) { await tap(at.x, at.y); await frames(2); if (await gone(s.id)) return 'mark'; }
  /* nothing a finger can press: the engine's E path, and it is reported */
  const ok = await p.evaluate(() => window.__enc.interactNow());
  return ok ? 'FALLBACK(E)' : 'REFUSED';
}
/* did the press land? the spot is no longer offered, or something opened (a line, a panel, a film, a phase) */
async function gone(id) {
  return p.evaluate((id) => { const E = window.__enc, H = E.stage.hotspots.find(h => h.id === id);
    const st = E.getState(); let i = {}; try { i = E.stage.info(); } catch { /* */ }
    return st !== 'play' || !H || (H.enabled && !H.enabled()) || !!i.pending || i.queued > 0 || (E.ledgerState && E.ledgerState().open); }, id);
}
async function playLedger(L) {
  await wait(1200);
  for (let k = 0; k < 6; k++) {
    const R = await p.evaluate(() => { const E = window.__enc, s = E.ledgerState(); if (!s.open) return null;
      const out = []; for (let i = 0; i < s.rects; i++) out.push(E.ledgerRectScreen(i)); return { mode: s.mode, out }; });
    if (!R) return;
    const want = R.out.find(r => r && r.which === LED) || R.out.find(r => r);
    if (want) { await tap(want.x, want.y); log('  ledger: tapped', want.which, R.mode); }
    else { await tap(W / 2, H * 0.85); log('  ledger: tapped below (no line)', R.mode); }
    await wait(1600);
    if (!(await p.evaluate(() => window.__enc.ledgerState().open))) { log('  ledger closed'); return; }
  }
  log('  LEDGER STILL OPEN after six taps');
}
async function playChoose() {
  await wait(1200);
  const card = await box('#choList .choCard');
  if (!card) { log('  CHOOSE: no card'); return; }
  const cards = await p.evaluate(() => [...document.querySelectorAll('#choList .choCard')].map(c => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: c.textContent.trim().slice(0, 40) }; }));
  const pick = cards[Math.min(cards.length - 1, 1)];
  await tap(pick.x, pick.y); log('  choose: tapped', JSON.stringify(pick.t), 'of', cards.length);
  await wait(1400);
  if ((await p.evaluate(() => window.__enc.getState())) !== 'choose') { log('  choose closed on the pick (a plain pick)'); return; }
  const ok = await box('#choOk');
  if (ok && !ok.dis) { await tap(ok.x, ok.y); log('  choose: Confirm'); }
  else log('  CHOOSE: Confirm not pressable', JSON.stringify(ok));
  await wait(2500);
}
async function playUnlock() {
  await wait(1500);
  const c = await box('#unClose');
  if (c) { await tap(c.x, c.y); log('  unlock: Close'); } else log('  UNLOCK: no Close');
  await wait(1500);
}
async function playChange() {
  log('  event change');
  await wait(1500);
  const sb = await box('#evBtn');
  if (sb) { await tap(sb.x, sb.y); log('  START tapped'); }
  const t0 = Date.now(), tapped = new Set();
  let lastKey = '';
  while (Date.now() - t0 < 300000) {
    const S = await p.evaluate(() => { const E = window.__enc, c = E.changeState(); if (!c) return null;
      const st = E.stage, sp = st.play.chg; const out = {};
      for (const k of Object.keys(sp)) { const q = E.changeSpotScreen(sp[k].pos); out[k] = q; }
      return { c, out }; });
    if (!S) break;
    const key = S.c.round + S.c.phase;
    if (key !== lastKey) { log('    round', S.c.round, S.c.phase, 'right', S.c.right, 'wrong', S.c.wrong, 'missed', S.c.missed); lastKey = key; }
    if (S.c.phase === 'lit') {
      const R = [[], ['cup'], ['cloth', 'clock'], ['her'], []][S.c.round] || [];
      const want = CHG === 'right' ? R : CHG === 'wrong' ? ['cup', 'clock'].filter(x => !R.includes(x)).slice(0, 1) : [];
      for (const id of want) {
        const k = S.c.round + ':' + id; if (tapped.has(k)) continue;
        const q = S.out[id];
        if (q && q.x > 4 && q.y > 4 && q.x < W - 4 && q.y < H - 4) { await tap(q.x, q.y); log('    tapped', id, 'at', q.x.toFixed(0), q.y.toFixed(0)); }
        else log('    CHANGE OFF SCREEN', id, JSON.stringify(q));
        tapped.add(k);
      }
      if (S.c.round === 0 && !tapped.has('shot0')) { tapped.add('shot0'); await shot('change-lit0'); }
      if (S.c.round === 3 && !tapped.has('shot3')) { tapped.add('shot3'); await shot('change-lit3'); }
    }
    await wait(250);
  }
  log('  event over', ((Date.now() - t0) / 1000).toFixed(0) + 's');
}

const phases = [], bedsAt = {}, presses = [];
let last = '', idle = 0, decided = false, cardAt = 0, sweep = -1;
const TMAX = 120 * 60 * 1000;
while (Date.now() - T0 < TMAX) {
  const I = await info();
  const key = `${I.st}|${I.phase}|${I.obj}`;
  if (key !== last) {
    log(I.st, I.phase, I.world, JSON.stringify(I.obj), I.cine !== null ? 'cine ' + I.cine : '', JSON.stringify(I.beds));
    if (I.phase && phases[phases.length - 1] !== I.phase) { phases.push(I.phase); bedsAt[I.phase] = I.beds; await shot(I.phase.replace(/[^a-z0-9]/gi, '_')); }
    last = key; idle = 0;
  }
  if (I.led) { await playLedger(I.led); continue; }
  if (I.evOn && I.kind === 'change') { await playChange(); continue; }
  if (I.st === 'choose') { await playChoose(); continue; }
  if (I.st === 'unlock') { await playUnlock(); continue; }
  if (I.st === 'decide' && !decided) {
    await wait(2500); await shot('decision');
    const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')];
      const r = B[i] && B[i].getBoundingClientRect(); return { n: B.length, at: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null }; }, OPT_I);
    if (bt.at) await tap(bt.at.x, bt.at.y);
    log('decision: tapped', OPT, 'of', bt.n); decided = true; continue;
  }
  if ((I.st === 'result' || I.st === 'complete') && !cardAt) { cardAt = Date.now(); log('the card'); await shot('card'); }
  if (cardAt && Date.now() - cardAt > 15000) break;
  if (I.st === 'play' && !I.pending && !I.queued) {
    let S = await spots();
    if (ASK === 'none') S = S.filter(s => !/^ask-|^tree$/.test(s.id));
    if (S.length) {
      const s = S[0], how = await press(s);
      presses.push(`${I.phase}:${s.id}=${how}`);
      log('  pressed', s.id, how);
      await wait(how === 'REFUSED' ? 1500 : 2500);
      if (how === 'REFUSED') idle += 1.5;
      continue;
    }
    if (I.phase && I.phase.startsWith('work')) {   // look round the room, as a thumb does: she is seen only at the edge of sight
      sweep = (sweep + 1) % 8;
      const off = [0.35, 0.6, 0.85, 1.1, -0.35, -0.6, -0.85, -1.1][sweep];
      await p.evaluate((off) => { const E = window.__enc, S = E.stage, M = S.cast.master.group.position, Y = E.yaw;
        Y.rotation.y = Math.atan2(-(M.x - Y.position.x), -(M.z - Y.position.z)) + off; E.pitch.rotation.x = -0.05; }, off);
      log('  looked round', off);
      await wait(2500); idle += 1; continue;
    }
    if (I.phase === 'arrive') {   // walk up to Pa Noi: the greeting is hers when he is within 3.4 m
      await p.evaluate(() => { const E = window.__enc, N = E.stage.cast.noi.group.position, Y = E.yaw;
        const dx = N.x - Y.position.x, dz = N.z - Y.position.z, d = Math.hypot(dx, dz);
        if (d > 3.0) { const k = (d - 2.4) / d; Y.position.x += dx * k; Y.position.z += dz * k; }
        Y.rotation.y = Math.atan2(-(N.x - Y.position.x), -(N.z - Y.position.z)); });
    }
  }
  await wait(1000); idle += 1;
  if (idle > 300) { log('STUCK', JSON.stringify(I)); await shot('stuck'); break; }
}

/* the voice log, on the audio clock: nothing starts while another is still sounding */
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
