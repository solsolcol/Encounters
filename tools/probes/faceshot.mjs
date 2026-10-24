/* v22.0: A MODEL'S FACE, PHOTOGRAPHED ON ITS OWN — loads assets/<key>.glb with three's own GLTFLoader and the meshopt
   decoder (the repo is served as it stands; no build needed), parks a take at a time if one is named, and photographs
   the head close (front, three-quarter, profile) and the whole figure, at a phone's pixel ratio, lit plainly. For
   choosing a stand-in by its FACE before it is wired into a chapter: a figure that reads fine across a room can fall
   apart at a two-shot's distance (e3c4's towkay — 4,200 triangles on one 512-pixel sheet). The head bone is found by
   the engine's HEAD_RE; a model with none is framed from the top of its box.
   Usage: node tools/probes/faceshot.mjs <outdir> key[:clip[:secs]] [key ...]                                    */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { LAUNCH } from '../../testlib.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [out, ...specs] = process.argv.slice(2);
if (!out || !specs.length) { console.log('usage: node tools/probes/faceshot.mjs <outdir> key[:clip[:secs]] ...'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const PAGE = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#3a3c40}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const W = 480, H = 640;
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
r.setPixelRatio(2); r.setSize(W, H); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.1;
document.body.appendChild(r.domElement);
const sc = new THREE.Scene(); sc.background = new THREE.Color(0x3a3c40);
sc.add(new THREE.HemisphereLight(0xfff4e8, 0x40382c, 1.4));
const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(1.2, 2.2, 2.4); sc.add(key);
const cam = new THREE.PerspectiveCamera(30, W / H, 0.01, 100);
const L = new GLTFLoader(); L.setMeshoptDecoder(MeshoptDecoder);
const HEAD_RE = /Head(_\\d+)?$/;                                   // the engine's CHCTX.HEAD_RE
window.shoot = async (file, clip, secs) => {
  const g = await new Promise((ok, no) => L.load(file, ok, undefined, no));
  const root = g.scene; sc.add(root);
  let mixer = null, info = { clips: g.animations.map(a => a.name), tris: 0 };
  root.traverse(m => { if (m.isMesh) { m.frustumCulled = false; const ix = m.geometry.index; info.tris += (ix ? ix.count : m.geometry.attributes.position.count) / 3; } });
  if (g.animations.length) {
    mixer = new THREE.AnimationMixer(root);
    const c = g.animations.find(a => a.name === clip) || g.animations[0];
    info.clip = c.name; const a = mixer.clipAction(c); a.play(); mixer.setTime(secs || 0);
  }
  root.updateMatrixWorld(true);
  let head = null; root.traverse(b => { if (!head && b.isBone && HEAD_RE.test(b.name)) head = b; });
  const bb = new THREE.Box3();
  root.traverse(m => { if (!m.isMesh) return; const pa = m.geometry.attributes.position, st = Math.max(1, Math.floor(pa.count / 4000)), v = new THREE.Vector3();
    for (let i = 0; i < pa.count; i += st) { if (m.isSkinnedMesh) { m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld); } else v.fromBufferAttribute(pa, i).applyMatrix4(m.matrixWorld); bb.expandByPoint(v); } });
  const hgt = bb.max.y - bb.min.y, hp = new THREE.Vector3();
  if (head) head.getWorldPosition(hp); else hp.set((bb.min.x + bb.max.x) / 2, bb.max.y - hgt * 0.07, (bb.min.z + bb.max.z) / 2);
  hp.y += hgt * 0.035;
  info.height = +hgt.toFixed(3); info.head = !!head;
  const shots = [];
  const at = (ang, dist, ty, fov) => { cam.fov = fov; cam.updateProjectionMatrix();
    cam.position.set(hp.x + Math.sin(ang) * dist, ty + 0.02, hp.z + Math.cos(ang) * dist); cam.lookAt(hp.x, ty, hp.z);
    r.render(sc, cam); shots.push(r.domElement.toDataURL('image/jpeg', 0.92)); };
  const d = hgt * 0.24;
  at(0, d, hp.y, 30); at(0.6, d, hp.y, 30); at(1.45, d, hp.y, 30);
  const mid = (bb.min.y + bb.max.y) / 2; at(0.3, hgt * 2.0, mid, 34);
  sc.remove(root);
  return { info, shots };
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
const page = await browser.newPage({ viewport: { width: 480, height: 640 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base);
await page.waitForFunction(() => window.ready, null, { timeout: 60000 });
for (const sp of specs) {
  const [k, clip, secs] = sp.split(':');
  const res = await page.evaluate(([f, c, t]) => window.shoot(f, c, t), ['/assets/' + k + '.glb', clip || '', +(secs || 0)]);
  console.log(k, JSON.stringify(res.info));
  res.shots.forEach((d, i) => fs.writeFileSync(path.join(out, `${k}-${['front', 'three', 'side', 'body'][i]}.jpg`), Buffer.from(d.split(',')[1], 'base64')));
}
await browser.close(); srv.close();
