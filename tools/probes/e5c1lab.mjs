/* v29.0 (E5C1 PLAY, M6): THE PLAY'S LAB. Episode 5 chapter 1 booted (?ch=e5c1, the opening skipped), a phase set, then views
   photographed full size: each [name, x, y, z, lookX, lookY, lookZ, fovDeg (0: the play lens), hideHud (1)] with the play left
   running (the bodies in their takes) or a JS snippet run first (PRE, in the page: `S` the stage). Writes OUT/<name>.png and
   prints the cast's state (each body's take, seat report, where it stands) and every page error.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop PHASE=room VIEWS='[["gside",2.4,0.9,-0.3,0.42,0.7,-0.3,40]]'
       [PRE='...'] [CHFILE=<e5c1.js>] [OUT=dir] node tools/probes/e5c1lab.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const OUT = (process.env.OUT || '/tmp/e5c1lab') + '-' + VIEW; fs.mkdirSync(OUT, { recursive: true });
const VIEWS = JSON.parse(process.env.VIEWS || '[]');
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
if (process.env.CHFILE) { const CHSRC = fs.readFileSync(process.env.CHFILE, 'utf8');
  await p.route(new RegExp('/assets/e5c1\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|has no take|no line|failed to load|not a seat|too little skin|no .* leg|warn/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 300)); });
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e5c1', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
if (process.env.PHASE && process.env.PHASE !== 'room') { await p.evaluate((ph) => window.__enc.stage.setPhase(ph), process.env.PHASE); await frames(10); }
if (process.env.PRE) { const r = await p.evaluate((src) => { const S = window.__enc.stage, E = window.__enc; return String(new Function('S', 'E', src)(S, E)); }, process.env.PRE); console.log('PRE', r); }
await frames(20);
/* (PRE2 and VIEWS2: a second snippet run after the first views, and its own views: a thing before and after a change in
   one boot) */
const VIEWS2 = JSON.parse(process.env.VIEWS2 || '[]');
for (const [name, x, y, z, lx, ly, lz, fov, hide = 1] of VIEWS.concat(process.env.PRE2 ? [['@PRE2']] : [], VIEWS2)) {
  if (name === '@PRE2') { const r = await p.evaluate((src) => { const S = window.__enc.stage, E = window.__enc; return String(new Function('S', 'E', src)(S, E)); }, process.env.PRE2); console.log('PRE2', r); await frames(20); continue; }
  await p.evaluate(([x, y, z, lx, ly, lz, fov, hide]) => { const E = window.__enc; E.kit.pose('lying', { y, yaw: 0, span: 9, pitchLo: -1.5, pitchHi: 1.5, secs: 0.01 }); E.kit.root(true);
    E.yaw.position.set(x, y, z); const dx = lx - x, dz = lz - z, dy = ly - y; E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
    if (fov) E.kit.lens(fov, { secs: 0 }); else E.kit.lens(null, { secs: 0 });
    document.body.classList.toggle('probeHideHud', !!hide);
    let st = document.getElementById('probeHideHudCss'); if (!st) { st = document.createElement('style'); st.id = 'probeHideHudCss'; st.textContent = 'body.probeHideHud #hud, body.probeHideHud #objective, body.probeHideHud .hotMark, body.probeHideHud #interact, body.probeHideHud #prompt { visibility: hidden !important }'; document.head.appendChild(st); } },
    [x, y, z, lx, ly, lz, fov, hide]);
  await frames(8);
  await p.evaluate(([x, y, z]) => { window.__enc.yaw.position.set(x, y, z); }, [x, y, z]); await frames(3);
  await p.screenshot({ path: `${OUT}/${name}.png`, timeout: 240000 }); console.log('PIC', name);
}
const cast = await p.evaluate(() => { const c = window.__enc.stage.dbg.cast, o = {}; for (const k in c) { const P = c[k]; o[k] = { key: P.key, ready: P.ready, cur: P.cur, at: P.group.position.toArray().map(v => +v.toFixed(3)), model: P.model ? P.model.position.toArray().map(v => +v.toFixed(3)) : null, seated: P.seated ? P.seated[P.cur] : null }; } return o; });
console.log('CAST', JSON.stringify(cast));
console.log('STORY', JSON.stringify(await p.evaluate(() => window.__enc.stage.info().story)));
console.log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
