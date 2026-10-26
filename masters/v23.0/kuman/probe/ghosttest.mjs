// CP1f · the transparent-double test (v12.4): each near level drawn as a GHOST, alone, at the possession
// distances; variants: opaque | ghost (transparent, depthWrite off) | primed (a depth-only pass first) |
// prime-red (the prime pass drawn in RED with colour on, so a no-op prime cannot pass — v12.3's lesson)
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import fs from 'node:fs';
import { LAUNCH } from '../../../../testlib.mjs';
const ROOT = '/home/user/Encounters';
const KIDS = [['kumanred', 0.26, '#ff5a3c'], ['kumanshy', 0.20, '#ffb35a'], ['kumanlittle', 0.24, '#6aa8ff']];
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const buf = await readFile(resolve(ROOT + p)); res.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><meta charset="utf-8"><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body style="margin:0"><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.42;
document.body.appendChild(r.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#1a1f2e');
scene.add(new THREE.HemisphereLight(0xffe2c0, 0x202030, 0.7));
const wall = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshStandardMaterial({ color: 0x6b5a48 })); wall.position.set(0, 1.2, -0.6); scene.add(wall);
const cam = new THREE.PerspectiveCamera(72, 390 / 844, 0.08, 50);
let model = null, prime = null, mats = [];
window.load = (file, h, col) => new Promise(ok => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(file, g => {
  if (model) { scene.remove(model); scene.remove(prime); }
  model = g.scene; model.traverse(o => { if (o.isMesh && !/_near$/.test(o.name)) o.visible = false; });
  const box = new THREE.Box3(); model.traverse(o => { if (o.isMesh && o.visible) box.expandByObject(o); });
  const s = h / (box.max.y - box.min.y); model.scale.setScalar(s); model.position.set(0, 1.0, 0);
  mats = []; model.traverse(o => { if (o.isMesh && o.visible) { o.material = o.material.clone(); mats.push(o.material); } });
  prime = model.clone(); prime.traverse(o => { if (o.isMesh) o.material = new THREE.MeshBasicMaterial({ color: 0xff0000, colorWrite: false }); });
  scene.add(model); scene.add(prime); window.__col = new THREE.Color(col); ok();
}));
window.shot = (mode, dist) => {
  for (const m of mats) { m.transparent = mode !== 'opaque'; m.opacity = mode === 'opaque' ? 1 : 0.5; m.depthWrite = mode === 'opaque';
    m.emissive.copy(mode === 'opaque' ? new THREE.Color(0) : window.__col).multiplyScalar(0.35); m.needsUpdate = true; }
  prime.visible = mode === 'primed' || mode === 'prime-red';
  prime.traverse(o => { if (o.isMesh) { o.material.colorWrite = mode === 'prime-red'; o.material.depthWrite = true; o.renderOrder = -1; } });
  model.traverse(o => { if (o.isMesh) o.renderOrder = 1; });
  const h = new THREE.Box3().setFromObject(model);
  const cy = (h.min.y + h.max.y) / 2;
  cam.position.set(0.02, cy + 0.02, dist); cam.lookAt(0, cy, 0); cam.fov = dist < 0.5 ? 44 : 72; cam.updateProjectionMatrix();
  r.setSize(390, 844, false); r.render(scene, cam); return r.domElement.toDataURL('image/png');
};
window.ready = true;
</script></body></html>`;
const br = await chromium.launch(LAUNCH);
const p = await br.newPage({ viewport: { width: 400, height: 860 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.route('**/g.html', route => route.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/g.html`);
await p.waitForFunction(() => window.ready);
const out = process.argv[2];
for (const [k, h, col] of KIDS) {
  await p.evaluate(([f, hh, c]) => window.load(f, hh, c), [`/assets/${k}.glb`, h, col]);
  for (const mode of ['opaque', 'ghost', 'primed', 'prime-red']) for (const d of [0.9, 0.35]) {
    const url = await p.evaluate(([m, dd]) => window.shot(m, dd), [mode, d]);
    fs.writeFileSync(`${out}-${k}-${mode}-${d}.png`, Buffer.from(url.split(',')[1], 'base64'));
  }
}
console.log('errs', errs); await br.close(); srv.close();
