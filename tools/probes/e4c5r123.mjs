/* v28.0 (E4C5, R123) · GRANDMASTER PHO AT THE TABLE AFTER THE WHOLE FIGHT, the way a player gets there: Chad, 25 Nov 2026,
   "The pho issue still persists. I believe this happens after going through the fight sequence. Somehow pho model looks
   different with some kind of bloom on top of him during this table scene ... opening spirit vision cause this superimposed
   version of him to get stuck in the middle of the camera". R109's probe (e4c5r109flow.mjs) set the table by setPhase after
   a few seconds of the fight; a player wins it: so here the fight's lab sets its surge, the TOGETHER call is TAPPED, the
   Naga's film plays out, the BAG is TAPPED in the last stage, and the story runs on by itself (the won lines, cleanse(), the
   bag-tied film, the collector's film) to the table. There, with the sight shut, then opened: a picture at each turn of the
   look, and a census of what is drawn (every shown skinned body, its level, its layers and where it stands; the hands'
   scene; every object off layer 0; the renderer's state). A phone: 390 x 844 CSS at 2 px a point, a touch context.
   It fails (exit 1) if the fight's effects are still shown at the table or a frame copy failed (the R123 fault).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... OUT=<dir> [CHFILE=<chapter.js>] node tools/probes/e4c5r123.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5r123'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
/* (CHFILE=<file.js>: the chapter served from that file instead of the build's, as e4c5play.mjs does: a chapter file is
   copied into the build byte for byte, so a change to the chapter alone is proved with no build) */
if (process.env.CHFILE) { const CHSRC = fs.readFileSync(process.env.CHFILE, 'utf8');
  await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || (m.type() === 'warning' && /vision|bloom|smear|shimmer|copy|R100/i.test(m.text()))) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
let shot = 0;
const pic = async (name) => { await frames(4); const f = `${OUT}/${String(++shot).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); };
const fstate = () => p.evaluate(() => { const E = window.__enc, S = E.stage, sn = S.snap().story, f = sn.fight || {};
  return { state: E.getState(), phase: sn.phase, stage: f.stage, on: f.on, film: E.kit.filmPlaying ? E.kit.filmPlaying() : null, fxOn: f.fxOn, fx: f.fx }; });
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
const tapSel = async (sel, why) => { const r = await p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const q = e.getBoundingClientRect(), cs = getComputedStyle(e);
  return q.width > 4 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: q.x + q.width / 2, y: q.y + q.height / 2 } : null; }, sel);
  if (!r) { say('  no', sel); return false; } await p.touchscreen.tap(r.x, r.y); say('  tap', why, r.x.toFixed(0), r.y.toFixed(0)); return true; };

await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('play');
/* THE FIGHT: its brief, the lab's surge, the call tapped, the Naga's film played out, the bag tapped */
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await lab('open');
await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
say('start', await lab('start'));
await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6); await lab('swapOn');
await p.waitForTimeout(3000);
say('toSurge', JSON.stringify(await lab('toSurge')));
await p.waitForFunction(() => { const e = document.querySelector('.tagBtn.call'); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 10 && getComputedStyle(e).display !== 'none'; }, null, { timeout: 600000, polling: 500 });
await pic('surge-call');
await tapSel('.tagBtn.call', 'TOGETHER');
await p.waitForFunction(() => !!(window.__enc.kit.filmPlaying && window.__enc.kit.filmPlaying()), null, { timeout: 600000, polling: 500 });
say('film', JSON.stringify(await fstate()));
await p.waitForTimeout(12000); await pic('naga-film');
await p.waitForFunction(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'last' && window.__enc.getState() === 'play' && !(window.__enc.kit.filmPlaying && window.__enc.kit.filmPlaying()); }, null, { timeout: 1200000, polling: 1000 });
say('last', JSON.stringify(await fstate()));
await p.waitForTimeout(2500); await pic('last');
/* the BAG: whichever act button says it */
let bagged = false;
for (let i = 0; i < 40 && !bagged; i++) {
  const id = await p.evaluate(() => { const e = [...document.querySelectorAll('.tagBtn')].find(e => /BAG/.test(e.textContent || '') && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 4 && !e.classList.contains('locked') && !e.classList.contains('wait'));
    return e ? (e.id ? '#' + e.id : null) : null; });
  if (id) bagged = await tapSel(id, 'BAG');
  else await p.waitForTimeout(1500);
}
say('bagged', bagged, JSON.stringify(await fstate()));
/* the story on by itself: won, cleanse, the bag-tied film and the collector's, to the table */
await p.waitForFunction(() => { const E = window.__enc, sn = E.stage.snap().story; return sn.phase === 'table' && E.getState() === 'play'; }, null, { timeout: 2400000, polling: 1000 });
say('table', JSON.stringify(await fstate()));
await p.waitForTimeout(3000);
const census = () => p.evaluate(() => {
  const E = window.__enc, cam = E.camera, V3 = cam.position.constructor; cam.updateMatrixWorld();
  const eye = new V3().setFromMatrixPosition(cam.matrixWorld), wp = new V3();
  const shown = (o) => { for (let a = o; a; a = a.parent) if (!a.visible) return false; return true; };
  const path = (o) => { const n = []; for (let a = o; a && n.length < 6; a = a.parent) n.push(a.name || a.type); return n.join('<'); };
  const skinned = [], vm = [], offLayer = [], fullscreen = [];
  E.scene.traverse(o => {
    if (o.isSkinnedMesh && shown(o)) { o.getWorldPosition(wp); skinned.push({ p: path(o), at: [wp.x, wp.y, wp.z].map(v => +v.toFixed(2)), layers: o.layers.mask, mat: [].concat(o.material).map(m => m.type + (m.transparent ? '/t' : '') + (m.blending !== 1 ? '/b' + m.blending : '')).join(','), ro: o.renderOrder, d: +wp.distanceTo(eye).toFixed(2) }); }
    if ((o.isMesh || o.isSprite || o.isPoints) && shown(o)) {
      if (o.layers.mask !== 1 && offLayer.length < 80) { o.getWorldPosition(wp); offLayer.push({ p: path(o), layers: o.layers.mask, at: [wp.x, wp.y, wp.z].map(v => +v.toFixed(2)) }); }
      if (o.onBeforeRender && o.onBeforeRender.toString().length > 40 && fullscreen.length < 40) fullscreen.push({ p: path(o), hook: o.onBeforeRender.toString().slice(0, 90) });
    } });
  if (E.vmScene) E.vmScene.traverse(o => { if ((o.isMesh || o.isSprite || o.isPoints) && shown(o)) vm.push(path(o)); });
  const r = E.renderer, gl = r.getContext();
  return { eye: [eye.x, eye.y, eye.z].map(v => +v.toFixed(2)), skinned, vm, offLayer, hooks: fullscreen,
           rt: r.getRenderTarget() ? 'SET' : null, autoClear: r.autoClear, scissor: gl.isEnabled(gl.SCISSOR_TEST), fight: (() => { const f = E.stage.snap().story.fight; return { on: f.on, fxOn: f.fxOn, fx: f.fx }; })(),
           vision: E.vision ? E.vision() : null };
});
await pic('table-shut');
fs.writeFileSync(OUT + '/census-shut.json', JSON.stringify(await census(), null, 1));
/* turn the look as a player does (his yaw on the seat), shut */
const turn = (d, pt) => p.evaluate(([d, pt]) => { const E = window.__enc; E.yaw.rotation.y += d; if (pt != null) E.pitch.rotation.x = pt; }, [d, pt]);
await turn(-0.6); await frames(4); await pic('table-shut-left');
await turn(0.6); await frames(2);
/* the SMELL, then the sight opened by its own button, as the objective asks */
await tapSel('#kbtn-smell, .kitBtn', 'SMELL'); await p.waitForTimeout(6000);
await pic('table-smell');
await tapSel('#visionBtn', 'EYE');
await p.waitForFunction(() => { const v = window.__enc.vision && window.__enc.vision(); return v && v.on && v.dir === 0; }, null, { timeout: 300000, polling: 300 });
await p.waitForTimeout(1500);
await pic('table-open');
fs.writeFileSync(OUT + '/census-open.json', JSON.stringify(await census(), null, 1));
for (const d of [-0.6, 1.2, -0.6]) { await turn(d); await frames(4); await pic('table-open-turn' + d); }
/* THE CHECK (R123): once the fight is won and left, its effects (the bloom among them) are off at the table, and nothing
   copies a frame it cannot copy; exits non-zero otherwise (v6.3) */
const fin = await p.evaluate(() => { const f = window.__enc.stage.snap().story.fight; return { fxOn: f.fxOn, fx: f.fx, on: f.on }; });
const copyErrs = errs.filter(e => /glCopyTexSubImage2D|copy this drawing buffer/i.test(e)).length;
say('errors', errs.length ? errs.slice(0, 6).join(' / ') + (errs.length > 6 ? ' ... (' + errs.length + ')' : '') : 'none');
const pass = fin.fxOn === false && copyErrs === 0;
say('R123', pass ? 'PASS' : 'FAIL', JSON.stringify(fin), 'copy errors', copyErrs);
await b.close();
process.exit(pass ? 0 : 1);
