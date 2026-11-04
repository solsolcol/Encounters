// v24.39 · Every take of a rigged GLB photographed at several moments of its own length, front and side, from ONE load
// (shootmodel.mjs loads the file once per take): the v6.17 law ("every clip, front and side") made cheap enough to run on
// a 600k-triangle scan. Writes <outPrefix>-<clip>.png, one row per moment: front | side | three-quarter from behind.
//   node tools/clipsheet.mjs <file.glb> <outPrefix> [--at=0.1,0.35,0.6,0.85] [--size=360] [--clips=a,b] [--views=0:6,90:6,215:14]
// --views: degrees round him : pitch, one column each (0 his front, 90 his left, 180 his back, 270 his right; pitch 60 from above)
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import fs from 'node:fs';
import { LAUNCH } from '../testlib.mjs';
const FILE = process.argv[2], OUT = process.argv[3] || '/tmp/clips';
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const AT = arg('at', '0.1,0.35,0.6,0.85').split(',').map(Number), SIZE = +arg('size', 360), ONLY = arg('clips', '');
/* --plan=<file.json>: { "Take": [seconds, ...] } — each take shot at its own moments (rigstrain's worst frames) */
const PLAN = arg('plan', '') ? JSON.parse(fs.readFileSync(arg('plan', ''), 'utf8')) : null;
const FRAME = arg('frame', 'body');   // body | torso (the chest and back, framed on the posed Spine1) | head | legs (the hem and shins)
/* --floor: a solid floor under the grid, as a player sees him (cloth that dips under it is hidden, as in the game);
   for views from above only */
const FLOORON = process.argv.includes('--floor');
/* v24.46 · --look=lit | unlit[@L] | face[@L] | blend:K[@L] — how his skin and cloth are lit: as now (lit, the default); the
   colour as captured, no light at all (unlit); unlit only where he is skinned to his head (face: the Head bone's weight,
   and half the Neck's, eased from 0.3 to 0.7 so the whole face is fully unlit); or a share K of unlit everywhere (blend). @L scales the unlit colour (a scene's light
   level: an unlit model ignores the scene's lights, so a dim room needs it; @raw instead lays the unlit colour on AFTER the
   tone mapping, so it shows the scan's colour exactly as captured; @rawL the same scaled by L); skin[:K]@raw[L] lays it
   only where the texture's own colour is saturated (his skin, the beads, the gold: by the texel's saturation, 0.12–0.25),
   so the white robe keeps the scene's light and its folds). --light=dim draws every light at 0.3 of its
   strength; --exposure=E sets the tone mapping's exposure (the game's is 1.42; unset, 1.2 as before) */
const LOOK = arg('look', 'lit'), LIGHT = arg('light', 'day'), EXPO = +arg('exposure', '1.2');
const VIEWS = arg('views', '0:6,90:6,215:14').split(',').map(v => v.split(':').map(Number)), NV = VIEWS.length;
const ROOT = resolve('.');
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary' };
const srv = createServer(async (req, res) => {
  try { const p = decodeURIComponent(req.url.split('?')[0]); const path = p === '/model.glb' ? resolve(FILE) : resolve(ROOT + p);
    const buf = await readFile(path); res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' }); res.end(buf); }
  catch { res.writeHead(404); res.end('no'); }
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#6a6f78}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head>
<body><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const S = ${SIZE};
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(S * ${NV}, S); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setScissorTest(true);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = ${EXPO};
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x6a6f78);
const LK = '${LIGHT}' === 'dim' ? 0.3 : 1;
scene.add(new THREE.HemisphereLight(0xffffff, 0x404048, 2.0 * LK));
const key = new THREE.DirectionalLight(0xffffff, 2.2 * LK); key.position.set(3, 5, 4); scene.add(key);
const fill = new THREE.DirectionalLight(0xbcd0ff, 0.8 * LK); fill.position.set(-4, 2, -3); scene.add(fill);
const grid = new THREE.GridHelper(4, 8, 0x333333, 0x4a4a4a); scene.add(grid);
if (${FLOORON}) { const fl = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 0.9 })); fl.rotation.x = -Math.PI / 2; fl.position.y = -0.001; scene.add(fl); }
const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
window.__ready = false;
new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('/model.glb', (gltf) => {
  const root = gltf.scene; scene.add(root);
  const mixer = new THREE.AnimationMixer(root), acts = {};
  for (const c of gltf.animations) acts[c.name] = mixer.clipAction(c);
  let skinned = null; root.traverse(o => { if (o.isSkinnedMesh && !skinned) skinned = o; });
  const LOOK = '${LOOK}';
  if (LOOK !== 'lit') { const [m0, lv] = LOOK.split('@'), [mode, kk] = m0.split(':'), RAW = !!lv && lv.startsWith('raw'), level = RAW ? (+lv.slice(3) || 1) : (lv ? +lv : 1), K = kk ? +kk : 1, SKIN = mode === 'skin';
    root.traverse(o => { if (!o.isMesh) return; const g = o.geometry, n = g.attributes.position.count, mask = new Float32Array(n).fill(1);
      if (mode === 'face' && o.isSkinnedMesh) { const SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, B = o.skeleton.bones;
        const wt = B.map(b => /Head(Top_End)?$/.test(b.name) ? 1 : /Neck$/.test(b.name) ? 0.5 : 0);
        for (let i = 0; i < n; i++) { let m = 0; for (let k = 0; k < 4; k++) m += SW.getComponent(i, k) * wt[SI.getComponent(i, k)]; const t = Math.max(0, Math.min(1, (m - 0.3) / 0.4)); mask[i] = t * t * (3 - 2 * t); } }
      g.setAttribute('lookMask', new THREE.BufferAttribute(mask, 1));
      for (const mt of [].concat(o.material)) { mt.onBeforeCompile = sh => { sh.uniforms.uLevel = { value: level }; sh.uniforms.uK = { value: K };
        sh.vertexShader = 'attribute float lookMask;\\nvarying float vLook;\\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\\nvLook = lookMask;');
        sh.fragmentShader = 'varying float vLook;\\nuniform float uLevel;\\nuniform float uK;\\n' + (RAW
          ? sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\\n' + (SKIN ? 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\\n' : 'float skn = 1.0;\\n') + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb * uLevel, clamp(vLook * uK * skn, 0.0, 1.0));')
          : sh.fragmentShader.replace('#include <opaque_fragment>', 'outgoingLight = mix(outgoingLight, diffuseColor.rgb * uLevel, clamp(vLook * uK, 0.0, 1.0));\\n#include <opaque_fragment>')); };
        mt.customProgramCacheKey = () => 'look' + LOOK; mt.needsUpdate = true; } }); }
  window.__clips = gltf.animations.map(a => ({ name: a.name, dur: a.duration }));
  const box = new THREE.Box3(), v = new THREE.Vector3();
  /* the posed skin's box (a SkinnedMesh's own box is its bind pose): sample every 40th vertex through the skin */
  const posedBox = () => { box.makeEmpty(); if (!skinned) return box.setFromObject(root); const P = skinned.geometry.attributes.position;
    for (let i = 0; i < P.count; i += 40) { skinned.getVertexPosition(i, v); v.applyMatrix4(skinned.matrixWorld); box.expandByPoint(v); } return box; };
  if (!gltf.animations.length) window.__clips = [{ name: 'static', dur: 1 }];   // a still (rigstrain's heat): one row
  window.__shoot = (clip, t) => {
    for (const a of Object.values(acts)) a.stop();
    const a = acts[clip]; if (a) { a.reset().play(); a.paused = true; a.time = t; mixer.update(0); } root.updateMatrixWorld(true);
    const b = posedBox(); let c = b.getCenter(new THREE.Vector3()); const s = b.getSize(new THREE.Vector3());
    let r = Math.max(s.x, s.y, s.z, 1.0) * 0.6;
    if ('${FRAME}' === 'legs') { c = new THREE.Vector3(c.x, b.min.y + 0.32, c.z); r = 0.38; }
    if ('${FRAME}' === 'head') { let hd = null; root.traverse(o => { if (o.isBone && /Head$/.test(o.name)) hd = o; }); if (hd) { c = hd.getWorldPosition(new THREE.Vector3()); c.y += 0.06; r = 0.17; } }
    if ('${FRAME}' === 'torso') { let sp = null; root.traverse(o => { if (o.isBone && /Spine1$/.test(o.name)) sp = o; }); if (sp) { c = sp.getWorldPosition(new THREE.Vector3()); r = 0.42; }
      else { c = new THREE.Vector3(c.x, b.min.y + 0.72 * s.y, c.z); r = 0.42; } }   // a still: the chest by its height
    const d = r / Math.sin(THREE.MathUtils.degToRad(15)) * 1.02;
    const views = ${JSON.stringify(VIEWS)};
    views.forEach(([deg, pitch], k) => {
      const a2 = THREE.MathUtils.degToRad(deg), p2 = THREE.MathUtils.degToRad(pitch);
      cam.position.set(c.x + Math.sin(a2) * Math.cos(p2) * d, c.y + Math.sin(p2) * d, c.z + Math.cos(a2) * Math.cos(p2) * d);
      cam.lookAt(c); cam.updateProjectionMatrix();
      renderer.setViewport(k * S, 0, S, S); renderer.setScissor(k * S, 0, S, S); renderer.render(scene, cam);
    });
    return { min: b.min.toArray().map(x => +x.toFixed(3)), max: b.max.toArray().map(x => +x.toFixed(3)) };
  };
  window.__ready = true;
}, undefined, e => { window.__err = String(e); window.__ready = true; });
</script></body></html>`;
const br = await chromium.launch(LAUNCH);
const p = await br.newPage({ viewport: { width: SIZE * NV, height: SIZE } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.route('**/sheet.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/sheet.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 600000 });
const err = await p.evaluate(() => window.__err); if (err) { console.log('load failed', err); process.exit(1); }
const clips = (await p.evaluate(() => window.__clips)).filter(c => (!ONLY || ONLY.split(',').includes(c.name)) && (!PLAN || PLAN[c.name]));
const sharp = (await import('sharp')).default;
for (const c of clips) {
  const rows = [];
  for (const f of (PLAN ? PLAN[c.name].map(t => t / c.dur) : AT)) {
    const r = await p.evaluate(([n, t]) => window.__shoot(n, t), [c.name, Math.min(c.dur - 1e-3, f * c.dur)]);
    rows.push({ input: await p.screenshot({ type: 'png' }), f, r });
  }
  const comp = rows.map((x, i) => ({ input: x.input, left: 0, top: i * SIZE }));
  const labels = rows.map((x, i) => ({ input: Buffer.from(`<svg width="${SIZE * NV}" height="20"><rect width="${SIZE * NV}" height="20" fill="black" opacity="0.55"/><text x="4" y="15" font-family="sans-serif" font-size="13" fill="white">${c.name} @ ${(x.f * c.dur).toFixed(2)} s of ${c.dur.toFixed(2)} — feet y ${x.r.min[1]}</text></svg>`), left: 0, top: i * SIZE }));
  await sharp({ create: { width: SIZE * NV, height: SIZE * rows.length, channels: 3, background: '#222' } }).composite([...comp, ...labels]).png().toFile(`${OUT}-${c.name}.png`);
  console.log(c.name, c.dur.toFixed(2), rows.map(x => x.r.min[1].toFixed(3) + '..' + x.r.max[1].toFixed(3)).join(' '));
}
console.log('errs', errs.slice(0, 5));
await br.close(); srv.close();
