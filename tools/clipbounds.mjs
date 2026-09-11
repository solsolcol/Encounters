/* v8.4 — THE WIDEST POSE OF EVERY CLIP.
 *
 * Every skinned mesh in episode 2 chapter 1 carries `frustumCulled = false`,
 * so all ten characters draw on every frame whichever way the player faces —
 * measured at 84% waste. Culling can go back on, but only with bounds that
 * cover the ANIMATION: three.js culls a skinned mesh by its geometry's
 * bounding sphere, and `computeBoundingSphere()` measures the BIND pose,
 * which an arm swing or a push-up leaves behind. A sphere that is too tight
 * makes a man blink out of existence at the edge of the screen — which is
 * exactly the bug `frustumCulled = false` was hiding.
 *
 * So: load each rig, play every clip it owns, step it across its whole
 * length, skin the vertices at each step, and report the sphere that
 * contains every pose of every clip. Offline and exhaustive, because a clip
 * that only plays in one beat of one scene still has to be covered.
 *
 *   node tools/clipbounds.mjs assets/admintee.glb [...]                  */
import { readFileSync } from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

/* GLTFLoader reaches for `self.URL` to build a blob for every embedded
   texture, and node has no DOM. Nothing here needs a pixel — only geometry,
   skin weights and clips — so the textures are stripped in memory first. */
async function geometryOnly(path) {
  await MeshoptDecoder.ready; await MeshoptEncoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
  const doc = await io.read(path);
  for (const t of doc.getRoot().listTextures()) t.dispose();
  return Buffer.from(await io.writeBinary(doc));
}

const STEPS = 24;          // poses sampled across each clip
const VSTRIDE = 7;         // every Nth vertex — the extremes are what matter

const files = process.argv.slice(2);
if (!files.length) { console.error('usage: node tools/clipbounds.mjs <glb> [...]'); process.exit(1); }

for (const f of files) {
  const buf = await geometryOnly(f);
  const loader = new GLTFLoader();
  await MeshoptDecoder.ready;
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await new Promise((res, rej) =>
    loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', res, rej));

  const root = gltf.scene;
  const skins = [];
  root.traverse(o => { if (o.isSkinnedMesh) skins.push(o); });
  if (!skins.length) { console.log(`${f}: no skinned mesh`); continue; }

  const clips = gltf.animations || [];
  const mixer = new THREE.AnimationMixer(root);
  const v = new THREE.Vector3();

  // bind pose first, then every pose of every clip
  const per = new Map(skins.map(s => [s, { min: new THREE.Vector3(Infinity, Infinity, Infinity),
                                           max: new THREE.Vector3(-Infinity, -Infinity, -Infinity) }]));
  const sample = () => {
    root.updateMatrixWorld(true);
    for (const s of skins) {
      if (s.skeleton) s.skeleton.update();
      const n = s.geometry.attributes.position.count;
      const b = per.get(s);
      for (let i = 0; i < n; i += VSTRIDE) { s.getVertexPosition(i, v); b.min.min(v); b.max.max(v); }
    }
  };
  sample();                                          // the bind pose counts too
  for (const clip of clips) {
    const act = mixer.clipAction(clip); act.reset(); act.play();
    for (let k = 0; k <= STEPS; k++) {
      act.time = clip.duration * (k / STEPS);
      mixer.update(0);
      sample();
    }
    act.stop();
  }

  console.log(`\n${f}   ${clips.length} clips, ${skins.length} skinned mesh(es)`);
  console.log('  clips:', clips.map(c => `${c.name}(${c.duration.toFixed(2)}s)`).join(' '));
  for (const s of skins) {
    const b = per.get(s);
    const c = b.min.clone().add(b.max).multiplyScalar(0.5);
    const r = b.max.clone().sub(b.min).length() / 2;        // sphere through the corners
    // what the BIND pose alone would have given, for the comparison
    s.geometry.computeBoundingSphere();
    const bind = s.geometry.boundingSphere;
    console.log(`  ${(s.name || '(unnamed)').padEnd(10)} verts ${s.geometry.attributes.position.count}`);
    console.log(`     animated sphere  c=(${c.x.toFixed(3)}, ${c.y.toFixed(3)}, ${c.z.toFixed(3)})  r=${r.toFixed(3)}`);
    console.log(`     bind-pose sphere c=(${bind.center.x.toFixed(3)}, ${bind.center.y.toFixed(3)}, ${bind.center.z.toFixed(3)})  r=${bind.radius.toFixed(3)}`);
    console.log(`     animation needs ${(r / bind.radius).toFixed(2)}x the bind radius`);
  }
}
