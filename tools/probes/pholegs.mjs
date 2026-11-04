/* v24.47 · GRANDMASTER PHO'S LEGS AND ROBE, COUNTED — what Chad named (4 Nov 2026: "disembodied legs and parts, or cloth
   and body clipping into each other"), counted at every moment asked, so a fault is found by a number before it is
   looked for in a picture (and then looked at, full size: a count is a lead, never a pass).

   The model is drawn flat from six sides (his front, left, back and right level with his legs, and from behind on each
   side from 20° above; 1.5 m square, his hips 0.35 m below the top) — his thigh RED, knee MAGENTA, shin ORANGE, feet YELLOW (by rest height and by what each point is
   skinned to), the robe below his waist WHITE, everything else GREY; any surface seen from behind (a back face) is drawn
   GREEN on a leg, CYAN on the robe, BLUE elsewhere; one class to a triangle (its last point's: flat, so a triangle across
   two classes is never drawn in the colours between them). Per view:
     float     every island of leg colour that holds no foot pixel and is FLOAT px or more: a piece of leg cut off in
               mid-air, or a leg seen through a hole in the cloth (Chad's "disembodied legs and parts")
     legBack   green pixels: the inside of a leg seen (through a cut, or a leg folded inside out)
     robeBack  cyan pixels: the robe seen from behind its own surface (folded inside out, or a hole into its thickness)
   and per moment, in three dimensions (every point skinned on the CPU as the GPU skins it):
     cross     the edges of his legs' surface (thigh, knee, shin, feet) that pass through a triangle of the robe: a leg
               through the cloth ("cloth and body clipping into each other"); by part, with the heights they are at
     torn      the robe's triangles with an edge stretched past TEAR times its rest length and over TEARMIN metres:
               strips, flaps and flat sheets of cloth (the edge itself, so a sliver whose short side grows is not one)
   node tools/probes/pholegs.mjs <file.glb> <moments.json> <out.json> [--size=600] [--save=dir] [--saveall]
     moments.json: { "Take": [seconds, ...], ... }; env FLOAT (25 px), TEAR (3), TEARMIN (0.04 m);
     CHROMIUM_PATH as for every probe. */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const [FILE, MOM, OUT] = process.argv.slice(2), arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
if (!FILE || !MOM || !OUT) { console.error('usage: node tools/probes/pholegs.mjs <file.glb> <moments.json> <out.json> [--size=600] [--save=dir] [--saveall]'); process.exit(1); }
const SIZE = +arg('size', 600), SAVE = arg('save', ''), SAVEALL = process.argv.includes('--saveall'), moments = JSON.parse(await readFile(MOM, 'utf8'));
const FLOAT = +(process.env.FLOAT || 25), TEAR = +(process.env.TEAR || 3), TEARMIN = +(process.env.TEARMIN || 0.04);
const VIEWS = [[0, 2], [90, 2], [180, 2], [270, 2], [135, 20], [225, 20]];
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..'), MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary' };
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const path = p === '/model.glb' ? resolve(FILE) : resolve(ROOT + p);
  if (p !== '/model.glb' && !path.startsWith(ROOT + '/node_modules/')) throw new Error('outside');
  const buf = await readFile(path); res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end('no'); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body><script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const S = ${SIZE}, V = ${JSON.stringify(VIEWS)}, FLOAT = ${FLOAT}, TEAR = ${TEAR}, TEARMIN = ${TEARMIN}, DIAG = ${process.env.DIAG ? 1 : 0}, HALF = 0.75;   // the frame: 1.5 m square round his legs
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(S, S); document.body.appendChild(renderer.domElement);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
const MESHES = [];   // per skinned mesh: { o, cls (0 other, 1 thigh, 2 knee, 3 shin, 4 foot, 5 robe), rest (bind-pose world positions), robeTris }
const pos = (o, i, v) => { v.fromBufferAttribute(o.geometry.attributes.position, i); o.applyBoneTransform(i, v); return v.applyMatrix4(o.matrixWorld); };
new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('/model.glb', g => { const root = g.scene; scene.add(root); root.updateMatrixWorld(true); window.__g = g; window.__root = root;
  const dbg = { meshes: 0, n: 0, legs: 0, feet: 0, robe: 0, robeBones: new Set(), legBones: new Set() };
  root.traverse(o => { if (!o.isSkinnedMesh) return; const bones = o.skeleton.bones, kind = bones.map(b => /Foot|Toe/.test(b.name) ? 2 : /LegGraft|(Left|Right)Leg$/.test(b.name) ? 1 : /^(Cloth|Skirt)/.test(b.name) ? 3 : 0);
    bones.forEach((b, k) => { if (kind[k] === 3) dbg.robeBones.add(b.name.replace(/_\\d+.*$/, '')); if (kind[k] === 1 || kind[k] === 2) dbg.legBones.add(b.name); });
    const geo = o.geometry, si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight, n = si.count, cls = new Uint8Array(n), rest = new Float32Array(3 * n), v = new THREE.Vector3();
    o.updateMatrixWorld(true); o.skeleton.pose(); root.updateMatrixWorld(true);
    for (let i = 0; i < n; i++) { const w = [0, 0, 0, 0]; for (let k = 0; k < 4; k++) w[kind[si.getComponent(i, k)]] += sw.getComponent(i, k);
      pos(o, i, v); rest[3 * i] = v.x; rest[3 * i + 1] = v.y; rest[3 * i + 2] = v.z;
      if (w[1] + w[2] > 0.5) cls[i] = w[2] > 0.5 ? 4 : v.y > 0.52 ? 1 : v.y > 0.44 ? 2 : 3; else if (w[3] > 0.5) cls[i] = 5; }
    const idx = geo.index ? geo.index.array : null, robeTris = [];
    if (idx) for (let t = 0; t < idx.length; t += 3) if (cls[idx[t]] === 5 && cls[idx[t + 1]] === 5 && cls[idx[t + 2]] === 5) robeTris.push(idx[t], idx[t + 1], idx[t + 2]);
    geo.setAttribute('pcls', new THREE.BufferAttribute(new Float32Array(cls), 1));
    const m = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); m.toneMapped = false;
    m.onBeforeCompile = sh => { sh.vertexShader = 'attribute float pcls;\\nflat varying float vC;\\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\\nvC = pcls;');
      sh.fragmentShader = 'flat varying float vC;\\n' + sh.fragmentShader.replace('#include <dithering_fragment>', [
        '#include <dithering_fragment>',
        'float c = floor(vC + 0.5);',
        'if (!gl_FrontFacing) { gl_FragColor = c >= 0.5 && c < 4.5 ? vec4(0.,1.,0.,1.) : (c > 4.5 ? vec4(0.,1.,1.,1.) : vec4(0.,0.,1.,1.)); }',
        'else if (c > 4.5) gl_FragColor = vec4(1.,1.,1.,1.);',
        'else if (c > 3.5) gl_FragColor = vec4(1.,1.,0.,1.);',
        'else if (c > 2.5) gl_FragColor = vec4(1.,.5,0.,1.);',
        'else if (c > 1.5) gl_FragColor = vec4(1.,0.,1.,1.);',
        'else if (c > 0.5) gl_FragColor = vec4(1.,0.,0.,1.);',
        'else gl_FragColor = vec4(.5,.5,.5,1.);'].join('\\n')); };
    const seen = new Set(), legEdges = []; if (idx) for (let t = 0; t < idx.length; t += 3) { const a = idx[t], b = idx[t + 1], c2 = idx[t + 2]; if (!(cls[a] >= 1 && cls[a] <= 4 && cls[b] >= 1 && cls[b] <= 4 && cls[c2] >= 1 && cls[c2] <= 4)) continue;
      for (const [x, y] of [[a, b], [b, c2], [c2, a]]) { const kk = Math.min(x, y) * n + Math.max(x, y); if (seen.has(kk)) continue; seen.add(kk); legEdges.push(x, y); } }
    o.material = m; o.frustumCulled = false; MESHES.push({ o, cls, rest, robeTris: new Uint32Array(robeTris), legEdges: new Uint32Array(legEdges) });
    dbg.meshes++; dbg.n += n; for (let i = 0; i < n; i++) { if (cls[i] >= 1 && cls[i] <= 3) dbg.legs++; else if (cls[i] === 4) dbg.feet++; else if (cls[i] === 5) dbg.robe++; } });
  dbg.robeBones = [...dbg.robeBones]; dbg.legBones = [...dbg.legBones]; window.__dbg = dbg;
  window.__mixer = new THREE.AnimationMixer(root); window.__ready = true; }, undefined, e => { window.__err = String(e); window.__ready = true; });
const islands = px => { const N = S * S, lab = new Int32Array(N), leg = new Uint8Array(N), foot = new Uint8Array(N), out = [];
  for (let i = 0; i < N; i++) { const r = px[4 * i], gg = px[4 * i + 1], b = px[4 * i + 2]; const isGreen = r < 60 && gg > 200 && b < 60, isLeg = (r > 200 && b < 60) || (r > 200 && gg < 60 && b > 200) || isGreen; leg[i] = isLeg ? 1 : 0; foot[i] = r > 200 && gg > 200 && b < 60 ? 1 : 0; }
  let nl = 0; const st = new Int32Array(N);
  for (let i = 0; i < N; i++) { if (!leg[i] || lab[i]) continue; nl++; let sp = 0, size = 0, hasFoot = 0, x0 = S, x1 = 0, y0 = S, y1 = 0; st[sp++] = i; lab[i] = nl;
    while (sp) { const j = st[--sp]; size++; if (foot[j]) hasFoot = 1; const x = j % S, y = (j / S) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const k of [x > 0 ? j - 1 : -1, x < S - 1 ? j + 1 : -1, y > 0 ? j - S : -1, y < S - 1 ? j + S : -1]) if (k >= 0 && leg[k] && !lab[k]) { lab[k] = nl; st[sp++] = k; } }
    /* an island the picture's edge cuts (a foot out of frame) is not counted: the frame cut it, not the model */
    if (!hasFoot && size >= FLOAT && x0 > 0 && y0 > 0 && x1 < S - 1 && y1 < S - 1) out.push({ size, box: [x0, S - 1 - y1, x1, S - 1 - y0] }); }
  return out; };
window.__shot = (take, t) => { const g = window.__g, root = window.__root, mx = window.__mixer; mx.stopAllAction();
  if (take === 'REST') { root.traverse(o => { if (o.isSkinnedMesh) o.skeleton.pose(); }); } else { const c0 = g.animations.find(a => a.name === take); if (!c0) return { error: 'no take ' + take }; const a = mx.clipAction(c0); a.reset(); a.play(); a.paused = true; a.time = t; mx.update(0); } root.updateMatrixWorld(true);
  let hb = null; root.traverse(o => { if (o.isBone && /Hips$/.test(o.name)) hb = o; }); const hp = hb.getWorldPosition(new THREE.Vector3());
  /* the 3D counts, every point skinned as the GPU skins it: each robe triangle's edges against their rest lengths (torn),
     and each edge of his legs' surface tested against the robe's triangles near it (a 2 cm grid): an edge that passes
     through the robe's surface is a leg through the cloth */
  const v = new THREE.Vector3(); let torn = 0, tornMax = 0; const cross = { thigh: 0, knee: 0, shin: 0, foot: 0, yMin: 9, yMax: -9, hits: [] };
  /* every mesh's points skinned (a model may be in parts: tools/prepmonk.mjs TWOSIDE puts the robe in a part of its own) */
  const PS = MESHES.map(M => { const o = M.o, n = M.cls.length, P = new Float32Array(3 * n); for (let i = 0; i < n; i++) { if (M.cls[i] === 0) continue; pos(o, i, v); P[3 * i] = v.x; P[3 * i + 1] = v.y; P[3 * i + 2] = v.z; } return P; });
  MESHES.forEach((M, mi) => { const P = PS[mi], T = M.robeTris, R = M.rest;
    for (let k = 0; k < T.length; k += 3) { let bad = 0, me = 0; for (const [a, b] of [[T[k], T[k + 1]], [T[k + 1], T[k + 2]], [T[k + 2], T[k]]]) {
        const r0 = Math.hypot(R[3 * a] - R[3 * b], R[3 * a + 1] - R[3 * b + 1], R[3 * a + 2] - R[3 * b + 2]), r1 = Math.hypot(P[3 * a] - P[3 * b], P[3 * a + 1] - P[3 * b + 1], P[3 * a + 2] - P[3 * b + 2]);
        if (r1 >= TEARMIN && r1 >= TEAR * r0) { bad = 1; if (r1 > me) me = r1; } }
      if (bad) { torn++; if (me > tornMax) tornMax = me; } } });
  /* the robe's triangles of every part in one 2 cm grid; every part's leg edges tested against it */
  const CELL = 0.02, grid = new Map(), TR = []; let nTR = 0;
  MESHES.forEach((M, mi) => { const P = PS[mi], T = M.robeTris;
    for (let k = 0; k < T.length; k += 3) { let x0 = 9, y0 = 9, z0 = 9, x1 = -9, y1 = -9, z1 = -9; const q9 = [];
      for (let m = 0; m < 3; m++) { const q = 3 * T[k + m]; q9.push(P[q], P[q + 1], P[q + 2]); x0 = Math.min(x0, P[q]); x1 = Math.max(x1, P[q]); y0 = Math.min(y0, P[q + 1]); y1 = Math.max(y1, P[q + 1]); z0 = Math.min(z0, P[q + 2]); z1 = Math.max(z1, P[q + 2]); }
      if (x1 - x0 > 0.3 || y1 - y0 > 0.3 || z1 - z0 > 0.3) continue;   /* a torn sliver longer than 30 cm is counted as torn, not searched */
      const id = nTR++; TR.push(q9, [mi, T[k], T[k + 1], T[k + 2]]);
      for (let x = Math.floor(x0 / CELL); x <= Math.floor(x1 / CELL); x++) for (let y = Math.floor(y0 / CELL); y <= Math.floor(y1 / CELL); y++) for (let z = Math.floor(z0 / CELL); z <= Math.floor(z1 / CELL); z++) {
        const kk = (x + 512) + 1024 * ((y + 512) + 1024 * (z + 512)); let L = grid.get(kk); if (!L) grid.set(kk, L = []); L.push(id); } } });
  const stamp = new Int32Array(nTR).fill(-1); let eid = 0;
  MESHES.forEach((M, mi) => { const P = PS[mi], E = M.legEdges;
    for (let e = 0; e < E.length; e += 2, eid++) { const a = 3 * E[e], b = 3 * E[e + 1], px0 = P[a], py0 = P[a + 1], pz0 = P[a + 2], dx = P[b] - px0, dy = P[b + 1] - py0, dz = P[b + 2] - pz0; let hit = 0;
      for (let x = Math.floor(Math.min(px0, P[b]) / CELL); x <= Math.floor(Math.max(px0, P[b]) / CELL) && !hit; x++) for (let y = Math.floor(Math.min(py0, P[b + 1]) / CELL); y <= Math.floor(Math.max(py0, P[b + 1]) / CELL) && !hit; y++) for (let z = Math.floor(Math.min(pz0, P[b + 2]) / CELL); z <= Math.floor(Math.max(pz0, P[b + 2]) / CELL) && !hit; z++) {
        const L = grid.get((x + 512) + 1024 * ((y + 512) + 1024 * (z + 512))); if (!L) continue;
        for (const id of L) { if (stamp[id] === eid) continue; stamp[id] = eid; const q = TR[2 * id];
          const e1x = q[3] - q[0], e1y = q[4] - q[1], e1z = q[5] - q[2], e2x = q[6] - q[0], e2y = q[7] - q[1], e2z = q[8] - q[2];
          const hx = dy * e2z - dz * e2y, hy = dz * e2x - dx * e2z, hz = dx * e2y - dy * e2x, det = e1x * hx + e1y * hy + e1z * hz; if (Math.abs(det) < 1e-14) continue;
          const f = 1 / det, sx = px0 - q[0], sy = py0 - q[1], sz = pz0 - q[2], u = f * (sx * hx + sy * hy + sz * hz); if (u < 0 || u > 1) continue;
          const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x, w = f * (dx * qx + dy * qy + dz * qz); if (w < 0 || u + w > 1) continue;
          const t = f * (e2x * qx + e2y * qy + e2z * qz); if (t < 0 || t > 1) continue; hit = 1; if (DIAG && cross.hits.length < 400) cross.hits.push(...TR[2 * id + 1]); break; } }
      if (hit) { const c = M.cls[E[e]]; if (c === 1) cross.thigh++; else if (c === 2) cross.knee++; else if (c === 3) cross.shin++; else cross.foot++; const yy = P[a + 1]; if (yy < cross.yMin) cross.yMin = yy; if (yy > cross.yMax) cross.yMax = yy; } } });
  cross.yMin = +cross.yMin.toFixed(2); cross.yMax = +cross.yMax.toFixed(2);
  /* the six views */
  const views = [], c = new THREE.Vector3(hp.x, Math.max(0.4, hp.y - 0.4), hp.z), d = HALF / Math.sin(THREE.MathUtils.degToRad(15));
  for (const [deg, el] of V) { const az = THREE.MathUtils.degToRad(deg), e = THREE.MathUtils.degToRad(el);
    cam.position.set(c.x + Math.sin(az) * Math.cos(e) * d, c.y + Math.sin(e) * d, c.z + Math.cos(az) * Math.cos(e) * d); cam.lookAt(c); cam.updateProjectionMatrix();
    renderer.render(scene, cam); const gl = renderer.getContext(), px = new Uint8Array(S * S * 4); gl.readPixels(0, 0, S, S, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let legBack = 0, robeBack = 0; for (let i = 0; i < px.length; i += 4) { if (px[i] < 60 && px[i + 1] > 200) { if (px[i + 2] < 60) legBack++; else if (px[i + 2] > 200) robeBack++; } }
    const fl = islands(px); views.push({ float: fl.length, floatPx: fl.reduce((s, x) => s + x.size, 0), islands: fl.slice(0, 6), legBack, robeBack }); }
  return { cross, torn, tornMax: +tornMax.toFixed(3), views }; };
window.__shotView = (take, t, vi) => { const g = window.__g, root = window.__root, mx = window.__mixer; mx.stopAllAction();
  if (take !== 'REST') { const a = mx.clipAction(g.animations.find(x => x.name === take)); a.reset(); a.play(); a.paused = true; a.time = t; mx.update(0); } root.updateMatrixWorld(true);
  let hb = null; root.traverse(o => { if (o.isBone && /Hips$/.test(o.name)) hb = o; }); const hp = hb.getWorldPosition(new THREE.Vector3());
  const c = new THREE.Vector3(hp.x, Math.max(0.4, hp.y - 0.4), hp.z), d = HALF / Math.sin(THREE.MathUtils.degToRad(15)), [deg, el] = V[vi], az = THREE.MathUtils.degToRad(deg), e = THREE.MathUtils.degToRad(el);
  cam.position.set(c.x + Math.sin(az) * Math.cos(e) * d, c.y + Math.sin(e) * d, c.z + Math.cos(az) * Math.cos(e) * d); cam.lookAt(c); cam.updateProjectionMatrix(); renderer.render(scene, cam); return true; };
</script></body></html>`;
const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await br.newPage({ viewport: { width: SIZE, height: SIZE } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.route('**/x.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/x.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 900000 });
const err = await p.evaluate(() => window.__err); if (err) { console.log('ERR', err); process.exit(1); }
const dbg = await p.evaluate(() => window.__dbg);
console.log(`pholegs: ${dbg.meshes} skinned mesh(es), ${dbg.n} points: legs ${dbg.legs}, feet ${dbg.feet}, robe ${dbg.robe} (robe bones ${dbg.robeBones.join(' ')}; leg bones ${dbg.legBones.join(' ')})`);
if (!dbg.legs || !dbg.robe || !dbg.feet) { console.log('pholegs: FAIL — a class counted nothing (legs, feet or robe); the check would see nothing'); process.exit(1); }
if (SAVE) await mkdir(SAVE, { recursive: true });
const res = {}; const tot = { float: 0, floatPx: 0, legBack: 0, robeBack: 0, out: 0, torn: 0, bad: 0, n: 0 };
for (const [take, ts] of Object.entries(moments)) for (const t of ts) {
  const r = await p.evaluate(([a, b]) => window.__shot(a, b), [take, t]); if (r.error) { console.log('pholegs: FAIL —', r.error); process.exit(1); }
  res[`${take}@${t}`] = r; tot.n++;
  const fl = r.views.reduce((s, x) => s + x.float, 0), flp = r.views.reduce((s, x) => s + x.floatPx, 0), lb = r.views.reduce((s, x) => s + x.legBack, 0), rb = r.views.reduce((s, x) => s + x.robeBack, 0), o = r.cross.thigh + r.cross.knee + r.cross.shin + r.cross.foot;
  tot.float += fl; tot.floatPx += flp; tot.legBack += lb; tot.robeBack += rb; tot.out += o; tot.torn += r.torn; if (fl || o || r.torn) tot.bad++;
  console.log(`${take.padEnd(28)} ${t.toFixed(2).padStart(6)}  floating ${String(fl).padStart(2)} (${String(flp).padStart(5)} px)  leg inside ${String(lb).padStart(5)}  robe inside-out ${String(rb).padStart(5)}  through the cloth ${String(o).padStart(4)} (thigh ${r.cross.thigh}, knee ${r.cross.knee}, shin ${r.cross.shin}, feet ${r.cross.foot}${o ? `; at ${r.cross.yMin}–${r.cross.yMax} m` : ''})  torn ${String(r.torn).padStart(4)}`);
  if (SAVE) for (let vi = 0; vi < VIEWS.length; vi++) { const vv = r.views[vi]; if (!SAVEALL && !vv.float && !(o && vi < 4)) continue;
    await p.evaluate(([a, b, c]) => window.__shotView(a, b, c), [take, t, vi]); await p.screenshot({ path: `${SAVE}/${take}_${t.toFixed(2)}_v${vi}.png` }); } }
console.log(`pholegs: ${tot.n} moments x ${VIEWS.length} views — floating leg pieces ${tot.float} (${tot.floatPx} px), leg inside seen ${tot.legBack} px, robe inside-out ${tot.robeBack} px, leg edges through the cloth ${tot.out}, torn robe triangles ${tot.torn}; moments with any floating piece, leg through the cloth or torn cloth: ${tot.bad}`);
if (errs.length) { console.log('pholegs: page errors:\n' + errs.join('\n')); }
await writeFile(OUT, JSON.stringify(res)); await br.close(); srv.close();
