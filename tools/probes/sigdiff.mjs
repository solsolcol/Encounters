/* v24.10: compare two scene-signature files (scenesig.mjs) moment by moment — typically an ending reached by a REAL
   play-through (e3c5drive SIG=) against the same ending after the probes' phase jump (e3c5ends SIG=). Prints, for the
   decision and every sampled time, what each run drew that the other did not.
   node tools/probes/sigdiff.mjs real.json jump.json [MAX=40] */
import fs from 'node:fs';
import { sigDiff } from './scenesig.mjs';
const [fa, fb] = process.argv.slice(2);
const A = JSON.parse(fs.readFileSync(fa, 'utf8')), B = JSON.parse(fs.readFileSync(fb, 'utf8'));
const MAX = +(process.env.MAX || 40);
let total = 0;
for (const key of Object.keys(A)) {
  if (!B[key]) { console.log(`${key}: only in ${fa}`); continue; }
  const { onlyA, onlyB } = sigDiff(A[key].sig || A[key], B[key].sig || B[key]);
  total += onlyA.length + onlyB.length;
  const tag = A[key].shot ? ` (${A[key].shot}${B[key].shot && B[key].shot !== A[key].shot ? ' / ' + B[key].shot : ''})` : '';
  console.log(`${key}${tag}: ${onlyA.length} only in the first, ${onlyB.length} only in the second`);
  for (const s of onlyA.slice(0, MAX)) console.log('   + ' + s);
  if (onlyA.length > MAX) console.log(`   + … ${onlyA.length - MAX} more`);
  for (const s of onlyB.slice(0, MAX)) console.log('   - ' + s);
  if (onlyB.length > MAX) console.log(`   - … ${onlyB.length - MAX} more`);
}
console.log(total ? `DIFFERENCES ${total}` : 'IDENTICAL at every moment');
