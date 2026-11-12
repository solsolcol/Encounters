/* v26.0: THE HOLES IN A BODY, NEAR ONE JOINT (Chad, 12 Nov 2026, of Grandmaster Pho's armpit seen from his front as he
   talks: "didn't you notice what's the problem here?"). A skin is many parts and many split points (a sheet's seams);
   welded by place (to a tenth of a millimetre), every edge that only one triangle uses is an edge of a hole or of a
   part's own border. Those within `r` of the joint's bind place are chained into loops and each loop is reported: its
   length, how many edges, its middle and its reach from the joint, and which parts' triangles border it.
     node tools/probes/holes.mjs <file.glb> [--joint=RightArm] [--r=0.16] [--obj=<out.obj>] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const args = process.argv.slice(2), arg = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(args.find(a => !a.startsWith('--'))), root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints(), ibm = skin.getInverseBindMatrices().getArray();
const JN = arg('joint', 'RightArm'), R = +arg('r', 0.16), ji = joints.findIndex(j => new RegExp('^(mixamorig:?)?' + JN + '$').test(j.getName()));
const J = new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().fromArray(ibm, ji * 16).invert());
/* every part's points welded by place across all parts */
const key = (p) => p.map(x => Math.round(x * 1e4)).join(','), ids = new Map(), place = [];
const tris = [];
let pi = 0;
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) { const P = p.getAttribute('POSITION'), I = p.getIndices(), n = P.getCount(), map = new Int32Array(n), q = [0, 0, 0];
  for (let i = 0; i < n; i++) { P.getElement(i, q); const k = key(q); let id = ids.get(k); if (id === undefined) { id = place.length; ids.set(k, id); place.push(q.slice()); } map[i] = id; }
  const ix = I ? I.getArray() : null, nt = ix ? ix.length / 3 : n / 3;
  for (let t = 0; t < nt; t++) { const a = map[ix ? ix[3 * t] : 3 * t], b = map[ix ? ix[3 * t + 1] : 3 * t + 1], c = map[ix ? ix[3 * t + 2] : 3 * t + 2]; if (a === b || b === c || a === c) continue; tris.push([a, b, c, pi, (p.getMaterial() && p.getMaterial().getName()) || '']); }
  pi++; }
const near = (id) => Math.hypot(place[id][0] - J.x, place[id][1] - J.y, place[id][2] - J.z) < R;
const edges = new Map();
for (const [a, b, c, part] of tris) for (const [u, v] of [[a, b], [b, c], [c, a]]) { if (!near(u) && !near(v)) continue; const k = u < v ? u + '_' + v : v + '_' + u; const e = edges.get(k); if (e) { e.n++; e.parts.add(part); } else edges.set(k, { u, v, n: 1, parts: new Set([part]) }); }
const open = [...edges.values()].filter(e => e.n === 1), over = [...edges.values()].filter(e => e.n > 2);
/* chained into loops */
const adj = new Map(); for (const e of open) { for (const [x, y] of [[e.u, e.v], [e.v, e.u]]) { if (!adj.has(x)) adj.set(x, []); adj.get(x).push({ y, e }); } }
const used = new Set(), loops = [];
for (const e of open) { if (used.has(e)) continue; const chain = [e.u, e.v]; used.add(e); let cur = e.v, parts = new Set(e.parts);
  for (;;) { const nx = (adj.get(cur) || []).find(o => !used.has(o.e)); if (!nx) break; used.add(nx.e); for (const q of nx.e.parts) parts.add(q); cur = nx.y; if (cur === chain[0]) { chain.push(cur); break; } chain.push(cur); }
  let len = 0; const m = new THREE.Vector3(); for (let i = 1; i < chain.length; i++) len += Math.hypot(...[0, 1, 2].map(k => place[chain[i]][k] - place[chain[i - 1]][k])); for (const id of chain) m.add(new THREE.Vector3(...place[id])); m.multiplyScalar(1 / chain.length);
  loops.push({ edges: chain.length - 1, closed: chain[0] === chain[chain.length - 1], len, mid: m, reach: m.distanceTo(J), parts: [...parts], chain }); }
loops.sort((a, b) => b.len - a.len);
console.log(`${JN} at ${J.toArray().map(x => x.toFixed(3)).join(',')}: within ${R} m, ${edges.size} edges, ${open.length} used by one triangle only, ${over.length} by more than two; ${loops.length} chains`);
for (const L of loops.slice(0, 25)) console.log(`  ${L.closed ? 'loop ' : 'chain'} ${String(L.edges).padStart(4)} edges, ${(L.len * 100).toFixed(1).padStart(6)} cm round, middle ${L.mid.toArray().map(x => x.toFixed(3)).join(',')} (${(L.reach * 100).toFixed(1)} cm from the joint), parts ${L.parts.join('+')}`);
if (arg('obj', '')) { const out = []; for (const p of place) out.push(`v ${p[0]} ${p[1]} ${p[2]}`); for (const L of loops.slice(0, 25)) out.push('l ' + L.chain.map(i => i + 1).join(' ')); fs.writeFileSync(arg('obj', ''), out.join('\n')); }
