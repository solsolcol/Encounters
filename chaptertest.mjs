/* Is every chapter's data complete, sane and in bounds?

   This is the file that stops the test suite growing a browser harness per
   chapter. Almost everything that can be wrong with a chapter is wrong in
   its DATA — a missing teaching, a stat delta with a typo'd sign, a spawn
   point outside its own bounds, an asset key that does not exist, a choice
   with no scene — and none of that needs a renderer to find. Ten chapters
   cost ten more objects in this one file's loop, not ten more harnesses.

   What it deliberately does NOT do is call build(): that needs WebGL, and
   the two full-integration harnesses (`final`, `hosted`) already play a
   real chapter end to end. This runs in plain Node in well under a second.

   A chapter file is a plain script that registers itself on
   window.__CHAPTERS__, so all this needs is a stub window and eval.       */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DIR } from './testlib.mjs';

const errs = [];
const bad = (ch, msg) => errs.push(`${ch}: ${msg}`);

// --- load every chapter the way the browser does ---------------------------
const chapDir = join(DIR, 'src', 'chapters');
const files = readdirSync(chapDir).filter(f => f.endsWith('.js')).sort();
const win = { __CHAPTERS__: undefined };
globalThis.window = win;
for (const f of files) {
  const src = readFileSync(join(chapDir, f), 'utf8');
  try { (0, eval)(src); } catch (e) { errs.push(`${f}: failed to load — ${e.message}`); }
}
const chapters = win.__CHAPTERS__ || {};
const keys = Object.keys(chapters);
console.log(`chapters found: ${keys.length ? keys.join(', ') : '(none)'} from ${files.length} file(s)`);
if (!keys.length) errs.push('ERR no chapter registered at all');

// --- the asset keys build.py actually knows how to ship --------------------
const buildPy = readFileSync(join(DIR, 'build.py'), 'utf8');
const assetBlock = buildPy.slice(buildPy.indexOf('ASSETS = {'),
                                 buildPy.indexOf('}', buildPy.indexOf('ASSETS = {')));
const KNOWN_ASSETS = [...assetBlock.matchAll(/^\s*'([a-z0-9_]+)':/gm)].map(m => m[1]);
console.log('asset keys build.py knows:', KNOWN_ASSETS.join(', ') || '(parse failed)');
if (!KNOWN_ASSETS.length) errs.push('ERR could not read ASSETS out of build.py');

const STATS = ['sanity', 'awareness', 'wisdom'];
const VERDICTS = ['best', 'good', 'bad', 'worst'];
const str = v => typeof v === 'string' && v.trim().length > 0;
const num = v => typeof v === 'number' && Number.isFinite(v);

for (const [key, ch] of Object.entries(chapters)) {
  // --- identity and words --------------------------------------------------
  for (const f of ['title', 'cardLabel', 'cardTitle', 'brief', 'prompt', 'core']) {
    if (!str(ch[f])) bad(key, `${f} is missing or empty`);
  }
  if (!num(ch.id)) bad(key, 'id is not a number');

  // --- the choices ---------------------------------------------------------
  if (!Array.isArray(ch.choices) || ch.choices.length < 2) {
    bad(key, 'needs at least two choices');
  } else {
    const seen = new Set();
    ch.choices.forEach((c, i) => {
      const at = `choice ${i}${str(c.k) ? ` (${c.k})` : ''}`;
      for (const f of ['k', 'text', 'say', 'teach']) {
        if (!str(c[f])) bad(key, `${at}: ${f} is missing or empty`);
      }
      if (seen.has(c.k)) bad(key, `${at}: duplicate choice key`);
      seen.add(c.k);
      if (!VERDICTS.includes(c.verdict)) {
        bad(key, `${at}: verdict ${JSON.stringify(c.verdict)} is not one of ${VERDICTS}`);
      }
      if (!c.d || typeof c.d !== 'object') { bad(key, `${at}: no stat deltas`); return; }
      for (const s of STATS) {
        if (!num(c.d[s])) bad(key, `${at}: ${s} delta is not a number`);
        else if (Math.abs(c.d[s]) > 60) bad(key, `${at}: ${s} delta ${c.d[s]} is out of scale`);
      }
    });
    // a chapter where nothing you do matters is a bug, not a design
    const moves = ch.choices.some(c => STATS.some(s => c.d && c.d[s] !== 0));
    if (!moves) bad(key, 'no choice changes any stat');
    // and one where every choice is the same verdict has no decision in it
    if (new Set(ch.choices.map(c => c.verdict)).size < 2) {
      bad(key, 'every choice has the same verdict');
    }
  }

  // --- the stage -----------------------------------------------------------
  const b = ch.bounds;
  if (!b || !STATS || !num(b?.minX) || !num(b?.maxX) || !num(b?.minZ) || !num(b?.maxZ)) {
    bad(key, 'bounds are missing or not numeric');
  } else {
    if (b.minX >= b.maxX || b.minZ >= b.maxZ) bad(key, 'bounds are inside out');
    for (const [name, p] of [['spawn', ch.spawn], ['shrine', ch.shrine],
                             ['ghostHome', ch.ghostHome]]) {
      if (!p || !num(p.x) || !num(p.z)) { bad(key, `${name} is missing x/z`); continue; }
      if (p.x < b.minX || p.x > b.maxX || p.z < b.minZ || p.z > b.maxZ) {
        bad(key, `${name} (${p.x}, ${p.z}) is outside the chapter's own bounds`);
      }
    }
    if (ch.spawn && !num(ch.spawn.y)) bad(key, 'spawn has no eye height (y)');
  }

  // --- what it asks the build to ship --------------------------------------
  if (!Array.isArray(ch.assets)) bad(key, 'assets is not an array');
  else for (const a of ch.assets) {
    if (!KNOWN_ASSETS.includes(a)) {
      bad(key, `asset '${a}' is not in build.py's ASSETS — it will never be shipped`);
    }
  }

  // --- the two entry points ------------------------------------------------
  if (typeof ch.build !== 'function') bad(key, 'no build(ctx)');
  if (!Array.isArray(ch.scenes)) bad(key, 'no scenes array');
  else {
    if (ch.scenes.length !== (ch.choices?.length ?? 0)) {
      bad(key, `${ch.scenes.length} scenes for ${ch.choices?.length} choices`);
    }
    ch.scenes.forEach((s, i) => {
      if (typeof s !== 'function') bad(key, `scene ${i} is not a function`);
      // (c, s, api) — a scene written against the old two-arg shape would
      // silently ignore the cutscene language and throw on its first verb
      else if (s.length < 3) bad(key, `scene ${i} takes ${s.length} args, expected (c, s, api)`);
    });
  }
}

/* --- every cutscene cue is a sound that actually exists -------------------
   A sting whose kind is not in the engine's STING_SAMPLE, or whose sample
   has no file in assets/audio/, is SILENT — no error, no warning, just a
   beat in the cutscene where nothing happens. That is exactly the bug this
   catches, and it is the kind of bug you only find by playing the scene
   with the sound on, which no harness does.

   Read statically out of the chapter source rather than by running the
   scene: a scene needs the whole cast (a stage, a ghost, a hand rig) before
   its first line executes, and every cue in the game is a literal. A cue
   built from a variable would not be seen here — none exist, and one that
   did would deserve a comment saying why. */
const mainJs = readFileSync(join(DIR, 'src', 'main.js'), 'utf8');
const sampleBlock = mainJs.slice(mainJs.indexOf('const STING_SAMPLE = {'),
                                 mainJs.indexOf('};', mainJs.indexOf('const STING_SAMPLE = {')));
const STING_TO_SAMPLE = Object.fromEntries(
  [...sampleBlock.matchAll(/(\w+):\s*\['([a-zA-Z0-9_]+)',/g)].map(m => [m[1], m[2]]));
if (!Object.keys(STING_TO_SAMPLE).length) {
  errs.push('ERR could not read STING_SAMPLE out of src/main.js');
}
// 'step' is the one kind with no STING_SAMPLE row: it is routed to the
// four-sample footstep rotation before the table is ever consulted.
const SPECIAL_KINDS = new Set(['step']);
const audioDir = join(DIR, 'assets', 'audio');
const HAVE_SOUND = new Set(readdirSync(audioDir)
  .filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));

for (const f of files) {
  const src = readFileSync(join(chapDir, f), 'utf8');
  const cues = [...src.matchAll(/\bsfx\(\s*[^,)]+,\s*'([a-zA-Z0-9_]+)'/g)].map(m => m[1]);
  const uniq = [...new Set(cues)].sort();
  console.log(`${f}: ${cues.length} cutscene cues, ${uniq.length} distinct — ${uniq.join(' ') || '(none)'}`);
  for (const kind of uniq) {
    if (SPECIAL_KINDS.has(kind)) continue;
    const sample = STING_TO_SAMPLE[kind];
    if (!sample) {
      bad(f, `cue '${kind}' is not a kind in STING_SAMPLE — it plays nothing`);
    } else if (!HAVE_SOUND.has(sample)) {
      bad(f, `cue '${kind}' maps to sample '${sample}', which has no assets/audio/${sample}.mp3`);
    }
  }
}
// and every sample the table names must exist too, so a renamed file is
// caught here rather than in whichever scene happens to use it
for (const [kind, sample] of Object.entries(STING_TO_SAMPLE)) {
  if (!HAVE_SOUND.has(sample)) {
    errs.push(`engine: sting kind '${kind}' names sample '${sample}', which has no assets/audio/${sample}.mp3`);
  }
}

console.log('errors:', errs.length ? errs : 'none');
if (errs.length) process.exit(1);
