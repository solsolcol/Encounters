// v25.2 M4: the chapter's fit() (masters/v25.0/parts/b_build4.js), ported, for the opening's note shot (O4) on a portrait phone:
// the note's corners and the phone's middle in NDC at the push's start, middle and end, for three choices of what the shot must hold.
// usage: node masters/v25.2/fitsim.js
const ASP = 390 / 844, FIT = { x: 0.84, y: 0.8, max: 74 };
function proj(eye, psi, th, fov, P) {
  const cp = Math.cos(th), sp = Math.sin(th), cy = Math.cos(psi), sy = Math.sin(psi);
  const v = [P[0] - eye[0], P[1] - eye[1], P[2] - eye[2]];
  const zc = -v[0] * cp * sy + v[1] * sp - v[2] * cp * cy, xc = v[0] * cy - v[2] * sy, yc = v[0] * sp * sy + v[1] * cp + v[2] * sp * cy;
  const tv = Math.tan(fov * Math.PI / 360);
  return zc > 1e-3 ? [xc / (zc * tv * ASP), yc / (zc * tv), xc, yc, zc] : [9, 9, xc, yc, zc];
}
function fit(eye, at, fl, pts) {
  const dx = at[0] - eye[0], dy = at[1] - eye[1], dz = at[2] - eye[2];
  let psi = Math.atan2(-dx, -dz), th = Math.atan2(dy, Math.hypot(dx, dz)), fov = fl;
  const all = pts.concat([at]);
  for (let it = 0; it < 24; it++) {
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const P of all) { const q = proj(eye, psi, th, fov, P), ax = Math.atan2(q[2], q[4]), ay = Math.atan2(q[3], Math.hypot(q[2], q[4]));
      a0 = Math.min(a0, ax); a1 = Math.max(a1, ax); b0 = Math.min(b0, ay); b1 = Math.max(b1, ay); }
    const tv = Math.tan(fov * Math.PI / 360), AX = Math.atan(FIT.x * tv * ASP), AY = Math.atan(FIT.y * tv);
    const sx = a1 - a0 <= 2 * AX ? Math.min(Math.max(0, a1 - AX), a0 + AX) : (a0 + a1) / 2;
    const sy = b1 - b0 <= 2 * AY ? Math.min(Math.max(0, b1 - AY), b0 + AY) : (b0 + b1) / 2;
    psi -= sx; th += sy;
    let out = false;
    for (const P of all) { const q = proj(eye, psi, th, fov, P); if (Math.abs(q[0]) > FIT.x + 1e-3 || Math.abs(q[1]) > FIT.y + 1e-3) { out = true; break; } }
    if (!out || fov >= FIT.max) break;
    fov = Math.min(FIT.max, fov + 2);
  }
  return { fov, ndc: pts.map(P => proj(eye, psi, th, fov, P).slice(0, 2).map(v => +v.toFixed(2))) };
}
const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => a.map((v, i) => lp(v, b[i], k));
const top0 = 1.046, NOTE = { x: 0.24, z: -1.53, ry: 0.12 }, HIS = { x: -0.25, z: -2.3 };
const note = [NOTE.x, top0 + 0.001, NOTE.z];
const nc = []; for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const c = Math.cos(NOTE.ry), s = Math.sin(NOTE.ry), x = sx * 0.038, z = sz * 0.038;
  nc.push([NOTE.x + c * x + s * z, top0 + 0.001, NOTE.z - s * x + c * z]); }
const ph = [0.48, top0 + 0.005, -1.51], pr = -0.3, pc = [];
for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const c = Math.cos(pr), s = Math.sin(pr), x = sx * 0.038, z = sz * 0.079;
  pc.push([ph[0] + c * x + s * z, ph[1], ph[2] - s * x + c * z]); }
const variants = JSON.parse(process.argv[2] || '{}');
for (const k of [0, 0.5, 1]) {
  const s = [HIS.x + 0.3, 1.5, HIS.z + 0.32];
  const e = variants.end || [NOTE.x - 0.02, 1.36, NOTE.z - 0.3];
  const e3 = lp3(s, e, k), fl = lp(50, 36, k);
  const mustSets = { center: [note, ph], corners: nc.concat(pc), notePhoneCenter: nc.concat([ph]) };
  for (const [name, must] of Object.entries(mustSets)) {
    const r = fit(e3, note, fl, must);
    const nx = r.ndc.slice(0, name === 'center' ? 1 : 4), rest = r.ndc.slice(name === 'center' ? 1 : 4);
    console.log('k', k, name.padEnd(16), 'fov', r.fov, 'note', JSON.stringify(nx), 'phone', JSON.stringify(rest));
  }
}
