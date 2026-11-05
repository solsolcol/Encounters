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
// RIM (below, where it runs) also takes out the rim that hugged his old shins, seen from below inside a lifted hem.
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
/* HEMKEEP=<metres> (v24.49; with HEMKEEPIN 0.03 m): the hem's ROLLED EDGE kept whole — the bottom of the robe's outer
   wall, the curve under it and the lip it turns into. Found from the WALL, in each 3 degrees of turn round his hips' axis:
   its lowest point facing out (a skirt point whose normal's share away from that axis is OUTWARD or more), and every skirt
   triangle whose middle lies within HEMKEEP above that point and no more than HEMKEEPIN inside the wall's radius there
   stays, though no view from outside sees it (the curve faces down, the lip faces in) and though it lies near his old
   shins (RIM, below, leaves it alone; FLOOR too with HEMKEEPFLOOR=1 — which left the old floor's first centimetres by
   each shin, and they showed between his shins as a grey comb in the chair sits). Cut by those two in fragments (within 2 cm of the bottom, 41 % of the underside
   and 76 % of the lip were out), what was left of the edge showed under every lifted or flared hem as loose white shards;
   his saved file's whole edge shows there as one smooth curve. The robe's lowest point itself is no guide: at his front
   it is the sheet deep inside between his legs (INNER and FLOOR take it). Unset, nothing here runs. */
const keepBand = new Uint8Array(NT), HEMKEEPFLOOR = E('HEMKEEPFLOOR', 0);   // HEMKEEPFLOOR=1: FLOOR leaves the band whole too
if (process.env.HEMKEEP) { const HK = E('HEMKEEP', 0.02), HKIN = E('HEMKEEPIN', 0.03), NRMH = prim.getAttribute('NORMAL').getArray(), NAB = 120, wLow = new Float32Array(NAB).fill(9), wR = new Float32Array(NAB);
  const abin = (x, z) => { let a = Math.atan2(x, z); if (a < 0) a += 2 * Math.PI; return Math.min(NAB - 1, Math.floor(a / (2 * Math.PI) * NAB)); };
  for (let i = 0; i < n; i++) { if (!onSkirt[i]) continue; const x = P[3 * i] - hip.x, z = P[3 * i + 2] - hip.z, r = Math.hypot(x, z); if (r < 1e-6 || (NRMH[3 * i] * x + NRMH[3 * i + 2] * z) / r < OUTWARD) continue;
    const k = abin(x, z); if (P[3 * i + 1] < wLow[k]) { wLow[k] = P[3 * i + 1]; wR[k] = r; } }
  let nBand = 0, nBack = 0; for (const t of skirtTris) { const vs = [0, 1, 2].map(m => new Vector3().fromArray(P, 3 * IDX[3 * t + m])), mid = vs[0].clone().add(vs[1]).add(vs[2]).multiplyScalar(1 / 3), x = mid.x - hip.x, z = mid.z - hip.z, k = abin(x, z);
    if (mid.y > wLow[k] + HK || Math.hypot(x, z) < wR[k] - HKIN) continue; keepBand[t] = 1; nBand++; if (drop[t]) { drop[t] = 0; nBack++; } }
  log(`robeshell: HEMKEEP ${HK} m — the hem's rolled edge kept whole: ${nBand} skirt triangles within ${(HK * 100).toFixed(1)} cm of the outer wall's lowest point round him and ${(HKIN * 100).toFixed(0)} cm inside it, ${nBack} of them given back`); }
/* HEMLINING=<metres> (v24.49; with HEMLININGFACE 0.3, HEMLININGFRONT 70 degrees, HEMLININGBAND 0): the LINING of the
   robe at the hem taken out — every skirt triangle facing in (its normal's share toward his hips' axis HEMLININGFACE or
   more) whose middle lies within HEMLINING above the robe wall's lowest point round him (found as HEMKEEP finds it),
   outside HEMLININGFRONT degrees either side of his front, seen from outside or not. The views kept the lining's lowest
   few centimetres in scraps (what a view from beside the hem grazed), up to 5 cm high and 1-5 cm inside the wall; inside a
   lifted hem (the first Charged cast, seen from behind by his right heel) they stood in front of the back of the robe's
   wall as a second, ragged layer: the crumpled white and grey shards. Taken out, the inside of the hem is the back of the
   robe's own wall, closed at its foot by the strip facing down (HEMKEEP keeps it whole; HEMLININGBAND=1 spares the lip it
   keeps too). At his front the robe's wrap overlaps, and what faces in there are the panels' own edges (v24.48: taking
   them opened slits by his left shin). Unset, nothing here runs. */
if (process.env.HEMLINING) { const HL = E('HEMLINING', 0.06), HLF = E('HEMLININGFACE', 0.3), HLFRONT = E('HEMLININGFRONT', 70) * Math.PI / 180, HLBAND = E('HEMLININGBAND', 0), NRML = prim.getAttribute('NORMAL').getArray(), NAB = 120, lLow = new Float32Array(NAB).fill(9);
  const abin = (x, z) => { let a = Math.atan2(x, z); if (a < 0) a += 2 * Math.PI; return Math.min(NAB - 1, Math.floor(a / (2 * Math.PI) * NAB)); };
  for (let i = 0; i < n; i++) { if (!onSkirt[i]) continue; const x = P[3 * i] - hip.x, z = P[3 * i + 2] - hip.z, r = Math.hypot(x, z); if (r < 1e-6 || (NRML[3 * i] * x + NRML[3 * i + 2] * z) / r < OUTWARD) continue;
    const k = abin(x, z); if (P[3 * i + 1] < lLow[k]) lLow[k] = P[3 * i + 1]; }
  let nLin = 0, nWas = 0; for (const t of skirtTris) { if (HLBAND && keepBand[t]) continue; const vs = [0, 1, 2].map(m => new Vector3().fromArray(P, 3 * IDX[3 * t + m])), mid = vs[0].clone().add(vs[1]).add(vs[2]).multiplyScalar(1 / 3), x = mid.x - hip.x, z = mid.z - hip.z;
    if (mid.y > lLow[abin(x, z)] + HL || Math.abs(Math.atan2(x, z)) < HLFRONT) continue;
    const nrm = new Vector3().crossVectors(vs[1].clone().sub(vs[0]), vs[2].clone().sub(vs[0])).normalize();
    if (nrm.dot(new Vector3(x, 0, z).normalize()) > -HLF) continue; if (drop[t]) { nWas++; continue; } drop[t] = 1; nLin++; }
  log(`robeshell: HEMLINING ${HL} m — ${nLin} more skirt triangles of the lining facing in within ${(HL * 100).toFixed(0)} cm of the hem taken out (${nWas} were out already); his front's ${(HLFRONT * 180 / Math.PI).toFixed(0)} degrees either side left whole`); }
/* RIM=<metres> (with RIMY, 0.45 m): the rim of the robe that hugged his old shins, and the caps of tools/leggraft.mjs
   across its openings, are taken out too, seen or not: every skirt triangle whose three points at rest lie within RIM of
   either shin's axis (the new knee on his shin's axis, tools/leggraft.mjs, to his ankle) and below RIMY. Seen from below
   inside the hem, the cloth, carrying them as it carries the cloth round them, crumples them into shards and strips when
   the hem lifts (photographed coloured by this distance: the shards are all within 8 cm). Only what faces the shin (its
   normal's share toward the nearer axis RIMFACE or more) or faces down (the caps) goes: where the robe's outside hugs the
   back of his calf it too lies within 8 cm, facing away from the shin, and taken out it left a hole there in every take.
   Unset, nothing here runs. */
if (process.env.RIM) { const RIM = E('RIM', 0.08), RIMY = E('RIMY', 0.45), RIMFACE = E('RIMFACE', 0.2), jp = re => { const k = names.findIndex(x => re.test(x)); if (k < 0) throw new Error(`robeshell: RIM: no joint ${re}`); return new Vector3().setFromMatrixPosition(IB[k].clone().invert()); };
  const axes = ['Left', 'Right'].map(s => [jp(new RegExp(`${s}LegGraftLow$`)), jp(new RegExp(`${s}Foot$`))]);
  const near = p => { let best = null; for (const [A, B] of axes) { const ab = B.clone().sub(A), t = Math.max(-0.5, Math.min(1.5, p.clone().sub(A).dot(ab) / ab.lengthSq())), c = A.clone().addScaledVector(ab, t), d = p.distanceTo(c); if (!best || d < best[0]) best = [d, c]; } return best; };
  let nRim = 0, nOut = 0; for (const t of skirtTris) { if (drop[t] || keepBand[t]) continue; const vs = [0, 1, 2].map(m => new Vector3().fromArray(P, 3 * IDX[3 * t + m]));
    if (!vs.every(v => v.y < RIMY && near(v)[0] < RIM)) continue;
    const nrm = new Vector3().crossVectors(vs[1].clone().sub(vs[0]), vs[2].clone().sub(vs[0])).normalize(), mid = vs[0].clone().add(vs[1]).add(vs[2]).multiplyScalar(1 / 3), toAx = near(mid)[1].sub(mid).normalize();
    if (nrm.dot(toAx) >= RIMFACE || nrm.y <= -0.5) { drop[t] = 1; nRim++; } else nOut++; }
  log(`robeshell: RIM ${RIM} m below ${RIMY} m — ${nRim} more skirt triangles taken out (the rim that hugged his old shins, facing them, and the caps); ${nOut} as near facing away kept (the robe's outside at his calves)`); }
/* FLOOR=<metres> (v24.48; with FLOORR 0.11 m, FLOORY 0.32 m, FLOORWIN 0.06 m): the FLOOR of the robe's old opening round
   each shin taken out — where his scan's robe was fused to his shins it curls in under the hem and runs on as a sheet up
   through the inside of his new leg to its axis at about 25 cm (a slice through either shin at rest shows it). Hidden in
   the leg at rest, every time the leg moved it came out of it as the white shards and grey crumples inside a lifted hem,
   and stood in the way of the robe being kept off the leg. Every skirt triangle not already out whose middle lies below
   FLOORY, within FLOORR of either shin's axis, and more than FLOOR inside the robe's own outer wall above it (measured
   from his hips' axis, against the furthest point of the skirt facing out in its 3 degrees of turn and the FLOORWIN of
   height over it), and lying flatter than upright (its normal's height share FLOORNY or more: the floor is a sheet
   sloping up to the axis; the robe's under-panel at his front, which hangs upright 2-5 cm inside the outer flap, stays —
   taken out, it left holes at his front-left) goes: what is left at each shin is the robe's own wall, ending in its hem.
   Unset, nothing here runs. */
if (process.env.FLOOR) { const FLOORIN = E('FLOOR', 0.02), FLOORR = E('FLOORR', 0.11), FLOORY = E('FLOORY', 0.32), FLOORWIN = E('FLOORWIN', 0.06), FLOORNY = E('FLOORNY', 0.5), NRMA = prim.getAttribute('NORMAL').getArray();
  const jq = re => { const k = names.findIndex(x => re.test(x)); if (k < 0) throw new Error(`robeshell: FLOOR: no joint ${re}`); return new Vector3().setFromMatrixPosition(IB[k].clone().invert()); };
  const axes = ['Left', 'Right'].map(s => [jq(new RegExp(`${s}LegGraftLow$`)), jq(new RegExp(`${s}Foot$`))]);
  const dAx = p => Math.min(...axes.map(([A, B]) => { const ab = B.clone().sub(A), t = Math.max(0, Math.min(1, p.clone().sub(A).dot(ab) / ab.lengthSq())); return p.distanceTo(A.clone().addScaledVector(ab, t)); }));
  const NAB = 120, NHB = 100, wall = new Float32Array(NAB * NHB), abin = (x, z) => { let a = Math.atan2(x, z); if (a < 0) a += 2 * Math.PI; return Math.min(NAB - 1, Math.floor(a / (2 * Math.PI) * NAB)); };
  for (let i = 0; i < n; i++) { if (!onSkirt[i]) continue; const x = P[3 * i] - hip.x, z = P[3 * i + 2] - hip.z, y = P[3 * i + 1], r = Math.hypot(x, z); if (y < 0 || y >= 1 || r < 1e-6) continue;
    if ((NRMA[3 * i] * x + NRMA[3 * i + 2] * z) / r < OUTWARD) continue; const k = abin(x, z) * NHB + Math.floor(y * 100); if (r > wall[k]) wall[k] = r; }
  let nFloor = 0; const fy = {};
  /* HEMKEEPFLOORBACK=1 (v24.49, with HEMKEEPFLOOR=1): the band is FLOOR's again where it lies behind his shins (behind the
     middle of the two shins' axes at its height) — there, kept whole, its strip by his right calf stretched into a grey
     comb seen between his shins in the chair sits; in front of them and at his sides, kept whole, it is the clean hem. */
  const HKFBACK = E('HEMKEEPFLOORBACK', 0), axZ = p => axes.map(([A, B]) => { const ab = B.clone().sub(A), t = Math.max(0, Math.min(1, p.clone().sub(A).dot(ab) / ab.lengthSq())); return A.z + ab.z * t; }).reduce((s, z) => s + z / 2, 0);
  let nBehind = 0;
  for (const t of skirtTris) { if (drop[t]) continue; const vs = [0, 1, 2].map(m => new Vector3().fromArray(P, 3 * IDX[3 * t + m])), mid = vs[0].clone().add(vs[1]).add(vs[2]).multiplyScalar(1 / 3);
    if (HEMKEEPFLOOR && keepBand[t]) { if (!HKFBACK || mid.z >= axZ(mid)) continue; nBehind++; }
    if (mid.y >= FLOORY || dAx(mid) >= FLOORR) continue; if (Math.abs(new Vector3().crossVectors(vs[1].clone().sub(vs[0]), vs[2].clone().sub(vs[0])).normalize().y) < FLOORNY) continue; const x = mid.x - hip.x, z = mid.z - hip.z, r = Math.hypot(x, z), ab = abin(x, z), h0 = Math.max(0, Math.floor(mid.y * 100));
    let ref = 0; for (const da of [-1, 0, 1]) { const a2 = (ab + da + NAB) % NAB; for (let h = h0; h <= Math.min(NHB - 1, h0 + Math.round(FLOORWIN * 100)); h++) ref = Math.max(ref, wall[a2 * NHB + h]); }
    if (ref - r > FLOORIN) { drop[t] = 1; nFloor++; const yy = (Math.floor(mid.y / 0.05) * 0.05).toFixed(2); fy[yy] = (fy[yy] || 0) + 1; } }
  log(`robeshell: FLOOR ${FLOORIN} m — ${nFloor} more skirt triangles taken out (the floor of the robe's old opening round his shins, by height: ${Object.keys(fy).sort().map(y => `${y} ${fy[y]}`).join(', ')})${HKFBACK ? `; the hem band FLOOR's again behind his shins: ${nBehind} triangles` : ''}`); }
/* INNER=<metres> (v24.48; with INNERY 0.35 m, INNERWIN 0.06 m): the robe's INNER SHEETS low inside it taken out — cloth
   hanging deep inside the robe's own wall near the hem (between his legs at the front, 15 cm inside the front wall: the
   inner panel of the wrap as his scan made it), seen at rest only from below. Skinned to the cloth bones round it at that
   depth, it swung out whenever the front of the robe moved: sitting on a chair, stretched four to five times into a white
   band across his shins, with skin showing above it; standing, the "inner layer hanging below the hem between the legs".
   Every skirt triangle not already out whose middle lies below INNERY and more than INNER inside the robe's outer wall
   (its furthest point facing out, in its 3 degrees of turn round his hips' axis and the INNERWIN of height over it) goes:
   the wrap's under-panel, 2-5 cm inside the outer flap, and the valleys of the pleats (up to 4 cm) stay. Unset, nothing
   here runs. */
if (process.env.INNER) { const IN = E('INNER', 0.08), INY = E('INNERY', 0.35), INWIN = E('INNERWIN', 0.06), NRMB = prim.getAttribute('NORMAL').getArray();
  const NAB = 120, NHB = 100, wall = new Float32Array(NAB * NHB), abin = (x, z) => { let a = Math.atan2(x, z); if (a < 0) a += 2 * Math.PI; return Math.min(NAB - 1, Math.floor(a / (2 * Math.PI) * NAB)); };
  for (let i = 0; i < n; i++) { if (!onSkirt[i]) continue; const x = P[3 * i] - hip.x, z = P[3 * i + 2] - hip.z, y = P[3 * i + 1], r = Math.hypot(x, z); if (y < 0 || y >= 1 || r < 1e-6) continue;
    if ((NRMB[3 * i] * x + NRMB[3 * i + 2] * z) / r < OUTWARD) continue; const k = abin(x, z) * NHB + Math.floor(y * 100); if (r > wall[k]) wall[k] = r; }
  let nIn = 0; const fd = {};
  for (const t of skirtTris) { if (drop[t]) continue; const vs = [0, 1, 2].map(m => new Vector3().fromArray(P, 3 * IDX[3 * t + m])), mid = vs[0].clone().add(vs[1]).add(vs[2]).multiplyScalar(1 / 3);
    if (mid.y >= INY) continue; const x = mid.x - hip.x, z = mid.z - hip.z, r = Math.hypot(x, z), ab = abin(x, z), h0 = Math.max(0, Math.floor(mid.y * 100));
    let ref = 0; for (const da of [-1, 0, 1]) { const a2 = (ab + da + NAB) % NAB; for (let h = h0; h <= Math.min(NHB - 1, h0 + Math.round(INWIN * 100)); h++) ref = Math.max(ref, wall[a2 * NHB + h]); }
    if (ref - r > IN) { drop[t] = 1; nIn++; const dd = (Math.floor((ref - r) / 0.04) * 0.04).toFixed(2); fd[dd] = (fd[dd] || 0) + 1; } }
  log(`robeshell: INNER ${IN} m — ${nIn} more skirt triangles taken out (cloth more than ${(IN * 100).toFixed(0)} cm inside the robe's wall below ${INY} m; by depth: ${Object.keys(fd).sort().map(d => `${d} ${fd[d]}`).join(', ')})`); }
/* ISLANDS=<triangles> (v24.48): what the cuts above left of the robe below his waist in loose scraps — pieces of the
   skirt joined to nothing else (by any point they share, or any point at the same place across a seam) and smaller than
   ISLANDS triangles — taken out too, so no small bit is left floating under the hem. The hem itself (the strip that
   closes the bottom of his scan's robe wall and the lip it turns into) is his scan's own and is never cut: cut out
   (v24.48's trials, within 4.5 cm of the robe's lowest point, facing down or in), it left the hem's edge ragged with
   white bits, and blind readers rated four takes worse than his saved file for it (masters/v24.48/PLAN.md step 10).
   Unset, nothing here runs. */
if (process.env.ISLANDS) { const MINT = E('ISLANDS', 40), par = new Int32Array(n).map((_, i) => i), find = i => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; }, uni = (a, b) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
  const at = new Map(); for (let i = 0; i < n; i++) { const k = `${Math.round(P[3 * i] * 1e4)},${Math.round(P[3 * i + 1] * 1e4)},${Math.round(P[3 * i + 2] * 1e4)}`, j = at.get(k); if (j === undefined) at.set(k, i); else uni(i, j); }
  for (let t = 0; t < NT; t++) if (!drop[t]) { uni(IDX[3 * t], IDX[3 * t + 1]); uni(IDX[3 * t], IDX[3 * t + 2]); }
  const size = new Map(); for (let t = 0; t < NT; t++) if (!drop[t]) { const r = find(IDX[3 * t]); size.set(r, (size.get(r) || 0) + 1); }
  let nIsl = 0, nTri = 0; const seen = new Set(); for (const t of skirtTris) { if (drop[t]) continue; const r = find(IDX[3 * t]); if (size.get(r) >= MINT) continue; drop[t] = 1; nTri++; if (!seen.has(r)) { seen.add(r); nIsl++; } }
  log(`robeshell: ISLANDS ${MINT} — ${nIsl} loose scraps of the skirt, ${nTri} triangles, taken out`); }
const keep = []; for (let t = 0; t < NT; t++) if (!drop[t]) keep.push(IDX[3 * t], IDX[3 * t + 1], IDX[3 * t + 2]);
const ia = prim.getIndices(); ia.setArray(n > 65535 ? new Uint32Array(keep) : new Uint16Array(keep));
compactPrimitive(prim);
await io.write(OUT, doc);
log(`robeshell: wrote ${OUT} — ${prim.getIndices().getCount() / 3} triangles, ${prim.getAttribute('POSITION').getCount()} points (was ${NT}, ${n})`);
