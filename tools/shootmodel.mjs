// Photograph a GLB on its own — the v6.17 law ("a model change is verified by
// photographing each KIND on its own"). Serves the repo over http so three.js
// and the model load as modules, frames the model from its own bounds, and
// writes front / side / back / top-ish PNGs plus a measured report.
//
//   node tools/shootmodel.mjs <file.glb> <outPrefix> [clipName|--clips] [--size=900]
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { LAUNCH } from '../testlib.mjs';

const FILE = process.argv[2];
const OUT = process.argv[3] || '/tmp/shot';
const CLIP = process.argv.slice(4).find(a => !a.startsWith('--')) || '';
const SIZE = +(process.argv.find(a => a.startsWith('--size=')) || '').slice(7) || 900;
const ROOT = resolve('.');
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' };

const srv = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(req.url.split('?')[0]);
    const path = p === '/model.glb' ? resolve(FILE) : resolve(ROOT + p);
    const buf = await readFile(path);
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('no'); }
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const PORT = srv.address().port;

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#6a6f78}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head>
<body><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const W = ${SIZE}, H = ${SIZE};
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6a6f78);
scene.add(new THREE.HemisphereLight(0xffffff, 0x404048, 2.0));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
const fill = new THREE.DirectionalLight(0xbcd0ff, 0.8); fill.position.set(-4, 2, -3); scene.add(fill);
const cam = new THREE.PerspectiveCamera(35, 1, 0.01, 500);
window.__ready = false;
new GLTFLoader().load('/model.glb', (gltf) => {
  const root = gltf.scene; scene.add(root);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3()), mid = box.getCenter(new THREE.Vector3());
  let mixer = null, actions = {};
  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(root);
    for (const c of gltf.animations) actions[c.name] = mixer.clipAction(c);
  }
  window.__info = { size: size.toArray(), min: box.min.toArray(), max: box.max.toArray(),
    clips: gltf.animations.map(a => ({ name: a.name, dur: +a.duration.toFixed(2) })),
    meshes: (() => { const o = []; root.traverse(n => { if (n.isMesh) o.push({ name: n.name, skinned: !!n.isSkinnedMesh, tris: (n.geometry.index ? n.geometry.index.count : n.geometry.attributes.position.count) / 3 }); }); return o; })(),
    bones: (() => { let n = 0; root.traverse(o => { if (o.isBone) n++; }); return n; })() };
  window.__shoot = (deg, pitch, clip, t) => {
    if (mixer && clip && actions[clip]) { for (const a of Object.values(actions)) a.stop(); const a = actions[clip]; a.reset().play(); a.paused = true; a.time = t || 0; mixer.update(0); root.updateMatrixWorld(true); }
    const b = new THREE.Box3().setFromObject(root); const s = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
    const r = Math.max(s.x, s.y, s.z) * 0.62;
    const d = r / Math.sin(THREE.MathUtils.degToRad(cam.fov / 2)) * 1.05;
    const a2 = THREE.MathUtils.degToRad(deg), p2 = THREE.MathUtils.degToRad(pitch || 0);
    cam.position.set(c.x + Math.sin(a2) * Math.cos(p2) * d, c.y + Math.sin(p2) * d, c.z + Math.cos(a2) * Math.cos(p2) * d);
    cam.lookAt(c); cam.updateProjectionMatrix();
    renderer.render(scene, cam);
    return { box: [b.min.toArray().map(v=>+v.toFixed(3)), b.max.toArray().map(v=>+v.toFixed(3))], size: s.toArray().map(v=>+v.toFixed(3)) };
  };
  window.__ready = true;
}, undefined, (e) => { window.__err = String(e); window.__ready = true; });
</script></body></html>`;

const br = await chromium.launch(LAUNCH);
const p = await br.newPage({ viewport: { width: SIZE, height: SIZE } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await p.route('**/shoot.html', route => route.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${PORT}/shoot.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 180000 });
const info = await p.evaluate(() => ({ info: window.__info, err: window.__err }));
console.log(JSON.stringify(info, null, 1));
const clips = CLIP === '--clips' ? (info.info?.clips || []).map(c => c.name) : (CLIP ? [CLIP] : ['']);
for (const c of clips) {
  for (const [name, deg, pitch] of [['front', 0, 8], ['side', 90, 8], ['back', 180, 8], ['q', 35, 18]]) {
    const r = await p.evaluate(([d, pi, cl]) => window.__shoot(d, pi, cl, 0.001), [deg, pitch, c]);
    await p.screenshot({ path: `${OUT}${c ? '-' + c : ''}-${name}.png` });
    if (name === 'front') console.log(c || '(static)', JSON.stringify(r));
  }
}
console.log('errs', errs.slice(0, 5));
await br.close(); srv.close();
