/* v28.0 · WHERE THE CARRIED THINGS ARE IN EPISODE 4 CHAPTER 5'S OPENING FILM (M9, 21 Nov 2026: Ton's wrapped staff and
   Jun's duffel were not seen in the film's photographs). The chapter started from its own ?ch=, the film sought to each
   moment, and for each named thing: whether it and every parent is visible, its parent, its world box, and its meshes.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [TS=24.5,27.5] [NAMES=staffWrap,duffel] node tools/probes/e4c5carry.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const TS = (process.env.TS || '24.5,27.5').split(',').map(Number), NAMES = (process.env.NAMES || 'staffWrap,duffel').split(',');
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ' ' + m.text().slice(0, 200)); });
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.3, null, { timeout: 1500000, polling: 500 });
for (const t of TS) {
  await p.evaluate((t) => window.__enc.cine.seek(t), t);
  await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
  const rep = await p.evaluate((names) => { const E = window.__enc, out = {};
    for (const nm of names) { const g = E.scene.getObjectByName(nm); if (!g) { out[nm] = 'NOT FOUND'; continue; }
      g.updateWorldMatrix(true, true); let vis = true, chain = []; for (let q = g; q; q = q.parent) { if (!q.visible) vis = false; chain.push((q.name || q.type) + (q.visible ? '' : '(hidden)')); }
      const bb = new (E.scene.position.constructor === undefined ? Object : Object)(); let n = 0, tris = 0; const box = { min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] };
      g.traverse(m => { if (!m.isMesh) return; n++; tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3;
        m.geometry.computeBoundingBox(); const bx = m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld);
        for (let i = 0; i < 3; i++) { box.min[i] = Math.min(box.min[i], bx.min.getComponent(i)); box.max[i] = Math.max(box.max[i], bx.max.getComponent(i)); } });
      const wp = g.getWorldPosition(E.camera.position.clone());
      out[nm] = { visible: vis, chain: chain.slice(0, 5).join(' < '), meshes: n, tris: Math.round(tris), at: [wp.x, wp.y, wp.z].map(v => +v.toFixed(2)), box: n ? { min: box.min.map(v => +v.toFixed(2)), max: box.max.map(v => +v.toFixed(2)) } : null,
        scale: [g.scale.x, g.scale.y, g.scale.z].map(v => +v.toFixed(3)), model: !!g.userData.model }; }
    const cam = E.camera.getWorldPosition(E.camera.position.clone()); out.camera = [cam.x, cam.y, cam.z].map(v => +v.toFixed(2));
    return out; }, NAMES);
  console.log('t', t, JSON.stringify(rep, null, 1));
}
console.log('errs', JSON.stringify(errs.slice(0, 12)));
await b.close();
