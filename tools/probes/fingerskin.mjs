/* v28.0 (E4C5, R39: "Why does the middle finger keep sticking out like that"): EACH FINGER'S SKIN AGAINST ITS OWN BONES, read
   from the file in its bind pose. Every point of the hand's skin is set against each finger's line (its first joint to its
   end, the joints' places from the inverse binds): a point that lies along a finger (past 5 % of its length, within a
   quarter of its length from its line) is that finger's, and the bone that carries most of it is read. A finger whose
   points past its middle joint are carried by the hand, or by a bone that is no finger's, stays straight while the rest of
   it bends: it sticks out. Each finger's points are told in four bands along it (to its middle joint, to its end joint, to
   its end, past its end) with the bones that carry them.
     node tools/probes/fingerskin.mjs assets/p5pho.glb [SIDE=Right|Left] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const SIDE = process.env.SIDE || 'Right';
const mul = (m, v) => [m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12], m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13], m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14]];
function inv(m) { /* 4x4 column-major inverse (affine) */
  const a = m, r = new Array(16).fill(0);
  const det = a[0] * (a[5] * a[10] - a[9] * a[6]) - a[4] * (a[1] * a[10] - a[9] * a[2]) + a[8] * (a[1] * a[6] - a[5] * a[2]);
  const id = 1 / det;
  r[0] = (a[5] * a[10] - a[9] * a[6]) * id; r[4] = -(a[4] * a[10] - a[8] * a[6]) * id; r[8] = (a[4] * a[9] - a[8] * a[5]) * id;
  r[1] = -(a[1] * a[10] - a[9] * a[2]) * id; r[5] = (a[0] * a[10] - a[8] * a[2]) * id; r[9] = -(a[0] * a[9] - a[8] * a[1]) * id;
  r[2] = (a[1] * a[6] - a[5] * a[2]) * id; r[6] = -(a[0] * a[6] - a[4] * a[2]) * id; r[10] = (a[0] * a[5] - a[4] * a[1]) * id;
  r[12] = -(r[0] * a[12] + r[4] * a[13] + r[8] * a[14]); r[13] = -(r[1] * a[12] + r[5] * a[13] + r[9] * a[14]); r[14] = -(r[2] * a[12] + r[6] * a[13] + r[10] * a[14]); r[15] = 1;
  return r;
}
for (const F of process.argv.slice(2)) {
  const doc = await io.read(F), root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints();
  const names = joints.map(j => j.getName().replace(/^mixamorig:?/, ''));
  const ibm = skin.getInverseBindMatrices(), at = (i) => { const m = []; for (let k = 0; k < 16; k++) m.push(ibm.getArray()[i * 16 + k]); return mul(inv(m), [0, 0, 0]); };
  const J = (nm) => { const i = names.indexOf(nm); return i < 0 ? null : at(i); };
  const fingers = {};
  /* (a finger's fourth joint may be an END SITE under another name: Meshy's rigs end the middle finger at 'Hand_End' or, once
     glTF has stripped the underscore, 'HandEnd' (Grandmaster Pho's, R39; Ton's, chapter 3's). A finger skipped for a name
     it lacks is a finger never read (R40): its end site stands in for the fourth joint, and a finger still lacking one is said) */
  const end4 = (f) => J(SIDE + 'Hand' + f + 4) || (f === 'Middle' ? (J(SIDE + 'Hand_End') || J(SIDE + 'HandEnd')) : null);
  for (const f of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) { const p = [1, 2, 3].map(k => J(SIDE + 'Hand' + f + k)).concat([end4(f)]);
    if (p.every(Boolean)) fingers[f] = p; else if (p[0]) console.log(F, SIDE, f, 'has no end joint by any name: not read'); }
  if (!Object.keys(fingers).length) { console.log(F, 'no', SIDE, 'finger bones'); continue; }
  const out = {};
  for (const node of root.listNodes()) { const mesh = node.getMesh(); if (!mesh || !node.getSkin()) continue; const M = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) { const P = prim.getAttribute('POSITION'), JJ = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0'); if (!JJ) continue;
      const v = [0, 0, 0], j = [0, 0, 0, 0], w = [0, 0, 0, 0];
      for (let i = 0; i < P.getCount(); i++) { P.getElement(i, v); const x = mul(M, v);
        for (const f in fingers) { const [a, , , e] = fingers[f], d = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], L = Math.hypot(...d);
          const r = [x[0] - a[0], x[1] - a[1], x[2] - a[2]], t = (r[0] * d[0] + r[1] * d[1] + r[2] * d[2]) / (L * L);
          if (t < 0.05 || t > 1.25) continue;
          const q = [r[0] - d[0] * t, r[1] - d[1] * t, r[2] - d[2] * t]; if (Math.hypot(...q) > 0.25 * L) continue;
          /* (the band: where along the finger the point lies, by its own joints) */
          const tj = (p) => ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1] + (p[2] - a[2]) * d[2]) / (L * L);
          const [, b2, b3] = fingers[f], band = t < tj(b2) ? 'to the middle joint' : t < tj(b3) ? 'to the end joint' : t <= 1 ? 'to the end' : 'past the end';
          JJ.getElement(i, j); W.getElement(i, w); let bk = -1, bw = 0; for (let k = 0; k < 4; k++) if (w[k] > bw) { bw = w[k]; bk = j[k]; }
          const o = (out[f] = out[f] || {}), B = (o[band] = o[band] || {}), nm = names[bk] || '?'; B[nm] = (B[nm] || 0) + 1; } } } }
  console.log(F, SIDE);
  for (const f in out) { console.log(' ', f); for (const band of ['to the middle joint', 'to the end joint', 'to the end', 'past the end']) { const B = out[f][band]; if (!B) continue;
      console.log('    ' + band.padEnd(20), Object.entries(B).sort((x, y) => y[1] - x[1]).map(([k, n]) => k.replace(SIDE + 'Hand', '') + ' ' + n).join(', ')); } }
}
