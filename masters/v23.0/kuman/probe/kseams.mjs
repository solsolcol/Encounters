// do the scan's normals agree across its UV seams? (the copies of one position)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const f of process.argv.slice(2)) {
  const d = await io.read(f);
  const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
  const P = p.getAttribute('POSITION').getArray(), N = p.getAttribute('NORMAL').getArray();
  const nv = P.length / 3; const m = new Map(); let groups = 0, split = 0; const angs = [];
  for (let i = 0; i < nv; i++) { const k = Math.round(P[3*i]*1e6)+','+Math.round(P[3*i+1]*1e6)+','+Math.round(P[3*i+2]*1e6); const g = m.get(k); if (g === undefined) m.set(k, [i]); else g.push(i); }
  for (const g of m.values()) { groups++; if (g.length < 2) continue; split++; let worst = 0; for (let a = 1; a < g.length; a++) { const i = g[0], j = g[a]; const dot = N[3*i]*N[3*j]+N[3*i+1]*N[3*j+1]+N[3*i+2]*N[3*j+2]; worst = Math.max(worst, Math.acos(Math.max(-1, Math.min(1, dot))) * 180 / Math.PI); } angs.push(worst); }
  angs.sort((a, b) => a - b); const q = x => angs.length ? angs[Math.floor(angs.length * x)].toFixed(2) : '-';
  console.log(f.split('/').pop(), 'positions', groups, 'split at seams', split, 'angle between copies (deg) 50/90/99/max:', q(.5), q(.9), q(.99), angs.length ? angs[angs.length-1].toFixed(1) : '-');
}
