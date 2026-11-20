/* v27.0 build 53 (Chad, 20 Nov 2026, R127 to R131): THE DIP MARKED, HIS TEACHER ON THE STRAIN, THE CLIMAX SEEN WHOLE,
   driven in the real fight on a phone (390 x 844 CSS points drawn at two pixels a point, a touch context): a save seeded at
   the blessing with the water taken, Continue TAPPED on the title, the brief's START tapped, the eye opened and shut by
   TAPS on it (the real path), each step photographed and its numbers read off the page.
   MODE=shut (the default):
     01 the reload sign over the large bowl, his sight shut (the lens turned onto it); its height read twice, a second apart
     02 the same with his sight open (the vision's pale negative)
     03 open with the ring full and red: "You're losing control..." (ph4b9) heard, the eye asking CLOSE
     04 shut by him the first time: ph4b6 heard, and NOT ph4b8 once the ring is empty (the shut has had its word)
     05 open again, the ring near half, shut: once it is empty "When you feel better..." (ph4b8) heard
     06 left shut into THE RUSH: "Open it, now!" (ph4b7) heard at once, his sight opened for him as it ends (no wait), held
        open (the eye 'locked', lit, never 'held'), the lock's words under the reticle
     07 the eye tapped in the rush: refused, the sight still open, the words said again
     08 the strain set into the red in the rush: brought under it, no CLOSE asked, nothing shuts it for him
     09 the call, the amulet's showcase and the golden water: his sight open and the eye locked at each, a tap refused in the gold
     10 the fight's end: his sight let go (closed, no lock)
   MODE=open: the rush reached with his sight open: held open at once, "Open it, now!" never said; a tap refused; the end.
   Two things are SET, and said: the rush is reached by setting the blessing's progress at its mark (F.k = 0.70), and the
   fight's end by setting it at 1; the strain is set (0.99 for the red, 0.6 for near half) rather than waited for (on this
   box the fight's clock runs at a quarter of the wall's). Her life is held at 60 or more while the probe waits. Every page
   error is printed; the run exits non-zero on one or on a failed check.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [MODE=shut|open] [DSF=2] node tools/probes/e4c4climax.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const MODE = process.env.MODE || 'shut';
const OUT = process.env.OUT || '/tmp/e4c4climax-' + MODE;
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
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const tapSel = async (sel) => { const bb = await p.locator(sel).boundingBox(); if (!bb) return false; await p.touchscreen.tap(Math.round(bb.x + bb.width / 2), Math.round(bb.y + bb.height / 2)); return true; };
let shotN = 0;
const shot = async (tag) => { await frames(3); try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.png`, timeout: 240000 }); } catch { log('  (a slow frame: no picture)'); } };
const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 200 }).then(() => true, () => false);
const checks = {};
/* what the page shows of the eye, the ring, the fight, the sign and the words under the reticle */
const read = () => p.evaluate(() => {
  const E = window.__enc, St = E.stage, D = St.dbg, F = D.play.fight, vb = document.getElementById('visionBtn');
  let mark = null; St.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 29 && o.material && o.material.toneMapped === false) mark = o; });
  const nf = document.getElementById('nofire');
  return { st: E.getState(), heat: +(D.play.heat || 0).toFixed(3), cls: vb ? [...vb.classList].filter(c => /urge|strain|on|held|locked/.test(c)).join(' ') : '',
           vis: E.vision(), call: F ? F.call : null, k: F ? +F.k.toFixed(3) : null, hp: F ? F.hp : null, on: !!(F && F.on), locked: F ? F.locked : null,
           heard: St.info().heard.filter(h => /^ph4b[1-9]$/.test(h)), nerveOut: D.play.nerveOut, closeHold: D.play.closeHold, phase: St.phase,
           mark: mark ? { vis: mark.visible, op: +mark.material.opacity.toFixed(3), x: +mark.position.x.toFixed(3), y: +mark.position.y.toFixed(3), z: +mark.position.z.toFixed(3),
                          layers: mark.layers.mask } : null,
           words: nf ? { text: nf.textContent.trim(), on: nf.classList.contains('on') } : null };
});
const keepHer = () => p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; if (F && F.on && F.hp < 60) F.hp = 60; });
/* the lens turned onto a point */
const aimAt = (q) => p.evaluate((q) => { const E = window.__enc, Y = E.yaw, P = E.pitch;
  const dx = q.x - Y.position.x, dz = q.z - Y.position.z, d = Math.hypot(dx, dz);
  Y.rotation.y = Math.atan2(-dx, -dz); P.rotation.x = Math.max(-1.2, Math.min(1.2, Math.atan2(q.y - Y.position.y, Math.max(0.05, d)))); return +d.toFixed(2); }, q);
const heardHas = (k) => p.evaluate((k) => window.__enc.stage.info().heard.includes(k), k);
/* the sign's height sampled on every drawn frame for 4 s of the page's clock (two reads a second apart can land on one
   drawn frame on a slow box): its swing, and each sample against the bob it is meant to make, 3 cm either way once in
   2.8 s about its middle, on the wall clock */
const bobCheck = async () => {
  const S = await p.evaluate(() => new Promise(res => { const E = window.__enc; let m = null;
    E.stage.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 29 && o.material && o.material.toneMapped === false) m = o; });
    const out = [], t0 = performance.now();
    const f = () => { out.push([performance.now() / 1000, m.position.y]); if (performance.now() - t0 < 4000 && out.length < 600) requestAnimationFrame(f); else res(out); };
    requestAnimationFrame(f); }));
  const ys = S.map(q => q[1]), lo = Math.min(...ys), hi = Math.max(...ys), mid = (lo + hi) / 2;
  const err = Math.max(...S.map(([t, y]) => Math.abs(y - (mid + 0.03 * Math.sin(t * Math.PI * 2 / 2.8)))));
  log('  bob:', S.length, 'frames, swing', (hi - lo).toFixed(4), 'm, worst miss of the curve', err.toFixed(4), 'm, middle', mid.toFixed(3));
  return { markBobs: S.length >= 4 && hi - lo > 0.02 && hi - lo <= 0.0605, markBobCurve: err < 0.012 };
};

await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await frames(2);
await tapSel('#startBtn');
log('Continue tapped');
await until(() => window.__enc.getState() === 'event', 900000);
await tapSel('#evBtn');
await until(() => { const D = window.__enc.stage.dbg; return window.__enc.getState() === 'play' && D.play.fight && D.play.fight.on; }, 300000);
let r = await read(); log('the fight is on', JSON.stringify(r));

if (MODE === 'shut') {
  /* 01: the sign, his sight shut */
  await until(() => { const E = window.__enc; let m = null; E.stage.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 29 && o.material && o.material.toneMapped === false) m = o; });
    return m && m.visible && m.material.opacity > 0.98; }, 60000);
  r = await read(); log('01', JSON.stringify(r.mark));
  const d = await aimAt({ x: r.mark.x, y: r.mark.y - 0.25, z: r.mark.z }); log('  aimed from', d, 'm');
  checks.markShown = !!r.mark && r.mark.vis && r.mark.op > 0.98 && r.mark.layers !== 1;
  Object.assign(checks, await bobCheck());
  await keepHer(); await shot('sign-shut');
  /* 02: the sign, his sight open */
  await tapSel('#visionBtn');
  await until(() => { const v = window.__enc.vision(); return v.on && v.dir === 0; }, 60000);
  await p.waitForTimeout(600); await keepHer();
  r = await read(); await aimAt({ x: r.mark.x, y: r.mark.y - 0.25, z: r.mark.z });
  await shot('sign-open');
  /* 03: the ring full and red: "You're losing control..." */
  await p.evaluate(() => { window.__enc.stage.dbg.play.heat = 0.99; });
  checks.topLine = await until(() => window.__enc.stage.info().heard.includes('ph4b9'), 90000);
  await keepHer(); r = await read(); log('03', JSON.stringify(r));
  checks.topAskClose = /urgeClose/.test(r.cls) && /strainHot/.test(r.cls);
  await shot('top-losing-control');
  /* 04: shut the first time: ph4b6, and not ph4b8 */
  await until(() => !(window.__enc.stage.info().until > window.__enc.stage.info().t), 60000);
  await tapSel('#visionBtn');
  await until(() => !window.__enc.vision().on, 30000);
  checks.firstShutLine = await until(() => window.__enc.stage.info().heard.includes('ph4b6'), 60000);
  await until(() => window.__enc.stage.dbg.play.heat <= 0.02, 240000);
  await p.waitForTimeout(5000); await keepHer();
  checks.noRestAfterFirst = !(await heardHas('ph4b8'));
  r = await read(); log('04', JSON.stringify(r));
  /* 05: open, near half, shut: ph4b8 once the ring is empty */
  await until(() => !(window.__enc.stage.info().until > window.__enc.stage.info().t), 60000);
  await tapSel('#visionBtn');
  await until(() => window.__enc.vision().on, 30000);
  await p.evaluate(() => { window.__enc.stage.dbg.play.heat = 0.6; });
  await frames(4);
  await tapSel('#visionBtn');
  await until(() => !window.__enc.vision().on, 30000);
  const tShut = Date.now();
  checks.restLine = await until(() => window.__enc.stage.info().heard.includes('ph4b8'), 120000);
  r = await read(); log('05 ph4b8 heard', ((Date.now() - tShut) / 1000).toFixed(1), 's after the shut', JSON.stringify(r));
  checks.restOnEmpty = r.heat <= 0.02 + 1e-9;
  await keepHer(); await shot('rest-feel-better');
  await until(() => !(window.__enc.stage.info().until > window.__enc.stage.info().t), 60000);
} else {
  /* MODE=open: open before the rush; the sign seen through his sight, and its bob measured */
  await tapSel('#visionBtn');
  await until(() => { const v = window.__enc.vision(); return v.on && v.dir === 0; }, 60000);
  await p.evaluate(() => { window.__enc.stage.dbg.play.heat = 0.3; });
  await until(() => { const E = window.__enc; let m = null; E.stage.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 29 && o.material && o.material.toneMapped === false) m = o; });
    return m && m.visible && m.material.opacity > 0.98; }, 60000);
  r = await read(); checks.markShown = !!r.mark && r.mark.vis && r.mark.op > 0.98 && r.mark.layers !== 1;
  await aimAt({ x: r.mark.x, y: r.mark.y - 0.25, z: r.mark.z });
  Object.assign(checks, await bobCheck());
  await keepHer(); await shot('sign-open');
}

/* 06: the rush */
r = await read(); log('before the rush', JSON.stringify(r));
const sightBefore = r.vis.on;
await p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; if (F && !F.call) F.k = Math.max(F.k, 0.70); });
await until(() => window.__enc.stage.dbg.play.fight.call === 'surge', 30000);
const tRush = Date.now();
if (!sightBefore) {
  checks.rushCall = await until(() => window.__enc.stage.info().heard.includes('ph4b7'), 60000);
  const callAfter = ((Date.now() - tRush) / 1000).toFixed(1);
  const tCall = Date.now();
  checks.openedForHim = await until(() => window.__enc.vision().on, 120000);
  log('06 call', callAfter, 's into the rush; opened', ((Date.now() - tCall) / 1000).toFixed(1), 's after the call (wall)');
} else {
  checks.lockedAtOnce = await until(() => window.__enc.stage.dbg.play.fight.locked === true, 30000);
}
await until(() => window.__enc.stage.dbg.play.fight.locked === true, 30000);
await p.waitForTimeout(500); await keepHer();
r = await read(); log('06', JSON.stringify(r));
checks.locked = r.locked === true && /\blocked\b/.test(r.cls) && /\bon\b/.test(r.cls) && !/\bheld\b/.test(r.cls) && r.vis.on;
checks.lockWords = !!r.words && /stays open until the fight is over/.test(r.words.text);
if (sightBefore) checks.noCallWhenOpen = !r.heard.includes('ph4b7');
await shot('rush-held-open');
/* 07: a tap refused */
await tapSel('#visionBtn'); await frames(3);
r = await read(); log('07', JSON.stringify(r));
checks.tapRefused = r.vis.on && r.locked && /stays open until the fight is over/.test(r.words ? r.words.text : '');
await shot('rush-tap-refused');
/* 08: the strain in the red, in the rush */
await p.evaluate(() => { window.__enc.stage.dbg.play.heat = 0.95; });
await until(() => window.__enc.stage.dbg.play.heat <= 0.7001, 60000);
await frames(4); await keepHer();
r = await read(); log('08', JSON.stringify(r));
checks.heartHeld = r.heat <= 0.7001 && !/urgeClose/.test(r.cls) && !r.nerveOut && !r.closeHold && r.vis.on;
/* 09: the call, the showcase and the gold */
checks.callOpen = await until(() => window.__enc.stage.dbg.play.fight.call === 'asking', 600000);
r = await read(); log('09 asking', JSON.stringify(r)); checks.callOpen = checks.callOpen && r.vis.on && r.locked;
await keepHer();
checks.showOpen = await until(() => window.__enc.getState() === 'unlock', 600000);
r = await read(); log('09 shown', JSON.stringify(r)); checks.showOpen = checks.showOpen && r.vis.on;
checks.goldOpen = await until(() => window.__enc.getState() === 'play' && window.__enc.stage.dbg.play.fight.call === 'gold', 600000);
await p.waitForTimeout(1500); await keepHer();
r = await read(); log('09 gold', JSON.stringify(r));
checks.goldOpen = checks.goldOpen && r.vis.on && r.locked && /\blocked\b/.test(r.cls);
checks.markGoneInGold = !r.mark || !r.mark.vis;
await tapSel('#visionBtn'); await frames(3);
r = await read(); checks.goldTapRefused = r.vis.on;
await shot('gold-held-open');
/* 10: the fight's end lets it go */
await p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; if (F && F.on) F.k = 1; });
checks.endReleased = await until(() => { const v = window.__enc.vision(); return !v.on && !v.held; }, 300000);
r = await read(); log('10', JSON.stringify(r));
checks.endReleased = checks.endReleased && !/\blocked\b/.test(r.cls);
log('checks', JSON.stringify(checks));
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length || Object.values(checks).some(v => !v) ? 1 : 0);
