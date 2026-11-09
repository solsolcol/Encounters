/* v25.0: episode 4 chapter 2 PLAYED THROUGH BY A FINGER on a phone-sized touch context (sound on, as on Chad's phone) —
   tools/probes/e4c1drive.mjs's method, its helpers copied whole: every order pressed the way a thumb presses it (the lens
   turned onto the thing and the player stood within its reach, then a CDP touch TAP on the interact badge, the thing
   itself or its mark; only if all three are refused, the engine's E path, reported as FALLBACK). The shape by the door is
   LOOKED AT (the lens turned onto the stand, as a thumb's drag does) and met by HOW: the light switch, standing still to
   watch, or walking up to it. The 5.2 pick (what he tells Lersi Chin) is a tap on PICK's card and Confirm; the decision a
   tap on OPT. The clearing film cannot be skipped the first time: it is watched. Reports the voice log (none over
   another), the captions (the chant's), the cues, the phases with the objective on screen, the beds at each phase, every
   press and how it landed, every page error.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... OPT=A|B|C|D HOW=light|watch|walk PICK=A|B|C|D [OUT=dir] node tools/probes/e4c2drive.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT = process.env.OPT || 'A', OPT_I = 'ABCD'.indexOf(OPT);
const HOW = process.env.HOW || 'light', PICK = process.env.PICK || 'A', PICK_I = 'ABCD'.indexOf(PICK);
const OUT = process.env.OUT || '/tmp/e4c2drive';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844;
const STAND = { x: 1.55, y: 1.5, z: 2.36 };                       // the Grand Opening stand inside the door (b_build1.js)
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

await p.goto(PAGE + '?ch=e4c2', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
log('version', await p.evaluate(() => (document.body.innerText.match(/v2\d\.\d+/) || ['?'])[0]), 'OPT', OPT, 'HOW', HOW, 'PICK', PICK);
{ const sb = await box('#startBtn'); await tap(sb.x, sb.y); }
await toPlay(p, 1500000);
log('in play');

const info = () => p.evaluate(() => {
  const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
  let ev = null; try { ev = E.evState ? E.evState() : null; } catch { ev = { kind: '?' }; }
  const o = document.getElementById('objective');
  const B = window.__CHAPTERS__.e4c2.ambience.beds, beds = {};
  for (const r of B) if (r[1] > 0.01) beds[r[0]] = +r[1].toFixed(2);
  return { st: E.getState(), phase: i.phase, kind: ev ? ev.kind : null,
           obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
           cine: E.cine.active() ? +E.cine.t().toFixed(1) : null, beds, queued: i.queued, pending: i.pending, busy: i.busy, mark: i.mark };
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
  /* (e4c2) knelt before Lersi Chin (`k` in the phase string's marks): turned, never moved */
  const kneeling = await p.evaluate(() => { let i = {}; try { i = window.__enc.stage.info(); } catch { /* */ } return /(^|,)k(,|$)/.test(i.mark || ''); });
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
/* the 5.2 pick (kit.pick, the choose window): PICK's card, then Confirm, both tapped */
async function playPick() {
  await wait(1200);
  await p.waitForFunction(() => document.querySelectorAll('#choList .choCard').length > 0, null, { timeout: 60000 }).catch(() => {});
  const cards = await p.evaluate(() => [...document.querySelectorAll('#choList .choCard')].map(c => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: c.textContent.trim().slice(0, 50) }; }));
  const pick = cards[Math.max(0, Math.min(cards.length - 1, PICK_I))];
  if (!pick) { log('  PICK: no card'); return; }
  await shot('pick');
  await tap(pick.x, pick.y); log('  pick: tapped', JSON.stringify(pick.t), 'of', cards.length);
  await wait(1400);
  const ok = await box('#choOk');
  if (ok && !ok.dis) { await tap(ok.x, ok.y); log('  pick: Confirm'); } else log('  PICK: Confirm not pressable', JSON.stringify(ok));
  await wait(2500);
}
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
const phases = [], bedsAt = {}, presses = [];
let last = '', idle = 0, decided = false, cardAt = 0, looked = false;
const TMAX = 120 * 60 * 1000;
while (Date.now() - T0 < TMAX) {
  const I = await info();
  await capShot(shot);
  const key = `${I.st}|${I.phase}|${I.obj}`;
  if (key !== last) {
    log(I.st, I.phase, JSON.stringify(I.obj), I.cine !== null ? 'cine ' + I.cine : '', JSON.stringify(I.beds), I.mark || '');
    if (I.phase && phases[phases.length - 1] !== I.phase) { phases.push(I.phase); bedsAt[I.phase] = I.beds; await shot(I.phase.replace(/[^a-z0-9]/gi, '_')); }
    last = key; idle = 0;
  }
  if (I.st === 'choose') { await playPick(); continue; }
  if (I.st === 'decide' && !decided) {
    await wait(2500); await shot('decision');
    await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
    const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')];
      const r = B[i] && B[i].getBoundingClientRect(); return { n: B.length, at: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null }; }, OPT_I);
    if (bt.at) await tap(bt.at.x, bt.at.y);
    log('decision: tapped', OPT, 'of', bt.n); decided = true; continue;
  }
  if ((I.st === 'result' || I.st === 'complete') && !cardAt) { cardAt = Date.now(); log('the card'); await shot('card'); }
  if (cardAt && Date.now() - cardAt > 15000) break;
  if (I.st === 'play' && !I.pending && !I.queued && !I.busy) {
    let S = await spots();
    /* the night: the shape by the door met the HOW way (the light, the watch, or walking up to it) */
    if (I.phase === 'night') {
      if (HOW === 'watch') S = S.filter(s => s.id !== 'switch');
      if (HOW === 'light') S = S.filter(s => s.id !== 'watch');
      if (HOW === 'walk') S = S.filter(s => s.id !== 'switch' && s.id !== 'watch');
    }
    if (S.length) {
      const s = S[0], how = await press(s);
      presses.push(`${I.phase}:${s.id}=${how}`);
      log('  pressed', s.id, how);
      await wait(how === 'REFUSED' ? 1500 : 2500);
      if (how === 'REFUSED') idle += 1.5;
      continue;
    }
    if (I.phase === 'night' && !/hl|hw|hk|,r/.test(I.mark || '')) {
      if (!looked) {   // turn to the dark by the door, as a thumb's drag does: the shape is noticed when it is looked at
        await aimAt({ x: STAND.x, y: STAND.y, z: STAND.z, r: 9 }, false); looked = true; log('  looked at the shape by the door'); await wait(2500); continue;
      }
      if (HOW === 'walk') {   // walk up to it: within 1.15 m it shows what it is
        await aimAt({ x: STAND.x, y: STAND.y, z: STAND.z, r: 1.4 }, true); log('  walked up to it'); await wait(3000); continue;
      }
    }
  }
  await wait(1000); idle += 1;
  if (idle > 300) { log('STUCK', JSON.stringify(I)); await shot('stuck'); break; }
}

await capReport();
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
