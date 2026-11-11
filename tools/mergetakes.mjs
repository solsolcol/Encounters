/* v26.0 — a Meshy rig and its takes, put together OFFLINE.
 *
 * Meshy's rigging API hands back one GLB of the rigged body (rigged_character_glb_url) and its animation API hands
 * back, for every request, ANOTHER whole copy of that body (the same mesh, the same 8k sheets, byte for byte: measured
 * on the first man, masters/v26.0/make.sh) with the asked takes laid on its bones. A person with thirty takes would
 * be thirty copies of himself. So:
 *
 *   strip <take.glb> <out.glb> [rig.glb]   keeps the take file's bones and animations and nothing else (a few hundred
 *                                          KB). With rig.glb given it first PROVES the take file's mesh and every image
 *                                          are the rig file's own bytes, and refuses (exit 1) if one is not: only a
 *                                          copy is ever dropped, never something the rig file does not hold.
 *                                          --same-rig: for a file of several library takes, which is a re-export of
 *                                          the body and not its bytes; proves every bone's name and rest pose, the
 *                                          triangle count and the bounds are the rig file's instead.
 *   merge <rig.glb> <out.glb> <takes.glb>[:Name,Name,...] ...
 *                                          lays every animation of every takes file onto the rig file's bones BY NAME
 *                                          (the same rig task: the same bones; a bone the rig lacks is an error, and a
 *                                          rest pose that differs is reported), named as given, in the file's order.
 *                                          A name left empty keeps the file's own; "-" skips that animation.
 *   list <file.glb>                        what a file holds.
 *
 * Nothing here simplifies, resamples or re-encodes anything: the rig's mesh and sheets pass through as they are.
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import crypto from 'node:crypto';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [cmd, ...args] = process.argv.slice(2);
const sha = b => crypto.createHash('sha1').update(b).digest('hex').slice(0, 16);
const die = m => { console.error('mergetakes: ' + m); process.exit(1); };

function bodyPrint(doc) {            // what makes a body the same body: every image's bytes, every primitive's points
  const root = doc.getRoot(), out = [];
  for (const t of root.listTextures()) out.push('img:' + t.getMimeType() + ':' + sha(Buffer.from(t.getImage())));
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
    const a = p.getAttribute('POSITION').getArray();
    out.push('pos:' + a.length / 3 + ':' + sha(Buffer.from(a.buffer, a.byteOffset, a.byteLength)));
    const idx = p.getIndices().getArray();
    out.push('idx:' + idx.length / 3 + ':' + sha(Buffer.from(idx.buffer, idx.byteOffset, idx.byteLength)));
  }
  return out.sort();
}
function describe(doc) {
  const root = doc.getRoot();
  return {
    nodes: root.listNodes().length,
    joints: root.listSkins().map(s => s.listJoints().length),
    tris: root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + p.getIndices().getCount() / 3, 0), 0),
    images: root.listTextures().map(t => `${t.getMimeType()} ${(t.getImage().byteLength / 1048576).toFixed(1)}MB ${t.getSize()?.join('x')}`),
    anims: root.listAnimations().map(a => {
      let end = 0; for (const s of a.listSamplers()) { const t = s.getInput().getArray(); end = Math.max(end, t[t.length - 1]); }
      return `${a.getName()} (${a.listChannels().length} ch, ${end.toFixed(2)} s)`;
    }),
  };
}

const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function mul(a, b) { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let v = 0; for (let k = 0; k < 4; k++) v += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = v; } return o; }
function inv(m) {                     // a rigid transform's inverse (rotation and translation; a scale is refused)
  const sx = Math.hypot(m[0], m[1], m[2]), sy = Math.hypot(m[4], m[5], m[6]), sz = Math.hypot(m[8], m[9], m[10]);
  if (Math.abs(sx - 1) > 1e-4 || Math.abs(sy - 1) > 1e-4 || Math.abs(sz - 1) > 1e-4) die('a scaled parent: ' + [sx, sy, sz]);
  const o = [m[0], m[4], m[8], 0, m[1], m[5], m[9], 0, m[2], m[6], m[10], 0, 0, 0, 0, 1];
  o[12] = -(o[0] * m[12] + o[4] * m[13] + o[8] * m[14]); o[13] = -(o[1] * m[12] + o[5] * m[13] + o[9] * m[14]); o[14] = -(o[2] * m[12] + o[6] * m[13] + o[10] * m[14]);
  return o;
}
function decomp(m) {                  // a rigid 4x4 -> { q, t }
  const tr = m[0] + m[5] + m[10]; let q;
  if (tr > 0) { const S = Math.sqrt(tr + 1) * 2; q = [(m[6] - m[9]) / S, (m[8] - m[2]) / S, (m[1] - m[4]) / S, S / 4]; }
  else if (m[0] > m[5] && m[0] > m[10]) { const S = Math.sqrt(1 + m[0] - m[5] - m[10]) * 2; q = [S / 4, (m[4] + m[1]) / S, (m[8] + m[2]) / S, (m[6] - m[9]) / S]; }
  else if (m[5] > m[10]) { const S = Math.sqrt(1 + m[5] - m[0] - m[10]) * 2; q = [(m[4] + m[1]) / S, S / 4, (m[9] + m[6]) / S, (m[8] - m[2]) / S]; }
  else { const S = Math.sqrt(1 + m[10] - m[0] - m[5]) * 2; q = [(m[8] + m[2]) / S, (m[9] + m[6]) / S, S / 4, (m[1] - m[4]) / S]; }
  return { q, t: [m[12], m[13], m[14]] };
}
function qmul(a, b) { return [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]]; }
function rotv(q, v) { const p = qmul(qmul(q, [v[0], v[1], v[2], 0]), [-q[0], -q[1], -q[2], q[3]]); return [p[0], p[1], p[2]]; }

if (cmd === 'list') {
  for (const p of args) console.log(p, JSON.stringify(describe(await io.read(p)), null, 1));
} else if (cmd === 'strip') {
  const [inP, outP, rigP] = args.filter(x => !x.startsWith('--'));
  if (!inP || !outP) die('strip <take.glb> <out.glb> [rig.glb] [--same-rig]');
  const doc = await io.read(inP), root = doc.getRoot();
  if (!root.listAnimations().length) die(inP + ' holds no animation');
  if (rigP) {
    const rig = await io.read(rigP);
    const a = bodyPrint(doc), b = bodyPrint(rig);
    const same = a.length === b.length && a.every((x, i) => x === b[i]);
    if (same) console.log('body identical to', rigP, '(' + a.length + ' prints)');
    else if (!process.argv.includes('--same-rig')) die(`${inP} is NOT a copy of ${rigP}'s body: nothing dropped\n  take ${a.join(' ')}\n  rig  ${b.join(' ')}`);
    else {
      /* a file with several library takes is a RE-EXPORT of the body (measured on the first man: its metal-roughness
         sheet a PNG where the rig file's is a JPEG, four more vertices, the same triangles). What must be the rig
         file's own is what the takes are laid on: every bone's name and rest pose, the triangle count, the bounds. */
      const rb = new Map(rig.getRoot().listNodes().map(n => [n.getName(), n]));
      const d = (x, y) => Math.max(...x.map((v, i) => Math.abs(v - y[i])));
      /* a bone rests at the same place (a fifth of a millimetre) and turned the same way (a thousandth in any term of
         its matrix, about a twentieth of a degree: a re-export writes its finger tips' turns anew, and two of sixty-seven
         came back 0.0004 off on a man whose every bone stood exactly in place) */
      const restOff = (x, y) => Math.max(Math.hypot(x[12] - y[12], x[13] - y[13], x[14] - y[14]) / 2e-4,
        Math.max(...[0, 1, 2, 4, 5, 6, 8, 9, 10].map(i => Math.abs(x[i] - y[i]))) / 1e-3);
      let bad = [];
      const bones = new Set(root.listSkins().flatMap(k => k.listJoints()));
      if (!bones.size) bad.push('no skin');
      for (const n of bones) {                       // where each bone RESTS IN THE WORLD (a re-export may stand its armature on another axis)
        const t = rb.get(n.getName());
        if (!t) { bad.push(n.getName() + ' (not in the rig)'); continue; }
        if (restOff(n.getWorldMatrix(), t.getWorldMatrix()) > 1) bad.push(n.getName());
      }
      const tri = dd => dd.getRoot().listMeshes().reduce((x, m) => x + m.listPrimitives().reduce((y, q) => y + q.getIndices().getCount() / 3, 0), 0);
      const box = dd => { const q = dd.getRoot().listMeshes()[0].listPrimitives()[0].getAttribute('POSITION'); return [...q.getMin([]), ...q.getMax([])]; };
      if (tri(doc) !== tri(rig)) bad.push('triangles ' + tri(doc) + ' vs ' + tri(rig));
      if (d(box(doc), box(rig)) > 2e-3) bad.push('bounds ' + box(doc).map(v => v.toFixed(3)) + ' vs ' + box(rig).map(v => v.toFixed(3)));
      if (bad.length) die(`${inP} is not ${rigP}'s rig: ${bad.slice(0, 12).join(', ')}`);
      const imgs = x => x.filter(v => v.startsWith('img:'));
      console.log('a re-export of', rigP + ':', bones.size, 'bones at the same rest pose in the world,', tri(doc), 'triangles, the same bounds;',
        imgs(a).filter(v => imgs(b).includes(v)).length, 'of', imgs(a).length, 'images byte-identical');
    }
  }
  for (const n of root.listNodes()) { n.setMesh(null); n.setSkin(null); }
  root.listMeshes().forEach(m => m.dispose()); root.listSkins().forEach(s => s.dispose());
  root.listMaterials().forEach(m => m.dispose()); root.listTextures().forEach(t => t.dispose());
  await doc.transform(prune({ keepLeaves: true, keepAttributes: true }));
  await io.write(outP, doc);
  console.log('wrote', outP, fs.statSync(outP).size, 'bytes', JSON.stringify(describe(doc).anims));
} else if (cmd === 'merge') {
  const [rigP, outP, ...takes] = args;
  if (!rigP || !outP || !takes.length) die('merge <rig.glb> <out.glb> <takes.glb>[:Name,...] ...');
  const tgt = await io.read(rigP), tRoot = tgt.getRoot();
  const byName = new Map();
  for (const n of tRoot.listNodes()) { if (byName.has(n.getName())) die('two bones named ' + n.getName()); byName.set(n.getName(), n); }
  const buffer = tRoot.listBuffers()[0] || tgt.createBuffer();
  const have = new Set(tRoot.listAnimations().map(a => a.getName()));
  const restDiff = [];
  for (const spec of takes) {
    const cut = spec.lastIndexOf(':'), isNamed = cut > 1 && !spec.slice(cut).includes('/');
    const p = isNamed ? spec.slice(0, cut) : spec, names = isNamed ? spec.slice(cut + 1).split(',') : [];
    const src = await io.read(p), anims = src.getRoot().listAnimations();
    if (names.length > anims.length) die(`${p} holds ${anims.length} animations, ${names.length} names given`);
    /* the same rig, the same rest pose IN THE WORLD. A file of several library takes is a re-export whose armature
       stands on another axis (a quarter turn about x, its hips' rest and tracks written in that frame): a bone whose
       parent rests differently in the two files has its tracks re-expressed, REL = rigParentWorld^-1 * takeParentWorld,
       a rotation and a translation (a scale there would be refused). Every other bone's tracks are its own. */
    const rel = new Map();
    for (const n of src.getRoot().listNodes()) {
      const t = byName.get(n.getName()); if (!t) continue;
      const d = (a, b) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));
      if (d(n.getWorldMatrix(), t.getWorldMatrix()) > 2e-4) restDiff.push(n.getName());
      const sp = n.getParentNode(), tp = t.getParentNode();
      if (!sp || !tp) continue;
      const m = mul(inv(tp.getWorldMatrix()), sp.getWorldMatrix());
      if (d(m, IDENT) > 1e-3) rel.set(n.getName(), decomp(m));      // an axis change is of order 1; a deep chain's float noise 1e-5
    }
    if (rel.size) console.log(p + ':', [...rel.keys()].join(', '), 're-expressed in the rig file\'s frame');
    anims.forEach((a, i) => {
      const name = (names[i] || '').trim() || a.getName();
      if (name === '-') return;
      if (have.has(name)) die('a take named ' + name + ' twice'); have.add(name);
      const out = tgt.createAnimation(name);
      const samplers = new Map();
      for (const ch of a.listChannels()) {
        const node = ch.getTargetNode(), tn = node && byName.get(node.getName());
        if (!tn) die(`${p}: take ${a.getName()} moves ${node && node.getName()}, which the rig lacks`);
        const s = ch.getSampler();
        let ns = samplers.get(s);
        const R = rel.get(node.getName()), path = ch.getTargetPath();
        if (R && s.getInterpolation() === 'CUBICSPLINE') die('a cubic track on a re-expressed bone: ' + node.getName());
        if (!ns || R) {
          const copy = acc => tgt.createAccessor().setType(acc.getType()).setArray(acc.getArray().slice()).setBuffer(buffer);
          const outAcc = copy(s.getOutput());
          if (R) {
            const a = outAcc.getArray();
            if (path === 'translation') for (let k = 0; k < a.length; k += 3) { const v = rotv(R.q, [a[k], a[k + 1], a[k + 2]]); a[k] = v[0] + R.t[0]; a[k + 1] = v[1] + R.t[1]; a[k + 2] = v[2] + R.t[2]; }
            else if (path === 'rotation') for (let k = 0; k < a.length; k += 4) { const q = qmul(R.q, [a[k], a[k + 1], a[k + 2], a[k + 3]]); a[k] = q[0]; a[k + 1] = q[1]; a[k + 2] = q[2]; a[k + 3] = q[3]; }
            outAcc.setArray(a);
          }
          ns = tgt.createAnimationSampler().setInput(copy(s.getInput())).setOutput(outAcc).setInterpolation(s.getInterpolation());
          if (!R) samplers.set(s, ns);
          out.addSampler(ns);
        }
        out.addChannel(tgt.createAnimationChannel().setTargetNode(tn).setTargetPath(ch.getTargetPath()).setSampler(ns));
      }
    });
  }
  if (restDiff.length) console.log('NOTE: resting at another place IN THE WORLD in a takes file than in the rig file:', [...new Set(restDiff)].join(', '));
  await io.write(outP, tgt);
  console.log('wrote', outP, fs.statSync(outP).size, 'bytes'); console.log(JSON.stringify(describe(tgt).anims, null, 0));
} else die('list | strip | merge');
