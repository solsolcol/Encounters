// v23.0 · Photograph GLBs at GAME SCALE through a game lens — the v6.17 law's
// close-up half ("photograph each KIND on its own", and at the distances the
// chapter will see it). shootmodel.mjs frames a model from its own bounds;
// this one stands each model at a height in METRES on a plinth and shoots
// from named cameras with a real vertical fov, at a phone's or a desktop's
// size, so "does it read at 0.3 m on a phone" is a photograph, not a guess.
//
//   node tools/shootclose.mjs <spec.json> <outPrefix>
//   spec: { "models": [{ "file": "a.glb", "h": 0.24, "x": 0, "z": 0, "ry": 0, "node": "name_near" }],
//           "shots": [{ "name": "macro", "w": 390, "h": 844, "fov": 44, "pos": [0,1,0.3], "at": [0,0.9,0] }],
//           "bg": "#3a3530", "light": "warm" | "studio", "env": 1 }
// A model's "node" (optional) keeps only that node's mesh visible (a near or a far level of a lodpair file).
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import fs from 'node:fs';
import { LAUNCH } from '../testlib.mjs';

const SPEC = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const OUT = process.argv[3] || '/tmp/close';
const ROOT = resolve('.');
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary', '.json': 'application/json' };
const files = SPEC.models.map(m => resolve(m.file));
const srv = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(req.url.split('?')[0]);
    const mm = p.match(/^\/model(\d+)\.glb$/);
    const path = mm ? files[+mm[1]] : resolve(ROOT + p);
    const buf = await readFile(path);
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('no'); }
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const PORT = srv.address().port;
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head>
<body><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const SPEC = ${JSON.stringify(SPEC)};
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = SPEC.exposure || 1.42;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(SPEC.bg || '#3a3530');
if (SPEC.env !== 0) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = SPEC.env ?? 0.35; }
if (SPEC.light === 'studio') {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x404048, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(1, 3, 2); scene.add(key);
} else {
  scene.add(new THREE.HemisphereLight(0xffe2c0, 0x2a2018, 0.9));
  const key = new THREE.PointLight(0xffc890, 2.2, 0, 1.2); key.position.set(-0.6, 1.6, 0.9); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fb6ff, 0.5); rim.position.set(1, 1.5, -1); scene.add(rim);
}
const plinth = new THREE.Mesh(new THREE.BoxGeometry(2, 0.02, 1), new THREE.MeshStandardMaterial({ color: 0x5a1010, roughness: 0.8 }));
plinth.position.set(0, (SPEC.floor ?? 0.8) - 0.01, 0); scene.add(plinth);
const cam = new THREE.PerspectiveCamera(72, 1, 0.08, 200);
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const info = [];
await Promise.all(SPEC.models.map((m, i) => new Promise((ok) => loader.load('/model' + i + '.glb', g => {
  const root = g.scene;
  if (m.node) root.traverse(o => { if (o.isMesh) { let n = o, keep = false; while (n) { if (n.name === m.node) keep = true; n = n.parent; } o.visible = keep; } });
  root.updateMatrixWorld(true);
  const box = new THREE.Box3(); root.traverse(o => { if (o.isMesh && o.visible) box.expandByObject(o); });
  const s = m.h / (box.max.y - box.min.y);
  root.scale.setScalar(s); root.rotation.y = m.ry || 0;
  root.position.set(m.x || 0, (SPEC.floor ?? 0.8) - box.min.y * s, m.z || 0);
  scene.add(root); root.updateMatrixWorld(true);
  let tris = 0; root.traverse(o => { if (o.isMesh && o.visible) tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; });
  if (m.nomip) root.traverse(o => { if (o.isMesh && o.material.map) { o.material.map.generateMipmaps = false; o.material.map.minFilter = THREE.LinearFilter; o.material.map.needsUpdate = true; } });
  info.push({ file: m.file, scale: +s.toFixed(5), tris, box: [box.min.toArray().map(v => +v.toFixed(3)), box.max.toArray().map(v => +v.toFixed(3))] });
  ok();
}, undefined, e => { info.push({ file: m.file, err: String(e) }); ok(); }))));
window.__info = info;
window.__shoot = (sh) => {
  renderer.setPixelRatio(1); renderer.setSize(sh.w, sh.h, false);
  cam.fov = sh.fov || 72; cam.aspect = sh.w / sh.h; cam.near = sh.near || 0.08; cam.updateProjectionMatrix();
  cam.position.set(...sh.pos); cam.lookAt(new THREE.Vector3(...sh.at));
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL('image/png');
};
window.__ready = true;
</script></body></html>`;
const br = await chromium.launch(LAUNCH);
const p = await br.newPage({ viewport: { width: 1400, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await p.route('**/close.html', route => route.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${PORT}/close.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => window.__info)));
for (const sh of SPEC.shots) {
  const url = await p.evaluate(s => window.__shoot(s), sh);
  fs.writeFileSync(`${OUT}-${sh.name}.png`, Buffer.from(url.split(',')[1], 'base64'));
}
console.log('errs', errs.slice(0, 5));
await br.close(); srv.close();
