/* v15.2: SKELETONS, COUNTED. Every animated model three.js loads carries
   one Skeleton per SKIN (GLTFLoader) and SkeletonUtils.clone gives every
   cloned mesh a Skeleton of its own, so one person on screen can be several
   skeletons — each updated, each uploaded as its own bone texture every
   frame it is drawn. This groups every skinned mesh in a chapter by the
   armature its bones hang from and reports, per group: meshes, distinct
   Skeleton objects, the bones they reference, how many of those bones are
   referenced by more than one skeleton with DIFFERENT inverse-bind matrices
   (bit for bit), and the size of an exact union by (bone, inverse-bind)
   pair — the number of rows one shared skeleton would need to give every
   mesh exactly the matrices it has now. Then, with her shown in front of
   the lens, the skeleton updates and float bone uploads per drawn frame.
   Usage: [OPT=…] node tools/probes/skins.mjs <chapter…> */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) {
  const ctx = await b.newContext({ viewport: { width: 960, height: 600 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.split('\n')[0]));
  await p.addInitScript(() => {
    const G = WebGL2RenderingContext.prototype, sub = G.texSubImage2D;
    window.__floatUploads = 0;
    G.texSubImage2D = function (...a) { if (a[7] === 0x1406) window.__floatUploads++; return sub.apply(this, a); };
  });
  try {
    await p.goto(PAGE + '?ch=' + ch + (process.env.OPT ? '&opt=' + process.env.OPT : ''), { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await toPlay(p, 900000);
    await p.waitForTimeout(8000);
    const r = await p.evaluate(async () => {
      const E = window.__enc, scene = E.scene;
      const sms = [];
      scene.traverse(o => { if (o.isSkinnedMesh && o.skeleton) sms.push(o); });
      const armOf = (sk) => {                                  // the node the top bone hangs from
        let b = sk.bones.find(Boolean); if (!b) return null;
        while (b.parent && b.parent.isBone) b = b.parent;
        return b.parent || b;
      };
      const topName = (o) => {                                 // the model's name as the chapter placed it
        let q = o, last = o;
        while (q.parent && q.parent !== scene) { last = q; q = q.parent; }
        return (o.name || '') + ' <' + (last.name || last.type) + '>';
      };
      const eq = (a, b) => { for (let i = 0; i < 16; i++) if (!Object.is(a.elements[i], b.elements[i])) return false; return true; };
      const groups = new Map();
      for (const m of sms) {
        const a = armOf(m.skeleton); if (!a) continue;
        if (!groups.has(a)) groups.set(a, { arm: a, meshes: [], sks: new Set() });
        const g = groups.get(a); g.meshes.push(m); g.sks.add(m.skeleton);
      }
      const out = [];
      for (const g of groups.values()) {
        const byBone = new Map(); let pairs = 0;
        for (const sk of g.sks) sk.bones.forEach((bn, i) => {
          if (!bn) return;
          if (!byBone.has(bn)) byBone.set(bn, []);
          const list = byBone.get(bn), ibm = sk.boneInverses[i];
          if (!list.some(x => eq(x, ibm))) { list.push(ibm); pairs++; }
        });
        let conflict = 0; for (const l of byBone.values()) if (l.length > 1) conflict++;
        const rows = [...g.sks].reduce((s, sk) => s + sk.bones.length, 0);
        out.push({ name: topName(g.arm), meshes: g.meshes.length, skeletons: g.sks.size, rows,
                   bones: byBone.size, bonesWithDifferentIBM: conflict, exactUnionRows: pairs,
                   visible: g.meshes.some(m => { for (let q = m; q; q = q.parent) if (!q.visible) return false; return true; }) });
      }
      /* collapse identical clones (the same model placed many times) */
      const agg = new Map();
      for (const o of out) {
        const k = [o.name.replace(/\d+/g, '#'), o.meshes, o.skeletons, o.rows, o.bones, o.bonesWithDifferentIBM, o.exactUnionRows].join('|');
        if (!agg.has(k)) agg.set(k, { ...o, copies: 0, visibleCopies: 0 });
        const a = agg.get(k); a.copies++; if (o.visible) a.visibleCopies++;
      }
      /* per drawn frame: skeleton updates and bone uploads, with her shown */
      const Sk = sms.length ? Object.getPrototypeOf(sms[0].skeleton) : null;
      let calls = 0; const orig = Sk && Sk.update;
      if (Sk) Sk.update = function () { calls++; return orig.apply(this, arguments); };
      const ghostShown = !!(E.ghost && E.ghost.children.length > 1);
      if (ghostShown) {
        /* the game writes her visibility every frame; hold it on for the count */
        Object.defineProperty(E.ghost, 'visible', { get: () => true, set: () => {}, configurable: true });
        E.ghost.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.opacity = 1; }); });
        const yaw = E.yaw; const fwd = { x: -Math.sin(yaw.rotation.y), z: -Math.cos(yaw.rotation.y) };
        E.ghost.position.set(yaw.position.x + fwd.x * 3, 0, yaw.position.z + fwd.z * 3);
      }
      const R = E.renderer, f0 = R.info.render.frame, u0 = window.__floatUploads, c0 = calls;
      await new Promise(res => { let n = 0; const step = () => (++n >= 30 ? res() : requestAnimationFrame(step)); requestAnimationFrame(step); });
      const frames = Math.max(1, R.info.render.frame - f0);
      if (Sk) Sk.update = orig;
      return { skinned: sms.length, groups: [...agg.values()],
               perFrame: { skeletonUpdates: +((calls - c0) / frames).toFixed(1), floatUploads: +((window.__floatUploads - u0) / frames).toFixed(1), frames } };
    });
    console.log(`== ${ch}${process.env.OPT ? ' [' + process.env.OPT + ']' : ''}: ${r.skinned} skinned meshes; per drawn frame ${JSON.stringify(r.perFrame)}`);
    for (const g of r.groups.sort((a, b) => b.skeletons * b.copies - a.skeletons * a.copies))
      console.log(`  ${g.copies}x ${g.name.slice(0, 60)}: ${g.meshes} meshes, ${g.skeletons} skeletons (${g.rows} rows), ` +
                  `${g.bones} bones, ${g.bonesWithDifferentIBM} with different IBMs, exact union ${g.exactUnionRows} rows` +
                  (g.visibleCopies < g.copies ? `, ${g.visibleCopies} shown` : ''));
    if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  } catch (e) { console.log(ch + ': PROBE FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
await b.close();
