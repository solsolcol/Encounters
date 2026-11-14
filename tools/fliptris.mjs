/* v26.12 · REPORT ONLY. NEVER USED TO FIX: turning these triangles made a body WORSE. Chad, 14 Nov 2026, of the 63 files
   it was run over and checked only by numbers: "I think your fix without visually checking the models is a little
   dangerous, you sometimes add more problems than you fix". Photographed before and after (tools/probes/flipshot.mjs),
   most places were the same or a little better, and some worse: on Ton's far body a smooth white collar became a dark
   wedge with a black band across it. Every body here is drawn TWO-SIDED, so a turned triangle is never a hole; turning
   it changes only which way it is lit, and where the body's own normals point the wrong way (a fold, a collar's turn),
   the triangle the test calls turned is the one wound RIGHT, and turning it darkens it. All 63 files were put back as
   they were. The fault, where it is one, is in the normals, not the winding. What follows is the tool as written, its
   writing taken out: it lists, it changes nothing.
   (as first written:) TRIANGLES WOUND BACKWARDS, TURNED ROUND (Chad, 14 Nov 2026, of a woman's hair in episode 4 chapter 3, a few
   triangles drawn dark from inside: "Fix and check all (Recommended)"). A generated body carries triangles wound the other
   way from the surface they sit in: drawn one-sided, each is a hole that shows the inside of the shell behind it, dark
   (tools/probes/openings.mjs lists them by their corners' normals). A triangle is TURNED here when its winding disagrees
   with its corners' own normals by more than 120 degrees (the face's normal against their sum: below -0.5): no crease
   comes near that (at a fold of 150 degrees a face stands some 75 from the normals its corners share), so what is
   caught is a sliver the simplifier FOLDED OVER, whose corners crossed: measured on the chapter's 63 body files, every
   one of them is wound WITH its neighbours across their shared edges (the neighbours' test, reported beside it, calls
   almost none turned) while it faces into the body, so drawn one-sided it is culled and leaves a dark hole. The bodies'
   normals are the prepared surface's own (prepmonk shares them across seams), so they are the truth here.
   Turning it swaps two of its corners in the index list: no corner, normal, colour or coordinate is touched, and every
   other triangle keeps its exact place in the list. Each primitive's report: triangles, those its normals call turned,
   those its neighbours call turned, those turned.
     node tools/fliptris.mjs <in.glb>     (report only: an out file is refused) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [inp, outp] = process.argv.slice(2);
if (!inp) { console.error('usage: node tools/fliptris.mjs <in.glb>'); process.exit(2); }
if (outp) { console.error('fliptris writes nothing: turning these triangles darkened a body (see the note at the top)'); process.exit(2); }
const doc = await io.read(inp);
let total = { tris: 0, byNormal: 0, byNeighbour: 0, turned: 0 };
for (const mesh of doc.getRoot().listMeshes()) mesh.listPrimitives().forEach((prim, pi) => {
  const a = prim.getAttribute('POSITION'), nA = prim.getAttribute('NORMAL'), ixA = prim.getIndices();
  if (!a || !ixA || prim.getMode() !== 4) return;
  const n = a.getCount(), P = new Float64Array(n * 3), v = [0, 0, 0];
  for (let i = 0; i < n; i++) { a.getElement(i, v); P[i * 3] = v[0]; P[i * 3 + 1] = v[1]; P[i * 3 + 2] = v[2]; }
  /* (the corners welded by place: the scale a quantized attribute is drawn at does not matter, only which corners meet) */
  let ext = 0; for (let i = 0; i < n * 3; i++) ext = Math.max(ext, Math.abs(P[i]));
  const q = ext > 0 ? 1e4 / Math.max(ext / 2, 1e-6) : 1e4;
  const key = new Map(), id = new Int32Array(n);
  for (let i = 0; i < n; i++) { const k = Math.round(P[i * 3] * q) + ',' + Math.round(P[i * 3 + 1] * q) + ',' + Math.round(P[i * 3 + 2] * q); if (!key.has(k)) key.set(k, i); id[i] = key.get(k); }
  const ix = ixA.getArray(), T = ix.length / 3;
  /* each directed edge (welded) -> the triangles that run it that way */
  const dir = new Map();
  for (let t = 0; t < T; t++) for (let e = 0; e < 3; e++) { const p = id[ix[t * 3 + e]], r = id[ix[t * 3 + (e + 1) % 3]]; if (p === r) continue;
    const k = p + '>' + r; const l = dir.get(k); if (l) l.push(t); else dir.set(k, [t]); }
  const byNormal = new Uint8Array(T), turn = [];
  let nN = 0, nB = 0;
  for (let t = 0; t < T; t++) {
    const i0 = ix[t * 3], i1 = ix[t * 3 + 1], i2 = ix[t * 3 + 2];
    if (nA) {
      const ux = P[i1 * 3] - P[i0 * 3], uy = P[i1 * 3 + 1] - P[i0 * 3 + 1], uz = P[i1 * 3 + 2] - P[i0 * 3 + 2];
      const vx = P[i2 * 3] - P[i0 * 3], vy = P[i2 * 3 + 1] - P[i0 * 3 + 1], vz = P[i2 * 3 + 2] - P[i0 * 3 + 2];
      let fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx; const fl = Math.hypot(fx, fy, fz);
      if (fl > 1e-20) { fx /= fl; fy /= fl; fz /= fl; const N = [0, 0, 0], m = [0, 0, 0];
        for (const i of [i0, i1, i2]) { nA.getElement(i, N); m[0] += N[0]; m[1] += N[1]; m[2] += N[2]; }
        const ml = Math.hypot(m[0], m[1], m[2]); if (ml > 1e-9 && (fx * m[0] + fy * m[1] + fz * m[2]) / ml < -0.5) { byNormal[t] = 1; nN++; } }
    }
    /* its neighbours: across each edge, a triangle running the edge the SAME way says it is turned; the OPPOSITE way, not */
    let same = 0, opp = 0;
    for (let e = 0; e < 3; e++) { const p = id[ix[t * 3 + e]], r = id[ix[t * 3 + (e + 1) % 3]]; if (p === r) continue;
      for (const u of dir.get(p + '>' + r) || []) if (u !== t) same++;
      opp += (dir.get(r + '>' + p) || []).length; }
    const byNb = same > opp;
    if (byNb) nB++;
    if (byNormal[t]) turn.push(t);
  }
  total.tris += T; total.byNormal += nN; total.byNeighbour += nB; total.turned += turn.length;
  console.log(`${mesh.getName() || 'mesh'}#${pi}: ${T} triangles; by their normals ${nN}; by their neighbours ${nB}; turned ${turn.length}`);
  if (outp && turn.length) {
    const out = ix.slice();
    for (const t of turn) { const s = out[t * 3 + 1]; out[t * 3 + 1] = out[t * 3 + 2]; out[t * 3 + 2] = s; }
    ixA.setArray(out);
  }
});
console.log(`ALL: ${total.tris} triangles; by their normals ${total.byNormal}; by their neighbours ${total.byNeighbour}; turned ${total.turned}`);
if (outp) { await io.write(outp, doc); console.log('written', outp); }
