/* v26.12 · TRIANGLES TURNED, SEEN AS A PLAYER SEES THEM (Chad, 14 Nov 2026: "I think your fix without visually checking the
   models is a little dangerous, you sometimes add more problems than you fix"). flipshot.mjs photographs each changed
   place at a hand's length, which magnifies a body ten to fifty times past the distance it is drawn at; this one draws the
   body, before and after, where the player meets it: at the middle of the distances its level is drawn over (c_cast.js
   LEVELS: the full body to 2.2 m, the near to 7, the mid to 14, the far beyond), from its front, its back and both sides,
   on a phone's screen (390 x 844 points at two pixels a point, the game's 72-degree lens), and counts the pixels that
   differ. Where any do, the changed corner of the picture is written out, before | after, at the phone's own pixels.
     node tools/probes/flipview.mjs <old.glb> <new.glb> <outprefix> <metres>
   prints one JSON line: for each side, the pixels changed (sum of |RGB| over 30) and the largest change */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { LAUNCH } from '../../testlib.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [oldp, newp, out, nPl] = process.argv.slice(2);
if (!oldp || !newp || !out || !nPl) { console.log('usage: node tools/probes/flipview.mjs <old.glb> <new.glb> <outprefix> <metres>'); process.exit(2); }
const FILES = { '/old.glb': path.resolve(oldp), '/new.glb': path.resolve(newp) };
const PAGE = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#8a8f96}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
r.setPixelRatio(2); r.setSize(390, 844); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(r.domElement);
const W = r.domElement.width, H = r.domElement.height;
const sc = new THREE.Scene(); sc.background = new THREE.Color(0x8a8f96);
sc.add(new THREE.HemisphereLight(0xfff4e8, 0x40382c, 1.3));
const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(3, 6, 4); sc.add(key);
const cam = new THREE.PerspectiveCamera(72, W / H, 0.05, 80);
const L = new GLTFLoader(); L.setMeshoptDecoder(MeshoptDecoder);
const load = (u) => new Promise((ok, no) => L.load(u, ok, undefined, no));
const c2 = document.createElement('canvas'); c2.width = W; c2.height = H; const x2 = c2.getContext('2d', { willReadFrequently: true });
const grab = () => { r.render(sc, cam); x2.drawImage(r.domElement, 0, 0); return x2.getImageData(0, 0, W, H).data.slice(); };
window.views = async (D) => {
  const A = await load('/old.glb'), B = await load('/new.glb');
  for (const g of [A.scene, B.scene]) { g.traverse(o => { if (o.isMesh) o.frustumCulled = false; }); sc.add(g); g.updateMatrixWorld(true); }
  const box = new THREE.Box3().setFromObject(B.scene), c = box.getCenter(new THREE.Vector3());
  const eyeY = Math.min(1.55, box.max.y + 0.2), out = { metres: D, sides: [] };
  for (const [nm, a] of [['front', 0], ['right', Math.PI / 2], ['back', Math.PI], ['left', -Math.PI / 2]]) {
    cam.position.set(c.x + Math.sin(a) * D, eyeY, c.z + Math.cos(a) * D); cam.lookAt(c.x, c.y, c.z); cam.updateProjectionMatrix();
    A.scene.visible = true; B.scene.visible = false; const pa = grab();
    A.scene.visible = false; B.scene.visible = true; const pb = grab();
    let n = 0, mx = 0, x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let i = 0, j = 0; i < pa.length; i += 4, j++) { const d = Math.abs(pa[i] - pb[i]) + Math.abs(pa[i+1] - pb[i+1]) + Math.abs(pa[i+2] - pb[i+2]);
      if (d > mx) mx = d; if (d > 30) { n++; const x = j % W, y = (j / W) | 0; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } }
    const side = { side: nm, changed: n, maxDiff: mx };
    if (n > 0) { const pad = 60, cx0 = Math.max(0, x0 - pad), cy0 = Math.max(0, y0 - pad), cw = Math.min(W, x1 + pad) - cx0, ch = Math.min(H, y1 + pad) - cy0;
      const cv = document.createElement('canvas'); cv.width = cw * 2 + 8; cv.height = ch; const cx = cv.getContext('2d'); cx.fillStyle = '#202020'; cx.fillRect(0, 0, cv.width, ch);
      cx.putImageData(new ImageData(new Uint8ClampedArray(pa), W, H), -cx0, -cy0, cx0, cy0, cw, ch);
      cx.putImageData(new ImageData(new Uint8ClampedArray(pb), W, H), cw + 8 - cx0, -cy0, cx0, cy0, cw, ch);
      side.png = cv.toDataURL('image/png'); side.box = [cx0, cy0, cw, ch]; }
    out.sides.push(side);
  }
  return out;
};
window.ready = true;
</script>`;
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/' || u === '/index.html') { s.writeHead(200, { 'content-type': 'text/html' }); return s.end(PAGE); }
  const f = FILES[u] || path.join(ROOT, u);
  if (!FILES[u] && (!f.startsWith(ROOT + path.sep) || !u.startsWith('/node_modules/'))) { s.writeHead(404); return s.end(); }
  if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
}).listen(0);
const base = `http://127.0.0.1:${srv.address().port}/`;
const browser = await chromium.launch(LAUNCH);
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(base);
await page.waitForFunction(() => window.ready, null, { timeout: 120000 });
const res = await page.evaluate((d) => window.views(d), +(nPl || 3));
res.sides.forEach((sh) => { if (sh.png) { fs.writeFileSync(`${out}-${sh.side}.png`, Buffer.from(sh.png.split(',')[1], 'base64')); delete sh.png; } });
res.errors = errs;
console.log(JSON.stringify(res));
await browser.close(); srv.close();
