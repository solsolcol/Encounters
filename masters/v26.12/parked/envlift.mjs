/* v26.12 · THE ROOM'S REFLECTION AS A LIFT, PROVED (docs/OPEN-ITEMS.md A6). Since v26.12 episode 3's images, trays and
   a few pieces take their share of the room's reflection as a lift on the scene's own environment (each chapter's
   envLift), where they had an envMap of their own, which kept the dead texture after a phone lost its graphics. For each
   chapter named, with the engine's loop held, every material the chapter lifted (userData.envLift) is drawn ALONE (one
   of its meshes, on a layer of its own with the scene's lights, the lens put to fit it from the side the player starts
   on), and:
   1. THE SAME FRAME BOTH WAYS: drawn as built, then with the material switched to the other way (its own envMap at the
      strength absolute, or back to the lift), every pixel compared: none may differ;
   2. THE LOST CONTEXT: every such frame drawn, the graphics context lost and given back (the engine draws the room's
      environment again, main.js roomEnvAgain), drawn again and compared. With the lift none may differ; in a second
      page with ?opt=envLift:0 (the old way) the pieces' pixels differ: what the fix guards.
   Usage: node tools/probes/envlift.mjs e3c1 e3c2 ...   (OUT=<dir>: a picture of each piece after the restore, both ways;
   MODES=lift or MODES=old for one page only) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const OUT = process.env.OUT || '';
const MODES = (process.env.MODES || 'lift,old').split(',');
const W = 1280, H = 800;
if (OUT) fs.mkdirSync(OUT, { recursive: true });

function png(file, w, h, rgba) {                      // readPixels is bottom-up: flip, then a plain RGBA PNG
  const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b) => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]);
                            const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + (h - 1 - y) * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}

const b = await chromium.launch(LAUNCH);
let bad = 0;
for (const ch of chs) for (const mode of MODES) {
  const ctx = await b.newContext({ viewport: { width: W, height: H } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {           // a rAF that can be held, so the world stands still
    const raf = window.requestAnimationFrame.bind(window), held = [];
    window.__hold = false;
    window.requestAnimationFrame = (f) => window.__hold ? (held.push(f), 0) : raf(f);
    window.__release = () => { window.__hold = false; const h = held.splice(0); for (const f of h) raf(f); };
  });
  try {
    await p.goto(PAGE + '?ch=' + ch + (mode === 'old' ? '&opt=envLift:0' : ''), { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await toPlay(p, 900000);
    /* the lifted pieces land as their files do: wait until their number has held still for two looks */
    let last = -1, same = 0;
    for (let i = 0; i < 40 && same < 2; i++) {
      await p.waitForTimeout(5000);
      const n = await p.evaluate(() => { const s = new Set(); window.__enc.scene.traverse(o => { if (!o.isMesh) return;
        for (const m of [].concat(o.material)) if (m && m.userData && m.userData.envLift !== undefined) s.add(m.uuid); }); return s.size; });
      same = n === last && n > 0 ? same + 1 : 0; last = n;
    }
    const r = await p.evaluate(async ({ mode }) => {
      const E = window.__enc, R = E.renderer, gl = R.getContext(), S = E.scene;
      window.__hold = true;
      await new Promise(res => setTimeout(res, 400));      // the loop has stopped asking for frames
      const LAYER = 31, cam = new E.camera.constructor().copy(E.camera, false);   // a lens of the probe's own, on that layer alone
      cam.layers.set(LAYER); cam.aspect = gl.drawingBufferWidth / gl.drawingBufferHeight; cam.updateProjectionMatrix();
      S.traverse(o => { if (o.isLight) o.layers.enable(LAYER); });
      const start = E.camera.getWorldPosition(E.camera.position.clone());
      /* one mesh a lifted material (its biggest), and where to look at it from */
      const byMat = new Map();
      S.updateMatrixWorld(true);
      S.traverse(o => {
        if (!o.isMesh) return;
        for (const m of [].concat(o.material)) {
          if (!m || !m.userData || m.userData.envLift === undefined) continue;
          if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
          if (o.isInstancedMesh && !o.boundingSphere) o.computeBoundingSphere();
          const sph = (o.isInstancedMesh ? o.boundingSphere : o.geometry.boundingSphere).clone().applyMatrix4(o.matrixWorld);
          const was = byMat.get(m);
          if (!was || sph.radius > was.sph.radius) byMat.set(m, { mesh: o, sph });
        }
      });
      const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
      const views = [...byMat.entries()].map(([m, v]) => ({ m, ...v }));
      const draw = (v, alone = true) => {               // alone false: the same lens with the piece off (what it covers)
        const hidden = [];                                  // every ancestor drawn (an LOD level the player's lens hid)
        for (let a = v.mesh; a; a = a.parent) if (!a.visible) { hidden.push(a); a.visible = true; }
        if (alone) v.mesh.layers.enable(LAYER);
        const c = v.sph.center, dir = start.clone().sub(c); dir.y = Math.max(dir.y, 0.2 * dir.length());
        if (dir.lengthSq() < 1e-6) dir.set(0, 0.3, 1);
        dir.normalize();
        const dist = Math.max(v.sph.radius / Math.sin((cam.fov * Math.PI / 180) / 2) * 1.15, cam.near * 4);
        cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c); cam.updateMatrixWorld(true);
        R.shadowMap.needsUpdate = true;
        R.render(S, cam);
        const px = new Uint8Array(W * H * 4);
        gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
        v.mesh.layers.disable(LAYER);
        for (const a of hidden) a.visible = false;
        return px;
      };
      const cmp = (a, b, base) => { let diff = 0, maxd = 0, cover = 0;
        for (let i = 0; i < a.length; i += 4) {
          if (base && (a[i] !== base[i] || a[i + 1] !== base[i + 1] || a[i + 2] !== base[i + 2])) cover++;
          const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
          if (d) { diff++; if (d > maxd) maxd = d; } }
        return { diff, maxd, cover }; };
      const env = S.environment, k0 = S.environmentIntensity;
      const lifted = (m) => m.envMap === null;
      const flip = (m) => { const k = m.userData.envLift;
        if (lifted(m)) { m.envMap = env; m.envMapIntensity = k; } else { m.envMap = null; m.envMapIntensity = k / k0; } };
      const out = [];
      for (const v of views) {
        const bg = draw(v, false), a = draw(v); flip(v.m); const b2 = draw(v); flip(v.m);
        const c = cmp(a, b2, bg);
        out.push({ name: (v.mesh.name || v.m.name || v.m.uuid.slice(0, 8)), k: v.m.userData.envLift, built: lifted(v.m) ? 'lift' : 'own envMap',
                   uniformLift: Math.fround(k0 * (v.m.userData.envLift / k0)) === Math.fround(v.m.userData.envLift),
                   cover: c.cover, bothWays: c.diff, maxd: c.maxd });
      }
      const before = views.map(v => draw(v)), bgs = views.map(v => draw(v, false));
      const ext = gl.getExtension('WEBGL_lose_context');
      const lost = new Promise(res => R.domElement.addEventListener('webglcontextlost', res, { once: true }));
      ext.loseContext(); await lost;
      const back = new Promise(res => R.domElement.addEventListener('webglcontextrestored', res, { once: true }));
      ext.restoreContext(); await back;
      await new Promise(res => setTimeout(res, 100));
      const pics = [];
      views.forEach((v, i) => { const after = draw(v); const c = cmp(before[i], after, bgs[i]); out[i].afterRestore = c.diff; out[i].afterMax = c.maxd;
        if (i < 6) pics.push(Array.from(after)); });
      window.__release();
      return { W, H, out, pics };
    }, { mode });
    const tag = mode === 'lift' ? 'THE LIFT (as built)    ' : 'THE OLD WAY (envLift:0)';
    console.log(`${ch} ${tag}: ${r.out.length} lifted materials` + (errs.length ? '  PAGE ERRORS ' + errs.slice(0, 2).join(' | ') : ''));
    for (const o of r.out) {
      console.log(`   ${o.name.padEnd(28).slice(0, 28)} k ${String(o.k).padEnd(5)} drawn ${o.built.padEnd(10)} on ${String(o.cover).padStart(7)} px:` +
                  ` both ways ${o.bothWays} differ, after the restore ${o.afterRestore} differ (max ${o.afterMax}/255)` + (o.uniformLift ? '' : '  UNIFORM NOT EXACT'));
      if (mode === 'lift' && (o.bothWays || o.afterRestore || !o.uniformLift || !o.cover)) bad++;
    }
    if (mode === 'lift' && !r.out.length) bad++;
    if (OUT) r.pics.forEach((px, i) => png(`${OUT}/${ch}-${mode}-${i}.png`, r.W, r.H, Uint8Array.from(px)));
  } catch (e) { console.log(ch + ' ' + mode + ': PROBE FAILED ' + e.message.split('\n')[0]); bad++; }
  await ctx.close();
}
await b.close();
console.log(bad ? `NOT PROVED: ${bad} failing` : 'PROVED: every lifted piece the same both ways, and the same after a lost context');
process.exit(bad ? 1 : 0);
