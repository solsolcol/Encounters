/* v26.0: A LIMB READ AS RINGS. A scanned arm that was pressed to the body has no inner side of its own: what closes it
   was cut and filled by hand (Grandmaster Pho's right arm, v24.50 to v24.56), and a fill's rim can stand off the arm as
   a tooth. This reads a limb in its BIND pose as a tube round its bone: every point skinned to the bone, by how far
   along the bone it lies (s), which way round it (the angle, 0 = toward the body's middle line) and how far out (r).
   For each slice of the bone it prints the limb's own radius on its outer half (the scan's real surface) and the
   points of the inner half that stand outside or inside it: a tooth is a point far outside.
     node tools/probes/armring.mjs <file.glb> [--bone=RightArm] [--next=RightForeArm] [--slice=0.01] [--out=<json>]
   No browser. Prints a table; --out writes every point's (mesh, index, s, angle, r, weight) for a fix to read. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import * as THREE from 'three';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const FILE = process.argv[2], BONE = arg('bone', 'RightArm'), NEXT = arg('next', 'RightForeArm'), SL = +arg('slice', 0.01), OUT = arg('out', '');
const doc = await io.read(FILE), root = doc.getRoot(), skin = root.listSkins()[0];
const joints = skin.listJoints(), names = joints.map(j => j.getName()), ibm = skin.getInverseBindMatrices().getArray();
const bindOf = (i) => new THREE.Matrix4().fromArray(ibm, i * 16).invert();
const find = (n) => names.findIndex(x => x === n || x === 'mixamorig:' + n || x.replace(/^mixamorig:?/, '') === n);
const jb = find(BONE), jn = find(NEXT);
if (jb < 0 || jn < 0) { console.error('no bone ' + BONE + ' or ' + NEXT + ' (it has: ' + names.join(', ') + ')'); process.exit(2); }
const A = new THREE.Vector3().setFromMatrixPosition(bindOf(jb)), B = new THREE.Vector3().setFromMatrixPosition(bindOf(jn));
const axis = B.clone().sub(A), LEN = axis.length(); axis.normalize();
/* the body's middle line: the spine joint nearest the limb's head, straight up and down through it */
const spineI = names.findIndex(n => /^(mixamorig:?)?Spine2$/.test(n)) >= 0 ? names.findIndex(n => /^(mixamorig:?)?Spine2$/.test(n)) : names.findIndex(n => /Spine/.test(n));
const SP = new THREE.Vector3().setFromMatrixPosition(bindOf(spineI));
/* "inward" at a point of the bone: from the bone toward the middle line, square to the bone */
const inAt = (p) => { const v = new THREE.Vector3(SP.x - p.x, 0, SP.z - p.z); v.addScaledVector(axis, -v.dot(axis)); return v.normalize(); };
const mid = A.clone().addScaledVector(axis, LEN / 2), IN = inAt(mid), SIDE = new THREE.Vector3().crossVectors(axis, IN).normalize();
console.log(`${BONE}: from ${A.toArray().map(v => v.toFixed(3))} to ${B.toArray().map(v => v.toFixed(3))}, ${(LEN * 100).toFixed(1)} cm; the middle line at x ${SP.x.toFixed(3)} z ${SP.z.toFixed(3)}; inward ${IN.toArray().map(v => v.toFixed(2))}`);
const pts = [];
root.listMeshes().forEach((m, mi) => m.listPrimitives().forEach((pr, pi) => {
  const P = pr.getAttribute('POSITION'), J = pr.getAttribute('JOINTS_0'), W = pr.getAttribute('WEIGHTS_0'); if (!P || !J || !W) return;
  /* (the mesh's own node may carry a transform: bring the point into the skeleton's space by the node's world matrix) */
  const node = root.listNodes().find(n => n.getMesh() === m), wm = new THREE.Matrix4().fromArray(node ? node.getWorldMatrix() : [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  const v = new THREE.Vector3(), d = new THREE.Vector3(), jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
  for (let i = 0; i < P.getCount(); i++) { J.getElement(i, jj); W.getElement(i, ww); let w = 0, wn = 0, sum = ww[0] + ww[1] + ww[2] + ww[3] || 1;
    for (let k = 0; k < 4; k++) { if (jj[k] === jb) w += ww[k] / sum; if (jj[k] === jn) wn += ww[k] / sum; }
    if (w + wn < 0.5) continue;
    v.fromArray(P.getElement(i, [0, 0, 0])).applyMatrix4(wm); d.copy(v).sub(A); const s = d.dot(axis); d.addScaledVector(axis, -s);
    const r = d.length(), ang = Math.atan2(d.dot(SIDE), d.dot(IN)) * 180 / Math.PI;
    pts.push({ mesh: m.getName() || mi, prim: pi, i, s, ang, r, w, wn, mat: pr.getMaterial() ? pr.getMaterial().getName() : '' }); }
}));
console.log(`${pts.length} points ride ${BONE} or ${NEXT} by half or more`);
const rows = [];
for (let s0 = -0.06; s0 < LEN + 0.02; s0 += SL) {
  const S = pts.filter(p => p.s >= s0 && p.s < s0 + SL); if (S.length < 8) continue;
  const outer = S.filter(p => Math.abs(p.ang) > 100).map(p => p.r).sort((a, b) => a - b), inner = S.filter(p => Math.abs(p.ang) < 70);
  if (outer.length < 4) continue;
  const med = outer[outer.length >> 1], hi = outer[Math.floor(outer.length * 0.9)];
  const far = inner.filter(p => p.r > hi * 1.25), near = inner.filter(p => p.r < med * 0.6), rmax = inner.length ? Math.max(...inner.map(p => p.r)) : 0, rmin = inner.length ? Math.min(...inner.map(p => p.r)) : 0;
  rows.push({ s0, n: S.length, med, hi, inner: inner.length, rmin, rmax, far: far.length, near: near.length });
  console.log(`s ${(s0 * 100).toFixed(0).padStart(4)} cm: ${String(S.length).padStart(4)} pts; outer radius ${(med * 100).toFixed(1)} (90th ${(hi * 100).toFixed(1)}) cm; inner ${String(inner.length).padStart(3)} pts, ${(rmin * 100).toFixed(1)} to ${(rmax * 100).toFixed(1)} cm${far.length ? `; ${far.length} STAND OUT (the furthest ${(Math.max(...far.map(p => p.r)) * 100).toFixed(1)} cm at ${far.sort((a, b) => b.r - a.r)[0].ang.toFixed(0)} deg)` : ''}${near.length ? `; ${near.length} lie deep in` : ''}`);
}
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ bone: BONE, A: A.toArray(), B: B.toArray(), axis: axis.toArray(), inward: IN.toArray(), side: SIDE.toArray(), len: LEN, pts, rows }));
