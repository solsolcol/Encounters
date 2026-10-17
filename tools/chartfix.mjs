/* v19.8 — THE SPECKS IN THE HAIR (Chad: "Why are there white streaks on
   the hair of the audience? Fix it so that their hair is fine").

   WHAT THEY WERE, measured on cg_man1hd (docs/LEARNINGS.md, v19.8): not the
   lighting (they stay with the light off), not the mipmaps (they stay with
   mipmaps off), not holes (a solid colour hides them) and not a stretched
   UV — they are the scan's own TINY UV CHARTS. A Meshy atlas cuts the
   surface into ~600 charts, and about four hundred of them are a handful of
   triangles packed into strips two to four texels wide along the top of the
   sheet, butted straight against other charts with NO GUTTER: a strip of
   black hair two texels wide with a white shirt chart touching it on each
   side. Every texture fetch on such a strip is an edge fetch — bilinear
   filtering reaches half a texel either side, a mip level averages a whole
   block — so the strip renders as a mix of its own colour and its
   neighbour's, and a millimetre of hair comes out white. The simplifier
   keeps every chart border (it must, or the paint tears), so the cut keeps
   these charts as tiny triangles while the rest of the head goes coarse.

   THE FIX touches no painted pixel and moves no vertex. A chart is UNSAFE
   when it is thin at the sheet's FINAL size (few of its texels have all
   their neighbours inside it, so nearly every fetch is an edge fetch) AND
   the texels just outside it are a different colour (a thin chart in its
   own padding bleeds nothing). Each unsafe chart gets ONE colour — the
   median of the source texels it covers, at the source's own size — and
   all its UVs are pointed at the centre of a texel elsewhere on the sheet
   whose 5×5 neighbourhood is that colour already. With all three UVs of a
   triangle equal its UV derivatives are zero, so the GPU samples mip 0 at
   that texel; the 5×5 margin absorbs bilinear reach and the UV
   quantization meshopt applies afterwards. A chart this small is a few
   millimetres of surface, so one colour is all it ever had room to show.
   A chart's vertices belong to that chart alone (a chart is a union over
   shared vertices), so nothing outside it moves.
     import { fixThinCharts } from './chartfix.mjs';
     await fixThinCharts(doc, { finalPx: 1024 }); */
import sharp from 'sharp';

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export async function fixThinCharts(doc, { finalPx, ringDiff = 0.22, risk = 0.15, inset = 1.5, log = console.log, report = null } = {}) {
  const root = doc.getRoot();
  let charts = 0, fixed = 0, fixedTris = 0, worst = 0, fromSurface = 0, armTris = 0, pulled = 0, guarded = 0;
  for (const mat of root.listMaterials()) {
    const tex = mat.getBaseColorTexture(); if (!tex) continue;
    const img = Buffer.from(tex.getImage());
    const src = await sharp(img).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const S = src.info.width, SH = src.info.height, SD = src.data;
    const F = finalPx || S;
    const fin = await sharp(img).removeAlpha().resize(F, F, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
    const FD = fin.data;
    const sCol = (x, y) => { const o = (y * S + x) * 3; return [SD[o] / 255, SD[o + 1] / 255, SD[o + 2] / 255]; };
    const fCol = (x, y) => { x = Math.min(F - 1, Math.max(0, x)); y = Math.min(F - 1, Math.max(0, y)); const o = (y * F + x) * 3; return [FD[o] / 255, FD[o + 1] / 255, FD[o + 2] / 255]; };

    /* the sheet's UNIFORM spots at its final size: texels whose 5×5 block
       sits within 0.05 of its own mean, binned by colour for the lookup */
    const R = 2, bins = new Map(), BQ = 12;
    for (let y = R + 1; y < F - R - 1; y++) for (let x = R + 1; x < F - R - 1; x++) {
      let m = [0, 0, 0];
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const c = fCol(x + dx, y + dy); m[0] += c[0]; m[1] += c[1]; m[2] += c[2]; }
      const N = (2 * R + 1) ** 2; m = m.map(v => v / N);
      let dev = 0;
      for (let dy = -R; dy <= R && dev <= 0.05; dy++) for (let dx = -R; dx <= R; dx++) { dev = Math.max(dev, dist(fCol(x + dx, y + dy), m)); if (dev > 0.05) break; }
      if (dev > 0.05) continue;
      const k = m.map(v => Math.min(BQ - 1, Math.floor(v * BQ))).join(',');
      let b = bins.get(k); if (!b) bins.set(k, b = []);
      if (b.length < 64) b.push([x, y, m, dev]);
    }
    const nearest = (c) => {
      let best = null, bd = 9;
      const k0 = c.map(v => Math.min(BQ - 1, Math.floor(v * BQ)));
      for (let r = 0; r < BQ && !best; r++) {
        for (let i = k0[0] - r; i <= k0[0] + r; i++) for (let j = k0[1] - r; j <= k0[1] + r; j++) for (let l = k0[2] - r; l <= k0[2] + r; l++) {
          const b = bins.get(`${i},${j},${l}`); if (!b) continue;
          for (const s of b) { const d = dist(s[2], c) + s[3]; if (d < bd) { bd = d; best = s; } }
        }
      }
      return best && { x: best[0], y: best[1], d: bd };
    };

    for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
      if (p.getMaterial() !== mat) continue;
      const pos = p.getAttribute('POSITION'), uv = p.getAttribute('TEXCOORD_0'), I = p.getIndices().getArray();
      if (!uv) continue;
      const n = pos.getCount(), T = I.length / 3, a = [0, 0, 0], b = [0, 0];
      const U = new Float64Array(n * 2), keys = new Array(n);
      for (let i = 0; i < n; i++) { pos.getElement(i, a); uv.getElement(i, b); U[2 * i] = b[0]; U[2 * i + 1] = b[1]; keys[i] = `${a[0]},${a[1]},${a[2]},${b[0]},${b[1]}`; }
      // charts: vertices joined through triangles, and copies of one (position, uv)
      const par = Int32Array.from({ length: n }, (_, i) => i);
      const find = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
      const km = new Map(); for (let i = 0; i < n; i++) { const j = km.get(keys[i]); if (j === undefined) km.set(keys[i], i); else par[find(i)] = find(j); }
      for (let t = 0; t < T; t++) { const r0 = find(I[3 * t]); for (let k = 1; k < 3; k++) { const r = find(I[3 * t + k]); if (r !== r0) par[r] = r0; } }
      const byChart = new Map();
      for (let t = 0; t < T; t++) { const r = find(I[3 * t]); let l = byChart.get(r); if (!l) byChart.set(r, l = []); l.push(t); }
      charts += byChart.size;
      // texel centres inside a chart's triangles at a sheet size Z
      const cover = (tris, Z) => {
        const set = new Set();
        for (const t of tris) {
          const P = [0, 1, 2].map(k => [U[2 * I[3 * t + k]] * Z, U[2 * I[3 * t + k] + 1] * Z]);
          const den = (P[1][1] - P[2][1]) * (P[0][0] - P[2][0]) + (P[2][0] - P[1][0]) * (P[0][1] - P[2][1]);
          if (Math.abs(den) < 1e-12) continue;
          const x0 = Math.floor(Math.min(P[0][0], P[1][0], P[2][0])), x1 = Math.ceil(Math.max(P[0][0], P[1][0], P[2][0]));
          const y0 = Math.floor(Math.min(P[0][1], P[1][1], P[2][1])), y1 = Math.ceil(Math.max(P[0][1], P[1][1], P[2][1]));
          for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
            const px = x + 0.5, py = y + 0.5;
            const w0 = ((P[1][1] - P[2][1]) * (px - P[2][0]) + (P[2][0] - P[1][0]) * (py - P[2][1])) / den;
            const w1 = ((P[2][1] - P[0][1]) * (px - P[2][0]) + (P[0][0] - P[2][0]) * (py - P[2][1])) / den;
            if (w0 >= -1e-9 && w1 >= -1e-9 && 1 - w0 - w1 >= -1e-9 && x >= 0 && y >= 0 && x < Z && y < Z) set.add(y * Z + x);
          }
        }
        return set;
      };
      const centroid = (tris, Z) => { let x = 0, y = 0; for (const t of tris) for (let k = 0; k < 3; k++) { x += U[2 * I[3 * t + k]]; y += U[2 * I[3 * t + k] + 1]; } const m = tris.length * 3; return [Math.floor(x / m * Z), Math.floor(y / m * Z)]; };
      // positions: copies of one point across a seam are one place on the surface
      const P = new Float64Array(n * 3);
      for (let i = 0; i < n; i++) { pos.getElement(i, a); P.set(a, 3 * i); }
      const gm = new Map(), gid = new Int32Array(n); let G = 0;
      for (let i = 0; i < n; i++) { const k = `${P[3 * i]},${P[3 * i + 1]},${P[3 * i + 2]}`; let g = gm.get(k); if (g === undefined) { g = G++; gm.set(k, g); } gid[i] = g; }
      const triAt = Array.from({ length: G }, () => []);
      for (let t = 0; t < T; t++) for (let k = 0; k < 3; k++) triAt[gid[I[3 * t + k]]].push(t);
      const area = t => { const [i, j, k] = [I[3 * t], I[3 * t + 1], I[3 * t + 2]];
        const ux = P[3*j] - P[3*i], uy = P[3*j+1] - P[3*i+1], uz = P[3*j+2] - P[3*i+2], vx = P[3*k] - P[3*i], vy = P[3*k+1] - P[3*i+1], vz = P[3*k+2] - P[3*i+2];
        return Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx) / 2; };
      const median = cols => [0, 1, 2].map(c => { const v = cols.map(q => q[c]).sort((p, q) => p - q); return v[v.length >> 1]; });
      const ownCols = tris => { const cs = cover(tris, S), cols = [];
        if (cs.size) for (const k of cs) cols.push(sCol(k % S, (k / S) | 0));
        else { const [x, y] = centroid(tris, S); cols.push(sCol(Math.min(S - 1, Math.max(0, x)), Math.min(SH - 1, Math.max(0, y)))); }
        return cols; };

      /* pass 1: which charts are THIN at the final size — few of their texels
         have all eight neighbours inside them, so nearly every fetch is an edge */
      const chartOf = new Int32Array(T), info = new Map();
      for (const [r, tris] of byChart) {
        for (const t of tris) chartOf[t] = r;
        const cf = cover(tris, F);
        let inner = 0;
        for (const k of cf) { const x = k % F, y = (k / F) | 0; let all = true;
          for (let dy = -1; dy <= 1 && all; dy++) for (let dx = -1; dx <= 1; dx++) if (!cf.has((y + dy) * F + x + dx)) { all = false; break; }
          if (all) inner++; }
        info.set(r, { tris, cf, inner, thin: !(cf.size >= 6 && inner >= 0.35 * cf.size) });
      }
      /* the colour each triangle of a SOLID chart shows: its own interior */
      const solidCol = new Map();
      const colOf = t => { let c = solidCol.get(t); if (!c) { const cols = ownCols([t]); c = cols.reduce((m, q) => [m[0] + q[0] / cols.length, m[1] + q[1] / cols.length, m[2] + q[2] / cols.length], [0, 0, 0]); solidCol.set(t, c); } return c; };

      /* pass 2: what the SURFACE around each thin chart looks like — the
         area-weighted colour of the solid triangles touching it in 3D. A thin
         chart's own texels can be a smear that does not even line up with it
         (photographed: strips laid across the border of a white and a black
         patch), but the hair round a millimetre of hair is hair. A thin chart
         ringed only by thin charts takes its colour from them once they have one. */
      const final = new Map(), around = new Map();
      let pending = [...info.entries()].filter(([, c]) => c.thin);
      for (let pass = 0; pass < 8 && pending.length; pass++) {
        const next = [], got = [];
        for (const [r, c] of pending) {
          const near = new Set();
          for (const t of c.tris) for (let k = 0; k < 3; k++) for (const u of triAt[gid[I[3 * t + k]]]) if (chartOf[u] !== r) near.add(u);
          const list = [];
          for (const u of near) { const cu = chartOf[u], ci = info.get(cu);
            const col = ci.thin ? final.get(cu) : colOf(u); if (!col) continue;
            list.push([col, (ci.thin ? 0.5 : 1) * Math.max(area(u), 1e-12)]); }
          if (list.length) got.push([r, list]); else next.push([r, c]);
        }
        for (const [r, list] of got) {
          around.set(r, list);
          // the surface's own colour: a weighted median per channel — a colour that is THERE, not a blend of two sides
          const W = list.reduce((s, q) => s + q[1], 0);
          final.set(r, [0, 1, 2].map(ch => { const v = list.map(q => [q[0][ch], q[1]]).sort((p, q) => p[0] - q[0]); let acc = 0; for (const [x, w] of v) { acc += w; if (acc >= W / 2) return x; } return v[v.length - 1][0]; }));
        }
        pending = next;
      }

      /* pass 3: decide, and point the chart at a uniform spot of that colour.
         Its own median stands when a fifth of the surface round it shares it
         (the tone of a patch of skin is kept, and a strip on a hairline may be
         hair or skin); otherwise it is an outlier — a white speck in black
         hair — and the surface's colour wins. A thin
         chart that already agrees with its surface AND sits in a ring of its
         own colour bleeds nothing, and is left exactly as it was. */
      for (const [r, c] of info) {
        if (!c.thin) continue;
        const own = median(ownCols(c.tris)), nb = final.get(r) || own, list = around.get(r) || [];
        // its own colour stands if a fifth of the surface round it is that colour (a hairline strip is hair OR skin, and either is there)
        const W = list.reduce((s, q) => s + q[1], 0), like = list.reduce((s, q) => s + (dist(q[0], own) < 0.25 ? q[1] : 0), 0);
        const agree = !list.length || like >= 0.2 * W, col = agree ? own : nb;
        const ring = new Set(), base = c.cf.size ? c.cf : new Set([centroid(c.tris, F)].map(([x, y]) => y * F + x));
        for (const k of base) { const x = k % F, y = (k / F) | 0;
          for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const q = (y + dy) * F + x + dx; if (!base.has(q)) ring.add(q); } }
        let bad = 0; for (const q of ring) if (dist(fCol(q % F, (q / F) | 0), col) > ringDiff) bad++;
        const riskNow = ring.size ? bad / ring.size : 1;
        if (agree && riskNow <= risk) continue;
        const s = nearest(col); if (!s) continue;
        worst = Math.max(worst, s.d);
        const u = (s.x + 0.5) / F, v = (s.y + 0.5) / F, done = new Set();
        for (const t of c.tris) for (let k = 0; k < 3; k++) { const i = I[3 * t + k]; if (done.has(i)) continue; done.add(i); uv.setElement(i, [u, v]); }
        fixed++; fixedTris += c.tris.length; if (!agree) fromSurface++;
        if (report) report.push({ t0: c.tris[0], tris: c.tris.length, texels: c.cf.size, inner: c.inner, own: own.map(v => +v.toFixed(2)), surface: nb.map(v => +v.toFixed(2)), used: agree ? 'own' : 'surface', risk: +riskNow.toFixed(2), match: +s.d.toFixed(3) });
      }

      /* pass 4: a solid chart can still carry a THIN ARM — a strip two
         texels wide hanging off its edge (woman 1's hair, photographed after
         passes 1–3: white streaks on triangles of charts of hundreds of
         texels). Each triangle is asked the chart's question for itself:
         does at least half of what it covers have, within a texel, a texel
         that is outside its chart and another colour? Then it is an edge-only
         triangle, and it alone gets its own three vertices pointed at a
         uniform spot of its own colour. */
      const exposed = [];
      for (const [r, c] of info) {
        if (c.thin) continue;
        for (const t of c.tris) {
          let cov = cover([t], F); if (!cov.size) { const [x, y] = centroid([t], F); cov = new Set([y * F + x]); }
          const col = median(ownCols([t]));
          let bad = 0;
          for (const k of cov) { const x = k % F, y = (k / F) | 0; let out = false;
            for (let dy = -1; dy <= 1 && !out; dy++) for (let dx = -1; dx <= 1; dx++) { const q = (y + dy) * F + x + dx;
              if (!c.cf.has(q) && dist(fCol(x + dx, y + dy), col) > ringDiff) { out = true; break; } }
            if (out) bad++; }
          if (bad >= 0.5 * cov.size) exposed.push([t, col]);
        }
      }
      /* pass 5: THE GUTTER. What is left is the edge of a solid chart where
         the packer laid another chart of another colour flush against it
         (woman 1, photographed after pass 4: faint white lines along the
         seams where two patches of her hair meet, each the border of a
         chart of hundreds of texels with a white chart one texel away). A
         fetch at that border blends the neighbour in. Every border vertex of
         a solid chart whose outside is another colour is pulled INWARD by
         `inset` texels, so the chart's own pixels form the gutter the packer
         left out; the paint does not move, and a texel and a half is far
         below what the eye can see shift. A pull that would fold or crush a
         triangle in the sheet is halved, then dropped. */
      const armSet = new Set(exposed.map(e => e[0])), Dv = inset / F;
      for (const [r, c] of info) {
        if (c.thin) continue;
        const tris = c.tris.filter(t => !armSet.has(t)); if (!tris.length) continue;
        const vid = new Map(), members = new Map();
        const id = i => { let v = vid.get(keys[i]); if (v === undefined) { vid.set(keys[i], v = vid.size); members.set(v, new Set()); } members.get(v).add(i); return v; };
        const edges = new Map();
        for (const t of tris) for (let k = 0; k < 3; k++) {
          const i = I[3 * t + k], j = I[3 * t + (k + 1) % 3], o = I[3 * t + (k + 2) % 3], a = id(i), b = id(j), ek = a < b ? a + ',' + b : b + ',' + a;
          const e = edges.get(ek); if (e) e.n++; else edges.set(ek, { n: 1, i, j, o, a, b });
        }
        const pull = new Map();
        for (const e of edges.values()) {
          if (e.n !== 1) continue;
          const ex = U[2 * e.j] - U[2 * e.i], ey = U[2 * e.j + 1] - U[2 * e.i + 1], L = Math.hypot(ex, ey); if (L < 1e-9) continue;
          let nx = -ey / L, ny = ex / L;
          if (nx * (U[2 * e.o] - U[2 * e.i]) + ny * (U[2 * e.o + 1] - U[2 * e.i + 1]) < 0) { nx = -nx; ny = -ny; }
          const mx = (U[2 * e.i] + U[2 * e.j]) / 2, my = (U[2 * e.i + 1] + U[2 * e.j + 1]) / 2;
          const at = (d) => fCol(Math.floor((mx + nx * d / F) * F), Math.floor((my + ny * d / F) * F));
          const inside = at(1.5);
          if (dist(at(-0.7), inside) <= ringDiff && dist(at(-1.7), inside) <= ringDiff) continue;
          for (const v of [e.a, e.b]) { const q = pull.get(v) || [0, 0]; q[0] += nx; q[1] += ny; pull.set(v, q); }
        }
        if (!pull.size) continue;
        const move = new Map();
        for (const [v, q] of pull) { const L = Math.hypot(q[0], q[1]); if (L > 1e-9) move.set(v, [q[0] / L * Dv, q[1] / L * Dv]); }
        const uvAt = (i, sc) => { const m = move.get(vid.get(keys[i])); return m ? [U[2 * i] + m[0] * sc.get(vid.get(keys[i])), U[2 * i + 1] + m[1] * sc.get(vid.get(keys[i]))] : [U[2 * i], U[2 * i + 1]]; };
        const scale = new Map([...move.keys()].map(v => [v, 1]));
        const areaUV = (t, f) => { const A = f(I[3 * t]), B = f(I[3 * t + 1]), C = f(I[3 * t + 2]); return (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]); };
        for (let round = 0; round < 3; round++) {
          let bad = 0;
          for (const t of tris) {
            const a0 = areaUV(t, i => [U[2 * i], U[2 * i + 1]]), a1 = areaUV(t, i => uvAt(i, scale));
            if (Math.sign(a1) !== Math.sign(a0) || Math.abs(a1) < 0.3 * Math.abs(a0)) {
              bad++; for (let k = 0; k < 3; k++) { const v = vid.get(keys[I[3 * t + k]]); if (scale.has(v)) scale.set(v, round < 2 ? scale.get(v) * 0.5 : 0); }
            }
          }
          if (!bad) break;
        }
        for (const [v, m] of move) { const sc = scale.get(v); if (!sc) { guarded++; continue; }
          for (const i of members.get(v)) uv.setElement(i, [U[2 * i] + m[0] * sc, U[2 * i + 1] + m[1] * sc]); pulled++; }
      }

      if (exposed.length) {
        const n0 = pos.getCount(), N = n0 + 3 * exposed.length, I0 = p.getIndices().getArray();
        for (const sem of p.listSemantics()) {
          const acc = p.getAttribute(sem), old = acc.getArray(), es = acc.getElementSize();
          const arr = new old.constructor(N * es); arr.set(old);
          let o = n0; for (const [t] of exposed) for (let k = 0; k < 3; k++, o++) for (let e = 0; e < es; e++) arr[o * es + e] = old[I0[3 * t + k] * es + e];
          acc.setArray(arr);
        }
        const I2 = N > 65535 && !(I0 instanceof Uint32Array) ? new Uint32Array(I0) : I0;
        let o = n0;
        for (const [t, col] of exposed) {
          const s = nearest(col); if (!s) { o += 3; continue; }
          worst = Math.max(worst, s.d);
          for (let k = 0; k < 3; k++, o++) { I2[3 * t + k] = o; uv.setElement(o, [(s.x + 0.5) / F, (s.y + 0.5) / F]); }
          armTris++;
        }
        p.getIndices().setArray(I2);
      }
    }
  }
  log(`  thin charts: ${fixed} of ${charts} charts (${fixedTris} triangles) were edge-only and bled their neighbours — each pointed at a uniform spot of its colour, ${fromSurface} taking the colour of the surface round it; ${armTris} triangles on the thin arms of solid charts; ${pulled} border vertices pulled ${inset} texels in from a neighbour of another colour (${guarded} left where the pull would fold a triangle) (worst match ${worst.toFixed(3)})`);
  return { charts, fixed, fixedTris, worst, fromSurface, armTris, pulled, guarded };
}
