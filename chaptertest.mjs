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
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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
  // v6.0: the episode a chapter belongs to, when it says — an integer 1..10
  if (ch.episode !== undefined && !(Number.isInteger(ch.episode) && ch.episode >= 1 && ch.episode <= 10)) {
    bad(key, `episode must be an integer from 1 to 10, not ${JSON.stringify(ch.episode)}`);
  }

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

/* --- every voice take is written down (v5.14) -----------------------------
   src/voicelines.js is the registry of every spoken line — who, where, the
   words, the measured length. It is not shipped; it is what the VOICE LINES
   tab of Chad's sheet is made from. A take without a row is a line he cannot
   review; a row without a take is a line the game cannot play. A voice take
   is a sound whose name starts with v or t5 and is not a room bed. */
const voiceWin = {};
try {
  new Function('window', readFileSync(join(DIR, 'src', 'voicelines.js'), 'utf8'))(voiceWin);
} catch (e) { errs.push('ERR src/voicelines.js failed to load: ' + e.message); }
const VOICE = voiceWin.__VOICE__;
if (VOICE && Array.isArray(VOICE.LINES)) {
  const rows = new Set(VOICE.LINES.map(l => l.id));
  const isVoice = n => /^(v|t5)/.test(n) && !/room$/.test(n);
  for (const n of [...HAVE_SOUND].filter(isVoice).sort()) {
    if (!rows.has(n)) errs.push(`voice: assets/audio/${n}.mp3 has no row in src/voicelines.js`);
  }
  for (const l of VOICE.LINES) {
    const file = l.id === 'voice' ? join(DIR, 'assets', 'voice.mp3') : join(audioDir, `${l.id}.mp3`);
    if (!existsSync(file)) errs.push(`voice: row '${l.id}' has no take on disk`);
    if (!VOICE.SPEAKERS?.[l.who]) errs.push(`voice: row '${l.id}' names an unknown speaker '${l.who}'`);
    if (!VOICE.CHAPTERS?.[l.ch]) errs.push(`voice: row '${l.id}' names an unknown chapter '${l.ch}'`);
    if (typeof l.text !== 'string' || !l.text.trim() || l.text.includes('???')) {
      errs.push(`voice: row '${l.id}' has no text written down`);
    }
    if (typeof l.secs !== 'number' || !(l.secs > 0)) errs.push(`voice: row '${l.id}' has no measured length`);
  }
  if (rows.size !== VOICE.LINES.length) errs.push('voice: a sample has two rows in src/voicelines.js');

  /* v5.26: the boy's takes ride their own bus in the engine (VOICE_BOOST),
     and the engine has to know which samples are HIS. It cannot be told by
     a prefix — his files are `v*` but so are the mother's (`v2ma`) and the
     auntie's (`v3aunt1`) — so main.js spells the set out, and this check is
     what keeps that copy honest. A new line for him that never reaches
     JAMES_TAKES would not error at runtime; it would simply play at the old
     volume, which is precisely the kind of silent drift nobody hears until
     the whole chapter is built. */
  const mainSrc = readFileSync(join(DIR, 'src', 'main.js'), 'utf8');
  const setLit = mainSrc.match(/const JAMES_TAKES = new Set\(\[([\s\S]*?)\]\)/);
  if (!setLit) errs.push('voice: main.js has no JAMES_TAKES set');
  else {
    const inEngine = new Set([...setLit[1].matchAll(/'([^']+)'/g)].map(m => m[1]));
    const inRegistry = new Set(VOICE.LINES.filter(l => l.who === 'james').map(l => l.id));
    for (const id of inRegistry) {
      if (!inEngine.has(id)) errs.push(`voice: '${id}' is james in the registry but missing from JAMES_TAKES in main.js`);
    }
    for (const id of inEngine) {
      if (!inRegistry.has(id)) errs.push(`voice: JAMES_TAKES names '${id}', which is not a james row in src/voicelines.js`);
    }
    console.log(`his voice bus: ${inEngine.size} takes, matching the registry`);
  }
  console.log(`voice lines: ${VOICE.LINES.length} rows, ${Object.keys(VOICE.SPEAKERS || {}).length} speakers`);
} else if (!errs.some(e => e.startsWith('ERR src/voicelines.js'))) {
  errs.push('ERR src/voicelines.js did not register window.__VOICE__');
}

// --- v6.0: the episodes — ids unique inside each, and the sheet has the words
{
  const byEp = {};
  for (const [key, ch] of Object.entries(chapters)) {
    if ((ch.id || 0) >= 90) continue;
    const n = Number.isInteger(ch.episode) ? ch.episode : 1;
    (byEp[n] ||= []).push([key, ch.id]);
  }
  for (const [n, rows] of Object.entries(byEp)) {
    const ids = rows.map(r => r[1]);
    if (new Set(ids).size !== ids.length) errs.push(`episode ${n}: two chapters share an id (${rows.map(r => r.join('=')).join(', ')})`);
    if (ids.some(i => i < 1 || i > 5)) errs.push(`episode ${n}: a chapter id is outside 1..5 (${ids.join(', ')})`);
  }
  console.log('episodes built:', Object.entries(byEp).map(([n, r]) => `${n}: ${r.length} chapter(s)`).join(', '));
  const textWin = { __TEXT__: undefined };
  try { new Function('window', readFileSync(join(DIR, 'src', 'strings.js'), 'utf8'))(textWin); }
  catch (e) { errs.push('ERR src/strings.js failed to load: ' + e.message); }
  const TEXT = textWin.__TEXT__ || {};
  for (let n = 1; n <= 10; n++) for (const f of ['label', 'title']) {
    if (!str(TEXT[`ep${n}.${f}`])) errs.push(`strings: ep${n}.${f} is missing or empty`);
  }
  for (const k of ['chapters.unwritten', 'chapters.episode', 'chapters.chapter', 'chapters.locked']) {
    if (!str(TEXT[k])) errs.push(`strings: ${k} is missing or empty`);
  }
}
console.log('errors:', errs.length ? errs : 'none');
if (errs.length) process.exit(1);
