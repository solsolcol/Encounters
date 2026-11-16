import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const root = doc.getRoot();
for (const a of root.listAnimations()) { let d = 0; for (const s of a.listSamplers()) { const t = s.getInput().getArray(); d = Math.max(d, t[t.length - 1]); } console.log('take', a.getName(), d.toFixed(2) + 's', a.listChannels().length + ' ch'); }
const names = new Set(); for (const sk of root.listSkins()) for (const j of sk.listJoints()) names.add(j.getName());
const groups = {}; for (const n of names) { const k = n.replace(/[_\d]+$/g, '').replace(/\d+/g, '#'); groups[k] = (groups[k] || 0) + 1; }
console.log('joints', names.size); console.log(Object.entries(groups).map(([k, v]) => k + (v > 1 ? ' x' + v : '')).join(', '));
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) console.log('mesh', m.getName(), 'tris', (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 'mat', p.getMaterial() && p.getMaterial().getName());
