/* v28.0 (E4C5, R34): MASTER ZAVIER'S RUN AND HIS THREE CASTS, THE SHOCKWAVE AND THE BIND, photographed full size through the
   fight's own lens on a phone (390 x 844 at 2 px/pt, a touch context), and the shockwave's shake measured. Chad, R34: "make
   him use a running animation ... Pho's shockwave ability's visuals and impact need to be improved much more ... Add a screen
   shake effect to the shockwave ... When master zavier uses any of his ability, you need to add animations to show him
   casting ... the lending, the smell, and the bind. The bind visuals also is too simple". The fight set out through its lab
   (c_fightstage.js FS_LAB), then:
     RUN    Master Zavier played (the boom behind and above him), held in his run at four moments of its cycle (lab.zpose);
     CASTS  each of his acts begun as the game begins it (lab.moment labBind / labSmell / labLend: the event's own act, its
            sound and its effect), and held rising and at the take's top with its turn kept (lab.zpose keep);
     GOLD   Grandmaster Pho played, held in his gold's take; the gold gathering (labGather) and the wheel going out (labWheel
            at 0.1, 0.35 and 0.7 s);
     BIND   the bind's bolt, its snap and its cage (labBind at 0.12, 0.35, 0.8 and 1.6 s), Master Zavier held in his push;
     SIDE   the tag mode left, and his run and his three casts photographed from 3 m at his side and at his front;
     SHAKE  the wheel let go and the lens's place in the world read every drawn frame for 1.6 s: how far it moves from where
            it stood, and for how long.
   OUT/r34.json holds every picture's place and the shake's curve; the pictures are OUT/<n>-<what>.png.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [ONLY=run,casts,gold,bind,shake,side] node tools/probes/e4c5r34.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5r34'; fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.env.ONLY || 'run,casts,gold,bind,shake,side').split(',');
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], logs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { const t = m.text(); if (m.type() === 'error' || /has no take|threw/i.test(t)) logs.push(m.type() + ' ' + t.slice(0, 300)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.open());
await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
await frames(3);
const res = { pics: [], takes: null, shake: null, errs, logs };
let n = 0;
const shot = async (name, extra = {}) => { await frames(4); const f = `${OUT}/${String(++n).padStart(2, '0')}-${name}.png`;
  await p.screenshot({ path: f, timeout: 300000 });
  const st = await p.evaluate(() => { const t = window.__enc.kit.tagState(); return { played: t.played, bodies: t.bodies }; });
  res.pics.push({ name, f, st, ...extra }); say('pic', f); };
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
const play = async (who) => { await p.evaluate((who) => window.__enc.kit.tagSwitch(who, { force: true }), who);
  await p.waitForFunction((who) => { const t = window.__enc.kit.tagState(); return t.played === who && !t.gliding; }, who, { timeout: 120000, polling: 200 });
  await frames(6); };
/* (the takes his file carries, and each one's length: a take name a rig lacks fails silently, v11.2) */
res.takes = await p.evaluate(() => { const C = window.__enc.stage.plan.FLOOR.cast, out = {};
  for (const k of ['zav', 'pho']) { const P = C[k]; out[k] = P && P.acts ? Object.fromEntries(Object.entries(P.acts).map(([n, a]) => [n, +a.getClip().duration.toFixed(3)])) : null; }
  return out; });
say('takes', JSON.stringify(res.takes));
const ZT = res.takes.zav || {};
const CASTS = [['labBind', 'mage_soell_cast_3', 0.75, 1.05], ['labSmell', 'Alert', 2.3, 2.7], ['labLend', 'mage_soell_cast_6', 0.75, 1.15]];
await p.evaluate(() => window.__enc.kit.tagState());
await shot('court');
if (ONLY.includes('run') && ZT.Running) {
  await play('zavier');
  for (const u of [0, 0.25, 0.5, 0.75]) { say('zpose', await lab('zpose', 'Running', u * ZT.Running)); await shot(`run-${u}`, { take: 'Running', t: u * ZT.Running }); }
  await lab('zpose', null);
}
if (ONLY.includes('casts')) {
  await play('zavier');
  for (const [m, take, mid, top] of CASTS) {
    if (!ZT[take]) { say('no take', take); continue; }
    for (const [tt, label, secs] of [[mid, 'rising', 0.15], [top, 'top', 0.35]]) {
      const ok = await lab('moment', m, secs); if (ok !== true) { say('no moment', m, ok); continue; }
      await lab('zpose', take, tt, true); await shot(`cast-${m}-${label}`, { take, t: tt });
    }
    await lab('zpose', null); await lab('clear');
  }
}
if (ONLY.includes('gold')) {
  await play('pho');
  for (const [m, s, pt] of [['labGather', 0.7, 1.0], ['labWheel', 0.1, 2.0], ['labWheel', 0.35, 2.0], ['labWheel', 0.7, 2.0]]) {
    await lab('pose', 'Charged_Spell_Cast', pt); const ok = await lab('moment', m, s); if (ok !== true) { say('no moment', m, ok); continue; }
    await shot(`gold-${m}-${s}`); }
  await lab('pose', null); await lab('clear');
}
if (ONLY.includes('bind') && ZT.mage_soell_cast_3) {
  await play('zavier');
  for (const s of [0.12, 0.35, 0.8, 1.6]) { const ok = await lab('moment', 'labBind', s); if (ok !== true) { say('no moment labBind', ok); continue; }
    await lab('zpose', 'mage_soell_cast_3', Math.min(1.05, 0.45 + s * 1.2), true); await shot(`bind-${s}`); }
  await lab('zpose', null); await lab('clear');
}
if (ONLY.includes('shake')) {
  await play('pho'); await lab('clear'); await frames(6);
  /* the wheel let go as the game lets it go (the event's own cast: the shake begins with it), then the lens's world place
     read every drawn frame: its distance from where it stood the frame before the wave, and the roll */
  res.shake = await p.evaluate(() => new Promise((resolve) => {
    const E = window.__enc, L = E.stage.snap().story.fight.lab; let cam = null;
    E.pitch.traverse(o => { if (!cam && o.isCamera) cam = o; });
    if (!cam) return resolve({ err: 'no camera under the pitch' });
    const V = cam.position.constructor, base = new V(); cam.updateWorldMatrix(true, false); cam.getWorldPosition(base);
    const rows = []; const t0 = performance.now();
    L.moment('labWheel', 0);                                   // (the wave's own cast fired; the shake runs on the fight's wall clock, never held)
    const v = new V();
    const f = () => { cam.updateWorldMatrix(true, false); cam.getWorldPosition(v);
      rows.push([+((performance.now() - t0) / 1000).toFixed(3), +(v.distanceTo(base) * 100).toFixed(2), +(cam.rotation.z * 180 / Math.PI).toFixed(2)]);
      if (performance.now() - t0 < 1600) requestAnimationFrame(f);
      else { const moved = rows.filter(r => r[1] > 0.15); resolve({ rows, maxCm: Math.max(...rows.map(r => r[1])), maxRollDeg: Math.max(...rows.map(r => Math.abs(r[2]))), lastMovedAt: moved.length ? moved[moved.length - 1][0] : null, frames: rows.length }); } };
    requestAnimationFrame(f); }));
  say('shake', JSON.stringify({ maxCm: res.shake.maxCm, maxRollDeg: res.shake.maxRollDeg, lastMovedAt: res.shake.lastMovedAt, frames: res.shake.frames }));
}
if (ONLY.includes('side')) {
  /* (the mode left, so the lens is the probe's: from 3 m at his side and at his front, his run and his three casts held) */
  await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null); });
  await frames(6);
  const aim = async (view) => { const at = await p.evaluate((view) => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.zav, V = P.group.position.constructor;
      P.group.updateWorldMatrix(true, true); const g = P.group.position, ry = P.group.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), lx = Math.cos(ry), lz = -Math.sin(ry);
      const c = view === 'front' ? new V(g.x + fx * 3.0, 1.35, g.z + fz * 3.0) : new V(g.x - lx * 3.0, 1.3, g.z - lz * 3.0), tg = new V(g.x, 1.0, g.z);
      E.yaw.position.copy(c); const d = tg.clone().sub(c); E.yaw.rotation.y = Math.atan2(-d.x, -d.z); E.pitch.rotation.x = Math.atan2(d.y, Math.hypot(d.x, d.z));
      return { cam: c.toArray().map(x => +x.toFixed(2)), at: [g.x, g.z].map(x => +x.toFixed(2)) }; }, view); await frames(4); return at; };
  const sets = [['Running', [0, 0.25, 0.5, 0.75].map(u => u * (ZT.Running || 0)), 'side']].concat(CASTS.map(([m, take, mid, top]) => [take, [mid, top], 'front']));
  for (const [take, ts, view] of sets) { if (!ZT[take]) continue;
    for (const t of ts) { await lab('zpose', take, t); const at = await aim(view); await shot(`side-${take}-${t.toFixed(2)}-${view}`, { take, t, view, at }); } }
  await lab('zpose', null);
}
fs.writeFileSync(OUT + '/r34.json', JSON.stringify(res, null, 1));
for (const e of errs.slice(0, 10)) say(e);
say('errors', errs.length, 'logs', logs.length, JSON.stringify(logs.slice(0, 6)));
await b.close();
