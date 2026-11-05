/* v24.48 · WHAT A FAULT IS MADE OF — Grandmaster Pho's picture, framed exactly as tools/clipsheet.mjs --frame=legs frames
   it (so a fault a reader named in a large picture is found at the same pixels), drawn a second time with every triangle
   coloured by its own number: the triangles inside a box of the picture are listed by how much of the box they cover,
   front or back face, each with its three points' rest place, posed place, edge stretch and the bones they ride; and the
   picture is written with those triangles tinted red and the box drawn, to prove the list IS the fault.
     node tools/probes/phoid.mjs <file.glb> <outPrefix> --take=<take|REST> --t=<seconds> --view=<deg:pitch> [--rect=x0,y0,x1,y1]
       [--size=760] [--min=6 (pixels a triangle must cover to be listed)] [--top=40]
   writes <outPrefix>.png (the tinted picture) and <outPrefix>.json; CHROMIUM_PATH as for every probe. */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const [FILE, OUT] = process.argv.slice(2), arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
if (!FILE || !OUT) { console.error('usage: node tools/probes/phoid.mjs <file.glb> <outPrefix> --take=T --t=s --view=deg:pitch [--rect=x0,y0,x1,y1] [--size=760]'); process.exit(1); }
const SIZE = +arg('size', 760), TAKE = arg('take', 'REST'), T = +arg('t', 0), VIEW = arg('view', '0:2').split(':').map(Number), MIN = +arg('min', 6), TOP = +arg('top', 40);
const RECT = arg('rect', `0,0,${SIZE},${SIZE}`).split(',').map(Number);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..'), MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary' };
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const path = p === '/model.glb' ? resolve(FILE) : resolve(ROOT + p);
  if (p !== '/model.glb' && !path.startsWith(ROOT + '/node_modules/')) throw new Error('outside');
  const buf = await readFile(path); res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end('no'); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#6a6f78}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body><script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const S = ${SIZE}, RECT = ${JSON.stringify(RECT)}, MIN = ${MIN}, TOP = ${TOP};
const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(S, S); document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const hemi = new THREE.HemisphereLight(0xffffff, 0x404048, 2.0); scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
const fill = new THREE.DirectionalLight(0xbcd0ff, 0.8); fill.position.set(-4, 2, -3); scene.add(fill);
const grid = new THREE.GridHelper(4, 8, 0x333333, 0x4a4a4a); scene.add(grid);
const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('/model.glb', g => { const root = g.scene; scene.add(root); root.updateMatrixWorld(true);
  const parts = []; root.traverse(o => { if (o.isSkinnedMesh) parts.push(o); });
  /* each part's ID twin: the same skin, every triangle its own three points, coloured by (part, triangle) + 1 */
  const ids = [], idMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }); idMat.toneMapped = false;
  idMat.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\\ngl_FragColor.a = gl_FrontFacing ? 1.0 : 0.5;'); };
  let base = 0; const partBase = [];
  for (const o of parts) { const geo = o.geometry, idx = geo.index.array, nt = idx.length / 3, ng = new THREE.BufferGeometry();
    for (const nm of ['position', 'skinIndex', 'skinWeight']) { const a = geo.attributes[nm], w = a.itemSize, arr = new (nm === 'skinIndex' ? Uint16Array : Float32Array)(idx.length * w);
      for (let k = 0; k < idx.length; k++) for (let c = 0; c < w; c++) arr[k * w + c] = a.getComponent(idx[k], c);
      ng.setAttribute(nm, new THREE.BufferAttribute(arr, w)); }
    const col = new Uint8Array(idx.length * 3); for (let t = 0; t < nt; t++) { const id = base + t + 1; for (let m = 0; m < 3; m++) { col[(3 * t + m) * 3] = id & 255; col[(3 * t + m) * 3 + 1] = (id >> 8) & 255; col[(3 * t + m) * 3 + 2] = (id >> 16) & 255; } }
    ng.setAttribute('color', new THREE.BufferAttribute(col, 3, true));
    const m = new THREE.SkinnedMesh(ng, idMat); m.bind(o.skeleton, o.bindMatrix); m.frustumCulled = false; o.parent.add(m); m.position.copy(o.position); m.quaternion.copy(o.quaternion); m.scale.copy(o.scale); m.visible = false;
    ids.push(m); partBase.push(base); base += nt; o.frustumCulled = false; }
  /* rest (bind-pose) places of every point */
  const v = new THREE.Vector3(), pos = (o, i) => { v.fromBufferAttribute(o.geometry.attributes.position, i); o.applyBoneTransform(i, v); return v.applyMatrix4(o.matrixWorld).clone(); };
  root.traverse(o => { if (o.isSkinnedMesh) o.skeleton.pose(); }); root.updateMatrixWorld(true);
  const rest = parts.map(o => { const n = o.geometry.attributes.position.count, P = new Float32Array(3 * n); for (let i = 0; i < n; i++) { const q = pos(o, i); P[3 * i] = q.x; P[3 * i + 1] = q.y; P[3 * i + 2] = q.z; } return P; });
  const mixer = new THREE.AnimationMixer(root);
  window.__go = (take, t, deg, pitch) => { mixer.stopAllAction();
    if (take === 'REST') root.traverse(o => { if (o.isSkinnedMesh) o.skeleton.pose(); });
    else { const c0 = g.animations.find(a => a.name === take); if (!c0) return { error: 'no take ' + take }; const a = mixer.clipAction(c0); a.reset(); a.play(); a.paused = true; a.time = t; mixer.update(0); }
    root.updateMatrixWorld(true);
    /* clipsheet's frame: the posed skin's box from every 40th point of the first skinned part, legs framing */
    const box = new THREE.Box3(), sk = parts[0], P0 = sk.geometry.attributes.position; for (let i = 0; i < P0.count; i += 40) { sk.getVertexPosition(i, v); v.applyMatrix4(sk.matrixWorld); box.expandByPoint(v); }
    let c = box.getCenter(new THREE.Vector3()); c = new THREE.Vector3(c.x, box.min.y + 0.32, c.z); const r = 0.38, d = r / Math.sin(THREE.MathUtils.degToRad(15)) * 1.02;
    const a2 = THREE.MathUtils.degToRad(deg), p2 = THREE.MathUtils.degToRad(pitch);
    cam.position.set(c.x + Math.sin(a2) * Math.cos(p2) * d, c.y + Math.sin(p2) * d, c.z + Math.cos(a2) * Math.cos(p2) * d); cam.lookAt(c); cam.updateProjectionMatrix();
    /* the picture as clipsheet draws it */
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2; scene.background = new THREE.Color(0x6a6f78);
    parts.forEach(o => o.visible = true); ids.forEach(o => o.visible = false); grid.visible = true; renderer.render(scene, cam);
    const gl = renderer.getContext(), shaded = new Uint8Array(S * S * 4); gl.readPixels(0, 0, S, S, gl.RGBA, gl.UNSIGNED_BYTE, shaded);
    /* the numbers */
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping; scene.background = new THREE.Color(0x000000);
    parts.forEach(o => o.visible = false); ids.forEach(o => o.visible = true); grid.visible = false; renderer.setClearColor(0x000000, 0); renderer.render(scene, cam);
    const idpx = new Uint8Array(S * S * 4); gl.readPixels(0, 0, S, S, gl.RGBA, gl.UNSIGNED_BYTE, idpx);
    parts.forEach(o => o.visible = true); ids.forEach(o => o.visible = false); grid.visible = true;
    const [x0, y0, x1, y1] = RECT, hist = new Map();
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const k = 4 * ((S - 1 - y) * S + x), id = idpx[k] | (idpx[k + 1] << 8) | (idpx[k + 2] << 16); if (!id) continue;
      const h = hist.get(id) || { front: 0, back: 0 }; if (idpx[k + 3] > 192) h.front++; else h.back++; hist.set(id, h); }
    const list = [...hist].filter(([, h]) => h.front + h.back >= MIN).sort((a, b) => (b[1].front + b[1].back) - (a[1].front + a[1].back));
    const sel = new Set(list.map(x => x[0]));
    const names = o => o.skeleton.bones.map(b => b.name);
    const tris = list.slice(0, TOP).map(([id, h]) => { let pi = partBase.length - 1; while (partBase[pi] >= id) pi--; const o = parts[pi], t = id - 1 - partBase[pi], idx = o.geometry.index.array, nm = names(o);
      const pts = [0, 1, 2].map(m => { const i = idx[3 * t + m], si = o.geometry.attributes.skinIndex, sw = o.geometry.attributes.skinWeight, q = pos(o, i), R = rest[pi];
        const bones = []; for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > 0.01) bones.push(nm[si.getComponent(i, k)] + ':' + w.toFixed(2)); }
        return { i, rest: [R[3 * i], R[3 * i + 1], R[3 * i + 2]].map(x => +x.toFixed(4)), now: q.toArray().map(x => +x.toFixed(4)), bones }; });
      const len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), st = [[0, 1], [1, 2], [2, 0]].map(([a, b]) => +(len(pts[a].now, pts[b].now) / Math.max(1e-6, len(pts[a].rest, pts[b].rest))).toFixed(2));
      return { part: pi, tri: t, front: h.front, back: h.back, stretch: st, pts }; });
    /* the tinted picture: the listed triangles red, the box outlined */
    const outPx = new Uint8ClampedArray(S * S * 4);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const k = 4 * ((S - 1 - y) * S + x), o = 4 * (y * S + x), id = idpx[k] | (idpx[k + 1] << 8) | (idpx[k + 2] << 16);
      let r0 = shaded[k], g0 = shaded[k + 1], b0 = shaded[k + 2]; if (id && sel.has(id)) { const back = idpx[k + 3] <= 192; r0 = 0.45 * r0 + 0.55 * 255; g0 = 0.45 * g0 + (back ? 0.55 * 160 : 0); b0 = 0.45 * b0; }
      const edge = (x >= x0 - 2 && x <= x1 + 1 && y >= y0 - 2 && y <= y1 + 1) && !(x >= x0 && x < x1 && y >= y0 && y < y1);
      if (edge) { r0 = 255; g0 = 255; b0 = 0; } outPx[o] = r0; outPx[o + 1] = g0; outPx[o + 2] = b0; outPx[o + 3] = 255; }
    const cv = document.createElement('canvas'); cv.width = S; cv.height = S; cv.getContext('2d').putImageData(new ImageData(outPx, S, S), 0, 0);
    /* the cloth bones (tools/robesim.mjs, Cloth_<round>_<down>): each one's turn from its bind (degrees), and the most it
       differs from a neighbour round the ring or down the column — a triangle between two bones turned apart is thrown
       apart by its distance from them */
    const cb = new Map(); for (const o of parts) o.skeleton.bones.forEach((b, k) => { const m = /^Cloth_(\\d+)_(\\d+)$/.exec(b.name); if (m && !cb.has(b.name)) cb.set(b.name, { b: +m[1], r: +m[2], M: new THREE.Matrix4().multiplyMatrices(b.matrixWorld, o.skeleton.boneInverses[k]) }); });
    let bones = null; if (cb.size) { const BA = Math.max(...[...cb.values()].map(x => x.b)) + 1, BR = Math.max(...[...cb.values()].map(x => x.r)) + 1, q = [], ang = [], diff = [];
      const Q = (b, r) => q[((b % BA) + BA) % BA][r];
      for (let b = 0; b < BA; b++) { q[b] = []; for (let r = 0; r < BR; r++) { const x = cb.get('Cloth_' + String(b).padStart(2, '0') + '_' + String(r).padStart(2, '0')); q[b][r] = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(x.M)); } }
      const da = (p, s) => 2 * Math.acos(Math.min(1, Math.abs(p.dot(s)))) * 180 / Math.PI;
      for (let r = 0; r < BR; r++) { ang[r] = []; diff[r] = []; for (let b = 0; b < BA; b++) { ang[r][b] = Math.round(da(Q(b, r), new THREE.Quaternion())); let m = 0;
        for (const [db, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { if (r + dr < 0 || r + dr >= BR) continue; m = Math.max(m, da(Q(b, r), Q(b + db, r + dr))); } diff[r][b] = Math.round(m); } }
      bones = { BA, BR, turn: ang, neighbour: diff }; }
    return { png: cv.toDataURL('image/png'), listed: list.length, covered: [...hist.values()].reduce((s, h) => s + h.front + h.back, 0), tris, bones }; };
  window.__ready = true; }, undefined, e => { window.__err = String(e); window.__ready = true; });
</script></body></html>`;
const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await br.newPage({ viewport: { width: SIZE, height: SIZE } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.route('**/x.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/x.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 900000 });
const err = await p.evaluate(() => window.__err); if (err) { console.log('ERR', err); process.exit(1); }
const r = await p.evaluate(([a, b, c, d]) => window.__go(a, b, c, d), [TAKE, T, VIEW[0], VIEW[1]]);
if (r.error) { console.log('phoid: FAIL —', r.error); process.exit(1); }
await writeFile(`${OUT}.png`, Buffer.from(r.png.split(',')[1], 'base64'));
const { png, ...rest } = r; await writeFile(`${OUT}.json`, JSON.stringify(rest, null, 1));
console.log(`phoid: ${TAKE}@${T} view ${VIEW.join(':')} box ${RECT.join(',')}: ${r.covered} px of model, ${r.listed} triangles of ${MIN}+ px; top ${Math.min(TOP, r.tris.length)} written to ${OUT}.json`);
if (r.bones) { console.log(`  cloth bones (${r.bones.BA} round x ${r.bones.BR} down): the most each differs from a neighbour, degrees (rows down, columns round from his front to his left)`);
  for (let k = 0; k < r.bones.BR; k++) console.log('   ' + String(k).padStart(2) + ' ' + r.bones.neighbour[k].map(x => String(x).padStart(4)).join('')); }
for (const t of r.tris.slice(0, 12)) console.log(`  part ${t.part} tri ${t.tri}: ${t.front} front + ${t.back} back px, stretch ${t.stretch.join('/')}, rest y ${t.pts.map(q => q.rest[1].toFixed(3)).join('/')}, bones ${t.pts[0].bones.join(' ')}`);
if (errs.length) console.log('phoid: page errors:\n' + errs.join('\n'));
await br.close(); srv.close();
