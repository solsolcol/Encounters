/* v26.0 · the triangles, joints and takes of GLB files, read from each file's JSON chunk alone (nothing decoded, so a
   600 MB scan answers at once): the sum of every primitive's index count over three.
     node tools/tricount.mjs a.glb [b.glb ...]        (--n prints the first file's triangle count alone, for a script) */
import fs from 'node:fs';
const files = process.argv.slice(2).filter(a => !a.startsWith('--')), bare = process.argv.includes('--n');
for (const f of files) {
  const fd = fs.openSync(f, 'r'), head = Buffer.alloc(20); fs.readSync(fd, head, 0, 20, 0);
  const len = head.readUInt32LE(12), buf = Buffer.alloc(len); fs.readSync(fd, buf, 0, len, 20); fs.closeSync(fd);
  const j = JSON.parse(buf.toString('utf8')); let t = 0;
  for (const m of j.meshes || []) for (const p of m.primitives) t += (p.indices != null ? j.accessors[p.indices].count : j.accessors[p.attributes.POSITION].count) / 3;
  if (bare) { console.log(t); break; }
  console.log(f.split('/').pop().padEnd(28), String(t).padStart(9), 'tris', (j.skins?.[0]?.joints.length || 0) + ' joints', (j.animations || []).length + ' takes', (fs.statSync(f).size / 1048576).toFixed(1) + ' MB');
}
