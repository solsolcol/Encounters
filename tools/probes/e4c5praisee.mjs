/* v28.0 · THE NINE IN THE HUNT, WITH HIS SIGHT OPEN (the lead, 21 Nov: PLAY reports no Prai drawn with the wave out over the
   court, though their lines fire at their places). The chapter booted on a phone (390 x 844 at DPR 2, touch), the hunt
   set, the eye pressed as a finger presses it, the wave let run out; then, measured: the vision's state (open, its radius,
   whether its pass drew, its spirit materials), and for each of the nine: ready, shown (its whole chain), where, how far
   from the eye, its meshes (their layers, shown, their material: the vision's own or not, uAlpha, uFill, uColor), its edge
   twins, and the GL's draw count of the frame with the nine and without them (what they cost is what is drawn of them).
   Then photographed full size from where he stands, turned to them. VIEW at AT=x,z (the court's door end unless said).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [AT=x,z] [SWAPJS=key=file.js] sh tools/bslot.sh node tools/probes/e4c5praisee.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5praisee'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ' ' + m.text().slice(0, 220)); });
for (const [key, file] of (process.env.SWAPJS || '').split(',').filter(Boolean).map(q => q.split('=')))
  await p.route(new RegExp('/assets/' + key + '\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(file) }));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('ready');
await p.evaluate(() => window.__enc.stage.setPhase('hunt'));
await p.waitForFunction(() => window.__enc.stage.phase === 'hunt' && window.__enc.getState() === 'play', null, { timeout: 300000, polling: 500 });
await p.waitForTimeout(6000);
/* where he stands: AT, or a step out of his doors, turned to the nine's middle */
const where = await p.evaluate((at) => { const E = window.__enc, L = E.stage.films.PRAI5.list;
  let cx = 0, cz = 0, n = 0; for (const P of L) { cx += P.group.position.x; cz += P.group.position.z; n++; } cx /= n || 1; cz /= n || 1;
  const a = at ? at.split(',').map(Number) : [cx, cz + 4.2];
  E.yaw.position.set(a[0], E.yaw.position.y, a[1]); E.yaw.rotation.y = Math.atan2(-(cx - a[0]), -(cz - a[1])); E.pitch.rotation.x = -0.12;
  return { at: a, middle: [+cx.toFixed(2), +cz.toFixed(2)] }; }, process.env.AT || '');
say('stands', JSON.stringify(where));
await frames(4);
/* the eye pressed as a finger presses it */
const eb = await p.evaluate(() => { const B = document.getElementById('visionBtn'); if (!B) return null; const r = B.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, shown: getComputedStyle(B).display !== 'none' }; });
say('eye button', JSON.stringify(eb));
if (eb) await p.touchscreen.tap(Math.round(eb.x), Math.round(eb.y));
await p.waitForFunction(() => { const v = window.__enc.vision(); return v.on && v.dir === 0 && v.r > 1; }, null, { timeout: 120000, polling: 250 }).catch(() => say('the wave did not settle'));
await frames(6); await p.waitForTimeout(1500);
const rep = await p.evaluate(() => {
  const E = window.__enc, v = E.vision(), cam = E.camera, eye = cam.getWorldPosition(cam.position.clone());
  const fx = E.visionFx ? E.visionFx() : null;
  const L = E.stage.films.PRAI5.list, seen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const nine = L.map((P, i) => { const g = P.group; g.updateWorldMatrix(true, true);
    const meshes = []; if (P.model) P.model.traverse(o => { if (!o.isMesh) return; const m = o.material, U = m && m.uniforms;
      meshes.push({ name: o.name, twin: !!o.userData.__svTwin, prai: !!o.userData.__praiTwin, layer: o.layers.mask, vis: o.visible, chain: seen(o), sv: !!(m && m.__svOwn), type: m && m.type,
                    uAlpha: U && U.uAlpha ? +U.uAlpha.value.toFixed(3) : null, uFill: U && U.uFill ? U.uFill.value : null, uR: U && U.uR ? +U.uR.value.toFixed(2) : null,
                    col: U && U.uColor ? U.uColor.value.getHexString() : null }); });
    return { i, key: P.key, ready: P.ready, hidden: P.hidden, shown: seen(g), at: [g.position.x, g.position.y, g.position.z].map(q => +q.toFixed(2)), scale: +g.scale.x.toFixed(3),
             dist: +Math.hypot(g.position.x - eye.x, g.position.z - eye.z).toFixed(2), fx: !!P.fx, edge: !!P.edge, edgeTwins: P.edge ? P.edge.twins.length : 0, tr: !!P.tr, alpha: P.alpha, meshes }; });
  return { vision: v, eye: [eye.x, eye.y, eye.z].map(q => +q.toFixed(2)), nine };
});
console.log(JSON.stringify(rep.vision), 'eye', JSON.stringify(rep.eye));
for (const P of rep.nine) { console.log(`#${P.i} ${P.key} ready ${P.ready} hidden ${P.hidden} shown ${P.shown} at ${P.at} scale ${P.scale} dist ${P.dist} fx ${P.fx} edge ${P.edge}(${P.edgeTwins}) alpha ${P.alpha}`);
  for (const m of P.meshes) console.log(`     ${m.name || '-'} twin ${m.twin} prai ${m.prai} layer ${m.layer} vis ${m.vis} chain ${m.chain} sv ${m.sv} ${m.type} uAlpha ${m.uAlpha} uFill ${m.uFill} uR ${m.uR} col ${m.col}`); }
/* what the frame draws with the nine and without them */
await p.evaluate(() => {
  const C = window.__glc = { on: false, calls: 0, tris: 0 };
  const cv = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  const gl = cv.getContext('webgl2') || cv.getContext('webgl');
  const tri = (m, n) => m === 4 ? n / 3 : (m === 5 || m === 6) ? Math.max(0, n - 2) : 0;
  for (const [nm, ci, ii] of [['drawElements', 1, -1], ['drawArrays', 2, -1], ['drawElementsInstanced', 1, 4], ['drawArraysInstanced', 2, 3]]) {
    const f = gl[nm]; if (!f) continue;
    gl[nm] = function (...a) { if (C.on) { C.calls++; C.tris += tri(a[0], a[ci]) * (ii >= 0 ? (a[ii] || 1) : 1); } return f.apply(gl, a); }; } });
const count = () => p.evaluate(async () => { const C = window.__glc; await new Promise(r => requestAnimationFrame(r)); C.calls = 0; C.tris = 0; C.on = true;
  await new Promise(r => requestAnimationFrame(r)); C.on = false; return { calls: C.calls, tris: Math.round(C.tris) }; });
const A = await count();
await p.evaluate(() => { const L = window.__enc.stage.films.PRAI5.list; window.__was = L.map(P => P.group.visible); L.forEach(P => { P.group.visible = false; }); });
const B = await count();
await p.evaluate(() => { const L = window.__enc.stage.films.PRAI5.list; L.forEach((P, i) => { P.group.visible = window.__was[i]; }); });
say('one frame with the nine', JSON.stringify(A), 'without', JSON.stringify(B), 'the nine drew', A.calls - B.calls, 'calls', A.tris - B.tris, 'triangles');
await frames(4); await p.waitForTimeout(1200);
await p.screenshot({ path: OUT + '/hunt-sight-open.png' });
say('picture', OUT + '/hunt-sight-open.png');
console.log('errs', JSON.stringify(errs.slice(0, 10)));
await b.close();
