/* v28.0 (E4C5, R35): each finger's cross-section in the bind pose: the points weighted mostly to a finger bone, measured across its own line:
   width (across the palm), thickness (palm to back), at the middle of each phalanx; Pho's grafted right hand, Zavier's both */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
for (const F of process.argv.slice(2)) {
  const doc = await io.read(F), root = doc.getRoot(), skin = root.listSkins()[0], J = skin.listJoints(), ibm = skin.getInverseBindMatrices().getArray();
  const bindPos = (k) => new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().fromArray(ibm, k * 16).invert());
  const names = J.map(j => j.getName().replace(/^mixamorig:?/, ''));
  /* metre: hips to head in node space vs bind space */
  const worldOf = (n) => { const ch = []; for (let x = n; x; x = x.getParentNode ? x.getParentNode() : null) ch.unshift(x); const M = new THREE.Matrix4(); for (const x of ch) M.multiply(new THREE.Matrix4().compose(new THREE.Vector3(...x.getTranslation()), new THREE.Quaternion(...x.getRotation()), new THREE.Vector3(...x.getScale()))); return M; };
  const hi = names.findIndex(n => /^Hips$/.test(n)), he = names.findIndex(n => /^Head$/.test(n));
  const METRE = new THREE.Vector3().setFromMatrixPosition(worldOf(J[hi])).distanceTo(new THREE.Vector3().setFromMatrixPosition(worldOf(J[he]))) / bindPos(hi).distanceTo(bindPos(he));
  const pts = new Map();   // bone index -> points mostly on it
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const P = p.getAttribute('POSITION'), JJ = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'); if (!JJ) continue;
    const j = [0,0,0,0], w = [0,0,0,0], e = [0,0,0];
    for (let i = 0; i < P.getCount(); i++) { JJ.getElement(i, j); W.getElement(i, w); let bk = -1, bw = 0; for (let q = 0; q < 4; q++) if (w[q] > bw) { bw = w[q]; bk = j[q]; }
      if (bw < 0.6) continue; const nm = names[bk]; if (!/(Thumb|Index|Middle|Ring|Pinky)[1-3]$/.test(nm)) continue;
      if (!pts.has(bk)) pts.set(bk, []); pts.get(bk).push(new THREE.Vector3(...P.getElement(i, e))); } }
  console.log('\n' + F, 'metre/unit', METRE.toFixed(4));
  for (const [bk, L] of [...pts.entries()].sort((a, b) => names[a[0]].localeCompare(names[b[0]]))) {
    const nm = names[bk], a = bindPos(bk), ch = names.findIndex((n, k) => n === nm.replace(/(\d)$/, (d) => String(+d + 1)));
    const b = ch >= 0 ? bindPos(ch) : null; if (!b) { console.log(nm, L.length, 'pts (no next joint)'); continue; }
    const f = b.clone().sub(a), len = f.length(); f.normalize();
    /* points in the middle third of the bone, projected across its line; PCA of the cross-section */
    const cs = L.map(p => p.clone().sub(a)).filter(d => { const t = d.dot(f) / len; return t > 0.3 && t < 0.7; }).map(d => d.addScaledVector(f, -d.dot(f)));
    if (cs.length < 6) { console.log(nm.padEnd(22), 'pts', L.length, 'mid', cs.length); continue; }
    const c = new THREE.Vector3(); cs.forEach(d => c.add(d)); c.divideScalar(cs.length);
    let u = new THREE.Vector3(1, 0, 0); if (Math.abs(u.dot(f)) > 0.9) u.set(0, 1, 0); u.addScaledVector(f, -u.dot(f)).normalize(); const v = new THREE.Vector3().crossVectors(f, u);
    let sxx = 0, sxy = 0, syy = 0; for (const d of cs) { const x = d.clone().sub(c); const p = x.dot(u), q = x.dot(v); sxx += p*p; sxy += p*q; syy += q*q; }
    const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), A = u.clone().multiplyScalar(Math.cos(th)).addScaledVector(v, Math.sin(th)), B = new THREE.Vector3().crossVectors(f, A);
    const ext = (ax) => { const s = cs.map(d => d.clone().sub(c).dot(ax)); return Math.max(...s) - Math.min(...s); };
    const w1 = ext(A) * METRE * 100, w2 = ext(B) * METRE * 100;
    console.log(nm.padEnd(22), 'pts', String(L.length).padStart(4), ' bone', (len * METRE * 100).toFixed(1).padStart(5), 'cm  cross-section', Math.max(w1, w2).toFixed(2), 'x', Math.min(w1, w2).toFixed(2), 'cm  ratio', (Math.min(w1, w2) / Math.max(w1, w2)).toFixed(2));
  }
}
