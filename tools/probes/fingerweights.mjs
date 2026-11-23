/* v28.0 (E4C5, R35): how each finger's skin is tied to its bones: per finger bone, the points it leads, and how many of those are tied to it
   alone (weight over 0.98: a hard edge, which folds like card where the joint bends) against blended ones */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
for (const F of process.argv.slice(2)) {
  const doc = await io.read(F), root = doc.getRoot(), skin = root.listSkins()[0], names = skin.listJoints().map(j => j.getName().replace(/^mixamorig:?/, ''));
  const st = {};
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const JJ = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'); if (!JJ) continue;
    const j = [0,0,0,0], w = [0,0,0,0];
    for (let i = 0; i < JJ.getCount(); i++) { JJ.getElement(i, j); W.getElement(i, w); let bk = -1, bw = 0; for (let q = 0; q < 4; q++) if (w[q] > bw) { bw = w[q]; bk = j[q]; }
      const nm = names[bk]; if (!/(Hand(Thumb|Index|Middle|Ring|Pinky)[1-3])$|Hand$/.test(nm)) continue;
      const s = st[nm] || (st[nm] = { n: 0, hard: 0, sum2: 0 }); s.n++; if (bw > 0.98) s.hard++; } }
  console.log(F);
  for (const k of Object.keys(st).sort()) console.log('  ', k.padEnd(20), 'points', String(st[k].n).padStart(5), ' tied to it alone', String(st[k].hard).padStart(5), '(' + (100 * st[k].hard / st[k].n).toFixed(0) + '%)');
}
