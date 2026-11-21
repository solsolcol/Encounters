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
const names = joints.map(j => j.getName()), prim = prims[0], Jw = prim.getAttribute('JOINTS_0'), Ww = prim.getAttribute('WEIGHTS_0'), NP = prim.getAttribute('POSITION').getCount();
const isArm = new Uint8Array(NP); { const jj = [], ww = []; for (let i = 0; i < NP; i++) { Jw.getElement(i, jj); Ww.getElement(i, ww); let a = 0; for (let k = 0; k < 4; k++) if (/(Arm|ForeArm|Hand)/.test(names[jj[k]]) && !/Shoulder/.test(names[jj[k]])) a += ww[k]; isArm[i] = a >= 0.5; } }
const band = (Q) => { const out = []; for (const [y0, y1] of [[1.08, 1.13], [1.13, 1.18], [1.18, 1.23]]) { let L = 0, Rr = 0; for (let i = 0; i < NP; i++) { if (isArm[i]) continue; const y = Q[3 * i + 1]; if (y < y0 || y > y1) continue; const x = Q[3 * i]; if (x > L) L = x; if (-x > Rr) Rr = -x; } out.push((L * 100).toFixed(1) + '/' + (Rr * 100).toFixed(1)); } return out.join('  '); };
console.log(FILE.split('/').pop().padEnd(10), TAKE, 'torso half-widths L/R cm at y 1.08-1.13, 1.13-1.18, 1.18-1.23: rest', band(R[0]), '| at', ATS.map(a => a + ': ' + band(posed(a * dur)[0])).join(' | '));
