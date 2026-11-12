/* v26.0: THE GAIT OF A WALKING TAKE, MEASURED (v25.5: a take is measured as a motion before it is cast). Read from the take's
   own keys with no browser: the hips' travel and its evenness, each foot's place ahead of the hips along that travel (a heel
   strikes where 'ahead' peaks: the step's rhythm, and where a walk that is not a loop can be made one), and how high and
   how low each foot goes (a foot under the ground is the body's to lift: c_cast.js SINK).
     node tools/probes/gait.mjs <takes.glb> [<take name>] [--win=<from>,<to>] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [file, clipName] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const doc = await io.read(file), root = doc.getRoot(), A = root.listAnimations().find(a => a.getName() === clipName) || root.listAnimations()[0];
const ch = new Map();
for (const c of A.listChannels()) { const n = c.getTargetNode(); if (!ch.has(n)) ch.set(n, {}); ch.get(n)[c.getTargetPath()] = { t: c.getSampler().getInput().getArray(), v: c.getSampler().getOutput().getArray(), n: c.getSampler().getOutput().getElementSize() }; }
const samp = (s, t) => { const T = s.t; let i = 0; while (i < T.length - 2 && T[i + 1] <= t) i++; const k = Math.max(0, Math.min(1, (t - T[i]) / Math.max(1e-9, T[i + 1] - T[i]))), a = [], n = s.n;
  for (let j = 0; j < n; j++) a.push(s.v[i * n + j] * (1 - k) + s.v[(i + 1) * n + j] * k);
  if (n === 4) { const l = Math.hypot(...a); return a.map(x => x / l); } return a; };
const qmul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
const qrot = (q, v) => { const [x, y, z, w] = q, ix = w * v[0] + y * v[2] - z * v[1], iy = w * v[1] + z * v[0] - x * v[2], iz = w * v[2] + x * v[1] - y * v[0], iw = -x * v[0] - y * v[1] - z * v[2];
  return [ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x]; };
const world = (node, t) => { const chain = []; for (let n = node; n; n = n.getParentNode ? n.getParentNode() : null) chain.unshift(n);
  let p = [0, 0, 0], q = [0, 0, 0, 1], s = 1;
  for (const n of chain) { const c = ch.get(n) || {}, T = c.translation ? samp(c.translation, t) : n.getTranslation(), R = c.rotation ? samp(c.rotation, t) : n.getRotation(), S = n.getScale()[0];
    const tp = qrot(q, T.map(x => x * s)); p = [p[0] + tp[0], p[1] + tp[1], p[2] + tp[2]]; q = qmul(q, R); s *= S; }
  return p; };
const find = (re) => root.listNodes().find(n => re.test(n.getName()));
const hips = find(/^(mixamorig:?)?Hips$/), LF = find(/^(mixamorig:?)?LeftFoot$/), RF = find(/^(mixamorig:?)?RightFoot$/);
const dur = Math.max(...[...ch.values()].flatMap(c => Object.values(c).map(s => s.t[s.t.length - 1])));
const rows = [];
for (let t = 0; t <= dur + 1e-6; t += 1 / 30) { const h = world(hips, t), l = world(LF, t), r = world(RF, t); rows.push([+t.toFixed(3), ...h, ...l, ...r].map(x => +(+x).toFixed(4))); }
const h0 = rows[0], h1 = rows[rows.length - 1], dx = h1[1] - h0[1], dz = h1[3] - h0[3], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
console.log(`${clipName}: ${dur.toFixed(2)} s; the hips travel ${L.toFixed(2)} m (${(L / dur).toFixed(2)} m a second) toward (${ux.toFixed(2)}, ${uz.toFixed(2)}); hips height ${Math.min(...rows.map(r => r[2])).toFixed(3)} to ${Math.max(...rows.map(r => r[2])).toFixed(3)}`);
// each foot's place ahead of the hips along the travel, and its height: a heel strike is where "ahead" peaks
const ahead = (r, k) => (r[k] - r[1]) * ux + (r[k + 2] - r[3]) * uz;
const peaks = (k) => { const out = []; for (let i = 2; i < rows.length - 2; i++) { const a = ahead(rows[i], k); if (a > ahead(rows[i - 1], k) && a >= ahead(rows[i + 1], k) && a > ahead(rows[i - 2], k) && a >= ahead(rows[i + 2], k) && a > 0.02) out.push([rows[i][0], +a.toFixed(3)]); } return out; };
console.log('left foot furthest ahead at', JSON.stringify(peaks(4)));
console.log('right foot furthest ahead at', JSON.stringify(peaks(7)));
// which way the body FACES as it goes (the hips' own turn, applied to +z): a take whose travel is not along its facing walks crabwise
{ const c = ch.get(hips) || {}, par = []; for (let n = hips.getParentNode ? hips.getParentNode() : null; n; n = n.getParentNode ? n.getParentNode() : null) par.unshift(n);
  let fx = 0, fz = 0, k = 0;
  for (let t = 0; t <= dur; t += 0.1) { let q = [0, 0, 0, 1]; for (const n of par) { const cc = ch.get(n) || {}; q = qmul(q, cc.rotation ? samp(cc.rotation, t) : n.getRotation()); }
    q = qmul(q, c.rotation ? samp(c.rotation, t) : hips.getRotation()); const f = qrot(q, [0, 0, 1]); fx += f[0]; fz += f[2]; k++; }
  const fl = Math.hypot(fx, fz); console.log(`the hips face (${(fx / fl).toFixed(2)}, ${(fz / fl).toFixed(2)}) on the whole: ${(Math.atan2(fx, fz) * 180 / Math.PI).toFixed(1)} degrees from +z; the travel is ${(Math.atan2(ux, uz) * 180 / Math.PI).toFixed(1)} degrees from +z`); }
console.log('foot heights: left', Math.min(...rows.map(r => r[5])).toFixed(3), 'to', Math.max(...rows.map(r => r[5])).toFixed(3), '| right', Math.min(...rows.map(r => r[8])).toFixed(3), 'to', Math.max(...rows.map(r => r[8])).toFixed(3));
// --win=t0,t1: the same inside one stretch of it (a loop's window): the travel, the pace, how low each foot goes
{ const w = (process.argv.find(x => x.startsWith('--win=')) || '').slice(6).split(',').map(Number);
  if (w.length === 2 && w[1] > w[0]) { const R = rows.filter(r => r[0] >= w[0] - 1e-6 && r[0] <= w[1] + 1e-6), a = R[0], b = R[R.length - 1], d = Math.hypot(b[1] - a[1], b[3] - a[3]);
    console.log(`inside ${w[0]} to ${w[1]} s: the hips travel ${d.toFixed(3)} m (${(d / (w[1] - w[0])).toFixed(3)} m a second) toward ${(Math.atan2(b[1] - a[1], b[3] - a[3]) * 180 / Math.PI).toFixed(1)} degrees; ` +
      `left foot ${Math.min(...R.map(r => r[5])).toFixed(3)} to ${Math.max(...R.map(r => r[5])).toFixed(3)}, right ${Math.min(...R.map(r => r[8])).toFixed(3)} to ${Math.max(...R.map(r => r[8])).toFixed(3)}; hips ${Math.min(...R.map(r => r[2])).toFixed(3)} to ${Math.max(...R.map(r => r[2])).toFixed(3)}`); } }
// the hips' progress along the travel every half second (is the pace even?)
console.log('progress every 0.5 s:', rows.filter((r, i) => i % 15 === 0).map(r => ((r[1] - h0[1]) * ux + (r[3] - h0[3]) * uz).toFixed(2)).join(' '));
// --toes=<seconds>: inside the window (or the whole take), how far each toe goes over the ground in each such step of
// time: the take's OWN creep of a planted foot, to hold beside what the game draws (a planted toe should read 0)
{ const dt = +((process.argv.find(x => x.startsWith('--toes=')) || '').slice(7)) || 0;
  if (dt > 0) { const w = (process.argv.find(x => x.startsWith('--win=')) || '').slice(6).split(',').map(Number), t0 = w.length === 2 ? w[0] : 0, t1 = w.length === 2 ? w[1] : dur;
    for (const [nm, re] of [['left', /^(mixamorig:?)?LeftToeBase$/], ['right', /^(mixamorig:?)?RightToeBase$/]]) { const n = find(re); if (!n) { console.log('no ' + nm + ' toe bone'); continue; }
      const s = []; let prev = world(n, t0); for (let t = t0 + dt; t <= t1 + 1e-6; t += dt) { const p = world(n, t); s.push((Math.hypot(p[0] - prev[0], p[2] - prev[2]) * 100).toFixed(0)); prev = p; }
      console.log(`${nm} toe, cm over the ground every ${dt} s from ${t0} s: ${s.join(' ')}`); } } }
