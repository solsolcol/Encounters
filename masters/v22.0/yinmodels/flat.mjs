// v22.0 CP5 · render a GLB's +z face unlit (its own colour map), orthographic, framed to its box — her portrait cut from
// Chad's yin amulet for the wall photograph (masters/v22.0/yinmodels/make.sh)
//   node masters/v22.0/yinmodels/flat.mjs <in.glb> <out.png> [size=1600]
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { LAUNCH } from '../../../testlib.mjs';
const [FILE, OUT, SZ] = process.argv.slice(2); const SIZE = Number(SZ || 1600);
const ROOT = resolve(new URL('../../..', import.meta.url).pathname);
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.glb': 'model/gltf-binary' };
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]);
  const path = p === '/model.glb' ? resolve(FILE) : resolve(ROOT + p); const buf = await readFile(path);
  res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head>
<body><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const W = ${SIZE};
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, W); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('/model.glb', (g) => {
  g.scene.traverse(m => { if (m.isMesh) m.material = new THREE.MeshBasicMaterial({ map: m.material.map }); });
  scene.add(g.scene); g.scene.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(g.scene), s = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  const h = Math.max(s.x, s.y) / 2 * 1.02;
  const cam = new THREE.OrthographicCamera(c.x - h, c.x + h, c.y + h, c.y - h, 0.001, 100);
  cam.position.set(c.x, c.y, b.max.z + 1); cam.lookAt(c.x, c.y, c.z);
  renderer.render(scene, cam); window.__box = [b.min.toArray(), b.max.toArray(), h]; window.__ready = true;
}, undefined, e => { window.__err = String(e); window.__ready = true; });
</script></body></html>`;
const br = await chromium.launch(LAUNCH);
const p = await br.newPage({ viewport: { width: SIZE, height: SIZE } });
await p.route('**/flat.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/flat.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 300000 });
console.log(JSON.stringify(await p.evaluate(() => ({ box: window.__box, err: window.__err }))));
await p.screenshot({ path: OUT });
await br.close(); srv.close();
