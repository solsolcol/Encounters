/* v28.0 · JOINTSCAN ON A FILE: every joint of a body against a real body's ranges, in each of the file's own takes, before
   the body is cast in any chapter (the collector, mended here: masters/v28.0/people/RECORD.md section 3b). It runs
   JOINTSCAN'S OWN MEASURE (the function is read out of tools/probes/jointscan.mjs at run time, never copied), on the
   file's skeleton posed in plain Node from each take at N moments (three's own matrices: the engine's maths), so a
   flag here is the flag the chapter's probe would raise on the same pose. A rig with no finger bones has its fingers
   left out of the measure, as jointscan leaves out whatever a body does not have.
     node tools/probes/filejoints.mjs <file.glb> [N=12] [take,take,...]
   Prints each take's flags with the moments they were seen at, and one full reading at the first moment. Read only. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [FILE, NARG, ONLY] = process.argv.slice(2);
const N = +(NARG || 12);
const src = fs.readFileSync(new URL('./jointscan.mjs', import.meta.url), 'utf8');
const a = src.indexOf('const MEASURE = ([WHO, NAMES]) => {'), b = src.indexOf('\n};\n', a);
if (a < 0 || b < 0) { console.error('filejoints: jointscan.mjs has no MEASURE to read'); process.exit(1); }
const MEASURE = (0, eval)('(' + src.slice(a + 'const MEASURE = '.length, b + 2) + ')');
const doc = await io.read(FILE), root = doc.getRoot();
const scene = new THREE.Scene(), map = new Map();
const build = (n, parent) => { const skinJ = new Set(root.listSkins().flatMap(s => s.listJoints()));
  const o = skinJ.has(n) ? new THREE.Bone() : new THREE.Object3D(); o.name = n.getName();
  o.position.fromArray(n.getTranslation()); o.quaternion.fromArray(n.getRotation()); o.scale.fromArray(n.getScale());
  parent.add(o); map.set(n, o); for (const c of n.listChildren()) build(c, o); };
const group = new THREE.Group(); scene.add(group);
for (const s of root.listScenes()) for (const n of s.listChildren()) build(n, group);
const meshNode = root.listNodes().find(n => n.getMesh() && n.getSkin()), skin = meshNode.getSkin();
const bones = skin.listJoints().map(j => map.get(j)), ibm = skin.getInverseBindMatrices().getArray();
const fake = new THREE.Object3D(); fake.isSkinnedMesh = true; fake.name = 'body';
fake.skeleton = { bones, boneInverses: bones.map((_, i) => new THREE.Matrix4().fromArray(ibm, i * 16)) };
map.get(meshNode).add(fake);
const rest = new Map([...map].map(([n, o]) => [o, { p: o.position.clone(), q: o.quaternion.clone(), s: o.scale.clone() }]));
globalThis.window = globalThis;
window.__enc = { scene, stage: { dbg: { cast: { body: { group, cur: '' } } } } };
const takes = root.listAnimations().filter(t => !ONLY || ONLY.split(',').includes(t.getName()));
const sample = (I, O, es, t, cubic) => { let k = 0; while (k < I.length - 2 && I[k + 1] < t) k++; const k1 = Math.min(k + 1, I.length - 1);
  const f = I[k1] > I[k] ? Math.min(1, Math.max(0, (t - I[k]) / (I[k1] - I[k]))) : 0; return [O.slice(k * es, k * es + es), O.slice(k1 * es, k1 * es + es), f]; };
let anyFlag = 0;
for (const t of takes) {
  let dur = 0; for (const ch of t.listChannels()) { const I = ch.getSampler().getInput().getArray(); dur = Math.max(dur, I[I.length - 1]); }
  const flags = new Map(); let first = null;
  for (let k = 0; k < N; k++) {
    const time = dur * (k + 0.5) / N;
    for (const [o, r] of rest) { o.position.copy(r.p); o.quaternion.copy(r.q); o.scale.copy(r.s); }
    for (const ch of t.listChannels()) { const o = map.get(ch.getTargetNode()); if (!o) continue; const s = ch.getSampler(), path = ch.getTargetPath();
      const es = path === 'rotation' ? 4 : 3, [x, y, f] = sample(s.getInput().getArray(), s.getOutput().getArray(), es, time);
      if (path === 'rotation') o.quaternion.fromArray(x).slerp(new THREE.Quaternion().fromArray(y), f);
      else if (path === 'translation') o.position.fromArray(x).lerp(new THREE.Vector3().fromArray(y), f);
      else if (path === 'scale') o.scale.fromArray(x).lerp(new THREE.Vector3().fromArray(y), f); }
    scene.updateMatrixWorld(true);
    const rows = MEASURE(['', false]);
    for (const r of rows) { if (!first) first = r; for (const fl of r.flags) { const key = fl.split('=')[0]; if (!flags.has(key)) flags.set(key, []); flags.get(key).push(time.toFixed(2) + 's:' + fl.split('=').slice(1).join('=')); } }
  }
  anyFlag += flags.size;
  console.log(`${t.getName()} (${dur.toFixed(2)} s, ${N} moments): ${flags.size ? flags.size + ' kinds of flag' : 'no joint a real body would not hold'}`);
  for (const [k, v] of flags) console.log('   ', k, v.length + '/' + N, v.slice(0, 4).join('  '));
  if (first) console.log('    at the first moment:', JSON.stringify(first.j));
}
process.exitCode = 0;
console.log(anyFlag ? `${anyFlag} kinds of flag in all` : 'no flags in any take');
