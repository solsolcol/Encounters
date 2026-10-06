/* v18.8 · the mid and far levels of Chad's Buddha in ONE file: node `buddha_mid`
   is the smoothed 120k cut, node `buddha_far` a topology-free (sloppy) cut of
   the SAME vertices — only its index list differs, so the two levels share
   their vertex buffers and their maps.
   node masters/v18.8/lod.mjs mid.glb out.glb farTris */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt, dequantize } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT, FT] = process.argv.slice(2);
const d = await io.read(IN);
await d.transform(dequantize());
const root = d.getRoot(), scene = root.listScenes()[0];
const node = root.listNodes().find(n => n.getMesh());
node.setName('buddha_mid');
const mesh = node.getMesh(), p = mesh.listPrimitives()[0];
const pos = p.getAttribute('POSITION'), I = new Uint32Array(p.getIndices().getArray());
const P = new Float32Array(pos.getCount() * 3), v = [0, 0, 0];
for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, v); P.set(v, 3 * i); }
const [far] = MeshoptSimplifier.simplifySloppy(I, P, 3, null, Math.floor(+FT) * 3, 0.02);
const fp = d.createPrimitive().setMaterial(p.getMaterial()).setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint32Array(far)).setBuffer(root.listBuffers()[0]));
for (const s of p.listSemantics()) fp.setAttribute(s, p.getAttribute(s));
const fn = d.createNode('buddha_far').setMesh(d.createMesh('buddha_far').addPrimitive(fp));
fn.setTranslation(node.getTranslation()).setRotation(node.getRotation()).setScale(node.getScale());
(node.getParentNode() || scene).addChild(fn);
console.log('mid', I.length / 3, 'far', far.length / 3);
await d.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, d);
