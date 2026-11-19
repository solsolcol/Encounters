/* v27.0 build 42 (Chad, 19 Nov 2026, R100/R101, "Do #3 only"): HIS TEACHER'S WORD TO A PEEK, played on a phone (390 x 844
   CSS points drawn at two pixels a point, a touch context). The eye opened and shut by TAPS on it and every source pressed
   by a TAP (the drive probe's way: the lens turned onto the thing, the player stood within its reach, a tap on the badge,
   the thing or its mark; the engine's E only as a reported FALLBACK). Three sittings, each its own seeded save:
     1 · the history from its start ('history:'): Ravi pressed; while his first line plays the eye is opened, and
         "Not yet. First, we listen." (ph4h2) must come AFTER that line and BEFORE his second (the next pause, never behind
         the rest of what is queued); shut, Ravi's telling done, opened again: nothing said a second time
     2 · a reload of that save (its `p` mark kept): Continue tapped, the eye opened: nothing said
     3 · all five sources and Amma heard ('history:r,m,f,o,a,k'): his teacher pressed (he tells what he heard); while his
         own line plays the eye is opened: nothing said (his teacher's answer, ph4h1, says it then), and the card's note
         for listening first is not given (the price, unchanged)
   Pictures: the eye opened mid-line, and the moment his teacher says it. Every page error is printed; the run exits non-zero
   on one or on a failed check.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [DSF=2] node tools/probes/e4c4peek.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4peek';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844, DSF = +(process.env.DSF || 2);
const SPAWN = { x: 0.15, y: 1.62, z: 1.0 };
const b = await chromium.launch(LAUNCH);
const errs = [], checks = {};
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);

async function sitting(tag, phase, body) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
  const save = { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase,
                 conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: SPAWN, done: false, t: 1 };
  await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(tag + ' PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
  p.on('console', m => { if (m.type() === 'error' || /failed|threw|has no take|no pose/i.test(m.text())) errs.push(tag + ' CONSOLE ' + m.text().slice(0, 240)); });
  const H_ = mkHelpers(p);
  await H_.boot();
  await body(p, H_);
  await ctx.close();
}

function mkHelpers(p) {
  const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  const tap = (x, y) => p.touchscreen.tap(Math.round(x), Math.round(y));
  const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 200 }).then(() => true, () => false);
  const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null;
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    let vis = r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none';
    for (let a = e; a && vis; a = a.parentElement) if (a.classList && a.classList.contains('hide')) vis = false;
    return vis ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, sel);
  let shotN = 0;
  const shot = async (tag) => { await frames(3); try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.png`, timeout: 240000 }); } catch { log('  (a slow frame: no picture)'); } };
  const info = () => p.evaluate(() => { const E = window.__enc, i = E.stage.info(), P = E.stage.dbg.play;
    return { st: E.getState(), phase: i.phase, t: i.t, queued: i.queued, until: i.until, pending: !!i.pending, heard: i.heard,
             busy: !!P.busy, peeked: !!P.peeked, learned: P.learned ? [...P.learned] : [], vis: E.vision().on,
             notes: E.kit && E.kit.getConduct ? E.kit.getConduct().notes : null }; });
  const spot = (id) => p.evaluate((id) => { const h = window.__enc.stage.hotspots.find(h => h.id === id);
    return h && (!h.enabled || h.enabled()) ? { id: h.id, x: h.pos.x, y: h.pos.y, z: h.pos.z, r: h.radius || 1.6, hits: !!h.hits, mark: h.mark !== false } : null; }, id);
  async function aimAt(s) {
    await p.evaluate((s) => { const E = window.__enc, Y = E.yaw, P = E.pitch;
      let dx = s.x - Y.position.x, dz = s.z - Y.position.z, d = Math.hypot(dx, dz);
      if (d > s.r * 0.7) { const k = (d - s.r * 0.55) / d; Y.position.x += dx * k; Y.position.z += dz * k; dx = s.x - Y.position.x; dz = s.z - Y.position.z; d = Math.hypot(dx, dz); }
      Y.rotation.y = Math.atan2(-dx, -dz); P.rotation.x = Math.max(-1.2, Math.min(1.2, Math.atan2(s.y - Y.position.y, Math.max(0.05, d)))); }, s);
    await frames(3);
  }
  const taken = (id) => p.evaluate((id) => { const E = window.__enc, h = E.stage.hotspots.find(h => h.id === id), i = E.stage.info();
    return E.getState() !== 'play' || !h || (h.enabled && !h.enabled()) || !!i.pending || i.queued > 0; }, id);
  async function press(id) {
    const s = await spot(id); if (!s) return 'NOT OFFERED';
    await aimAt(s);
    const bg = await box('#interact .ibadge');
    if (bg) { await tap(bg.x, bg.y); await frames(2); if (await taken(id)) return 'badge'; }
    const at = await p.evaluate((id) => window.__enc.hotMarkAt(id), id);
    if (s.hits) { const q = await p.evaluate((s) => { const c = window.__enc.camera; c.updateMatrixWorld(); const v = c.position.clone().set(s.x, s.y, s.z).project(c);
        return v.z < 1 ? { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight } : null; }, s);
      if (q && q.x > 4 && q.y > 4 && q.x < W - 4 && q.y < H - 4) { await tap(q.x, q.y); await frames(2); if (await taken(id)) return 'thing'; } }
    if (s.mark && at && at.z < 1 && at.x > 4 && at.y > 4 && at.x < W - 4 && at.y < H - 4) { await tap(at.x, at.y); await frames(2); if (await taken(id)) return 'mark'; }
    return (await p.evaluate(() => window.__enc.interactNow())) ? 'FALLBACK(E)' : 'REFUSED';
  }
  async function eye(want) {
    for (let k = 0; k < 3; k++) { const v = await p.evaluate(() => window.__enc.vision().on); if (v === want) return true;
      const bb = await box('#visionBtn'); if (!bb) return false; await tap(bb.x, bb.y);
      if (await until((w) => window.__enc.vision().on === w, 8000, want)) return true; }
    return false;
  }
  /* the chapter clock waited on (on this box it runs slower than the wall's) */
  const tAt = async () => (await info()).t;
  async function waitT(secs) { const t0 = await tAt(); await until((t) => window.__enc.stage.info().t >= t, 600000, t0 + secs); }
  async function boot() {
    await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await frames(2);
    const sb = await box('#startBtn'); await tap(sb.x, sb.y);
    await until(() => window.__enc.getState() === 'play' && window.__enc.stage.info().phase === 'history', 900000);
  }
  return { frames, tap, until, box, shot, info, spot, press, eye, waitT, boot };
}

/* 1 · from the history's start */
await sitting('1', 'history:', async (p, h) => {
  log('1: in the history');
  await h.until(() => { const i = window.__enc.stage.info(), P = window.__enc.stage.dbg.play;
    return i.heard.includes('ph4h0') && !i.queued && !i.pending && !P.busy; }, 300000);
  log('1: his teacher has said ph4h0; Ravi pressed by', await h.press('ravi'));
  await h.until(() => { const i = window.__enc.stage.info(); return i.heard.includes('rv4h1') && i.queued > 0; }, 120000);
  await h.waitT(1.5);
  let r = await h.info(); log('1: mid rv4h1', JSON.stringify(r));
  checks.midLineQueued = r.heard.includes('rv4h1') && !r.heard.includes('rv4h2');
  checks.eyeOpened = await h.eye(true);
  await h.frames(4);
  r = await h.info(); log('1: eye opened', JSON.stringify(r));
  checks.peekMarked = r.peeked;
  checks.notCutIn = !r.heard.includes('ph4h2');
  await h.shot('peek-mid-ravi');
  checks.saidOnce = await h.until(() => window.__enc.stage.info().heard.includes('ph4h2'), 240000);
  await h.waitT(0.6);
  await h.shot('pho-not-yet');
  r = await h.info(); log('1: ph4h2 said', JSON.stringify(r));
  await h.eye(false);
  await h.until(() => { const i = window.__enc.stage.info(), P = window.__enc.stage.dbg.play; return P.learned.has('r') && !i.queued && !i.pending && !P.busy; }, 300000);
  r = await h.info(); const H_ = r.heard;
  checks.order = H_.indexOf('rv4h1') < H_.indexOf('ph4h2') && H_.indexOf('ph4h2') < H_.indexOf('rv4h2');
  log('1: heard in order', H_.join(' '));
  /* again: nothing */
  const before = await h.info();
  await h.eye(true); await h.waitT(4);
  r = await h.info(); log('1: second open', JSON.stringify(r));
  checks.noSecond = r.queued === 0 && !r.pending && r.until <= before.t + 4.5 && r.until < r.t + 0.01;
  await h.eye(false);
  /* 2 · a reload of the same save: the `p` mark kept */
  const mark = await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('mz.encounters.checkpoint')).phase; } catch { return null; } });
  log('2: the save now', mark);
  checks.saveHasMark = /^history:.*\bp\b/.test(mark || '');
  await p.reload({ waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await h.frames(2);
  { const sb = await h.box('#startBtn'); await h.tap(sb.x, sb.y); }
  await h.until(() => window.__enc.getState() === 'play' && window.__enc.stage.info().phase === 'history', 900000);
  await h.until(() => { const i = window.__enc.stage.info(); return !i.queued && !i.pending; }, 120000);
  await h.eye(true); await h.waitT(4);
  r = await h.info(); log('2: opened after Continue', JSON.stringify(r));
  checks.notAfterContinue = r.peeked && !r.heard.includes('ph4h2');
});

/* 3 · all heard, telling his teacher */
await sitting('3', 'history:r,m,f,o,a,k', async (p, h) => {
  log('3: in the history, everything heard');
  await h.until(() => { const i = window.__enc.stage.info(), P = window.__enc.stage.dbg.play; return !i.queued && !i.pending && !P.busy; }, 120000);
  log('3: his teacher pressed by', await h.press('tell'));
  await h.until(() => window.__enc.stage.info().heard.includes('q4h3'), 120000);
  await h.waitT(1.5);
  checks.tellEye = await h.eye(true);
  await h.until(() => window.__enc.stage.info().phase === 'sight', 300000);
  await h.waitT(3);
  const r = await h.info(); log('3: after the telling', JSON.stringify(r));
  checks.notInTelling = r.peeked && !r.heard.includes('ph4h2') && r.heard.includes('ph4h1');
  checks.noteWithheld = r.notes ? !r.notes.includes('You learned her history before you used your Spirit Vision.') : null;
});

log('checks', JSON.stringify(checks));
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length || Object.values(checks).some(v => v === false) ? 1 : 0);
