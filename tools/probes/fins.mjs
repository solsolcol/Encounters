// v28.0 · FINS: triangles that hang from the body by one edge (their other two edges belong to no other triangle), the
// leftovers a remesh can leave lying on the surface. Read only: prints each one's place, size and which way it faces.
//   node tools/probes/fins.mjs <file.glb> [more.glb ...]
// (a body is joined by PLACE first: a seam in the sheet splits a point in two, and those two are one place)
// (tools/prepmonk.mjs takes finsOf from here, FINS=1: nothing else in this file runs when it is imported)
export function finsOf(P, I) {      // P: Float32Array of places, I: indices; answers { fins: [triangle index...], edges: [n1, n2, n3, n4plus], open: boundary edges not on a fin }
  const n = P.length / 3, m = I.length / 3, place = new Map(), at = new Uint32Array(n);
  for (let i = 0; i < n; i++) { const k = `${Math.round(P[3 * i] * 1e5)},${Math.round(P[3 * i + 1] * 1e5)},${Math.round(P[3 * i + 2] * 1e5)}`; let id = place.get(k); if (id === undefined) { id = place.size; place.set(k, id); } at[i] = id; }
  const E = new Map(), ek = (a, b) => a < b ? a * 4294967296 + b : b * 4294967296 + a;
  for (let t = 0; t < m; t++) for (let k = 0; k < 3; k++) { const a = at[I[3 * t + k]], b = at[I[3 * t + (k + 1) % 3]]; if (a === b) continue; const key = ek(a, b); const l = E.get(key); if (l) l.push(t); else E.set(key, [t]); }
  const edges = [0, 0, 0, 0]; for (const l of E.values()) edges[Math.min(l.length, 4) - 1]++;
  const fins = [], onFin = new Set();
  for (let t = 0; t < m; t++) { let alone = 0, shared = 0, deg = 0; for (let k = 0; k < 3; k++) { const a = at[I[3 * t + k]], b = at[I[3 * t + (k + 1) % 3]]; if (a === b) { deg++; continue; } const c = E.get(ek(a, b)).length; if (c === 1) alone++; else if (c >= 3) shared++; }
    if (alone === 2 && shared === 1 && !deg) { fins.push(t); for (let k = 0; k < 3; k++) onFin.add(ek(at[I[3 * t + k]], at[I[3 * t + (k + 1) % 3]])); } }
  let open = 0; for (const [key, l] of E) if (l.length === 1 && !onFin.has(key)) open++;
  return { fins, edges, open, places: place.size };
}
if (process.argv[1] && process.argv[1].endsWith('fins.mjs')) {
  const { NodeIO } = await import('@gltf-transform/core'), { ALL_EXTENSIONS } = await import('@gltf-transform/extensions'), { MeshoptDecoder, MeshoptEncoder } = await import('meshoptimizer');
  await MeshoptDecoder.ready; await MeshoptEncoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
  for (const f of process.argv.slice(2)) {
  const doc = await io.read(f), root = doc.getRoot();
  for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
    const P = Float32Array.from(p.getAttribute('POSITION').getArray()), I = Uint32Array.from(p.getIndices().getArray());
    let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (let i = 0; i < P.length; i += 3) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], P[i + k]); hi[k] = Math.max(hi[k], P[i + k]); }
    const s = 1.74 / (hi[1] - lo[1]), c = [(lo[0] + hi[0]) / 2, lo[1], (lo[2] + hi[2]) / 2];
    const r = finsOf(P, I);
    console.log(`${f}: ${I.length / 3} triangles on ${r.places} places; edges with 1/2/3/4+ triangles: ${r.edges.join(' / ')}; fins ${r.fins.length}; open edges not on a fin ${r.open}`);
    for (const t of r.fins) { const q = [0, 1, 2].map(k => [0, 1, 2].map(a => (P[3 * I[3 * t + k] + a] - c[a]) * s));
      const u = [0, 1, 2].map(a => q[1][a] - q[0][a]), v = [0, 1, 2].map(a => q[2][a] - q[0][a]), nx = u[1] * v[2] - u[2] * v[1], ny = u[2] * v[0] - u[0] * v[2], nz = u[0] * v[1] - u[1] * v[0], ar = Math.hypot(nx, ny, nz) / 2;
      const len = [0, 1, 2].map(k => Math.hypot(...[0, 1, 2].map(a => q[k][a] - q[(k + 1) % 3][a])));
      console.log(`   tri ${t} at (${[0, 1, 2].map(a => ((q[0][a] + q[1][a] + q[2][a]) / 3).toFixed(3)).join(', ')}) m (at 1.74 m tall, feet 0): ${(ar * 1e6).toFixed(1)} mm2, edges ${len.map(x => (x * 1000).toFixed(1)).join(' / ')} mm, facing (${[nx, ny, nz].map(x => (x / (2 * ar || 1)).toFixed(2)).join(', ')})`); }
  }
}
}
