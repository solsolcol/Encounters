/* v8.0 — the step that has to happen BEFORE prepwoman.mjs on a character
   exported with FLAT normals, and the measurement that decides whether it
   does.

   Chad's nine-animation admin tee arrives at 593,914 triangles and 1,190,700
   vertices. That ratio is the tell: a closed mesh of 594k triangles has about
   297k vertices, and this one has exactly four times that — 297,665 unique
   POSITIONS, each duplicated 4.00 times. Measured, the reason is that every
   triangle carries its own normals (2000 of 2000 sampled triangles are
   flat-shaded). gltf-transform's weld() is bitwise across EVERY attribute, so
   a per-face normal makes every vertex unique, nothing welds, and meshopt's
   simplifier — which will not collapse an edge across an attribute seam —
   removed 1,151 triangles of 593,914 (0.2 %) at any ratio asked of it. The
   file came out at 45 MB with the polygon count untouched.

   The fix is not a bigger hammer on the simplifier. It is to stop lying to it
   about where the seams are:

   1. MEASURE first. A mesh whose sampled triangles are mostly flat-shaded is
      de-flattened; a smooth one is left completely alone (Chad's botak
      recruit measures 1 flat triangle in 2000 and passes straight through).
      The same law as preptree's up axis — the file is asked, not assumed.
   2. DROP the NORMAL attribute and weld. What is left to weld on is
      position, uv, joints and weights, so a real UV-island border still
      splits (13 % of the duplicate groups here have genuinely different UVs
      and stay split) and the texture cannot tear. Measured before doing it:
      within a duplicate group the SKINNING is identical in 60,001 of 60,001
      sampled groups, so welding cannot disturb the rig.
   3. RECOMPUTE normals, smooth. A character is a smooth-shaded object; the
      flat normals were an export artefact, and the model reads better after
      this, not worse.

   Usage: node tools/deflatten.mjs in.glb out.glb [force]
     force '1'  de-flatten even if the measurement says the mesh is smooth
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, prune } from '@gltf-transform/functions';
import fs from 'node:fs';

const [inp, outp, forceS = ''] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

const tris = () => {
  let n = 0;
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
    const i = p.getIndices();
    n += (i ? i.getCount() : p.getAttribute('POSITION').getCount()) / 3;
  }
  return n | 0;
};
const verts = () => {
  let n = 0;
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) n += p.getAttribute('POSITION').getCount();
  return n;
};

/* 1 — is it flat? Sample the corner normals of up to 2000 triangles per
   primitive: a flat-shaded triangle has the same normal at all three. */
let flat = 0, sampled = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const nrm = p.getAttribute('NORMAL')?.getArray();
  const idx = p.getIndices()?.getArray();
  if (!nrm || !idx) continue;
  for (let t = 0; t < 2000 && t * 3 + 2 < idx.length; t++) {
    const a = idx[t * 3], b = idx[t * 3 + 1], c = idx[t * 3 + 2];
    const same = Math.abs(nrm[a * 3] - nrm[b * 3]) < 1e-4 && Math.abs(nrm[a * 3 + 1] - nrm[b * 3 + 1]) < 1e-4
              && Math.abs(nrm[a * 3] - nrm[c * 3]) < 1e-4 && Math.abs(nrm[a * 3 + 1] - nrm[c * 3 + 1]) < 1e-4;
    if (same) flat++;
    sampled++;
  }
}
const share = sampled ? flat / sampled : 0;
console.log(`   flat-shaded ${flat}/${sampled} sampled triangles (${(share * 100).toFixed(1)} %)`);
if (share < 0.5 && forceS !== '1') {
  console.log('   smooth already — left untouched, copied through');
  fs.copyFileSync(inp, outp);
  process.exit(0);
}

const v0 = verts(), t0 = tris();
/* 2 — drop the normals so weld() has only position/uv/skin to agree on */
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) p.setAttribute('NORMAL', null);
await doc.transform(weld(), prune());
const v1 = verts();
/* 3 — and put SMOOTH ones back, by hand. gltf-transform's normals() is the
   wrong tool here and quietly undoes the whole point of step 2: it UNWELDS
   the primitive and writes per-face normals, which took the mesh straight
   back to 1,781,742 loose vertices with no index buffer at all, and the
   simplifier removed 589 triangles of 593,914 again. Area-weighted vertex
   normals are fifteen lines and exact: accumulate each triangle's cross
   product (its length IS twice the area, so the weighting comes free) at all
   three of its corners, then normalise. */
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const posA = p.getAttribute('POSITION'), idxA = p.getIndices();
  if (!posA || !idxA) continue;
  const pos = posA.getArray(), idx = idxA.getArray(), n = posA.getCount();
  const nr = new Float32Array(n * 3);
  for (let t = 0; t + 2 < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    nr[a] += cx; nr[a + 1] += cy; nr[a + 2] += cz;
    nr[b] += cx; nr[b + 1] += cy; nr[b + 2] += cz;
    nr[c] += cx; nr[c + 1] += cy; nr[c + 2] += cz;
  }
  for (let i = 0; i < n; i++) {
    const L = Math.hypot(nr[i * 3], nr[i * 3 + 1], nr[i * 3 + 2]) || 1;
    nr[i * 3] /= L; nr[i * 3 + 1] /= L; nr[i * 3 + 2] /= L;
  }
  p.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(nr)
    .setBuffer(doc.getRoot().listBuffers()[0]));
}

await io.write(outp, doc);
console.log(`   ${inp.split('/').pop()} -> ${outp.split('/').pop()}: ${(before / 1048576).toFixed(2)} MB -> `
  + `${(fs.statSync(outp).size / 1024) | 0} KB, verts ${v0} -> ${v1} (${(v0 / v1).toFixed(2)}x), tris ${t0} -> ${tris()}`);
