/* v28.0 (plan, docs/V28.0-E4C5-PLAN.md §5.6): THE TWO CAMERAS, as pictures for Chad to choose between. A MOCK, not the
   game: a court of the planned size (4.9 x 9.1 m) built from plain surfaces, Grandmaster Pho and Master Zavier as their
   own models, six stand-in presences (chapter 4's wanderer body painted dark), the ward, a fireball and the planned
   controls drawn over it. The same moment is photographed twice at a phone's real size (390 x 844 points, two pixels a
   point): from the raised ROOM CAMERA the plan recommends, and from close behind Grandmaster Pho's shoulder.
     CHROMIUM_PATH=... node tools/probes/tagmock.mjs <outPrefix>
   Nothing here is built into the game; it exists so the choice is made from pictures and not from words. */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, resolve } from 'path';
import fs from 'node:fs';
import { LAUNCH } from '../../testlib.mjs';
const OUT = process.argv[2] || '/tmp/tagmock';
const ROOT = resolve('.');
const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary', '.json': 'application/json' };
const srv = createServer(async (req, res) => {
  try { const p = decodeURIComponent(req.url.split('?')[0]); const buf = await readFile(resolve(ROOT + p));
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(buf); } catch { res.writeHead(404); res.end('no'); }
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const PORT = srv.address().port;
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head>
<body><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
const W = 780, H = 1688;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
renderer.setPixelRatio(1); renderer.setSize(W, H, false); document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x070a16); scene.fog = new THREE.Fog(0x070a16, 14, 40);
scene.add(new THREE.HemisphereLight(0x5a6aa8, 0x161218, 1.15));
const moon = new THREE.DirectionalLight(0x9fb4ff, 0.9); moon.position.set(-3, 8, -2); scene.add(moon);
// the court: 4.9 wide (x 0..4.9), 9.1 long (z 0..9.1); the house's doors at its far end
const tile = document.createElement('canvas'); tile.width = tile.height = 256; { const g = tile.getContext('2d'); g.fillStyle = '#8d877c'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { g.fillStyle = 'rgba(' + (60 + Math.random() * 60 | 0) + ',' + (58 + Math.random() * 55 | 0) + ',' + (52 + Math.random() * 50 | 0) + ',0.10)'; g.fillRect(Math.random() * 256, Math.random() * 256, 3, 3); }
  g.strokeStyle = '#5e594f'; g.lineWidth = 5; g.strokeRect(0, 0, 256, 256); }
const tt = new THREE.CanvasTexture(tile); tt.wrapS = tt.wrapT = THREE.RepeatWrapping; tt.repeat.set(4.9 / 0.4, 9.1 / 0.4); tt.colorSpace = THREE.SRGBColorSpace; tt.anisotropy = 8;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 9.1), new THREE.MeshStandardMaterial({ map: tt, roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.position.set(2.45, 0, 4.55); scene.add(floor);
const wallM = new THREE.MeshStandardMaterial({ color: 0xb9b3a6, roughness: 0.95 });
const box = (w, h, d, x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m || wallM); o.position.set(x, y, z); scene.add(o); return o; };
box(0.15, 2.6, 9.1, -0.075, 1.3, 4.55); box(0.15, 2.6, 9.1, 4.975, 1.3, 4.55);                 // the two side walls
box(5.2, 3.0, 0.15, 2.45, 1.5, 9.175);                                                              // the house's front
box(1.7, 2.15, 0.06, 2.45, 1.075, 9.09, new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.7 }));   // its doors
box(1.1, 1.0, 0.05, 0.95, 1.5, 9.09, new THREE.MeshBasicMaterial({ color: 0x33270f }));             // a curtained window, barely lit
box(0.55, 0.45, 6.2, 0.33, 0.225, 4.4, new THREE.MeshStandardMaterial({ color: 0x8b8377, roughness: 0.9 }));    // the planter
box(0.43, 0.04, 6.08, 0.33, 0.46, 4.4, new THREE.MeshStandardMaterial({ color: 0x2c2218, roughness: 1 }));      // its soil
for (let i = 0; i < 16; i++) { const s = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.34 + (i % 3) * 0.08, 5), new THREE.MeshStandardMaterial({ color: 0x4a3a22, roughness: 1 })); s.position.set(0.26 + (i % 2) * 0.14, 0.62, 1.6 + i * 0.37); scene.add(s); }   // dead plants (a mock)
for (const x of [0.5, 4.4]) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: 0x8a6a3a })); l.position.set(x, 2.15, 9.0); scene.add(l); }   // the wall lamps, sunk low
const thread = box(1.9, 0.012, 0.012, 2.45, 1.0, 8.95, new THREE.MeshBasicMaterial({ color: 0xffffff }));          // the white thread across the doorway

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const load = (u) => new Promise((ok, no) => loader.load(u, ok, undefined, no));
const place = (root, h, x, z, ry) => { root.updateMatrixWorld(true); const b = new THREE.Box3(); root.traverse(o => { if (o.isMesh) b.expandByObject(o); });
  const s = h / (b.max.y - b.min.y); root.scale.setScalar(s); root.rotation.y = ry; root.position.set(x, -b.min.y * s, z); scene.add(root); root.updateMatrixWorld(true); return root; };
const [gp, gz, gs, gw] = await Promise.all(['/assets/pho.glb', '/assets/p5zavier.glb', '/assets/w5nagastaff.glb', '/assets/p4wander.glb'].map(load));
// Grandmaster Pho. The fight's own takes are still to be made (the plan's M2), so this picture looks through his file
// for the moment that reads most like a man holding a staff upright: his right hand out to his side and ahead of him at
// about 1.05 m, his body upright. The staff is then stood through that hand, its foot on the paving.
const pho = place(gp.scene, 1.66, 2.05, 3.7, 0);
let hand = null, tip = null, hips = null, headB = null; gp.scene.traverse(o => { if (!o.isBone) return; if (/RightHand$/i.test(o.name)) hand = o; if (/RightHandMiddle4$/i.test(o.name)) tip = o; if (/Hips$/i.test(o.name)) hips = o; if (/Head$/i.test(o.name)) headB = o; });
const hp = new THREE.Vector3(), tp = new THREE.Vector3(), cp = new THREE.Vector3(), kp = new THREE.Vector3();
{ const mx = new THREE.AnimationMixer(gp.scene); let best = null; window.__clips = gp.animations.map(a => a.name + ' ' + a.duration.toFixed(2));
  const forced = window.__pose ? window.__pose.split(':') : null;
  for (const clip of gp.animations) { if (/Sit|Running|Walking/i.test(clip.name)) continue; if (forced && !new RegExp(forced[0], 'i').test(clip.name)) continue;
    const act = mx.clipAction(clip); act.reset().play();
    for (let i = 0; i <= 40; i++) { const t = forced ? (+forced[1] || 0) : i / 40; mx.setTime(clip.duration * t); gp.scene.updateMatrixWorld(true);
      hand.getWorldPosition(hp); hips.getWorldPosition(cp); headB.getWorldPosition(kp);
      const side = hp.x - cp.x, ahead = hp.z - cp.z, lean = Math.hypot(kp.x - cp.x, kp.z - cp.z);
      const score = Math.abs(hp.y - 1.05) * 2 + Math.abs(side + 0.3) + Math.abs(ahead - 0.22) + lean * 1.5;
      if (!best || score < best.score) best = { score, clip, t };
      if (forced) break; }
    act.stop(); }
  const act = mx.clipAction(best.clip); act.reset().play(); mx.setTime(best.clip.duration * best.t); gp.scene.updateMatrixWorld(true);
  window.__picked = best.clip.name + ' at ' + best.t.toFixed(3) + ' (score ' + best.score.toFixed(3) + ')'; }
hand.getWorldPosition(hp); if (tip) tip.getWorldPosition(tp); else tp.copy(hp);
const grip = hp.clone().lerp(tp, 0.45);
const staff = gs.scene; { staff.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(staff); const s = 1.40 / (b.max.y - b.min.y); staff.scale.setScalar(s);
  const lift = Math.max(0, grip.y - 1.12);                      // a hand above the staff's grip carries it off the ground
  staff.position.set(grip.x, -b.min.y * s + lift, grip.z); scene.add(staff); staff.updateMatrixWorld(true); window.__picked += '; hand ' + [hp.x, hp.y, hp.z].map(v => v.toFixed(2)).join(' ') + ', lift ' + lift.toFixed(2); }
const head = new THREE.Vector3(grip.x, 1.36 + Math.max(0, grip.y - 1.12), grip.z + 0.05);          // the Naga's head, at the staff's top
// Master Zavier (his rest pose: the trance stand is still to be made), inside his ward
const zav = place(gz.scene, 1.74, 3.15, 3.0, 0);
const INDIGO = 0x6f63ff, GOLD = 0xffc64a, RUBY = 0xff2f5a;
for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + 0.3; const bar = new THREE.Mesh(new THREE.BoxGeometry(0.028, 2.15, 0.028), new THREE.MeshBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.8 }));
  bar.position.set(3.15 + Math.cos(a) * 1.25, 1.075, 3.0 + Math.sin(a) * 1.25); scene.add(bar);
  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.12), new THREE.MeshBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false })); glow.position.copy(bar.position); scene.add(glow); }
const ring = (r, col, x, z, op) => { const o = new THREE.Mesh(new THREE.RingGeometry(r - 0.035, r + 0.035, 64), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); o.rotation.x = -Math.PI / 2; o.position.set(x, 0.012, z); scene.add(o); };
const pool = (r, col, x, z, op) => { const o = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); o.rotation.x = -Math.PI / 2; o.position.set(x, 0.01, z); scene.add(o); };
ring(1.25, INDIGO, 3.15, 3.0, 0.8); pool(1.25, INDIGO, 3.15, 3.0, 0.10); pool(0.9, GOLD, 2.05, 3.7, 0.16); ring(0.9, GOLD, 2.05, 3.7, 0.35);
const litP = new THREE.PointLight(GOLD, 2.4, 4.5, 1.6); litP.position.set(2.05, 1.5, 3.2); scene.add(litP);
const litZ = new THREE.PointLight(INDIGO, 2.2, 4.0, 1.6); litZ.position.set(3.15, 1.5, 2.6); scene.add(litZ);
// six stand-in presences: chapter 4's wanderer body painted as dark oil with a pale sheen
const dark = new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.35, metalness: 0.2 });
dark.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\\n' +
  '{ float fr = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 3.4); gl_FragColor.rgb = gl_FragColor.rgb * 0.18 + vec3(0.70, 0.80, 0.95) * fr * 1.6; }'); };
const prai = (x, z, ry, sy) => { const r = SkeletonUtils.clone(gw.scene); r.traverse(o => { if (o.isMesh) o.material = dark; }); place(r, 1.6, x, z, ry); if (sy) { r.scale.y *= sy; r.position.y *= sy; } return r; };
const face = (x, z) => Math.atan2(3.15 - x, 3.0 - z);
prai(3.55, 4.22, face(3.55, 4.22)); prai(2.5, 5.5, face(2.5, 5.5)); prai(1.25, 6.4, face(1.25, 6.4)); prai(3.95, 6.9, face(3.95, 6.9)); prai(2.1, 7.7, face(2.1, 7.7)); prai(1.05, 4.7, face(1.05, 4.7), 0.55);
// one fireball on its way to the nearest of them that is free
{ const to = new THREE.Vector3(1.25, 1.15, 6.4), at = head.clone().lerp(to, 0.5);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffd0d8 })); ball.position.copy(at); scene.add(ball);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14), new THREE.MeshBasicMaterial({ color: RUBY, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })); halo.position.copy(at); scene.add(halo);
  const dir = to.clone().sub(head).normalize(); const tr = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.7, 12, 1, true), new THREE.MeshBasicMaterial({ color: RUBY, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  tr.position.copy(at.clone().addScaledVector(dir, -0.42)); tr.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); scene.add(tr);
  pool(0.5, RUBY, at.x, at.z, 0.22); const lf = new THREE.PointLight(RUBY, 1.6, 3.0, 1.8); lf.position.copy(at); scene.add(lf); }

const cam = new THREE.PerspectiveCamera(72, W / H, 0.08, 200);
const hud = (g, played) => {     // the planned controls, at two pixels a point (§5.6 of the plan)
  const P = (x) => x * 2; g.textAlign = 'center'; g.textBaseline = 'middle';
  const disc = (x, y, d, fill, stroke, lw) => { g.beginPath(); g.arc(P(x), P(y), P(d / 2), 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 4; g.strokeStyle = stroke; g.stroke(); } };
  const arc = (x, y, d, k, col) => { g.beginPath(); g.arc(P(x), P(y), P(d / 2) - 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); g.lineWidth = 7; g.strokeStyle = col; g.stroke(); };
  const txt = (s, x, y, px, col, w) => { g.font = (w || '600') + ' ' + P(px) + 'px system-ui, sans-serif'; g.fillStyle = col; g.fillText(s, P(x), P(y)); };
  g.fillStyle = 'rgba(0,0,0,0.38)'; g.fillRect(0, 0, W, P(92));
  txt('Keep Master Zavier safe', 195, 22, 15, '#f3ead6'); for (let i = 0; i < 9; i++) disc(123 + i * 18, 48, 10, i < 6 ? '#f3ead6' : 'rgba(255,255,255,0.14)');
  txt('6', 195, 72, 20, '#f3ead6', '700');
  // the two faces, top left (the played one larger), his sanity beside Zavier's
  const big = played === 'pho' ? ['P', '#ffc64a', 'Z', '#8f86ff'] : ['Z', '#8f86ff', 'P', '#ffc64a'];
  disc(34, 128, 44, 'rgba(10,10,18,0.75)', big[1], 5); txt(big[0], 34, 129, 20, big[1], '700'); disc(84, 132, 30, 'rgba(10,10,18,0.75)', big[3], 3); txt(big[2], 84, 133, 13, big[3], '700');
  g.fillStyle = 'rgba(10,10,18,0.7)'; g.fillRect(P(106), P(126), P(86), P(9)); g.fillStyle = '#8f86ff'; g.fillRect(P(106), P(126), P(86 * 0.68), P(9)); txt('Master Zavier', 149, 114, 10, '#cfc9ff', '500');
  // the line being said, above the thumbs
  g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(P(40), P(524), P(310), P(34)); txt(played === 'pho' ? '"On your left, Master!"' : '"Your WARD, Zavier."', 195, 541, 15, '#ffffff', '500');
  // the right thumb: SWITCH, two small, one large
  const other = played === 'pho' ? ['Z', '#8f86ff'] : ['P', '#ffc64a'];
  disc(318, 630, 64, 'rgba(10,10,18,0.72)', other[1], 5); txt(other[0], 318, 626, 20, other[1], '700'); txt('SWITCH', 318, 647, 8.5, '#ffffff', '600');
  const acts = played === 'pho' ? [['FIRE', '#ff5a7a'], ['WAVE', '#ffc64a', 0.62], ['BAG', '#d8d2c2']] : [['WARD', '#8f86ff'], ['CHANT', '#cfc9ff', 1], ['SMELL', '#b7c49a', 1]];
  disc(318, 730, 80, 'rgba(10,10,18,0.72)', acts[0][1], 6); txt(acts[0][0], 318, 730, 15, acts[0][1], '700');
  disc(253, 665, 60, 'rgba(10,10,18,0.72)', 'rgba(255,255,255,0.25)', 3); arc(253, 665, 60, acts[1][2] ?? 1, acts[1][1]); txt(acts[1][0], 253, 665, 11, acts[1][1], '700');
  disc(226, 730, 60, 'rgba(10,10,18,0.72)', acts[2][1], 3); txt(acts[2][0], 226, 730, 11, acts[2][1], '700');
  // the stick, where the left thumb is
  disc(92, 716, 104, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.28)', 3); disc(104, 704, 44, 'rgba(255,255,255,0.22)');
};
window.__shoot = (sh) => {
  cam.fov = sh.fov || 72; cam.updateProjectionMatrix(); cam.position.set(...sh.pos); cam.lookAt(new THREE.Vector3(...sh.at));
  thread.visible = true; renderer.render(scene, cam);
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(renderer.domElement, 0, 0);
  if (sh.hud) hud(g, sh.hud);
  return c.toDataURL('image/png');
};
window.__ready = true;
</script></body></html>`;
const br = await chromium.launch(LAUNCH);
const p = await br.newPage({ viewport: { width: 800, height: 1700 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await p.route('**/tagmock.html', route => route.fulfill({ status: 200, contentType: 'text/html', body: HTML }));
await p.addInitScript(v => { window.__pose = v; }, process.env.POSE || '');
await p.goto(`http://127.0.0.1:${PORT}/tagmock.html`);
await p.waitForFunction(() => window.__ready, null, { timeout: 600000 });
console.log('picked', await p.evaluate(() => window.__picked));
const SHOTS = [
  { name: 'room', pos: [2.45, 2.75, -1.9], at: [2.45, 0.35, 2.6], hud: 'pho' },                 // the raised room camera (recommended)
  { name: 'room-zavier', pos: [2.45, 2.75, -1.9], at: [2.45, 0.35, 2.6], hud: 'zav' },          // the same, Master Zavier played
  { name: 'shoulder', pos: [1.55, 2.05, 0.55], at: [2.45, 1.05, 7.8], hud: 'pho' },              // close behind Grandmaster Pho
  { name: 'room-bare', pos: [2.45, 2.75, -1.9], at: [2.45, 0.35, 2.6] },
];
for (const sh of SHOTS) { const url = await p.evaluate(s => window.__shoot(s), sh); fs.writeFileSync(`${OUT}-${sh.name}.png`, Buffer.from(url.split(',')[1], 'base64')); }
console.log('errs', errs.slice(0, 5));
await br.close(); srv.close();
