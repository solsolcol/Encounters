/* v26.2 · usage: node tools/probes/treeprofile.mjs <asset key> ... (the files under assets/) */
// the crown of each tree model, measured: for a model fitted to height h (as stand()/grove() fit it), its points by height
// slices of 0.5 m: how far they reach from the trunk axis (the model's origin, as grove() places it; stand() with h
// recentres the box, given here too), so trees can be set apart with nothing passing through another
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const keys = process.argv.slice(2);
for (const key of keys) {
  const doc = await io.read('assets/' + key + '.glb');
  const pts = [];
  const scene = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];
  const walk = (node, M) => {
    const m = node.getMatrix(); const W = mul(M, m);
    const mesh = node.getMesh();
    if (mesh) for (const prim of mesh.listPrimitives()) { const a = prim.getAttribute('POSITION'); if (!a) continue;
      const v = [0, 0, 0]; for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); pts.push(xf(W, v)); } }
    for (const c of node.listChildren()) walk(c, W);
  };
  for (const n of scene.listChildren()) walk(n, I());
  let bb = [[1e9, 1e9, 1e9], [-1e9, -1e9, -1e9]]; for (const p of pts) for (let k = 0; k < 3; k++) { bb[0][k] = Math.min(bb[0][k], p[k]); bb[1][k] = Math.max(bb[1][k], p[k]); }
  const H0 = bb[1][1] - bb[0][1], cx = (bb[0][0] + bb[1][0]) / 2, cz = (bb[0][2] + bb[1][2]) / 2;
  console.log(`\n${key}: ${pts.length} points; box x ${bb[0][0].toFixed(2)}..${bb[1][0].toFixed(2)} y ${bb[0][1].toFixed(2)}..${bb[1][1].toFixed(2)} z ${bb[0][2].toFixed(2)}..${bb[1][2].toFixed(2)}; height ${H0.toFixed(2)}; box centre off the origin ${cx.toFixed(2)}, ${cz.toFixed(2)}`);
  // the profile, in units of the model's own height (multiply by h): slices of 1/30 of the height
  const N = 30, rO = new Array(N).fill(0), rC = new Array(N).fill(0), cnt = new Array(N).fill(0);
  for (const p of pts) { const i = Math.min(N - 1, Math.floor((p[1] - bb[0][1]) / H0 * N)); cnt[i]++;
    rO[i] = Math.max(rO[i], Math.hypot(p[0], p[2]) / H0); rC[i] = Math.max(rC[i], Math.hypot(p[0] - cx, p[2] - cz) / H0); }
  console.log('  slice (height/H): reach from the origin / from the box centre (both /H), points');
  for (let i = 0; i < N; i++) console.log(`  ${(i / N).toFixed(3)}-${((i + 1) / N).toFixed(3)}  ${rO[i].toFixed(3)}  ${rC[i].toFixed(3)}  ${cnt[i]}`);
}
function I() { return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; }
function mul(a, b) { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; }
function xf(m, v) { return [m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12], m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13], m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14]]; }
