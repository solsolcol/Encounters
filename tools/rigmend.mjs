/* v28.0 · RIGMEND: a generated rig's stray bones taken out HERE, at no credits, their skin given to the bones a man's body
 * has (the collector's rig came back from Meshy with 52 joints: eighteen bones the library's takes never move, holding his
 * chest, sides, belt and feet, and each hand one piece with one finger chain; masters/v28.0/people/RECORD.md section 3).
 *
 *   node tools/rigmend.mjs <rigged.glb> <out.glb> <map.json>
 *
 * map.json: { "drop": { "<bone>": "<kept bone>", ... }, "fold": { "<bone>": "<kept bone>", ... } }
 *   drop  the bone leaves the skeleton: its share of every point goes to the kept bone named, and its node is taken out
 *         (every bone under a dropped one must be dropped too, or the tool refuses);
 *   fold  the bone stays in the skeleton (a take may still turn it) but carries nothing: its share goes to the bone named.
 * A point's shares are summed per kept bone, the four largest kept and made to sum to one (as glTF asks). Nothing else in
 * the file changes: the mesh, its sheets, every kept bone's rest and inverse bind matrix pass through as they are.
 * Prints, for each bone dropped or folded, how many points it held and where they went, and the joint count before and
 * after. A new tool: nothing earlier runs through it.
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const die = m => { console.error('rigmend: ' + m); process.exit(1); };
const [inP, outP, mapP] = process.argv.slice(2);
if (!inP || !outP || !mapP) die('rigmend <rigged.glb> <out.glb> <map.json>');
const MAP = JSON.parse(fs.readFileSync(mapP, 'utf8')), DROP = MAP.drop || {}, FOLD = MAP.fold || {};
const doc = await io.read(inP), root = doc.getRoot();
const skins = root.listSkins(); if (skins.length !== 1) die('one skin expected, found ' + skins.length);
const skin = skins[0], J = skin.listJoints(), byName = new Map(J.map(j => [j.getName(), j]));
for (const n of [...Object.keys(DROP), ...Object.keys(FOLD)]) if (!byName.has(n)) die('no bone named ' + n);
const finalOf = (n) => { const seen = new Set(); while (DROP[n] || FOLD[n]) { if (seen.has(n)) die('a loop at ' + n); seen.add(n); n = DROP[n] || FOLD[n]; } return n; };
for (const n of [...Object.keys(DROP), ...Object.keys(FOLD)]) { const t = finalOf(n); if (!byName.has(t)) die(n + ' -> ' + t + ': no such bone'); if (DROP[t]) die(n + ' ends on a dropped bone'); }
/* every bone under a dropped bone is dropped too */
for (const n of Object.keys(DROP)) for (const c of byName.get(n).listChildren()) if (byName.has(c.getName()) && !DROP[c.getName()]) die(c.getName() + ' hangs from ' + n + ', which is dropped');
const kept = J.filter(j => !DROP[j.getName()]), newIdx = new Map(kept.map((j, i) => [j, i]));
const toNew = J.map(j => newIdx.get(byName.get(finalOf(j.getName()))));
/* the inverse bind matrices of the kept bones, in their new order */
const ibm = skin.getInverseBindMatrices(), IA = ibm.getArray(), NI = new Float32Array(kept.length * 16);
kept.forEach((j, i) => NI.set(IA.subarray(J.indexOf(j) * 16, J.indexOf(j) * 16 + 16), i * 16));
const report = new Map(); let pts = 0, worst = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const ja = p.getAttribute('JOINTS_0'), wa = p.getAttribute('WEIGHTS_0'); if (!ja) continue;
  if (p.getAttribute('JOINTS_1')) die('a second set of joints: not handled');
  const n = ja.getCount(), JO = new (kept.length > 255 ? Uint16Array : Uint8Array)(n * 4), WO = new Float32Array(n * 4);
  const a = [], b = [];
  for (let v = 0; v < n; v++) {
    ja.getElement(v, a); wa.getElement(v, b); pts++;
    const acc = new Map();
    for (let k = 0; k < 4; k++) { if (!(b[k] > 0)) continue; const o = J[a[k]].getName(), t = toNew[a[k]];
      acc.set(t, (acc.get(t) || 0) + b[k]);
      if (o !== kept[t].getName()) { let r = report.get(o); if (!r) report.set(o, r = { pts: 0, share: 0, to: kept[t].getName() }); r.pts++; r.share += b[k]; } }
    const top = [...acc].sort((x, y) => y[1] - x[1]).slice(0, 4), s = top.reduce((x, y) => x + y[1], 0) || 1;
    top.forEach(([t, w], k) => { JO[v * 4 + k] = t; WO[v * 4 + k] = w / s; });
    const sum = WO[v * 4] + WO[v * 4 + 1] + WO[v * 4 + 2] + WO[v * 4 + 3]; worst = Math.max(worst, Math.abs(sum - 1));
  }
  const buf = ja.getBuffer();
  p.setAttribute('JOINTS_0', doc.createAccessor().setType('VEC4').setArray(JO).setBuffer(buf));
  p.setAttribute('WEIGHTS_0', doc.createAccessor().setType('VEC4').setArray(WO).setBuffer(buf));
  if (ja.listParents().length <= 1) ja.dispose(); if (wa.listParents().length <= 1) wa.dispose();
}
for (const j of J) if (DROP[j.getName()]) skin.removeJoint(j);
skin.setInverseBindMatrices(doc.createAccessor().setType('MAT4').setArray(NI).setBuffer(ibm.getBuffer()));
if (ibm.listParents().length <= 1) ibm.dispose();
/* a dropped bone's node out of the tree (its tracks with it: a rigged file carries none, and any found are refused) */
for (const a of root.listAnimations()) for (const ch of a.listChannels()) if (ch.getTargetNode() && DROP[ch.getTargetNode().getName()]) die('a take moves ' + ch.getTargetNode().getName() + ': mend the rig before its takes are laid on');
for (const j of J) if (DROP[j.getName()]) { const par = j.getParentNode(); if (par) par.removeChild(j); for (const s of root.listScenes()) s.removeChild(j); j.dispose(); }
await io.write(outP, doc);
for (const [o, r] of report) console.log(`  ${o.padEnd(18)} ${String(r.pts).padStart(6)} points (summed share ${r.share.toFixed(0)}) -> ${r.to}${DROP[o] ? '' : '  (kept, now carries nothing)'}`);
console.log(`rigmend: ${J.length} joints -> ${kept.length}; ${pts} points, every point's four shares summing to one within ${worst.toExponential(1)}; wrote ${outP} ${fs.statSync(outP).size} bytes`);
