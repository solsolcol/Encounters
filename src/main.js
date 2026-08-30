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
/* Which chapter this boot runs. ?ch=<key> selects from the registry —
   the seam per-chapter tests and deep links use — and anything unknown
   falls back to ch1, so a bad link is never a broken boot. */
const hasOwn = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
const CH_KEY = (() => {
  const want = new URLSearchParams(location.search).get('ch');
  // own keys ONLY: a plain object inherits 'constructor', 'toString',
  // '__proto__'... and a truthiness lookup would accept every one of
  // them, making ?ch=constructor a dead boot instead of a fallback
  return hasOwn(window.__CHAPTERS__, want) ? want : 'ch1';
})();
const CH = (window.__CHAPTERS__ || {})[CH_KEY];
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

/* ------------------------------------------------------ the chapter's world
   The void deck, the burner, the drifting notes and the pile you act on used
   to be built inline right here. None of it is the game's — it is chapter
   1's — so it lives in the chapter now and reaches the engine through the
   handle build() hands back. CHCTX is the other half of that seam: the
   engine's own kit, passed in, so a chapter file never has to import
   anything (it cannot; it is a plain script on purpose).                   */
const CHCTX = {
  THREE, GLTFLoader, scene, camera, yaw, LOW,
  assetBytes, rescueTextures, redoShadows,
  cnv, makeSoftDot, makeGround, makeGrass, makeConcrete, makeLacquer, makeHellNote,
  getState: () => state,           // `state` is declared below; read at call time
  startDecision                    // a hoisted declaration, so naming it here is safe
};
if (typeof CH.build !== 'function') {
  throw new Error('chapter ' + CH_KEY + ' registered no build() — see chapters/ch1.js');
}
let stage = CH.build(CHCTX);         // reassigned by rebuildStage(), below
scene.add(sky);          // added AFTER the chapter's world, so the first Group
                         // in the scene is still the world — several harnesses
                         // find it that way (see the note where `sky` is built)

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
stage.world.add(ghost);

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

/* Her rhythm is a horror film's. The first sight is a standing figure
   behind the burner that flees when believed. After that she has a
   repertoire, and the player never knows which one is coming:

     flee   — the corner of your eye; stands a beat, then whips away
     chase  — glides straight AT you out of the dark, gone before she arrives
     cross  — passes left-to-right (or mirrored) through your view
     close  — simply THERE, an arm's length from your face, then not

   Rules that hold for all of them, from Chad's notes: she is always
   perfectly upright and facing you (yaw is the only rotation ever
   touched, and the walk animation NEVER advances while she moves — the
   swimming lean of the walk cycle is what read as a tilt); she never
   arcs up-and-down mid-flight (a low hover, held); every spawn point is
   projected through the real camera so she appears INSIDE your view;
   and each appearance takes a bite out of sanity, not a trickle.      */
let gPhase = 'hidden';        // hidden | appear | standing | glide | gone | fade
let gVariant = 'flee';        // what THIS appearance does
let lastVariant = '';         // never the same trick twice in a row
let appearCount = 0;          // 1 = behind the burner, 2 = always the chase
let gTimer = 0;
let gGlide = null;            // { fx,fz,tx,tz,t,dur,ease,hover,fadeFrom }
let hauntK = 0;               // her presence for the drain — outlasts the flickers
let seenThisRun = false;      // the strings are for the FIRST sight only
const audioCues = [];         // machine -> audio frame; replayed until samples exist

const CHUNK = { flee: 4, chase: 7, cross: 5, close: 10 };   // sanity per sighting

const _nv = new THREE.Vector3();
function pointInView(x, z, edge) {
  // through the REAL camera, so "in view" means on the player's screen —
  // matrices forced because the fixed-clock tests never render
  yaw.updateMatrixWorld(true);
  _nv.set(x, 1.3, z).project(camera);
  return _nv.z < 1 && _nv.z > -1 && Math.abs(_nv.x) < edge && Math.abs(_nv.y) < 1.1;
}
// The deck ends in a solid wall at z=-19.5 and holds three pillar rows;
// a spawn the geometry hides is worse than no spawn at all (the review
// caught this: from the burner, an 11-14 m chase spawn lands BEHIND the
// wall). So: a rear bound, and a clear line from the player's eyes to
// her, marched against the same boxes that stop the player.
const GHOST_DECK_REAR = -18.8;
const inDeck = (x, z) => z <= GHOST_DECK_EDGE - 0.25 && z >= GHOST_DECK_REAR
                      && Math.abs(x) <= 20.5;
const _lv = new THREE.Vector3();
function lineClear(x, z) {
  const px = yaw.position.x, pz = yaw.position.z;
  const d = Math.hypot(x - px, z - pz);
  const steps = Math.max(2, Math.ceil(d / 0.6));
  for (let i = 1; i <= steps; i++) {
    const k = i / steps;
    _lv.set(px + (x - px) * k, 1.4, pz + (z - pz) * k);
    for (const b of BLOCKERS) if (b.containsPoint(_lv)) return false;
  }
  return true;
}

function ghostPlaceBehindBurner() {
  const px = yaw.position.x - OFFER_POS.x, pz = yaw.position.z - OFFER_POS.z;
  const d = Math.hypot(px, pz) || 1;
  ghost.position.set(
    THREE.MathUtils.clamp(OFFER_POS.x - (px / d) * 2.1, -20.5, 20.5), 0,
    Math.min(OFFER_POS.z - (pz / d) * 2.1, GHOST_DECK_EDGE - 0.4));
}

// a spot ahead of the player: inside the deck, inside the view, far enough
function pickAhead(dMin, dMax, spread, edge, minFromPlayer) {
  for (let i = 0; i < 14; i++) {
    const ang = yaw.rotation.y + (Math.random() * 2 - 1) * spread;
    const dist = dMin + Math.random() * (dMax - dMin);
    const x = yaw.position.x - Math.sin(ang) * dist;
    const z = yaw.position.z - Math.cos(ang) * dist;
    if (!inDeck(x, z)) continue;
    if (Math.hypot(x - yaw.position.x, z - yaw.position.z) < minFromPlayer) continue;
    if (!pointInView(x, z, edge)) continue;
    if (!lineClear(x, z)) continue;              // a wall or pillar would hide her
    return { x, z };
  }
  return null;
}

function chooseVariant() {
  appearCount++;
  if (appearCount === 1) return 'flee';
  if (appearCount === 2) return 'chase';           // Chad: then she comes FOR you
  const pool = [];
  const add = (v, w) => { if (v !== lastVariant) for (let i = 0; i < w; i++) pool.push(v); };
  add('chase', 30); add('cross', 30); add('close', 20); add('flee', 20);
  return pool[Math.floor(Math.random() * pool.length)] || 'chase';
}

/* Stage the chosen appearance: position her, set the phase, queue sound.
   Returns false when the geometry cannot host that variant from where the
   player stands (facing the grass, hard against a wall) — the caller
   falls through to a variant that always works.                        */
function stageVariant(v) {
  if (v === 'close') {
    // simply there. Dead ahead, an arm and a half away, standing still.
    const ang = yaw.rotation.y + (Math.random() * 2 - 1) * 0.06;
    const x = yaw.position.x - Math.sin(ang) * 2.2;
    const z = yaw.position.z - Math.cos(ang) * 2.2;
    if (!inDeck(x, z) || !lineClear(x, z)) return false;
    ghost.position.set(x, 0, z);
    gTimer = 1.1;
    audioCues.push({ kind: 'closeScare', pan: 0 });
    return true;
  }
  if (v === 'chase') {
    const spot = pickAhead(11, 14, 0.28, 0.62, 9) || pickAhead(7, 14, 0.5, 0.8, 6);
    if (!spot) return false;
    ghost.position.set(spot.x, 0, spot.z);
    gTimer = 0.5 + Math.random() * 0.3;              // spotted — then she comes
    return true;
  }
  if (v === 'cross') {
    const side = Math.random() < 0.5 ? 1 : -1;
    for (let i = 0; i < 8; i++) {
      const half = 0.6 - i * 0.04;                   // narrow until it fits
      const dist = 6 + Math.random() * 3;
      const a0 = yaw.rotation.y + side * half, a1 = yaw.rotation.y - side * half;
      const fx = yaw.position.x - Math.sin(a0) * dist, fz = yaw.position.z - Math.cos(a0) * dist;
      const tx = yaw.position.x - Math.sin(a1) * dist, tz = yaw.position.z - Math.cos(a1) * dist;
      if (!inDeck(fx, fz) || !inDeck(tx, tz)) continue;
      if (!pointInView(fx, fz, 1.0) || !pointInView(tx, tz, 1.0)) continue;
      if (!lineClear(fx, fz) || !lineClear(tx, tz)) continue;
      ghost.position.set(fx, 0, fz);
      gGlide = { fx, fz, tx, tz, t: 0, dur: 1.5, ease: 'inout', hover: 0.22, fadeFrom: 0.75 };
      gTimer = 0.2;
      return true;
    }
    return false;
  }
  // flee: first time behind the burner; after that the corner of the eye
  if (appearCount === 1) ghostPlaceBehindBurner();
  else {
    const spot = pickAhead(5.5, 12, 0.55, 0.88, GHOST_MIN_DIST + 1);
    if (spot) ghost.position.set(spot.x, 0, spot.z);
    else ghostPlaceBehindBurner();
  }
  gTimer = 1.4 + Math.random() * 0.8;                // the anticipation IS the scare
  return true;
}

function beginAppearance() {
  let v = chooseVariant();
  if (!stageVariant(v)) { v = 'flee'; stageVariant(v); }   // flee always stages
  gVariant = v; lastVariant = v;
  gPhase = 'appear';
  if (!seenThisRun) {
    seenThisRun = true;
    audioCues.push({ kind: 'first' });
    pulseSpike(1.0);
  } else if (v !== 'close') {                        // close pushed its own scare
    audioCues.push({ kind: 'reappear' });
    pulseSpike(v === 'chase' ? 0.7 : 0.5);
  } else {
    pulseSpike(1.2);
  }
}

// the bite: every sighting costs a chunk, thrown as the HUD's tick numbers
function applyChunk(v) {
  if (state !== 'play') return;
  const n = CHUNK[v] || 4;
  stats.sanity -= n;
  syncBars();
  sanityTick(n);
  if (stats.sanity <= 0) lose();
}

function ghostStartGlide(kind) {
  // she flees AWAY, or comes AT you — one glide, staged by intent
  if (kind === 'away') {
    const away = Math.atan2(ghost.position.x - yaw.position.x,
                            ghost.position.z - yaw.position.z);
    const ang = away + (Math.random() - 0.5) * 1.1;
    const dist = 6 + Math.random() * 4;
    const tx = THREE.MathUtils.clamp(ghost.position.x + Math.sin(ang) * dist, -20.5, 20.5);
    const tz = THREE.MathUtils.clamp(ghost.position.z + Math.cos(ang) * dist,
                                     GHOST_DECK_REAR, GHOST_DECK_EDGE - 0.3);
    gGlide = { fx: ghost.position.x, fz: ghost.position.z, tx, tz,
               t: 0, dur: 0.62, ease: 'in4', hover: 0.28, fadeFrom: 0.6 };
  } else {                                           // toward — but never arriving
    const dx = yaw.position.x - ghost.position.x, dz = yaw.position.z - ghost.position.z;
    const d = Math.hypot(dx, dz) || 1;
    const stop = Math.max(GHOST_MIN_DIST + 0.8, 4.2);
    const k = Math.max(0, (d - stop) / d);
    gGlide = { fx: ghost.position.x, fz: ghost.position.z,
               tx: ghost.position.x + dx * k, tz: ghost.position.z + dz * k,
               t: 0, dur: 1.15, ease: 'in3', hover: 0.22, fadeFrom: 0.55 };
  }
  gPhase = 'glide';
  audioCues.push({ kind: 'glide' });
}

const GLIDE_EASE = {
  in3: k => k * k * k,
  in4: k => k * k * k * k,                           // slow lift-off, then GONE
  inout: k => k * k * (3 - 2 * k)
};

function updateGhost(dt) {
  if (!ghostReady) return;
  if (state === 'cine' || state === 'result' || state === 'complete'
      || state === 'lost') return;

  const distToBurner = Math.hypot(yaw.position.x - OFFER_POS.x,
                                  yaw.position.z - OFFER_POS.z);
  const inTerritory = distToBurner < GHOST_APPEAR_AT;
  const playing = state === 'play';

  if (seenThisRun && inTerritory && playing)
    hauntK = Math.min(0.85, hauntK + dt / 1.6);
  else
    hauntK = Math.max(0, hauntK - dt / 1.2);

  const dPlayer = Math.hypot(yaw.position.x - ghost.position.x,
                             yaw.position.z - ghost.position.z);

  switch (gPhase) {
    case 'hidden':
      reveal = 0;
      if (inTerritory && playing) beginAppearance();
      break;

    case 'appear':
      reveal = Math.min(1, reveal + dt / (gVariant === 'close' ? 0.3 : 0.45));
      if (ghostMixer) ghostMixer.update(dt * 0.2);
      if (!inTerritory) { gPhase = 'fade'; break; }
      if (reveal >= 1) {
        applyChunk(gVariant);                        // the sighting itself costs
        if (fainting || state === 'cine') break;     // it cost EVERYTHING: she holds
        if (gVariant === 'cross') ghostStartGlideCross();
        else gPhase = 'standing';
      }
      break;

    case 'standing':
      gTimer -= dt;
      if (ghostMixer) ghostMixer.update(dt * 0.25);  // breathing, not walking
      if (!inTerritory) { gPhase = 'fade'; break; }
      if (gVariant === 'close') {
        if (gTimer <= 0) gPhase = 'fade';            // she never moves. she is just gone.
      } else if (gVariant === 'chase') {
        if (gTimer <= 0) ghostStartGlide('toward');
      } else {                                       // flee
        if (gTimer <= 0 || dPlayer < GHOST_MIN_DIST + 0.6) ghostStartGlide('away');
      }
      break;

    case 'glide': {
      gGlide.t += dt;
      const k = Math.min(1, gGlide.t / gGlide.dur);
      const a = GLIDE_EASE[gGlide.ease](k);
      ghost.position.x = gGlide.fx + (gGlide.tx - gGlide.fx) * a;
      ghost.position.z = gGlide.fz + (gGlide.tz - gGlide.fz) * a;
      // off the floor and HELD there — no arc, nothing that reads as shrinking
      ghost.position.y = Math.min(1, k * 3) * gGlide.hover;
      const ff = gGlide.fadeFrom;
      reveal = k < ff ? 1 : Math.max(0, 1 - (k - ff) / (1 - ff));
      // the walk cycle stays frozen: she GLIDES, she does not swim
      if (k >= 1) {
        ghost.position.y = 0;
        reveal = 0;
        gPhase = 'gone';
        gTimer = 2 + Math.random() * 1.0;
      }
      break;
    }

    case 'gone':
      reveal = 0;
      gTimer -= dt;
      if (!inTerritory) { gPhase = 'hidden'; break; }
      if (gTimer <= 0 && playing) beginAppearance();
      break;

    case 'fade':
      reveal = Math.max(0, reveal - dt / (gVariant === 'close' ? 0.7 : 0.9));
      if (reveal <= 0) {
        ghost.position.y = 0;
        gPhase = inTerritory && playing
          ? 'gone' : 'hidden';                       // close fades into the cycle
        gTimer = 2 + Math.random() * 1.0;
      }
      break;
  }

  ghostOpacity(reveal);
  if (ghost.visible) {
    // upright, always; facing you, always. Yaw is the only rotation touched.
    ghost.rotation.y = Math.atan2(yaw.position.x - ghost.position.x,
                                  yaw.position.z - ghost.position.z);
  }
}

function ghostStartGlideCross() {
  gPhase = 'glide';                                  // gGlide was staged with the spawn
  audioCues.push({ kind: 'glide' });
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
  const dFire = Math.hypot(yaw.position.x - stage.fireLight.position.x,
                           yaw.position.z - stage.fireLight.position.z);
  const warm = Math.max(0, 1 - dFire / 7) ** 2;
  vmFire.intensity = warm * 2.4 * (0.82 + Math.sin(t * 11.3) * 0.12 + Math.random() * 0.06);
  vmHemi.intensity = 0.55 - warm * 0.16;
}

/* ------------------------------------------------------- collision box */
const BOUNDS = { ...CH.bounds };
// A chapter knows its own walls — it built them, and it is the only thing
// that knows which of its materials means "solid". The engine only ever
// needs the boxes to slide along. Re-pointed by rebuildStage().
let BLOCKERS = stage.blockers;

/* ------------------------------------------------------------ controls */
const keys = Object.create(null);
addEventListener('keydown', e => {
  // Escape closes whatever is open: credits first, then the decision panel
  if (e.code === 'Escape' && !$('credits').classList.contains('hide')) {
    showCredits(false); return;
  }
  if (e.code === 'Escape' && state === 'decide') { dismissDecision(); return; }
  if (e.code === 'KeyE' && state === 'play') { stage.pile.interact(); return; }
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
  if (!locked && state === 'play' && stage.pile.hits(e.clientX, e.clientY)) {
    stage.pile.interact();
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
        && state === 'play' && stage.pile.hits(t.clientX, t.clientY)
        && stage.pile.interact()) {
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
  packWarm(['strings', 'whisper', 'boom', 'dread', 'swoosh', 'sobbing',
            'gscream', 'breath', 'ghostloop', 'heart', 'kick', 'ulost',
            'vghost', 'vfaint', 'vlow', 'vpile', 'vnote', 'vlost',
            'vscare1', 'vscare2', 'vscare3', 'vscare4']);
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

function snd(name, vol = 1, rate = 1, pan = 0) {        // one-shot
  if (muted) return null;
  const buf = sndBuf(name);
  if (!buf || !actx || actx.state !== 'running') return null;
  const s = actx.createBufferSource();
  s.buffer = buf;
  s.playbackRate.value = rate;
  const g = actx.createGain();
  g.gain.value = vol;
  s.connect(g);
  let out = g;
  if (pan && actx.createStereoPanner) {   // where she IS, not just that she is
    const pn = actx.createStereoPanner();
    pn.pan.value = THREE.MathUtils.clamp(pan, -1, 1);
    g.connect(pn);
    out = pn;
  }
  out.connect(packGain);
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
    let out = g;
    if (actx.createStereoPanner) {               // steerable via loopPan()
      L.pan = actx.createStereoPanner();
      g.connect(L.pan);
      out = L.pan;
    }
    out.connect(ambGain);
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
function loopPan(name, v) {
  const L = packLoops[name];
  if (L && L.pan) L.pan.pan.setTargetAtTime(THREE.MathUtils.clamp(v, -1, 1),
                                            actx.currentTime, 0.15);
}
// her bearing on the player's screen, -1 left ... +1 right
const _pp = new THREE.Vector3();
function ghostPan() {
  _pp.set(ghost.position.x, 1.35, ghost.position.z);
  camera.worldToLocal(_pp);
  return THREE.MathUtils.clamp(_pp.x / (Math.abs(_pp.z) + 1.5), -1, 1);
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

/* A narration you can WAIT for: resolves when the line finishes, or with
   false when it cannot play (muted, missing, or the floor never frees up
   within `wait`). The cards use this to hold their buttons until James
   has finished talking — and to fall back to animation-only gating the
   moment sound is off, so nobody is ever stuck.                         */
function speak(name, opts = {}) {
  const deadline = performance.now() + (opts.wait ?? 6000);
  return new Promise(resolve => {
    const attempt = () => {
      if (muted || !packJson || !packJson[name]) return resolve(false);
      const buf = sndBuf(name);
      if (!buf || narSrc || voiceSrc || !actx || actx.state !== 'running') {
        if (performance.now() > deadline) return resolve(false);
        setTimeout(attempt, 160);
        return;
      }
      narSrc = actx.createBufferSource();
      narSrc.buffer = buf;
      narSrc.onended = () => { narSrc = null; resolve(true); };
      narSrc.connect(packGain);
      narSrc.start();
    };
    attempt();
  });
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
// his fear has a voice: a different sound each time she reappears
const VSCARES = ['vscare1', 'vscare2', 'vscare3', 'vscare4'];
let scareIdx = Math.floor(Math.random() * VSCARES.length);
function scaredGasp() {
  if (muted || narSrc || voiceSrc || state !== 'play') return;
  const name = VSCARES[scareIdx++ % VSCARES.length];
  const buf = sndBuf(name);
  if (!buf || !actx || actx.state !== 'running') return;
  narSrc = actx.createBufferSource();
  narSrc.buffer = buf;
  narSrc.onended = () => { narSrc = null; };
  narSrc.connect(packGain);
  narSrc.start();
}
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
      } else if (c.kind === 'reappear') {
        // her sounds come from WHERE SHE IS; his fear is his own
        if (sndBuf('sobbing') && sndBuf('gscream')) {
          const gp = ghostPan();
          if (Math.random() < 0.55) snd('sobbing', 0.42, 1, gp);
          if (Math.random() < 0.25) { snd('gscream', 0.7, 1, gp); pulseSpike(0.9); }
          scaredGasp();
          done = true;
        }
      } else if (c.kind === 'closeScare') {
        if (sndBuf('gscream') && sndBuf('sobbing')) {
          snd('gscream', 0.95);                       // in your face: dead centre
          snd('sobbing', 0.5, 1, 0);
          duckMusic(5);
          scaredGasp();
          done = true;
        }
      } else if (c.kind === 'glide') {
        // a soft, wide rush of air — never the old zip
        if (sndBuf('swoosh')) { snd('swoosh', 0.4, 1, ghostPan()); done = true; }
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

  // steer the loops to her side of the world every frame
  const gpan = ghostPan();
  loopPan('whisper', gpan * 0.8);
  loopPan('ghostloop', gpan * 0.6);
  if (state === 'play' && presence > 0.15) {
    if (t > nextCry) {
      nextCry = t + 9 + Math.random() * 11;
      snd('sobbing', 0.25 + near * 0.4, 1, gpan);     // clear, female, directional
    }
    if (dGhost < 2.8 && reveal > 0.3 && t > nextBreath) {
      nextBreath = t + 6 + Math.random() * 6; snd('breath', 0.7);
    }
  } else if (presence <= 0.01) {
    if (nextCry < t + 4) nextCry = t + 4 + Math.random() * 6;
  }
  // the pile, narrated on the first approach and at the first clear look
  if (state === 'play') {
    if (stage.pile.dist() < 8) say('vpile');
    if (stage.pile.dist() < stage.pile.radius && stage.pile.inView()) say('vnote');
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
  if (state === 'lost' || fainting) return -1;   // flatline
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

/* ── the state seam ─────────────────────────────────────────────────────
   Everything a run IS, as plain JSON: the chapter key, the three stats,
   what is worn and carried. This is CHECKPOINT state — what a save at a
   chapter boundary needs and what a test needs to stage chapter N
   directly. It is deliberately NOT a quicksave: her phase, cutscene
   progress and timers are not state; she re-arms from hidden after any
   restore, which is also the correct staging. If it cannot be JSON, it
   is not state. Chapter 2 wires persistence to this; the harnesses use
   it today via window.__enc.                                          */
/* ------------------------------------------------------- the checkpoint ---
   Where a run is written down between chapters. CHECKPOINT state, not a
   quicksave: stats and inventory at a chapter boundary, and nothing else —
   if it cannot be JSON it is not state, so her position, the cutscene clock
   and every timer are deliberately absent (she re-arms from hidden on any
   restore, which is also correct staging).

   Deliberately NOT restored on boot. Auto-resume versus always starting at
   the title screen is a decision about how the game FEELS, and the base
   game's feel is frozen at v3.3 — so the mechanism ships now and the
   behaviour is Chad's call when there is a second chapter to resume into.

   Every access is guarded: localStorage THROWS outright in some privacy
   modes, rather than politely returning null.                             */
const SAVE_KEY = 'mz.encounters.checkpoint';

function saveCheckpoint() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(worldState()));
    return true;
  } catch { return false; }        // private mode, quota, or storage disabled
}
function loadCheckpoint() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }         // absent, unreadable, or half-written
}
function clearCheckpoint() {
  try { localStorage.removeItem(SAVE_KEY); return true; } catch { return false; }
}

function worldState() {
  return {
    v: 1,
    ch: CH_KEY,
    stats: { sanity: stats.sanity, awareness: stats.awareness, wisdom: stats.wisdom },
    inv: { gear: { ...inv.gear }, bag: [...inv.bag] }
  };
}
function applyState(st) {
  if (!st || typeof st !== 'object' || st.v !== 1) return false;
  if (!st.stats || typeof st.stats !== 'object') return false;
  // a state stamped for a different chapter is not applicable to this
  // boot — silently seeding ch2's run into ch1's world is exactly the
  // quiet corruption the A2 restore wiring must never hit. Absent ch
  // means "the current one" and stays tolerated.
  if (st.ch && st.ch !== CH_KEY) return false;
  // Only a real finite number counts. null is how JSON spells "absent",
  // and +null is 0 — which for sanity means an instant faint, the most
  // destructive possible reading of a missing value.
  const num = (v, fb) => (typeof v === 'number' && Number.isFinite(v))
    ? Math.max(0, Math.min(100, v)) : fb;
  // a lifted item lives outside gear and bag; applying over it would
  // duplicate whatever the hand was holding
  invCancel();
  stats.sanity = num(st.stats.sanity, stats.sanity);
  stats.awareness = num(st.stats.awareness, stats.awareness);
  stats.wisdom = num(st.stats.wisdom, stats.wisdom);
  if (st.inv && typeof st.inv === 'object') {
    const ok = id => (typeof id === 'string' && hasOwn(ITEM_DEFS, id)) ? id : null;
    for (const k of GEAR_SLOTS) inv.gear[k] = ok(st.inv.gear?.[k]);
    const bag = Array.isArray(st.inv.bag) ? st.inv.bag : [];
    for (let i = 0; i < BAG_SIZE; i++) inv.bag[i] = ok(bag[i]);
    if (inv.open) invPaint();
  }
  syncBars();
  return true;
}

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
  if (inv.open || state !== 'play') return;   // the bag belongs to the walk, not the cards
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
  new THREE.MeshStandardMaterial({ map: stage.noteTex, roughness: 0.85, side: THREE.DoubleSide }));
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

/* ------------------------------------------------- swapping the chapter ---
   Advancing a chapter is dispose() then build() — never a page reload, which
   would re-pay the GLB parse, the shader compile and the whole audio decode
   for every chapter after the first.

   What has to be re-pointed is everything the ENGINE holds that came out of
   the old chapter: the walls it slides along, the texture on the prop in the
   player's hand, and the ghost, who belongs to the engine but lives inside
   the chapter's world group so that she moves with it.

   Called by leaktest today and by the chapter-advance path when chapter 2
   arrives. Deliberately does not touch stats or inventory: those are the
   player's, and worldState()/applyState() are how they travel.           */
function rebuildStage(next) {
  const ch = next || CH;
  stage.dispose();
  stage = ch.build(CHCTX);
  stage.world.add(ghost);            // she is the engine's, but rides the world
  BLOCKERS = stage.blockers;
  noteProp.material.map = stage.noteTex;      // the old one was just disposed
  noteProp.material.needsUpdate = true;
  redoShadows();
  return stage;
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
    armVis: armR.visible,
    ch: stage.snap()          // the chapter's own props — its scenes borrow them
  };
}

function restoreWorld(s, keep) {
  yaw.position.copy(s.yawPos); yaw.rotation.y = s.yawRot;
  pitch.rotation.x = s.pitchX; camera.rotation.z = s.camRoll;
  stage.restore(s.ch);
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

function playCineFn(sceneFn, onDone) {
  const snap = snapWorld();
  const c = {
    t: 0, last: performance.now(), paused: false,
    tracks: [], stings: [], dur: 1,
    handsAuto: null,           // t => walking speed, or null when scripted
    ghostMix: null,            // t => animation speed for her walk cycle
    keep: {}, endFade: 0, snap, onDone
  };
  sceneFn(c, snap, sceneApi(c));
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
const playCine = (i, onDone) => playCineFn(CINE_SCENES[i], onDone);

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

/* ------------------------------------------------- the cutscene language */
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

/* Everything a chapter's scene is allowed to touch, in one object built per
   cine. The verbs come from A(c); the rest is the cast — the player's
   camera, the ghost, the hands and their lights — plus `stage`, which is
   how a scene reaches its own chapter's props.

   The three accessors are accessors on purpose: prayerArmL and
   rightHandModel do not exist until the hands finish loading, and
   `reveal` changes under the scene's feet, so capturing any of them by
   value at scene-build time would freeze the wrong answer.               */
function sceneApi(c) {
  return {
    ...A(c),
    rawK, smoothK, mixAngle, faceFrom, THREE, SHRINE, stage,
    camera, yaw, pitch,
    ghost, ghostLight, ghostOpacity, getReveal: () => reveal,
    handsRoot, armR, noteProp,
    buildPrayerArm, prayerArm: () => prayerArmL,
    rightHand: () => rightHandModel, setHandCurl,
    vmKey, vmFire, vmHemi,
    dirtyShadows: n => { shadowDirty = n; }
  };
}

/* --------------------------------------------------------------- scenes */
/* The four cutscenes are chapter 1's, and they live in chapter 1 now. What
   stays here is the LANGUAGE they are written in: A(c) below supplies the
   verbs, and sceneApi() adds the cast a scene is allowed to direct — the
   player's camera, the ghost, the hands, and the chapter's own props by way
   of `stage`. Every chapter's scenes are written against exactly this, which
   is the whole reason it is worth naming.                                 */
const CINE_SCENES = CH.scenes || [];
if (CINE_SCENES.length !== CH.choices.length) {
  console.warn(`chapter ${CH_KEY}: ${CH.choices.length} choices but ` +
               `${CINE_SCENES.length} scenes — a choice with no scene will ` +
               `fall straight through to its outcome card`);
}


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
        if ((stage.ready() && handsReady && ghostReady)
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
/* ── the outcome plays out ────────────────────────────────────────────
   Nothing on the card is stated; it happens, in order: the stat bars
   grow or shrink one after another with their numbers counting, then
   Master Z's teaching writes itself letter by letter, then — only once
   James has also finished speaking — the button fades in. A tap
   fast-forwards the animations; the voice gate stays (Chad's call).
   Muted (or a missing line) resolves the voice gate at once, so nobody
   is ever stuck waiting for silence.                                  */
let cardHurry = false, cardSeq = 0;      // seq id guards a stale async chain

function typeText(el, html, cps = 32) {
  const probe = document.createElement('div');
  probe.innerHTML = html;
  const full = probe.textContent;
  el.textContent = '';
  el.classList.add('writing');
  return new Promise(res => {
    let i = 0, last = performance.now();
    const mySeq = cardSeq;
    const step = now => {
      if (mySeq !== cardSeq) return res();           // card is gone; stop quietly
      if (cardHurry) i = full.length;
      i += ((now - last) / 1000) * cps; last = now;
      const n = Math.min(full.length, Math.floor(i));
      el.textContent = full.slice(0, n);
      if (n >= full.length) {
        el.classList.remove('writing');
        el.innerHTML = html;                          // any markup comes back intact
        return res();
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function animateStatRow(row) {
  return new Promise(res => {
    row.classList.add('on');
    snd('uiclick', 0.3);
    const bar = row.querySelector('.track i'), val = row.querySelector('.v');
    const from = +row.dataset.from, to = +row.dataset.to;
    const t0 = performance.now(), mySeq = cardSeq;
    const step = now => {
      if (mySeq !== cardSeq) return res();
      const k = cardHurry ? 1 : Math.min(1, (now - t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      const v = from + (to - from) * e;
      bar.style.width = Math.max(0, Math.min(100, v)) + '%';
      val.textContent = Math.round(v);
      if (k >= 1) { snd('uiconfirm', 0.25); return setTimeout(res, cardHurry ? 0 : 140); }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

const STAT_ORDER = ['sanity', 'awareness', 'wisdom'];
const STAT_ROW = {
  sanity:    { cls: 'sSan', fill: 'fSan', icon: 'i-san' },
  awareness: { cls: 'sAwa', fill: 'fAwa', icon: 'i-awa' },
  wisdom:    { cls: 'sWis', fill: 'fWis', icon: 'i-wis' }
};
function statRowsHTML(before, d) {
  const cl = v => Math.max(0, Math.min(100, v));
  return STAT_ORDER.filter(k => d[k]).map(k => {
    const r = STAT_ROW[k], from = cl(before[k]), to = cl(before[k] + d[k]);
    return `<div class="srow ${r.cls}" data-from="${from.toFixed(0)}" data-to="${to.toFixed(0)}">`
      + `<svg class="sic" aria-hidden="true"><use href="#${r.icon}"/></svg>`
      + `<span class="n">${(T('hud.' + k) || k).toUpperCase()}</span>`
      + `<span class="chip ${d[k] >= 0 ? 'up' : 'dn'}">${d[k] >= 0 ? '+' : ''}${d[k]}</span>`
      + `<span class="v">${from.toFixed(0)}</span>`
      + `<span class="track"><i class="${r.fill}" style="width:${from.toFixed(0)}%"></i></span>`
      + `</div>`;
  }).join('');
}

async function runCardSequence(rows, teachEl, teachHTML, speech, btn) {
  const mySeq = ++cardSeq;
  cardHurry = false;
  btn.classList.add('waiting');
  for (const row of rows) {
    if (mySeq !== cardSeq) return;
    await animateStatRow(row);
  }
  if (mySeq !== cardSeq) return;
  teachEl.closest('.teachbox').classList.remove('veiled');
  await typeText(teachEl, teachHTML);
  await speech;                          // James finishes before the button
  if (mySeq !== cardSeq) return;
  btn.classList.remove('waiting');
  snd('uiclick', 0.4);
}
// a tap anywhere on a card fast-forwards what is still animating
for (const id of ['result', 'over']) {
  $(id)?.addEventListener('pointerdown', () => { cardHurry = true; });
}
addEventListener('keydown', e => {
  if ((state === 'result' || state === 'lost')
      && (e.code === 'Space' || e.code === 'Enter')) cardHurry = true;
});

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
    const before = { ...stats };           // the bars animate FROM these
    for (const k in c.d) stats[k] += c.d[k];
    syncBars();                            // the hidden HUD stays truthful
    ui.say.innerHTML = c.say;
    ui.teach.textContent = '';             // it will write itself
    ui.teach.closest('.teachbox').classList.add('veiled');
    ui.deltas.innerHTML = statRowsHTML(before, c.d);
    ui.hud.classList.add('hide');       // the card's bars ARE the bars now
    ui.result.classList.remove('hide');
    state = 'result';
    // the card rises: its swish, the ending's music bed, and the James line
    snd('uicard', 0.6);
    playBed(c.verdict === 'good' || c.verdict === 'best' ? 'endgood' : 'endbad', 0.5);
    duckMusic(15);
    const speech = speak('v' + c.k, { wait: 9000 });
    runCardSequence([...ui.deltas.querySelectorAll('.srow')],
                    ui.teach, c.teach, speech, $('nextBtn'));
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
const DRAIN_FAR = 0.75, DRAIN_NEAR = 3.2;     // sanity per second — v3.3: urgency
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

/* ------------------------------------------------------------- the faint --
   Sanity zero is not a screen, it is a collapse: the eyes roll up, the legs
   go, the ground arrives, and the world settles sideways — the last thing a
   person sees lying on the void deck floor. Only then, the card. Built as a
   cutscene (tracks + stings), so it is skippable and stall-proof like every
   other scene. `fainting` keeps the ECG flat from the first frame.        */
let fainting = false;
let loseSpeech = Promise.resolve(false);   // Retry waits for James to finish

function scFaint(c, s) {
  const { tr, step, sfx, fade, pitchTo } = A(c);
  const Y0 = s.yawPos.y ?? 1.62;
  step(0, () => { armR.visible = false; });          // his hands go with him

  // the whip: eyes roll skyward, hard and sudden — an impulse, not a pan
  pitchTo(0, 0.38, s.pitchX, 0.62, k => k * k);
  sfx(0.02, 'boom');
  // decaying shake on yaw and roll — the death-cam judder
  tr(0, 1.7, (k, t) => {
    const decay = Math.exp(-2.2 * t);
    yaw.rotation.y = s.yawRot + Math.sin(t * 31) * 0.05 * decay;
    camera.rotation.z = Math.sin(t * 23 + 1.7) * 0.10 * decay;
  }, rawK);

  // the fall — gravity accelerates, the floor stops it
  tr(0.45, 1.35, k => { yaw.position.y = Y0 - (Y0 - 0.42) * k * k; }, rawK);
  sfx(1.28, 'kick');
  pitchTo(0.9, 1.5, 0.62, -0.12);
  tr(1.35, 1.75, k => { yaw.position.y = 0.42 + Math.sin(Math.PI * k) * 0.06; }, rawK);

  // settle onto the side: the horizon goes vertical, cheek on the concrete
  tr(1.6, 3.1, k => { camera.rotation.z = 0.02 + 1.30 * k; });
  pitchTo(1.6, 3.1, -0.12, -0.05);
  tr(1.7, 3.2, k => { yaw.position.y = 0.48 - 0.13 * k; }, rawK);
  // the last slow drift of someone going under
  tr(3.1, 4.6, (k, t) => { camera.rotation.z = 1.32 + Math.sin(t * 1.4) * 0.02; }, rawK);

  // eyes close
  fade(3.6, 4.9, 0, 1);
  c.endFade = 1;
}

function lose() {
  if (state === 'lost' || fainting) return;
  fainting = true;
  stats.sanity = 0;
  syncBars();
  stopBed();
  loopVol('heart', 0);
  showHaunt(false);
  for (const el of [ui.decide, ui.result, ui.prompt, ui.interact, hint]) {
    el.classList.add('hide');
  }
  // the line goes down WITH him — cut anything mid-sentence first
  if (narSrc) { try { narSrc.stop(); } catch {} narSrc = null; }
  speak('vfaint');
  snd('dread', 0.6);
  playCineFn(scFaint, () => {
    fainting = false;
    state = 'lost';
    ui.hud.classList.add('hide');
    ui.panic.style.opacity = '1';
    snd('ulost', 0.8);
    ui.over.classList.remove('hide');
    loseSpeech = speak('vlost', { wait: 10000 });
    const teach = $('overTeach');
    teach.closest('.teachbox').classList.add('veiled');
    const teachHTML = T('lost.teaching', teach.innerHTML);
    runCardSequence([], teach, teachHTML, loseSpeech, $('retryBtn'));
    document.exitPointerLock?.();
  });
}

function finish() {
  const score = (Math.max(0, Math.min(100, stats.sanity)) * 0.3
    + Math.max(0, Math.min(100, stats.awareness)) * 0.3
    + Math.max(0, Math.min(100, stats.wisdom)) * 0.4);
  const r = score >= 90 ? 'S' : score >= 80 ? 'A+' : score >= 70 ? 'A'
    : score >= 55 ? 'B' : score >= 40 ? 'C' : 'D';
  ui.rank.textContent = r;
  ui.rank.classList.add('glow');           // the grade breathes light
  ui.core.innerHTML = CH.core;
  ui.complete.classList.remove('hide');
  ui.hud.classList.add('hide');
  state = 'complete';
  // the chapter is sealed: this is the one moment a run is worth writing
  // down. Nothing reads it back yet — see the note on saveCheckpoint.
  saveCheckpoint();
  snd('uirank', 0.7);

  // SEALED comes down as a stamp, a beat after the card lands
  const sealed = ui.complete.querySelector('.sealed');
  sealed.classList.remove('stampin');
  void sealed.offsetWidth;                 // restartable on every completion
  setTimeout(() => { sealed.classList.add('stampin'); snd('kick', 0.5); }, 420);

  // the score rolls up from zero, digits flipping to rest on the real number
  const target = Math.round(score);
  ui.pct.textContent = '0%';
  const t0 = performance.now(), mySeq = ++cardSeq;
  const roll = now => {
    if (mySeq !== cardSeq) return;
    const k = Math.min(1, (now - t0) / 1300);
    ui.pct.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + '%';
    if (k < 1) requestAnimationFrame(roll);
    else snd('uiconfirm', 0.35);
  };
  requestAnimationFrame(roll);
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
// the chapter takes its own equivalent snapshot inside build(), for the same
// reason and at the same moment — see stage.reset()

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
  fainting = false;
  cardSeq++;                       // orphan any card animation still running
  $('nextBtn')?.classList.remove('waiting');
  $('retryBtn')?.classList.remove('waiting');
  ui.rank.classList.remove('glow');
  gPhase = 'hidden'; gTimer = 0; gGlide = null;
  appearCount = 0; lastVariant = '';
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
  stage.reset();
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
    const reach = stage.pile.dist() < stage.pile.radius && stage.pile.inView();
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

  /* Four separate calls into the chapter rather than one, because the ghost
     and the audio mix are interleaved between them and that order is
     load-bearing: updatePile reads the state updateGhost may just have
     changed. Keeping the seams where the calls already were is what makes
     this refactor a no-op for how the game plays.                        */
  stage.updateNotes(dt, t);
  updateGhost(dt);
  stage.updatePile(t);
  updateAudioFrame(t);
  updatePulse(dt);
  stage.updateFire(t);

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
    stage.updateSlow(sdt, t);     // the chapter's own drifting particles
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
window.__enc = { yaw, stats, getState: () => state,
                 // a getter, not the array: rebuildStage() re-points BLOCKERS
                 // and a captured reference would quietly go stale
                 get blockers() { return BLOCKERS; },
                 handsRoot, armR, vmCam, vm, updateViewmodel,
                 updateNotes: (dt, t) => stage.updateNotes(dt, t),
                 get flying() { return stage.flying; },
                 ghost, updateGhost, ghostInView, getReveal: () => reveal,
                 ghostInfo: () => ({ phase: gPhase, variant: gVariant,
                                     appearances: appearCount }),
                 dismissDecision, ghostDrainRate, lose, setMuted, showCredits,
                 snd, say, loopVol, sting, updateAudioFrame, pulseSpike,
                 worldState, applyState,
                 saveCheckpoint, loadCheckpoint, clearCheckpoint,
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
                 // the pile, reached through the chapter that built it
                 interactPile: () => stage.pile.interact(),
                 get pile() { return stage.pile.group; },
                 pileDist: () => stage.pile.dist(),
                 pileInView: () => stage.pile.inView(),
                 pileScreen: () => stage.pile.screen(),
                 pointerHitsPile: (x, y) => stage.pile.hits(x, y),
                 get PILE_POS() { return stage.pile.pos; },
                 get INTERACT_R() { return stage.pile.radius; },
                 pileGlow: () => stage.pile.glow(), renderer,
                 get stage() { return stage; },
                 chapterWorld: () => stage.world,
                 rebuildStage,
                 pick, chapter: CH, restart,
                 ready: () => ({ hdb: stage.ready(), hands: handsReady,
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
