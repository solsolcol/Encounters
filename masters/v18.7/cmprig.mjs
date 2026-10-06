// compare two rigs' rest poses (local rotations + translations) and a shared take's keys
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [a, b] = await Promise.all(process.argv.slice(2, 4).map(f => io.read(f)));
const nodes = d => new Map(d.getRoot().listNodes().map(n => [n.getName(), n]));
const A = nodes(a), B = nodes(b);
let maxR = 0, maxT = 0;
for (const [k, na] of A) { const nb = B.get(k); if (!nb || !/mixamorig|headfront/.test(k)) continue;
  const ra = na.getRotation(), rb = nb.getRotation(); const dot = Math.abs(ra.reduce((s, v, i) => s + v * rb[i], 0));
  const ang = 2 * Math.acos(Math.min(1, dot)) * 180 / Math.PI;
  const ta = na.getTranslation(), tb = nb.getTranslation(); const dt = Math.hypot(...ta.map((v, i) => v - tb[i]));
  if (ang > 0.5 || dt > 0.002) console.log(k, 'rot°', ang.toFixed(2), 't', ta.map(v=>v.toFixed(3)).join(','), '|', tb.map(v=>v.toFixed(3)).join(','));
  maxR = Math.max(maxR, ang); maxT = Math.max(maxT, dt); }
console.log('max rest rot diff°', maxR.toFixed(2), 'max t diff', maxT.toFixed(4));
// armature/root node transforms
for (const d of [a, b]) for (const n of d.getRoot().listScenes()[0].listChildren()) console.log('root', n.getName(), n.getScale(), n.getRotation());
// compare the shared take's hips translation keys
for (const d of [a, b]) { const an = d.getRoot().listAnimations().find(x => x.getName() === 'Sitting_Answering_Questions');
  const ch = an.listChannels().find(c => c.getTargetPath() === 'translation' && /Hips/.test(c.getTargetNode().getName()));
  console.log('hipsT0', Array.from(ch.getSampler().getOutput().getArray().slice(0, 3)).map(v => v.toFixed(3))); }
