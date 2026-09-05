/* v6.4 — the step prepwoman.mjs does not do: shrink the CLIPS a character
   keeps. Mixamo bakes every take at 30 fps with a key on every channel on
   every frame, and after the mesh has been simplified and the sheets
   shrunk, the keyframes are what is left — the young master's six takes
   were 670 KB of a 2.4 MB file. gltf-transform's resample() drops the keys
   a linear interpolation would have produced anyway (within a tolerance),
   which on baked curves is most of them, with no visible change. Named
   clips can be dropped at the same time.

   Usage: node tools/resampleclips.mjs in.glb out.glb [tolerance=1e-4] [dropClips comma-list] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { resample, prune } from '@gltf-transform/functions';
import fs from 'node:fs';

const [inp, outp, tolS = '1e-4', dropS = ''] = process.argv.slice(2);
const DROP = dropS.split(',').map(s => s.trim()).filter(Boolean);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;
const keysOf = () => root.listAnimations().map(a => [a.getName(), a.listSamplers().reduce((n, s) => n + (s.getInput()?.getCount() || 0), 0)]);
const k0 = Object.fromEntries(keysOf());
for (const a of root.listAnimations()) {
  if (!DROP.includes(a.getName())) continue;
  for (const c of a.listChannels()) c.dispose();
  for (const s of a.listSamplers()) s.dispose();
  a.dispose();
  console.log('   drop clip', a.getName());
}
await doc.transform(resample({ tolerance: +tolS }), prune());
for (const [name, n] of keysOf()) console.log('  ', name.padEnd(34), k0[name], '->', n, 'keys');
await io.write(outp, doc);
const after = fs.statSync(outp).size;
console.log(`   ${inp.split('/').pop()} -> ${outp.split('/').pop()}: ${(before / 1024 | 0)} KB -> ${(after / 1024 | 0)} KB`);
