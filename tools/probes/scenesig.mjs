/* v24.10: a SCENE SIGNATURE — every drawn thing in the world's scene (meshes, instanced meshes, skinned meshes, lines,
   sprites, points, lights), keyed by what it is (kind, name, vertex count, colour, map size, opacity, largest world
   scale) and, for the solid ones, where it stands (world position to 5 cm). Two runs that should show the same picture
   are compared as MULTISETS: what one draws and the other does not is the list to look at.
   Written for v24.10 (Chad: "Ep 3 chp 5, option d cutscene, when he light the incense, the incense is missing."):
   play hid the three sticks one by one as they were given and ending D set the bundle out again without them — right
   after the probes' phase jump (nothing given), wrong after a real play-through. A picture compared after BOTH paths
   is the check that would have caught it; e3c5drive (SIG=, ENDTS=) and e3c5ends (SIG=) write these, sigdiff.mjs
   compares them. Particles (sprites, points) are counted, not placed: they move on the wall clock. */
export function sceneSig() {                       // (runs in the page: self-contained, no closures)
  const E = window.__enc, S = E.scene, out = [];
  S.updateMatrixWorld(true);
  const r = (v) => (Math.round(v / 0.05) * 0.05).toFixed(2);
  S.traverse(o => {
    const draw = o.isMesh || o.isSprite || o.isPoints || o.isLine;
    if (!draw && !o.isLight) return;
    for (let q = o; q; q = q.parent) if (!q.visible) return;
    const e = o.matrixWorld.elements;
    const at = `@${r(e[12])},${r(e[13])},${r(e[14])}`;
    if (o.isLight) { out.push(`L:${o.type}:${o.color ? o.color.getHexString() : ''}:${(+o.intensity).toFixed(1)}${o.isAmbientLight || o.isHemisphereLight ? '' : at}`); return; }
    const g = o.geometry, n = g && g.attributes && g.attributes.position ? g.attributes.position.count : 0;
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    const col = m && m.color ? m.color.getHexString() : '-';
    const map = m && m.map && m.map.image ? `${m.map.image.width}x${m.map.image.height}` : '-';
    const op = m && m.transparent ? (Math.round(m.opacity * 10) / 10).toFixed(1) : '1';
    const kind = o.isInstancedMesh ? 'I' + o.count : o.isSkinnedMesh ? 'K' : o.isSprite ? 'S' : o.isPoints ? 'P' : o.isLine ? 'N' : 'M';
    if (o.isSprite || o.isPoints) { out.push(`${kind}:${o.name || ''}:${n}:${col}:${map}`); return; }
    const sc = Math.max(Math.hypot(e[0], e[1], e[2]), Math.hypot(e[4], e[5], e[6]), Math.hypot(e[8], e[9], e[10]));
    out.push(`${kind}:${o.name || ''}:${n}:${col}:${map}:${op}:${sc.toFixed(2)}${at}`);
  });
  return out.sort();
}
/* the moments of an ending worth comparing: a little into every shot the ending's own clock table names (END[k]) */
export function sampleTimes(END, k) {
  const T = END[k] || {}, v = Object.values(T).filter(x => typeof x === 'number' && isFinite(x)).sort((a, b) => a - b);
  const out = [0.8];
  for (const x of v) if (!out.some(y => Math.abs(y - (x + 0.8)) < 0.5)) out.push(+(x + 0.8).toFixed(2));
  return out;
}
/* a multiset difference: what A draws that B does not, and what B draws that A does not */
export function sigDiff(a, b) {
  const count = (L) => { const M = new Map(); for (const s of L) M.set(s, (M.get(s) || 0) + 1); return M; };
  const A = count(a), B = count(b), onlyA = [], onlyB = [];
  for (const [s, n] of A) { const d = n - (B.get(s) || 0); for (let i = 0; i < d; i++) onlyA.push(s); }
  for (const [s, n] of B) { const d = n - (A.get(s) || 0); for (let i = 0; i < d; i++) onlyB.push(s); }
  return { onlyA, onlyB };
}
