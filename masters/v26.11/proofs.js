/* the speed-ups' proofs in one page:
   __cmp(label): the world drawn twice in one task, the flat see-through two-sided cards in two passes (three's way) and
     then in one (forceSinglePass), every byte of the two pictures compared; and for each card's material, how many bytes
     it paints (drawn once more without it), so a card that is not on screen is not counted as proved
   __bones(): every bone of every skinned body in the world, its local turn, place, size and world matrix, as numbers
   __same(A, B): the two lists compared with Object.is (bit for bit: -0 is not 0)
   __aim(x, y, z): the lens turned to look at a point */
(() => {
  const flatOf = new WeakMap();
  const flat = (g) => {
    if (flatOf.has(g)) return flatOf.get(g);
    const p = g.attributes.position, ix = g.index ? g.index.array : null, n = ix ? ix.length : (p ? p.count : 0);
    let ok = !!p && !(g.morphAttributes && g.morphAttributes.position), nx = 0, ny = 0, nz = 0, have = false, ax = 0, ay = 0, az = 0, size = 0, off = 0;
    for (let t = 0; ok && t + 2 < n; t += 3) {
      const a = ix ? ix[t] : t, b = ix ? ix[t + 1] : t + 1, c = ix ? ix[t + 2] : t + 2;
      const Ax = p.getX(a), Ay = p.getY(a), Az = p.getZ(a), ux = p.getX(b) - Ax, uy = p.getY(b) - Ay, uz = p.getZ(b) - Az, wx = p.getX(c) - Ax, wy = p.getY(c) - Ay, wz = p.getZ(c) - Az;
      const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx, L = Math.hypot(cx, cy, cz);
      if (!(L > 1e-12)) continue;
      if (!have) { nx = cx / L; ny = cy / L; nz = cz / L; ax = Ax; ay = Ay; az = Az; have = true; }
      if ((cx * nx + cy * ny + cz * nz) / L < 0.999999) ok = false;
      for (const [X, Y, Z] of [[Ax, Ay, Az], [Ax + ux, Ay + uy, Az + uz], [Ax + wx, Ay + wy, Az + wz]]) {
        off = Math.max(off, Math.abs((X - ax) * nx + (Y - ay) * ny + (Z - az) * nz)); size = Math.max(size, Math.hypot(X - ax, Y - ay, Z - az)); }
    }
    const r = ok && have && off <= 1e-6 * Math.max(size, 1e-6);
    flatOf.set(g, r); return r;
  };
  const cards = () => {
    const users = new Map();
    E.scene.traverse(o => { if (!o.isMesh) return; for (const m of [].concat(o.material)) { if (!m || !m.transparent || m.side !== 2) continue;
      if (!users.has(m)) users.set(m, []); users.get(m).push(o); } });
    const take = [], left = [];
    for (const [m, os] of users) (m.isMeshBasicMaterial && !m.envMap && os.every(o => !o.isInstancedMesh && !o.isSkinnedMesh && !o.isBatchedMesh && o.geometry && flat(o.geometry)) ? take : left).push(m);
    return { take, left, users };
  };
  const shown = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  window.__cmp = (label) => {
    const R = E.renderer, gl = R.getContext(), S = E.scene, C = E.camera, { take, left, users } = cards();
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, N = w * h * 4;
    const draw = (buf) => { R.setRenderTarget(null); R.render(S, C); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf); return R.info.render.calls; };
    const A = new Uint8Array(N), B = new Uint8Array(N), D = new Uint8Array(N);
    const was = take.map(m => m.forceSinglePass);
    for (const m of take) { m.forceSinglePass = false; m.needsUpdate = true; } const cA = draw(A);
    for (const m of take) { m.forceSinglePass = true; m.needsUpdate = true; } const cB = draw(B);
    let diff = 0, maxd = 0; for (let i = 0; i < N; i++) if (A[i] !== B[i]) { diff++; maxd = Math.max(maxd, Math.abs(A[i] - B[i])); }
    const per = [];
    for (const m of take) { if (!users.get(m).some(shown) || !(m.opacity > 0)) continue; const v0 = m.visible; m.visible = false; draw(D); m.visible = v0;
      let paint = 0; for (let i = 0; i < N; i++) if (D[i] !== B[i]) paint++; per.push(m.id + ':' + paint); }
    take.forEach((m, i) => { m.forceSinglePass = was[i]; m.needsUpdate = true; });
    return label + ' | cards ' + take.length + ' (on screen, bytes each paints: ' + (per.join(' ') || 'none') + ') not flat ' + left.length + ' | calls ' + cA + ' -> ' + cB + ' | bytes differing two passes vs one: ' + diff + ' (max ' + maxd + ') of ' + N;
  };
  window.__bones = () => {
    const out = []; E.scene.updateMatrixWorld(true);
    E.scene.traverse(o => { if (!o.isSkinnedMesh || !o.skeleton) return; for (const b of o.skeleton.bones) {
      const q = b.quaternion, p = b.position, s = b.scale; out.push(q.x, q.y, q.z, q.w, p.x, p.y, p.z, s.x, s.y, s.z); for (const e of b.matrixWorld.elements) out.push(e); } });
    return out;
  };
  window.__same = (A, B) => { if (A.length !== B.length) return 'LENGTH ' + A.length + ' vs ' + B.length; let d = 0, first = -1; for (let i = 0; i < A.length; i++) if (!Object.is(A[i], B[i])) { d++; if (first < 0) first = i; }
    return d ? ('DIFFER ' + d + ' of ' + A.length + ' (first at ' + first + ': ' + A[first] + ' vs ' + B[first] + ')') : ('identical, ' + A.length + ' numbers'); };
  window.__aim = (x, y, z) => { const c = new E.camera.position.constructor(); E.camera.getWorldPosition(c); const dx = x - c.x, dy = y - c.y, dz = z - c.z;
    E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz)); return 'aimed'; };
  window.__cardAt = (pred) => { let f = null; E.scene.traverse(o => { if (!f && o.isMesh && o.material && !Array.isArray(o.material) && o.material.forceSinglePass && pred(o)) f = o; }); if (!f) return null; const v = new E.camera.position.constructor(); f.getWorldPosition(v); return [v.x, v.y, v.z]; };
  return 'proofs ready';
})()
