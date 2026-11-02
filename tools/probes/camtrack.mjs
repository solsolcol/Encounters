// v24.32 · A FILM'S CAMERA, MEASURED FRAME BY FRAME (Chad, 2 Nov 2026, of ending A: "when the camera tracks pong
// walking out, it is extremely jerky and awkward"). An ending is played on a phone (the option tapped), then its clock is
// stepped from T0 to T1 at FPS frames a second on a held wall clock — each step the chapter's frame (stage.updateNotes:
// the people's gaits and looks on wall time) and then the film's own seek (cineSeek: every passed track at that time) —
// and the lens read: where it is, which way it looks, its width. Printed: the lens's speed (m/s), how fast its view turns
// (deg/s), how fast that turn CHANGES (deg/s^2 — a jerk is a spike there), and the worst of each; the steps' JSON beside.
// STRIP=n also photographs n frames across the span, side by side (seeked afterwards: what runs on the wall clock — a
// gesture, a walk's gait — is wherever the seeks leave it). SHOTS=t1,t2,… photographs frames INSIDE the stepped run, at
// those times of the film's clock, so a person's one-off gesture (played on the wall clock, here held in step with the
// film's) is pictured where a real play shows it — shots.jpg.
//   ENC_DIST=<snap> CHROMIUM_PATH=... CH=e4c1 OPT=A [PHASE='decide:~fri'] T0=51 T1=57 [FPS=30] [STRIP=6] [SHOTS=52,54] [VIEW=desktop] node tools/probes/camtrack.mjs <outdir>
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
const req = createRequire(new URL('../../package.json', import.meta.url).pathname);
const PW = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = PW.chromium || (PW.default && PW.default.chromium);
const sharp = (await import(pathToFileURL(req.resolve('sharp')).href)).default;
const { LAUNCH, PAGE, toPlay } = await import(new URL('../../testlib.mjs', import.meta.url).href);
const OUT = process.argv[2] || 'camtrack'; fs.mkdirSync(OUT, { recursive: true });
const CH = process.env.CH || 'e4c1', OPT = process.env.OPT || 'A', T0 = +(process.env.T0 || 0), T1 = +(process.env.T1 || 5);
const FPS = +(process.env.FPS || 30), STRIP = +(process.env.STRIP || 0);
const SHOTS = (process.env.SHOTS || '').split(',').filter(Boolean).map(Number).sort((a, b) => a - b);
const b = await chromium.launch(LAUNCH);
/* (v24.35) VIEW=desktop: a 1280 x 800 window with a mouse, where the default is a phone (touch) */
const DESK = process.env.VIEW === 'desktop';
const ctx = await b.newContext(DESK ? { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }
                                    : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)); });
const TS = Date.now(), log = (...a) => console.log(((Date.now() - TS) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(8000);                                         // the chapter's first frames (v9.3)
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE || 'decide:~fri');
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const r = B[i] && B[i].getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(OPT));
if (DESK) await p.mouse.click(Math.round(bt.x), Math.round(bt.y)); else await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y));
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 500 });
await p.waitForFunction(() => window.__enc.cine.t() > 0.2, null, { timeout: 600000, polling: 300 });
/* let the scene's own frames run up to T0 once, so what its clock builds as it goes (the people's walks, the props) is
   built: a seek straight past it would land a world a played film never shows */
await p.evaluate((t) => window.__enc.cine.seek(Math.max(0, t - 2)), T0);
await p.evaluate(() => window.__enc.cine.resume && window.__enc.cine.resume());
await p.waitForFunction((t) => window.__enc.cine.t() >= t - 0.3, T0, { timeout: 900000, polling: 200 });
log('at', await p.evaluate(() => window.__enc.cine.t()));
const { steps, shots } = await p.evaluate(([T0, T1, FPS, SHOTS]) => {
  const E = window.__enc, real = performance.now.bind(performance), w0 = real() / 1000, out = [], shots = [], want = SHOTS.slice();
  E.cine.seek(T0);
  try {
    for (let k = 0; T0 + k / FPS <= T1 + 1e-9; k++) {
      const now = w0 + k / FPS; performance.now = () => now * 1000;
      E.stage.updateNotes(1 / FPS, 0);
      E.cine.seek(T0 + k / FPS);
      E.yaw.updateMatrixWorld(true);
      const e = E.camera.matrixWorld.elements, d = [-e[8], -e[9], -e[10]];
      out.push({ t: +(T0 + k / FPS).toFixed(4), p: [e[12], e[13], e[14]], d, fov: E.camera.fov });
      if (want.length && T0 + k / FPS >= want[0] - 1e-9) {
        want.shift();
        E.renderer.render(E.scene, E.camera);
        shots.push({ t: +(T0 + k / FPS).toFixed(2), url: E.renderer.domElement.toDataURL('image/jpeg', 0.88) });
      }
    }
  } finally { performance.now = real; }
  return { steps: out, shots };
}, [T0, T1, FPS, SHOTS]);
if (shots.length) {
  const ims = await Promise.all(shots.map(s => sharp(Buffer.from(s.url.split(',')[1], 'base64')).resize({ width: 312 }).png().toBuffer()));
  const m = await sharp(ims[0]).metadata(), gap = 8;
  await sharp({ create: { width: ims.length * (m.width + gap) - gap, height: m.height, channels: 3, background: '#fff' } })
    .composite(ims.map((input, i) => ({ input, left: i * (m.width + gap), top: 0 }))).jpeg({ quality: 84 }).toFile(`${OUT}/shots.jpg`);
  shots.forEach(s => fs.writeFileSync(`${OUT}/shot-${s.t.toFixed(2)}.jpg`, Buffer.from(s.url.split(',')[1], 'base64')));
  log('shots', shots.map(s => s.t).join(' '));
}
/* the measures */
const ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b))))) * 180 / Math.PI;
const rows = [];
for (let i = 1; i < steps.length; i++) {
  const A = steps[i - 1], B = steps[i], dt = B.t - A.t;
  rows.push({ t: B.t, speed: Math.hypot(B.p[0] - A.p[0], B.p[1] - A.p[1], B.p[2] - A.p[2]) / dt, turn: ang(A.d, B.d) / dt, fov: B.fov });
}
for (let i = 1; i < rows.length; i++) rows[i].dturn = (rows[i].turn - rows[i - 1].turn) / (rows[i].t - rows[i - 1].t);
const worst = (k) => rows.reduce((m, r) => (Math.abs(r[k] || 0) > Math.abs(m[k] || 0) ? r : m), rows[0]);
const ws = worst('speed'), wt = worst('turn'), wd = worst('dturn');
console.log('lens speed m/s: max', ws.speed.toFixed(2), 'at', ws.t.toFixed(2), '| mean', (rows.reduce((s, r) => s + r.speed, 0) / rows.length).toFixed(2));
console.log('view turn deg/s: max', wt.turn.toFixed(1), 'at', wt.t.toFixed(2), '| turn change deg/s^2: max', Math.abs(wd.dturn).toFixed(0), 'at', wd.t.toFixed(2));
const over = rows.filter(r => Math.abs(r.dturn || 0) > 400).length;
console.log('steps whose turn changes faster than 400 deg/s^2:', over, 'of', rows.length);
fs.writeFileSync(`${OUT}/track.json`, JSON.stringify({ steps, rows }, null, 0));
if (STRIP) {
  const ims = [];
  for (let i = 0; i < STRIP; i++) {
    const t = T0 + (T1 - T0) * (i + 0.5) / STRIP;
    await p.evaluate((t) => window.__enc.cine.seek(t), t);
    await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
    const url = await p.evaluate(() => { const E = window.__enc; E.renderer.render(E.scene, E.camera); return E.renderer.domElement.toDataURL('image/png'); });
    ims.push(await sharp(Buffer.from(url.split(',')[1], 'base64')).removeAlpha().resize({ width: 312 }).png().toBuffer());
  }
  const m = await sharp(ims[0]).metadata(), gap = 8;
  await sharp({ create: { width: STRIP * (m.width + gap) - gap, height: m.height, channels: 3, background: '#fff' } })
    .composite(ims.map((input, i) => ({ input, left: i * (m.width + gap), top: 0 }))).jpeg({ quality: 84 }).toFile(`${OUT}/strip.jpg`);
  log('strip', STRIP);
}
log('errors', JSON.stringify(errs.slice(0, 6)));
await b.close();
process.exit(errs.length ? 1 : 0);
