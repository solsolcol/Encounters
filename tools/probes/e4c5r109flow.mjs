/* v28.0 (E4C5, R109) · THE FAINT PHO, ON THE PATH A PLAYER TAKES: Chad, 24 Nov 2026: "the 21 amulets scene, when i open
   spirit vision and move the camera around, i can see a faint print of pho stuck in the middle of the screen no matter where
   i move it". A table reached straight from the chapter's start (e4c5tablevis.mjs) showed nothing of it; a player reaches
   the table after the fight. So the fight is played first here (its lab: begun, the switch shown, a few seconds live, its
   surge with the TOGETHER call), then the table set as a Continue lands it, the sight opened, and the look turned. Every
   picture is a phone's (390 x 844 CSS at 2 px a point, a touch context); with them a list of what is drawn: every shown
   mesh within 1.2 m of the lens, every shown skinned body and where it stands, the hands' pass, and the vision's layer.
     ENC_DIST=<snapshot> OUT=<dir> [FIGHT=0] node tools/probes/e4c5r109flow.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5r109flow'; fs.mkdirSync(OUT, { recursive: true });
const FIGHT = process.env.FIGHT !== '0';
const SEAT = [0, 239.2, Math.PI, 1.02];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || (m.type() === 'warning' && /vision|bloom|smear|shimmer|copy/i.test(m.text()))) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
if (FIGHT) {
  await p.evaluate(() => window.__enc.stage.setPhase('fight'));
  await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
  await lab('open');
  await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
  say('start', await lab('start'));
  await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6);
  await lab('swapOn');
  await p.waitForTimeout(4000);
  await p.screenshot({ path: OUT + '/fight-live.png', timeout: 300000 }); say('pic fight-live');
  say('toSurge', JSON.stringify(await lab('toSurge')));
  await p.waitForTimeout(9000);
  await p.screenshot({ path: OUT + '/fight-surge.png', timeout: 300000 }); say('pic fight-surge');
}
await p.evaluate(() => window.__enc.stage.setPhase('table'));
await p.waitForFunction(() => window.__enc.stage.phase === 'table' && window.__enc.getState() === 'play', null, { timeout: 300000, polling: 500 });
await frames(8);
const look = (turn, pitch) => p.evaluate(([x, z, ry, up, pt]) => { const E = window.__enc; E.yaw.position.set(x, up, z); E.yaw.rotation.y = ry; E.pitch.rotation.x = pt; }, [SEAT[0], SEAT[1], SEAT[2] + turn, SEAT[3], pitch]);
const pic = async (name) => { await frames(5); const f = `${OUT}/${name}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); };
/* what is drawn: shown meshes near the lens, shown skinned bodies, the hands' pass, the vision's layer */
const census = () => p.evaluate(() => {
  const E = window.__enc, cam = E.camera, V3 = cam.position.constructor; cam.updateMatrixWorld();
  const eye = new V3().setFromMatrixPosition(cam.matrixWorld), wp = new V3();
  const shown = (o) => { for (let a = o; a; a = a.parent) if (!a.visible) return false; return true; };
  const path = (o) => { const n = []; for (let a = o; a && n.length < 5; a = a.parent) n.push(a.name || a.type); return n.join('<'); };
  const near = [], skinned = [], vm = [], vis = [];
  E.scene.traverse(o => { if (!o.isMesh && !o.isPoints && !o.isSprite) return; if (!shown(o)) return;
    o.getWorldPosition(wp); const d = wp.distanceTo(eye);
    if (d < 1.2 && near.length < 40) near.push({ p: path(o), d: +d.toFixed(2), layers: o.layers.mask });
    if (o.isSkinnedMesh && skinned.length < 60) skinned.push({ p: path(o), at: [+wp.x.toFixed(2), +wp.y.toFixed(2), +wp.z.toFixed(2)], layers: o.layers.mask, mat: o.material && o.material.type });
    if (o.layers.mask !== 1 && vis.length < 60) vis.push({ p: path(o), at: [+wp.x.toFixed(2), +wp.y.toFixed(2), +wp.z.toFixed(2)], layers: o.layers.mask }); });
  if (E.vmScene) E.vmScene.traverse(o => { if ((o.isMesh || o.isSprite || o.isPoints) && shown(o)) vm.push(path(o)); });
  const camKids = []; cam.traverse(o => { if (o !== cam) camKids.push(path(o) + (o.visible ? '' : ' (hidden)')); });
  return { eye: [eye.x, eye.y, eye.z].map(v => +v.toFixed(2)), near, skinned, vm, vis, camKids,
           dom: [...document.querySelectorAll('img,canvas')].filter(e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 30 && cs.display !== 'none' && cs.visibility !== 'hidden' && e.id !== 'c'; })
             .map(e => { const r = e.getBoundingClientRect(); let op = 1; for (let a = e; a && a.nodeType === 1; a = a.parentElement) op *= +getComputedStyle(a).opacity; return (e.id || e.className || e.tagName) + ' @' + [r.x, r.y, r.width, r.height].map(v => Math.round(v)).join(',') + ' op ' + op.toFixed(3); }) };
});
await look(0, -0.5); await frames(6); await look(0, -0.5); await pic('table-shut');
fs.writeFileSync(OUT + '/census-shut.json', JSON.stringify(await census(), null, 1));
say('vision', JSON.stringify(await p.evaluate(() => window.__enc.kit.vision(true))));
await p.waitForFunction(() => { const v = window.__enc.vision(); return v.on && v.dir === 0; }, null, { timeout: 300000, polling: 300 });
for (const t of [0, -0.9, 0.9]) { await look(t, -0.5); await frames(4); await look(t, -0.5); await pic(`table-open-${t}`); }
fs.writeFileSync(OUT + '/census-open.json', JSON.stringify(await census(), null, 1));
say('errors', errs.length ? errs.join(' / ') : 'none');
await b.close();
