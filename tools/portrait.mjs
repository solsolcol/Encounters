/* v27.0 · A PORTRAIT PHOTOGRAPH OF ONE OF THE GAME'S OWN PEOPLE, for a frame in the world (Chad's answer for chapter 3's
   hall: "the game's own people"). Loads a body's file (any path in the repo: a full model from masters/<v>/src, never
   shipped itself), stands it in its first take's first frame (or its bind pose), and photographs it head and shoulders
   on a plain studio backdrop, lit from the upper left, as a family's framed photograph is; then, in a 2D pass of the
   picture's own, a warm age (sepia), a little softness and a vignette. Out: a JPEG at the size asked.
     node tools/portrait.mjs <file.glb> <out.jpg> [w=768] [h=1024] [opts as JSON: {"sepia":0.35,"bg":"#8a8072","dist":0.62,"down":0.02,"turn":0.12}] */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { LAUNCH } from '../testlib.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [file, out, W0 = '768', H0 = '1024', O0 = '{}'] = process.argv.slice(2);
if (!file || !out) { console.log('usage: node tools/portrait.mjs <file.glb> <out.jpg> [w] [h] [opts]'); process.exit(2); }
const W = +W0, H = +H0, O = Object.assign({ sepia: 0.35, bg: '#8a8072', dist: 0.62, down: 0.02, turn: 0.12, fov: 24, soft: 0.6 }, JSON.parse(O0));
const PAGE = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
window.shoot = async (file, W, H, O) => {
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(W, H); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  document.body.appendChild(r.domElement);
  const sc = new THREE.Scene();
  /* the studio's backdrop: a cloth lit in a soft pool behind the head */
  const bc = document.createElement('canvas'); bc.width = 256; bc.height = 256; const bx = bc.getContext('2d');
  const gr = bx.createRadialGradient(128, 110, 10, 128, 128, 180); gr.addColorStop(0, O.bg); gr.addColorStop(1, '#2c2622'); bx.fillStyle = gr; bx.fillRect(0, 0, 256, 256);
  const bt = new THREE.CanvasTexture(bc); bt.colorSpace = THREE.SRGBColorSpace; sc.background = bt;
  sc.add(new THREE.HemisphereLight(0xfff2e2, 0x3a3028, 1.15));
  const key = new THREE.DirectionalLight(0xfff6ea, 2.0); key.position.set(-1.6, 2.4, 2.2); sc.add(key);
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0.5); rim.position.set(1.8, 1.6, -1.4); sc.add(rim);
  const L = new GLTFLoader(); L.setMeshoptDecoder(MeshoptDecoder);
  const g = await new Promise((ok, no) => L.load(file, ok, undefined, no));
  const root = g.scene; sc.add(root);
  root.traverse(m => { if (m.isMesh) { m.frustumCulled = false; for (const mt of [].concat(m.material)) { if (mt.metalness !== undefined) { mt.metalness = Math.min(mt.metalness, 0.1); mt.roughness = Math.max(mt.roughness, 0.7); } } } });
  if (g.animations.length) { const mixer = new THREE.AnimationMixer(root); const a = mixer.clipAction(g.animations[0]); a.play(); mixer.setTime(0.01); }
  root.updateMatrixWorld(true);
  let head = null; root.traverse(b => { if (!head && b.isBone && /Head(_\\d+)?$/.test(b.name)) head = b; });
  const hp = new THREE.Vector3(); if (head) head.getWorldPosition(hp);
  /* framed by the body's own skin (a skinned body's box is its bind pose: the posed points are read): from a little over
     the crown to the middle of the chest, O.frame of its height (head and shoulders), the lens's distance solved for it */
  const bb = new THREE.Box3(), v = new THREE.Vector3();
  root.traverse(m => { if (!m.isMesh) return; const pa = m.geometry.attributes.position, st = Math.max(1, Math.floor(pa.count / 6000));
    for (let i = 0; i < pa.count; i += st) { if (m.isSkinnedMesh) { m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld); } else v.fromBufferAttribute(pa, i).applyMatrix4(m.matrixWorld); bb.expandByPoint(v); } });
  const hgt = bb.max.y - bb.min.y, V = hgt * (O.frame || 0.42), cy = bb.max.y + hgt * 0.02 - V / 2 - O.down;
  const dist = (V / 2) / Math.tan(O.fov * Math.PI / 360);
  const cam = new THREE.PerspectiveCamera(O.fov, W / H, 0.01, 100);
  if (!head) hp.set((bb.min.x + bb.max.x) / 2, cy, (bb.min.z + bb.max.z) / 2);
  cam.position.set(hp.x + Math.sin(O.turn) * dist, cy + 0.02, hp.z + Math.cos(O.turn) * dist); cam.lookAt(hp.x, cy, hp.z);
  r.render(sc, cam);
  /* the photograph's age: sepia, a little softness, the corners darker */
  const c2 = document.createElement('canvas'); c2.width = W; c2.height = H; const x = c2.getContext('2d');
  x.filter = 'sepia(' + O.sepia + ') contrast(1.04) saturate(0.85) blur(' + O.soft + 'px)'; x.drawImage(r.domElement, 0, 0); x.filter = 'none';
  const vg = x.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72); vg.addColorStop(0, 'rgba(20,12,6,0)'); vg.addColorStop(1, 'rgba(20,12,6,0.55)');
  x.fillStyle = vg; x.fillRect(0, 0, W, H);
  return { url: c2.toDataURL('image/jpeg', 0.9), head: !!head, at: [hp.x, hp.y, hp.z], height: hgt };
};
window.ready = true;
</script>`;
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/' || u === '/index.html') { s.writeHead(200, { 'content-type': 'text/html' }); return s.end(PAGE); }
  const f = path.join(ROOT, u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
}).listen(0);
const base = `http://127.0.0.1:${srv.address().port}/`;
const browser = await chromium.launch(LAUNCH);
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base);
await page.waitForFunction(() => window.ready, null, { timeout: 60000 });
const res = await page.evaluate(([f, w, h, o]) => window.shoot(f, w, h, o), ['/' + path.relative(ROOT, path.resolve(file)), W, H, O]);
fs.writeFileSync(out, Buffer.from(res.url.split(',')[1], 'base64'));
console.log(out, JSON.stringify({ head: res.head, height: +res.height.toFixed(3), at: res.at.map(v => +v.toFixed(3)) }));
await browser.close(); srv.close();
