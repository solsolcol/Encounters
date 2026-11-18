/* v27.0: episode 4 chapter 4 PLAYED THROUGH BY A FINGER on a phone-sized touch context (390 x 844, sound on, as on Chad's
   phone): tools/probes/e4c3drive.mjs's method and its helpers, copied whole. Every order is pressed the way a thumb presses
   it (the lens turned onto the thing and the player stood within its reach, then a CDP touch TAP on the interact badge,
   the thing itself or its mark; only if all three are refused, the engine's E path, reported as FALLBACK).
   SPIRIT VISION is opened and closed by a TAP on its eye (#visionBtn), as a thumb does: in THE SIGHT when there is
   nothing to press with it shut (the three presences are pressed with it open), and shut again once the three are seen;
   in THE FIGHT it is held open. THE FIGHT is played by the finger: each moment the shape nearest to reaching its mark is
   aimed at (the lens turned on it, what the right thumb's drag does) and FLICK tapped (#fireBtn) when it sits at the
   reticle; the bowl dipped again (DIP, #reloadBtn) at his teacher's bowl when it is empty (he walks back to it). The
   decision is a tap on OPT. Films: WATCH=1 watches every one; otherwise the opening and the trance are skipped by a TAP on
   the Skip button once it is offered (the real skip path), and the ENDING is always watched whole.
   Reports: the phases with the objective on screen and the beds at each; every press and how it landed; the vision's
   switches; the fight (shots, hits, what fed); the voice log (none over another); the captions (the chant's); the cues
   and how each sounded; every page error.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... OPT=A|B|C|D [WATCH=1] [OUT=dir] node tools/probes/e4c4drive.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT = process.env.OPT || 'A', OPT_I = 'ABCD'.indexOf(OPT), WATCH = !!process.env.WATCH;
const OUT = process.env.OUT || '/tmp/e4c4drive';
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

await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 240000 });
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
  /* the chapter's own play state (stage.dbg.play): busy, the fight, what is learned and looked at; the vision's */
  let pl = {}; try { const P = E.stage.dbg.play; pl = { busy: !!P.busy, learned: P.learned ? P.learned.size : 0, looked: P.looked ? P.looked.size : 0,
    fight: P.fight ? { on: !!P.fight.on, k: +P.fight.k.toFixed(3), wave: P.fight.wave, fed: P.fight.fed, families: P.fight.families, ended: !!P.fight.ended } : null,
    water: !!P.water, read: !!P.read, closed: !!P.closed, opened: !!P.opened }; } catch { /* */ }
  let v = {}; try { const q = E.vision(); v = { on: q.on, r: +q.r.toFixed(2), dir: q.dir, held: !!q.held }; } catch { /* */ }
  return { st: E.getState(), phase: i.phase, ev, pl, vis: v, busyQ: pl.busy,
           obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
           cine: E.cine.active() ? +E.cine.t().toFixed(1) : null, dur: E.cine.active() ? +E.cine.dur().toFixed(1) : null, skip: E.cine.active() && E.cine.skipShown(),
           beds, queued: i.queued, pending: i.pending, busy: pl.busy, voices: E.voices().length };
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
async function press(s) {
  await aimAt(s, !s.anyView);
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
/* THE EYE: a tap on Spirit Vision's button, as a thumb taps it */
const visTaps = [];
async function eye(want) {
  const v = await p.evaluate(() => window.__enc.vision());
  if (v.on === want) return true;
  const b = await box('#visionBtn');
  if (!b) { visTaps.push((want ? 'open' : 'shut') + ':NO-BUTTON'); return false; }
  await tap(b.x, b.y); await frames(2);
  const ok = await p.evaluate((w) => window.__enc.vision().on === w, want);
  visTaps.push((want ? 'open' : 'shut') + (ok ? '' : ':REFUSED'));
  log('  the eye tapped:', want ? 'open' : 'shut', ok ? '' : 'REFUSED');
  return ok;
}
/* THE FIGHT, by the finger: the shape nearest to its mark aimed at and flicked; the bowl dipped at his teacher's bowl */
const fightLog = { shots: 0, dips: 0, refused: 0, walks: 0, at: 0, held: 0 };
async function fightTick() {
  const T = await p.evaluate(() => {
    const E = window.__enc, D = E.stage.dbg, F = D.play.fight, Y = E.yaw;
    if (!F || !F.on) return null;
    const me = Y.position, live = F.shapes.filter(S => S.state === 'come' || S.state === 'feed');
    let best = null, bd = 1e9;
    for (const S of live) { const g = S.P.group.position; const tg = S.to === 'me' ? me : (S.to === 'pho' ? D.cast.phoB.group.position : D.cast[S.to].group.position);
      const d = Math.hypot(tg.x - g.x, tg.z - g.z); if (d < bd) { bd = d; best = { x: g.x, y: g.y + (S.P === D.spirits.large ? 0.75 : 0.45), z: g.z, to: S.to, d: +d.toFixed(2) }; } }
    const ammo = document.getElementById('ammo'); const rounds = ammo ? parseInt(ammo.textContent, 10) : NaN;
    return { best, rounds, me: { x: me.x, z: me.z }, n: live.length, k: F.k, fed: F.fed, fam: F.families, heat: +(D.play.heat || 0).toFixed(2),
             san: E.kit && E.kit.stat ? E.kit.stat('sanity') : null, hold: +(D.play.closeHold || 0).toFixed(1) };
  });
  if (!T) return false;
  /* (18 Nov) the fight's progress, once a minute of the probe's own time: the blessing's bar, what reached them, his nerve
     and his heart, what the finger did */
  if (Date.now() - fightLog.at > 60000) { fightLog.at = Date.now();
    log('  fight', JSON.stringify({ k: +T.k.toFixed(3), live: T.n, fed: T.fed, fam: T.fam, san: T.san, heat: T.heat, hold: T.hold, shots: fightLog.shots, dips: fightLog.dips, refused: fightLog.refused })); }
  if (T.rounds === 0) {
    /* the bowl is empty: back to his teacher's bowl (within 1.5 m of it), and DIP */
    const near = await p.evaluate(() => { const Y = window.__enc.yaw; return Math.hypot(Y.position.x - 0.35, Y.position.z - 3.20) < 1.3; });
    if (!near) { await aimAt({ x: 0.35, y: 0.3, z: 3.20, r: 1.6 }, true); fightLog.walks++; }
    const rb = await box('#reloadBtn'); if (rb) { await tap(rb.x, rb.y); fightLog.dips++; await wait(900); }
    return true;
  }
  if (!T.best) { await wait(300); return true; }
  await aimAt({ x: T.best.x, y: T.best.y, z: T.best.z, r: 99 }, false);
  const fb = await box('#fireBtn');
  if (fb && !fb.dis) { await tap(fb.x, fb.y); fightLog.shots++; } else fightLog.refused++;
  await wait(380);
  return true;
}

const phases = [], bedsAt = {}, presses = [];
let last = '', idle = 0, decided = false, cardAt = 0, lastCine = -1, lastVoices = 0, skips = [], films = [];
const ORDER = ['ravi', 'mala', 'folder', 'old', 'appa', 'amma', 'tell', 'look1', 'look2', 'look3', 'water'];
const TMAX = 150 * 60 * 1000;
while (Date.now() - T0 < TMAX) {
  const I = await info();
  const key = `${I.st}|${I.phase}|${I.obj}|${I.ev ? I.ev.kind + (I.ev.briefing ? ':brief' : '') : ''}`;
  if (key !== last) {
    log(I.st, I.phase, JSON.stringify(I.obj), I.cine !== null ? `film ${I.cine} of ${I.dur}` : '', JSON.stringify(I.beds), I.ev ? 'event ' + I.ev.kind : '', 'vision', JSON.stringify(I.vis), 'play', JSON.stringify(I.pl));
    if (I.phase && phases[phases.length - 1] !== I.phase) { phases.push(I.phase); bedsAt[I.phase] = I.beds; await shot(I.phase.replace(/[^a-z0-9]/gi, '_')); }
    last = key; idle = 0;
  }
  if (I.cine !== null && I.cine !== lastCine) { lastCine = I.cine; idle = 0; }
  if (I.voices !== lastVoices) { lastVoices = I.voices; idle = 0; }
  /* an event: its brief's START tapped */
  if (I.ev) {
    if (I.ev.briefing) { await shot('brief-' + I.ev.kind); const bt = await box('#evBtn'); if (bt) { await tap(bt.x, bt.y); log('  START tapped'); } await wait(1200); continue; }
    await wait(400); idle = 0; continue;
  }
  /* the ITEM UNLOCKED splash: its Close, as a thumb taps it */
  if (I.st === 'unlock') { await wait(1500); await shot('unlock'); const cb = await p.evaluate(() => { const b = [...document.querySelectorAll('#unlock button')].find(x => x.offsetParent);
      if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    if (cb) { await tap(cb.x, cb.y); log('  the splash closed'); } await wait(1200); continue; }
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
  /* THE FIGHT: the eye open, the finger on the shapes */
  if (I.st === 'play' && I.pl.fight && I.pl.fight.on) {
    /* (his sight held shut by his teacher, "Close. Breathe.": a finger waits out the hold, as a player must) */
    if (!I.vis.on && I.vis.dir !== 1 && !I.vis.held) await eye(true); else if (I.vis.held) fightLog.held++;
    await fightTick(); idle = 0;
    if (fightLog.shots % 10 === 1) await shot('fight');
    continue;
  }
  if (I.st === 'play' && !I.pending && !I.queued && !I.busy) {
    const S = (await spots()).sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
    if (S.length) {
      const s = S[0], how = await press(s);
      presses.push(`${I.phase}:${s.id}=${how}`);
      log('  pressed', s.id, how);
      if (/^look/.test(s.id) && how !== 'REFUSED') await shot(s.id);
      await wait(how === 'REFUSED' ? 1500 : 2500);
      if (how === 'REFUSED') idle += 1.5;
      continue;
    }
    /* THE SIGHT: nothing to press with the eye shut; open it. The three seen and his teacher's "Close.": shut it */
    if (I.phase === 'sight' && !I.pl.read) {
      if (I.pl.looked < 3 && !I.vis.on && I.vis.dir !== 1) { await eye(true); await wait(2500); await shot('sight-open'); continue; }
      if (I.pl.looked >= 3 && I.vis.on && I.vis.dir !== -1) { await wait(1500); await eye(false); await wait(2500); continue; }
    }
    /* history: a peek with the eye is optional; the probe never takes it (the plan's own path) */
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
log('VISION', visTaps.join(' ') || '(never tapped)');
const fres = await p.evaluate(() => { try { const F = window.__enc.stage.dbg.play.fight; return F ? { fed: F.fed, families: F.families, k: F.k, ended: F.ended,
  shapes: F.shapes.map(S => S.to + ':' + S.state + ':' + S.hits) } : null; } catch { return null; } });
log('FIGHT', JSON.stringify(fightLog), '| the chapter counted:', JSON.stringify(fres));
log('SKIPPED', skips.join(' ') || '(none: every film watched)');
log('BEDS', JSON.stringify(bedsAt));
const badPress = presses.some((x, i) => /FALLBACK/.test(x) || (/REFUSED/.test(x) && !presses.slice(i + 1).some(y => y.split('=')[0] === x.split('=')[0] && !/REFUSED|FALLBACK/.test(y))));
const badEye = visTaps.some(x => /REFUSED|NO-BUTTON/.test(x));
log('result', errs.length ? 'ERRORS' : !cardAt ? 'DID NOT REACH THE CARD' : over.length ? 'REACHED THE CARD, but a voice ran over another' : silent.length ? 'REACHED THE CARD, but a cue made no sound' : badPress ? 'REACHED THE CARD, but a press needed the E path' : badEye ? 'REACHED THE CARD, but the eye refused a tap' : 'PASS');
console.log('errs', JSON.stringify(errs));
await b.close();
process.exit(errs.length || !cardAt || over.length ? 1 : 0);
