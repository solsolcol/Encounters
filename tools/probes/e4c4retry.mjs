/* v27.0 (Chad, 21 Nov 2026, R139 to R144): THE HOLY-WATER FIGHT BEGUN AGAIN AT ITS START, THE WATER THAT NEVER RUNS OUT,
   THE BUTTON THAT BREATHES, AND HIS TEACHER'S WHY, driven by real input on a phone-sized touch page (390 x 844 CSS points
   drawn at two pixels a point; CDP touch taps for every press, the lens turned onto a thing as the drive probes turn it).
   A save is seeded at THE SIGHT with the three presences seen and his sight still to be shut (as a player's own save
   stands there); Continue is tapped on the title; the eye opened and shut (his teacher's reading follows); the
   blessing's beats, and Pho's four lines (ph4k1 to ph4k4) heard in their place, after ph4b0 and before "Take the holy
   water", one at a time (the voice log); the water taken, its splash closed, the brief read (no word of reloading) and
   its START tapped. THE FIGHT: no count, no reload button, no sign over his teacher's bowl, R does nothing, twenty flicks
   and never dry; the button glowing and breathing (its box and its light at the largest breath against every other box
   of the HUD, photographed full size); the fight's start held (the save is it). Then:
     MODE=retry (the default): her life run out (the probe takes it down to 18, said), the loss film and its card (Retry,
       and Restart chapter under it), the save the fight's start; the page RELOADED and Continue tapped: the fight's start
       again, every number compared with the first arrival there; START, lost again, Retry tapped twice at once: the same
       start, once; START, lost again, Retry: the same (nothing accumulates: beds, loops, spirits, her bar, his sight);
       START, and played to a win (her life kept at 60 or more by the probe, said; the finger flicks the nearest one): the
       room kept (saved at once), the trance (skipped by its Skip button), the decision (OPT), the ending watched, the
       card; the save then chapter 5's start, nothing held.
     MODE=restart: her life run out, and the card's Restart chapter tapped: the chapter's start (his teacher's first
       words, the history's order, the spawn), nothing held; then the whole chapter played by the finger to the fight
       again (the drive probe's order), Pho's four lines heard again before the water, and the brief.
     MODE=button: straight to the fight (a save seeded with the water taken), its button at its largest breath measured
       against every HUD box and photographed full size, in the water's colour and in the gold; DESK=1 on a desktop page
       (1280 x 800, a mouse: every press a click) instead of the phone's.
   Every page error is printed; the run exits non-zero on one or on a failed check.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [MODE=retry|restart] [OPT=C] [OUT=dir] [DSF=2] node tools/probes/e4c4retry.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const MODE = process.env.MODE || 'retry', OPT = process.env.OPT || 'C', OPT_I = 'ABCD'.indexOf(OPT), DESK = MODE === 'button' && !!process.env.DESK;
const OUT = process.env.OUT || '/tmp/e4c4retry-' + MODE + (DESK ? '-desk' : '');
fs.mkdirSync(OUT, { recursive: true });
const W = DESK ? 1280 : 390, H = DESK ? 800 : 844, DSF = +(process.env.DSF || (DESK ? 1 : 2));
const SPAWN = { x: 0.15, y: 1.62, z: 1.0, ry: Math.PI };
const SIGHT = 'sight:r,m,f,o,a,k,v,l1,l2,l3';
const WHY = ['ph4k1', 'ph4k2', 'ph4k3', 'ph4k4'];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(DESK ? { viewport: { width: W, height: H }, deviceScaleFactor: DSF } : { viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const save = { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: MODE === 'button' ? 'bless:r,m,f,o,a,k,v,l1,l2,l3,w,y' : SIGHT,
               conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: SPAWN, done: false, t: 1 };
/* the save seeded once in this context (a reload keeps what the game wrote since) */
await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|has no take|no pose/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const wait = (ms) => p.waitForTimeout(ms);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const tap = (x, y) => DESK ? p.mouse.click(Math.round(x), Math.round(y)) : p.touchscreen.tap(Math.round(x), Math.round(y));
const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 250 }).then(() => true, () => false);
let shotN = 0;
const shot = async (tag, clip) => { await frames(3); try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.png`, timeout: 240000, ...(clip ? { clip } : {}) }); } catch { log('  (a slow frame: no picture)'); } };
const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null;
  const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
  let vis = r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none';
  for (let a = e; a && vis; a = a.parentElement) if (a.classList && a.classList.contains('hide')) vis = false;
  return vis ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, dis: !!e.disabled, txt: e.textContent.trim().slice(0, 60) } : null; }, sel);
const pressSel = async (sel) => { const q = await box(sel); if (!q) return false; await tap(q.x, q.y); return true; };
const checks = {};
const state = () => p.evaluate(() => window.__enc.getState());
const info = () => p.evaluate(() => { const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
  const P = E.stage.dbg.play, F = P.fight; let ev = null; try { const q = E.kitDebug().event; ev = q ? { kind: q.kind, briefing: q.briefing } : null; } catch { /* */ }
  return { st: E.getState(), phase: i.phase, queued: i.queued, pending: i.pending, busy: !!P.busy, water: !!P.water, why: !!P.why, ev,
           fight: F ? { on: !!F.on, ended: !!F.ended, lost: !!F.lost, hp: F.hp, k: +F.k.toFixed(3), call: F.call } : null,
           obj: (() => { const o = document.getElementById('objective'); return o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null; })() }; });
/* turn onto a point (what the right thumb's drag does) */
const aimAt = (q) => p.evaluate((q) => { const E = window.__enc, Y = E.yaw, P = E.pitch;
  const dx = q.x - Y.position.x, dz = q.z - Y.position.z, d = Math.hypot(dx, dz);
  Y.rotation.y = Math.atan2(-dx, -dz); P.rotation.x = Math.max(-1.2, Math.min(1.2, Math.atan2(q.y - Y.position.y, Math.max(0.05, d)))); return +d.toFixed(2); }, q);
/* THE FIGHT'S START, read at the brief: everything a first arrival and a way back there must agree on */
const SNAP = () => p.evaluate(() => {
  const E = window.__enc, k = E.kit, D = E.stage.dbg, P = D.play, Y = E.yaw, r = n => +(+n).toFixed(3);
  const sp = [D.spirits.appa, D.spirits.large, D.spirits.oppress].concat(D.spirits.wander).map(S => ({ v: !!S.group.visible, gone: !!S.gone,
    x: r(S.group.position.x), z: r(S.group.position.z) }));
  const cast = {}; for (const c of ['amma', 'ravi', 'mala', 'pho', 'phoB']) { const C = D.cast[c]; cast[c] = C ? { v: !!C.group.visible, x: r(C.group.position.x), z: r(C.group.position.z) } : null; }
  let beds = []; try { const M = E.stage.amb().beds; beds = Object.keys(M).filter(q => M[q] > 0.02).sort(); } catch { /* */ }   // (which beds play: their levels ease)
  const v = E.vision(), st = E.stats;
  return { phase: k.getPhase(), stats: { s: r(st.sanity), a: r(st.awareness), w: r(st.wisdom) }, notes: k.getConduct().notes.slice().sort(), choices: k.choices(),
           at: { x: r(Y.position.x), z: r(Y.position.z), ry: r(Y.rotation.y) }, fight: P.fight ? 'on' : null, water: !!P.water, why: !!P.why, appaGone: !!P.appaGone,
           heat: r(P.heat || 0), vision: { on: v.on, r: r(v.r) },
           life: E.stakes ? !!E.stakes().life.on : null, edge: E.stakes ? r(E.stakes().edge.k) : null, glow: E.weaponGlowOn(),
           held: !!E.loseHold(), cast, spirits: sp, beds, voicesLive: E.voices().filter(q => q.t1 === null).length,
           bag: JSON.stringify(E.inv()), obj: (() => { const o = document.getElementById('objective'); return o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null; })() }; });
const same = (a, b, skip = []) => { const diff = [];
  for (const key of Object.keys(a)) { if (skip.includes(key)) continue; if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) diff.push(key + ': ' + JSON.stringify(a[key]).slice(0, 160) + ' / ' + JSON.stringify(b[key]).slice(0, 160)); }
  return diff; };
const savedNow = () => p.evaluate(() => { try { return JSON.parse(localStorage.getItem('mz.encounters.checkpoint')); } catch { return null; } });
/* the same comparison in detail: an array element by element (its index and both sides, nothing cut), and which of the
   differences touch something shown (a spirit shown on either side; the beds read apart, as their levels ease) */
const sameDetail = (a, b) => { const out = [], seen = [];
  for (const key of Object.keys(a)) { const x = a[key], y = b[key]; if (JSON.stringify(x) === JSON.stringify(y)) continue;
    if (Array.isArray(x) && Array.isArray(y) && x.length === y.length && key !== 'beds') {
      x.forEach((q, i) => { if (JSON.stringify(q) === JSON.stringify(y[i])) return; out.push(`${key}[${i}]: ${JSON.stringify(q)} / ${JSON.stringify(y[i])}`);
        if (key !== 'spirits' || q.v || y[i].v) seen.push(`${key}[${i}]`); });
    } else { out.push(`${key}: ${JSON.stringify(x)} / ${JSON.stringify(y)}`); if (key !== 'beds' && key !== 'voicesLive') seen.push(key); } }
  return { out, seen }; };
const bedsSeq = async (n = 16) => { const seq = []; for (let i = 0; i < n; i++) { seq.push(await p.evaluate(() => { const M = window.__enc.stage.amb().beds, o = {}; for (const k in M) if (M[k] > 0.001) o[k] = +M[k].toFixed(3); return o; })); await frames(1); } return seq; };

/* ---- to the title and Continue */
async function boot(tag) {
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 240000 });
  await frames(2);
  const sb = await box('#startBtn'); log(tag, 'title button:', sb && sb.txt);
  await tap(sb.x, sb.y);
  return until(() => window.__enc.getState() === 'play' && window.__enc.stage.info().applied, 1800000);
}
/* the eye, by a tap */
async function eye(want) {
  const v = await p.evaluate(() => window.__enc.vision().on); if (v === want) return true;
  await pressSel('#visionBtn'); await frames(2);
  return until((w) => window.__enc.vision().on === w, 30000, want);
}
/* a hotspot pressed by its badge (the lens turned onto it first, and stood in its reach) */
async function pressSpot(id) {
  const s = await p.evaluate((id) => { const h = window.__enc.stage.hotspots.find(q => q.id === id); return h ? { x: h.pos.x, y: h.pos.y, z: h.pos.z, r: h.radius || 1.6 } : null; }, id);
  if (!s) return 'NONE';
  await p.evaluate((s) => { const E = window.__enc, Y = E.yaw; let dx = s.x - Y.position.x, dz = s.z - Y.position.z, d = Math.hypot(dx, dz);
    if (d > s.r * 0.7) { const k = (d - s.r * 0.55) / d; Y.position.x += dx * k; Y.position.z += dz * k; } }, s);
  await aimAt(s); await frames(3);
  const bg = await box('#interact .ibadge');
  if (bg) { await tap(bg.x, bg.y); await frames(2); return 'badge'; }
  return (await p.evaluate(() => window.__enc.interactNow())) ? 'FALLBACK(E)' : 'REFUSED';
}
/* the ITEM UNLOCKED splash closed by its button */
async function closeSplash() {
  await until(() => window.__enc.getState() === 'unlock', 120000);
  await wait(1500);
  const cb = await p.evaluate(() => { const b = [...document.querySelectorAll('#unlock button')].find(x => x.offsetParent); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (cb) await tap(cb.x, cb.y);
}
/* at the brief: read it, photograph it, snapshot the fight's start */
async function atBrief(tag) {
  /* (an event is an overlay on play: the state stays 'play' while it is open, so its own record is read, never a state 'event':
     e4c4reload's wait for a state 'event' could never be met, and read as a slow box twice) */
  const ok = await until(() => { const q = window.__enc.kitDebug().event; return !!q && q.kind === 'guard' && !!q.briefing; }, 1800000);
  await wait(1200);
  const text = await p.evaluate(() => (document.getElementById('event') || document.body).innerText.replace(/\s+/g, ' '));
  const S = await SNAP();
  log(tag, 'the brief:', ok, JSON.stringify(text.slice(0, 400)));
  await shot(tag + '-brief');
  return { ok, text, S };
}
async function start() {
  await pressSel('#evBtn');
  return until(() => { const F = window.__enc.stage.dbg.play.fight; return window.__enc.getState() === 'play' && F && F.on; }, 600000);
}
const keepHer = (n = 60) => p.evaluate((n) => { const F = window.__enc.stage.dbg.play.fight; if (F && F.on && F.hp < n) { F.hp = n; window.__enc.kit.health({ k: n / 100 }); } }, n);
/* her life run out: taken down to 18 (said), then left: the next one to reach her ends it */
async function loseIt(tag) {
  await p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; if (F && F.on) { F.hp = Math.min(F.hp, 18); window.__enc.kit.health({ k: F.hp / 100 }); } });
  const filmed = await until(() => window.__enc.getState() === 'cine' || window.__enc.getState() === 'lost', 1800000);
  const lost = await until(() => window.__enc.getState() === 'lost', 1800000);
  const ready = await until(() => { const b = document.getElementById('retryBtn'), c = document.getElementById('restartChBtn');
    return !!b && !b.classList.contains('waiting') && !!c && !c.classList.contains('waiting'); }, 600000);
  const card = await p.evaluate(() => ({ say: document.getElementById('overSay').textContent.trim(), retry: document.getElementById('retryBtn').textContent.trim(),
    restart: (() => { const c = document.getElementById('restartChBtn'); return getComputedStyle(c).display !== 'none' ? c.textContent.trim() : null; })() }));
  log(tag, 'lost: film', filmed, 'card', lost, 'ready', ready, JSON.stringify(card));
  await shot(tag + '-lost-card');
  return { filmed, lost, ready, card };
}

/* ============================================================== to the fight, the first time */
checks.booted = await (async () => { await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 }); return boot('first'); })();
log('in play:', JSON.stringify(await info()));
if (MODE !== 'button') {
checks.atSight = (await info()).phase === 'sight';
/* his sight opened and shut: the reading, then the blessing */
checks.eyeOpened = await eye(true);
await wait(2600);
checks.eyeShut = await eye(false);
checks.reading = await until(() => window.__enc.stage.info().heard.includes('ph4s4'), 900000);
log('the reading heard');
checks.blessing = await until(() => window.__enc.stage.info().phase === 'bless', 600000);
/* the order "Take the holy water" comes only after his four lines */
checks.whyBeforeOrder = await until(() => { const i = window.__enc.stage.info(); return i.heard.includes('ph4k4') && !i.pending && !window.__enc.stage.dbg.play.busy; }, 1800000);
const order = await info();
log('after the why:', JSON.stringify(order));
await until(() => ((document.getElementById('objTxt') || {}).textContent || '').trim() === 'Take the holy water', 120000);
checks.orderAfterWhy = ((await info()).obj || '') === 'Take the holy water';
const V1 = await p.evaluate(() => window.__enc.voices().map(q => ({ n: q.name, t0: +q.t0.toFixed(2), t1: q.t1 === null ? null : +q.t1.toFixed(2) })));
const vi = (n) => V1.findIndex(q => q.n === n);
log('voices:', V1.slice(-12).map(q => `${q.n}@${q.t0}-${q.t1}`).join(' '));
checks.whyInOrder = vi('ph4b0') >= 0 && WHY.every((n, i) => vi(n) > (i ? vi(WHY[i - 1]) : vi('ph4b0')));
checks.whyOnce = WHY.every(n => V1.filter(q => q.n === n).length === 1);
checks.noVoiceOverVoice = V1.every((q, i) => i === 0 || V1[i - 1].t1 === null || q.t0 >= V1[i - 1].t1 - 0.05);
checks.whyReceipt = /(^|,)y(,|$)/.test(((await p.evaluate(() => window.__enc.kit.getPhase())) || '').split(':')[1] || '');
await shot('why-done-order');
/* the water taken, its splash closed: the brief */
log('the water:', await pressSpot('water'));
await closeSplash();
}
const A = await atBrief('first');
if (MODE === 'button') {
  /* (the beds after a Continue into the fight's start, frame by frame: the chapter mixes them before it lays the phase on
     (updateNotes: mixBeds, then applyPhase), so its first frame mixes the lit room's beds; read until they settle. On this
     box a frame is a quarter second of the beds' clock) */
  log('the beds after the Continue, frame by frame:', JSON.stringify(await bedsSeq()));
}
checks.briefFirst = A.ok;
checks.briefNoReload = !/reload|R to |gold icon|refill/i.test(A.text);
checks.firstNotHeld = A.S.held === false;                                   // (nothing is held before the fight begins)
checks.fightOn = await start();
/* THE FIGHT: what the HUD shows, the hold, the glow */
const H1 = await p.evaluate(() => { const E = window.__enc, b = document.body, d = (id) => { const e = document.getElementById(id); return e ? getComputedStyle(e).display : 'absent'; };
  let sign = 0; E.stage.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 29) sign++; });
  const h = E.loseHold();
  return { noAmmo: b.classList.contains('wpnNoAmmo'), ammo: d('ammo'), reload: d('reloadBtn'), fire: d('fireBtn'), sign, held: !!h, heldPhase: h ? h.st.phase : null,
           glow: b.classList.contains('wpnGlow'), anim: getComputedStyle(document.getElementById('fireBtn')).animationName,
           saved: (() => { try { return JSON.parse(localStorage.getItem('mz.encounters.checkpoint')).phase; } catch { return null; } })() }; });
log('fight HUD:', JSON.stringify(H1));
checks.noCount = H1.noAmmo && H1.ammo === 'none' && H1.reload === 'none' && H1.fire !== 'none';
checks.noSign = H1.sign === 0;
checks.heldAtStart = H1.held && H1.heldPhase === A.S.phase && H1.saved === A.S.phase;
checks.glowOn = H1.glow && /wpnBreath/.test(H1.anim);
/* the button at its largest breath: every box of the HUD against it, and its light; photographed full size */
const M = await p.evaluate(() => {
  const anims = document.getAnimations().filter(a => a.animationName === 'wpnBreath' || a.animationName === 'wpnGlow');
  for (const a of anims) { a.pause(); a.currentTime = 1200; }
  const fb = document.getElementById('fireBtn'), r = fb.getBoundingClientRect(), cs = getComputedStyle(fb, '::before');
  const sh = /(\d+(?:\.\d+)?)px (\d+(?:\.\d+)?)px$/.exec((cs.boxShadow.split('), ')[0] || '').replace(/^.*\)\s*/, '')) || null;
  const out = []; const seen = new Set();
  for (const e of document.querySelectorAll('body *')) {
    if (e === fb || fb.contains(e) || e.contains(fb)) continue;
    const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
    if (s.position !== 'fixed' && s.position !== 'absolute') continue;
    const q = e.getBoundingClientRect(); if (q.width < 2 || q.height < 2 || q.width >= innerWidth * 0.95 && q.height >= innerHeight * 0.95) continue;
    let hidden = false; for (let a = e; a; a = a.parentElement) if (a.classList && a.classList.contains('hide')) { hidden = true; break; }
    if (hidden) continue;
    const id = e.id || e.className || e.tagName; if (seen.has(id)) continue; seen.add(id);
    out.push({ id: String(id).slice(0, 40), l: q.left, t: q.top, r: q.right, b: q.bottom });
  }
  return { anims: anims.length, fb: { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width }, ring: cs.boxShadow, boxes: out };
});
const ov = (q, s) => !(q.r <= s.l || q.l >= s.r || q.b <= s.t || q.t >= s.b);
const GLOW = 4 + 16 + 5;                                                    // (the light: its box 4 px out, a 16 px blur and a 5 px spread)
const halo = { l: M.fb.l - GLOW, t: M.fb.t - GLOW, r: M.fb.r + GLOW, b: M.fb.b + GLOW };
const hitsBtn = M.boxes.filter(q => ov(q, M.fb)), hitsHalo = M.boxes.filter(q => ov(q, halo));
log('the button at its largest breath:', JSON.stringify(M.fb), 'animations paused', M.anims, 'ring', M.ring);
log('  boxes over the button:', JSON.stringify(hitsBtn), ' over its light:', JSON.stringify(hitsHalo.map(q => q.id)));
checks.breathPaused = M.anims >= 2;
checks.breathInside = M.fb.l >= 0 && M.fb.t >= 0 && M.fb.r <= W && M.fb.b <= H;
checks.breathClear = hitsBtn.length === 0;
await shot('button-largest-breath');
await shot('button-crop', { x: Math.max(0, M.fb.l - 60), y: Math.max(0, M.fb.t - 60), width: Math.min(W, M.fb.r + 60) - Math.max(0, M.fb.l - 60), height: Math.min(H, M.fb.b + 60) - Math.max(0, M.fb.t - 60) });
if (MODE === 'button') {
  /* and in the gold: the water's colour handed to the button as the gold gives it (kit.sprayColor), at the same breath */
  await p.evaluate(() => window.__enc.kit.sprayColor(0xffc24a, { size: 1.6 }));
  await frames(3);
  /* (the button's gold is the engine's own reading of the water's colour, three's linear values: its border and its light
     share it, so the light is read against the button's own --wg) */
  const ring = await p.evaluate(() => { const fb = document.getElementById('fireBtn'); return { shadow: getComputedStyle(fb, '::before').boxShadow, wg: fb.style.getPropertyValue('--wg') }; });
  log('in the gold, its light:', JSON.stringify(ring));
  checks.goldLight = !!ring.wg && ring.shadow.includes(ring.wg.split(',').map(Number).join(', ')) && !/150, 225, 255/.test(ring.shadow);
  await shot('button-gold-largest-breath');
  await shot('button-gold-crop', { x: Math.max(0, M.fb.l - 60), y: Math.max(0, M.fb.t - 60), width: Math.min(W, M.fb.r + 60) - Math.max(0, M.fb.l - 60), height: Math.min(H, M.fb.b + 60) - Math.max(0, M.fb.t - 60) });
  await p.evaluate(() => window.__enc.kit.sprayColor(null));
  /* the smallest breath too, for the picture's sake */
  await p.evaluate(() => { for (const a of document.getAnimations()) if (a.animationName === 'wpnBreath' || a.animationName === 'wpnGlow') a.currentTime = 0; });
  await shot('button-smallest-breath-crop', { x: Math.max(0, M.fb.l - 60), y: Math.max(0, M.fb.t - 60), width: Math.min(W, M.fb.r + 60) - Math.max(0, M.fb.l - 60), height: Math.min(H, M.fb.b + 60) - Math.max(0, M.fb.t - 60) });
}
await p.evaluate(() => { for (const a of document.getAnimations()) if (a.animationName === 'wpnBreath' || a.animationName === 'wpnGlow') a.play(); });
/* twenty flicks, never dry; R does nothing */
await keepHer();
const log0 = await p.evaluate(() => window.__enc.weaponLog.length);
for (let i = 0; i < 20; i++) { await pressSel('#fireBtn'); await wait(420); if (i % 5 === 4) await keepHer(); }
await p.keyboard.press('KeyR'); await frames(2);
const F20 = await p.evaluate((n) => { const L = window.__enc.weaponLog.slice(n), nf = document.getElementById('nofire');
  return { flicks: L.filter(q => !q.empty).length, dry: L.filter(q => q.empty).length, words: nf && nf.classList.contains('on') ? nf.textContent : '',
           dip: window.__enc.ownState().busy, motes: (() => { let m = 0; window.__enc.stage.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 30 && o.visible) m++; }); return m; })() }; }, log0);
log('twenty flicks and R:', JSON.stringify(F20));
checks.neverDry = F20.flicks >= 18 && F20.dry === 0 && !/holy water/i.test(F20.words);
checks.rNothing = F20.dip !== 'reload' && F20.motes === 0;
await shot('fight-flicks');

if (MODE === 'button') {
  /* (R140, never breathing under the golden showcase, where it cannot be pressed: the retry mode's win polled past its 7.5 s
     on this box. The chapter opens the showcase from inside its own frame (its clock's callbacks run in updateNotes) and
     the engine takes the weapon's buttons down later in that same frame (weaponUp is derived on the frame, in play only),
     so the glow is never painted under it. Opened here the same way, the engine's own showcase from inside the stage's
     frame, held 30 s (`auto`); the button read on every drawn frame until play is back; and once, with the showcase up,
     the class of its last 0.6 s (scToHud: the weapon's buttons on the screen again, for the amulet to go down into)) */
  await p.evaluate(() => { const E = window.__enc, S = E.stage, orig = S.updateNotes, b = document.body, fb = document.getElementById('fireBtn'), hud = document.getElementById('weaponHud');
    const R = window.__sc = { began: null, rec: [], forced: null, done: false }, t0 = performance.now();
    const read = () => ({ ms: Math.round(performance.now() - t0), st: E.getState(), up: b.classList.contains('weaponUp'), toHud: b.classList.contains('scToHud'),
      hud: getComputedStyle(hud).display, anim: getComputedStyle(fb).animationName, light: getComputedStyle(fb, '::before').content });
    let go = true;
    S.updateNotes = function (dt, t) { orig.call(this, dt, t); if (go) { go = false; R.began = E.kit.unlock('amulet', { showcase: true, gather: 'swirl', auto: 30 }); } };
    const tick = () => {
      const q = read(); R.rec.push(q);
      if (q.st === 'unlock' && !q.up && !R.forced && !q.toHud) { b.classList.add('scToHud'); R.forced = read(); b.classList.remove('scToHud'); }
      if (!go && (q.st === 'play' && R.rec.some(x => x.st === 'unlock') || R.began === false) || performance.now() - t0 > 600000) { S.updateNotes = orig; R.done = true; return; }
      requestAnimationFrame(tick); };
    requestAnimationFrame(tick); });
  await until(() => window.__sc && window.__sc.done, 900000);
  const SC = await p.evaluate(() => window.__sc);
  const under = SC.rec.filter(q => q.st !== 'play');
  log('the showcase opened:', SC.began, '; the button on', SC.rec.length, 'drawn frames, as it changed:', JSON.stringify(SC.rec.filter((q, i) => i === 0 || JSON.stringify({ ...q, ms: 0 }) !== JSON.stringify({ ...SC.rec[i - 1], ms: 0 }))));
  log('  with its last 0.6 s\'s class laid on:', JSON.stringify(SC.forced));
  checks.noGlowUnderShowcase = SC.began === true && under.length > 0 && under.every(q => !/wpnBreath/.test(q.anim) && q.light === 'none')
    && !!SC.forced && SC.forced.hud !== 'none' && !/wpnBreath/.test(SC.forced.anim) && SC.forced.light === 'none';
  checks.glowBackAfterShowcase = /wpnBreath/.test(SC.rec[SC.rec.length - 1].anim);
  /* (a loss and Retry here too, the start compared in detail: which differences touch anything shown, and the beds frame by
     frame as they settle) */
  const L = await loseIt('button-loss');
  checks.buttonLoss = L.lost && L.ready && L.card.restart === 'Restart chapter';
  await pressSel('#retryBtn');
  const C = await atBrief('button-retry');
  log('the beds after Retry, frame by frame:', JSON.stringify(await bedsSeq()));
  const C2 = await SNAP();
  const dd = sameDetail(A.S, C.S), d2 = sameDetail(A.S, C2);
  log('Retry against the arrival, in detail:', dd.out.length ? '\n  ' + dd.out.join('\n  ') : 'the same');
  log('  differences that touch anything shown:', JSON.stringify(dd.seen), ' and sixteen frames later:', JSON.stringify(d2.seen), d2.out.filter(q => q.startsWith('beds')).join(' '));
  checks.buttonRetryAtStart = C.ok && dd.seen.length === 0;
} else if (MODE === 'retry') {
  /* ========================================================== (R144 case 6) a tab closed in the middle of the fight, no loss:
     the fight has moved the run on (the water thrown at Appa: his receipt x and the card's note, and his nerve spent), and
     the page is reloaded and Continue tapped: the fight's start, every number of it, none of what the fight did */
  await eye(true); await wait(2400);
  const ap = await p.evaluate(() => { const g = window.__enc.stage.dbg.spirits.appa.group.position; return { x: g.x, y: 1.2, z: g.z }; });
  await aimAt(ap); await frames(2); await pressSel('#fireBtn');
  const struck = await until(() => window.__enc.stage.dbg.play.appaGone, 60000);
  await p.evaluate(() => window.__enc.kit.award('sanity', -7));
  const mid = await p.evaluate(() => ({ phase: window.__enc.kit.getPhase(), san: window.__enc.stats.sanity, notes: window.__enc.kit.getConduct().notes,
    saved: (() => { try { const s = JSON.parse(localStorage.getItem('mz.encounters.checkpoint')); return { phase: s.phase, san: s.stats.sanity, notes: s.conduct.notes }; } catch { return null; } })() }));
  log('mid-fight, Appa struck', struck, JSON.stringify(mid));
  checks.midFightSaveHeld = struck && /(^|,)x(,|$)/.test(mid.phase.split(':')[1] || '') && !!mid.saved && mid.saved.phase === A.S.phase && Math.abs(mid.saved.san - A.S.stats.s) < 0.01;
  await p.reload({ waitUntil: 'load', timeout: 240000 });
  checks.midFightContinue = await boot('mid-fight');
  const M6 = await atBrief('mid-fight');
  const d6 = same(A.S, M6.S, ['voicesLive']);
  log('a mid-fight tab close and Continue against the first arrival:', d6.length ? d6 : 'the same');
  checks.midFightAtStart = M6.ok && d6.length === 0;
  checks.fightOn1b = await start();
  /* ========================================================== lost, the page reloaded, Continue */
  const L1 = await loseIt('loss1');
  checks.loss1 = L1.filmed && L1.lost && L1.ready && L1.card.say.startsWith('Too many green spirits reached Amma') && L1.card.restart === 'Restart chapter';
  const s1 = await savedNow();
  checks.loss1Saved = !!s1 && s1.phase === A.S.phase && Math.abs(s1.stats.sanity - A.S.stats.s) < 0.01 && Math.abs(s1.at.x - A.S.at.x) < 0.01 && Math.abs(s1.at.z - A.S.at.z) < 0.01;
  log('the save after the loss:', JSON.stringify({ phase: s1 && s1.phase, stats: s1 && s1.stats, at: s1 && s1.at }));
  await p.reload({ waitUntil: 'load', timeout: 240000 });
  checks.reloadContinue = await boot('reload');
  const B = await atBrief('reload');
  const dB = same(A.S, B.S, ['voicesLive']);
  log('reload + Continue against the first arrival:', dB.length ? dB : 'the same');
  checks.reloadAtStart = B.ok && dB.length === 0;
  checks.reloadNoWhy = !(await p.evaluate((W) => window.__enc.voices().some(q => W.includes(q.n)), WHY));
  /* ========================================================== lost again, Retry tapped twice at once */
  checks.fightOn2 = await start();
  const L2 = await loseIt('loss2');
  checks.loss2 = L2.lost && L2.ready && L2.card.restart === 'Restart chapter';
  const rb = await box('#retryBtn');
  /* (read in the page as the press lands: the first frame after it is black, and the lift is 0.6 s) */
  await p.evaluate(() => { window.__atRetry = []; document.getElementById('retryBtn').addEventListener('click', () => {
    window.__atRetry.push({ st: window.__enc.getState(), fade: window.__enc.kit.getFade(), phase: window.__enc.kit.getPhase() }); }); });
  await Promise.all([tap(rb.x, rb.y), (async () => { await wait(40); await tap(rb.x, rb.y); })()]);
  const fadeAt = await p.evaluate(() => (window.__atRetry || [])[0] || {});
  log('  both presses as they landed:', JSON.stringify(await p.evaluate(() => window.__atRetry)));
  log('after a double tap on Retry:', JSON.stringify(fadeAt));
  checks.retryFromBlack = fadeAt.st === 'play' && fadeAt.fade > 0.5;
  const C = await atBrief('retry-double');
  const dC = same(A.S, C.S, ['voicesLive']);
  log('Retry (double tap) against the first arrival:', dC.length ? dC : 'the same');
  checks.retryAtStart = C.ok && dC.length === 0;
  checks.retryNoWhy = !(await p.evaluate((W) => window.__enc.voices().some(q => W.includes(q.n)), WHY));
  /* ========================================================== lost a third time, Retry: nothing accumulates */
  checks.fightOn3 = await start();
  const L3 = await loseIt('loss3');
  await pressSel('#retryBtn');
  const D3 = await atBrief('retry-again');
  const dD = same(A.S, D3.S, ['voicesLive']);
  log('Retry again against the first arrival:', dD.length ? dD : 'the same');
  checks.retryAgainAtStart = L3.lost && D3.ok && dD.length === 0;
  /* ========================================================== START, played to a win */
  checks.fightOn4 = await start();
  const tW = Date.now();
  let flicks = 0;
  const showcase = [];                                                       // (the button read while the golden showcase stands: R140, never breathing there)
  while (Date.now() - tW < 120 * 60 * 1000) {
    const I = await info();
    if (I.st === 'play' && I.fight && I.fight.on) {
      await keepHer();
      if (!(await p.evaluate(() => window.__enc.vision().on || window.__enc.vision().held))) await eye(true);
      const t = await p.evaluate(() => { const D = window.__enc.stage.dbg, F = D.play.fight; let best = null, bd = 1e9;
        for (const S of F.shapes) { if (S.state !== 'come' && S.state !== 'feed') continue; const g = S.P.group.position, a = D.cast.amma.group.position;
          const d = Math.hypot(a.x - g.x, a.z - g.z); if (d < bd) { bd = d; best = { x: g.x, y: g.y + 0.45, z: g.z }; } }
        return best; });
      if (t) { await aimAt(t); await frames(1); await pressSel('#fireBtn'); flicks++; }
      await wait(450); continue;
    }
    if (I.st === 'unlock') {                                                    // (the golden showcase goes by itself)
      showcase.push(await p.evaluate(() => { const b = document.body, fb = document.getElementById('fireBtn');
        return { up: b.classList.contains('weaponUp'), toHud: b.classList.contains('scToHud'), hud: getComputedStyle(document.getElementById('weaponHud')).display,
                 anim: getComputedStyle(fb).animationName, light: getComputedStyle(fb, '::before').content }; }));
      await wait(200); continue; }
    if (I.fight && I.fight.ended) break;
    await wait(500);
  }
  const kept = await info();
  log('the fight ended:', JSON.stringify(kept), 'flicks', flicks);
  log('the button under the golden showcase,', showcase.length, 'reads:', JSON.stringify(showcase.filter((q, i) => i === 0 || JSON.stringify(q) !== JSON.stringify(showcase[i - 1]))));
  checks.noGlowUnderShowcase = showcase.length ? showcase.every(q => !/wpnBreath/.test(q.anim) && q.light === 'none') : 'not seen';
  const sK = await savedNow();
  checks.wonSavedAtOnce = !!sK && /^kept/.test(sK.phase || '') && (await p.evaluate(() => window.__enc.loseHold() === null));
  /* (the coordinator's case a) after the WIN, the page reloaded and Continue tapped: after the fight (the room kept, its
     trance), never its start */
  await p.reload({ waitUntil: 'load', timeout: 240000 });
  checks.wonContinue = await boot('after-win');
  const AW = await p.evaluate(() => { const E = window.__enc, q = E.kitDebug().event; return { phase: E.stage.info().phase, brief: !!q && q.kind === 'guard', held: E.loseHold() }; });
  checks.wonContinueTrance = await until(() => window.__enc.getState() === 'cine', 600000);
  log('after the win, reload and Continue:', JSON.stringify(AW), 'the trance', checks.wonContinueTrance);
  checks.wonContinueAfterFight = AW.phase === 'kept' && !AW.brief && AW.held === null;
  /* the trance (skipped by its button), the decision, the ending, the card */
  let decided = false, carded = false;
  const tE = Date.now();
  while (Date.now() - tE < 90 * 60 * 1000) {
    const st = await state();
    if (st === 'cine' && !decided) { const sk = await box('#cineSkip'); if (sk) { await tap(sk.x, sk.y); log('  the trance skipped'); } await wait(1500); continue; }
    if (st === 'decide' && !decided) {
      await wait(2500);
      await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 }).catch(() => {});
      const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const r = B[i] && B[i].getBoundingClientRect(); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, n: B.length } : null; }, OPT_I);
      if (bt) { await tap(bt.x, bt.y); decided = true; log('  the decision:', OPT, 'of', bt.n); }
      await wait(1500); continue;
    }
    if (st === 'result' && !carded) {
      carded = true; await wait(3000); await shot('result-card');
      await until(() => { const b = document.getElementById('nextBtn'); return b && !b.classList.contains('waiting'); }, 600000);
      await pressSel('#nextBtn'); await wait(1500); continue;
    }
    if (st === 'complete') break;
    await wait(1000);
  }
  checks.decided = decided; checks.carded = carded;
  checks.complete = (await state()) === 'complete';
  await shot('complete');
  const sN = await savedNow();
  log('the save after the chapter:', JSON.stringify({ ch: sN && sN.ch, phase: sN && sN.phase, at: sN && sN.at }));
  checks.nextChapterStart = !!sN && sN.ch === 'e4c5' && sN.at === null && !sN.phase && (await p.evaluate(() => window.__enc.loseHold() === null && window.__enc.loseAgainHeld() === false));
} else {
  /* ========================================================== lost, and the card's Restart chapter */
  const L1 = await loseIt('loss');
  checks.lossCard = L1.lost && L1.ready && L1.card.restart === 'Restart chapter';
  await pressSel('#restartChBtn');
  checks.restartIsStart = await until(() => { const E = window.__enc; return E.getState() === 'play' && E.stage.info().applied && E.stage.info().phase === 'history'; }, 600000);
  const R0 = await p.evaluate(() => { const E = window.__enc, Y = E.yaw; return { phase: E.kit.getPhase(), held: E.loseHold(), at: { x: +Y.position.x.toFixed(2), z: +Y.position.z.toFixed(2) },
    san: E.stats.sanity, saved: (() => { try { const s = JSON.parse(localStorage.getItem('mz.encounters.checkpoint')); return { phase: s.phase, at: s.at }; } catch { return null; } })() }; });
  log('after Restart chapter:', JSON.stringify(R0));
  checks.restartNothingHeld = R0.held === null && Math.abs(R0.at.x - SPAWN.x) < 0.3 && Math.abs(R0.at.z - SPAWN.z) < 0.3 && (!R0.saved.phase || /^history/.test(R0.saved.phase));
  await shot('restart-chapter');
  /* the whole chapter again by the finger, to the fight (the drive probe's order) */
  const ORDER = ['ravi', 'mala', 'folder', 'old', 'appa', 'amma', 'tell', 'look1', 'look2', 'look3', 'water'];
  const tR = Date.now(); let briefed = false;
  while (Date.now() - tR < 150 * 60 * 1000) {
    const I = await info();
    if (I.ev && I.ev.kind === 'guard' && I.ev.briefing) { briefed = true; break; }
    if (I.st === 'picture') { await wait(2000); await pressSel('#picClose'); await wait(1200); continue; }
    if (I.st === 'unlock') { await closeSplash(); continue; }
    if (I.st === 'cine') { const sk = await box('#cineSkip'); if (sk) await tap(sk.x, sk.y); await wait(1500); continue; }
    if (I.ev) { await pressSel('#evBtn'); await wait(1200); continue; }
    if (I.st === 'play' && !I.pending && !I.queued && !I.busy) {
      const S = await p.evaluate(() => (window.__enc.stage.hotspots || []).filter(h => h && !h.done && (!h.enabled || h.enabled())).map(h => h.id));
      const id = S.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))[0];
      if (id) { if (/^look/.test(id)) await eye(true); log('  pressed', id, await pressSpot(id)); await wait(2500); continue; }
      if (I.phase === 'sight') { const pl = await p.evaluate(() => { const P = window.__enc.stage.dbg.play; return { opened: P.opened, looked: P.looked.size, closed: P.closed }; });
        if (!pl.opened || pl.looked < 3) await eye(true); else if (!pl.closed) await eye(false); await wait(2000); continue; }
    }
    await wait(800);
  }
  checks.reachedFightAgain = briefed;
  const V2 = await p.evaluate(() => window.__enc.voices().map(q => q.name));
  checks.whyHeardAgain = WHY.every(n => V2.filter(q => q === n).length === 2) && V2.lastIndexOf('ph4k4') < V2.length;
  log('voices on the way back:', V2.slice(-30).join(' '));
  await shot('brief-again');
}

checks.noPageErrors = errs.filter(e => e.startsWith('PAGEERROR')).length === 0;
log('CHECKS', JSON.stringify(checks));
if (errs.length) log('ERRORS\n' + errs.join('\n'));
await b.close();
process.exit(Object.values(checks).every(v => v === true) ? 0 : 1);
