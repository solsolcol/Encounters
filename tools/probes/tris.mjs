/* v15: WHAT is drawn per frame, by subtree: frustum-cull the scene exactly as three
   does (visible chain, frustumCulled, sphere vs frustum) and sum triangles/instances
   per top-level group — during PLAY, at the spawn, looking four ways. */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  p.setDefaultNavigationTimeout(240000);
  try {
    await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load' });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 300000 }); await toPlay(p, 900000);
    await p.waitForTimeout(3000);
    const r = await p.evaluate(() => {
      const E = window.__enc, THREE = window.THREE || null;
      const scene = E.scene, cam = E.yaw.children.length ? null : null;
      // the camera: find the PerspectiveCamera under yaw/pitch
      let camera = null; E.yaw.traverse(o => { if (o.isPerspectiveCamera && !camera) camera = o; });
      const out = [];
      const base = E.yaw.rotation.y;
      for (let q = 0; q < 4; q++) {
        E.yaw.rotation.y = base + q * Math.PI / 2; E.yaw.updateMatrixWorld(true); scene.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        const M = new camera.projectionMatrix.constructor().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        const F = new (Object.getPrototypeOf(camera).constructor.prototype.constructor === undefined ? Object : Object)();
        // build a frustum by hand (planes from the matrix), same as THREE.Frustum.setFromProjectionMatrix
        const me = M.elements, planes = [];
        const pl = (a, b2, c, d) => { const l = Math.hypot(a, b2, c); planes.push([a / l, b2 / l, c / l, d / l]); };
        pl(me[3] - me[0], me[7] - me[4], me[11] - me[8], me[15] - me[12]); pl(me[3] + me[0], me[7] + me[4], me[11] + me[8], me[15] + me[12]);
        pl(me[3] + me[1], me[7] + me[5], me[11] + me[9], me[15] + me[13]); pl(me[3] - me[1], me[7] - me[5], me[11] - me[9], me[15] - me[13]);
        pl(me[3] - me[2], me[7] - me[6], me[11] - me[10], me[15] - me[14]); pl(me[3] + me[2], me[7] + me[6], me[11] + me[10], me[15] + me[14]);
        const inF = (c, rad) => planes.every(([a, b2, cc, d]) => a * c.x + b2 * c.y + cc * c.z + d >= -rad);
        const groups = {};
        const top = o => { let q2 = o; while (q2.parent && q2.parent.parent && q2.parent.parent !== scene) q2 = q2.parent; return q2; };
        const label = o => { const t = top(o); let nm = t.name; if (!nm) { let q3 = o; while (q3 && q3 !== t && !q3.name) q3 = q3.parent; nm = (q3 && q3.name) || ''; } return (nm || t.type) + '#' + t.id + (o.isInstancedMesh ? '[inst]' : ''); };
        const walk = (o) => {
          if (!o.visible) return;
          if ((o.isMesh || o.isPoints || o.isLine || o.isSprite) && o.geometry) {
            let ok = true;
            if (o.frustumCulled) {
              const g = o.geometry; if (!o.isInstancedMesh && !g.boundingSphere) g.computeBoundingSphere();
              const s = (o.isSkinnedMesh && o.boundingSphere) ? o.boundingSphere : (o.isInstancedMesh ? (o.boundingSphere || (o.computeBoundingSphere(), o.boundingSphere)) : g.boundingSphere);
              if (s) { const c = s.center.clone().applyMatrix4(o.matrixWorld); const sc = o.matrixWorld.getMaxScaleOnAxis(); ok = inF(c, s.radius * sc); }
            }
            if (ok) {
              const idx = o.geometry.index ? o.geometry.index.count : (o.geometry.attributes.position ? o.geometry.attributes.position.count : 0);
              const inst = o.isInstancedMesh ? o.count : 1;
              const tris = (o.isMesh ? idx / 3 : 0) * inst;
              const k = label(o); const G = groups[k] || (groups[k] = { calls: 0, tris: 0, skinned: 0, pos: null });
              G.calls++; G.tris += tris; if (o.isSkinnedMesh) G.skinned++;
              if (!G.pos) { const w = top(o).getWorldPosition(new camera.position.constructor()); G.pos = [+w.x.toFixed(1), +w.y.toFixed(1), +w.z.toFixed(1)]; }
            }
          }
          for (const c of o.children) walk(c);
        };
        walk(scene);
        const tot = Object.values(groups).reduce((a, g) => a + g.tris, 0);
        out.push({ dir: q, tot: Math.round(tot), top: Object.entries(groups).sort((a, b) => b[1].tris - a[1].tris).slice(0, 10).map(([k, g]) => `${k} ${Math.round(g.tris / 1000)}k tris/${g.calls} calls${g.skinned ? ' ' + g.skinned + ' skinned' : ''} at ${g.pos}`) });
      }
      E.yaw.rotation.y = base;
      return { cam: [E.yaw.position.x, E.yaw.position.z].map(v => +v.toFixed(1)), out };
    });
    console.log(`== ${ch} (player at ${r.cam})`);
    for (const d of r.out) console.log(`  look ${d.dir * 90}deg: ${Math.round(d.tot / 1000)}k tris\n     ` + d.top.join('\n     '));
  } catch (e) { console.log(ch + ': FAILED ' + e.message.split('\n')[0]); }
  await p.context().close();
}
await b.close();
