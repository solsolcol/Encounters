/* v28.0 (E4C5, R76: Chad, 23 Nov 2026: "Pathfinding at the start of the chapter at the corridor is still too tight and
   characters are clipping into the edge of the wall"). THE WALKWAY WALKED, its three followers measured. On a phone page
   (390 x 844 at 1, a touch context) the chapter is booted to play's first phase (the walk), the limbs' own check laid in
   (tools/probes/limbclip.js), and he WALKS the walkway by the real key (W held), his look turned along its line as a
   player turns it: down the first run from the lift, round the turn and along the second run to his gate, then back a
   few metres and on again (the followers stepping aside and following). Every 0.15 s of wall time: his place, each
   follower's place, how far each stands from the walkway's inner walls (x -0.95 on the first run, z -16.6 on the second,
   the turn's inside corner), and the limbs' findings. OUT/follow.json holds every row; printed: each follower's nearest
   approach to the inner wall and to the corner, and every span of a limb in a solid or two bodies in each other.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [CHFILE=chapter.js] node tools/probes/e4c5follow.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5follow'; fs.mkdirSync(OUT, { recursive: true });
const LIMBSRC = fs.readFileSync(new URL('./limbclip.js', import.meta.url), 'utf8');
const CHSRC = process.env.CHFILE ? fs.readFileSync(process.env.CHFILE, 'utf8') : null;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 200)); });
if (CHSRC) await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC }));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().phase === 'walk' && window.__enc.getState() === 'play'; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.waitForTimeout(3000);
await p.evaluate(LIMBSRC);
/* the walkway's inner walls and the corner (b_world.js WALK: x0 -0.95, turnZ -16.6) */
await p.evaluate(() => {
  const E = window.__enc, S = E.stage, F = S.films, P = F.people ? F.people() : [];
  const who = P.map((Q, i) => ({ Q, i })).filter(o => o.Q && /^(p5pho|e4ton|p5jun)$/.test(o.Q.key));
  const V3 = E.camera.position.constructor, v = new V3();
  window.__rows = [];
  window.__fRow = () => {
    const y = E.yaw.position, row = { t: +(performance.now() / 1000).toFixed(2), me: [+y.x.toFixed(3), +y.z.toFixed(3)], f: [] };
    for (const { Q, i } of who) { if (!Q.hips || !Q.group.visible) continue; Q.group.updateWorldMatrix(true, true); Q.hips.getWorldPosition(v);
      const x = v.x, z = v.z, dIn1 = z > -16.6 ? x - (-0.95) : 9, dIn2 = x < -0.95 ? -16.6 - z : 9, dC = Math.hypot(x + 0.95, z + 16.6);
      row.f.push([Q.key + '#' + i, +x.toFixed(3), +z.toFixed(3), +Math.min(dIn1, dIn2).toFixed(3), +dC.toFixed(3)]); }
    row.K = window.__limbs();
    window.__rows.push(row);
  };
});
/* he walks: the look set along the walkway as a player turns it, W held; every 0.15 s a row */
const walkTo = async (tx, tz, maxS = 90) => {
  const t0 = Date.now(); await p.keyboard.down('KeyW');
  try {
    for (;;) {
      const st = await p.evaluate(([tx, tz]) => { const E = window.__enc, y = E.yaw.position, dx = tx - y.x, dz = tz - y.z, d = Math.hypot(dx, dz);
        E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = -0.05; window.__fRow(); return d; }, [tx, tz]);
      if (st < 0.35 || (Date.now() - t0) / 1000 > maxS) return st;
      await p.waitForTimeout(150);
    }
  } finally { await p.keyboard.up('KeyW'); }
};
const hold = async (secs) => { const t0 = Date.now(); while ((Date.now() - t0) / 1000 < secs) { await p.evaluate(() => window.__fRow()); await p.waitForTimeout(150); } };
say('walk: down the first run');
await walkTo(0.15, -6.0); await hold(3);
await walkTo(0.1, -15.5); await hold(2);
say('round the turn');
await walkTo(-0.5, -17.4); await walkTo(-2.5, -17.6); await hold(3);
say('along the second run to the gate');
await walkTo(-6.8, -17.7); await hold(4);
say('back a few metres, then on');
await walkTo(-3.2, -17.7); await hold(3);
await walkTo(-6.8, -17.7); await hold(4);
const rows = await p.evaluate(() => window.__rows);
fs.writeFileSync(OUT + '/follow.json', JSON.stringify({ rows, errs }));
/* the nearest approach of each follower to the inner wall and the corner, and the spans of the limbs' findings */
const near = {};
for (const r of rows) for (const [w, x, z, dIn, dC] of r.f) { const n = near[w] || (near[w] = { dIn: 9, dC: 9, at: null });
  if (dIn < n.dIn) { n.dIn = dIn; n.at = [x, z]; } if (dC < n.dC) n.dC = dC; }
say('nearest to the inner wall (hips), and to the corner', JSON.stringify(near));
const spans = {};
for (const r of rows) for (const k of r.K) { const key = k.slice(0, 5).join(' '); const s = spans[key] || (spans[key] = { n: 0, d: 0 }); s.n++; s.d = Math.max(s.d, k[5]); }
const list = Object.entries(spans).sort((a, b) => b[1].d - a[1].d);
say(list.length + ' kinds of finding over ' + rows.length + ' rows');
for (const [k, s] of list.slice(0, 30)) say((s.d > 0.05 && s.n > 1 ? 'FAIL ' : '     ') + (s.d * 100).toFixed(1) + ' cm, ' + s.n + ' rows: ' + k);
say('errors', JSON.stringify(errs.slice(0, 5)));
await b.close();
process.exit(list.some(([, s]) => s.d > 0.05 && s.n > 1) || errs.length ? 1 : 0);
