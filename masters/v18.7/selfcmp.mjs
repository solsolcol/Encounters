import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const d = await io.read(process.argv[2]);
const [A, B] = [process.argv[3], process.argv[4]].map(n => d.getRoot().listAnimations().find(a => a.getName() === n));
const tr = a => new Map(a.listChannels().filter(c => c.getTargetPath() === 'rotation').map(c => [c.getTargetNode().getName(), c.getSampler()]));
const TA = tr(A), TB = tr(B); let worst = 0, wn = '';
for (const [n, sb] of TB) { const sa = TA.get(n); if (!sa) continue;
  const ob = sb.getOutput().getArray(), oa = sa.getOutput().getArray(), ib = sb.getInput().getArray(), ia = sa.getInput().getArray();
  // compare at B's frame times nearest A key
  for (let f = 0; f < ib.length; f += 3) { let j = 0; while (j < ia.length - 1 && ia[j] < ib[f]) j++;
    const dot = Math.abs(oa[4*j]*ob[4*f]+oa[4*j+1]*ob[4*f+1]+oa[4*j+2]*ob[4*f+2]+oa[4*j+3]*ob[4*f+3]);
    const ang = 2*Math.acos(Math.min(1,dot))*57.3; if (ang > worst) { worst = ang; wn = n + '@' + ib[f].toFixed(2); } } }
console.log('worst local-rot diff', worst.toFixed(1), '°', wn);
