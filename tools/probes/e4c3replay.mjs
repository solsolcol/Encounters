/* v26.0: A SAME-CHAPTER REPLAY of episode 4 chapter 3, through the real path (v8.2: "run the pass twice through the real
   replay path and diff it"). The card's Retry and the sealed card's Continue both run restart(): the kit and the stage
   are RESET, never built again (there is no chapter after this one yet, so Continue plays it again), and what reset()
   forgets is what the second run starts with. tools/probes/e4c3drive.mjs's finger, its helpers copied whole:
     pass 1 · a fresh load, played by a finger to ending OPT1 (films from play skipped by the Skip button, the ending
              watched whole), to the card;
     the replay · the card's own buttons, tapped: Next, then Continue on the sealed card (HOW=retry taps Retry on the
              outcome card instead);
     the digest · every object of the scene (shown or hidden, where it stands, its materials, a mesh of copies' own
              places), the fog, the lights and the chapter's own state, taken at the same second of the chapter's clock
              on the fresh run (twice, three seconds apart: what differs between those two is moving, and is not
              compared) and again on the replay. Whatever else differs is something reset() did not put back;
     pass 2 · played by the finger again to ending OPT2, to the card: the phases, the presses, the lines heard before
              the decision and the beds, each against pass 1's.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... OPT1=B OPT2=D [HOW=retry] [OUT=dir] node tools/probes/e4c3replay.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT1 = process.env.OPT1 || 'B', OPT2 = process.env.OPT2 || 'D', HOW = process.env.HOW || 'next', WATCH = !!process.env.WATCH;
const OUT = process.env.OUT || '/tmp/e4c3replay';
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
let passN = 1;
const shot = async (tag) => { try { await p.screenshot({ path: `${OUT}/p${passN}-${String(++shotN).padStart(2, '0')}-${tag}.jpg`, quality: 65, timeout: 240000 }); } catch { /* a slow frame */ } };
const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null;
  const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
  let vis = r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none';
  for (let a = e; a && vis; a = a.parentElement) if (a.classList && a.classList.contains('hide')) vis = false;
  return vis ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, dis: !!e.disabled, txt: e.textContent.trim().slice(0, 30) } : null; }, sel);

await p.goto(PAGE + '?ch=e4c3', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
log('version', await p.evaluate(() => (document.body.innerText.match(/v2\d\.\d+/) || ['?'])[0]), 'pass 1 to', OPT1, 'then the replay by', HOW, 'then pass 2 to', OPT2);
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
let breaths = [];
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

/* THE WORLD, READ: every object of the scene by its place in the graph (bones left out: a body's pose is its take's),
   in parts that are compared one by one: shown or hidden, where it stands, its materials, a mesh of copies' places */
const digest = () => p.evaluate(() => {
  const E = window.__enc, objs = {}, r3 = (v) => Math.round(v * 1000) / 1000;
  const walk = (o, path, up) => {
    if (o.isBone) return;
    /* (a turn and its negative are one turn: written with its last part not below zero. `sh`: drawn, with everything
       above it shown: what a player could see of it at this moment) */
    const Q = o.quaternion, sg = (Q.w < -1e-9 || (Math.abs(Q.w) <= 1e-9 && (Q.x + Q.y + Q.z) < 0)) ? -1 : 1, sh = up && o.visible;
    const rec = { v: o.visible ? 1 : 0, sh: sh ? 1 : 0, p: [o.position.x, o.position.y, o.position.z].map(r3).join(','),
                  q: [Q.x * sg, Q.y * sg, Q.z * sg, Q.w * sg].map(v => r3(v) + 0).join(','), s: [o.scale.x, o.scale.y, o.scale.z].map(r3).join(',') };
    if (o.material) rec.m = [].concat(o.material).map(m => (m ? [r3(m.opacity), m.transparent ? 1 : 0, m.visible ? 1 : 0, m.color ? m.color.getHexString() : '-',
      m.emissive ? m.emissive.getHexString() + '*' + r3(m.emissiveIntensity) : '-', m.map ? 1 : 0, m.depthTest ? 1 : 0, m.depthWrite ? 1 : 0, m.fog === false ? 0 : 1].join('/') : '-')).join(';');
    if (o.isInstancedMesh) { let h = 0; const a = o.instanceMatrix.array; for (let i = 0; i < o.count * 16; i++) h = (h * 31 + Math.round(a[i] * 500)) | 0; rec.i = o.count + '#' + h; }
    if (o.isLight) rec.l = r3(o.intensity) + '/' + (o.color ? o.color.getHexString() : '') + (o.groundColor ? '/' + o.groundColor.getHexString() : '');
    objs[path] = rec;
    const seen = {};
    for (const c of o.children) { const nm = (c.name || c.type) + (c.isInstancedMesh ? '[' + c.count + ']' : ''); seen[nm] = (seen[nm] || 0) + 1; walk(c, path + '/' + nm + '#' + seen[nm], sh); }
  };
  walk(E.scene, 'scene', true);
  const S = E.stage, i = S.info(), D = S.dbg, flat = (o) => { const r = {}; for (const k in o) { const v = o[k]; if (v === null || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string') r[k] = typeof v === 'number' ? r3(v) : v; else if (v instanceof Set) r[k] = 'Set(' + [...v].sort().join(',') + ')'; else r[k] = v === undefined ? 'undefined' : typeof v; } return r; };
  const fog = E.scene.fog, bg = E.scene.background;
  let kd = {}; try { const k = E.kitDebug(); kd = flat(k); kd.event = k.event ? k.event.kind : null; } catch (e) { kd = { err: String(e) }; }
  const state = { t: +i.t.toFixed(1), phase: i.phase, look: i.look, decOpen: i.decOpen, busy: i.busy, queued: i.queued, pending: i.pending, heard: i.heard.join(' '),
    play: flat(D.play), open: flat(D.open), kids: D.kidsDir ? D.kidsDir.ph : null, taper: D.taper ? D.taper.on : null,
    who: S.who().map(w => w.key + ':' + w.take + ':' + w.skins).join(' '),
    hot: S.hotspots.map(h => h.id + (h.done ? ':done' : '') + ((!h.enabled || h.enabled()) ? ':on' : ':off')).join(' '),
    fog: fog ? [fog.color.getHexString(), r3(fog.near || 0), r3(fog.far || 0), r3(fog.density || 0)].join('/') : null, bg: bg && bg.getHexString ? bg.getHexString() : String(bg && bg.type),
    cam: [r3(E.camera.fov), r3(E.camera.rotation.z), r3(E.camera.near), r3(E.camera.far)].join('/'),
    eye: [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z, E.yaw.rotation.y, E.pitch.rotation.x].map(r3).join(','),
    stats: JSON.stringify(E.stats), kit: kd, st: E.getState(),
    obj: (() => { const o = document.getElementById('objective'); return o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null; })(),
    hud: [...document.querySelectorAll('#hud > *, body > div')].filter(e => e.id && !e.classList.contains('hide') && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 2).map(e => e.id).sort().join(' '),
    bodyClass: document.body.className, beds: (() => { const M = S.amb().beds, r = {}; for (const k in M) r[k] = +M[k].toFixed(2); return JSON.stringify(r); })() };
  return { objs, state };
});
const PARTS = { v: 'shown', p: 'place', q: 'turn', s: 'size', m: 'material', i: 'copies', l: 'light' };
function diffWorld(a, b, c, tag) {
  /* a, b: the fresh run, three seconds apart (what differs between them is moving); c: the replay */
  const out = [], away = [], only = { fresh: [], replay: [] }; let moving = 0, same = 0;
  for (const k in a.objs) {
    if (!(k in c.objs)) { only.fresh.push(k); continue; }
    const A = a.objs[k], B = b.objs[k] || A, C = c.objs[k];
    for (const part in PARTS) {
      if (A[part] === C[part]) { same++; continue; }
      if (A[part] !== B[part] || (b.objs[k] && C[part] === B[part])) { moving++; continue; }
      /* (what is put away on both runs cannot be seen as it is: it is listed apart, each to be read once for whether
         it is placed again before it is shown) */
      (A.sh || C.sh ? out : away).push(`${PARTS[part]}  ${k}\n      fresh  ${A[part]}\n      replay ${C[part]}`);
    }
  }
  for (const k in c.objs) if (!(k in a.objs)) only.replay.push(k);
  const st = [];
  const cmp = (x, y, z, path) => { for (const k of new Set([...Object.keys(x || {}), ...Object.keys(z || {})])) {
    const X = x ? x[k] : undefined, Y = y ? y[k] : undefined, Z = z ? z[k] : undefined;
    if (X && typeof X === 'object') { cmp(X, Y, Z, path + k + '.'); continue; }
    if (X !== Z) st.push(`${path}${k}: fresh ${JSON.stringify(X)}${X !== Y ? ' (and ' + JSON.stringify(Y) + ' three seconds on: moving)' : ''} | replay ${JSON.stringify(Z)}`); } };
  cmp(a.state, b.state, c.state, '');
  console.log(`\n==== ${tag}: ${Object.keys(a.objs).length} objects on the fresh run, ${Object.keys(c.objs).length} on the replay; ${same} parts the same, ${moving} moving (not compared)`);
  console.log(`OBJECTS ONLY ON THE FRESH RUN: ${only.fresh.length}${only.fresh.length ? '\n   ' + only.fresh.slice(0, 40).join('\n   ') : ''}`);
  console.log(`OBJECTS ONLY ON THE REPLAY: ${only.replay.length}${only.replay.length ? '\n   ' + only.replay.slice(0, 40).join('\n   ') : ''}`);
  console.log(`PARTS THAT DIFFER, ARE NOT MOVING, AND ARE ON SCREEN ON ONE RUN OR THE OTHER: ${out.length}${out.length ? '\n   ' + out.slice(0, 120).join('\n   ') : ''}`);
  console.log(`PARTS THAT DIFFER ON WHAT IS PUT AWAY ON BOTH RUNS: ${away.length}${away.length ? '\n   ' + away.slice(0, 120).join('\n   ') : ''}`);
  console.log(`THE CHAPTER'S STATE THAT DIFFERS: ${st.length}${st.length ? '\n   ' + st.join('\n   ') : ''}`);
  return { n: out.length, away: away.length, only: only.fresh.length + only.replay.length, st };
}

async function pass(n, opt) {
  const optI = 'ABCD'.indexOf(opt); passN = n;
  const phases = [], bedsAt = {}, presses = [], unseen = [];
  let last = '', idle = 0, decided = false, cardAt = 0, lastCine = -1, lastVoices = 0, skips = [], films = [], dig = null, stuck = false;
  const TP = Date.now(), TMAX = 150 * 60 * 1000;
  breaths = [];
  const v0 = await p.evaluate(() => window.__enc.voices().length), c0 = await p.evaluate(() => window.__enc.stings().length), e0 = errs.length;
  while (Date.now() - TP < TMAX) {
  const I = await info();
  /* THE DIGEST, at the same second of the chapter's clock on either run: the first moment of play, the opening's line
     said and everything landed */
  if (!dig && I.st === 'play' && I.phase === 'arrive') {
    await p.waitForFunction(() => { const i = window.__enc.stage.info(); return i.applied && !i.waiting.length && i.t >= 7; }, null, { timeout: 900000, polling: 250 });
    dig = { a: await digest() };
    await p.waitForFunction(() => window.__enc.stage.info().t >= 10, null, { timeout: 900000, polling: 250 });
    dig.b = await digest();
    log(`  pass ${n}: the world read at the chapter's ${dig.a.state.t} s and ${dig.b.state.t} s: ${Object.keys(dig.a.objs).length} objects`);
    await shot('start');
    continue;
  }
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
      const r = B[i] && B[i].getBoundingClientRect(); return { n: B.length, txt: B[i] ? B[i].textContent.trim().slice(0, 40) : null, at: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null }; }, optI);
    if (bt.at) await tap(bt.at.x, bt.at.y);
    log('decision: tapped', opt, JSON.stringify(bt.txt), 'of', bt.n); decided = true; await wait(1500); continue;
  }
  if ((I.st === 'result' || I.st === 'complete') && !cardAt) { cardAt = Date.now(); log('the card'); await wait(2500); await shot('card'); }
  if (cardAt && Date.now() - cardAt > 9000) break;
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
  if (idle > 420) { log('STUCK', JSON.stringify(I)); await shot('stuck'); stuck = true; break; }
  }

  const V = (await p.evaluate(() => window.__enc.voices())).slice(v0);
  const over = [];
  for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
    const a = V[i], c = V[j], aEnd = a.t1 === null ? Infinity : a.t1;
    if (c.t0 < aEnd - 0.05 && c.t0 >= a.t0) over.push(`${a.name}(${a.t0.toFixed(1)}-${a.t1 === null ? '?' : a.t1.toFixed(1)}) x ${c.name}(${c.t0.toFixed(1)})`);
  }
  const cues = (await p.evaluate(() => window.__enc.stings().map(s => s.kind + (s.how === 'sample' ? '' : '(' + s.how + ')')))).slice(c0);
  const silent = cues.filter(c => /\(/.test(c));
  const bres = await p.evaluate(() => { try { return window.__enc.stage.dbg.play.breath; } catch { return null; } });
  const badPress = presses.some((x, i) => /FALLBACK/.test(x) || (/REFUSED/.test(x) && !presses.slice(i + 1).some(y => y.split('=')[0] === x.split('=')[0] && !/REFUSED|FALLBACK/.test(y))));
  const R = { n, opt, card: !!cardAt, stuck, phases, presses, unseen, over, silent, badPress, voices: V.map(v => v.name), cues, bedsAt, skips, breaths: breaths.slice(), bres, dig, errs: errs.slice(e0) };
  log(`PASS ${n} (${opt}) VOICES`, V.length, over.length ? 'OVERLAPS: ' + over.join('; ') : 'none over another', '|', R.voices.join(' '));
  log(`PASS ${n} CUES`, cues.length, silent.length ? 'NOT FROM A SAMPLE: ' + silent.join(' ') : 'every one from its sample');
  log(`PASS ${n} PHASES`, phases.join(' > '));
  log(`PASS ${n} PRESSES`, presses.join(' '));
  log(`PASS ${n} BREATHS`, breaths.join(' | '), '| the engine counted:', JSON.stringify(bres));
  log(`PASS ${n} SKIPPED`, skips.join(' ') || '(none)');
  log(`PASS ${n} BEDS`, JSON.stringify(bedsAt));
  log(`PASS ${n} HELD`, unseen.length ? 'THE BAI SRI IS HELD AND NOT DRAWN in: ' + unseen.join(' ') : 'what he holds is drawn wherever he holds it');
  log(`PASS ${n} result`, R.errs.length ? 'ERRORS' : !cardAt ? 'DID NOT REACH THE CARD' : unseen.length ? 'what he holds was not drawn' : over.length ? 'a voice ran over another' : silent.length ? 'a cue made no sound' : badPress ? 'a press needed the E path or was never accepted' : 'PASS');
  return R;
}

const R1 = await pass(1, OPT1);
let R2 = null, D = null, replayed = false;
if (R1.card) {
  /* THE REPLAY, by the card's own buttons */
  const btns = () => p.evaluate(() => [...document.querySelectorAll('button')].filter(e => { const r = e.getBoundingClientRect(); let v = r.width > 2 && r.height > 2 && getComputedStyle(e).visibility !== 'hidden';
    for (let a = e; a && v; a = a.parentElement) if (a.classList && a.classList.contains('hide')) v = false; return v; }).map(e => `${e.id || '?'}${e.classList.contains('waiting') ? '(waiting)' : ''}${e.disabled ? '(disabled)' : ''}:"${e.textContent.trim().slice(0, 24)}"`).join('  '));
  const tapWhenReady = async (sel) => {
    await p.waitForFunction((sel) => { const e = document.querySelector(sel); if (!e || e.disabled || e.classList.contains('waiting')) return false; const r = e.getBoundingClientRect(); if (r.width < 3) return false;
      for (let a = e; a; a = a.parentElement) if (a.classList && a.classList.contains('hide')) return false; return true; }, sel, { timeout: 600000, polling: 300 });
    await wait(1200); const q = await box(sel); await tap(q.x, q.y); log('  tapped', sel, JSON.stringify(q.txt)); await wait(1500);
  };
  log('at the card:', await p.evaluate(() => window.__enc.getState()), '| buttons:', await btns());
  if (HOW === 'retry') await tapWhenReady('#retryBtn');
  else {
    await tapWhenReady('#nextBtn');
    await p.waitForFunction(() => window.__enc.getState() !== 'result', null, { timeout: 600000, polling: 300 }).catch(() => {});
    log('after Next:', await p.evaluate(() => window.__enc.getState()), '| buttons:', await btns()); passN = 1; await shot('sealed');
    if (await p.evaluate(() => window.__enc.getState()) !== 'play') await tapWhenReady('#againBtn');
  }
  await p.waitForFunction(() => window.__enc.getState() === 'play' || window.__enc.getState() === 'cine', null, { timeout: 600000, polling: 300 }).catch(() => {});
  log('THE REPLAY BEGINS:', await p.evaluate(() => window.__enc.getState()), JSON.stringify(await p.evaluate(() => window.__enc.stage.info())));
  replayed = true;
  R2 = await pass(2, OPT2);
  if (R1.dig && R2.dig) D = diffWorld(R1.dig.a, R1.dig.b, R2.dig.a, 'THE WORLD AT THE START OF PLAY, a fresh run against the replay');
  /* the two passes, one against the other: the phases, the presses (a refused first contact retried is a retry),
     the lines heard before the decision, the beds by phase */
  const ph = R1.phases.join('>') === R2.phases.join('>');
  const pr = (L) => L.filter(x => !/REFUSED/.test(x)).join(' ');
  const before = (R) => { const out = []; for (const v of R.voices) { out.push(v); } return out; };
  const v1 = before(R1), v2 = before(R2); let common = 0; while (common < v1.length && common < v2.length && v1[common] === v2[common]) common++;
  console.log(`\n==== THE TWO PASSES\nphases the same: ${ph}\npresses the same: ${pr(R1.presses) === pr(R2.presses)}${pr(R1.presses) === pr(R2.presses) ? '' : '\n   1: ' + pr(R1.presses) + '\n   2: ' + pr(R2.presses)}`);
  console.log(`lines heard: pass 1 ${v1.length}, pass 2 ${v2.length}; the same for the first ${common} (then 1: ${v1.slice(common, common + 6).join(' ')} | 2: ${v2.slice(common, common + 6).join(' ')})`);
  const bedKeys = (R) => Object.keys(R.bedsAt).map(k => k + ':' + Object.keys(R.bedsAt[k]).sort().join('+')).join(' ');
  console.log(`beds by phase (which sound, not how loud): the same: ${bedKeys(R1) === bedKeys(R2)}${bedKeys(R1) === bedKeys(R2) ? '' : '\n   1: ' + bedKeys(R1) + '\n   2: ' + bedKeys(R2)}`);
}
const ok = R1.card && !R1.errs.length && R2 && R2.card && !R2.errs.length && !R2.unseen.length && !R2.over.length && !R2.badPress && !R2.stuck;
log('result', !R1.card ? 'PASS 1 DID NOT REACH THE CARD' : !replayed ? 'NO REPLAY' : !R2.card ? 'THE REPLAY DID NOT REACH THE CARD' : ok ? `BOTH PASSES TO THE CARD; the world's differences at the start: ${D ? D.n + ' parts on screen (' + D.away + ' put away), ' + D.only + ' objects, ' + D.st.length + ' of the state (read them above)' : 'not read'}` : 'THE REPLAY HAS FAULTS (above)');
console.log('errs', JSON.stringify(errs));
await b.close();
process.exit(ok ? 0 : 1);
