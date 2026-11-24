// THE NAGA FILM'S 'three' SHOT (R75's debug, V7): where he and the three laid low fall in a phone's and a desktop's frame for an eye and
// two aims, in the court's frame (the film's cw is a half turn, so the geometry is the same).
// node tools/probes/threeaim.mjs "x,y,z,aimAx,aimBx" ...   (W whole in frame, p part, - out; the boxes are NDC)
import * as THREE from 'three';
const Z = [0, 0.7], laid = [[-1.8, -1.12], [0, -1.7], [1.8, -1.12]];
const zav = [[0, 1.78, 0.7], [0.24, 1.45, 0.7], [-0.24, 1.45, 0.7], [0, 1.0, 0.7], [0.2, 0.6, 0.7], [-0.2, 0.6, 0.7]];
const body = (q) => [[q[0] - 0.45, 0.15, q[1]], [q[0] + 0.45, 0.15, q[1]], [q[0], 0.55, q[1]], [q[0], 0.05, q[1] - 0.3], [q[0], 0.05, q[1] + 0.3]];
function ndc(eye, at, fov, aspect, pts) { const c = new THREE.PerspectiveCamera(fov, aspect, 0.08, 160); c.position.set(...eye); c.lookAt(...at); c.updateMatrixWorld(); c.updateProjectionMatrix();
  return pts.map(p => { const v = new THREE.Vector3(...p).project(c); return [+v.x.toFixed(2), +v.y.toFixed(2), v.z < 1 ? 1 : 0]; }); }
const box = (P) => { const xs = P.map(p => p[0]), ys = P.map(p => p[1]); return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)].map(v => +v.toFixed(2)); };
const inF = (b) => b[1] > -1 && b[0] < 1 && b[3] > -1 && b[2] < 1;
const show = (name, eye, A, B, fp, fd) => {
  for (const [lab, at] of [['A', A], ['B', B]]) for (const [view, fov, asp] of [['phone', fp, 390 / 844], ['desk', fd, 1280 / 800]]) {
    const zb = box(ndc(eye, at, fov, asp, zav)), ls = laid.map(q => box(ndc(eye, at, fov, asp, body(q))));
    console.log(name, lab, view, 'zav', JSON.stringify(zb), inF(zb) ? 'IN' : 'out', '| laid', ls.map(b => (inF(b) ? (b[0] > -1 && b[1] < 1 ? 'W' : 'p') : '-') + JSON.stringify(b)).join(' '));
  } };
const A0 = [-0.6, 0.35, -1.45], B0 = [0.9, 0.35, -1.35];
show('b56', [-1.25, 3.0, 2.7], A0, B0, 56, 50);
for (const e of process.argv.slice(2)) { const [x, y, z, ax, bx] = e.split(',').map(Number); show(e, [x, y, z], [ax ?? -0.6, 0.35, -1.45], [bx ?? 0.9, 0.35, -1.35], 56, 50); }
