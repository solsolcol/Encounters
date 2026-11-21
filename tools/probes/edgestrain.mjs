// v28.0 · EDGE STRAIN: how far a take stretches or squashes the edges of a skinned body's triangles, by part of the body.
// A marled knit shows every strain (Master Zavier's back, walking: smeared patches where neighbouring points had kept
// different sets of four bones). Read only. The body is posed in plain Node from the file's own take, as the engine's
// skinning does (joint world matrix x inverse bind matrix x point, weighted), at rest and at each moment asked for.
//   node tools/probes/edgestrain.mjs <file.glb> <take> [at=0.3,0.65] [--box=x0,x1,y0,y1,z0,z1 ...]
// Prints, for the whole body and for each box (metres at rest; default: the back and the chest of a man 1.74 m tall),
// the share of edges stretched past 1.25 or squashed under 0.8, the 1st/50th/99th percentile, and the ROUGHNESS: the
// median, over triangles, of the gap between a triangle's most and least stretched edge (a smooth bend strains a
// triangle's three edges alike; a broken weight field does not).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Matrix4, Quaternion, Vector3 } from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [,, FILE, TAKE, ...rest] = process.argv;
const ATS = (rest.find(a => !a.startsWith('--')) || '0.3,0.65').split(',').map(Number);
const BOXES = rest.filter(a => a.startsWith('--box=')).map(a => a.slice(6).split(',').map(Number));
if (!BOXES.length) BOXES.push([-0.2, 0.2, 0.9, 1.42, -0.2, -0.02], [-0.2, 0.2, 0.9, 1.42, 0.02, 0.2]);
const doc = await io.read(FILE); await doc.transform(dequantize()); const root = doc.getRoot();
const node = root.listNodes().find(n => n.getMesh() && n.getSkin()), skin = node.getSkin(), joints = skin.listJoints();
const clip = root.listAnimations().find(a => a.getName() === TAKE);
if (!clip) { console.log('no take named', TAKE, '(', root.listAnimations().map(a => a.getName()).join(', '), ')'); process.exit(1); }
const scene = root.listScenes()[0], parent = new Map(); const walk = (n, p) => { parent.set(n, p); for (const c of n.listChildren()) walk(c, n); }; for (const n of scene.listChildren()) walk(n, null);
let dur = 0; for (const ch of clip.listChannels()) { const t = ch.getSampler().getInput().getArray(); dur = Math.max(dur, t[t.length - 1]); }
function local(t) {                      // each node's local matrix at time t of the take (null: at rest)
  const trs = new Map(); for (const n of parent.keys()) trs.set(n, { t: n.getTranslation().slice(), r: n.getRotation().slice(), s: n.getScale().slice() });
  if (t !== null) for (const ch of clip.listChannels()) { const n = ch.getTargetNode(), path = ch.getTargetPath(), s = ch.getSampler(), I = s.getInput().getArray(), O = s.getOutput().getArray(), es = path === 'rotation' ? 4 : 3;
    if (!n || !trs.has(n) || path === 'weights') continue; let k = 0; while (k < I.length - 2 && I[k + 1] < t) k++;
    const k1 = Math.min(k + 1, I.length - 1), f = I[k1] > I[k] ? Math.min(1, Math.max(0, (t - I[k]) / (I[k1] - I[k]))) : 0, a = O.slice(k * es, k * es + es), b = O.slice(k1 * es, k1 * es + es);
    let v; if (path === 'rotation') { const q = new Quaternion(...a).slerp(new Quaternion(...b), s.getInterpolation() === 'STEP' ? 0 : f); v = [q.x, q.y, q.z, q.w]; } else v = Array.from(a, (x, i) => x + (b[i] - x) * (s.getInterpolation() === 'STEP' ? 0 : f));
    trs.get(n)[path === 'translation' ? 't' : path === 'rotation' ? 'r' : 's'] = v; }
  const L = new Map(); for (const [n, x] of trs) L.set(n, new Matrix4().compose(new Vector3(...x.t), new Quaternion(...x.r), new Vector3(...x.s))); return L; }
function posed(t) { const L = local(t), Wm = new Map(), world = n => { if (Wm.has(n)) return Wm.get(n); const p = parent.get(n), m = p ? world(p).clone().multiply(L.get(n)) : L.get(n).clone(); Wm.set(n, m); return m; };
  const ibm = skin.getInverseBindMatrices().getArray(), JM = joints.map((j, i) => world(j).clone().multiply(new Matrix4().fromArray(ibm, i * 16)).elements), out = [];
  for (const p of node.getMesh().listPrimitives()) { const P = p.getAttribute('POSITION'), J = p.getAttribute('JOINTS_0'), Wt = p.getAttribute('WEIGHTS_0'), n = P.getCount(), o = new Float64Array(n * 3), v = [], jj = [], ww = [];
    for (let i = 0; i < n; i++) { P.getElement(i, v); J.getElement(i, jj); Wt.getElement(i, ww); let x = 0, y = 0, z = 0, sw = 0;
      for (let k = 0; k < 4; k++) { const w = ww[k]; if (!w) continue; const e = JM[jj[k]]; sw += w; x += w * (e[0] * v[0] + e[4] * v[1] + e[8] * v[2] + e[12]); y += w * (e[1] * v[0] + e[5] * v[1] + e[9] * v[2] + e[13]); z += w * (e[2] * v[0] + e[6] * v[1] + e[10] * v[2] + e[14]); }
      o[3 * i] = x / sw; o[3 * i + 1] = y / sw; o[3 * i + 2] = z / sw; } out.push(o); } return out; }
const R = posed(null), prims = node.getMesh().listPrimitives();
let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (const o of R) for (let i = 0; i < o.length; i += 3) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], o[i + k]); hi[k] = Math.max(hi[k], o[i + k]); }
const sc = 1.74 / (hi[1] - lo[1]), ctr = [(lo[0] + hi[0]) / 2, lo[1], (lo[2] + hi[2]) / 2], pct = (a, q) => a[Math.min(a.length - 1, Math.floor(q * a.length))];
console.log(`${FILE}: ${TAKE} (${dur.toFixed(2)} s), ${joints.length} joints; at rest ${(hi[1] - lo[1]).toFixed(3)} tall`);
for (const at of ATS) { const Q = posed(at * dur), all = { r: [], g: [] }, per = BOXES.map(() => ({ r: [], g: [] }));
  prims.forEach((p, pi) => { const I = p.getIndices().getArray(), a = R[pi], b = Q[pi], d = (o, i, j) => Math.hypot(o[3 * i] - o[3 * j], o[3 * i + 1] - o[3 * j + 1], o[3 * i + 2] - o[3 * j + 2]);
    for (let t = 0; t < I.length; t += 3) { const q = [I[t], I[t + 1], I[t + 2]], rr = []; for (let k = 0; k < 3; k++) { const l0 = d(a, q[k], q[(k + 1) % 3]); if (l0 > 1e-7) rr.push(d(b, q[k], q[(k + 1) % 3]) / l0); }
      if (rr.length < 3) continue; const g = Math.max(...rr) - Math.min(...rr), c = [0, 1, 2].map(k => ((a[3 * q[0] + k] + a[3 * q[1] + k] + a[3 * q[2] + k]) / 3 - ctr[k]) * sc);
      all.r.push(...rr); all.g.push(g); BOXES.forEach((B, bi) => { if (c[0] > B[0] && c[0] < B[1] && c[1] > B[2] && c[1] < B[3] && c[2] > B[4] && c[2] < B[5]) { per[bi].r.push(...rr); per[bi].g.push(g); } }); } });
  const say = (nm, s) => { if (!s.r.length) return console.log(`   ${nm}: nothing`); s.r.sort((x, y) => x - y); s.g.sort((x, y) => x - y);
    console.log(`   at ${at} ${nm}: ${s.g.length} triangles; edges past 1.25: ${(100 * s.r.filter(x => x > 1.25).length / s.r.length).toFixed(2)}%, under 0.8: ${(100 * s.r.filter(x => x < 0.8).length / s.r.length).toFixed(2)}%; 1st/50th/99th ${pct(s.r, 0.01).toFixed(3)} / ${pct(s.r, 0.5).toFixed(3)} / ${pct(s.r, 0.99).toFixed(3)}; roughness median ${pct(s.g, 0.5).toFixed(4)}, 90th ${pct(s.g, 0.9).toFixed(4)}, 99th ${pct(s.g, 0.99).toFixed(4)}; triangles with a gap over 0.15: ${s.g.filter(x => x > 0.15).length}`); };
  say('whole body', all); BOXES.forEach((B, bi) => say(`box [${B.join(', ')}]`, per[bi])); }
