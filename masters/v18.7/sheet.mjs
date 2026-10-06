// v18.7 · contact sheet of a rig: one clip at N times, from one angle, framed
// either on the whole body or on a close box. Grid PNG + hips/feet numbers.
//   node masters/v18.7/sheet.mjs file.glb out.png clip "t1,t2,.." [deg] [pitch] [close=headY,radius] [--flat]
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { LAUNCH } from '../../testlib.mjs';
const [FILE, OUT, CLIP, TIMES, DEG = '20', PITCH = '6', CLOSE = ''] = process.argv.slice(2);
const FLAT = process.argv.includes('--flat');
const ROOT = resolve('.');
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.glb': 'model/gltf-binary' };
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const path = p === '/model.glb' ? resolve(FILE) : resolve(ROOT + p); const b = await readFile(path); res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const S = 360;
const HTML = `<!doctype html><html><head><style>html,body{margin:0;background:#555}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setSize(${S}, ${S});
r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.2; document.body.appendChild(r.domElement);
const sc = new THREE.Scene(); sc.background = new THREE.Color(0x5a5f68);
sc.add(new THREE.HemisphereLight(0xffffff, 0x404048, 1.8)); const k = new THREE.DirectionalLight(0xffffff, 2.4); k.position.set(2, 4, 3); sc.add(k);
const grid = new THREE.GridHelper(4, 20, 0x222222, 0x333333); sc.add(grid);
const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
const ld = new GLTFLoader(); ld.setMeshoptDecoder(MeshoptDecoder);
ld.load('/model.glb', g => {
  const root = g.scene; sc.add(root);
  if (${FLAT}) root.traverse(o => { if (o.isMesh) { o.material = new THREE.MeshStandardMaterial({ color: 0xcfc6bb, roughness: 0.6 }); } });
  const mixer = new THREE.AnimationMixer(root); const acts = {}; for (const c of g.animations) acts[c.name] = mixer.clipAction(c);
  let hips = null, feet = []; root.traverse(o => { if (o.isBone && /Hips$/.test(o.name)) hips = o; if (o.isBone && /(Foot|ToeBase)$/.test(o.name)) feet.push(o); });
  window.clips = g.animations.map(a => a.name + ':' + a.duration.toFixed(2));
  window.shot = (clip, t, deg, pitch, close) => {
    if (clip && acts[clip]) { for (const a of Object.values(acts)) a.stop(); const a = acts[clip]; a.reset().play(); a.paused = true; a.time = t; mixer.update(0); }
    root.updateMatrixWorld(true);
    const v = new THREE.Vector3(); let c, d;
    if (close) { const [cy, rad] = close.split(',').map(Number); c = new THREE.Vector3(0, cy, 0); if (hips) { hips.getWorldPosition(v); c.x = v.x; c.z = v.z; } d = rad / Math.tan(THREE.MathUtils.degToRad(15)); }
    else { c = new THREE.Vector3(0, 0.85, 0); if (hips) { hips.getWorldPosition(v); c.x = v.x; c.z = v.z; c.y = Math.max(0.6, v.y); } d = 4.2; }
    const a2 = THREE.MathUtils.degToRad(deg), p2 = THREE.MathUtils.degToRad(pitch);
    cam.position.set(c.x + Math.sin(a2) * Math.cos(p2) * d, c.y + Math.sin(p2) * d, c.z + Math.cos(a2) * Math.cos(p2) * d); cam.lookAt(c); cam.updateProjectionMatrix();
    r.render(sc, cam);
    const out = {}; if (hips) { hips.getWorldPosition(v); out.hips = v.toArray().map(x => +x.toFixed(3)); }
    out.feetY = feet.map(f => +f.getWorldPosition(v).y.toFixed(3)); out.feetZ = feet.map(f => +f.getWorldPosition(v).z.toFixed(3)); return out;
  };
  window.ready = true;
}, undefined, e => { window.err = String(e); window.ready = true; });
</script></body></html>`;
const br = await chromium.launch(LAUNCH); const p = await br.newPage({ viewport: { width: S, height: S } });
await p.route('**/s.html', rt => rt.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/s.html`);
await p.waitForFunction(() => window.ready, null, { timeout: 600000 });
console.log(await p.evaluate(() => window.err || window.clips));
const ts = TIMES.split(',').map(Number); const shots = [];
for (const t of ts) { const info = await p.evaluate(([c, t, d, pi, cl]) => window.shot(c, t, d, pi, cl), [CLIP, t, +DEG, +PITCH, CLOSE]);
  const buf = await p.screenshot(); shots.push(buf); console.log(`t ${t}`, JSON.stringify(info)); }
await br.close(); srv.close();
const sharp = (await import('sharp')).default; const cols = Math.min(ts.length, 5), rows = Math.ceil(ts.length / cols);
await sharp({ create: { width: cols * S, height: rows * S, channels: 3, background: '#000' } })
  .composite(shots.map((b, i) => ({ input: b, left: (i % cols) * S, top: Math.floor(i / cols) * S }))).png().toFile(OUT);
console.log('wrote', OUT);
