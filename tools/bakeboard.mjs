/* v21.8 — A FLAT DISPLAY BOARD, BAKED (Chad's amulet display tray). OFFLINE.

   Chad's tray is a Meshy-style scan: one 1.90 x 1.10 m board of red velvet in
   a frame with fifty framed amulets in low relief, 792k triangles over one
   texture atlas. The shop needs dozens of them (the glass counters' two
   levels, the wall cabinets' shelves), and the scan does not simplify: at
   the ~7k triangles a crowd of them can afford, every amulet's outline
   collapses and the paint is cut by the new edges (photographed: a tray of
   torn polygons). But a tray IS a flat board — its relief is a centimetre at
   shop scale — so the board is rendered once, front-on and orthographic, from
   the FULL scan: its colour (the base colour map, unlit), its surface (the
   view-space normal, with the scan's own normal map), and its metal and
   roughness (the scan's own sheet, raw). In the game a tray is a thin box
   with those three on its face: the same picture as the scan from the front,
   lit by the shop, its amulets standing in relief through the normal map —
   for twelve triangles.
     node tools/bakeboard.mjs <in.glb> <outDir> [width=2048]
   writes <outDir>/board_color.png, board_normal.png, board_mr.png and
   board.json (the board's size in the scan's units). Drawn at TWICE the
   width and brought down by sharp (Lanczos), so an amulet's edge is
   anti-aliased where the renderer alone would stair-step it. BACK=1 bakes
   the -z face instead (the scene turned half a turn about y first).      */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { LAUNCH } from '../testlib.mjs';
import { createServer } from 'http';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { extname, resolve, join } from 'path';
const [IN, OUTDIR, Ws] = process.argv.slice(2);
const W = +(Ws || 2048), SS = 2, WR = W * SS;
const BACK = !!process.env.BACK;
const ROOT = resolve('.');
await mkdir(OUTDIR, { recursive: true });
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.glb': 'model/gltf-binary' };
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const path = p === '/model.glb' ? resolve(IN) : join(ROOT, p); const buf = await readFile(path); res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><style>html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, alpha: true });
renderer.setPixelRatio(1);
document.body.appendChild(renderer.domElement);
new GLTFLoader().load('/model.glb', (g) => {
  const scene = new THREE.Scene();
  if (${BACK}) g.scene.rotation.y = Math.PI;
  scene.add(g.scene); scene.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(g.scene), sz = bb.getSize(new THREE.Vector3());
  const H = Math.round(${WR} * sz.y / sz.x);
  renderer.setSize(${WR}, H);
  const cam = new THREE.OrthographicCamera(bb.min.x, bb.max.x, bb.max.y, bb.min.y, 0.001, 100);
  cam.position.set(0, 0, bb.max.z + 1); cam.lookAt(0, 0, -1); cam.updateMatrixWorld(true);
  // (the camera looks down -z with +y up: world = view orientation, so a normal's x,y,z ARE the tangent-space ones)
  const src = [];
  g.scene.traverse(o => { if (o.isMesh) src.push([o, o.material]); });
  const pass = (mk, linear) => {
    for (const [o, m] of src) o.material = mk(m);
    renderer.outputColorSpace = linear ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);
    renderer.render(scene, cam);
    return renderer.domElement.toDataURL('image/png');
  };
  const raw = (t) => { if (!t) return null; const c = t.clone(); c.colorSpace = THREE.NoColorSpace; c.needsUpdate = true; return c; };
  window.__out = {
    w: ${WR}, h: H, size: [sz.x, sz.y, sz.z], min: [bb.min.x, bb.min.y, bb.min.z],
    color: pass(m => new THREE.MeshBasicMaterial({ map: m.map, side: THREE.DoubleSide }), false),
    normal: pass(m => new THREE.MeshNormalMaterial({ normalMap: m.normalMap || null, side: THREE.FrontSide }), true),
    mr: pass(m => new THREE.MeshBasicMaterial({ map: raw(m.metalnessMap || m.roughnessMap), color: (m.metalnessMap || m.roughnessMap) ? 0xffffff : 0x80ff80, side: THREE.DoubleSide }), true)
  };
}, undefined, e => { window.__out = { err: String(e) }; });
</script></body></html>`;
const br = await chromium.launch(LAUNCH);
const p = await br.newPage({ viewport: { width: 1200, height: 800 } });
p.on('pageerror', e => console.log('ERR', String(e)));
await p.route('**/v.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/v.html`);
await p.waitForFunction(() => window.__out, null, { timeout: 900000 });
const out = await p.evaluate(() => window.__out);
if (out.err) throw new Error(out.err);
const H = Math.round(out.h / SS);
for (const k of ['color', 'normal', 'mr']) {
  const big = Buffer.from(out[k].split(',')[1], 'base64');
  await writeFile(join(OUTDIR, `board_${k}_x${SS}.png`), big);
  await sharp(big).resize(W, H, { kernel: 'lanczos3' }).png().toFile(join(OUTDIR, `board_${k}.png`));
}
await writeFile(join(OUTDIR, 'board.json'), JSON.stringify({ w: W, h: H, size: out.size, min: out.min, back: BACK }, null, 2));
console.log(`bakeboard: ${W} x ${H} (drawn ${out.w} x ${out.h}), board ${out.size.map(v => v.toFixed(4)).join(' x ')} (scan units)${BACK ? ', back face' : ''}`);
await br.close(); srv.close();
