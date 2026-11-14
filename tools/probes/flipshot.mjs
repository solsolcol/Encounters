/* v26.12 · TRIANGLES TURNED, PHOTOGRAPHED BEFORE AND AFTER (Chad, 14 Nov 2026, of the turned triangles of 63 body files
   fixed and checked only by numbers: "I think your fix without visually checking the models is a little dangerous, you
   sometimes add more problems than you fix"). For a body file and its copy from before the change: the triangles whose
   corners were turned (an odd order between the two copies, found on the copies themselves), gathered into places (8 cm
   apart), and each of the biggest places photographed from outside it, on the body as its file stands (its own pose,
   skinned), textured, at two pixels a point: BEFORE (the old copy), AFTER (the new), and the after with the turned
   triangles painted red over it, to show where they are. The camera stands along the place's outward facing, is tried
   at five tilts, and is kept where most of the red is seen (a place no tilt sees is reported as hidden).
   Each place is MEASURED too: how many pixels changed between before and after, how many of those lie outside the red
   (the bodies are drawn two-sided, so turning a triangle can change only which way it is lit: nothing outside the red
   should change), and the brightness of the red's pixels before and after beside the ring of body round them.
     node tools/probes/flipshot.mjs <old.glb> <new.glb> <outprefix> [places=3]
   writes <outprefix>-<i>.png (before | after | red, side by side, 1040 px each) and prints one JSON line of measures */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { LAUNCH } from '../../testlib.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [oldp, newp, out, nPl] = process.argv.slice(2);
if (!oldp || !newp || !out) { console.log('usage: node tools/probes/flipshot.mjs <old.glb> <new.glb> <outprefix> [places=3]'); process.exit(2); }
const FILES = { '/old.glb': path.resolve(oldp), '/new.glb': path.resolve(newp) };
const PAGE = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#6a6e74}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const V = 520;
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
r.setPixelRatio(2); r.setSize(V, V); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(r.domElement);
const W = r.domElement.width, H = r.domElement.height;
const sc = new THREE.Scene(); sc.background = new THREE.Color(0x6a6e74);
sc.add(new THREE.HemisphereLight(0xfff4e8, 0x40382c, 1.3));
const key = new THREE.DirectionalLight(0xffffff, 1.7); sc.add(key); sc.add(key.target);
const cam = new THREE.PerspectiveCamera(28, 1, 0.004, 20);
const L = new GLTFLoader(); L.setMeshoptDecoder(MeshoptDecoder);
const load = (u) => new Promise((ok, no) => L.load(u, ok, undefined, no));
const meshOf = (root) => { let m = null; root.traverse(o => { if (o.isMesh && !m) m = o; }); return m; };
const c2 = document.createElement('canvas'); c2.width = W; c2.height = H; const x2 = c2.getContext('2d', { willReadFrequently: true });
const grab = () => { r.render(sc, cam); x2.drawImage(r.domElement, 0, 0); return x2.getImageData(0, 0, W, H).data; };
window.shoot = async (places) => {
  const A = await load('/old.glb'), B = await load('/new.glb');
  const ma = meshOf(A.scene), mb = meshOf(B.scene);
  for (const g of [A.scene, B.scene]) { g.traverse(o => { if (o.isMesh) o.frustumCulled = false; }); sc.add(g); g.updateMatrixWorld(true); }
  for (const m of [ma, mb]) if (m.isSkinnedMesh) m.skeleton.update();
  const ia = ma.geometry.index.array, ib = mb.geometry.index.array, T = ia.length / 3, turned = [];
  for (let t = 0; t < T; t++) { const a0 = ia[3*t], a1 = ia[3*t+1], a2 = ia[3*t+2], b0 = ib[3*t], b1 = ib[3*t+1], b2 = ib[3*t+2];
    if (a0 === b0 && a1 === b1 && a2 === b2) continue;
    if ((a0 === b1 && a1 === b2 && a2 === b0) || (a0 === b2 && a1 === b0 && a2 === b1)) continue;
    turned.push(t); }
  /* every turned triangle's skinned corners in the world, its middle and its facing (the NEW winding: the outward one) */
  const P = new THREE.Vector3(), Q = new THREE.Vector3(), R = new THREE.Vector3(), info = [];
  const wp = (i, v) => { mb.getVertexPosition(i, v); return mb.localToWorld(v); };
  for (const t of turned) { wp(ib[3*t], P); wp(ib[3*t+1], Q); wp(ib[3*t+2], R);
    const c = P.clone().add(Q).add(R).multiplyScalar(1 / 3), n = new THREE.Vector3().crossVectors(Q.clone().sub(P), R.clone().sub(P));
    info.push({ t, c, n }); }
  /* places: each triangle to the first place within 8 cm of that place's first triangle */
  const pl = [];
  for (const q of info) { let p = pl.find(p => p.seed.distanceTo(q.c) < 0.08); if (!p) pl.push(p = { seed: q.c.clone(), list: [] }); p.list.push(q); }
  pl.sort((a, b) => b.list.length - a.list.length);
  const box = new THREE.Box3().setFromObject(B.scene);
  const red = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  const res = { tris: T, turned: turned.length, places: pl.length, height: +(box.max.y - box.min.y).toFixed(3), shots: [] };
  for (let k = 0; k < Math.min(places, pl.length); k++) {
    const p = pl[k], c = new THREE.Vector3(), nf = new THREE.Vector3();
    for (const q of p.list) { c.add(q.c); nf.add(q.n); } c.multiplyScalar(1 / p.list.length);
    if (nf.lengthSq() < 1e-12) nf.set(0, 0, 1); nf.normalize();
    let rad = 0; for (const q of p.list) rad = Math.max(rad, q.c.distanceTo(c));
    const dist = Math.min(0.7, Math.max(0.16, rad * 3.2 + 0.1));
    /* the red: the turned triangles alone, on the same skin and the same bones */
    const g2 = mb.geometry.clone(), sub = []; for (const q of p.list) sub.push(ib[3*q.t], ib[3*q.t+1], ib[3*q.t+2]); g2.setIndex(sub);
    const rm = mb.isSkinnedMesh ? new THREE.SkinnedMesh(g2, red) : new THREE.Mesh(g2, red);
    if (mb.isSkinnedMesh) { rm.bindMode = mb.bindMode; rm.bind(mb.skeleton, mb.bindMatrix); }
    rm.frustumCulled = false; mb.parent.add(rm); rm.position.copy(mb.position); rm.quaternion.copy(mb.quaternion); rm.scale.copy(mb.scale); rm.updateMatrixWorld(true);
    const up = Math.abs(nf.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const ax1 = new THREE.Vector3().crossVectors(nf, up).normalize(), ax2 = new THREE.Vector3().crossVectors(nf, ax1).normalize();
    const dirs = [nf.clone()]; for (const [ax, s] of [[ax1, 1], [ax1, -1], [ax2, 1], [ax2, -1]]) dirs.push(nf.clone().applyAxisAngle(ax, s * 0.62));
    const setCam = (d) => { cam.position.copy(c).addScaledVector(d, dist); cam.up.set(0, 1, 0); if (Math.abs(d.y) > 0.95) cam.up.set(0, 0, -1); cam.lookAt(c); cam.updateProjectionMatrix();
      key.position.copy(cam.position).add(new THREE.Vector3(0.5, 0.9, 0.3)); key.target.position.copy(c); key.target.updateMatrixWorld(); };
    const redCount = (px) => { let n = 0; for (let i = 0; i < px.length; i += 4) if (px[i] > 200 && px[i+1] < 50 && px[i+2] < 50) n++; return n; };
    A.scene.visible = false; B.scene.visible = true; rm.visible = true;
    let best = -1, bd = dirs[0];
    for (const d of dirs) { setCam(d); const n = redCount(grab()); if (n > best) { best = n; bd = d; } }
    setCam(bd);
    rm.visible = false; A.scene.visible = true; B.scene.visible = false; const pa = grab().slice();
    A.scene.visible = false; B.scene.visible = true; const pb = grab().slice();
    rm.visible = true; const pr = grab().slice(); rm.visible = false;
    /* the measures */
    const isRed = new Uint8Array(W * H); for (let i = 0, j = 0; i < pr.length; i += 4, j++) isRed[j] = (pr[i] > 200 && pr[i+1] < 50 && pr[i+2] < 50) ? 1 : 0;
    const near = new Uint8Array(W * H), ring = new Uint8Array(W * H), D = 4, RG = 14;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!isRed[y * W + x]) continue;
      for (let dy = -RG; dy <= RG; dy += 2) for (let dx = -RG; dx <= RG; dx += 2) { const yy = y + dy, xx = x + dx; if (yy < 0 || xx < 0 || yy >= H || xx >= W) continue;
        const j = yy * W + xx; if (Math.abs(dx) <= D && Math.abs(dy) <= D) near[j] = 1; else ring[j] = 1; } }
    let changed = 0, outside = 0, nIn = 0, lA = 0, lB = 0, nR = 0, lR = 0, nC = 0, cA = 0, cB = 0;
    const lum = (px, i) => 0.2126 * px[i] + 0.7152 * px[i+1] + 0.0722 * px[i+2];
    for (let i = 0, j = 0; i < pa.length; i += 4, j++) {
      const d = Math.abs(pa[i] - pb[i]) + Math.abs(pa[i+1] - pb[i+1]) + Math.abs(pa[i+2] - pb[i+2]);
      if (d > 24) { changed++; if (!near[j] && !isRed[j]) outside++; else { nC++; cA += lum(pa, i); cB += lum(pb, i); } }
      if (isRed[j]) { nIn++; lA += lum(pa, i); lB += lum(pb, i); }
      else if (ring[j] && !near[j]) { nR++; lR += lum(pb, i); } }
    res.shots.push({ place: k, tris: p.list.length, at: [c.x, c.y, c.z].map(v => +v.toFixed(3)), dist: +dist.toFixed(2), redSeen: best,
      changed, changedOutsideRed: outside, lumBefore: nIn ? +(lA / nIn).toFixed(1) : null, lumAfter: nIn ? +(lB / nIn).toFixed(1) : null, lumRing: nR ? +(lR / nR).toFixed(1) : null,
      /* (over the pixels that changed, at the red: their brightness before and after, to set beside the ring's) */
      chgBefore: nC ? +(cA / nC).toFixed(1) : null, chgAfter: nC ? +(cB / nC).toFixed(1) : null });
    /* before | after | red, side by side */
    const cv = document.createElement('canvas'); cv.width = W * 3 + 16; cv.height = H; const cx = cv.getContext('2d'); cx.fillStyle = '#202020'; cx.fillRect(0, 0, cv.width, cv.height);
    [pa, pb, pr].forEach((px, i) => { const id = new ImageData(new Uint8ClampedArray(px), W, H); cx.putImageData(id, i * (W + 8), 0); });
    cx.font = 'bold 30px sans-serif'; cx.fillStyle = '#fff'; ['BEFORE', 'AFTER', 'TURNED (red)'].forEach((s, i) => cx.fillText(s, i * (W + 8) + 16, 40));
    res.shots[res.shots.length - 1].png = cv.toDataURL('image/png');
    mb.parent.remove(rm); g2.dispose();
  }
  return res;
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
const page = await browser.newPage({ viewport: { width: 520, height: 520 } });
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(base);
await page.waitForFunction(() => window.ready, null, { timeout: 120000 });
const res = await page.evaluate((n) => window.shoot(n), +(nPl || 3));
res.shots.forEach((sh, i) => { fs.writeFileSync(`${out}-${i + 1}.png`, Buffer.from(sh.png.split(',')[1], 'base64')); delete sh.png; });
res.errors = errs;
console.log(JSON.stringify(res));
await browser.close(); srv.close();
