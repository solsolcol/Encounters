import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const P = new URLSearchParams(location.search);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(700, 520);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x20242a);
const cam = new THREE.PerspectiveCamera(38, 700 / 520, 0.01, 200);
scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x3a3026, 2.0));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(2, 4, 3); scene.add(key);
const fill = new THREE.DirectionalLight(0xffffff, 0.8); fill.position.set(-3, 1.5, -2); scene.add(fill);
const grid = new THREE.GridHelper(4, 16, 0x556070, 0x333a44); scene.add(grid);
const ax = new THREE.AxesHelper(0.6); scene.add(ax);          // red +x, green +y, blue +z
window.__done = false;
new GLTFLoader().load(P.get('m'), (gltf) => {
  const g = gltf.scene;
  if (P.get('rx')) g.rotation.x = +P.get('rx');
  if (P.get('rz')) g.rotation.z = +P.get('rz');
  if (P.get('ry')) g.rotation.y = +P.get('ry');
  g.updateMatrixWorld(true);
  let b = new THREE.Box3().setFromObject(g);
  const size = b.getSize(new THREE.Vector3());
  const target = +(P.get('h') || 1.0);                        // normalise the tall axis
  const s = target / Math.max(size.y, 1e-6);
  g.scale.setScalar(s);
  g.updateMatrixWorld(true);
  b = new THREE.Box3().setFromObject(g);
  g.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
  scene.add(g);
  if (gltf.animations.length) { const mx = new THREE.AnimationMixer(g);
    mx.clipAction(gltf.animations[0]).play(); mx.update(+(P.get('t') || 1.2)); }
  g.updateMatrixWorld(true);
  const b2 = new THREE.Box3().setFromObject(g);
  const sz = b2.getSize(new THREE.Vector3());
  const r = Math.max(sz.x, sz.y, sz.z);
  const a = +(P.get('a') || 0.9), el = +(P.get('e') || 0.45);
  cam.position.set(Math.sin(a) * r * 2.1, sz.y * 0.55 + Math.sin(el) * r * 1.4, Math.cos(a) * r * 2.1);
  cam.lookAt(0, sz.y * 0.45, 0);
  renderer.render(scene, cam);
  window.__info = { size: sz.toArray().map(v => +v.toFixed(3)), meshes: 0, anims: gltf.animations.map(x => x.name) };
  g.traverse(o => { if (o.isMesh) window.__info.meshes++; });
  window.__done = true;
}, undefined, (e) => { window.__err = String(e); window.__done = true; });
