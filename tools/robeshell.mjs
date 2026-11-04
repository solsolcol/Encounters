// v24.47 · GRANDMASTER PHO'S ROBE AS ONE LAYER OF CLOTH BELOW HIS WAIST. Run after tools/leggraft.mjs mesh and before
// tools/robesim.mjs (masters/v24.47/make.sh):
//   node tools/robeshell.mjs <in.glb> <out.glb>
//
// WHY. His scan's robe is a closed shell about a centimetre thick: an outer surface, and behind it an inner surface facing
// his body, which at the hem was fused to his shins. With his real legs under it (Chad, 4 Nov 2026, "Option 2"), that
// inner surface is the robe's worst part, and nobody can see it from outside: the real legs cut through it (counted by
// tools/probes/pholegs.mjs, even standing still), it shows as dark shards inside the hem from a little below, and when a
// leg lifts the hem it is what stretches into the flat sheets and flaps (Chad: "cloth and body clipping into each other").
// A real robe is one layer of cloth with its inside showing its own weave.
//
// WHAT IT DOES. Every triangle of the robe below his waist (all three points riding the skirt's chains, robeskin SKIRT,
// at rest under WAISTY) is drawn from outside — from every side and from above (azimuths every AZSTEP degrees at the
// elevations ELEV, and straight down), in an orthographic view RES pixels square, with the rest of him that closes and
// fills it (his trunk, head, legs, feet) but never his arms or the drape hanging over it, so nothing that moves away can
// hide a piece of its outside — and a triangle that is never the nearest surface from any of those sides, and that does
// not face out (its normal's share away from his hips' axis under OUTWARD: the inner surface faces in, the caps of
// tools/leggraft.mjs face down), is taken out. A covered piece of the robe's outside (under a fold) faces out and stays.
// What is left is one layer of cloth; tools/prepmonk.mjs TWOSIDE then draws it from both sides, so its inside is the
// back of the same cloth (a lining 2 mm behind it was tried: where the hem curls it tore into shards). Nothing else is
// touched: no point moves and no weight changes (the proof that the picture from outside is unchanged: PLAN.md there).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { compactPrimitive } from '@gltf-transform/functions';
import { Matrix4, Vector3 } from 'three';
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node tools/robeshell.mjs <in.glb> <out.glb>'); process.exit(1); }
const E = (k, d) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
const WAISTY = E('WAISTY', 0.93), RES = E('RES', 2048), AZSTEP = E('AZSTEP', 10), OUTWARD = E('OUTWARD', 0.3);
const ELEV = (process.env.ELEV || '0,15,35,60').split(',').map(Number);
const log = (...a) => console.log(...a);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(IN), root = doc.getRoot();
if (root.listMeshes().length !== 1 || root.listMeshes()[0].listPrimitives().length !== 1) throw new Error('robeshell: one mesh with one primitive');
const prim = root.listMeshes()[0].listPrimitives()[0], skin = root.listSkins()[0], joints = skin.listJoints(), names = joints.map(j => j.getName());
const P = prim.getAttribute('POSITION').getArray(), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0'), IDX = prim.getIndices().getArray(), n = P.length / 3, NT = IDX.length / 3;
if (!(P instanceof Float32Array)) throw new Error('robeshell: positions must be plain floats (run before prep)');
const skirtJ = names.map(x => /^Skirt/.test(x)); if (!skirtJ.some(Boolean)) throw new Error('robeshell: no Skirt bones (run on tools/robeskin.mjs SKIRT output)');
const IB = joints.map((_, k) => new Matrix4().fromArray(skin.getInverseBindMatrices().getArray(), k * 16));
const hip = new Vector3().setFromMatrixPosition(IB[names.findIndex(x => /Hips$/.test(x))].clone().invert());
/* the skirt's points and triangles */
const onSkirt = new Uint8Array(n), jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); let s = 0; for (let k = 0; k < 4; k++) if (skirtJ[jj[k]]) s += ww[k]; onSkirt[i] = s > 0.5 && P[3 * i + 1] < WAISTY ? 1 : 0; }
const skirtTris = []; for (let t = 0; t < NT; t++) if (onSkirt[IDX[3 * t]] && onSkirt[IDX[3 * t + 1]] && onSkirt[IDX[3 * t + 2]]) skirtTris.push(t);
log(`robeshell: ${skirtTris.length} of ${NT} triangles are the robe below his waist`);
/* drawn: the skirt, each triangle its own colour (its number in the skirt, plus one), and, black, the rest of him that
   closes the skirt's top and fills it (his trunk, head, legs and feet) — never his arms or the drape that hangs from his
   left arm over the skirt, so nothing that moves away from it can hide a piece of its outside */
const armJ = names.map(x => /Arm|Hand|Drape|Shoulder/.test(x)), armOf = i => { J.getElement(i, jj); W.getElement(i, ww); let s = 0; for (let k = 0; k < 4; k++) if (armJ[jj[k]]) s += ww[k]; return s; };
const isSkirtTri = new Uint8Array(NT); for (const t of skirtTris) isSkirtTri[t] = 1;
const occl = []; for (let t = 0; t < NT; t++) { if (isSkirtTri[t]) continue; if ([0, 1, 2].some(m => armOf(IDX[3 * t + m]) > 0.5)) continue; occl.push(t); }
const ND = skirtTris.length + occl.length, pos = new Float32Array(ND * 9), col = new Uint8Array(ND * 9);
skirtTris.forEach((t, k) => { const id = k + 1; for (let m = 0; m < 3; m++) { const i = IDX[3 * t + m]; pos.set(P.subarray(3 * i, 3 * i + 3), 9 * k + 3 * m); col[9 * k + 3 * m] = id & 255; col[9 * k + 3 * m + 1] = (id >> 8) & 255; col[9 * k + 3 * m + 2] = (id >> 16) & 255; } });
occl.forEach((t, k0) => { const k = skirtTris.length + k0; for (let m = 0; m < 3; m++) { const i = IDX[3 * t + m]; pos.set(P.subarray(3 * i, 3 * i + 3), 9 * k + 3 * m); } });
log(`robeshell: drawn with ${occl.length} triangles of the rest of him round it (his arms and the drape left out)`);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srv = createServer(async (req, res) => { try { const p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/pos.bin') { res.writeHead(200, { 'content-type': 'application/octet-stream' }); res.end(Buffer.from(pos.buffer)); return; }
  if (p === '/col.bin') { res.writeHead(200, { 'content-type': 'application/octet-stream' }); res.end(Buffer.from(col.buffer)); return; }
  const path = resolve(ROOT + p); if (!path.startsWith(ROOT + '/node_modules/three/')) throw new Error('outside');
  res.writeHead(200, { 'content-type': 'text/javascript' }); res.end(await readFile(path)); } catch { res.writeHead(404); res.end('no'); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const views = []; for (const el of ELEV) for (let az = 0; az < 360; az += AZSTEP) views.push([az, el]); views.push([0, 89.9]);
const HTML = `<!doctype html><html><head><meta charset="utf-8"><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js"}}</script></head><body><script type="module">
import * as THREE from 'three';
const S = ${RES}, NS = ${skirtTris.length}, V = ${JSON.stringify(views)}, C = ${JSON.stringify([hip.x, 0.5, hip.z])};
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(S, S); document.body.appendChild(renderer.domElement);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const [pb, cb] = await Promise.all(['/pos.bin', '/col.bin'].map(u => fetch(u).then(r => r.arrayBuffer())));
const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pb), 3)); g.setAttribute('color', new THREE.BufferAttribute(new Uint8Array(cb), 3, true));
const m = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }); m.toneMapped = false; scene.add(new THREE.Mesh(g, m));
const cam = new THREE.OrthographicCamera(-0.75, 0.75, 0.75, -0.75, 0.01, 10), seen = new Uint8Array(NS + 1), px = new Uint8Array(S * S * 4);
for (const [az, el] of V) { const a = az * Math.PI / 180, e = el * Math.PI / 180;
  cam.position.set(C[0] + Math.sin(a) * Math.cos(e) * 4, C[1] + Math.sin(e) * 4, C[2] + Math.cos(a) * Math.cos(e) * 4); cam.up.set(0, 1, 0); if (el > 89) cam.up.set(0, 0, -1); cam.lookAt(C[0], C[1], C[2]); cam.updateProjectionMatrix();
  renderer.render(scene, cam); const gl = renderer.getContext(); gl.readPixels(0, 0, S, S, gl.RGBA, gl.UNSIGNED_BYTE, px);
  for (let i = 0; i < px.length; i += 4) { const id = px[i] | (px[i + 1] << 8) | (px[i + 2] << 16); if (id) seen[id] = 1; } }
window.__seen = Array.from(seen); window.__done = true;
</script></body></html>`;
const br = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await br.newPage({ viewport: { width: 64, height: 64 } }); const errs = []; page.on('pageerror', e => errs.push(String(e)));
await page.route('**/x.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await page.goto(`http://127.0.0.1:${srv.address().port}/x.html`);
await page.waitForFunction(() => window.__done || null, null, { timeout: 1800000, polling: 2000 }).catch(() => {});
if (errs.length) throw new Error('robeshell: page errors: ' + errs.join(' | '));
const seen = await page.evaluate(() => window.__seen); await br.close(); srv.close();
if (!seen) throw new Error('robeshell: the views never finished');
/* the triangles to take out: never seen from outside, and not facing out */
const drop = new Uint8Array(NT); let nSeen = 0, nDrop = 0, nKeptCovered = 0; const byY = {};
skirtTris.forEach((t, k) => { if (seen[k + 1]) { nSeen++; return; }
  const [a, b, c] = [0, 1, 2].map(m => IDX[3 * t + m]), A = new Vector3().fromArray(P, 3 * a), B = new Vector3().fromArray(P, 3 * b), Cc = new Vector3().fromArray(P, 3 * c);
  const nrm = new Vector3().crossVectors(B.clone().sub(A), Cc.clone().sub(A)).normalize(), mid = A.clone().add(B).add(Cc).multiplyScalar(1 / 3), rad = new Vector3(mid.x - hip.x, 0, mid.z - hip.z).normalize();
  if (nrm.dot(rad) >= OUTWARD) { nKeptCovered++; return; }
  drop[t] = 1; nDrop++; const y = (Math.floor(mid.y / 0.1) * 0.1).toFixed(1); byY[y] = (byY[y] || 0) + 1; });
log(`robeshell: ${views.length} views at ${RES} px — ${nSeen} skirt triangles seen from outside; ${nKeptCovered} unseen but facing out (covered, kept); ${nDrop} unseen and facing in or down taken out (by height: ${Object.keys(byY).sort().map(y => `${y} ${byY[y]}`).join(', ')})`);
const keep = []; for (let t = 0; t < NT; t++) if (!drop[t]) keep.push(IDX[3 * t], IDX[3 * t + 1], IDX[3 * t + 2]);
const ia = prim.getIndices(); ia.setArray(n > 65535 ? new Uint32Array(keep) : new Uint16Array(keep));
compactPrimitive(prim);
await io.write(OUT, doc);
log(`robeshell: wrote ${OUT} — ${prim.getIndices().getCount() / 3} triangles, ${prim.getAttribute('POSITION').getCount()} points (was ${NT}, ${n})`);
