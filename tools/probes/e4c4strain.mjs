/* v27.0 build 39 (Chad, 19 Nov 2026, R95/R96): THE STRAIN OF HIS SIGHT, photographed and measured in the real fight on a
   phone (390 x 844 CSS points drawn at two pixels a point, a touch context). A save seeded at the blessing with the water
   taken, Continue TAPPED on the title, the brief photographed and START tapped; then the eye opened and shut by TAPS on it
   (the real path), each step photographed and its numbers read off the page:
     01 the brief, its new sentence on the strain
     02 shut at the fight's start: the green ones as faint dark shapes, the eye asking OPEN
     03-05 open: the ring filling; at its red mark the ring red and the eye asking CLOSE
     06 shut by him: his teacher's ph4b6 heard, the ring emptying, the shapes back
     07 the ring empty: the eye asking OPEN again
     08-09 left shut into THE RUSH: "Open it, now!" (ph4b7) heard once the ring is empty, and his sight opened for him
           three seconds after it, no tap
   Three things are SET, and said: the rush is reached by setting the blessing's progress at its mark (F.k = FIGHT.surgeAt)
   rather than waited for; the strain is set at 0.9 for the red ring (on this box the fight's clock runs at a quarter of
   the wall's: a frame is at most 0.25 s of it, so 27 s of strain is minutes of waiting); and her life is held at 60 or
   more while the probe waits, so a fight left alone is not lost while it is photographed. (Build 40: the waits for the
   first shapes, the wave home and the opening for him are long enough for that slow clock.) Every page error is printed, and the run exits non-zero on one or on a failed check.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [DSF=2] node tools/probes/e4c4strain.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4strain';
fs.mkdirSync(OUT, { recursive: true });
const W = 390, H = 844, DSF = +(process.env.DSF || 2);
const SPAWN = { x: 0.15, y: 1.62, z: 1.0 };
const PH = 'bless:r,m,f,o,a,k,p,v,l1,l2,l3,w';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const save = { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: PH,
               conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: SPAWN, done: false, t: 1 };
await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|found no colour line/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const tapSel = async (sel) => { const bb = await p.locator(sel).boundingBox(); if (!bb) return false; await p.touchscreen.tap(Math.round(bb.x + bb.width / 2), Math.round(bb.y + bb.height / 2)); return true; };
let shotN = 0;
const shot = async (tag) => { await frames(3); try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.png`, timeout: 240000 }); } catch { log('  (a slow frame: no picture)'); } };
const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 250 }).then(() => true, () => false);
const checks = {};
/* what the page shows of the eye, the ring and the fight */
const read = () => p.evaluate(() => {
  const E = window.__enc, D = E.stage.dbg, F = D.play.fight, vb = document.getElementById('visionBtn'), f = vb && vb.querySelector('.srFill');
  const C = 2 * Math.PI * 21.5, off = f ? parseFloat(f.style.strokeDashoffset) : NaN;
  const greens = D.spirits.wander.concat([D.spirits.large]);
  return { st: E.getState(), heat: +(D.play.heat || 0).toFixed(3), ring: Number.isFinite(off) ? +(1 - off / C).toFixed(3) : null,
           cls: vb ? [...vb.classList].filter(c => /urge|strain|on|held/.test(c)).join(' ') : '', vis: E.vision(),
           call: F ? F.call : null, k: F ? +F.k.toFixed(3) : null, hp: F ? F.hp : null, on: !!(F && F.on),
           shades: greens.filter(P => P.shade && P.shade.on).length, shadeA: +Math.max(0, ...greens.map(P => P.shade ? P.shade.u.uShA.value : 0)).toFixed(3),
           heard: E.stage.info().heard.filter(h => /^ph4b[3-7]$/.test(h)), bigDone: F ? [...F.bigDone] : [], shutSaid: F ? F.shutSaid : null };
});
/* her life held while the probe waits (said in the header) */
const keepHer = () => p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; if (F && F.on && F.hp < 60) F.hp = 60; });
/* the lens turned onto the nearest green one in the room (the drive's aim, without the walk) */
const aimNearest = () => p.evaluate(() => {
  const E = window.__enc, D = E.stage.dbg, F = D.play.fight, Y = E.yaw, P = E.pitch;
  if (!F) return null;
  let best = null, bd = 1e9;
  for (const S of F.shapes) { if (S.state !== 'come' && S.state !== 'feed') continue; const g = S.P.group.position;
    const d = Math.hypot(g.x - Y.position.x, g.z - Y.position.z); if (d < bd && d > 0.8) { bd = d; best = { x: g.x, y: g.y + 0.45, z: g.z }; } }
  if (!best) return null;
  const dx = best.x - Y.position.x, dz = best.z - Y.position.z, d = Math.hypot(dx, dz);
  Y.rotation.y = Math.atan2(-dx, -dz); P.rotation.x = Math.max(-1.2, Math.min(1.2, Math.atan2(best.y - Y.position.y, Math.max(0.05, d))));
  return { d: +d.toFixed(2) };
});

await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await frames(2);
await tapSel('#startBtn');
log('Continue tapped');
await until(() => ['event', 'play'].includes(window.__enc.getState()), 900000);
await until(() => window.__enc.getState() === 'event', 120000);
log('state', await p.evaluate(() => window.__enc.getState()));
const brief = await p.evaluate(() => { const e = document.getElementById('event'); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; });
checks.brief = /Spirit Vision strains you\. Close it when the ring turns red, and open it again when it empties\./.test(brief);
log('brief:', brief.slice(0, 400));
await shot('brief');
await tapSel('#evBtn');
await until(() => { const D = window.__enc.stage.dbg; return window.__enc.getState() === 'play' && D.play.fight && D.play.fight.on; }, 300000);
log('the fight is on', JSON.stringify(await read()));
/* 02: shut at the start: wait for a shape in the room and its shade on */
await until(() => { const D = window.__enc.stage.dbg, F = D.play.fight;
  return F && F.shapes.some(S => (S.state === 'come' || S.state === 'feed') && S.P.shade && S.P.shade.on && S.P.shade.u.uShA.value > 0.3); }, 300000);
await keepHer();
log('aim', JSON.stringify(await aimNearest()));
let r = await read(); log('02', JSON.stringify(r));
checks.shadesShut = r.shades > 0 && r.shadeA > 0.2 && !r.vis.on;
checks.askOpenAtStart = /\burge\b/.test(r.cls) && /\bstrain\b/.test(r.cls);
await shot('shut-start-shades');
/* 03-05: open, the ring fills; red at its mark, the eye asking close */
await tapSel('#visionBtn');
await until(() => window.__enc.vision().on, 30000);
await p.waitForTimeout(2500); await keepHer(); await aimNearest();
r = await read(); log('03', JSON.stringify(r));
checks.shadesGoneOpen = r.shades === 0;
await shot('open-ring-filling');
await until(() => window.__enc.stage.dbg.play.heat >= 0.5, 120000); await keepHer(); await aimNearest();
r = await read(); log('04', JSON.stringify(r));
checks.ringHalf = r.ring !== null && Math.abs(r.ring - Math.min(1, r.heat)) < 0.05 && !/strainHot/.test(r.cls);
await shot('open-ring-half');
await p.evaluate(() => { window.__enc.stage.dbg.play.heat = 0.9; });
await until(() => document.getElementById('visionBtn').classList.contains('urgeClose'), 60000); await keepHer(); await aimNearest();
r = await read(); log('05', JSON.stringify(r));
checks.ringRedAskClose = /strainHot/.test(r.cls) && /urgeClose/.test(r.cls);
await shot('open-ring-red-close');
/* 06: shut by him: ph4b6 heard, the ring emptying */
await tapSel('#visionBtn');
await until(() => !window.__enc.vision().on, 30000);
await p.waitForTimeout(700); await keepHer(); await aimNearest();
r = await read(); log('06', JSON.stringify(r));
await shot('shut-ring-cooling');
checks.firstShutLine = await until(() => window.__enc.stage.info().heard.includes('ph4b6'), 20000);
/* 07: the ring empty, the eye asking open */
await until(() => window.__enc.stage.dbg.play.heat <= 0.02 && window.__enc.vision().r === 0, 240000);
await until(() => { const D = window.__enc.stage.dbg; return D.spirits.wander.concat([D.spirits.large]).some(P => P.shade && P.shade.on && P.shade.u.uShA.value > 0.3); }, 120000);
await keepHer(); await aimNearest();
r = await read(); log('07', JSON.stringify(r));
checks.emptyAskOpen = r.ring !== null && r.ring < 0.03 && /\burge\b/.test(r.cls) && r.shades > 0;
await shot('shut-ring-empty-ask-open');
/* 08-09: the rush, left shut: "Open it, now!", then his sight opened for him */
await p.evaluate(() => { const D = window.__enc.stage.dbg, F = D.play.fight; if (F && !F.call) F.k = Math.max(F.k, 0.70); });
await until(() => window.__enc.stage.dbg.play.fight.call === 'surge', 30000);
log('the rush', JSON.stringify(await read()));
const tCall = Date.now();
checks.rushCall = await until(() => window.__enc.stage.info().heard.includes('ph4b7'), 60000);
const callAfter = ((Date.now() - tCall) / 1000).toFixed(1);
await keepHer(); await aimNearest();
r = await read(); log('08 call heard after', callAfter, 's', JSON.stringify(r));
await shot('rush-called');
const tOpen = Date.now();
checks.openedForHim = await until(() => window.__enc.vision().on, 300000);
const openAfter = ((Date.now() - tOpen) / 1000).toFixed(1);
await p.waitForTimeout(2000); await keepHer(); await aimNearest();
r = await read(); log('09 opened after the call by', openAfter, 's', JSON.stringify(r));
checks.rushDone = r.bigDone.includes('surge');
await shot('rush-opened-for-him');
log('checks', JSON.stringify(checks));
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length || Object.values(checks).some(v => !v) ? 1 : 0);
