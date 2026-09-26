import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import LIGHT_SEEDS from './lightseeds.json';   // v15.1: the light counts each chapter's films and scenes reach (THE LIGHT COUNTS)
/* v14.14: every loader the engine hands out READS MESHOPT. Chad's amulets
   ship at full detail (every triangle of the scan, "ALL amulets must always
   show full quality"), which is only a sane download packed with meshopt —
   and chapter 3 parses its table amulet with the loader it is given. The
   decoder is a plain WebAssembly module (allowed by the strict CSP, v5.10)
   and is only ever touched by a file that declares EXT_meshopt_compression,
   so every other model parses exactly as before. */
/* v14.15: THE DECODE, OFF THE MAIN THREAD. The full-detail amulets and the
   soldier figure are 8-11 MB of meshopt each, and decoding them on the main
   thread is a stall of a few hundred milliseconds on a phone — a stutter, if
   it happens in play. On the hosted build two Web Workers do it instead,
   but ONLY once a self-test decode through them has come back right
   (meshoptWorkerTest, below): a worker is made from a blob: URL, which the
   single-file build's strict CSP forbids, and a worker that never answers
   would hang every model forever. Until the test passes, and whenever it
   fails, the decode runs on the main thread exactly as it always did. */
let meshoptWorkers = 'off';          // 'off' | 'testing' | 'ok' | 'failed'
const MeshoptSmart = {
  supported: true,
  ready: MeshoptDecoder.ready,
  decodeGltfBufferAsync(count, size, source, mode, filter) {
    if (meshoptWorkers === 'ok') return MeshoptDecoder.decodeGltfBufferAsync(count, size, source, mode, filter);
    return MeshoptDecoder.ready.then(() => {
      const t = new Uint8Array(count * size);
      MeshoptDecoder.decodeGltfBuffer(t, count, size, source, mode, filter);
      return t;
    });
  }
};
function meshoptWorkerTest() {
  if (typeof Worker !== 'function' || meshoptWorkers !== 'off') return;
  meshoptWorkers = 'testing';
  /* sixteen 4-byte vertices, byte i = (i * 37 + 11) & 255, packed by the
     meshoptimizer encoder offline: the answer is known exactly */
  const ENC = new Uint8Array([160,3,0,215,215,215,215,215,215,215,215,215,215,215,215,215,215,215,3,0,215,215,215,215,215,215,215,215,215,215,215,215,215,215,215,3,0,215,215,215,215,215,215,215,215,215,215,215,215,215,215,215,3,0,215,215,215,215,215,215,215,215,215,215,215,215,215,215,215,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,48,85,122]);
  try {
    MeshoptDecoder.useWorkers(2);
    /* no deadline that turns a slow YES into a no: until the answer comes
       back the main thread decodes (the state is not 'ok'), and a right
       answer however late switches the workers on; a wrong one, or an
       error, switches them off for good */
    MeshoptDecoder.decodeGltfBufferAsync(16, 4, ENC, 'ATTRIBUTES', 'NONE').then(out => {
      const good = out && out.length === 64 && out.every((v, i) => v === ((i * 37 + 11) & 255));
      meshoptWorkers = good ? 'ok' : 'failed';
      if (!good) { try { MeshoptDecoder.useWorkers(0); } catch {} }
    }, () => { meshoptWorkers = 'failed'; try { MeshoptDecoder.useWorkers(0); } catch {} });
  } catch { meshoptWorkers = 'failed'; }
}
class GLTFLoaderMO extends GLTFLoader {
  constructor(m) { super(m); this.setMeshoptDecoder(MeshoptSmart); }
  /* v14.15: every parse is TRACKED (see THE LOAD TRACKER below): the world
     is not shown while one is in flight, and a probe can read what landed
     when. The chapter's own onLoad runs first — it is what puts the model in
     the world — and the load counts as landed only once it has returned. */
  parse(data, path, onLoad, onError) {
    const r = loadBegin(_bufKey.get(data) || '?', 'parse');
    const t0 = performance.now();
    const done = (fn, arg, isError) => {
      const c0 = performance.now();
      /* v14.16: A LOADER THAT FAILS IS NEVER SILENT (the v12.2 law, which
         until now depended on fifteen hand-written catch sites, most of them
         `() => {}`). A parse failure, or a chapter's own onLoad throwing
         half-way through placing its model, is written into the load's
         record and onto the console — and the throw goes on exactly as it
         did, so nothing downstream behaves differently. walktest reads the
         records of every chapter it walks and fails on any. */
      if (isError) { r.err = String((arg && arg.message) || arg); console.error('[load] ' + r.key + ' failed:', arg); }
      try {
        if (fn) fn(arg);
        /* v14.16: a caller that gave no onError got, from three itself, an
           UNHANDLED rejection — which is what a harness's pageerror
           listener catches (walktest, since v14.0). Wrapping the callbacks
           must not make that silent, so it is raised the same way here. */
        else if (isError) Promise.reject(arg);
      } catch (e) {
        if (!isError) { r.err = String((e && e.message) || e); console.error('[load] ' + r.key + ' callback threw:', e); }
        throw e;
      } finally { r.cbMs = Math.round(performance.now() - c0); loadEnd(r); }
    };
    try {
      return super.parse(data, path, g => done(onLoad, g), e => done(onError, e, true));
    } catch (e) {
      /* v14.16: three's parse can throw SYNCHRONOUSLY (a GLB whose JSON
         chunk does not parse is not inside its try) and then calls neither
         callback — the record must end here or loadPending never returns
         to 0 and every later curtain waits its whole cap */
      loadEnd(r);
      throw e;
    } finally { r.syncMs = Math.round(performance.now() - t0); }
  }
}
/* ── v14.15: THE LOAD TRACKER ────────────────────────────────────────────
   Chad: "make sure the entire game has very smart loading so there is no
   sudden stutters or delays before showing full res models." What that asks
   for is measurable: every file the world is made of — fetched through
   assetBytes, parsed through GLTFLoaderMO — is a LOAD, in flight until it
   has landed in the world. `loadPending` is how many are in flight; the
   curtain (whenWorldReady) lifts only at zero. `revealAt` is the moment the
   world was last uncovered; a load that lands after it was a POP-IN, and
   `late` says so. Sound packs are not tracked: the film waits for its own
   sounds (v5.13) and a sound is not a model. `__enc.loads()` reads it. */
const loadLog = [];
let loadPending = 0, revealAt = 0, loadSeq = 0;   // loadSeq only ever grows: how many loads have ever begun
const _bufKey = new WeakMap();                  // an asset's bytes -> its key
function loadBegin(key, kind) {
  loadPending++; loadSeq++;
  const r = { key, kind, t0: performance.now(), t1: 0, late: false };
  loadLog.push(r); if (loadLog.length > 600) loadLog.shift();
  return r;
}
function loadEnd(r) {
  if (r.t1) return;
  loadPending = Math.max(0, loadPending - 1);
  r.t1 = performance.now();
  r.late = revealAt > 0 && r.t1 > revealAt;
}

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
const chapterExists = k => typeof k === 'string' && hasOwn(window.__CHAPTERS__, k);

/* Which chapter is playing. `let`, not `const`, since v3.6: resuming a save
   can land in a chapter other than the one the URL booted, and finishing a
   chapter advances to the next — both go through setChapter() below.      */
const CH_ASKED = (() => {
  const want = new URLSearchParams(location.search).get('ch');
  // own keys ONLY: a plain object inherits 'constructor', 'toString',
  // '__proto__'... and a truthiness lookup would accept every one of
  // them, making ?ch=constructor a dead boot instead of a fallback
  return chapterExists(want) ? want : null;
})();
let CH_KEY = CH_ASKED || 'ch1';
let CH = (window.__CHAPTERS__ || {})[CH_KEY];
if (!CH) throw new Error('no chapter registered — chapters/ch1.js must load before the engine');
const BOOT_CH = CH_KEY;      // where New game goes back to, whatever a save said

/* The order chapters are played in, taken from their own `episode` and
   `id`. A chapter does not need to know what comes after it — the registry
   does. The fixture chapter carries id 99 so it sorts last and is never
   "next".
   EPISODES (v6.0). Ten case files, five chapters each; what exists is
   episode 1. A chapter declares `episode` (one when it says nothing, so
   chapters 1-5 stay exactly where they were) and its `id` is its place
   INSIDE that episode; the order of play is episode-major. The engine
   holds the SHAPE — ten tabs exist before their chapters do — and the
   words (ep1.label, ep1.title ...) are the string sheet's, so Chad's.
   docs/EPISODES-PLAN.md is the reasoning and the decisions still open.  */
const EPISODE_COUNT = 10, CHAPTERS_PER_EPISODE = 5;
function episodeOf(key) {
  const ch = window.__CHAPTERS__ && window.__CHAPTERS__[key];
  const n = ch ? Number(ch.episode) : NaN;
  return Number.isInteger(n) && n >= 1 ? n : 1;
}
const chapterOrder = () => Object.keys(window.__CHAPTERS__ || {})
  .sort((a, b) => (episodeOf(a) - episodeOf(b))
    || ((window.__CHAPTERS__[a].id || 0) - (window.__CHAPTERS__[b].id || 0)));
function nextChapterKey(after = CH_KEY) {
  const order = chapterOrder().filter(k => (window.__CHAPTERS__[k].id || 0) < 90);
  const i = order.indexOf(after);
  return (i >= 0 && i + 1 < order.length) ? order[i + 1] : null;
}
/* the built chapters of one episode, in order — never the fixture */
const episodeKeys = n => chapterOrder()
  .filter(k => (window.__CHAPTERS__[k].id || 0) < 90 && episodeOf(k) === n);
/* "Episode 1 · Chapter 3" — the resume note and the selector's ask */
function chapterLabel(key) {
  const ch = window.__CHAPTERS__[key];
  return T(`ep${episodeOf(key)}.label`, '') + ' · ' + ((ch && ch.cardLabel) || key);
}

/* ------------------------------------------------------------- assets ----
   One seam for every heavy file. The hosted build carries a map of real,
   fingerprinted URLs and fetches on demand (the browser then caches each
   file for a year — the name changes when the content does). The embedded
   single-file build carries the bytes inline instead, and the map is empty.
   Every loader downstream asks assetBytes() and neither knows nor cares
   which build it is in.                                                    */
const ASSET_MAP = JSON.parse(atob('__ASSET_MAP_B64__'));
const HOSTED = Object.keys(ASSET_MAP).length > 0;
/* v14.15: tested once the page has settled — at module time the main thread
   is busy starting the game and the answer cannot be read in time — and the
   single-file build keeps the main-thread decode */
if (HOSTED) {
  const t = () => meshoptWorkerTest();
  if (window.requestIdleCallback) requestIdleCallback(t, { timeout: 5000 }); else setTimeout(t, 1500);
}
const EMBED = {
  hands: '__HANDS_B64__', ghost: '__GHOST_B64__', hdb: '__HDB_B64__',
  logo: '__LOGO_B64__', music: '__MUSIC_B64__', voice: '__VOICE_B64__',
  amulet: '__AMULET_B64__', audiopack: '__AUDIOPACK_B64__',
  hellnote: '__HELLNOTE_B64__',
  mother: '__MOTHER_B64__', seat: '__SEAT_B64__', cars: '__CARS_B64__',
  guangong: '__GUANGONG_B64__', encik: '__ENCIK_B64__',
  tangki: '__TANGKI_B64__', tangkianim: '__TANGKIANIM_B64__',
  boy: '__BOY_B64__', shrine: '__SHRINE_B64__',
  motheranim: '__MOTHERANIM_B64__',
  sitclap: '__SITCLAP_B64__', sitangry: '__SITANGRY_B64__',
  standman: '__STANDMAN_B64__',
  tree1: '__TREE1_B64__', tree2: '__TREE2_B64__',        // v6.15: Chad's trees, the four kinds
  tree3: '__TREE3_B64__', tree4: '__TREE4_B64__',
  young: '__YOUNG_B64__', teddy: '__TEDDY_B64__', leaf: '__LEAF_B64__', note5: '__NOTE5_B64__',   // v6.4: the prologue
  granny: '__GRANNY_B64__', sofa: '__SOFA_B64__',
  /* v5.29 — the three new seated kinds, the scolding granny at the brazier,
     and young Master Zav for the equipment panel */
  sitman: '__SITMAN_B64__', sitwoman: '__SITWOMAN_B64__',
  sitshout: '__SITSHOUT_B64__', scold: '__SCOLD_B64__',
  zavyoung: '__ZAVYOUNG_B64__',
  bed: '__BED_B64__', wardrobe: '__WARDROBE_B64__',
  table: '__TABLE_B64__', chair: '__CHAIR_B64__', curtain: '__CURTAIN_B64__',
  altar: '__ALTAR_B64__', zav: '__ZAV_B64__',
  /* v14.7: Chad's LP Phiboon amulet (the model and its icon) — episode 1's,
     so the single-file build carries them. Not `amulet`, which is the parked
     chapter-1 cased amulet above. */
  phiboon: '__PHIBOON_B64__', iconamulet: '__ICONAMULET_B64__', phiboonhd: '__PHIBOONHD_B64__',   // v14.14: the full-detail Phiboon
  timkp: '__TIMKP_B64__', icontimkp: '__ICONTIMKP_B64__'   // v14.13
};

function b64ToBuffer(b64) {
  const bin = atob(b64), buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

const _assetCache = {};
/* v14.16: which cached entries have RESOLVED (so may be released once the
   world is built — assetsRelease), and every name fetched this session (so
   the download-ahead never fetches a file twice) */
const _assetDone = new Set(), _assetSeen = new Set();
const isAudioAsset = name => /\.(mp3|ogg|opus|wav|m4a|aac)$/i.test((HOSTED && ASSET_MAP[name]) || '');
/* ── v14.16: RELEASE WHAT IS BUILT ────────────────────────────────────────
   Every file assetBytes fetched stayed in _assetCache for the whole session.
   GLTFLoader COPIES what it keeps (loadBufferView slices, meshopt decodes
   into new buffers, images go through a Blob), so once a chapter's world is
   built its files are dead weight — measured, the heap after visiting ch3,
   ch4, e2c1 and e2c3 and coming back to ch2 was 173 MB against a fresh
   ch2's ~80, and the difference was those chapters' files. At the moment
   the curtain lifts (nothing in flight) every resolved entry is dropped from
   the cache; the bytes go when nothing else holds them. A later request —
   a replay, a chapter entered again — fetches from the browser's HTTP cache
   (every asset is immutable for a year) or re-decodes the inline base64, and
   it happens behind the next curtain. A sound pack's bytes go too: once
   parsed into packJson they are a duplicate, and packLoad keeps its own
   promise, so nothing asks assetBytes for a pack twice. */
function assetsRelease() {
  for (const n of _assetDone) delete _assetCache[n];
  _assetDone.clear();
}
/* The URL of an asset, for the one thing that must NOT come through
   assetBytes: a <video>. Bytes would have to reach it as a blob: or data:
   URL, and the strict CSP that shaped every other loader forbids both — so
   the video takes a real same-origin URL instead, which `default-src 'self'`
   allows and which lets the browser stream it rather than holding a
   megabyte in memory.

   Null in the embedded build, which carries no URLs. That is deliberate:
   the title video is decoration, and the single-file build is the offline
   fallback, so it simply goes without and the title screen looks exactly
   as it did before there was a video at all.                            */
function assetUrl(name) {
  return HOSTED ? (ASSET_MAP[name] || null) : null;
}

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
  _assetSeen.add(name);                            // v14.16: it is on disk now (DOWNLOAD AHEAD skips it)
  p.then(() => { if (_assetCache[name] === p) _assetDone.add(name); }, () => {});
  /* v14.15: tracked (THE LOAD TRACKER) — v14.16: but never a SOUND. The
     explore music (3.8 MB) and a chapter's voice line were counted as world
     loads, so a curtain waited for a song to download; the film already
     waits for its own sounds (v5.13), and a sound is not a model. */
  if (!/pack/.test(name) && !isAudioAsset(name)) {
    const r = loadBegin(name, 'fetch');
    p.then(buf => { _bufKey.set(buf, name); r.bytes = buf.byteLength; loadEnd(r); },
           e => { r.err = String((e && e.message) || e); console.warn('[load] ' + name + ':', r.err); loadEnd(r); });
  }
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
/* v6.6: make a field PERIODIC, so a texture that repeats across a ground
   has no seam. The field is cross-blended with itself shifted by half a
   tile in x, in y and in both, with weights that fall to zero at the
   edges — the standard seamless trick — so the left edge meets the right
   and the top meets the bottom exactly. Chapter 1's grass repeats 46 times
   across 220 m and read as a grid of 4.8 m squares (Chad); this is why. */
function tileField(f, s) {
  const out = new Float32Array(s * s), h = s >> 1;
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const wx = 1 - Math.abs(x - h) / h, wy = 1 - Math.abs(y - h) / h;   // 1 at the centre, 0 at the edges
    const x2 = (x + h) % s, y2 = (y + h) % s;
    const a = f[y * s + x] * wx * wy, b = f[y * s + x2] * (1 - wx) * wy,
          c = f[y2 * s + x] * wx * (1 - wy), d = f[y2 * s + x2] * (1 - wx) * (1 - wy);
    out[y * s + x] = a + b + c + d;
  }
  return out;
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
  const f = tileField(fbmField(S, 5), S);                 // v6.6: seamless — no 4.8 m squares
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

function rescueTextures(gltf, buf, onMap) {   // onMap(material): optional, called once a rescued map lands (v5.11)
  /* v15: LOOK BEFORE COPYING. This ran glbChunks FIRST — a full copy of the
     model's binary chunk and a second JSON.parse — and only then found, on
     the hosted build, that every material already had its map: pure waste
     after every model load (29 MB of copying at chapter 3's entry, 10 MB for
     the amulet alone). So: is there a material that should have a colour map
     and does not? If not, touch no bytes. If so (the strict-CSP build), use
     the JSON and the binary chunk the loader ALREADY holds, and fall back to
     cutting them out of the file only when a loader does not expose them. */
  const parser = gltf && gltf.parser;
  let json = parser && parser.json, bin = null;
  if (json && json.materials && parser.associations) {
    let need = false;
    for (const [obj, assoc] of parser.associations) {
      if (!obj || !obj.isMaterial || assoc.materials === undefined || obj.map) continue;
      const md = json.materials[assoc.materials];
      if (md && md.pbrMetallicRoughness && md.pbrMetallicRoughness.baseColorTexture) { need = true; break; }
    }
    if (!need) return;
    const ext = parser.extensions && parser.extensions.KHR_binary_glTF;
    bin = ext && ext.body instanceof ArrayBuffer ? ext.body : null;
  }
  if (!json || !bin) { try { ({ json, bin } = glbChunks(buf)); } catch { return; } }
  if (!json || !bin || !json.images || !json.images.length) return;

  /* one decode AND ONE TEXTURE per image's bytes, not per material and not
     per image entry — v15: a file may list the same bytes under many image
     entries (hdb.glb names ONE buffer view fourteen times), and a Texture per
     material made each its own GPU copy of identical texels. three's own
     loader keys the same way (by buffer view); every rescued texture has the
     same settings, so sharing one changes nothing drawn. */
  const cache = new Map();
  const texture = (i) => {
    const img = json.images[i], key = img.bufferView;
    if (!cache.has(key)) {
      const bv = json.bufferViews[img.bufferView];
      const bytes = new Uint8Array(bin, bv.byteOffset || 0, bv.byteLength);
      cache.set(key, createImageBitmap(new Blob([bytes], { type: img.mimeType || 'image/jpeg' })).then((bmp) => {
        const t = new THREE.Texture(bmp);
        t.flipY = false;                       // glTF images are already top-left
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.needsUpdate = true;
        return t;
      }));
    }
    return cache.get(key);
  };

  for (const [obj, assoc] of gltf.parser.associations) {
    if (!obj || !obj.isMaterial || assoc.materials === undefined) continue;
    if (obj.map) continue;                     // the normal path worked; leave it alone
    const md = json.materials[assoc.materials];
    const ref = md && md.pbrMetallicRoughness && md.pbrMetallicRoughness.baseColorTexture;
    if (!ref) continue;
    const src = json.textures[ref.index] && json.textures[ref.index].source;
    if (src === undefined) continue;
    texture(src).then((t) => {
      obj.map = t;
      obj.needsUpdate = true;
      if (onMap) onMap(obj);
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
/* v15: WHEN THE GRAPHICS COME BACK. iOS drops a page's WebGL context under
   memory pressure — an app switch, a long lock — and three restores it by
   uploading again everything it still holds on the CPU. Which is everything
   but a RENDER TARGET: the room environment every material reflects (drawn
   by a PMREM pass) and the shadow maps (drawn on demand, v2.x) exist on the
   GPU and nowhere else, so a restored game came back with black reflections
   and shadows sampled from an empty map. Both are drawn again the moment the
   context is back. Nothing here runs unless that failure happens, and each
   renderer's own listener (three's) has already rebuilt its state first. */
function roomEnvAgain(r, sc) {
  const pm = new THREE.PMREMGenerator(r), old = sc.environment;
  sc.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  if (old && old !== sc.environment) old.dispose();
  return sc.environment;
}
canvas.addEventListener('webglcontextrestored', () => {
  if (!OPT.ctxRestore) return;
  try { vmScene.environment = roomEnvAgain(renderer, scene); } catch { /* the lamps alone */ }
  redoShadows();
}, false);
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

/* The dome is repaintable, because since v4.1 the sky is not always night:
   a chapter may declare its own (see applyDaylight below), and the cheapest
   honest way to change a gradient is to redraw the same 64px canvas. */
const [skyCanvas, skyCtx] = cnv(64);
const skyTex = new THREE.CanvasTexture(skyCanvas);
skyTex.colorSpace = THREE.SRGBColorSpace;
function paintSky(stops) {
  const grad = skyCtx.createLinearGradient(0, 64, 0, 0);   // horizon -> zenith
  for (const [at, col] of stops) grad.addColorStop(at, col);
  skyCtx.fillStyle = grad; skyCtx.fillRect(0, 0, 64, 64);
  skyTex.needsUpdate = true;
}
{
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
const dimStars = starLayer(DIM_N, 1.6, 0.20, 0.55);
const brightStars = starLayer(BRIGHT_N, 3.2, 0.60, 1.0);

// twinkle, on the bright layer only — the dim ones would just look noisy
const starBase = brightStars.geometry.attributes.color.array.slice();
const starPhase = new Float32Array(BRIGHT_N);
for (let i = 0; i < BRIGHT_N; i++) starPhase[i] = Math.random() * 100;
function updateStars(t) {
  if (skyStars <= 0.01) return;          // a morning has nothing to twinkle
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
let moonHalo = null, moonDisc = null;
{
  const halo = moonHalo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeSoftDot('rgba(196,218,255,0.34)', 'rgba(150,182,255,0)'),
    transparent: true, depthWrite: false, fog: false,
    blending: THREE.AdditiveBlending
  }));
  halo.position.copy(MOON_POS);
  halo.scale.setScalar(40);
  halo.renderOrder = -2;
  sky.add(halo);

  const disc = moonDisc = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeMoon(), transparent: true, depthWrite: false, fog: false
  }));
  disc.position.copy(MOON_POS);
  disc.scale.setScalar(14);
  disc.renderOrder = -1;
  sky.add(disc);
}

// --- the sun, for chapters that declare one. The same halo-and-disc trick
// as the moon, but soft-on-soft: at ten in the morning in the tropics the
// sun is GLARE, not a coin — a hard-edged disc read as a sticker. It sits
// along the chapter's own key-light direction, set in applyDaylight(), so
// the light and the thing that claims to cast it can never disagree.
let sunHalo = null, sunDisc = null;
{
  const halo = sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeSoftDot('rgba(255,244,214,0.50)', 'rgba(255,236,190,0)'),
    transparent: true, opacity: 0, depthWrite: false, fog: false,
    blending: THREE.AdditiveBlending
  }));
  halo.scale.setScalar(58);
  halo.renderOrder = -2;
  halo.visible = false;
  sky.add(halo);

  const disc = sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeSoftDot('rgba(255,252,240,1)', 'rgba(255,244,208,0)'),
    transparent: true, opacity: 0, depthWrite: false, fog: false,
    blending: THREE.AdditiveBlending
  }));
  disc.scale.setScalar(16);
  disc.renderOrder = -1;
  disc.visible = false;
  sky.add(disc);
}

// --- clouds: seven soft canvas blobs on the upper dome, opacity declared by
// the chapter (0 for the night chapters, so nothing about them moves). The
// whole group yaws imperceptibly slowly — parked clouds read as a skybox.
function makeCloud(seed) {
  const w = 256, h = 128;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 11; i++) {
    const bx = w * (0.18 + rnd() * 0.64), by = h * (0.34 + rnd() * 0.26);
    const br = 14 + rnd() * 30;
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    g.addColorStop(0, 'rgba(255,255,255,0.32)');
    g.addColorStop(0.7, 'rgba(252,252,250,0.14)');
    g.addColorStop(1, 'rgba(250,250,250,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  return new THREE.CanvasTexture(c);
}
const cloudGroup = new THREE.Group();
cloudGroup.visible = false;
sky.add(cloudGroup);
let skyClouds = 0;                         // read by the frame, for the drift
{
  const R = 118;
  const SPOTS = [                          // azimuth, elevation, width, squash
    [0.35, 0.62, 62, 0.34], [1.45, 0.80, 46, 0.30], [2.60, 0.55, 70, 0.36],
    [3.55, 0.72, 52, 0.30], [4.40, 0.50, 66, 0.38], [5.30, 0.84, 44, 0.28],
    [5.95, 0.60, 58, 0.32]
  ];
  SPOTS.forEach(([az, el, w, sq], i) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeCloud(7 + i * 13), transparent: true, opacity: 0,
      depthWrite: false, fog: false
    }));
    sp.position.set(Math.cos(az) * Math.cos(el) * R,
                    Math.sin(el) * R,
                    Math.sin(az) * Math.cos(el) * R);
    sp.scale.set(w, w * sq, 1);
    sp.renderOrder = -3;
    sp.userData.base = 0.75 + (i % 3) * 0.08;   // some thicker than others
    cloudGroup.add(sp);
  });
}

/* v6.12: the world's lens, named because a cutscene may borrow it (`lens`
   below) and cineEnd() must know what to give back. 72° is WIDE and the near
   plane is 8 cm: a macro shot cannot be taken by pushing this lens in, it
   puts the subject through the near plane (ch1's leaf was sliced away). */
const CAM_FOV = 72;
const camera = new THREE.PerspectiveCamera(CAM_FOV, innerWidth / innerHeight, 0.08, 160);
const yaw = new THREE.Object3D();      // horizontal rotation
const pitch = new THREE.Object3D();    // vertical rotation
yaw.add(pitch); pitch.add(camera);
yaw.position.set(CH.spawn.x, CH.spawn.y, CH.spawn.z);   // the chapter decides
yaw.rotation.y = Number.isFinite(CH.spawn.rot) ? CH.spawn.rot : 0;   // v7.5: and which way it faces (SPAWN clones this below)

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

/* ------------------------------------------------- THE TENTH LEAK: THE SKY

   Every value above is chapter 1's midnight, and until v4.1 that was the
   game's only weather. Chapter 3 is a seventh-month ceremony in a car park
   and those happen in the MORNING, so the sky, the fog, the three lights,
   the stars and the moon all belong to the chapter now — declared, with
   chapter 1's night as the default, which is how the other nine were fixed
   and why chapters 1 and 2 do not move.

   MUTATED, never reassigned, like every other chapter-derived value: the
   dome's canvas is repainted, the fog and the lights keep their identity.
   scene.fog is one FogExp2 for the life of the page and several things hold
   a reference to it.                                                      */
const SKY_NIGHT = {
  stops: [[0.00, '#241d1c'], [0.16, '#1a1a24'], [0.42, '#101526'],
          [0.72, '#080b16'], [1.00, '#04060b']],
  bg: 0x070a10,
  fog: [0x0b1018, 0.021],
  hemi: [0x35446b, 0x14161c, 0.85],
  key: [0xa8bfe6, 0.95, -14, 20, -8],     // colour, intensity, and where from
  fill: [0x6a86b8, 0.28],
  stars: 1, moon: 1,                       // opacity, so a dawn can keep a ghost of one
  sun: 0, clouds: 0,                       // the night chapters have neither
  /* the VIEWMODEL's own rig, which was hard-coded to these midnight values
     for eight releases — which is why the hands read near-black the moment a
     chapter declared a bright sky around them. A chapter that changes the
     world's light now changes the light on the hands in the same breath. */
  vmHemi: [0x38486e, 0x0e1014, 0.55],
  vmKey: [0x93aad4, 0.50]
};
/* What the viewmodel rig returns to whenever nothing dramatic is happening.
   updateViewmodel() re-asserts intensity EVERY FRAME (that is how the burner
   warmth breathes), so a one-time set inside applyDaylight would be undone
   within sixteen milliseconds — the frame reads these instead. */
const VM_REST = { hemi: 0.55, key: 0.50 };
let vmLightsLive = false;                  // they are built later in the file
let skyStars = 1;                          // read by the frame, to skip the twinkle
function applyDaylightD(d, quiet) {          // v7.0: the body, so the kit can tween it in play
  paintSky(d.stops);
  scene.background.setHex(d.bg);
  scene.fog.color.setHex(d.fog[0]);
  scene.fog.density = d.fog[1];
  hemi.color.setHex(d.hemi[0]);
  hemi.groundColor.setHex(d.hemi[1]);
  hemi.intensity = d.hemi[2];
  moon.color.setHex(d.key[0]);
  moon.intensity = d.key[1];
  moon.position.set(d.key[2], d.key[3], d.key[4]);
  fill.color.setHex(d.fill[0]);
  fill.intensity = d.fill[1];
  skyStars = d.stars;
  dimStars.material.opacity = d.stars;
  brightStars.material.opacity = d.stars;
  dimStars.visible = brightStars.visible = d.stars > 0.01;
  if (moonHalo) { moonHalo.material.opacity = d.moon; moonHalo.visible = d.moon > 0.01; }
  if (moonDisc) { moonDisc.material.opacity = d.moon; moonDisc.visible = d.moon > 0.01; }
  // the sun rides the chapter's own key-light direction, so light and lamp agree
  if (sunHalo) {
    const sd = new THREE.Vector3(d.key[2], d.key[3], d.key[4]).normalize().multiplyScalar(126);
    sunHalo.position.copy(sd); sunDisc.position.copy(sd);
    sunHalo.material.opacity = 0.9 * d.sun; sunHalo.visible = d.sun > 0.01;
    sunDisc.material.opacity = d.sun;       sunDisc.visible = d.sun > 0.01;
  }
  skyClouds = d.clouds;
  cloudGroup.visible = d.clouds > 0.01;
  for (const sp of cloudGroup.children) sp.material.opacity = sp.userData.base * d.clouds;
  VM_REST.hemi = d.vmHemi[2];
  VM_REST.key = d.vmKey[1];
  if (vmLightsLive) {
    vmHemi.color.setHex(d.vmHemi[0]);
    vmHemi.groundColor.setHex(d.vmHemi[1]);
    vmHemi.intensity = VM_REST.hemi;
    vmKey.color.setHex(d.vmKey[0]);
    vmKey.intensity = VM_REST.key;
  }
  if (!quiet) redoShadows();
}
// applyDaylight(over) itself is defined in the play kit below (v7.0) — a
// function declaration, so calling it here is fine
applyDaylight();          // whichever chapter booted — ch1's night is the default

/* ------------------------------------------------------ the chapter's world
   The void deck, the burner, the drifting notes and the pile you act on used
   to be built inline right here. None of it is the game's — it is chapter
   1's — so it lives in the chapter now and reaches the engine through the
   handle build() hands back. CHCTX is the other half of that seam: the
   engine's own kit, passed in, so a chapter file never has to import
   anything (it cannot; it is a plain script on purpose).                   */
/* An image asset as a three.js texture, decoded the one way the strict
   policy allows: createImageBitmap takes the Blob itself, so no data: and no
   blob: URL is ever made — the same path the logo already uses.

   Resolves to NULL rather than throwing when the bytes never arrive, because
   every caller has a drawn placeholder to fall back on. Art that fails to
   download must cost the player nothing but the art.                      */
function loadImageTexture(name, mime = 'image/webp') {
  return assetBytes(name, true)
    .then(bytes => createImageBitmap(new Blob([bytes], { type: mime })))
    .then(bmp => {
      const tex = new THREE.Texture(bmp);
      tex.colorSpace = THREE.SRGBColorSpace;
      // hundreds of these end up small and at a glancing angle; without
      // anisotropy the far ones crawl
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
      return tex;
    })
    .catch(() => null);
}

/* ------------------------------------------------------------- THE TREES
   v6.15. Chad supplied three tree models and asked for a mixture of them
   "anywhere that has a tree in the game" — the void deck, both of chapter
   1's memory places, and chapter 3's car park. There are FOUR kinds: the
   low-poly file carries two trees (`tree4` and `tree6`), and tools/preptree.mjs
   splits them.

   The kit is the engine's, not a chapter's, for the same reason the ghost
   is: every chapter plants from the same four. It is parsed ONCE per
   session and shared — which is also what keeps leaktest honest, since a
   cached kind uploads its geometry on the cycle it arrives and never
   again.

   Every kind is baked to one contract by the prep tool: Y-up, its trunk on
   the origin, its base on y = 0 and exactly ONE METRE tall. So a chapter
   plants a tree by saying where it stands and how tall it is, and the four
   are interchangeable at every spot.

   Each kind is drawn with an InstancedMesh per part (bark, leaves), so a
   dozen trees cost two draw calls, not two dozen. The instance matrix
   carries the part's own transform rather than the geometry being rebaked:
   a quantized attribute is an integer array, and applying a matrix to one
   corrupts it (the trap the prep tool's baking exists to avoid).         */
const TREE_KINDS = ['tree1', 'tree2', 'tree3', 'tree4'];
const TREE_LEAF_RE = /leaf|leaves|crown|branch|foliage/i;
let treeKitP = null;
function treeKit() {
  if (treeKitP) return treeKitP;
  treeKitP = Promise.all(TREE_KINDS.map(key =>
    assetBytes(key, true)
      .then(BUF => new Promise(res => {
        new GLTFLoaderMO().parse(BUF, '', (gltf) => {
          rescueTextures(gltf, BUF);
          const parts = [];
          gltf.scene.updateMatrixWorld(true);
          gltf.scene.traverse(o => {
            if (!o.isMesh) return;
            /* FOLIAGE is recognised by the material's own cut-out, not only
               by its name (v6.16): a leaf sheet ships as MASK with a cutoff,
               which GLTFLoader turns into alphaTest, and that survives a
               model whose materials are unnamed. The name test stays as the
               fallback for a file with no alpha at all. */
            const mt = o.material;
            parts.push({ geo: o.geometry, mat: mt, m: o.matrixWorld.clone(),
                         leaf: (mt && (mt.alphaTest > 0 || mt.transparent))
                               || TREE_LEAF_RE.test((mt && mt.name) || o.name || '') });
          });
          res(parts.length ? parts : null);
        }, () => res(null));
      }))
      .catch(() => null)));
  return treeKitP;
}
/* A chapter plants a stand of trees: the group comes back EMPTY and fills
   itself when the bytes land, so a chapter never waits on a skyline. Spots
   are { x, z, h } (h in metres, the tree's own height) and everything else
   — which of the four, how far it is turned, how far it leans, a little
   height either way — is dealt from `seed`, so the same stand comes out the
   same way every run and a render is comparable with yesterday's.

   `tint` multiplies the model's own colour (a night void deck and a car
   park at ten in the morning want very different trees out of one asset),
   `fog` false takes a stand out of the world's fog, which is what chapter
   1's memory bubbles need.

   `lowKeep` is the phone's share of the stand (v6.17, when Chad asked for
   more trees everywhere): a fraction of the spots, chosen by the same
   deterministic stream so the thinned forest is still the same forest, not
   a different one. Instancing means the extra trees cost draw calls
   nothing, but they are real triangles, and a phone should not pay for the
   back row it can barely see.                                             */
/* v15: INSTANCE CULLING. A stand of trees is one InstancedMesh per (kind,
   part), and three.js culls an InstancedMesh as a WHOLE — one sphere round
   every instance (v8.6). A stand that surrounds the player is therefore
   always "in view", and every tree in it was drawn on every frame, the ones
   behind the camera included: measured in episode 2 chapter 3's harbour,
   1.09 million of the 1.1 million triangles a frame were trees, the same in
   all four directions. So each registered mesh keeps its FULL instance list,
   and before the world is drawn the instances whose own bounding sphere is
   inside the camera's frustum are packed to the front — in their ORIGINAL
   order, so the draw order of what is drawn is unchanged — and only those
   are drawn. An instance outside the frustum produces no fragment, so the
   picture is the same pixel for pixel; only the vertex work goes.
   SHADOWS are drawn from the full list: the shadow map is on demand
   (shadowDirty), and on a frame that redraws it every instance is restored,
   because a tree behind the camera can still cast a shadow into view. The
   sphere is the geometry's own (it bounds every vertex; no tree moves in its
   shader) under the instance's matrix, with a small margin for float error.
   The test is done in the MESH's local space (the frustum is carried into
   it), so an instance is tested without being transformed. */
/* v15: every engine optimization has a switch, ON by default, so a probe can
   draw the SAME frozen frame with it off and on and compare every pixel —
   the proof that an optimization changed nothing on screen. */
const OPT = { instCull: true, sphereCull: true, shadowTrim: true, coverSkip: true, vmSkip: true, letterbox: true, lightWarm: true, matSkip: true, boneSkip: true, warmTiny: true, lightSets: true, ctxRestore: true, herSounds: true, musicPark: true, lightMem: true, lightSeeds: true };
/* a probe may switch any of them off from the address (`?opt=boneSkip:0,warmTiny:0`),
   so a switch that acts at LOAD time can be compared build against itself */
{ const m = /[?&]opt=([^&]*)/.exec(location.search);
  if (m) for (const kv of decodeURIComponent(m[1]).split(',')) { const [k, v] = kv.split(':'); if (k in OPT) OPT[k] = v !== '0'; } }
/* v15: A MATRIX IS COMPOSED ONLY WHEN WHAT IT IS MADE OF CHANGED. three.js
   recomposes every object's local matrix from its position, rotation and
   scale on every frame and flags its world matrix dirty — so the root of
   every chapter recomposed, which FORCED a world-matrix multiply onto every
   node under it, every frame: 3,126 nodes in episode 2 chapter 1, of which
   ~2,500 never move (v8.6's freezeStatic saved the compose on meshes, never
   the multiply, and only there). The profile's largest script cost per frame
   was exactly this (updateMatrixWorld, multiplyMatrices, the traversal).
   Now:
   - updateMatrix remembers the ten numbers (and the parent) it composed
     from; bitwise the same (and not re-parented) → the matrix already says
     exactly this, so it neither recomposes nor flags the world matrix;
   - every world-matrix computation takes a fresh STAMP, and records the
     stamp its parent had; a node recomputes its world matrix when it is
     flagged, forced, OR its parent's stamp is not the one it last used.
   The stamps are what make it exact on every path. three's own
   updateWorldMatrix (the "where is this now" walk up a chain) refreshes a
   child only when the child is FLAGGED — stock three.js gets away with it
   because every object flags itself every frame. Without the stamps a child
   whose parent moved could be left stale: the first version of this, with
   the composed-numbers check alone, left the CAMERA stale in the films
   (dbgmat.mjs, against three's forced full recompute), and the stamps close
   it. Everything else is three r185's own code, unchanged in order and in
   arithmetic, so every matrix comes out BIT-IDENTICAL to a full recompute.
   A pivot always composes. */
{
  const O = THREE.Object3D.prototype, composeFull = O.updateMatrix;
  let seq = 0;
  /* the same number BIT FOR BIT: === alone calls +0 and −0 equal, and a −0
     composes a −0 into the matrix, so a coordinate that flips sign at zero
     must recompose for the result to stay identical to a full recompute */
  const eq = (a, b) => a === b && (a !== 0 || 1 / a === 1 / b);
  O.updateMatrix = function () {
    const p = this.position, q = this.quaternion, s = this.scale;
    let t = this.__mzT;
    if (t !== undefined && OPT.matSkip && this.pivot === null && this.__mzPa === this.parent
        && eq(t[0], p.x) && eq(t[1], p.y) && eq(t[2], p.z)
        && eq(t[3], q._x) && eq(t[4], q._y) && eq(t[5], q._z) && eq(t[6], q._w)
        && eq(t[7], s.x) && eq(t[8], s.y) && eq(t[9], s.z)) return;
    composeFull.call(this);
    if (t === undefined) t = this.__mzT = new Float64Array(10);
    t[0] = p.x; t[1] = p.y; t[2] = p.z; t[3] = q._x; t[4] = q._y; t[5] = q._z; t[6] = q._w;
    t[7] = s.x; t[8] = s.y; t[9] = s.z;
    this.__mzPa = this.parent;
  };
  const stale = (o, pa) => pa !== null && pa.__mzW !== o.__mzPW;
  const compute = (o, pa) => {
    if (o.matrixWorldAutoUpdate === true) {
      if (pa === null) o.matrixWorld.copy(o.matrix);
      else o.matrixWorld.multiplyMatrices(pa.matrixWorld, o.matrix);
    }
    o.matrixWorldNeedsUpdate = false;
    o.__mzW = ++seq;
    o.__mzPW = pa !== null ? pa.__mzW : 0;
  };
  O.updateMatrixWorld = function (force) {
    if (this.matrixAutoUpdate) this.updateMatrix();
    const pa = this.parent;
    if (this.matrixWorldNeedsUpdate || force || stale(this, pa)) { compute(this, pa); force = true; }
    const children = this.children;
    for (let i = 0, l = children.length; i < l; i++) children[i].updateMatrixWorld(force);
  };
  O.updateWorldMatrix = function (updateParents, updateChildren, force = false) {
    const pa = this.parent;
    if (updateParents === true && pa !== null) pa.updateWorldMatrix(true, false);
    if (this.matrixAutoUpdate) this.updateMatrix();
    if (this.matrixWorldNeedsUpdate || force || stale(this, pa)) { compute(this, pa); force = true; }
    if (updateChildren === true) {
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) children[i].updateWorldMatrix(false, true, force);
    }
  };
}
/* v15: A SKELETON THAT DID NOT MOVE IS NOT RE-UPLOADED. three computes every
   bone's matrix into the skeleton's float array each frame and then flags the
   bone TEXTURE for upload whether or not a single number changed — a
   texSubImage2D per skinned character per frame, for a man held on one frame
   of his take, a copy parked in a film, a crowd frozen at a beat. The same
   arithmetic runs here (the same multiplyMatrices, the same float32 store),
   compared as it is stored: the first bone whose value differs — bit for bit,
   −0 against +0 included — is written, every bone after it too, and only then
   is the texture flagged. An animated rig differs at its first bone and pays
   one comparison; a still one uploads nothing, and the GPU already holds
   exactly the numbers it would have been sent. */
{
  const S = THREE.Skeleton.prototype, updateFull = S.update;
  const off = new THREE.Matrix4(), ident = new THREE.Matrix4();
  S.update = function () {
    if (!OPT.boneSkip) return updateFull.call(this);
    const bones = this.bones, inv = this.boneInverses, arr = this.boneMatrices, tex = this.boneTexture;
    let changed = tex !== null && tex.version === 0;
    for (let i = 0, il = bones.length; i < il; i++) {
      const b = bones[i];
      off.multiplyMatrices(b ? b.matrixWorld : ident, inv[i]);
      const o = i * 16;
      if (!changed) {
        const e = off.elements;
        for (let k = 0; k < 16; k++) {
          const v = Math.fround(e[k]), w = arr[o + k];
          if (v !== w || (v === 0 && 1 / v !== 1 / w)) { changed = true; break; }
        }
        if (!changed) continue;
      }
      off.toArray(arr, o);
    }
    if (changed && tex !== null) tex.needsUpdate = true;
  };
}
const instCull = new Set();
let shadowSyncTick = 0;
const _icPV = new THREE.Matrix4(), _icLocal = new THREE.Matrix4(), _icFr = new THREE.Frustum(),
      _icM = new THREE.Matrix4(), _icV = new THREE.Vector3();
function cullEachInstance(im) {
  const n = im.count;
  if (!(n > 1)) return;
  const g = im.geometry;
  if (!g.boundingSphere) g.computeBoundingSphere();
  const gs = g.boundingSphere;
  if (!gs || !Number.isFinite(gs.radius)) return;
  const full = im.instanceMatrix.array.slice(0, n * 16);
  const fullColor = im.instanceColor ? im.instanceColor.array.slice(0, n * 3) : null;
  const cs = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    _icM.fromArray(full, i * 16);
    _icV.copy(gs.center).applyMatrix4(_icM);
    if (!Number.isFinite(_icV.x + _icV.y + _icV.z)) return;   // a bad matrix: leave the mesh to three's own culling
    cs[i * 4] = _icV.x; cs[i * 4 + 1] = _icV.y; cs[i * 4 + 2] = _icV.z;
    cs[i * 4 + 3] = gs.radius * _icM.getMaxScaleOnAxis() * 1.02 + 0.05;
  }
  im.userData.__ic = { n, full, fullColor, cs, vis: new Uint8Array(n).fill(1), count: n, whole: true };
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);     // a driver hint: this buffer is rewritten as the view turns
  if (im.instanceColor) im.instanceColor.setUsage(THREE.DynamicDrawUsage);
  instCull.add(im);
}
/* v15: SPHERE CULLING, for the things three.js cannot cull by itself. A
   skinned clone that draws a pose from a skeleton somewhere else (chapter 3's
   seated crowd: 'detached' bind mode, one offstage skeleton per pose) has no
   bounds of its own that mean anything, so it is marked frustumCulled=false
   and drawn whichever way the player looks — 70 meshes and 255 k triangles
   in the tent, all of them skinned. The chapter hands the engine a root and a
   generous sphere in the root's own space; while that sphere is wholly
   outside the camera's frustum, every mesh under the root is taken off the
   camera's LAYERS. Not its visibility (a chapter owns that) and not its
   boundingSphere (three sorts by that sphere's centre, and a changed sort key
   can change what a transparent pass blends): a layer the camera does not
   draw is exactly what frustum culling is, and nothing else moves. Shadow-map
   frames and the loading warm-up restore everything. */
const sphereCull = new Set();
const _scV = new THREE.Vector3();
function cullBySphere(root, cx, cy, cz, radius) {
  const meshes = [];
  root.traverse(o => { if (o.isMesh || o.isPoints || o.isLine || o.isSprite) meshes.push(o); });
  if (!meshes.length || !(radius > 0)) return;
  root.userData.__sc = { c: new THREE.Vector3(cx, cy, cz), r: radius, meshes, masks: meshes.map(m => m.layers.mask), out: false,
                         casts: meshes.some(m => m.castShadow) };
  sphereCull.add(root);
}
function sphereCullShow(root) {
  const u = root.userData.__sc;
  if (!u || !u.out) return;
  u.meshes.forEach((m, i) => { m.layers.mask = u.masks[i]; });
  u.out = false;
}
function cullSpheres(cam, shadowFrame, frustum) {
  for (const root of sphereCull) {
    const u = root.userData.__sc;
    if (!u || !root.parent) { if (u) sphereCullShow(root); sphereCull.delete(root); continue; }
    let inside = true;
    if (OPT.sphereCull && !(shadowFrame && u.casts)) {
      root.updateWorldMatrix(true, false);
      _scV.copy(u.c).applyMatrix4(root.matrixWorld);
      const r = u.r * root.matrixWorld.getMaxScaleOnAxis();
      for (const pl of frustum.planes) if (pl.distanceToPoint(_scV) < -r) { inside = false; break; }
    }
    if (inside) { if (u.out) sphereCullShow(root); }
    else if (!u.out) {
      u.meshes.forEach((m, i) => { u.masks[i] = m.layers.mask; m.layers.mask = 0; });   // remember whatever it had
      u.out = true;
    }
  }
}
/* v15: A SHADOW NOBODY CASTS. A light that casts shadows puts a shadow-map
   lookup (PCF: nine compares) into the shader of every material that
   receives them, for every lit pixel on screen, and redraws its map whenever
   the shadows are dirtied. On a phone every model in episode 2 is
   `castShadow = !LOW` — measured: ZERO casters in all five chapters, with
   95 to 493 receiving meshes still sampling the moon's empty map. An empty
   map compares as fully lit everywhere, which is exactly what a light with
   no shadow computes, so switching the light's shadow off when the world
   holds no caster is the same picture with the lookups gone. Decided under
   the curtain (before the programs are compiled), counted over hidden meshes
   too (a cutscene prop may cast later), and re-checked every couple of
   seconds so a caster that appears puts the shadow straight back. */
function shadowCasterSync() {
  let casters = 0;
  const lights = [];
  scene.traverse(o => {
    if (o.isLight && o.shadow) {
      if (o.userData.__cast === undefined) o.userData.__cast = o.castShadow;   // what the chapter (or the engine) declared
      if (o.userData.__cast) lights.push(o);
    } else if (o.castShadow && (o.isMesh || o.isPoints || o.isLine)) casters++;
  });
  const want = !(OPT.shadowTrim && casters === 0);
  let back = false;
  for (const l of lights) if (l.castShadow !== want) { l.castShadow = want; if (want) back = true; }
  if (back) redoShadows();
  return casters;
}
function sphereCullAll(show) { for (const root of sphereCull) if (show) sphereCullShow(root); }
const _scFr = new THREE.Frustum();
function cullInstances(cam, shadowFrame) {
  if (!instCull.size && !sphereCull.size) return;
  cam.updateWorldMatrix(true, false);
  _icPV.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
  if (sphereCull.size) { _scFr.setFromProjectionMatrix(_icPV); cullSpheres(cam, shadowFrame, _scFr); }
  for (const im of instCull) {
    const u = im.userData.__ic;
    if (!u || !im.parent) { instCull.delete(im); continue; }
    let shown = true;
    for (let q = im; q; q = q.parent) if (!q.visible) { shown = false; break; }
    if (!shown) continue;                         // three will not draw it; its list can wait
    const arr = im.instanceMatrix.array;
    if ((shadowFrame && im.castShadow) || !OPT.instCull) {   // the shadow map is redrawn this frame (every tree casts), or the switch is off
      if (!u.whole) {
        arr.set(u.full);
        if (u.fullColor) im.instanceColor.array.set(u.fullColor);
        im.count = u.n; u.whole = true; u.vis.fill(1);
        im.instanceMatrix.clearUpdateRanges(); im.instanceMatrix.needsUpdate = true;
        if (u.fullColor) { im.instanceColor.clearUpdateRanges(); im.instanceColor.needsUpdate = true; }
      }
      continue;
    }
    im.updateWorldMatrix(true, false);
    _icLocal.multiplyMatrices(_icPV, im.matrixWorld);
    _icFr.setFromProjectionMatrix(_icLocal);
    const P = _icFr.planes, cs = u.cs;
    let changed = u.whole;
    for (let i = 0; i < u.n; i++) {
      const x = cs[i * 4], y = cs[i * 4 + 1], z = cs[i * 4 + 2], r = cs[i * 4 + 3];
      let inside = 1;
      for (let k = 0; k < 6; k++) {
        const pl = P[k];
        if (pl.normal.x * x + pl.normal.y * y + pl.normal.z * z + pl.constant < -r) { inside = 0; break; }
      }
      if (inside !== u.vis[i]) { u.vis[i] = inside; changed = true; }
    }
    if (!changed) continue;
    let k = 0;
    for (let i = 0; i < u.n; i++) {          // EVERY visible slot is written: a slot's last tenant is not known
      if (!u.vis[i]) continue;
      arr.set(u.full.subarray(i * 16, i * 16 + 16), k * 16);
      if (u.fullColor) im.instanceColor.array.set(u.fullColor.subarray(i * 3, i * 3 + 3), k * 3);
      k++;
    }
    im.count = k; u.whole = false;
    if (k > 0) {                              // only the packed front of the buffer goes to the GPU
      im.instanceMatrix.clearUpdateRanges(); im.instanceMatrix.addUpdateRange(0, k * 16);
      im.instanceMatrix.needsUpdate = true;
      if (u.fullColor) { im.instanceColor.clearUpdateRanges(); im.instanceColor.addUpdateRange(0, k * 3); im.instanceColor.needsUpdate = true; }
    }
  }
}
function plantTrees(parent, spots, opts = {}) {
  const group = new THREE.Group();
  group.name = 'trees';
  parent.add(group);
  let dead = false;
  const owned = [];
  group.userData.disposeTrees = () => {
    dead = true;
    for (const c of group.children) instCull.delete(c);   // v15: out of the per-instance culling set
    for (const m of owned) m.dispose();      // the CLONED materials only: every map belongs to the shared kit
    owned.length = 0;
    group.clear();
  };
  const seed = opts.seed === undefined ? 1 : opts.seed;
  treeKit().then(kinds => {
    if (dead || !kinds) return;
    const live = kinds.map((k, i) => k && i).filter(i => i !== false && kinds[i]);
    if (!live.length) return;
    const tint = opts.tint ? new THREE.Color(opts.tint) : null;
    const rnd = (i, salt) => {            // one deterministic stream per spot
      const x = Math.sin((i + 1) * 12.9898 + seed * 78.233 + salt * 43.758) * 43758.5453;
      return x - Math.floor(x);
    };
    const byKind = new Map();
    const keep = LOW && opts.lowKeep !== undefined ? opts.lowKeep : 1;
    spots.forEach((sp, i) => {
      if (keep < 1 && rnd(i, 7) > keep) return;      // the phone's thinner stand
      const k = sp.kind !== undefined ? live[sp.kind % live.length] : live[(i + ((rnd(i, 3) * live.length) | 0)) % live.length];
      if (!byKind.has(k)) byKind.set(k, []);
      byKind.get(k).push({ sp, i });
    });
    const M = new THREE.Matrix4(), R = new THREE.Matrix4(), q = new THREE.Quaternion(),
          e = new THREE.Euler(), pv = new THREE.Vector3(), sv = new THREE.Vector3();
    for (const [k, list] of byKind) {
      const parts = kinds[k];
      for (const part of parts) {
        const mat = part.mat.clone();
        mat.fog = opts.fog !== false;
        if (tint) mat.color = mat.color ? mat.color.clone().multiply(tint) : tint.clone();
        if (opts.roughness !== undefined) mat.roughness = opts.roughness;
        if (part.leaf) { mat.side = THREE.DoubleSide; if (!(mat.alphaTest > 0)) mat.alphaTest = 0.45; mat.transparent = false; mat.depthWrite = true; }
        // a crown is nothing but grazing angles; without this the far leaves crawl
        /* v15: set once — the map is the kit's, SHARED by every stand, and
           flagging it for every stand re-uploaded and re-mipped the same
           texels at every chapter entry */
        if (mat.map) {
          const a = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          if (mat.map.anisotropy !== a) { mat.map.anisotropy = a; mat.map.needsUpdate = true; }
        }
        owned.push(mat);
        const im = new THREE.InstancedMesh(part.geo, mat, list.length);
        im.castShadow = !!opts.shadow && !LOW;
        im.receiveShadow = false;
        list.forEach(({ sp, i }, n) => {
          /* v14.1: a spot whose `h` is missing or not a number used to compose
             a matrix with a NaN scale, which is not a small tree — it is
             garbage geometry, and its bounding sphere comes back null so the
             stand's culling goes arbitrary too. Episode 2 chapter 5 shipped
             like that: it passed `s` instead of `h`, and all 51 of its trees
             were black shards. Nothing on screen and no harness said so.
             A bad height now takes a sane default AND says so out loud, and
             walktest fails any chapter whose instance matrices go non-finite. */
          if (!Number.isFinite(sp.h) && !plantTrees.__warned) {
            plantTrees.__warned = true;
            console.error('plantTrees: spot ' + i + ' has no finite `h` (got ' + sp.h +
                          ') — a tree\'s height is in METRES and the key is `h`.');
          }
          const h = (Number.isFinite(sp.h) ? sp.h : 6.0) * (0.88 + rnd(i, 1) * 0.30);
          e.set((rnd(i, 4) - 0.5) * 0.06, sp.ry === undefined ? rnd(i, 2) * Math.PI * 2 : sp.ry, (rnd(i, 5) - 0.5) * 0.06);
          q.setFromEuler(e);
          M.compose(pv.set(sp.x, sp.y || 0, sp.z), q, sv.set(h, h, h));
          im.setMatrixAt(n, R.multiplyMatrices(M, part.m));
        });
        im.instanceMatrix.needsUpdate = true;
        /* v8.6: A STAND CULLS, ON BOUNDS READ FROM ITS OWN INSTANCES.
           Until now this said `im.frustumCulled = false`, because a tree's
           stored geometry is one metre tall until the instance matrix scales
           it up — so the geometry's own sphere is far too small and three.js
           would cull a stand that is filling the screen. But InstancedMesh
           has `computeBoundingSphere()`, which walks EVERY instance matrix
           and unions the result: the real bounds were always available, just
           never asked for. Measured in the bunk, 12 headings: 183,574 tree
           triangles were drawn on every frame; with real bounds the mean on
           screen is 68,617, and at seven of the twelve headings the stand is
           wholly behind the player and draws nothing.
           GENEROUSLY (Chad's word) — but ADDITIVELY, which is the whole
           lesson here. A stand's sphere already spans tens of metres (these
           run 4.3 m to 45.6 m), so a MULTIPLICATIVE margin scales the slack
           with the stand: x1.6 put eighteen metres of nothing around the big
           stands and swallowed the win. Measured over 12 headings in the
           bunk, mean triangles a frame against no culling at all:

             exact bounds  saves 114,957 (29%)     +4 m   saves  86,113 (22%)
             +1 m          saves 108,404 (28%)     x1.25  saves  35,636  (9%)
             +2 m          saves 102,462 (26%)     x1.60  saves  12,002  (3%)

           So the margin is a FLAT three metres. What it has to cover is a
           per-TREE uncertainty — a leaf card reaching past its own instance
           box, a crown that sways, a stand whose spots are re-dealt — and
           that is metres, never a proportion of the whole stand. Three is
           already pure slack: `computeBoundingSphere` unions each instance's
           real geometry sphere, crown and instance scale included, so the
           exact bounds are correct and this is only insurance. A stand that
           blinks at the edge of the screen would be far worse than one drawn
           a moment longer than it needed to be. */
        im.computeBoundingSphere();
        if (im.boundingSphere) im.boundingSphere.radius += 3;
        cullEachInstance(im);        // v15: and each TREE culls on its own (INSTANCE CULLING)
        group.add(im);
      }
    }
  }).catch(() => {});
  return group;
}

/* ======================================================= v7.0: THE PLAY KIT
   Everything a chapter may ask of the engine BETWEEN its film and its
   decision, so that a chapter is more than a walk to one object. Every seam
   here is OPTIONAL and DECLARED — chapters 1–5 declare none of it and take
   exactly the path they always took (the law since v4.0). The verbs reach a
   chapter as `ctx.kit` (build) and `api.kit` (a scene).

   The rule that shapes the code: a verb MUTATES kit state; the FRAME
   (kitFrame, called from tick) is the only thing that touches the DOM. That
   is what lets a chapter call `kit.objective()` from inside build(), which
   runs during module init, before `$`, `ui` or `state` exist.

   Hotspots    stage.hotspots — many things to act on beside the pile
   Objective   a HUD line, a countdown, a waypoint diamond in the world
   Events      tap · timed · mash · hold · stabilise · heartbeat · focus ·
               sequence — one system, resolves a promise, phone-first; the
               trial game's five reaction challenges live here (MZTRIAL-NOTES)
               and move Sanity and Awareness, never Wisdom
   Torch       a spotlight on the camera, white or red, F / a HUD button
   Presence    the drain without a ghost mesh (a chapter with ghost: null)
   Conduct     Sanity/Awareness earned in play, shown on the outcome card
   Pose        lying down in play (the bed is a hotspot)
   Daylight    the sky tweened in play — morning to lights-out to 3 AM
   Fade        the black between a day and a night, in play (v7.1)
   Clock       one timed decision, a bar that is the thing's approach
   Phase       a bookmark the chapter keeps, saved with the run            */
let eyeY = 1.62, pitchLo = -1.2, pitchHi = 1.2;   // the standing values; a pose moves them
let kitPhase = null;                                // the chapter's bookmark, saved with the run
const conductAcc = { s: 0, a: 0, notes: [] };
const CONDUCT_CAP = 10;                             // play tilts a rank; the card decides it
let runChoices = {};                                // the letter picked per chapter, this run
let kitObjective = null, kitTimer = null, kitWaypoint = null;
let kitPose = 'standing', poseFrom = 1.62, poseTo = 1.62, poseT = 1, poseSecs = 0.9;
let lieYaw = 0, lieSpan = 1.1;
let chapterPresence = 0;
let torchLight = null, torchOn = false, torchDecl = null, torchIsRed = false;
let torchProp = null, torchPropKey = null;   // v11.1: the torch's own viewmodel (Chad's flashlight), swapped for the hand while it is on
/* v12.0: THE WEAPON (rifle mode, the nineteenth seam — docs/V12.0-E2C4-PLAN.md §12).
   A chapter declares `weapon`; the prop is the model's own arms-and-weapon
   rig (it brings its own hands), driven by its own clips; the rounds and
   magazines are engine state a chapter reads through the kit. */
let weaponDecl = null, weaponProp = null, weaponPropKey = null, weaponMixer = null, weaponActs = null;
let weaponClipT0 = {};                       // v12.2: where each take's first key sits, measured at load
let weaponForce = null;                      // null: follow the bag; true/false: a film or a scene has said
let weaponRounds = 0, weaponMags = 0, weaponBusy = null, weaponFlash = null, weaponFlashT = 0;
/* v13.1 — THE MUZZLE FLASH (Chad: "See if you can use this muzzle flash
   effect when shooting the rifle, it should show this for a split second").
   `weaponFlash` above is the POINT LIGHT that has thrown the world's flash
   since v12.0; these are the CONE the player actually sees, and the two are
   deliberately different objects in different scenes — the light hangs off
   the world camera and lights the range, the cone hangs off `weaponProp` in
   the viewmodel scene and lights nothing. Both run off the one `weaponFlashT`
   clock, so they can never disagree about when a shot happened. */
let weaponFlashObj = null, weaponFlashKey = null, weaponFlashCards = [], weaponFlashN = 0, weaponFlashDrawn = false;
let weaponShown = false, weaponLastFire = 0;
/* v14.3: A CHAPTER MAY FORBID THE SHOT, and the refusal has to SAY WHY.
   Chad, on the live range: "disable shooting until the player actually
   reaches lane 6. The HUD ui should say something like 'Shooting only
   allowed at lane 6' if player tries to shoot anywhere else." A trigger
   that does nothing is indistinguishable from a broken game, which is the
   same failure `#nofire` answers as v12.2's "shooting does not seem to
   work" — there it was a real bug, here it is a rule, and the difference
   has to be on the screen.
   The MESSAGE is the chapter's (kit.weaponBlock), never the engine's: what
   is forbidden and why is a chapter's business, and a chapter's word goes
   through its own `words`, where textsync puts it in front of Chad.
   null (the default) is no block at all, so the fixture's nine promises
   and episode 1 — which declares no weapon — are untouched by
   construction. */
let weaponBlock = null, weaponBlockShown = 0, weaponBlockEl = null, weaponBlockT = 0;
const weaponLog = [];                        // for the probes: every shot, hit or miss
let kitRooted = false, kitHurt = null;       // v11.1: the player held in place; the red damage frame + a bleed until the player acts
let invUrge = null;                          // v11.6: an item the bag button pulses for until it is equipped (kit.give)
let invBtnEl = null;                         // v11.6: the bag button, looked up once
let dayTween = null;
let kitFade = null, kitFadeNow = 0;              // v7.1: a chapter's own black, in play
let decClock = null;
let ev = null;                                      // the live event, one at a time
let activeSpot = null;
let kitInited = false;
const _hs = new THREE.Vector3(), _c1 = new THREE.Color(), _c2 = new THREE.Color();

/* ---- hotspots ---------------------------------------------------------- */
function hotspotList() {
  const h = stage && stage.hotspots;
  if (!h) return [];
  const list = typeof h === 'function' ? h() : h;
  return Array.isArray(list) ? list : [];
}
function projectTo(x, y, z) {
  camera.updateWorldMatrix(true, false);
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  return _hs.set(x, y, z).project(camera);
}
function hotspotVisible(h) {
  const n = projectTo(h.pos.x, h.pos.y ?? 1.0, h.pos.z);
  return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
}
function nearestHotspot() {
  let best = null, bd = Infinity;
  for (const h of hotspotList()) {
    if (!h || !h.pos || h.done || (typeof h.enabled === 'function' && !h.enabled())) continue;
    /* v12.3 excluded a DWELL spot from the badge entirely, because a press
       used to fire whichever spot was NEAREST — so a tap while looking at a
       tree twelve metres off answered the ground at the player's feet, out of
       order and skipping the look the spot exists to measure.
       v12.5 (Chad, a player's report: "the 1/6 ... looking at the tree cannot
       be clicked"): the fix for that was the ordering, not the press. A dwell
       spot is offered to a press ONLY while the reticle is already inside its
       own `aim` — the same test the look itself is graded on — so a press can
       only ever fire the exact spot the look was about to, and a player who
       taps what the game has marked is answered instead of ignored. */
    if (h.dwell > 0 && !hotspotAimed(h)) continue;
    const d = Math.hypot(yaw.position.x - h.pos.x, yaw.position.z - h.pos.z);
    if (d < (h.radius || 2.2) && d < bd && (h.anyView || hotspotVisible(h))) { best = h; bd = d; }
  }
  return best;
}
/* v11.0: THE EIGHTEENTH SEAM — a hotspot SEEN BY LOOKING. Episode 2
   chapter 3's play is a torch: a spot in the jungle is "pressed" when the
   beam has rested on it, and there is no button for a thing you can only
   look at. A hotspot that declares `dwell` (seconds) fires its onInteract
   once the reticle has stayed inside `aim` radians of it (default 0.10, six
   degrees) for that long — inside its radius, in play, with no event open.
   The accumulated time leaks away at twice the rate it gains, so a glance
   is not a look. Chapters 1-5 declare no hotspots, and e2c1 and e2c2 declare
   none with `dwell`, so nothing shipped before this release can reach it;
   the fixture declares one and fixturetest proves it. */
const _dwFwd = new THREE.Vector3(), _dwTo = new THREE.Vector3(), _dwCam = new THREE.Vector3();
let _dwLast = 0;
/* v12.5: is the reticle ON this spot? One test, used by the dwell that grades
   the look and by the badge that offers the press, so the two can never
   disagree about what the player is looking at. */
function hotspotAimed(h) {
  camera.getWorldDirection(_dwFwd); camera.getWorldPosition(_dwCam);
  _dwTo.set(h.pos.x - _dwCam.x, (h.pos.y ?? 1.0) - _dwCam.y, h.pos.z - _dwCam.z).normalize();
  return Math.acos(THREE.MathUtils.clamp(_dwFwd.dot(_dwTo), -1, 1)) < (h.aim || 0.10);
}
function dwellHotspots() {
  /* WALL time, not the clamped frame dt (the kit timer's law, v7.4): at
     one frame a second the clamped dt is 0.05, so a 0.8 s look would take
     sixteen seconds of staring. Capped at 0.5 s so a stalled tab cannot
     fire every spot on its first frame back. */
  const now = performance.now();
  const dt = _dwLast ? Math.min(0.5, (now - _dwLast) / 1000) : 0;
  _dwLast = now;
  if (state !== 'play' || ev) return;
  for (const h of hotspotList()) {
    if (!h || !h.pos || !(h.dwell > 0) || h.done || (typeof h.enabled === 'function' && !h.enabled())) continue;
    const d = Math.hypot(yaw.position.x - h.pos.x, yaw.position.z - h.pos.z);
    const on = d < (h.radius || 2.2) && hotspotAimed(h);
    h.dwellT = on ? (h.dwellT || 0) + dt : Math.max(0, (h.dwellT || 0) - dt * 2);
    if (h.dwellT < h.dwell) continue;
    h.dwellT = 0;
    /* v14.4: SAY THAT THIS ONE CAME FROM A LOOK. `nearestHotspot` offers a
       dwell spot to a press as soon as the reticle is inside its own cone
       (v12.5, so a phone has a tap target at all), which is right where a
       press and a look are equivalent — chapter 3's torch spots — and wrong
       where the HOLD is the mechanic, as it is for e2c4's tracking drill,
       whose 1.2 s dwell one tap of E could skip entirely. A chapter that
       cares reads `h.byLook`; one that does not is unaffected. */
    h.byLook = true;
    const r = typeof h.onInteract === 'function' ? h.onInteract(h) : false;
    h.byLook = false;
    if (r !== false && h.once) h.done = true;
  }
}
function setInteractBadge(spot) {
  if (spot === activeSpot) return;
  activeSpot = spot;
  const el = $('itxt');
  if (!el) return;
  el.textContent = spot ? (spot.prompt || '')
    : (HAS_TOUCH ? chWord('interactTouch', 'world.interactTextTouch')
                 : chWord('interact', 'world.interactText'));
}
/* E, or a tap on the badge: the pile first (its contract is untouched), then
   the nearest hotspot. A hotspot's onInteract may return false to say
   "nothing happened"; `once` retires it after it fires. */
function interactNow() {
  if (state !== 'play') return false;
  if (stage.pile.dist() < stage.pile.radius && stage.pile.inView()) return stage.pile.interact();
  const h = activeSpot;
  if (!h) return false;
  const r = typeof h.onInteract === 'function' ? h.onInteract(h) : false;
  if (r !== false) { snd('uiclick', 0.35); if (h.once) { h.done = true; setInteractBadge(null); } }
  return r !== false;
}
/* v14.7: A HOTSPOT YOU CAN TAP. Until now the pile was the one thing a tap
   on the world could reach (`stage.pile.hits`, v2.1); a hotspot was pressed
   through the badge. Chad, of the amulet: "the player can interact with it
   (E or tap on it)". So a hotspot may declare `hits(clientX, clientY)` — the
   chapter's own raycast onto its own mesh — and a tap or an unlocked click
   that lands on it fires it, inside its radius and on the same terms as the
   badge. Only a hotspot that DECLARES hits can be reached this way, and no
   hotspot before v14.7 declares one, so nothing that shipped can change. */
function hotspotTap(x, y) {
  if (state !== 'play' || ev) return false;
  for (const h of hotspotList()) {
    if (!h || !h.pos || typeof h.hits !== 'function' || h.done
        || (typeof h.enabled === 'function' && !h.enabled())) continue;
    const d = Math.hypot(yaw.position.x - h.pos.x, yaw.position.z - h.pos.z);
    if (d >= (h.radius || 2.2) || !h.hits(x, y)) continue;
    const r = typeof h.onInteract === 'function' ? h.onInteract(h) : false;
    if (r !== false) { snd('uiclick', 0.35); if (h.once) { h.done = true; if (activeSpot === h) setInteractBadge(null); } }
    return r !== false;
  }
  return false;
}

/* ---- objective, timer, waypoint ---------------------------------------- */
/* v8.7: `opts.complete === false` says this change is not a completion —
   see THE OBJECTIVE IS A BEAT, below. Everything else is unchanged: the
   text is still whatever the chapter passes, and null still clears it. */
function kitObjectiveSet(text, opts) {
  const next = text ? String(text) : null;
  if (next === kitObjective) return;
  const had = !!kitObjective;
  kitObjective = next;
  if (had && !(opts && opts.complete === false)) objPush('done');
  if (next) objPush('new');
}
function kitTimerStart(secs, onEnd) {
  kitTimer = secs > 0 ? { left: secs, total: secs, onEnd } : null;
  if (kitTimer) objPush('new');           // v8.7: a countdown appearing is a change too
  return { stop: () => { kitTimer = null; }, left: () => (kitTimer ? kitTimer.left : 0) };
}
function kitWaypointSet(pos) {
  kitWaypoint = pos && Number.isFinite(pos.x) && Number.isFinite(pos.z)
    ? { x: pos.x, y: pos.y ?? 1.2, z: pos.z } : null;
}
const objPainted = { txt: null, tm: null, shown: null, done: null };
/* v8.3: one bright pulse when the objective's words change. The class is
   pulled and re-added with a reflow between, because re-adding a class that
   is already there does not restart a CSS animation. */
let objFlashT = 0;
function flashObjective(cls) {
  const el = $('objective')?.querySelector('.obox'); if (!el) return;
  for (const c of ['flash', 'tflash', 'scan']) el.classList.remove(c);
  void el.offsetWidth;
  el.classList.add(cls || 'flash');
  el.classList.add('scan');        // v8.8: and a bright edge crosses the box
  clearTimeout(objFlashT);
  objFlashT = setTimeout(() => {
    for (const c of ['flash', 'tflash', 'scan']) el.classList.remove(c);
  }, 1000);
}
/* v8.8: the words LEAVE before the new ones arrive. The class goes on one
   frame, the text is replaced on the next, so what slides out is the old
   order and what slides in is the new — a swap in place reads as a glitch
   rather than a change of orders. */
let objSwapT = 0;
function swapObjText(txt) {
  const box = $('objective')?.querySelector('.obox'), el = $('objTxt');
  if (!box || !el) return;
  clearTimeout(objSwapT);
  box.classList.remove('in');
  box.classList.add('out');
  objSwapT = setTimeout(() => {
    el.textContent = txt;
    box.classList.remove('out');
    void box.offsetWidth;
    box.classList.add('in');
    objSwapT = setTimeout(() => box.classList.remove('in'), 460);
  }, 230);
}
/* ============================ v8.7: THE OBJECTIVE IS A BEAT, NOT A LABEL
   Chad: "The objective hud display should also have a trigger sound and
   flash effect showing 'objective complete', before flashing again with
   sound effect, showing the new next objective. Every subsequent change in
   objective or timer should always also have these effects. this should be
   a standard." So it belongs to the ENGINE rather than to any chapter:
   every objective any chapter sets from here on lands this way, and a
   chapter says nothing to get it.

   A change of objective is TWO beats, played in order — COMPLETE (jade,
   its own sound), then the new order (sodium, its own sound) — which is
   why there is a queue at all. The kit's law holds: a verb may only mutate
   state, so `kitObjectiveSet` pushes beats and `paintObjective`, which is
   the frame, plays them. `kitObjective` itself stays the plain target text,
   so worldState still saves exactly what it always saved.

   `{ complete: false }` is for a change that is NOT a completion — the
   fall-in going to "get to the line" when the clock runs out, the evening
   turning into its own warning. Calling a failure a completion would be a
   lie the HUD tells, which is worse than no banner at all.                */
const OBJ_DONE_HOLD = 1.35;     // seconds the COMPLETE banner holds the box
const OBJ_NEW_HOLD = 0.12;      // the new order lands on the next frame but one
let objQ = [], objBeat = null;
function objPush(kind) {
  // the timer starting beside a new objective is ONE flash, not two
  if (objQ.length && objQ[objQ.length - 1].kind === kind) return;
  objQ.push({ kind });
  // orders arriving faster than the beats can play: keep the newest
  while (objQ.length > 4) objQ.shift();
}
/* v8.8: the HUD's own sounds, written for these moments rather than borrowed
   from the menu — `hudok` (a soft impact and two rising bell notes), `hudnext`
   (a sharp comms blip over a low whoosh) and `hudfail` (a dull buzzer and a
   sub drop). And the buzz is a PATTERN, not one flat pulse: a completion is
   two taps and a settle, a new order is one short tick, time running out is a
   long dull double. A phone can say which of the three happened without the
   player looking. */
function objFire(kind) {
  if (kind === 'done') { flashObjective('flash'); snd('hudok', 0.85); haptic([18, 40, 55]); }
  else if (kind === 'timeup') { flashObjective('tflash'); snd('hudfail', 0.8); haptic([70, 60, 110]); }
  else { flashObjective('flash'); snd('hudnext', 0.7); haptic(22); }
}
/* WALL time, not the frame's dt: dt is clamped to 0.05 s, so on a slow box a
   1.35 s banner would hold for half a minute (the law the chapter clock and
   the kit's countdown both learned before this). */
function objRun() {
  const now = performance.now() / 1000;
  if (objBeat && now >= objBeat.until) objBeat = null;
  if (!objBeat && objQ.length) {
    objBeat = objQ.shift();
    objBeat.until = now + (objBeat.kind === 'done' ? OBJ_DONE_HOLD : OBJ_NEW_HOLD);
    objFire(objBeat.kind);
  }
}
/* v8.7: ONE SCREEN FLASH, fired through the kit. A verb may only mutate
   state (a chapter can call this from build(), before the HUD exists), so
   the request is a field and `flashRun` — the frame — is what touches the
   element. Chapters 1-5 never call it. */
let kitFlashReq = null, kitFlashT = 0;
function kitFlashSet(opts) {
  const o = opts || {};
  kitFlashReq = { color: o.color || '#63D6C8', secs: Math.max(0.12, +o.secs || 0.55) };
}
function flashRun() {
  if (!kitFlashReq) return;
  const req = kitFlashReq; kitFlashReq = null;
  const el = $('hudflash'); if (!el) return;
  el.style.setProperty('--fc', req.color);
  el.style.setProperty('--fs', req.secs + 's');
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  clearTimeout(kitFlashT);
  kitFlashT = setTimeout(() => el.classList.remove('on'), req.secs * 1000 + 60);
}
function objReset() {
  objQ.length = 0; objBeat = null;
  clearTimeout(objSwapT); clearTimeout(objFlashT);
  const el = $('objective')?.querySelector('.obox');
  if (el) for (const c of ['done', 'flash', 'tflash', 'scan', 'in', 'out']) el.classList.remove(c);
  objPainted.txt = objPainted.tm = objPainted.shown = objPainted.done = null;
}
function paintObjective() {
  const box = $('objective'); if (!box) return;
  const live = state === 'play' || state === 'decide';
  if (live) objRun();
  const banner = !!(objBeat && objBeat.kind === 'done');
  const show = (kitObjective || kitTimer || banner) && live;
  if (show !== objPainted.shown) { box.classList.toggle('hide', !show); objPainted.shown = show; document.body.classList.toggle('hasObj', !!show); }   // v11.8: the presence banner reads this
  if (!show) {
    /* v14.7: a box that has GONE AWAY has nothing to slide out. When the
       last order is completed the box hides still holding "OBJECTIVE
       COMPLETE", and the next order to arrive used to slide those stale
       words out first — which, after a step UNDONE (chapter 3's amulet
       taken off again before the altar), read as a congratulation for going
       backwards: the v8.7 lie, in the words rather than the banner. So once
       there is no order left, the next one is a first paint and lands
       straight away (its own beat still flashes and sounds). A box that is
       only hidden for a moment (the bag, a card) keeps its words. */
    if (!kitObjective && !banner) objPainted.txt = null;
    return;
  }
  const obox = box.querySelector('.obox');
  /* v11.8 (Chad, a phone screenshot: the presence banner across the
     objective box): the box's HEIGHT goes onto <body> as `--objH`, and the
     phone's banner rule stands the banner under the box however many
     lines it wraps to. A ResizeObserver reports it — the first version
     read `offsetHeight` every twentieth frame and on a one-frame-a-second
     box that was ONE read, taken while the box still said OBJECTIVE
     COMPLETE on a single line, so the banner stood 8 px into a two-line
     order. The observer fires after every layout that changes the box and
     costs no read on the frame. Episode 1 shows no objective, so `hasObj`
     is never set there and its banner is where it always was. */
  if (obox && !objPainted.ro) {
    const put = h => { if (h !== objPainted.h) { objPainted.h = h; document.body.style.setProperty('--objH', h + 'px'); } };
    if (typeof ResizeObserver === 'function') {
      objPainted.ro = new ResizeObserver(() => put(obox.offsetHeight));
      objPainted.ro.observe(obox);
    } else objPainted.ro = { poll: put };
  }
  if (objPainted.ro && objPainted.ro.poll && ((objPainted.n = (objPainted.n | 0) + 1) % 4 === 1)) objPainted.ro.poll(obox.offsetHeight);
  if (banner !== objPainted.done) {
    if (obox) obox.classList.toggle('done', banner);
    objPainted.done = banner;
  }
  const txt = banner ? T('hud.objDone') : (kitObjective || '');
  if (txt !== objPainted.txt) {
    /* the FIRST paint lands straight away; every change after it slides —
       EXCEPT the COMPLETE banner, which lands straight away too (v9.4).
       The slide is a 230 ms setTimeout and the banner is a 1.35 s beat the
       FRAME takes away, so the words were racing the frame for their own
       life. Measured on a starved box (a 20 ms interval firing 4 times in
       3.5 s): the class went on at 69 ms, the frame took it off before the
       swap timer ever ran, and OBJECTIVE COMPLETE was never shown at all —
       the sound and the flash fired over the OLD order. A beat has to be
       able to say what it is on the frame it happens. */
    if (objPainted.txt === null || banner) {
      /* and a cancelled slide must not leave the box mid-slide: `out` is
         removed by the timer this cancels, and the measured timeline showed
         the box stuck on `done out` — slid away and never slid back. */
      clearTimeout(objSwapT);
      if (obox) obox.classList.remove('out', 'in');
      $('objTxt').textContent = txt;
    } else swapObjText(txt);
    objPainted.txt = txt;
  }
  // the countdown steps aside while the box is saying COMPLETE
  let tm = null;
  if (kitTimer && !banner) {
    const s = Math.max(0, Math.ceil(kitTimer.left));
    tm = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  if (tm !== objPainted.tm) {
    const el = $('objTimer');
    el.classList.toggle('hide', tm === null);
    if (tm !== null) { el.textContent = tm; el.classList.toggle('low', kitTimer.left <= 10); }
    objPainted.tm = tm;
  }
}
/* v8.3: A MARK OVER EVERY LIVE HOTSPOT. Chad: "make all the interactable
   objects, people, much more obvious with exclamation marks and more effects
   to show they are interactable. It is very hard to see now." The cause is
   the badge's own contract — it names a thing only once the player is inside
   its radius AND has it on screen, so until then nothing says the thing is
   there at all. These project into the world the way the waypoint does: a
   mark for every enabled hotspot in front of the lens out to HOTMARK_FAR,
   dimmer and smaller with distance, and `near` (bigger, brighter, rippling)
   once you are inside the radius the badge would fire at.
   Chapters 1-5 declare no hotspots, so `hotspotList()` is empty there and
   this paints nothing — the base game cannot see it. */
const HOTMARK_FAR = 16;                 // metres; the bunk is ~12 long
const hotMarks = [];
function hotMarkEl(i) {
  const host = $('hotmarks'); if (!host) return null;
  while (hotMarks.length <= i) {
    const el = document.createElement('div');
    el.className = 'hmark';
    el.innerHTML = '<span class="hring"></span><span class="hbang">!</span>';
    el.style.display = 'none';
    host.appendChild(el);
    hotMarks.push(el);
  }
  return hotMarks[i];
}
function paintHotMarks() {
  if (!$('hotmarks')) return;
  let n = 0;
  if (state === 'play' && !ev) {
    for (const h of hotspotList()) {
      if (!h || !h.pos || h.done || (typeof h.enabled === 'function' && !h.enabled())) continue;
      const d = Math.hypot(yaw.position.x - h.pos.x, yaw.position.z - h.pos.z);
      /* v12.3: `markFar` — a spot answered by LOOKING is not answered by
         walking to it, so the walk-up cap is the wrong measure for one. The
         track spot in episode 2 chapter 4 rides the cyclist, which is never
         closer than about twenty metres, so its mark was clipped at every
         distance it is ever at and the drill had no on-screen cue at all.
         A chapter names its own reach; the default is unchanged. */
      const far = h.markFar || HOTMARK_FAR;
      if (d > far) continue;
      // the anchors sit at eye height (v7.5); the mark rides above the thing
      const q = projectTo(h.pos.x, (h.pos.y ?? 1.0) + (h.markY ?? 0.55), h.pos.z);
      if (q.z > 1 || Math.abs(q.x) > 1.02 || Math.abs(q.y) > 1.02) continue;
      const el = hotMarkEl(n++); if (!el) break;
      /* v14.4: `radius` was doing double duty — the reach a press answers
         at AND the distance at which a mark reads as "in reach", which for
         e2c4's tracking spot (radius 60, so a look works at any range) meant
         the marker was drawn at full brightness with its ripple on every
         frame it existed, 46 m out as at 6. Its own comment claims the
         opposite: "at thirty metres the diamond renders small and dim". A
         spot may now say where NEAR begins; every other spot keeps radius,
         so nothing else moves. */
      const near = d < (h.nearR != null ? h.nearR : (h.radius || 2.2));
      const k = near ? 1.15 : THREE.MathUtils.clamp(1.25 - d / far, 0.55, 1);
      const a = near ? 1 : THREE.MathUtils.clamp(1.15 - d / far, 0.35, 0.9);
      el.style.display = '';
      el.style.opacity = a.toFixed(2);
      el.style.transform = `translate(${((q.x * 0.5 + 0.5) * innerWidth).toFixed(0)}px, ${((-q.y * 0.5 + 0.5) * innerHeight).toFixed(0)}px) scale(${k.toFixed(2)})`;
      el.classList.toggle('near', near);
      /* v12.5: A LOOK SPOT SAYS SO, AND SHOWS THE LOOK LANDING. Every mark
         wore the same exclamation, which on a phone is an instruction to
         tap; a spot answered by the beam resting on it got no cue that the
         beam was on it at all, so a player holding the torch perfectly still
         on the right tree saw nothing happen for 0.8 s and moved on. The
         ring FILLS with the spot's own `dwellT`, which is the one number the
         grading uses — what is drawn and what fires cannot drift apart. */
      const look = h.dwell > 0;
      el.classList.toggle('look', look);
      if (look) el.style.setProperty('--p', (Math.min(1, (h.dwellT || 0) / h.dwell)).toFixed(2));
    }
  }
  for (let i = n; i < hotMarks.length; i++) hotMarks[i].style.display = 'none';
}
/* v8.6: hide lights that are contributing nothing — see the call in tick() */
const DARK_HOLD = 20;              // frames at zero before a light is dropped
const darkFor = new WeakMap();
/* v15: the lights are LISTED, not searched for — this ran a traversal of the
   whole scene graph (thousands of objects) every frame to find about a dozen
   lights. The list is refreshed every 30 frames and whenever the stage is
   rebuilt; a light added in between is still drawn exactly as three draws it
   (visible by default), and every light this function ever HID is in the
   list, because it was in the list when it was hidden. */
let darkList = [], darkListAge = 1e9, darkListStage = null;
function darkLights() {
  if (++darkListAge > 30 || darkListStage !== stage) {
    darkList = []; darkListAge = 0; darkListStage = stage;
    scene.traverse(o => { if (o.isLight && !o.isAmbientLight && !o.isHemisphereLight) darkList.push(o); });
  }
  for (const o of darkList) {
    if (o.intensity > 0.0005) {
      if (darkFor.get(o)) darkFor.set(o, 0);
      if (!o.visible) o.visible = true;         // back instantly, never a frame late
      continue;
    }
    const n = (darkFor.get(o) || 0) + 1;
    darkFor.set(o, n);
    if (n >= DARK_HOLD && o.visible) o.visible = false;
  }
}
function paintWaypoint() {
  const el = $('waypoint'); if (!el) return;
  if (!kitWaypoint || state !== 'play') { el.classList.add('hide'); return; }
  const n = projectTo(kitWaypoint.x, kitWaypoint.y, kitWaypoint.z);
  if (n.z > 1) { el.classList.add('hide'); return; }   // behind the player: no marker
  let x = n.x, y = n.y;
  const edge = Math.abs(x) > 0.92 || Math.abs(y) > 0.9;
  x = Math.max(-0.92, Math.min(0.92, x)); y = Math.max(-0.9, Math.min(0.9, y));
  el.style.transform = `translate(${((x * 0.5 + 0.5) * innerWidth).toFixed(0)}px, ${((-y * 0.5 + 0.5) * innerHeight).toFixed(0)}px) translate(-50%,-50%)`;
  el.classList.toggle('edge', edge);
  el.classList.remove('hide');
}

/* ---- torch --------------------------------------------------------------- */
function torchSetup(decl) {
  torchDecl = { color: 0xfff1d6, red: 0xff3a2a, angle: 0.42, intensity: 26, distance: 30,
                penumbra: 0.55, decay: 1.6, on: false, ...(decl || {}) };
  if (!torchLight) {
    torchLight = new THREE.SpotLight(torchDecl.color, 0, torchDecl.distance, torchDecl.angle,
                                     torchDecl.penumbra, torchDecl.decay);
    torchLight.castShadow = false;               // a spotlight in a fogged forest: no shadow pass
    torchLight.position.set(0.14, -0.12, 0.05);   // a hand's offset from the eye
    torchLight.target.position.set(0, -0.2, -8);
    camera.add(torchLight); camera.add(torchLight.target);
  } else {
    torchLight.angle = torchDecl.angle; torchLight.distance = torchDecl.distance;
    torchLight.penumbra = torchDecl.penumbra; torchLight.decay = torchDecl.decay;
  }
  torchIsRed = false;
  torchSet(!!torchDecl.on);
  torchPropLoad(torchDecl.model);
  torchAvailSync();
}
function torchTeardown() {
  if (torchLight) { camera.remove(torchLight.target); camera.remove(torchLight); torchLight.dispose?.(); torchLight = null; }
  torchDecl = null; torchOn = false; torchIsRed = false;
  torchPropDrop();
  document.body.classList.remove('hasTorch');
  $('torchBtn')?.classList.remove('on');
}
function torchSet(on) {
  if (!torchLight) return;
  torchOn = !!on;
  torchLight.visible = torchOn;
  torchLight.intensity = torchOn ? torchDecl.intensity * (torchIsRed ? 0.55 : 1) : 0;
  torchLight.color.setHex(torchIsRed ? torchDecl.red : torchDecl.color);
  $('torchBtn')?.classList.toggle('on', torchOn);
  torchPropSync();
}
/* v11.1: THE TORCH IN HIS HAND. A chapter may declare `torch.model`, an
   asset key; while the torch is ON the hand viewmodel gives way to the
   model, hung off `handsRoot` so it bobs and sways as the hand did, with
   its lens (baked to -z by tools/prepflash.mjs) pointing out into the
   world. Off again, the hand comes back. `torch.click` names the sound
   a toggle makes (a chapter's own, warmed by the chapter); episode 1
   declares no torch, so none of this can run there. */
function torchPropLoad(key) {
  if (!key || torchPropKey === key) return;
  torchPropDrop(); torchPropKey = key;
  assetBytes(key, true).then(BUF => new GLTFLoaderMO().parse(BUF, '', (gltf) => {
    if (torchPropKey !== key) return;
    rescueTextures(gltf, BUF);
    const g = new THREE.Group();
    gltf.scene.traverse(o => {
      if (!o.isMesh) return;
      o.frustumCulled = false; o.castShadow = false; o.receiveShadow = false;
      /* the body's sheet is near-black (mean 33/255) and the viewmodel rig
         at midnight barely lights it, so a real torch vanished into the
         jungle (found by render: a red emissive proved the geometry was in
         frame). A faint self-light keeps the body legible; the LENS glow
         below is what actually draws it. */
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
        /* v11.3: the file's own metal/roughness and emissive sheets ship
           now (tools/prepflash.mjs) — the torch is black METAL, and its
           look lives in those maps, not in a base colour that averages
           33/255. Metal needs something to reflect: the viewmodel scene
           runs the room environment at 0.025, so this one material turns
           it up. The base is lifted a little for a midnight lens, and the
           emissive map (the lens) keeps the file's factor. */
        if (m.color) m.color.setScalar(2.2);
        /* the scene's environmentIntensity is 0.025 and a material's
           envMapIntensity MULTIPLIES it: 30 here is 0.75 of the room, which
           is what a black metal needs to read as metal (found by render:
           at 1.4 the body was a black cut-out with a lit lens) */
        if ('envMapIntensity' in m) m.envMapIntensity = 30;
        if (m.emissive && !m.emissiveMap) { m.emissive.setHex(0x1a1614); m.emissiveIntensity = 1; }
        m.needsUpdate = true;
      }
    });
    g.add(gltf.scene);
    /* a warm glow at the lens: spills back onto the head of the torch and
       the fingers, the way a real one lights the hand holding it */
    const glow = new THREE.PointLight(0xffd9a0, 2.2, 0.55, 1.6);
    glow.position.set(0, 0.01, -0.13); g.add(glow);
    /* v11.3: and a FILL over the body. Measured off the file: the base sheet
       is a scuffed blue steel averaging 33/255, which is ~1.5 % linear
       albedo — under a midnight viewmodel rig (hemi 0.35, key 0.25 in
       chapter 3) that is black whatever the maps say, and Chad read it as
       "the texture is missing". A colour lift alone cannot fix it (x5 is
       still a black cut-out, photographed), and a lift big enough to matter
       stops being the file's steel. So a small cool light sits above and
       just in front of the body: bracketed by render at 0.06 / 0.12 / 0.22 /
       1.0 — 1.0 blows the steel out to white, 0.22 is where the head ring,
       the switch and the scuffs read and the torch is still a dark thing in
       a dark place. It travels with the prop, so it only exists while the
       torch is up, and nothing in episode 1 declares one. */
    const fill = new THREE.PointLight(0xc9d4ee, 0.22, 0.6, 1.5);
    fill.position.set(-0.04, 0.16, -0.06); g.add(fill);
    torchProp = g; handsRoot.add(g); layoutHands(); torchPropSync();
  }, () => {})).catch(() => {});
}
function torchPropDrop() {
  if (torchProp) {
    handsRoot.remove(torchProp);
    torchProp.traverse(o => { if (!o.isMesh) return; o.geometry?.dispose?.(); for (const m of (Array.isArray(o.material) ? o.material : [o.material])) { m?.map?.dispose?.(); m?.metalnessMap?.dispose?.(); m?.emissiveMap?.dispose?.(); m?.dispose?.(); } });   // v11.3: the MR and emissive sheets ship too
    torchProp = null;
  }
  torchPropKey = null; torchPropSync();
}
/* Which of the two is drawn is DERIVED, every frame, from three switches
   that belong to three owners: the torch's own state, the prop's arrival,
   and `armR.visible`, which a film or a scene sets to take the hands out
   of shot. The first version wrote `armR.visible` here and put the hand
   back into chapter 3's film the moment the prop landed. */
/* v11.3 (Chad: "make the change more graceful ... the hands can move down
   and the flashlight comes up, kind of like scroll switching weapons in a
   fps game"): one number, `swapK`, 0 = the hand up, 1 = the torch up, chased
   toward its target at SWAP_SECS on WALL time. The two halves are
   SEQUENTIAL in both directions — the thing on screen drops out of frame
   first (k 0→0.5), then the other rises into it (0.5→1) — so nothing is
   ever drawn through anything, and a toggle mid-swap simply reverses. Each
   is drawn only while it is on its way up or up; a chapter with no torch
   model never moves `swapK` and its hand never moves. */
const SWAP_SECS = 0.42, SWAP_DROP = 0.34;
let swapK = 0, swapLast = 0, swapWas = 0;
const smooth = (x) => x * x * (3 - 2 * x);
function torchPropSync() {
  const hold = !!(torchProp && torchOn && torchDecl);
  const now = performance.now();
  const dt = swapLast ? Math.min(0.1, (now - swapLast) / 1000) : 0; swapLast = now;
  const target = hold ? 1 : 0;
  if (!torchProp) swapK = 0;                                   // no prop: the hand stays exactly where it always was
  else if (swapK !== target) swapK = target > swapK ? Math.min(target, swapK + dt / SWAP_SECS) : Math.max(target, swapK - dt / SWAP_SECS);
  const handDown = smooth(Math.max(0, Math.min(1, swapK * 2)));          // 0 up .. 1 dropped out of frame
  const torchUp = smooth(Math.max(0, Math.min(1, (swapK - 0.5) * 2)));   // 0 dropped .. 1 up
  const weaponVis = !!(weaponProp && weaponShown);   // v12.0: the weapon's own hands replace both
  if (torchProp) {
    torchProp.visible = torchUp > 0.001 && armR.visible && !weaponVis;
    torchProp.position.set(torchBase.x, torchBase.y - SWAP_DROP * (1 - torchUp), torchBase.z);
  }
  if (handModel) handModel.visible = handDown < 0.999 && !weaponVis;
  /* the arm is written ONLY while a swap is on (or on the frame it ends,
     to put it back exactly): episode 1's scenes move `armR.position`
     themselves (ch1, ch3, ch4), and a per-frame reset would fight them */
  if (torchProp && (swapK > 0 || swapWas > 0)) armR.position.set(armBase.x, armBase.y - SWAP_DROP * handDown, armBase.z);
  swapWas = swapK;
}
function torchRed(red) { torchIsRed = !!red; torchSet(torchOn); }
/* v11.6: THE TORCH IS AN ITEM. A chapter may declare `torch.item`, an
   inventory id (episode 2 chapter 3 says 'torch'): then the torch exists for
   the PLAYER only while that item is in his hand slot — no button, no F, no
   beam until he has picked it up and equipped it from the bag. A scene or a
   chapter may still call kit.torchOn() whatever the bag says (a film owns
   its light), which is also what keeps a save from before this release
   playable. `hasTorch` on <body> is DERIVED from this, never set by hand,
   and re-read on every inventory change (invPaint, applyState). Episode 1
   declares no torch; the fixture declares one with no item, so nothing
   shipped before this release changes. */
function torchAvail() {
  if (!torchDecl) return false;
  /* v12.3: `player: false` — the light is the SCENES' and nobody else's.
     Episode 2 chapter 4's rifle never leaves his hands (Chad's call at
     v12.2: "Player should not be able to use the torch, or switch to normal
     hands"), and the chapter tried to say so by declaring an inventory item
     it never issued. That held only for a player who arrived without one —
     and the bag carries across a chapter change (restart() resets the run's
     numbers, never the inventory), while episode 2 chapter 3 FORCES the
     torch into the hand slot to be playable at all. So anyone who reached
     chapter 4 the way the episode is played arrived with `inv.gear.hand ===
     'torch'`, and the torch button, F and the whole hand swap were live on
     a live range. A chapter says it outright now; a scene's kit.torchOn()
     is still ungated, because a film owns its own light. */
  if (torchDecl.player === false) return false;
  const id = torchDecl.item; if (!id) return true;
  const slot = (ITEM_DEFS[id] && ITEM_DEFS[id].slot) || 'hand';
  return inv.gear[slot] === id;
}
function torchAvailSync() {
  const ok = torchAvail();
  document.body.classList.toggle('hasTorch', ok);
  if (!ok && torchOn && torchDecl && torchDecl.item) torchSet(false);   // unequipped while it was on: the light goes with it
  if (invUrge && !inv.bag.includes(invUrge)) invUrge = null;         // equipped (or dropped): the bag stops asking
  /* v14.7: every change to what is worn passes through here (the panel's
     paint, the kit's bag verbs, a restore, a new game), and putting the
     amulet on or taking it off is one: its yellow comes and goes with it */
  wardPaint();
}
function torchToggle() {
  if (!torchLight || state !== 'play' || !torchAvail()) return;
  torchSet(!torchOn);
  if (torchDecl.click) snd(torchDecl.click, 0.8); else snd('uiclick', 0.3);   // v11.1: a real switch when the chapter names one
}

/* ---- v12.0: RIFLE MODE — the weapon in his hands ------------------------
   The shape is the torch's (v11.1, v11.6), extended. A chapter declares

     weapon: { model, item, rounds, mags, clips: { draw, shoot, reload, hide },
               rates: { draw, shoot, reload, hide }, shot, reload, empty, cock,
               fireGap, kick }

   `model` is an asset key (docs/E2-SOLDIER-MODELS.md §8: the file is in
   CENTIMETRES, its forward is +Z, and it brings its OWN hands, so while it
   is up the hand viewmodel — and the torch prop — give way to it); `item`
   an inventory id, so the weapon is ISSUED as an item (the v11.6 recipe)
   and is OUT for the player exactly while that item is in his hand slot;
   a film or a scene may force it either way with kit.weaponOut(bool)
   whatever the bag says. FIRE (a click under pointer lock, Space, or the
   HUD button) plays the shoot take from its first frame, spends a round,
   flashes a light on the world for a few frames, and RAYCASTS from the
   lens: the hit goes to the chapter as stage.onShot({ hit, object, point,
   distance, ray }), against stage.shootables() when the chapter lists them
   (else the whole world) — a target is the chapter's to score and the
   ghost the chapter's to answer. RELOAD (R, or the button) costs a magazine.
   Episode 1 declares no weapon, so none of this can run there; the fixture
   declares one with no model, so the seam is proved without the download. */
const WEAPON_DEFAULTS = {
  rounds: 30, mags: 3, fireGap: 0.34, kick: 0.012,
  /* v12.2 — RECOIL, ASSIST AND THE AIM. All five default to nothing, so the
     fixture and anything shipped before this release behave exactly as they
     did; episode 1 declares no weapon at all.
       recoil / recoilYaw  the impulse, in radians, up and sideways
       recover             seconds for it to come back; it returns in FULL,
                           because a permanent climb on targets this small is
                           a punishment, not a feel
       assist              the half-angle of the cone a shot may be off by
                           and still count (see weaponAssistHit)
       zoom                the field of view AIM mode narrows to; 0 = none
     v13.0 (Chad: "you can remove the reload system, ammo count system,
     those are unnecessary and overcomplicate the shooting mechanics ...
     just give the player unlimited ammo with no need for reload"):
       unlimited           the rounds never run out, RELOAD is a no-op and
                           neither the count nor the reload button is drawn.
                           Default false, so the fixture's nine promises and
                           anything shipped before this release are untouched
                           by construction.
       adsSecs             how long the aim takes to come up and go down.
                           v12.2 SNAPPED the lens (Chad: "instead of the view
                           immediately changing to zoomed in, have a real
                           zooming in animation effect"); the rifle carries
                           only Draw / Shoot / Reload / Hide — MEASURED, there
                           is no aim take in the file — so the animation is an
                           eased lens tween with the weapon brought onto the
                           sight line under it, not a clip.
       adsPos              where the weapon goes while the aim is up, in the
                           viewmodel's own metres: the body's centre sits at
                           x 0.12 at its 0.30 m depth (§8), so -0.12 puts the
                           sights on the lens axis.                        */
  recoil: 0, recoilYaw: 0, recover: 0.22, assist: 0, zoom: 0,
  unlimited: false, adsSecs: 0.20, adsPos: [-0.12, 0.028, -0.035],
  /* v13.1 — THE MUZZLE FLASH, Chad's Sketchfab cone. All four default to
     nothing, so the fixture (which declares a weapon with no model at all)
     and episode 1 (which declares no weapon) cannot reach any of it.
       flash      the asset key. The file is two nine-vertex CONE FANS, apex
                  on the origin, opening along -Z, length exactly 1.0, one
                  carrying a four-pointed STAR and the other a rounder
                  BURST — dealt alternately so a magazine's worth of shots
                  is not one picture repeated.
       flashPos   the apex, in `weaponProp`'s own frame, which is plain
                  viewmodel metres. The default is the KRISS Vector's barrel
                  tip MEASURED off its skinned vertices at the engine's own
                  rest pose — getVertexPosition per vertex, never a Box3,
                  because a SkinnedMesh's box is its BIND pose (the v5.21 /
                  v8.4 law). It is measured PER MESH and taken from the gun
                  body alone: the first pass swept the whole prop and landed
                  on the forward HAND, which photographed as a flash over the
                  player's knuckles with the barrel dark above it. The gun
                  body's own most-forward vertex is (0.135, -0.091, -0.741),
                  which projects to (789, 501) on a 1280x800 frame — the
                  muzzle, in the picture, not only in the numbers.
       flashSize  the cone's LENGTH in metres; its rim is 1.09x that across.
       flashSecs  how long it is on screen. `weaponFlashT` already ran the
                  light for 0.09 s and the cone shares that clock. */
  flash: '', flashPos: [0.135, -0.091, -0.741], flashSize: 0.18, flashSecs: 0.09,
  clips: { draw: 'Draw', shoot: 'Shoot', reload: 'Reload', hide: 'Hide' },
  rates: { draw: 2.6, shoot: 1.6, reload: 1.6, hide: 2.6 },
  /* §8's measured placement: scale 0.01 (centimetres), a half turn about Y
     (the file's forward is +Z), and the camera at the model's own eye so
     the cut forearms sit behind the lens */
  scale: 0.01, rot: [0, Math.PI, 0], pos: [0.00, -1.528, -0.32],
  metalness: 0.25, roughness: 0.55, envMapIntensity: 1.6
};
function weaponSetup(decl) {
  weaponDecl = { ...WEAPON_DEFAULTS, ...(decl || {}),
                 clips: { ...WEAPON_DEFAULTS.clips, ...((decl && decl.clips) || {}) },
                 rates: { ...WEAPON_DEFAULTS.rates, ...((decl && decl.rates) || {}) } };
  weaponRounds = Math.max(0, weaponDecl.rounds | 0); weaponMags = Math.max(0, weaponDecl.mags | 0);
  weaponForce = null; weaponBusy = null; weaponLog.length = 0;
  weaponBlockSet(null);                 // v14.3: and a chapter's fire rule is never inherited
  weaponRecoilReset(); weaponAdsOff(); recSeed = 20250917; flashSeed = 20250918;
  if (!weaponFlash) {
    weaponFlash = new THREE.PointLight(0xffd28a, 0, 9, 1.8);
    weaponFlash.position.set(0.12, -0.10, -0.7);
    camera.add(weaponFlash);
  }
  weaponPropLoad(weaponDecl.model);
  weaponFlashLoad(weaponDecl.flash);
  for (const k of ['shot', 'reload', 'empty', 'cock']) if (weaponDecl[k]) WARM_WANT.add(weaponDecl[k]);
  /* v13.0: a chapter with unlimited ammunition draws neither the count nor
     the reload button — the HUD says what the mechanic is, so a player is
     never shown a number that cannot change. */
  document.body.classList.toggle('wpnNoAmmo', !!weaponDecl.unlimited);
  weaponAvailSync();
}
function weaponTeardown() {
  weaponDecl = null; weaponForce = null; weaponBusy = null; weaponRounds = 0; weaponMags = 0;
  weaponBlockSet(null);
  weaponRecoilReset(); weaponAdsOff(); camLens(CAM_FOV);
  if (weaponFlash) { camera.remove(weaponFlash); weaponFlash.dispose?.(); weaponFlash = null; }
  weaponFlashDrop();
  weaponPropDrop();
  document.body.classList.remove('hasWeapon', 'weaponUp', 'wpnNoAmmo');
  weaponAvailSync();
}
function weaponPropLoad(key) {
  if (!key || weaponPropKey === key) return;
  weaponPropDrop(); weaponPropKey = key;
  assetBytes(key, true).then(BUF => new GLTFLoaderMO().parse(BUF, '', (gltf) => {
    if (weaponPropKey !== key) return;
    rescueTextures(gltf, BUF);
    const d = weaponDecl || WEAPON_DEFAULTS;
    const g = new THREE.Group();
    gltf.scene.traverse(o => {
      if (!o.isMesh) return;
      o.frustumCulled = false; o.castShadow = false; o.receiveShadow = false;
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
        /* §8: the weapon's material is FULLY METALLIC (metalness 1.0) and the
           viewmodel scene has almost no environment, so it rendered black;
           the hands are metalness 0 and are left exactly as the file has
           them. The weapon materials only. */
        if (m.metalness !== undefined && m.metalness > 0.5) {
          m.metalness = d.metalness; m.roughness = d.roughness;
          if ('envMapIntensity' in m) m.envMapIntensity = d.envMapIntensity;
        }
        m.needsUpdate = true;
      }
    });
    gltf.scene.scale.setScalar(d.scale);
    gltf.scene.rotation.set(d.rot[0], d.rot[1], d.rot[2]);
    gltf.scene.position.set(d.pos[0], d.pos[1], d.pos[2]);
    g.add(gltf.scene);
    /* a small fill on the steel, the torch's recipe (v11.3): the file's
       gunmetal is dark and the viewmodel rig at midnight barely lights it */
    /* bracketed by render on the night harbour (v12.0: 0.18 / 0.6 / 1.2 /
       2.0, each after a guaranteed rendered frame): at 0.18 the rifle is a
       silhouette with one lit sight; at 0.6 the rail, the receiver and the
       fingers read and it is still a dark thing in a dark place. 0.6. */
    const fill = new THREE.PointLight(0xc9d4ee, 0.6, 0.9, 1.5);
    fill.position.set(-0.05, 0.12, -0.20); g.add(fill);
    weaponMixer = new THREE.AnimationMixer(gltf.scene);
    weaponActs = {};
    for (const k of ['draw', 'shoot', 'reload', 'hide']) {
      const name = d.clips[k];
      const clip = gltf.animations.find(a => a.name === name) || gltf.animations.find(a => a.name.toLowerCase().includes(k));
      if (!clip) continue;
      const a = weaponMixer.clipAction(clip);
      a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.timeScale = d.rates[k] || 1;
      /* WHERE THE TAKE ACTUALLY MOVES. v12.0 found that this file's Draw
         holds every one of its twelve tracks still until 4.17 s of a 4.67 s
         clip, and set the rate for "the half-second that moves" — but an
         action still has to TRAVERSE the dead 4.17 s to get there, which at
         rate 2.6 is 1.6 s of a frozen rifle.
         Shoot is worse, and it is what Chad felt: its keys run 3.37 s to
         3.57 s, so at the shipped rate 3.2 the rifle would first move 1.05 s
         after the trigger — and `fireGap` is 0.42 s, so every shot RESET the
         clip to zero and the moving fifth of a second was never once
         reached. The gun did not budge, at any rate of fire.
         So every take now starts at its own first key, MEASURED here rather
         than assumed, and Shoot's 0.20 s of motion plays in 0.125 s. */
      let t0 = Infinity;
      for (const tr of clip.tracks) if (tr.times && tr.times.length) t0 = Math.min(t0, tr.times[0]);
      /* a MODULE map, not `a.userData`: THREE.AnimationAction has no
         userData, so `a.userData.t0 = ...` is a TypeError — thrown inside
         the GLTFLoader callback, one line before `weaponProp = g`, and
         swallowed whole by the `.catch(() => {})` this loader ends with. The
         rifle simply never appeared and nothing said why (measured: the GLB
         fetched 200, the mixer existed, the prop was null). */
      weaponClipT0[k] = isFinite(t0) ? Math.max(0, t0 - 0.001) : 0;
      weaponActs[k] = a;
    }
    /* a take that ends hands the pose to the DRAWN rest (the draw take's
       last frame), a hard cut — the v5.07 law: a parked take is a pose */
    weaponMixer.addEventListener('finished', e => {
      if (!weaponActs) return;
      if (e.action === weaponActs.hide) { weaponShown = false; weaponBusy = null; weaponPropSync(); return; }
      if (e.action !== weaponActs.draw) weaponPark();
      weaponBusy = null;
    });
    weaponProp = g; g.visible = false; handsRoot.add(g); layoutHands();
    weaponFlashPlace();          // either half may land first
    weaponPropSync();
  }, e => console.error('weapon model parse failed', e)))
    .catch(e => console.error('weapon model load failed', e));
}
/* ------------------------------------------------- v13.1 the muzzle flash
   The cone is loaded on its own and hung off `weaponProp`, so it inherits
   the aim's slide and the v11.3 weapon swap for free. Either half may land
   first — the model is a separate fetch — so `weaponFlashPlace()` is
   idempotent and both loaders call it.

   The materials are REPLACED with unlit additive ones. A flash is not a
   thing the scene lights; it is the thing lighting the scene, and the two
   sheets are paintings on BLACK, which is exactly what additive blending
   wants (black adds nothing, the core glows) — which is also why the prep
   tool could throw the alpha channel away. `toneMapped: false` keeps the
   renderer's ACES curve off it, or a flash meant to be white arrives grey.

   The rescue is the awkward part and is handled rather than hoped: under
   the strict CSP `rescueTextures` writes `.map` onto the material objects
   the PARSER made, asynchronously, and by then the meshes are wearing ours.
   So we keep a parser-material -> ours map and its `onMap` callback carries
   the texture across; the synchronous path (`src.map` already set) is taken
   at build time. Neither alone is enough. */
function weaponFlashLoad(key) {
  if (!key) { weaponFlashDrop(); return; }
  if (weaponFlashKey === key) return;
  weaponFlashDrop(); weaponFlashKey = key;
  assetBytes(key, true).then(BUF => new GLTFLoaderMO().parse(BUF, '', (gltf) => {
    if (weaponFlashKey !== key) return;       // a chapter changed under the fetch
    const mine = new Map();
    const cards = [];
    gltf.scene.traverse(o => {
      if (!o.isMesh) return;
      const src = Array.isArray(o.material) ? o.material[0] : o.material;
      /* depthTest FALSE, deliberately. The weapon is drawn first and writes
         depth, and the flash's apex sits AT the barrel — measured off the
         mesh, the most-forward vertex is the muzzle's own face, so parts of
         a cone opening from it are behind the gun's silhouette from the
         lens and were being occluded by the thing that fired them. That is
         also just what a muzzle flash is: light, not an object the barrel
         can hide. renderOrder 8 puts it after the weapon in the same pass,
         so it lays over the gun and nothing else. */
      const b = new THREE.MeshBasicMaterial({
        map: src && src.map ? src.map : null, color: 0xffffff,
        blending: THREE.AdditiveBlending, transparent: true, opacity: 1,
        depthWrite: false, depthTest: false, side: THREE.DoubleSide,
        toneMapped: false, fog: false,
      });
      if (src) mine.set(src, b);
      o.material = b;
      o.frustumCulled = false; o.castShadow = false; o.receiveShadow = false;
      o.renderOrder = 8;                      // after the rifle, which writes depth
      o.visible = false;
      cards.push(o);
    });
    rescueTextures(gltf, BUF, (mat) => {
      const b = mine.get(mat);
      if (b && mat.map) { b.map = mat.map; b.needsUpdate = true; }
    });
    const g = new THREE.Group();
    g.add(gltf.scene); g.visible = false;
    weaponFlashObj = g; weaponFlashCards = cards; weaponFlashN = 0;
    weaponFlashPlace();
  }, e => console.error('muzzle flash parse failed', e)))
    /* NEVER a silent catch on an asset loader (the v12.2 law: a TypeError
       inside a GLTFLoader callback made the rifle simply not exist) */
    .catch(e => console.error('muzzle flash load failed', e));
}
function weaponFlashPlace() {
  if (!weaponFlashObj || !weaponProp) return;
  if (weaponFlashObj.parent !== weaponProp) weaponProp.add(weaponFlashObj);
  const d = weaponDecl || WEAPON_DEFAULTS;
  weaponFlashObj.position.fromArray(d.flashPos);
  weaponFlashObj.scale.setScalar(d.flashSize);
}
function weaponFlashDrop() {
  if (weaponFlashObj) {
    if (weaponFlashObj.parent) weaponFlashObj.parent.remove(weaponFlashObj);
    weaponFlashObj.traverse(o => {
      if (!o.isMesh) return;
      o.geometry?.dispose?.();
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) { m?.map?.dispose?.(); m?.dispose?.(); }
    });
  }
  weaponFlashObj = null; weaponFlashKey = null; weaponFlashCards = []; weaponFlashN = 0;
}
/* one shot's worth: deal the NEXT card, roll it about the bore, show it.
   The roll and the deal are both deterministic so a probe can reproduce a
   magazine exactly — on the flash's OWN stream, deliberately, so that the
   recoil's sideways scatter comes out bit-identical to v13.0 and the feel
   Chad already signed off on is not perturbed by a cosmetic addition. */
let flashSeed = 20250918;
function weaponFlashFire() {
  if (!weaponFlashCards.length) return;
  const i = weaponFlashN++ % weaponFlashCards.length;
  for (let k = 0; k < weaponFlashCards.length; k++) weaponFlashCards[k].visible = (k === i);
  flashSeed = (flashSeed * 1103515245 + 12345) & 0x7fffffff;
  weaponFlashCards[i].rotation.z = (flashSeed / 0x7fffffff) * Math.PI * 2;
}
function weaponPropDrop() {
  wpnRestRotX = null;   // v14.4: the next prop reads its own rest, not this one's
  if (weaponProp) {
    /* the flash is a CHILD of the prop and outlives it — take it out before
       the sweep below, which disposes every mesh it can reach */
    if (weaponFlashObj && weaponFlashObj.parent) weaponFlashObj.parent.remove(weaponFlashObj);
    handsRoot.remove(weaponProp);
    weaponMixer?.stopAllAction();
    weaponProp.traverse(o => { if (!o.isMesh) return; o.geometry?.dispose?.(); for (const m of (Array.isArray(o.material) ? o.material : [o.material])) { m?.map?.dispose?.(); m?.metalnessMap?.dispose?.(); m?.dispose?.(); } });
    weaponProp = null;
  }
  weaponMixer = null; weaponActs = null; weaponPropKey = null; weaponShown = false; weaponClipT0 = {};
}
function weaponPlay(k) {
  if (!weaponActs || !weaponActs[k]) return false;
  for (const a of Object.values(weaponActs)) a.stop();
  const a = weaponActs[k];
  a.reset().play();
  a.time = weaponClipT0[k] || 0;   // v12.2: begin where the take moves
  weaponMixer.update(0);
  return true;
}
function weaponPark() {   // the drawn rest: the draw take's last frame, held
  if (!weaponActs || !weaponActs.draw) return;
  for (const a of Object.values(weaponActs)) a.stop();
  const a = weaponActs.draw; a.reset().play(); a.time = a.getClip().duration - 0.001; a.paused = true;
  weaponMixer.update(0);
}
function weaponAvail() {
  if (!weaponDecl) return false;
  const id = weaponDecl.item; if (!id) return true;
  const slot = (ITEM_DEFS[id] && ITEM_DEFS[id].slot) || 'hand';
  return inv.gear[slot] === id;
}
function weaponWant() { return !!weaponDecl && (weaponForce === null ? weaponAvail() : !!weaponForce); }
function weaponAvailSync() {
  document.body.classList.toggle('hasWeapon', weaponAvail());
  weaponPropSync();
}
/* which of hand / torch / weapon is drawn is DERIVED on the frame (v11.1's
   law): the weapon's own arms replace both the hand and the torch prop while
   it is up; a film's `armR.visible = false` takes it out of shot too */
function weaponPropSync() {
  const want = weaponWant();
  document.body.classList.toggle('weaponUp', want && state === 'play');
  if (!weaponProp) { weaponShown = false; return; }
  if (want && !weaponShown) {
    weaponShown = true; weaponBusy = 'draw';
    if (!weaponPlay('draw')) { weaponBusy = null; }
  } else if (!want && weaponShown && weaponBusy !== 'hide') {
    weaponBusy = 'hide';
    if (!weaponPlay('hide')) { weaponShown = false; weaponBusy = null; }
  }
  weaponProp.visible = weaponShown && armR.visible;
}
let weaponWall = 0;
function weaponFrame(dt) {
  if (!weaponDecl) { weaponWall = 0; return; }
  /* v12.2: DERIVED ON THE FRAME (v11.1's law). `weaponUp` was set only by
     weaponAvailSync/weaponSetup, and neither runs on the transition INTO
     play — so a chapter whose weapon needs no inventory item arrived in play
     with no `weaponUp` on <body>, which means no weapon HUD, no FIRE button
     and no reticle, measured on the shipped build: body was
     "finePtr hasWeapon cardup inplay" at the first frame with weaponIsOut()
     already true. A phone player had the rifle in his hands and no way to
     pull the trigger. The sync is idempotent and only acts on a change. */
  weaponPropSync();
  /* v12.3: AND THE AIM. `weaponAdsSync` was called only from the toggle, so
     nothing put the lens back when the state left play: aim down the sights,
     let the bell ring, and the decision card opened over a 2.4x zoomed range
     with `body.weaponAds` still on. It is idempotent and camLens is a no-op
     at an unchanged fov, so calling it on the frame is the whole fix. */
  weaponAdsSync();
  /* v12.3: the take and the muzzle flash run on WALL time. `dt` is clamped
     to 0.05 s, so on a phone under 20 fps the mixer advanced at half real
     speed or less and a 2.3 s reload locked the hands for four or five real
     seconds — and that is worst exactly when the phone is hot, the only
     condition Chad plays in (the v9.3 march law, met on the viewmodel). */
  const wnow = clock.getElapsed();
  const wdt = weaponWall ? Math.min(0.5, wnow - weaponWall) : 0.016;
  weaponWall = wnow;
  weaponAdsStep(wdt);          // v13.0: the aim eases in and out on that same clock
  /* v14.4: AND IN A CUTSCENE THE SPRING DRIVES THE GUN. `kit.weaponShot`'s
     comment says it fires "the WEAPON's own spring, and deliberately not
     `weaponDecl.kick`" — but there was no weapon spring: `weaponRecoilFire`
     only accumulates `recP`/`recY`, and the single consumer sits inside the
     main loop's `if (state === 'play')` branch and writes the CAMERA. In a
     cutscene the `else` branch ran instead, and it ran BEFORE `cineUpdate`,
     so every impulse a scene set on frame N was zeroed on frame N+1 with
     `recPrevP` still 0 — nothing was ever applied anywhere. Scene C's three
     rifle shots had the flash, the light, the take and the report, and the
     gun did not move.
     Here it is the PROP that moves, which is what the comment always meant:
     rotation written ABSOLUTELY from the model's own rest (so nothing
     accumulates) and the body pushed back along its own z, on top of the
     place `weaponAdsStep` has just set. In play this is a no-op — the
     camera path at the bottom of the frame owns the spring there and the
     feel Chad signed off on at v12.2 is untouched. */
  if (state === 'cine') weaponRecoilStep(wdt);
  if (weaponProp) {
    if (wpnRestRotX === null) wpnRestRotX = weaponProp.rotation.x;
    const k = state === 'cine' ? recP : 0;
    weaponProp.rotation.x = wpnRestRotX - k * 1.6;
    if (k) weaponProp.position.z += k * 0.10;
  }
  if (weaponMixer && weaponShown) weaponMixer.update(Math.min(wdt, 0.1));
  {
    const fSecs = (weaponDecl.flashSecs || 0.09);
    /* THE FLASH IS OWED ONE FRAME. `wdt` is WALL time, so on a box drawing a
       frame a second — a starved probe, and a phone that has got hot enough,
       which is the only condition Chad plays in — a 0.07 s flash expires
       before the next frame is ever drawn, and the player pulls the trigger
       and sees nothing. Measured: photographed after a shot on this box, the
       rifle was there and the cone was not. So the first frame after a shot
       draws at full and does not decay; the clock only starts on the second.
       A flash that is sometimes skipped is not a shorter flash, it is a bug.
       (This is the v9.3 clock law in its third form: not "use wall time" but
       "wall time alone cannot express a thing that must be SEEN".) */
    if (weaponFlashT > 0 && !weaponFlashDrawn) weaponFlashDrawn = true;
    else weaponFlashT = Math.max(0, weaponFlashT - wdt);
    const k = weaponFlashT > 0 ? weaponFlashT / fSecs : 0;     // 1 at the trigger, 0 when it is over
    if (weaponFlash) {
      weaponFlash.intensity = 34 * k;
      weaponFlash.visible = k > 0;
    }
    /* v13.1: the CONE. It comes on at full and falls away over the same
       window — `k ** 0.55` holds it bright and then drops, which is how a
       flash actually reads, where a linear fade reads as a lamp switched
       off. It also grows a little as it goes, because the gas does. */
    if (weaponFlashObj) {
      weaponFlashObj.visible = k > 0 && weaponProp !== null && weaponShown;
      if (weaponFlashObj.visible) {
        const o = Math.pow(k, 0.55);
        const d = weaponDecl.flashSize || WEAPON_DEFAULTS.flashSize;
        weaponFlashObj.scale.setScalar(d * (1 + 0.18 * (1 - k)));
        for (const c of weaponFlashCards) if (c.visible) c.material.opacity = o;
      }
    }
  }
  /* the busy flag is stated in the TAKE's clock, never the wall's: the
     first version timed it out on wall time and a probe box that draws a
     frame every six seconds cleared a 2.3 s reload on the frame after it
     began (v9.3's clock-mismatch law, on a flag). A take that is no longer
     running — finished, or never started because the rig has no such clip —
     releases the hands; the 'finished' listener below does the same a frame
     earlier for the common case. */
  if (weaponBusy && weaponBusy !== 'hide') {
    const a = weaponActs && weaponActs[weaponBusy];
    if (!a || !a.isRunning()) weaponBusy = null;
  }
  const pill = $('ammo');
  if (pill && !weaponDecl.unlimited) {
    const txt = weaponRounds + ' / ' + weaponMags;
    if (pill.textContent !== txt) pill.textContent = txt;
    pill.classList.toggle('empty', weaponRounds === 0);
  }
}
/* v12.2 — RECOIL. Chad: "there is no proper recoil when shooting."
   v12.0's whole answer was one line: `pitch.rotation.x += weaponDecl.kick`
   at 0.016 rad. That is 0.9 of a degree, which on a 72-degree lens is ten
   pixels of a phone screen — imperceptible as a kick — and it NEVER CAME
   BACK, so twenty rounds walked the aim 18 degrees up the range while each
   individual shot felt like nothing. Both halves wrong.

   What a kick actually is: a hard impulse and a spring back. The offset is
   held here and applied to the camera as a DELTA every frame, so the
   player's own look still owns the base and the sum of the deltas is zero
   by the time it has settled — the shot punches and the sights come home. */
let recP = 0, recY = 0, recPrevP = 0, recPrevY = 0, recSeed = 20250917;
let wpnRestRotX = null;   // v14.4: the prop's own rest pitch, read once from the model
function weaponRecoilFire() {
  const d = weaponDecl; if (!d) return;
  recP += d.recoil || 0;
  /* a deterministic sideways scatter: a probe that fires ten rounds has to
     be able to read the same ten numbers back */
  recSeed = (recSeed * 1103515245 + 12345) & 0x7fffffff;
  recY += ((recSeed / 0x7fffffff) * 2 - 1) * (d.recoilYaw || 0);
}
/* returns this frame's delta and advances the spring. WALL time, because
   `dt` is clamped to 0.05 s and a recoil on the clamped clock would take
   four times as long to settle on a hot phone as on a desktop — and the
   phone is the one device it has to feel right on (v9.3's clock law). */
function weaponRecoilStep(dtWall) {
  if (!weaponDecl || (!recP && !recY && !recPrevP && !recPrevY)) return null;
  const k = Math.exp(-dtWall / Math.max(0.02, weaponDecl.recover || 0.22));
  recP *= k; recY *= k;
  if (Math.abs(recP) < 1e-5) recP = 0;
  if (Math.abs(recY) < 1e-5) recY = 0;
  const dp = recP - recPrevP, dy = recY - recPrevY;
  recPrevP = recP; recPrevY = recY;
  return { dp, dy };
}
function weaponRecoilReset() { recP = recY = recPrevP = recPrevY = 0; }

/* v12.2 — AIM MODE. The boards on episode 2 chapter 4's range stand at 62,
   98 and 132 metres and are 1.05 m by 1.5 m, which through a 72-degree
   VERTICAL lens on a 390x844 phone is 11x16 pixels at the near bank and
   5x8 at the far one. No amount of steadiness makes that aimable, so a
   chapter with a `zoom` gets a second field of view. The look's own
   sensitivity scales with it in the frame, or a narrow lens is unusably
   twitchy. */
let weaponAds = false;
/* v12.3: it hands back only the lens it TOOK. This runs on every frame now
   (weaponFrame), and `tick` keeps running the world block under a cutscene —
   so an unconditional `camLens(CAM_FOV)` would re-assert the wide lens on
   every frame of a film and fight `api.lens`, the v6.12 macro seam. No
   episode-2 scene uses `lens` today and episode 1 declares no weapon, so
   nothing shipping could have hit it; `adsLens` is what keeps it that way. */
let adsLens = false;
/* v13.0 — THE AIM IS AN ANIMATION. Chad: "instead of the view immediately
   changing to zoomed in, have a real zooming in animation effect. If the gun
   has an aiming animation, use that." The gun has no aiming animation — the
   file carries exactly four takes, Draw / Shoot / Reload / Hide (measured;
   E2-SOLDIER-MODELS 8) — so the animation is made of the two things that are
   actually there: the LENS eases from the world's own field of view to the
   chapter's `zoom` over `adsSecs`, and the weapon is brought onto the sight
   line under it (`adsPos`). `adsK` is the one number both read, stepped on
   WALL time because `dt` is clamped to 0.05 s and an aim that takes four
   times as long on a hot phone is the v9.3 clock bug in a third place. */
let adsK = 0;
function adsWantK() {
  return (weaponAds && !!weaponDecl && weaponDecl.zoom > 0 && state === 'play' && weaponWant()) ? 1 : 0;
}
function weaponAdsSync() { document.body.classList.toggle('weaponAds', adsWantK() === 1); }
function weaponAdsStep(dtWall) {
  if (!weaponDecl) return;
  const want = adsWantK();
  const step = dtWall / Math.max(0.01, weaponDecl.adsSecs || 0.2);
  adsK = want > adsK ? Math.min(want, adsK + step) : Math.max(want, adsK - step);
  const e = adsK * adsK * (3 - 2 * adsK);          // smoothstep: it leaves and arrives at rest
  if (adsK > 0 && weaponDecl.zoom > 0) {
    camLens(CAM_FOV + (weaponDecl.zoom - CAM_FOV) * e);
    adsLens = true;
  } else if (adsLens) { camLens(CAM_FOV); adsLens = false; }
  if (weaponProp) {
    /* v13.0: the aim's X is an ABSOLUTE place, not an offset — `adsPos[0]` is
       where the weapon has to BE for its sights to sit on the lens axis, and
       `layoutHands` has already nosed the rest inward on a portrait phone
       (v12.0). Added, the two stacked: photographed at 390 px the rifle sat at
       −0.2028 and the sights were off the left edge with the reticle alone in
       the middle. Interpolating from the rest TO the place lands both crops on
       the same sight picture. Y and Z stay deltas, because the rest is 0 in
       both and the two readings are the same number there. */
    const o = weaponDecl.adsPos || [0, 0, 0];
    weaponProp.position.set(weaponBase.x + (o[0] - weaponBase.x) * e,
                            weaponBase.y + o[1] * e,
                            weaponBase.z + o[2] * e);
  }
}
function weaponAdsToggle() {
  if (!weaponDecl || !(weaponDecl.zoom > 0) || state !== 'play' || !weaponWant()) return;
  weaponAds = !weaponAds;
  weaponAdsSync();
  snd('uiclick', 0.28);
}
function weaponAdsOff() { if (weaponAds) { weaponAds = false; document.body.classList.remove('weaponAds'); } adsLens = false; adsK = 0; }
let retHitT = 0;
const weaponRay = new THREE.Raycaster();
const _asA = new THREE.Vector3(), _asB = new THREE.Vector3(), _asS = new THREE.Sphere();
/* THE ASSIST. A single ray through the exact centre pixel is the right model
   for a thing you can see; it is the wrong one for a five-pixel figure in
   the dark. When the ray itself misses, every listed target is measured for
   how far OFF-AXIS its centre is, in radians, and the nearest one inside the
   cone counts. It is the standard console answer and it is invisible: the
   player aims at the shape and the shape falls. */
function weaponAssistHit(list, cone) {
  if (!cone || !list || !list.length) return null;
  const o = weaponRay.ray.origin, dir = weaponRay.ray.direction;
  let best = null, bestAng = cone;
  for (const obj of list) {
    if (!obj || obj.visible === false || !obj.geometry) continue;
    if (!obj.geometry.boundingSphere) obj.geometry.computeBoundingSphere();
    if (!obj.geometry.boundingSphere) continue;
    _asS.copy(obj.geometry.boundingSphere);
    obj.updateWorldMatrix(true, false);
    _asS.applyMatrix4(obj.matrixWorld);
    _asA.copy(_asS.center).sub(o);
    const dist = _asA.length();
    if (dist < 0.001) continue;
    /* the angle off the line of sight, LESS the angle the target itself
       subtends — a big near thing is easier to hit than a small far one,
       which is what a player expects */
    const ang = Math.max(0, _asA.angleTo(dir) - Math.atan2(_asS.radius, dist));
    if (ang < bestAng) {
      bestAng = ang;
      best = { object: obj, distance: dist,
               point: _asB.copy(dir).multiplyScalar(dist).add(o).clone() };
    }
  }
  return best;
}
/* the refusal: the words under the reticle, a sound and a hard buzz, and
   the press eaten. It is RATE-LIMITED rather than fired on every press —
   a held trigger would otherwise restart the entry animation sixty times a
   second and read as a flicker — but the element's animation IS restarted
   on each refusal past that window, so a second, deliberate press is
   visibly answered rather than silently ignored. On WALL time, because a
   hot phone's dt is clamped (the v7.4 law). */
function weaponBlockSay() {
  const el = weaponBlockEl || (weaponBlockEl = $('nofire'));
  if (!el) return;
  const now = performance.now();
  if (now - weaponBlockShown < 900) return;
  weaponBlockShown = now;
  el.textContent = weaponBlock;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  clearTimeout(weaponBlockT);
  weaponBlockT = setTimeout(() => el.classList.remove('on'), 2200);
  snd('hudfail', 0.55);
  haptic([28, 50, 28]);
}
function weaponBlockSet(msg) {
  weaponBlock = (msg === null || msg === undefined || msg === '') ? null : String(msg);
  document.body.classList.toggle('wpnBlocked', !!weaponBlock);
  if (!weaponBlock) {
    const el = weaponBlockEl || (weaponBlockEl = $('nofire'));
    if (el) el.classList.remove('on');
    clearTimeout(weaponBlockT);
    weaponBlockShown = 0;
  }
}
function weaponFire() {
  if (!weaponDecl || state !== 'play' || !weaponWant()) return false;
  /* the chapter's own rule, before anything is spent: no round, no take,
     no flash, no raycast — and the reason on the screen */
  if (weaponBlock) { weaponBlockSay(); return false; }
  if (weaponBusy && weaponBusy !== 'draw') return false;   // a reload or a holster owns the hands; the draw does not stop a shot
  const now = performance.now();
  if (now - weaponLastFire < weaponDecl.fireGap * 1000) return false;
  weaponLastFire = now;
  if (!weaponDecl.unlimited && weaponRounds <= 0) {
    if (weaponDecl.empty) snd(weaponDecl.empty, 0.7); else snd('uiclick', 0.3);
    haptic(20);
    weaponLog.push({ t: now, hit: null, empty: true });
    return false;
  }
  if (!weaponDecl.unlimited) weaponRounds--;
  /* THROUGH weaponPlay, not around it: this line used to reset and play the
     action itself, which meant it started at time 0 and never reached the
     Shoot take's first key at 3.37 s — so v12.2's whole clip-start fix was
     inert on the one take it was written for. */
  if (weaponPlay('shoot')) weaponBusy = null;
  if (weaponDecl.shot) snd(weaponDecl.shot, 1);
  haptic([30, 20, 40]);
  weaponFlashT = weaponDecl.flashSecs || 0.09;
  weaponFlashDrawn = false;                   // v13.1: it owes the screen one frame
  weaponFlashFire();                          // and the cone the player sees
  if (weaponDecl.kick) pitch.rotation.x = Math.min(pitchHi, pitch.rotation.x + weaponDecl.kick);
  weaponRecoilFire();
  weaponRay.setFromCamera({ x: 0, y: 0 }, camera);
  const list = (stage && typeof stage.shootables === 'function') ? (stage.shootables() || []) : null;
  let hit = null;
  try {
    const hits = list ? weaponRay.intersectObjects(list, true) : weaponRay.intersectObjects(scene.children, true);
    hit = hits.find(h => h.object && h.object.visible !== false) || null;
  } catch { hit = null; }
  /* the ray missed: give the shot the cone the chapter asked for */
  if (!hit && list && weaponDecl.assist) hit = weaponAssistHit(list, weaponDecl.assist);
  const report = { hit: !!hit, object: hit ? hit.object : null, point: hit ? hit.point.clone() : null,
                   distance: hit ? hit.distance : Infinity, ray: weaponRay.ray.clone(), rounds: weaponRounds, mags: weaponMags };
  weaponLog.push({ t: now, hit: hit ? (hit.object.name || hit.object.type) : null, dist: hit ? +hit.distance.toFixed(2) : null });
  /* v12.2: the reticle answers. On a range where the target is sixteen
     pixels tall there is otherwise no way to tell a hit from a miss until
     the board falls a quarter of a second later. */
  if (hit) {
    const ret = $('reticle');
    if (ret) {
      ret.classList.remove('hit'); void ret.offsetWidth; ret.classList.add('hit');
      clearTimeout(retHitT);
      retHitT = setTimeout(() => ret.classList.remove('hit'), 280);   // or it stays red for the rest of the chapter
    }
  }
  if (stage && typeof stage.onShot === 'function') { try { stage.onShot(report); } catch (e) { console.error(e); } }
  return true;
}
function weaponReload() {
  if (!weaponDecl || state !== 'play' || !weaponWant()) return false;
  /* v13.0: silently, not with the empty click — there is nothing to reload
     and nothing on screen asking for it */
  if (weaponDecl.unlimited) return false;
  if (weaponBusy && weaponBusy !== 'draw') return false;
  if (weaponMags <= 0 || weaponRounds >= (weaponDecl.rounds | 0)) { if (weaponDecl.empty) snd(weaponDecl.empty, 0.5); return false; }
  weaponMags--; weaponRounds = weaponDecl.rounds | 0;
  if (weaponDecl.reload) snd(weaponDecl.reload, 0.9);
  haptic(40);
  weaponBusy = 'reload';
  if (!weaponPlay('reload')) weaponBusy = null;
  return true;
}

/* ---- presence: the drain without a ghost ---------------------------------
   A chapter with ghost: null says how near the unseen thing is (0..1) and the
   DRAIN reads it. Her loops, her whisper and her banner stay hers — they read
   `reveal`/`hauntK`, which a switched-off ghost keeps at zero. The banner's
   words change for this case: "Something is here", not "Ghost spotted". */
function presenceDrainRate() {
  if (state !== 'play' || chapterPresence <= 0.01) return 0;
  const k = chapterPresence;
  return (DRAIN_FAR + (DRAIN_NEAR - DRAIN_FAR) * k * k) * k;
}

/* ---- conduct: what play did, on the card --------------------------------- */
function kitConduct(d) {
  if (!d) return;
  /* v14.13: a chapter's own price for a failed minigame, marked so, is cut
     by the minigame guard like the engine's own (evCut) */
  const cut = v => (d.minigame ? evCut(v) : v);
  conductAcc.s = Math.max(-CONDUCT_CAP, Math.min(CONDUCT_CAP, conductAcc.s + cut(+d.s || 0)));
  conductAcc.a = Math.max(-CONDUCT_CAP, Math.min(CONDUCT_CAP, conductAcc.a + cut(+d.a || 0)));
  if (d.note && !conductAcc.notes.includes(String(d.note))) conductAcc.notes.push(String(d.note));
}
function conductTake() {
  const s = Math.round(conductAcc.s), a = Math.round(conductAcc.a);
  const out = (s || a || conductAcc.notes.length) ? { s, a, notes: conductAcc.notes.slice() } : null;
  conductAcc.s = 0; conductAcc.a = 0; conductAcc.notes.length = 0;
  return out;
}
function paintConduct(cd) {
  const el = $('conduct'); if (!el) return;
  if (!cd) { el.classList.add('hide'); el.textContent = ''; return; }
  const sg = v => (v >= 0 ? '+' : '') + v;
  const parts = [];
  if (cd.s) parts.push(sg(cd.s) + ' ' + T('hud.sanity'));
  if (cd.a) parts.push(sg(cd.a) + ' ' + T('hud.awareness'));
  /* v13.2: a LIST, not a paragraph. Built with createElement rather than
     innerHTML because a note is chapter text and the sheet can put anything
     in it — the same reason every other string in this file reaches the
     screen through textContent. */
  el.textContent = '';
  const h = document.createElement('span'); h.className = 'chead'; h.textContent = T('card.conduct');
  el.appendChild(h);
  if (cd.notes.length) {
    const ul = document.createElement('ul');
    for (const n of cd.notes) { const li = document.createElement('li'); li.textContent = n; ul.appendChild(li); }
    el.appendChild(ul);
  }
  if (parts.length) {
    const t = document.createElement('span'); t.className = 'ctot'; t.textContent = parts.join(' · ');
    el.appendChild(t);
  }
  el.classList.remove('hide');
}
/* a stat moved by play, with the same tick the drain uses */
function kitAward(stat, delta, opts) {
  if (!(stat in stats) || !Number.isFinite(delta) || !delta) return;
  if (opts && opts.minigame) delta = evCut(delta);   // v14.13: a chapter's minigame price, cut by the guard
  if (stat === 'sanity' && delta < 0) delta = -wardSoak(-delta, true);   // v14.7: the amulet takes it first
  const before = stats[stat];
  stats[stat] = Math.max(0, Math.min(100, stats[stat] + delta));
  const moved = stats[stat] - before;
  if (stat === 'sanity' && moved < 0) sanityTick(Math.round(-moved));
  syncBars();
  if (stats.sanity <= 0 && state === 'play') lose();
}

/* ---- pose: lying down in play ------------------------------------------ */
function kitPoseSet(name, opts = {}) {
  name = name === 'lying' ? 'lying' : 'standing';
  if (name === kitPose && poseT >= 1) return;
  kitPose = name;
  poseFrom = yaw.position.y;
  poseTo = name === 'lying' ? (opts.y ?? 0.60) : 1.62;
  poseT = 0; poseSecs = Math.max(0.05, opts.secs ?? 0.9);
  if (name === 'lying') {
    lieYaw = Number.isFinite(opts.yaw) ? opts.yaw : yaw.rotation.y;
    lieSpan = opts.span ?? 1.1;
    pitchLo = opts.pitchLo ?? -0.35; pitchHi = opts.pitchHi ?? 1.35;
    vel.set(0, 0, 0);
  } else { pitchLo = -1.2; pitchHi = 1.2; }
}

/* ---- daylight, tweened in play ------------------------------------------ */
let dayNow = null;
function applyDaylight(over) {
  dayNow = { ...SKY_NIGHT, ...(CH.daylight || {}), ...(over || {}) };
  dayTween = null;
  applyDaylightD(dayNow);
}
function daylightTo(preset, secs) {
  const to = { ...SKY_NIGHT, ...(CH.daylight || {}), ...(preset || {}) };
  if (!(secs > 0)) { dayNow = to; dayTween = null; applyDaylightD(to); return; }
  dayTween = { from: dayNow || { ...SKY_NIGHT, ...(CH.daylight || {}) }, to, t: 0, secs };
}
function dayMix(a, b, k) {
  const col = (x, y) => _c1.setHex(x).lerp(_c2.setHex(y), k).getHex();
  const n = (x, y) => x + (y - x) * k;
  const arr = (x, y, isCol) => x.map((v, i) => (isCol[i] ? col(v, y[i]) : n(v, y[i])));
  const stops = a.stops.length === b.stops.length
    ? a.stops.map((s, i) => [n(s[0], b.stops[i][0]),
        '#' + _c1.set(s[1]).lerp(_c2.set(b.stops[i][1]), k).getHexString()])
    : (k < 0.5 ? a.stops : b.stops);
  return {
    stops, bg: col(a.bg, b.bg), fog: arr(a.fog, b.fog, [1, 0]),
    hemi: arr(a.hemi, b.hemi, [1, 1, 0]), key: arr(a.key, b.key, [1, 0, 0, 0, 0]),
    fill: arr(a.fill, b.fill, [1, 0]), stars: n(a.stars, b.stars), moon: n(a.moon, b.moon),
    sun: n(a.sun, b.sun), clouds: n(a.clouds, b.clouds),
    vmHemi: arr(a.vmHemi, b.vmHemi, [1, 1, 0]), vmKey: arr(a.vmKey, b.vmKey, [1, 0])
  };
}

/* ---- the decision clock -------------------------------------------------- */
function decisionClockStart() {
  const el = $('dclock'); if (!el) return;
  if (!decClock) { el.classList.add('hide'); return; }
  decClock.left = decClock.secs; decClock.fired = false;
  el.querySelector('i').style.width = '100%';
  el.classList.remove('hide');
}
function decisionClockStop() { decClock = null; $('dclock')?.classList.add('hide'); }

/* ---- haptics ------------------------------------------------------------- */
function haptic(pattern) { try { navigator.vibrate?.(pattern || 40); } catch {} }

/* ---- events -------------------------------------------------------------- */
const EV_DEFAULT = {
  tap:       { secs: 4 },
  timed:     { open: 2.0, close: 3.4, secs: 0 },
  mash:      { secs: 8, start: 0.55, decay: 0.32, gain: 0.09 },
  hold:      { secs: 6, grace: 1.5, drift: 28, lookTol: 0.9 },
  stabilise: { secs: 5, grace: 1.5, tol: 3.0, pass: 0.35 },
  /* v9.4: a heartbeat SPEEDS UP. Chad: "It should get faster and faster per
     beat." `accel` multiplies the gap after every beat, floored at
     `minPeriod` so it cannot outrun a thumb. */
  /* v9.7: `win` and `zone` together decide the real millisecond windows, and
     the shipped pair was unplayable — see `evGrade`. 0.26/5.8 gives PERFECT
     within 45 ms, GREAT 106, GOOD 181, SLIGHT 302, BROKEN only past 513, with
     the beat's own acceptance window (`win`) closing at 260. `zone` here is
     far outside the trial's 0.82-0.30 difficulty scale on purpose: for this
     one kind `win` is a REAL window in SECONDS — it also decides how long the
     beat stays open and normalises the ring's overshoot — so it cannot be
     stretched to carry the grading spread, and `zone` carries it instead. */
  heartbeat: { n: 5, bpm: 64, win: 0.26, zone: 5.8, lead: 1.2, accel: 0.93,
               minPeriod: 0.55, pass: 0.6, tick: true },
  /* v9.4: DRAG AND MATCH. Items on the left, slots on the right, dragged one
     onto the other; scored on how FAST the whole set is laid, with a wrong
     drop costing the stat on the spot. */
  match:     { secs: 45, wrongCost: 4, fast: 12, slow: 34, pass: 1 },
  focus:     { n: 5, each: 1.6, tol: 90, pass: 0.6 },
  sequence:  { each: 1.2, accel: 0.86, minEach: 0.45, pass: 0.6 }
};
// the literals texttest looks for; the kind picks the row
const EV_LABEL = { tap: 'event.tap', timed: 'event.timed', mash: 'event.mash', hold: 'event.hold',
                   stabilise: 'event.stabilise', heartbeat: 'event.heartbeat', focus: 'event.focus',
                   sequence: 'event.sequence', match: 'event.match' };
/* ------------------------------------------------------ v9.3 · THE LADDER
   Chad, of the minigames: "no stakes, no damage, no repercussions ... they
   were supposed to require precise timing to pass, and every mistimed tap or
   click should have penalties or damage ... Your current one is sloppy work."

   He was right, and the cause was one line: `sequence` scored
   `case 'sequence': e.hits++;` — ANY tap anywhere counted as a hit, so there
   was no timing to get wrong — and its award floor was `lo: 0`, so failing
   cost nothing at all.

   This is the real trial's grading, read out of mztrial.netlify.app's own
   `app-01.js` (11 Sep) rather than remembered: a SIX-STEP ladder from +3 to
   -4, keyed on how far off you were as a FRACTION of the difficulty zone.
   Both its `seal` and its `divine` challenges use exactly these numbers, and
   the -2 / -4 bands are where "repercussions" live. The trial's own rule
   comes with them and is adopted as written: an interaction moves Sanity and
   Awareness, NEVER Wisdom — "Wisdom comes from your decisions, not
   interaction skill."

   `zone` is the difficulty, 1 being the widest. The trial runs 0.82 at its
   LEARNING tier down to 0.30 at EXTREME; a chapter declares its own. */
const EV_BANDS = [
  { at: 0.03, aw:  3, word: 'event.perfect' },
  { at: 0.07, aw:  2, word: 'event.great' },
  { at: 0.12, aw:  1, word: 'event.good' },
  { at: 0.20, aw:  0, word: 'event.slight' },
  { at: 0.34, aw: -2, word: 'event.missed' },
  { at: Infinity, aw: -4, word: 'event.broken' }
];
/* err is 0..1, already normalised against the window the kind allows, and
   `zone` scales that into the bands — so the |dt| a band actually allows is
   `at * win * zone` SECONDS, and those three numbers have to be read together.

   v9.7, and this is worth the paragraph because it shipped and was unplayable:
   e2c1 declared win 0.15 / zone 0.55, which makes PERFECT a **2.5 ms** window
   and grades anything past **28 ms** as BROKEN — and the engine's own default
   (win 0.17, no zone) was 5.1 ms, no better. A touchscreen's own tap latency is
   50 to 100 ms, so the whole top of the ladder sat inside the hardware's noise
   floor: a player with flawless timing was graded BROKEN on essentially every
   beat and charged 5 sanity for it. Chad: "very hard to nail right, it still
   feels off even when my timing is good." It was not his timing.

   Whenever these numbers move, print the milliseconds they imply and read
   them against a human: a rhythm game's PERFECT is ~40-50 ms, not ~2. */
function evGrade(err, zone) {
  const k = Math.max(0, err) / Math.max(0.02, zone || 1);
  return EV_BANDS.find(b => k <= b.at) || EV_BANDS[EV_BANDS.length - 1];
}
/* ONE graded press. The band is banked on the spot: a negative one takes the
   stat THERE AND THEN, with the red wash, the fail cue and a hard buzz, so a
   mistimed tap is felt when it happens rather than totalled up politely at
   the end. That immediacy is the whole of what Chad asked for. */
/* v9.7: what the four "the worst possible" call sites pass. It used to be a
   literal 1, which means "one whole window out" — and that only LANDS on the
   BROKEN band while `zone` is under 2.94, which was true of every event that
   existed when it was written. The heartbeat's zone is 5.8 now, and under it
   a beat the player never answered at all graded SLIGHT: zero damage, with
   `missCost` never charged. A sentinel that means "the worst" has to say so. */
const EV_WORST = Infinity;
/* v9.7: the event clock AS OF THIS INSTANT, not as of the last frame.
   `e.t` only advances inside `evFrame`, so grading a press against it makes
   the press up to one whole frame stale — 100 ms at 10 fps, which is more
   than the PERFECT window is wide. A rhythm game would then be unwinnable on
   a slow device no matter how good the player's timing, which is the same
   class of bug as the clamped dt this release removed. Only the heartbeat
   needs it: every other kind grades against windows measured in whole
   seconds. Clamped, so a tab that was backgrounded cannot leap. */
function evNow() {
  const e = ev; if (!e) return 0;
  if (!e.wallLast || e.briefing) return e.t;
  return e.t + Math.min(0.25, Math.max(0, performance.now() / 1000 - e.wallLast));
}
function evScorePress(err) {
  const e = ev; if (!e) return null;
  const b = evGrade(err, e.o.zone);
  e.band.push(b.aw);
  e.sum += b.aw;
  if (b.aw > 0) e.pos += b.aw;        // v9.4: what the HITS earned, on its own
  if (b.aw > 0) e.hits++; else if (b.aw < 0) e.misses++;
  const host = evEl();
  if (host) {
    $('evNote').textContent = T(b.word);
    host.classList.toggle('bad', b.aw < 0);
    host.classList.toggle('great', b.aw >= 2);
  }
  if (b.aw < 0) {
    e.combo = 0;
    const st = (e.o.penalty && e.o.penalty.stat) || (e.o.award && e.o.award.stat) || 'sanity';
    /* v9.4: `missCost` is a FLAT price per miss, which is what Chad asked
       for — "Missed beats will deal 5 sanity damage each" — and the ladder
       cannot express it, because its two failing bands are -2 and -4. When a
       chapter names one, every missed beat costs exactly that, whether it
       was a near miss or a beat never answered at all. */
    const flat = +e.o.missCost;
    const per = (e.o.penalty && +e.o.penalty.per) || 1;
    const cost = Number.isFinite(flat) && flat > 0 ? -flat : b.aw * per;
    kitAward(st, evCut(cost));                      // the damage, now (v14.13: halved by the guard)
    /* `paid` stays the FULL price: evResolve nets the ladder against it and
       cuts whatever is still owed itself, so the guard applies once */
    if (st === ((e.o.award && e.o.award.stat) || 'sanity')) e.paid += cost;
    kitFlashSet({ color: 'rgba(150,20,16,0.40)', secs: 0.30 });
    snd('beatmiss', 0.55); haptic([34, 28, 34]);
    evBurst('bad');
  } else {
    e.combo++; if (e.combo > e.bestCombo) e.bestCombo = e.combo;
    snd(b.aw >= 2 ? 'beatperfect' : 'beathit', b.aw >= 2 ? 0.5 : 0.42);
    /* a PERFECT lands as a double tick under the thumb and a good hit as one:
       the hand can tell them apart without reading the screen, which is what
       "haptic feedback when the player accurately taps at the right time"
       actually means on a phone. */
    if (e.o.haptic !== false) haptic(b.aw >= 3 ? [18, 40, 18] : b.aw >= 2 ? 38 : 24);
    evBurst(b.aw >= 2 ? 'great' : 'ok');
  }
  evCombo();
  return b;
}
/* v9.4: the ring flashes its verdict. A rhythm game has to answer the thumb
   on the frame it lands, in a way the eye catches without reading a word. */
function evBurst(kind) {
  const b = $('evBurst'); if (!b) return;
  /* v10.3, Chad: "the circular effect is not properly aligned to the actual
     inner circle." It was centred on the PANEL, and the ring sits above the
     panel's centre (the label over it, the prompt and the combo under it).
     When the ring is on screen the burst is centred on the ring itself; for
     the match game, which has no ring, it stays on the panel. */
  const r = $('evRing');
  if (r && r.offsetParent) { b.style.left = (r.offsetLeft + r.offsetWidth / 2) + 'px'; b.style.top = (r.offsetTop + r.offsetHeight / 2) + 'px'; }
  else { b.style.left = ''; b.style.top = ''; }
  b.className = 'burst ' + kind;
  void b.offsetWidth;                       // restart the animation
  b.classList.add('go');
}
function evCombo() {
  const c = $('evCombo'), e = ev; if (!c || !e) return;
  c.textContent = e.combo >= 2 ? (e.combo + '\u00d7') : '';
  c.classList.toggle('hot', e.combo >= 4);
}
/* v9.4 · THE BEAT SCHEDULE. It used to be `lead + beat * period` — one fixed
   spacing for the whole test, computed on the fly. A heartbeat that speeds up
   cannot be expressed that way, so the times are laid out ONCE, up front, and
   everything downstream reads the table: the press grades against
   `beats[beat]`, the frame draws the ring contracting onto it, and a resume
   or a slow frame cannot drift the schedule out from under the player. */
function evBeatTimes(o, n) {
  const out = [];
  let t = o.lead, period = 60 / Math.max(1, o.bpm);
  for (let i = 0; i < n; i++) {
    out.push(t);
    period = Math.max(o.minPeriod ?? 0.4, period * (o.accel ?? 1));
    t += period;
  }
  return out;
}
/* --------------------------------------------------- v9.4 · DRAG AND MATCH
   Chad, of the standby bed: "have the player drag item icons on the left to
   the right, it has to match the right icons. Score based on speed of
   completion. Award awareness based on speed. Matching wrong icons damages
   awareness."

   So this kind is NOT on the timing ladder — there is no beat to be early or
   late for. It is a race: the score is where the finishing time falls
   between `fast` (full marks) and `slow` (none), a wrong drop takes
   `wrongCost` off the stat on the spot, and running the clock out pays the
   award's floor. The columns are shuffled INDEPENDENTLY, so the left and
   right orders never line up and the player has to read what he is holding.

   An icon may be a function returning a node, a node, or an asset key: a
   canvas cannot be in two places at once and both columns show every item,
   so a chapter that draws its icons hands over a FUNCTION and gets a fresh
   one per use. */
function evShuffled(a) {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}
function evIconNode(icon, cls) {
  const w = document.createElement('span');
  w.className = cls;
  try {
    if (typeof icon === 'function') { const n = icon(); if (n && n.nodeType === 1) w.appendChild(n); }
    else if (icon && icon.nodeType === 1) w.appendChild(icon);
    else if (typeof icon === 'string' && HOSTED && ASSET_MAP[icon]) {
      const img = document.createElement('img'); img.alt = ''; img.src = ASSET_MAP[icon]; w.appendChild(img);
    }
  } catch {}
  return w;
}
function evMatchRow(p, cls, ghost) {
  const el = document.createElement('div');
  el.className = cls;
  el.dataset.id = p.id;
  el.appendChild(evIconNode(p.icon, 'mico' + (ghost ? ' ghost' : '')));
  const lb = document.createElement('span'); lb.className = 'mlab'; lb.textContent = p.label || '';
  el.appendChild(lb);
  return el;
}
function evBuildMatch() {
  const e = ev, o = e.o;
  const src = $('evSrc'), dst = $('evDst');
  if (!src || !dst) return;
  src.textContent = ''; dst.textContent = '';
  e.pairs = (Array.isArray(o.pairs) ? o.pairs : []).map((p, i) =>
    ({ id: String(p.id ?? ('p' + i)), label: p.label || '', icon: p.icon }));
  e.done = 0; e.wrong = 0; e.drag = null;
  for (const p of evShuffled(e.pairs)) src.appendChild(evMatchRow(p, 'mtile', false));
  for (const p of evShuffled(e.pairs)) dst.appendChild(evMatchRow(p, 'mslot', true));
}
function evDragTo(x, y) {
  const g = $('evDrag'); if (!g) return;
  g.style.transform = 'translate(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px) translate(-50%,-50%)';
}
function evSlotAt(x, y) {
  const el = document.elementFromPoint(x, y);
  return el && el.closest ? el.closest('#evDst .mslot') : null;
}
function evMatchHover(x, y) {
  const hit = evSlotAt(x, y);
  const dst = $('evDst'); if (!dst) return;
  for (const n of dst.children) n.classList.toggle('over', n === hit && !n.classList.contains('full'));
}
/* ONE drop, resolved where the finger let go. Right: the tile locks into the
   slot with its cue and a green wash. Wrong: the slot shakes red, the fail
   cue fires, the stat is taken THERE AND THEN, and the tile goes back — the
   same immediacy the graded ladder gives the rhythm game. */
function evMatchDrop(x, y) {
  const e = ev, o = e.o, d = e.drag;
  e.drag = null;
  $('evDrag')?.classList.add('hide');
  const dst = $('evDst');
  if (dst) for (const n of dst.children) n.classList.remove('over');
  if (!d) return;
  d.el.classList.remove('lift');
  const slot = evSlotAt(x, y);
  if (!slot || slot.classList.contains('full')) { snd('uiclick', 0.18); return; }
  if (slot.dataset.id === d.id) {
    d.el.classList.add('gone');
    slot.classList.add('full');
    slot.querySelector('.mico')?.classList.remove('ghost');
    e.done++; e.hits++;
    $('evNote').textContent = T('event.matchOk');
    evEl()?.classList.remove('bad');
    snd('matchok', 0.5);
    if (o.haptic !== false) haptic(32);
    kitFlashSet({ color: 'rgba(40,150,126,0.18)', secs: 0.18 });
    evBurst('ok');
    if (e.done >= e.n) e.over = true;
  } else {
    e.wrong++; e.misses++;
    slot.classList.add('nope');
    setTimeout(() => slot.classList.remove('nope'), 380);
    const st = (o.penalty && o.penalty.stat) || (o.award && o.award.stat) || 'awareness';
    const cost = Math.abs(+o.wrongCost || 0);
    if (cost) kitAward(st, evCut(-cost));           // v14.13: halved by the guard
    $('evNote').textContent = T('event.matchBad');
    evEl()?.classList.add('bad');
    snd('matchbad', 0.55);
    if (o.haptic !== false) haptic([34, 28, 34]);
    kitFlashSet({ color: 'rgba(150,20,16,0.36)', secs: 0.26 });
    evBurst('bad');
  }
}
/* v9.4: THE MINIGAME'S OWN CUES, warmed the moment a chapter asks for a test.
   The v8.0 law twice over: `snd()` returns null for a sample that has not
   decoded, so the first press of the first beat would be silent. They are NOT
   on the boot warm list with the HUD's three, because chapters 1-5 declare no
   events at all and would pay the decode for nothing; a test's own briefing,
   or its `lead`, is more than enough time. */
const EV_SOUNDS = ['beathit', 'beatperfect', 'beatmiss', 'matchok', 'matchbad', 'matchdone',
                   'beattick'];   // v9.7: the heartbeat's metronome — the beat you play TO
function kitEvent(opts = {}) {
  if (ev) evResolve({ ok: false, aborted: true });
  const kind = EV_DEFAULT[opts.kind] ? opts.kind : 'tap';
  const o = { ...EV_DEFAULT[kind], ...opts, kind };
  for (const n of EV_SOUNDS) WARM_WANT.add(n);
  packWarm(EV_SOUNDS);
  if (kind === 'timed') o.secs = o.close;
  return new Promise(res => {
    document.body.classList.add('evopen');   // v12.2: a kit event owns the screen (the weapon HUD and the reticle go)
    ev = { o, kind, t: 0, res, started: false, briefing: false, layoutReal: null,
           down: false, downAt: -1, hits: 0, misses: 0, band: [], sum: 0, pos: 0, paid: 0,
           idx: 0, bar: o.start ?? 0, drift: 0, look: 0, downX: 0, downY: 0, each: o.each,
           layout: (kind === 'tap' || kind === 'timed') ? 'button' : 'full',
           items: Array.isArray(o.items) ? o.items : [], targets: Array.isArray(o.targets) ? o.targets : [],
           n: kind === 'sequence' ? (Array.isArray(o.items) ? o.items.length : (o.n || 5))
            : kind === 'focus' ? (Array.isArray(o.targets) && o.targets.length ? o.targets.length : (o.n || 5))
            : kind === 'match' ? (Array.isArray(o.pairs) ? o.pairs.length : (o.n || 4))
            : (o.n || 1),
           slotT: 0, beat: 0, beatDone: false, over: false,
           combo: 0, bestCombo: 0, beats: [],           // v9.4: the rhythm game
           pairs: [], drag: null, lastX: 0, lastY: 0, done: 0, wrong: 0 };
    if (kind === 'heartbeat') ev.beats = evBeatTimes(o, ev.n);
  });
}
function evActive() { return !!ev; }
function evEl() { return $('event'); }
/* v8.7: AN EVENT MAY BRIEF BEFORE IT RUNS. Chad, of the standby bed: "The
   minigame must give instructions first, before starting." A reaction test
   that begins the instant it appears asks the player to read and react on
   the same frame, and the first item of a sequence is gone before the eye
   has found it. With `brief` the overlay opens on the instructions and a
   START button, and NOTHING runs — the clock, the items, the beats all wait
   on the press. Absent by default, so every event already shipped is
   untouched; `layout` is forced to 'button' while briefing so a stray tap
   on the overlay cannot skip what the player is meant to read. */
function evBrief() {
  const e = ev, o = e.o, host = evEl();
  e.briefing = true;
  e.layoutReal = e.layout; e.layout = 'button';
  host.className = 'layer full brief';
  $('evLabel').textContent = o.label || T('event.ready');
  $('evPrompt').textContent = o.brief;
  $('evNote').textContent = '';
  /* v10.3: a looping ILLUSTRATION under the title — `demo: 'drag'` plays a
     tile being dragged from the left column to the right, over and over,
     so the instructions are shown as well as read (Chad: "a quick animation
     of the dragging an icon from left to right ... just below the title").
     Absent by default, so every briefing already shipped is untouched. */
  /* v13.0: any declared demo, not only 'drag' — the class picks which set of
     children shell.html draws ('drag' the tile and the slots, 'bar' a filling
     bar and a tap landing in the band). No demo at all keeps it hidden, so
     every briefing shipped before this release is untouched. */
  const dm = $('evDemo');
  dm.className = o.demo ? String(o.demo) : 'hide';
  const btn = $('evBtn');
  btn.textContent = o.briefButton || T('event.start');
  btn.className = 'go';
  $('evTrack').classList.add('hide');
  $('evItem').classList.add('hide');
  $('evMatch').classList.add('hide');
  $('evDot').classList.add('hide');
  snd('uiclick', 0.3);
}
function evStart() {
  const e = ev, host = evEl();
  e.started = true;
  if (!host) return;
  if (e.o.brief) { evBrief(); return; }
  evBegin();
}
function evBegin() {
  const e = ev, o = e.o, host = evEl();
  if (e.briefing) { e.briefing = false; e.layout = e.layoutReal; e.t = 0; }
  if (!host) return;
  host.className = 'layer ' + (e.layout === 'full' ? 'full ' : '') + e.kind;
  $('evLabel').textContent = o.label || '';
  $('evPrompt').textContent = o.prompt || T(EV_LABEL[e.kind]);
  $('evNote').textContent = '';
  const btn = $('evBtn');
  btn.textContent = o.button || T(EV_LABEL[e.kind]);
  btn.className = e.kind === 'timed' ? 'wait' : '';
  btn.classList.toggle('hide', e.layout !== 'button' && e.kind !== 'mash');
  /* v12.3: AND 'sequence'. Its frame has written `evBar` since v9.3 — the
     window drawn as a filling bar, which is the only thing that says WHEN to
     press — and the track was never taken off `hide`, which is
     display:none !important. So the load drill showed an item's name and a
     blank panel, and a player was asked to time a press against nothing:
     Chad, of it, "The minigame seems broken and im not sure what its
     supposed to do." Episode 1 declares no events, so it cannot reach this. */
  $('evTrack').classList.toggle('hide', !(e.kind === 'mash' || e.kind === 'hold' || e.kind === 'stabilise' || e.kind === 'tap' || e.kind === 'match' || e.kind === 'sequence'));
  $('evBar').style.width = (e.kind === 'mash' ? e.bar * 100 : e.kind === 'match' ? 100 : 0) + '%';
  $('evItem').classList.toggle('hide', e.kind !== 'sequence');
  $('evDemo').classList.add('hide');       // v10.3: the briefing's illustration goes with the briefing
  /* `.hide` is display:none !important, so the kind's own CSS cannot bring
     the columns back on its own — the class has to come off here */
  $('evMatch').classList.toggle('hide', e.kind !== 'match');
  $('evDot').classList.add('hide');
  $('evDrag').classList.add('hide');
  $('evCombo').textContent = '';
  if (e.kind === 'sequence') evShowItem();
  /* v9.4: a drag needs a cursor, and under pointer lock there is none - the
     mouse's clientX/clientY freeze, so the tiles could never be picked up.
     Hand the pointer back; the next click on the canvas after the event
     re-locks it through the path that has always done so. */
  if (e.kind === 'match') { evBuildMatch(); document.exitPointerLock?.(); }
  snd('uiclick', 0.3);
}
function evShowItem() {
  const e = ev, it = e.items[e.idx] || { label: String(e.idx + 1) };
  const icon = $('evIcon'); icon.textContent = '';
  if (it.icon && typeof it.icon === 'object' && it.icon.nodeType === 1) icon.appendChild(it.icon);
  else if (typeof it.icon === 'string' && HOSTED && ASSET_MAP[it.icon]) {
    const img = document.createElement('img'); img.alt = ''; img.src = ASSET_MAP[it.icon]; icon.appendChild(img);
  }
  $('evItemTxt').textContent = it.label || '';
  /* v12.3: THE TARGET IS DRAWN FROM THE LADDER IT IS SCORED BY. The press
     grades on |slotT - mid| / (span / 2), and the band that still earns
     something is GOOD at 0.12 * zone of that half-span — so the jade band on
     the track is exactly that fraction of the track's half-width, written as
     a CSS variable. Drawing a target a player can see, and drawing it from
     the same number that decides the score, is the v8.7 bed-zone rule in a
     HUD: what is shown and what fires cannot drift apart. */
  const win = 0.12 * Math.max(0.02, e.o.zone || 1);
  evEl()?.style.setProperty('--evwin', (Math.min(0.48, win * 0.5) * 100).toFixed(1) + '%');
  e.slotT = 0;
}
function evNote(ok) {
  const host = evEl(); if (!host) return;
  $('evNote').textContent = ok ? T('event.hit') : T('event.miss');
  host.classList.toggle('bad', !ok);
  snd(ok ? 'uiconfirm' : 'uiclick', ok ? 0.35 : 0.2);
  if (ok && ev && ev.o.haptic !== false) haptic(30);
}
/* v9.3: the result of a GRADED event. The score is the band sum mapped into
   the ladder's own range, so `ok` means "you came out ahead", not "you
   pressed the right number of times", and a bad run reports a NEGATIVE
   delta the chapter can act on. */
function evBandResult(o) {
  const e = ev, n = Math.max(1, e.band.length);
  const best = 3 * n, worst = -4 * n;
  const norm = (e.sum - worst) / (best - worst);           // 0..1
  return { ok: e.sum > 0, score: norm };
}
function evResolve(extra) {
  const e = ev; if (!e) return;
  ev = null;
  document.body.classList.remove('evopen');
  const host = evEl();
  if (host) {
    host.className = 'layer hide';
    $('evDot').classList.add('hide'); $('evDrag').classList.add('hide');
    $('evMatch').classList.add('hide');
    $('evIcon').textContent = ''; $('evCombo').textContent = '';
    $('evSrc').textContent = ''; $('evDst').textContent = '';
  }
  const score = Math.max(0, Math.min(1, extra.score ?? e.score ?? 0));
  const r = { kind: e.kind, ok: !!extra.ok, score: +score.toFixed(3), hits: e.hits, misses: e.misses,
              t: +e.t.toFixed(2), early: !!extra.early, skipped: !!extra.skipped, aborted: !!extra.aborted,
              /* v9.3: the ladder is ALWAYS on the result — which band every press
                 landed in and what they summed to — so a chapter or a harness can
                 read how it was played, not just whether it passed. */
              band: e.band.slice(), sum: e.sum };
  const aw = e.o.award;
  if (aw && aw.stat && !r.aborted && !r.skipped) {
    if (e.band.length) {
      /* GRADED (v9.3): the per-press bands were already banked as they
         happened — the damage is not deferred — so the end pays only what
         the ladder says is LEFT to pay: the positive remainder, scaled. A
         chapter may still cap it with lo/hi. */
      const per = Number.isFinite(+aw.per) ? +aw.per : 1;
      /* v9.4: with a FLAT `missCost` the two halves stop being one sum. A miss
         is priced at missCost and PAID when it happens, and that price is not
         the ladder's -2/-4 — so netting them (`sum * per - paid`) can come out
         POSITIVE after a run of misses and hand sanity back for failing. When
         a chapter names a flat cost, the misses are settled and the end pays
         only what the HITS earned. */
      const flat = Number.isFinite(+e.o.missCost) && +e.o.missCost > 0;
      const owed = flat ? Math.round(e.pos * per) : Math.round(e.sum * per) - e.paid;
      r.delta = Number.isFinite(+aw.hi) ? Math.min(+aw.hi, owed) : owed;
      if (Number.isFinite(+aw.lo)) r.delta = Math.max(+aw.lo, r.delta);
    } else {
      const lo = +aw.lo || 0, hi = +aw.hi || 0;
      r.delta = Math.round(lo + (hi - lo) * (r.ok ? r.score : 0));
    }
    /* v14.13: a payout that is a LOSS is cut by the minigame guard; r.delta
       is what was actually applied, r.full what it would have been */
    r.full = r.delta;
    r.delta = evCut(r.delta);
    kitAward(aw.stat, r.delta);
  }
  if (!r.aborted && !r.skipped) snd(r.ok ? 'uiconfirm' : 'uiclick', r.ok ? 0.5 : 0.25);
  e.res(r);
}
/* a press: from the overlay, the button, a key, or a mouse under pointer lock */
function evPress(x, y) {
  const e = ev; if (!e || !e.started || e.down) return;
  if (e.briefing) { evBegin(); return; }      // v8.7: START closes the briefing; nothing else counts
  const o = e.o;
  e.down = true; e.downAt = e.t; e.downX = x; e.downY = y; e.drift = 0; e.look = 0;
  $('evBtn')?.classList.add('down');
  switch (e.kind) {
    case 'tap':
      evResolve({ ok: true, score: 1 - Math.min(1, e.t / o.secs) * 0.5 }); break;
    case 'timed':
      if (e.t < o.open) evResolve({ ok: false, early: true, score: 0 });
      else evResolve({ ok: true, score: 1 - Math.min(1, (e.t - o.open) / (o.close - o.open)) * 0.5 });
      break;
    case 'mash':
      e.bar = Math.min(1, e.bar + o.gain); e.hits++; snd('uiclick', 0.18, 1.1); break;
    case 'heartbeat': {
      /* v9.4: the beat comes off the SCHEDULE, because the gaps shrink. A
         press is graded on how far it lands from the beat's centre as a
         fraction of the window, so an UNDERSHOOT and an OVERSHOOT of the
         same size score the same — which is Chad's "if the player
         undershoots, or overshoots the circle, it should show missed". */
      const c = e.beats[e.beat] ?? 1e9;
      if (e.beatDone) { evScorePress(EV_WORST); break; }   // a second tap on one beat is a miss
      e.beatDone = true;
      evScorePress(Math.abs(evNow() - c) / Math.max(0.02, o.win));
      break;
    }
    /* v9.4: a press on a tile PICKS IT UP; the drop is resolved on release,
       which is where the finger actually chose. */
    case 'match': {
      e.lastX = x; e.lastY = y;
      const el = document.elementFromPoint(x, y);
      const t = el && el.closest ? el.closest('#evSrc .mtile') : null;
      if (!t || t.classList.contains('gone')) break;
      const p = e.pairs.find(q => q.id === t.dataset.id);
      e.drag = { id: t.dataset.id, el: t };
      t.classList.add('lift');
      const g = $('evDrag');
      if (g) { g.textContent = ''; g.appendChild(evIconNode(p && p.icon, 'mico')); g.classList.remove('hide'); }
      evDragTo(x, y); evMatchHover(x, y);
      break;
    }
    case 'focus': {
      const dot = $('evDot');
      if (dot && !dot.classList.contains('hide')) {
        const r = dot.getBoundingClientRect();
        const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        if (d <= o.tol) { e.hits++; evNote(true); evNextTarget(); }
        else { e.misses++; evNote(false); }
      }
      break;
    }
    /* v9.3: THE ITEM HAS A WINDOW NOW. This case used to be
       `e.hits++; evNote(true); evNextItem();` — any tap, anywhere, at any
       moment, advanced it, which is why the standby bed could not be failed
       and why Chad called it sloppy. The item is live from `lead` into its
       slot; a press is graded on how close it lands to the CENTRE of that
       window, and a press before the window opens is the worst band there
       is, because jabbing at the screen must not beat reading it. */
    case 'sequence': {
      const lead = o.lead ?? 0.28, span = Math.max(0.12, e.each - lead);
      if (e.slotT < lead) { evScorePress(EV_WORST); evNextItem(); break; }   // too early: BROKEN
      const mid = lead + span * 0.5;
      evScorePress(Math.abs(e.slotT - mid) / (span * 0.5));
      evNextItem(); break;
    }
    default: break;   // hold / stabilise: the press is the beginning of the hold
  }
}
function evRelease() {
  const e = ev; if (!e || !e.down) return;
  e.down = false;
  $('evBtn')?.classList.remove('down');
  /* the release carries no coordinates, so the drop lands where the last
     move put it - and evPress seeds those, for a tap that never moved */
  if (e.kind === 'match') { evMatchDrop(e.lastX, e.lastY); return; }
  if (e.kind === 'hold' && e.t < e.o.secs) evResolve({ ok: false, score: 0 });
  if (e.kind === 'stabilise' && e.t < e.o.secs) evResolve({ ok: false, score: 0 });
}
function evMove(x, y) {
  const e = ev; if (!e || !e.down) return;
  e.drift = Math.max(e.drift, Math.hypot(x - e.downX, y - e.downY));
  if (e.kind === 'match') { e.lastX = x; e.lastY = y; if (e.drag) { evDragTo(x, y); evMatchHover(x, y); } }
}
function evNextTarget() {
  const e = ev; e.idx++; e.slotT = 0;
  if (e.idx >= e.n) { e.over = true; return; }
}
function evNextItem() {
  const e = ev; e.idx++;
  e.slotT = 0;                       // v9.3: the new item's window starts now
  e.each = Math.max(e.o.minEach, e.each * e.o.accel);
  if (e.idx >= e.n) { e.over = true; return; }
  evShowItem();
}
function evFrame(dt, dLookX, dLookY) {
  const e = ev; if (!e) return;
  if (!e.started) evStart();          // and fall through: a focus dot is placed on the frame it starts
  if (e.briefing) { e.wallLast = 0; return; }   // v8.7: a briefing holds the clock, the items and the beats (v9.7: and the wall mark, or START would leap)
  const o = e.o;
  /* v9.7: WALL time, not the frame's dt. `dt` is clamped to 0.05 s upstream,
     so on a device under twenty frames a second every event ran in slow
     motion — and a RHYTHM test graded against a clock that is not the clock
     its sounds play on is unwinnable by construction. The same law the
     chapter clock learned at v7.1 and the march at v9.3, in the one place it
     matters most. A first frame and a resumed briefing seed the mark rather
     than leaping. */
  const nowMs = performance.now() / 1000;
  if (!e.wallLast) e.wallLast = nowMs;
  e.t += Math.min(0.25, Math.max(0, nowMs - e.wallLast));
  e.wallLast = nowMs;
  if (e.down) e.look += Math.abs(dLookX) + Math.abs(dLookY);
  const bar = $('evBar');
  switch (e.kind) {
    case 'tap':
      if (bar) bar.style.width = (100 * (1 - e.t / o.secs)).toFixed(1) + '%';
      if (e.t >= o.secs) evResolve({ ok: false, score: 0 });
      break;
    case 'timed': {
      const btn = $('evBtn');
      if (btn) { btn.classList.toggle('wait', e.t < o.open); btn.classList.toggle('go', e.t >= o.open); if (e.t >= o.open && btn.textContent !== T('event.go')) btn.textContent = T('event.go'); }
      if (e.t >= o.close) evResolve({ ok: false, score: 0 });
      break;
    }
    case 'mash':
      e.bar -= o.decay * dt;
      if (bar) bar.style.width = (Math.max(0, e.bar) * 100).toFixed(1) + '%';
      if (e.bar <= 0) evResolve({ ok: false, score: 0 });
      else if (e.t >= o.secs) evResolve({ ok: true, score: e.bar });
      break;
    case 'hold':
      if (!e.down) { if (e.t > o.grace && e.downAt < 0) evResolve({ ok: false, score: 0 }); break; }
      if (bar) bar.style.width = (100 * Math.min(1, (e.t - e.downAt) / o.secs)).toFixed(1) + '%';
      if (e.drift > o.drift || e.look > o.lookTol) evResolve({ ok: false, score: 0 });
      else if (e.t - e.downAt >= o.secs) evResolve({ ok: true, score: 1 });
      break;
    case 'stabilise': {
      if (!e.down) { if (e.t > o.grace && e.downAt < 0) evResolve({ ok: false, score: 0 }); break; }
      const steady = 1 - Math.min(1, e.look / o.tol);
      if (bar) bar.style.width = (100 * steady).toFixed(1) + '%';
      if (e.t - e.downAt >= o.secs) evResolve({ ok: steady >= o.pass, score: steady });
      break;
    }
    case 'heartbeat': {
      const c = e.beats[e.beat] ?? 1e9;
      /* v9.7: THREE RINGS IN FLIGHT. One ring could not do this job: it
         approached the current beat, then CLAMPED at the target for the whole
         late window — so a press 100 ms late saw a perfectly aligned ring and
         was graded BROKEN — and then snapped back out when the beat resolved.
         "the circles dont really align" is exactly that clamp.

         Each ring now owns one beat and does nothing else: it fades in a gap
         before its own beat, contracts 2.2 -> 1.0 so that it lands ON the
         dashed target ring at the beat's centre, and then keeps going, through
         and inside it, while the press is still allowed. So being late LOOKS
         late, and the next beat's ring is already on its way in behind it —
         no jump, and an accelerating rhythm reads as rings arriving faster. */
      const RINGS = ['evPulse', 'evPulse2', 'evPulse3'];
      for (let r = 0; r < RINGS.length; r++) {
        const el = $(RINGS[r]); if (!el) continue;
        const bi = e.beat + r;
        const bc = e.beats[bi];
        if (bc === undefined) { el.style.opacity = '0'; continue; }
        const bp = bi > 0 ? e.beats[bi - 1] : Math.max(0, bc - (60 / o.bpm));
        const bgap = Math.max(0.05, bc - bp);
        const lead = Math.min(bgap, 1.15);            // how long before its beat it appears
        const u = (e.t - (bc - lead)) / lead;         // 0 at the fade-in, 1 at the beat
        if (u < 0) { el.style.opacity = '0'; continue; }
        const over = Math.max(0, e.t - bc) / Math.max(0.02, o.win);   // 0..1 past the centre
        const sc = over > 0 ? 1 - 0.55 * Math.min(1, over)
                            : 2.2 - 1.2 * Math.min(1, Math.max(0, u));
        el.style.transform = 'scale(' + sc.toFixed(3) + ')';
        el.style.opacity = (over > 0 ? Math.max(0, 1 - over) : Math.min(1, u * 3)).toFixed(3);
        el.classList.toggle('near', bi === e.beat && Math.abs(e.t - bc) <= o.win * 0.7);
        el.classList.toggle('late', bi === e.beat && e.t > bc);
      }
      /* v9.7: and the beat is HEARD. A rhythm game you can only see is a
         reaction test; hearing the last beat is how a player predicts the
         next one, which is the whole skill an accelerating pattern asks for. */
      if (o.tick !== false && !e.ticked) e.ticked = [];
      if (o.tick !== false && e.t >= c && !e.ticked[e.beat]) {
        e.ticked[e.beat] = 1;
        snd('beattick', 0.5);
        haptic(12);
      }
      if (e.t > c + o.win) {
        /* v9.3: a beat you never answered is BROKEN, not a silent nothing —
           it grades at the bottom of the ladder and takes its sanity there
           and then. Before this, missing every beat of the fear test cost
           the player exactly nothing until the very end. */
        if (!e.beatDone) evScorePress(EV_WORST);
        e.beat++; e.beatDone = false;
        if (e.beat >= e.n) evResolve(evBandResult(o));
      }
      break;
    }
    /* v9.4: the whole of the match's scoring is TIME. `fast` is full marks,
       `slow` is none, and the award's own lo/hi map that into awareness -
       "Score based on speed of completion. Award awareness based on speed."
       The wrong drops were already paid as they happened. */
    case 'match': {
      if (e.over) {
        const span = Math.max(0.1, o.slow - o.fast);
        const sc = Math.max(0, Math.min(1, 1 - (e.t - o.fast) / span));
        snd('matchdone', 0.5);
        evResolve({ ok: true, score: sc });
        break;
      }
      if (bar) bar.style.width = (100 * Math.max(0, 1 - e.t / o.secs)).toFixed(1) + '%';
      if (e.t >= o.secs) evResolve({ ok: false, score: 0 });
      break;
    }
    case 'focus': {
      const dot = $('evDot');
      if (e.over) { const s = e.hits / e.n; evResolve({ ok: s >= o.pass, score: s }); break; }
      const tg = e.targets[e.idx % Math.max(1, e.targets.length)];
      let sx, sy, vis = true;
      if (tg && Number.isFinite(tg.sx)) { sx = tg.sx * innerWidth; sy = tg.sy * innerHeight; }
      else if (tg && Number.isFinite(tg.x)) {
        const n = projectTo(tg.x, tg.y ?? 1.2, tg.z);
        vis = n.z < 1; sx = (n.x * 0.5 + 0.5) * innerWidth; sy = (-n.y * 0.5 + 0.5) * innerHeight;
      } else { sx = innerWidth * (0.3 + 0.4 * ((e.idx * 0.618) % 1)); sy = innerHeight * (0.3 + 0.4 * ((e.idx * 0.382) % 1)); }
      if (dot) {
        dot.classList.toggle('hide', !vis);
        dot.style.transform = `translate(${sx.toFixed(0)}px, ${sy.toFixed(0)}px) translate(-50%,-50%)`;
        dot.style.opacity = (1 - e.slotT / e.o.each * 0.7).toFixed(2);
      }
      e.slotT += dt;
      if (e.slotT >= e.o.each) { e.misses++; evNote(false); evNextTarget(); }
      break;
    }
    case 'sequence': {
      if (e.over) { evResolve(evBandResult(o)); break; }
      /* v12.3: and the slot clock stays on the CLAMPED `dt`, deliberately.
         Wall time was tried and reverted, and `fixturetest` is what found
         the reason: a sequence has no sound-timed beat — the bar is drawn
         from `slotT` and the press is graded against `slotT`, so the two
         agree under either clock, and the only thing the choice decides is
         how much REAL time a player gets per item. On wall time a 2 s slot
         is two frames on a one-frame-a-second box and nobody could answer
         it; on the clamped dt the player always sees the whole sweep,
         however slow the device. v9.7's law is about a beat that must line
         up with a SOUND (the heartbeat) — it does not generalise to a kind
         that has none. */
      e.slotT += dt;
      const item = $('evItem');
      /* the window, drawn: dim until it opens, bright across it, gone after.
         A player has to be able to SEE what he is timing against. */
      const lead = o.lead ?? 0.28, span = Math.max(0.12, e.each - lead);
      const k = (e.slotT - lead) / span;
      if (item) item.style.opacity = (e.slotT < lead ? 0.30 : Math.max(0.12, 1 - Math.abs(k - 0.5) * 1.4)).toFixed(2);
      const bar = $('evBar');
      if (bar) bar.style.width = (100 * Math.max(0, Math.min(1, k))).toFixed(1) + '%';
      if (e.slotT >= e.each) { evScorePress(EV_WORST); evNextItem(); }   // never laid: BROKEN
      break;
    }
  }
}
/* keys: Space / Enter / E are the press while an event is live — they never
   reach the cutscene skip or the pile while one is */
function evKey(e, isDown) {
  if (!ev || !ev.started) return false;
  if (e.code !== 'Space' && e.code !== 'Enter' && e.code !== 'KeyE') return false;
  if (isDown && e.repeat) { e.preventDefault(); return true; }
  e.preventDefault();
  if (isDown) evPress(innerWidth / 2, innerHeight / 2); else evRelease();
  return true;
}

/* ---- the frame ----------------------------------------------------------- */
function kitInit() {
  kitInited = true;
  /* the booting chapter's declarations: restart() and setChapter() run
     kitReset(), but a fresh boot reaches play through neither, and the HUD
     the torch button lives in did not exist when build() ran */
  if (CH.torch && !torchLight) torchSetup(CH.torch);
  if (CH.weapon && !weaponDecl) weaponSetup(CH.weapon);   // v12.0
  $('interact')?.querySelector('.ibadge')?.addEventListener('click', e => { e.stopPropagation(); interactNow(); });
  $('torchBtn')?.addEventListener('click', e => { e.stopPropagation(); torchToggle(); });
  /* v12.0: the fire and reload buttons — a phone's trigger; a mouse's is the click */
  const ab = $('aimBtn');
  if (ab) { ab.addEventListener('click', e => { e.stopPropagation(); weaponAdsToggle(); }); ab.setAttribute('aria-label', T('hud.aim')); }
  const fb = $('fireBtn'), rb = $('reloadBtn');
  if (fb) { fb.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); weaponFire(); }); fb.setAttribute('aria-label', T('hud.fire')); }
  if (rb) { rb.addEventListener('click', e => { e.stopPropagation(); weaponReload(); }); rb.setAttribute('aria-label', T('hud.reload')); }
  const tb = $('torchBtn'); if (tb) tb.setAttribute('aria-label', T('hud.torch'));
  const host = $('event');
  if (host) {
    const pressFrom = e => {
      if (!ev) return false;
      // a touch counts only on the overlay's own surface (the stick is not a press);
      // a mouse counts anywhere, because under pointer lock it lands on the canvas
      if (e.pointerType !== 'mouse' && ev.layout === 'button' && !e.target.closest?.('#evBtn')) return false;
      /* v14.4: and only the PRIMARY button. `canvas.mousedown` has filtered
         `e.button !== 0` since v12.0, and v12.2 gave the rifle right-click
         as its AIM toggle — which `if (ev) return;` correctly suppresses
         during an event, so the aim button was disabled and still SCORED a
         graded press. Middle-click and the back/forward buttons likewise. */
      if (e.pointerType === 'mouse' && e.button !== 0) return false;
      return true;
    };
    host.addEventListener('pointerdown', e => { if (!pressFrom(e)) return; e.preventDefault(); evPress(e.clientX, e.clientY); });
    host.addEventListener('pointermove', e => { if (ev && ev.down) evMove(e.clientX, e.clientY); });
    for (const k of ['pointerup', 'pointercancel']) host.addEventListener(k, () => evRelease());
    // a mouse press under pointer lock never reaches the overlay
    addEventListener('pointerdown', e => {
      if (!ev || !ev.started || e.target.closest?.('#event') || e.target.closest?.('.soundBtn')) return;
      if (e.pointerType === 'mouse' && e.button === 0) evPress(innerWidth / 2, innerHeight / 2);   // v14.4: primary only
    });
    addEventListener('pointerup', () => { if (ev && ev.down) evRelease(); });
  }
}
function kitFrame(dt, t, dLookX, dLookY) {
  if (!kitInited) kitInit();
  /* v11.6: the bag button asks while a given item waits unequipped (a class
     toggle is a no-op when nothing changed, so this costs the frame nothing) */
  (invBtnEl || (invBtnEl = $('invBtn')))?.classList.toggle('urge', !!invUrge && state === 'play');
  /* v11.7 (Chad: "why does the torch icon draw over every ui element?"): the
     round buttons sit at z 9 and the cards at z 5, so the decision, the
     outcome and the sealed card all had the lit torch button on top of
     them. `cardup` marks every state that is not the walk, and the torch's
     CSS hides under it; the bag and menu buttons keep the behaviour episode
     1 has always had (they are the base game's, and unchanged). */
  document.body.classList.toggle('cardup', state !== 'play');
  weaponFrame(dt);   // v12.0: the weapon's clips, its flash and its rounds
  // pose
  if (poseT < 1) { poseT = Math.min(1, poseT + dt / poseSecs); eyeY = poseFrom + (poseTo - poseFrom) * smoothK(poseT); }
  if (kitPose === 'lying' && state === 'play') {
    const d = Math.atan2(Math.sin(yaw.rotation.y - lieYaw), Math.cos(yaw.rotation.y - lieYaw));
    if (Math.abs(d) > lieSpan) yaw.rotation.y = lieYaw + Math.sign(d) * lieSpan;
  }
  // daylight
  if (dayTween) {
    dayTween.t = Math.min(1, dayTween.t + dt / dayTween.secs);
    if (dayTween.t >= 1) { dayNow = dayTween.to; dayTween = null; applyDaylightD(dayNow); }
    else applyDaylightD(dayMix(dayTween.from, dayTween.to, smoothK(dayTween.t)), true);
  }
  /* v7.1: a FADE in play — the black between the day and the night of a
     chapter that has both (The Worst Bed lies him down at lights out and
     wakes him at three). The same element the cutscenes fade; a cutscene
     that starts mid-fade simply takes it over, as it always has. */
  if (kitFade && state === 'play') {
    kitFade.t = Math.min(1, kitFade.t + dt / kitFade.secs);
    kitFadeNow = kitFade.from + (kitFade.to - kitFade.from) * smoothK(kitFade.t);
    cineFadeEl.style.opacity = String(kitFadeNow);
    if (kitFade.t >= 1) kitFade = null;
  }
  // timer, objective, waypoint
  /* v7.4: the countdown runs on WALL TIME, not the frame's dt. `dt` is
     clamped to 0.05 s so a stutter can never throw the world, which means a
     device drawing fewer than 20 frames a second runs this clock SLOW — a
     14-second fall-in becomes eighteen on a weak phone and the number on
     screen stops being the truth. Same law the chapter clock learned at
     v7.1, applied to the kit's own timer. `last` is dropped whenever play is
     not running, so a menu or a cutscene never eats the countdown. */
  if (kitTimer && state === 'play') {
    const now = performance.now() / 1000;
    kitTimer.left -= kitTimer.last ? Math.min(0.5, now - kitTimer.last) : 0;
    kitTimer.last = now;
    if (kitTimer.left <= 0) {
      const f = kitTimer.onEnd; kitTimer = null;
      objPush('timeup');                  // v8.7: time running out is felt, not merely noticed
      if (typeof f === 'function') f();   // ...and whatever it sets queues behind that beat
    }
  } else if (kitTimer) kitTimer.last = 0;
  paintObjective();
  flashRun();                       // v8.7: the kit's screen flash, if one was asked for
  paintWaypoint();
  paintHotMarks();
  // the decision clock
  if (decClock && state === 'decide' && !decClock.fired) {
    decClock.left -= dt;
    const el = $('dclock');
    if (el) el.querySelector('i').style.width = (100 * Math.max(0, decClock.left / decClock.secs)).toFixed(1) + '%';
    if (decClock.left <= 0) {
      decClock.fired = true;
      const f = decClock.onExpire;
      if (typeof f === 'function') f(); else kitAward('sanity', -8);
    }
  }
  // events
  if (ev) evFrame(dt, dLookX, dLookY);
}
/* every chapter starts the kit clean; a resume re-seeds phase/conduct/choices
   through applyState afterwards */
function kitReset() {
  if (ev) evResolve({ ok: false, aborted: true });
  kitPhase = null;
  conductAcc.s = 0; conductAcc.a = 0; conductAcc.notes.length = 0;
  kitObjective = null; kitTimer = null; kitWaypoint = null;
  objReset();                       // v8.7: and the beats queued against the old objective
  kitFlashReq = null;
  kitPose = 'standing'; eyeY = 1.62; poseFrom = poseTo = 1.62; poseT = 1; pitchLo = -1.2; pitchHi = 1.2;
  chapterPresence = 0;
  dayTween = null;
  kitFade = null; kitFadeNow = 0;
  decClock = null; $('dclock')?.classList.add('hide');
  if (CH.torch) torchSetup(CH.torch); else torchTeardown();
  if (CH.weapon) weaponSetup(CH.weapon); else weaponTeardown();   // v12.0
  kitRooted = false; kitHurtSet(null);   // v11.1
  activeSpot = null;
  if (unl.id) unlockClose('force');      // v14.7: a splash never outlives the run it opened in
}
/* v11.1: HURT. A chapter holds the red damage frame on the screen and bleeds
   sanity on WALL time until the player acts (chapter 3's pressure: Chad,
   "red damage animation constantly turned on until player takes action ...
   -3 sanity per second"). It runs in play AND with the decision open,
   which is what "until action is taken" means; with the card open the
   bleed stops at `floor` (5), so nobody faints under a panel they are
   reading. Clearing it hands the frame back to the sanity dread. */
function kitHurtSet(o) {
  kitHurt = o ? { perSec: Math.max(0, +o.perSec || 0), floor: o.floor === undefined ? 5 : Math.max(0, +o.floor), last: 0 } : null;
  if (!kitHurt) { const el = $('panic'); if (el) { el.classList.remove('critical'); el.classList.remove('hurt'); if (state !== 'play') el.style.opacity = '0'; } }
}
const KIT = {
  objective: kitObjectiveSet, timer: kitTimerStart, waypoint: kitWaypointSet,
  event: kitEvent, eventActive: evActive, abortEvent: () => { if (ev) evResolve({ ok: false, aborted: true }); },
  torch: torchSetup, torchOn: torchSet, torchRed, torchIsOn: () => torchOn,
  presence: v => { chapterPresence = Math.max(0, Math.min(1, +v || 0)); },
  getPresence: () => chapterPresence,
  conduct: kitConduct, award: kitAward,
  /* v7.3: what play has BANKED so far. A chapter whose play is a whole
     day (episode 2) can be resumed in the middle of it, and it needs to
     know which of its awards are already on the card — `kitConduct`
     dedupes the NOTES and never did the numbers, so a Continue banked
     the same +4 twice. Read-only, and nothing in episode 1 asks. */
  getConduct: () => ({ s: conductAcc.s, a: conductAcc.a, notes: conductAcc.notes.slice() }),
  pose: kitPoseSet, getPose: () => kitPose,
  daylight: daylightTo,
  fade: (to, secs) => { kitFade = { from: kitFadeNow, to: Math.max(0, Math.min(1, +to || 0)), t: 0, secs: Math.max(0.01, +secs || 0.5) }; },
  getFade: () => kitFadeNow,
  decisionClock: (secs, onExpire) => { decClock = secs > 0 ? { secs, left: secs, onExpire, fired: false } : null; },
  haptic,
  flash: kitFlashSet,              // v8.7: one wash of colour over the screen
  root: on => { kitRooted = !!on; },   // v11.1: hold the player in place (the look and the torch still work)
  hurt: kitHurtSet,                // v11.1: the red frame held, and a bleed per second, until cleared
  /* v11.6: THE BAG, from a chapter. `give` puts an item in the bag and
     sets the bag button pulsing until it is equipped; `take` removes it
     wherever it sits (a replay must find the torch on the ground again);
     `equip` puts it straight into its slot (a resume past the pickup, or a
     save from before the item existed); `has`/`equipped` are the reads a
     chapter's frame asks. Episode 1 calls none of them. */
  give: id => { const ok = invAdd(id); if (ok) invUrge = id; torchAvailSync(); weaponAvailSync(); return ok; },
  take: id => { const ok = invRemove(id); if (invUrge === id) invUrge = null; torchAvailSync(); weaponAvailSync(); return ok; },
  equip: id => { const def = ITEM_DEFS[id]; if (!def || !def.slot) return false;
                 if (inv.gear[def.slot] === id) return true;
                 const i = inv.bag.indexOf(id); const swap = inv.gear[def.slot];
                 inv.gear[def.slot] = id;
                 if (i >= 0) inv.bag[i] = swap; else if (swap) { const f = inv.bag.indexOf(null); if (f >= 0) inv.bag[f] = swap; }
                 if (inv.open) invPaint(); torchAvailSync(); weaponAvailSync(); return true; },
  has: id => invHas(id),
  equipped: id => { const def = ITEM_DEFS[id]; return !!def && !!def.slot && inv.gear[def.slot] === id; },
  urge: id => { invUrge = id || null; },
  /* v14.7: THE NINETEENTH SEAM — the Item Unlocked splash (see kitUnlock).
     `unlock(id, { onClose })` opens it from play and answers false if it
     cannot; `unlockOpen()` is the read; `itemWarm(id)` starts an item's icon
     and model loading ahead of the moment they are needed, so the splash
     opens on the model rather than on its stand-in. Episode 1's other four
     chapters and all of episode 2 call none of them. */
  unlock: kitUnlock,
  unlockOpen: () => !!unl.id,
  itemWarm: id => { if (ITEM_DEFS[id]) { itemArtGet(id); ivModel(id); } },
  /* v14.7: what the worn ward holds right now (0 when none is worn) */
  wardLeft: () => wardLeft(),
  torchAvail,
  /* v12.0: the weapon — a film or a scene forces it out or away (null
     hands it back to the bag), a chapter fires or reloads through its own
     button, sets the ammo (a resume), and reads what is left */
  weapon: weaponSetup,
  weaponOut: v => { weaponForce = (v === null || v === undefined) ? null : !!v; weaponPropSync(); },
  weaponIsOut: () => weaponWant(),
  weaponAds: v => { if (v === undefined) return weaponAds; weaponAds = !!v; weaponAdsSync(); return weaponAds; },
  weaponAvail,
  /* v14.3: a string forbids firing and is what the HUD says; null allows it
     again. A chapter DERIVES it on the frame rather than storing it, so a
     resume, a replay or a reset cannot leave the trigger locked (v11.6). */
  weaponBlock: weaponBlockSet,
  fire: weaponFire, reload: weaponReload,
  /* v13.2, Chad on e2c4's scene C: "the rifle shooting has no recoil or
     effects." It had none because a CUTSCENE cannot call `weaponFire` —
     that is the player's path: it spends a round, raycasts into the live
     serial's bank and reports a hit to the chapter, none of which a scene
     wants. The visual half is its own verb now: the Shoot take, the shot,
     the muzzle flash, the light and the camera kick, and nothing else. It
     is a no-op unless the weapon is actually out, so a scene that hid the
     rifle cannot fire an invisible one.
     It is deliberately SILENT: the report stays a scheduled `sfx` cue in the
     scene, where the cue log can see it and `chaptertest` checks its timing,
     and where a rifle whose bytes never arrived still makes a noise. A verb
     that carried the sound would have to be the only thing that could, and a
     failed download would cost the chapter its gunshot (v4.7's rule). */
  weaponShot: () => {
    if (!weaponDecl || !weaponProp || !weaponShown) return false;
    if (weaponPlay('shoot')) weaponBusy = null;
    haptic([30, 20, 40]);
    weaponFlashT = weaponDecl.flashSecs || 0.09;
    weaponFlashDrawn = false;
    weaponFlashFire();
    /* the WEAPON's own spring, and deliberately not `weaponDecl.kick`: the
       camera kick writes `pitch.rotation.x`, which a cutscene owns and
       re-applies from its own tracks on every frame (v5.30's law), so it
       would be erased on the next frame and fight the shot's framing while
       it lasted. The gun moves; the lens is the scene's. */
    weaponRecoilFire();
    return true;
  },
  ammo: (rounds, mags) => { if (rounds !== undefined) weaponRounds = Math.max(0, rounds | 0); if (mags !== undefined) weaponMags = Math.max(0, mags | 0); return { rounds: weaponRounds, mags: weaponMags }; },
  setPhase: v => { kitPhase = (v === undefined) ? null : v; }, getPhase: () => kitPhase,
  choices: () => ({ ...runChoices }),
  interact: () => interactNow(),
  hotspot: () => activeSpot
};
// for the probes and harnesses: the whole kit, read by state
function kitDebug() {
  return { phase: kitPhase, pose: kitPose, eyeY: +eyeY.toFixed(3), presence: chapterPresence,
           rooted: kitRooted, hurt: kitHurt ? { perSec: kitHurt.perSec } : null,   // v11.1
           torch: torchLight ? { on: torchOn, red: torchIsRed, avail: torchAvail(), item: torchDecl && torchDecl.item || null } : null,
           urge: invUrge,   // v11.6
           weapon: weaponDecl ? { out: weaponWant(), avail: weaponAvail(), shown: weaponShown, busy: weaponBusy, rounds: weaponRounds, mags: weaponMags, item: weaponDecl.item || null, prop: !!weaponProp,
                                                  block: weaponBlock,    // v14.3
                                                  /* v13.1: the muzzle flash, for the fixture's absence check and the probes */
                                                  flash: weaponDecl.flash || '', flashCards: weaponFlashCards.length, flashLit: weaponFlashT > 0,
                                                  /* flashOn is the FRAME's own answer — the cone is up on screen right
                                                     now — where flashLit only says the trigger was pulled. A probe on a
                                                     one-frame-a-second box must poll the first, never the second. */
                                                  flashOn: !!(weaponFlashObj && weaponFlashObj.visible),
                                                  shots: weaponLog.slice(-8) } : null,   // v12.0
           objective: kitObjective, timer: kitTimer ? +kitTimer.left.toFixed(2) : null,
           waypoint: kitWaypoint, conduct: { ...conductAcc, notes: conductAcc.notes.slice() },
           clock: decClock ? { left: +decClock.left.toFixed(2), fired: decClock.fired } : null,
           daylightTween: dayTween ? +dayTween.t.toFixed(3) : null,
           fade: +kitFadeNow.toFixed(3),
           event: ev ? { kind: ev.kind, t: +ev.t.toFixed(2), started: ev.started, briefing: !!ev.briefing, down: ev.down,
                         hits: ev.hits, misses: ev.misses, idx: ev.idx, bar: +ev.bar.toFixed(3),
                         /* v9.3: the graded ladder, readable — a harness has to be
                            able to see WHICH band a press landed in, not just a count */
                         slotT: +(ev.slotT || 0).toFixed(3), band: ev.band.slice(), sum: ev.sum,
                         /* v9.4: the rhythm game's run and the match's progress */
                         beat: ev.beat, combo: ev.combo, best: ev.bestCombo,
                         done: ev.done, wrong: ev.wrong } : null,
           hotspot: activeSpot ? (activeSpot.id || activeSpot.prompt || true) : null,
           hotspots: hotspotList().length };
}
/* ===================================================== end of the play kit */

/* v8.0: what a chapter has asked to have DECODED ahead of the player. It is
   only ever a list here: a chapter is built long before its sound pack has
   even downloaded, so warming at build time would decode nothing. The pack
   loader drains this the moment bytes land, and enterWorld drains it again
   for a chapter whose pack was already in memory (a replay). */
const WARM_WANT = new Set();
/* v8.8: AND THE ENGINE WARMS ITS OWN. `warmSounds` was built for a chapter,
   and the HUD's four sounds are the engine's — so nothing was asking for
   them and `snd()` returned null on the first objective change of every run
   (measured: 0 of 4 decoded at the first frame of play). Exactly v8.0's bug
   in the engine's own house. These are in the SHARED pack, so they are the
   one set that can be warmed unconditionally at boot. */
for (const n of ['hudok', 'hudnext', 'hudfail']) WARM_WANT.add(n);
/* v14.7: and the Item Unlocked splash's sting, for the same reason — it is
   the ENGINE's (`kit.unlock`), in the shared pack, and the frame it plays on
   is the frame the player picked the thing up. */
WARM_WANT.add('itemunlock');
/* v14.11: the amulet's crack and its shatter, the engine's for the same reason */
WARM_WANT.add('wardcrack'); WARM_WANT.add('wardbreak');
const CHCTX = {
  THREE, GLTFLoader: GLTFLoaderMO, cloneSkinned, scene, camera, yaw, pitch, LOW,   // v8.7: `pitch` so a chapter may level the lens as well as turn it
  kit: KIT,                        // v7.0: the play kit — declared by a chapter, absent for chapters 1–5
  plantTrees,                      // v6.15: a stand of Chad's trees, mixed and dealt from a seed
  assetBytes, rescueTextures, redoShadows, loadImageTexture,
  cnv, makeSoftDot, makeGround, makeGrass, makeConcrete, makeLacquer, makeHellNote,
  getState: () => state,           // `state` is declared below; read at call time
  startDecision,                   // a hoisted declaration, so naming it here is safe
  /* the thirteenth leak (v4.91): a chapter's WORLD may make a noise outside a
     cutscene — footsteps in the kitchen, a chair dragged in an empty room.
     Chapter 4's haunting is never seen, so this is the whole haunting. */
  worldSfx: (name, vol, rate, pan) => snd(name, vol, rate, pan),
  /* THE SEVENTEENTH SEAM (v8.0): a chapter may DECODE ahead of the player.
     `snd()` returns null when a sample has not decoded yet — sndBuf kicks the
     decode and the call plays nothing — and until now only a FILM's cues were
     warmed (`whenDecoded(introSamples())`). Measured on the shipped v7.9
     build: at the moment play begins, 46 samples are decoded and every one of
     episode 2 chapter 1's talk lines is not, so the first press of E at a
     soldier was silent BY CONSTRUCTION. Chapters 1-5 never call this: their
     play-time narration is one line on a timer, not something a player asks
     for at a moment of their choosing. */
  warmSounds: (names) => { for (const n of (Array.isArray(names) ? names : [names])) WARM_WANT.add(n); },
  /* v15: SPHERE CULLING — a root whose meshes three cannot cull (a skinned
     clone posed from a skeleton elsewhere), culled by a generous sphere in
     the root's own space: (root, cx, cy, cz, radius) */
  cullBySphere,
  /* THE HEAD BONE, named once for everybody (v5.01). Every rigged human in
     this game is a Mixamo skeleton, and glTF SANITIZES its node names:
     `mixamorig:Head_06` in the file is `mixamorigHead_06` in the scene. The
     obvious `/Head$/` therefore matches NOTHING — and a bone lookup that
     finds nothing fails in total silence, so ch2's mother nodded at no one
     and ch3's and ch5's tang-ki never bowed, from v4.8 to v5.0, with no
     error anywhere. The optional `_NN` covers both naming styles and the
     anchor still excludes HeadTop_End. Same family as FINGER_RE: a fact
     about how models arrive, so the engine owns it, not each chapter. */
  HEAD_RE: /Head(_\d+)?$/
};
if (typeof CH.build !== 'function') {
  throw new Error('chapter ' + CH_KEY + ' registered no build() — see chapters/ch1.js');
}
let stage = CH.build(CHCTX);         // reassigned by rebuildStage(), below
let titleVideo = null;               // the title screen's backdrop, if it loads

/* The chapter's note ART, as opposed to the note drawn in code. A chapter
   names the asset key (`noteArt`); the engine downloads it once, keeps it
   for the session, and hands it to whichever chapter is playing — including
   after a rebuild, which makes a fresh set of materials.

   Loaded here rather than inside the chapter for one reason: the note the
   player is holding lives on the CAMERA, not in the world, so the engine
   owns one of the surfaces that has to change. One loader, one moment where
   every note becomes the real thing.                                     */
let noteArtTex = null;
function applyNoteArt() {
  if (!noteArtTex) return;
  stage.setNoteTexture?.(noteArtTex);
  if (noteProp) {                       // declared below; absent this early
    noteProp.material.map = noteArtTex;
    noteProp.material.color.setScalar(1.75);
    noteProp.material.emissive.setScalar(0.20);
    noteProp.material.emissiveMap = noteArtTex;
    noteProp.material.needsUpdate = true;
  }
}
if (CH.noteArt) {
  loadImageTexture(CH.noteArt).then(tex => { noteArtTex = tex; applyNoteArt(); });
}
scene.add(sky);          // added AFTER the chapter's world, so the first Group
                         // in the scene is still the world — several harnesses
                         // find it that way (see the note where `sky` is built)

/* --------------------------------------------------------------- the ghost */
/* She is not in the scene at all until you are near the burner — no silhouette
   to notice early. Inside her appear radius she fades up over about a second and
   walks toward you, stopping short. The trigger is your distance to the BURNER,
   not to her, so it fires however you approach the shrine.                     */

/* Where she waits. This is picked for the sightline, not for the floor plan:
   from out on the grass the lift core and the pillar rows hide most of the
   corridor, and a figure standing in the dark 20 m away cannot be seen at
   all. Just behind and beside the burner she is lit by the fire and stands
   against the smoke column, so you notice her from outside — which is the
   whole point of her showing up earlier.                                    */
const GHOST_HOME = new THREE.Vector3(CH.ghostHome.x, 0, CH.ghostHome.z);
const GHOST_FADE_TIME = 1.1;                           // seconds to come fully in

/* HER TERRITORY, AND IT BELONGS TO THE CHAPTER.
   -------------------------------------------------------------------------
   Every number here used to be chapter 1's void deck, written into the
   engine: she never came closer than 3.4 m, she appeared within 14 m of the
   burner, and she could glide anywhere inside a box 41 m across and 17 m
   deep. That is not a ghost system, it is chapter 1's ghost system — drop it
   into a four metre bedroom and she can never come near you, is always "in
   territory", and glides eighteen metres through the wall into nothing.

   So a chapter may declare `ghost: {...}` and override any of it. Every
   default below is the value that was hard-coded, unchanged, so chapter 1
   and the fixture behave exactly as they did — including the three
   different insets off the old GHOST_DECK_EDGE, which are preserved as
   offsets from `roam.maxZ` rather than quietly unified.

   MUTATED, never reassigned, like every other chapter-derived value: see
   the note on setChapter.                                                 */
const GHOST_TERRITORY = {
  minDist: 3.4,        // she never comes closer than this
  appearAt: 14.0,      // ...of the SHRINE, not of her; that is what makes her
                       //    appear however you approach it
  near: 5.5, far: 12,  // where a spawn ahead of the player may land
  cross: [6, 9],       // a crossing walks this far across the view
  away: [6, 10],       // a flee covers this much ground
  behind: 2.1,         // how far behind the shrine she first stands
  // the box she may stand in at all. Chapter 1's is the void deck: wide,
  // deep, and stopping short of the open grass so she never follows you out.
  roam: { minX: -20.5, maxX: 20.5, minZ: -18.8, maxZ: -1.45 }
};
const GH = { roam: {} };
function applyGhostTerritory() {
  /* THE ELEVENTH LEAK. Chapter 3's revision needed a chapter with no
     haunting at all — the ghost's one appearance there is a cutscene
     driving her mesh directly, and play must never stage her, drain for
     her, or speak her banner. `ghost: null` declares exactly that.
     UNDECLARED (undefined) still means chapter 1's numbers, so nothing
     about chapters 1 and 2 moves.                                      */
  GH.off = CH.ghost === null;
  const g = CH.ghost || {};
  for (const k of ['minDist', 'appearAt', 'near', 'far', 'behind']) {
    GH[k] = Number.isFinite(g[k]) ? g[k] : GHOST_TERRITORY[k];
  }
  for (const k of ['cross', 'away']) {
    GH[k] = Array.isArray(g[k]) && g[k].length === 2 ? g[k].slice() : GHOST_TERRITORY[k].slice();
  }
  Object.assign(GH.roam, GHOST_TERRITORY.roam, g.roam || {});
}
applyGhostTerritory();

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

assetBytes('ghost').then(GHOST_BUF => new GLTFLoaderMO().parse(GHOST_BUF, '', (gltf) => {
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
// A spawn the geometry hides is worse than no spawn at all (the review
// caught this on the deck: from the burner, an 11-14 m chase spawn lands
// BEHIND the rear wall). So: her roam box, and a clear line from the
// player's eyes to her, marched against the same boxes that stop the player.
const inRoam = (x, z) => x >= GH.roam.minX && x <= GH.roam.maxX
                      && z >= GH.roam.minZ && z <= GH.roam.maxZ;
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
    THREE.MathUtils.clamp(OFFER_POS.x - (px / d) * GH.behind,
                          GH.roam.minX, GH.roam.maxX), 0,
    Math.min(OFFER_POS.z - (pz / d) * GH.behind, GH.roam.maxZ - 0.15));
}

// a spot ahead of the player: inside the deck, inside the view, far enough
function pickAhead(dMin, dMax, spread, edge, minFromPlayer) {
  for (let i = 0; i < 14; i++) {
    const ang = yaw.rotation.y + (Math.random() * 2 - 1) * spread;
    const dist = dMin + Math.random() * (dMax - dMin);
    const x = yaw.position.x - Math.sin(ang) * dist;
    const z = yaw.position.z - Math.cos(ang) * dist;
    if (!inRoam(x, z)) continue;
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
    if (!inRoam(x, z) || !lineClear(x, z)) return false;
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
      const dist = GH.cross[0] + Math.random() * (GH.cross[1] - GH.cross[0]);
      const a0 = yaw.rotation.y + side * half, a1 = yaw.rotation.y - side * half;
      const fx = yaw.position.x - Math.sin(a0) * dist, fz = yaw.position.z - Math.cos(a0) * dist;
      const tx = yaw.position.x - Math.sin(a1) * dist, tz = yaw.position.z - Math.cos(a1) * dist;
      if (!inRoam(fx, fz) || !inRoam(tx, tz)) continue;
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
    const spot = pickAhead(GH.near, GH.far, 0.55, 0.88, GH.minDist + 1);
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
  /* v14.7: the amulet takes the bite first; only what is left reaches
     sanity. With no ward worn `rest` is exactly n, so this is v14.6 */
  const rest = wardSoak(n, true);
  stats.sanity -= rest;
  syncBars();
  if (Math.round(rest) > 0) sanityTick(Math.round(rest));
  if (stats.sanity <= 0) lose();
}

function ghostStartGlide(kind) {
  // she flees AWAY, or comes AT you — one glide, staged by intent
  if (kind === 'away') {
    const away = Math.atan2(ghost.position.x - yaw.position.x,
                            ghost.position.z - yaw.position.z);
    const ang = away + (Math.random() - 0.5) * 1.1;
    const dist = GH.away[0] + Math.random() * (GH.away[1] - GH.away[0]);
    const tx = THREE.MathUtils.clamp(ghost.position.x + Math.sin(ang) * dist,
                                     GH.roam.minX, GH.roam.maxX);
    // a hair inside the box, so a glide never lands exactly on the line
    // inRoam() tests
    const tz = THREE.MathUtils.clamp(ghost.position.z + Math.cos(ang) * dist,
                                     GH.roam.minZ, GH.roam.maxZ - 0.05);
    gGlide = { fx: ghost.position.x, fz: ghost.position.z, tx, tz,
               t: 0, dur: 0.62, ease: 'in4', hover: 0.28, fadeFrom: 0.6 };
  } else {                                           // toward — but never arriving
    const dx = yaw.position.x - ghost.position.x, dz = yaw.position.z - ghost.position.z;
    const d = Math.hypot(dx, dz) || 1;
    const stop = GH.minDist + 0.8;
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
  if (GH.off) {                        // a chapter with no haunting: she is
    reveal = 0; hauntK = 0;            // nowhere, costs nothing, stays parked
    gPhase = 'hidden';
    /* and HIDDEN, enforced here rather than assumed: this runs only outside
       cutscenes (the state check above), so it cannot fight the one scene
       allowed to show her, but it does catch a resume that arrives with the
       mesh still visible from another chapter's world. */
    if (ghost.visible) ghostOpacity(0);
    return;
  }

  const distToBurner = Math.hypot(yaw.position.x - OFFER_POS.x,
                                  yaw.position.z - OFFER_POS.z);
  const inTerritory = distToBurner < GH.appearAt;
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
        if (gTimer <= 0 || dPlayer < GH.minDist + 0.6) ghostStartGlide('away');
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
const vmHemi = new THREE.HemisphereLight(0x38486e, 0x0e1014, VM_REST.hemi);
vmScene.add(vmHemi);
const vmKey = new THREE.DirectionalLight(0x93aad4, VM_REST.key);
vmKey.position.set(-0.6, 1.0, 0.6);
vmScene.add(vmKey);
const vmFire = new THREE.PointLight(0xff8433, 0, 6, 1.4);   // brightens near the burner
vmLightsLive = true;
applyDaylight();     // now that the rig exists, the booting chapter's declaration
                     // reaches it too — a second call is idempotent by design
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
  /* v11.1: the torch sits where the hand does, a little higher and nearer,
     nosed a touch inward so the body reads as held, not floated */
  if (torchProp) {
    const PZ = 0.30, hH = Math.tan(THREE.MathUtils.degToRad(vmCam.fov / 2)) * PZ, hW = hH * vmCam.aspect;   // the frame at the PROP's depth, not the hand's
    /* v11.3 (Chad: "floating on desktop ... show lesser of the body"): the
       grip sits under the frame's bottom edge and the head is what shows */
    torchBase.set(Math.min(0.13, hW * 0.55), -hH * 0.86, -PZ);
    torchProp.position.copy(torchBase); torchProp.rotation.set(0.04, 0.16, -0.10);
  }
  /* v12.0: the weapon's placement (§8) was measured at desktop aspect,
     where the body's centre (x 0.12 at 0.30 m) sits at 0.51 of the frame's
     half-width. A portrait phone is a CENTRE CROP (AUDIT Part One) with a
     half-width of 0.067 at that depth, and the same x is past the edge —
     photographed: the front sight and nothing else. So the group is nosed
     inward by whatever it takes to keep the body at 0.55 of the half-width,
     and never outward (desktop stays exactly at the measured numbers). */
  /* v13.0: written into `weaponBase`, the REST the aim offsets from — the
     torch's precedent (v11.3), so a per-frame aim and a per-resize layout
     cannot fight over one position. */
  {
    const WZ = 0.30, wH = Math.tan(THREE.MathUtils.degToRad(vmCam.fov / 2)) * WZ, wW = wH * vmCam.aspect;
    weaponBase.set(Math.min(0, wW * 0.55 - 0.12), 0, 0);
    if (weaponProp) weaponProp.position.copy(weaponBase);
  }
  armBase.copy(armR.position);
}
/* v11.3: the rest positions the swap tween works from (layoutHands writes
   them; torchPropSync offsets them every frame) */
const armBase = new THREE.Vector3(), torchBase = new THREE.Vector3(), weaponBase = new THREE.Vector3();
layoutHands();

let handsReady = false;
let handModel = null;   // v11.1: the arm rig's own root, so the torch swap can hide the HAND and leave `armR` (the chapters' switch) alone
assetBytes('hands').then(handsBuf => new GLTFLoaderMO().parse(handsBuf, '', (gltf) => {
  const model = gltf.scene;

  /* Both arms ride in ONE skinned mesh, so the left cannot simply be hidden
     — collapsing its root bones shrinks those vertices to a point. Two roots
     here, not one: the exporter left `hand.L` a sibling of the arm chain
     rather than a child of `forearm.L`, so collapsing the upper arm alone
     would leave a hand floating on its own. */
  /* Names as three.js reports them, NOT as the file spells them: the glTF
     loader strips dots and brackets out of every node name, so `hand.R` in
     Blender arrives here as `handR`. Getting this wrong is silent — every
     lookup simply returns undefined and the hand never poses. */
  for (const n of ['upper_armL', 'handL']) {
    const b2 = model.getObjectByName(n);
    if (b2) b2.scale.setScalar(1e-4);
  }

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
    wrist: 'handR',            middle: 'f_middle03R',
    index: 'f_index03R',       pinky: 'f_pinky03R'
  };
  const BONE_IDS = {
    Thumb1: 'thumb01R',     Thumb2: 'thumb02R',     Thumb3: 'thumb03R',
    Index1: 'f_index01R',   Index2: 'f_index02R',   Index3: 'f_index03R',
    Middle1:'f_middle01R',  Middle2:'f_middle02R',  Middle3:'f_middle03R',
    Ring1:  'f_ring01R',    Ring2:  'f_ring02R',    Ring3:  'f_ring03R',
    Pinky1: 'f_pinky01R',   Pinky2: 'f_pinky02R',   Pinky3: 'f_pinky03R'
  };
  // every finger bone of the right hand, by name — the one pattern the pose
  // code, the rest/prayer captures and setHandCurl all read
  const FINGER_RE = /^(f_(index|middle|ring|pinky)|thumb)0[123]R$/;
  const oriented = new THREE.Group();
  oriented.add(model);
  armR.add(oriented);
  handModel = oriented;

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
      if (o.isBone && FINGER_RE.test(o.name)) {
        restPose[o.name] = o.quaternion.clone();
      }
    });

    /* The prayer pose, captured while the fingers are still straight.
       Straight is not enough on its own: the pack ships a SPLAYED rest
       pose, so simply uncurling gives a fan, and a fan is what made the
       chant scene look like two hands waving rather than añjali. Closing
       them means rotating each finger about the PALM normal — the axis
       fingers spread around — until the fan shuts. The thumbs come across
       to lie against the index fingers, which is what the Chinese
       hand-clasp actually looks like.                                   */
    const ADDUCT = { Index: -0.135, Middle: 0, Ring: 0.135, Pinky: 0.27, Thumb: -0.62 };
    const palmAxis = new THREE.Vector3();
    const m3s = new THREE.Matrix3();
    for (const finger in ADDUCT) {
      if (!ADDUCT[finger]) continue;
      const b = model.getObjectByName(BONE_IDS[finger + '1']);
      if (!b) continue;
      b.updateWorldMatrix(true, false);
      palmAxis.copy(palm).applyMatrix3(m3s.setFromMatrix4(b.matrixWorld).invert()).normalize();
      b.rotateOnAxis(palmAxis, ADDUCT[finger]);
    }
    prayerPose = {};
    model.traverse(o => {
      if (o.isBone && FINGER_RE.test(o.name)) {
        prayerPose[o.name] = o.quaternion.clone();
      }
    });
    // hand the fingers back straight before the walking curl is applied
    for (const n in restPose) {
      const b = model.getObjectByName(n);
      if (b) b.quaternion.copy(restPose[n]);
    }
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

  /* Size the model to a real hand rather than trusting the file. Different
     packages export in different units — this one comes through Blender's
     FBX path with a x100 armature — and a viewmodel that is a hundred times
     life size is not a subtle bug, it is a wall of skin. Wrist to middle
     fingertip is a distance that means the same thing in every model, so
     measure that and scale until it matches a hand.

     Measured from the BONES, never from a bounding box: this is a skinned
     mesh, and Box3.setFromObject reports the BIND pose, not the live one. */
  const HAND_LEN = 0.185;                  // wrist → middle fingertip, metres
  oriented.updateWorldMatrix(true, true);
  const spanNow = () => {
    const a = bone.wrist.getWorldPosition(new THREE.Vector3());
    const bmid = bone.middle.getWorldPosition(new THREE.Vector3());
    return a.distanceTo(bmid);
  };
  if (bone.wrist && bone.middle) {
    const span = spanNow();
    if (span > 1e-6) {
      model.scale.multiplyScalar(HAND_LEN / span);
      model.position.multiplyScalar(HAND_LEN / span);   // the wrist stays on the pivot
      oriented.updateWorldMatrix(true, true);
    }
    HAND_W = Math.max(1e-4, spanNow()) * 0.92;          // ≈ across the palm
  }

  fingerPose = [];
  model.traverse(o => {
    if (o.isBone && FINGER_RE.test(o.name)) {
      fingerPose.push({ name: o.name, curled: o.quaternion.clone() });
    }
  });

  handsReady = true;
}, (err) => console.warn('hands failed to load', err)))
  .catch(err => console.warn('hands failed to load', err));

let rightHandModel = null, rightOriented = null, fingerPose = null, restPose = null;
let prayerPose = null;              // straight AND closed, for añjali
let HAND_W = 0.06;                  // measured once the hand model lands

/* Añjali, built from a basis instead of tuned Euler angles — which is how
   the first attempt ended up with two splayed hands facing the camera a
   palm's width apart.

   The hand's own axes, set by the orientation step above: fingers −Z,
   palm −Y, index-to-pinky +X. Praying hands need the fingers pointing UP
   and each palm facing the OTHER hand:

     right hand → fingers +Y, palm −X   (it sits on +X, facing the middle)
     left hand  → fingers +Y, palm +X

   The left is the mirrored clone, and the mirror is INSIDE its group, so
   its rotation is applied after the flip and has to be derived separately
   rather than negated.                                                  */
const PRAYER_R = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1),
                                new THREE.Vector3(1, 0, 0),
                                new THREE.Vector3(0, -1, 0)));
const PRAYER_L = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1),
                                new THREE.Vector3(-1, 0, 0),
                                new THREE.Vector3(0, -1, 0)));

/* Slide the fingers from the walking curl into the prayer pose. Separate
   from setHandCurl because "straight" and "straight and closed" are
   different poses, and only the second one reads as praying hands. */
function setHandPrayer(root, k) {
  if (!fingerPose || !prayerPose) return;
  for (const f of fingerPose) {
    const b = root.getObjectByName(f.name);
    if (b && prayerPose[f.name]) b.quaternion.slerpQuaternions(f.curled, prayerPose[f.name], k);
  }
}

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

  /* The burner throws warm light on the hands as you get close to it.
     v14.0: `fireLight` may be NULL. Every chapter until episode 2's fifth
     had something warm to name here — a burner, a candle, an altar lamp, a
     chemlight, a fill on the firing line — and this line read its position
     unconditionally. An afternoon camp apron has no fire in it at all, and
     a chapter that says so honestly threw a TypeError on EVERY FRAME, which
     is silent to the player, invisible to all 24 harnesses (none of them
     listens for `pageerror`) and found only by a probe that does. No fire
     means no warm light, which is what `warm = 0` already meant at range.
     Episode 1's five all declare one, so nothing there is touched.        */
  const fire = stage.fireLight;
  const dFire = fire ? Math.hypot(yaw.position.x - fire.position.x,
                                  yaw.position.z - fire.position.z) : Infinity;
  const warm = fire ? Math.max(0, 1 - dFire / 7) ** 2 : 0;
  vmFire.intensity = warm * 2.4 * (0.82 + Math.sin(t * 11.3) * 0.12 + Math.random() * 0.06);
  vmHemi.intensity = VM_REST.hemi - warm * 0.16;
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
  if (evKey(e, true)) return;                     // v7.0: a live event owns Space / Enter / E
  if (e.code === 'KeyF' && state === 'play') { torchToggle(); return; }   // v7.0
  // Escape closes whatever is open: credits first, then the decision panel
  if (e.code === 'Escape' && !$('credits').classList.contains('hide')) {
    showCredits(false); return;
  }
  if (e.code === 'Escape' && state === 'decide') { dismissDecision(); return; }
  if (e.code === 'KeyE' && state === 'play') { interactNow(); return; }   // v7.0: the pile, else the nearest hotspot
  if (e.code === 'Space' && state === 'play' && weaponWant() && !e.repeat) { e.preventDefault(); weaponFire(); return; }   // v12.0
  if (e.code === 'KeyR' && state === 'play' && weaponWant()) { weaponReload(); return; }   // v12.0
  if (e.code === 'KeyQ' && state === 'play' && weaponWant()) { weaponAdsToggle(); return; }   // v12.2: aim
  keys[e.code] = true;
});
addEventListener('keyup', e => { if (evKey(e, false)) return; keys[e.code] = false; });

let lookX = 0, lookY = 0;            // accumulated look delta this frame
let lastWallLook = 0;                // v12.2: the recoil spring runs on WALL time
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

canvas.addEventListener('contextmenu', e => { if (state === 'play' && weaponWant()) e.preventDefault(); });
canvas.addEventListener('mousedown', e => {
  /* v13.0, Chad, of the load drill: "on desktop, when im playing it, the left
     click gestures fires the gun, which must not happen." It did: the window's
     own pointerdown routes a mouse press to `evPress` (a mouse under pointer
     lock never reaches the overlay), and THIS handler fired the rifle from the
     same click — so every press of the drill also sent a live round downrange,
     which on this range costs six sanity for firing before the order. A kit
     event owns the screen: `evKey` has said so for the keyboard since v7.0 and
     nothing ever said it for the mouse. Episode 1 declares no events and no
     weapon, so it cannot reach either half. */
  if (ev) return;
  if (e.button === 2 && state === 'play' && weaponWant()) { e.preventDefault(); weaponAdsToggle(); return; }   // v12.2
  if (e.button !== 0) return;
  if (locked && state === 'play' && weaponWant()) { weaponFire(); return; }   // v12.0: under lock the click is the trigger
  // With no pointer lock there is a real cursor, so clicking the heap works
  // the same way tapping it does on a phone. Locked, there is no cursor and
  // E is the way in.
  if (!locked && state === 'play' && stage.pile.hits(e.clientX, e.clientY)) {
    stage.pile.interact();
    return;
  }
  if (!locked && hotspotTap(e.clientX, e.clientY)) return;   // v14.7: a hotspot that can be clicked on
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
        && state === 'play'
        && ((stage.pile.hits(t.clientX, t.clientY) && stage.pile.interact())
            || hotspotTap(t.clientX, t.clientY))) {   // v14.7: or a hotspot that can be tapped on
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
                         ['credClose', 'a11y.closeButton'], ['creditsLink', 'a11y.creditsButton'],
                         ['menuBtn', 'a11y.menuButton']]) {
    const el = $(id); if (el && TEXT[k] !== undefined) el.setAttribute('aria-label', T(k));
  }
})();
const ui = {
  title: $('title'), hud: $('hud'), prompt: $('prompt'), interact: $('interact'),
  decide: $('decide'), result: $('result'), complete: $('complete'),
  episode: $('episode'),                                     // v6.3: the episode-complete card
  haunt: $('haunt'), over: $('over'), panic: $('panic'), chapter: $('chapter'),
  bSan: $('bSan'), bAwa: $('bAwa'), bWis: $('bWis'),
  vSan: $('vSan'), vAwa: $('vAwa'), vWis: $('vWis'),
  say: $('say'), teach: $('teach'), deltas: $('deltas'),
  rank: $('rank'), core: $('core'), pct: $('pct'),
  newConfirm: $('newConfirm')
};
const hint = $('hint');
/* The words that NAME the thing you can act on, and they belong to the
   CHAPTER — "the glowing pile", "the pile of hell notes" and "something is
   burning ahead" are all about a void deck, and chapter 2 is a bedroom with
   a gap beside the bed.

   A chapter declares `words: {...}`; anything it leaves out falls back to
   the string sheet, which is where chapter 1's live and where they stay. So
   chapter 1 and the sheet are untouched by this. */
/* v14.1: A DECLARED WORD WINS, EVEN WHEN IT IS EMPTY. `||` treated '' as
   "not declared" and handed back chapter 1's fallback, so the two chapters
   that declare `approach: ''` to mean "no floating label on a person" —
   episode 2's cookhouse (since v10.0) and its apron (since v14.0) — have
   both been telling the player "Something is burning ahead..." with nothing
   burning anywhere. Their own comments, and the engine's at the gate below,
   have said since v13.0 that an empty word removes the text; this is the
   line that makes it true. It is also the sheet's contract — EDITING-TEXT:
   "An empty cell removes that text" — so it holds for every word here, and
   every other chapter declares non-empty ones, which is why nothing else
   moves. */
const chWord = (k, fallbackKey) =>
  (CH.words && CH.words[k] !== undefined) ? CH.words[k] : T(fallbackKey);
/* v14.4: A FUNCTION, because a chapter's decision object is not a pile of
   notes. This was evaluated ONCE at module load and never went through
   `chWord`, so Step back on the decision printed "Press E at the glowing
   pile to look again" on a night live range and on a camp apron. Episode 1
   declares no `actLine`, so it still reads the same two strings it always
   did — the fallback IS the old expression. */
const actLine = () => (HAS_TOUCH ? chWord('actLineTouch', 'world.actLineTouch')
                                 : chWord('actLine', 'world.actLineKey'));
function setHint() {
  const el = $('hintTxt');
  if (!el) return;
  const base = IS_PHONE ? T('world.hintPhone')
    : HAS_TOUCH && !locked ? T('world.hintMouseTouch')
    : locked ? T('world.hintLocked')
    : T('world.hintEdges');
  const act = HAS_TOUCH ? chWord('actTouch', 'world.actHintTouch')
                        : chWord('act', 'world.actHintKey');
  el.textContent = act ? base + ' · ' + act : base;
}
/* Re-applied whenever the chapter changes: the badge under the reticle, the
   far prompt, and the hint along the bottom all name the same thing. */
function applyChapterWords() {
  const el = $('itxt');
  if (el) {
    el.textContent = HAS_TOUCH
      ? chWord('interactTouch', 'world.interactTextTouch')
      : chWord('interact', 'world.interactText');
  }
  const pr = document.querySelector('#prompt div');
  if (pr) pr.textContent = chWord('approach', 'world.burning');
  setHint();
}
if (HAS_TOUCH) $('ikey').textContent = T('world.interactKeyTouch');
applyChapterWords();
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
/* THE TWELFTH LEAK. The explore music bed is the void deck's — a dark
   ambient wash written for chapters that are hauntings. Chapter 3 is a
   CEREMONY: its music is the tang-ki band in its own beds, and the dread
   wash on top of a morning ritual read as exactly what it was, someone
   else's soundtrack (Chad: "the creepy music should no longer be playing
   in this chapter"). A chapter declares `musicVol` (0..1, default 1) and
   every site that writes the music gain reads this instead of MUSIC_VOL. */
/* v6.6: and a CUTSCENE may hold the music down — `api.music(k, secs)`, the
   verb v6.4's plan deferred — so chapter 1's opening film can play its own
   memory theme and hand over to the dread bed on the line that turns. The
   multiplier is cleared at both ends of every cutscene, like the ducks. */
let cineMusicK = 1;
const musicVolNow = () =>
  muted ? 0 : MUSIC_VOL * (Number.isFinite(CH.musicVol) ? CH.musicVol : 1) * cineMusicK;
function cineMusic(k, secs = 1.0) {
  cineMusicK = Math.max(0, Math.min(1, k));
  musicRamp(musicVolNow(), secs);
}

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
/* ------------------------------------------------------- ducking (v5.27) ---
   v5.26 gave the boy a bus and he was still buried the moment anything
   else played — Chad, on the shipped build: "he gets buried, this starts
   even in chapter 1". Measuring the things that land ON his lines says why,
   and it is not his level. Against his post-bus average of about -16 dBFS:

     firedie   -11.6 effective   LOUDER than he is
     strings   -17.4             1.4 dB under him
     gscream   -20.1             4 dB under him
     boom      -22.7             7 dB under him

   Speech wants roughly 10-15 dB over whatever shares the moment with it,
   and several of these fire at once and SUM. He had 1.4 dB over a dread
   chord. There was also nowhere left to go: his loudest take already peaks
   at -0.28 dBFS after the bus, so lifting him further clips.

   When the voice cannot come up, the mix must come down. Everything that
   is not a voice now passes through `bgGain` on its way to the master, and
   `bgGain` dips while anyone is speaking — the same move a film mixer makes
   under dialogue. Fast down (120 ms, so the first syllable is already
   clear), slow up (450 ms, so a gap between two lines does not pump the
   whole world up and down).                                             */
const BG_DUCK = 0.40;                    // -8 dB under any spoken line
let bgGain = null;
function bgOut() {
  if (!actx) return null;
  if (!bgGain) {
    bgGain = actx.createGain();
    bgGain.gain.value = 1;
    bgGain.connect(masterOut());
  }
  return bgGain;
}
/* Which sources are speaking right now. A Set rather than a counter so a
   source that somehow ends twice cannot strand the mix ducked forever —
   `stop()` fires 'ended' too, so a skipped cutscene releases it. */
const liveVoices = new Set();
/* v5.30: every voice source, in order, with when it started and ended —
   for the probe that proves two of his lines never sound at once. */
const voiceLog = [];
function duckSync() {
  if (!bgGain || !actx) return;
  const g = bgGain.gain, now = actx.currentTime, on = liveVoices.size > 0;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(on ? BG_DUCK : 1, now + (on ? 0.12 : 0.45));
}
/* Hold the mix down for as long as this source runs. 'ended' is added as a
   LISTENER, never as .onended — every caller already sets that, and
   clobbering it would leak narSrc/voiceSrc and wedge the narration floor. */
function voiceHold(src, name = '?') {
  liveVoices.add(src);
  const rec = { name, t0: actx ? actx.currentTime : 0, t1: null };
  voiceLog.push(rec); if (voiceLog.length > 200) voiceLog.shift();
  src.addEventListener('ended', () => {
    liveVoices.delete(src); rec.t1 = actx ? actx.currentTime : 0; duckSync();
  });
  duckSync();
}
/* THE EDGES OF A TAKE (v5.30). Chad: the compressor "adds this sound effect
   that sounds like a mic opening chuff or clipping sound at the start and
   end of every voiceline", and some lines "sound cut off prematurely".
   Measured, the bus was innocent — softening it moved nothing — and the
   FILES were the cause: eleven_v3 returns a take trimmed to its last
   audible sample, so nearly every one of his begins on signal and ends on
   it, several while the voice is still loud (v5fearB1's last 40 ms sit
   14 dB ABOVE the body of the line; v2D +9, vlost +5). A buffer that
   starts and stops on a non-zero sample is a click at ×3.5, and a
   syllable that ends at full level is a cut. So every voice source now
   gets an 8 ms fade in and a 50 ms fade out, applied on its own gain
   node before the bus: through the real chain that turns every one of
   those tails negative (+14.2 -> -1.5) and costs 0.2 dB of level. The
   bytes stay untouched, which keeps the masters the proven fallback.  */
const VOICE_FADE_IN = 0.008, VOICE_FADE_OUT = 0.05;
function voiceEdges(g, buf, plateau = 1) {
  const t = actx.currentTime, d = buf.duration;
  const up = Math.min(VOICE_FADE_IN, d * 0.25);
  const down = Math.min(VOICE_FADE_OUT, d * 0.25);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(plateau, t + up);
  g.gain.setValueAtTime(plateau, t + Math.max(up, d - down));
  g.gain.linearRampToValueAtTime(0, t + d);
}
/* one source, edged, on the right stage, held for the duck: the four
   play-time paths (narration, the cards, a scare, the opening line) all
   build theirs here, so the edge is one decision rather than four. */
function mkVoice(name, buf) {
  const s = actx.createBufferSource();
  s.buffer = buf;
  const g = actx.createGain();
  voiceEdges(g, buf, 1);
  s.connect(g);
  g.connect(outFor(name));
  s.__g = g;
  voiceHold(s, name);
  return s;
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
  musicGain.gain.value = musicVolNow();
  musicGain.connect(bgOut());
  if (!musicParked()) musicDecode();
}
/* v15: MUSIC THAT CANNOT SOUND IS NOT PLAYING. The explore bed is 120 s of
   stereo — 46 MB once decoded — and a chapter that declares `musicVol: 0`
   (chapter 3's ceremony, all five of episode 2) can never make it audible:
   every write of the music gain reads `musicVolNow()`, which is 0 there. It
   used to play on regardless, at gain 0, for the whole of such a chapter: a
   source still mixed on the audio thread every block (v14.16's law) and 46 MB
   held for a sound nobody could hear. Now it is STOPPED and let go three
   seconds after such a chapter begins (its own 1.2 s ramp to zero is long
   over by then), never decoded at all for a session that starts in one, and
   decoded again the moment a chapter with music is entered — from the top,
   faded in over the same 1.2 s, under that chapter's card. Mute, a duck, a
   film holding it down and the title never park it: only a chapter's own
   declaration does. */
let musicDecoding = false, musicFadeIn = false, musicParkAt = 0;
const musicParked = () => OPT.musicPark && Number.isFinite(CH.musicVol) && CH.musicVol <= 0;
function musicDecode() {
  if (musicBuf || musicDecoding || !actx) return;
  musicDecoding = true;
  assetBytes('music', true)
    .then(bytes => actx.decodeAudioData(bytes.slice(0)))   // v14.16: decoding DETACHES the buffer; decode a copy
    .then(buf => { musicDecoding = false; if (musicParked()) { musicFadeIn = true; return; } musicBuf = buf; if (musicWanted) musicStart(); })
    .catch(() => { musicDecoding = false; /* no file or no decoder; the game is fine without */ });
}
function musicPark() {
  if (musicSrc) { try { musicSrc.stop(); musicSrc.disconnect(); } catch {} musicSrc = null; musicFadeIn = true; }
  musicBuf = null;
}

function musicStart() {
  musicWanted = true;
  if (!actx) musicSetup();
  if (!actx) return;
  if (actx.state === 'suspended') actx.resume().catch(() => {});
  if (!musicBuf) { if (!musicParked()) musicDecode(); return; }   // v15: parked, or coming back
  if (musicSrc) return;
  if (musicFadeIn) {                   // v15: back from a park — faded in from silence, never cut in
    musicFadeIn = false;
    const g = musicGain.gain, now = actx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(0, now);
    g.linearRampToValueAtTime(musicVolNow(), now + 1.2);
  }
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
    g.linearRampToValueAtTime(musicVolNow(), now + 0.35);
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
  if (actx && actx.state === 'running' && (musicSrc || musicParked())) {   // v15: parked counts as started
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
// warm the booting chapter's own opening line at low priority
/* v14.16: only when the line IS its own file — every other opening line is in
   a sound pack, and asking assetBytes for it could only fail (walktest now
   reads every failed load) */
if (CH.voiceLine && (HOSTED ? ASSET_MAP[CH.voiceLine] : EMBED[CH.voiceLine])) assetBytes(CH.voiceLine, true).catch(() => {});

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
/* The line he says a few seconds into a chapter, and it belongs to the
   CHAPTER — "Almost midnight, and this is still the fastest way home" is
   about a void deck, and playing it in a bedroom would be nonsense. A
   chapter names its own asset key in `voiceLine`; one that names none opens
   in silence, which is a legitimate choice for a chapter that has already
   said its piece in an opening film.

   Keyed by that asset name, so changing chapter throws the previous
   chapter's buffer away rather than speaking it in the wrong room.       */
let voiceBuf = null, voiceSrc = null, voiceTimer = 0;
let voicePending = false;      // v5.30: his opening line is due and not yet said
let voiceWaits = 0;            // v5.30: how long it has waited on its decode
let voiceKey = null, voiceDecoding = false, voicePlayed = false;

function voiceDecode() {
  const key = CH.voiceLine;
  if (key !== voiceKey) { voiceBuf = null; voiceDecoding = false; voiceKey = key; }
  if (!key || voiceBuf || voiceDecoding) return;
  if (!actx) musicSetup();
  if (!actx) return;
  /* v14.16: only a line that IS its own file is fetched here (chapter 1's
     'voice'); every other opening line lives in a sound pack, and asking
     assetBytes for it was a request that could only ever fail */
  if (!(HOSTED ? ASSET_MAP[key] : EMBED[key])) return;
  voiceDecoding = true;
  /* v14.16: decodeAudioData DETACHES the buffer it is given, and this one is
     the cached one — so the second visit to a chapter in a session decoded
     an empty buffer and its opening line never played (measured: chapter
     1's "voice" on the first visit, and never after ch2 and back). A copy. */
  assetBytes(key)
    .then(bytes => actx.decodeAudioData(bytes.slice(0)))
    .then(buf => { if (CH.voiceLine === key) voiceBuf = buf; })
    .catch(() => { /* no file or no decoder; the game is fine without */ })
    .finally(() => { if (voiceKey === key) voiceDecoding = false; });
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
            'vghost', 'vfaint', 'vlow', 'vlost',
            'vscare1', 'vscare2', 'vscare3', 'vscare4']);
  /* and the CHAPTER's own: its room tone, and the two lines about the thing
     you can act on — which used to be listed here by chapter 1's names. */
  const amb = CH.ambience || AMBIENCE_DEFAULT;
  packWarm((amb.beds || []).map(b => b[0]));
  if (amb.atShrine) packWarm([amb.atShrine[0]]);
  if (CH.lines) packWarm([CH.lines.near, CH.lines.close, CH.lines.act].filter(Boolean));
  // a voiceLine that lives in the pack decodes here; one that is its own
  // asset (chapter 1's 'voice') is simply not a pack name, and this no-ops
  if (CH.voiceLine) packWarm([CH.voiceLine]);
}

/* WHAT A SCENE ASKS FOR, READ OFF THE SCENE.

   Both warm sets used to be hand-written lists of sound names, and the names
   were chapter 1's and chapter 2's. Chapter 3 would have played its opening
   film — four spoken lines, on a screen that has only just gone black —
   against buffers nothing had decoded, and its best scene would have had no
   dialogue. That is "the engine was chapter 1's engine" one more time, and
   adding chapter 3's names here would only have moved it to chapter 4.

   So the cues are read out of the scene itself. Chapter files ship
   UNMINIFIED — build.py copies them; only the engine goes through esbuild —
   so a scene's source really is its source, and every cue in the game is a
   literal. It is the same fact `chaptertest` leans on to check them
   statically, used here at runtime.

   Wrapped in try/catch and unioned with the hand-written floor below, so the
   worst this can do if it ever stops working is what the code did before. */
const CUE_RE = /\bsfx\(\s*[^,)]+,\s*'([a-zA-Z0-9_]+)'/g;
function cuesOf(fn) {
  if (typeof fn !== 'function') return [];
  try {
    return [...Function.prototype.toString.call(fn).matchAll(CUE_RE)].map(m => m[1]);
  } catch { return []; }
}
/* kinds -> the samples behind them. `step` is the one kind with no
   STING_SAMPLE row: it is routed to the footstep rotation before the table
   is ever consulted, so it has to be spelled out. */
function warmCues(kinds) {
  const out = [];
  for (const k of new Set(kinds)) {
    if (k === 'step') { out.push('step1', 'step2', 'step3', 'step4'); continue; }
    const smp = STING_SAMPLE[k];
    if (smp) out.push(smp[0]);
  }
  if (out.length) packWarm(out);
}

/* Everything a chapter's OPENING FILM asks for, decoded before it starts.
   A film is a worse case than a scene: it runs on a screen that has only
   just gone black, before the player has done anything at all, so nothing
   else has warmed the pack for it — and a line that misses its cue in the
   first ten seconds of a chapter is the first thing anyone notices. */
const INTRO_BED = ['clock', 'fan', 'breath', 'sobbing', 'dread', 'strings', 'boom',
                   'whisper', 'heart', 'doorcreak', 'bedcreak'];
/* the samples an opening film will ask for: its own cues, plus the bed */
function introSamples() {
  const out = new Set(INTRO_BED);
  for (const k of cuesOf(CH.intro)) {
    if (k === 'step') { ['step1', 'step2', 'step3', 'step4'].forEach(n => out.add(n)); continue; }
    const smp = STING_SAMPLE[k]; if (smp) out.add(smp[0]);
  }
  return [...out];
}
function warmIntroSet() { packWarm(introSamples()); }
/* v5.13: call `then` once every named sample that IS in the pack has
   decoded — or after capMs, so a decode that never lands cannot hold the
   film forever. A cue whose buffer is not ready is silent by design
   (sfx is sample-only), so this is the difference between a film with its
   voice and a film without it. */
function whenDecoded(names, then, capMs = 4000) {
  const t0 = performance.now();
  const tick = () => {
    const pending = names.filter(n => packJson && packJson[n] && !packBufs[n] && warmable(n));
    if (!pending.length || performance.now() - t0 > capMs) then();
    else setTimeout(tick, 60);
  };
  tick();
}

function queueVoice() {
  clearTimeout(voiceTimer);
  voicePlayed = false;
  voicePending = true;
  voiceWaits = 0;
  voiceDecode();
  const fire = () => {
    /* The line may live in the sound pack rather than as its own asset —
       chapter 3's does, chapter 1's 'voice' predates the pack — so the pack
       buffer is the fallback. sndBuf() also kicks the decode if the pack
       arrived after voiceDecode() looked. */
    const buf = voiceBuf || (CH.voiceLine ? sndBuf(CH.voiceLine) : null);
    if (state !== 'play' || muted || !actx
        || actx.state !== 'running' || !sfxOut()) { voicePending = false; return; }
    /* v5.30: a buffer still DECODING is waited for, not given up on. The
       timer used to fire once at two seconds and return if the bytes were
       not there yet, which on a slow phone dropped his opening line with no
       error — the probe box lost it every run. Bounded, so a pack that
       never arrives cannot hold the near line hostage. */
    if (!buf) {
      /* v14.16: and a line that is its own FILE is waited for while it
         decodes, as a pack line is while its pack arrives — since the
         curtain stopped holding for sound files, chapter 1's 'voice' can
         still be on the wire when this timer first fires */
      const stillComing = (CH.voiceLine && packJson && packJson[CH.voiceLine]) || voiceDecoding;
      if (stillComing && (voiceWaits = (voiceWaits || 0) + 1) < 80) { voiceTimer = setTimeout(fire, 250); return; }
      voicePending = false; return;
    }
    /* v5.30: it waits its turn. Chapter 4 spawns you 2.75 m from the chair
       whose near line fires at 3.2, so 'Sit down. Breathe.' was already
       running when 'I can do this.' landed on top of it two seconds in.
       Now nothing of his starts while a voice is live — and the near line
       holds until this one has been said (say() honours voicePending). */
    if (liveVoices.size > 0) { voiceTimer = setTimeout(fire, 250); return; }
    try {
      voiceSrc = mkVoice(CH.voiceLine || 'voice', buf);
      voiceSrc.onended = () => { voiceSrc = null; };
      voiceSrc.start();
      voicePlayed = true;
    } catch { voiceSrc = null; }
    voicePending = false;
  };
  voiceTimer = setTimeout(fire, VOICE_DELAY_MS);
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
const packNames = {};             // v14.16: pack ('' = shared, else a chapter key) -> the names it brought
const packOwner = {};             // v14.16: a chapter-pack name -> its chapter (shared names are absent)
/* v14.16: LEAVING A CHAPTER LETS ITS SOUNDS GO. A chapter's own pack holds
   only what that chapter can ask for (build.py's rule: exactly one chapter
   asks for it and the engine never does), so once it is left nothing can
   play them — yet every one it had decoded stayed decoded for the whole
   session, tens of megabytes of float audio a chapter, on a phone that
   reloads the tab when memory runs short. The compressed bytes stay (in
   packJson), so coming back decodes them again exactly as a fresh load
   does. A sound that is PLAYING keeps its own buffer to its end. */
function releaseChapterSounds(key) {
  const names = key && packNames[key]; if (!names) return;
  for (const n of names) { delete packBufs[n]; delete packPending[n]; }
}

function packSetup() {
  if (!actx) musicSetup();
  if (!actx || packGain) return;
  packGain = actx.createGain();
  packGain.gain.value = muted ? 0 : 1;
  packGain.connect(bgOut());
  ambGain = actx.createGain();
  ambGain.gain.value = muted ? 0 : 1;
  ambGain.connect(bgOut());
}
/* ------------------------------------------------------------ his voice ---
   THE BOY IS THE ONLY VOICE INSIDE YOUR HEAD, and until v5.26 he was mixed
   like a footstep: every narration line, every cutscene line and the
   opening line all went into packGain at the same unity the door hinges
   use. There was no seam to turn "him" up — which is why Chad heard him as
   "way too soft" while the measurements said his takes were fine.

   They were fine, and that was the problem. Measured over all 79 takes he
   averages -20.8 dBFS with peaks up to -1.9, a 19 dB crest: the takes were
   PEAK-matched (the v4.8 rule), and peak-matching aligns the loudest
   instant while leaving the average wherever the performance put it. River
   is a soft, breathy read, so his average sits a long way under his peaks
   and only ~3.5 dB over chapter 2's fan bed. Raising every sample uniformly
   cannot fix that: the loudest take (vscare1, -1.9 dB) leaves 1.9 dB of
   room, and 1.9 dB is not what "way too soft" means.

   So his lines get a BUS: a boost, then a compressor to hold the peaks the
   boost creates. The compressor is doing the real work — it lifts the
   average without ever letting a peak through, which is exactly the gap
   between what was measured and what was heard.

   v5.26 hung it before `packGain` so that mute and the volume slider kept
   working untouched. v5.27 had to move it OUT: `packGain` is ducked under
   dialogue now, and a bus that ducks itself is a bus that does nothing. So
   voices run to their own `voiceOut`, which is what mute ramps instead.

   `voiceOut` is the stage EVERY speaker shares — the boy, the mother, the
   auntie and the tang-ki — because the duck has to lift whoever is talking,
   not only him. Only his takes take the boost and the compressor on the
   way in; the other three are already 1.2 dB louder than he is and need
   the clarity, not the gain.                                             */
const VOICE_BOOST = 3.5;             // +10.9 dB into the compressor (v5.28: Aaron)
let voiceBusIn = null, voiceOut = null;
function voiceStage() {              // every voice, mute-able, never ducked
  if (!actx) return null;
  if (!voiceOut) {
    voiceOut = actx.createGain();
    voiceOut.gain.value = muted ? 0 : 1;
    voiceOut.connect(masterOut());
  }
  return voiceOut;
}
function voiceBus() {                // his takes only: boosted and evened out
  if (!actx) return null;
  const out = voiceStage();
  if (!voiceBusIn && out) {
    voiceBusIn = actx.createGain();
    voiceBusIn.gain.value = VOICE_BOOST;
    const comp = actx.createDynamicsCompressor();
    comp.threshold.value = -18;      // under his average, so it acts on speech
    comp.knee.value = 12;            // soft enough that it never pumps
    comp.ratio.value = 4;
    comp.attack.value = 0.004;       // fast enough to catch a consonant
    comp.release.value = 0.25;
    /* v5.28: a LIMITER after the compressor. Aaron reads 3.7 dB quieter than
       River with a 3.2 dB wider crest, so the boost that evens him out would
       otherwise clip his loudest takes (measured: 3 of 18 over 0 dBFS at this
       gain). The limiter is what buys the loudness without the clipping. */
    const lim = actx.createDynamicsCompressor();
    lim.threshold.value = -3;
    lim.knee.value = 0;              // a limiter, not a second compressor
    lim.ratio.value = 20;
    lim.attack.value = 0.001;
    lim.release.value = 0.05;
    voiceBusIn.connect(comp);
    comp.connect(lim);
    lim.connect(out);
  }
  return voiceBusIn;
}
/* Every take the boy speaks, by sample name. It is spelled out rather than
   pattern-matched because the file names do NOT separate the cast: his are
   `v*`, but so are the mother's (`v2ma`, `v4ma1`) and the auntie's
   (`v3aunt1`). A prefix rule would quietly put another actor on his bus.
   `chaptertest` asserts this set is exactly `who === 'james'` out of
   src/voicelines.js, so the registry stays the one source of truth and a
   new line that is never added here fails the build instead of shipping
   quiet. */
const JAMES_TAKES = new Set(['voice',
  'vpile', 'vnote', 'vgasp', 'vscoff', 'vpant', 'vrelief', 'vchantline',
  'vA', 'vB', 'vC', 'vD', 'vghost', 'vscare1', 'vscare2', 'vscare3',
  'vscare4', 'vlow', 'vfaint', 'vlost',
  'v2wake1', 'v2wake2', 'v2wake3', 'v2near', 'v2gap', 'v2call',
  'v2A', 'v2B', 'v2C', 'v2D',
  'v3wake1', 'v3wake2', 'v3wake3', 'v3wake4', 'v3chair', 'v3out1', 'v3out2',
  'v3play', 'v3altar', 'v3seen', 'v3grip', 'v3ask', 'v3left',
  'v3A', 'v3B', 'v3C', 'v3D',
  'v4wake1', 'v4wake2', 'v4wake3', 'v4voice', 'v4near', 'v4sit',
  'v4thinkA1', 'v4thinkA2', 'v4thinkA3', 'v4tired', 'v4wake3am', 'v4taunt',
  'v4regret', 'v4call1', 'v4call2', 'v4A', 'v4B', 'v4C', 'v4D',
  'v5wake1', 'v5wake2', 'v5wake3', 'v5voice', 'v5near', 'v5sit',
  'v5fearB1', 'v5disC1', 'v5learnD', 'v5A', 'v5B', 'v5C', 'v5D',
  // v6.4: the five lines of the chapter-1 opening film (the prologue)
  'vpro1', 'vpro2', 'vpro3', 'vpro4', 'vpro5',
  // v6.6: his three pick-up reactions in the same film
  'vpick1', 'vpick2', 'vpick3']);
/* v7.1: HIM AT EIGHTEEN. Episode 2's main character is the same person in
   a different voice (Gabriel, `jamesTeen` in the registry — his voice ages
   with his figure, docs/EPISODES-PLAN.md §6), so his takes ride the SAME
   bus as Aaron's: the bus is a dynamics tool, not a voice-specific one.
   A separate set because chaptertest holds each set to its own speaker,
   both directions. His files are `n*` — episode 2's chapters are n1..n5. */
const TEEN_TAKES = new Set([
  'n1pro1', 'n1pro1b', 'n1pro2', 'n1pro3', 'n1pro4', 'n1voice', 'n1near', 'n1act',
  'n1fallin', 'n1late', 'n1bedok', 'n1bedfail', 'n1shower', 'n1board',
  'n1lights', 'n1wake', 'n1hear', 'n1A1', 'n1A2', 'n1B1', 'n1B2', 'n1C1',
  'n1D1', 'n1A', 'n1B', 'n1C', 'n1D',
  // v9.5: the count-off and the toggle rope
  'n1one', 'n1rope',
  // v9.6: the man standing in the shower, hours before it turns itself on
  'n1ghost',
  // v10.0: EPISODE 2 CHAPTER 2, Nobody There: the film line, the four asks, two lines to himself, four card lines
  'n2pro', 'n2askA', 'n2askB', 'n2askC', 'n2askD', 'n2nobut', 'n2B1', 'n2C1',
  'n2A', 'n2B', 'n2C', 'n2D',
  // v10.2: his thought after the third bunkmate
  'n2known', 'n1omg', 'n2pro1', 'n2pro2', 'n2sigh', 'n2alone',
  // v11.0: EPISODE 2 CHAPTER 3, The Pressure: the four film lines, the torch spots, the three pressure lines, the scenes, the cards
  'n3pro1', 'n3pro2', 'n3pro3', 'n3pro4', 'n3spot1', 'n3spot2', 'n3spot3', 'n3spot5', 'n3spot6',
  'n3press', 'n3look', 'n3still', 'n3A1', 'n3A2', 'n3B1', 'n3B2', 'n3C1', 'n3C2', 'n3D1', 'n3D2',
  'n3A', 'n3B', 'n3C', 'n3D',
  // v12.1: EPISODE 2 CHAPTER 4, The Cyclist: the two film lines, the radio report, the two on the line, the four card lines, the dawn
  'n4pro1', 'n4pro2', 'n4report', 'n4notarget', 'n4back', 'n4dawn',
  'n4A', 'n4B', 'n4C', 'n4D',
  // v13.2: the rebuilt outcome scenes — the walk forward, the gasp on the
  // turn, the run, and the breathing under it
  'n4draw', 'n4gasp', 'n4runD', 'n4pant',
  /* v14.0: EPISODE 2 CHAPTER 5, The Last Question: the four film lines, the
     two of small talk, the four replies, the four card lines, and the
     closing narration that ends the episode */
  'n5pro1', 'n5pro2', 'n5pro3', 'n5pro4', 'n5hi', 'n5ord',
  'n5askA', 'n5askB', 'n5askC', 'n5askD',
  'n5A', 'n5B', 'n5C', 'n5D', 'n5close']);
/* The rest of the cast. They share `voiceOut` and the duck, but not the
   boost — see voiceStage() above. */
const CAST_TAKES = new Set(['v2ma', 'v4ma1', 'v4ma2', 'v4ma3', 'v5ma1', 'v5ma2',
  'v3aunt1', 'v3aunt2', 'v3aunt3', 'v3aunt4', 'v3aunt5',
  'v3aunt6',   // v14.7: the auntie gives him the amulet
  't5note', 't5teachA', 't5hallA', 't5fearB', 't5disC', 't5learnD1', 't5learnD2',
  // v7.1: episode 2's bunk — the sergeant, the buddy, a bunkmate
  's1fallin', 's1late', 's1bed', 's1standby', 's1again', 's1lights',
  'b1day', 'b1sleep', 'b1huh', 'k1board', 'k1three',
  'k3bush',   // v11.4: the bunkmate again, kneeling in chapter 3's harbour
  // v8.3: and the encik, who does most of the shouting
  'e1knock', 'e1backbunk',
  // v9.3: the two who shout on the run back — one line, two voices
  'b1hurry', 'k1hurry',
  /* v9.5: the headcount. The eight numbers are the buddy's and the
     bunkmate's own voices; `c1ten` is a TREATED copy of the buddy's and
     belongs on the same stage as the rest of the cast — it is a voice in
     the room, not a sting, so it ducks the beds like any other. */
  'e1count', 'e1extra', 'e1rope',
  'c1two', 'c1three', 'c1four', 'c1five', 'c1six', 'c1seven', 'c1eight', 'c1nine', 'c1ten',
  // v10.0: the breakfast in chapter 2: the encik (six), the buddy, the bunkmate, and a THIRD recruit (Ronan) for siao eh
  'e2A', 'e2saw', 'e2cock', 'e2ok', 'e2hmm', 'e2D1', 'e2D2', 'b2hear', 'k2three', 'r2siao',
  // v10.1: the buddy line re-voiced as a Singaporean Chinese uncle (David) at Chad's ask; b2hear stays in the pack
  'r2hear',
  // v10.2: the encik shouts the table back to its breakfast
  'e2hurry',
  // v11.0: chapter 3 — the buddy in the next scrape, the sergeant's brief and his hiss
  'b3here', 'b3C1', 'b3C2', 'b3C3', 'b3D', 's3brief', 's3hiss',
  /* v12.1: chapter 4 — the TOWER (a new speaker: the range officer on the
     PA and the radio), the safety officer under the encik's bark rule, the
     buddy on lane five, and the two who come off the other detail */
  't4load', 't4ready', 't4fire1', 't4fire2', 't4fire3', 't4cease', 't4who', 't4neg',
  't4roger', 't4endex', 't4man',
  'e4wait', 'e4down', 'e4line', 'e4back', 'b4stag', 'b4there', 'b4float', 'k4shout', 'r4run',
  /* v13.0: the three shouts on the frame the cyclist is seen, in three voices */
  'b4cyc', 'k4cyc', 'r4cyc',
  /* v14.0: chapter 5 — the encik out of Hawk Company, and the storeman */
  'e5hi', 'e5ord', 'e5turn', 'e5A1', 'e5A2', 'e5A3', 'e5A4', 'e5A5',
  'e5B1', 'e5B2', 'e5B3', 'e5B4', 'e5C', 'e5D1', 'e5D2', 'e5D3',
  'c5arms', 'c5store', 'c5form']);
const isVoice = name => JAMES_TAKES.has(name) || TEEN_TAKES.has(name) || CAST_TAKES.has(name);
/* v6.9: his WHISPERS go round the bus. Chad wanted the three pick-up
   reactions "almost whispering to himself" and they were re-voiced as
   whispers — but a whisper pushed through a 4:1 compressor with +10.9 dB
   in front of it comes out nearly as loud as speech (that is what a
   compressor is for): v6.8 cut the cue volume by 9 dB and the bus gave
   most of it back. So these few take a plain gain onto the same stage the
   bus lands on — mute-able, never ducked, ducking the beds like any
   voice — and keep the dynamics they were performed with. They stay in
   JAMES_TAKES (the registry's truth) and only the OUTPUT differs. */
const WHISPER_TAKES = new Set(['vpick1', 'vpick2', 'vpick3',
  'n1C1',     // v7.1: "Eh. You awake?" — whispered to the next bed after lights out
  'n2sigh',   // v10.8: the defeated sigh at three in the morning — a breath through the 4:1 bus comes out as loud as speech (v6.9), so it goes round it
  'n3C1', 'n3C2']);   // v11.0: whispered to the next scrape in the jungle (chapter 3, scene C)
const WHISPER_GAIN = 0.55;           // -5.2 dB: through a replica of the chain (dbg-whisperbus) his narration sits at -12.7 dBFS RMS, the whispers at -26 to -28.5 — 11 to 16 dB under him
let whisperOut = null;
function whisperStage() {
  if (!actx) return null;
  const out = voiceStage();
  if (!whisperOut && out) {
    whisperOut = actx.createGain();
    whisperOut.gain.value = WHISPER_GAIN;
    whisperOut.connect(out);
  }
  return whisperOut;
}
// where a sound belongs: his bus, his whispers' stage, the cast's stage, or the ducked pack
function outFor(name) {
  if (WHISPER_TAKES.has(name)) return whisperStage() || packGain;
  if (JAMES_TAKES.has(name) || TEEN_TAKES.has(name)) return voiceBus() || packGain;
  if (CAST_TAKES.has(name)) return voiceStage() || packGain;
  return packGain;
}

function packMuteSync() {
  if (!actx) return;
  const now = actx.currentTime;
  for (const g of [packGain, ambGain, voiceOut]) {
    if (!g) continue;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.35);
  }
}
/* WHICH PACK, AND HOW MANY.

   Until v4.2 this was one line: fetch `audiopack`, keep the JSON. That pack
   held every sound in the game, so a player who never left chapter 1 still
   downloaded chapter 3's twenty-three, and the first load grew every time a
   chapter was added. Two things changed, and neither is visible below the
   seam: sndBuf() is untouched, because the packs MERGE into the same object
   it has always read.

   ONE: the pack is split — shared, plus one per chapter (build.py computes
   which is which). The shared pack and the booting chapter's load at once;
   the next chapter's is fetched when the decision opens, which is minutes of
   play before its opening film can need it and only for a player who
   actually got that far.

   TWO: there are two encodings of every sound. Opus is ~35% smaller than the
   mp3 and, encoded from the surviving ElevenLabs masters, is a FIRST
   generation copy where the shipping mp3 is a second. But not every browser
   decodes it, and a wrong guess here is a game with no sound at all — so the
   choice is not a guess. A 179-byte Opus file is DECODED before anything is
   fetched, and only a browser that really produced an AudioBuffer from it is
   given the Opus packs. Everything else gets the mp3s, which are the bytes
   that have always shipped. An OfflineAudioContext is used deliberately: it
   needs no user gesture, so the answer is ready long before the first tap.

   The embedded single-file build keeps ONE mp3 pack of everything, as it
   always had — it is the offline fallback, it has no download to save, and
   there is no second file for it to fetch.                                */
const OPUS_PROBE =
  'T2dnUwACAAAAAAAAAAC9nVGQAAAAAOUMiAMBE09wdXNIZWFkAQE4AYC7AAAAAABPZ2dTAAAAAAAA'
  + 'AAAAAL2dUZABAAAAVZ8nLgE+T3B1c1RhZ3MNAAAATGF2ZjYwLjE2LjEwMAEAAAAdAAAAZW5jb2Rl'
  + 'cj1MYXZjNjAuMzEuMTAyIGxpYm9wdXNPZ2dTAAT4BAAAAAAAAL2dUZACAAAAtlB4FwIHBggL5jsj'
  + 'q2AICKyzDsY=';
let packFormat = 'mp3';
const packCodecReady = (() => {
  if (!HOSTED) return Promise.resolve();       // embedded: one mp3 pack, inline
  try {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC) return Promise.resolve();
    // 48 kHz because that is the only rate Opus encodes at, so the probe
    // asks the decoder to do nothing it would not do for a real sound; and a
    // length of 1024 rather than 1 because a one-frame context is the kind of
    // edge an older implementation refuses outright, and a refusal here reads
    // as "no Opus" and would cost a capable browser the smaller download.
    const probe = new OAC(1, 1024, 48000).decodeAudioData(b64ToBuffer(OPUS_PROBE));
    if (!probe || !probe.then) return Promise.resolve();   // callback-only: mp3
    return probe.then(() => { packFormat = 'opus'; }, () => {});
  } catch { return Promise.resolve(); }
})();

const packLoaded = Object.create(null);
/* Load one pack and MERGE it in. Chapter packs exist only in the hosted
   build; asking for one anywhere else is a no-op rather than a rejection. */
/* v15: a pack is either the BINARY one the hosted build ships ('MZP1', a
   small JSON index, then the sound files byte for byte — build.py
   write_pack_bin) or the JSON-of-base64 the single-file build inlines. A
   binary pack's sounds are VIEWS into its one buffer: nothing is copied or
   decoded until a sound is actually prepared (sndBuf), and then only that
   sound's own bytes. The old path parsed a multi-megabyte JSON string on the
   main thread at boot, held every sound as base64 text all session, and
   base64-decoded each one on the main thread as it was prepared. */
function packParse(b) {
  const u8 = new Uint8Array(b);
  if (u8.length >= 8 && u8[0] === 0x4D && u8[1] === 0x5A && u8[2] === 0x50 && u8[3] === 0x31) {
    const n = new DataView(b).getUint32(4, true);
    const index = JSON.parse(new TextDecoder().decode(u8.subarray(8, 8 + n)));
    const base = 8 + n, part = Object.create(null);
    for (const k in index) {
      const [off, len] = index[k];
      if (base + off + len > u8.length) continue;          // a truncated pack loses that sound, never the rest
      part[k] = u8.subarray(base + off, base + off + len);
    }
    return part;
  }
  return JSON.parse(new TextDecoder().decode(b));
}
function packLoad(chapterKey) {
  if (chapterKey && !HOSTED) return Promise.resolve();
  return packCodecReady.then(() => {
    const key = (packFormat === 'opus' ? 'opuspack' : 'audiopack')
              + (chapterKey ? '_' + chapterKey : '');
    if (packLoaded[key]) return packLoaded[key];
    return (packLoaded[key] = assetBytes(key, true)
      .then(b => {
        const part = packParse(b);
        packNames[chapterKey || ''] = Object.keys(part);   // v14.16: so a chapter's own can be let go
        if (chapterKey) for (const n in part) packOwner[n] = chapterKey;
        packJson = Object.assign(packJson || Object.create(null), part);
        packWarm(WARM_WANT);          // v8.0: whatever the chapter asked for, now that it exists
      })
      .catch(() => {
        /* A chapter with no sounds of its own simply has no pack, and that
           is not an error. A pack that failed to ARRIVE is, though, and
           forgetting it here is what lets the next packLoad() for the same
           chapter try again — setChapter() and startDecision() both call
           this at natural moments, so a dropped fetch costs a retry rather
           than a chapter that is silent for the rest of the run.        */
        delete packLoaded[key];
      }));
  });
}
packLoad();                                  // the shared sounds
packLoad(CH_KEY);                            // and the booting chapter's own

function sndBuf(name) {              // AudioBuffer if ready, else kick a decode
  if (packBufs[name]) return packBufs[name];
  if (!packJson || !packJson[name] || packPending[name]) return null;
  packSetup();
  if (!actx) return null;
  /* v14.16: the pending mark is a TOKEN, so a decode that lands after its
     chapter was left (releaseChapterSounds) is dropped rather than kept */
  const tok = packPending[name] = {};
  const src = packJson[name];
  /* a view into a binary pack is COPIED (decodeAudioData detaches what it is
     given — v14.16's law), a base64 string decoded, as before */
  actx.decodeAudioData(typeof src === 'string' ? b64ToBuffer(src) : src.slice().buffer)
    .then(buf => { if (packPending[name] === tok) packBufs[name] = buf; })
    .catch(() => { if (packPending[name] === tok) delete packPending[name]; });
  return null;
}
/* v14.16: a warm list is never a reason to decode ANOTHER chapter's own
   sounds — WARM_WANT keeps every name a chapter ever asked for this session,
   and without this each entry would re-decode what releaseChapterSounds let go */
function packWarm(names) { for (const n of names) if (warmable(n)) sndBuf(n); }
/* what a warm list may decode here — and so what a film may WAIT for: a
   name the warm skips will never decode, so waiting on it only spends the
   whole cap (v15: whenDecoded asks this too) */
function warmable(n) { const o = packOwner[n]; return (!o || o === CH_KEY) && herCanSound(n); }
/* v15: HER SOUNDS WHERE SHE CANNOT BE. Her cries, her scream, the whisper
   and the low bed that follow her, the chord of her first sight and his four
   frightened reactions are played by her state machine and nothing else —
   and a chapter that declares `ghost: null` parks that machine for good. Yet
   every entry into play, every decision and every film decoded them anyway
   (the warm lists were written for chapter 1): ~21 MB of audio held, and
   decoded on the phone's one decoder thread under the curtain, in eight
   chapters of ten, for sounds that cannot play there. A chapter that names
   one of them in its own code (a scene's cue, a bed) still gets it — the
   chapter's words and functions are read for the name, the way the cue scan
   reads a scene — and anything that ASKS for one still decodes it on the
   spot, exactly as before; only the warm lists stop asking on her behalf. */
const HER_ONLY = new Set(['strings', 'whisper', 'swoosh', 'sobbing', 'gscream', 'ghostloop', 'gwail', 'gsigh',
                          'vghost', 'vscare1', 'vscare2', 'vscare3', 'vscare4']);
let herSrcKey = null, herSrc = '';
/* the playing chapter's words and code as one text, read once per chapter:
   what it NAMES is what it can ask for (the cue scan's reasoning, applied
   to the whole chapter) */
function chText() {
  if (herSrcKey !== CH_KEY) {
    herSrcKey = CH_KEY;
    const parts = [], seen = new Set(), text = (v) => {
      if (typeof v === 'function') parts.push(String(v));
      else if (v && typeof v === 'object') { if (seen.has(v)) return; seen.add(v); for (const k in v) text(v[k]); }
      else if (typeof v === 'string') parts.push("'" + v + "'");
    };
    try { text(CH); } catch { /* an unreadable part names nothing */ }
    herSrc = parts.join('\n');
  }
  return herSrc;
}
function herNamed(n) {
  const t = chText();
  return t.includes("'" + n + "'") || t.includes('"' + n + '"') || t.includes('`' + n + '`');
}
function herCanSound(n) { return !OPT.herSounds || CH.ghost !== null || !HER_ONLY.has(n) || herNamed(n); }
function herRelease() {             // setChapter: into a chapter where she cannot sound, let hers go
  if (!OPT.herSounds || CH.ghost !== null) return;
  for (const n of HER_ONLY) if (!herCanSound(n)) { delete packBufs[n]; delete packPending[n]; }
}

function snd(name, vol = 1, rate = 1, pan = 0) {        // one-shot
  if (muted) return null;
  const buf = sndBuf(name);
  if (!buf || !actx || actx.state !== 'running') return null;
  const s = actx.createBufferSource();
  s.buffer = buf;
  s.playbackRate.value = rate;
  const g = actx.createGain();
  if (isVoice(name)) voiceEdges(g, buf, vol); else g.gain.value = vol;
  s.connect(g);
  let out = g;
  if (pan && actx.createStereoPanner) {   // where she IS, not just that she is
    const pn = actx.createStereoPanner();
    pn.pan.value = THREE.MathUtils.clamp(pan, -1, 1);
    g.connect(pn);
    out = pn;
  }
  out.connect(outFor(name));
  if (isVoice(name)) voiceHold(s, name);
  s.start();
  s.__g = g;        // so a caller can ramp it down instead of cutting it dead
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
    L.src = s;                                   // v14.16: so a chapter left can STOP it (loopRetire)
  }
  /* v15: only when the target MOVES. This runs for every bed every frame, and
     re-aiming an exponential approach at the SAME target from wherever it
     has got to is the same curve (the approach is memoryless) — so a repeat
     only queued another automation event for the audio thread to walk. */
  if (L.gain && L.set !== L.want) { L.gain.gain.setTargetAtTime(L.want, actx.currentTime, 0.3); L.set = L.want; }
}
function loopPan(name, v) {
  const L = packLoops[name];
  const c = THREE.MathUtils.clamp(v, -1, 1);
  if (L && L.pan && L.panSet !== c) {           // v15: only when it moves (loopVol)
    L.pan.pan.setTargetAtTime(c, actx.currentTime, 0.15);
    L.panSet = c;
  }
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
  /* v5.30 (Chad: his lines "will quickly stack on top of each other
     instead of waiting for the previous one to end"): a line also waits
     while ANY voice is live — a cutscene's last line finishing under the
     card, the film's last line under the fade — and while his opening
     line is still due, so the first thing heard in a chapter is the line
     written to be first. The callers retry every frame, so waiting is
     free: the near line simply lands when the floor is clear.        */
  if (muted || narSrc || voiceSrc || state === 'cine'
      || liveVoices.size > 0 || voicePending) { sndBuf(name); return; }
  const buf = sndBuf(name);
  if (!buf || !actx || actx.state !== 'running') return;
  if (once) narrated[name] = true;
  narSrc = mkVoice(name, buf);
  narSrc.onended = () => { narSrc = null; };
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
      if (!buf || narSrc || voiceSrc || liveVoices.size > 0
          || !actx || actx.state !== 'running') {
        if (performance.now() > deadline) return resolve(false);
        setTimeout(attempt, 160);
        return;
      }
      narSrc = mkVoice(name, buf);
      narSrc.onended = () => { narSrc = null; resolve(true); };
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
  g.linearRampToValueAtTime(musicVolNow() * 0.22, now + 0.5);
  g.setValueAtTime(musicVolNow() * 0.22, now + Math.max(1, sec - 1.5));
  g.linearRampToValueAtTime(musicVolNow(), now + Math.max(2, sec));
}

/* the per-frame mix: loop volumes derived from world state, the occasional
   ghost vocalisation, the heartbeat, the once-per-appearance reveal hit.  */
let nextCry = 0, nextBreath = 0, stepIdx = 0;
let wantLine = null, wantLineUntil = 0;   // a narration that must not be lost
// his fear has a voice: a different sound each time she reappears
const VSCARES = ['vscare1', 'vscare2', 'vscare3', 'vscare4'];
let scareIdx = Math.floor(Math.random() * VSCARES.length);
function scaredGasp() {
  // a scare three seconds late reads wrong, so this one is dropped, not held
  if (muted || narSrc || voiceSrc || liveVoices.size > 0 || state !== 'play') return;
  const name = VSCARES[scareIdx++ % VSCARES.length];
  const buf = sndBuf(name);
  if (!buf || !actx || actx.state !== 'running') return;
  narSrc = mkVoice(name, buf);
  narSrc.onended = () => { narSrc = null; };
  narSrc.start();
}
const STEP_TAKES = ['step1', 'step2', 'step3', 'step4'];
function stepSnd(vol) {
  const n = STEP_TAKES[stepIdx++ % STEP_TAKES.length];
  snd(sndBuf(n) ? n : STEP_TAKES[0], vol, 0.94 + Math.random() * 0.12);
}
/* Chapter 1's, exactly: the deck's night bed, and the burner's fire keyed
   to how close you are standing to it. */
const AMBIENCE_DEFAULT = { beds: [['amb', 0.33]], atShrine: ['fire', 0.6, 16] };
/* Every loop name any chapter has asked for this session. Changing chapter
   silences the ones the new one does not use — otherwise the outgoing
   chapter's fire would go on crackling in the incoming chapter's bedroom,
   because nothing would ever set it back to zero. */
const liveLoops = new Set();

/* A CUTSCENE MAY HOLD A CHAPTER'S OWN LOOPS DOWN.

   The ninth leak, and it only showed up when a chapter had a bed that
   STOPS. Chapters 1 and 2 run room tones — a deck's crickets, a fan, a
   clock — and a room tone is a room tone: nothing in either chapter ever
   wants one to go quiet for four seconds and come back. Chapter 3's tent
   runs a ritual drum, and its opening film is built entirely on the moment
   that drum stops: forty people, one held breath, and nothing.

   The ambient frame re-asserts every bed's volume every frame, so a scene
   calling loopVol() directly would be overwritten before it was heard. This
   is a multiplier the frame respects instead. Keyed by loop name, 1 means
   untouched, and it is cleared both when a cutscene starts and when one
   ends — so it can never leak into play, and a scene that ducks cannot
   leave the next scene silent.                                          */
let cineDuck = null;
const duckLoop = (name, k) => {
  if (!cineDuck) cineDuck = Object.create(null);
  cineDuck[name] = k;
};
const duckOf = name => (cineDuck && name in cineDuck) ? cineDuck[name] : 1;

function silenceChapterLoops() {
  const amb = CH.ambience || AMBIENCE_DEFAULT;
  const keep = new Set((amb.beds || []).map(b => b[0]));
  if (amb.atShrine) keep.add(amb.atShrine[0]);
  for (const n of [...liveLoops]) if (!keep.has(n)) { loopVol(n, 0); loopRetire(n); }
}
/* v14.16: a loop the new chapter does not use is STOPPED once it has faded,
   not left running at zero. A source at gain 0 is still mixed on the audio
   thread every block, so every bed of every chapter visited — thirty-odd by
   the end of episode 2 — ran silently for the rest of the session, costing
   a phone battery and holding its decoded audio. Coming back to the chapter
   starts the bed afresh (under the card, where nobody hears where a loop
   begins). */
function loopRetire(n) {
  const L = packLoops[n];
  delete packLoops[n]; liveLoops.delete(n);
  if (!L || !L.src || !actx) return;
  const t = actx.currentTime, src = L.src, g = L.gain, pan = L.pan;
  try { g.gain.setValueAtTime(0, t + 1.9); src.stop(t + 2.0); } catch { return; }
  src.onended = () => { try { src.disconnect(); g.disconnect(); if (pan) pan.disconnect(); } catch {} };
}

function updateAudioFrame(t) {
  /* v15: the park (musicDecode above) — three seconds into a chapter that
     declares its music silent, the source stops and the 46 MB go */
  if (musicParked() && (musicSrc || musicBuf)) {
    if (!musicParkAt) musicParkAt = t + 3;
    else if (t > musicParkAt) { musicPark(); musicParkAt = 0; }
  } else musicParkAt = 0;
  if (!packJson) return;
  const inWorld = state !== 'title' && state !== 'chapter';

  /* THE ROOM TONE, AND IT BELONGS TO THE CHAPTER.
     A void deck's night is crickets and far traffic under a joss fire that
     gets louder as you approach the burner. A bedroom's is a fan, a clock
     and the traffic four floors down, and there is no fire in it at all —
     played unchanged, chapter 1's crackle would burn quietly on a shelf
     beside a boy's bed, at more than half volume, because a four metre room
     is always "near the shrine".

     `beds` are the loops that simply run while you are in the world;
     `atShrine` is one keyed to your distance from it. Chapter 1's values
     are the defaults, so nothing about the deck moves.                   */
  const amb = CH.ambience || AMBIENCE_DEFAULT;
  for (const [name, vol] of (amb.beds || AMBIENCE_DEFAULT.beds)) {
    loopVol(name, inWorld ? vol * duckOf(name) : 0);
    liveLoops.add(name);
  }
  const at = amb.atShrine;
  if (at) {
    const [name, vol, range] = at;
    const dFire = Math.hypot(yaw.position.x - SHRINE.x, yaw.position.z - SHRINE.z);
    loopVol(name, inWorld
      ? Math.pow(THREE.MathUtils.clamp(1 - dFire / range, 0, 1), 1.6) * vol * duckOf(name)
      : 0);
    liveLoops.add(name);
  }
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
  /* The thing you can act on, narrated on the first approach and again at
     the first clear look. WHICH lines those are belongs to the chapter:
     "someone's been burning offerings" is about a void deck, and saying it
     in a bedroom would be nonsense. A chapter with no `lines` simply says
     nothing, which is a legitimate choice for one that has already spoken
     in an opening film.                                                   */
  if (state === 'play' && CH.lines) {
    const far = Number.isFinite(CH.lines.nearAt) ? CH.lines.nearAt : 8;
    if (CH.lines.near && stage.pile.dist() < far) say(CH.lines.near);
    if (CH.lines.close && stage.pile.dist() < stage.pile.radius
        && stage.pile.inView()) say(CH.lines.close);
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
   the figure turning between them. head takes the divine eyes, neck the
   amulet, body the sak yant, and ONE hand slot takes whatever he holds —
   the chanting beads or the phone. (v5.09, Chad's call: the fifth box,
   'Light', went; four boxes, bigger. A save from before wore two hands and
   is folded into the one by applyState(), nothing dropped.) */
const GEAR_SLOTS = ['head', 'neck', 'body', 'hand'];
const SLOT_ICON = { head: 'e-eye', neck: 'e-amulet', body: 'e-yant', hand: 'e-hand' };
const BAG_SIZE = 10;   // two rows of five (v5.09; three rows before)

/* what an item is: an id, the words (from the sheet), and the one equipment
   slot it fits — null means it can only be carried. v14.6 (Chad): "Each item
   in inventory needs to have a proper graphic icon ... When equipped ...
   show the 3d model of the item slowly rotating in the equipped box." So an
   item may also name
     art   — an asset key: the item's painted ICON (Chad supplies them), shown
             in the bag and on the piece that follows the pointer
     model — an asset key: the item's 3D MODEL, turning in the box it is worn
             in, in the description area, and in the zoom window
     view  — how the model is presented: `tilt` (a lean toward the lens, so a
             long thing is not seen end-on) and `lens` (an extra turn so the
             first thing seen is its front)
   `icon` is the old line-drawn SVG, kept as the fallback for the moment
   before the art has loaded and for a build that cannot reach it.

   And the list is SHORT on purpose (v14.6): the phone, the house keys, the
   prayer beads and the hell note are gone — "they serve no gameplay purpose"
   — and a new game begins with an empty bag. A save that still holds one of
   them simply loses it, because applyState() drops any id not in this table
   (it always has; that is how a bad id is refused). */
const ITEM_DEFS = {
  torch: { icon: 'e-torch', slot: 'hand', art: 'icontorch', model: 'flashlight',   // v11.6: episode 2 chapter 3's flashlight, picked up off the ground and equipped to use
           view: { tilt: 0.42, lens: 0.9 }, rarity: 'common' },
  /* v12.0: the issued weapon. No chapter hands it out any more (v14.6: the
     torch is the only item in the game for now), but it stays DEFINED —
     rifle mode's seam is "the weapon is out while its item is in the hand
     slot", and the fixture chapter proves that seam with it. */
  rifle: { icon: 'e-rifle', slot: 'hand', rarity: 'common' },
  /* v14.7: Chad's LP Phiboon Rian (small), which chapter 3's auntie gives
     the boy. Worn in the AMULET box (the neck slot). `ward` is what it
     protects: fifteen points of sanity damage taken before sanity is, once
     per EPISODE — see THE WARD, below. No `view`: the model is baked with
     its face to +z, toward the lens. */
  /* v14.14: its views (the worn box, the description, the zoom, the unlock
     splash) draw `phiboonhd`, every triangle of the scan; the world's table
     keeps the light `phiboon` for distance and swaps to the full one close
     up (ch3's LOD). */
  amulet: { icon: 'e-amulet', slot: 'neck', art: 'iconamulet', model: 'phiboonhd', ward: 15, rarity: 'rare' },
  /* v14.13: Chad's LP Tim Khun Paen (Lode Series, Wat Lahanrai). DEFINED AND
     READY, GIVEN BY NO CHAPTER YET — Chad: "i have not decided where in the
     game i will introduce this amulet, but i want you to save it first ready
     for use." A chapter hands it out with kit.give('timkp'). Worn in the
     AMULET box, so it and the Phiboon are one-or-the-other. `evGuard` is what
     it does: the fraction of MINIGAME damage it takes away (0.5 = half) —
     see evCut(), below. Baked face to +z like the Phiboon, so no `view`. */
  timkp: { icon: 'e-amulet', slot: 'neck', art: 'icontimkp', model: 'timkp', evGuard: 0.5, rarity: 'ultrarare' }
};
/* v14.11: every item has a RARITY (Chad: "Torch is common rarity with grey
   colour coding, the lp phiboon amulet is rare rarity with blue colour
   coding"). The word is the sheet's (`rarity.<id>`), the colour is the
   class `r-<id>` in shell.html; an item that declares none is common.
   v14.13: 'ultrarare', pink (Chad), for the LP Tim Khun Paen. */
const RARITIES = ['common', 'rare', 'ultrarare'];
const itemRarity = id => { const r = ITEM_DEFS[id] && ITEM_DEFS[id].rarity; return RARITIES.includes(r) ? r : 'common'; };
const itemName = id => T('item.' + id + '.name', id);
const itemDesc = id => T('item.' + id + '.desc', '');

const inv = {
  gear: Object.fromEntries(GEAR_SLOTS.map(k => [k, null])),
  bag: new Array(BAG_SIZE).fill(null),
  held: null,          // { id, from } while an item is lifted or dragging
  sel: null,           // the slot the keyboard is on
  open: false
};
// v14.6: a new game starts with nothing — no beads worn, nothing carried

/* ── v14.7: THE WARD — an item that takes sanity damage first ────────────
   Chad: "When equipped, the sanity bar of the player should have an
   additional +15 as a yellow bar ... Anytime the player takes sanity damage
   ... it will first deduct from this yellow armour bar fully before
   deducting from the actual red sanity value. When the amulet has used up
   its 15 value, it will remain powerless for the entire episode's subsequent
   chapters, until the very end of the episode. When player moves into the
   next episode, the amulet will be recharged back to its original value
   again ... If the player unequips the amulet at any time, its effect will
   be removed."

   So an item may declare `ward: N`, and the charge is ONE pool that belongs
   to the EPISODE — not to the chapter, and not to the stats, which go back
   to their start at every chapter:
     charge — what is left; a float, because the drain takes it a fraction
              of a point a frame
     ep     — the episode it was charged for; entering another refills it
     enter  — its value when this chapter was ENTERED, so a faint and a Retry
              rewind it exactly as they rewind the stats (a faint must not
              be a way to lose the amulet's charge, nor a way to refill it)
   It protects only while a ward item is WORN. Taking it off keeps what is
   left and removes the effect; wearing it again brings the effect back
   with what was left — it never refills by being put back on. Every sanity
   DECREASE in the engine goes through wardSoak() — the ghost's chunks, the
   drain, the hurt bleed, every kit award, a choice's delta and the banked
   conduct — and nothing else can reach sanity (chapters never write the
   stats). With no ward worn, wardSoak() hands back exactly what it was
   given, so every player who does not wear one plays v14.6 to the number.
   One pool, sized by the largest ward in ITEM_DEFS: there is one ward item
   today, and a second would need its own pool. */
const WARD_FULL = Object.values(ITEM_DEFS).reduce((m, d) => Math.max(m, +d.ward || 0), 0);
const ward = { charge: WARD_FULL, ep: episodeOf(CH_KEY), enter: WARD_FULL };
/* the ward item being worn, or null */
function wardItem() {
  for (const k of GEAR_SLOTS) {
    const id = inv.gear[k];
    if (id && ITEM_DEFS[id] && ITEM_DEFS[id].ward > 0) return id;
  }
  return null;
}
/* ── v14.13: THE MINIGAME GUARD ──────────────────────────────────────────
   Chad, of the LP Tim Khun Paen: "Reduce all kinds of damage from minigame
   events by 50% ... across all minigames globally, once equipped. Whenever
   the player takes damage due to not playing well in minigames, whether it
   is sanity, awareness, or wisdom, with this amulet equipped, the damage is
   reduced by 50%."
   So an item may declare `evGuard: f` (0..1), and while it is WORN every
   stat DECREASE a minigame causes is multiplied by (1 - f). "A minigame" is
   a kit EVENT, all eight kinds and the match, and every place one charges
   the player goes through evCut(): a badly graded press or a missed beat
   (evScorePress), a wrong drop (evMatchDrop), the payout when the event
   ends (evResolve), and — because a chapter may punish a failed event with
   its own words — a kit.award or kit.conduct marked `{ minigame: true }`
   (episode 2 chapter 1's failed standby bed is the one there is today).
   Gains are never touched, and nothing that is not a minigame is: the
   ghost, the drain, the hurt bleed, a choice, the decision clock. Not
   worn, evCut() hands back exactly what it was given. The halved amount
   is exact (a flat 5 becomes 2.5); the bars round what they show. It comes
   BEFORE the Phiboon's ward in kitAward, but the two share the neck slot,
   so they never stack today. */
function evGuard() {
  let g = 0;
  for (const k of GEAR_SLOTS) {
    const d = inv.gear[k] && ITEM_DEFS[inv.gear[k]];
    if (d && d.evGuard > 0) g = Math.max(g, Math.min(1, +d.evGuard));
  }
  return g;
}
function evCut(delta) {
  if (!(delta < 0)) return delta;
  const g = evGuard();
  if (g > 0) evCuts++;
  return g > 0 ? delta * (1 - g) : delta;
}
let evCuts = 0;                      // how many charges the guard has cut, for probes
/* what protects RIGHT NOW: the charge while one is worn, else nothing */
const wardLeft = () => (wardItem() ? Math.max(0, ward.charge) : 0);
/* the charge belongs to an episode: entering another one refills it */
function wardEpisode() {
  const ep = episodeOf(CH_KEY);
  if (ward.ep !== ep) { ward.ep = ep; ward.charge = WARD_FULL; ward.enter = WARD_FULL; }
}
/* n points of sanity damage arrive: the ward takes what it can, and what is
   returned is what reaches sanity. `instant` throws the ward's share as a
   tick at once (a chunk, an award, a choice); a drain batches it like the
   red ticks do. */
let wardAcc = 0, wardTickAt = 0;
function wardSoak(n, instant) {
  if (!(n > 0) || !wardItem() || !(ward.charge > 0)) return n;
  const took = Math.min(ward.charge, n);
  ward.charge -= took;
  if (ward.charge < 1e-6) ward.charge = 0;
  const broke = ward.charge === 0;   // it had charge to reach here, so this is the one hit that empties it
  if (instant) { const r = Math.round(took); if (r > 0) { sanityTick(r, 'w'); if (!broke) wardCrack(); } }
  else {
    wardAcc += took;
    const now = performance.now();
    if (broke) {                       // the last of it: throw what the batch still holds, then the break
      const r = Math.round(wardAcc); wardAcc = 0; wardTickAt = now;
      if (r > 0) sanityTick(r, 'w');
    } else if (wardAcc >= 1 && now - wardTickAt >= 460) {
      const r = Math.floor(wardAcc); wardAcc -= r; wardTickAt = now;
      sanityTick(r, 'w');
      wardCrack();
    }
  }
  if (broke) wardBroke();
  return n - took;
}
/* v14.11 (Chad: "Add a breaking or cracking sound effect everytime the
   amulet takes damage. When the amulet took all of its damage and lost all
   its powers, have an obvious crashing glass sound, with a HUD UI
   notification popping up to tell the player that the amulet has broken").
   A crack on every yellow tick the amulet throws — the ticks are already
   batched to one per 460 ms under a drain, so the crack is too — and on the
   hit that empties it the shatter INSTEAD, with its own banner. Both sounds
   are the engine's, in the shared pack, and warmed at boot (WARM_WANT). */
let wardCrackAt = 0;
const wardFx = { cracks: 0, breaks: 0 };          // counted for the harnesses: a muted sound leaves no other trace
function wardCrack() {
  const now = performance.now();
  if (now - wardCrackAt < 140) return;           // two hits on one frame are one crack
  wardCrackAt = now; wardFx.cracks++;
  snd('wardcrack', 0.8);
  haptic(22);
}
let wardBrokeTimer = 0;
function wardBroke() {
  wardFx.breaks++;
  snd('wardbreak', 1);
  haptic([60, 40, 140]);
  const el = $('wardBreak'); if (!el) return;
  el.classList.remove('on', 'out', 'hide'); void el.offsetWidth;   // restart the animation if it is already up
  el.classList.add('on');
  /* it must be SEEN (the v13.1 law): it stays until it has been up for 3.4 s
     of wall time AND twenty drawn frames, then fades out and hides when that
     fade has played. A wall-clock timer alone hid it before it was ever
     drawn — measured on this box: the page froze 6.8 s after the hit and a
     timed banner had come and gone inside the freeze. The long timer is
     only the backstop for a page whose frames and animations never run. */
  wbShownAt = performance.now(); wbFrames = 0;
  cancelAnimationFrame(wbRaf); wbRaf = requestAnimationFrame(wbTick);
  clearTimeout(wardBrokeTimer);
  wardBrokeTimer = setTimeout(wardBreakHide, 60000);
}
let wbShownAt = 0, wbFrames = 0, wbRaf = 0;
function wbTick() {
  const el = $('wardBreak'); if (!el || !el.classList.contains('on')) return;
  wbFrames++;
  if (wbFrames >= 20 && performance.now() - wbShownAt >= 3400) { el.classList.add('out'); return; }
  wbRaf = requestAnimationFrame(wbTick);
}
function wardBreakHide() {
  const el = $('wardBreak'); if (!el) return;
  clearTimeout(wardBrokeTimer); cancelAnimationFrame(wbRaf);
  el.classList.remove('on', 'out'); el.classList.add('hide');
}
$('wardBreak')?.addEventListener('animationend', e => { if (e.animationName === 'wbOut') wardBreakHide(); });

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

const SAVE_V = 2;                  // v1 (v3.5) still loads: no `at`, no `done`

/* `extra` carries what worldState() has no business knowing — where the
   player was standing, whether the chapter is sealed — and can override the
   stats, which the faint path needs (it writes the chapter's STARTING stats,
   not the zero sanity that just ended the run). Everything else is the plain
   run state, so a save is still just JSON. */
function saveCheckpoint(extra) {
  /* A ?ch= session is a deep link: a preview, a test, a shared "look at
     this bit". It reads no save and it writes none. Without this the first
     autosave of a deep-linked chapter would silently overwrite the run the
     player actually cares about — the read guard alone is not enough. */
  if (CH_ASKED) return false;
  try {
    const at = (extra && 'at' in extra) ? extra.at : {
      x: yaw.position.x, y: yaw.position.y, z: yaw.position.z, ry: yaw.rotation.y
    };
    const base = worldState();
    if (extra && extra.stats) base.stats = { ...extra.stats };
    if (extra && extra.ward) base.ward = { ...extra.ward };   // v14.7: a faint and a boundary say what the amulet holds
    if (extra && extra.ch && chapterExists(extra.ch)) base.ch = extra.ch;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      ...base, at, done: !!(extra && extra.done), t: Date.now()
    }));
    lastSaveAt = performance.now();
    return true;
  } catch { return false; }        // private mode, quota, or storage disabled
}
function loadCheckpoint() {
  /* An explicit ?ch= wins over the save. Asking for a chapter by name and
     being resumed into a different one is surprising for a player and
     wrong for a harness, which would otherwise inherit whatever run was
     left in that browser profile. */
  if (CH_ASKED) return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    // A save is only usable if it names a chapter this build still has.
    // Same rule as ?ch= — an unknown key falls back, never bricks the boot.
    if (!s || typeof s !== 'object' || (s.v !== 1 && s.v !== SAVE_V)) return null;
    if (!chapterExists(s.ch)) return null;
    return s;
  } catch { return null; }         // absent, unreadable, or half-written
}
function clearCheckpoint() {
  try { localStorage.removeItem(SAVE_KEY); return true; } catch { return false; }
}

/* Autosave. On by default and always on — there is no switch, because a
   switch implies it is sometimes off. It writes ONLY during play: restoring
   into a half-open decision or the middle of a cutscene is the fragile case
   and buys nothing, so those moments simply are not saved. */
const AUTOSAVE_MS = 8000;
let lastSaveAt = 0;
function autosave(force) {
  if (state !== 'play' || fainting) return false;
  if (!force && performance.now() - lastSaveAt < AUTOSAVE_MS) return false;
  return saveCheckpoint();
}

function worldState() {
  return {
    v: SAVE_V,
    ch: CH_KEY,
    stats: { sanity: stats.sanity, awareness: stats.awareness, wisdom: stats.wisdom },
    inv: { gear: { ...inv.gear }, bag: [...inv.bag] },
    /* v7.0: the chapter's bookmark, what play earned so far, and the letter
       picked per chapter — all absent from a save written before v7.0, and
       all optional to read back */
    phase: kitPhase,
    conduct: { s: conductAcc.s, a: conductAcc.a, notes: conductAcc.notes.slice() },
    choices: { ...runChoices },
    /* v14.7: the amulet's charge, the episode it belongs to and its value at
       this chapter's entry — absent from every save before v14.7 */
    ward: { charge: ward.charge, ep: ward.ep, enter: ward.enter },
    /* v12.0: the weapon's rounds and magazines, absent from every save
       before this release and from every chapter without a weapon */
    ...(weaponDecl ? { weapon: { rounds: weaponRounds, mags: weaponMags } } : {})
  };
}
function applyState(st) {
  if (!st || typeof st !== 'object' || (st.v !== 1 && st.v !== SAVE_V)) return false;
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
  invLoad(st.inv);
  torchAvailSync();   // v11.6: a torch that is an item follows the restored bag
  weaponAvailSync();  // v12.2: a resume must paint the weapon HUD too
  weaponAvailSync();  // v12.0: and so does the weapon
  if (weaponDecl && st.weapon && typeof st.weapon === 'object') {   // v12.0: the rounds and mags ride the save, tolerated absent
    const n = (v, fb) => (typeof v === 'number' && Number.isFinite(v)) ? Math.max(0, v | 0) : fb;
    weaponRounds = n(st.weapon.rounds, weaponRounds); weaponMags = n(st.weapon.mags, weaponMags);
  }
  // v7.0: the kit's three fields, each tolerated absent
  kitPhase = (typeof st.phase === 'string' || (typeof st.phase === 'number' && Number.isFinite(st.phase))) ? st.phase : null;
  const cd = (st.conduct && typeof st.conduct === 'object') ? st.conduct : {};
  const cap = v => (typeof v === 'number' && Number.isFinite(v)) ? Math.max(-CONDUCT_CAP, Math.min(CONDUCT_CAP, v)) : 0;
  conductAcc.s = cap(cd.s); conductAcc.a = cap(cd.a);
  conductAcc.notes.length = 0;
  for (const n of (Array.isArray(cd.notes) ? cd.notes : [])) if (typeof n === 'string') conductAcc.notes.push(n);
  runChoices = {};
  if (st.choices && typeof st.choices === 'object') {
    for (const [k, v] of Object.entries(st.choices)) if (typeof v === 'string' && /^[A-D]$/.test(v) && chapterExists(k)) runChoices[k] = v;
  }
  /* v14.7: the amulet's charge, tolerated absent (a save from before it
     existed leaves the ward as the chapter entry set it). A save written at
     an episode boundary carries the old episode, and the rule then refills
     it — entering a new episode recharges the amulet. */
  wardLoad(st.ward);
  wardEpisode();
  syncBars();
  return true;
}
/* the bag and the amulet's charge out of a save, each tolerated absent or
   malformed. Split out of applyState at v14.14 because the TITLE needs them
   too — see the boot, below paintTitle(). */
function invLoad(si) {
  if (!si || typeof si !== 'object') return;
  const ok = id => (typeof id === 'string' && hasOwn(ITEM_DEFS, id)) ? id : null;
  const g = (si.gear && typeof si.gear === 'object') ? si.gear : {};
  for (const k of GEAR_SLOTS) inv.gear[k] = ok(g[k]);
  const bag = (Array.isArray(si.bag) ? si.bag : []).map(ok);
  /* a save from before v5.09 wore TWO hands and carried three rows: the
     first hand that held something takes the one hand slot, and whatever
     has no place left goes into the bag — nothing an old save held is lost */
  const spare = [];
  for (const k of ['rightHand', 'leftHand']) {
    const id = ok(g[k]); if (!id) continue;
    if (!inv.gear.hand && ITEM_DEFS[id].slot === 'hand') inv.gear.hand = id; else spare.push(id);
  }
  for (let i = 0; i < BAG_SIZE; i++) inv.bag[i] = bag[i] || null;
  for (const id of [...bag.slice(BAG_SIZE).filter(Boolean), ...spare]) {
    const free = inv.bag.indexOf(null); if (free < 0) break;
    inv.bag[free] = id;
  }
  if (inv.open) invPaint();
}
function wardLoad(sw) {
  if (!sw || typeof sw !== 'object') return;
  const wn = v => (typeof v === 'number' && Number.isFinite(v)) ? Math.max(0, Math.min(WARD_FULL, v)) : null;
  const c = wn(sw.charge), e = wn(sw.enter), ep = Number(sw.ep);
  if (c !== null) ward.charge = c;
  ward.enter = e !== null ? e : ward.charge;
  if (Number.isInteger(ep) && ep >= 1) ward.ep = ep;
}

/* the game gives items out; chapters and scenes call these */
function invAdd(id) {
  if (!ITEM_DEFS[id]) return false;
  const i = inv.bag.indexOf(null);
  if (i < 0) return false;
  inv.bag[i] = id; if (inv.open) invPaint();
  return true;
}
function invClearAll() {
  inv.held = null;
  for (const k of GEAR_SLOTS) inv.gear[k] = null;
  inv.bag.fill(null);
  dragEl()?.classList.remove('on');
  if (inv.open) invPaint();
  torchAvailSync(); weaponAvailSync();
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
  /* v14.6: a WORN item with a model turns in its box as a live 3D view (its
     icon stands in until the model lands); a carried one shows its icon */
  const inner = def ? (kind === 'gear' && def.model && iv.state[id] !== 'none'
        ? `<canvas class="item model" data-iv="${id}" data-art="${id}"></canvas>`
        : itemVisHTML(id, 'item'))
    : kind === 'gear' ? iconSvg(SLOT_ICON[key], 'ghost') : '';
  const btn = `<button class="slot ${kind === 'gear' ? 'gear' : ''}" type="button"
      data-kind="${kind}" data-key="${key}"
      aria-label="${def ? itemName(id) : T('slot.' + key, 'empty')}">${inner}</button>`;
  // a worn slot's name sits UNDER the box, not inside it over the icon (v5.09)
  return kind === 'gear' ? `<div class="gslot">${btn}<span class="cap">${T('slot.' + key, key)}</span></div>` : btn;
}

/* the two columns beside the figure: his head and neck on the viewer's
   left, his body and hand on the right. The figure cell in between is
   never repainted — it holds a live WebGL canvas. */
const GEAR_LEFT = ['head', 'neck'], GEAR_RIGHT = ['body', 'hand'];
function invPaint() {
  const gearL = $('gearL'), gearR = $('gearR'), bag = $('invBag');
  if (!gearL || !gearR || !bag) return;
  gearL.innerHTML = GEAR_LEFT.map(k => slotHTML('gear', k, inv.gear[k])).join('');
  gearR.innerHTML = GEAR_RIGHT.map(k => slotHTML('gear', k, inv.gear[k])).join('');
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
    if (inv.flash && inv.flash.kind === kind && inv.flash.key === key) el.classList.add('flash');
    if (here) el.dataset.item = here;
  }
  inv.flash = null;   // one paint's worth: the animation runs, the next paint forgets it
  paintArt(bag); paintArt(gearL); paintArt(gearR);
  for (const id of [...inv.bag, ...Object.values(inv.gear)]) if (id && ITEM_DEFS[id].model) ivModel(id);
  invInfoPaint();
  torchAvailSync();   // v11.6: the torch button follows the hand slot
  weaponAvailSync();  // v12.0
}

/* v14.6: the description area. An item is shown as its 3D model on the
   LEFT (its icon if it has no model, or until the model lands) with the
   magnifying-glass button on the view, and its name and words to the RIGHT.
   The view is a canvas the preview frame fills; the button opens the zoom. */
function invInfoPaint(id) {
  const box = $('invInfo'); if (!box) return;
  const showing = id || inv.held?.id ||
    (inv.sel && (inv.sel.kind === 'gear' ? inv.gear[inv.sel.key] : inv.bag[+inv.sel.key]));
  if (!showing) {
    box.classList.remove('has');
    box.innerHTML = `<h4>${T('inv.empty')}</h4><p>${T('inv.emptyDesc')}</p>`;
    return;
  }
  const def = ITEM_DEFS[showing];
  const view = def.model && iv.state[showing] !== 'none'
    ? `<canvas class="ivView" data-iv="${showing}" data-art="${showing}" data-phase="1.3"></canvas>`
    : (def.art ? `<canvas class="ivView" data-art="${showing}"></canvas>` : iconSvg(def.icon, 'ivView'));
  const zoom = (def.model || def.art)
    ? `<button class="ivZoom" type="button" data-zoom="${showing}" aria-label="${T('inv.zoom')}"><svg aria-hidden="true"><use href="#e-zoom"/></svg></button>`
    : '';
  box.classList.add('has');
  const rar = itemRarity(showing);
  box.innerHTML = `<div class="ivPane">${view}${zoom}</div><div class="ivText"><h4>${itemName(showing)}</h4><span class="rar r-${rar}">${T('rarity.' + rar, rar)}</span>${wardLine(showing)}<p>${itemDesc(showing)}</p></div>`;
  paintArt(box);
  if (def.model) ivModel(showing);
}

/* v14.7: a ward item says what it has left — the one number the player
   cannot otherwise see once its yellow is gone from the bar */
function wardLine(id) {
  const def = ITEM_DEFS[id]; if (!def || !(def.ward > 0)) return '';
  const n = Math.round(Math.max(0, ward.charge));
  /* v14.11: short, and in the bar's own yellow — the number in bold, the
     word after it; spent, one line in red (Chad: "shortened and direct and
     concise, and also colour coded") */
  const txt = n > 0 ? T('inv.wardLeft', '{n}/{max} Protection').replace('{n}', `<b>${n}</b>`).replace('{max}', `<b>${def.ward}</b>`)
                    : T('inv.wardSpent', 'Broken · recharges next episode');
  return txt ? `<p class="ward${n > 0 ? '' : ' spent'}"><svg aria-hidden="true"><use href="#${n > 0 ? 'e-amulet' : 'e-amuletBroken'}"/></svg>${txt}</p>` : '';
}
const slotGet = (kind, key) => kind === 'gear' ? inv.gear[key] : inv.bag[+key];
const slotSet = (kind, key, v) => { if (kind === 'gear') inv.gear[key] = v; else inv.bag[+key] = v; };
const fits = (id, kind, key) => kind === 'bag' || ITEM_DEFS[id]?.slot === key;

function invLift(kind, key) {
  const id = slotGet(kind, key);
  if (!id) return;
  inv.held = { id, from: { kind, key } };
  const d = dragEl();
  d.classList.add('on');
  dragPaint(id);                                 // v14.6: the painted icon follows the pointer (painted once it has a size)
  invPaint();
}
function invDropAt(kind, key) {
  if (!inv.held) return;
  const { id, from } = inv.held;
  if (!fits(id, kind, key)) { invCancel(); return; }     // wrong slot: put it back
  const other = slotGet(kind, key);
  slotSet(from.kind, from.key, other);                   // swap, never destroy
  slotSet(kind, key, id);
  inv.flash = { kind, key };                             // the box it landed in lights up once
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
    inv.flash = { kind: 'gear', key: target };
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
  /* the zoom opens on the CLICK, not here: opened on the press, the window
     would be under the finger when it lifts, and the click that follows is
     then delivered to the panel's own backdrop — which closes the panel */
  if (e.target.closest?.('.ivZoom, .ivPane')) return;
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

/* ── THE ITEMS THEMSELVES (v14.6) ─────────────────────────────────────────
   Chad: "Each item in inventory needs to have a proper graphic icon to it,
   instead of drawn with lines ... When equipped ... show the 3d model of the
   item slowly rotating in the equipped box ... When the player clicks on an
   item in the bag, they can also see the 3d model of the item in the
   description area, left aligned, and description text sits right to the 3d
   model ... a magnifying glass zoom button ... a new window frame to show the
   full 3d model in a much bigger size and can be rotated by the user."

   THE ICON is a painted image (the item's `art`), decoded once to an
   ImageBitmap and DRAWN onto a <canvas> wherever it appears. Not an <img>:
   the single-file build runs under a CSP that forbids blob: and data: URLs,
   and a bitmap drawn to a canvas needs neither — the same reason the logo
   and the hell note load the way they do (loadImageTexture).

   THE MODEL is drawn by ONE small renderer of its own, on a canvas that is
   never in the page, and copied into each place that shows it with
   drawImage. One WebGL context rather than one per box: a phone allows only
   a handful, and Master Zav's panel already holds one. The small views (the
   worn box and the description) share one 256 px drawing size; the zoom
   window gets its own and is the only thing drawn while it is open, so the
   drawing buffer is never resized twice in a frame. Nothing here runs unless
   the panel is open. */
const itemArt = {};                 // id -> ImageBitmap | 'loading' | 'none'
function itemArtGet(id) {
  const def = ITEM_DEFS[id]; if (!def || !def.art) return null;
  const a = itemArt[id];
  if (a && a !== 'loading' && a !== 'none') return a;
  if (!a) {
    itemArt[id] = 'loading';
    assetBytes(def.art, true)
      .then(bytes => createImageBitmap(new Blob([bytes], { type: def.artType || 'image/jpeg' })))
      .then(bmp => {
        itemArt[id] = bmp;
        if (inv.open) invPaint();
        if (inv.held && inv.held.id === id) dragPaint(id);
      })
      .catch(() => { itemArt[id] = 'none'; });
  }
  return null;
}
/* what stands for an item in a box: the painted icon when it has one (a
   canvas the next paint fills), the line drawing until then or without it */
function itemVisHTML(id, cls) {
  const def = ITEM_DEFS[id];
  if (def.art && itemArt[id] !== 'none') return `<canvas class="${cls} art" data-art="${id}"></canvas>`;
  return iconSvg(def.icon, cls);
}
function drawArt(cv, id) {
  const bmp = itemArtGet(id);
  const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return false;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const g = cv.getContext('2d'); if (!g) return false;
  g.clearRect(0, 0, W, H);
  if (!bmp) return false;
  g.imageSmoothingQuality = 'high';
  g.drawImage(bmp, 0, 0, W, H);
  return true;
}
function paintArt(root) {
  if (!root) return;
  for (const cv of root.querySelectorAll('canvas[data-art]')) drawArt(cv, cv.dataset.art);
}
function dragPaint(id) {
  const d = dragEl(); if (!d) return;
  d.innerHTML = itemVisHTML(id, '');
  paintArt(d);
}

const IV_FOV = 26;
const iv = { r: null, scene: null, cam: null, models: {}, state: {}, raf: 0, size: '',
             zoom: { id: null, yaw: 0.6, pitch: 0.32, k: 1, drag: null, pinch: null, auto: true, ramp: 1 } };
function ivInit() {
  if (iv.r !== null) return !!iv.r;
  try {
    const cv = document.createElement('canvas');
    iv.r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true,
                                     preserveDrawingBuffer: true, powerPreference: 'low-power' });
  } catch { iv.r = false; return false; }
  iv.r.setPixelRatio(1);
  iv.r.setClearColor(0x000000, 0);
  iv.r.outputColorSpace = THREE.SRGBColorSpace;
  iv.r.toneMapping = THREE.ACESFilmicToneMapping;
  iv.r.toneMappingExposure = 1.38;   // a near-black metal torch reads at 64 px only with some lift
  iv.scene = new THREE.Scene();
  iv.cam = new THREE.PerspectiveCamera(IV_FOV, 1, 0.01, 50);
  iv.scene.add(new THREE.HemisphereLight(0xe8eeff, 0x2a2420, 0.9));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.4); key.position.set(1.4, 2.2, 2.6);
  const rim = new THREE.DirectionalLight(0x63d6c8, 1.3); rim.position.set(-2.0, 1.4, -2.2);
  iv.scene.add(key, rim);
  /* the room environment Master Zav's panel lights him with: an item made of
     black metal (the torch) is nothing but its reflections */
  try {
    const pmrem = new THREE.PMREMGenerator(iv.r);
    iv.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    iv.scene.environmentIntensity = 1.0;
    pmrem.dispose();
    iv.r.domElement.addEventListener('webglcontextrestored', () => {   // v15: see roomEnvAgain
      if (OPT.ctxRestore) try { roomEnvAgain(iv.r, iv.scene); } catch {}
    }, false);
  } catch { /* the lamps alone */ }
  return true;
}
/* An item's model, parsed once and kept: centred on its own middle, scaled
   so its longest side is one unit, and turned by its `view` so the first
   thing seen is the side worth seeing. The pivot is what a view spins. */
function ivModel(id) {
  const def = ITEM_DEFS[id]; if (!def || !def.model) return null;
  if (iv.state[id] === 'ready') return iv.models[id];
  if (iv.state[id]) return null;                       // loading, or it never will
  if (!ivInit()) { iv.state[id] = 'none'; return null; }
  iv.state[id] = 'loading';
  assetBytes(def.model, true).then(BUF => new GLTFLoaderMO().parse(BUF, '', (gltf) => {
    /* v14.14: every map at the sharpest filtering the device has — a zoomed,
       tilted amulet is nothing but oblique texels — including a map the
       strict-CSP rescue hands over late */
    const aniso = iv.r.capabilities.getMaxAnisotropy ? iv.r.capabilities.getMaxAnisotropy() : 1;
    const sharpen = m => { for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']) {
      const t = m && m[k]; if (t && t.anisotropy !== aniso) { t.anisotropy = aniso; t.needsUpdate = true; } } };
    rescueTextures(gltf, BUF, sharpen);
    const inner = gltf.scene;
    inner.traverse(o => {
      if (!o.isMesh) return;
      o.frustumCulled = false;
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
        if (m && 'envMapIntensity' in m) { m.envMapIntensity = 1.4; m.needsUpdate = true; }
        sharpen(m);
      }
    });
    inner.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(inner);
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z);
    if (!(longest > 0)) { iv.state[id] = 'none'; return; }
    inner.position.sub(c);
    const holder = new THREE.Group(); holder.add(inner);
    holder.scale.setScalar(1 / longest);
    const v = def.view || {};
    holder.rotation.set(v.tilt || 0, v.lens || 0, 0);
    const pivot = new THREE.Group(); pivot.add(holder);
    pivot.visible = false;
    iv.scene.add(pivot);
    pivot.updateMatrixWorld(true);
    /* the framing radius, measured after the turn and the scale: a long thin
       thing framed by its sphere would be a speck, so the radius is taken
       from the box as the view actually sees it, the widest the spin can
       make it (half the diagonal of the footprint, and the height) */
    const b2 = new THREE.Box3().setFromObject(pivot);
    const s2 = b2.getSize(new THREE.Vector3());
    pivot.userData.r = Math.max(Math.hypot(s2.x, s2.z) / 2, s2.y / 2, 0.1);
    iv.models[id] = pivot; iv.state[id] = 'ready';
    if (inv.open) invPaint();
  }, () => { iv.state[id] = 'none'; })).catch(() => { iv.state[id] = 'none'; });
  return null;
}
/* one frame of one item into the offscreen canvas; false when it cannot */
function ivRender(id, W, H, yawA, pitchA, k) {
  const pivot = ivModel(id); if (!pivot) return false;
  for (const [key, g] of Object.entries(iv.models)) g.visible = key === id;
  const sz = W + 'x' + H;
  if (iv.size !== sz) { iv.r.setSize(W, H, false); iv.size = sz; }
  iv.cam.aspect = W / H; iv.cam.updateProjectionMatrix();
  pivot.rotation.set(pitchA, yawA, 0, 'XYZ');
  /* back far enough that the widest the item can turn fits the SHORTER side
     of the frame, with a little air; `k` is the zoom window's pinch */
  const half = THREE.MathUtils.degToRad(IV_FOV / 2);
  const fitH = pivot.userData.r / Math.sin(half);
  const fitW = pivot.userData.r / Math.sin(Math.atan(Math.tan(half) * iv.cam.aspect));
  const d = Math.max(fitH, fitW) * 1.02 * k;
  iv.cam.position.set(0, 0, d); iv.cam.lookAt(0, 0, 0);
  iv.cam.near = d / 50; iv.cam.far = d * 4; iv.cam.updateProjectionMatrix();
  try { iv.r.render(iv.scene, iv.cam); } catch { return false; }
  return true;
}
function ivBlit(cv, id, yawA, pitchA, k, renderPx) {
  const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const g = cv.getContext('2d'); if (!g) return;
  const RW = renderPx ? Math.min(renderPx, W) : W, RH = renderPx ? Math.round(RW * H / W) : H;
  if (ivRender(id, RW, RH, yawA, pitchA, k)) {
    g.clearRect(0, 0, W, H);
    g.imageSmoothingQuality = 'high';
    g.drawImage(iv.r.domElement, 0, 0, RW, RH, 0, 0, W, H);
  } else if (!drawArt(cv, id)) {
    g.clearRect(0, 0, W, H);
  }
}
function ivFrame(now) {
  iv.raf = 0;
  if (!inv.open && !unl.id) return;
  iv.raf = requestAnimationFrame(ivFrame);
  const t = (now || performance.now()) / 1000;
  /* v14.7: the Item Unlocked splash owns the renderer while it is up (the
     panel cannot be open under it). It turns on WALL time, face first: a
     full turn in about ten seconds, the "slowly" Chad asked for, and the
     same speed on a phone that draws a frame a second as on a laptop. */
  if (unl.id) {
    const cv = $('unCv');
    const secs = ((now || performance.now()) - unl.t0) / 1000;
    if (cv) ivBlit(cv, unl.id, secs * 0.6, 0.1, 1, 0);
    return;
  }
  const z = iv.zoom;
  if (z.id) {
    const cv = $('ivZoomCv');
    if (z.auto) { z.ramp = Math.min(1, z.ramp + 1 / 20); z.yaw += 0.006 * z.ramp; }
    if (cv) ivBlit(cv, z.id, z.yaw, z.pitch, z.k, 0);
    return;
  }
  /* the small views: the worn box and the description, all at one drawing
     size so the renderer's buffer is set once, not per box */
  for (const cv of invEl().querySelectorAll('canvas[data-iv]')) {
    const spin = t * 0.55 + (cv.dataset.phase ? +cv.dataset.phase : 0);
    ivBlit(cv, cv.dataset.iv, spin, 0.34, 1, 256);
  }
}
function ivStart() { if (!iv.raf) iv.raf = requestAnimationFrame(ivFrame); }

/* THE ZOOM WINDOW: the item alone, big, turned by the player — a drag turns
   it and tilts it, a pinch or the wheel brings it nearer, and it keeps
   turning on its own until a finger takes it (Master Zav's rule, v5.11:
   straight back to turning when let go). Esc, the Close button or a tap on
   the dark around it takes the player back to the equipment screen. */
function ivZoomOpen(id) {
  if (!id || !ITEM_DEFS[id]) return;
  if (inv.held) invCancel(true);                 // nothing follows the pointer under it
  const z = iv.zoom;
  z.id = id; z.yaw = 0.6; z.pitch = 0.32; z.k = 1; z.auto = true; z.ramp = 1; z.drag = null; z.pinch = null;
  const el = $('invZoom'); if (!el) return;
  $('izName').textContent = itemName(id);
  $('izDesc').textContent = itemDesc(id);
  el.classList.remove('hide');
  el.classList.toggle('flat', !ITEM_DEFS[id].model || iv.state[id] === 'none');
  ivStart();
  snd('uiclick', 0.5);
}
function ivZoomClose() {
  if (!iv.zoom.id) return false;
  iv.zoom.id = null; iv.zoom.drag = null; iv.zoom.pinch = null;
  $('invZoom')?.classList.add('hide');
  snd('uiclick', 0.45);
  return true;
}
{
  const cv = $('ivZoomCv');
  const pts = new Map();
  const z = iv.zoom;
  cv?.addEventListener('pointerdown', e => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { cv.setPointerCapture?.(e.pointerId); } catch {}   // a pointer already gone throws
    z.auto = false;
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      z.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: z.k }; z.drag = null;
    } else z.drag = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  });
  cv?.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (z.pinch && pts.size >= 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > 0) z.k = THREE.MathUtils.clamp(z.pinch.k * z.pinch.d / d, 0.45, 1.6);
      return;
    }
    if (!z.drag) return;
    z.yaw += (e.clientX - z.drag.x) * 0.012;
    z.pitch = THREE.MathUtils.clamp(z.pitch + (e.clientY - z.drag.y) * 0.010, -1.35, 1.35);
    z.drag = { x: e.clientX, y: e.clientY };
  });
  const up = e => {
    pts.delete(e.pointerId);
    if (pts.size < 2) z.pinch = null;
    if (pts.size === 1) { const [a] = [...pts.values()]; z.drag = { x: a.x, y: a.y }; }
    if (pts.size === 0) { z.drag = null; z.auto = true; z.ramp = 0; }
  };
  cv?.addEventListener('pointerup', up);
  cv?.addEventListener('pointercancel', up);
  cv?.addEventListener('wheel', e => {
    e.preventDefault();
    z.k = THREE.MathUtils.clamp(z.k * Math.exp(e.deltaY * 0.0012), 0.45, 1.6);
  }, { passive: false });
  $('izClose')?.addEventListener('click', ivZoomClose);
  $('invZoom')?.addEventListener('click', e => { if (e.target === $('invZoom')) ivZoomClose(); });
}

/* ── v14.7: ITEM UNLOCKED — the NINETEENTH SEAM, `kit.unlock(id)` ─────────
   Chad: "The moment the player picks it up, i want a nice special 'Item
   unlocked' effect on the middle of the screen like a window frame, but not
   really a window frame, kind of like a semi-opaque splash screen that
   momentarily takes over the screen ... with nice sound effects. In this
   splash screen, the player can see the full 3d model of the amulet
   spinning/rotating slowly in the middle, with a close button at the bottom
   in the middle."
   So: a dark, see-through takeover with slow gold rays behind the item, ITEM
   UNLOCKED over it, the item's MODEL turning in the middle (the item views'
   own renderer, `iv` — no new WebGL context), its name, "Added to your bag",
   and Close at the bottom. It is a screen STATE of its own, `unlock`, so
   every "is it play?" gate in the engine closes under it — no walking, no
   drain, no ghost, no hotspot, no menu, no bag; the mouse is released so
   Close can be clicked and taken back when it goes. Enter, Space, Esc and E
   close it too, but not in its first 0.6 s: the E that picked the thing up
   must not also dismiss the moment it earned. `onClose` is the chapter's —
   what happens next is the story's business. Any chapter may call it; only
   chapter 3 does, so nothing shipped before v14.7 can reach it. */
const UNLOCK_GUARD = 600;
const unl = { id: null, t0: 0, onClose: null, outT: 0 };
function kitUnlock(id, opts = {}) {
  if (!ITEM_DEFS[id] || unl.id || state !== 'play' || fainting) return false;
  const el = $('unlock'); if (!el) return false;
  clearTimeout(unl.outT);
  unl.id = id; unl.onClose = typeof opts.onClose === 'function' ? opts.onClose : null;
  for (const k in keys) keys[k] = false;       // a held W does not keep walking under it
  state = 'unlock';
  $('unName').textContent = itemName(id);
  el.classList.remove('hide', 'out');
  el.classList.toggle('flat', !ITEM_DEFS[id].model || iv.state[id] === 'none');
  document.body.classList.add('unlockopen');
  document.exitPointerLock?.();
  itemArtGet(id); ivModel(id);                 // the icon stands in until the model is ready
  const cv = $('unCv');
  if (cv) { const g = cv.getContext('2d'); if (g) g.clearRect(0, 0, cv.width, cv.height); }
  ivStart();
  snd('itemunlock', 0.9);
  haptic([24, 60, 90]);
  /* the guard's clock starts HERE, after the work above: the first splash of
     a session creates the item renderer (ivInit renders a room environment),
     which is milliseconds on a phone and seconds on a software-rendered box,
     and a guard measured from before it could have expired before the
     splash was ever drawn */
  unl.t0 = performance.now();
  return true;
}
function unlockClose(how) {
  if (!unl.id) return false;
  if (how !== 'force' && performance.now() - unl.t0 < UNLOCK_GUARD) return false;
  const el = $('unlock');
  unl.id = null;
  document.body.classList.remove('unlockopen');
  if (el) {
    if (how === 'force') el.classList.add('hide');
    else { el.classList.add('out'); unl.outT = setTimeout(() => el.classList.add('hide'), 240); }
  }
  const cb = unl.onClose; unl.onClose = null;
  if (how === 'force') return true;            // torn down with the run (kitReset): no story, no sound
  state = 'play';
  snd('uiconfirm', 0.45);
  /* the mouse goes back to looking — from a click or a key, which are real
     gestures. Not from Esc: the browser does not count it as one, a refused
     lock marks the page as unable to lock at all, and the next click on the
     world takes it back anyway (mousedown's tryLock). */
  if (how !== 'esc') tryLock();
  if (cb) { try { cb(); } catch (e) { console.warn('unlock onClose failed', e); } }
  return true;
}
$('unClose')?.addEventListener('click', () => unlockClose('click'));
addEventListener('keydown', e => {
  if (!unl.id) return;
  if (['Enter', 'Space', 'Escape', 'KeyE', 'NumpadEnter'].includes(e.code)) {
    e.preventDefault();
    if (e.repeat) return;                      // an E still held from the pickup is not a second press
    unlockClose(e.code === 'Escape' ? 'esc' : 'key');
  }
});

/* ── MASTER ZAV, in three dimensions (v5.08) ──────────────────────────
   Chad's Guild Wars screen: the character himself turns in the middle of
   the panel and the boxes sit around him. A SECOND renderer on its own
   small canvas — the game's canvas is behind the panel's blur, and a
   modal figure wants its own lights and its own camera anyway. His model
   (a static sculpt: no bones, no clips — 40k triangles down from 990k)
   is fetched the first time the panel opens and kept; until it lands,
   and on a machine where it never does, the silhouette drawing behind
   the canvas is the figure. Drag on him to spin him; leave him and he
   turns on his own. Rendered only while the panel is open.           */
const zav = { r: null, scene: null, cam: null, pivot: null, model: null, ring: null,
              key: null,        // v5.29: which age of him is standing there
              loading: false, warm: false, raf: 0, spin: 0.35, auto: true, dragX: null, ramp: 1 };
function zavInit() {
  const cv = $('zavCanvas');
  if (!cv || zav.r) return;
  try {
    zav.r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true,
                                      powerPreference: 'low-power' });
  } catch { zav.r = null; return; }
  zav.r.setPixelRatio(Math.min(devicePixelRatio, 2));
  zav.r.setClearColor(0x000000, 0);
  zav.r.outputColorSpace = THREE.SRGBColorSpace;
  zav.r.toneMapping = THREE.ACESFilmicToneMapping;
  zav.r.toneMappingExposure = 1.15;
  zav.scene = new THREE.Scene();
  zav.cam = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
  zav.scene.add(new THREE.HemisphereLight(0xe4ecff, 0x2a2420, 0.8));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.2); key.position.set(1.6, 3.0, 2.6);
  const rim = new THREE.DirectionalLight(0x63d6c8, 1.4); rim.position.set(-2.2, 2.2, -2.4);
  zav.scene.add(key, rim);
  /* v5.09: the same little procedural studio the game's metal reflects,
     here at a strength that reads — a scanned man under three lamps is
     flat, one inside a lit room has soft light on every side of him */
  try {
    const pmrem = new THREE.PMREMGenerator(zav.r);
    zav.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    zav.scene.environmentIntensity = 0.45;
    pmrem.dispose();
    zav.r.domElement.addEventListener('webglcontextrestored', () => {  // v15: see roomEnvAgain
      if (OPT.ctxRestore) try { roomEnvAgain(zav.r, zav.scene); } catch {}
    }, false);
  } catch { /* no environment: the three lamps still light him */ }
  zav.pivot = new THREE.Group();
  zav.scene.add(zav.pivot);
  /* the ground under him: a soft jade pool of light and a thin ring that
     turns against his spin — the plinth a display figure stands on */
  {
    const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 128;
    const g = cv2.getContext('2d');
    const rg = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    rg.addColorStop(0, 'rgba(99,214,200,0.55)'); rg.addColorStop(0.45, 'rgba(99,214,200,0.16)');
    rg.addColorStop(1, 'rgba(99,214,200,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(cv2); tex.colorSpace = THREE.SRGBColorSpace;
    const pool = new THREE.Mesh(new THREE.CircleGeometry(0.75, 40),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2; pool.position.y = 0.002;
    zav.ring = new THREE.Mesh(new THREE.RingGeometry(0.50, 0.53, 64),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide }));
    zav.ring.rotation.x = -Math.PI / 2; zav.ring.position.y = 0.004;
    zav.scene.add(pool, zav.ring);
  }
  if (zav.model && !zav.model.parent) zav.pivot.add(zav.model);   // parsed before the panel existed (v5.10)
  cv.addEventListener('pointerdown', e => {
    zav.dragX = e.clientX; zav.auto = false;
    cv.setPointerCapture?.(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (zav.dragX === null) return;
    zav.spin += (e.clientX - zav.dragX) * 0.012;
    zav.dragX = e.clientX;
  });
  /* v5.11 (Chad): he turns again the moment you let go — no four-second
     wait — easing up to speed over about a third of a second so the
     hand-off from the finger to the turntable is not a jolt */
  const up = () => { if (zav.dragX === null) return; zav.dragX = null; zav.auto = true; zav.ramp = 0; };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
}
/* v5.10 (Chad's call: the full-detail man). The geometry is meshopt-packed
   and quantized — the upload's own Draco cannot run here, because its
   decoder is a worker built from a blob URL and the strict CSP forbids
   blob:, while meshopt's decoder is a plain WebAssembly module, which
   'unsafe-eval' permits. And the model is fetched and parsed WITHOUT the
   renderer, at boot in idle time (zavPrefetch), so the panel opens with him
   already standing there instead of a silhouette that fills in later. */
const zavLoader = () => new GLTFLoaderMO();   // v14.15: the one tracked, meshopt-reading loader
/* ------------------------------------------------------------------------
   WHICH MASTER ZAV TURNS IN THE PANEL — v5.29, and it is a TABLE because it
   changes with the story rather than with the code.

   Chad: "This young model should replace the current 3d model (adult master
   zav) that is rotating in the inventory menu. For episode 1 chapters 1 to
   5, whenever the inventory is opened, it should show young master zav, for
   story reasons. In future episode and chapters, when we enter the adult
   phase, the adult master zav model will then return... So do not delete
   the adult master zav configuration but instead save it for future use...
   In the next episode 2 (chp1-5), it will instead show teenager master zav
   model in the inventory, however, i will provide that model separately."

   So: the figure is the Master Zav of the EPISODE the player is in, and all
   three ages coexist. The adult is not removed — he is the DEFAULT, which
   is the strongest form of "kept": any chapter this table does not name
   gets him, so a future episode needs no engine change at all, only a row.

     episode 1  (ch1-ch5)   young     — shipping now
     episode 2  (ch1-ch5)   soldier   — 'zavsoldier' (v14.12: Chad's model,
                                         in place of the teenager he first planned)
     later                  adult     — 'zav', the scan, still here

   Keyed by EPISODE since v6.0 — the engine knows what an episode is now
   (episodeOf(), the registry above), so the table says what the contract
   says: one row per episode, and episode 2's chapters, whatever their keys,
   get the teenager the day his model arrives. Until then anything not
   listed here is the adult, which is the "kept" the contract asks for. */
const ZAV_FIGURE = {
  1: 'zavyoung',                      // episode 1, chapters 1-5 (and the fixture, which declares episode 1)
  2: 'zavsoldier',                    // episode 2, chapters 1-5: Master Zav as a soldier (v14.12, Chad's model; hosted-only, E2_ONLY)
};
const ZAV_ADULT = 'zav';              // kept, and the fallback for anything unlisted
function zavKey() { return ZAV_FIGURE[episodeOf(CH_KEY)] || ZAV_ADULT; }
function zavLoad() {
  const key = zavKey();
  /* a chapter from another episode wants another age of him: drop the one
     standing there and fetch the right one. Within episode 1 this never
     fires, because all five chapters name the same figure. */
  if (zav.model && zav.key !== key) {
    if (zav.pivot) zav.pivot.remove(zav.model);
    zav.model.traverse(o => {
      if (o.isMesh) {
        o.geometry?.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        /* v14.16: every map the figure carries, not only its colour — the
           adult this was written for had one map, the young and the soldier
           carry a normal and a metal-roughness map too, and those (and their
           decoded bitmaps) outlived every episode swap */
        for (const m of mats) {
          if (!m) continue;
          for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap', 'alphaMap', 'bumpMap']) {
            const t = m[k]; if (!t || !t.isTexture) continue;
            t.dispose();
            if (t.image && typeof t.image.close === 'function') { try { t.image.close(); } catch {} }
          }
          m.dispose();
        }
      }
    });
    zav.model = null; zav.warm = false;
  }
  if (zav.model || zav.loading) return;
  zav.loading = true;
  zav.key = key;
  assetBytes(key).then(BUF => zavLoader().parse(BUF, '', (gltf) => {
    const tex = ZAV_MIPS.has(key) ? zavMips : zavNoMip;   // v14.14: per figure
    rescueTextures(gltf, BUF, tex);
    const g = gltf.scene;
    g.traverse(o => { if (o.isMesh) { o.frustumCulled = false; tex(o.material); } });
    /* size and ground from the MESH — there are no bones to measure — to a
       man's 1.75 m, feet at the pivot's origin, centred on his own middle */
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    if (!(size.y > 0)) { zav.loading = false; return; }
    g.scale.setScalar(1.75 / size.y);
    const b2 = new THREE.Box3().setFromObject(g);
    const c = b2.getCenter(new THREE.Vector3());
    g.position.set(-c.x, -b2.min.y, -c.z);
    zav.model = g;
    zav.loading = false;
    if (zav.pivot) zav.pivot.add(g);
    $('gearFig')?.classList.add('has3d');
    zavWarm();
  }, () => { zav.loading = false; })).catch(() => { zav.loading = false; });
}
/* v5.11: NO shrunken copies of his texture (mipmaps). The scan's atlas packs
   its patches edge to edge — a black hair patch sits directly against a
   cream robe patch with no gutter — so every shrunken copy averages hair
   with cream, and on a phone, where the panel draws him small, that is a
   white streak along every seam of the hair. (Chad saw them on the back,
   sides and top; the close-ups never showed them because a close-up
   magnifies.) Plain bilinear sampling never reaches past one texel, and
   the one-texel line it leaves is fixed in the paint itself. The texture
   may arrive twice — the normal path or, under the strict CSP, the
   rescue — so this is applied where the material is, and again on the
   rescued map when it lands. */
function zavNoMip(m) {
  const t = m && m.map; if (!t) return;
  t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true;
}
/* v14.14: THE SOLDIER IS THE OPPOSITE CASE. Chad, from his phone: "the
   soldier model also looks bad on phone." His camouflage is fine,
   high-contrast detail, and without mipmaps a phone that draws him ~600
   pixels tall samples it several texels apart — the camo and the face
   shimmer into noise. His atlas DILATES every island into the fill around
   it (measured, tools/prepzavsoldier.mjs), so the shrunken copies do not
   average a patch with its neighbour the way the adult scan's did: he gets
   mipmaps, and the sharpest anisotropic filtering the device has, on every
   map. The adult and the young figure keep zavNoMip, untouched. */
const ZAV_MIPS = new Set(['zavsoldier']);
function zavMips(m) {
  if (!m) return;
  const aniso = zav.r && zav.r.capabilities.getMaxAnisotropy ? zav.r.capabilities.getMaxAnisotropy() : 1;
  for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) {
    const t = m[k]; if (!t) continue;
    t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = aniso; t.needsUpdate = true;
  }
}
/* one off-screen frame at 64 px: shaders compiled, geometry and texture on
   the GPU, so the first frame the player sees is not the slow one */
function zavWarm() {
  if (!zav.r || !zav.model || zav.warm) return;
  zav.warm = true;
  try {
    zav.r.setSize(64, 64, false); zav.cam.aspect = 1; zav.cam.updateProjectionMatrix();
    zav.cam.position.set(0, 0.98, 3.6); zav.cam.lookAt(0, 0.88, 0);
    zav.r.render(zav.scene, zav.cam);
  } catch { /* a machine that cannot: the panel will still try on open */ }
}
let zavPrefetched = false;
function zavPrefetch() {
  if (zavPrefetched) return;
  zavPrefetched = true;
  const go = () => { zavInit(); zavLoad(); zavWarm(); };
  if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 8000 }); else setTimeout(go, 2500);
}
function zavFrame() {
  if (!inv.open || !zav.r) { zav.raf = 0; return; }
  zav.raf = requestAnimationFrame(zavFrame);
  const cv = zav.r.domElement;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  const pr = zav.r.getPixelRatio();
  if (cv.width !== Math.round(w * pr) || cv.height !== Math.round(h * pr)) {
    zav.r.setSize(w, h, false);
    zav.cam.aspect = w / h;
    zav.cam.updateProjectionMatrix();
  }
  if (zav.auto) { zav.ramp = Math.min(1, zav.ramp + 1 / 20); zav.spin += 0.0085 * zav.ramp; }   // v5.11: a little faster, and straight back after a drag
  zav.pivot.rotation.y = zav.spin;
  if (zav.ring) zav.ring.rotation.z = -zav.spin * 0.5;
  /* 30 degrees of lens at 3.6 m sees 1.93 m at the figure: the whole man
     with a little air, whatever the panel's width */
  zav.cam.position.set(0, 0.98, 3.6);
  zav.cam.lookAt(0, 0.88, 0);
  zav.r.render(zav.scene, zav.cam);
}

function invOpen() {
  if (inv.open || state !== 'play' || ev) return;   // the bag belongs to the walk, not the cards (v14.4: nor to a live event)
  inv.open = true;
  invEl().classList.remove('hide');
  zavInit(); zavLoad();
  if (!zav.raf) zav.raf = requestAnimationFrame(zavFrame);
  ivStart();                           // v14.6: the items' own views
  document.body.classList.add('invopen');   // the round buttons step aside
  $('invBtn')?.classList.add('open');
  $('invHint').textContent = HAS_TOUCH ? T('inv.hintTouch') : T('inv.hintDesktop');
  statePrev = state;
  state = 'inventory';                 // freezes movement, drain and the ghost
  document.exitPointerLock?.();
  inv.sel = null;
  if (invUrge && inv.bag.includes(invUrge)) inv.flash = { kind: 'bag', key: String(inv.bag.indexOf(invUrge)) };   // v11.6: the thing the bag was pulsing for lights up
  invCancel();
  snd('uiclick', 0.5);
}
function invClose() {
  if (!inv.open) return;
  ivZoomClose();                       // v14.6: the zoom window goes with the panel
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
invEl()?.addEventListener('click', e => {
  // v14.6: the magnifying glass, or the view itself, opens the zoom window
  const zb = e.target.closest?.('.ivPane');
  if (zb) { const b = zb.querySelector('[data-zoom]'); if (b) ivZoomOpen(b.dataset.zoom); return; }
  if (e.target === invEl()) invClose();
});
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
  /* v14.6: while the zoom window is up it owns the keyboard: Esc closes it
     and goes back to the equipment screen, and nothing walks the slots
     underneath it */
  if (iv.zoom.id) { if (e.code === 'Escape') { e.preventDefault(); ivZoomClose(); } return; }
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
  /* the worn slots are two columns beside the figure (two left, two
     right, in DOM order): up and down walk a column, left and right hop
     between them; the bag is a grid of five */
  const step = { ArrowLeft: i >= bagStart ? -1 : -2, ArrowRight: i >= bagStart ? 1 : 2,
                 ArrowUp: i >= bagStart ? -cols : -1, ArrowDown: i >= bagStart ? cols : 1 }[e.code];
  if (step === undefined) return;
  e.preventDefault();
  if (i < 0) i = 0; else i = Math.max(0, Math.min(slots.length - 1, i + step));
  inv.sel = { kind: slots[i].dataset.kind, key: slots[i].dataset.key };
  invPaint();
});


/* ---------------------------------------------------- the pause menu -----
   v5.12 (Chad): a gear between the mute button and the inventory button, M
   or a tap. It freezes the walk exactly the way the inventory does — one
   state, `menu`, that every gate in the engine already treats as "not
   play" — and offers three things: back to the game, the chapter
   selector, and the title screen.

   THE CHAPTER SELECTOR is one panel, reached from the title screen and
   from this menu. A chapter is OPEN once the player has reached it: the
   furthest chapter reached is recorded on its own key, separate from the
   run's save, so starting a new game or replaying chapter 1 never locks
   chapter 4 again. Picking a chapter plays it from its beginning — its
   opening film, its title card, then the night — through the same
   enterWorld() every other start uses.                                  */
const PROG_KEY = 'mz.encounters.progress';
const chId = k => (window.__CHAPTERS__[k] && window.__CHAPTERS__[k].id) || 0;
const playableKeys = () => chapterOrder().filter(k => chId(k) < 90);
/* v6.0: where a chapter stands in the whole run. The unlock test used to
   compare ids, which works while there is one episode and breaks the day
   there are two: episode 2's chapter 1 has id 1, and id 1 <= id 5 would
   have opened it the moment episode 1's chapter 5 was reached. */
const orderIdx = k => playableKeys().indexOf(k);
function reachedKey() {
  try {
    const s = JSON.parse(localStorage.getItem(PROG_KEY) || 'null');
    return (s && chapterExists(s.reached)) ? s.reached : null;
  } catch { return null; }
}
const progressRead = () => { try { return JSON.parse(localStorage.getItem(PROG_KEY) || 'null') || {}; } catch { return {}; } };
function markReached(key) {
  if (CH_ASKED) return false;                  // a ?ch= preview opens nothing, the same way it saves nothing
  if (!chapterExists(key) || chId(key) >= 90) return false;
  const cur = reachedKey();
  if (cur && orderIdx(cur) >= orderIdx(key)) return true;      // already further (by place, v6.0)
  try { const s = progressRead(); s.reached = key; s.t = Date.now(); localStorage.setItem(PROG_KEY, JSON.stringify(s)); return true; }
  catch { return false; }
}
/* v6.2: what each sealed chapter SCORED, kept beside the furthest reached —
   the latest result per chapter, so a replay overwrites and a new game
   inherits (a chapter you sealed stays sealed, the way it stays reached).
   The selector shows the rank on the stop; the episode-complete card
   (v6.3) tallies the five. Absent on a store from before v6.2: empty. */
function sealedResults() {
  const s = progressRead();
  return (s.sealed && typeof s.sealed === 'object') ? s.sealed : {};
}
function markSealed(key, score, rank) {
  if (CH_ASKED) return false;
  if (!chapterExists(key) || chId(key) >= 90) return false;
  try {
    const s = progressRead();
    s.sealed = Object.assign({}, s.sealed, { [key]: { score: Math.round(score), rank, t: Date.now() } });
    localStorage.setItem(PROG_KEY, JSON.stringify(s));
    return true;
  } catch { return false; }
}
/* every chapter up to and including the furthest reached; chapter 1 always */
function unlockedKeys() {
  const top = reachedKey();
  const topIdx = top ? orderIdx(top) : 0;
  return playableKeys().filter((k, i) => i === 0 || i <= topIdx);
}

const menuEl = () => $('menu');
function menuOpen() {
  /* v14.4: AND NOT OVER A LIVE EVENT. `kitFrame` runs unconditionally and
     ends in `if (ev) evFrame(...)`, so the drill's clock kept running under
     the panel and self-failed item by item — three BROKEN presses at -4
     awareness each while the player sat in a menu he was told he could
     open. The round buttons are hidden under `body.evopen` in shell.html
     for the same reason. Episode 1 declares no events, so `ev` is always
     null there and neither guard can fire. */
  if (state !== 'play' || inv.open || fainting || ev) return;   // a faint is not a moment to pause in
  for (const k in keys) keys[k] = false;      // a held W does not keep walking under the panel
  state = 'menu';
  menuEl().classList.remove('hide');
  document.body.classList.add('menuopen');
  $('menuBtn')?.classList.add('open');
  document.exitPointerLock?.();
  snd('uiclick', 0.5);
}
function menuClose(toPlay = true) {
  if (state !== 'menu') return;
  menuEl().classList.add('hide');
  document.body.classList.remove('menuopen');
  $('menuBtn')?.classList.remove('open');
  state = 'play';
  if (toPlay) { snd('uiclick', 0.5); tryLock(); }
}
const menuToggle = () => (state === 'menu' ? menuClose() : menuOpen());

/* the explore music leaves with the player and comes back with them */
function musicRamp(v, secs = 1.0) {
  if (!musicGain || !actx) return;
  const g = musicGain.gain, now = actx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(v, now + secs);
}

/* Back to the title screen: the run is saved where the player stands first,
   so Continue brings them straight back here. Everything that play put on
   screen or in the air comes down; the title's own backdrop starts again. */
function returnToTitle() {
  if ((state !== 'menu' && state !== 'play') || fainting) return false;
  saveCheckpoint();
  closeChapters();
  menuClose(false);
  if (inv.open) invClose();
  state = 'title';
  document.exitPointerLock?.();
  for (const el of [ui.hud, hint, ui.prompt, ui.interact, ui.decide]) el?.classList.add('hide');
  document.body.classList.remove('inplay');
  showHaunt(false);
  stopBed(); stopCineVoices();
  for (const n of liveLoops) loopVol(n, 0);   // ALL of them: silenceChapterLoops() keeps this chapter's own
  if (narSrc) { try { narSrc.stop(); } catch {} narSrc = null; }
  clearTimeout(voiceTimer); voicePending = false;   // his opening line must not land on the title screen
  musicRamp(0);
  ui.panic.classList.remove('critical');       // the red of a low sanity does not follow you out
  ui.panic.style.transition = 'none'; ui.panic.style.opacity = '0';
  void ui.panic.offsetWidth; ui.panic.style.transition = '';
  gPhase = 'hidden'; gTimer = 0; gGlide = null;
  reveal = 0; ghostOpacity(0);
  ghost.position.copy(GHOST_HOME);
  for (const k in keys) keys[k] = false;
  vel.set(0, 0, 0);
  ui.title.classList.remove('hide');
  titleVideo?.play();
  paintTitle();
  return true;
}

/* ---------------------------------------------------- the chapter panel */
let chPending = null;
let chEpisode = 1;                        // v6.0: the episode whose tab is open
const chaptersOpen = () => !$('chapters')?.classList.contains('hide');
/* v6.0 (Chad: "a tab to switch between episodes, and each episode lists out
   5 chapters each"): ten tabs, numerals because ten "Episode N"s do not fit
   a phone; the case's name reads under the row; then FIVE rows, always —
   a built chapter as before (open, locked, the one you are in), and for a
   chapter that is not written yet a dim row that says so, so the shape of
   the game is visible before the game is.
   v6.2 (Chad: "rather plain and boring ... clear differentiation between
   episodes and chapters"): the same ten buttons and five rows, dressed as
   what they are. Each tab is a CASE FILE — numeral, its name, five dots for
   its five chapters, a stamp when all five are sealed — in a strip that
   scrolls and centres the open one. Each row is a STOP ON A LINE: sealed
   stops (class `done`) are filled and carry the rank the chapter got (v6.2's progress
   store), the one you are in breathes jade, a reached one is an open ring,
   the rest wait. The ids, classes and data- attributes the harnesses read
   (`#chTabs .chTab[data-ep]`, `.on`, `#chEpName`, `#chList .chTile[data-ch]`,
   `.locked`, `.unwritten`) are unchanged. */
function chapterStops(n) {
  /* one word per stop of episode n: done | now | open | locked | unwritten
     (`done` rather than `sealed` as a CLASS: the complete card's stamp owns `.sealed`) */
  const open = unlockedKeys(), results = sealedResults();
  const top = reachedKey(), topIdx = top ? orderIdx(top) : 0;
  const built = episodeKeys(n), out = [];
  for (let i = 0; i < Math.max(CHAPTERS_PER_EPISODE, built.length); i++) {
    const k = built[i];
    if (!k) { out.push({ k: null, s: 'unwritten' }); continue; }
    const here = k === CH_KEY && state !== 'title';
    const sealed = !!results[k] || orderIdx(k) < topIdx;   // a result on record, or a later chapter reached (a store from before v6.2 has no results)
    out.push({ k, sealed, s: here ? 'now' : sealed ? 'done' : open.includes(k) ? 'open' : 'locked', rank: results[k] && results[k].rank });
  }
  return out;
}
function paintChapters(smooth = false) {
  const list = $('chList'); if (!list) return;
  const mk = (tag, cls, text) => { const e = document.createElement(tag); e.className = cls; if (text != null) e.textContent = text; return e; };
  const tabs = $('chTabs');
  if (tabs) {
    tabs.textContent = '';
    for (let n = 1; n <= EPISODE_COUNT; n++) {
      const stops = chapterStops(n), built = stops.some(x => x.k);
      const reached = built && stops.some(x => x.s !== 'locked' && x.s !== 'unwritten');
      const allSealed = built && stops.every(x => x.sealed);          // by the record, not the display: the stop you are replaying is still sealed
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chTab' + (n === chEpisode ? ' on' : '') + (built ? '' : ' empty') + (built && !reached ? ' locked' : '');
      b.dataset.ep = String(n);
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', n === chEpisode ? 'true' : 'false');
      b.setAttribute('aria-label', T('chapters.episode', 'Episode {n}').replace('{n}', String(n)));
      b.appendChild(mk('span', 'epN', String(n)));
      b.appendChild(mk('span', 'epL', T(`ep${n}.label`, '')));
      b.appendChild(mk('span', 'epT', T(`ep${n}.title`, '')));
      if (!built) b.appendChild(mk('span', 'epS', T('chapters.unwritten')));
      else if (!reached) b.appendChild(mk('span', 'epS', T('chapters.locked')));
      else {
        const d = mk('span', 'epDots');
        for (const x of stops) d.appendChild(mk('i', x.s));
        b.appendChild(d);
      }
      if (allSealed) b.appendChild(mk('span', 'epStamp', T('episode.stamp')));   // v6.5: CASE CLOSED, the episode card's own stamp
      b.onclick = () => { if (chEpisode !== n) { chEpisode = n; paintChapters(true); snd('uiclick', 0.35); } };
      tabs.appendChild(b);
    }
    /* the open case sits in the middle of the strip; the panel must be
       visible for the widths to be real (openChapters shows it first) */
    const on = tabs.querySelector('.chTab.on');
    if (on && tabs.clientWidth) {
      const left = on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2;
      if (smooth && tabs.scrollTo) tabs.scrollTo({ left, behavior: 'smooth' }); else tabs.scrollLeft = left;
    }
  }
  const stops = chapterStops(chEpisode), built = stops.some(x => x.k);
  const name = $('chEpName');
  if (name) {
    name.textContent = '';
    name.appendChild(mk('span', 'epK', T(`ep${chEpisode}.label`, '')));
    name.appendChild(mk('span', 'epTitle', T(`ep${chEpisode}.title`, '')));
    const sealedN = stops.filter(x => x.sealed).length;
    const reached = built && stops.some(x => x.s !== 'locked' && x.s !== 'unwritten');
    name.appendChild(mk('span', 'epProg', !built ? T('chapters.unwritten') : !reached ? T('chapters.locked')
      : T('chapters.progress', '{n} of {m}').replace('{n}', String(sealedN)).replace('{m}', String(stops.length))));
    /* v6.5: the tally as a bar — one segment per chapter, lit for a completed
       one, jade for the one you are in, hollow for the rest */
    if (built && reached) {
      const bar = mk('span', 'epBar'); bar.setAttribute('aria-hidden', 'true');
      for (const x of stops) bar.appendChild(mk('i', x.s === 'now' ? 'now' : x.sealed ? 'done' : x.s));
      name.appendChild(bar);
    }
  }
  list.textContent = '';
  const inRun = state !== 'title' || !!loadCheckpoint();   // a fresh profile's chapter 1 is open, not "in progress"
  stops.forEach((x, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    const ok = x.s === 'done' || x.s === 'now' || x.s === 'open';
    b.className = 'chTile ' + x.s + (ok ? '' : ' locked');   // `locked` stays on an unwritten row too, as at v6.0
    b.disabled = !ok;
    const node = mk('span', 'node');
    if (x.s === 'done') node.textContent = x.rank || '✓';
    else if (x.s === 'now' || x.s === 'open') node.appendChild(mk('i', ''));
    b.appendChild(node);
    const txt = mk('span', 'txt');
    if (x.k) {
      const ch = window.__CHAPTERS__[x.k];
      b.dataset.ch = x.k;
      txt.appendChild(mk('span', 'num', ch.cardLabel || x.k));
      txt.appendChild(mk('span', 'name', ok ? (ch.title || '') : T('chapters.locked')));
      if (ok) b.onclick = () => askChapter(x.k);
    } else {
      txt.appendChild(mk('span', 'num', T('chapters.chapter', 'Chapter {n}').replace('{n}', String(i + 1))));
      txt.appendChild(mk('span', 'name', T('chapters.unwritten')));
    }
    b.appendChild(txt);
    const word = x.s === 'done' ? T('chapters.completed') : x.s === 'now' ? T('chapters.here') : (x.s === 'open' && inRun) ? T('chapters.inProgress') : '';
    if (word) b.appendChild(mk('span', 'state', word));
    if (ok) b.appendChild(mk('span', 'go', T('chapters.play')));   // v6.5: the pill that says a row is a button
    list.appendChild(b);
  });
}
function openChapters() {
  if (!$('chapters')) return;
  chPending = null;
  /* the tab that opens is the episode you are in — from the title, the one
     you got furthest into */
  chEpisode = episodeOf(state === 'title' && reachedKey() ? reachedKey() : CH_KEY);
  $('chAsk')?.classList.add('hide');
  $('chList')?.classList.remove('hide');
  $('chapters').classList.remove('hide');   // shown BEFORE the paint: the strip centres its open case by measured width (v6.2)
  paintChapters();
  snd('uiclick', 0.5);
}
function closeChapters() {
  chPending = null;
  $('chapters')?.classList.add('hide');
}
/* a tap on an open chapter: if there is a run to lose, ask; otherwise go */
function askChapter(key) {
  if (!unlockedKeys().includes(key)) return;
  const inRun = state !== 'title' || !!loadCheckpoint();
  if (!inRun) return startChapter(key);
  chPending = key;
  const ch = window.__CHAPTERS__[key];
  const label = chapterLabel(key) + (ch.title ? ' · ' + ch.title : '');
  const t = $('chAskText'); if (t) t.textContent = T('chapters.ask').replace('{chapter}', label);
  $('chList')?.classList.add('hide');
  $('chAsk')?.classList.remove('hide');
}
/* Start a chapter from its beginning, from the title or from mid-play.
   restart() is the one piece of code that knows everything a fresh run has
   to put back, and enterWorld() then takes the player out again in the
   same tick — the film, the card, the night — exactly as advancing does. */
function startChapter(key) {
  if (!unlockedKeys().includes(key)) return false;
  closeChapters();
  if (state === 'menu') menuClose(false);
  if (inv.open) invClose();
  for (const el of [ui.complete, ui.result, ui.over, ui.episode]) el?.classList.add('hide');
  document.body.classList.remove('inplay');
  setChapter(key);
  /* v14.16: setChapter returns early for the chapter already loaded, and
     after a reload that is chapter 1 whatever the save's episode — so the
     amulet's charge, loaded from the save at boot, could stay counted against
     the save's episode inside episode 1. The rule is setChapter's own: a
     chapter of another episode refills it. */
  wardEpisode();
  restart();
  enterWorld(() => {
    yaw.position.copy(SPAWN.pos);
    yaw.rotation.y = SPAWN.rot;
    pitch.rotation.x = 0; camera.rotation.z = 0;
  }, { intro: true });
  return true;
}

/* ------------------------------------------- the EPISODE COMPLETE card (v6.3)
   Chad: "have an episode complete card, and show next episode unlocked in a
   progress line with checkpoint/milestones like going through a map or
   something. The scores across all chapters must be properly tallied up and
   brought over. The episode complete card must look visually different from
   the usual outcomes and score cards. It must look impressive and exciting,
   with sound effects."
   It shows when Continue is pressed on the sealed card of a case's LAST
   chapter (the fifth — an episode with fewer chapters built is not
   complete). The tally is the progress store's per-chapter results (v6.2):
   the five ranks and scores, and the episode's score is their mean, ranked
   on the chapter formula. The map is the ten cases as a winding trail —
   closed cases carry their rank, the trail lights from the closed case to
   the NEXT one, which pulses jade under an "Unlocked" flag whether or not
   it is written yet (the words under the trail say which). Then the one
   button: Continue into the next case when it exists, else back to the
   title. The sound: the fanfare (a gong and a swell, `epfanfare`), the
   stamp's kick, a tick per chapter as it lands, the rank sting as the
   score settles, a confirm as the trail lights.                          */
const RANK_OF = s => s >= 90 ? 'S' : s >= 80 ? 'A+' : s >= 70 ? 'A' : s >= 55 ? 'B' : s >= 40 ? 'C' : 'D';
const isLastOfEpisode = k => episodeKeys(episodeOf(k)).indexOf(k) === CHAPTERS_PER_EPISODE - 1;
function episodeTally(n) {
  const results = sealedResults(), keys = episodeKeys(n), rows = [];
  for (let i = 0; i < Math.max(CHAPTERS_PER_EPISODE, keys.length); i++) {
    const k = keys[i], r = k && results[k];
    rows.push({ k, label: k ? (window.__CHAPTERS__[k].cardLabel || k) : T('chapters.chapter', 'Chapter {n}').replace('{n}', String(i + 1)),
                score: r && Number.isFinite(r.score) ? r.score : null, rank: (r && r.rank) || null });
  }
  const have = rows.filter(x => x.score != null);
  const score = have.length ? Math.round(have.reduce((a, x) => a + x.score, 0) / have.length) : null;
  return { rows, score, rank: score == null ? null : RANK_OF(score) };
}
function rollNumber(el, target, ms, done) {
  if (!el) return;
  if (target == null) { el.textContent = ''; if (done) done(); return; }
  const t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / ms);
    el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + '%';
    if (k < 1) requestAnimationFrame(step); else if (done) done();
  };
  requestAnimationFrame(step);
}
function paintEpisodeMap(n) {
  const map = $('epMap'); if (!map) return;
  map.classList.remove('in'); map.textContent = '';
  const NS = 'http://www.w3.org/2000/svg';
  const W = 520, H = 100, x0 = 26, dx = (W - 2 * x0) / (EPISODE_COUNT - 1);
  const pt = i => ({ x: x0 + i * dx, y: i % 2 ? 68 : 34 });     // a winding trail, not a ruler
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const line = (from, to, cls) => el('path', { d: Array.from({ length: to - from + 1 }, (_, j) => { const p = pt(from + j); return (j ? 'L' : 'M') + p.x + ' ' + p.y; }).join(' '), class: cls });
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
  const nextN = n < EPISODE_COUNT ? n + 1 : null;
  svg.appendChild(line(0, EPISODE_COUNT - 1, 'trail'));
  const lit = line(0, (nextN || EPISODE_COUNT) - 1, 'trailDone');
  svg.appendChild(lit);
  for (let i = 0; i < EPISODE_COUNT; i++) {
    const m = i + 1, p = pt(i), done = m <= n, next = m === nextN;
    const g = el('g', { class: 'msg ' + (done ? 'done' : next ? 'next' : 'locked'), 'data-ep': String(m) });
    if (next) g.appendChild(el('circle', { cx: p.x, cy: p.y, r: 11, class: 'halo' }));
    g.appendChild(el('circle', { cx: p.x, cy: p.y, r: 11, class: 'ms' }));
    const t = el('text', { x: p.x, y: p.y, class: 'msT' });
    t.textContent = done ? (episodeTally(m).rank || '✓') : String(m);
    g.appendChild(t);
    if (next) {
      const f = el('text', { x: p.x, y: p.y < 50 ? p.y - 20 : p.y + 26, class: 'flagT flag' });
      f.textContent = T('episode.unlocked').toUpperCase();
      g.appendChild(f);
    }
    svg.appendChild(g);
  }
  map.appendChild(svg);
  const L = lit.getTotalLength ? lit.getTotalLength() : 600;   // the lit trail draws itself when the map comes in
  lit.style.strokeDasharray = String(L); lit.style.strokeDashoffset = String(L);
  map.__lit = lit;
}
let epTimers = [];
function showEpisodeCard(n) {
  const layer = ui.episode; if (!layer || !$('epTally')) return false;
  for (const t of epTimers) clearTimeout(t);
  epTimers = [];
  const later = (ms, fn) => epTimers.push(setTimeout(fn, ms));
  const mk = (tag, cls, text) => { const e = document.createElement(tag); e.className = cls; if (text != null) e.textContent = text; return e; };
  const tally = episodeTally(n);
  $('epEp').textContent = T(`ep${n}.label`, '');
  $('epTitle').textContent = T(`ep${n}.title`, '');
  const rank = $('epRank'); rank.textContent = tally.rank || '✓'; rank.classList.remove('in', 'glow');
  const stamp = $('epStamp'); stamp.classList.remove('stampin');
  const score = $('epScore'); score.textContent = tally.score == null ? '' : '0%';
  const tl = $('epTally'); tl.textContent = '';
  for (const x of tally.rows) {
    const s = mk('div', 'epStop' + (x.score == null ? ' none' : ''));
    s.appendChild(mk('span', 'n', x.label));
    s.appendChild(mk('span', 'r', x.rank || '—'));
    s.appendChild(mk('span', 's', ''));
    tl.appendChild(s);
  }
  paintEpisodeMap(n);
  const nextN = n < EPISODE_COUNT ? n + 1 : null;
  const nextBuilt = !!nextN && episodeKeys(nextN).length > 0;
  const epName = nextN ? T(`ep${nextN}.label`, '') + ' · ' + T(`ep${nextN}.title`, '') : '';
  $('epNext').textContent = !nextN ? T('episode.allDone')
    : (nextBuilt ? T('episode.next') : T('episode.nextUnwritten')).replace('{episode}', epName);
  const btn = $('epBtn');
  btn.textContent = nextBuilt ? T('episode.continue') : T('episode.toTitle');
  btn.classList.remove('in'); btn.disabled = true;
  ui.complete.classList.add('hide');
  ui.hud.classList.add('hide');
  layer.classList.remove('hide');
  layer.scrollTop = 0;
  state = 'complete';
  // the choreography: fanfare, rank, stamp, five stops, the score, the trail, the button
  snd('epfanfare', 0.85);
  later(350, () => rank.classList.add('in'));
  later(850, () => { stamp.classList.add('stampin'); snd('kick', 0.6); });
  const stops = [...tl.children];
  stops.forEach((s, i) => later(1500 + i * 230, () => {
    s.classList.add('in'); snd('uiclick', 0.4);
    rollNumber(s.querySelector('.s'), tally.rows[i].score, 520);
  }));
  const scoreAt = 1500 + stops.length * 230 + 250;
  later(scoreAt, () => rollNumber(score, tally.score, 1300, () => { snd('uirank', 0.7); rank.classList.add('glow'); }));
  later(scoreAt + 1500, () => {
    const map = $('epMap'); map.classList.add('in');
    if (map.__lit) map.__lit.style.strokeDashoffset = '0';
    snd('uiconfirm', 0.5);
  });
  later(scoreAt + 2600, () => { btn.disabled = false; btn.classList.add('in'); });
  return true;
}

$('menuBtn')?.addEventListener('click', menuToggle);
$('menuResume')?.addEventListener('click', () => menuClose());
$('menuChapters')?.addEventListener('click', () => openChapters());
$('menuTitle')?.addEventListener('click', () => returnToTitle());
$('chaptersBtn')?.addEventListener('click', () => openChapters());
$('chClose')?.addEventListener('click', () => closeChapters());
$('chYes')?.addEventListener('click', () => { if (chPending) startChapter(chPending); });
$('chNo')?.addEventListener('click', () => { chPending = null; $('chAsk')?.classList.add('hide'); $('chList')?.classList.remove('hide'); });
$('chapters')?.addEventListener('click', e => { if (e.target === $('chapters')) closeChapters(); });
menuEl()?.addEventListener('click', e => { if (e.target === menuEl()) menuClose(); });
addEventListener('keydown', e => {
  if (e.code === 'Escape') {
    if (chaptersOpen()) { e.preventDefault(); closeChapters(); return; }
    if (state === 'menu') { e.preventDefault(); menuClose(); return; }
    return;
  }
  if (e.code === 'KeyM' && !chaptersOpen() && (state === 'play' || state === 'menu')) {
    e.preventDefault(); menuToggle();
  }
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
    sfxGain.connect(bgOut());
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
  kick: ['kick', 0.8], scream: ['scream', 0.85], chant: ['chant', 0.9],
  /* v3.7 — everything the four cutscenes were missing. A scene had eight
     noises available to it and four of them were the same thump; these are
     the rest of the vocabulary: his voice, hers, and the world's.        */
  swoosh: ['swoosh', 0.55],        // her, moving — replaces the cartoon zip
  strings: ['strings', 0.7],       // the dread chord under a reveal
  dread: ['dread', 0.55], breath: ['breath', 0.7], whisper: ['whisper', 0.45],
  /* v5.27: 0.5 -> 0.18. This file is a measured OUTLIER — its mean is
     -5.6 dBFS, nearly 9 dB hotter than the next loudest sample in the
     whole pack (`strings`, -14.3), which at the old cue volume made the
     flame going out LOUDER than the boy narrating over it. The new number
     puts its effective level in line with `strings`; nothing else about
     the cue moved. */
  firedie: ['firedie', 0.18],      // the flame giving up
  ashburst: ['ashburst', 0.75],    // the drum's insides thrown across concrete
  paperstorm: ['paperstorm', 0.9], // a thousand notes in the air
  bowl: ['bowl', 0.8],             // the singing bowl under the chant
  gwail: ['gwail', 0.5], gsigh: ['gsigh', 0.85],
  gscream: ['gscream', 0.6], sobbing: ['sobbing', 0.55],
  vgasp: ['vgasp', 1], vscoff: ['vscoff', 0.95], vpant: ['vpant', 0.9],
  vrelief: ['vrelief', 0.95], vchant: ['vchantline', 1],
  /* Chapter 2's room, and the sounds a bedroom has that a void deck does
     not. `heart` was already in the pack as a loop and had no row here, so
     a scene asking for it got silence — chaptertest's cue check found that
     the moment chapter 2 asked. */
  heart: ['heart', 0.7],
  clock: ['clock', 0.85], fan: ['fan', 0.8],
  doorcreak: ['doorcreak', 0.75], hallsteps: ['hallsteps', 0.9],
  bedcreak: ['bedcreak', 0.85],
  v2wake1: ['v2wake1', 1], v2wake2: ['v2wake2', 1], v2wake3: ['v2wake3', 1],
  v2call: ['v2call', 1], v2ma: ['v2ma', 1],
  /* Chapter 3's tentage. `drum` is ONE struck hit for accents — the steady
     beat is inside the `ritual` loop, so a scene that wants the ritual to
     stop stops the chant and the drum on a single track. */
  drum: ['drum', 0.8], cymbal: ['cymbal', 0.7], gong: ['gong', 0.85],
  burn: ['burn', 0.7], chair: ['chair', 0.7],
  noteflight: ['noteflight', 0.7],   // v5.30: one sheet lifting and going out of the window (ch5 scene C)
  v3wake1: ['v3wake1', 1], v3wake2: ['v3wake2', 1],
  v3wake3: ['v3wake3', 1], v3wake4: ['v3wake4', 1],
  v3ask: ['v3ask', 1],
  // the auntie at the paper table — the one voice in the game that is calm
  v3aunt1: ['v3aunt1', 1], v3aunt2: ['v3aunt2', 1], v3aunt3: ['v3aunt3', 1],
  v3aunt4: ['v3aunt4', 1], v3aunt5: ['v3aunt5', 1],
  v3aunt6: ['v3aunt6', 1],   // v14.7: "Ah boy, you like this one?" — played in PLAY by chapter 3; the row lets a scene cue it too
  // v4.3: the revision's fresh palette — the ceremony's own instruments,
  // its dread layer, and the lines the ghost-free chapter runs on
  suona: ['suona', 0.9], bellring: ['bellring', 0.85],
  drumroll: ['drumroll', 0.9], gongdeep: ['gongdeep', 0.9],
  trancehum: ['trancehum', 0.85],
  v3chair: ['v3chair', 1], v3out1: ['v3out1', 1], v3out2: ['v3out2', 1],
  v3seen: ['v3seen', 1], v3grip: ['v3grip', 1], v3left: ['v3left', 1],
  /* v4.9: chapter 4's flat — the sit, the memories, the 90s phone, and
     the flat answering back. The three mem beds and nightsilence are long
     one-shots a scene lays under a passage, not loops. */
  memwash: ['memwash', 0.8], mem1: ['mem1', 0.85], mem2: ['mem2', 0.85],
  mem3: ['mem3', 0.9], sitdown: ['sitdown', 0.8], sofacreak: ['sofacreak', 0.85],
  nightsilence: ['nightsilence', 0.9],
  phonepick: ['phonepick', 0.9], dialtone: ['dialtone', 0.7],
  dialbeep: ['dialbeep', 0.8], ringtone: ['ringtone', 0.8],
  phonedown: ['phonedown', 0.85], phonebell: ['phonebell', 1],
  tvstatic: ['tvstatic', 0.95], lightbuzz: ['lightbuzz', 0.85],
  curtain: ['curtain', 0.85], switch4: ['switch4', 0.9],
  doorkeys: ['doorkeys', 0.85],
  v4wake1: ['v4wake1', 1], v4wake2: ['v4wake2', 1], v4wake3: ['v4wake3', 1],
  v4sit: ['v4sit', 1],   // scene A cues the close line itself, at the sit
  v4thinkA1: ['v4thinkA1', 1], v4thinkA2: ['v4thinkA2', 1],
  v4thinkA3: ['v4thinkA3', 1],
  v4tired: ['v4tired', 1], v4wake3am: ['v4wake3am', 1],
  v4taunt: ['v4taunt', 1], v4regret: ['v4regret', 1],
  v4call1: ['v4call1', 1], v4call2: ['v4call2', 1],
  v4ma1: ['v4ma1', 1], v4ma2: ['v4ma2', 1], v4ma3: ['v4ma3', 1],
  /* v5.0: chapter 5's morning — the knock, the find, the burning; the
     tang-ki's seven lines are the game's fourth speaker. */
  doorknock: ['doorknock', 0.9], notepull: ['notepull', 0.9],
  /* v5.25: the note SET DOWN on the table — chapter 5's film reveals it
     on the wood rather than held up in a hand, and this is the reveal. */
  noteset: ['noteset', 0.95],
  matchstrike: ['matchstrike', 0.85], noteburn: ['noteburn', 0.85],
  teaset: ['teaset', 0.7],
  v5wake1: ['v5wake1', 1], v5wake2: ['v5wake2', 1], v5wake3: ['v5wake3', 1],
  v5fearB1: ['v5fearB1', 1], v5disC1: ['v5disC1', 1], v5learnD: ['v5learnD', 1],
  v5ma1: ['v5ma1', 1], v5ma2: ['v5ma2', 1],
  t5note: ['t5note', 1], t5teachA: ['t5teachA', 1], t5hallA: ['t5hallA', 1],
  t5fearB: ['t5fearB', 1], t5disC: ['t5disC', 1],
  t5learnD1: ['t5learnD1', 1], t5learnD2: ['t5learnD2', 1],
  /* v6.4: chapter 1's PROLOGUE — the five lines the boy narrates over his
     three memories, the afternoon bed under them, the two pick-ups, and
     the slow-motion pass of the note beside his face. All ch1's by the
     split (named only here). `memwash`, chapter 4's wash between memories,
     is reused between these and so becomes shared. */
  vpro1: ['vpro1', 1], vpro2: ['vpro2', 1], vpro3: ['vpro3', 1],
  vpro4: ['vpro4', 1], vpro5: ['vpro5', 1],
  vfaint: ['vfaint', 1],                    // v6.6: the faint scene's own line
  /* v6.6: the prologue built out — his pick-up reactions, its own theme
     (40 s, eleven_music_v2, handed to the dread bed on the line that
     turns) and a bed per memory: the sea at East Coast, a stairwell at
     night, a playground by day. All ch1's by the split. */
  vpick1: ['vpick1', 1], vpick2: ['vpick2', 1], vpick3: ['vpick3', 1],   // v6.9: whispered takes on their own quiet stage (WHISPER_TAKES) — the level lives there, not here
  memtheme: ['memtheme', 0.95],    // v6.14: the memory theme, under the three memories — 0.55 x ch1's cue was under half its nominal level (Chad, twice: "make the starting music louder", "still too soft")
  ecpamb: ['ecpamb', 0.8],         // waves and a sea breeze at East Coast Park
  stairamb: ['stairamb', 0.8],     // a fluorescent tube and a hollow stairwell
  playamb: ['playamb', 0.8],       // children far off, birds, an afternoon
  memday: ['memday', 0.7],         // a hot afternoon, far off: cicadas and a little wind
  leafpick: ['leafpick', 0.7],     // a dry leaf off the grass
  toypick: ['toypick', 0.7],       // a plush toy off the concrete
  noteslow: ['noteslow', 0.8],     // the sheet turning past his face, stretched
  /* v7.1 — EPISODE 2 · CHAPTER 1, THE WORST BED. All e2c1's by the split
     (nothing else asks for them). His 26 lines at 1 (the level lives on
     the bus), the bunk's 11 at 1 (the cast stage), then the chapter's
     sounds: two pieces (the film's theme, the night's explore bed), five
     beds, fourteen one-shots — every one peak-normalised to the level
     named in docs/V7.1-E2C1-PLAN.md §5, so the row is 1 unless a cue
     wants it under. `bunkcreak`, not `bedcreak`: chapter 2 already owns
     that name, and a sound wrongly re-used is a silent cue in the other
     chapter. */
  n1pro1: ['n1pro1', 1], n1pro1b: ['n1pro1b', 1], n1pro2: ['n1pro2', 1], n1pro3: ['n1pro3', 1], n1pro4: ['n1pro4', 1],
  n1voice: ['n1voice', 1], n1near: ['n1near', 1], n1act: ['n1act', 1],
  n1fallin: ['n1fallin', 1], n1late: ['n1late', 1], n1bedok: ['n1bedok', 1],
  n1bedfail: ['n1bedfail', 1], n1shower: ['n1shower', 1], n1board: ['n1board', 1],
  n1lights: ['n1lights', 1], n1wake: ['n1wake', 1], n1hear: ['n1hear', 1], n1A1: ['n1A1', 1],
  n1A2: ['n1A2', 1], n1B1: ['n1B1', 1], n1B2: ['n1B2', 1], n1C1: ['n1C1', 1],
  n1D1: ['n1D1', 1], n1A: ['n1A', 1], n1B: ['n1B', 1], n1C: ['n1C', 1], n1D: ['n1D', 1],
  s1fallin: ['s1fallin', 1], s1late: ['s1late', 1], s1bed: ['s1bed', 1],
  s1standby: ['s1standby', 1], s1again: ['s1again', 1], s1lights: ['s1lights', 1],
  b1day: ['b1day', 1], b1sleep: ['b1sleep', 1], b1huh: ['b1huh', 1], k1board: ['k1board', 1],
  k1three: ['k1three', 1],
  k3bush: ['k3bush', 1],           // v11.4: the kneeling man under the torch (e2c3)
  e1knock: ['e1knock', 1], e1backbunk: ['e1backbunk', 1],   // v8.3: the encik
  b1hurry: ['b1hurry', 1], k1hurry: ['k1hurry', 1],         // v9.3: the run back
  // v9.5: the headcount, the tenth voice, and the toggle rope
  e1count: ['e1count', 1], e1extra: ['e1extra', 1], e1rope: ['e1rope', 1],
  n1one: ['n1one', 1], n1rope: ['n1rope', 1],
  n1ghost: ['n1ghost', 1],       // v9.6: someone is in the shower block
  c1two: ['c1two', 1], c1three: ['c1three', 1], c1four: ['c1four', 1],
  c1five: ['c1five', 1], c1six: ['c1six', 1], c1seven: ['c1seven', 1],
  c1eight: ['c1eight', 1], c1nine: ['c1nine', 1],
  c1ten: ['c1ten', 1],           // the number nobody in the section called
  e2march: ['e2march', 1],       // v10.4: a solemn march under the film's ferry, jetty and square (40 s); the old `e2film` theme is retired
  e2filmbunk: ['e2filmbunk', 1], // v10.6: the theme's LAST 24 s (36.0 s to its end) put back under the bunk — v10.4 retired the whole theme and took the bunk's swell with it; cued at 36.0 so every sample lands where it did
  ghostlaugh: ['ghostlaugh', 1], ghostrun: ['ghostrun', 1],   // v10.4: the block laughs (scenes B and D); the figure's feet on the tile (scene A)
  n1omg: ['n1omg', 1],           // v10.4: "Oh my god..." when the water stops (scene A)
  e2bed: ['e2bed', 1],           // the night's explore bed (50 s, eleven_music_v2, loop)
  e2day: ['e2day', 1],           // v9.2: and the DAY's, the other side of nightK (23 s, crossfade-looped)
  campamb: ['campamb', 1],       // v9.2: the camp outside the bunk (22 s, generated seamless)
  platoonmarch: ['platoonmarch', 1],  // v9.2: another platoon going past, a 16 s pass-by
  bunkday: ['bunkday', 1], bunknight: ['bunknight', 1], fanloop: ['fanloop', 1],
  clocktick: ['clocktick', 1], showerrun: ['showerrun', 1],
  whistle: ['whistle', 1], bootsrun: ['bootsrun', 1], bootsmarch: ['bootsmarch', 1],
  lockerdoor: ['lockerdoor', 1], bunkcreak: ['bunkcreak', 1], blanket: ['blanket', 1],
  switchoff: ['switchoff', 1], showeroff: ['showeroff', 1], drip: ['drip', 1],
  ferryhorn: ['ferryhorn', 1], seawash: ['seawash', 1], gates: ['gates', 1],
  dooropen2: ['dooropen2', 1], pushups: ['pushups', 1],
  // v10.0: EPISODE 2 CHAPTER 2, Nobody There. cookamb is the cookhouse room tone (22 s, generated seamless); the rest are its lines
  cookamb: ['cookamb', 1],
  n2pro: ['n2pro', 1], n2askA: ['n2askA', 1], n2askB: ['n2askB', 1], n2askC: ['n2askC', 1], n2askD: ['n2askD', 1],
  n2nobut: ['n2nobut', 1], n2B1: ['n2B1', 1], n2C1: ['n2C1', 1],
  n2A: ['n2A', 1], n2B: ['n2B', 1], n2C: ['n2C', 1], n2D: ['n2D', 1],
  e2A: ['e2A', 1], e2saw: ['e2saw', 1], e2cock: ['e2cock', 1], e2ok: ['e2ok', 1], e2D1: ['e2D1', 1], e2D2: ['e2D2', 1],
  e2hmm: ['e2hmm', 1], n2sigh: ['n2sigh', 1], n2alone: ['n2alone', 1],   // v10.8: scene C — "Hmmmm.... okay...", the defeated sigh, "Now I'm alone with this..." (e2ok stays in the pack, nothing cues it)
  // v11.0: EPISODE 2 CHAPTER 3, The Pressure — the film, the torch spots, the pressure, the scenes, the cards
  tonner: ['tonner', 1], tailgate: ['tailgate', 1], junglenight: ['junglenight', 1], bootsleaf: ['bootsleaf', 1],
  torchclick: ['torchclick', 1], stingpress: ['stingpress', 1], legpress: ['legpress', 1],
  torchpick: ['torchpick', 0.9],   // v11.6: the torch off the leaf litter (e2c3's pickup)
  ghostrunleaf: ['ghostrunleaf', 1], leafdraw: ['leafdraw', 1], leaflift: ['leaflift', 1],
  // v11.3: the night jungle's wildlife — a bed and the bushes (e2c3)
  junglelife: ['junglelife', 1], bushrustle1: ['bushrustle1', 1], bushrustle2: ['bushrustle2', 1], bushrustle3: ['bushrustle3', 1],
  nightcall1: ['nightcall1', 1], nightcall2: ['nightcall2', 1],
  n3pro1: ['n3pro1', 1], n3pro2: ['n3pro2', 1], n3pro3: ['n3pro3', 1], n3pro4: ['n3pro4', 1],
  n3spot1: ['n3spot1', 1], n3spot2: ['n3spot2', 1], n3spot3: ['n3spot3', 1], n3spot5: ['n3spot5', 1], n3spot6: ['n3spot6', 1],
  n3press: ['n3press', 1], n3look: ['n3look', 1], n3still: ['n3still', 1],
  n3A1: ['n3A1', 1], n3A2: ['n3A2', 1], n3B1: ['n3B1', 1], n3B2: ['n3B2', 1],
  n3C1: ['n3C1', 1], n3C2: ['n3C2', 1], n3D1: ['n3D1', 1], n3D2: ['n3D2', 1],
  n3A: ['n3A', 1], n3B: ['n3B', 1], n3C: ['n3C', 1], n3D: ['n3D', 1],
  b3here: ['b3here', 1], b3C1: ['b3C1', 1], b3C2: ['b3C2', 1], b3C3: ['b3C3', 1], b3D: ['b3D', 1],
  s3brief: ['s3brief', 1], s3hiss: ['s3hiss', 1],
  b2hear: ['b2hear', 1], k2three: ['k2three', 1], r2siao: ['r2siao', 1],
  // v10.1: the cookhouse livened up — a chatter loop, the kitchen behind the servery, a morning bed, a platoon calling the step past the open side; and the re-voiced ask
  cookchat: ['cookchat', 1], kitchen: ['kitchen', 1], marchcall: ['marchcall', 1], r2hear: ['r2hear', 1],   // (v10.4: `cookmusic` retired — the dread is the chapter's music)
  n2known: ['n2known', 1], e2hurry: ['e2hurry', 1],  // v10.2: the beat after the third ask
  n2pro1: ['n2pro1', 1], n2pro2: ['n2pro2', 1],      // v10.4: the film's opening narration, in two takes so the second lands on the clock
  /* v12.1: EPISODE 2 CHAPTER 4, The Cyclist — the range's own noises, the
     tower on the PA, the safety officer, the two who come off the other
     detail, and the thing on the bicycle. The four beds (rangeamb,
     flarehiss, moverrail, chain) are DECLARED by the chapter and mixed by
     its frame; they carry rows here because a scene may cue one as a
     one-shot (scene B's chain behind him is exactly that). */
  rangeamb: ['rangeamb', 1], rangepa: ['rangepa', 1], flarepop: ['flarepop', 1], flarehiss: ['flarehiss', 1],
  moverrail: ['moverrail', 1], targethit: ['targethit', 1], targetfall: ['targetfall', 1],
  rifleshot: ['rifleshot', 1], riflecock: ['riflecock', 1], riflereload: ['riflereload', 1], rifledry: ['rifledry', 1],
  chain: ['chain', 1], bikebell: ['bikebell', 1],
  t4load: ['t4load', 1], t4ready: ['t4ready', 1], t4fire1: ['t4fire1', 1], t4fire2: ['t4fire2', 1],
  t4fire3: ['t4fire3', 1], t4cease: ['t4cease', 1], t4who: ['t4who', 1], t4neg: ['t4neg', 1],
  t4roger: ['t4roger', 1], t4endex: ['t4endex', 1], t4man: ['t4man', 1],
  e4wait: ['e4wait', 1], e4down: ['e4down', 1], e4line: ['e4line', 1],
  /* v13.2: the four new takes for the rebuilt outcome scenes */
  e4back: ['e4back', 1], n4draw: ['n4draw', 1], n4gasp: ['n4gasp', 1],
  n4runD: ['n4runD', 1], n4pant: ['n4pant', 1],
  /* v14.0 · EPISODE 2 CHAPTER 5 · THE LAST QUESTION. `campamb` is e2c1's and
     is cued here too, which is what moves it into the SHARED pack — build.py
     COMPUTES the split, so a second chapter asking for a sound is the whole
     declaration. `e5theme` is the closing bed under the last teaching. */
  n5pro1: ['n5pro1', 1], n5pro2: ['n5pro2', 1], n5pro3: ['n5pro3', 1],
  n5pro4: ['n5pro4', 1], n5hi: ['n5hi', 1], n5ord: ['n5ord', 1],
  n5askA: ['n5askA', 1], n5askB: ['n5askB', 1], n5askC: ['n5askC', 1],
  n5askD: ['n5askD', 1], n5close: ['n5close', 1],
  e5hi: ['e5hi', 1], e5ord: ['e5ord', 1], e5turn: ['e5turn', 1],
  e5A1: ['e5A1', 1], e5A2: ['e5A2', 1], e5A3: ['e5A3', 1], e5A4: ['e5A4', 1],
  e5A5: ['e5A5', 1], e5B1: ['e5B1', 1], e5B2: ['e5B2', 1], e5B3: ['e5B3', 1],
  e5B4: ['e5B4', 1], e5C: ['e5C', 1], e5D1: ['e5D1', 1], e5D2: ['e5D2', 1],
  e5D3: ['e5D3', 1],
  c5arms: ['c5arms', 1], c5store: ['c5store', 1], c5form: ['c5form', 1],
  storecount: ['storecount', 0.8], riflerack: ['riflerack', 0.9],
  armsdoor: ['armsdoor', 0.7], storedesk: ['storedesk', 0.7],
  e5theme: ['e5theme', 0.95],
  b4stag: ['b4stag', 1], b4there: ['b4there', 1], b4float: ['b4float', 1],
  k4shout: ['k4shout', 1], r4run: ['r4run', 1],
  n4pro1: ['n4pro1', 1], n4pro2: ['n4pro2', 1], n4notarget: ['n4notarget', 1], n4back: ['n4back', 1],
  n4report: ['n4report', 1], n4dawn: ['n4dawn', 1],
  n4A: ['n4A', 1], n4B: ['n4B', 1], n4C: ['n4C', 1], n4D: ['n4D', 1],
  /* v13.0: the flare LEAVING the tube and climbing (Chad's item 11 — the
     launch was never shown or heard, only the pop and the burn), the sting on
     the frame the cyclist is SEEN (item 20), and the three shouts (item 22) */
  flarelaunch: ['flarelaunch', 1], stingcyc: ['stingcyc', 1],
  b4cyc: ['b4cyc', 1], k4cyc: ['k4cyc', 1], r4cyc: ['r4cyc', 1]
};
/* Which kinds the synth below can actually fake. Everything else in
   STING_SAMPLE is sample-only: if its buffer is not decoded yet it stays
   silent rather than falling through into a switch with no matching case.
   (This used to be an explicit `kick || scream || chant` list, which every
   new sound would have had to be added to and none of them would have
   been.)                                                                */
const STING_SYNTH = new Set(['boom', 'clang', 'whoosh', 'take', 'step', 'chime']);
/* Long cutscene sounds outlive the scene when it is skipped — a nine second
   chant or a four second wail carrying on over the teaching card is a bug,
   not a tail. Every sample a scene starts is remembered here and ramped out
   when the scene ends. Ambient play sounds are NOT in this list: only stings
   fired while a cine is running.                                          */
let cineVoices = [];
/* v5.30: `keepSpeech` — at a scene's NATURAL end a line still being said
   finishes its sentence instead of being ramped out in 300 ms (Chad: "some
   of his voicelines sound cut off prematurely"); the card's own line waits
   for it (speak() honours liveVoices). A skip still cuts everything: the
   player ended the scene, and a sentence carrying on past that is the bug
   this list was written for. */
function stopCineVoices(keepSpeech = false) {
  if (actx) {
    const t = actx.currentTime;
    for (const s of cineVoices) {
      if (keepSpeech && liveVoices.has(s)) continue;
      try {
        if (s.__g) {
          s.__g.gain.cancelScheduledValues(t);
          s.__g.gain.setValueAtTime(s.__g.gain.value, t);
          s.__g.gain.linearRampToValueAtTime(0.0001, t + 0.30);
        }
        s.stop(t + 0.32);
      } catch { /* already finished on its own */ }
    }
  }
  cineVoices = [];
}
/* `vol` scales the kind's own level, so a scene can place the same dread bed
   loud under a reveal and barely-there under a walk away, without inventing
   a second kind for every shade. */
/* every cue a scene fires, and whether it made a sound — a probe and a
   harness can read this where a screenshot hears nothing (v5.13) */
const stingLog = [];
function sting(kind, vol = 1) {
  // the heart hears these even when the speakers are off
  if (kind === 'boom') pulseSpike(0.7);
  if (kind === 'scream' || kind === 'gscream') pulseSpike(0.95);
  if (kind === 'gwail') pulseSpike(0.8);
  const rec = { kind, how: '' };
  stingLog.push(rec); if (stingLog.length > 300) stingLog.shift();
  if (!actx || muted || !sfxOut()) { rec.how = !actx ? 'no-ctx' : muted ? 'muted' : 'no-out'; return; }
  if (kind === 'step' && sndBuf('step1')) { stepSnd(0.5 * vol); rec.how = 'step'; return; }
  const smp = STING_SAMPLE[kind];
  if (smp) {
    const src = snd(smp[0], smp[1] * vol);
    if (src) { if (cine) cineVoices.push(src); rec.how = 'sample'; return; }
    rec.how = packBufs[smp[0]] ? 'ctx-' + (actx ? actx.state : 'none') : (packJson && packJson[smp[0]] ? 'decoding' : 'no-pack');
  }
  if (!STING_SYNTH.has(kind)) { if (!rec.how) rec.how = 'no-sample'; return; }
  rec.how = rec.how ? rec.how + '+synth' : 'synth';
  const t0 = actx.currentTime;
  const env = (node, peak, a, d) => {
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(peak * vol, 0.001), t0 + a);
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
  // no forearm to add: the arm belongs to the model now, so the clone brings
  // its own and the mirror flips it with the hand.
  prayerArmL = new THREE.Group();
  prayerArmL.add(mir);
  prayerArmL.visible = false;
  prayerArmL.userData.model = c;
  handsRoot.add(prayerArmL);
  return prayerArmL;
}

// the hell note the hand comes back holding — lives in the viewmodel scene
const noteProp = new THREE.Mesh(
  new THREE.PlaneGeometry(0.15, 0.090),        // 1.667:1, the art's shape
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

   Deliberately does not touch stats or inventory: those are the player's,
   and worldState()/applyState() are how they travel.                     */
function rebuildStage(next) {
  const ch = next || CH;
  /* v15: she is the ENGINE's and outlives every chapter, so she leaves the
     world BEFORE its sweep. Riding it, she was swept with it: her geometry,
     her materials and her four textures freed at every chapter change, and
     uploaded and linked again under the next curtain — identical bytes,
     every time. The JS objects never went anywhere, so what is drawn cannot
     change; only the round trip to the GPU goes. */
  if (ghost.parent) ghost.parent.remove(ghost);
  stage.dispose();
  stage = ch.build(CHCTX);
  stage.world.add(ghost);            // she is the engine's, but rides the world
  BLOCKERS = stage.blockers;
  noteProp.material.map = stage.noteTex;      // the old one was just disposed
  noteProp.material.needsUpdate = true;
  applyNoteArt();                            // and the real art over the top
  redoShadows();
  return stage;
}

/* Switch which chapter the engine is playing: the resume path when a save
   names a different one, and the advance path when a chapter is sealed.

   Note what is MUTATED rather than reassigned. `OFFER_POS` aliases the same
   Vector3 as SHRINE, several closures captured BOUNDS, and the ghost reads
   GHOST_HOME directly — reassigning those bindings would leave every alias
   pointing at the previous chapter's numbers, and the only symptom would be
   the player walking through a wall three chapters later. Mutating the
   objects in place keeps every alias correct by construction.            */
function setChapter(key) {
  if (!chapterExists(key)) return false;
  if (key === CH_KEY) return true;                 // already there; not an error
  revealAt = 0;                    // v14.15: a new world is covered until the curtain lifts
  const leaving = CH_KEY;          // v14.16: whose sounds can be let go (below)
  CH_KEY = key;
  CH = window.__CHAPTERS__[key];
  wardEpisode();                   // v14.7: a new episode recharges the amulet ...
  ward.enter = ward.charge;        // ... and this chapter is entered with what it holds
  SHRINE.set(CH.shrine.x, 0, CH.shrine.z);
  GHOST_HOME.set(CH.ghostHome.x, 0, CH.ghostHome.z);
  Object.assign(BOUNDS, CH.bounds);
  applyGhostTerritory();           // her reach is the new chapter's, not the old one's
  applyDaylight();                 // and so is the time of day
  kitReset();                      // v7.0: and the play kit starts clean for it
  silenceChapterLoops();           // and so is the room tone
  releaseChapterSounds(leaving);   // v14.16: and the chapter left lets its decoded sounds go
  herRelease();                    // v15: and her own, where she cannot be
  packLoad(key);                   // and its own sounds, if they are not here yet
  /* v5.29: and the right AGE of Master Zav in the equipment panel. Within
     episode 1 every chapter names the same figure, so this is a no-op
     today; it is what makes episode 2 a table row rather than a bug. */
  zavPrefetched = false;
  zavPrefetch();
  if (musicGain && actx) {         // and the explore music obeys the new chapter
    const g = musicGain.gain, now = actx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(musicVolNow(), now + 1.2);
  }
  if (musicWanted && !musicParked()) musicStart();   // v15: a chapter with music after one that parked it
  SPAWN.pos.set(CH.spawn.x, CH.spawn.y, CH.spawn.z);
  /* v7.5: a chapter may say which way its spawn FACES (`spawn.rot`, a
     yaw). Every chapter used to face −z, which put episode 2's first
     frame of play into the black of the corridor box behind the
     entrance. Episode 1 declares nothing and keeps 0. */
  SPAWN.rot = Number.isFinite(CH.spawn.rot) ? CH.spawn.rot : 0;
  rebuildStage(CH);
  applyChapterText();
  applyChapterWords();             // and the words that name what you act on
  warnIfScenesMissing();
  return true;
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
  vmKey.intensity = VM_REST.key;
  layoutHands();
  noteProp.visible = false;
  if (prayerArmL) prayerArmL.visible = false;
  if (rightHandModel) setHandCurl(rightHandModel, 1);
  ghost.position.copy(s.gPos);
  ghost.rotation.y = s.gRotY;
  if (keep.ghostGone) { reveal = 0; ghostOpacity(0); }
  else { reveal = s.reveal; ghostOpacity(s.reveal); }
}

/* `startFade` is what the black overlay reads on the film's FIRST frame: 0
   for a scene that begins on the world in front of you, and 1 for a
   chapter's opening FILM, which has to begin on black and stay black until
   its own fade track lifts it.

   It exists because the line below used to clear the overlay unconditionally
   and so undid the black that enterWorld had just put up: the film's first
   seconds played in full view, and then its fade-in snapped the screen to
   black and revealed the same shot a second time. An opening that shows you
   the room before it fades in is not an opening.                          */
/* v6.12: set the world lens, cheaply — a projection matrix is only rebuilt
   when the angle actually moves, so calling this every cutscene costs nothing */
function camLens(fov) {
  if (camera.fov === fov) return;
  camera.fov = fov;
  camera.updateProjectionMatrix();
}
function playCineFn(sceneFn, onDone, startFade = 0) {
  const snap = snapWorld();
  const c = {
    t: 0, last: performance.now(), paused: false,
    tracks: [], stings: [], dur: 1,
    handsAuto: null,           // t => walking speed, or null when scripted
    ghostMix: null,            // t => animation speed for her walk cycle
    keep: {}, endFade: 0, snap, onDone
  };
  cineDuck = null;                 // a scene starts with the room at full
  cineMusicK = 1;                  // v6.6: and the music at the chapter's level
  camLens(CAM_FOV);                // v6.12: and on the chapter's own lens
  sceneFn(c, snap, sceneApi(c));
  c.dur = c.tracks.reduce((m, tr) => Math.max(m, tr.t1), 1);
  cine = c;
  state = 'cine';
  /* scene audio is authored: a play-state narration still talking when the
     scene starts would run straight over the scene's own first line (ch4's
     near line could carry three seconds into a cutscene that speaks at one) */
  if (voiceSrc) { try { voiceSrc.stop(); } catch {} voiceSrc = null; }
  if (narSrc) { try { narSrc.stop(); } catch {} narSrc = null; }
  ui.hud.classList.add('hide');
  ui.interact.classList.add('hide');
  hint.classList.add('hide');
  document.body.classList.add('cine');
  letterboxArm();                            // v15: once the bars are in, only the band between them is shaded
  cineFadeEl.classList.remove('clearing');   // a scene owns the fade outright
  cineFadeEl.style.opacity = String(startFade);
  document.exitPointerLock?.();
}
/* A choice with no scene falls straight through to its outcome card rather
   than throwing. Chapter 2 will be written scene by scene, and a half-built
   chapter must be PLAYABLE while it is half-built — a crash on choice three
   would make the other three untestable too. */
const playCine = (i, onDone) => {
  const sceneFn = scenesOf()[i];
  if (typeof sceneFn !== 'function') {
    console.warn(`chapter ${CH_KEY}: choice ${i} has no scene — skipping to the card`);
    onDone();
    return;
  }
  playCineFn(sceneFn, onDone);
};

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
    if (!s.fired && s.at > before - 1e-9 && s.at <= c.t) {
      s.fired = true; sting(s.kind, s.vol === undefined ? 1 : s.vol);
    }
  }
  cineSeek(c.t);
  if (c.ghostMix && ghostMixer) {
    const sp = c.ghostMix(c.t);
    if (sp > 0) ghostMixer.update(rdt * sp);
  }
  skipBtn.classList.toggle('hide', c.t < CINE_SKIP_AT);   // v6.6: 3.0 s, every cutscene
  if (c.t >= c.dur && !c.paused) cineEnd();
}

function cineHands(dt, t) {
  const c = cine;
  if (!c) return;
  if (c.handsAuto) updateViewmodel(dt, t, c.handsAuto(c.t), 0, 0, 0);
}

/* Dissolve the black a scene ended on.

   Timing is the whole thing here. The black exists to cover restoreWorld()'s
   snap back to where the player actually stands — and restoreWorld has
   ALREADY RUN by the time this is called, so from this moment the black is
   doing no work at all. Started from cineEnd(), it is on its way out before
   the card even begins to rise, which is why all four outcomes now look
   like the fourth one did: a card over the night, never a card over black.

   It used to be started after the card was shown, and to take nearly a
   second, so scenes A, B and C spent that second as a solid black plate
   under a card that was semi-transparent the whole time and could not show
   it. Only scene D, which ends unfaded, escaped.                        */
function clearCineFade() {
  if (cineFadeEl.style.opacity === '0' || cineFadeEl.style.opacity === '') return;
  // commit the current opacity before the transition is attached, or there
  // is nothing for it to run FROM and the black simply snaps off
  void cineFadeEl.offsetWidth;
  cineFadeEl.classList.add('clearing');
  // the class carries opacity:0 too, so a browser that skips the transition
  // still lands on clear rather than staying black
  setTimeout(() => {
    cineFadeEl.style.opacity = '0';
    cineFadeEl.classList.remove('clearing');
  }, 520);
}

function cineEnd() {
  const c = cine;
  if (!c) return;
  cine = null;
  cineDuck = null;                  // the room tone comes back up with the world
  camLens(CAM_FOV);                 // v6.12: a borrowed lens is always given back
  if (cineMusicK !== 1) { cineMusicK = 1; musicRamp(musicVolNow(), 1.5); }   // v6.6: and the music, if a film held it
  stopCineVoices(!c.skipped);       // v5.30: speech finishes unless the player cut it
  restoreWorld(c.snap, c.keep);
  cineFadeEl.style.opacity = String(c.endFade);
  /* Usually the black has nothing left to hide once the snap is done, so it
     goes. A scene that hands over to something else still black — a
     chapter's opening film, which ends and lets the chapter card come up
     over it — says so with `keepFade`, and the black stays until whatever
     comes next puts something in front of it.                            */
  if (!c.keepFade) clearCineFade();
  letterboxOff();                          // v15: the whole frame again, before the bars start to move
  document.body.classList.remove('cine');
  skipBtn.classList.add('hide');
  ui.hud.classList.remove('hide');
  c.onDone();
}

const CINE_SKIP_AT = 3.0;   // v6.6: the Skip button (and its keys) open this far into EVERY cutscene (Chad)
function skipCine() {
  const c = cine;
  if (!c) return;
  if (ev) evResolve({ ok: false, skipped: true });   // v7.0: a skipped film takes its event with it
  c.skipped = true;                 // v5.30: cineEnd() ramps the voices out too
  c.t = c.dur;
  cineSeek(c.dur);
  cineEnd();
}

/* v6.4: a FILM releases the mouse when it starts (so Skip can be reached),
   and until chapter 1 had one a new game on a desktop landed in play
   LOCKED — the Start click was the gesture. Skipping a film by click, tap
   or key is a gesture too, so it re-locks; a film left to run to its end
   has none, and play begins unlocked as it always has after chapters 2-5's
   films (edge-turn look, one click to lock). Only films: a scene's skip
   leads to an outcome card with buttons. Never from __enc.cine.skip(): a
   request with no gesture is refused and marks the page as unable to lock. */
function skipFilmOrScene() {
  const film = !!(cine && cine.film);
  skipCine();
  if (film) tryLock();
}
skipBtn.addEventListener('click', e => { e.stopPropagation(); skipFilmOrScene(); });
addEventListener('keydown', e => {
  if (state === 'cine' && cine && cine.t > CINE_SKIP_AT && !evActive() &&   // v7.0: a live event owns the keys
      (e.code === 'Escape' || e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter')) {
    skipFilmOrScene();
  }
});
/* v6.6: a tap or click ANYWHERE no longer skips (it did from 0.8 s, and a
   stray touch skipped a film — Chad). The Skip button and, on a keyboard,
   its shortcut keys are the only ways out, and both open at 3.0 s. */
addEventListener('pointerdown', e => {
  if (false && state === 'cine' && cine && !cine.paused && cine.t > 0.8 && !e.target.closest?.('#mute')) {
    skipFilmOrScene();
  }
});

/* ------------------------------------------------- the cutscene language */
// shared authoring helpers, bound to the cine being built
function A(c) {
  const tr = (t0, t1, fn, ease) => c.tracks.push({ t0, t1, fn, ease });
  const step = (t0, fn) => c.tracks.push({ t0, t1: t0, fn, once: true });
  const sfx = (at, kind, vol) => c.stings.push({ at, kind, vol });
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
  /* v6.12: A LONGER LENS for one shot — a macro is taken by narrowing the
     lens from a safe distance, the way a macro lens is, not by pressing a
     wide one against the subject (the near plane is 8 cm, and it also
     spares the wide-angle distortion a hand fills a 72° frame with).
     cineEnd() restores CAM_FOV on the natural end AND on a skip, so a
     cutscene can never leave the world zoomed. */
  const lens = (t0, t1, from, to, ease) => tr(t0, t1, k => {
    camera.fov = from + (to - from) * k;
    camera.updateProjectionMatrix();
  }, ease);
  return { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, ghostGlide, ghostFacePlayer, lens };
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
    CAM_FOV,                         // v6.12: so a scene that borrows the lens can hand it back by name
    PRAYER_R, PRAYER_L, setHandPrayer, handWidth: () => HAND_W,
    camera, yaw, pitch,
    ghost, ghostLight, ghostOpacity, getReveal: () => reveal,
    duck: duckLoop,                  // hold one of the chapter's loops down
    kit: KIT,                        // v7.0: the play kit, from inside a scene
    /* v7.0: a reaction event inside a film. `event` starts it at `at` and the
       film runs on; `eventWait` PAUSES the film until it resolves. The skip
       keys belong to the event while it is live; the Skip button still ends
       the film, and a skip resolves the event as skipped. */
    event: (at, opts, onDone) => step(at, () => { kitEvent(opts).then(r => { if (typeof onDone === 'function') onDone(r); }); }),
    eventWait: (at, opts, onDone) => step(at, () => {
      const mine = cine; if (mine) mine.paused = true;
      kitEvent(opts).then(r => {
        if (cine === mine && mine) { mine.paused = false; mine.last = performance.now(); }
        if (typeof onDone === 'function') onDone(r);
      });
    }),
    music: cineMusic,                // v6.6: hold the explore music down (a film with its own theme)
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
/* Read off CH at call time rather than captured once: setChapter() can put a
   different chapter in play, and a captured list would keep running the old
   chapter's cutscenes over the new chapter's world. */
const scenesOf = () => (CH.scenes || []);
function warnIfScenesMissing() {
  const n = scenesOf().length;
  if (n !== CH.choices.length) {
    console.warn(`chapter ${CH_KEY}: ${CH.choices.length} choices but ${n} ` +
                 `scenes — a choice with no scene will fall straight through ` +
                 `to its outcome card`);
  }
}
warnIfScenesMissing();


/* Start. The chapter card goes black over the top while the scene is already
   running behind it, so the fade out puts you in a night that has been going
   on without you. Nothing can be done during it — the state is not 'play'
   yet, so nothing moves and nothing drains.                                 */
const CARD_FADE = 900, CARD_HOLD = 2300;
/* Wait for the chapter's own world, the hands and the ghost, under whatever
   is already covering the screen.

   Two things need this now: the chapter card, which has always held its
   black until the models arrived, and a chapter's OPENING FILM, which is a
   worse case — a card over an unloaded world is just a card, but a film
   over one is a camera move through an empty room. Capped, because a fetch
   that never lands must not hold the game forever; past the cap we proceed
   and models pop in late, exactly as before.                             */
/* ── v14.15: THE CURTAIN ──────────────────────────────────────────────────
   Every way into a chapter — the film, the card after it, Continue, a
   replay — comes through here while the screen is covered, and the world is
   uncovered only once nothing heavy is left to do. Chad: "very smart loading
   so there is no sudden stutters or delays before showing full res models."
   Before v14.15 this waited for the chapter's one or two KEY models (its
   `ready()`), the hands and the ghost; everything else popped in whenever
   it landed, and its parse, its texture upload and its shader compile fell
   on whatever frame of play that was. Now, under the cover:
     1. every tracked load is in and has been put in the world (loadPending
        is 0 twice in a row, so a load that starts another is not missed),
        and the chapter's own ready() holds as before;
     2. the equipment figure and every item model this chapter can show —
        the ones the player carries, and the ones the chapter declares it
        hands out (`items`; curtainItems) — are parsed in their renderers;
     3. warmWorld(): every texture uploaded to the GPU, every program
        compiled (compileAsync covers HIDDEN objects too — a cutscene's props
        and a far LOD level included), the figure and the items drawn once
        offscreen, and two frames drawn under the cover;
   then the curtain lifts. The loading word counts up while it waits. The
   cap is long because a late model is exactly what Chad asked not to see,
   and past it the world is shown anyway, as it always was.              */
const WORLD_CAP = HOSTED ? 90000 : 30000;
/* ── v14.15: DOWNLOAD AHEAD ─────────────────────────────────────────────
   While a chapter is being played, what the NEXT one is made of is fetched
   in idle time, at low priority, one file at a time — into the browser's
   HTTP cache only: the bytes are read and dropped, never parsed and never
   held (every asset is served immutable for a year, so the next curtain's
   fetch is a disk read). The next chapter's own files, its episode's
   equipment figure, and any item model it names. At the title, the chapter
   Continue would open, the same way. Hosted build only; the single-file
   build has everything inline already. */
const prefetched = new Set();
let prefetchQ = [], prefetchBusy = false;
function chapterFiles(key) {
  const c = window.__CHAPTERS__[key]; if (!c) return [];
  const out = new Set(Array.isArray(c.assets) ? c.assets : []);
  const fig = ZAV_FIGURE[episodeOf(key)] || ZAV_ADULT; out.add(fig);
  for (const id of (Array.isArray(c.items) ? c.items : [])) {
    const d = ITEM_DEFS[id];
    if (d && d.model) { out.add(d.model); if (d.art) out.add(d.art); }
  }
  return [...out].filter(k => HOSTED && ASSET_MAP[k] && !_assetSeen.has(k) && !prefetched.has(k));
}
function prefetchAhead(key) {
  /* v14.16: a phone with its DATA SAVER on has said it does not want bytes
     it did not ask for; the next chapter then loads behind its own curtain */
  const saver = !!(navigator.connection && navigator.connection.saveData);
  if (!HOSTED || !key || saver) return;
  for (const k of chapterFiles(key)) if (!prefetchQ.includes(k)) prefetchQ.push(k);
  prefetchPump();
}
function prefetchPump() {
  if (prefetchBusy || !prefetchQ.length) return;
  /* never while the world is being put together: the curtain's own loads
     come first, and a download ahead must not slow them */
  if (loadPending > 0) { setTimeout(prefetchPump, 2000); return; }
  const k = prefetchQ.shift();
  if (_assetSeen.has(k) || prefetched.has(k)) return prefetchPump();
  prefetchBusy = true; prefetched.add(k);
  /* v15: DRAINED, not materialised. The bytes are only here to land in the
     HTTP cache; `arrayBuffer()` built each file as one contiguous buffer on
     the page (a 10 MB amulet, an 8 MB figure) just to drop it — mid-play, a
     big allocation and a copy that brings the next garbage collection
     closer. Reading the stream to its end fills the cache the same way in
     small chunks. A browser without body streams keeps the old way. */
  const drain = async r => {
    if (!r.ok) return;
    const rd = r.body && r.body.getReader ? r.body.getReader() : null;
    if (!rd) { await r.arrayBuffer(); return; }
    for (;;) { const c = await rd.read(); if (c.done) break; }
  };
  const go = () => fetch(ASSET_MAP[k], { priority: 'low' })
    .then(drain).catch(() => null)
    .then(() => { prefetchBusy = false; setTimeout(prefetchPump, 400); });
  if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 300);
}
function curtainItems() {
  const ids = new Set();
  for (const k of GEAR_SLOTS) if (inv.gear[k]) ids.add(inv.gear[k]);
  for (const id of inv.bag) if (id) ids.add(id);
  /* and what the chapter declares it can hand out (`items`, v14.15 — the
     chapter's own build() is closed over, so it cannot be read for them;
     chaptertest fails a chapter whose kit.give names an item it did not
     declare) */
  for (const id of (Array.isArray(CH.items) ? CH.items : [])) ids.add(id);
  return [...ids].filter(id => ITEM_DEFS[id] && ITEM_DEFS[id].model);
}
/* v14.16: DRAW EVERYTHING ONCE, UNDER THE COVER. compile() builds programs
   for hidden objects too, but a mesh's GEOMETRY reaches the GPU only when
   it is first drawn — so a thing hidden when the curtain lifts (ch3's
   full-detail table amulet, the near level of its LOD, a cutscene's props,
   a ghost) uploaded its buffers on the frame it first appeared, which on a
   phone is the hitch v14.15 was built to remove. So one frame is drawn with
   every mesh forced visible, every LOD level shown and nothing culled —
   onto the real canvas, because the cover over it is opaque and a render
   TARGET would compile a second set of programs (no tone mapping) that
   nothing uses. The LIGHTS are exactly the frame's own (a light under a
   forced-visible group is held dark), so the programs drawn are the ones
   play will use; the frozen shadow maps are not redrawn with the hidden
   things in them; and every flag is put back in a finally. */
function warmGeometry(r, root, cam, tiny = false, shadows = false) {
  sphereCullAll(true);                 // v15: everything the sphere culling took off the camera goes back for the warm frame
  const flips = [], culled = [], lods = [];
  const walk = (o, hiddenAbove) => {
    const hidden = hiddenAbove || !o.visible;
    if (o.isLight) { if (hidden && o.visible) { flips.push(o); o.visible = false; } }
    else if (!o.visible) { flips.push(o); o.visible = true; }
    if (o.isLOD) { lods.push([o, o.autoUpdate]); o.autoUpdate = false; }
    if ((o.isMesh || o.isPoints || o.isLine || o.isSprite) && o.frustumCulled) { culled.push(o); o.frustumCulled = false; }
    for (const c of o.children) walk(c, hidden);
  };
  const sm = r.shadowMap, smAuto = sm.autoUpdate, smNeed = sm.needsUpdate, clr = r.autoClear;
  try {
    walk(root, false);
    /* v15: with `shadows`, the shadow maps are drawn in the same pass. A
       material that samples a shadow map drawn before its light's map exists
       gets three's 1×1 stand-in bound — and that stand-in is never uploaded,
       so the driver REJECTS the draw (measured: 257 rejected draws under
       chapter 1's curtain once v15 stopped drawing covered frames, which had
       made the maps as a side effect). The maps drawn here see everything
       forced visible, and only when some drawn light has none yet;
       `redoShadows()` after the warm draws them true on the next frames, which
       are drawn under the cover too. */
    let noMap = false;                   // only when some light that is drawn has no map yet
    if (shadows && sm.enabled) root.traverseVisible(o => { if (o.isLight && o.castShadow && !(o.shadow && o.shadow.map)) noMap = true; });
    sm.autoUpdate = false; sm.needsUpdate = noMap;
    r.autoClear = true;
    if (tiny) { r.setScissor(0, 0, 1, 1); r.setScissorTest(true); }
    r.render(root, cam);
  } catch { /* a warm frame that fails costs a hitch later, never the chapter */ }
  finally {
    if (tiny) r.setScissorTest(false);
    for (const o of flips) o.visible = !o.visible;
    for (const o of culled) o.frustumCulled = true;
    for (const [o, a] of lods) o.autoUpdate = a;
    sm.autoUpdate = smAuto; sm.needsUpdate = smNeed; r.autoClear = clr;
  }
}
/* v15: THE LIGHT STATES PLAY WILL REACH, COMPILED UNDER THE CURTAIN. The
   number of lights of each kind is part of every lit material's shader, so
   the first frame a light switches ON compiles a new variant of every lit
   material drawn that frame — measured in chapter 1: HER FIRST APPEARANCE
   (her own light going up) compiled 8 programs mid-play, and the worst frame
   was 8.6 s on the probe box. The engine knows which of its own lights come
   and go: her light (and her materials going from see-through to solid), the
   torch, the rifle's muzzle flash. Each such state is compiled here, under
   the cover, and three keeps every variant a material has ever used, so the
   moment in play is a lookup, not a compile. Every flag is restored in a
   finally, and her materials are marked for a program check afterwards so
   she is never drawn with the variant compiled for the other transparency. */
/* v15: THE LIGHT COUNTS THIS DEVICE HAS SEEN. A film or a scene can switch
   lights in combinations no rule can guess (chapter 4's film opens on a
   flat whose lamps are OFF), and each new combination compiles every lit
   material drawn that frame, on screen. But a program depends on how MANY
   lights of each kind are drawn, not on which — so a combination can be
   reproduced exactly with stand-in lights at zero intensity. Every frame
   after the curtain that compiled a program records the counts it drew
   with, per chapter and per profile (a phone's lights are not a desktop's),
   in this device's storage; the next curtain for that chapter compiles them.
   A new device pays once, and only where the rules below did not already
   cover it. */
const LIGHTMEM_KEY = 'mz.encounters.lightsets';
function lightCounts() {             // [dir, point, spot, rect, hemi, dirShadow, pointShadow, spotShadow] drawn now
  const n = [0, 0, 0, 0, 0, 0, 0, 0];
  scene.traverseVisible(o => {
    if (!o.isLight || o.isAmbientLight) return;
    const k = o.isDirectionalLight ? 0 : o.isPointLight ? 1 : o.isSpotLight ? 2 : o.isRectAreaLight ? 3 : o.isHemisphereLight ? 4 : -1;
    if (k < 0) return;
    n[k]++;
    if (o.castShadow && k < 3) n[5 + k]++;
  });
  return n;
}
const lightMemKey = () => CH_KEY + (LOW ? ':low' : '');
/* ... and the counts every film and scene of every chapter reaches, recorded
   ONCE by tools/probes/seedlights.mjs (desktop and phone) and shipped in
   src/lightseeds.json, so even a first viewing on a new device is warmed.
   Stale seeds cost only curtain time; a missing one is learned by the device
   memory above. */
function lightMemRead() {
  const out = [];
  if (OPT.lightSeeds) { const l = LIGHT_SEEDS[lightMemKey()]; if (Array.isArray(l)) out.push(...l); }
  try { const all = JSON.parse(localStorage.getItem(LIGHTMEM_KEY) || '{}'); const l = all[lightMemKey()]; if (Array.isArray(l)) out.push(...l); }
  catch { /* storage blocked: the seeds alone */ }
  return [...new Set(out)];
}
function lightMemAdd(sigStr) {
  try {
    const all = JSON.parse(localStorage.getItem(LIGHTMEM_KEY) || '{}');
    const list = Array.isArray(all[lightMemKey()]) ? all[lightMemKey()] : [];
    if (list.includes(sigStr)) return;
    list.push(sigStr);
    all[lightMemKey()] = list.slice(-16);
    localStorage.setItem(LIGHTMEM_KEY, JSON.stringify(all));
  } catch { /* storage blocked: nothing is remembered, nothing breaks */ }
}
let progSeen = -1;
function lightMemTick() {             // after each drawn frame
  const n = renderer.info.programs.length;
  if (!revealAt || progSeen < 0) { progSeen = n; return; }
  if (n <= progSeen) return;
  progSeen = n;
  lightMemAdd(lightCounts().join(','));
}
/* reproduce remembered counts over the settled state: shadow casters by
   showing or hiding real ones (a stand-in cannot cast without a map), the
   rest by hiding real lights or adding stand-ins. False when the counts
   cannot be reached; every change goes through `set`/`extra`, so the
   caller's finally takes it all back. */
function lightMemApply(target, lights, set, extra) {
  const T = target.split(',').map(Number);
  if (T.length !== 8 || T.some(v => !Number.isFinite(v) || v < 0 || v > 64)) return false;
  const kindOf = o => o.isDirectionalLight ? 0 : o.isPointLight ? 1 : o.isSpotLight ? 2 : o.isRectAreaLight ? 3 : o.isHemisphereLight ? 4 : -1;
  const shown = o => { for (let a = o.parent; a && a !== scene; a = a.parent) if (!a.visible) return false; return true; };
  for (let k = 0; k < 3; k++) {                         // the shadow counts first, with real lights
    let C = lightCounts();
    for (const o of lights) {
      if (C[5 + k] === T[5 + k]) break;
      if (kindOf(o) !== k || !o.castShadow || !shown(o)) continue;
      if (C[5 + k] > T[5 + k] && o.visible) { set(o, 'visible', false); C = lightCounts(); }
      else if (C[5 + k] < T[5 + k] && !o.visible) { set(o, 'visible', true); C = lightCounts(); }
    }
    if (C[5 + k] !== T[5 + k]) return false;
  }
  for (let k = 0; k < 5; k++) {                          // then the totals, never touching a caster
    let C = lightCounts();
    for (const o of lights) {
      if (C[k] <= T[k]) break;
      if (kindOf(o) === k && !o.castShadow && o.visible && shown(o)) { set(o, 'visible', false); C = lightCounts(); }
    }
    while (C[k] < T[k]) {
      const L = k === 0 ? new THREE.DirectionalLight(0xffffff, 0) : k === 1 ? new THREE.PointLight(0xffffff, 0, 1)
              : k === 2 ? new THREE.SpotLight(0xffffff, 0, 1) : k === 4 ? new THREE.HemisphereLight(0xffffff, 0x000000, 0) : null;
      if (!L) return false;                              // no rect-area stand-in: not reproducible
      extra(L); C = lightCounts();
    }
    if (C[k] !== T[k]) return false;
  }
  return lightCounts().join(',') === T.join(',');
}
function warmLightStates() {
  if (!OPT.lightWarm) return;
  /* every state is compiled on top of the SETTLED one — the set darkLights
     arrives at twenty frames into play, with every light at zero dropped —
     because that is the set her light, the torch or the flash is added to
     when it comes on. A state whose light counts (and her transparency) are
     ones already compiled is skipped: the programs are the same programs. */
  const lights = [];
  scene.traverse(o => { if (o.isLight && !o.isAmbientLight && !o.isHemisphereLight) lights.push(o); });
  const sig = () => lightCounts().join(',') + (ghostMats.length && ghostMats[0].transparent ? 't' : 'o');
  const done = new Set([sig()]);             // the state the main compile just covered
  const states = ['settled'];
  /* v15: a chapter's own lights too, found rather than declared. A FILM SET
     is a hidden group with its lights inside it (episode 2 chapter 1's ferry,
     jetty and parade square): the frame it is shown, the light counts change
     and every lit material drawn that frame is compiled on screen — measured,
     25 programs at four cuts of that film (9 of them on the cut to the
     parade square) — and chapter 1's prologue compiled 44 as each memory's
     pocket lit up. So every light not drawn now is put with the others of its
     GROUP (lights that come on together live together), and each group, the
     room's dark lamps all at once, and one lamp of each kind alone are states
     of their own. `compile` covers every material in the scene, hidden or
     not, so one state per distinct set of light counts is enough — the
     duplicates are skipped by `sig`. */
  const groups = new Map(), darkKinds = new Map();
  const top = new Set([scene, stage && stage.world, camera]);   // the camera's own (torch, flash) have states of their own
  for (const o of lights) {
    let hidden = false;
    for (let a = o.parent; a && a !== scene; a = a.parent) if (!a.visible) hidden = true;
    if (!hidden && o.visible && o.intensity > 0.0005) continue;        // drawn now: the main compile has it
    const g = o.parent;
    if (g && !top.has(g)) { if (!groups.has(g)) groups.set(g, []); groups.get(g).push(o); continue; }
    if (hidden) continue;
    const kind = (o.isDirectionalLight ? 'd' : o.isPointLight ? 'p' : o.isSpotLight ? 's' : 'r') + (o.castShadow ? 'S' : '');
    if (!darkKinds.has(kind)) darkKinds.set(kind, o);
  }
  if (OPT.lightSets) {
    /* a GROUP's lights come on together — a film set, a memory's pocket, a
       diorama: shown with its hidden ancestors, every light in it on */
    for (const [g, ls] of groups) states.push({ show: g, lights: ls });
    /* and two SIBLING groups at once — a crossfade: chapter 1's prologue
       dissolves one memory's pocket into the next, and for that second both
       are lit (measured: 20 programs at 14.5 s, the only compiles left in
       the film). The two largest under each shared parent. */
    const kids = new Map();
    for (const [g, ls] of groups) {
      const pa = g.parent; if (!pa || top.has(pa)) continue;
      if (!kids.has(pa)) kids.set(pa, []);
      kids.get(pa).push([g, ls]);
    }
    for (const list of kids.values()) {
      if (list.length < 2) continue;
      list.sort((a, b) => b[1].length - a[1].length);
      states.push({ show: list[0][0], also: list[1][0], lights: [...list[0][1], ...list[1][1]] });
    }
    /* and one of the room's dark lamps of each kind alone (a flare, a torch on
       the ground, one lamp at lights-out). Not all of them at once: measured,
       that combination is one no film reaches, and a state no film reaches is
       only curtain time — what a film does that no rule guesses, the light
       memory below learns. */
    for (const o of darkKinds.values()) states.push({ lights: [o] });
  }
  /* her, where she haunts — and where a FILM or a scene shows her in a
     chapter she cannot haunt (chapter 3's opening: her, out on the tarmac) */
  if (CH.ghost !== null || (OPT.lightSets && chText().includes('ghostOpacity('))) states.push('ghost', 'ghostSolid');
  if (torchDecl && torchLight) states.push('torch');
  if (weaponDecl && weaponFlash) states.push('flash');
  if (OPT.lightMem) for (const m of lightMemRead()) states.push({ mem: m });
  const allLights = [];
  if (OPT.lightMem) scene.traverse(o => { if (o.isLight && !o.isAmbientLight) allLights.push(o); });
  for (const st of states) {
    const undo = [], added = [];
    const set = (o, k, v) => { if (o[k] !== v) { undo.push([o, k, o[k]]); o[k] = v; } };
    const extra = (L) => { scene.add(L); added.push(L); };
    try {
      for (const o of lights) if (o.intensity <= 0.0005 && o.visible) set(o, 'visible', false);
      if (st === 'settled') { /* nothing more */ }
      else if (st.lights) {
        for (let a = st.show; a && a !== scene; a = a.parent) set(a, 'visible', true);
        for (let a = st.also; a && a !== scene; a = a.parent) set(a, 'visible', true);
        for (const o of st.lights) set(o, 'visible', true);
      }
      else if (st === 'ghost' || st === 'ghostSolid') {
        set(ghost, 'visible', true); set(ghostLight, 'visible', true);
        for (const m of ghostMats) set(m, 'transparent', st === 'ghost');
      } else if (st === 'torch') set(torchLight, 'visible', true);
      else if (st === 'flash') set(weaponFlash, 'visible', true);
      else if (st.mem && !lightMemApply(st.mem, allLights, set, extra)) continue;
      const k = sig();
      if (done.has(k)) continue;              // (the finally still restores)
      done.add(k);
      renderer.compile(scene, camera);
      /* and DRAWN once, into one pixel under the cover: a driver may build a
         program's pipeline at its first draw rather than at link (ANGLE on
         Metal does), so a compile alone can leave part of the stall in play */
      warmGeometry(renderer, scene, camera, true, true);   // with shadows: a light turned on may have no map yet
    } finally {
      for (let i = undo.length - 1; i >= 0; i--) { const [o, k, v] = undo[i]; o[k] = v; }
      for (const L of added) { scene.remove(L); L.dispose?.(); }
      for (const m of ghostMats) m.needsUpdate = true;   // re-picks the variant for her real transparency
    }
  }
}
async function warmWorld(items) {
  const cap = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
  const up = (r, root) => {
    const tex = new Set();
    root.traverse(o => {
      const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of ms) for (const k in m) { const v = m[k]; if (v && v.isTexture) tex.add(v); }
    });
    for (const t of tex) { try { r.initTexture(t); } catch { /* one bad texture must not stop the rest */ } }
  };
  try { up(renderer, scene); up(renderer, vmScene); } catch {}
  /* v14.16: compileAsync only where the driver can compile in the
     background (KHR_parallel_shader_compile); without it three blocks on
     each program anyway and says so on the console, so the plain compile
     does the same work without the warning */
  try {
    const par = renderer.extensions && renderer.extensions.has && renderer.extensions.has('KHR_parallel_shader_compile');
    if (par) await cap(Promise.all([renderer.compileAsync(scene, camera), renderer.compileAsync(vmScene, vmCam)]), 15000);
    else { renderer.compile(scene, camera); renderer.compile(vmScene, vmCam); }
  } catch {}
  try { warmLightStates(); } catch {}           // v15: the light counts play will reach, compiled now
  /* v14.16: the geometry of what is hidden, too — v15: into ONE pixel. The
     warm draw exists to upload buffers and build pipelines, which a draw does
     whatever it covers; shading the whole canvas under the cover, with
     everything forced visible, was work nobody saw (the frames drawn under
     the cover after it still draw the full frame) */
  warmGeometry(renderer, scene, camera, OPT.warmTiny, true);
  warmGeometry(renderer, vmScene, vmCam, OPT.warmTiny);
  redoShadows();                             // v15: and true again on the covered frames below
  try { zavWarm(); } catch {}
  for (const id of items) {
    if (iv.state[id] !== 'ready') continue;
    try { up(iv.r, iv.models[id]); ivRender(id, 64, 64, 0.6, 0.3, 1); } catch {}
  }
  // two frames drawn under the cover: the first draw of everything (shadow
  // maps, the render lists) happens here and not in the first visible frame
  forceDraw = 3;                             // v15: drawn although covered — that is what they are for
  await cap(new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))), 3000);
}
function whenWorldReady(then, capMs = WORLD_CAP) {
  const t0 = performance.now();
  /* v14.16: the word goes where the player can see it — on the chapter card
     when the card is up, and over the black before an opening film, where
     the card is hidden and the wait used to be a silent black screen */
  const cardUp = ui.chapter && !ui.chapter.classList.contains('hide');
  const load = cardUp ? $('chapLoad') : $('worldLoad');
  const other = cardUp ? $('worldLoad') : $('chapLoad');
  other?.classList.add('hide');
  const items = curtainItems();
  try { zavInit(); zavLoad(); } catch {}
  for (const id of items) { try { ivModel(id); itemArtGet(id); } catch {} }   // the model and the painted icon
  const seen = new Set(loadLog.filter(r => !r.t1));    // what this wait counts, for the percentage
  let calm = 0, warming = false, warmedAt = -1, quietSince = -1;
  /* v14.16: and its SOUNDS. Since the dialogue left the shared pack (build.py,
     the bus tables), a chapter's lines — its opening line a few seconds into
     play, every hotspot's answer — live in its own pack, and a line whose
     pack has not arrived is dropped, not delayed. Both packs resolve on a
     failure too (packLoad forgets a failed fetch and says so by resolving),
     so this can only wait for bytes that are actually coming. */
  let packsIn = false;
  Promise.all([packLoad(), packLoad(CH_KEY)]).then(() => { packsIn = true; }, () => { packsIn = true; });
  setTimeout(() => { packsIn = true; }, 20000);   // and never longer than this: sound is not worth a stuck curtain
  const lift = () => {
    load?.classList.add('hide');
    if (!revealAt) revealAt = performance.now();         // the world is uncovered from here (THE LOAD TRACKER)
    assetsRelease();                                    // v14.16: the world is built; its files are dead weight
    then();
    setTimeout(() => prefetchAhead(nextChapterKey()), 8000);   // and the next chapter starts arriving (DOWNLOAD AHEAD)
  };
  const gate = () => {
    const now = performance.now();
    if (now - t0 > capMs) return lift();
    for (const r of loadLog) if (r.t0 >= t0 || !r.t1) seen.add(r);
    const extras = packsIn && !zav.loading && items.every(id => iv.state[id] === 'ready' || iv.state[id] === 'none');
    /* v14.16: SETTLED is nothing in flight; the world is READY when the
       chapter, the hands and the ghost say so. A key model whose download
       FAILED is settled and never ready — it used to hold the curtain the
       whole cap (90 s, and on the film path twice); now six quiet seconds
       with nothing left to arrive is taken as the answer, as the old 12 s
       cap took it. */
    const settled = loadPending === 0 && extras;
    if (settled) { if (quietSince < 0) quietSince = now; } else quietSince = -1;
    const world = stage.ready() && handsReady && ghostReady;
    const quiet = settled && (world || now - quietSince > 6000);
    calm = quiet ? calm + 1 : 0;
    if (calm >= 2 && !warming) {
      if (warmedAt >= 0 && loadSeq === warmedAt) return lift();   // warmed, and nothing new since
      warming = true;
      try { shadowCasterSync(); } catch {}          // v15: before the programs are compiled
      warmWorld(items).then(() => { warming = false; warmedAt = loadSeq; calm = 0; setTimeout(gate, 30); });
      return;
    }
    if (now - t0 > 500 && load) {                       // no flash of the word on an instant entry
      const done = [...seen].filter(r => r.t1).length;
      const pct = seen.size ? Math.min(99, Math.round(100 * done / seen.size)) : 99;
      load.textContent = `${T('chapter.loading', 'Loading…')} ${pct}%`;
      load.classList.remove('hide');
    }
    setTimeout(gate, 180);
  };
  gate();
}

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
    /* The card is opaque now, so it is the thing covering the screen. Any
       black left over from an opening film goes here — if it did not, the
       card would fade out at the end and reveal that black instead of the
       night behind it. */
    cineFadeEl.classList.remove('clearing');
    cineFadeEl.style.opacity = '0';
    setTimeout(() => {
      /* On the hosted site the world's files stream in while the title and
         this card are up; nearly always they have long since arrived. If the
         connection is slow, the card simply holds — a black card is already
         a loading screen — and says so, rather than dropping the player into
         an empty night. The cap means a lost fetch can't hold it forever:
         past it we proceed and models pop in late, exactly like today.     */
      whenWorldReady(() => {
        el.style.transition = '';            // hand it back to the stylesheet
        void el.offsetWidth;
        el.style.opacity = '';
        el.classList.remove('in');
        setTimeout(() => { el.classList.add('hide'); then(); }, CARD_FADE);
      });
    }, CARD_HOLD);
  };
  el.addEventListener('transitionend', cover, { once: true });
  setTimeout(cover, CARD_FADE + 1200);
}

/* ------------------------------------------------------- starting a run ---
   One path into the world, whether it is a fresh run or a resumed one. The
   chapter card holds the black while the models finish streaming in, so
   resume gets the same clean entrance a new game does — and it names the
   chapter you are resuming into, which is worth seeing.

   `place` runs while the screen is already black: everything it moves has
   to be moved BEFORE the fade out, or the player watches themselves being
   teleported.                                                            */
function enterWorld(place, opts = {}) {
  /* v12.2: every way into a chapter starts on the chapter's own lens with
     no aim held and no recoil owed. `weaponUp` itself is DERIVED on the
     frame (weaponFrame), so there is nothing to sync here — only state to
     give back. */
  weaponAdsOff(); weaponRecoilReset(); camLens(CAM_FOV);
  revealAt = 0;                    // v14.15: covered until the curtain lifts (THE LOAD TRACKER)
  // the title's backdrop stops when the title does — a hidden video still
  // decodes every frame, and the deck needs those frames more
  titleVideo?.el.pause();
  state = 'chapter';
  musicStart();                    // the click that counts as the gesture
  musicRamp(musicVolNow());        // back up if a trip to the title ramped it out (v5.12)
  tryLock();                       // has to be inside the click to be allowed

  /* A chapter may open on a FILM. `intro` is a scene function in exactly the
     cutscene language the four choice scenes are written in, and it runs
     against the chapter's own world before the chapter card — so the order
     the player sees is: film, then the chapter's title, then the night.

     Only when starting a chapter from its beginning. Resuming into the
     middle of one skips it: an opening is an opening, and sitting through
     it again to get back to where you were would be a punishment.

     A chapter with no `intro` — the fixture, and chapter 1 until v6.4 gave
     it the prologue — takes the path it always took, which is the test that
     this changed nothing.                                                */
  const intro = opts.intro && typeof CH.intro === 'function' ? CH.intro : null;

  const card = () => playChapterCard(() => {
    ui.hud.classList.remove('hide');
    hint.classList.remove('hide');
    setTimeout(() => hint.classList.add('hide'), 7000);
    document.body.classList.add('inplay');   // the inventory button belongs to play
    state = 'play';
    setHint();
    warmPlaySet();                 // her sounds must never race their decode
    zavPrefetch();                 // and the equipment figure should be standing there before it is asked for
    queueVoice();                  // his own voice, two seconds in
    autosave(true);                // the run is recorded from its first moment
    markReached(CH_KEY);           // and the chapter is open in the selector from now on (v5.12)
  });

  /* v8.2: BEFORE the branch, not inside the film's arm. This used to sit
     below, on the film path only — so a chapter entered with no film (the
     RESUME path, and any chapter that declares no `intro`) never drained
     what its build() asked to warm, and its hotspot lines were silent on
     the first press exactly as they were before v8.0. Chapters 1-5 warm
     nothing, so for them this is a no-op on an empty set. */
  packWarm(WARM_WANT);

  // placing happens BEFORE the card, not at its dissolve: the card's
  // fade must never reveal a frame of the world from the old vantage
  if (!intro) { if (place) place(); return card(); }

  /* Black first, and hold it: the film starts on a covered screen, so the
     world snapping into its opening position is never seen. The title goes
     now rather than when the card lands, because the card is no longer the
     next thing on screen.                                                */
  cineFadeEl.classList.remove('clearing');
  cineFadeEl.style.opacity = '1';
  ui.title.classList.add('hide');
  ui.hud.classList.add('hide');
  if (place) place();
  /* v5.13: THE FILM WAITS FOR ITS SOUNDS. A chapter's pack is fetched by
     setChapter(), and on the advance path startDecision() fetched it a
     whole decision earlier — but from the chapter selector, and on
     Continue into a chapter sealed-into but never entered, the fetch
     starts moments before the film. A cue fired before its sample has
     decoded is silent by design, so the film opened with no voice and no
     sound (Chad heard it first). So: the pack, then the decodes, then the
     models, then the film — each capped, so nothing can hold the black
     forever. */
  const packWait = Promise.race([packLoad(CH_KEY), new Promise(r => setTimeout(r, 12000))]);
  packWait.then(() => {
    warmIntroSet();
    whenDecoded(introSamples(), () => whenWorldReady(() => {
      /* v14.16: and again once the world is ready. The pack wait above gives
         up at 12 s, and a chapter's LINES live in its own pack now (the bus
         tables no longer pin them to the shared one) — so on a slow
         connection the pack could land after the warm, and a film cue with
         it would find its sample undecoded and play nothing (measured:
         chapter 2's first line, from the selector, on a busy box). The
         curtain now waits for the pack, so this warm finds it; and when
         everything is already decoded, this is immediate. */
      warmIntroSet();
      whenDecoded(introSamples(), () => {
        playCineFn(intro, card, 1);
        cine.film = true;          // v6.4: a skip by gesture may re-lock the mouse (skipFilmOrScene)
      });
    }));
  });
}

/* Continue: the default, and what the big button does whenever there is
   anything to come back to. */
function resumeRun() {
  const s = loadCheckpoint();
  if (!s) return false;
  // land in the right chapter FIRST: setChapter rebuilds the world, and
  // anything placed before it would be placed in the outgoing one
  if (s.ch !== CH_KEY) setChapter(s.ch);
  enterWorld(() => {
    /* `done` means the chapter was sealed and there is nothing after it —
       the game is finished. Continue then means "play it again", so the
       stats go back to the chapter's starting values rather than carrying
       the finished run's numbers into a replay. When a next chapter DOES
       exist, finish() has already moved the save to it and left done
       false, and the stats travel with the player as they should.      */
    if (s.done) { Object.assign(stats, STATS_AT_START); }
    else applyState(s);            // stats and inventory, validated
    const at = s.at;
    if (at && ['x', 'y', 'z'].every(k => Number.isFinite(at[k]))) {
      yaw.position.set(at.x, at.y, at.z);
      yaw.rotation.y = Number.isFinite(at.ry) ? at.ry : SPAWN.rot;
    } else {
      // a v1 save, or one written at a chapter boundary: start of the chapter
      yaw.position.copy(SPAWN.pos);
      yaw.rotation.y = SPAWN.rot;
    }
    pitch.rotation.x = 0; camera.rotation.z = 0;
    syncBars();
    // she is never restored mid-appearance; she re-arms from hidden, which
    // is also the right staging — you come back to the deck, not to the
    // middle of a jump scare
    gPhase = 'hidden'; gTimer = 0; gGlide = null;
    reveal = 0; ghostOpacity(0);
    ghost.position.copy(GHOST_HOME);
  }, {
    /* A save written at a chapter boundary carries no position: the player
       finished the last chapter and closed the tab before seeing this one.
       They have not watched its opening yet, so they get it. A save with a
       position is a run in progress, and gets dropped straight back in. */
    intro: !(s.at && ['x', 'y', 'z'].every(k => Number.isFinite(s.at[k])))
  });
  return true;
}

/* New game: always reachable, never the accident. The confirm exists
   because losing a run to a mistap is exactly the kind of quiet loss this
   project does not accept.

   `wipe` is false on the one path that is NOT the player starting over: a
   ?ch= link, where the save was merely hidden rather than absent. Clearing
   it there would delete a real run just because someone opened a deep
   link — the confirm never appeared and no one asked for that.          */
function newGame(wipe = true) {
  if (wipe) clearCheckpoint();
  Object.assign(stats, STATS_AT_START);
  /* v14.6: and an EMPTY bag. The inventory was never reset here — it only
     ever started as the page's default — so a new game begun after playing
     into episode 2 in the same sitting kept the torch. Chad: "The player
     should start episode 1 with no items at all." */
  invClearAll();
  if (wipe && CH_KEY !== BOOT_CH) setChapter(BOOT_CH);
  ward.ep = episodeOf(CH_KEY); ward.charge = ward.enter = WARD_FULL;   // v14.7: a new game, a full amulet
  syncBars();
  enterWorld(() => {
    yaw.position.copy(SPAWN.pos);
    yaw.rotation.y = SPAWN.rot;
  }, { intro: true });     // a ?ch= deep link opens on its film too
}

$('startBtn').onclick = () => {
  if (CH_ASKED) return newGame(false);   // a deep link plays what it names
  if (!resumeRun()) newGame();
};
$('newGameBtn').onclick = () => showNewConfirm(true);
$('newYes').onclick = () => { showNewConfirm(false); newGame(); };
$('newNo').onclick = () => showNewConfirm(false);
function showNewConfirm(on) { ui.newConfirm?.classList.toggle('hide', !on); }

/* The title screen reads the save and says so: Continue when there is a run
   waiting, Start game when there is not. Called at boot and again whenever
   the save changes underneath it. */
function paintTitle() {
  const s = loadCheckpoint();
  const btn = $('startBtn');
  if (btn) btn.textContent = s ? T('title.continue') : T('title.start');
  $('newGameBtn')?.classList.toggle('hide', !s);
  const note = $('resumeNote');
  if (note) {
    note.classList.toggle('hide', !s);
    if (s) {
      const ch = window.__CHAPTERS__[s.ch];
      note.textContent = T('title.resumeNote').replace('{chapter}', ch ? chapterLabel(s.ch) : '');   // v6.0: "Episode 1 · Chapter 3"
    }
  }
}
paintTitle();
{ const s = loadCheckpoint(); if (s && s.ch) markReached(s.ch); }   // a run already past chapter 1 opens what it reached (v5.12)
/* v14.14: THE BAG IS THE SAVE'S FROM THE FIRST FRAME. Chad: "when the
   player equips it and switch to episode 2 chapter 3 immediately, the
   amulet is gone from inventory." Measured: the bag and the amulet's charge
   were only ever put back by Continue (applyState). After a reload — which
   a phone browser does to a background tab on its own — the title started
   on an EMPTY bag, and the other way out of the title, the chapter
   selector, kept it empty: a player who picked a chapter there lost
   everything he carried. So the save's bag and charge are loaded at boot.
   Continue still applies the whole run on top (the same values), New game
   still empties it (invClearAll), and the selector now keeps what the
   player owns, as it always did within one sitting. */
{ const s = loadCheckpoint(); if (s) { invLoad(s.inv); wardLoad(s.ward); torchAvailSync(); weaponAvailSync(); syncBars(); } }
/* v14.15: at the title, the chapter Continue would open starts downloading
   (DOWNLOAD AHEAD); a new player's chapter 1 is preloaded by the page */
{ const s = loadCheckpoint(); if (s && s.ch && s.ch !== CH_KEY) setTimeout(() => prefetchAhead(s.ch), 1500); }

/* ------------------------------------------------------ the title backdrop
   Pure decoration, so every step is written to fail quietly: no source until
   we have a real URL (the embedded build has none and simply goes without),
   no fade-in until it is genuinely playing, and no complaint if autoplay is
   refused. It also stops the moment the title screen goes away — a hidden
   video still decodes frames, and this game already asks enough of a phone.

   `prefers-reduced-motion` gets one frame and a pause: the still image, not
   the loop.                                                              */
(() => {
  const vid = $('titleVid');
  // two encodes of the same clip; let the browser choose. VP9 first because
  // it is the smaller file and what Chrome, Firefox and Edge take; H.264 is
  // the Safari and iOS fallback.
  const sources = [['titlevidwebm', 'video/webm'], ['titlevid', 'video/mp4']]
    .map(([k, type]) => [assetUrl(k), type]).filter(([u]) => u);
  if (!vid || !sources.length) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  vid.addEventListener('playing', () => vid.classList.add('on'), { once: true });
  // reduced motion: let one frame land, then hold it
  if (still) vid.addEventListener('timeupdate', () => {
    if (vid.currentTime > 0) { vid.classList.add('on'); vid.pause(); }
  }, { once: true });

  vid.preload = 'auto';
  for (const [u, type] of sources) {
    const s = document.createElement('source');
    s.src = u; s.type = type;
    vid.appendChild(s);
  }
  vid.load();
  const go = () => { const q = vid.play(); if (q) q.catch(() => {}); };
  go();
  // some browsers refuse autoplay until a gesture; take the first one
  addEventListener('pointerdown', go, { once: true, passive: true });

  titleVideo = { el: vid, play: go };
})();
$('stepBack').onclick = () => dismissDecision();
$('retryBtn').onclick = () => restart();
$('nextBtn').onclick = () => { ui.result.classList.add('hide'); finish(); };
/* Continue on the sealed card. With a next chapter it ADVANCES — which is
   the same move finish() already recorded in the save, so the button and
   the save can never disagree. With nothing after this chapter it restarts,
   which is what "play again" means at the end of the game.

   Live since v4.0, and the busiest path in the game as of v4.1: chapter 1
   hands over to chapter 2 and chapter 2 to chapter 3 through here, each with
   its own opening film. (It was inert when written — ch1 was the only real
   chapter and nextChapterKey() returned null.) */
/* Advancing into a chapter: what Continue on a sealed card has done since
   v3.6, and since v6.3 also what the episode card's Continue does. */
function advanceTo(nxt) {
  setChapter(nxt);
  for (const el of [ui.complete, ui.result, ui.over, ui.episode]) el?.classList.add('hide');
  /* restart() puts the run's state back — the props, the ghost, the hands,
     the numbers — and lands in play. enterWorld() takes it straight back
     out again in the same tick, so no frame of play is ever drawn, and the
     new chapter arrives the way a chapter should: its opening film, its
     title, then the night. Reusing restart() rather than reimplementing
     its reset is deliberate; it is the one piece of code that knows
     everything a fresh run has to put back.                             */
  restart();
  enterWorld(() => {
    yaw.position.copy(SPAWN.pos);
    yaw.rotation.y = SPAWN.rot;
    pitch.rotation.x = 0; camera.rotation.z = 0;
  }, { intro: true });
}
$('againBtn').onclick = () => {
  /* v6.3: the LAST chapter of a case closes the case file first — the
     episode card, whose own button then advances or returns to the title */
  if (isLastOfEpisode(CH_KEY) && showEpisodeCard(episodeOf(CH_KEY))) return;
  const nxt = nextChapterKey();
  if (!nxt) return restart();
  advanceTo(nxt);
};
$('epBtn')?.addEventListener('click', () => {
  if ($('epBtn').disabled) return;
  for (const t of epTimers) clearTimeout(t);
  epTimers = [];
  const nxt = nextChapterKey();
  if (nxt) return advanceTo(nxt);        // the next case's first chapter, the way any chapter arrives
  /* nothing follows yet: the run is over. A fresh last chapter stands ready
     under the title — Continue plays it again, as it always did after the
     final chapter — and the save says the run is done, as finish() said. */
  ui.episode.classList.add('hide');
  restart();
  returnToTitle();
  saveCheckpoint({ at: null, done: true });
});

/* The title screen speaks for the whole series, not for whichever chapter is
   loaded — so it has its own line. CH.brief stays as the chapter’s own
   framing, for wherever that ends up being used. */
/* The paragraph under the logo describes the GAME, not this chapter, so it
   is an engine string. (The chapter's own `brief` is its one-line summary,
   kept for the chapter picker and for anyone reading the chapter file.)   */
$('brief').innerHTML = T('title.intro');

/* Everything on screen that comes from the CHAPTER rather than the game.
   Re-run by setChapter(), so advancing or resuming into another chapter
   repaints its card, its question and its four choices — the buttons are
   rebuilt rather than relabelled, because a chapter may not have four. */
function applyChapterText() {
  $('qtext').innerHTML = CH.prompt;
  // the black chapter card carries whatever chapter is registered
  if ($('chapEp')) $('chapEp').textContent = T(`ep${episodeOf(CH_KEY)}.label`, '');   // v6.0
  if ($('chapLabel')) $('chapLabel').innerHTML = CH.cardLabel;
  if ($('chapTitle')) $('chapTitle').innerHTML = CH.cardTitle;
  const cWrap = $('choices');
  cWrap.textContent = '';
  CH.choices.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.innerHTML = `<span class="key">${c.k}</span><span>${c.text}</span>`;
    b.onclick = () => pick(i);
    cWrap.appendChild(b);
  });
}
applyChapterText();

function syncBars() {
  const cl = v => Math.max(0, Math.min(100, v));
  ui.bSan.style.width = cl(stats.sanity) + '%';
  ui.bAwa.style.width = cl(stats.awareness) + '%';
  ui.bWis.style.width = cl(stats.wisdom) + '%';
  ui.vSan.textContent = Math.round(cl(stats.sanity));
  ui.vAwa.textContent = Math.round(cl(stats.awareness));
  ui.vWis.textContent = Math.round(cl(stats.wisdom));
  wardPaint();
}
function wardPaint() {
  const cl = v => Math.max(0, Math.min(100, v));
  /* v14.7: THE AMULET'S YELLOW. Laid OVER the right end of the red rather
     than added after it, so the bar is always exactly as long as sanity —
     Chad: "the total length of the sanity bar should not be changed at all
     ... you cut out part of the red bar to replace it with this yellow".
     A hit the amulet takes leaves the length where it was and narrows the
     yellow, which is the truth: sanity did not move. `+N` beside the number
     says what it has left. None of it exists while no ward is worn or its
     charge is spent, so the bar is v14.6's for everyone else. */
  const bArm = ui.bArm || (ui.bArm = $('bArm'));
  const w = wardLeft(), s = cl(stats.sanity), wv = Math.min(w, s);
  if (bArm) {
    const on = wv > 0.01;
    bArm.classList.toggle('on', on);
    if (on) { bArm.style.left = (s - wv) + '%'; bArm.style.width = wv + '%'; }
  }
  const lbl = w >= 0.5 ? '+' + Math.round(w) : null;
  if (lbl) { if (ui.vSan.dataset.arm !== lbl) ui.vSan.dataset.arm = lbl; }
  else if (ui.vSan.dataset.arm) delete ui.vSan.dataset.arm;
}
syncBars();

function startDecision() {
  state = 'decide';
  chosen = null;
  snd('paper', 0.7);
  /* v5.30: a chapter may name a line for the moment the decision OPENS —
     the fourteenth leak. Chapter 4's 'Start from the beginning' was its
     `close` line, so it fired on walking near the chair; Chad: "that line
     should only be played when interacting with the chair". speak() rather
     than say() because it waits its turn instead of dropping when the near
     line is still going, and because it is not once-per-run: he says it
     every time he sits down to think. Chapter 1 declares nothing here. */
  if (CH.lines && CH.lines.act) speak(CH.lines.act, { wait: 8000 });
  // everything a cutscene or the card after it could need, decoding now so
  // the scene's first sting is a sample rather than the synth fallback
  packWarm(['clang', 'whoosh', 'boom', 'scream', 'kick', 'chant', 'chime',
            'paper', 'endbad', 'endgood', 'uicard', 'uiconfirm', 'uirank',
            'vA', 'vB', 'vC', 'vD', 'step1', 'step2', 'step3', 'step4',
            // the v3.7 cutscene voice: a sting that is still decoding when
            // its moment arrives simply does not happen, and these have no
            // synth to cover for them
            'swoosh', 'strings', 'dread', 'breath', 'sobbing', 'gscream',
            'firedie', 'ashburst', 'paperstorm', 'bowl', 'gwail', 'gsigh',
            'vgasp', 'vscoff', 'vpant', 'vrelief', 'vchantline', 'type',
            // and chapter 2's
            'clock', 'fan', 'doorcreak', 'hallsteps', 'bedcreak', 'heart',
            'v2call', 'v2ma']);
  /* and THIS chapter's, whichever chapter it is: every cue in all four of
     its scenes, plus the four lines spoken under the outcome cards. Read
     off the scenes rather than listed, for the reason in warmIntroSet. */
  for (const sc of (CH.scenes || [])) warmCues(cuesOf(sc));
  packWarm((CH.choices || []).map(c => (CH.sayPrefix || 'v') + c.k));
  /* and the NEXT chapter's sounds start downloading here, which is the one
     moment that is both late enough and early enough. Late, because a player
     who stops before ever opening the decision has still not paid for a
     chapter they did not reach — that is the whole point of splitting the
     pack. Early, because what comes after this is a cutscene, a teaching
     card and a rank screen, so a megabyte has minutes to arrive before the
     next chapter's opening film asks for its first line.               */
  packLoad(nextChapterKey());
  ui.prompt.classList.add('hide');
  ui.interact.classList.add('hide');
  hint.classList.add('hide');
  edgeTurn = 0;
  ui.decide.classList.remove('hide');
  decideOpenedAt = performance.now();
  decisionClockStart();                  // v7.0: a bar, only when the chapter armed one
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
  decisionClockStop();                   // v7.0
  state = 'play';
  const el = $('hintTxt');
  if (el) {
    el.textContent = actLine();
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
    let i = 0, last = performance.now(), shown = 0;
    const mySeq = cardSeq;
    const step = now => {
      if (mySeq !== cardSeq) return res();           // card is gone; stop quietly
      if (cardHurry) i = full.length;
      i += ((now - last) / 1000) * cps; last = now;
      const n = Math.min(full.length, Math.floor(i));
      /* A tick as it writes. Every THIRD character, not every one — at 32
         characters a second one-per-letter is a machine gun, and the ear
         reads a group of three as the same "being typed" either way. The
         rate is jittered so it never falls into a loop, and a run of
         spaces stays silent, which is what puts the rhythm in it.      */
      // a tap fast-forwards the whole line at once; ticking for every skipped
      // character would fire dozens of samples in one frame
      if (n > shown && n - shown < 8) {
        for (let c = shown; c < n; c++) {
          if (c % 3 === 0 && /\S/.test(full[c] || '')) {
            snd('type', 0.16, 0.94 + Math.random() * 0.16);
          }
        }
      }
      shown = n;
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
    /* v14.7: the amulet's yellow on the sanity row, moving with the red */
    const arm = row.querySelector('.track i.fArm');
    const wFrom = +row.dataset.wfrom || 0, wTo = +row.dataset.wto || 0;
    const t0 = performance.now(), mySeq = cardSeq;
    const step = now => {
      if (mySeq !== cardSeq) return res();
      const k = cardHurry ? 1 : Math.min(1, (now - t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      const v = from + (to - from) * e;
      bar.style.width = Math.max(0, Math.min(100, v)) + '%';
      if (arm) {
        const vv = Math.max(0, Math.min(100, v)), w = Math.min(vv, wFrom + (wTo - wFrom) * e);
        arm.style.left = (vv - w) + '%'; arm.style.width = w + '%';
      }
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
function statRowsHTML(before, d, w) {
  const cl = v => Math.max(0, Math.min(100, v));
  /* v10.3: a delta of ZERO still gets its row (Chad, on episode 2's first
     option: "somehow there is no sanity bar at the outcomes part"). No
     episode-1 choice carries a zero, so their cards are unchanged. */
  return STAT_ORDER.filter(k => k in d).map(k => {
    const r = STAT_ROW[k], from = cl(before[k]), to = cl(before[k] + d[k]);
    /* v14.7: `w` is the amulet on the sanity row — {from, to}, what it held
       before the choice and after — drawn as the HUD draws it: a yellow
       stretch laid over the right end of the red. Its own chip says what it
       took, so "−4" beside "Amulet −8" reads as the cost of a −12 choice.
       Absent (no ward worn, or spent) the row is exactly v14.6's. */
    const wr = k === 'sanity' && w ? w : null;
    const dv = Math.round(d[k] * 100) / 100;
    const took = wr ? Math.round(wr.from - wr.to) : 0;
    const wAttr = wr ? ` data-wfrom="${wr.from.toFixed(2)}" data-wto="${wr.to.toFixed(2)}"` : '';
    const wLeft = wr ? Math.min(wr.from, from) : 0;
    return `<div class="srow ${r.cls}" data-from="${from.toFixed(0)}" data-to="${to.toFixed(0)}"${wAttr}>`
      + `<svg class="sic" aria-hidden="true"><use href="#${r.icon}"/></svg>`
      + `<span class="n">${(T('hud.' + k) || k).toUpperCase()}`
      + (took > 0 ? `<span class="wchip">${T('card.ward', 'Amulet −{n}').replace('{n}', took)}</span>` : '')
      + `</span>`
      + `<span class="chip ${dv >= 0 ? 'up' : 'dn'}">${dv >= 0 ? '+' : ''}${Math.round(dv)}</span>`
      + `<span class="v">${from.toFixed(0)}</span>`
      + `<span class="track"><i class="${r.fill}" style="width:${from.toFixed(0)}%"></i>`
      + (wr ? `<i class="fArm" style="left:${(from - wLeft).toFixed(2)}%;width:${wLeft.toFixed(2)}%"></i>` : '')
      + `</span>`
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
  decisionClockStop();                   // v7.0
  runChoices[CH_KEY] = c.k;              // v7.0: the letter, saved with the run (a later chapter may read it)
  // The scene plays first; the numbers and the teaching wait until it is
  // done. The card then rises over whatever the scene left on screen.
  playCine(i, () => {
    const before = { ...stats };           // the bars animate FROM these
    /* v14.7: a choice that costs sanity pays the amulet first, and the card
       shows it: the sanity row moves by what sanity actually lost, and its
       yellow narrows by what the amulet took. `eff` is the delta that really
       happened; with no ward worn it IS c.d, and the card is v14.6's. */
    const wBefore = wardLeft();
    const eff = { ...c.d };
    if (eff.sanity < 0) eff.sanity = -wardSoak(-eff.sanity, false);
    for (const k in eff) stats[k] += eff[k];
    const wCard = wBefore > 0 ? { from: wBefore, to: wardLeft() } : null;
    /* v7.0: what play did — Sanity and Awareness only, capped, a second
       line under the rows. Chapters 1–5 never call kit.conduct, so cd is
       null there and nothing on their cards moves. */
    const cd = conductTake();
    if (cd) { stats.sanity += cd.s < 0 ? -wardSoak(-cd.s, false) : cd.s; stats.awareness += cd.a; }   // v14.7: a banked cost too
    syncBars();                            // the hidden HUD stays truthful
    ui.say.innerHTML = c.say;
    ui.teach.textContent = '';             // it will write itself
    ui.teach.closest('.teachbox').classList.add('veiled');
    ui.deltas.innerHTML = statRowsHTML(before, eff, wCard);
    paintConduct(cd);                      // v7.0
    ui.hud.classList.add('hide');       // the card's bars ARE the bars now
    ui.result.classList.remove('hide');
    state = 'result';
    // the card rises: its swish, the ending's music bed, and the James line
    snd('uicard', 0.6);
    playBed(c.verdict === 'good' || c.verdict === 'best' ? 'endgood' : 'endbad', 0.5);
    duckMusic(15);
    // vA..vD for chapter 1, v2A..v2D for chapter 2: the prefix is the
    // chapter's, because the words under its own card are
    const speech = speak((CH.sayPrefix || 'v') + c.k, { wait: 9000 });
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
  if (!ghostReady || GH.off) return 0;
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
function sanityTick(n, cls) {
  const host = $('ticks');
  if (!host) return;
  const el = document.createElement('span');
  el.textContent = '−' + n;               // a real minus sign, not a hyphen
  if (cls) el.className = cls;            // v14.7: 'w' — the amulet's share, in its yellow
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

let hauntShown = false, hauntKind = 'ghost';
function showHaunt(on, kind = 'ghost') {
  if (on === hauntShown && kind === hauntKind) return;
  hauntShown = on; hauntKind = kind;
  /* v7.0: a chapter's unseen presence drains through the same bar; its
     banner must not say "Ghost spotted" about a thing nobody saw */
  const alarm = ui.haunt.querySelector('[data-t="hud.ghostAlarm"]');
  if (alarm) alarm.textContent = kind === 'presence' ? chWord('presence', 'hud.presenceAlarm') : T('hud.ghostAlarm');
  /* v14.4: AND THE SECOND SPAN IS THE CHAPTER'S TOO. `hud.ghostWarning` —
     "Sanity level is dropping until you take action." — was the one line on
     the banner no chapter could replace, so a chapter whose beat is to WAIT
     (e2c4's stag, where the objective says to stand fast) had the HUD
     ordering an action directly under an objective forbidding one: the v8.7
     lie in its third direction. Every chapter that declares nothing keeps
     the engine's sentence exactly, so episode 1 is untouched. */
  const warn = ui.haunt.querySelector('[data-t="hud.ghostWarning"]');
  if (warn) warn.textContent = kind === 'presence' ? chWord('presenceWarn', 'hud.ghostWarning') : T('hud.ghostWarning');
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
  sfx(0.30, 'vfaint');                                // v6.6: "No... my head..." — his, and nothing cuts it here
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
  /* Fainting must not become a rewind. The save is rewritten to the START of
     this chapter — same chapter, fresh stats, no position — so closing the
     tab mid-faint and pressing Continue restarts the chapter, exactly like
     Retry does. Leaving the last autosave in place would instead drop the
     player back three seconds before it with two sanity left: both a cheat
     and a trap.                                                          */
  saveCheckpoint({ at: null, stats: STATS_AT_START,
                   ward: { charge: ward.enter, ep: ward.ep, enter: ward.enter } });   // v14.7: and the amulet's charge to what it held when the chapter began
  // the line goes down WITH him — cut anything mid-sentence first
  if (narSrc) { try { narSrc.stop(); } catch {} narSrc = null; }
  /* v6.6: his faint line is the faint SCENE's cue (scFaint), not a speak()
     here — playCineFn stops every play-time narration on its first line
     (v4.91), so a line started here was cut a millisecond later and the
     faint was silent (Chad heard nothing). */
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
  const r = RANK_OF(score);
  ui.rank.textContent = r;
  ui.rank.classList.add('glow');           // the grade breathes light
  ui.core.innerHTML = CH.core;
  ui.complete.classList.remove('hide');
  ui.hud.classList.add('hide');
  state = 'complete';
  /* The chapter is sealed. The save moves to the NEXT chapter if there is
     one, so Continue picks up there rather than replaying the one just
     finished; with no next chapter it records this one as done, and
     Continue starts it over — which is what "play again" means when there
     is nothing after it. Position is cleared either way: you resume at the
     start of a chapter, never at the spot where the last one ended.     */
  const nxt = nextChapterKey();
  /* v14.7: the next chapter is entered with what the amulet holds NOW, so its
     `enter` is today's charge; a new episode refills it on the way in */
  const wNext = { charge: ward.charge, ep: ward.ep, enter: ward.charge };
  saveCheckpoint(nxt ? { at: null, done: false, ch: nxt, ward: wNext }
                     : { at: null, done: true, ward: wNext });
  if (nxt) markReached(nxt);       // finished this one: the next is open in the selector (v5.12)
  markSealed(CH_KEY, score, r);    // and its result is on record: the rank on its stop in the selector (v6.2), the tally at the episode's end (v6.3)
  if (isLastOfEpisode(CH_KEY)) packWarm(['epfanfare', 'uiclick', 'uiconfirm']);   // the episode card's sounds decode under this card (v6.3)
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
                    ui.prompt, ui.interact, ui.chapter, hint, ui.episode]) {
    el?.classList.add('hide');
  }
  ui.hud.classList.remove('hide');
  letterboxOff();                          // v15
  document.body.classList.remove('cine');
  // drop the dissolve before forcing the value, or a restart taken mid-fade
  // keeps transitioning and the new run starts under a clearing black
  cineFadeEl.classList.remove('clearing');
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
  ward.charge = ward.enter;        // v14.7: and the amulet holds what it held when this chapter began
  wardAcc = 0; wardTickAt = 0;
  syncBars();
  showHaunt(false);
  drainAcc = 0; lastTickAt = 0;
  chosen = null;
  kitReset();                      // v7.0: objective, pose, presence, torch, clock — all back to the chapter's declaration

  // the soundscape, back to a fresh run: the bed and any half-spoken line
  // stop, and every once-per-run narration trigger re-arms
  stopBed();
  stopCineVoices();                // and anything the last scene left ringing
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
  vmKey.intensity = VM_REST.key;
  layoutHands();
  redoShadows();

  state = 'play';
  setHint();
  warmPlaySet();
  zavPrefetch();
  queueVoice();                    // a fresh run gets the line again
  hint.classList.remove('hide');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => hint.classList.add('hide'), 7000);
  tryLock();                       // the click that got us here is the gesture
  autosave(true);                  // the fresh run is recorded at once
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

  // the shadow maps are static; redraw them only when asked — v15: on a frame
  // that is actually drawn (COVERED FRAMES, below), or a redraw asked for
  // under the card would be spent on a frame that never reaches the GPU

  // look — keep this frame's delta, the viewmodel needs it for sway.
  // Only the player's own state consumes it: during a cutscene the timeline
  // owns the camera, and a locked pointer must not be able to fight it.
  if (edgeTurn) lookX += Math.sign(edgeTurn) * edgeTurn * edgeTurn * 2.6 * dt;
  const dLookX = lookX, dLookY = lookY;
  if (state === 'play') {
    /* v12.2: a narrowed lens turns the same swipe into a far bigger angle on
       screen, so the look is scaled by the zoom ratio — without this, aiming
       down a 30-degree lens is unusable. And the recoil spring rides on top
       as a DELTA, so the player's own look still owns the base. */
    const zk = camera.fov / CAM_FOV;
    /* the spring's delta is clamped at HALF A SECOND, not a tenth: a tenth
       makes the recovery frame-rate dependent (measured on a one-frame-a-
       second box, the kick was still 1.75 deg a second after the shot), and
       half a second is only there so a backgrounded tab does not come back
       with the whole spring discharged in one step. */
    /* `t` is clock.getElapsed() — SECONDS, not milliseconds. Dividing by a
       thousand fed the spring a delta a thousand times too small, so
       exp(-dt/recover) was ~1 every frame and the kick came home over about
       half a minute instead of a fifth of a second: every round walked the
       aim up the range permanently, which is the exact defect v12.2 set out
       to fix. It was measured as "decaying" (1.75 deg to 1.18 over ten
       frames) and called working — a thing that MOVES is not a thing that
       RECOVERS. The half-second clamp is only so a backgrounded tab does not
       come back with the whole spring discharged in one step. */
    const rec = weaponRecoilStep(lastWallLook ? Math.min(0.5, t - lastWallLook) : 0.016);
    lastWallLook = t;
    yaw.rotation.y += lookX * zk + (rec ? rec.dy : 0);
    pitch.rotation.x = Math.max(pitchLo, Math.min(pitchHi,
      pitch.rotation.x + lookY * zk + (rec ? rec.dp : 0)));   // v7.0: a pose narrows the neck
  } else {
    /* v12.3: SETTLE BEFORE FORGETTING. `weaponRecoilReset` zeroes the spring
       AND its `recPrev`, so whatever offset the last frame had already
       pushed into `pitch`/`yaw` was simply abandoned there. Fire, let the
       bell ring, and the decision card opens on a view sitting up to the
       full kick off the aim — and it stays there into the cutscene's first
       frames and into the next run, because nothing ever repays it. Hand
       the offset back first; then forget. */
    if (recPrevP || recPrevY) {
      yaw.rotation.y -= recPrevY;
      pitch.rotation.x = Math.max(pitchLo, Math.min(pitchHi, pitch.rotation.x - recPrevP));
    }
    /* v14.4: but a CUTSCENE is using it — `weaponFrame` steps the same
       spring for the gun there, so zeroing it here killed every kick a
       scene asked for. The camera hand-back above still runs (a scene
       drives the lens from its own tracks, so it costs nothing), and the
       spring is left alone until the scene is over. */
    if (state !== 'cine') weaponRecoilReset();
    lastWallLook = 0;
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
    if (kitPose === 'lying' || kitRooted) { f = 0; s = 0; }        // v7.0: a man on his back does not walk; v11.1: nor a rooted one
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
    yaw.position.y = eyeY + Math.sin(bob) * 0.028 * Math.min(sp / 2.5, 1);   // v7.0: eyeY is 1.62 unless a pose moved it

    // Distance to the burner, which is still what raises the "something is
    // burning ahead" line. Nothing opens the decision on its own any more:
    // the heap is the only way in, so looking at the note is always a choice
    // the player made rather than something that happened to them.
    /* v12.2: the APPROACH prompt asks the CHAPTER how far its decision object
       is, not the engine's own OFFER_POS. Every chapter defines pile.dist()
       and episode 1's returns exactly this number, so nothing there moves —
       but a chapter whose decision object stands near the player all along
       (episode 2 chapter 4's target area, 1.7 m in front of the firing point)
       can now say "not yet", which gating pileInView alone could not do.
       Photographed on a phone: "the target area" lay across the FIRE button
       through an entire live-fire serial. */
    const d = (stage && stage.pile && typeof stage.pile.dist === 'function')
      ? stage.pile.dist()
      : Math.hypot(yaw.position.x - OFFER_POS.x, yaw.position.z - OFFER_POS.z);

    // the heap: one prompt at a time, and only when it is actually on screen —
    // a key prompt for something behind you is noise
    dwellHotspots();                   // v11.0: a torch spot counts when LOOKED at
    /* v12.5: THE APPROACH PROMPT OBEYS THE COMMENT ABOVE IT. "only when it is
       actually on screen" has been the stated rule since v2.1 and the code
       never tested it — the label showed on DISTANCE alone, so it named the
       decision object with your back to it, and in every chapter whose
       object is where the player already is it simply never went away:
       "the bed" through the small hours of episode 2 chapter 1, "the encik"
       across breakfast in chapter 2, "the ground at your feet" through the
       whole torch sweep of chapter 3 (Chad, from players: "it seems to be
       some kind of recurring bug ... it may affect the entire game").
       `inView()` is the test, and it is the chapter's own: episode 1's five
       ask whether the thing projects onto the screen, and episode 2's four
       fold in whether it is live at all (the bed with nothing to offer, the
       encik before the third answer, the ground before the pressure). One
       call, shared with `reach` below, which used to compute it and throw
       it away whenever the player was out of arm's reach. */
    const onScreen = stage.pile.inView();
    const reach = stage.pile.dist() < stage.pile.radius && onScreen;
    // v7.0: and the nearest hotspot, when the pile is not in reach — the
    // badge names it; chapters 1–5 declare none, so `spot` is always null there
    const spot = reach ? null : nearestHotspot();
    setInteractBadge(reach ? null : spot);
    if (reach || spot) {
      ui.interact.classList.remove('hide');
      ui.prompt.classList.add('hide');
    } else {
      ui.interact.classList.add('hide');
      /* v13.0: and only when the chapter HAS a word for it. An empty
         `words.approach` is the sheet's own "remove that text" (EDITING-TEXT),
         and an empty floating box is not a removal. Episode 1's five and the
         other episode-2 chapters all declare one, so nothing there moves. */
      if (d < 6.2 && onScreen && chWord('approach', 'world.burning'))
        ui.prompt.classList.remove('hide');
      else ui.prompt.classList.add('hide');
    }
    /* v7.2: an open EVENT owns the middle of the screen — the badge and the
       approach prompt under its panel were half-hidden noise (The Worst
       Bed's standby bed over "E at the bed"). Chapters 1–5 never run one. */
    if (ev) { ui.interact.classList.add('hide'); ui.prompt.classList.add('hide'); }

    // she is here, and standing still in front of her costs you
    const gDrain = ghostDrainRate(), pDrain = presenceDrainRate();   // v7.0: hers, or the chapter's unseen thing
    const drain = gDrain + pDrain;
    // v7.2: and the banner steps aside for an event too (the drain and the bar's red go on)
    showHaunt(drain > 0 && !ev, gDrain > 0 ? 'ghost' : 'presence');
    if (ev && drain > 0) ui.bSan.classList.add('drain');
    if (drain > 0) {
      const lost = Math.min(stats.sanity, wardSoak(drain * dt, false));   // v14.7: the amulet first
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
  /* v11.1: the HURT frame, painted after the dread so it wins the frame */
  if (kitHurt && (state === 'play' || state === 'decide')) {
    const now = performance.now();
    const dtw = kitHurt.last ? Math.min(0.5, (now - kitHurt.last) / 1000) : 0;
    kitHurt.last = now;
    /* v11.4 (Chad: "sanity should stop dropping once the menu options open
       up on screen"): the bleed runs in PLAY only. The frame stays up under
       the decision so the wound is still on screen while he chooses, but a
       player reading four options is not being charged for reading them. */
    if (kitHurt.perSec > 0 && dtw > 0 && state === 'play') {
      const had = wardLeft();
      const lost = Math.min(Math.max(0, stats.sanity), wardSoak(kitHurt.perSec * dtw, false));   // v14.7: the amulet first
      if (lost > 0) { stats.sanity -= lost; noteDrain(lost); syncBars(); if (stats.sanity <= 0) lose(); }
      else if (wardLeft() !== had) syncBars();          // all of it went to the amulet: its yellow still moved
    }
    ui.panic.style.opacity = '1';
    ui.panic.classList.add('critical'); ui.panic.classList.add('hurt');   // v11.3: `hurt` thins the frame to the edges (shell.html)
  } else if (kitHurt) kitHurt.last = 0;

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
  /* v8.6: A LIGHT AT ZERO STILL COSTS EVERY PIXEL. three.js compiles the
     shader for the lights it COLLECTS, and it collects a light whether or
     not its intensity is zero — so a dark lamp is still evaluated for every
     fragment on screen. Episode 2's bunk carries eleven point lights and
     five of them sit at zero at any moment (the block, the balcony, the
     night wash, the notice board, the shower).
     WITH HYSTERESIS, because the count of lights is part of the shader's
     identity: flipping one every few frames would recompile the program and
     stutter. So a light must read zero for DARK_HOLD consecutive frames
     before it is hidden, and it comes back the instant it is raised. The
     bunk's tube flicker multiplies its intensity down but never holds at
     zero, so it never crosses the threshold.
     Visually this can change nothing: a light contributing no light is the
     definition of one that need not be collected. */
  darkLights();
  stage.updateFire(t);
  kitFrame(dt, t, dLookX, dLookY);   // v7.0: the play kit's own frame — events, timer, pose, daylight, clock
  autosave();          // throttled, and only ever during play — see autosave()

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
    // parked clouds read as a skybox; this is about a degree a minute
    if (skyClouds > 0.01) cloudGroup.rotation.y += sdt * 0.0028;
    stage.updateSlow(sdt, t);     // the chapter's own drifting particles
  }

  // hands: driven by exactly the same movement the camera uses — unless a
  // cutscene is directing them itself
  if (state === 'cine') cineHands(dt, t);
  else updateViewmodel(dt, t, playerSpeed, strafeInput, dLookX, dLookY);

  if ((shadowSyncTick = (shadowSyncTick + 1) % 120) === 0) shadowCasterSync();   // v15: a caster that appears gets its shadow back
  if (state !== 'title' && handsReady) {
    torchPropSync();                       // v11.1: hand or torch, decided on the frame
    weaponPropSync();                      // v12.0: or the weapon, over both
  }
  /* v15: COVERED FRAMES. While an OPAQUE layer covers the whole canvas — the
     title, the chapter card once it is forced solid, a film or a scene held
     on black, the episode card — nothing drawn under it can reach the
     screen, so nothing is drawn. Every piece of logic above has run exactly
     as before (the clocks, the cues, the chapter's frame); only the GPU
     submission is skipped, and the world matrices are still brought up to
     date so anything that reads them sees them as fresh as ever. The warm
     frames under the curtain are FORCED (forceDraw), because drawing under
     the cover is their whole purpose. */
  if (worldCovered()) {
    scene.updateMatrixWorld();
    vmScene.updateMatrixWorld();
    return;
  }
  if (forceDraw > 0) forceDraw--;
  if (shadowDirty > 0) { renderer.shadowMap.needsUpdate = true; shadowDirty--; }
  cullInstances(camera, renderer.shadowMap.needsUpdate || renderer.shadowMap.autoUpdate);   // v15: INSTANCE CULLING
  const band = letterbox && document.body.classList.contains('cine');
  if (band) { renderer.setScissor(0, letterbox.y, letterbox.w, letterbox.h); renderer.setScissorTest(true); }
  try {
  renderer.render(scene, camera);

  // second pass: the viewmodel gets its own fresh depth buffer, so the hands
  // can never poke through a wall however close you stand to one — v15: and
  // only when there is a hand (or a torch, or a rifle) to draw: a pass with
  // nothing visible in it clears a depth buffer and draws nothing
  if (state !== 'title' && handsReady && (!OPT.vmSkip || anyVisibleMesh(handsRoot))) {
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(vmScene, vmCam);
    renderer.autoClear = true;
  } else vmScene.updateMatrixWorld();    // nothing to draw, but whatever reads a hand's matrix reads it fresh
  if (OPT.lightMem) lightMemTick();      // v15: a compile on screen is remembered for the next curtain
  } finally { if (band) renderer.setScissorTest(false); }   // never left on, whatever a pass did
}
/* v15: THE LETTERBOX IS NOT SHADED. Every film and scene draws two opaque
   black bars (11vh each, over the canvas) — 22 % of the frame nobody can
   see, shaded by both passes on every frame of every cutscene. Once the
   bars have finished sliding in (measured from their own rects, never
   computed: 11vh is not 0.11·innerHeight on iOS), both passes are
   scissored to the band between them, two CSS pixels into each bar so no
   edge row is ever left unshaded (the scissor is in buffer pixels, CSS × the
   pixel ratio, rounded, so one CSS pixel can round down to a single row);
   the bars start to leave only after the scissor is gone (letterboxOff runs
   before `cine` is removed). */
let letterbox = null, letterboxTimer = 0;
function letterboxArm(tries = 20) {
  clearTimeout(letterboxTimer); letterbox = null; letterboxTimer = 0;
  if (!OPT.letterbox) return;
  letterboxTimer = setTimeout(() => {
    letterboxTimer = 0;
    if (!document.body.classList.contains('cine')) return;
    const a = $('barTop').getBoundingClientRect(), b = $('barBot').getBoundingClientRect(), c = canvas.getBoundingClientRect();
    /* each bar must actually COVER its edge — flush with it and reaching into
       the frame. A bar still translated away (a stalled frame, mid-slide) is
       also "flush" with nothing and would arm a band of the whole canvas. */
    const inPlace = Math.abs(a.top - c.top) <= 0.5 && Math.abs(b.bottom - c.bottom) <= 0.5
      && a.bottom > c.top + 2 && b.top < c.bottom - 2;
    if (!inPlace) { if (tries > 0) letterboxArm(tries - 1); return; }   // still sliding: look again
    const top = Math.max(0, Math.floor(a.bottom - c.top) - 2), bot = Math.min(c.height, Math.ceil(b.top - c.top) + 2);
    if (bot - top < c.height * 0.5) return;
    letterbox = { y: c.height - bot, h: bot - top, w: c.width };
  }, 650);
}
function letterboxOff() { clearTimeout(letterboxTimer); letterboxTimer = 0; letterbox = null; }
let forceDraw = 0;
function worldCovered() {
  if (!OPT.coverSkip || forceDraw > 0) return false;
  if (!ui.title.classList.contains('hide')) return true;
  if (ui.episode && !ui.episode.classList.contains('hide')) return true;
  if (!ui.chapter.classList.contains('hide') && ui.chapter.style.opacity === '1') return true;
  if (cineFadeEl.style.opacity === '1' && !cineFadeEl.classList.contains('clearing')) return true;
  return false;
}
function anyVisibleMesh(o) {
  if (!o.visible) return false;
  if ((o.isMesh || o.isPoints || o.isLine || o.isSprite) && o.layers.test(vmCam.layers)) return true;
  for (const c of o.children) if (anyVisibleMesh(c)) return true;
  return false;
}
window.__enc = { yaw, pitch, stats, getState: () => state,   // v8.7: pitch, so a probe can aim the lens at the floor
                 kit: KIT, kitDebug, interactNow,          // v7.0: the play kit, by state
                 weaponFire, weaponReload, weaponLog, weaponProp: () => weaponProp, weaponMixer: () => weaponMixer,      // v12.0, probes
                 evPress: (x, y) => evPress(x ?? innerWidth / 2, y ?? innerHeight / 2), evRelease,
                 /* v9.4: drive one drag-and-match drop by id, so a harness or a
                    probe can play the standby bed without synthesising pointer
                    events over a layout it cannot see */
                 evDrop: (tileId, slotId) => {
                   if (!ev || ev.kind !== 'match') return false;
                   const t = document.querySelector('#evSrc .mtile[data-id="' + tileId + '"]');
                   const sl = document.querySelector('#evDst .mslot[data-id="' + (slotId ?? tileId) + '"]');
                   if (!t || !sl) return false;
                   ev.drag = { id: tileId, el: t };
                   const r = sl.getBoundingClientRect();
                   evMatchDrop(r.left + r.width / 2, r.top + r.height / 2);
                   return true;
                 },
                 evState: () => ev && ({ kind: ev.kind, t: +ev.t.toFixed(2), n: ev.n, done: ev.done,
                                         wrong: ev.wrong, beat: ev.beat, band: ev.band.slice(),
                                         combo: ev.combo, best: ev.bestCombo, beats: ev.beats.slice() }),
                 // a getter, not the array: rebuildStage() re-points BLOCKERS
                 // and a captured reference would quietly go stale
                 get blockers() { return BLOCKERS; },
                 /* v5.29: the live stage, for probes. A getter for the same
                    reason blockers is one — rebuildStage() re-points it. */
                 get stage() { return stage; },
                 /* v7.3: the renderer and the scene, for probes only — what a
                    chapter COSTS to draw (renderer.info: calls, triangles,
                    geometries, textures) is a number, and a number nobody can
                    read is a number nobody checks. */
                 get renderer() { return renderer; }, get scene() { return scene; },
                 /* v15: the optimization switches and the passes they gate, for the pixel-identity probe */
                 opt: OPT, cullInstances: (sh) => cullInstances(camera, !!sh), get camera() { return camera; }, shadowCasterSync,
                 worldCovered: () => worldCovered(), forceDraw: (n) => { forceDraw = n | 0; },
                 decide: () => { if (state === 'play') startDecision(); },   // v15: probes open any chapter's decision
                 lightMem: () => lightMemRead(),
                 get shadowDirty() { return shadowDirty; },
                 letterbox: () => letterbox, vmVisible: () => anyVisibleMesh(handsRoot),
                 /* v5.29: which age of Master Zav the panel is showing, and
                    whether his bytes are in. The figure lives in its own
                    renderer's scene, unreachable from the world graph, so a
                    probe cannot measure it the way it measures the tent. */
                 zav: () => ({ key: zav.key, want: zavKey(), model: !!zav.model }),
                 handsRoot, armR, vmCam, vm, updateViewmodel,
                 handWidth: () => HAND_W,
                 updateNotes: (dt, t) => stage.updateNotes(dt, t),
                 get flying() { return stage.flying; },
                 ghost, updateGhost, ghostInView, getReveal: () => reveal,
                 ghostInfo: () => ({ phase: gPhase, variant: gVariant,
                                     appearances: appearCount }),
                 dismissDecision, ghostDrainRate, lose, setMuted, showCredits,
                 snd, say, loopVol, sting, updateAudioFrame, pulseSpike,
                 worldState, applyState,
                 /* v14.7: the amulet's ward and the unlock splash, for probes and
                    harnesses — the charge is a number the HUD only draws */
                 ward: () => ({ charge: +ward.charge.toFixed(3), ep: ward.ep, enter: +ward.enter.toFixed(3),
                                worn: wardItem(), left: +wardLeft().toFixed(3), full: WARD_FULL,
                                cracks: wardFx.cracks, breaks: wardFx.breaks,
                                banner: !!$('wardBreak')?.classList.contains('on') }),
                 unlockState: () => ({ id: unl.id, state }),
                 unlockClose: how => unlockClose(how || 'click'),
                 hotspotTap, kitAward, applyChunk,
                 evGuard: () => ({ guard: evGuard(), cuts: evCuts }),   // v14.13: the minigame guard, for probes
                 saveCheckpoint, loadCheckpoint, clearCheckpoint,
                 invOpen, invClose, invToggle, invAdd, invHas, invRemove,
                 ivZoomOpen, ivZoomClose,             // v14.14: the zoom window, for probes
                 loads: () => ({ pending: loadPending, revealAt, now: performance.now(), workers: meshoptWorkers,
                                 prefetched: [...prefetched], queued: prefetchQ.slice(),
                                 log: loadLog.map(r => ({ key: r.key, kind: r.kind, t0: Math.round(r.t0), t1: Math.round(r.t1),
                                   bytes: r.bytes || 0, syncMs: r.syncMs, cbMs: r.cbMs, late: r.late,
                                   err: r.err || '' })) }),   // v14.15; err v14.16
                 menuOpen, menuClose, menuToggle, openChapters, closeChapters,
                 startChapter, returnToTitle, unlockedKeys, markReached,
                 sealed: sealedResults, markSealed,               // v6.2
                 episodeCard: showEpisodeCard, episodeTally, finish,   // v6.3
                 chapterKey: () => CH_KEY,
                 episode: () => episodeOf(CH_KEY), episodeOf,     // v6.0
                 stings: () => stingLog.slice(),
                 /* v8.0: which of the chapter's SAMPLES have decoded. This was an
                    `audio` key until now and had been dead since the music one below
                    was added — two keys of the same name in one object literal, the
                    later winning, so every probe that asked got the music's shape. */
                 packDecoded: () => Object.keys(packBufs),
                 /* v5.27: the dialogue duck, observable. A gain node that is
                    wired wrong sounds exactly like one that is wired right
                    until someone speaks, so the probe reads the NODE. */
                 duck: () => ({ bg: bgGain ? +bgGain.gain.value.toFixed(3) : null,
                                speaking: liveVoices.size, floor: BG_DUCK }),
                 /* v5.30: every voice source so far, with start and end —
                    two of his overlapping is the bug, and this is the proof */
                 voices: () => voiceLog.map(r => ({ ...r })),
                 inv: () => ({ gear: { ...inv.gear }, bag: [...inv.bag],
                               held: inv.held?.id || null, open: inv.open }),
                 pulse: () => ({ bpm: Math.round(curBpm),
                                 stress: +pulseStress().toFixed(2),
                                 spike: +spikeLevel.toFixed(2),
                                 impulse: +impulse.toFixed(2) }),
                 pack: () => ({
                   loaded: !!packJson,
                   format: packFormat,
                   packs: Object.keys(packLoaded),
                   names: packJson ? Object.keys(packJson).length : 0,
                   decoded: Object.keys(packBufs).length,
                   decodedNames: Object.keys(packBufs),
                   /* v14.16: whose decoded sounds are held — a chapter left must hold none */
                   decodedBy: Object.keys(packBufs).reduce((o, n) => { const k = packOwner[n] || 'shared'; o[k] = (o[k] || 0) + 1; return o; }, {}),
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
                 pick, get chapter() { return CH; }, restart,
                 ready: () => ({ hdb: stage.ready(), hands: handsReady,
                                 ghost: ghostReady, hosted: HOSTED }),
                 voice: () => ({ decoded: !!voiceBuf, playing: !!voiceSrc,
                                 // v5.30: the wait, for the probe
                                 pending: voicePending, waits: voiceWaits, line: CH.voiceLine || null,
                                 inPack: !!(CH.voiceLine && packJson && packJson[CH.voiceLine]),
                                 bufReady: !!(CH.voiceLine && packBufs[CH.voiceLine]),
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
  if (letterbox || letterboxTimer) { letterboxOff(); if (document.body.classList.contains('cine')) letterboxArm(); }   // v15: re-measured, never stale
});
