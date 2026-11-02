// v24.36 · THE SAMNAK'S CABINETS, PHOTOGRAPHED AND PRICED (Chad, 2 Nov 2026: "in the ajahn samnak, the amulet display
// shelf can have real amulets instead of generated ones, but it should look more like the yin, barang, ghost based kind
// of amulets"). Episode 4 chapter 1's receiving room in play (the consultation): each glass cabinet seen from where he
// kneels, from 0.9 m and from its glass, on a phone (390x844 touch, DPR 2, the LOW path) and a desktop (1280x720), the
// world alone (no hands). Before each picture the chapter's own frame runs once with the lens where it stands
// (stage.updateNotes -> roomFrame -> stockLod), so the stock's levels are this lens's; then one render of the world,
// its triangles and draw calls (renderer.info) — the view's price. Page errors and the console are captured; the run
// exits non-zero on any, and on a view whose cabinets show no modelled stock.
//   ENC_DIST=<snap> CHROMIUM_PATH=... [VIEW=phone|desktop|both] node tools/probes/cabinets.mjs <outdir>
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
const req = createRequire(new URL('../../package.json', import.meta.url).pathname);
const PW = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = PW.chromium || (PW.default && PW.default.chromium);
const { LAUNCH, PAGE, toPlay } = await import(new URL('../../testlib.mjs', import.meta.url).href);
const OUT = process.argv[2] || 'cabinets'; fs.mkdirSync(OUT, { recursive: true });
const VIEW = process.env.VIEW || 'both';
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const DEV = { phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
              desktop: { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 } };
/* the room's own numbers (e4c1: RM, the two cabinets' walls and ends, their glass 0.42 m off the wall) */
const CAB = { L: { wall: -2.7, side: -1, zc: (-2.5 - 1.15) / 2 }, R: { wall: 2.7, side: 1, zc: (-1.6 - 0.45) / 2 } };
const b = await chromium.launch(LAUNCH);
let bad = 0;
const report = {};
for (const dev of (VIEW === 'both' ? ['phone', 'desktop'] : [VIEW])) {
  const ctx = await b.newContext(DEV[dev]);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || /failed to load|failed/.test(m.text())) errs.push('console ' + m.text().slice(0, 200)); });
  await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  await toPlay(p, 1500000);
  await p.waitForFunction(() => window.__enc.loads().pending === 0, null, { timeout: 600000, polling: 500 });
  await p.evaluate(() => window.__enc.stage.applyPhase('consult'));
  await p.waitForFunction(() => window.__enc.getState() === 'play' && window.__enc.stage.info().world === 'R', null, { timeout: 900000, polling: 500 });
  await p.waitForFunction(() => window.__enc.kit.getFade() < 0.02, null, { timeout: 900000, polling: 500 });
  await p.waitForFunction(() => window.__enc.loads().pending === 0, null, { timeout: 600000, polling: 500 });
  /* every cabinet piece standing: the room's stock (manyOf's InstancedMeshes, named stock:<key>) counted by kind */
  await p.waitForFunction(() => { const n = new Set(); window.__enc.stage.film.worldR.traverse(o => { if (o.isInstancedMesh && /^stock:/.test(o.name)) n.add(o.name); }); return n.size >= 7; }, null, { timeout: 300000, polling: 1000 }).catch(() => {});
  const RX = await p.evaluate(() => window.__enc.stage.film.RX);
  const mat = await p.evaluate(() => { const v = window.__enc.yaw.position; return [v.x, v.y, v.z]; });
  log(dev, 'in the room at', mat.map(v => v.toFixed(2)).join(','), 'RX', RX);
  const views = [];
  for (const [k, c] of Object.entries(CAB)) {
    const glass = c.wall - c.side * 0.42, at = [RX + c.wall - c.side * 0.2, 1.22, c.zc];
    views.push([k + '-mat', [mat[0], mat[1], mat[2]], at, null]);
    views.push([k + '-0.9m', [RX + glass - c.side * 0.9, 1.5, c.zc], at, null]);
    views.push([k + '-glass', [RX + glass - c.side * 0.45, 1.45, c.zc], [at[0], 1.2, c.zc], null]);
  }
  report[dev] = [];
  for (const [tag, from, to, fov] of views) {
    const r = await p.evaluate(([from, to, fov]) => {
      const E = window.__enc, dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
      E.yaw.position.set(from[0], from[1], from[2]); E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
      const f0 = E.camera.fov; if (fov) { E.camera.fov = fov; E.camera.updateProjectionMatrix(); }
      E.yaw.updateMatrixWorld(true); E.stage.updateNotes(1 / 60, 0);
      E.renderer.render(E.scene, E.camera);
      const i = E.renderer.info.render, url = E.renderer.domElement.toDataURL('image/png'), tris = i.triangles, calls = i.calls;
      const lv = [], st = []; E.stage.film.worldR.traverse(o => { if (o.isInstancedMesh && /^stock:/.test(o.name) && o.visible) { lv.push(o.name + ':' + o.count); st.push(o); } });
      /* (v24.36) the same view drawn again with the modelled stock hidden: what the stock itself costs this view */
      st.forEach(o => { o.visible = false; }); E.renderer.render(E.scene, E.camera);
      const bare = { tris: E.renderer.info.render.triangles, calls: E.renderer.info.render.calls };
      st.forEach(o => { o.visible = true; });
      if (fov) { E.camera.fov = f0; E.camera.updateProjectionMatrix(); }
      return { url, tris, calls, stock: lv, bare };
    }, [from, to, fov]);
    fs.writeFileSync(`${OUT}/${dev}-${tag}.png`, Buffer.from(r.url.split(',')[1], 'base64'));
    report[dev].push({ view: tag, tris: r.tris, calls: r.calls, stockDrawn: r.stock.length, withoutStock: r.bare });
    log(dev, tag, 'triangles', r.tris, 'calls', r.calls, 'stock meshes drawn', r.stock.length, '| without the stock', r.bare.tris, 'calls', r.bare.calls);
    if (!r.stock.length) { bad++; log('  NO MODELLED STOCK drawn in', tag); }
  }
  if (errs.length) { bad += errs.length; log(dev, 'ERRORS', errs); }
  await ctx.close();
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
await b.close();
log(bad ? 'FAIL ' + bad : 'ok');
process.exit(bad ? 1 : 0);
