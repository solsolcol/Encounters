/* v22.0 · THE SHOP OWNER'S SEAT. Chad's amulet shop owner (a Meshy scan on a 28-joint Mixamo rig) carries his own
   Chair_Sit_Idle_M — the take v8.0 wrote down as "not an idle" and v21.1 measured on the medium: upright only from
   9.2 s round the loop's seam to 1.2 s, folded over his knees for the five seconds between (photographed on this
   file at 0.27 and 0.52 of the take: the same fold). e3c3 seats its owner on a take named 'mixamo.com' (SIT_W —
   the stand-in's own seated clip), so this bakes that name from the upright stretch only: every channel sampled at
   30 fps from 9.2 s to the end and on from 0 to 1.2 s (the seam is continuous), then played back the other way,
   so the loop breathes there and back and never folds.
     node sitloop.mjs in.glb out.glb [from=9.2] [to=1.2] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const [,, IN, OUT, A0, A1] = process.argv;
const W0 = Number(A0 || 9.2), W1 = Number(A1 || 1.2), FPS = 30, NAME = process.env.NAME || 'mixamo.com';   // (v24.0: NAME= for a file whose 'mixamo.com' is taken)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN), root = doc.getRoot();
const src = root.listAnimations().find(a => a.getName() === 'Chair_Sit_Idle_M');
if (!src) throw new Error('no Chair_Sit_Idle_M');
if (root.listAnimations().some(a => a.getName() === NAME)) throw new Error('already has ' + NAME);
let dur = 0; for (const s of src.listSamplers()) dur = Math.max(dur, s.getInput().getMax([])[0]);
// the window's times, in the source take's clock: W0 -> dur, then 0 -> W1
const fwd = [];
for (let t = W0; t < dur - 1e-6; t += 1 / FPS) fwd.push(t);
for (let t = 0; t <= W1 + 1e-6; t += 1 / FPS) fwd.push(t);
const seq = fwd.concat(fwd.slice(1, -1).reverse());          // there and back, no doubled ends
const times = new Float32Array(seq.length).map((_, i) => i / FPS);
const lerp = (a, b, k) => a + (b - a) * k;
function sample(sampler, t, n) {
  const ti = sampler.getInput().getArray(), v = sampler.getOutput().getArray(), m = ti.length;
  if (t <= ti[0]) return Array.from(v.slice(0, n));
  if (t >= ti[m - 1]) return Array.from(v.slice((m - 1) * n, m * n));
  let i = 0; while (i < m - 2 && ti[i + 1] < t) i++;
  const k = (t - ti[i]) / ((ti[i + 1] - ti[i]) || 1);
  const a = v.slice(i * n, i * n + n), b = v.slice((i + 1) * n, (i + 1) * n + n);
  if (n === 4) {                                               // quaternions: the short way, normalised
    const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], s = d < 0 ? -1 : 1;
    const q = [0, 1, 2, 3].map(j => lerp(a[j], b[j] * s, k)), l = Math.hypot(...q) || 1;
    return q.map(x => x / l);
  }
  return Array.from({ length: n }, (_, j) => lerp(a[j], b[j], k));
}
const buf = root.listBuffers()[0];
const anim = doc.createAnimation(NAME);
const tIn = doc.createAccessor().setType('SCALAR').setArray(times).setBuffer(buf);
for (const ch of src.listChannels()) {
  const path = ch.getTargetPath(), s = ch.getSampler(), n = path === 'rotation' ? 4 : 3;
  if (!['rotation', 'translation', 'scale'].includes(path)) continue;
  const out = new Float32Array(seq.length * n);
  seq.forEach((t, i) => out.set(sample(s, t, n), i * n));
  const acc = doc.createAccessor().setType(n === 4 ? 'VEC4' : 'VEC3').setArray(out).setBuffer(buf);
  const smp = doc.createAnimationSampler().setInput(tIn).setOutput(acc).setInterpolation('LINEAR');
  anim.addSampler(smp).addChannel(doc.createAnimationChannel().setTargetNode(ch.getTargetNode()).setTargetPath(path).setSampler(smp));
}
await io.write(OUT, doc);
console.log(`${NAME}: ${seq.length} frames (${(seq.length / FPS).toFixed(2)} s) from Chair_Sit_Idle_M ${W0}..${dur.toFixed(2)} + 0..${W1}, there and back, ${anim.listChannels().length} channels -> ${OUT}`);
