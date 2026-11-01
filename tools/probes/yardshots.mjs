// Read-only probe: episode 4 chapter 1's yard vehicles and trees on a PHONE (390x844 CSS, touch, DPR 2 -> the engine's LOW
// pixel ratio 1.6, antialias off, no shadows), from where a player stands. Optional runtime A/B variants (no file touched):
//   VARIANT=asis (default) | nonormal | aniso | nometal | nomip | all
// ENC_DIST=<snapshot> CHROMIUM_PATH=... [VARIANT=..] [ONLY=tag,tag] node tools/probes/yardshots.mjs <outdir>
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
const req = createRequire(new URL('../../package.json', import.meta.url).pathname);
const PW = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = PW.chromium || (PW.default && PW.default.chromium);
const { LAUNCH, PAGE, toPlay } = await import(new URL('../../testlib.mjs', import.meta.url).href);
const VARIANTS = (process.env.VARIANT || 'asis').split(',');
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const OUT = process.argv[2] || 'yardshots';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|warn/i.test(m.type() + m.text())) errs.push('CONSOLE ' + m.type() + ' ' + m.text().slice(0, 160)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
console.log(el(), 'play');
await p.waitForFunction(() => window.__enc.loads().pending === 0, null, { timeout: 600000, polling: 500 });
await p.waitForTimeout(6000);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
if (process.env.GLASS) console.log(el(), 'GLASS', JSON.stringify(await p.evaluate(() => {
  const out = []; let pk = null;
  window.__enc.scene.traverse(o => { if (!o.isMesh) return; for (const m of [].concat(o.material)) if (m && /^window_glass|SF_glass/.test(m.name || '')) {
    let vis = true; for (let q = o; q; q = q.parent) if (!q.visible) { vis = false; break; }
    o.updateWorldMatrix(true, false); const e = o.matrixWorld.elements;
    out.push({ mat: m.name, self: o.visible, drawn: vis, opacity: +m.opacity.toFixed(3), transparent: m.transparent, color: m.color.getHexString(), side: m.side, verts: o.geometry.attributes.position.count, at: [e[12], e[13], e[14]].map(v => +v.toFixed(2)) }); } });
  return out;
})));
// the renderer's own state, and the Meshy / tree materials as drawn
const info = await p.evaluate(() => {
  const E = window.__enc, R = E.renderer, out = { pr: R.getPixelRatio(), size: [R.domElement.width, R.domElement.height], maxAniso: R.capabilities.getMaxAnisotropy(),
    envI: E.scene.environmentIntensity, tone: R.toneMapping, exp: R.toneMappingExposure, mats: {} };
  E.scene.traverse(o => {
    if (!o.isMesh) return;
    const n = o.geometry.attributes.position.count;
    for (const m of [].concat(o.material)) {
      if (!m) continue;
      const key = (m.name || '?') + '#' + n + (o.isInstancedMesh ? 'I' + o.count : '');
      if (out.mats[key]) continue;
      if (!/BakedMaterial|frond|Banana|Bark|bark|Fan/.test(m.name || '')) continue;
      const t = (x) => x ? { aniso: x.anisotropy, min: x.minFilter, mip: x.generateMipmaps, cs: x.colorSpace, w: x.image && x.image.width } : null;
      out.mats[key] = { type: m.type, metal: m.metalness, rough: m.roughness, envI: m.envMapIntensity, side: m.side, alphaTest: m.alphaTest, transparent: m.transparent,
        map: t(m.map), normalMap: t(m.normalMap), nScale: m.normalScale && m.normalScale.x, mr: t(m.metalnessMap), tangents: !!o.geometry.attributes.tangent, vis: o.visible };
    }
  });
  return out;
});
console.log(el(), 'INFO', JSON.stringify(info));
async function variant(v) {
  return p.evaluate((v) => {
    const E = window.__enc, R = E.renderer, A = R.capabilities.getMaxAnisotropy(); let n = 0;
    E.scene.traverse(o => {
      if (!o.isMesh) return;
      for (const m of [].concat(o.material)) {
        if (!m || !/BakedMaterial|frond|Banana|Bark|bark|Fan/.test(m.name || '')) continue;
        if (!m.__orig) m.__orig = { normalMap: m.normalMap, metalnessMap: m.metalnessMap, metalness: m.metalness, maps: [m.map, m.normalMap, m.metalnessMap].filter(Boolean).map(t => [t, t.anisotropy, t.minFilter, t.generateMipmaps]) };
        const O = m.__orig;
        // reset
        m.normalMap = O.normalMap; m.metalnessMap = O.metalnessMap; m.metalness = O.metalness;
        for (const [t, a, mf, gm] of O.maps) { if (t.anisotropy !== a || t.minFilter !== mf || t.generateMipmaps !== gm) { t.anisotropy = a; t.minFilter = mf; t.generateMipmaps = gm; t.needsUpdate = true; } }
        if (v === 'nonormal' || v === 'all') m.normalMap = null;
        if (v === 'nometal') { m.metalnessMap = null; m.metalness = 0; }
        if (v === 'aniso' || v === 'all') for (const [t] of O.maps) { t.anisotropy = Math.min(8, A); t.needsUpdate = true; }
        if (v === 'nomip') for (const [t] of O.maps) { t.generateMipmaps = false; t.minFilter = 1006; t.needsUpdate = true; }
        if (v === 'double' && m.name === 'BakedMaterial') m.side = 2; else if (m.__side0 !== undefined) m.side = m.__side0;
        if (m.__side0 === undefined) m.__side0 = m.side;
        if (v === 'tangents' && m.name === 'BakedMaterial' && O.normalMap && o.geometry.index && o.geometry.attributes.uv && !o.geometry.attributes.tangent) { o.geometry.computeTangents(); o.__tan = true; }
        m.needsUpdate = true; n++;
      }
    });
    return n;
  }, v);
}
const VIEWS = [
  ['pickup-spawn', -0.6, 12.6, -102, -6],     // Pong's Rivian beside the spawn, ~2.6 m
  ['sedan-front', 5.6, 1.0, -136, -9],        // the sedan's front-left three-quarter, ~3.8 m
  ['cars-rear', 6.4, 6.9, -32, -8],           // the sedan's rear-left, the truck and the SUV beyond
  ['truck-side', 8.9, 7.3, -24, -10],        // the white pickup's tail and right side, ~2.5 m
  ['moto', -9.0, -6.5, 43, -14],              // the underbone under the house, ~4.7 m
  ['raintree', 7.6, 2.0, -45, 32],            // the rain tree over the cars, looking up
  ['mango', -5.5, 5.0, 57, 12],               // the mango by the house, ~4.4 m
  ['palm-lane', -0.6, 12.6, 103, 30],         // the first palm by the lane, ~5.3 m, looking up
  ['banana', -4.6, 7.0, 81, 4],               // the banana clump inside the gate, ~2.7 m
  ['takhian', 1.5, -6.2, -13, 26],            // the takhian behind the sala
  ['bamboo', 12.4, -11.4, -43, 18],           // the bamboo past the back corner
];
const PLAN = process.env.PLAN ? process.env.PLAN.split(';').map(s => { const [v, vs] = s.split(':'); return [v, vs.split('+')]; }) : VARIANTS.map(v => [v, ONLY]);
for (const [v, only] of PLAN) {
  const n = await variant(v);
  console.log(el(), 'variant', v, 'materials', n);
  for (const [tag, x, z, yd, pd] of VIEWS) {
    if (only && !only.includes(tag)) continue;
    await p.evaluate(([x, z, yd, pd]) => { const E = window.__enc; E.yaw.position.x = x; E.yaw.position.z = z; E.yaw.rotation.y = yd * Math.PI / 180; E.pitch.rotation.x = pd * Math.PI / 180; }, [x, z, yd, pd]);
    await frames(4); await p.waitForTimeout(1200); await frames(2);
    const at = await p.evaluate(() => { const E = window.__enc; return [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z].map(v => +v.toFixed(2)); });
    await p.screenshot({ path: `${OUT}/${v}-${tag}.png`, timeout: 240000 });
    /* (v24.27) what this view costs: the world's draws and triangles in one render of it */
    const cost = await p.evaluate(() => { const E = window.__enc, R = E.renderer; R.render(E.scene, E.camera); return [R.info.render.calls, R.info.render.triangles]; });
    console.log(el(), v, tag, 'at', JSON.stringify(at), 'draws', cost[0], 'tris', cost[1], 'state', await p.evaluate(() => window.__enc.getState()));
  }
}
console.log(el(), 'errs', JSON.stringify(errs.slice(0, 20)));
await b.close();
