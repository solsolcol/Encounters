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
// v7.0: and its subfolders — one folder per episode (src/chapters/e2/)
const files = readdirSync(chapDir, { recursive: true }).map(String).filter(f => f.endsWith('.js')).sort();
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

  // --- v7.0: the play kit's declarations, when a chapter makes them --------
  if (ch.torch !== undefined && (typeof ch.torch !== 'object' || ch.torch === null)) {
    bad(key, 'torch must be an object ({ on, angle, color, ... })');
  }
  if (ch.words && ch.words.presence !== undefined && !str(ch.words.presence)) bad(key, 'words.presence is empty');

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

/* --- every line a chapter SPEAKS has a measured length ---------------------
   v14.3. `sayLine` states its one-voice-at-a-time window in the chapter's own
   `SECS` table — `speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25` — so
   a line the table does not carry books 2.5 s whatever its take actually is.
   A take LONGER than that releases the queue early and the next voice starts
   over its last word; there is no error and no harness hears it. Two of these
   were live when the check was written: e2c4's three v13.0 sighting shouts
   (k4cyc is 3.42 s) and e2c1's two v9.3 shouts on the run home (k1hurry is
   2.72). Both were measured at the time and simply never entered.

   Read statically, like the cue scan below: the names are all literals, and
   the table is one object per chapter. A chapter that speaks nothing outside
   a cutscene needs no table and is skipped.                                */
{
  let spoke = 0;
  for (const f of files) {
    const src = readFileSync(join(chapDir, f), 'utf8');
    const used = [...new Set([...src.matchAll(/(?:sayLine|queueLine)\(\s*'([A-Za-z0-9_]+)'/g)].map(m => m[1]))];
    if (!used.length) continue;
    const i = src.indexOf('const SECS = {');
    if (i < 0) { bad(f, `speaks ${used.length} lines in play but declares no SECS table of their lengths`); continue; }
    let j = i + 'const SECS = {'.length, depth = 1;
    while (j < src.length && depth) { const c = src[j]; if (c === '{') depth++; else if (c === '}') depth--; j++; }
    const body = src.slice(i, j).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    const have = new Set([...body.matchAll(/([A-Za-z0-9_]+)\s*:/g)].map(m => m[1]));
    for (const n of used.sort()) {
      if (!have.has(n)) bad(f, `speaks '${n}' but SECS has no measured length for it — sayLine books the 2.5 s fallback`);
    }
    spoke += used.length;
  }
  console.log(`spoken lines: ${spoke} play-time lines across the chapters, every one with a measured length in its SECS`);
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
/* v14.15: WHAT A CHAPTER HANDS OUT, IT DECLARES. The engine prepares an
   item's model behind the entry curtain only if the chapter lists it in
   `items` (its build() is closed over, so the engine cannot read it for
   kit.give calls). A chapter that gives an item it did not declare shows
   that model loading in the middle of play — the stutter v14.15 exists to
   remove. So: every literal kit.give('x') in a chapter file names an item
   in that chapter's `items`, and every declared item exists in ITEM_DEFS. */
{
  const idBlock = mainJs.slice(mainJs.indexOf('const ITEM_DEFS = {'), mainJs.indexOf('\n};', mainJs.indexOf('const ITEM_DEFS = {')));
  const ITEM_IDS = new Set([...idBlock.matchAll(/^  (\w+): \{/gm)].map(m => m[1]));
  if (!ITEM_IDS.size) errs.push('ERR could not read ITEM_DEFS out of src/main.js');
  for (const f of files) {
    const key = f.split('/').pop().replace(/\.js$/, '');
    const ch = chapters[key]; if (!ch) continue;
    const src = readFileSync(join(chapDir, f), 'utf8');
    const declared = Array.isArray(ch.items) ? ch.items : [];
    for (const m of src.matchAll(/\.give\(\s*'([a-zA-Z0-9_]+)'\s*\)/g)) {
      if (!declared.includes(m[1])) bad(key, `kit.give('${m[1]}') but '${m[1]}' is not in the chapter's items: [...] (v14.15 — its model would load in the middle of play)`);
    }
    for (const id of declared) if (ITEM_IDS.size && !ITEM_IDS.has(id)) bad(key, `items names '${id}', which is not in ITEM_DEFS`);
  }
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
  /* v7.1: the same contract for him at eighteen. TEEN_TAKES rides the same
     bus; it is a separate set so that this check can hold each speaker to
     its own set in both directions. */
  const teenLit = mainSrc.match(/const TEEN_TAKES = new Set\(\[([\s\S]*?)\]\)/);
  if (!teenLit) errs.push('voice: main.js has no TEEN_TAKES set');
  else {
    const inEngine = new Set([...teenLit[1].matchAll(/'([^']+)'/g)].map(m => m[1]));
    const inRegistry = new Set(VOICE.LINES.filter(l => l.who === 'jamesTeen').map(l => l.id));
    for (const id of inRegistry) {
      if (!inEngine.has(id)) errs.push(`voice: '${id}' is jamesTeen in the registry but missing from TEEN_TAKES in main.js`);
    }
    for (const id of inEngine) {
      if (!inRegistry.has(id)) errs.push(`voice: TEEN_TAKES names '${id}', which is not a jamesTeen row in src/voicelines.js`);
    }
    console.log(`his teen bus: ${inEngine.size} takes, matching the registry`);
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
/* --- v12.3: NO CUE MAY BE WRITTEN PAST ITS OWN CUTSCENE ------------------
   `playCineFn` computes a cutscene's length as the maximum t1 of its TRACKS
   (`c.dur = c.tracks.reduce((m, tr) => Math.max(m, tr.t1), 1)`), and a sting
   is not a track. So `sfx(27.2, 'n4dawn')` written after a last `step(27.0)`
   is simply never reached — the frame clamps `c.t` to `c.dur` and calls
   `cineEnd()`, and the cue sits there for ever, silent, with no error. All
   four endings of episode 2 chapter 4 had their closing narration written
   0.1-0.2 s late, so the sentence that loads chapter 5 had never once played
   in any of them, through two releases.
   This runs every film and every scene in the game against a recording stub:
   the verbs are the real ones from A(c), and everything else a scene touches
   (stage, kit, THREE, the camera, a rig) is a proxy that survives being
   called, indexed and read as a number. A scene that throws is REPORTED
   rather than skipped quietly, because a scene this cannot run is a scene
   this cannot defend. It is the v9.2 law in its timing form: a mistyped cue
   is silent with no error, and that is not a bug a screenshot can catch.  */
{
  const anyProxy = () => {
    const f = function () { return anyProxy(); };
    return new Proxy(f, {
      get(t, k) {
        if (k === Symbol.toPrimitive) return () => 0;
        if (k === Symbol.iterator) return function* () {};
        if (k === 'then') return undefined;
        if (k === 'length') return 0;
        if (typeof k === 'symbol') return undefined;
        return anyProxy();
      },
      set() { return true; },
      apply() { return anyProxy(); },
      has() { return true; },
    });
  };
  const rawK = k => k, smoothK = k => k * k * (3 - 2 * k);
  let scanned = 0;
  for (const [key, ch] of Object.entries(chapters)) {
    const list = [];
    if (typeof ch.intro === 'function') list.push(['intro', ch.intro]);
    (ch.scenes || []).forEach((fn, i) => { if (typeof fn === 'function') list.push([`scene ${'ABCD'[i] || i}`, fn]); });
    for (const [label, fn] of list) {
      const tracks = [], cues = [];
      const T = (t0, t1) => { tracks.push(Math.max(+t0 || 0, (t1 === undefined ? +t0 : +t1) || 0)); };
      const api = {
        tr: T, step: t0 => T(t0, t0), fade: T, camTo: T, yawTo: T, pitchTo: T,
        bob: T, ghostGlide: T, ghostFacePlayer: T, lens: T,
        event: at => T(at, at), eventWait: at => T(at, at),
        sfx: (at, kind) => cues.push({ at: +at || 0, kind: String(kind) }),
        music: () => {}, duck: () => {},
        rawK, smoothK, mixAngle: (a, b, k) => a + (b - a) * k, faceFrom: () => 0,
        CAM_FOV: 72, handWidth: () => 0.1, getReveal: () => 0,
        ghostOpacity: () => {}, setHandPrayer: () => {},
      };
      for (const k of ['THREE', 'SHRINE', 'stage', 'camera', 'yaw', 'pitch', 'ghost', 'ghostLight',
                       'kit', 'handsRoot', 'armR', 'armL', 'rightHandModel', 'prayerArmL',
                       'PRAYER_R', 'PRAYER_L']) api[k] = anyProxy();
      try { fn(anyProxy(), anyProxy(), api); }
      catch (e) { bad(key, `${label} could not be walked for its cue times — ${e.message}`); continue; }
      scanned++;
      const dur = Math.max(1, ...tracks);
      for (const q of cues) {
        if (q.at > dur + 1e-9) {
          bad(key, `${label}: sfx('${q.kind}') is cued at ${q.at.toFixed(2)} s but the cutscene is ` +
                   `${dur.toFixed(2)} s long (its last track ends there), so it can never play`);
        }
      }
    }
  }
  console.log(`cue timing: ${scanned} cutscenes walked, every cue inside its own length`);
}

console.log('errors:', errs.length ? errs : 'none');
if (errs.length) process.exit(1);
