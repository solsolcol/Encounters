/* v28.0 · ARM IN THE SIDE: does an arm pass INTO the body's side in a take, and how deep, over the whole take (the heavy
   Prai's right forearm through her waist in the walk: masters/v28.0/people/RECORD.md section 7). Read only. The body is
   posed in plain Node from the file's own take as the engine skins it (tools/probes/edgestrain.mjs's posing), at every
   1/30 s of the take. In each moment the torso's skin (points held half or more by the spine and the hips) is binned in
   cells of 2 cm of height and depth; an arm point (held half or more by that side's upper arm, forearm or hand) inside
   the torso's span across its own cell is in the side, and its depth is how far in it is from the nearer edge.
     node tools/probes/armside.mjs <file.glb> <take> [--cell=0.02]
   Prints, for each side, the moments with any arm point in the side, the deepest, and when. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Matrix4, Quaternion, Vector3 } from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [,, FILE, TAKE, ...rest] = process.argv; const CELL = +((rest.find(a => a.startsWith("--cell=")) || "--cell=0.02").slice(7));
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
const names = joints.map(j => j.getName()), cls = (n) => /^(Hips|Spine\d*)$/.test(n) ? 'T' : /^Left(Arm|ForeArm|Hand)/.test(n) ? 'L' : /^Right(Arm|ForeArm|Hand)/.test(n) ? 'R' : '';
const prim = prims[0], Jw = prim.getAttribute('JOINTS_0'), Ww = prim.getAttribute('WEIGHTS_0'), NP = prim.getAttribute('POSITION').getCount();
const who = new Uint8Array(NP); { const jj = [], ww = []; for (let i = 0; i < NP; i++) { Jw.getElement(i, jj); Ww.getElement(i, ww); const s = { T: 0, L: 0, R: 0 }; for (let k = 0; k < 4; k++) { const c = cls(names[jj[k]]); if (c) s[c] += ww[k]; }
  who[i] = s.T >= 0.5 ? 1 : s.L >= 0.5 ? 2 : s.R >= 0.5 ? 3 : 0; } }
const res = { L: { hit: 0, deep: 0, at: 0, pts: 0 }, R: { hit: 0, deep: 0, at: 0, pts: 0 } }, step = 1 / 30, F = Math.max(1, Math.round(dur / step));
for (let f = 0; f <= F; f++) { const t = Math.min(dur, f * step), Q = posed(t)[0], cells = new Map();
  for (let i = 0; i < NP; i++) if (who[i] === 1) { const k = Math.round(Q[3 * i + 1] / CELL) + ':' + Math.round(Q[3 * i + 2] / CELL); const c = cells.get(k); if (c) { c[0] = Math.min(c[0], Q[3 * i]); c[1] = Math.max(c[1], Q[3 * i]); } else cells.set(k, [Q[3 * i], Q[3 * i]]); }
  for (const [side, w] of [['L', 2], ['R', 3]]) { let deep = 0, n = 0;
    for (let i = 0; i < NP; i++) if (who[i] === w) { const c = cells.get(Math.round(Q[3 * i + 1] / CELL) + ':' + Math.round(Q[3 * i + 2] / CELL)); if (!c) continue; const x = Q[3 * i];
      if (x > c[0] && x < c[1]) { n++; deep = Math.max(deep, Math.min(x - c[0], c[1] - x)); } }
    if (n) { res[side].hit++; res[side].pts = Math.max(res[side].pts, n); if (deep > res[side].deep) { res[side].deep = deep; res[side].at = t; } } } }
console.log(`${FILE.split('/').pop()} ${TAKE} (${dur.toFixed(2)} s, ${F + 1} moments, cells ${CELL * 100} cm):`);
for (const s of ['L', 'R']) console.log(`  ${s === 'L' ? 'left' : 'right'} arm in the side in ${res[s].hit} of ${F + 1} moments; the most points in at once ${res[s].pts}; deepest ${(res[s].deep * 100).toFixed(1)} cm at ${res[s].at.toFixed(2)} s`);
