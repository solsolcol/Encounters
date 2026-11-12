/* v26.0: A BODY'S MESH AROUND ONE JOINT, DRAWN IN A POSE (Chad, 12 Nov 2026, of Grandmaster Pho's armpit seen from his
   front as he talks: "didn't you notice what's the problem here?"). The model drawn as the game draws his skin (the
   sheet's own colour, no light), and over it every edge of every triangle within `r` of the joint's rest place: grey
   where two triangles share it, RED where only one does (an edge of a hole, or of a part's own border), YELLOW where three
   or more do; every face seen from behind drawn MAGENTA (a hole in front of it, or a face turned inside out). Points are
   welded by place to a tenth of a millimetre before edges are counted (a sheet's seams split points that are one place).
     CHROMIUM_PATH=... node tools/probes/wire.mjs <file.glb> <out.png> --take=<take|REST> --t=<s> --view=<deg:pitch>
       [--joint=RightArm] [--r=0.14] [--frame=0.17 (the half-height framed, metres)] [--shift=x,y,z (the frame's middle moved
       from the joint, world metres)] [--size=1400] [--wire=0|1] [--game=1: each face drawn only on the side the game
       draws it, before MAGENTA: any magenta inside his outline is a hole the player sees through] */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const [FILE, OUT] = process.argv.slice(2).filter(a => !a.startsWith('--')), arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const GAME = arg('game', '0') === '1', SHIFT = arg('shift', '0,0,0').split(',').map(Number), SIZE = +arg('size', 1400), TAKE = arg('take', 'REST'), T = +arg('t', 0), VIEW = arg('view', '0:10').split(':').map(Number), JOINT = arg('joint', 'RightArm'), R = +arg('r', 0.14), FR = +arg('frame', 0.17), WIRE = arg('wire', '1') === '1';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..'), MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary' };
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const path = p === '/model.glb' ? resolve(FILE) : resolve(ROOT + p);
  if (p !== '/model.glb' && !path.startsWith(ROOT + '/node_modules/')) throw new Error('outside');
  const buf = await readFile(path); res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end('no'); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#00a0ff}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body><script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const S = ${SIZE};
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(S, S); document.body.appendChild(renderer.domElement);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x00a0ff);
const cam = new THREE.PerspectiveCamera(30, 1, 0.005, 50);
new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('/model.glb', g => { const root = g.scene; scene.add(root);
  const parts = []; root.traverse(o => { if (o.isSkinnedMesh) parts.push(o); });
  /* the sheet's own colour, no light, every face both sides, and a face seen from behind magenta */
  for (const o of parts) { const old = o.material; const m = new THREE.MeshBasicMaterial({ map: old.map || null, color: old.map ? 0xffffff : (old.color || 0xffffff), side: ${GAME} ? (old.side === THREE.DoubleSide ? THREE.DoubleSide : THREE.FrontSide) : THREE.DoubleSide });
    if (!${GAME}) m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace(/}\\s*$/, '  if (!gl_FrontFacing) gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\\n}'); }; o.material = m; o.frustumCulled = false; }
  if (${GAME}) scene.background = new THREE.Color(0xff00ff);
  const bone = (re) => { let b = null; root.traverse(o => { if (o.isBone && re.test(o.name) && !b) b = o; }); return b; };
  const J = bone(new RegExp('${JOINT}$'));
  const mixer = new THREE.AnimationMixer(root), v = new THREE.Vector3();
  root.updateMatrixWorld(true);
  /* the rest places, the welded points, and the edges near the joint */
  root.traverse(o => { if (o.isSkinnedMesh) o.skeleton.pose(); }); root.updateMatrixWorld(true);
  const Jr = J.getWorldPosition(new THREE.Vector3());
  const weld = new Map(), wid = [], near = [];
  parts.forEach((o, pi) => { const P = o.geometry.attributes.position, ids = new Int32Array(P.count);
    for (let i = 0; i < P.count; i++) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld); const k = Math.round(v.x * 1e4) + ',' + Math.round(v.y * 1e4) + ',' + Math.round(v.z * 1e4); let id = weld.get(k); if (id === undefined) { id = weld.size; weld.set(k, id); near.push(v.distanceTo(Jr) < ${R}); } ids[i] = id; }
    wid.push(ids); });
  const edges = new Map();
  parts.forEach((o, pi) => { const I = o.geometry.index.array, ids = wid[pi];
    for (let t = 0; t < I.length; t += 3) { const c = [I[t], I[t + 1], I[t + 2]], w = c.map(i => ids[i]); if (w[0] === w[1] || w[1] === w[2] || w[0] === w[2]) continue; if (!near[w[0]] && !near[w[1]] && !near[w[2]]) continue;
      for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) { const k = w[a] < w[b] ? w[a] + '_' + w[b] : w[b] + '_' + w[a]; const e = edges.get(k); if (e) e.n++; else edges.set(k, { n: 1, pi, i: c[a], j: c[b] }); } } });
  window.__go = (take, t, deg, pitch) => { mixer.stopAllAction();
    if (take === 'REST') root.traverse(o => { if (o.isSkinnedMesh) o.skeleton.pose(); });
    else { const c0 = g.animations.find(a => a.name === take); if (!c0) return { error: 'no take ' + take }; const a = mixer.clipAction(c0); a.reset(); a.play(); a.paused = true; a.time = t; mixer.update(0); }
    root.updateMatrixWorld(true);
    const c = J.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(${SHIFT.join(',')})), d = ${FR} / Math.sin(THREE.MathUtils.degToRad(15)), a2 = THREE.MathUtils.degToRad(deg), p2 = THREE.MathUtils.degToRad(pitch);
    cam.position.set(c.x + Math.sin(a2) * Math.cos(p2) * d, c.y + Math.sin(p2) * d, c.z + Math.cos(a2) * Math.cos(p2) * d); cam.lookAt(c); cam.updateProjectionMatrix();
    /* the edges, posed */
    const lines = { 1: [], 2: [], 3: [] }, P = (pi, i) => { parts[pi].getVertexPosition(i, v); return v.applyMatrix4(parts[pi].matrixWorld).clone(); };
    let open = 0, many = 0; for (const e of edges.values()) { const kind = e.n === 1 ? 1 : e.n === 2 ? 2 : 3; if (kind === 1) open++; if (kind === 3) many++; const p = P(e.pi, e.i), q = P(e.pi, e.j); lines[kind].push(p.x, p.y, p.z, q.x, q.y, q.z); }
    const objs = [];
    if (${WIRE}) for (const [kind, col] of [[2, 0x404040], [1, 0xff0000], [3, 0xffee00]]) { const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(lines[kind], 3));
      const m = new THREE.LineBasicMaterial({ color: col, depthTest: kind === 2, transparent: kind === 2, opacity: kind === 2 ? 0.35 : 1 }); const L = new THREE.LineSegments(gg, m); L.renderOrder = kind === 2 ? 1 : 2; scene.add(L); objs.push(L); }
    renderer.render(scene, cam); for (const o of objs) { scene.remove(o); o.geometry.dispose(); }
    return { png: renderer.domElement.toDataURL('image/png'), open, many, edges: edges.size }; };
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
if (r.error) { console.log('wire: FAIL —', r.error); process.exit(1); }
await writeFile(OUT, Buffer.from(r.png.split(',')[1], 'base64'));
console.log(`wire: ${TAKE}@${T} view ${VIEW.join(':')}: ${r.edges} edges within ${R} m of ${JOINT}; ${r.open} open (red), ${r.many} shared by three or more (yellow)`);
if (errs.length) console.log('page errors:\n' + errs.join('\n'));
await br.close(); srv.close();
