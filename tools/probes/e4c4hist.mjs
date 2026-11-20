/* v27.0 (Chad, 20 Nov 2026, R137: "if i start from the objectives in the kitchen first, and then go back to ravi, then the
   yellow female model as the last objective, it gets stuck on 4/5 and not able to trigger amma"): THE HISTORY IN ANY ORDER,
   driven on a phone (390 x 844 CSS points, a touch context) by real taps: a save seeded at the history's start, Continue
   tapped, then each source in ORDER (r Ravi, m Mala, f the letters, o the old photograph, a Appa's photograph): he is set a
   metre and a half from it, turned to it, and the badge at the foot of the screen is tapped once it names it (a phone's
   way in; MODE=thing taps the thing itself instead, where it is drawn). After each: the count, the order on screen, the
   waypoint. After the last: what the screen offers (which marks are drawn, where the waypoint points), photographed, then
   Amma, if the order reached five. Every page error printed; exits non-zero on one or on a failed check.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [ORDER=f,o,r,m] [THEN=a] [MODE=badge|thing] [OUT=dir] node tools/probes/e4c4hist.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const ORDER = (process.env.ORDER || 'f,o,r,m').split(',').filter(Boolean);
const THEN = (process.env.THEN || 'a').split(',').filter(Boolean);
const MODE = process.env.MODE || 'badge';
const OUT = process.env.OUT || '/tmp/e4c4hist';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844, DSF = +(process.env.DSF || 2);
const ID = { r: 'ravi', m: 'mala', f: 'folder', o: 'old', a: 'appa' };
const SPAWN = { x: 0.15, y: 1.62, z: 1.0 };
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const save = { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: 'history:',
               conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: SPAWN, done: false, t: 1 };
await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 250 }).then(() => true, () => false);
let shotN = 0;
const shot = async (tag) => { await frames(3); try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.png`, timeout: 240000 }); } catch { log('  (a slow frame: no picture)'); } };
const tapSel = async (sel) => { const bb = await p.locator(sel).boundingBox(); if (!bb) return false; await p.touchscreen.tap(Math.round(bb.x + bb.width / 2), Math.round(bb.y + bb.height / 2)); return true; };
const checks = {};
/* the page's own account: the five, the flags, the order on screen, the waypoint, the badge, the marks drawn */
const read = () => p.evaluate(() => {
  const E = window.__enc, St = E.stage, D = St.dbg, d = E.kitDebug();
  const marks = [...document.querySelectorAll('#hotmarks > *')].filter(el => el.style.display !== 'none').length;
  const on = St.hotspots.filter(h => h && h.pos && !h.done && (typeof h.enabled !== 'function' || h.enabled())).map(h => h.id);
  return { st: E.getState(), phase: St.phase, learned: [...D.play.learned], busy: D.play.busy, spoke: D.play.spoke,
           obj: (document.getElementById('objTxt') || {}).textContent || '', badge: d.hotspot, open: on, marks,
           wp: d.waypoint ? { x: +(+d.waypoint.x).toFixed(2), z: +(+d.waypoint.z).toFixed(2) } : null };
});
/* where a spot is, and a place to stand a metre and a half from it on the room's side, turned to it */
const goTo = (id) => p.evaluate((id) => {
  const E = window.__enc, h = E.stage.hotspots.find(x => x.id === id);
  const ax = h.pos.x, az = h.pos.z, ay = (h.pos.y ?? 1.0);
  const cx = 1.0, cz = 3.0;                                   // (toward the living room's middle)
  let dx = cx - ax, dz = cz - az; const n = Math.hypot(dx, dz) || 1; dx /= n; dz /= n;
  const R = Math.min(1.5, (h.radius || 2.2) * 0.7);
  const x = ax + dx * R, z = az + dz * R;
  E.yaw.position.set(x, E.yaw.position.y, z);
  E.yaw.rotation.y = Math.atan2(-(ax - x), -(az - z));
  E.pitch.rotation.x = Math.max(-1.0, Math.min(1.0, Math.atan2(ay - E.yaw.position.y, R)));
  return { at: [+x.toFixed(2), +z.toFixed(2)], to: [+ax.toFixed(2), +ay.toFixed(2), +az.toFixed(2)] };
}, id);
/* the thing itself on the screen (the anchor its tap is tested against) */
const thingAt = (id) => p.evaluate((id) => {
  const E = window.__enc, h = E.stage.hotspots.find(x => x.id === id), cam = E.camera;
  cam.updateWorldMatrix(true, false); cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
  const v = new cam.position.constructor(h.pos.x, (h.pos.y ?? 1.0) + (id === 'ravi' || id === 'mala' ? 0.35 : 0), h.pos.z).project(cam);
  return { x: Math.round((v.x + 1) / 2 * innerWidth), y: Math.round((1 - v.y) / 2 * innerHeight), front: v.z < 1 };
}, id);
const keepGoing = () => p.evaluate(() => { const E = window.__enc; if (E.stats.sanity < 40) E.stats.sanity = 60; });

await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await frames(2);
await tapSel('#startBtn');
log('Continue tapped');
checks.inHistory = await until(() => { const E = window.__enc; return E.getState() === 'play' && E.stage.phase === 'history'; }, 1800000);
await until(() => !window.__enc.stage.dbg.play.busy, 120000);
let r = await read(); log('in the history', JSON.stringify(r));
await shot('start');

async function source(c) {
  const id = ID[c];
  await until(() => !window.__enc.stage.dbg.play.busy, 180000);
  const g = await goTo(id); await frames(3);
  const offered = await until((id) => window.__enc.kitDebug().hotspot === id, 60000, id);
  r = await read();
  log(`  ${c} (${id}): stood at`, JSON.stringify(g.at), 'facing', JSON.stringify(g.to), '; offered on the badge:', offered, '; badge', r.badge);
  if (MODE === 'thing') { const t = await thingAt(id); log('    tapping the thing at', JSON.stringify(t)); await p.touchscreen.tap(t.x, t.y); }
  else await tapSel('#interact .ibadge');
  /* the old photograph opens its window, and the story waits on it as it should: he looks, then closes it (a tap on
     Close once the guard is past), as a player does */
  if (await until(() => window.__enc.getState() === 'picture', 8000)) {
    await p.waitForTimeout(2500); await shot('window-' + c);
    await tapSel('#picClose');
    await until(() => window.__enc.getState() === 'play', 60000);
  }
  const took = await until((c) => { const D = window.__enc.stage.dbg; return D.play.learned.has(c); }, 240000, c);
  await until(() => !window.__enc.stage.dbg.play.busy, 240000);
  await until(() => window.__enc.getState() === 'play', 240000);
  await keepGoing();
  r = await read();
  log(`  after ${c}:`, JSON.stringify(r));
  return { offered, took };
}

for (const c of ORDER) {
  const s = await source(c);
  checks['offered_' + c] = s.offered; checks['took_' + c] = s.took;
}
r = await read();
log('after the order', ORDER.join(','), JSON.stringify(r));
checks.countRight = r.learned.length === new Set(ORDER).size;
/* what the screen offers now: turned round where he stands, a picture each quarter */
for (let q = 0; q < 4; q++) {
  await p.evaluate((q) => { const E = window.__enc; E.yaw.rotation.y = q * Math.PI / 2; E.pitch.rotation.x = 0; }, q);
  await frames(3); const rr = await read();
  log(`  turned ${q * 90} degrees: marks drawn`, rr.marks, '; open', JSON.stringify(rr.open), '; waypoint', JSON.stringify(rr.wp));
  await shot('around-' + q * 90);
}
for (const c of THEN) {
  if (r.learned.includes(c)) continue;
  const s = await source(c);
  checks['then_offered_' + c] = s.offered; checks['then_took_' + c] = s.took;
}
r = await read();
if (r.learned.length === 5) {
  checks.ammaOrder = await until(() => /Go to her/.test((document.getElementById('objTxt') || {}).textContent || ''), 60000);
  checks.ammaOpen = await until(() => window.__enc.stage.hotspots.find(x => x.id === 'amma').enabled(), 30000);
  r = await read(); log('five learned:', JSON.stringify(r));
  await shot('five');
}
checks.noPageErrors = errs.filter(e => e.startsWith('PAGEERROR')).length === 0;
log('CHECKS', JSON.stringify(checks));
if (errs.length) log('ERRORS\n' + errs.join('\n'));
await b.close();
process.exit(Object.values(checks).every(v => v === true) ? 0 : 1);
