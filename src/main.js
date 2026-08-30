import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';

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
   MASTER Z'S SPIRITUAL ENCOUNTERS — THE ENGINE
   Everything shared between chapters lives here: rendering, input, the
   hands, the ghost system, the notes, audio, cutscenes, UI flow. What a
   chapter SAYS — its words, choices, stage positions and heavy files —
   lives in src/chapters/chN.js and is read off the chapter registry.
   ========================================================================= */

/* The chapter to play. Both builds guarantee the chapter script has already
   run: the hosted page loads chapters/ch1.js before game.js (two cached
   files), and the single-file build concatenates it ahead of the engine.   */
const CH = (window.__CHAPTERS__ || {}).ch1;
if (!CH) throw new Error('no chapter registered — chapters/ch1.js must load before the engine');

/* ------------------------------------------------------------- assets ----
   One seam for every heavy file. The hosted build carries a map of real,
   fingerprinted URLs and fetches on demand (the browser then caches each
   file for a year — the name changes when the content does). The embedded
   single-file build carries the bytes inline instead, and the map is empty.
   Every loader downstream asks assetBytes() and neither knows nor cares
   which build it is in.                                                    */
const ASSET_MAP = JSON.parse(atob('__ASSET_MAP_B64__'));
const HOSTED = Object.keys(ASSET_MAP).length > 0;
const EMBED = {
  hands: '__HANDS_B64__', ghost: '__GHOST_B64__', hdb: '__HDB_B64__',
  logo: '__LOGO_B64__', music: '__MUSIC_B64__', voice: '__VOICE_B64__',
  amulet: '__AMULET_B64__', audiopack: '__AUDIOPACK_B64__'
};

function b64ToBuffer(b64) {
  const bin = atob(b64), buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

const _assetCache = {};
function assetBytes(name, lowPriority) {       // -> Promise<ArrayBuffer>
  if (_assetCache[name]) return _assetCache[name];
  let p;
  if (HOSTED) {
    const url = ASSET_MAP[name];
    // `priority` keeps sound files from elbowing the world models on a slow
    // connection; browsers that don't know the option simply ignore it
    p = url
      ? fetch(url, lowPriority ? { priority: 'low' } : {}).then(r => {
          if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
          return r.arrayBuffer();
        })
      : Promise.reject(new Error(`${name}: not in the asset map`));
  } else {
    p = EMBED[name]
      ? Promise.resolve(b64ToBuffer(EMBED[name]))
      : Promise.reject(new Error(`${name}: not embedded`));
  }
  p.catch(() => { delete _assetCache[name]; });   // a failed fetch may retry
  return _assetCache[name] = p;
}

// A touchscreen laptop reports BOTH. Never use one to switch the other off:
// HAS_TOUCH only decides whether touch handlers are worth attaching, and the
// mouse is always live. LOW (reduced quality) needs a small screen too, or a
// touchscreen laptop gets phone-grade rendering for no reason.
const HAS_TOUCH = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const IS_PHONE = HAS_TOUCH && Math.max(innerWidth, innerHeight) < 1100;
// A real mouse or trackpad: hover + a fine pointer. A touchscreen laptop
// matches (it has a trackpad); a phone or tablet does not. Two things hang
// off it -- the volume slider, and whether pointer lock is worth asking for.
const FINE_PTR = matchMedia('(hover: hover) and (pointer: fine)').matches;
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
/* Nothing that casts a shadow in this scene ever moves. The block, the
   pillars, the trees, the lamps, the burner and the heap are all fixed; the
   ghost throws none by design and neither do you. So the two shadow maps
   were re-rendering 131 objects every frame to produce a byte-identical
   picture. They are drawn on demand instead: `shadowDirty` asks for a few
   fresh frames whenever something that casts one arrives.                  */
renderer.shadowMap.autoUpdate = false;
let shadowDirty = 4;
const redoShadows = () => { shadowDirty = 3; };
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
yaw.position.set(CH.spawn.x, CH.spawn.y, CH.spawn.z);   // the chapter decides

// The burner and everything that belongs to it — light, smoke, embers, notes,
// the trigger radius — are all positioned from this one point, so the shrine
// can be moved without hunting down a dozen hard-coded coordinates.
const SHRINE = new THREE.Vector3(CH.shrine.x, 0, CH.shrine.z);   // the burner
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

let hdbReady = false;
assetBytes('hdb').then(HDB_BUF => new GLTFLoader().parse(HDB_BUF, '', (gltf) => {
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
  hdbReady = true;
  redoShadows();                 // the block is most of what casts one
}, (err) => console.warn('HDB failed to load', err)))
  .catch(err => console.warn('HDB failed to load', err));

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

// 1 is the everyday drift; a cutscene can spin it up to a storm and back
let noteStorm = 1;

function updateNotes(dt, t) {
  for (let i = 0; i < FLY_N; i++) {
    const f = airborne[i];
    f.a += f.swirl * dt * noteStorm * (3 / Math.max(f.r, 2));  // tighter orbits move faster
    f.y += f.rise * dt * noteStorm;
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

/* The mark. A ring on the floor says "this is a thing"; the exclamation says
   "and it is waiting for you". It carries further than the ring does — you
   should be able to pick it out from the deck entrance — and it bobs, so it
   reads as a marker rather than as part of the scene. A sprite, so it faces
   you from every angle without any work.                                    */
const MARK_R = 15.0;                       // you can see it from this far out

/* The glyph is drawn as shapes, not as text. A web font is still loading when
   this canvas is painted, so ctx.fillText('!') would silently come out in
   whatever the fallback happens to be — which is how you end up with a pale
   bar and no dot. A stem and a dot are three lines of geometry and always
   look like an exclamation mark.                                            */
function makeMark() {
  const s = 256, [c, ctx] = cnv(s);
  const glyph = (fill, w) => {
    ctx.fillStyle = fill;
    ctx.beginPath();                       // tapered stem
    ctx.moveTo(s / 2 - w, 34);
    ctx.lineTo(s / 2 + w, 34);
    ctx.lineTo(s / 2 + w * 0.52, 156);
    ctx.lineTo(s / 2 - w * 0.52, 156);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();                       // and the dot
    ctx.arc(s / 2, 205, w * 0.95, 0, Math.PI * 2);
    ctx.fill();
  };
  ctx.shadowColor = 'rgba(99,214,200,0.95)';
  ctx.shadowBlur = 26;
  glyph('#06201C', 32);                    // dark rim, so it survives firelight
  ctx.shadowBlur = 0;
  glyph('#EFFFFB', 23);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// sizeAttenuation off: a marker should be the same size on screen whether you
// are across the deck or standing on it
const pileMarkGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeSoftDot('rgba(99,214,200,0.50)', 'rgba(99,214,200,0)'),
  transparent: true, depthWrite: false, fog: false, sizeAttenuation: false,
  blending: THREE.AdditiveBlending }));
pileMarkGlow.scale.setScalar(0.34);
const pileMark = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeMark(), transparent: true, depthWrite: false, fog: false,
  sizeAttenuation: false }));
pileMark.scale.setScalar(0.115);

const pileMarkRoot = new THREE.Group();
pileMarkRoot.position.y = 1.15;
pileMarkRoot.visible = false;
pileMarkRoot.add(pileMarkGlow, pileMark);
pile.add(pileMarkRoot);

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
  startDecision();
  return true;
}

function updatePile(t) {
  // game furniture, not part of a film — everything off while a scene plays
  if (state === 'cine') {
    pileMarkRoot.visible = pileRing.visible = pileOutline.visible = false;
    pileMat.emissive.setRGB(0, 0, 0);
    return;
  }
  const dist = pileDist();

  // the mark carries further than the highlight, and keeps moving so it never
  // reads as a bit of scenery
  const mark = THREE.MathUtils.clamp(
    (MARK_R - dist) / (MARK_R - INTERACT_R) * 1.9, 0, 1);   // fully on well before you arrive
  pileMarkRoot.visible = mark > 0.01;
  if (pileMarkRoot.visible) {
    const beat = 0.72 + 0.28 * Math.sin(t * 3.1);
    pileMarkRoot.position.y = 1.22 + Math.sin(t * 1.9) * 0.10;
    pileMark.material.opacity = mark;
    pileMark.scale.setScalar(0.115 * (0.93 + beat * 0.11));
    pileMarkGlow.material.opacity = mark * beat * 0.55;
  }

  const near = THREE.MathUtils.clamp(
    (HIGHLIGHT_R - dist) / (HIGHLIGHT_R - INTERACT_R), 0, 1);
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

if (SHOW_AMULET) {
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.028, 0.075), matDarkWood);
  stand.position.set(0.86, 0.055, 0.52);
  stand.castShadow = stand.receiveShadow = true;
  offering.add(stand);

  assetBytes('amulet').then(buf => new GLTFLoader().parse(buf, '', (gltf) => {
    const amulet = gltf.scene;
    amulet.scale.setScalar(2.2);
    amulet.position.set(0.86, 0.069, 0.52);
    amulet.rotation.set(-0.14, 0, 0);
    amulet.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
    offering.add(amulet);
    redoShadows();
  }, (err) => console.warn('amulet failed to load', err)))
    .catch(err => console.warn('amulet failed to load', err));
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
const GHOST_HOME = new THREE.Vector3(CH.ghostHome.x, 0, CH.ghostHome.z);
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

assetBytes('ghost').then(GHOST_BUF => new GLTFLoader().parse(GHOST_BUF, '', (gltf) => {
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
}, (err) => console.warn('ghost failed to load', err)))
  .catch(err => console.warn('ghost failed to load', err));

// is she inside the camera's view right now?
const _ndc = new THREE.Vector3();
function ghostInView() {
  _ndc.set(ghost.position.x, ghost.position.y + 1.3, ghost.position.z).project(camera);
  return _ndc.z < 1 && Math.abs(_ndc.x) < 1.08 && Math.abs(_ndc.y) < 1.15;
}

/* Her rhythm is a horror film's, not a zombie's. She shows herself, holds
   just long enough to be believed, then whips away — and is somewhere else
   the next time you blink: a standing figure behind the burner first, then
   the corner of your eye, again and again. One state machine owns it.

   The drain is deliberately NOT tied to the flickers: once she has shown
   herself, standing your ground in her territory keeps costing you whether
   she is on screen this instant or not (hauntK below). Walking out of
   range remains the honest exit — everything ramps down and re-arms.     */
let gPhase = 'hidden';        // hidden | appear | standing | dart | gone | fade
let gTimer = 0;               // seconds left in the current phase
let gDart = null;             // the flight in progress
let hauntK = 0;               // her presence for the drain — outlasts the flickers
let seenThisRun = false;      // the hair-raising strings are for the FIRST sight only
const audioCues = [];         // machine -> audio frame; replayed until samples exist

function ghostPlaceBehindBurner() {
  // the burner sits between you and her: the first sight is a figure
  // standing in the smoke column, right where the offerings burn
  const px = yaw.position.x - OFFER_POS.x, pz = yaw.position.z - OFFER_POS.z;
  const d = Math.hypot(px, pz) || 1;
  ghost.position.set(
    THREE.MathUtils.clamp(OFFER_POS.x - (px / d) * 2.1, -20.5, 20.5), 0,
    Math.min(OFFER_POS.z - (pz / d) * 2.1, GHOST_DECK_EDGE - 0.4));
}

function ghostSpotInCorner() {
  // somewhere she can be half-seen: near the edge of your view, inside the
  // deck, never at arm's length. Sampled, not solved — a bad sample just
  // tries another angle, and behind the burner is always a valid fallback.
  for (let i = 0; i < 10; i++) {
    const side = Math.random() < 0.5 ? 1 : -1;
    const off = side * (0.38 + Math.random() * 0.34);      // 22–41° off your gaze
    const ang = yaw.rotation.y + off;
    const dist = 5.5 + Math.random() * 6.5;
    const x = yaw.position.x - Math.sin(ang) * dist;
    const z = yaw.position.z - Math.cos(ang) * dist;
    if (z > GHOST_DECK_EDGE - 0.3 || Math.abs(x) > 20.5) continue;
    if (Math.hypot(x - yaw.position.x, z - yaw.position.z) < GHOST_MIN_DIST + 1) continue;
    return { x, z };
  }
  ghostPlaceBehindBurner();
  return { x: ghost.position.x, z: ghost.position.z };
}

function ghostStartDart() {
  // she flees AWAY from you, roughly, with spread — hovering, and on an
  // accelerating curve: a slow lift-off that whips into nothing
  const away = Math.atan2(ghost.position.x - yaw.position.x,
                          ghost.position.z - yaw.position.z);
  const ang = away + (Math.random() - 0.5) * 1.2;
  const dist = 6 + Math.random() * 4;
  const tx = THREE.MathUtils.clamp(ghost.position.x + Math.sin(ang) * dist, -20.5, 20.5);
  const tz = Math.min(ghost.position.z + Math.cos(ang) * dist, GHOST_DECK_EDGE - 0.3);
  gDart = { fx: ghost.position.x, fz: ghost.position.z, tx, tz, t: 0, dur: 0.72 };
  gPhase = 'dart';
  audioCues.push({ kind: 'dart' });
  pulseSpike(0.35);
}

function updateGhost(dt) {
  if (!ghostReady) return;
  // A cutscene owns her completely; the cards after it hold whatever the
  // scene left; the faint holds her too, so she can stand over you.
  if (state === 'cine' || state === 'result' || state === 'complete'
      || state === 'lost') return;

  const distToBurner = Math.hypot(yaw.position.x - OFFER_POS.x,
                                  yaw.position.z - OFFER_POS.z);
  const inTerritory = distToBurner < GHOST_APPEAR_AT;
  const playing = state === 'play';

  // presence for the drain: ramps in once she has shown herself, ramps out
  // when you leave her ground (or the game is elsewhere)
  if (seenThisRun && inTerritory && playing)
    hauntK = Math.min(0.85, hauntK + dt / 1.6);
  else
    hauntK = Math.max(0, hauntK - dt / 1.2);

  const dPlayer = Math.hypot(yaw.position.x - ghost.position.x,
                             yaw.position.z - ghost.position.z);

  switch (gPhase) {
    case 'hidden':
      reveal = 0;
      if (inTerritory && playing) {
        ghostPlaceBehindBurner();
        gPhase = 'appear';
        if (!seenThisRun) {
          seenThisRun = true;
          audioCues.push({ kind: 'first' });
          pulseSpike(1.0);
        } else {
          audioCues.push({ kind: 'appear' });
          pulseSpike(0.5);
        }
      }
      break;

    case 'appear':
      reveal = Math.min(1, reveal + dt / 0.5);
      if (ghostMixer) ghostMixer.update(dt * 0.25);
      if (!inTerritory) { gPhase = 'fade'; break; }
      if (reveal >= 1) { gPhase = 'standing'; gTimer = 1.2 + Math.random() * 0.8; }
      break;

    case 'standing':
      gTimer -= dt;
      if (ghostMixer) ghostMixer.update(dt * 0.3);
      if (!inTerritory) { gPhase = 'fade'; break; }
      // she does not let you reach her, and she does not overstay
      if (gTimer <= 0 || dPlayer < GHOST_MIN_DIST + 0.6) ghostStartDart();
      break;

    case 'dart': {
      gDart.t += dt;
      const k = Math.min(1, gDart.t / gDart.dur);
      const a = k * k * k;                     // the accelerating curve
      ghost.position.x = gDart.fx + (gDart.tx - gDart.fx) * a;
      ghost.position.z = gDart.fz + (gDart.tz - gDart.fz) * a;
      ghost.position.y = Math.sin(Math.PI * k) * 0.55;   // off the floor: floating
      reveal = k < 0.6 ? 1 : Math.max(0, 1 - (k - 0.6) / 0.4);
      if (ghostMixer) ghostMixer.update(dt * 1.5);
      if (k >= 1) {
        ghost.position.y = 0;
        reveal = 0;
        gPhase = 'gone';
        gTimer = 2 + Math.random() * 1.0;      // Chad's 2–3 seconds of nothing
      }
      break;
    }

    case 'gone':
      reveal = 0;
      gTimer -= dt;
      if (!inTerritory) { gPhase = 'hidden'; break; }
      if (gTimer <= 0 && playing) {
        const spot = ghostSpotInCorner();
        ghost.position.set(spot.x, 0, spot.z);
        gPhase = 'appear';
        audioCues.push({ kind: 'appear' });
        pulseSpike(0.45);
      }
      break;

    case 'fade':
      reveal = Math.max(0, reveal - dt / 0.9);
      if (reveal <= 0) { ghost.position.y = 0; gPhase = 'hidden'; }
      break;
  }

  ghostOpacity(reveal);
  if (ghost.visible) {
    ghost.rotation.y = Math.atan2(yaw.position.x - ghost.position.x,
                                  yaw.position.z - ghost.position.z);
  }
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
assetBytes('hands').then(handsBuf => new GLTFLoader().parse(handsBuf, '', (gltf) => {
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
    // remember the straight pose before curling, for the prayer cutscene
    restPose = {};
    model.traverse(o => {
      if (o.isBone && /J_Right_Hand(Thumb|Index|Middle|Ring|Pinky)\d/.test(o.name)) {
        restPose[o.name] = o.quaternion.clone();
      }
    });
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

  // Kept for the cutscenes: the model, the curl the hand normally carries,
  // and each finger bone's pose both before and after that curl, so a scene
  // can straighten the fingers (prayer) and hand them back exactly as found.
  rightHandModel = model;
  rightOriented = oriented;
  fingerPose = [];
  model.traverse(o => {
    if (o.isBone && /J_Right_Hand(Thumb|Index|Middle|Ring|Pinky)\d/.test(o.name)) {
      fingerPose.push({ name: o.name, curled: o.quaternion.clone() });
    }
  });

  handsReady = true;
}, (err) => console.warn('hands failed to load', err)))
  .catch(err => console.warn('hands failed to load', err));

let rightHandModel = null, rightOriented = null, fingerPose = null, restPose = null;

// slide every finger between straight (0) and the walking curl (1)
function setHandCurl(root, k) {
  if (!fingerPose || !restPose) return;
  for (const f of fingerPose) {
    const b = root.getObjectByName(f.name);
    if (b && restPose[f.name]) b.quaternion.slerpQuaternions(restPose[f.name], f.curled, k);
  }
}

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
  if (Math.floor(prevStep / Math.PI) !== Math.floor(vm.step / Math.PI)) {
    vm.land = 1;
    // a real footfall on concrete — play state only; cutscenes schedule
    // their own steps on the timeline to match their authored bob
    if (state === 'play' && speed > 0.4) stepSnd(0.32 + Math.min(speed / 5, 0.3));
  }
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
const BOUNDS = { ...CH.bounds };
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
  // Escape closes whatever is open: credits first, then the decision panel
  if (e.code === 'Escape' && !$('credits').classList.contains('hide')) {
    showCredits(false); return;
  }
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
  // Pointer lock only makes sense where there is a mouse to hide. On a
  // touch-primary device it wins nothing and costs everything: while the
  // lock is held Chromium retargets pointer events to the locked element,
  // so the canvas swallows taps meant for the HUD buttons. iOS Safari has
  // no pointer lock at all -- which is why this only ever bit Android.
  if (!FINE_PTR) return;
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
// The chapter's words and numbers live in src/chapters/ch1.js now — CH was
// read off the registry at the top of this file.

const stats = { sanity: 100, awareness: 50, wisdom: 50 };
let state = 'title';   // title | chapter | play | decide | cine | result | complete | lost
let chosen = null;

/* ---------------------------------------------------------------- ui */
const $ = id => document.getElementById(id);

/* ------------------------------------------------------------ the words ---
   Every string the engine shows comes from src/strings.js (and the chapter's
   own words from the chapter file). T() looks one up; applyText() pours them
   into every element carrying data-t at boot.

   An EMPTY string hides that element rather than leaving a blank gap — that
   is how a cleared cell in Chad's text sheet removes a line without anyone
   editing code. Missing keys leave the markup's own text alone, so a
   half-finished strings file can never blank the game.                     */
const TEXT = window.__TEXT__ || {};
function T(key, fallback) {
  const v = TEXT[key];
  return v === undefined ? (fallback !== undefined ? fallback : '') : v;
}
function applyText() {
  for (const el of document.querySelectorAll('[data-t]')) {
    const v = TEXT[el.dataset.t];
    if (v === undefined) continue;              // not in the sheet: leave as authored
    if (v === '') { el.style.display = 'none'; continue; }
    el.style.removeProperty('display');
    el.innerHTML = v;                           // his own copy may carry <b>, <br>
  }
}
applyText();
// the build stamps its own number here — never edited by hand or by the sheet
const BUILD_VERSION = '__VERSION__';
{ const v = $('ver'); if (v) v.textContent = 'v' + BUILD_VERSION; }
// the two strings that are attributes rather than element text
(() => {
  const key = $('ikey'); if (key && TEXT['world.interactKey'] !== undefined) key.textContent = T('world.interactKey');
  const lg = $('logo'); if (lg && TEXT['title.logoAlt'] !== undefined) lg.setAttribute('aria-label', T('title.logoAlt'));
  for (const [id, k] of [['mute', 'a11y.soundButton'], ['vol', 'a11y.volumeSlider'],
                         ['credClose', 'a11y.closeButton'], ['creditsLink', 'a11y.creditsButton']]) {
    const el = $(id); if (el && TEXT[k] !== undefined) el.setAttribute('aria-label', T(k));
  }
})();
const ui = {
  title: $('title'), hud: $('hud'), prompt: $('prompt'), interact: $('interact'),
  decide: $('decide'), result: $('result'), complete: $('complete'),
  haunt: $('haunt'), over: $('over'), panic: $('panic'), chapter: $('chapter'),
  bSan: $('bSan'), bAwa: $('bAwa'), bWis: $('bWis'),
  vSan: $('vSan'), vAwa: $('vAwa'), vWis: $('vWis'),
  say: $('say'), teach: $('teach'), deltas: $('deltas'),
  rank: $('rank'), core: $('core'), pct: $('pct')
};
const hint = $('hint');
// how you act on the heap, in the words that match the device you are on
const ACT_HINT = HAS_TOUCH ? T('world.actHintTouch') : T('world.actHintKey');
const ACT_LINE = HAS_TOUCH ? T('world.actLineTouch') : T('world.actLineKey');
function setHint() {
  const el = $('hintTxt');
  if (!el) return;
  const base = IS_PHONE ? T('world.hintPhone')
    : HAS_TOUCH && !locked ? T('world.hintMouseTouch')
    : locked ? T('world.hintLocked')
    : T('world.hintEdges');
  el.textContent = ACT_HINT ? base + ' · ' + ACT_HINT : base;
}
setHint();
if (HAS_TOUCH) {
  $('ikey').textContent = T('world.interactKeyTouch');
  $('itxt').textContent = T('world.interactTextTouch');
}
/* The logo. Decoded from base64 and painted into a canvas rather than handed
   to an <img src="data:…">, because a sandboxed frame's policy can refuse
   data: images outright — the same trap that dropped every model texture.
   createImageBitmap takes the Blob itself, so no URL is ever created. The
   heading underneath is the fallback and only appears if this fails.        */
(function paintLogo() {
  const cv = document.getElementById('logo');
  const fallback = document.querySelector('#title h1');
  const giveUp = () => { cv?.remove(); fallback?.classList.remove('hide'); };
  if (!cv) return giveUp();
  assetBytes('logo')
    .then(bytes => createImageBitmap(new Blob([bytes], { type: 'image/webp' })))
    .then(bmp => {
      cv.width = bmp.width; cv.height = bmp.height;
      cv.getContext('2d').drawImage(bmp, 0, 0);
      bmp.close?.();
    }).catch(giveUp);
})();

/* ------------------------------------------------------------- music ----
   Played through the Web Audio API, not an <audio src="data:…"> and not a
   blob: URL. A sandboxed frame's media-src can refuse both, the same way it
   refuses data: images — decodeAudioData takes the bytes and no URL exists.

   Muted by default on a desktop, because someone is probably at a desk with
   other people. A phone or tablet is a private, deliberate thing, so it
   starts with sound. Either way the choice is remembered per device.       */
const MUSIC_VOL = 0.34, MUTE_KEY = 'mzse3d_muted';

let muted = !HAS_TOUCH;
try {
  const saved = localStorage.getItem(MUTE_KEY);
  if (saved !== null) muted = saved === '1';
} catch { /* private mode, or storage blocked — the default stands */ }

let actx = null, musicGain = null, musicBuf = null, musicSrc = null, musicWanted = false;
const muteBtn = $('mute');

function paintMuteBtn() { muteBtn?.classList.toggle('muted', muted); }
paintMuteBtn();

/* One master gain sits between every bus (music, stings, pack, loops) and
   the speakers, so a single slider scales the whole game. Volume is a
   different thing from mute: mute is a state, volume is a level, and both
   are remembered separately.                                             */
let masterGain = null, volume = 1;
const VOL_KEY = 'mzse3d_vol';
try {
  const v = localStorage.getItem(VOL_KEY);
  if (v !== null) volume = Math.min(1, Math.max(0, +v || 0));
} catch {}
function masterOut() {
  if (!actx) return null;
  if (!masterGain) {
    masterGain = actx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(actx.destination);
  }
  return masterGain;
}
function setVolume(v) {
  volume = Math.min(1, Math.max(0, v));
  try { localStorage.setItem(VOL_KEY, String(volume)); } catch {}
  if (masterOut()) {
    const g = masterGain.gain, now = actx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(volume, now + 0.15);
  }
  // raising the volume from a muted game is an unambiguous "I want sound"
  if (volume > 0 && muted) setMuted(false);
}

function musicSetup() {
  if (actx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try { actx = new AC(); } catch { return; }
  // iPhone Safari treats Web Audio as "ambient" and the ringer/silent
  // switch kills it outright — videos keep playing, the game goes mute.
  // Declaring the page playback media opts out (iOS 16.4+, harmless
  // everywhere else). Without this, an iPhone with the switch down —
  // most of them — hears nothing at all.
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {}
  musicGain = actx.createGain();
  musicGain.gain.value = muted ? 0 : MUSIC_VOL;
  musicGain.connect(masterOut());
  assetBytes('music', true)
    .then(bytes => actx.decodeAudioData(bytes))
    .then(buf => { musicBuf = buf; if (musicWanted) musicStart(); })
    .catch(() => { /* no file or no decoder; the game is fine without */ });
}

function musicStart() {
  musicWanted = true;
  if (!actx) musicSetup();
  if (!actx) return;
  if (actx.state === 'suspended') actx.resume().catch(() => {});
  if (!musicBuf || musicSrc) return;
  musicSrc = actx.createBufferSource();
  musicSrc.buffer = musicBuf;
  musicSrc.loop = true;
  // mp3 decoding pads both ends with silence; loop inside the padding or the
  // seam is audible on every pass
  musicSrc.loopStart = 0.06;
  musicSrc.loopEnd = Math.max(0.2, musicBuf.duration - 0.06);
  musicSrc.connect(musicGain);
  musicSrc.start(0, musicSrc.loopStart);
}

function setMuted(v) {
  muted = v;
  try { localStorage.setItem(MUTE_KEY, v ? '1' : '0'); } catch {}
  if (musicGain && actx) {
    const g = musicGain.gain, now = actx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(muted ? 0 : MUSIC_VOL, now + 0.35);
  }
  if (!muted) musicStart();
  // a half-spoken line under a mute button that was just pressed is a bug,
  // not an atmosphere
  if (muted && voiceSrc) { try { voiceSrc.stop(); } catch {} voiceSrc = null; }
  if (muted && narSrc) { try { narSrc.stop(); } catch {} narSrc = null; }
  packMuteSync();
  paintMuteBtn();
}

muteBtn?.addEventListener('click', () => setMuted(!muted));

/* the volume slider appears only where the primary pointer hovers — a
   laptop or desktop. On a phone the rocker in the player's hand is faster
   than anything we could draw, so touch devices keep just the mute button.
   (hover+fine matches a touchscreen laptop too, which is correct: it has
   a trackpad.) */
if (FINE_PTR) document.body.classList.add('finePtr');
const volEl = $('vol');
if (volEl) {
  volEl.value = String(Math.round(volume * 100));
  volEl.addEventListener('input', () => { setVolume(volEl.value / 100); });
}

/* No browser will let a page make a sound before it has been interacted with,
   so the music cannot literally start on load. What it can do is start on the
   very first thing the visitor does — a tap anywhere, a key, a scroll — and
   keep trying until it actually has. These listeners are deliberately not
   `once`: the first attempt can land while the context is still resuming or
   the track is still decoding, and giving up after one try is how you end up
   with silence until someone happens to press the sound button.            */
function nudgeMusic() {
  musicStart();
  if (actx && actx.state === 'running' && musicSrc) {
    for (const ev of ['pointerdown', 'pointerup', 'touchstart', 'touchend',
                      'keydown', 'click', 'wheel'])
      removeEventListener(ev, nudgeMusic);
  }
}
for (const ev of ['pointerdown', 'pointerup', 'touchstart', 'touchend',
                  'keydown', 'click', 'wheel'])
  addEventListener(ev, nudgeMusic, { passive: true });
// and if the browser is feeling generous, start without waiting to be asked
musicSetup();
musicStart();
// pull the spoken line down early too; it decodes on a gesture later
assetBytes('voice', true).catch(() => {});

/* iOS suspends — or "interrupts" — the context when the tab is backgrounded,
   a call comes in, or Siri speaks, and does not reliably hand the audio
   back. The nudge listeners above have detached by then (their job was the
   autoplay gate, and it was done), so the return paths re-arm the resume
   themselves. The pointerdown one stays attached for good: a tap after any
   interruption is a user gesture, which is exactly what resume() wants.   */
function resumeAudio() {
  if (actx && actx.state !== 'running') actx.resume().catch(() => {});
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) resumeAudio(); });
addEventListener('pageshow', resumeAudio);
addEventListener('focus', resumeAudio);
addEventListener('pointerdown', resumeAudio, { passive: true });

/* ---------------------------------------------------- the player's voice ---
   One short line in the player's own voice, a beat after the world fades in —
   on the first run and again on every walk-it-again. It rides the same
   AudioContext as everything else and obeys the same rules: nothing before a
   gesture, nothing while muted. The three seconds are real time, not frame
   time, so a stalling phone still hears it at the right moment.            */
const VOICE_DELAY_MS = 2000;   // Chad timed it: two seconds after the world fades in
let voiceBuf = null, voiceSrc = null, voiceTimer = 0;
let voiceDecoding = false, voicePlayed = false;

function voiceDecode() {
  if (voiceBuf || voiceDecoding) return;
  if (!actx) musicSetup();
  if (!actx) return;
  voiceDecoding = true;
  assetBytes('voice')
    .then(bytes => actx.decodeAudioData(bytes))
    .then(buf => { voiceBuf = buf; })
    .catch(() => { /* no file or no decoder; the game is fine without */ });
}

/* Called whenever a fresh run enters the playable scene. It checks the world
   again when the timer lands, because three seconds is long enough to have
   opened the decision, muted the sound, or walked into a cutscene.         */
/* Decode, ahead of need, every sample the night can demand without warning.
   Called at each entry into play: the first appearance, the faint, and the
   narration lines must find their buffers ready (see LEARNINGS on the
   fire-once decode race).                                                 */
function warmPlaySet() {
  packWarm(['strings', 'whisper', 'boom', 'dread', 'whoosh', 'cry', 'breath',
            'ghostloop', 'heart', 'kick', 'ulost',
            'vghost', 'vfaint', 'vlow', 'vpile', 'vnote', 'vlost']);
}

function queueVoice() {
  clearTimeout(voiceTimer);
  voicePlayed = false;
  voiceDecode();
  voiceTimer = setTimeout(() => {
    if (state !== 'play' || muted || !voiceBuf || !actx) return;
    if (actx.state !== 'running' || !sfxOut()) return;
    try {
      voiceSrc = actx.createBufferSource();
      voiceSrc.buffer = voiceBuf;
      voiceSrc.onended = () => { voiceSrc = null; };
      voiceSrc.connect(sfxGain);
      voiceSrc.start();
      voicePlayed = true;
    } catch { voiceSrc = null; }
  }, VOICE_DELAY_MS);
}

/* ----------------------------------------------------------- sound pack ---
   Every generated sound — SFX, loops, the ending music beds, the James
   narration lines — ships as one JSON pack (assets/audio/*.mp3, packed by
   build.py) behind the same assetBytes seam as everything else. Buffers
   decode lazily on first use, and sting() below keeps its procedural synth
   as a fallback while a sample is still decoding, so a cutscene never goes
   silent mid-download. Loops start once at volume zero and are only ever
   mixed, never restarted. One mute button rules it all: packGain/ambGain
   ramp with it, and nothing new fires while muted.                        */
let packJson = null, packGain = null, ambGain = null, bedSrc = null, narSrc = null;
const packBufs = {}, packPending = {}, packLoops = {}, narrated = {};

function packSetup() {
  if (!actx) musicSetup();
  if (!actx || packGain) return;
  packGain = actx.createGain();
  packGain.gain.value = muted ? 0 : 1;
  packGain.connect(masterOut());
  ambGain = actx.createGain();
  ambGain.gain.value = muted ? 0 : 1;
  ambGain.connect(masterOut());
}
function packMuteSync() {
  if (!actx) return;
  const now = actx.currentTime;
  for (const g of [packGain, ambGain]) {
    if (!g) continue;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.35);
  }
}
assetBytes('audiopack', true)
  .then(b => { packJson = JSON.parse(new TextDecoder().decode(b)); })
  .catch(() => {});

function sndBuf(name) {              // AudioBuffer if ready, else kick a decode
  if (packBufs[name]) return packBufs[name];
  if (!packJson || !packJson[name] || packPending[name]) return null;
  packSetup();
  if (!actx) return null;
  packPending[name] = true;
  actx.decodeAudioData(b64ToBuffer(packJson[name]))
    .then(buf => { packBufs[name] = buf; })
    .catch(() => { delete packPending[name]; });
  return null;
}
function packWarm(names) { for (const n of names) sndBuf(n); }

function snd(name, vol = 1, rate = 1) {                 // one-shot
  if (muted) return null;
  const buf = sndBuf(name);
  if (!buf || !actx || actx.state !== 'running') return null;
  const s = actx.createBufferSource();
  s.buffer = buf;
  s.playbackRate.value = rate;
  const g = actx.createGain();
  g.gain.value = vol;
  s.connect(g);
  g.connect(packGain);
  s.start();
  return s;
}

// the 60 ms inset hides the silence mp3 decoding pads onto both ends
function loopVol(name, vol) {
  let L = packLoops[name];
  if (!L) L = packLoops[name] = { want: 0, gain: null, started: false };
  L.want = vol;
  if (!L.started) {
    const buf = vol > 0 ? sndBuf(name) : null;   // don't decode what's silent
    if (!buf || !actx) return;
    L.started = true;
    const g = actx.createGain();
    g.gain.value = 0;
    g.connect(ambGain);
    const s = actx.createBufferSource();
    s.buffer = buf;
    s.loop = true;
    s.loopStart = 0.06;
    s.loopEnd = Math.max(0.2, buf.duration - 0.06);
    s.connect(g);
    s.start(0, 0.06);
    L.gain = g;
  }
  if (L.gain) L.gain.gain.setTargetAtTime(L.want, actx.currentTime, 0.3);
}

// the music bed under an ending card — one at a time, stoppable on restart
function playBed(name, vol) {
  stopBed();
  bedSrc = snd(name, vol);
  if (bedSrc) bedSrc.onended = () => { bedSrc = null; };
}
function stopBed() {
  if (bedSrc) { try { bedSrc.stop(); } catch {} bedSrc = null; }
}

/* narration: one James line at a time, each trigger once per run unless
   asked again. A line never talks over the opening voice line or another
   line, and never fires during a cutscene — scene audio is authored.      */
function say(name, opts) {
  const once = !(opts && opts.again);
  if (once && narrated[name]) return;
  if (muted || narSrc || voiceSrc || state === 'cine') { sndBuf(name); return; }
  const buf = sndBuf(name);
  if (!buf || !actx || actx.state !== 'running') return;
  if (once) narrated[name] = true;
  narSrc = actx.createBufferSource();
  narSrc.buffer = buf;
  narSrc.onended = () => { narSrc = null; };
  narSrc.connect(packGain);
  narSrc.start();
}

// a short dip in the music so a reveal or an ending bed owns the moment
function duckMusic(sec) {
  if (!musicGain || !actx || muted) return;
  const g = musicGain.gain, now = actx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(MUSIC_VOL * 0.22, now + 0.5);
  g.setValueAtTime(MUSIC_VOL * 0.22, now + Math.max(1, sec - 1.5));
  g.linearRampToValueAtTime(MUSIC_VOL, now + Math.max(2, sec));
}

/* the per-frame mix: loop volumes derived from world state, the occasional
   ghost vocalisation, the heartbeat, the once-per-appearance reveal hit.  */
let nextCry = 0, nextBreath = 0, stepIdx = 0;
let wantLine = null, wantLineUntil = 0;   // a narration that must not be lost
const STEP_TAKES = ['step1', 'step2', 'step3', 'step4'];
function stepSnd(vol) {
  const n = STEP_TAKES[stepIdx++ % STEP_TAKES.length];
  snd(sndBuf(n) ? n : STEP_TAKES[0], vol, 0.94 + Math.random() * 0.12);
}
function updateAudioFrame(t) {
  if (!packJson) return;
  const inWorld = state !== 'title' && state !== 'chapter';
  loopVol('amb', inWorld ? 0.33 : 0);
  const dFire = Math.hypot(yaw.position.x - SHRINE.x, yaw.position.z - SHRINE.z);
  loopVol('fire', inWorld
    ? Math.pow(THREE.MathUtils.clamp(1 - dFire / 16, 0, 1), 1.6) * 0.6 : 0);
  const dGhost = Math.hypot(yaw.position.x - ghost.position.x,
                            yaw.position.z - ghost.position.z);
  const near = THREE.MathUtils.clamp(1 - dGhost / 15, 0, 1);
  // presence outlasts her flickers: the low bed hums while she is anywhere
  // near, and the ethereal layer — murmurs, moans, crying, whispers — swells
  // whenever she is actually on screen
  const presence = Math.max(reveal, hauntK);
  loopVol('ghostloop', state === 'play' ? presence * (0.25 + near * 0.55) : 0);
  loopVol('whisper', state === 'play'
    ? (reveal * 0.55 + presence * 0.25) * (0.35 + near * 0.65) : 0);
  const dying = state === 'play' && stats.sanity < 30;
  loopVol('heart', dying ? 0.12 + (1 - stats.sanity / 30) * 0.26 : 0);
  if (dying) say('vlow');

  /* Cues from her state machine. The moment they mark is real even when
     the sample is still decoding, so a cue is replayed every frame until
     its buffers exist (or five seconds pass) — the fire-once silence of
     v3.1 came exactly from not doing this (see LEARNINGS).             */
  for (let i = audioCues.length - 1; i >= 0; i--) {
    const c = audioCues[i];
    if (!c.until) c.until = t + 5;
    let done = t > c.until || muted || !packJson;
    if (!done) {
      if (c.kind === 'first') {
        if (sndBuf('strings') && sndBuf('boom')) {
          snd('strings', 0.85); snd('boom', 0.5);
          duckMusic(9);
          wantLine = 'vghost'; wantLineUntil = t + 12;
          done = true;
        }
      } else if (c.kind === 'appear') {
        if (sndBuf('whoosh')) { snd('whoosh', 0.28, 1.35); done = true; }
      } else if (c.kind === 'dart') {
        if (sndBuf('whoosh')) { snd('whoosh', 0.5); done = true; }
      } else done = true;
    }
    if (done) audioCues.splice(i, 1);
  }
  // the narration attached to a cue retries too: it may be waiting out a
  // decode, another line, or the opening voice — never lost to any of them
  if (wantLine) {
    if (t > wantLineUntil || narrated[wantLine]) wantLine = null;
    else if (state === 'play') say(wantLine);
  }

  if (state === 'play' && presence > 0.15) {
    if (t > nextCry) { nextCry = t + 9 + Math.random() * 11; snd('cry', 0.2 + near * 0.4); }
    if (dGhost < 2.8 && reveal > 0.3 && t > nextBreath) {
      nextBreath = t + 6 + Math.random() * 6; snd('breath', 0.7);
    }
  } else if (presence <= 0.01) {
    if (nextCry < t + 4) nextCry = t + 4 + Math.random() * 6;
  }
  // the pile, narrated on the first approach and at the first clear look
  if (state === 'play') {
    if (pileDist() < 8) say('vpile');
    if (pileDist() < INTERACT_R && pileInView()) say('vnote');
  }
}

/* -------------------------------------------------------------- pulse ----
   The hospital trace beside SANITY. One number drives everything: stress,
   0..1, re-derived every frame from whatever the night is doing — her
   presence, her closeness, how worn down the player is — plus short
   spikes any scare can push with pulseSpike(). A new scene or scenario
   needs nothing new: its booms and screams already spike the heart via
   sting(), and its world state speaks through the ambient inputs. BPM,
   amplitude and beat regularity all follow stress; sanity zero flatlines. */
const ecgCv = $('ecg');
const ecgCtx = ecgCv ? ecgCv.getContext('2d') : null;
const ECG_WINDOW = 3.0;                       // seconds shown across the strip
let ecgTrail = null, ecgX = 0, beatPhase = 0, curBpm = 50, spikeLevel = 0;
/* a scare is an impulse: it kicks the AMPLITUDE hard and rings down fast
   (~1 s), while spikeLevel decays slowly and carries the raised RATE.
   Sudden jolt, tall beats, then the height settles while the speed lingers. */
let impulse = 0;
function pulseSpike(n) {
  spikeLevel = Math.min(1, Math.max(spikeLevel, n));
  impulse = Math.min(1.4, impulse + n);
}
function pulseStress() {
  if (state === 'lost') return -1;            // flatline
  const dGhost = Math.hypot(yaw.position.x - ghost.position.x,
                            yaw.position.z - ghost.position.z);
  const near = THREE.MathUtils.clamp(1 - dGhost / 15, 0, 1);
  const fear = THREE.MathUtils.clamp((100 - stats.sanity) / 100, 0, 1);
  return THREE.MathUtils.clamp(
    Math.max(Math.max(reveal, hauntK) * (0.4 + near * 0.6), fear * 0.55, spikeLevel), 0, 1);
}
// one heartbeat, phase 0..1: P bump, the QRS spike, the T bump, rest
function ecgWave(k) {
  if (k < 0.10) return Math.sin(k / 0.10 * Math.PI) * 0.14;
  if (k < 0.14) return 0;
  if (k < 0.17) return -(k - 0.14) / 0.03 * 0.24;
  if (k < 0.21) return -0.24 + (k - 0.17) / 0.04 * 1.24;
  if (k < 0.25) return 1.0 - (k - 0.21) / 0.04 * 1.34;
  if (k < 0.30) return -0.34 + (k - 0.25) / 0.05 * 0.34;
  if (k < 0.44) return 0;
  if (k < 0.58) return Math.sin((k - 0.44) / 0.14 * Math.PI) * 0.22;
  return 0;
}
function updatePulse(dt) {
  if (!ecgCtx || ui.hud.classList.contains('hide')) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = Math.max(24, (ecgCv.clientWidth * dpr) | 0);
  const H = Math.max(12, (ecgCv.clientHeight * dpr) | 0);
  if (ecgCv.width !== W || ecgCv.height !== H) {
    ecgCv.width = W; ecgCv.height = H;
    ecgTrail = new Float32Array(W); ecgX = 0;
  }
  const s = pulseStress(), flat = s < 0;
  spikeLevel = Math.max(0, spikeLevel - dt * 0.25);         // the rate lingers
  impulse = Math.max(0, impulse - dt * 0.9);                // the height rings down
  curBpm += (((flat ? 50 : 50 + s * 95)) - curBpm) * Math.min(1, dt * 2.2);
  // under high stress the rhythm itself goes wrong: beats land early, late
  const jitter = !flat && s > 0.55 ? 1 + Math.sin(beatPhase * 19.7) * 0.3 * s : 1;
  beatPhase += dt * (curBpm / 60) * jitter;
  const amp = flat ? 0 : 0.42 + s * 0.35;
  const cols = Math.min(W, Math.max(1, Math.round(W * dt / ECG_WINDOW)));
  for (let i = 0; i < cols; i++) {
    const k = ((beatPhase - (cols - 1 - i) * dt / cols * (curBpm / 60)) % 1 + 1) % 1;
    // stress drives the QRS spike TALL — peaks and valleys both — while the
    // small P/T bumps barely grow: the shape itself changes, not just speed
    const qrsGain = (k >= 0.14 && k < 0.30) ? 1 + s * 0.9 + impulse * 1.5
                                            : 1 + s * 0.25;
    const noise = !flat && s > 0.35 ? (Math.random() - 0.5) * (0.08 + impulse * 0.05) * s : 0;
    ecgTrail[ecgX] = ecgWave(k) * amp * qrsGain + noise;
    ecgX = (ecgX + 1) % W;
  }
  ecgCtx.clearRect(0, 0, W, H);
  const mid = H * 0.62, span = H * 0.42;
  for (const [width, alpha] of [[3 * dpr, 0.22], [1.2 * dpr, 0.95]]) {
    ecgCtx.beginPath();
    for (let i = 0; i < W; i++) {
      // extreme beats peg the strip edge, like a real monitor clipping
      const y = Math.min(H - 1, Math.max(1, mid - ecgTrail[(ecgX + i) % W] * span));
      if (i) ecgCtx.lineTo(i, y); else ecgCtx.moveTo(i, y);
    }
    ecgCtx.strokeStyle = `rgba(255,84,66,${alpha})`;
    ecgCtx.lineWidth = width;
    ecgCtx.lineJoin = 'round';
    ecgCtx.stroke();
  }
  ecgCtx.fillStyle = 'rgba(255,224,214,.95)';               // the bright head
  const headY = Math.min(H - 1, Math.max(1, mid - ecgTrail[(ecgX - 1 + W) % W] * span));
  ecgCtx.fillRect(W - 2 * dpr, headY - dpr, 2 * dpr, 2 * dpr);
}

/* ================================================================== INVENTORY
   Equipment and what you are carrying, in one panel.

   THE INPUT PROBLEM. In play the mouse is captured for looking, so a normal
   click cannot reach a UI element at all. Opening the inventory therefore
   releases the pointer and parks the game in its own state — the same move
   the decision panel already makes, so movement, the drain and the ghost all
   freeze while you are in here, and the pointer is recaptured on the way out.

   ONE MODEL FOR BOTH HANDS AND MICE. Every gesture below works identically
   with a finger and with a mouse, so nothing is second-class on either:
     · press and drag       — the item follows and drops where you release
     · tap, then tap        — the item lifts, the next tap places it
     · double tap/click     — send it to the obvious place (equip, or bag)
     · arrows + Enter       — the same moves from the keyboard
   Pointer events give us all of it once, rather than a mouse path and a
   touch path that drift apart.                                             */

/* The worn slots are the body itself, Diablo style: each one is a place on
   the figure drawn behind them. head takes the divine eyes, neck the
   amulet, body the sak yant, the RIGHT hand the chanting beads, the LEFT
   hand the torch or phone. (The figure faces the player, so his right
   hand sits on the viewer's left.) */
const GEAR_SLOTS = ['head', 'neck', 'body', 'rightHand', 'leftHand'];
const SLOT_ICON = { head: 'e-eye', neck: 'e-amulet', body: 'e-yant',
                    rightHand: 'e-beads', leftHand: 'e-light' };
const BAG_SIZE = 15;

// what an item is: an id, the words (from the sheet), an icon, and the one
// equipment slot it fits — null means it can only be carried
const ITEM_DEFS = {
  phone: { icon: 'e-light', slot: 'leftHand' },
  keys:  { icon: 'e-keys', slot: null },
  beads: { icon: 'e-beads', slot: 'rightHand' },
  note:  { icon: 'e-note', slot: null }
};
const itemName = id => T('item.' + id + '.name', id);
const itemDesc = id => T('item.' + id + '.desc', '');

const inv = {
  gear: Object.fromEntries(GEAR_SLOTS.map(k => [k, null])),
  bag: new Array(BAG_SIZE).fill(null),
  held: null,          // { id, from } while an item is lifted or dragging
  sel: null,           // the slot the keyboard is on
  open: false
};
inv.gear.rightHand = 'beads';
inv.bag[0] = 'phone';
inv.bag[1] = 'keys';

/* the game gives items out; chapters and scenes call these */
function invAdd(id) {
  if (!ITEM_DEFS[id]) return false;
  const i = inv.bag.indexOf(null);
  if (i < 0) return false;
  inv.bag[i] = id; if (inv.open) invPaint();
  return true;
}
function invHas(id) { return inv.bag.includes(id) || Object.values(inv.gear).includes(id); }
function invRemove(id) {
  const i = inv.bag.indexOf(id);
  if (i >= 0) { inv.bag[i] = null; if (inv.open) invPaint(); return true; }
  for (const k of GEAR_SLOTS) if (inv.gear[k] === id) { inv.gear[k] = null; if (inv.open) invPaint(); return true; }
  return false;
}

const invEl = () => $('inv');
const dragEl = () => $('invDrag');
const iconSvg = (icon, cls) =>
  `<svg class="${cls}" aria-hidden="true"><use href="#${icon}"/></svg>`;

function slotHTML(kind, key, id) {
  const def = id ? ITEM_DEFS[id] : null;
  const inner = def ? iconSvg(def.icon, 'item')
    : kind === 'gear' ? iconSvg(SLOT_ICON[key], 'ghost') : '';
  const label = kind === 'gear' ? `<span class="lbl">${T('slot.' + key, key)}</span>` : '';
  return `<button class="slot ${kind === 'gear' ? 'gear' : ''}" type="button"
      data-kind="${kind}" data-key="${key}"
      aria-label="${def ? itemName(id) : T('slot.' + key, 'empty')}">${inner}${label}</button>`;
}

function invPaint() {
  const gear = $('invGear'), bag = $('invBag');
  if (!gear || !bag) return;
  gear.innerHTML = '<svg class="doll" viewBox="0 0 120 260" aria-hidden="true"><use href="#doll"/></svg>'
    + GEAR_SLOTS.map(k => slotHTML('gear', k, inv.gear[k])).join('');
  bag.innerHTML = inv.bag.map((id, i) => slotHTML('bag', String(i), id)).join('');
  // mark what is lifted, and which slots would accept it
  for (const el of invEl().querySelectorAll('.slot')) {
    const kind = el.dataset.kind, key = el.dataset.key;
    const here = kind === 'gear' ? inv.gear[key] : inv.bag[+key];
    if (inv.held && inv.held.from.kind === kind && inv.held.from.key === key) el.classList.add('lifted');
    if (inv.held) {
      const def = ITEM_DEFS[inv.held.id];
      el.classList.add(kind === 'gear' ? (def.slot === key ? 'ok' : 'no') : 'ok');
    }
    if (inv.sel && inv.sel.kind === kind && inv.sel.key === key) el.classList.add('sel');
    if (here) el.dataset.item = here;
  }
  invInfoPaint();
}

function invInfoPaint(id) {
  const box = $('invInfo'); if (!box) return;
  const showing = id || inv.held?.id ||
    (inv.sel && (inv.sel.kind === 'gear' ? inv.gear[inv.sel.key] : inv.bag[+inv.sel.key]));
  box.innerHTML = showing
    ? `<h4>${itemName(showing)}</h4><p>${itemDesc(showing)}</p>`
    : `<h4>${T('inv.empty')}</h4><p>${T('inv.emptyDesc')}</p>`;
}

const slotGet = (kind, key) => kind === 'gear' ? inv.gear[key] : inv.bag[+key];
const slotSet = (kind, key, v) => { if (kind === 'gear') inv.gear[key] = v; else inv.bag[+key] = v; };
const fits = (id, kind, key) => kind === 'bag' || ITEM_DEFS[id]?.slot === key;

function invLift(kind, key) {
  const id = slotGet(kind, key);
  if (!id) return;
  inv.held = { id, from: { kind, key } };
  const d = dragEl();
  d.innerHTML = iconSvg(ITEM_DEFS[id].icon, '');
  d.classList.add('on');
  invPaint();
}
function invDropAt(kind, key) {
  if (!inv.held) return;
  const { id, from } = inv.held;
  if (!fits(id, kind, key)) { invCancel(); return; }     // wrong slot: put it back
  const other = slotGet(kind, key);
  slotSet(from.kind, from.key, other);                   // swap, never destroy
  slotSet(kind, key, id);
  invCancel(true);
  snd('uiconfirm', 0.45);
}
function invCancel(keepInfo) {
  inv.held = null;
  dragEl().classList.remove('on');
  invPaint();
  if (!keepInfo) invInfoPaint();
}
/* double tap: equip it if it fits somewhere, otherwise send it back to the bag */
function invQuickMove(kind, key) {
  const id = slotGet(kind, key); if (!id) return;
  if (kind === 'bag') {
    const target = ITEM_DEFS[id].slot;
    if (!target) return;
    const swap = inv.gear[target];
    inv.gear[target] = id; inv.bag[+key] = swap;
  } else {
    const free = inv.bag.indexOf(null);
    if (free < 0) return;
    inv.bag[free] = id; inv.gear[key] = null;
  }
  inv.held = null; dragEl().classList.remove('on');
  invPaint(); snd('uiconfirm', 0.45);
}

/* pointer handling — one path for mouse and touch */
let ptr = null;
function invPointerDown(e) {
  const el = e.target.closest?.('.slot'); if (!el) return;
  const kind = el.dataset.kind, key = el.dataset.key;
  ptr = { kind, key, x: e.clientX, y: e.clientY, moved: false, hadHeld: !!inv.held };
  if (!inv.held && slotGet(kind, key)) invInfoPaint(slotGet(kind, key));
  inv.sel = { kind, key };
}
function invPointerMove(e) {
  if (inv.held) {                      // the ghost follows finger or cursor
    const d = dragEl();
    d.style.left = e.clientX + 'px';
    d.style.top = (e.clientY - (HAS_TOUCH ? 46 : 0)) + 'px';
  }
  if (!ptr || ptr.moved) return;
  if (Math.hypot(e.clientX - ptr.x, e.clientY - ptr.y) > 7) {
    ptr.moved = true;
    if (!inv.held && slotGet(ptr.kind, ptr.key)) {   // a drag begins
      invLift(ptr.kind, ptr.key);
      invPointerMove(e);
    }
  }
}
function invPointerUp(e) {
  if (!ptr) return;
  const el = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.slot');
  const p = ptr; ptr = null;
  if (p.moved) {                                   // dragged: drop where released
    if (inv.held) { if (el) invDropAt(el.dataset.kind, el.dataset.key); else invCancel(); }
    return;
  }
  // a tap: pick up, or place what is already lifted
  if (inv.held) {
    if (p.hadHeld) invDropAt(p.kind, p.key);
    return;
  }
  if (slotGet(p.kind, p.key)) { invLift(p.kind, p.key); invPointerMove(e); }
}

function invOpen() {
  if (inv.open || state === 'cine' || state === 'title') return;
  inv.open = true;
  invEl().classList.remove('hide');
  document.body.classList.add('invopen');   // the round buttons step aside
  $('invBtn')?.classList.add('open');
  $('invHint').textContent = HAS_TOUCH ? T('inv.hintTouch') : T('inv.hintDesktop');
  statePrev = state;
  state = 'inventory';                 // freezes movement, drain and the ghost
  document.exitPointerLock?.();
  inv.sel = null; invCancel();
  snd('uiclick', 0.5);
}
function invClose() {
  if (!inv.open) return;
  inv.open = false;
  invCancel();
  invEl().classList.add('hide');
  document.body.classList.remove('invopen');
  $('invBtn')?.classList.remove('open');
  state = statePrev === 'inventory' ? 'play' : (statePrev || 'play');
  snd('uiclick', 0.5);
  if (state === 'play') tryLock();     // hand the mouse back to looking
}
let statePrev = 'play';
const invToggle = () => (inv.open ? invClose() : invOpen());

$('invBtn')?.addEventListener('click', invToggle);
$('invCloseBtn')?.addEventListener('click', invClose);
invEl()?.addEventListener('click', e => { if (e.target === invEl()) invClose(); });
invEl()?.addEventListener('pointerdown', invPointerDown);
addEventListener('pointermove', invPointerMove);
addEventListener('pointerup', invPointerUp);
invEl()?.addEventListener('dblclick', e => {
  const el = e.target.closest?.('.slot'); if (el) invQuickMove(el.dataset.kind, el.dataset.key);
});
// double tap on a phone, where dblclick is unreliable
let lastTap = 0, lastTapKey = '';
invEl()?.addEventListener('pointerup', e => {
  const el = e.target.closest?.('.slot'); if (!el) return;
  const k = el.dataset.kind + el.dataset.key, now = performance.now();
  if (k === lastTapKey && now - lastTap < 330) { invQuickMove(el.dataset.kind, el.dataset.key); lastTap = 0; }
  else { lastTap = now; lastTapKey = k; }
});

/* the keyboard: arrows walk the slots, Enter picks up and places */
addEventListener('keydown', e => {
  if (e.code === 'KeyI' && (state === 'play' || state === 'inventory')) {
    e.preventDefault(); invToggle(); return;
  }
  if (!inv.open) return;
  if (e.code === 'Escape') { e.preventDefault(); inv.held ? invCancel() : invClose(); return; }
  const slots = [...invEl().querySelectorAll('.slot')];
  if (!slots.length) return;
  let i = slots.findIndex(el => el.dataset.kind === inv.sel?.kind && el.dataset.key === inv.sel?.key);
  const bagStart = GEAR_SLOTS.length, cols = 5;
  if (e.code === 'Enter' || e.code === 'Space') {
    e.preventDefault();
    if (inv.sel) inv.held ? invDropAt(inv.sel.kind, inv.sel.key) : invLift(inv.sel.kind, inv.sel.key);
    return;
  }
  const step = { ArrowLeft: -1, ArrowRight: 1,
                 ArrowUp: i >= bagStart ? -cols : -3, ArrowDown: i >= bagStart ? cols : 3 }[e.code];
  if (step === undefined) return;
  e.preventDefault();
  if (i < 0) i = 0; else i = Math.max(0, Math.min(slots.length - 1, i + step));
  inv.sel = { kind: slots[i].dataset.kind, key: slots[i].dataset.key };
  invPaint();
});

/* ------------------------------------------------------------ credits --- */
const creditsLayer = $('credits');
function showCredits(on) { creditsLayer?.classList.toggle('hide', !on); }
$('creditsLink')?.addEventListener('click', () => showCredits(true));
$('credClose')?.addEventListener('click', () => showCredits(false));
creditsLayer?.addEventListener('click', e => {
  if (e.target === creditsLayer) showCredits(false);      // click the backdrop
});

// every plain button answers with the same soft click (the mute button stays
// silent — a click under a button that just silenced everything is a bug)
for (const id of ['startBtn', 'creditsLink', 'credClose', 'stepBack',
                  'nextBtn', 'againBtn', 'retryBtn', 'cineSkip']) {
  $(id)?.addEventListener('click', () => snd('uiclick', 0.5));
}

/* ========================================================================
   CUTSCENES
   One tiny timeline engine, four directed scenes — the action and its
   consequence played in the world itself, with the camera taken off the
   player's hands.

   Every visual change is a TRACK: an absolute setter evaluated from the
   current time. That one rule buys everything hard about cutscenes for
   free — skipping is seek(duration), scrubbing for screenshots is seek(t),
   and a stalling phone can never leave the scene half-applied, because the
   next frame re-derives all of it. Sounds are the only exception: they are
   fire-once STINGS, and a seek or skip never fires them.
   ======================================================================== */

const cineFadeEl = $('cineFade'), skipBtn = $('cineSkip');
let cine = null;

/* ------------------------------------------------------------ tiny sfx --
   Little synthesised stings through the same AudioContext as the music.
   No files — a cutscene's thud, clang and chime are cheaper to make than
   to download, and they obey the mute button by never firing under it.   */
let sfxGain = null, noiseBuf = null;
function sfxOut() {
  if (!actx) return null;
  if (!sfxGain) {
    sfxGain = actx.createGain();
    sfxGain.gain.value = 0.9;
    sfxGain.connect(masterOut());
  }
  if (!noiseBuf) {
    noiseBuf = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return sfxGain;
}
// pack sample per sting kind; the synth below stays as the fallback while
// a sample is still decoding. Kinds with no synth equivalent simply wait.
const STING_SAMPLE = {
  boom: ['boom', 0.7], clang: ['clang', 0.75], whoosh: ['whoosh', 0.6],
  take: ['paper', 0.8], chime: ['chime', 0.55],
  kick: ['kick', 0.8], scream: ['scream', 0.85], chant: ['chant', 0.9]
};
function sting(kind) {
  // the heart hears these even when the speakers are off
  if (kind === 'boom') pulseSpike(0.7);
  if (kind === 'scream') pulseSpike(0.95);
  if (!actx || muted || !sfxOut()) return;
  if (kind === 'step' && sndBuf('step1')) { stepSnd(0.5); return; }
  const smp = STING_SAMPLE[kind];
  if (smp && snd(smp[0], smp[1])) return;
  if (kind === 'kick' || kind === 'scream' || kind === 'chant') return;
  const t0 = actx.currentTime;
  const env = (node, peak, a, d) => {
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.001), t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
    node.connect(g); g.connect(sfxGain);
  };
  const noise = (filterType, freq, q, peak, a, d) => {
    const src = actx.createBufferSource(); src.buffer = noiseBuf;
    const f = actx.createBiquadFilter(); f.type = filterType;
    f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
    src.connect(f); env(f, peak, a, d);
    src.start(t0); src.stop(t0 + a + d + 0.05);
    return f;
  };
  const tone = (type, f0, f1, peak, a, d) => {
    const o = actx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t0 + a + d);
    env(o, peak, a, d);
    o.start(t0); o.stop(t0 + a + d + 0.05);
  };
  switch (kind) {
    case 'boom':                                  // she is here
      tone('sine', 68, 36, 0.5, 0.02, 0.85);
      noise('lowpass', 220, 0.7, 0.3, 0.01, 0.4);
      break;
    case 'clang':                                 // metal hitting concrete
      tone('square', 195, 82, 0.16, 0.005, 0.34);
      noise('bandpass', 900, 4, 0.3, 0.004, 0.22);
      noise('lowpass', 160, 0.7, 0.4, 0.01, 0.5);
      break;
    case 'whoosh': {                              // something moves fast
      const f = noise('bandpass', 380, 1.4, 0.32, 0.12, 0.45);
      f.frequency.exponentialRampToValueAtTime(2300, t0 + 0.28);
      f.frequency.exponentialRampToValueAtTime(280, t0 + 0.6);
      break;
    }
    case 'take':                                  // paper against skin
      noise('highpass', 1900, 0.8, 0.12, 0.01, 0.12);
      break;
    case 'step':                                  // a footfall
      noise('lowpass', 150, 0.8, 0.2, 0.006, 0.09);
      break;
    case 'chime':                                 // the calm answer
      tone('sine', 659.3, 659.3, 0.075, 0.16, 2.1);
      tone('sine', 880.0, 880.0, 0.06, 0.22, 2.3);
      tone('sine', 1318.5, 1318.5, 0.035, 0.30, 2.6);
      break;
  }
}

/* ----------------------------------------------------- prayer left hand --
   The pack's own left hand was collapsed at load, and resurrecting it means
   fighting a rig that was never framed for the camera. Instead the RIGHT
   hand — already oriented, already known — is cloned and mirrored, so both
   hands share one anatomy and a symmetric pose is symmetric by construction.
   Mirroring flips the winding, so the clone's materials go double-sided.   */
let prayerArmL = null;
function buildPrayerArm() {
  if (prayerArmL || !rightOriented) return prayerArmL;
  const c = cloneSkinned(rightOriented);
  c.traverse(o => {
    if (o.isMesh) {
      o.frustumCulled = false;
      o.material = o.material.clone();
      o.material.side = THREE.DoubleSide;
    }
  });
  const mir = new THREE.Group();
  mir.scale.x = -1;
  mir.add(c);
  prayerArmL = new THREE.Group();
  prayerArmL.add(mir);
  prayerArmL.visible = false;
  prayerArmL.userData.model = c;
  handsRoot.add(prayerArmL);
  return prayerArmL;
}

// the hell note the hand comes back holding — lives in the viewmodel scene
const noteProp = new THREE.Mesh(
  new THREE.PlaneGeometry(0.15, 0.078),
  new THREE.MeshStandardMaterial({ map: noteTex, roughness: 0.85, side: THREE.DoubleSide }));
noteProp.visible = false;
armR.add(noteProp);
noteProp.position.set(0.012, -0.052, -0.148);
noteProp.rotation.set(-1.18, 0.10, 0.16);

// mirrors the fade logic in updateGhost, for scenes that own her directly
function ghostOpacity(o) {
  for (const m of ghostMats) {
    m.opacity = o;
    const solid = o > 0.995;
    if (m.transparent === solid) { m.transparent = !solid; m.needsUpdate = true; }
  }
  ghostLight.intensity = o * 0.7;
  ghost.visible = o > 0.003;
}

/* --------------------------------------------------------------- engine */
const smoothK = k => k * k * (3 - 2 * k);
const rawK = k => k;
// shortest-arc angle interpolation, so a turn never whips the long way round
function mixAngle(a, b, k) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
}
const faceFrom = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));

function snapWorld() {
  return {
    yawPos: yaw.position.clone(), yawRot: yaw.rotation.y,
    pitchX: pitch.rotation.x, camRoll: camera.rotation.z,
    gPos: ghost.position.clone(), gRotY: ghost.rotation.y, reveal,
    hero: heroNote.visible,
    drumPos: drum.position.clone(), drumRotZ: drum.rotation.z, ashVis: ash.visible,
    emberSize: embers.material.size, emberOp: embers.material.opacity,
    storm: noteStorm, armVis: armR.visible
  };
}

function restoreWorld(s, keep) {
  yaw.position.copy(s.yawPos); yaw.rotation.y = s.yawRot;
  pitch.rotation.x = s.pitchX; camera.rotation.z = s.camRoll;
  drum.position.copy(s.drumPos); drum.rotation.z = s.drumRotZ; ash.visible = s.ashVis;
  embers.material.size = s.emberSize; embers.material.opacity = s.emberOp;
  noteStorm = s.storm;
  heroNote.visible = s.hero;
  armR.visible = s.armVis;
  armR.rotation.set(0.50, 0.28, -0.48);
  vmKey.intensity = 0.50;
  layoutHands();
  noteProp.visible = false;
  if (prayerArmL) prayerArmL.visible = false;
  if (rightHandModel) setHandCurl(rightHandModel, 1);
  ghost.position.copy(s.gPos);
  ghost.rotation.y = s.gRotY;
  if (keep.ghostGone) { reveal = 0; ghostOpacity(0); }
  else { reveal = s.reveal; ghostOpacity(s.reveal); }
}

function playCine(i, onDone) {
  const snap = snapWorld();
  const c = {
    t: 0, last: performance.now(), paused: false,
    tracks: [], stings: [], dur: 1,
    handsAuto: null,           // t => walking speed, or null when scripted
    ghostMix: null,            // t => animation speed for her walk cycle
    keep: {}, endFade: 0, snap, onDone
  };
  CINE_SCENES[i](c, snap);
  c.dur = c.tracks.reduce((m, tr) => Math.max(m, tr.t1), 1);
  cine = c;
  state = 'cine';
  ui.hud.classList.add('hide');
  ui.interact.classList.add('hide');
  hint.classList.add('hide');
  document.body.classList.add('cine');
  cineFadeEl.style.opacity = '0';
  document.exitPointerLock?.();
}

function cineSeek(t) {
  const c = cine;
  for (const tr of c.tracks) {
    if (t < tr.t0) continue;
    if (tr.once) { if (tr.done) continue; tr.done = true; }
    const k = tr.t1 > tr.t0 ? Math.min(1, (t - tr.t0) / (tr.t1 - tr.t0)) : 1;
    tr.fn((tr.ease || smoothK)(k), t);
  }
}

function cineUpdate() {
  const c = cine;
  if (!c) return;
  const now = performance.now();
  let rdt = (now - c.last) / 1000;
  c.last = now;
  if (c.paused) rdt = 0;
  rdt = Math.min(rdt, 0.5);          // a stalled frame advances, never leaps
  const before = c.t;
  c.t = Math.min(c.t + rdt, c.dur);
  for (const s of c.stings) {
    if (!s.fired && s.at > before - 1e-9 && s.at <= c.t) { s.fired = true; sting(s.kind); }
  }
  cineSeek(c.t);
  if (c.ghostMix && ghostMixer) {
    const sp = c.ghostMix(c.t);
    if (sp > 0) ghostMixer.update(rdt * sp);
  }
  skipBtn.classList.toggle('hide', c.t < 0.9);
  if (c.t >= c.dur && !c.paused) cineEnd();
}

function cineHands(dt, t) {
  const c = cine;
  if (!c) return;
  if (c.handsAuto) updateViewmodel(dt, t, c.handsAuto(c.t), 0, 0, 0);
}

function cineEnd() {
  const c = cine;
  if (!c) return;
  cine = null;
  restoreWorld(c.snap, c.keep);
  cineFadeEl.style.opacity = String(c.endFade);
  document.body.classList.remove('cine');
  skipBtn.classList.add('hide');
  ui.hud.classList.remove('hide');
  c.onDone();
}

function skipCine() {
  const c = cine;
  if (!c) return;
  c.t = c.dur;
  cineSeek(c.dur);
  cineEnd();
}

skipBtn.addEventListener('click', e => { e.stopPropagation(); skipCine(); });
addEventListener('keydown', e => {
  if (state === 'cine' && cine && cine.t > 0.6 &&
      (e.code === 'Escape' || e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter')) {
    skipCine();
  }
});
addEventListener('pointerdown', e => {
  // a tap anywhere skips — except on the sound button, which keeps its job
  if (state === 'cine' && cine && !cine.paused && cine.t > 0.8 && !e.target.closest?.('#mute')) {
    skipCine();
  }
});

/* --------------------------------------------------------------- scenes */
const NOTE_POS = { x: 0.35, z: -6.35 };            // the hero note, in the world
const DRUM_W = { x: -1.2, z: -7.5 };               // the burner drum

// shared authoring helpers, bound to the cine being built
function A(c) {
  const tr = (t0, t1, fn, ease) => c.tracks.push({ t0, t1, fn, ease });
  const step = (t0, fn) => c.tracks.push({ t0, t1: t0, fn, once: true });
  const sfx = (at, kind) => c.stings.push({ at, kind });
  const fade = (t0, t1, from, to) =>
    tr(t0, t1, k => { cineFadeEl.style.opacity = String(from + (to - from) * k); }, rawK);
  const camTo = (t0, t1, from, to, ease) => tr(t0, t1, k => {
    yaw.position.x = from.x + (to.x - from.x) * k;
    yaw.position.y = (from.y ?? 1.62) + ((to.y ?? 1.62) - (from.y ?? 1.62)) * k;
    yaw.position.z = from.z + (to.z - from.z) * k;
  }, ease);
  const yawTo = (t0, t1, from, to, ease) =>
    tr(t0, t1, k => { yaw.rotation.y = mixAngle(from, to, k); }, ease);
  const pitchTo = (t0, t1, from, to, ease) =>
    tr(t0, t1, k => { pitch.rotation.x = from + (to - from) * k; }, ease);
  const bob = (t0, t1, rate, amp, baseY = 1.62) => tr(t0, t1, (k, t) => {
    yaw.position.y = baseY + Math.sin((t - t0) * Math.PI * 2 * rate) * amp * Math.sin(Math.PI * k);
  }, rawK);
  const ghostGlide = (t0, t1, from, to) => tr(t0, t1, k => {
    ghost.position.set(from.x + (to.x - from.x) * k, (from.y || 0) + ((to.y || 0) - (from.y || 0)) * k,
                       from.z + (to.z - from.z) * k);
  });
  const ghostFacePlayer = (t0, t1) => tr(t0, t1, () => {
    ghost.rotation.y = Math.atan2(yaw.position.x - ghost.position.x,
                                  yaw.position.z - ghost.position.z);
  }, rawK);
  return { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, ghostGlide, ghostFacePlayer };
}

function scPickUp(c, s) {                          /* A — you take it */
  const { tr, step, sfx, fade, camTo, yawTo, pitchTo } = A(c);
  // the heap the player just tapped is what the hand goes to
  const P = { x: PILE_POS.x, y: 1.62, z: PILE_POS.z + 1.55 };
  // Her group origin sits a touch right of her face, so the staged spot
  // compensates — measured from a screenshot, not guessed.
  const FACE = { x: P.x - 0.14, z: P.z - 0.80 };

  camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
  yawTo(0, 0.9, s.yawRot, faceFrom(P.x, P.z, PILE_POS.x, PILE_POS.z));
  pitchTo(0, 0.9, s.pitchX, -0.58);

  // crouch toward it as the hand reaches forward into frame
  camTo(1.1, 2.5, P, { x: P.x, y: 1.12, z: P.z - 0.14 });
  pitchTo(1.1, 2.5, -0.58, -0.84);
  // Position comes from the root; the hand's ANGLE comes from armR itself.
  // Rotating the root would orbit the arm about the camera and swing it
  // clean out of frame — found the hard way, by an empty screenshot.
  tr(1.1, 2.5, k => {
    handsRoot.position.set(-0.15 * k, 0.185 * k, -0.09 * k);
    handsRoot.rotation.set(0, 0, 0);
    armR.rotation.set(0.50 - 0.48 * k, 0.28 - 0.13 * k, -0.48 + 0.28 * k);
  });
  step(2.5, () => { noteProp.visible = true; });
  sfx(2.5, 'take');

  // rise with it — and while you are looking at your hand, she arrives
  camTo(2.7, 3.9, { x: P.x, y: 1.12, z: P.z - 0.14 }, { x: P.x, y: 1.58, z: P.z });
  pitchTo(2.7, 3.9, -0.84, -0.34);
  tr(2.7, 3.9, k => {
    handsRoot.position.set(-0.15 + 0.05 * k, 0.185 - 0.07 * k, -0.09 + 0.09 * k);
    armR.rotation.set(0.02 + 0.60 * k, 0.15 - 0.05 * k, -0.20 - 0.05 * k);
  });
  /* She cannot be standing there early: at 0.8 m even a camera pitched hard
     at the floor still catches her gown, and the reveal dies. So she
     condenses DURING the look-up itself — position set as the sweep begins,
     opacity racing the pitch, fully there the instant the eyes arrive. */
  step(4.3, () => {
    ghost.position.set(FACE.x, 0, FACE.z);
    ghost.rotation.y = Math.atan2(P.x - FACE.x, P.z - FACE.z);
  });
  tr(4.35, 4.8, k => { ghostOpacity(k); ghostLight.intensity = 1.5 * k; }, rawK);
  tr(4.3, 5.2, k => { fireLight.intensity = 14 - 11.5 * k; }, rawK);

  // look up. she is already there.
  pitchTo(4.2, 5.1, -0.34, 0.03);
  camTo(4.2, 5.1, { x: P.x, y: 1.58, z: P.z }, P);
  tr(4.2, 5.1, k => { handsRoot.position.set(-0.10, 0.115 - 0.46 * k, 0); }, smoothK);
  sfx(4.75, 'boom');
  tr(5.1, 6.6, k => { camera.rotation.z = 0.05 * k; }, rawK);
  tr(5.6, 6.6, k => { ghost.position.z = FACE.z + 0.17 * k; });   // one slow inch closer
  fade(6.6, 8.1, 0, 1);
  sfx(7.1, 'boom');

  c.endFade = 1;
}

function scKick(c, s) {                            /* B — the burner goes over */
  const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, ghostGlide, ghostFacePlayer } = A(c);
  const P = { x: 0.35, y: 1.62, z: -4.9 };
  const faceDrum = faceFrom(P.x, P.z, DRUM_W.x, DRUM_W.z);

  camTo(0, 0.8, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
  yawTo(0, 0.8, s.yawRot, faceDrum);
  pitchTo(0, 0.8, s.pitchX, -0.14);
  // she may already be stood right here from normal play — the scene owns
  // her now, and she is not part of this shot until the drum has gone over
  step(0, () => { ghostOpacity(0); });

  // the kick, told by its impact
  camTo(0.9, 1.2, P, { x: P.x - 0.32, y: 1.40, z: P.z - 0.55 }, rawK);
  pitchTo(0.9, 1.2, -0.14, -0.46, rawK);
  sfx(0.95, 'kick');
  sfx(1.15, 'clang');
  step(1.15, () => { ash.visible = false; });
  tr(1.15, 1.9, k => {
    drum.rotation.z = 1.5 * k;
    drum.position.set(-0.2 - 0.58 * k, 0.45 - 0.26 * k, 0.10 * k);
  });
  for (const at of [1.2, 1.45, 1.7, 2.0]) step(at, () => { shadowDirty = 2; });
  tr(1.15, 1.7, k => { fireLight.intensity = 14 + 9 * Math.sin(Math.PI * k); }, rawK);
  tr(1.7, 2.6, k => { fireLight.intensity = 14 - 12 * k; }, rawK);
  tr(1.15, 2.3, k => {
    embers.material.size = 0.075 + 0.38 * Math.sin(Math.PI * k);
    embers.material.opacity = 0.6 + 0.35 * Math.sin(Math.PI * k);
  }, rawK);
  tr(1.3, 3.2, k => { noteStorm = 1 + 6.5 * k; });
  tr(3.2, 6.0, k => { noteStorm = 7.5 - 5 * k; });

  // recover — and she is at the drum
  camTo(1.9, 2.5, { x: P.x - 0.32, y: 1.40, z: P.z - 0.55 }, P);
  pitchTo(1.9, 2.5, -0.46, -0.03);
  step(2.5, () => { ghost.position.set(-1.0, 0, -7.2); });
  tr(2.5, 2.85, k => { ghostOpacity(k); }, rawK);
  tr(2.9, 9.4, () => { ghostLight.intensity = 1.5; }, rawK);
  ghostFacePlayer(2.5, 9.4);
  ghostGlide(3.1, 3.55, { x: -1.0, z: -7.2 }, { x: 0.2, z: -5.9 });
  sfx(3.15, 'whoosh');
  c.ghostMix = t => (t < 2.5 || t > 9.4 ? 0 : t < 3.1 ? 0.7 : 2.4);

  // run
  yawTo(3.55, 4.25, faceDrum, Math.PI);
  const path1 = { x: P.x, y: 1.62, z: P.z }, path2 = { x: 0.75, y: 1.62, z: -0.9 },
        path3 = { x: 0.55, y: 1.62, z: 4.6 }, path4 = { x: 0.30, y: 1.62, z: 9.4 };
  camTo(4.25, 5.85, path1, path2, rawK);
  camTo(5.85, 7.4, path2, path3, rawK);
  bob(4.25, 7.4, 3.1, 0.055);
  for (let i = 0; i < 9; i++) sfx(4.35 + i * 0.34, 'step');
  ghostGlide(3.55, 5.85, { x: 0.2, z: -5.9 }, { x: 0.65, z: -1.6 });
  ghostGlide(5.85, 8.3, { x: 0.65, z: -1.6 }, { x: 0.45, z: 4.4 });

  // the look back — she is still coming
  camTo(7.4, 8.6, path3, path4, rawK);
  yawTo(7.4, 8.3, Math.PI, 0.28);
  pitchTo(7.4, 8.3, -0.03, -0.06);
  ghostGlide(8.3, 9.4, { x: 0.45, z: 4.4 }, { x: 0.33, z: 7.3 });
  sfx(8.5, 'boom');
  sfx(8.55, 'scream');
  tr(8.6, 9.6, k => { camera.rotation.z = 0.05 * k; }, rawK);
  fade(8.8, 10.0, 0, 1);

  c.handsAuto = t => (t > 4.25 && t < 8.6 ? 4.3 : 0);
  c.endFade = 1;
}

function scLeave(c, s) {                           /* C — you walk away */
  const { sfx, fade, camTo, yawTo, pitchTo, bob } = A(c);
  const P = { x: 0.15, y: 1.62, z: -4.3 };
  const faceShrine = faceFrom(P.x, P.z, SHRINE.x, SHRINE.z);

  camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
  yawTo(0, 0.9, s.yawRot, faceShrine);
  pitchTo(0, 0.9, s.pitchX, -0.16);

  // one long beat on the offerings: seen, considered, left alone
  camTo(1.0, 2.4, P, { x: P.x, y: 1.62, z: P.z - 0.35 });
  pitchTo(1.0, 2.4, -0.16, -0.24);

  yawTo(2.4, 3.7, faceShrine, Math.PI);
  pitchTo(2.4, 3.7, -0.24, -0.02);
  camTo(3.7, 6.9, { x: P.x, y: 1.62, z: P.z - 0.35 }, { x: 0.45, y: 1.62, z: 3.9 }, rawK);
  bob(3.7, 6.9, 2.1, 0.038);
  for (let i = 0; i < 6; i++) sfx(3.9 + i * 0.5, 'step');
  fade(6.1, 7.7, 0, 1);

  c.handsAuto = t => (t > 3.7 && t < 6.9 ? 2.3 : 0);
  c.endFade = 1;
}

function scChant(c, s) {                           /* D — palms together */
  const { tr, step, sfx, camTo, yawTo, pitchTo, ghostGlide, ghostFacePlayer } = A(c);
  const P = { x: 0.0, y: 1.62, z: -4.1 };
  const faceShrine = faceFrom(P.x, P.z, SHRINE.x, SHRINE.z);
  const HOME = { x: -1.05, z: -10.3 };

  camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
  yawTo(0, 0.9, s.yawRot, faceShrine);
  pitchTo(0, 0.9, s.pitchX, -0.10);
  ghostGlide(0, 0.9, { x: s.gPos.x, z: s.gPos.z }, HOME);
  ghostFacePlayer(0, 8.6);
  tr(0, 0.5, k => { ghostOpacity(Math.max(reveal, k)); }, rawK);

  // the hands rise into prayer
  step(0.9, () => {
    buildPrayerArm();
    if (prayerArmL) prayerArmL.visible = true;
  });
  const upAxis = new THREE.Vector3(0, 1, 0);
  tr(0.9, 2.3, k => {
    const y = -0.46 + 0.295 * k;
    // palms turn in to meet as the hands rise — the world-Y turn is applied
    // on top of the base pose, because the Euler order fights a direct edit
    armR.position.set(0.020, y, -0.375);
    armR.rotation.set(1.32, -0.38, -1.50);
    armR.rotateOnWorldAxis(upAxis, 0.92 * k);
    if (prayerArmL) {
      prayerArmL.position.set(-0.020, y, -0.375);
      prayerArmL.rotation.set(1.32, 0.38, 1.50);
      prayerArmL.rotateOnWorldAxis(upAxis, -0.92 * k);
    }
    if (rightHandModel) setHandCurl(rightHandModel, 1 - 0.86 * k);
    if (prayerArmL) setHandCurl(prayerArmL.userData.model, 1 - 0.86 * k);
    handsRoot.position.set(0, Math.sin(k * Math.PI) * 0.008, 0);
  });
  // the hands are the subject of this shot — light them like it
  tr(0.9, 2.0, k => {
    vmHemi.intensity = 0.55 + 0.55 * k;
    vmKey.intensity = 0.50 + 0.55 * k;
    vmFire.intensity = 2.4;
  }, rawK);
  sfx(1.0, 'chant');
  sfx(2.5, 'chime');
  tr(2.3, 8.6, () => { fireLight.intensity = 9; }, rawK);

  // look up to her — and she lets go
  pitchTo(3.4, 4.3, -0.10, 0.11);
  // the hands sink a little as she is released, so you watch her go over them
  tr(4.3, 5.4, k => {
    const y = -0.165 - 0.10 * k;
    armR.position.y = y;
    if (prayerArmL) prayerArmL.position.y = y;
  });
  tr(4.3, 6.6, k => {
    ghostOpacity(1 - k);
    ghost.position.y = 0.5 * k;
  }, rawK);
  sfx(5.3, 'chime');

  // hands come down; the night is ordinary again
  tr(6.6, 7.8, k => {
    const y = -0.265 - 0.24 * k;
    armR.position.y = y;
    if (prayerArmL) prayerArmL.position.y = y;
  });
  tr(7.8, 8.6, () => {}, rawK);                     // a held beat of calm

  c.keep.ghostGone = true;
  c.endFade = 0;
}

const CINE_SCENES = [scPickUp, scKick, scLeave, scChant];

/* Start. The chapter card goes black over the top while the scene is already
   running behind it, so the fade out puts you in a night that has been going
   on without you. Nothing can be done during it — the state is not 'play'
   yet, so nothing moves and nothing drains.                                 */
const CARD_FADE = 900, CARD_HOLD = 2300;
function playChapterCard(then) {
  const el = ui.chapter;
  el.classList.remove('hide');

  // Two frames: one for `display` to take, one to give the transition a value
  // to move away from. A timer backs it up, because the next frame can be a
  // second away while the first shaders compile — which is exactly when this
  // runs — and until the class lands the layer is still transparent.
  const arm = () => el.classList.add('in');
  requestAnimationFrame(() => requestAnimationFrame(arm));
  setTimeout(arm, 120);

  /* The title screen stays up underneath until the black has actually
     arrived. A CSS fade is frame-driven, so on a stalling device it can make
     no progress at all; hiding the title on a stopwatch would then show the
     scene through a transparent layer, which is the one thing this card
     exists to prevent. So: wait for the transition to finish, fall back to a
     timer, and force the layer opaque either way before anything moves.    */
  let covered = false;
  const cover = () => {
    if (covered) return;
    covered = true;
    // Kill the transition before forcing the value, or setting opacity here
    // just starts a second 0.9 s fade from wherever the first one stalled —
    // and the title goes away while the black is still half there.
    el.style.transition = 'none';
    el.style.opacity = '1';
    void el.offsetWidth;                     // commit it this instant
    ui.title.classList.add('hide');
    setTimeout(() => {
      /* On the hosted site the world's files stream in while the title and
         this card are up; nearly always they have long since arrived. If the
         connection is slow, the card simply holds — a black card is already
         a loading screen — and says so, rather than dropping the player into
         an empty night. The cap means a lost fetch can't hold it forever:
         past it we proceed and models pop in late, exactly like today.     */
      const t0 = performance.now();
      const load = $('chapLoad');
      const fadeOut = () => {
        load?.classList.add('hide');
        el.style.transition = '';            // hand it back to the stylesheet
        void el.offsetWidth;
        el.style.opacity = '';
        el.classList.remove('in');
        setTimeout(() => { el.classList.add('hide'); then(); }, CARD_FADE);
      };
      const gate = () => {
        if ((hdbReady && handsReady && ghostReady)
            || performance.now() - t0 > 12000) return fadeOut();
        load?.classList.remove('hide');
        setTimeout(gate, 180);
      };
      gate();
    }, CARD_HOLD);
  };
  el.addEventListener('transitionend', cover, { once: true });
  setTimeout(cover, CARD_FADE + 1200);
}

$('startBtn').onclick = () => {
  state = 'chapter';
  musicStart();                    // the click that counts as the gesture
  tryLock();                       // has to be inside the click to be allowed
  playChapterCard(() => {
    ui.hud.classList.remove('hide');
    hint.classList.remove('hide');
    setTimeout(() => hint.classList.add('hide'), 7000);
    document.body.classList.add('inplay');   // the inventory button belongs to play
    state = 'play';
    setHint();
    warmPlaySet();                 // her sounds must never race their decode
    queueVoice();                  // his own voice, two seconds in
  });
};
$('stepBack').onclick = () => dismissDecision();
$('retryBtn').onclick = () => restart();
$('nextBtn').onclick = () => { ui.result.classList.add('hide'); finish(); };
$('againBtn').onclick = () => restart();

/* The title screen speaks for the whole series, not for whichever chapter is
   loaded — so it has its own line. CH.brief stays as the chapter’s own
   framing, for wherever that ends up being used. */
/* The paragraph under the logo describes the GAME, not this chapter, so it
   is an engine string. (The chapter's own `brief` is its one-line summary,
   kept for the chapter picker and for anyone reading the chapter file.)   */
$('brief').innerHTML = T('title.intro');
$('qtext').innerHTML = CH.prompt;
// the black chapter card carries whatever chapter is registered
if ($('chapLabel')) $('chapLabel').innerHTML = CH.cardLabel;
if ($('chapTitle')) $('chapTitle').innerHTML = CH.cardTitle;
const cWrap = $('choices');
CH.choices.forEach((c, i) => {
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
  snd('paper', 0.7);
  // everything a cutscene or the card after it could need, decoding now so
  // the scene's first sting is a sample rather than the synth fallback
  packWarm(['clang', 'whoosh', 'boom', 'scream', 'kick', 'chant', 'chime',
            'paper', 'endbad', 'endgood', 'uicard', 'uiconfirm', 'uirank',
            'vA', 'vB', 'vC', 'vD', 'step1', 'step2', 'step3', 'step4']);
  ui.prompt.classList.add('hide');
  ui.interact.classList.add('hide');
  hint.classList.add('hide');
  edgeTurn = 0;
  ui.decide.classList.remove('hide');
  decideOpenedAt = performance.now();
  document.exitPointerLock?.();
}

/* Backing out. Nothing is decided and nothing is lost — the panel closes, you
   get your feet back, and the heap is still there. Since nothing opens on its
   own, there is nothing to re-arm: look at it again whenever you want to.    */
let hintTimer = 0;
function dismissDecision() {
  if (state !== 'decide') return;
  snd('uiclick', 0.5);
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
  snd('uiconfirm', 0.7);
  const c = CH.choices[i];
  ui.decide.classList.add('hide');
  // The scene plays first; the numbers and the teaching wait until it is
  // done. The card then rises over whatever the scene left on screen.
  playCine(i, () => {
    for (const k in c.d) stats[k] += c.d[k];
    syncBars();
    ui.say.innerHTML = c.say;
    ui.teach.innerHTML = c.teach;
    ui.deltas.innerHTML = Object.entries(c.d).map(([k, v]) =>
      `<span class="${v >= 0 ? 'up' : 'dn'}"><svg class="sic" aria-hidden="true">` +
      `<use href="#i-${k.slice(0, 3)}"/></svg>${(T('hud.' + k) || k).toUpperCase()} `
      + `${v >= 0 ? '+' : ''}${v}</span>`).join('');
    ui.result.classList.remove('hide');
    state = 'result';
    // the card rises: its swish, the ending's music bed, and the James line
    snd('uicard', 0.6);
    playBed(c.verdict === 'good' || c.verdict === 'best' ? 'endgood' : 'endbad', 0.5);
    duckMusic(15);
    say('v' + c.k, { again: true });
  });
}
/* --------------------------------------------------------- sanity drain ---
   Being looked at costs you. From the moment she is there, sanity bleeds —
   slowly at range, hard up close — and it only bleeds while you are stood in
   the world doing nothing about it. Opening the decision stops it, because
   the whole point of taking the timer off the choices was that the choosing
   is not the part meant to panic you. Walking out of her reach stops it too:
   that is a real answer, not an escape from the mechanic.                   */
// At arm's length this empties a full bar in about forty seconds: enough
// room to look at her, think, and still get out.
const DRAIN_FAR = 0.55, DRAIN_NEAR = 2.5;     // sanity per second
const DRAIN_FAR_D = 13.0, DRAIN_NEAR_D = 4.0; // metres to her

function ghostDrainRate() {
  // presence, not the flicker: once she has shown herself, standing in her
  // territory keeps costing you between appearances too — the banner says
  // exactly this ("dropping until you take action"), and walking out of
  // range remains the honest way to stop it
  if (!ghostReady) return 0;
  const presence = Math.max(reveal, hauntK);
  if (presence <= 0.01) return 0;
  const d = Math.hypot(yaw.position.x - ghost.position.x,
                       yaw.position.z - ghost.position.z);
  const k = THREE.MathUtils.clamp(
    (DRAIN_FAR_D - d) / (DRAIN_FAR_D - DRAIN_NEAR_D), 0, 1);
  return (DRAIN_FAR + (DRAIN_NEAR - DRAIN_FAR) * k * k) * presence;
}

/* The bar moving is easy to miss with a ghost walking at you, so every whole
   point that leaves is also thrown as a number beside the figure it came out
   of. They are batched on a minimum interval, so a fast drain reads "-2"
   rather than flickering two "-1"s in the same breath.                      */
let drainAcc = 0, lastTickAt = 0;
function sanityTick(n) {
  const host = $('ticks');
  if (!host) return;
  const el = document.createElement('span');
  el.textContent = '−' + n;               // a real minus sign, not a hyphen
  el.addEventListener('animationend', () => el.remove());
  host.appendChild(el);
}
function noteDrain(amount) {
  drainAcc += amount;
  const now = performance.now();
  if (drainAcc < 1 || now - lastTickAt < 460) return;
  const n = Math.floor(drainAcc);
  drainAcc -= n;
  lastTickAt = now;
  sanityTick(n);
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
  stopBed();
  loopVol('heart', 0);
  snd('ulost', 0.8);
  say('vlost', { again: true });
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
  ui.core.innerHTML = CH.core;
  ui.complete.classList.remove('hide');
  ui.hud.classList.add('hide');
  state = 'complete';
  snd('uirank', 0.7);
}

/* ------------------------------------------------------------- restart ---
   Walking it again used to reload the page, which meant fetching and decoding
   four and a half megabytes, recompiling every shader, and then sitting
   through the title screen and the chapter card to reach a world that was
   already built and still in memory. Nothing about the scene is consumed by
   playing it, so the honest thing is to put every moving part back where it
   started and drop the player straight onto the grass.

   The three snapshots below are taken at load, before a frame has run, so
   they are the pristine values however many times you go round.            */
const STATS_AT_START = { ...stats };
const SPAWN = { pos: yaw.position.clone(), rot: yaw.rotation.y };
const DRUM_REST = { pos: drum.position.clone(), rotZ: drum.rotation.z };

function restart() {
  // every screen that could be up, down
  for (const el of [ui.complete, ui.over, ui.result, ui.decide,
                    ui.prompt, ui.interact, ui.chapter, hint]) {
    el.classList.add('hide');
  }
  ui.hud.classList.remove('hide');
  document.body.classList.remove('cine');
  cineFadeEl.style.opacity = '0';
  // The red has to go NOW, not over four tenths of a second: a CSS transition
  // is frame-driven, so on the device that just struggled through a cutscene
  // it would bleed over the first seconds of the new run. Kill the transition,
  // force the value, commit it, then hand it back to the stylesheet.
  ui.panic.classList.remove('critical');
  ui.panic.style.transition = 'none';
  ui.panic.style.opacity = '0';
  void ui.panic.offsetWidth;
  ui.panic.style.transition = '';
  const ticks = $('ticks');
  if (ticks) ticks.textContent = '';

  // the numbers
  Object.assign(stats, STATS_AT_START);
  syncBars();
  showHaunt(false);
  drainAcc = 0; lastTickAt = 0;
  chosen = null;

  // the soundscape, back to a fresh run: the bed and any half-spoken line
  // stop, and every once-per-run narration trigger re-arms
  stopBed();
  if (narSrc) { try { narSrc.stop(); } catch {} narSrc = null; }
  for (const k in narrated) delete narrated[k];
  gPhase = 'hidden'; gTimer = 0; gDart = null;
  hauntK = 0; seenThisRun = false;
  audioCues.length = 0; wantLine = null;
  ghost.position.y = 0;

  // the player, back out on the grass facing the block, standing still
  yaw.position.copy(SPAWN.pos); yaw.rotation.y = SPAWN.rot;
  pitch.rotation.x = 0; camera.rotation.z = 0;
  vel.set(0, 0, 0); bob = 0;
  lookX = lookY = 0; edgeTurn = 0;
  stickVec.x = stickVec.y = 0;
  for (const k in keys) keys[k] = false;

  // her, back in the corridor, unseen
  ghost.position.copy(GHOST_HOME);
  ghost.rotation.y = 0;
  reveal = 0;
  ghostOpacity(0);

  // and the props any cutscene may have borrowed
  drum.position.copy(DRUM_REST.pos); drum.rotation.z = DRUM_REST.rotZ;
  ash.visible = true;
  heroNote.visible = true;
  noteStorm = 1;
  noteProp.visible = false;
  if (prayerArmL) prayerArmL.visible = false;
  if (rightHandModel) setHandCurl(rightHandModel, 1);
  armR.visible = true;
  armR.rotation.set(0.50, 0.28, -0.48);
  vmKey.intensity = 0.50;
  layoutHands();
  redoShadows();

  state = 'play';
  setHint();
  warmPlaySet();
  queueVoice();                    // a fresh run gets the line again
  hint.classList.remove('hide');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => hint.classList.add('hide'), 7000);
  tryLock();                       // the click that got us here is the gesture
}

/* ---------------------------------------------------------------- loop */
const clock = new THREE.Timer();
const vel = new THREE.Vector3();
const tmp = new THREE.Vector3();
const OFFER_POS = SHRINE;
let bob = 0;

function collide(nx, nz) {
  const p = new THREE.Vector3(nx, 1.0, nz);
  for (const b of BLOCKERS) if (b.containsPoint(p)) return true;
  return nx < BOUNDS.minX || nx > BOUNDS.maxX || nz < BOUNDS.minZ || nz > BOUNDS.maxZ;
}

/* Frame pacing.

   A phone or tablet is capped at 60. A ProMotion iPhone will happily hand out
   120 frames a second, which is twice the heat for a smoothness nobody can
   see at walking pace. Desktops are left alone. The threshold is 1/61 rather
   than 1/60 so a plain 60 Hz display never has a frame taken off it.

   The title screen renders at 8 — it is behind a full-screen panel, and the
   only reason to draw it at all is so the scene is warm and already moving
   when the chapter card lifts. A hidden tab draws nothing.                 */
const FRAME_MIN_MS = HAS_TOUCH ? 1000 / 61 : 0;
const IDLE_MIN_MS = 1000 / 8;
const SLOW_EVERY_OTHER = HAS_TOUCH;      // half-rate drift for the soft stuff
let lastFrame = -1e9, slowFrame = 0, slowDt = 0;

function tick(now = 0) {
  requestAnimationFrame(tick);
  if (document.hidden) return;
  const gap = state === 'title' ? IDLE_MIN_MS : FRAME_MIN_MS;
  if (gap && now - lastFrame < gap) return;
  lastFrame = now;

  clock.update();
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsed();

  // the shadow maps are static; redraw them only when asked
  if (shadowDirty > 0) { renderer.shadowMap.needsUpdate = true; shadowDirty--; }

  // look — keep this frame's delta, the viewmodel needs it for sway.
  // Only the player's own state consumes it: during a cutscene the timeline
  // owns the camera, and a locked pointer must not be able to fight it.
  if (edgeTurn) lookX += Math.sign(edgeTurn) * edgeTurn * edgeTurn * 2.6 * dt;
  const dLookX = lookX, dLookY = lookY;
  if (state === 'play') {
    yaw.rotation.y += lookX;
    pitch.rotation.x = Math.max(-1.2, Math.min(1.2, pitch.rotation.x + lookY));
  }
  lookX = lookY = 0;

  if (state === 'cine') cineUpdate(t);

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

    // Distance to the burner, which is still what raises the "something is
    // burning ahead" line. Nothing opens the decision on its own any more:
    // the heap is the only way in, so looking at the note is always a choice
    // the player made rather than something that happened to them.
    const d = Math.hypot(yaw.position.x - OFFER_POS.x, yaw.position.z - OFFER_POS.z);

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
      const lost = Math.min(stats.sanity, drain * dt);
      stats.sanity -= lost;
      noteDrain(lost);
      syncBars();
      if (stats.sanity <= 0) lose();
    }
    // the edges close in as it goes, whether or not she is draining you now,
    // and start beating once it is genuinely getting dangerous
    const dread = THREE.MathUtils.clamp((60 - stats.sanity) / 60, 0, 1);
    ui.panic.style.opacity = dread.toFixed(3);
    ui.panic.classList.toggle('critical', stats.sanity > 0 && stats.sanity < 30);
  } else {
    ui.interact.classList.add('hide');
    if (state !== 'lost') showHaunt(false);
  }

  updateNotes(dt, t);
  updateGhost(dt);
  updatePile(t);
  updateAudioFrame(t);
  updatePulse(dt);

  // fire flicker — during a cutscene the timeline owns the fire, so a scene
  // can kill it or knock it over without this fighting it every frame
  const fl = 0.75 + Math.sin(t * 11.3) * 0.14 + Math.sin(t * 27.7) * 0.09 + Math.random() * 0.08;
  if (state !== 'cine') {
    fireLight.intensity = 14 * fl;
    ash.material.color.setHSL(0.045, 1, 0.35 + fl * 0.16);
  }
  jossTips.forEach((tp, i) => {
    tp.material.color.setHSL(0.04, 1, 0.42 + Math.sin(t * 3 + i) * 0.1);
  });

  /* Smoke, embers and the star twinkle run at half rate on a phone. All
     three are slow, soft and blurred, so the eye cannot tell — but each one
     walks an array and re-uploads a buffer to the GPU, and that adds up on a
     device with no cooling. The skipped frame's time is carried over, so
     everything still drifts at the speed it always did.                    */
  slowDt += dt;
  if (!SLOW_EVERY_OTHER || (slowFrame++ & 1) === 0) {
    const sdt = slowDt;
    slowDt = 0;

    updateStars(t);

    const sp2 = smoke.geometry.attributes.position.array;
    for (let i = 0; i < SMOKE_N; i++) {
      sp2[i * 3 + 1] += sdt * (0.28 + (sSeed[i] % 1) * 0.3);
      sp2[i * 3] += Math.sin(t * 0.5 + sSeed[i]) * sdt * 0.12;
      if (sp2[i * 3 + 1] > 4.6) {
        sp2[i * 3 + 1] = 0.9;
        sp2[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.8;
        sp2[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.8;
      }
    }
    smoke.geometry.attributes.position.needsUpdate = true;

    const ep = embers.geometry.attributes.position.array;
    for (let i = 0; i < EM_N; i++) {
      ep[i * 3 + 1] += sdt * (0.7 + Math.random() * 0.5);
      ep[i * 3] += Math.sin(t * 1.7 + i) * sdt * 0.25;
      if (ep[i * 3 + 1] > 3.6) {
        ep[i * 3 + 1] = 0.8;
        ep[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.3;
        ep[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.3;
      }
    }
    embers.geometry.attributes.position.needsUpdate = true;
  }

  // hands: driven by exactly the same movement the camera uses — unless a
  // cutscene is directing them itself
  if (state === 'cine') cineHands(dt, t);
  else updateViewmodel(dt, t, playerSpeed, strafeInput, dLookX, dLookY);

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
                 dismissDecision, ghostDrainRate, lose, setMuted, showCredits,
                 snd, say, loopVol, sting, updateAudioFrame, pulseSpike,
                 invOpen, invClose, invToggle, invAdd, invHas, invRemove,
                 inv: () => ({ gear: { ...inv.gear }, bag: [...inv.bag],
                               held: inv.held?.id || null, open: inv.open }),
                 pulse: () => ({ bpm: Math.round(curBpm),
                                 stress: +pulseStress().toFixed(2),
                                 spike: +spikeLevel.toFixed(2),
                                 impulse: +impulse.toFixed(2) }),
                 pack: () => ({
                   loaded: !!packJson,
                   names: packJson ? Object.keys(packJson).length : 0,
                   decoded: Object.keys(packBufs).length,
                   loops: Object.fromEntries(Object.entries(packLoops)
                     .map(([k, v]) => [k, +v.want.toFixed(3)])),
                   bed: !!bedSrc, nar: !!narSrc,
                   narrated: Object.keys(narrated)
                 }),
                 setVolume,
                 audio: () => ({ muted, ctxState: actx ? actx.state : 'none',
                                 volume: +volume.toFixed(3), finePtr: FINE_PTR,
                                 master: masterGain ? +masterGain.gain.value.toFixed(3) : null,
                                 gain: musicGain ? +musicGain.gain.value.toFixed(3) : null,
                                 decoded: !!musicBuf, playing: !!musicSrc,
                                 seconds: musicBuf ? +musicBuf.duration.toFixed(1) : 0 }),
                 interactPile, pile, pileDist, pileInView,
                 pileScreen, pointerHitsPile, PILE_POS, INTERACT_R,
                 pileGlow: () => pileRing.material.opacity, renderer,
                 pick, chapter: CH, restart,
                 ready: () => ({ hdb: hdbReady, hands: handsReady,
                                 ghost: ghostReady, hosted: HOSTED }),
                 voice: () => ({ decoded: !!voiceBuf, playing: !!voiceSrc,
                                 played: voicePlayed,
                                 dur: voiceBuf ? +voiceBuf.duration.toFixed(2) : 0 }),
                 cine: {
                   active: () => !!cine,
                   t: () => (cine ? cine.t : -1),
                   dur: () => (cine ? cine.dur : 0),
                   seek: (t) => { if (cine) { cine.paused = true; cine.t = t; cineSeek(t); } },
                   resume: () => { if (cine) { cine.paused = false; cine.last = performance.now(); } },
                   skip: skipCine
                 },
                 perf: () => ({ shadowAuto: renderer.shadowMap.autoUpdate,
                                shadowPending: renderer.shadowMap.needsUpdate,
                                capMs: +FRAME_MIN_MS.toFixed(2),
                                halfRateDrift: SLOW_EVERY_OTHER,
                                pixelRatio: renderer.getPixelRatio() }) };
tick();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  vmCam.aspect = innerWidth / innerHeight;
  vmCam.updateProjectionMatrix();
  layoutHands();
  renderer.setSize(innerWidth, innerHeight);
});
