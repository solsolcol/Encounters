/* v28.0 (E4C5, R122) · THE SPECIAL ATTACK AND A CATCH, PHOTOGRAPHED THE WAY A PLAYER GETS THERE (Chad, 25 Nov 2026, "Do idea
   1, 2, 4, 6"): the fight's lab sets its surge, the TOGETHER call is TAPPED and its CUT-IN photographed held at four moments
   of its own timeline, the Naga's film plays out, the BAG is TAPPED in the last stage and the CATCH photographed with its words
   up (the court slowed, the lens pushed in, the white light into the bag, CAUGHT over each and the gold count), the mode's
   clock read; then the story runs on to the table, where R123's check is made again (the fight's effects off, no failed
   frame copy). A phone: 390 x 844 CSS at 2 px a point, a touch context. Exits 1 if the cut-in, the words, the slow or the
   R123 check is missing.
   THE PAGE'S CLOCK IS PLAYWRIGHT'S (build 90's rework): on this box a frame takes a second or more, and a word lives 1.15 s of
   the wall and the cut-in 1.4, so in a natural run they were gone between two frames (build 89's held pictures came out
   empty: the cut-in's own end timer ran out before the picture). The clock runs as the wall's until a moment is HELD: then
   it is paused, the tap goes in, and the game is stepped a frame at a time (33 ms of its time each, whatever this box takes
   to draw one) until the thing is up; the cut-in's own animations (the compositor's, not the page's clock) are paused and
   set at each share of their length for its pictures. Nothing in the game is changed or called to make a picture, but
   BOUND: the lab's `hit(id, 'bind')` hands the fight one bind's event (its visuals, its sound and BOUND over the Prai: the
   same code a real bind runs), because a bind by hand needs Master Zavier walked into reach.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... OUT=<dir> node tools/probes/e4c5r122.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5r122'; fs.mkdirSync(OUT, { recursive: true });
/* (CATCHONLY=1, build 91: BOUND, then the lab's own way to the last stage (toSurge, toLast) and the catch held, no film and no
   table: under Playwright's clock the Naga's film never reached its end in twenty minutes, where the same film from the same
   tap ends in four without it (e4c5play.mjs FIGHTFIRST); the cut-in and the table are proved by the full run) */
const CATCHONLY = process.env.CATCHONLY === '1';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
await p.clock.install();
/* (CHFILE=<file.js>: the chapter served from that file instead of the build's, as e4c5play.mjs does: a chapter file is
   copied into the build byte for byte, so a change to the chapter alone is proved with no build) */
if (process.env.CHFILE) { const CHSRC = fs.readFileSync(process.env.CHFILE, 'utf8');
  await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || (m.type() === 'warning' && /vision|bloom|smear|shimmer|copy|R100/i.test(m.text()))) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
let shot = 0;
const name = (n) => `${OUT}/${String(++shot).padStart(2, '0')}-${n}.png`;
const pic = async (n) => { await frames(4); const f = name(n); await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); };
/* (held: the clock paused, the game stepped by hand; never frames() while held, which waits on a frame that never comes) */
/* (build 93: the moment asked a few hundred ms ahead, and further each time it has passed before the call lands: on a busy box
   (the fixture beside it) 40 ms had gone between the page's reading and the pause, "Cannot fast-forward to the past") */
const hold = async () => { for (let m = 300; ; m *= 2) { try { await p.clock.pauseAt(await p.evaluate((m) => Date.now() + m, m)); return; }
  catch (e) { if (!/past/.test(String(e && e.message || e)) || m > 20000) throw e; } } };
const step = async (n = 1, ms = 33) => { for (let i = 0; i < n; i++) await p.clock.runFor(ms); };
const heldPic = async (n) => { const f = name(n); await p.screenshot({ path: f, timeout: 300000 }); say('held pic', f); };
const fstate = () => p.evaluate(() => { const E = window.__enc, S = E.stage, sn = S.snap().story, f = sn.fight || {};
  return { state: E.getState(), phase: sn.phase, stage: f.stage, on: f.on, film: E.kit.filmPlaying ? E.kit.filmPlaying() : null, fxOn: f.fxOn, fx: f.fx }; });
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
const tapSel = async (sel, why) => { const r = await p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const q = e.getBoundingClientRect(), cs = getComputedStyle(e);
  return q.width > 4 && cs.display !== 'none' && cs.visibility !== 'hidden' ? { x: q.x + q.width / 2, y: q.y + q.height / 2 } : null; }, sel);
  if (!r) { say('  no', sel); return false; } await p.touchscreen.tap(r.x, r.y); say('  tap', why, r.x.toFixed(0), r.y.toFixed(0)); return true; };
const words = () => p.evaluate(() => [...document.querySelectorAll('#popLayer .popW')].map(e => e.textContent + ':' + e.className.replace('popW', '').trim() + ':' + (+e.style.opacity).toFixed(2)));
const catchRead = () => p.evaluate(() => ({ slow: +window.__enc.kit.tagState().slow.toFixed(3), words: [...document.querySelectorAll('#popLayer .popW')].map(e => e.textContent + ':' + e.className.replace('popW', '').trim() + ':' + (+e.style.opacity).toFixed(2)),
  fov: +window.__enc.camera.fov.toFixed(2) }));

await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('play');
/* THE FIGHT: its brief, the lab's start, BOUND held, the surge, the call tapped and held, the Naga's film, the bag tapped and held */
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await lab('open');
await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
say('start', await lab('start'));
await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6); await lab('swapOn');
await p.waitForTimeout(3000);
/* BOUND (idea 4), held: the bind's event on the Prai nearest the middle of the picture, stepped until its word is up */
const near = await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab, R = L.praiRead ? L.praiRead() : null;
  if (!R) return null; let best = null; for (const r of R) { if (!r || r.id === 1) continue; const d = Math.hypot(r.x || 0, (r.z || 0) - 0.5); if (!best || d < best.d) best = { id: r.id, d }; } return best; });
let boundSeen = null;
if (near) {
  await hold();
  say('bind', near.id, await lab('hit', near.id, 'bind'));
  for (let i = 0; i < 40 && !boundSeen; i++) { await step(1); boundSeen = (await words()).find(w => /BOUND/.test(w)) || null; }
  await step(5);
  say('bound', JSON.stringify(await catchRead()));
  await heldPic('bound');
  await p.clock.resume();
} else say('bind: no Prai read');
say('toSurge', JSON.stringify(await lab('toSurge')));
let cutOk = false, cutReal = { pics: 0, word: '' }; const cutAt = [];
if (CATCHONLY) { say('toLast', JSON.stringify(await lab('toLast'))); }
else {
await p.waitForFunction(() => { const e = document.querySelector('.tagBtn.call'); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 10 && getComputedStyle(e).display !== 'none'; }, null, { timeout: 600000, polling: 500 });
await pic('surge-call');
/* THE CUT-IN (idea 1), held on the real tap: the clock paused, TOGETHER tapped, stepped until it is up, then its animations
   paused and set at 18, 32, 55 and 80 % of their length for a picture each; let go, the game runs on */
await hold();
await tapSel('.tagBtn.call', 'TOGETHER');
for (let i = 0; i < 40 && !cutOk; i++) { await step(1, 16); cutOk = await p.evaluate(() => document.getElementById('cutIn').classList.contains('on')); }
cutReal = await p.evaluate(() => { const C = document.getElementById('cutIn'); return { on: C.classList.contains('on'), pics: C.querySelectorAll('.ciPic img').length, word: C.querySelector('.ciWord').textContent }; });
say('cut-in (the tap\'s own)', cutOk, JSON.stringify(cutReal));
if (cutOk) for (const f of [0.18, 0.32, 0.55, 0.8]) {
  const r = await p.evaluate((f) => { const C = document.getElementById('cutIn'), A = C.getAnimations({ subtree: true }); let T = 0;
    for (const a of A) { const d = a.effect.getComputedTiming().duration; T = Math.max(T, +d || 0); }
    for (const a of A) { a.pause(); a.currentTime = f * T; }
    const ra = C.querySelector('.ciBand.a').getBoundingClientRect(), rb = C.querySelector('.ciBand.b').getBoundingClientRect();
    return { f, n: A.length, T, word: C.querySelector('.ciWord').textContent, a: [ra.left, ra.top, ra.width, ra.height].map(Math.round), b: [rb.left, rb.top, rb.width, rb.height].map(Math.round),
             pics: C.querySelectorAll('.ciPic img').length, on: C.classList.contains('on') }; }, f);
  cutAt.push(r); await heldPic('cutin-' + Math.round(f * 100));
}
say('cut-in held', JSON.stringify(cutAt));
await p.evaluate(() => { for (const a of document.getElementById('cutIn').getAnimations({ subtree: true })) a.play(); });
await p.clock.resume();
await p.waitForFunction(() => !!(window.__enc.kit.filmPlaying && window.__enc.kit.filmPlaying()), null, { timeout: 600000, polling: 500 });
say('film', JSON.stringify(await fstate()));
}
await p.waitForFunction(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'last' && window.__enc.getState() === 'play' && !(window.__enc.kit.filmPlaying && window.__enc.kit.filmPlaying()); }, null, { timeout: 1200000, polling: 1000 });
say('last', JSON.stringify(await fstate()));
await p.waitForTimeout(2500); await pic('last');
/* THE CATCH (ideas 2 and 4), held: the clock paused, the BAG tapped, stepped until CAUGHT is up, then a picture with the
   words risen (four frames on) and one a quarter second on (the slow and the push at their depth) */
let bagged = false, popOk = false; const reads = [];
for (let i = 0; i < 40 && !bagged; i++) {
  const id = await p.evaluate(() => { const e = [...document.querySelectorAll('.tagBtn')].find(e => /BAG/.test(e.textContent || '') && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 4 && !e.classList.contains('locked') && !e.classList.contains('wait'));
    return e ? (e.id ? '#' + e.id : null) : null; });
  if (id) { await hold(); bagged = await tapSel(id, 'BAG'); if (!bagged) await p.clock.resume(); }
  else await p.waitForTimeout(1500);
}
say('bagged', bagged, JSON.stringify(await fstate()));
if (bagged) {
  for (let i = 0; i < 600 && !popOk; i++) { await step(1); popOk = (await words()).some(w => /CAUGHT/.test(w)); }
  await step(4); reads.push(await catchRead()); say('catch', popOk, JSON.stringify(reads[0])); await heldPic('catch-a');
  await step(8); reads.push(await catchRead()); say('catch', JSON.stringify(reads[1])); await heldPic('catch-b');
  await step(30); reads.push(await catchRead()); say('catch', JSON.stringify(reads[2])); await heldPic('catch-c');
  await p.clock.resume();
}
const slowSeen = reads.some(c => c.slow < 0.99), wordsSeen = reads.some(c => c.words.some(w => /CAUGHT/i.test(w))) && reads.some(c => c.words.some(w => /of 9/.test(w)));
if (CATCHONLY) { const ok = popOk && slowSeen && wordsSeen && !!boundSeen;
  say('errors', errs.length ? errs.slice(0, 6).join(' / ') : 'none');
  say('R122 catch', ok ? 'PASS' : 'FAIL', JSON.stringify({ bound: !!boundSeen, popOk, slowSeen, wordsSeen }));
  await b.close(); process.exit(ok ? 0 : 1); }
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
const r123 = fin.fxOn === false && copyErrs === 0, cutPass = cutOk && cutReal.pics === 2 && cutReal.word.length > 0 && cutAt.length === 4 && cutAt.every(r => r && r.on && r.pics === 2 && r.word.length > 0);
const pass = r123 && cutPass && popOk && slowSeen && wordsSeen && !!boundSeen;
say('R122', pass ? 'PASS' : 'FAIL', JSON.stringify({ cutPass, bound: !!boundSeen, popOk, slowSeen, wordsSeen, r123 }), 'copy errors', copyErrs);
await b.close();
process.exit(pass ? 0 : 1);
