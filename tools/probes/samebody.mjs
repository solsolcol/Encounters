/* v26.0: IS A BODY MADE AGAIN THE BODY THAT SHIPPED? (v14.16: new work is proven not to have silently changed what was
   there.) When a rigged file is made again with fewer takes (v5.20: an unused take is dropped at prep), everything that
   is KEPT must be what it was: every mesh's every attribute and its triangles, every picture's bytes, every material's
   numbers, the skeleton (each joint's name, its place under its parent, its inverse bind matrix), and every take both
   files have (each channel's times and values). Both files are read whole (meshopt decoded) and compared number for
   number.
     node tools/probes/samebody.mjs <before.glb> <after.glb> [...more pairs]
     node tools/probes/samebody.mjs --git=<rev> assets/e4ton.glb assets/e4deva.glb ...   (before = that file at <rev>)
   Prints for each pair: what is the same, the takes only the first has (dropped) and only the second has (new), and any
   difference in what both have. Exits 1 on any difference in a kept thing, or a take the second has that the first
   has not. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const h = (buf) => crypto.createHash('sha1').update(Buffer.from(buf.buffer || buf, buf.byteOffset || 0, buf.byteLength)).digest('hex').slice(0, 12);
const acc = (a) => (a ? `${a.getType()}/${a.getComponentType()}/${a.getNormalized() ? 'n' : ''}/${a.getCount()}/${h(a.getArray())}` : '-');

async function facts(file) {
  const doc = await io.read(file), root = doc.getRoot(), F = { meshes: {}, images: {}, materials: {}, skins: {}, nodes: {}, takes: {} };
  root.listMeshes().forEach((m, i) => { m.listPrimitives().forEach((p, j) => { const o = { index: acc(p.getIndices()), mode: p.getMode(), mat: p.getMaterial() ? p.getMaterial().getName() : '' };
    for (const s of p.listSemantics()) o[s] = acc(p.getAttribute(s)); F.meshes[`${m.getName() || i}#${j}`] = JSON.stringify(o); }); });
  root.listTextures().forEach((t, i) => { const im = t.getImage(); F.images[`${t.getName() || i}`] = `${t.getMimeType()}/${im ? im.byteLength : 0}/${im ? h(im) : '-'}`; });
  root.listMaterials().forEach((m, i) => { F.materials[m.getName() || i] = JSON.stringify([m.getBaseColorFactor(), m.getMetallicFactor(), m.getRoughnessFactor(), m.getEmissiveFactor(), m.getAlphaMode(), m.getAlphaCutoff(), m.getDoubleSided(),
    ['BaseColor', 'Normal', 'MetallicRoughness', 'Emissive', 'Occlusion'].map(k => { const t = m['get' + k + 'Texture'](); return t ? (t.getName() || root.listTextures().indexOf(t)) : null; })]); });
  root.listSkins().forEach((s, i) => { F.skins[s.getName() || i] = JSON.stringify([s.listJoints().map(j => j.getName()), acc(s.getInverseBindMatrices()), s.getSkeleton() ? s.getSkeleton().getName() : null]); });
  root.listNodes().forEach((n) => { const k = n.getName(); if (k in F.nodes) F.nodes[k + '~'] = 'TWICE'; F.nodes[k] = JSON.stringify([n.getTranslation(), n.getRotation(), n.getScale(), n.listChildren().map(c => c.getName()), n.getMesh() ? n.getMesh().getName() : null, n.getSkin() ? 1 : 0]); });
  root.listAnimations().forEach((a) => { const ch = {};
    for (const c of a.listChannels()) { const s = c.getSampler(); ch[`${c.getTargetNode() ? c.getTargetNode().getName() : '?'}.${c.getTargetPath()}`] = `${s.getInterpolation()}|${acc(s.getInput())}|${acc(s.getOutput())}`; }
    F.takes[a.getName()] = ch; });
  return F;
}
const args = process.argv.slice(2), git = (args.find(a => a.startsWith('--git=')) || '').slice(6), files = args.filter(a => !a.startsWith('--'));
const pairs = [];
if (git) { const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'samebody-'));
  for (const f of files) { const b = path.join(tmp, path.basename(f)); fs.writeFileSync(b, execFileSync('git', ['show', `${git}:${f}`], { maxBuffer: 1 << 30 })); pairs.push([b, f]); } }
else for (let i = 0; i + 1 < files.length; i += 2) pairs.push([files[i], files[i + 1]]);
if (!pairs.length) { console.error('usage: node tools/probes/samebody.mjs <before.glb> <after.glb> ... | --git=<rev> <file.glb> ...'); process.exit(2); }
let bad = 0;
for (const [fa, fb] of pairs) {
  const A = await facts(fa), B = await facts(fb), diff = [];
  for (const kind of ['meshes', 'images', 'materials', 'skins', 'nodes']) {
    const ka = Object.keys(A[kind]), kb = Object.keys(B[kind]);
    for (const k of ka) if (!(k in B[kind])) diff.push(`${kind}: ${k} is gone`); else if (A[kind][k] !== B[kind][k]) diff.push(`${kind}: ${k} differs`);
    for (const k of kb) if (!(k in A[kind])) diff.push(`${kind}: ${k} is new`);
  }
  const gone = Object.keys(A.takes).filter(k => !(k in B.takes)), fresh = Object.keys(B.takes).filter(k => !(k in A.takes)), kept = Object.keys(A.takes).filter(k => k in B.takes);
  for (const k of kept) { const a = A.takes[k], b = B.takes[k], ca = Object.keys(a), cb = Object.keys(b);
    const d = ca.filter(c => a[c] !== b[c]).concat(cb.filter(c => !(c in a)));
    if (d.length) diff.push(`take ${k}: ${d.length} of ${ca.length} channels differ (${d.slice(0, 3).join(', ')})`); }
  for (const k of fresh) diff.push(`take ${k} is new`);
  const sa = fs.statSync(fa).size, sb = fs.statSync(fb).size;
  console.log(`${path.basename(fb).padEnd(18)} ${Object.keys(A.meshes).length} mesh parts, ${Object.keys(A.images).length} pictures, ${Object.keys(A.nodes).length} nodes, ${kept.length} takes kept` +
    `${gone.length ? '; dropped: ' + gone.join(', ') : ''}; ${sa} -> ${sb} bytes (${((sb - sa) / 1024).toFixed(0)} KB): ${diff.length ? 'DIFFERS' : 'what is kept is the same'}`);
  for (const d of diff.slice(0, 12)) console.log('     ' + d);
  if (diff.length) bad++;
}
console.log(bad ? `${bad} of ${pairs.length} differ in something kept` : `all ${pairs.length}: every mesh, picture, material, joint and kept take the same`);
process.exit(bad ? 1 : 0);
