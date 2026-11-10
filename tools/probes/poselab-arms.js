/* v25.4 · HIS ARMS, MEASURED IN THE GAME as masters/v25.3/measure/praytake.mjs measures a captured take in Node: the
   same body frame from joints alone (X his left, Y up his trunk, Z before him, the origin the middle of his shoulders),
   lengths in ARM LENGTHS, so a pose written in code is held against a person's. For the pose lab's --read:
     LABDIR=<dir> python3 -I tools/probes/poselab-job.py <id> seek.js --frames 4 --read "$(cat tools/probes/poselab-arms.js)"
   Answers { t, state, miss, wrist, grip, m: { lean, Left: { upper, flex, wrist, hand, pitch, bend, tipHead, armL }, Right,
   wristsApart, tipsApart } } for the cast member `lersi` (upper: his upper arm's line, out / up / forward; wrist: where
   the wrist is from the middle of his shoulders; hand and pitch: the fingers' line and its pitch in the room). */
(() => {
  const E = window.__enc, P = E.stage.cast.lersi, V = E.camera.position.constructor;
  const B = {}; P.group.traverse(o => { if (o.isBone) B[o.name.replace(/^mixamorig:?/, '')] = o; });
  const key = (re) => Object.keys(B).find(k => re.test(k));
  const wp = (n) => { const b = B[n]; b.updateWorldMatrix(true, false); return new V().setFromMatrixPosition(b.matrixWorld); };
  const pt = { hips: wp(key(/Hips$/)), head: wp(key(/^Head$/)) };
  for (const sd of ['Left', 'Right']) { pt[sd + 'Arm'] = wp(key(new RegExp('^' + sd + 'Arm$'))); pt[sd + 'Fore'] = wp(key(new RegExp('^' + sd + 'ForeArm$')));
    pt[sd + 'Hand'] = wp(key(new RegExp('^' + sd + 'Hand$'))); pt[sd + 'End'] = wp(key(new RegExp('^' + sd + 'Hand(Middle\\d|_End)$'))); }
  const S0 = pt.LeftArm.clone().add(pt.RightArm).multiplyScalar(0.5);
  const X = pt.LeftArm.clone().sub(pt.RightArm).normalize();
  const Y = S0.clone().sub(pt.hips); Y.addScaledVector(X, -Y.dot(X)).normalize();
  const Z = new V().crossVectors(X, Y);
  const inB = (v) => new V(v.dot(X), v.dot(Y), v.dot(Z));
  const r2 = (x) => +x.toFixed(2), deg = (x) => +(x * 180 / Math.PI).toFixed(0), cl = (x) => Math.max(-1, Math.min(1, x));
  const out = { lean: deg(Math.acos(Math.min(1, Y.y))) };
  for (const sd of ['Left', 'Right']) {
    const sg = sd === 'Left' ? 1 : -1;
    const a = pt[sd + 'Arm'], e = pt[sd + 'Fore'], w = pt[sd + 'Hand'], t = pt[sd + 'End'];
    const up = e.clone().sub(a), fo = w.clone().sub(e), L = up.length() + fo.length();
    const u = inB(up.clone().normalize()), wr = inB(w.clone().sub(S0)).multiplyScalar(1 / L), h = t.clone().sub(w).normalize(), hb = inB(h);
    out[sd] = { upper: [r2(u.x * sg), r2(u.y), r2(u.z)], flex: deg(Math.acos(cl(up.clone().normalize().dot(fo.clone().normalize())))),
      wrist: [r2(wr.x * sg), r2(wr.y), r2(wr.z)], hand: [r2(hb.x * sg), r2(hb.y), r2(hb.z)], pitch: deg(Math.asin(cl(h.y))),
      bend: deg(Math.acos(cl(h.dot(fo.clone().normalize())))), tipHead: r2((t.y - pt.head.y) / L), armL: r2(L) };
  }
  const L0 = pt.LeftArm.distanceTo(pt.LeftFore) + pt.LeftFore.distanceTo(pt.LeftHand);
  out.wristsApart = r2(pt.LeftHand.distanceTo(pt.RightHand) / L0); out.tipsApart = r2(pt.LeftEnd.distanceTo(pt.RightEnd) / L0);
  const c = E.stage.castInfo().lersi;
  return { t: E.cine.active() ? +E.cine.t().toFixed(2) : null, state: E.getState(), miss: c.miss, wrist: c.wrist, grip: c.grip, m: out };
})()
