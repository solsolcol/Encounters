/* v27.0 · THE SPIRIT ON HER BACK, placed by sight: the chapter booted, his hands hidden, a bookmark applied (or none),
   then for each variant the spirit's group set where the variant says (x y z, its turn and its tilt about its own chest)
   and photographed from four sides at a phone's real size drawn at two pixels a point, in the vision and out of it; the
   bones that must meet printed beside (its hands against her chest, its head against hers).
     CHROMIUM_PATH=... VARS='name:x,y,z,ry,rx;...' [VIS=1] [VIEWS as chshots] [OUT=dir] node tools/probes/spiritlab.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/spiritlab'; fs.mkdirSync(OUT, { recursive: true });
const KEY = process.env.KEY || 'p4oppress';
const VARS = (process.env.VARS || 'now:-0.15,0.62,3.65,0,0').split(';').map(s => { const [n, v] = s.split(':'); const a = v.split(',').map(Number); return { n, x: a[0], y: a[1], z: a[2], ry: a[3] || 0, rx: a[4] || 0 }; });
const VIEWS = (process.env.VIEWS || 'front:-0.10,1.25,5.35,0,-10,50;right:-1.55,1.20,3.70,-90,-8,50;back:-0.15,1.35,2.25,180,-10,50;q34:0.95,1.30,4.75,45,-12,50')
  .split(';').map(s => { const p = s.split(':'), a = p[1].split(',').map(Number); return { n: p[0], x: a[0], y: a[1], z: a[2], yaw: a[3], pitch: a[4], fov: a[5] || 72 }; });
const VIS = process.env.VIS !== '0';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(PAGE + '?ch=' + (process.env.CH || 'e4c4'), { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
if (process.env.PHASE) { await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE);
  await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 300 }); }
await p.waitForFunction((k) => { const P = window.__enc.stage.person(k); const A = window.__enc.stage.person('p4amma'); return P && P.ready && A && A.ready; }, KEY, { timeout: 600000, polling: 500 });
await p.addStyleTag({ content: '#hud, #objective, #reticle, .hudel, #hotmarks, #visionBtn { opacity: 0 !important; }' });
const frames = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
for (const on of (VIS ? [true, false] : [false])) {
  await p.evaluate((on) => window.__enc.kit.vision(on), on);
  await p.waitForFunction((on) => { const v = window.__enc.kit.vision(); return v && v.dir === 0 && (on ? v.on : !v.on && v.r === 0); }, on, { timeout: 240000, polling: 200 });
  for (const V of VARS) {
    const m = await p.evaluate(({ V, K }) => { const E = window.__enc, S = E.stage, P = S.person(K), A = S.person('p4amma');
      const g = P.group; g.position.set(V.x, V.y, V.z); g.rotation.set(V.rx, V.ry, 0, 'YXZ'); g.updateWorldMatrix(true, true);
      const W = (Q, n) => { const bn = Q.bone[n]; if (!bn) return null; const v = bn.getWorldPosition(g.position.clone()); return [v.x, v.y, v.z].map(x => +x.toFixed(3)); };
      return { head: W(P, 'Head'), lh: W(P, 'LeftHand'), rh: W(P, 'RightHand'), hips: W(P, 'Hips'), chest: W(P, 'Spine'), herHead: W(A, 'Head'), herChest: W(A, 'Spine'), herL: W(A, 'LeftArm'), herR: W(A, 'RightArm') }; }, { V, K: KEY });
    if (on) console.log(V.n, JSON.stringify(m));
    for (const C of VIEWS) {
      /* (his hands' scene emptied of all but its lights; the eye's height held where the view asks by the kit's own
         lying pose, its turn left free, since standing play puts the eye back at 1.62 every frame) */
      await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; const hs = E.handsRoot; hs.visible = false; if (hs.parent) hs.parent.visible = false; window.__vmDbg = window.__vmDbg || (hs.parent ? hs.parent.children.map(c => (c.type + ":" + (c.name || "") + ":" + c.visible)).join(" | ") : "no parent");
        E.kit.pose('lying', { y: v.y, yaw: v.yaw * d, span: Math.PI, pitchLo: -1.565, pitchHi: 1.565, secs: 0.05 });
        E.yaw.position.set(v.x, v.y, v.z); E.yaw.rotation.y = v.yaw * d; E.pitch.rotation.x = v.pitch * d;
        const cam = E.pitch.children.find(o => o.isCamera); if (cam && Math.abs(cam.fov - v.fov) > 1e-3) { cam.fov = v.fov; cam.updateProjectionMatrix(); } }, C);
      await frames(4); await p.waitForTimeout(400); await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; E.yaw.position.set(v.x, v.y, v.z); E.yaw.rotation.y = v.yaw * d; E.pitch.rotation.x = v.pitch * d; }, C); await frames(3);
      await p.screenshot({ path: `${OUT}/${V.n}-${C.n}${on ? '' : '-plain'}.jpg`, quality: 92 });
    }
  }
}
console.log('vmScene', await p.evaluate(() => window.__vmDbg || ''));
console.log('errors', errs.length, errs.slice(0, 3).join(' | '));
await b.close();
