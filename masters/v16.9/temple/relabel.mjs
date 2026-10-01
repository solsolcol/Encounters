/* v17.0 — the temple, relabelled BY PART. The v16.8 bake classed every
   triangle on its own (height, slope, density), so one column came out as six
   classes and was painted six ways, and the hall's wainscot ended in a saw
   tooth wherever a wall triangle happened to be classed 'base'. Here every
   connected PIECE of the model (2,572 of them, welded by position) is named
   for what it is — column, beam, wall, frame, gable screen, bargeboard, roof,
   balustrade, base, carving — and every triangle of the piece takes the
   piece's part. COLOR_0 carries (AO, distance from the piece's top,
   distance from its bottom), both in model units / 25, so a column's
   capital and foot are known in the shader without a guess by height.
     node relabel.mjs <baked.glb> <out.glb> */
import { NodeIO, Document } from '@gltf-transform/core';
const [,, IN, OUT] = process.argv;
const doc = await new NodeIO().read(IN);
const P = [], N = [], AO = [], CLS = [];
for (const n of doc.getRoot().listNodes()) {
  const m = n.getMesh(); if (!m) continue;
  const cls = n.getName().replace('temple_', '');
  const p = m.listPrimitives()[0], pos = p.getAttribute('POSITION').getArray(), nrm = p.getAttribute('NORMAL').getArray(), ix = p.getIndices().getArray();
  const col = p.getAttribute('COLOR_0'), ca = col.getArray(), cs = col.getElementSize();
  for (let i = 0; i < ix.length; i++) { const v = ix[i]; P.push(pos[3*v], pos[3*v+1], pos[3*v+2]); N.push(nrm[3*v], nrm[3*v+1], nrm[3*v+2]); AO.push(ca[cs*v]); }
  for (let t = 0; t < ix.length / 3; t++) CLS.push(cls);
}
const T = P.length / 9;
/* pieces: the same weld (×500) and union-find as segment.mjs, so the ids
   below are the ids its report and the label viewer show */
const key = new Map(), vid = new Int32Array(T * 3);
for (let i = 0; i < T * 3; i++) { const k = Math.round(P[3*i]*500)+','+Math.round(P[3*i+1]*500)+','+Math.round(P[3*i+2]*500); let id = key.get(k); if (id === undefined) { id = key.size; key.set(k, id); } vid[i] = id; }
const par = new Int32Array(key.size).map((_, i) => i);
const find = a => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
for (let t = 0; t < T; t++) { const a = find(vid[3*t]), b = find(vid[3*t+1]), c = find(vid[3*t+2]); par[b] = a; par[find(c)] = a; }
const comp = new Int32Array(T), cmap = new Map();
for (let t = 0; t < T; t++) { const r = find(vid[3*t]); let c = cmap.get(r); if (c === undefined) { c = cmap.size; cmap.set(r, c); } comp[t] = c; }
const NP = cmap.size;
const ymin = new Float64Array(NP).fill(1e9), ymax = new Float64Array(NP).fill(-1e9), cnt = new Int32Array(NP), gold = new Int32Array(NP), base = new Int32Array(NP);
for (let t = 0; t < T; t++) { const c = comp[t]; cnt[c]++; if (CLS[t] === 'gold') gold[c]++; if (CLS[t] === 'base') base[c]++;
  for (let k = 0; k < 3; k++) { const y = P[9*t+3*k+1]; if (y < ymin[c]) ymin[c] = y; if (y > ymax[c]) ymax[c] = y; } }
console.log('triangles', T, 'pieces', NP);

const PART = {};
const set = (ids, part) => { for (const i of ids) PART[i] = part; };
const rng = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
set(rng(0, 11), 'column');                                 // the twelve columns, shaft and lotus capital
set([162, 163, 164, 165], 'beam');                        // the brackets out of the flank columns under the eaves
set(rng(195, 200), 'beam');                               // the tie beams across the gables
set([116, 117], 'screen');                                // the gable ends: the board and the scalloped valance under it
set([118, 119, 120, 121, 122, 123], 'barge');           // the bargeboards
set([153, 154, 155, 156], 'mosaic');                      // the second, inner layer of the lower bargeboards
set([161], 'roof');
set([113], 'wall');
set([112, 174, 175, 176], 'frame');                       // the back door's surround, the west windows' frames
set([107, 108, 109, 110, 114, 115], 'rail');              // the balustrade round the hall
set([111, 40, 93], 'base');                               // the base, the back stair
const part = new Array(NP);
for (let c = 0; c < NP; c++) part[c] = PART[c] || (gold[c] / cnt[c] > 0.6 ? 'carve' : base[c] / cnt[c] > 0.5 ? 'base' : 'carve');
const tally = {}; for (let c = 0; c < NP; c++) tally[part[c]] = (tally[part[c]] || 0) + cnt[c];
console.log(tally);
/* guard: the named pieces are the ones measured — a re-bake that renumbers
   the pieces must not silently paint a column as a roof */
const expect = { 0: [28.6, 32.3, 32.9, 54.7], 113: [-28.4, 29.3, 33.1, 71.9], 161: [-41.1, 41.1, 54.6, 108.8], 116: [-36, 36, 45.3, 106.6] };
for (const [id, [x0, x1, y0, y1]] of Object.entries(expect)) {
  if (Math.abs(ymin[id] - y0) > 0.2 || Math.abs(ymax[id] - y1) > 0.2) throw new Error(`piece ${id} is not the one measured (y ${ymin[id].toFixed(2)}..${ymax[id].toFixed(2)})`);
}

const out = new Document(), buf = out.createBuffer(), scene = out.createScene();
const byPart = {};
/* v17.1 · ONE COPY OF EVERY FACE. The v16.8 bake wrote each sloped face of
   the roof, the gables and the capitals TWICE, facing up and facing down; the
   temple is drawn two-sided now (the bake turned some faces the wrong way, so
   one-sided drawing left see-through gaps — Chad's "empty space openings"),
   and two coincident faces drawn two-sided fight over every pixel. Keep the
   first copy of each set of three corners. */
const seen = new Set(); let dup = 0;
const keep = new Uint8Array(T);
for (let t = 0; t < T; t++) {
  const vs = [0, 1, 2].map(k => [0, 1, 2].map(a => Math.round(P[9*t+3*k+a] * 1000)).join(',')).sort().join('|');
  if (seen.has(vs)) { dup++; continue; } seen.add(vs); keep[t] = 1;
}
console.log('duplicate faces dropped', dup);
/* v17.1 · THE FRONT DOOR'S SURROUND is welded into the wall piece (the back
   door's is its own piece, 112, and was painted gold from v17.0); measured,
   its triangles lie in z -22.3..-19.3, x -6.7..7.5, up to y 58.1 — the back
   one's footprint mirrored. Chad: "the frame around the main door should
   have been gold. It was done properly on the back side door". */
const triPart = t => {
  const pc = part[comp[t]];
  if (pc === 'wall') {
    let ok = true;
    for (let k = 0; k < 3; k++) { const x = P[9*t+3*k], y = P[9*t+3*k+1], z = P[9*t+3*k+2]; if (!(z > -22.3 && z < -19.3 && x > -6.7 && x < 7.5 && y > 33.3 && y < 58.15)) ok = false; }
    if (ok) return 'frame';
  }
  return pc;
};
for (let t = 0; t < T; t++) if (keep[t]) (byPart[triPart(t)] ||= []).push(t);
for (const [name, list] of Object.entries(byPart)) {
  const n = list.length * 3, pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let o = 0;
  for (const t of list) for (let k = 0; k < 3; k++) {
    const i = 3 * t + k, y = P[3*i+1], c = comp[t];
    pos.set([P[3*i], y, P[3*i+2]], 3*o); nrm.set([N[3*i], N[3*i+1], N[3*i+2]], 3*o);
    col[3*o] = AO[i]; col[3*o+1] = Math.min(1, (ymax[c] - y) / 25); col[3*o+2] = Math.min(1, (y - ymin[c]) / 25);
    o++;
  }
  const prim = out.createPrimitive()
    .setAttribute('POSITION', out.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf))
    .setAttribute('NORMAL', out.createAccessor().setType('VEC3').setArray(nrm).setBuffer(buf))
    .setAttribute('COLOR_0', out.createAccessor().setType('VEC3').setArray(col).setBuffer(buf))
    .setIndices(out.createAccessor().setType('SCALAR').setArray(Uint32Array.from({ length: n }, (_, i) => i)).setBuffer(buf));
  scene.addChild(out.createNode('temple_' + name).setMesh(out.createMesh('temple_' + name).addPrimitive(prim)));
}
await new NodeIO().write(OUT, out);
console.log('wrote', OUT);
