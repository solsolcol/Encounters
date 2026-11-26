/* v28.0 (R187, ch4 R146) · SPIRIT VISION'S GLOW COPIES (ctx.spiritAura's twins) read in chapter 4: for every twin, its
   source (the mesh beside it that shares its geometry), the two's scale and visibility, and the twin's size in the world,
   so a copy made before its source was laid out (a picture's plane at 1 x 1 m before its texture landed) is seen by number.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [VIEW=desk|phone] node tools/probes/e4c4twins.mjs   (through bslot) */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'desk';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(VIEW === 'phone' ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
/* DELAY=ms: the three pictures on her altar held back that long, so the altar's model is in before they are (the order a
   fast machine can land them in): the glow's copies are then made while each picture is still an unlaid 1 x 1 m plane */
const DELAY = +(process.env.DELAY || 0), OUT = process.env.OUT || '/tmp/e4c4twins';
if (DELAY) await p.route(/\/assets\/w4t_(kali|ganesha|murugan)\./, async (r) => { await new Promise(z => setTimeout(z, DELAY)); await r.continue(); });
await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(15000);
const r = await p.evaluate(() => {
  const E = window.__enc; let scene = null; for (let o = E.yaw; o; o = o.parent) scene = o;
  const out = [], V = (v) => [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)];
  scene.traverse(t => { if (!t.isMesh || !t.userData.__svTwin) return;
    const src = (t.parent && t.parent.isMesh && t.parent.geometry === t.geometry ? t.parent : null) || (t.parent ? t.parent.children : []).find(s => s !== t && s.isMesh && s.geometry === t.geometry && !s.userData.__svTwin) || null;
    t.updateWorldMatrix(true, false); const bb = new t.position.constructor(); t.geometry.computeBoundingBox && t.geometry.computeBoundingBox();
    const s = t.geometry.boundingBox ? t.geometry.boundingBox.getSize(bb) : null; const ws = new t.position.constructor(); t.getWorldScale(ws);
    const sw = new t.position.constructor(); if (src) { src.updateWorldMatrix(true, false); src.getWorldScale(sw); }
    out.push({ geo: t.geometry.type, verts: t.geometry.attributes.position.count, child: !!(src && t.parent === src), twinScale: V(ws), srcScale: src ? V(sw) : null, srcVisible: src ? src.visible : null,
      worldSize: s ? [+(s.x * ws.x).toFixed(3), +(s.y * ws.y).toFixed(3), +(s.z * ws.z).toFixed(3)] : null, skinned: !!t.isSkinnedMesh }); });
  return out;
});
const planes = r.filter(q => q.geo === 'PlaneGeometry');
console.log('TWINS', r.length, 'planes', planes.length);
for (const q of planes) console.log('PLANE', JSON.stringify(q));
console.log('MISMATCH', JSON.stringify(r.filter(q => q.srcScale && q.srcScale.join() !== q.twinScale.join())));
/* and the altar seen through the vision, held wide open (visionlab's view of it) */
await p.evaluate(() => { const E = window.__enc; E.yaw.position.set(-0.15, 1.6, 2.6); E.yaw.rotation.y = Math.PI; E.pitch.rotation.x = -4 * Math.PI / 180; E.kit.vision(true); });
await p.waitForTimeout(1500);
await p.evaluate(() => window.__enc.kit.vision({ r: 70, moving: false }));
await p.waitForTimeout(5000);
await p.screenshot({ path: OUT + '-' + VIEW + (DELAY ? '-delayed' : '') + '.png' });
console.log('picture', OUT + '-' + VIEW + (DELAY ? '-delayed' : '') + '.png');
console.log('errors', JSON.stringify(errs));
await b.close();
