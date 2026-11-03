/* v24.40 · A glTF document's node tree posed by one of its own takes, in plain Node (no browser): the take's channels
   sampled at t (LINEAR or STEP; a rotation slerped; CUBICSPLINE read at its value), laid over every node's rest TRS and
   multiplied down the tree. Shared by tools/robeskin.mjs (the skirt's baked tracks) and the model checks.
     const poser = makePoser(root);  poser.pose(animation | null, t);  poser.world[poser.NI.get(node)]  (a three Matrix4) */
import { Matrix4, Quaternion, Vector3 } from 'three';

export function makePoser(root) {
  const nodes = root.listNodes(), NI = new Map(nodes.map((n, i) => [n, i]));
  const parent = new Int32Array(nodes.length).fill(-1);
  nodes.forEach((n, i) => n.listChildren().forEach(c => { parent[NI.get(c)] = i; }));
  const order = []; { const seen = new Uint8Array(nodes.length);
    const visit = i => { if (seen[i]) return; if (parent[i] >= 0) visit(parent[i]); seen[i] = 1; order.push(i); }; nodes.forEach((_, i) => visit(i)); }
  const qa = new Quaternion(), qb = new Quaternion();
  const sample = (ch, t) => {
    const smp = ch.getSampler(), inp = smp.getInput().getArray(), out = smp.getOutput().getArray(), n = inp.length, interp = smp.getInterpolation();
    const w = ch.getTargetPath() === 'rotation' ? 4 : 3, cub = interp === 'CUBICSPLINE', stride = cub ? 3 * w : w, off = cub ? w : 0;
    const at = k => Array.from(out.slice(k * stride + off, k * stride + off + w));
    if (t <= inp[0]) return at(0); if (t >= inp[n - 1]) return at(n - 1);
    let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (inp[m] <= t) lo = m; else hi = m; }
    if (interp === 'STEP') return at(lo);
    const u = (t - inp[lo]) / (inp[hi] - inp[lo]), a = at(lo), b = at(hi);
    if (w === 4) { qa.fromArray(a); qb.fromArray(b); qa.slerp(qb, u); return qa.toArray(); }
    return a.map((x, k) => x + (b[k] - x) * u);
  };
  const world = nodes.map(() => new Matrix4());
  const L = new Matrix4(), T = new Vector3(), Q = new Quaternion(), S = new Vector3();
  const pose = (an, t) => {
    const trs = nodes.map(n => ({ t: n.getTranslation(), r: n.getRotation(), s: n.getScale() }));
    if (an) for (const ch of an.listChannels()) { const i = NI.get(ch.getTargetNode()); if (i === undefined) continue; const p = ch.getTargetPath();
      if (p === 'translation') trs[i].t = sample(ch, t); else if (p === 'rotation') trs[i].r = sample(ch, t); else if (p === 'scale') trs[i].s = sample(ch, t); }
    for (const i of order) { L.compose(T.fromArray(trs[i].t), Q.fromArray(trs[i].r).normalize(), S.fromArray(trs[i].s));
      if (parent[i] >= 0) world[i].multiplyMatrices(world[parent[i]], L); else world[i].copy(L); }
  };
  const duration = an => Math.max(...an.listChannels().map(c => { const a = c.getSampler().getInput().getArray(); return a[a.length - 1]; }));
  return { nodes, NI, parent, world, pose, duration, sample };
}
