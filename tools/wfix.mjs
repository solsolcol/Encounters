/* v28.0 · WFIX: a generated rig's skin weights MENDED where a take shows them wrong, by rules read from the body's own
 * joints (Mr Koh, 21 Nov 2026: a thin spike out of his left shoulder in the talk, and his shirt drawn deep in under both
 * arms in his stand and walk; masters/v28.0/people/RECORD.md section 5). Each rule is opt-in, named in a person's spec
 * (masters/v28.0/people/wfix-<name>.json), and runs from tools/prepmonk.mjs when WFIX=<spec> is set (unset: nothing here
 * runs, and no earlier body's bytes can change). Positions and joints are read in the file's bind space (metres, for a
 * body from tools/riglod.mjs or Meshy's own rig). Every point's four shares are summed to one again afterwards.
 *
 *   "leak":   [{ "bone": "Head", "below": "Head", "from": 0.10, "to": 0.14 }]   (tried on Mr Koh and refused: see "outlier")
 *       A bone's share where it does not belong: on a point lower than the joint `below` and further SIDEWAYS (along x,
 *       the body's left and right) from the `bone`'s joint than `from` metres, the share is eased out, gone by `to`
 *       (smoothstep). What it held goes to the point's other bones in their own proportions (to `else`, else the bone's
 *       parent, if it had none). Mr Koh's spike: one point of his left shoulder, 15 cm out from his head's line, three
 *       quarters on his Head bone: it went with every turn of his head. (On his full body this rule opened 35 new
 *       stretched triangles at the collar, which rises with his neck: the narrower rule below is the one used.)
 *   "outlier": [{ "bone": "Head", "over": 0.3, "within": 0.3 }]
 *       A point holding more than `over` of a bone above the mean of the points joined to it, within `within` metres of
 *       the bone's joint, is brought down to that mean. Mr Koh's spike was exactly one such point (0.74 of the Head among
 *       neighbours at 0.10 and 0.18); his mid and full bodies have none and pass through as they were.
 *   "relief": [{ "side": "Left", "keep": 0.3, "from": 1.0, "to": 1.8, "tfrom": 0.15, "tto": 0.45, "passes": 6,
 *                "spine": ["Spine02", "Spine01", "Spine"] }]
 *       The ARM's share taken off the TORSO under it. In the A pose a body is made in, the upper arm hangs clear of its
 *       side; a point on the side's skin is further from the upper arm's line than the arm's own skin is. The arm's
 *       radius is read along its length from its OUTER half (points 90 % on the arm, away from the body), and a point on
 *       the INNER half further from the line than `from` times that radius keeps only `keep` of its arm and forearm share
 *       by `to` times it (smoothstep); what it gave goes to the spine bones round its height (shared between the two
 *       whose joints bracket it). His stand and walk bring the arms in (tools/calmarms.mjs), and a side held 0.5 to 0.66
 *       on the arm went in with them: an hourglass above his belly. `tfrom`/`tto` ease it in along the arm (in shares of
 *       the upper arm from the shoulder joint), and the amount each point takes is spread `passes` times over the surface.
 *
 *   node tools/wfix.mjs <in.glb> <out.glb> <spec.json>      (the same rules on a file, for measuring them alone)
 */
import { Matrix4, Vector3 } from 'three';

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function wfix(doc, spec, log = console.log) {
  const root = doc.getRoot();
  for (const node of root.listNodes()) {
    const skin = node.getSkin(), mesh = node.getMesh(); if (!skin || !mesh) continue;
    const joints = skin.listJoints(), names = joints.map(j => j.getName()), ibm = skin.getInverseBindMatrices().getArray();
    const idx = (n) => { const i = names.indexOf(n); if (i < 0) throw new Error('wfix: no joint named ' + n); return i; };
    const jp = (n) => new Vector3().setFromMatrixPosition(new Matrix4().fromArray(ibm, idx(n) * 16).invert());
    for (const p of mesh.listPrimitives()) {
      const P = p.getAttribute('POSITION'), J = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'); if (!J || !W) continue;
      const n = P.getCount(), pos = new Float64Array(n * 3), share = Array.from({ length: n }, () => new Map()), v = [], jj = [], ww = [];
      for (let i = 0; i < n; i++) { P.getElement(i, v); pos.set(v, i * 3); J.getElement(i, jj); W.getElement(i, ww);
        for (let k = 0; k < 4; k++) if (ww[k] > 0) share[i].set(jj[k], (share[i].get(jj[k]) || 0) + ww[k]); }
      const touched = new Uint8Array(n);
      for (const L of spec.leak || []) {
        const b = idx(L.bone), B = jp(L.bone), yMax = jp(L.below || L.bone).y;
        const par = joints[b].getParentNode(), fall = idx(L.else || (par && names.includes(par.getName()) ? par.getName() : L.bone));
        let pts = 0, gone = 0;
        for (let i = 0; i < n; i++) { const s = share[i].get(b); if (!s || pos[3 * i + 1] >= yMax) continue;
          const f = smooth(L.from, L.to, Math.abs(pos[3 * i] - B.x)); if (!f) continue;
          const take = s * f, rest = [...share[i]].filter(([j]) => j !== b), rs = rest.reduce((a, [, w]) => a + w, 0);
          share[i].set(b, s - take); if (s - take < 1e-6) share[i].delete(b);
          if (rs > 1e-6) for (const [j, w] of rest) share[i].set(j, w + take * w / rs); else share[i].set(fall, (share[i].get(fall) || 0) + take);
          pts++; gone += take; touched[i] = 1; }
        log(`  wfix leak: ${L.bone} eased out ${L.from}-${L.to} m to the side below ${L.below || L.bone}: ${pts} points, ${gone.toFixed(1)} of share given to their other bones`);
      }
      /* "outlier": [{ "bone": "Head", "over": 0.3, "within": 0.3 }]: a point that holds far more of a bone than the points
         joined to it (by more than `over`) is brought down to its neighbours' mean, what it gives going to its other
         bones in their own proportions; only within `within` metres of the bone's joint. One stray point on the Head is a
         spike every turn of the head pulls out of the body; a gradient (a collar that rises with the neck) is left as it is.
         Places are joined first (a seam in the sheet splits a point in two). */
      if ((spec.outlier || []).length) {
        const gid = new Int32Array(n), gm = new Map(); let G = 0;
        for (let i = 0; i < n; i++) { const k = Math.round(pos[3 * i] * 1e5) + ',' + Math.round(pos[3 * i + 1] * 1e5) + ',' + Math.round(pos[3 * i + 2] * 1e5); let g = gm.get(k); if (g === undefined) gm.set(k, g = G++); gid[i] = g; }
        const I = p.getIndices().getArray(), nb = Array.from({ length: G }, () => new Set());
        for (let t = 0; t < I.length; t += 3) for (let k = 0; k < 3; k++) { const a = gid[I[t + k]], c = gid[I[t + (k + 1) % 3]]; if (a !== c) { nb[a].add(c); nb[c].add(a); } }
        for (const O of spec.outlier) {
          const b = idx(O.bone), B = jp(O.bone), sg = new Float64Array(G), cg = new Float64Array(G);
          for (let i = 0; i < n; i++) { sg[gid[i]] += share[i].get(b) || 0; cg[gid[i]]++; } for (let g = 0; g < G; g++) sg[g] /= cg[g];
          let pts = 0, gone = 0;
          for (let i = 0; i < n; i++) { const s = share[i].get(b); if (!s) continue; if (Math.hypot(pos[3 * i] - B.x, pos[3 * i + 1] - B.y, pos[3 * i + 2] - B.z) > (O.within ?? 0.3)) continue;
            const m = nb[gid[i]]; if (!m.size) continue; let mean = 0; for (const q of m) mean += sg[q]; mean /= m.size;
            if (s - mean <= O.over) continue;
            const take = s - mean, rest = [...share[i]].filter(([j]) => j !== b), rs = rest.reduce((a, [, w]) => a + w, 0); if (rs < 1e-6) continue;
            share[i].set(b, mean); if (mean < 1e-6) share[i].delete(b);
            for (const [j, w] of rest) share[i].set(j, w + take * w / rs);
            pts++; gone += take; touched[i] = 1; }
          log(`  wfix outlier: ${O.bone}: ${pts} points held more than ${O.over} over the points joined to them, brought down (${gone.toFixed(2)} of share given to their other bones)`);
        }
      }
      for (const R of spec.relief || []) {
        const sg = R.side === 'Left' ? 1 : -1, arm = [idx(R.side + 'Arm'), idx(R.side + 'ForeArm')], S = jp(R.side + 'Arm'), E = jp(R.side + 'ForeArm');
        const u = E.clone().sub(S), len = u.length(); u.normalize();
        const out = new Vector3(sg, 0, 0).addScaledVector(u, -sg * u.x).normalize();
        const spine = (R.spine || ['Spine02', 'Spine01', 'Spine']).map(nm => ({ j: idx(nm), y: jp(nm).y })).sort((a, b) => a.y - b.y);
        const geo = (i) => { const d = new Vector3(pos[3 * i] - S.x, pos[3 * i + 1] - S.y, pos[3 * i + 2] - S.z), t = d.dot(u) / len, off = d.addScaledVector(u, -t * len); return { t, d: off.length(), side: off.dot(out) }; };
        const armOf = (i) => arm.reduce((a, j) => a + (share[i].get(j) || 0), 0);
        /* the arm's radius along its length, from its outer half */
        const NB = 12, bins = Array.from({ length: NB }, () => []);
        for (let i = 0; i < n; i++) { if (armOf(i) < 0.9) continue; const g = geo(i); if (g.t < 0 || g.t >= 1 || g.side <= 0) continue; bins[Math.floor(g.t * NB)].push(g.d); }
        const rad = bins.map(b => { if (b.length < 8) return null; b.sort((x, y) => x - y); return b[Math.floor(0.9 * (b.length - 1))]; });
        const known = rad.filter(r => r != null); if (!known.length) { log(`  wfix relief ${R.side}: no outer arm found, nothing done`); continue; }
        for (let k = 0; k < NB; k++) if (rad[k] == null) { let best = null, bd = 1e9; for (let q = 0; q < NB; q++) if (rad[q] != null && Math.abs(q - k) < bd) { bd = Math.abs(q - k); best = rad[q]; } rad[k] = best; }
        const radAt = (t) => { const x = Math.min(NB - 1, Math.max(0, t * NB - 0.5)), k0 = Math.floor(x), k1 = Math.min(NB - 1, k0 + 1); return rad[k0] + (rad[k1] - rad[k0]) * (x - k0); };
        /* how much of the relief each point takes: by its distance from the arm's line in arm radii, eased in along the arm
           from `tfrom` to `tto` of its length (the shoulder blade's skin, close under the joint, goes with the arm), and
           then SPREAD over the surface `passes` times (each point half its own, half its neighbours': places joined first,
           as prepmonk's WSMOOTH), so the edge of the change is a slope and never a step the take can tear open */
        const F = new Float32Array(n);
        for (let i = 0; i < n; i++) { if (armOf(i) <= 0) continue; const g = geo(i); if (g.t < 0 || g.t > 1.1 || g.side >= 0) continue;
          F[i] = smooth(R.from, R.to, g.d / radAt(Math.min(1, g.t))) * (R.tto ? smooth(R.tfrom || 0, R.tto, g.t) : 1); }
        /* (`spread`, metres, in place of `passes`: the passes this body's own edges need for that reach, its median edge
           measured: a pass moves the change about one edge, so a full body (3.4 mm edges) needs about eight times the
           passes of a near one (11.6 mm) for the same slope; six passes on Mr Koh's full body left a notch in his side) */
        let passes = R.passes || 0;
        if (R.spread) { const I0 = p.getIndices().getArray(), el = [];
          for (let t = 0; t < I0.length; t += 21) for (let k = 0; k < 3; k++) { const a = I0[t + k], c = I0[t + (k + 1) % 3]; el.push(Math.hypot(pos[3 * a] - pos[3 * c], pos[3 * a + 1] - pos[3 * c + 1], pos[3 * a + 2] - pos[3 * c + 2])); }
          el.sort((x, y) => x - y); const med = el[el.length >> 1] || 1; passes = Math.max(0, Math.round((R.spread / med) ** 2));
          log(`  wfix relief ${R.side}: median edge ${(med * 1000).toFixed(2)} mm, ${passes} passes for a spread of ${(R.spread * 1000).toFixed(1)} mm`); }
        if (passes > 0) {
          const gid = new Int32Array(n), gm = new Map(); let G = 0;
          for (let i = 0; i < n; i++) { const k = Math.round(pos[3 * i] * 1e5) + ',' + Math.round(pos[3 * i + 1] * 1e5) + ',' + Math.round(pos[3 * i + 2] * 1e5); let g = gm.get(k); if (g === undefined) gm.set(k, g = G++); gid[i] = g; }
          let A = new Float32Array(G), cnt = new Float32Array(G); for (let i = 0; i < n; i++) { A[gid[i]] += F[i]; cnt[gid[i]]++; } for (let g = 0; g < G; g++) A[g] /= cnt[g];
          const I = p.getIndices().getArray(), nb = Array.from({ length: G }, () => new Set());
          for (let t = 0; t < I.length; t += 3) for (let k = 0; k < 3; k++) { const a = gid[I[t + k]], b = gid[I[t + (k + 1) % 3]]; if (a !== b) { nb[a].add(b); nb[b].add(a); } }
          const NB2 = nb.map(s => Int32Array.from(s));
          for (let it = 0; it < passes; it++) { const B2 = new Float32Array(G); for (let g = 0; g < G; g++) { const m = NB2[g]; if (!m.length) { B2[g] = A[g]; continue; } let s = 0; for (const q of m) s += A[q]; B2[g] = 0.5 * A[g] + 0.5 * s / m.length; } A = B2; }
          for (let i = 0; i < n; i++) F[i] = A[gid[i]];
        }
        let pts = 0, gave = 0;
        for (let i = 0; i < n; i++) { const a = armOf(i); if (a <= 0) continue;
          const f = F[i]; if (!(f > 1e-4)) continue;
          const k = 1 - f * (1 - R.keep), take = a * (1 - k); if (take < 1e-5) continue;
          for (const j of arm) { const w = share[i].get(j); if (w) share[i].set(j, w * k); }
          const y = pos[3 * i + 1]; let lo = spine[0], hi = spine[spine.length - 1], m = 0;
          if (y <= lo.y) hi = lo; else if (y >= hi.y) lo = hi; else for (let q = 0; q + 1 < spine.length; q++) if (y >= spine[q].y && y <= spine[q + 1].y) { lo = spine[q]; hi = spine[q + 1]; m = (y - lo.y) / (hi.y - lo.y); break; }
          share[i].set(lo.j, (share[i].get(lo.j) || 0) + take * (1 - m)); if (hi !== lo) share[i].set(hi.j, (share[i].get(hi.j) || 0) + take * m);
          pts++; gave += take; touched[i] = 1; }
        log(`  wfix relief ${R.side}: arm radius ${known.length} of ${NB} bins read (${Math.min(...known).toFixed(3)}-${Math.max(...known).toFixed(3)} m); ${pts} points of the side gave ${gave.toFixed(1)} of arm share to the spine (keep ${R.keep}, from ${R.from} to ${R.to} radii, along the arm from ${R.tfrom || 0} to ${R.tto || '-'}, spread ${passes} passes)`);
      }
      let worst = 0, changed = 0;
      for (let i = 0; i < n; i++) { if (!touched[i]) continue; changed++;
        const top = [...share[i]].sort((x, y) => y[1] - x[1]).slice(0, 4), s = top.reduce((a, [, w]) => a + w, 0) || 1;
        const nj = [0, 0, 0, 0], nw = [0, 0, 0, 0]; top.forEach(([j, w], k) => { nj[k] = j; nw[k] = w / s; });
        J.setElement(i, nj); W.setElement(i, nw); worst = Math.max(worst, Math.abs(nw[0] + nw[1] + nw[2] + nw[3] - 1)); }
      log(`  wfix: ${changed} of ${n} points re-weighted, shares summing to one within ${worst.toExponential(1)}`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { NodeIO } = await import('@gltf-transform/core');
  const { ALL_EXTENSIONS } = await import('@gltf-transform/extensions');
  const { MeshoptDecoder, MeshoptEncoder } = await import('meshoptimizer');
  const fs = await import('node:fs');
  await MeshoptDecoder.ready; await MeshoptEncoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
  const [inP, outP, specP] = process.argv.slice(2);
  if (!inP || !outP || !specP) { console.error('wfix <in.glb> <out.glb> <spec.json>'); process.exit(1); }
  const doc = await io.read(inP); wfix(doc, JSON.parse(fs.readFileSync(specP, 'utf8'))); await io.write(outP, doc);
  console.log('wrote', outP, fs.statSync(outP).size, 'bytes');
}
