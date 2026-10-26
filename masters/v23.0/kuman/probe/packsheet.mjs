// CP1g · a contact sheet of a Tailandia pack: every catalogue object (prepthai's index) photographed alone
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import fs from 'node:fs';
import { LAUNCH } from '../../../../testlib.mjs';
const ROOT = '/home/user/Encounters', FILE = process.argv[2], OUT = process.argv[3];
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const buf = await readFile(p === '/pack.glb' ? resolve(FILE) : resolve(ROOT + p)); res.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><meta charset="utf-8"><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body style="margin:0"><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.outputColorSpace = THREE.SRGBColorSpace;
r.setSize(200, 200, false); document.body.appendChild(r.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#6a6f78');
scene.add(new THREE.HemisphereLight(0xffffff, 0x404048, 2.2)); const k = new THREE.DirectionalLight(0xffffff, 1.6); k.position.set(2, 4, 3); scene.add(k);
const cam = new THREE.PerspectiveCamera(35, 1, 0.01, 500);
new GLTFLoader().load('/pack.glb', g => {
  let level = g.scene.children; while (level.length === 1) level = level[0].children;
  window.N = level.length;
  window.shot = (i) => {
    for (const o of level) o.visible = false; const o = level[i]; o.visible = true; scene.add(g.scene); g.scene.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(o), s = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
    const rr = Math.max(s.x, s.y, s.z) * 0.62, d = rr / Math.sin(THREE.MathUtils.degToRad(17.5)) * 1.05;
    cam.position.set(c.x + d * 0.55, c.y + d * 0.35, c.z + d * 0.76); cam.lookAt(c); cam.updateProjectionMatrix();
    r.render(scene, cam); return { url: r.domElement.toDataURL('image/png'), name: o.name, size: s.toArray().map(v => +v.toFixed(2)) };
  };
  window.ready = true;
});
</script></body></html>`;
const br = await chromium.launch(LAUNCH); const p = await br.newPage({ viewport: { width: 220, height: 220 } });
await p.route('**/s.html', route => route.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/s.html`); await p.waitForFunction(() => window.ready, null, { timeout: 300000 });
const N = await p.evaluate(() => window.N); fs.mkdirSync(OUT, { recursive: true }); const names = [];
for (let i = 0; i < N; i++) { const s = await p.evaluate(i => window.shot(i), i); fs.writeFileSync(`${OUT}/${String(i).padStart(2, '0')}.png`, Buffer.from(s.url.split(',')[1], 'base64')); names.push(`${i} ${s.name} ${s.size.join('x')}`); }
fs.writeFileSync(`${OUT}/names.txt`, names.join('\n')); console.log(N, 'objects'); await br.close(); srv.close();
