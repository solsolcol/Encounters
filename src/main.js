import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// The page is embedded in a wrapper we do not control — make sure mobile gets a
// real device-width viewport (and safe-area insets) either way.
(() => {
  let m = document.querySelector('meta[name="viewport"]');
  if (!m) { m = document.createElement('meta'); m.name = 'viewport'; document.head.appendChild(m); }
  if (!/viewport-fit/.test(m.content || '')) {
    m.content = 'width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover';
  }
})();

/* =========================================================================
   MASTER Z'S SPIRITUAL ENCOUNTERS — 3D PROTOTYPE
   Chapter 1 · The Hell Note
   Placeholder narrative — to be replaced with the real script.
   ========================================================================= */

// A touchscreen laptop reports BOTH. Never use one to switch the other off:
// HAS_TOUCH only decides whether touch handlers are worth attaching, and the
// mouse is always live. LOW (reduced quality) needs a small screen too, or a
// touchscreen laptop gets phone-grade rendering for no reason.
const HAS_TOUCH = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const IS_PHONE = HAS_TOUCH && Math.max(innerWidth, innerHeight) < 1100;
const LOW = IS_PHONE;

/* ---------------------------------------------------------- procedural tex */
function cnv(s = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = s;
  return [c, c.getContext('2d')];
}
function noiseInto(ctx, s, amt, alpha = 1) {
  const img = ctx.getImageData(0, 0, s, s), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amt;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
    if (alpha < 1) d[i + 3] = 255 * alpha;
  }
  ctx.putImageData(img, 0, 0);
}
function fbmField(s, oct = 5) {
  const f = new Float32Array(s * s);
  let amp = 1, tot = 0;
  for (let o = 0; o < oct; o++) {
    const step = Math.max(1, s >> (o + 1));
    const g = [];
    const gs = Math.ceil(s / step) + 2;
    for (let i = 0; i < gs * gs; i++) g.push(Math.random());
    for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
      const gx = x / step, gy = y / step;
      const x0 = Math.floor(gx), y0 = Math.floor(gy);
      const tx = gx - x0, ty = gy - y0;
      const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      const a = g[y0 * gs + x0], b = g[y0 * gs + x0 + 1];
      const c = g[(y0 + 1) * gs + x0], dd = g[(y0 + 1) * gs + x0 + 1];
      f[y * s + x] += ((a + (b - a) * sx) + ((c + (dd - c) * sx) - (a + (b - a) * sx)) * sy) * amp;
    }
    tot += amp; amp *= 0.5;
  }
  for (let i = 0; i < f.length; i++) f[i] /= tot;
  return f;
}
function texFromField(f, s, ramp) {
  const [c, ctx] = cnv(s);
  const img = ctx.createImageData(s, s), d = img.data;
  for (let i = 0; i < s * s; i++) {
    const [r, g, b] = ramp(f[i], i % s, (i / s) | 0);
    d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}
// grayscale (non-color) variant for roughness / bump maps
function grayTex(f, s, ramp) {
  const t = texFromField(f, s, ramp);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

const S = LOW ? 256 : 512;

// --- wet asphalt / concrete pavement
function makeGround() {
  const f = fbmField(S, 5);
  const map = texFromField(f, S, (v) => {
    const b = 38 + v * 34;
    const speck = Math.random() < 0.02 ? 30 : 0;
    return [b + speck, b + speck * 0.95, b * 1.06 + speck];
  });
  const rough = grayTex(f, S, (v) => { const r = 150 + v * 90; return [r, r, r]; });
  map.repeat.set(14, 14); rough.repeat.set(14, 14);
  return { map, rough };
}
// --- coarse night grass for the ground outside the block
function makeGrass() {
  const f = fbmField(S, 5);
  const map = texFromField(f, S, (v) => {
    const blade = Math.random() < 0.16 ? 14 : 0;
    return [20 + v * 22 + blade, 34 + v * 40 + blade * 1.4, 20 + v * 18 + blade * 0.5];
  });
  const rough = grayTex(f, S, (v) => { const r = 205 + v * 45; return [r, r, r]; });
  map.repeat.set(46, 46); rough.repeat.set(46, 46);
  return { map, rough };
}
// --- weathered concrete pillar
function makeConcrete() {
  const f = fbmField(S, 4);
  const map = texFromField(f, S, (v, x, y) => {
    let b = 112 + v * 46;
    if (y > S * 0.82) b *= 0.72 - (y / S - 0.82) * 0.8; // damp base staining
    return [b, b * 0.99, b * 0.94];
  });
  const rough = grayTex(f, S, (v) => { const r = 175 + v * 60; return [r, r, r]; });
  return { map, rough };
}
// --- red-gold joss / lacquer
function makeLacquer() {
  const f = fbmField(S, 4);
  return texFromField(f, S, (v) => [120 + v * 70, 14 + v * 18, 12 + v * 14]);
}
// --- hell note paper: pale yellow with red print bands
function makeHellNote() {
  const s = 256, [c, ctx] = cnv(s);
  ctx.fillStyle = '#d8c489'; ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = '#8d2b22';
  ctx.fillRect(0, s * 0.06, s, s * 0.10);
  ctx.fillRect(0, s * 0.84, s, s * 0.10);
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 22; i++) {
    ctx.fillRect(s * 0.1 + (i % 11) * s * 0.072, s * 0.3 + ((i / 11) | 0) * s * 0.2, s * 0.05, s * 0.13);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#9a7a33'; ctx.lineWidth = 3;
  ctx.strokeRect(s * 0.03, s * 0.03, s * 0.94, s * 0.94);
  noiseInto(ctx, s, 26);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// --- soft round sprite for smoke / embers
function makeSoftDot(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const s = 64, [c, ctx] = cnv(s);
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}

// --- the moon: a lit disc with faint maria, soft at the limb. Drawn on a
// transparent canvas so the sprite has a real silhouette rather than a square.
function makeMoon() {
  const s = 256, [c, ctx] = cnv(s);
  const r = s * 0.40;
  const g = ctx.createRadialGradient(s * 0.42, s * 0.40, r * 0.1, s / 2, s / 2, r);
  g.addColorStop(0.00, '#fffdf4');
  g.addColorStop(0.70, '#f0ebdc');
  g.addColorStop(0.94, '#d5d8dc');
  g.addColorStop(1.00, '#bcc3cd');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(s / 2, s / 2, r, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.beginPath(); ctx.arc(s / 2, s / 2, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#8f96a3';
  ctx.globalAlpha = 0.17;                       // maria — keeps it off being a coin
  for (const [x, y, rr] of [[0.40, 0.36, 0.19], [0.58, 0.29, 0.12], [0.63, 0.55, 0.16],
                            [0.37, 0.61, 0.11], [0.50, 0.73, 0.08], [0.30, 0.47, 0.07]]) {
    ctx.beginPath(); ctx.arc(s * x, s * y, s * rr, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 0.07;                       // craters
  for (let i = 0; i < 34; i++) {
    ctx.beginPath();
    ctx.arc(s * (0.16 + Math.random() * 0.68), s * (0.16 + Math.random() * 0.68),
            s * (0.006 + Math.random() * 0.022), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* --------------------------------------------------- glTF texture rescue */
/* GLTFLoader decodes embedded images by wrapping each one in a Blob URL and
   fetching it. Inside a sandboxed frame the page's security policy refuses
   blob: fetches, so every texture is silently dropped and the model renders
   as flat white — which is exactly what happens here in production and never
   happens locally, because a local file has no such policy.

   createImageBitmap() accepts a Blob object directly. No URL is created and
   nothing is fetched, so no policy applies. This decodes the images that way
   and hangs them back on the materials.                                      */

function glbChunks(buf) {
  const dv = new DataView(buf);
  let off = 12, json = null, bin = null;
  while (off + 8 <= dv.byteLength) {
    const len = dv.getUint32(off, true), type = dv.getUint32(off + 4, true);
    const data = buf.slice(off + 8, off + 8 + len);
    if (type === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(data));
    else if (type === 0x004E4942) bin = data;
    off += 8 + len;
  }
  return { json, bin };
}

function rescueTextures(gltf, buf) {
  let json, bin;
  try { ({ json, bin } = glbChunks(buf)); } catch { return; }
  if (!json || !bin || !json.images || !json.images.length) return;

  const cache = new Map();                     // one decode per image, not per material
  const bitmap = (i) => {
    if (!cache.has(i)) {
      const img = json.images[i], bv = json.bufferViews[img.bufferView];
      const bytes = new Uint8Array(bin, bv.byteOffset || 0, bv.byteLength);
      cache.set(i, createImageBitmap(new Blob([bytes], { type: img.mimeType || 'image/jpeg' })));
    }
    return cache.get(i);
  };

  for (const [obj, assoc] of gltf.parser.associations) {
    if (!obj || !obj.isMaterial || assoc.materials === undefined) continue;
    if (obj.map) continue;                     // the normal path worked; leave it alone
    const md = json.materials[assoc.materials];
    const ref = md && md.pbrMetallicRoughness && md.pbrMetallicRoughness.baseColorTexture;
    if (!ref) continue;
    const src = json.textures[ref.index] && json.textures[ref.index].source;
    if (src === undefined) continue;
    bitmap(src).then((bmp) => {
      const t = new THREE.Texture(bmp);
      t.flipY = false;                         // glTF images are already top-left
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.needsUpdate = true;
      obj.map = t;
      obj.needsUpdate = true;
    }).catch(() => {});
  }
}

/* ------------------------------------------------------------- renderer */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.6 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.42;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Metal needs something to reflect. RoomEnvironment is a tiny procedural
// studio generated at runtime — no file to download, and it fixes every
// metallic surface in the scene at once.
const scene = new THREE.Scene();
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.05;   // just enough to keep metal from going black
  pmrem.dispose();
}
scene.background = new THREE.Color(0x070a10);
scene.fog = new THREE.FogExp2(0x0b1018, 0.021);

/* ------------------------------------------------------------ night sky */
/* Three layers, all of them ignoring fog and writing no depth: a gradient
   dome, a star field, and the moon. The dome is drawn first with depth
   testing off, so it can never occlude anything; the stars and moon sit
   inside the far plane and DO depth-test, so the block and the trees cut
   into them the way a real skyline does.                                   */
// Added to the scene further down, after `world`, so that the first Group in
// the scene is still the world — several of the test harnesses find it that
// way. Draw order is decided by renderOrder and depth, not by scene order.
const sky = new THREE.Group();

{
  // horizon carries the city's sodium haze; overhead goes almost black
  const [sc, sctx] = cnv(64);
  const grad = sctx.createLinearGradient(0, 64, 0, 0);
  grad.addColorStop(0.00, '#241d1c');
  grad.addColorStop(0.16, '#1a1a24');
  grad.addColorStop(0.42, '#101526');
  grad.addColorStop(0.72, '#080b16');
  grad.addColorStop(1.00, '#04060b');
  sctx.fillStyle = grad; sctx.fillRect(0, 0, 64, 64);
  const skyTex = new THREE.CanvasTexture(sc);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(150, 24, 16),
    new THREE.MeshBasicMaterial({
      map: skyTex, side: THREE.BackSide, fog: false,
      depthWrite: false, depthTest: false
    }));
  dome.renderOrder = -1000;
  sky.add(dome);
}

// --- stars: two layers, so the sky has a few bright ones rather than an
// even dusting. sizeAttenuation off keeps them crisp points at any distance.
const starDot = makeSoftDot('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
function starLayer(n, size, minLum, maxLum) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    // uniform over the upper hemisphere, kept just off the horizon
    const el = Math.asin(0.09 + Math.random() * 0.9);
    const az = Math.random() * Math.PI * 2;
    const cr = Math.cos(el) * 140;
    pos[i * 3] = Math.cos(az) * cr;
    pos[i * 3 + 1] = Math.sin(el) * 140;
    pos[i * 3 + 2] = Math.sin(az) * cr;
    const l = minLum + Math.random() * (maxLum - minLum);
    const warm = Math.random() < 0.22;          // a few amber ones among the blue-white
    col[i * 3] = l * (warm ? 1.0 : 0.86);
    col[i * 3 + 1] = l * (warm ? 0.90 : 0.90);
    col[i * 3 + 2] = l * (warm ? 0.76 : 1.0);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    map: starDot, size, sizeAttenuation: false, vertexColors: true,
    transparent: true, depthWrite: false, fog: false,
    blending: THREE.AdditiveBlending
  }));
  pts.frustumCulled = false;
  sky.add(pts);
  return pts;
}
const DIM_N = LOW ? 380 : 760, BRIGHT_N = LOW ? 60 : 120;
starLayer(DIM_N, 1.6, 0.20, 0.55);
const brightStars = starLayer(BRIGHT_N, 3.2, 0.60, 1.0);

// twinkle, on the bright layer only — the dim ones would just look noisy
const starBase = brightStars.geometry.attributes.color.array.slice();
const starPhase = new Float32Array(BRIGHT_N);
for (let i = 0; i < BRIGHT_N; i++) starPhase[i] = Math.random() * 100;
function updateStars(t) {
  const c = brightStars.geometry.attributes.color;
  for (let i = 0; i < BRIGHT_N; i++) {
    const p = starPhase[i];
    const k = 0.74 + 0.26 * Math.sin(t * (0.5 + (p % 1) * 1.7) + p);
    c.array[i * 3] = starBase[i * 3] * k;
    c.array[i * 3 + 1] = starBase[i * 3 + 1] * k;
    c.array[i * 3 + 2] = starBase[i * 3 + 2] * k;
  }
  c.needsUpdate = true;
}

// --- the moon. It sits roughly where the moonlight comes from, but lower and
// swung a little toward the block, so it is in frame on the walk in rather
// than something you have to go looking for.
const MOON_POS = new THREE.Vector3(-12.3, 12.4, -15.8).normalize().multiplyScalar(126);
{
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeSoftDot('rgba(196,218,255,0.34)', 'rgba(150,182,255,0)'),
    transparent: true, depthWrite: false, fog: false,
    blending: THREE.AdditiveBlending
  }));
  halo.position.copy(MOON_POS);
  halo.scale.setScalar(40);
  halo.renderOrder = -2;
  sky.add(halo);

  const disc = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeMoon(), transparent: true, depthWrite: false, fog: false
  }));
  disc.position.copy(MOON_POS);
  disc.scale.setScalar(14);
  disc.renderOrder = -1;
  sky.add(disc);
}

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.08, 160);
const yaw = new THREE.Object3D();      // horizontal rotation
const pitch = new THREE.Object3D();    // vertical rotation
yaw.add(pitch); pitch.add(camera);
yaw.position.set(0, 1.62, 17);         // out on the grass, facing the block

// The burner and everything that belongs to it — light, smoke, embers, notes,
// the trigger radius — are all positioned from this one point, so the shrine
// can be moved without hunting down a dozen hard-coded coordinates.
const SHRINE = new THREE.Vector3(-1.0, 0, -7.5);   // inside the void deck
scene.add(yaw);

/* -------------------------------------------------------------- lighting */
const hemi = new THREE.HemisphereLight(0x35446b, 0x14161c, 0.85);
scene.add(hemi);

const moon = new THREE.DirectionalLight(0xa8bfe6, 0.95);
moon.position.set(-14, 20, -8);
moon.castShadow = true;
moon.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048);
moon.shadow.camera.near = 1; moon.shadow.camera.far = 60;
moon.shadow.camera.left = -20; moon.shadow.camera.right = 20;
moon.shadow.camera.top = 20; moon.shadow.camera.bottom = -20;
moon.shadow.bias = -0.0012;
moon.shadow.normalBias = 0.03;
scene.add(moon);

const fill = new THREE.DirectionalLight(0x6a86b8, 0.28);
fill.position.set(6, 8, 16);
scene.add(fill);

// The sodium lamps are built with their posts further down — see makeLamp().

// candle / burner fire light (flickers)
const fireLight = new THREE.PointLight(0xff7a26, 14, 16, 1.7);
fireLight.position.set(SHRINE.x - 0.2, 0.95, SHRINE.z);
scene.add(fireLight);

/* ------------------------------------------------------------ materials */
const gTex = makeGround();
const grassTex = makeGrass();
const cTex = makeConcrete();
const lacquerTex = makeLacquer();
const noteTex = makeHellNote();

const matGround = new THREE.MeshStandardMaterial({
  map: gTex.map, roughnessMap: gTex.rough, roughness: 0.92, metalness: 0.02, color: 0xffffff
});
const matGrass = new THREE.MeshStandardMaterial({
  map: grassTex.map, roughnessMap: grassTex.rough, roughness: 0.98, metalness: 0
});
const matConcrete = new THREE.MeshStandardMaterial({
  map: cTex.map, roughnessMap: cTex.rough, roughness: 0.95, metalness: 0.0
});
const matLacquer = new THREE.MeshStandardMaterial({ map: lacquerTex, roughness: 0.42, metalness: 0.18 });
const matMetal = new THREE.MeshStandardMaterial({ color: 0x39332c, roughness: 0.62, metalness: 0.85 });
const matDarkWood = new THREE.MeshStandardMaterial({ color: 0x2a1c14, roughness: 0.78, metalness: 0.05 });
const matGold = new THREE.MeshStandardMaterial({ color: 0xc79a3d, roughness: 0.3, metalness: 0.95 });

/* --------------------------------------------------------------- world */
const world = new THREE.Group();
scene.add(world);
scene.add(sky);          // see the note where `sky` is built

// ground — grass everywhere outside the block
const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), matGrass);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
world.add(ground);

/* ------------------------------------------------------------- the block */
/* HDB.glb is a textured shell: its void deck is painted on the outside of a
   solid box, so there is nothing to walk into. The fix is to hide that box
   (Grd_Floor) and build a real corridor in the gap it leaves — floor, ceiling
   and pillars under the tower, which is how a void deck is actually put
   together anyway. The tower, roof, lift core and staircase are all the
   model's own.                                                              */

const HDB_SCALE = 0.001;                        // the model is in millimetres
const HDB_OFFSET = new THREE.Vector3(-4.706, 0, -4.30);   // tower centred, face at z=0
const DECK = { w: 43.5, d: 19.8, zc: -9.8, clear: 3.0 };  // the corridor we build

const HDB_BUF = b64ToBuffer('__HDB_B64__');
new GLTFLoader().parse(HDB_BUF, '', (gltf) => {
  rescueTextures(gltf, HDB_BUF);
  const blk = gltf.scene;
  blk.scale.setScalar(HDB_SCALE);
  blk.position.copy(HDB_OFFSET);
  blk.traverse(o => {
    if (!o.isMesh) return;
    if (o.name.includes('Grd_Floor')) { o.visible = false; return; }  // the solid box
    o.castShadow = true;
    o.receiveShadow = true;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) { m.roughness = 0.94; m.metalness = 0; }
  });
  world.add(blk);
}, (err) => console.warn('HDB failed to load', err));

// --- the void deck we build underneath it
const deckFloor = new THREE.Mesh(new THREE.PlaneGeometry(DECK.w, DECK.d), matGround);
deckFloor.rotation.x = -Math.PI / 2;
deckFloor.position.set(0, 0.012, DECK.zc);
deckFloor.receiveShadow = true;
world.add(deckFloor);

const deckCeil = new THREE.Mesh(new THREE.BoxGeometry(DECK.w, 0.22, DECK.d), matConcrete);
deckCeil.position.set(0, DECK.clear + 0.11, DECK.zc);
deckCeil.castShadow = true; deckCeil.receiveShadow = true;
world.add(deckCeil);

const deckPillar = new THREE.BoxGeometry(0.6, DECK.clear, 0.6);
// offset so the bay on the approach line is clear — a pillar dead ahead of
// the spawn point makes the entrance read as blocked rather than inviting
for (const px of [-21.75, -16.75, -11.75, -6.75, -1.75, 3.25, 8.25, 13.25, 18.25]) {
  for (const pz of [-1.2, -9.8, -18.2]) {
    const c = new THREE.Mesh(deckPillar, matConcrete);
    c.position.set(px, DECK.clear / 2, pz);
    c.castShadow = true; c.receiveShadow = true;
    world.add(c);
  }
}

const deckBack = new THREE.Mesh(new THREE.BoxGeometry(DECK.w, DECK.clear, 0.3), matConcrete);
deckBack.position.set(0, DECK.clear / 2, -19.5);
deckBack.castShadow = true; deckBack.receiveShadow = true;
world.add(deckBack);

/* ---------------------------------------------------------- street lamps */
/* One post, arm and head per lamp, all sharing three geometries and one
   emissive material.

   Only two of them carry a real light. Every extra dynamic light is paid for
   on every lit pixel in the scene, which is the one cost a phone genuinely
   cannot absorb — so the lamps further out fake their pool of light with a
   flat additive disc on the grass instead. At that distance the difference
   is invisible and it costs nothing.                                        */
const lampPostGeo = new THREE.CylinderGeometry(0.09, 0.12, 5.6, 8);
const lampArmGeo = new THREE.BoxGeometry(0.9, 0.1, 0.1);
const lampHeadGeo = new THREE.SphereGeometry(0.26, 12, 8);
const lampPoolGeo = new THREE.CircleGeometry(1, 24);
const lampHeadMat = new THREE.MeshStandardMaterial({
  color: 0xffc98a, emissive: 0xffb367, emissiveIntensity: 3.4, roughness: 0.4 });
const lampPoolTex = makeSoftDot('rgba(255,166,84,0.70)', 'rgba(255,128,40,0)');
lampPoolTex.colorSpace = THREE.SRGBColorSpace;   // otherwise the sodium reads grey
const lampPoolMat = new THREE.MeshBasicMaterial({
  map: lampPoolTex, transparent: true, depthWrite: false,
  blending: THREE.AdditiveBlending
});

function makeLamp(x, z, aimX, aimZ, light) {
  const dx = aimX - x, dz = aimZ - z, len = Math.hypot(dx, dz) || 1;
  const ux = dx / len, uz = dz / len;              // the way the arm reaches

  const post = new THREE.Mesh(lampPostGeo, matMetal);
  post.position.set(x, 2.8, z); post.castShadow = true;
  world.add(post);

  const arm = new THREE.Mesh(lampArmGeo, matMetal);
  arm.position.set(x + ux * 0.45, 5.55, z + uz * 0.45);
  arm.rotation.y = Math.atan2(-uz, ux);            // box is long on +X
  arm.castShadow = true;
  world.add(arm);

  const hx = x + ux * 0.9, hz = z + uz * 0.9;
  const head = new THREE.Mesh(lampHeadGeo, lampHeadMat);
  head.position.set(hx, 5.5, hz);
  world.add(head);

  if (!light) {                                    // the painted-on version
    const pool = new THREE.Mesh(lampPoolGeo, lampPoolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(x + ux * 2.6, 0.035, z + uz * 2.6);
    pool.scale.setScalar(3.9);
    world.add(pool);
    return null;
  }

  const sp = new THREE.SpotLight(0xffb367, light.power, 26, Math.PI / 4.4, 0.55, 1.4);
  sp.position.set(hx, 5.5, hz);
  sp.target.position.set(x + ux * 3.4, 0, z + uz * 3.4);
  if (light.shadow) {
    sp.castShadow = true;
    sp.shadow.mapSize.set(LOW ? 512 : 1024, LOW ? 512 : 1024);
    sp.shadow.bias = -0.002;
  }
  scene.add(sp, sp.target);
  return sp;
}

// the entrance lamp keeps its shadow, the one behind the spawn point lights
// the way in, and the three further out are painted
makeLamp(8.0, 6.6, 5.5, 3.0, { power: 26, shadow: true });
makeLamp(5.5, 20.5, 3.5, 18.2, { power: 17 });
makeLamp(-11.5, 4.6, -9.2, 2.2, null);
makeLamp(17.5, 12.5, 15.0, 10.2, null);
makeLamp(-19.0, 16.5, -16.5, 14.0, null);

/* --------------- the offering: the object of the encounter --------------- */
const offering = new THREE.Group();
offering.position.copy(SHRINE);
world.add(offering);

// paving square the offering sits on
const mat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 1.8),
  new THREE.MeshStandardMaterial({ color: 0x1a1d22, roughness: 0.9 }));
mat.position.y = 0.02; mat.receiveShadow = true;
offering.add(mat);

// metal burner drum
const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.9, 16, 1, true), matMetal);
drum.position.set(-0.2, 0.45, 0.0);
drum.castShadow = true; drum.receiveShadow = true;
drum.material.side = THREE.DoubleSide;
offering.add(drum);
// glowing ash inside
const ash = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16),
  new THREE.MeshBasicMaterial({ color: 0xff5a12 }));
ash.rotation.x = -Math.PI / 2; ash.position.set(-0.2, 0.72, 0);
offering.add(ash);

// offering sets: a lacquer plate of oranges with joss sticks planted beside it.
// Three of them, spaced around the drum at different angles, so the shrine
// reads as something several people have added to rather than one tidy display.
const orangeMat = new THREE.MeshStandardMaterial({ color: 0xd06a12, roughness: 0.72 });
const jossTips = [];

function offeringSet(px, pz, spin, scale = 1) {
  const set = new THREE.Group();
  set.position.set(px, 0, pz);
  set.rotation.y = spin;
  set.scale.setScalar(scale);
  offering.add(set);

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.05, 18), matLacquer);
  plate.position.y = 0.045;
  plate.castShadow = plate.receiveShadow = true;
  set.add(plate);

  for (const [ox, oz] of [[-0.07, -0.06], [0.07, 0.02], [0.0, 0.10]]) {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), orangeMat);
    o.position.set(ox, 0.15, oz);
    o.castShadow = true;
    set.add(o);
  }

  for (let i = 0; i < 3; i++) {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 5), matDarkWood);
    st.position.set(-0.17 + i * 0.09, 0.3, -0.30);
    st.rotation.z = (i - 1) * 0.06;
    set.add(st);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5),
      new THREE.MeshBasicMaterial({ color: 0xff6a1f }));
    tip.position.set(st.position.x + (i - 1) * 0.015, 0.56, -0.30);
    set.add(tip);
    jossTips.push(tip);
  }
  return set;
}

offeringSet(0.58, 0.30, -0.22);
offeringSet(-0.80, 0.34, 0.55, 0.94);
offeringSet(0.04, -0.58, 2.7, 0.88);

// hell notes: hundreds of them, so one InstancedMesh rather than hundreds of
// objects — the whole drift is a single draw call either way.
const noteMat = new THREE.MeshStandardMaterial({
  map: noteTex, roughness: 0.88, side: THREE.DoubleSide });
const noteGeo = new THREE.PlaneGeometry(0.30, 0.15);

const OFFER_X = SHRINE.x, OFFER_Z = SHRINE.z;   // the burner everything blew away from
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion();
const _v = new THREE.Vector3(), _one = new THREE.Vector3(1, 1, 1), _ax = new THREE.Vector3();

// --- settled on the ground, thickest near the drum and thinning outward.
// The pile around the burner stays as dense as it was; past NEAR_R the
// scatter is thinned out, so the eye still reads a source rather than
// wallpaper. Positions are built first so the mesh is sized to what survives.
const NEAR_R = 3.2;                        // "at the burner" ends here
const FAR_KEEP = 0.6;                      // keep 60% of everything past it
const GROUND_TRIES = LOW ? 300 : 525;
const groundXforms = [];
for (let i = 0; i < GROUND_TRIES; i++) {
  const r = 0.7 + 19 * Math.pow(Math.random(), 1.7);   // clustered near the source
  if (r > NEAR_R && Math.random() > FAR_KEEP) continue;
  const a = Math.random() * Math.PI * 2;
  groundXforms.push(new THREE.Matrix4().compose(
    new THREE.Vector3(
      THREE.MathUtils.clamp(OFFER_X + Math.cos(a) * r, -20.5, 20.5),
      0.004 + Math.random() * 0.012,                   // stacked a hair off the floor
      THREE.MathUtils.clamp(OFFER_Z + Math.sin(a) * r * 0.9, -18.5, 18)),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(
      -Math.PI / 2 + (Math.random() - 0.5) * 0.16,     // not perfectly flat
      Math.random() * Math.PI * 2,
      (Math.random() - 0.5) * 0.2)),
    _one));
}
const grounded = new THREE.InstancedMesh(noteGeo, noteMat, groundXforms.length);
grounded.receiveShadow = true;
grounded.frustumCulled = false;
groundXforms.forEach((m, i) => grounded.setMatrixAt(i, m));
grounded.instanceMatrix.needsUpdate = true;
world.add(grounded);

// --- airborne, turning slowly on the updraft and drifting round the deck
const FLY_N = LOW ? 54 : 115;
const flying = new THREE.InstancedMesh(noteGeo, noteMat, FLY_N);
flying.frustumCulled = false;
world.add(flying);

const airborne = [];
const FAR_SHARE = 0.30;                              // how many drift out over the grass

function seedNote(f, firstRun) {
  // Roughly a third of them ride out past the block, so the air is already
  // moving where you spawn instead of only around the burner.
  f.far = Math.random() < FAR_SHARE;
  do {                                               // distance from the burner,
    f.r = f.far ? 17 + Math.random() * 15            // thinned past NEAR_R to match
                : 1.5 + Math.random() * 16;          // the ground scatter
  } while (!f.far && f.r > NEAR_R && Math.random() > FAR_KEEP);
  // the far ones keep to the open side — swung the other way they would just
  // orbit inside the block, where nothing can see them
  f.a = f.far ? Math.random() * Math.PI : Math.random() * Math.PI * 2;
  f.y = firstRun ? 0.2 + Math.random() * 7 : 0.15 + Math.random() * 0.5;
  f.top = 5.5 + Math.random() * 7;                     // height it fades out at
  f.rise = 0.16 + Math.random() * 0.62;              // updraft speed
  f.swirl = (0.05 + Math.random() * 0.22) * (Math.random() < 0.25 ? -1 : 1);
  f.wob = Math.random() * Math.PI * 2;               // per-note phase offset
  f.spin = 0.5 + Math.random() * 2.4;                // tumble rate
  f.axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    .normalize();
  return f;
}
for (let i = 0; i < FLY_N; i++) airborne.push(seedNote({}, true));

function updateNotes(dt, t) {
  for (let i = 0; i < FLY_N; i++) {
    const f = airborne[i];
    f.a += f.swirl * dt * (3 / Math.max(f.r, 2));    // tighter orbits move faster
    f.y += f.rise * dt;
    if (f.y > f.top) seedNote(f, false);             // recycle back to the ground
    const r = f.r + Math.sin(t * 0.45 + f.wob) * 0.9;
    _v.set(OFFER_X + Math.cos(f.a) * r,
           f.y + Math.sin(t * 1.1 + f.wob) * 0.18,
           OFFER_Z + Math.sin(f.a) * r);
    _q.setFromAxisAngle(_ax.copy(f.axis), t * f.spin + f.wob);
    flying.setMatrixAt(i, _m.compose(_v, _q, _one));
  }
  flying.instanceMatrix.needsUpdate = true;
}

// the note this chapter is actually about, lit and lying apart from the rest
const heroNote = new THREE.Mesh(noteGeo, noteMat.clone());
heroNote.rotation.x = -Math.PI / 2; heroNote.rotation.z = 0.4;
heroNote.position.set(1.35, 0.05, 1.15);
heroNote.receiveShadow = true;
offering.add(heroNote);

/* ------------------------------------------- the pile: an interactable ---
   The one thing in this scene you can act on, so it is built as a real
   object rather than scattered instances: a heap you can look at, walk up
   to and touch. It carries its own highlight — a ring on the floor and a
   soft shell around the heap — which comes up as you get near, so it reads
   as interactable without a word of UI. The notes are thin boxes, not
   planes, so the heap has volume from every angle.                        */

const PILE_POS = new THREE.Vector3(SHRINE.x + 1.15, 0, SHRINE.z + 1.55);
const PILE_R = 0.40;                       // footprint of the heap
const INTERACT_R = 5.0;                    // close enough to act on it
const HIGHLIGHT_R = 8.0;                   // close enough to notice it glowing

const pile = new THREE.Group();
pile.position.copy(PILE_POS);
world.add(pile);

const pileMat = new THREE.MeshStandardMaterial({ map: noteTex, roughness: 0.86 });
const pileNoteGeo = new THREE.BoxGeometry(0.30, 0.009, 0.16);
const pileNotes = [];
for (let i = 0; i < 30; i++) {
  const r = Math.sqrt(Math.random()) * PILE_R;
  const a = Math.random() * Math.PI * 2;
  const n = new THREE.Mesh(pileNoteGeo, pileMat);
  n.position.set(Math.cos(a) * r,
                 0.008 + (1 - r / PILE_R) * 0.20 * Math.random(),   // a mound
                 Math.sin(a) * r * 0.88);
  n.rotation.set((Math.random() - 0.5) * 0.55,
                 Math.random() * Math.PI * 2,
                 (Math.random() - 0.5) * 0.55);
  n.castShadow = true; n.receiveShadow = true;
  pile.add(n);
  pileNotes.push(n);
}

// the highlight: a ring on the floor and a soft shell over the heap, both
// additive so they read as light rather than as paint
const pileRing = new THREE.Mesh(
  new THREE.RingGeometry(PILE_R + 0.10, PILE_R + 0.24, 44),
  new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    depthWrite: false, fog: false }));
pileRing.rotation.x = -Math.PI / 2;
pileRing.position.y = 0.032;
pileRing.visible = false;
pile.add(pileRing);

/* The border itself is drawn the way outlines have always been drawn: each
   note again, a little larger and inside out. Only the parts that poke out
   past the real note are ever seen, which is exactly a rim of light around
   the heap's silhouette. A glow volume was tried first and was worse — it
   sat over the paper and turned the whole heap milky grey.                */
const pileOutlineMat = new THREE.MeshBasicMaterial({
  color: 0x63d6c8, transparent: true, opacity: 0, side: THREE.BackSide,
  blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
const pileOutline = new THREE.Group();
pileOutline.visible = false;
pile.add(pileOutline);
for (const n of pileNotes) {
  const o = new THREE.Mesh(pileNoteGeo, pileOutlineMat);
  o.position.copy(n.position);
  o.rotation.copy(n.rotation);
  o.scale.set(1.09, 2.6, 1.14);        // the notes are thin: the edge needs the height
  pileOutline.add(o);
}

const _pileNdc = new THREE.Vector3();
const _ray = new THREE.Raycaster();
const _ptr = new THREE.Vector2();

function pileDist() {
  return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z);
}
// The camera's world matrix is refreshed by the renderer, so anything asking
// where a thing is on screen mid-frame would be answering for the previous
// frame's orientation — one frame stale is enough to leave a prompt up after
// you have turned away from what it refers to.
function syncCamera() {
  camera.updateWorldMatrix(true, false);
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
}
function pileScreen() {                     // normalised device coords of the heap
  syncCamera();
  return _pileNdc.set(PILE_POS.x, 0.15, PILE_POS.z).project(camera);
}
function pileInView() {
  const n = pileScreen();
  return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
}

// Is this screen point on the heap? A heap of paper is a small target on a
// phone, so a tap that lands near it counts too — missing by ten pixels
// should not mean nothing happens.
function pointerHitsPile(cx, cy) {
  if (pileDist() > INTERACT_R) return false;
  syncCamera();
  _ptr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
  _ray.setFromCamera(_ptr, camera);
  if (_ray.intersectObjects(pileNotes, false).length) return true;
  const n = pileScreen();
  if (n.z > 1) return false;
  const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
  return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.11;
}

function canInteract() { return state === 'play' && pileDist() < INTERACT_R; }
function interactPile() {
  if (!canInteract()) return false;
  triggered = true;                         // it is open; do not also auto-open
  startDecision();
  return true;
}

function updatePile(t) {
  const near = THREE.MathUtils.clamp(
    (HIGHLIGHT_R - pileDist()) / (HIGHLIGHT_R - INTERACT_R), 0, 1);
  const g = near * (0.62 + 0.38 * Math.sin(t * 2.6));
  const on = near > 0.01;
  pileRing.visible = pileOutline.visible = on;
  if (!on) { pileMat.emissive.setRGB(0, 0, 0); return; }
  // additive light goes white long before it goes bright, so these stay low
  // enough for the jade to survive against the fire
  pileRing.material.opacity = g * 0.58;
  pileOutlineMat.opacity = g * 0.44;
  pileMat.emissive.setRGB(0.015 * g, 0.055 * g, 0.05 * g);   // a hint, not a wash
}

/* ---------------------------------------- parked: cased amulet (.glb) ----
   Built and verified, kept out of this chapter. Flip SHOW_AMULET to true and
   the build step re-embeds amulet.glb; the loading code below is unchanged.   */
const SHOW_AMULET = false;
const AMULET_B64 = '__AMULET_B64__';

function b64ToBuffer(b64) {
  const bin = atob(b64), buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

if (SHOW_AMULET && AMULET_B64) {
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.028, 0.075), matDarkWood);
  stand.position.set(0.86, 0.055, 0.52);
  stand.castShadow = stand.receiveShadow = true;
  offering.add(stand);

  new GLTFLoader().parse(b64ToBuffer(AMULET_B64), '', (gltf) => {
    const amulet = gltf.scene;
    amulet.scale.setScalar(2.2);
    amulet.position.set(0.86, 0.069, 0.52);
    amulet.rotation.set(-0.14, 0, 0);
    amulet.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
    offering.add(amulet);
  }, (err) => console.warn('amulet failed to load', err));
}

/* ---------------------------------------------------------- the tree line */
/* Low-poly blobs on a trunk: a dozen of them cost less than one of the
   pillars. They stay out of the corridor between the spawn point and the
   void deck, so the way in still reads as open.                            */
const trunkGeo = new THREE.CylinderGeometry(0.26, 0.42, 5.2, 9);
// three canopy blobs, reused and jittered per instance rather than a fresh
// geometry per leaf cluster — a hundred one-off geometries is a hundred
// buffers to upload for no visible gain
const leafGeo = [1.0, 1.22, 1.45].map(r => new THREE.IcosahedronGeometry(r, 0));
const leafMat = new THREE.MeshStandardMaterial({ color: 0x1d2b1c, roughness: 1.0, flatShading: true });

function makeTree(x, z, s = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = Math.random() * Math.PI * 2;
  g.scale.setScalar(s);
  // only trees the shadow camera actually covers pay for a shadow pass
  const shadowed = Math.abs(x) < 19 && Math.abs(z) < 19;
  const trunk = new THREE.Mesh(trunkGeo, matDarkWood);
  trunk.position.y = 2.6; trunk.castShadow = shadowed;
  g.add(trunk);
  const n = 6 + ((Math.random() * 3) | 0);
  for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(leafGeo[(Math.random() * leafGeo.length) | 0], leafMat);
    b.position.set((Math.random() - 0.5) * 2.4, 4.6 + Math.random() * 1.6, (Math.random() - 0.5) * 2.4);
    b.scale.setScalar(0.85 + Math.random() * 0.4);
    b.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    b.castShadow = shadowed;
    g.add(b);
  }
  world.add(g);
  return g;
}

for (const [tx, tz, ts] of [
  [-13.5, 7.5, 1.00],    // the original, where it always was
  [-21.5, 12.5, 1.14],
  [-9.5, 18.5, 0.92],
  [-24.5, 3.5, 1.06],
  [11.5, 15.5, 1.04],
  [17.5, 6.0, 0.94],
  [23.5, 17.5, 1.18],
  [-15.0, 26.0, 1.10],
  [8.5, 26.5, 1.00],
  [-27.0, 20.5, 0.98],
  [26.0, 27.5, 1.12],
  [-4.5, 31.0, 0.90],
]) makeTree(tx, tz, ts);

/* ---------------------------------------------------------- atmosphere */
// drifting smoke from the burner
const smokeTex = makeSoftDot('rgba(190,190,190,0.55)', 'rgba(190,190,190,0)');
const SMOKE_N = LOW ? 70 : 130;
const smokeGeo = new THREE.BufferGeometry();
const sPos = new Float32Array(SMOKE_N * 3), sSeed = new Float32Array(SMOKE_N);
for (let i = 0; i < SMOKE_N; i++) {
  sPos[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.9;
  sPos[i * 3 + 1] = 0.9 + Math.random() * 3.4;
  sPos[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.5;
  sSeed[i] = Math.random() * 100;
}
smokeGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
const smoke = new THREE.Points(smokeGeo, new THREE.PointsMaterial({
  map: smokeTex, size: 2.4, transparent: true, opacity: 0.038,
  depthWrite: false, blending: THREE.NormalBlending, sizeAttenuation: true
}));
world.add(smoke);

// embers rising from the drum
const emberTex = makeSoftDot('rgba(255,170,60,1)', 'rgba(255,90,0,0)');
const EM_N = LOW ? 26 : 48;
const emGeo = new THREE.BufferGeometry();
const ePos = new Float32Array(EM_N * 3);
for (let i = 0; i < EM_N; i++) {
  ePos[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.4;
  ePos[i * 3 + 1] = 0.8 + Math.random() * 2.5;
  ePos[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.4;
}
emGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
const embers = new THREE.Points(emGeo, new THREE.PointsMaterial({
  map: emberTex, size: 0.075, transparent: true, opacity: 0.6,
  depthWrite: false, blending: THREE.AdditiveBlending
}));
world.add(embers);

/* --------------------------------------------------------------- the ghost */
/* She is not in the scene at all until you are near the burner — no silhouette
   to notice early. Inside GHOST_APPEAR_AT she fades up over about a second and
   walks toward you, stopping short. The trigger is your distance to the BURNER,
   not to her, so it fires however you approach the shrine.                     */

/* Where she waits. This is picked for the sightline, not for the floor plan:
   from out on the grass the lift core and the pillar rows hide most of the
   corridor, and a figure standing in the dark 20 m away cannot be seen at
   all. Just behind and beside the burner she is lit by the fire and stands
   against the smoke column, so you notice her from outside — which is the
   whole point of her showing up earlier.                                    */
const GHOST_HOME = new THREE.Vector3(-2.5, 0, -12.0);
const GHOST_MIN_DIST = 3.4;                            // never closer than this
const GHOST_APPEAR_AT = 14.0;                          // measured from the burner, not from her
const GHOST_DECK_EDGE = -1.2;                          // she does not follow you outside
const GHOST_FADE_TIME = 1.1;                           // seconds to come fully in

const ghost = new THREE.Group();
ghost.position.copy(GHOST_HOME);
world.add(ghost);

const ghostLight = new THREE.PointLight(0xa8c4e0, 0, 8.5, 1.8);
ghostLight.position.set(0, 1.45, 0.7);                 // just in front of her chest
ghost.add(ghostLight);

let ghostReady = false, ghostMixer = null;
const ghostMats = [];
let reveal = 0;                                        // 0 = not there, 1 = fully present
ghost.visible = false;

const GHOST_BUF = b64ToBuffer('__GHOST_B64__');
new GLTFLoader().parse(GHOST_BUF, '', (gltf) => {
  rescueTextures(gltf, GHOST_BUF);
  const g = gltf.scene;
  g.traverse(o => {
    if (!o.isMesh) return;
    o.frustumCulled = false;                           // skinned bounds are unreliable
    o.castShadow = false;                              // she throws no shadow
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      m.roughness = Math.min(1, (m.roughness ?? 0.8) + 0.15);
      m.metalness = 0;
      // Her shroud is near-white and she stands beside a fire: at full exposure
      // the texture clips and she reads as a blank white sheet. Knock the base
      // colour down once so the blood and hair survive the highlight.
      m.color.multiplyScalar(0.85);
      m.transparent = true;                            // she fades in on approach
      m.opacity = 0;
      if (ghostMats.indexOf(m) < 0) ghostMats.push(m);
    }
  });
  ghost.add(g);

  // A skinned mesh's geometry bounding box is the bind pose in some arbitrary
  // authoring unit, so it is useless for sizing. Measure the skeleton instead
  // and scale her to a real human height — self-correcting for any model.
  g.updateMatrixWorld(true);
  const bbox = new THREE.Box3(), _bp = new THREE.Vector3();
  g.traverse(o => { if (o.isBone) bbox.expandByPoint(o.getWorldPosition(_bp)); });
  const boneSpan = bbox.max.y - bbox.min.y;            // toe bones up to the head bone
  if (boneSpan > 1e-6) {
    const scale = 1.72 / (boneSpan / 0.87);            // skull sits above the head bone
    g.scale.multiplyScalar(scale);
    g.position.y = -bbox.min.y * scale;                // stand her on the floor
  }

  if (gltf.animations.length) {
    ghostMixer = new THREE.AnimationMixer(g);
    const act = ghostMixer.clipAction(gltf.animations[0]);
    act.play();
    ghostMixer.update(0.9);                            // start part-way into the stride
  }
  // Everything about her first visible frame is expensive: four textures to
  // upload and a fresh shader to compile for every material. Doing that at the
  // moment she fades in is exactly the stutter you would notice. Force it all
  // now, while the title card is still up, then put her away.
  ghost.visible = true;
  for (const m of ghostMats) {
    for (const slot of ['map', 'emissiveMap', 'normalMap']) {
      if (m[slot]) renderer.initTexture(m[slot]);
    }
  }
  renderer.compile(scene, camera);
  ghost.visible = false;

  ghostReady = true;
}, (err) => console.warn('ghost failed to load', err));

// is she inside the camera's view right now?
const _ndc = new THREE.Vector3();
function ghostInView() {
  _ndc.set(ghost.position.x, ghost.position.y + 1.3, ghost.position.z).project(camera);
  return _ndc.z < 1 && Math.abs(_ndc.x) < 1.08 && Math.abs(_ndc.y) < 1.15;
}

function updateGhost(dt) {
  if (!ghostReady) return;

  // Appearance is keyed to the shrine, not to her: walk straight at the burner
  // and she still shows up. Keyed to her own position she could be skirted.
  const bx = yaw.position.x - OFFER_POS.x, bz = yaw.position.z - OFFER_POS.z;
  const distToBurner = Math.hypot(bx, bz);

  const want = distToBurner < GHOST_APPEAR_AT ? 1 : 0;
  if (reveal !== want) {
    reveal = want > reveal
      ? Math.min(1, reveal + dt / GHOST_FADE_TIME)
      : Math.max(0, reveal - dt / (GHOST_FADE_TIME * 2));
    const o = reveal * reveal * (3 - 2 * reveal);      // ease in and out
    const solid = o > 0.995;                           // once fully there, leave the
    for (const m of ghostMats) {                       // transparent pass entirely —
      m.opacity = o;                                   // otherwise she sorts against
      if (m.transparent === solid) {                   // the smoke and the notes
        m.transparent = !solid;
        m.needsUpdate = true;
      }
    }
    ghostLight.intensity = o * 0.7;
    ghost.visible = reveal > 0.001;
  }
  if (!ghost.visible) return;

  if (state === 'title' || state === 'result'
      || state === 'complete' || state === 'lost') return;

  const dx = yaw.position.x - ghost.position.x, dz = yaw.position.z - ghost.position.z;
  const dist = Math.hypot(dx, dz);
  if (ghostMixer) ghostMixer.update(dt);
  // She shows herself from much further out now, so she would otherwise be
  // waiting at the entrance by the time you got there — and you would walk
  // straight through her. Instead she holds her ground while you are still
  // outside: you see her standing in the corridor, watching. She only starts
  // closing once you are under the block with her, and she never comes out.
  const inside = yaw.position.z < -0.5;
  if (inside && dist > GHOST_MIN_DIST) {
    const step = 0.85 * dt;
    ghost.position.x += (dx / dist) * step;
    ghost.position.z += (dz / dist) * step;
    ghost.position.z = Math.min(ghost.position.z, GHOST_DECK_EDGE);
    ghost.position.x = THREE.MathUtils.clamp(ghost.position.x, -20.5, 20.5);
  }
  ghost.rotation.y = Math.atan2(dx, dz);               // always turned toward you
}

/* ------------------------------------------------- first-person viewmodel */
/* The hands live in their own scene with their own camera. That is how every
   FPS does it: a narrower field of view so they don't distort at the edges,
   and a separate depth pass so they can never clip through a wall. */

const vmScene = new THREE.Scene();
const vmCam = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.008, 4);

// lighting that echoes the world without being tied to it
const vmHemi = new THREE.HemisphereLight(0x38486e, 0x0e1014, 0.55);
vmScene.add(vmHemi);
const vmKey = new THREE.DirectionalLight(0x93aad4, 0.50);
vmKey.position.set(-0.6, 1.0, 0.6);
vmScene.add(vmKey);
const vmFire = new THREE.PointLight(0xff8433, 0, 6, 1.4);   // brightens near the burner
vmFire.position.set(-0.35, 0.15, -0.55);
vmScene.add(vmFire);
vmScene.environment = scene.environment;
vmScene.environmentIntensity = 0.025;

const handsRoot = new THREE.Group();    // all sway and bob is applied here
vmScene.add(handsRoot);
const armR = new THREE.Group();         // right hand only
handsRoot.add(armR);
armR.rotation.set(0.50, 0.28, -0.48);   // relaxed: fingers forward, palm turned inward

// Where the hand sits has to follow the shape of the screen: an offset that
// frames nicely on a laptop puts it off the edge of a portrait phone. Position
// it as a fraction of the visible frame at its own depth instead.
const HAND_Z = 0.44;
function layoutHands() {
  const halfH = Math.tan(THREE.MathUtils.degToRad(vmCam.fov / 2)) * HAND_Z;
  const halfW = halfH * vmCam.aspect;
  armR.position.set(Math.min(0.175, halfW * 0.60), -halfH * 1.02, -HAND_Z);
}
layoutHands();

let handsReady = false;
new GLTFLoader().parse(b64ToBuffer('__HANDS_B64__'), '', (gltf) => {
  const model = gltf.scene;

  // The pack ships both hands in one skinned mesh, so the left one can't just
  // be hidden — collapsing its root bone shrinks those vertices to a point.
  const leftRoot = model.getObjectByName('J_Left_21');
  if (leftRoot) leftRoot.scale.setScalar(1e-4);

  // The model's material is flat grey and untextured; give it a skin tone.
  // (setHex takes sRGB and converts — writing a raw linear value here is the
  //  same trap that made the first pass look like latex gloves.)
  model.traverse(o => {
    if (!o.isMesh) return;
    o.frustumCulled = false;            // skinned bounds are bind-pose only
    o.material.color.setHex(0xC08E6E);
    o.material.roughness = 0.72;
    o.material.metalness = 0.0;
  });

  // Every hand model arrives in a different orientation, so rather than
  // hard-coding one, measure it: four bones give the hand's own axes, and we
  // rotate those onto ours — fingers to -Z, index-to-pinky to +X, palm to -Y.
  // Swapping in a different model later only means changing these four names.
  const BONES = {
    wrist: 'J_Right_Hand_42',   middle: 'J_Right_HandMiddle3_31',
    index: 'J_Right_HandIndex3_27', pinky: 'J_Right_HandPinky3_39'
  };
  const BONE_IDS = {
    Thumb1: 'J_Right_HandThumb1_25',  Thumb2: 'J_Right_HandThumb2_24',  Thumb3: 'J_Right_HandThumb3_23',
    Index1: 'J_Right_HandIndex1_29',  Index2: 'J_Right_HandIndex2_28',  Index3: 'J_Right_HandIndex3_27',
    Middle1:'J_Right_HandMiddle1_33', Middle2:'J_Right_HandMiddle2_32', Middle3:'J_Right_HandMiddle3_31',
    Ring1:  'J_Right_HandRing1_37',   Ring2:  'J_Right_HandRing2_36',   Ring3:  'J_Right_HandRing3_35',
    Pinky1: 'J_Right_HandPinky1_41',  Pinky2: 'J_Right_HandPinky2_40',  Pinky3: 'J_Right_HandPinky3_39'
  };
  const oriented = new THREE.Group();
  oriented.add(model);
  armR.add(oriented);

  const bone = {};
  for (const k in BONES) bone[k] = model.getObjectByName(BONES[k]);

  if (bone.wrist && bone.middle && bone.index && bone.pinky) {
    model.updateWorldMatrix(true, true);
    const toLocal = new THREE.Matrix4().copy(model.matrixWorld).invert();
    const at = (o) => o.getWorldPosition(new THREE.Vector3()).applyMatrix4(toLocal);

    const w = at(bone.wrist);
    const fwd = at(bone.middle).sub(w).normalize();                  // wrist → fingers
    const across = at(bone.pinky).sub(at(bone.index));               // index → pinky
    across.addScaledVector(fwd, -across.dot(fwd)).normalize();       // make it square to fwd
    const palm = new THREE.Vector3().crossVectors(fwd, across);

    const from = new THREE.Matrix4().makeBasis(fwd, across, palm);
    const to = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0));
    oriented.quaternion.setFromRotationMatrix(to.multiply(from.transpose()));
    model.position.copy(w).negate();          // put the wrist on the pivot
    // The pack ships a flat, splayed VR pose — fine for tracking a controller,
    // wrong for a person walking at night. It is rigged, so pose it: flex each
    // joint about the hand's own across-axis, parents before children.
    const CURL = [0.34, 0.56, 0.42];          // proximal, middle, distal
    const FINGERS = {
      Index: 0.86, Middle: 0.96, Ring: 1.08, Pinky: 1.22, Thumb: 0.42
    };
    const bendAxis = new THREE.Vector3();
    const m3 = new THREE.Matrix3();
    for (const finger in FINGERS) {
      for (let seg = 1; seg <= 3; seg++) {
        const b = model.getObjectByName(
          Object.keys(BONE_IDS).length ? BONE_IDS[finger + seg] : '');
        if (!b) continue;
        b.updateWorldMatrix(true, false);
        // express the flexion axis in this bone's own frame, then rotate
        bendAxis.copy(across).applyMatrix3(m3.setFromMatrix4(b.matrixWorld).invert()).normalize();
        b.rotateOnAxis(bendAxis, -CURL[seg - 1] * FINGERS[finger]);
      }
    }
  } else {
    console.warn('hand bones not found — check the names in BONES');
  }

  handsReady = true;
}, (err) => console.warn('hands failed to load', err));

// ── motion state ─────────────────────────────────────────────────────────
const vm = {
  step: 0,                              // walk cycle phase
  sway: new THREE.Vector2(),            // smoothed look lag
  swayTarget: new THREE.Vector2(),
  lean: 0,                              // strafe roll
  breathe: Math.random() * 10,
  land: 0                               // footfall impulse
};

function updateViewmodel(dt, t, speed, strafe, dLookX, dLookY) {
  if (!handsReady) return;

  const sp = Math.min(speed / 3.4, 1);              // 0 idle → 1 running

  // walk cycle: hands trace a figure-of-eight, x at half the frequency of y
  const prevStep = vm.step;
  vm.step += dt * speed * 5.6;
  if (Math.floor(prevStep / Math.PI) !== Math.floor(vm.step / Math.PI)) vm.land = 1;
  vm.land = Math.max(0, vm.land - dt * 6.5);

  const bobX = Math.sin(vm.step) * 0.020 * sp;
  const bobY = (Math.abs(Math.cos(vm.step)) - 0.55) * 0.026 * sp
             - vm.land * vm.land * 0.012 * sp;      // small drop on each footfall
  const bobRoll = Math.sin(vm.step) * 0.055 * sp;
  const bobPitch = Math.cos(vm.step * 2) * 0.018 * sp;

  // sway: the hands lag behind the camera, then settle back
  vm.swayTarget.set(
    THREE.MathUtils.clamp(dLookX * 9.0, -0.075, 0.075),
    THREE.MathUtils.clamp(dLookY * 7.0, -0.060, 0.060));
  vm.sway.lerp(vm.swayTarget, 1 - Math.pow(0.00008, dt));

  // idle breathing, strongest when standing still
  vm.breathe += dt;
  const idle = 1 - sp;
  const brY = Math.sin(vm.breathe * 1.45) * 0.0055 * idle;
  const brX = Math.sin(vm.breathe * 0.83) * 0.0035 * idle;

  // strafe lean
  vm.lean += (strafe * 0.045 - vm.lean) * (1 - Math.pow(0.004, dt));

  handsRoot.position.set(bobX + vm.sway.x + brX - vm.lean,
                         bobY + vm.sway.y + brY - Math.abs(vm.lean) * 0.25,
                         sp * 0.012);
  handsRoot.rotation.set(bobPitch - vm.sway.y * 1.6,
                         vm.sway.x * 1.9,
                         bobRoll + vm.lean * 1.5);

  // the burner throws warm light on the hands as you get close to it
  const dFire = Math.hypot(yaw.position.x - fireLight.position.x,
                           yaw.position.z - fireLight.position.z);
  const warm = Math.max(0, 1 - dFire / 7) ** 2;
  vmFire.intensity = warm * 2.4 * (0.82 + Math.sin(t * 11.3) * 0.12 + Math.random() * 0.06);
  vmHemi.intensity = 0.55 - warm * 0.16;
}

/* ------------------------------------------------------- collision box */
const BOUNDS = { minX: -21, maxX: 21, minZ: -18.6, maxZ: 26 };
const BLOCKERS = [];
world.traverse(o => {
  if (o.isMesh && (o.material === matConcrete) && o.geometry.type === 'BoxGeometry') {
    o.updateWorldMatrix(true, false);
    const b = new THREE.Box3().setFromObject(o);
    b.expandByScalar(0.28);
    const h = b.max.y - b.min.y;
    if (b.min.y < 2.2 && h > 1.0) BLOCKERS.push(b);
  }
});

/* ------------------------------------------------------------ controls */
const keys = Object.create(null);
addEventListener('keydown', e => {
  // Escape closes the decision panel the same way the Step back button does
  if (e.code === 'Escape' && state === 'decide') { dismissDecision(); return; }
  if (e.code === 'KeyE' && state === 'play') { interactPile(); return; }
  keys[e.code] = true;
});
addEventListener('keyup', e => { keys[e.code] = false; });

let lookX = 0, lookY = 0;            // accumulated look delta this frame
let locked = false;                  // pointer lock currently held
let lockBlocked = false;             // the page is not allowed to lock at all
const lastMouse = { x: 0, y: 0 };

function tryLock() {
  if (lockBlocked || locked || state === 'title') return;
  try {
    const r = canvas.requestPointerLock?.();
    if (r && typeof r.catch === 'function') r.catch(() => { lockBlocked = true; setHint(); });
  } catch { lockBlocked = true; setHint(); }
}
document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  setHint();
});
document.addEventListener('pointerlockerror', () => { lockBlocked = true; setHint(); });

let edgeTurn = 0;                    // continuous turn while the cursor sits at a screen edge
let pointerInside = false;

canvas.addEventListener('mouseenter', () => { pointerInside = true; });
canvas.addEventListener('mouseleave', () => { pointerInside = false; edgeTurn = 0; });
addEventListener('blur', () => { edgeTurn = 0; });

canvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  // With no pointer lock there is a real cursor, so clicking the heap works
  // the same way tapping it does on a phone. Locked, there is no cursor and
  // E is the way in.
  if (!locked && state === 'play' && pointerHitsPile(e.clientX, e.clientY)) {
    interactPile();
    return;
  }
  tryLock();                         // upgrade to real free look where allowed
});

document.addEventListener('mousemove', e => {
  if (locked) {                      // pointer lock: the ideal path, no limits
    lookX -= e.movementX * 0.0022;
    lookY -= e.movementY * 0.0022;
    return;
  }
  // No lock available. Look on plain mouse movement anyway — no button held —
  // and only while actually playing, so moving the cursor to a choice button
  // doesn't spin the camera.
  if (state !== 'play' || !pointerInside) { edgeTurn = 0; return; }
  const dx = e.movementX !== undefined ? e.movementX : e.clientX - lastMouse.x;
  const dy = e.movementY !== undefined ? e.movementY : e.clientY - lastMouse.y;
  lastMouse.x = e.clientX; lastMouse.y = e.clientY;
  lookX -= dx * 0.0026;
  lookY -= dy * 0.0026;

  // Without pointer lock the cursor runs out of window and you can't keep
  // turning. Near either edge, add a steady turn so you can spin all the way
  // round — push the mouse to the edge and hold it there.
  const margin = Math.min(innerWidth, innerHeight) * 0.09;
  const left = Math.max(0, margin - e.clientX);
  const right = Math.max(0, e.clientX - (innerWidth - margin));
  edgeTurn = (left - right) / margin;
});

// --- touch: left half = move stick, right half = look
const stick = document.getElementById('stick');
const knob = document.getElementById('knob');
let stickId = null, lookId = null, stickVec = { x: 0, y: 0 }, lastLook = { x: 0, y: 0 };

// Every touch is remembered so a short, still one can be told apart from a
// drag afterwards — that is what makes tapping the heap possible without
// stealing the look and walk gestures.
const touchStarts = new Map();

function onTouchStart(e) {
  for (const t of e.changedTouches) {
    touchStarts.set(t.identifier, { x: t.clientX, y: t.clientY, at: performance.now() });
    if (t.clientX < innerWidth * 0.45 && stickId === null) {
      stickId = t.identifier;
      stick.style.left = t.clientX + 'px'; stick.style.top = t.clientY + 'px';
      stick.classList.add('on');
    } else if (lookId === null) {
      lookId = t.identifier; lastLook.x = t.clientX; lastLook.y = t.clientY;
    }
  }
}
function onTouchMove(e) {
  for (const t of e.changedTouches) {
    if (t.identifier === stickId) {
      const cx = parseFloat(stick.style.left), cy = parseFloat(stick.style.top);
      let dx = t.clientX - cx, dy = t.clientY - cy;
      const d = Math.hypot(dx, dy), max = 52;
      if (d > max) { dx = dx / d * max; dy = dy / d * max; }
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      stickVec.x = dx / max; stickVec.y = dy / max;
    } else if (t.identifier === lookId) {
      lookX -= (t.clientX - lastLook.x) * 0.0042;
      lookY -= (t.clientY - lastLook.y) * 0.0042;
      lastLook.x = t.clientX; lastLook.y = t.clientY;
    }
  }
  e.preventDefault();
}
function onTouchEnd(e) {
  for (const t of e.changedTouches) {
    const s = touchStarts.get(t.identifier);
    touchStarts.delete(t.identifier);
    if (s && performance.now() - s.at < 380
        && Math.hypot(t.clientX - s.x, t.clientY - s.y) < 15
        && state === 'play' && pointerHitsPile(t.clientX, t.clientY)
        && interactPile()) {
      // The browser follows an unprevented touchend with a synthetic click at
      // the same point — which by then lands on the panel this tap just
      // opened, and picks whichever choice is under your finger. Swallow it.
      e.preventDefault();
    }
    if (t.identifier === stickId) {
      stickId = null; stickVec.x = stickVec.y = 0;
      knob.style.transform = 'translate(0,0)'; stick.classList.remove('on');
    } else if (t.identifier === lookId) lookId = null;
  }
}
if (HAS_TOUCH) canvas.addEventListener('touchstart', onTouchStart, { passive: true });
if (HAS_TOUCH) canvas.addEventListener('touchmove', onTouchMove, { passive: false });
// not passive: a tap on the heap has to be able to cancel the synthetic click
if (HAS_TOUCH) canvas.addEventListener('touchend', onTouchEnd, { passive: false });
if (HAS_TOUCH) canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

/* ------------------------------------------------------------ game data */
const CHAPTER = {
  id: 1,
  title: 'The Hell Note',
  brief: 'Late. A void deck you have walked a hundred times. Tonight someone has been burning for the dead, and a single note has drifted away from the pile — right into your path.',
  prompt: 'The note is at your feet. What do you do?',
  choices: [
    {
      k: 'A', text: 'Pick it up. It is only paper — and it might be real money.',
      d: { sanity: -20, awareness: -10, wisdom: -15 },
      verdict: 'bad',
      say: 'You bend down and take it. The air near the drum goes still, and the warmth on your face is suddenly gone.',
      teach: 'What is burned is given. Taking it back is taking from someone who can no longer object. Greed does not become harmless just because the object is worthless.'
    },
    {
      k: 'B', text: 'Kick it away and laugh. Superstition is for other people.',
      d: { sanity: -30, awareness: -15, wisdom: -25 },
      verdict: 'worst',
      say: 'Your foot scuffs the note across the concrete. Behind you, the drum ticks once — metal cooling, or something else.',
      teach: 'Mockery is a form of belief: it insists on an answer before you have looked. Contempt costs nothing to feel and everything to carry.'
    },
    {
      k: 'C', text: 'Stop. Look at what is actually here before moving.',
      d: { sanity: 5, awareness: 25, wisdom: 15 },
      verdict: 'good',
      say: 'You stand still. Drum. Plate. Three sticks, still lit. Someone was here minutes ago. This is not a place for you to be standing.',
      teach: 'Observation costs nothing and prevents most of what follows. Before you believe or dismiss, first see. Awareness is the cheapest protection there is.'
    },
    {
      k: 'D', text: 'Step around it, palms together, and quietly excuse yourself.',
      d: { sanity: 15, awareness: 15, wisdom: 25 },
      verdict: 'best',
      say: 'You go the long way round. A short bow, no words out loud. The lamp buzzes. The night carries on without you in it.',
      teach: 'Respect is not agreement. You do not need to believe in something to leave it undisturbed — and leaving things undisturbed is most of the practice.'
    }
  ],
  core: 'Observe before reacting. Do not blindly believe, blindly dismiss, or provoke what you do not understand.'
};

const stats = { sanity: 100, awareness: 50, wisdom: 50 };
let state = 'title';   // title | play | decide | result | complete | lost
let chosen = null;

/* ---------------------------------------------------------------- ui */
const $ = id => document.getElementById(id);
const ui = {
  title: $('title'), hud: $('hud'), prompt: $('prompt'), interact: $('interact'),
  decide: $('decide'), result: $('result'), complete: $('complete'),
  haunt: $('haunt'), over: $('over'), panic: $('panic'),
  bSan: $('bSan'), bAwa: $('bAwa'), bWis: $('bWis'),
  vSan: $('vSan'), vAwa: $('vAwa'), vWis: $('vWis'),
  say: $('say'), teach: $('teach'), deltas: $('deltas'),
  rank: $('rank'), core: $('core'), pct: $('pct')
};
const hint = $('hint');
// how you act on the heap, in the words that match the device you are on
const ACT_HINT = HAS_TOUCH ? 'tap the glowing pile' : 'E at the glowing pile';
const ACT_LINE = HAS_TOUCH
  ? 'Tap the glowing pile of notes to look again'
  : 'Press E at the glowing pile to look again';
function setHint() {
  const el = $('hintTxt');
  if (!el) return;
  el.textContent = (
      IS_PHONE ? 'Left thumb walks · right thumb looks'
    : HAS_TOUCH && !locked ? 'W A S D to walk · move the mouse to look · touch works too'
    : locked ? 'W A S D to walk · move the mouse to look'
    : 'W A S D to walk · move the mouse to look · edges keep turning'
  ) + ' · ' + ACT_HINT;
}
setHint();
if (HAS_TOUCH) {
  $('ikey').textContent = 'Tap';
  $('itxt').textContent = 'the pile of hell notes';
}
$('startBtn').onclick = () => {
  ui.title.classList.add('hide');
  ui.hud.classList.remove('hide');
  hint.classList.remove('hide');
  setTimeout(() => hint.classList.add('hide'), 7000);
  state = 'play';
  setHint();
  tryLock();
};
$('stepBack').onclick = () => dismissDecision();
$('retryBtn').onclick = () => location.reload();
$('nextBtn').onclick = () => { ui.result.classList.add('hide'); finish(); };
$('againBtn').onclick = () => location.reload();

$('brief').textContent = CHAPTER.brief;
$('qtext').textContent = CHAPTER.prompt;
const cWrap = $('choices');
CHAPTER.choices.forEach((c, i) => {
  const b = document.createElement('button');
  b.className = 'choice';
  b.innerHTML = `<span class="key">${c.k}</span><span>${c.text}</span>`;
  b.onclick = () => pick(i);
  cWrap.appendChild(b);
});

function syncBars() {
  const cl = v => Math.max(0, Math.min(100, v));
  ui.bSan.style.width = cl(stats.sanity) + '%';
  ui.bAwa.style.width = cl(stats.awareness) + '%';
  ui.bWis.style.width = cl(stats.wisdom) + '%';
  ui.vSan.textContent = Math.round(cl(stats.sanity));
  ui.vAwa.textContent = Math.round(cl(stats.awareness));
  ui.vWis.textContent = Math.round(cl(stats.wisdom));
}
syncBars();

function startDecision() {
  state = 'decide';
  chosen = null;
  ui.prompt.classList.add('hide');
  ui.interact.classList.add('hide');
  hint.classList.add('hide');
  edgeTurn = 0;
  ui.decide.classList.remove('hide');
  decideOpenedAt = performance.now();
  document.exitPointerLock?.();
}

/* Backing out. Nothing is decided and nothing is lost — the panel closes, you
   get your feet back, and the burner is still there. It re-arms once you are
   REARM_R away, so walking off and returning brings the choices up again
   rather than the panel snapping open in your face as you turn around.       */
let hintTimer = 0;
function dismissDecision() {
  if (state !== 'decide') return;
  ui.decide.classList.add('hide');
  state = 'play';
  const el = $('hintTxt');
  if (el) {
    el.textContent = ACT_LINE;
    hint.classList.remove('hide');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => { hint.classList.add('hide'); setHint(); }, 5000);
  }
  tryLock();
}
let decideOpenedAt = 0;
function pick(i) {
  if (chosen !== null) return;
  // Nothing chosen in the first moments after the panel appears. The panel
  // opens under wherever the player's hand or cursor already was, and a
  // stray event landing on a choice is not a decision.
  if (performance.now() - decideOpenedAt < 340) return;
  chosen = i;
  const c = CHAPTER.choices[i];
  for (const k in c.d) stats[k] += c.d[k];
  syncBars();
  ui.decide.classList.add('hide');
  ui.say.textContent = c.say;
  ui.teach.textContent = c.teach;
  ui.deltas.innerHTML = Object.entries(c.d).map(([k, v]) =>
    `<span class="${v >= 0 ? 'up' : 'dn'}">${k.toUpperCase()} ${v >= 0 ? '+' : ''}${v}</span>`).join('');
  ui.result.classList.remove('hide');
  state = 'result';
}
/* --------------------------------------------------------- sanity drain ---
   Being looked at costs you. From the moment she is there, sanity bleeds —
   slowly at range, hard up close — and it only bleeds while you are stood in
   the world doing nothing about it. Opening the decision stops it, because
   the whole point of taking the timer off the choices was that the choosing
   is not the part meant to panic you. Walking out of her reach stops it too:
   that is a real answer, not an escape from the mechanic.                   */
// At arm's length this empties a full bar in about twenty seconds: long
// enough to turn and run, short enough that standing there is a decision.
const DRAIN_FAR = 1.1, DRAIN_NEAR = 5.0;      // sanity per second
const DRAIN_FAR_D = 13.0, DRAIN_NEAR_D = 4.0; // metres to her

function ghostDrainRate() {
  if (!ghostReady || reveal <= 0.01) return 0;
  const d = Math.hypot(yaw.position.x - ghost.position.x,
                       yaw.position.z - ghost.position.z);
  const k = THREE.MathUtils.clamp(
    (DRAIN_FAR_D - d) / (DRAIN_FAR_D - DRAIN_NEAR_D), 0, 1);
  return (DRAIN_FAR + (DRAIN_NEAR - DRAIN_FAR) * k * k) * reveal;
}

let hauntShown = false;
function showHaunt(on) {
  if (on === hauntShown) return;
  hauntShown = on;
  ui.haunt.classList.toggle('hide', !on);
  ui.bSan.classList.toggle('drain', on);
}

function lose() {
  if (state === 'lost') return;
  state = 'lost';
  stats.sanity = 0;
  syncBars();
  showHaunt(false);
  for (const el of [ui.decide, ui.result, ui.prompt, ui.interact, ui.hud, hint]) {
    el.classList.add('hide');
  }
  ui.panic.style.opacity = '1';
  ui.over.classList.remove('hide');
  document.exitPointerLock?.();
}

function finish() {
  const score = (Math.max(0, Math.min(100, stats.sanity)) * 0.3
    + Math.max(0, Math.min(100, stats.awareness)) * 0.3
    + Math.max(0, Math.min(100, stats.wisdom)) * 0.4);
  const r = score >= 90 ? 'S' : score >= 80 ? 'A+' : score >= 70 ? 'A'
    : score >= 55 ? 'B' : score >= 40 ? 'C' : 'D';
  ui.rank.textContent = r;
  ui.pct.textContent = Math.round(score) + '%';
  ui.core.textContent = CHAPTER.core;
  ui.complete.classList.remove('hide');
  ui.hud.classList.add('hide');
  state = 'complete';
}

/* ---------------------------------------------------------------- loop */
const clock = new THREE.Timer();
const vel = new THREE.Vector3();
const tmp = new THREE.Vector3();
const OFFER_POS = SHRINE;
let triggered = false;
const REARM_R = 7.5;      // step this far back and the decision can be re-entered
let bob = 0;

function collide(nx, nz) {
  const p = new THREE.Vector3(nx, 1.0, nz);
  for (const b of BLOCKERS) if (b.containsPoint(p)) return true;
  return nx < BOUNDS.minX || nx > BOUNDS.maxX || nz < BOUNDS.minZ || nz > BOUNDS.maxZ;
}

function tick() {
  requestAnimationFrame(tick);
  clock.update();
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsed();

  // look — keep this frame's delta, the viewmodel needs it for sway
  if (edgeTurn) lookX += Math.sign(edgeTurn) * edgeTurn * edgeTurn * 2.6 * dt;
  const dLookX = lookX, dLookY = lookY;
  yaw.rotation.y += lookX;
  pitch.rotation.x = Math.max(-1.2, Math.min(1.2, pitch.rotation.x + lookY));
  lookX = lookY = 0;

  // move
  let strafeInput = 0, playerSpeed = 0;
  if (state === 'play') {
    let f = 0, s = 0;
    if (keys.KeyW || keys.ArrowUp) f += 1;
    if (keys.KeyS || keys.ArrowDown) f -= 1;
    if (keys.KeyA || keys.ArrowLeft) s -= 1;
    if (keys.KeyD || keys.ArrowRight) s += 1;
    f -= stickVec.y; s += stickVec.x;
    const len = Math.hypot(f, s);
    if (len > 1) { f /= len; s /= len; }
    strafeInput = s;
    const run = keys.ShiftLeft ? 1.75 : 1;
    const speed = 2.55 * run;
    tmp.set(s, 0, -f).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.rotation.y);
    vel.lerp(tmp.multiplyScalar(speed), 1 - Math.pow(0.0005, dt));

    const nx = yaw.position.x + vel.x * dt, nz = yaw.position.z + vel.z * dt;
    if (!collide(nx, yaw.position.z)) yaw.position.x = nx;
    if (!collide(yaw.position.x, nz)) yaw.position.z = nz;

    // head bob
    const sp = playerSpeed = Math.hypot(vel.x, vel.z);
    bob += dt * sp * 8.5;
    yaw.position.y = 1.62 + Math.sin(bob) * 0.028 * Math.min(sp / 2.5, 1);

    // proximity trigger. `triggered` is not "has fired once" but "is spent" —
    // stepping back out past REARM_R reloads it, so the encounter can be
    // walked away from and walked back into as many times as you like.
    const d = Math.hypot(yaw.position.x - OFFER_POS.x, yaw.position.z - OFFER_POS.z);
    if (triggered && d > REARM_R) triggered = false;

    // the heap: one prompt at a time, and only when it is actually on screen —
    // a key prompt for something behind you is noise
    const reach = pileDist() < INTERACT_R && pileInView();
    if (reach) {
      ui.interact.classList.remove('hide');
      ui.prompt.classList.add('hide');
    } else {
      ui.interact.classList.add('hide');
      if (d < 6.2) ui.prompt.classList.remove('hide'); else ui.prompt.classList.add('hide');
    }

    // she is here, and standing still in front of her costs you
    const drain = ghostDrainRate();
    showHaunt(drain > 0);
    if (drain > 0) {
      stats.sanity = Math.max(0, stats.sanity - drain * dt);
      syncBars();
      if (stats.sanity <= 0) lose();
    }
    // the edges close in as it goes, whether or not she is draining you now
    ui.panic.style.opacity =
      (THREE.MathUtils.clamp((42 - stats.sanity) / 42, 0, 1) * 0.9).toFixed(3);

    if (state === 'play' && d < 4.5 && !triggered) { triggered = true; startDecision(); }
  } else {
    ui.interact.classList.add('hide');
    if (state !== 'lost') showHaunt(false);
  }

  updateNotes(dt, t);
  updateGhost(dt);
  updateStars(t);
  updatePile(t);

  // fire flicker
  const fl = 0.75 + Math.sin(t * 11.3) * 0.14 + Math.sin(t * 27.7) * 0.09 + Math.random() * 0.08;
  fireLight.intensity = 14 * fl;
  ash.material.color.setHSL(0.045, 1, 0.35 + fl * 0.16);
  jossTips.forEach((tp, i) => {
    tp.material.color.setHSL(0.04, 1, 0.42 + Math.sin(t * 3 + i) * 0.1);
  });

  // smoke + embers drift
  const sp2 = smoke.geometry.attributes.position.array;
  for (let i = 0; i < SMOKE_N; i++) {
    sp2[i * 3 + 1] += dt * (0.28 + (sSeed[i] % 1) * 0.3);
    sp2[i * 3] += Math.sin(t * 0.5 + sSeed[i]) * dt * 0.12;
    if (sp2[i * 3 + 1] > 4.6) {
      sp2[i * 3 + 1] = 0.9;
      sp2[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.8;
      sp2[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.8;
    }
  }
  smoke.geometry.attributes.position.needsUpdate = true;

  const ep = embers.geometry.attributes.position.array;
  for (let i = 0; i < EM_N; i++) {
    ep[i * 3 + 1] += dt * (0.7 + Math.random() * 0.5);
    ep[i * 3] += Math.sin(t * 1.7 + i) * dt * 0.25;
    if (ep[i * 3 + 1] > 3.6) {
      ep[i * 3 + 1] = 0.8;
      ep[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.3;
      ep[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.3;
    }
  }
  embers.geometry.attributes.position.needsUpdate = true;

  // hands: driven by exactly the same movement the camera uses
  updateViewmodel(dt, t, playerSpeed, strafeInput, dLookX, dLookY);

  renderer.render(scene, camera);

  // second pass: the viewmodel gets its own fresh depth buffer, so the hands
  // can never poke through a wall however close you stand to one
  if (state !== 'title' && handsReady) {
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(vmScene, vmCam);
    renderer.autoClear = true;
  }
}
window.__enc = { yaw, stats, blockers: BLOCKERS, getState: () => state,
                 handsRoot, armR, vmCam, vm, updateViewmodel, updateNotes, flying,
                 ghost, updateGhost, ghostInView, getReveal: () => reveal,
                 dismissDecision, ghostDrainRate, lose,
                 interactPile, pile, pileDist, pileInView,
                 pileScreen, pointerHitsPile, PILE_POS, INTERACT_R,
                 pileGlow: () => pileRing.material.opacity };
tick();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  vmCam.aspect = innerWidth / innerHeight;
  vmCam.updateProjectionMatrix();
  layoutHands();
  renderer.setSize(innerWidth, innerHeight);
});
