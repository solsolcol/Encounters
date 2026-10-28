/* v24.3 (written again in a fresh container — the v24.2 real-input probe died with the old one): episode 3 chapter 5
   PLAYED THROUGH on a phone-sized TOUCH context (so the sound is on, as on Chad's phone), every order pressed through
   the engine's own interactNow() with the lens aimed at the thing and the player within its reach (a tap on its mark
   if that is refused), every minigame played by KEYS (E held twists, pours, slides and holds; a press taps and flicks;
   E held fills a yield; W struck climbs COME BACK — the engine's own desktop path, the same chapter callbacks a finger
   reaches), the decision by a click on OPT's button. It runs every callback v24.3 added (the cups, the key's ratchet,
   the flame, the glints, the gifts, the returns, the places' noises, the box's run-down) and reports: the voice log
   (none over another), the cue log, the beds at each phase, the phases in order, and every page error.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... OPT=A|B|C|D OUT=dir node tools/probes/e3c5drive.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT = process.env.OPT || 'A', OPT_I = 'ABCD'.indexOf(OPT);
const OUT = process.env.OUT || '/tmp/e3c5drive';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
const wait = (ms) => p.waitForTimeout(ms);
let shotN = 0;
const shot = async (tag) => { try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.jpg`, quality: 65, timeout: 240000 }); } catch { /* a slow frame */ } };

await p.goto(PAGE + '?ch=e3c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
log('version', await p.evaluate(() => (document.body.innerText.match(/v2\d\.\d+/) || ['?'])[0]));
await p.evaluate(() => document.getElementById('startBtn').click());
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
          .map(h => ({ id: h.id, x: h.pos.x, y: h.pos.y, z: h.pos.z, r: h.radius || 1.6 }));
});
/* stand within reach and aim the lens at it, then press it the way E does; a tap on its mark if that is refused */
async function press(s) {
  await p.evaluate((s) => {
    const E = window.__enc, Y = E.yaw, P = E.pitch;
    let dx = s.x - Y.position.x, dz = s.z - Y.position.z, d = Math.hypot(dx, dz);
    if (d > s.r * 0.7) { const k = (d - s.r * 0.55) / d; Y.position.x += dx * k; Y.position.z += dz * k;
                         dx = s.x - Y.position.x; dz = s.z - Y.position.z; d = Math.hypot(dx, dz); }
    Y.rotation.y = Math.atan2(-dx, -dz);
    P.rotation.x = Math.atan2(s.y - Y.position.y, Math.max(0.05, d));
  }, s);
  await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
  let ok = await p.evaluate(() => window.__enc.interactNow());
  if (!ok) {
    const m = await p.evaluate((id) => window.__enc.hotMarkAt(id), s.id);
    if (m && m.x > 0 && m.y > 0 && m.x < 390 && m.y < 844) { await p.touchscreen.tap(m.x, m.y); ok = 'tap'; }
  }
  return ok;
}
async function playEvent(kind) {
  log('  event', kind);
  await wait(900);
  await p.keyboard.press('Enter');                       // START on a briefing (a non-brief event takes it as a short press)
  await wait(700);
  const t0 = Date.now(), alive = async () => (await info()).evOn;
  if (kind === 'yield') {
    await p.keyboard.down('KeyE');
    while (Date.now() - t0 < 90000 && await alive()) await wait(500);
    await p.keyboard.up('KeyE');
  } else if (kind === 'surface') {
    while (Date.now() - t0 < 120000 && await alive()) { await p.keyboard.press('KeyW'); await wait(140); }
  } else {
    while (Date.now() - t0 < 150000 && await alive()) {
      await p.keyboard.down('KeyE'); await wait(1500); await p.keyboard.up('KeyE'); await wait(350);
    }
  }
  log('  event over', kind, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}

const phases = [], bedsAt = {};
let last = '', idle = 0, decided = false, cardAt = 0;
const TMAX = 85 * 60 * 1000;
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
    const n = await p.evaluate((i) => { const B = document.querySelectorAll('#choices button.choice'); if (B[i]) B[i].click(); return B.length; }, OPT_I);
    log('decision: clicked', OPT, 'of', n); decided = true; continue;
  }
  if ((I.st === 'result' || I.st === 'complete') && !cardAt) { cardAt = Date.now(); log('the card'); await shot('card'); }
  if (cardAt && Date.now() - cardAt > 15000) break;
  if (I.st === 'unlock') { await wait(900); await p.keyboard.press('Enter'); await wait(600); continue; }
  if (I.st === 'play') {
    const S = await spots();
    if (S.length) {
      const s = S[0], ok = await press(s);
      log('  pressed', s.id, ok === true ? '' : ok === 'tap' ? '(by its mark)' : '(REFUSED)');
      await wait(ok ? 2500 : 1500);
      if (!ok) idle += 1.5;
      continue;
    }
  }
  await wait(1000); idle += 1;
  if (idle > 240) { log('STUCK', JSON.stringify(I)); await shot('stuck'); break; }
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
log('BEDS', JSON.stringify(bedsAt));
log('result', errs.length ? 'ERRORS' : (cardAt ? 'PASS' : 'DID NOT REACH THE CARD'));
console.log('errs', JSON.stringify(errs));
await b.close();
console.log('exit');
