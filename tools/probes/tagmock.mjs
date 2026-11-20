/* v28.0 (plan, docs/V28.0-E4C5-PLAN.md §5.6): THE FIGHT'S CAMERA, as pictures for Chad to choose between. A MOCK, not
   the game: a court of the planned size (4.9 x 9.1 m) built from plain surfaces, Grandmaster Pho and Master Zavier as
   their own models (stand-in poses: the fight's takes are still to be made), six stand-in Prai (chapter 4's wanderer
   body painted dark), the cage, a fireball, and the plan's screen drawn over it at the game's own HUD measures
   (shell.html: the stat rows, the two round buttons, the objective box). ONE moment of the fight, six Prai left,
   photographed at a phone's real size (390 x 844 points, two pixels a point):
     follow-pho      BEHIND AND ABOVE the one he plays, following him (the plan's default); Grandmaster Pho played
     follow-zavier   the same, Master Zavier played (STEADY running: the Prai at his cage gripped)
     close-pho       CLOSE, over the played one's shoulder
     court-pho       the WHOLE COURT from one raised place that never moves
     follow-bare     the default with nothing drawn over it
     CHROMIUM_PATH=... node tools/probes/tagmock.mjs <outPrefix>        (POSE='clip:t' forces Grandmaster Pho's pose)
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
{ const lane = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 1 })); lane.rotation.x = -Math.PI / 2; lane.position.set(2.45, -0.01, -4); scene.add(lane); }   // the lane outside the gate
const wallM = new THREE.MeshStandardMaterial({ color: 0xb9b3a6, roughness: 0.95 });
const box = (w, h, d, x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m || wallM); o.position.set(x, y, z); scene.add(o); return o; };
box(0.15, 2.6, 9.1, -0.075, 1.3, 4.55); box(0.15, 2.6, 9.1, 4.975, 1.3, 4.55);                 // the two side walls
box(5.2, 3.0, 0.15, 2.45, 1.5, 9.175);                                                              // the house's front
box(1.7, 2.15, 0.06, 2.45, 1.075, 9.09, new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.7 }));   // its doors
box(1.1, 1.0, 0.05, 0.95, 1.5, 9.09, new THREE.MeshBasicMaterial({ color: 0x33270f }));             // a curtained window, barely lit
box(0.55, 0.45, 6.2, 0.33, 0.225, 4.4, new THREE.MeshStandardMaterial({ color: 0x8b8377, roughness: 0.9 }));    // the planter
box(0.43, 0.04, 6.08, 0.33, 0.46, 4.4, new THREE.MeshStandardMaterial({ color: 0x2c2218, roughness: 1 }));      // its soil
for (let i = 0; i < 16; i++) { const s = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.34 + (i % 3) * 0.08, 5), new THREE.MeshStandardMaterial({ color: 0x2c4a2a, roughness: 1 })); s.position.set(0.26 + (i % 2) * 0.14, 0.62, 1.6 + i * 0.37); scene.add(s); }   // the planter's shrubs (a mock: ordinary plants, as on the other wall)
for (const x of [0.5, 4.4]) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: 0x8a6a3a })); l.position.set(x, 2.15, 9.0); scene.add(l); }   // the wall lamps, sunk low
const thread = box(1.9, 0.012, 0.012, 2.45, 1.0, 8.95, new THREE.MeshBasicMaterial({ color: 0xffffff }));          // the white thread across the doorway

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const load = (u) => new Promise((ok, no) => loader.load(u, ok, undefined, no));
const place = (root, h, x, z, ry) => { root.updateMatrixWorld(true); const b = new THREE.Box3(); root.traverse(o => { if (o.isMesh) b.expandByObject(o); });
  const s = h / (b.max.y - b.min.y); root.scale.setScalar(s); root.rotation.y = ry; root.position.set(x, -b.min.y * s, z); scene.add(root); root.updateMatrixWorld(true); return root; };
const [gp, gz, gs, gw] = await Promise.all(['/assets/pho.glb', '/assets/p5zavier.glb', '/assets/w5nagastaff.glb', '/assets/p4wander.glb'].map(load));
const PHO = { x: 1.85, z: 4.0 }, ZAV = { x: 3.15, z: 5.0 }, CAGE_R = 1.5;      // where the two stand in this moment; the cage's reach (§5.4)
// Grandmaster Pho. The fight's own takes are still to be made (the plan's M2), so this picture looks through his file
// for the moment that reads most like a man holding a staff upright: his right hand out to his side and ahead of him at
// about 1.05 m, his body upright. The staff is then stood through that hand, its foot on the paving.
const pho = place(gp.scene, 1.66, PHO.x, PHO.z, 0);
let hand = null, tip = null, hips = null, headB = null; gp.scene.traverse(o => { if (!o.isBone) return; if (/RightHand$/i.test(o.name)) hand = o; if (/RightHandMiddle4$/i.test(o.name)) tip = o; if (/Hips$/i.test(o.name)) hips = o; if (/Head$/i.test(o.name)) headB = o; });
const hp = new THREE.Vector3(), tp = new THREE.Vector3(), cp = new THREE.Vector3(), kp = new THREE.Vector3();
{ const mx = new THREE.AnimationMixer(gp.scene); let best = null; window.__clips = gp.animations.map(a => a.name + ' ' + a.duration.toFixed(2));
  const forced = window.__pose ? window.__pose.split(':') : null;
  for (const clip of gp.animations) { if (/Sit|Running|Walking/i.test(clip.name)) continue; if (forced && !new RegExp(forced[0], 'i').test(clip.name)) continue;
    const act = mx.clipAction(clip); act.reset().play();
    for (let i = 0; i <= 40; i++) { const t = forced ? (+forced[1] || 0) : i / 40; mx.setTime(clip.duration * t); gp.scene.updateMatrixWorld(true);
      hand.getWorldPosition(hp); hips.getWorldPosition(cp); headB.getWorldPosition(kp);
      const side = hp.x - cp.x, ahead = hp.z - cp.z, lean = Math.hypot(kp.x - cp.x, kp.z - cp.z);
      const score = Math.abs(hp.y - 1.05) * 2 + Math.abs(side + 0.3) + Math.abs(ahead - 0.22) + lean * 1.5;   // he faces +z: his right is -x
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
// Master Zavier (his rest pose: the trance stand is still to be made), inside his cage
const zav = place(gz.scene, 1.74, ZAV.x, ZAV.z, 0);
let zHead = null; gz.scene.traverse(o => { if (o.isBone && /Head$/i.test(o.name) && !zHead) zHead = o; });
const VIOLET = 0xa06bff, GOLD = 0xffc64a, RUBY = 0xff2f5a;
const flat = (col, op, add) => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, side: THREE.DoubleSide, blending: add === false ? THREE.NormalBlending : THREE.AdditiveBlending, depthWrite: false });
// THE CAGE (§5.3, §5.4): seven thin bars of light, 1.5 m out, always there; its strength is the ring on the paving
for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + 0.3; const bar = new THREE.Mesh(new THREE.BoxGeometry(0.022, 2.2, 0.022), new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.85 }));
  bar.position.set(ZAV.x + Math.cos(a) * CAGE_R, 1.1, ZAV.z + Math.sin(a) * CAGE_R); scene.add(bar);
  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.11, 2.25, 0.11), flat(VIOLET, 0.08)); glow.position.copy(bar.position); scene.add(glow); }
const ring = (r, w, col, x, z, op) => { const o = new THREE.Mesh(new THREE.RingGeometry(r - w, r + w, 72), flat(col, op)); o.rotation.x = -Math.PI / 2; o.position.set(x, 0.012, z); scene.add(o); return o; };
const pool = (r, col, x, z, op) => { const o = new THREE.Mesh(new THREE.CircleGeometry(r, 48), flat(col, op)); o.rotation.x = -Math.PI / 2; o.position.set(x, 0.01, z); scene.add(o); return o; };
const cageWorn = [ring(CAGE_R, 0.022, VIOLET, ZAV.x, ZAV.z, 0.55), pool(CAGE_R, VIOLET, ZAV.x, ZAV.z, 0.05)];              // nobody steadies him: it has worn to about six tenths
const cageFast = [ring(CAGE_R, 0.05, VIOLET, ZAV.x, ZAV.z, 0.95), ring(CAGE_R - 0.12, 0.012, VIOLET, ZAV.x, ZAV.z, 0.6), pool(CAGE_R, VIOLET, ZAV.x, ZAV.z, 0.13)];   // STEADY: it holds fast and mends
pool(0.8, GOLD, PHO.x, PHO.z, 0.14);                                                               // Grandmaster Pho's own gold, at his feet
const litP = new THREE.PointLight(GOLD, 2.4, 4.5, 1.6); litP.position.set(PHO.x, 1.5, PHO.z - 0.5); scene.add(litP);
const litZ = new THREE.PointLight(VIOLET, 2.2, 4.0, 1.6); litZ.position.set(ZAV.x, 1.5, ZAV.z - 0.4); scene.add(litZ);
const playedRing = { pho: ring(0.5, 0.02, 0xfff1cf, PHO.x, PHO.z, 0.75), zav: ring(0.5, 0.02, 0xfff1cf, ZAV.x, ZAV.z, 0.75) };   // which of the two he plays
// six stand-in Prai: chapter 4's wanderer body painted as dark oil with a pale sheen at its edge
const oil = (edge) => { const m = new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.35, metalness: 0.2 });
  m.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\\n' +
    '{ float fr = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 3.4); gl_FragColor.rgb = gl_FragColor.rgb * 0.18 + vec3(0.70, 0.80, 0.95) * fr * ' + edge.toFixed(2) + '; }'); };
  m.customProgramCacheKey = () => 'oil' + edge; return m; };
const dark = oil(1.6), dim = oil(0.5);
const face = (x, z) => Math.atan2(ZAV.x - x, ZAV.z - z);                                             // every one of them faces the student
const prai = (q) => { const r = SkeletonUtils.clone(gw.scene); r.traverse(o => { if (o.isMesh) o.material = q.k === 'tired' ? dim : dark; });
  place(r, q.big ? 2.05 : 1.6, q.x, q.z, face(q.x, q.z)); if (q.big) { r.scale.x *= 1.18; r.scale.z *= 1.18; }
  if (q.k === 'tired') { r.scale.y *= 0.42; r.position.y *= 0.42; } return r; };
const PRAI = [
  { x: 2.89, z: 6.48, k: 'held' },                       // a small Prai, held at the cage's bars
  { x: 4.30, z: 5.96, k: 'held', big: 1 },               // a large Prai, held at the cage: fire does not tire it until it is gripped
  { x: 1.60, z: 7.70, k: 'come' },                       // one coming for him
  { x: 4.25, z: 8.35, k: 'far' }, { x: 1.05, z: 7.05, k: 'far', big: 1 },   // two circling, three to four metres out
  { x: 1.20, z: 5.60, k: 'tired' },                      // one tired, lying low within Grandmaster Pho's reach
];
PRAI.forEach(prai);
// the tired one's ring, closing over twelve seconds (here: half way), and the thin line that joins him to the one BAG will take
const tired = PRAI.find(q => q.k === 'tired'); ring(0.55, 0.014, 0xcfd8ee, tired.x, tired.z, 0.8); ring(0.34, 0.01, 0xcfd8ee, tired.x, tired.z, 0.35);
const bagLine = (() => { const dx = tired.x - PHO.x, dz = tired.z - PHO.z, L = Math.hypot(dx, dz); const o = new THREE.Mesh(new THREE.PlaneGeometry(0.03, L - 0.9), flat(0xfff1cf, 0.75));
  o.rotation.x = -Math.PI / 2; o.rotation.z = -Math.atan2(dx, dz); o.position.set(PHO.x + dx * 0.5, 0.014, PHO.z + dz * 0.5); scene.add(o); return o; })();
// GRIPPED (Master Zavier steady): bands of his light round every Prai at the cage
const gripG = new THREE.Group(); scene.add(gripG);
for (const q of PRAI) if (q.k === 'held') for (const y of q.big ? [0.55, 1.0, 1.45] : [0.45, 0.8, 1.15]) { const t = new THREE.Mesh(new THREE.TorusGeometry(q.big ? 0.42 : 0.33, 0.016, 8, 40), new THREE.MeshBasicMaterial({ color: 0xb48cff })); t.rotation.x = Math.PI / 2; t.position.set(q.x, y, q.z); gripG.add(t); }
// FIRE (Grandmaster Pho played): one fireball out of the Naga's mouth, RISING, arcing and coming down on the small Prai at the cage
const fireG = new THREE.Group(); scene.add(fireG);
{ const to = new THREE.Vector3(PRAI[0].x, 1.15, PRAI[0].z), mid = head.clone().lerp(to, 0.5); mid.y += 1.7;
  const curve = new THREE.QuadraticBezierCurve3(head.clone(), mid, to), at = curve.getPoint(0.62);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffd0d8 })); ball.position.copy(at); fireG.add(ball);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 14), flat(RUBY, 0.45)); halo.position.copy(at); fireG.add(halo);
  const pts = []; for (let i = 0; i <= 24; i++) pts.push(curve.getPoint(0.12 + (0.62 - 0.12) * i / 24));
  fireG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.014, 8, false), flat(RUBY, 0.55)));
  fireG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.slice(14)), 24, 0.035, 8, false), flat(RUBY, 0.22)));
  pool(0.5, RUBY, at.x, at.z, 0.16); const lf = new THREE.PointLight(RUBY, 1.6, 3.0, 1.8); lf.position.copy(at); fireG.add(lf);
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 10), flat(RUBY, 0.55)); mouth.position.copy(head); fireG.add(mouth); }

const cam = new THREE.PerspectiveCamera(72, W / H, 0.08, 200);
// each one's face for the switch button: his own head, photographed once from in front of him (he faces +z)
const portrait = (bone, lift) => { const hw = new THREE.Vector3(); bone.getWorldPosition(hw); hw.y += lift;
  const pc = new THREE.PerspectiveCamera(26, 1, 0.05, 20); pc.position.set(hw.x, hw.y, hw.z + 0.95); pc.lookAt(hw);
  const fill = new THREE.AmbientLight(0xffffff, 2.6); scene.add(fill); renderer.setSize(256, 256, false); renderer.render(scene, pc);
  const c = document.createElement('canvas'); c.width = c.height = 256; c.getContext('2d').drawImage(renderer.domElement, 0, 0); scene.remove(fill); renderer.setSize(W, H, false); return c; };
thread.visible = true; gripG.visible = false; fireG.visible = false;
const FACE = { pho: portrait(headB, 0.07), zav: portrait(zHead, 0.07) };
const hud = (g, played, mark) => {     // the plan's screen (§5.6) at two pixels a point, on the game's own HUD measures (shell.html)
  const P = (x) => x * 2; g.textBaseline = 'middle';
  const UI = 'Inter, "Helvetica Neue", Arial, system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';
  const disc = (x, y, d, fill, stroke, lw) => { g.beginPath(); g.arc(P(x), P(y), P(d / 2), 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 4; g.strokeStyle = stroke; g.stroke(); } };
  const arc = (x, y, d, k, col, lw) => { g.beginPath(); g.arc(P(x), P(y), P(d / 2) - 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); g.lineWidth = lw || 7; g.strokeStyle = col; g.stroke(); };
  const txt = (s, x, y, px, col, o) => { o = o || {}; g.font = (o.w || '600') + ' ' + P(px) + 'px ' + (o.mono ? MONO : UI); g.letterSpacing = P(o.ls || 0) + 'px'; g.textAlign = o.al || 'center';
    if (o.sh) { g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = P(o.sh); } g.fillStyle = col; g.fillText(s, P(x), P(y)); g.shadowBlur = 0; g.letterSpacing = '0px'; };
  const rrect = (x, y, w, h, r) => { g.beginPath(); g.roundRect(P(x), P(y), P(w), P(h), P(r)); };
  // the three stat rows, top left: 250 points wide, 49 points apart (name 16.3 px, number 21.8 px mono, an 8-point track)
  [['SANITY', 68, ['#5C160F', '#E05543', '#FFC7BC']], ['AWARENESS', 62, ['#7A4415', '#FFB367', '#FFE8CE']], ['WISDOM', 71, ['#1C544C', '#63D6C8', '#D8FBF6']]].forEach((r, i) => { const y = 16 + i * 49;
    g.shadowColor = r[2][1]; g.shadowBlur = P(5); disc(25.5, y + 11, 13, r[2][1]); g.shadowBlur = 0;
    txt(r[0], 42, y + 12, 16.3, '#9AA1B0', { al: 'left', ls: 1.1 }); txt(String(r[1]), 266, y + 12, 21.8, '#E8E2D4', { al: 'right', w: '700', mono: 1 });
    rrect(16, y + 27, 250, 8, 4); g.fillStyle = 'rgba(30,34,42,0.92)'; g.fill();
    const gr = g.createLinearGradient(P(16), 0, P(16 + 250 * r[1] / 100), 0); gr.addColorStop(0, r[2][0]); gr.addColorStop(0.35, r[2][1]); gr.addColorStop(0.6, r[2][2]); gr.addColorStop(0.85, r[2][1]); gr.addColorStop(1, r[2][0]);
    rrect(16, y + 27, 250 * r[1] / 100, 8, 4); g.fillStyle = gr; g.fill(); });
  // sound and menu, top right (46 points, 56 apart); the bag and the eye are off the screen in the mode
  for (const [y, kind] of [[37, 'snd'], [93, 'menu']]) { disc(353, y, 46, 'rgba(7,8,11,0.62)', 'rgba(232,226,212,0.22)', 2); g.strokeStyle = '#E8E2D4'; g.fillStyle = '#E8E2D4'; g.lineWidth = P(1.9); g.lineCap = 'round';
    if (kind === 'menu') for (const dy of [-6, 0, 6]) { g.beginPath(); g.moveTo(P(345), P(y + dy)); g.lineTo(P(361), P(y + dy)); g.stroke(); }
    else { g.beginPath(); g.moveTo(P(343), P(y - 3)); g.lineTo(P(347), P(y - 3)); g.lineTo(P(352), P(y - 8)); g.lineTo(P(352), P(y + 8)); g.lineTo(P(347), P(y + 3)); g.lineTo(P(343), P(y + 3)); g.closePath(); g.fill();
      g.beginPath(); g.arc(P(353), P(y), P(5), -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(P(353), P(y), P(9.5), -0.9, 0.9); g.stroke(); } }
  // the objective box, under them (its top at 180), and the nine marks under it
  { const s = 'Bag the Prai: 6 left'; g.font = '500 ' + P(16.3) + 'px ' + UI; const tw = g.measureText(s).width / 2, sw = 74, w = 16 + sw + 12 + tw + 16, x0 = 195 - w / 2;
    const bg = g.createLinearGradient(0, P(180), 0, P(217)); bg.addColorStop(0, 'rgba(28,18,9,0.80)'); bg.addColorStop(1, 'rgba(7,8,11,0.78)');
    g.shadowColor = 'rgba(255,179,103,0.4)'; g.shadowBlur = P(11); g.fillStyle = bg; g.fillRect(P(x0), P(180), P(w), P(37)); g.shadowBlur = 0; g.lineWidth = 2; g.strokeStyle = 'rgba(255,179,103,0.7)'; g.strokeRect(P(x0), P(180), P(w), P(37));
    txt('OBJECTIVE', x0 + 16, 199, 11.5, '#FFB367', { al: 'left', ls: 1.6, w: '700' }); txt(s, x0 + 16 + sw + 12, 199, 16.3, '#E8E2D4', { al: 'left', w: '500' }); }
  for (let i = 0; i < 9; i++) { const on = i < 6; if (on) { g.shadowColor = 'rgba(232,226,212,0.7)'; g.shadowBlur = P(4); } disc(123 + i * 18, 232, 10, on ? '#E8E2D4' : 'rgba(255,255,255,0.10)', on ? null : 'rgba(255,255,255,0.28)', 2); g.shadowBlur = 0; }
  // the line being said, above the thumbs
  { const line = played === 'pho' ? 'A Prai is tired. BAG.' : 'The Prai are gripped. Switch to me.'; g.font = '600 ' + P(17) + 'px ' + UI; const tw = g.measureText(line).width / 2 + 22;
    rrect(195 - tw / 2, 559, tw, 30, 8); g.fillStyle = 'rgba(4,5,10,0.50)'; g.fill(); txt(line, 195, 574, 17, '#ffffff', { w: '600', sh: 3 }); }
  // where the other one is, when he is out of the picture: a mark at the screen's edge
  if (mark) { const col = played === 'pho' ? '#b995ff' : '#ffc64a'; disc(mark.x, mark.y, 30, 'rgba(7,8,11,0.7)', col, 3); txt(played === 'pho' ? 'Z' : 'P', mark.x, mark.y + 0.5, 13, col, { w: '700' });
    g.beginPath(); const sx = mark.x + (mark.right ? 20 : -20); g.moveTo(P(sx), P(mark.y - 6)); g.lineTo(P(sx + (mark.right ? 7 : -7)), P(mark.y)); g.lineTo(P(sx), P(mark.y + 6)); g.closePath(); g.fillStyle = col; g.fill(); }
  // the right thumb: the switch (the OTHER one's face and name), then his own hand
  const oc = played === 'pho' ? '#b995ff' : '#ffc64a', on = played === 'pho' ? 'ZAVIER' : 'PHO';
  g.save(); g.beginPath(); g.arc(P(318), P(630), P(32), 0, Math.PI * 2); g.clip(); g.drawImage(FACE[played === 'pho' ? 'zav' : 'pho'], P(318 - 32), P(630 - 32), P(64), P(64));
  g.fillStyle = 'rgba(7,8,11,0.62)'; g.fillRect(P(286), P(642), P(64), P(20)); g.restore(); disc(318, 630, 64, null, oc, 5); txt(on, 318, 651, 9.5, '#ffffff', { w: '700', ls: 0.6 });
  const B = 'rgba(10,10,18,0.72)';
  if (played === 'pho') {
    disc(318, 730, 80, B, '#ff5a7a', 6); txt('FIRE', 318, 730, 16, '#ff8fa3', { w: '700', ls: 1 });
    disc(253, 665, 60, B, 'rgba(255,255,255,0.22)', 3); arc(253, 665, 60, 0.62, '#ffc64a'); txt('SHOCK', 253, 660, 9, '#ffc64a', { w: '700', ls: 0.5 }); txt('WAVE', 253, 671, 9, '#ffc64a', { w: '700', ls: 0.5 });
    g.shadowColor = '#fff1cf'; g.shadowBlur = P(9); disc(226, 730, 66, B, '#fff1cf', 5); g.shadowBlur = 0; txt('BAG', 226, 730, 13, '#fff1cf', { w: '700', ls: 1 });       // the button the moment calls for stands larger
  } else {
    disc(318, 730, 80, B, 'rgba(255,255,255,0.22)', 4); arc(318, 730, 80, 0.7, '#b995ff', 9); txt('STEADY', 318, 730, 14, '#cdb4ff', { w: '700', ls: 1 });                 // running: its five seconds as a ring
    disc(253, 665, 60, B, '#b7c49a', 3); txt('SMELL', 253, 665, 11, '#cfdcb0', { w: '700', ls: 0.6 });
  }
  // the stick, where the left thumb is
  disc(92, 716, 104, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.28)', 3); disc(96, 700, 44, 'rgba(255,255,255,0.22)');
};
window.__shoot = (sh) => {
  cam.fov = sh.fov || 72; cam.updateProjectionMatrix(); cam.position.set(...sh.pos); cam.lookAt(new THREE.Vector3(...sh.at)); cam.updateMatrixWorld(true);
  const zp = sh.played === 'zav';
  thread.visible = true; gripG.visible = zp; fireG.visible = !zp; bagLine.visible = !zp; cageWorn.forEach(o => { o.visible = !zp; }); cageFast.forEach(o => { o.visible = zp; });
  playedRing.pho.visible = !zp; playedRing.zav.visible = zp;
  renderer.render(scene, cam);
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(renderer.domElement, 0, 0);
  // the other one: where his chest stands on this screen, in points
  const o = zp ? PHO : ZAV, v = new THREE.Vector3(o.x, 1.1, o.z).project(cam), ox = (v.x * 0.5 + 0.5) * 390, oy = (-v.y * 0.5 + 0.5) * 844;
  const out = v.z > 1 || ox < 14 || ox > 376; window.__other = (zp ? 'Pho' : 'Zavier') + ' at ' + ox.toFixed(0) + ', ' + oy.toFixed(0) + (out ? ' (out of the picture)' : '');
  if (sh.hud) hud(g, sh.played, out ? { x: ox > 195 ? 372 : 18, y: Math.min(520, Math.max(260, oy)), right: ox > 195 } : null);
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
const PHO = { x: 1.85, z: 4.0 }, ZAV = { x: 3.15, z: 5.0 };      // as in the page
const follow = (h) => { const d = 26 * Math.PI / 180, pos = [h.x, 3.1, Math.max(0.15, h.z - 4.0)]; return { pos, at: [pos[0], pos[1] - Math.sin(d) * 10, pos[2] + Math.cos(d) * 10] }; };   // 4.0 m behind, 3.1 m up, 26 degrees down, facing down the court; it never passes the gate
const SHOTS = [
  { name: 'follow-pho', ...follow(PHO), played: 'pho', hud: 1 },                                     // the plan's default
  { name: 'follow-zavier', ...follow(ZAV), played: 'zav', hud: 1 },                                  // the same, Master Zavier played
  { name: 'close-pho', pos: [PHO.x - 0.62, 1.78, PHO.z - 1.55], at: [PHO.x + 0.55, 1.12, PHO.z + 3.6], played: 'pho', hud: 1 },   // close, over his shoulder
  { name: 'court-pho', pos: [2.45, 6.3, -1.3], at: [2.45, 0, 4.75], played: 'pho', hud: 1 },         // the whole court, from one raised place
  { name: 'follow-bare', ...follow(PHO), played: 'pho' },
];
for (const sh of SHOTS) { const url = await p.evaluate(s => window.__shoot(s), sh); fs.writeFileSync(`${OUT}-${sh.name}.png`, Buffer.from(url.split(',')[1], 'base64')); console.log(sh.name, await p.evaluate(() => window.__other)); }
console.log('errs', errs.slice(0, 5));
await br.close(); srv.close();
