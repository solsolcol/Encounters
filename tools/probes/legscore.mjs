/* v21.16 · THE FILM'S LEGS, SCORED — episode 3 chapter 2's opening film, shot 3 (Ma's flat): his crossed legs are
   Chad's congregation man (cg_man2hd) on the 'cross' take, posed and baked and CUT by what each vertex is skinned
   to (the hips and the legs kept; the arms, the head and neck, the spine dropped), then set on the floor ahead of
   the lens (e3c2.js, "HIS LEGS ARE A REAL MAN'S"). This poses the same body the same way, offline, and rasterizes it
   through the shot's own lens with a depth buffer, at every placement asked, for each cut rule:

     legs  — how much of the letterbox band his legs fill (front faces winning the depth test)
     back  — pixels where a BACK face wins: the inside of the hollow body, seen through a cut. Zero is the only
             acceptable answer — that is the torn-paper look a cut by height gave (v21.16).

   at both ends of the shot's push-in and both of its pitches, on a phone's crop and a desktop's. No browser.

     node tools/probes/legscore.mjs [z …]                                                              */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

/* GLTFLoader reaches for a DOM to decode textures; nothing here needs a pixel (clipbounds.mjs's way) */
async function load(path) {
  await MeshoptDecoder.ready; await MeshoptEncoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
  const doc = await io.read(path); for (const t of doc.getRoot().listTextures()) t.dispose();
  const buf = Buffer.from(await io.writeBinary(doc));
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  return new Promise((res, rej) => loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', res, rej));
}

/* ── the body, posed exactly as e3c2's film poses it ─────────────────────────────────────────────── */
const KIND_H = 1.69;                      // e3c2 KIND.cg_man2hd.h
const man = await load('assets/cg_man2hd.glb'), take = await load('assets/cg_man2cross.glb');
const clip = take.animations.find(c => c.name === 'cross');
if (!clip) throw new Error('cg_man2cross has no cross take');
const g = man.scene, holder = new THREE.Group(); holder.add(g);
const bones = []; g.traverse(o => { if (o.isBone) bones.push(o); });
const v = new THREE.Vector3();
holder.updateMatrixWorld(true);
let lo = Infinity, hi = -Infinity; for (const b of bones) { b.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y); }
const crown = bones.some(b => /HeadTop_End|head_end/.test(b.name));
g.scale.multiplyScalar(KIND_H / ((hi - lo) / (crown ? 1 : 0.935)));
const mixer = new THREE.AnimationMixer(g), act = mixer.clipAction(clip);
act.play(); act.time = clip.duration * 0.3; act.paused = true; mixer.update(0); holder.updateMatrixWorld(true);
const hp = bones.find(b => /^Hips(_\d+)?$/.test(b.name)).getWorldPosition(new THREE.Vector3());

/* the bones sorted as the chapter sorts them: 1 arms, 2 head and neck, 3 hips and legs, 0 the rest (the spine) */
const ARM = /(Shoulder|Arm|Hand)/i, HEAD = /(Neck|Head)/i, LEGS = /(^Hips(_\d+)?$|UpLeg|Leg|Foot|Toe)/i;
const P = [], WT = [], IDX = [];
g.traverse(o => {
  if (!o.isSkinnedMesh) return;
  const src = o.geometry, pos = src.attributes.position, sI = src.attributes.skinIndex, sW = src.attributes.skinWeight;
  const part = o.skeleton.bones.map(b => ARM.test(b.name) ? 1 : HEAD.test(b.name) ? 2 : LEGS.test(b.name) ? 3 : 0);
  const base = P.length / 3;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i); o.applyBoneTransform(i, v); v.applyMatrix4(o.matrixWorld);
    P.push(-(v.x - hp.x), v.y - hp.y, -(v.z - hp.z));                 // hips at the origin, half-turned to face −z
    const wt = [0, 0, 0, 0]; for (let k = 0; k < 4; k++) wt[part[sI.getComponent(i, k)]] += sW.getComponent(i, k);
    WT.push(wt);
  }
  const ix = src.index ? src.index.array : Array.from({ length: pos.count }, (_, i) => i);
  for (const t of ix) IDX.push(base + t);
});
const n = WT.length;
const RULES = {
  bone:   (i) => WT[i][3] >= 0.6 && WT[i][1] < 0.3 && WT[i][2] < 0.3,        // what ships (v21.16)
  height: (i) => WT[i][1] < 0.3 && P[i * 3 + 1] < 0.06,                       // the first try: arms out, a plane just over the hips
};
const keepOf = {}; let seat = Infinity;
for (const [r, f] of Object.entries(RULES)) { const k = new Uint8Array(n); for (let i = 0; i < n; i++) k[i] = f(i) ? 1 : 0; keepOf[r] = k; }
for (let t = 0; t < IDX.length; t += 3) { const [a, b, c] = [IDX[t], IDX[t + 1], IDX[t + 2]];
  if (keepOf.bone[a] && keepOf.bone[b] && keepOf.bone[c]) seat = Math.min(seat, P[a * 3 + 1], P[b * 3 + 1], P[c * 3 + 1]); }

/* ── the lens, in the lap's own frame ──────────────────────────────────────────────────────────────
   e3c2: the lap stands 0.12 m ahead of the eye (FLATCAM, y 0.96) along the view, turned flatYaw + 0.0922, so the
   eye sits at (−0.12 sin δ, 0.96, 0.12 cos δ) looking along yaw −δ; pitch −0.52 to 25.5 s, −0.55 at 35.0; the
   push-in carries the eye (−0.07, −0.01, −0.08) in the room = (0.009, −0.01, −0.106) in the lap's frame. */
const FOV = 72 * Math.PI / 180, BAND = 0.78, D = 0.0922;
const LENSES = [
  { name: 'start', off: [0, 0, 0], pitch: -0.52 }, { name: 'start', off: [0, 0, 0], pitch: -0.55 },
  { name: 'end', off: [0.009, -0.01, -0.106], pitch: -0.52 }, { name: 'end', off: [0.009, -0.01, -0.106], pitch: -0.55 },
];
const CROPS = { phone: 390 / 844, desktop: 1280 / 800 };
function score(rule, z, aspect, lens) {
  const keep = keepOf[rule], cam = [-0.12 * Math.sin(D) + lens.off[0], 0.96 + lens.off[1], 0.12 * Math.cos(D) + lens.off[2]];
  const H = 240, W = Math.round(H * aspect), zb = new Float32Array(W * H).fill(1e9), kind = new Uint8Array(W * H), tf = Math.tan(FOV / 2);
  const c1 = Math.cos(D), s1 = Math.sin(D), c2 = Math.cos(-lens.pitch), s2 = Math.sin(-lens.pitch);
  const proj = (i) => {
    const x = P[i * 3] - cam[0], y = P[i * 3 + 1] + 0.004 - seat - cam[1], zz = P[i * 3 + 2] + z - cam[2];
    const x1 = c1 * x + s1 * zz, z1 = -s1 * x + c1 * zz;                 // the yaw (−δ) undone
    const y2 = c2 * y - s2 * z1, z2 = s2 * y + c2 * z1, depth = -z2;     // the pitch undone
    return depth < 0.08 ? null : [x1 / depth / (tf * aspect), y2 / depth / tf, depth];
  };
  const pr = new Array(n); for (let i = 0; i < n; i++) pr[i] = keep[i] ? proj(i) : null;
  for (let t = 0; t < IDX.length; t += 3) {
    const A = pr[IDX[t]], B = pr[IDX[t + 1]], C = pr[IDX[t + 2]]; if (!A || !B || !C) continue;
    const back = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]) < 0;
    const X = [A, B, C].map(q => (q[0] + 1) / 2 * W), Y = [A, B, C].map(q => (1 - q[1]) / 2 * H), Zi = [A, B, C].map(q => 1 / q[2]);
    const den = (Y[1] - Y[2]) * (X[0] - X[2]) + (X[2] - X[1]) * (Y[0] - Y[2]); if (Math.abs(den) < 1e-12) continue;
    for (let py = Math.max(0, Math.floor(Math.min(...Y))); py <= Math.min(H - 1, Math.ceil(Math.max(...Y))); py++)
      for (let px = Math.max(0, Math.floor(Math.min(...X))); px <= Math.min(W - 1, Math.ceil(Math.max(...X))); px++) {
        const sx = px + 0.5, sy = py + 0.5;
        const l0 = ((Y[1] - Y[2]) * (sx - X[2]) + (X[2] - X[1]) * (sy - Y[2])) / den, l1 = ((Y[2] - Y[0]) * (sx - X[2]) + (X[0] - X[2]) * (sy - Y[2])) / den;
        if (l0 < 0 || l1 < 0 || l0 + l1 > 1) continue;
        const dz = 1 / (l0 * Zi[0] + l1 * Zi[1] + (1 - l0 - l1) * Zi[2]), o = py * W + px;
        if (dz < zb[o]) { zb[o] = dz; kind[o] = back ? 2 : 1; }
      }
  }
  const top = Math.round((1 - BAND) / 2 * H), bot = Math.round((1 + BAND) / 2 * H); let legs = 0, backs = 0;
  for (let py = top; py < bot; py++) for (let px = 0; px < W; px++) { const k = kind[py * W + px]; if (k === 1) legs++; else if (k === 2) backs++; }
  return { legs: +(100 * legs / ((bot - top) * W)).toFixed(1), back: backs };
}
const ZS = process.argv.slice(2).length ? process.argv.slice(2).map(Number) : [0.12, 0, -0.08, -0.12, -0.16, -0.20, -0.22, -0.25];
console.log(`seat ${(-seat).toFixed(3)} m under the hips; placements are the lap's z (the chapter's out.position.z)`);
for (const rule of Object.keys(RULES)) for (const crop of Object.keys(CROPS)) for (const lens of LENSES)
  console.log(rule.padEnd(6), crop.padEnd(7), lens.name.padEnd(5), lens.pitch, '|',
    ZS.map(z => { const s = score(rule, z, CROPS[crop], lens); return `z ${z}: legs ${s.legs}% back ${s.back}`; }).join(' | '));
