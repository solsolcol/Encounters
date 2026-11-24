// WHICH OF A GLB'S TAKES DRIVE ITS FINGERS (R75's debug): each take's finger rotation tracks and how far each turns its joint from the bind, in degrees.
// node tools/probes/fingtracks.mjs assets/p5pho.glb
import fs from 'fs';
const buf = fs.readFileSync(process.argv[2]);
const jl = buf.readUInt32LE(12), J = JSON.parse(buf.slice(20, 20 + jl).toString());
const bin = buf.slice(20 + jl + 8);
const acc = (i) => { const a = J.accessors[i], bv = J.bufferViews[a.bufferView], n = { SCALAR: 1, VEC3: 3, VEC4: 4 }[a.type];
  const off = (bv.byteOffset || 0) + (a.byteOffset || 0), stride = bv.byteStride || n * 4; const out = [];
  for (let k = 0; k < a.count; k++) { const r = []; for (let c = 0; c < n; c++) { const o = off + k * stride + c * (a.componentType === 5126 ? 4 : a.componentType === 5122 ? 2 : 1);
    r.push(a.componentType === 5126 ? bin.readFloatLE(o) : a.componentType === 5122 ? Math.max(-1, bin.readInt16LE(o) / 32767) : bin.readInt8(o) / 127); } out.push(r); } return out; };
const re = /(Left|Right)Hand(Thumb|Index|Middle|Ring|Pinky)\d$/;
const ang = (a, b) => { let d = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]); return 2 * Math.acos(Math.min(1, d)) * 180 / Math.PI; };
for (const an of J.animations || []) {
  const rows = [];
  for (const ch of an.channels) { const node = J.nodes[ch.target.node]; if (!node || !re.test(node.name || '') || ch.target.path !== 'rotation') continue;
    const s = an.samplers[ch.sampler], bv = J.bufferViews[J.accessors[s.output].bufferView], b = node.rotation || [0, 0, 0, 1];
    if (bv.extensions && bv.extensions.EXT_meshopt_compression) { rows.push([node.name, NaN]); continue; }   // (a packed track: counted, its turn not read)
    const v = acc(s.output); let mx = 0; for (const q of v) mx = Math.max(mx, ang(q, b)); rows.push([node.name, +mx.toFixed(1)]); }
  if (rows.length) { const R = rows.filter(r => r[0].startsWith('Right')), L = rows.filter(r => r[0].startsWith('Left'));
    const mxR = R.length ? (R.some(r => isNaN(r[1])) ? 'packed' : Math.max(...R.map(r => r[1]))) : 0; console.log(an.name.padEnd(34), 'R', String(R.length).padStart(2), 'tracks, max turn', String(mxR).padStart(5), '| L', L.length); }
  else console.log(an.name.padEnd(34), 'no finger tracks');
}
