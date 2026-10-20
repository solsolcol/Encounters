/* v21.8 · a NEAR and a FAR level of one static scan in ONE file (v18.8's
   masters/v18.8/lod.mjs, made general). Node `<name>_near` is the input as it
   is; node `<name>_far` is a topology-free (sloppy) cut of the SAME vertices —
   only its index list differs, so the two levels share their vertex buffers
   and their maps, and the far level costs one index buffer.
     node tools/lodpair.mjs near.glb out.glb farTris name                    
   MODE=permissive cuts the far level with the regular simplifier in its
   PERMISSIVE mode instead (it may collapse across a UV seam where the two
   sides' coordinates are close, weighted by UV; ERR the error bound) — a
   scan's atlas of a thousand islands floors the strict simplifier, and the
   sloppy cut smears each island's colour into its neighbours'.            */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt, dequantize } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT, FT, NAME] = process.argv.slice(2);
if (!NAME) throw new Error('usage: lodpair.mjs near.glb out.glb farTris name');
const d = await io.read(IN);
await d.transform(dequantize());
const root = d.getRoot(), scene = root.listScenes()[0];
const meshNodes = root.listNodes().filter(n => n.getMesh());
if (meshNodes.length !== 1 || meshNodes[0].getMesh().listPrimitives().length !== 1) throw new Error('expects one mesh node with one primitive');
const node = meshNodes[0]; node.setName(`${NAME}_near`);
const p = node.getMesh().listPrimitives()[0];
const pos = p.getAttribute('POSITION'), I = new Uint32Array(p.getIndices().getArray());
const P = new Float32Array(pos.getCount() * 3), v = [0, 0, 0];
for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, v); P.set(v, 3 * i); }
/* LEVELS="mid:0.3:strict,far:40000:permissive" adds several levels at once (a share below 1, a triangle count
   above; strict keeps the seams, permissive may cross them, sloppy ignores topology) — every one an index list over
   the SAME vertices. Without it: one level, `<name>_far`, of FT triangles, cut by MODE (sloppy unless permissive). */
const uvA = p.getAttribute('TEXCOORD_0'), UV = new Float32Array(pos.getCount() * 2), w = [0, 0];
if (uvA) for (let i = 0; i < uvA.getCount(); i++) { uvA.getElement(i, w); UV[2 * i] = w[0]; UV[2 * i + 1] = w[1]; }
const W = +(process.env.UVW || 1), ERR = +(process.env.ERR || 0.02);
const cutTo = (tris, how) => {
  if (how === 'sloppy') return MeshoptSimplifier.simplifySloppy(I, P, 3, null, tris * 3, 0.02)[0];
  return MeshoptSimplifier.simplifyWithAttributes(I, P, 3, UV, 2, [W, W], null, tris * 3, how === 'strict' ? Math.max(ERR, 0.05) : ERR,
                                                  how === 'strict' ? [] : ['Permissive'])[0];
};
const specs = process.env.LEVELS ? process.env.LEVELS.split(',').map(x => x.split(':'))
  : [['far', FT, process.env.MODE === 'permissive' ? 'permissive' : 'sloppy']];
const report = [`near ${I.length / 3}`];
for (const [lv, amt, how] of specs) {
  const tris = +amt < 1 ? Math.floor(I.length / 3 * +amt) : Math.floor(+amt);
  const idx = cutTo(tris, how);
  const fp = d.createPrimitive().setMaterial(p.getMaterial()).setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint32Array(idx)).setBuffer(root.listBuffers()[0]));
  for (const s of p.listSemantics()) fp.setAttribute(s, p.getAttribute(s));
  const fn = d.createNode(`${NAME}_${lv}`).setMesh(d.createMesh(`${NAME}_${lv}`).addPrimitive(fp));
  fn.setTranslation(node.getTranslation()).setRotation(node.getRotation()).setScale(node.getScale());
  (node.getParentNode() || scene).addChild(fn);
  report.push(`${lv} ${idx.length / 3} (${how})`);
}
console.log(`lodpair ${NAME}: ${report.join(', ')}`);
await d.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, d);
