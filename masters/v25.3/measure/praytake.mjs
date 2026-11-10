/* v25.3 · THE GAME'S OWN CAPTURED PRAYER, MEASURED: episode 3 chapter 2's congregation take `pray` (Chad's take, laid on
   his four Meshy characters at v19.6) read in plain Node at N moments: where the arms and the joined hands are, in the
   body's own frame, so a wai written in code can be held against a person's (docs/V25.3-E4C2-NATURAL.md).
   The body's frame, from joints alone: X his left (the line of his shoulders), Y up his trunk (hips to the middle of his
   shoulders, squared to X), Z before him; the origin the middle of his shoulders; lengths in ARM LENGTHS (upper arm +
   forearm at rest), so two bodies of different size compare.
     node masters/v25.3/measure/praytake.mjs [file.glb] [take] [n]        (default assets/cg_man2hd.glb pray 9) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Vector3 } from 'three';
import { makePoser } from '../../../tools/gltfpose.mjs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const file = process.argv[2] || new URL('../../../assets/cg_man2hd.glb', import.meta.url).pathname, takeName = process.argv[3] || 'pray', N = +(process.argv[4] || 9);
const d = await io.read(file), root = d.getRoot(), nodes = root.listNodes();
const find = (re) => nodes.find(n => re.test(n.getName()));
const J = { hips: find(/Hips$/), head: find(/(^|:)Head$/), neck: find(/neck$/i) };
for (const sd of ['Left', 'Right']) { J[sd + 'Arm'] = find(new RegExp(sd + 'Arm$')); J[sd + 'Fore'] = find(new RegExp(sd + 'ForeArm$'));
  J[sd + 'Hand'] = find(new RegExp(sd + 'Hand$')); J[sd + 'End'] = find(new RegExp(sd + 'Hand(_End|Middle4)$')); }
for (const k in J) if (!J[k]) { console.error('no joint for', k); process.exit(1); }
const take = root.listAnimations().find(a => a.getName() === takeName); if (!take) { console.error('no take', takeName); process.exit(1); }
let len = 0; for (const s of take.listSamplers()) { const i = s.getInput(); len = Math.max(len, i.getElement(i.getCount() - 1, [])[0]); }
const poser = makePoser(root), P = (n) => new Vector3().setFromMatrixPosition(poser.world[poser.NI.get(n)]);
export function measure(pt) {
  /* pt: { hips, head, LeftArm, LeftFore, LeftHand, LeftEnd, Right... } world points; returns the numbers */
  const S0 = pt.LeftArm.clone().add(pt.RightArm).multiplyScalar(0.5);
  const X = pt.LeftArm.clone().sub(pt.RightArm).normalize();
  const Y = S0.clone().sub(pt.hips); Y.addScaledVector(X, -Y.dot(X)).normalize();
  const Z = new Vector3().crossVectors(X, Y);
  const inB = (v) => new Vector3(v.dot(X), v.dot(Y), v.dot(Z));
  const out = { lean: +(Math.acos(Math.min(1, Y.y)) * 180 / Math.PI).toFixed(0) };
  for (const sd of ['Left', 'Right']) {
    const sg = sd === 'Left' ? 1 : -1;
    const a = pt[sd + 'Arm'], e = pt[sd + 'Fore'], w = pt[sd + 'Hand'], t = pt[sd + 'End'];
    const up = e.clone().sub(a), fo = w.clone().sub(e), L = up.length() + fo.length();
    const u = inB(up.clone().normalize()), wr = inB(w.clone().sub(S0)).multiplyScalar(1 / L), h = t.clone().sub(w).normalize(), hb = inB(h);
    out[sd] = {
      upper: [+(u.x * sg).toFixed(2), +u.y.toFixed(2), +u.z.toFixed(2)],                     // out, up, forward (unit)
      flex: +(Math.acos(Math.max(-1, Math.min(1, up.clone().normalize().dot(fo.clone().normalize())))) * 180 / Math.PI).toFixed(0),
      wrist: [+(wr.x * sg).toFixed(2), +wr.y.toFixed(2), +wr.z.toFixed(2)],                  // out from the midline, up from the shoulders, forward (arm lengths)
      hand: [+(hb.x * sg).toFixed(2), +hb.y.toFixed(2), +hb.z.toFixed(2)],                   // the fingers' line in his frame
      handUp: +(Math.asin(Math.max(-1, Math.min(1, h.y))) * 180 / Math.PI).toFixed(0),       // the fingers' pitch in the room (90 straight up)
      bend: +(Math.acos(Math.max(-1, Math.min(1, h.dot(fo.clone().normalize())))) * 180 / Math.PI).toFixed(0),   // the wrist's bend
      tipHead: +((t.y - pt.head.y) / L).toFixed(2)                                            // the hand's end above the head joint (arm lengths)
    };
  }
  out.wristsApart = +(pt.LeftHand.distanceTo(pt.RightHand) / (pt.LeftArm.distanceTo(pt.LeftFore) + pt.LeftFore.distanceTo(pt.LeftHand))).toFixed(2);
  out.tipsApart = +(pt.LeftEnd.distanceTo(pt.RightEnd) / (pt.LeftArm.distanceTo(pt.LeftFore) + pt.LeftFore.distanceTo(pt.LeftHand))).toFixed(2);
  return out;
}
console.log(file.split('/').pop(), takeName, len.toFixed(2) + ' s');
for (let i = 0; i < N; i++) {
  const t = len * i / (N - 1); poser.pose(take, t);
  const pt = {}; for (const k in J) pt[k] = P(J[k]);
  const m = measure(pt);
  console.log(t.toFixed(2).padStart(5), 'lean', String(m.lean).padStart(3), '| L upper', JSON.stringify(m.Left.upper), 'flex', m.Left.flex, 'wrist', JSON.stringify(m.Left.wrist), 'hand', JSON.stringify(m.Left.hand), 'pitch', m.Left.handUp, 'bend', m.Left.bend, 'tip-head', m.Left.tipHead,
    '\n      ', '        ', '| R upper', JSON.stringify(m.Right.upper), 'flex', m.Right.flex, 'wrist', JSON.stringify(m.Right.wrist), 'hand', JSON.stringify(m.Right.hand), 'pitch', m.Right.handUp, 'bend', m.Right.bend, 'tip-head', m.Right.tipHead,
    '| wrists apart', m.wristsApart, 'tips apart', m.tipsApart);
}
