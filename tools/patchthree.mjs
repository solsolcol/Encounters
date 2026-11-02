/* v24.29 · THREE HONOURS A MATERIAL'S SHINE (Chad, 2 Nov 2026: "Can you update the 3d library so that it does not ignore
   the metal shine").

   three r185 draws every material lit by the SCENE's environment (its own envMap left null) at the scene's
   environmentIntensity and IGNORES the material's own envMapIntensity: WebGLRenderer's setProgram writes the uniform
   from the scene, and refreshUniformsStandard writes the material's value only when the material has an envMap of its
   own. Every lift the game wrote against the scene's environment therefore did nothing — the torch's 30 and the rifle's
   1.6 (main.js), the item views' 1.4, the shop's bronze 10, the gold trim's 6 and the pickup's 14 (e4c1) — measured in
   the program's own uniforms at v24.28 (every one 0.05; at 100x not one pixel changed).

   This rewrites that one line of three's module so the material's envMapIntensity MULTIPLIES the scene's — the meaning
   main.js's torch comment always gave it ("the scene's environmentIntensity is 0.025 and a material's envMapIntensity
   MULTIPLIES it"). A material left at 1 — every material three makes and every one a GLB brings — draws exactly as
   before, bit for bit; a material with its own envMap (episode 3's statues and trays) is not touched by this line at
   all and keeps its absolute value.

   `npm run build` runs it before esbuild bundles three. It is idempotent (an already-patched file is left as it is),
   and it STOPS THE BUILD if three's line is not there — an upgrade that moves it must have the patch redone, never
   dropped in silence (proven at v24.29 on a copy with the line changed).
     node tools/patchthree.mjs [three.module.js]   (default: the one esbuild bundles, beside require.resolve('three')) */
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const file = process.argv[2] || path.join(path.dirname(createRequire(import.meta.url).resolve('three')), 'three.module.js');
const ORIG = '\t\t\t\tm_uniforms.envMapIntensity.value = scene.environmentIntensity;\n';
const MARK = '\t\t\t\t/* encounters v24.29 (tools/patchthree.mjs): a material\'s envMapIntensity multiplies the scene\'s */\n';
const PATCHED = MARK + '\t\t\t\tm_uniforms.envMapIntensity.value = scene.environmentIntensity * material.envMapIntensity;\n';
const src = fs.readFileSync(file, 'utf8');
const count = (s, t) => s.split(t).length - 1;
if (count(src, PATCHED) === 1 && count(src, ORIG) === 0) {
  console.log('patchthree: already patched —', path.basename(file));
} else if (count(src, ORIG) === 1 && count(src, MARK) === 0) {
  /* the line must sit in the branch it is meant for: the scene's environment standing in for a missing envMap */
  const at = src.indexOf(ORIG), before = src.slice(Math.max(0, at - 400), at);
  if (!/material\.envMap === null && scene\.environment !== null \) \{\s*$/.test(before))
    throw new Error('patchthree: the line is no longer under "material.envMap === null && scene.environment !== null" in ' + file + ' — redo the patch for this three');
  fs.writeFileSync(file, src.replace(ORIG, PATCHED));
  console.log('patchthree: patched —', path.basename(file), '(a material\'s envMapIntensity multiplies the scene\'s environmentIntensity)');
} else {
  throw new Error(`patchthree: three's envMapIntensity line not found exactly once in ${file} (original ${count(src, ORIG)}, patched ${count(src, PATCHED)}) — three changed; redo the patch, never drop it`);
}
