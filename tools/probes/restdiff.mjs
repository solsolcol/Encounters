/* v24.47 · TWO MODELS AT REST, PIXEL FOR PIXEL — the same rigged model before and after a change that must not change how
   it looks from outside (tools/robeshell.mjs taking out the robe's hidden inner layer): each file's skeleton put in its
   bind pose, drawn with its own materials (unlit: the base colour as it is, so a light cannot hide a difference), from
   twelve sides at three heights (level, 20° and 45° above), and every pixel compared. Prints, per view, the pixels that
   differ by more than TOL in any channel; with --save=dir, the views that differ, before | after | the difference in red.
     node tools/probes/restdiff.mjs <a.glb> <b.glb> [--size=1024] [--save=dir]   (TOL env, default 2; CHROMIUM_PATH; TWOSIDE_A,
     TWOSIDE_B: a bone pattern, that file drawn as tools/prepmonk.mjs TWOSIDE cuts it) */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile, mkdir } from 'fs/promises';
import { extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const [A, B] = process.argv.slice(2), arg = (k, d) => { const x = process.argv.find(y => y.startsWith(`--${k}=`)); return x ? x.slice(k.length + 3) : d; };
if (!A || !B) { console.error('usage: node tools/probes/restdiff.mjs <a.glb> <b.glb> [--size=1024] [--save=dir]'); process.exit(1); }
const SIZE = +arg('size', 1024), SAVE = arg('save', ''), TOL = +(process.env.TOL || 2);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]); const path = p === '/a.glb' ? resolve(A) : p === '/b.glb' ? resolve(B) : resolve(ROOT + p);
  if (!['/a.glb', '/b.glb'].includes(p) && !path.startsWith(ROOT + '/node_modules/three/')) throw new Error('outside');
  res.writeHead(200, { 'content-type': extname(path) === '.glb' ? 'model/gltf-binary' : 'text/javascript' }); res.end(await readFile(path)); } catch { res.writeHead(404); res.end('no'); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const VIEWS = []; for (const el of [0, 20, 45]) for (let az = 0; az < 360; az += 30) VIEWS.push([az, el]);
const HTML = `<!doctype html><html><head><meta charset="utf-8"><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body style="margin:0;background:#000"><script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const S = ${SIZE}, V = ${JSON.stringify(VIEWS)};
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(S, S); document.body.appendChild(renderer.domElement);
const load = u => new Promise((ok, no) => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(u, ok, undefined, no));
const TWO = ${JSON.stringify([process.env.TWOSIDE_A || '', process.env.TWOSIDE_B || ''])};
const scenes = []; for (const [fi, u] of ['/a.glb', '/b.glb'].entries()) { const g = await load(u), sc = new THREE.Scene(); sc.background = new THREE.Color(0x404040); sc.add(g.scene);
  g.scene.traverse(o => { if (o.isSkinnedMesh) { o.skeleton.pose(); o.frustumCulled = false; const m0 = o.material, m = new THREE.MeshBasicMaterial({ map: m0.map, color: m0.color, side: m0.side }); o.material = m;
    /* TWOSIDE_A / TWOSIDE_B: that file drawn as tools/prepmonk.mjs TWOSIDE will cut it — the triangles riding the bones named drawn from both sides */
    if (TWO[fi]) { const re = new RegExp(TWO[fi]), geo = o.geometry, si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight, n = si.count, on = new Uint8Array(n), bones = o.skeleton.bones;
      for (let i = 0; i < n; i++) { let w = 0; for (let k = 0; k < 4; k++) if (re.test(bones[si.getComponent(i, k)].name)) w += sw.getComponent(i, k); on[i] = w > 0.5 ? 1 : 0; }
      const I = geo.index.array, rest = [], both = []; for (let t = 0; t < I.length; t += 3) (on[I[t]] && on[I[t + 1]] && on[I[t + 2]] ? both : rest).push(I[t], I[t + 1], I[t + 2]);
      geo.setIndex(rest.concat(both)); geo.clearGroups(); geo.addGroup(0, rest.length, 0); geo.addGroup(rest.length, both.length, 1); const m2 = m.clone(); m2.side = THREE.DoubleSide; o.material = [m, m2]; window.__two = (window.__two || 0) + both.length / 3; } } });
  g.scene.updateMatrixWorld(true); scenes.push(sc); }
const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 20), c = new THREE.Vector3(0, 0.85, 0), d = 0.95 / Math.sin(THREE.MathUtils.degToRad(15));
window.__view = (vi, which) => { const [az, el] = V[vi], a = az * Math.PI / 180, e = el * Math.PI / 180;
  cam.position.set(c.x + Math.sin(a) * Math.cos(e) * d, c.y + Math.sin(e) * d, c.z + Math.cos(a) * Math.cos(e) * d); cam.lookAt(c); cam.updateProjectionMatrix();
  renderer.render(scenes[which], cam); const gl = renderer.getContext(), px = new Uint8Array(S * S * 4); gl.readPixels(0, 0, S, S, gl.RGBA, gl.UNSIGNED_BYTE, px); return px; };
window.__cmp = (vi, tol) => { const a = window.__view(vi, 0), b = window.__view(vi, 1); let n = 0; window.__last = [a, b];
  for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) > tol || Math.abs(a[i + 1] - b[i + 1]) > tol || Math.abs(a[i + 2] - b[i + 2]) > tol) n++; return n; };
window.__ready = true;
</script></body></html>`;
const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await br.newPage({ viewport: { width: SIZE, height: SIZE } }); const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.route('**/x.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.goto(`http://127.0.0.1:${srv.address().port}/x.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 1800000, polling: 2000 });
if (errs.length) { console.log('restdiff: page errors:', errs.join(' | ')); process.exit(1); }
const two = await p.evaluate(() => window.__two || 0); if (process.env.TWOSIDE_A || process.env.TWOSIDE_B) console.log(`restdiff: ${two} triangles drawn from both sides`);
if (SAVE) await mkdir(SAVE, { recursive: true });
let total = 0; const per = [];
for (let vi = 0; vi < VIEWS.length; vi++) { const n = await p.evaluate(([v, t]) => window.__cmp(v, t), [vi, TOL]); total += n; per.push(`${VIEWS[vi][0]}°/${VIEWS[vi][1]}°: ${n}`);
  if (SAVE && n) { await p.evaluate(([v, s]) => { const [a, b] = window.__last, S = s, cv = document.createElement('canvas'); cv.width = 3 * S; cv.height = S; const cx = cv.getContext('2d');
      const put = (px, x0, diff) => { const im = cx.createImageData(S, S); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const i = ((S - 1 - y) * S + x) * 4, o = (y * S + x) * 4;
          if (diff) { const d = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]); im.data[o] = d > 6 ? 255 : a[i] >> 2; im.data[o + 1] = d > 6 ? 0 : a[i + 1] >> 2; im.data[o + 2] = d > 6 ? 0 : a[i + 2] >> 2; }
          else { im.data[o] = px[i]; im.data[o + 1] = px[i + 1]; im.data[o + 2] = px[i + 2]; } im.data[o + 3] = 255; } cx.putImageData(im, x0, 0); };
      put(a, 0, false); put(b, S, false); put(null, 2 * S, true); window.__png = cv.toDataURL('image/png'); }, [vi, SIZE]);
    const url = await p.evaluate(() => window.__png); const { writeFile } = await import('fs/promises'); await writeFile(`${SAVE}/view-${VIEWS[vi][0]}-${VIEWS[vi][1]}.png`, Buffer.from(url.split(',')[1], 'base64')); } }
console.log(`restdiff: ${VIEWS.length} views at ${SIZE} px, pixels differing by more than ${TOL}: ${total}`); console.log('  ' + per.join(', '));
await br.close(); srv.close();
