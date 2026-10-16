/* v19.6 · what each of Chad's congregation files actually holds: the rig's bones,
   the meshes and triangles, the materials and their maps, the clips (name,
   length, how many tracks, whether the hips travel), and the units */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f), root = doc.getRoot();
  const tris = root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0), 0);
  const skins = root.listSkins();
  const joints = skins[0] ? skins[0].listJoints().map(j => j.getName()) : [];
  const pos = []; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); pos.push([a.getMin([]), a.getMax([])]); }
  const clips = root.listAnimations().map(a => {
    const ch = a.listChannels(); let len = 0;
    for (const s of a.listSamplers()) { const t = s.getInput(); len = Math.max(len, t.getMax([])[0]); }
    const hips = ch.find(c => /hips/i.test(c.getTargetNode()?.getName() || '') && c.getTargetPath() === 'translation');
    let travel = null;
    if (hips) { const o = hips.getSampler().getOutput(), n = o.getCount(), a0 = o.getElement(0, []), a1 = o.getElement(n - 1, []); travel = a0.map((v, i) => +(a1[i] - v).toFixed(3)); }
    return { name: a.getName(), len: +len.toFixed(2), tracks: ch.length, hipsTravel: travel };
  });
  const scaleNode = root.listNodes().filter(n => n.getScale().some(v => Math.abs(v - 1) > 1e-3)).slice(0, 3).map(n => [n.getName(), n.getScale().map(v => +v.toFixed(4))]);
  console.log(JSON.stringify({ file: f.split('/').pop(), meshes: root.listMeshes().length, tris, skins: skins.length, joints: joints.length,
    jointSample: joints.slice(0, 6).concat(joints.filter(j => /Head|Hand$|Spine2|Neck/i.test(j))),
    materials: root.listMaterials().map(m => [m.getName(), !!m.getBaseColorTexture(), !!m.getNormalTexture(), !!m.getMetallicRoughnessTexture()]),
    textures: root.listTextures().map(t => [t.getMimeType(), t.getSize()]),
    bounds: pos.slice(0, 2).map(([a, b]) => a.map((v, i) => +(b[i] - v).toFixed(3))), scaled: scaleNode, clips }));
}
