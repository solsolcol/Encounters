/* textsync — every word in the game, out to one sheet and back in.
   ---------------------------------------------------------------------------
     node textsync.mjs export [file.csv]   read the game -> write the sheet
     node textsync.mjs import file.csv     read the sheet -> write the game

   Two kinds of file hold text: src/strings.js (the engine's UI words) and
   EVERY chapter in src/chapters/ (each chapter's own words). They are
   hand-written and stay that way — import edits values in place and never
   regenerates a file, so comments and structure survive.

   Chapters are DISCOVERED, not listed. Adding a chapter is dropping a file
   in that folder, and its words appear in the sheet on the next export with
   no edit here — which is the same promise build.py makes about assets. The
   fixture chapter is skipped: nothing a player will ever read lives in it.

   The sheet's TEXT column is the only editable one. An empty cell means
   "remove this from the game": the engine hides an empty UI string, and an
   empty chapter string is left as an empty string for the chapter to skip.  */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { DIR } from './testlib.mjs';
import { join } from 'path';

const P_STRINGS = join(DIR, 'src', 'strings.js');
const CHAP_DIR = join(DIR, 'src', 'chapters');
/* Every chapter file, in id order, minus the fixture. `id` over 90 is the
   engine's own convention for "not part of the game" — nextChapterKey()
   filters on exactly the same number. */
function chapterFiles() {
  return readdirSync(CHAP_DIR).filter(f => f.endsWith('.js')).sort()
    .map(f => {
      const key = f.slice(0, -3);
      const ch = loadGlobals(join(CHAP_DIR, f)).__CHAPTERS__?.[key];
      return ch && (ch.id || 0) < 90 ? { key, ch, path: join(CHAP_DIR, f) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (a.ch.id || 0) - (b.ch.id || 0));
}
// the chapter fields that are words, in the order they read on screen
const CH_FIELDS = ['title', 'cardLabel', 'cardTitle', 'brief', 'prompt'];
const CH_WORDS = ['approach', 'act', 'actTouch', 'interact', 'interactTouch'];

// what each row means, so the sheet explains itself
const WHERE = {
  title: 'Title screen', credits: 'Credits panel', chapter: 'Chapter card',
  hud: 'HUD (always on screen)', world: 'In the world', cine: 'Cutscenes',
  decide: 'Decision panel', result: 'Outcome + teaching card',
  complete: 'Finished the chapter', lost: 'Lost your nerve',
  newgame: 'Starting over — the confirmation',
  a11y: 'Screen readers only',
  inv: 'Equipment panel', slot: 'Equipment panel — slot names',
  item: 'Equipment panel — the items'
};
const NOTES = {
  'title.tabTitle': 'Browser tab name',
  'title.logoAlt': 'Read aloud by screen readers',
  'title.headingPlain': 'Only shows if the logo image fails to load',
  'title.intro': 'THE paragraph under the logo',
  'title.controlsDesktop': 'Keeps <b>bold</b> formatting',
  'title.controlsPhone': 'Keeps <b>bold</b> formatting',
  'credits.heading': 'Write &amp; for an ampersand',
  'credits.musicLink': 'The blue link text only',
  'credits.handsLink': 'The blue link text only',
  'credits.ghostLink': 'The blue link text only',
  'credits.blockLink': 'The blue link text only',
  'credits.footer': 'Last line of the credits',
  'hud.sanity': 'Also names it on the outcome card',
  'hud.awareness': 'Also names it on the outcome card',
  'hud.wisdom': 'Also names it on the outcome card',
  'hud.ghostAlarm': 'First half of the red warning',
  'hud.ghostWarning': 'Second half of the red warning',
  'world.interactKey': 'Keycap shown on desktop — keep it short',
  'world.interactKeyTouch': 'Keycap shown on phones — keep it short',
  'world.actHintTouch': 'Tail of the hint line, phones',
  'world.actHintKey': 'Tail of the hint line, desktop',
  'world.actLineTouch': 'After stepping back, phones',
  'world.actLineKey': 'After stepping back, desktop',
  'a11y.soundButton': 'Never seen on screen',
  'a11y.volumeSlider': 'Never seen on screen',
  'a11y.closeButton': 'Never seen on screen',
  'a11y.creditsButton': 'Never seen on screen',
  'inv.button': 'The label beside the button, desktop only',
  'inv.buttonKey': 'The keycap on that label — keep it short',
  'slot.head': "On the figure's head",
  'slot.neck': "On the figure's neck",
  'slot.body': "On the figure's torso",
  'slot.rightHand': "His right hand (viewer's left)",
  'slot.leftHand': "His left hand (viewer's right)",
  'inv.close': 'The button that shuts the panel',
  'inv.empty': 'Shown when no item is selected',
  'inv.emptyDesc': 'The line under it',
  'inv.hintTouch': 'The how-to line, phones',
  'inv.hintDesktop': 'The how-to line, desktop',
  'item.phone.desc': 'Shown when the item is selected',
  'item.keys.desc': 'Shown when the item is selected',
  'item.beads.desc': 'Shown when the item is selected',
  'item.note.desc': 'Shown when the item is selected',
  'title.continue': 'Replaces "Start game" when a saved run is waiting',
  'title.resumeNote': 'The small line under Continue — {chapter} is filled in for you',
  'title.newGame': 'The small link under Continue',
  'newgame.heading': 'Shown when the player asks to start over',
  'newgame.body': 'The warning under it',
  'newgame.yes': 'Erases the save and starts again',
  'newgame.no': 'Backs out and keeps the save',
  'ch1.title': 'Internal name of the chapter',
  'ch1.cardTitle': 'Chapter card headline — <br> makes a line break',
  'ch1.brief': 'One-line summary of this chapter (not shown on screen yet)',
  'ch1.prompt': 'The question above the four choices',
  'ch1.core': 'The lesson on the final Sealed card'
};

// --- reading ---------------------------------------------------------------
function loadGlobals(file) {
  const win = {};
  const src = readFileSync(file, 'utf8');
  new Function('window', src)(win);
  return win;
}
function readRows() {
  const rows = [];
  const ui = loadGlobals(P_STRINGS).__TEXT__;
  for (const [k, v] of Object.entries(ui)) rows.push([k, v]);
  for (const { key, ch } of chapterFiles()) {
    for (const f of [...CH_FIELDS, 'core']) {
      if (typeof ch[f] === 'string') rows.push([`${key}.${f}`, ch[f]]);
    }
    // the words that name the thing you can act on, when the chapter has
    // its own rather than falling back to the sheet's
    for (const f of CH_WORDS) {
      if (ch.words && typeof ch.words[f] === 'string') {
        rows.push([`${key}.words.${f}`, ch.words[f]]);
      }
    }
    for (const c of ch.choices) {
      for (const f of ['text', 'say', 'teach']) rows.push([`${key}.${c.k}.${f}`, c[f]]);
    }
  }
  return rows;
}

// --- csv -------------------------------------------------------------------
const q = s => `"${String(s).replace(/"/g, '""')}"`;
function toCSV(rows) {
  const out = [['ID (do not edit)', 'Where it appears', 'TEXT — edit this column', 'Notes'].map(q).join(',')];
  for (const [k, v] of rows) {
    const head = k.split('.')[0];
    const where = WHERE[head]
      || (/^ch\d/.test(head) ? `CHAPTER ${head.slice(2)} — the story itself` : '');
    out.push([q(k), q(where), q(v), q(NOTES[k] || '')].join(','));
  }
  return out.join('\n');
}
/* The Google Sheet comes back from the Drive connector as a markdown table
   with backslash-escaped punctuation, not as CSV. Detect and read that too,
   so a sheet can be applied straight from the connector's own output.      */
function parseMarkdownTable(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('|')) continue;
    const cells = t.slice(1, t.endsWith('|') ? -1 : undefined).split('|')
      .map(c => c.trim().replace(/\\([\\`*_{}\[\]()#+\-.!<>&|~"'])/g, '$1'));
    if (cells.every(c => /^:?-+:?$/.test(c) || c === '')) continue;   // separator row
    rows.push(cells);
  }
  return rows;
}
function parseCSV(text) {
  const rows = []; let row = [], cell = '', inQ = false;
  text = text.replace(/\r\n?/g, '\n');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQ = false;
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.length > 1);
}

// --- writing ---------------------------------------------------------------
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');

function writeStrings(map) {
  let s = readFileSync(P_STRINGS, 'utf8'); let n = 0;
  for (const [k, v] of Object.entries(map)) {
    if (/^ch\w*\./.test(k)) continue;         // a chapter's, not the sheet's
    const re = new RegExp(`('${k.replace(/\./g, '\\.')}':\\s*)'(?:[^'\\\\]|\\\\.)*'`);
    if (!re.test(s)) { console.error(`  ! unknown UI key, skipped: ${k}`); continue; }
    s = s.replace(re, (_, head) => `${head}'${esc(v)}'`);
    n++;
  }
  writeFileSync(P_STRINGS, s); return n;
}

/* Every chapter, each edited in its own file. Scoped exactly as before —
   top-level fields before the choices array, `core` after it, and each
   choice by its own `k: 'A'` — because the point of this tool is that it
   edits values in place and leaves the file otherwise untouched. */
function writeChapter(map) {
  let n = 0;
  const setField = (block, field, v) => {
    const re = new RegExp(`(\\b${field}:\\s*)'(?:[^'\\\\]|\\\\.)*'`);
    if (!re.test(block)) return null;
    return block.replace(re, (_, head) => `${head}'${esc(v)}'`);
  };

  for (const { key, ch, path } of chapterFiles()) {
    let s = readFileSync(path, 'utf8');
    const has = f => `${key}.${f}` in map;

    // the top-level fields, matched before the choices array
    const head = s.slice(0, s.indexOf('choices:'));
    let newHead = head;
    for (const f of CH_FIELDS) {
      if (!has(f)) continue;
      const r = setField(newHead, f, map[`${key}.${f}`]);
      if (r === null) { console.error(`  ! ${key}: field not found: ${f}`); continue; }
      newHead = r; n++;
    }
    s = newHead + s.slice(head.length);

    // the words that name what you act on, inside their own words: { } block
    const wStart = s.indexOf('words: {');
    if (wStart >= 0) {
      const wEnd = s.indexOf('\n    }', wStart);
      let wBlock = s.slice(wStart, wEnd);
      for (const f of CH_WORDS) {
        const k2 = `${key}.words.${f}`;
        if (!(k2 in map)) continue;
        const r = setField(wBlock, f, map[k2]);
        if (r === null) { console.error(`  ! ${k2} not found`); continue; }
        wBlock = r; n++;
      }
      s = s.slice(0, wStart) + wBlock + s.slice(wEnd);
    }

    // core sits after the choices array
    if (has('core') && s.indexOf('  core:') >= 0) {
      const at = s.indexOf('  core:');
      const r = setField(s.slice(at), 'core', map[`${key}.core`]);
      if (r !== null) { s = s.slice(0, at) + r; n++; }
    }

    // each choice block, scoped by its own k: 'A'
    for (const c of ch.choices) {
      const start = s.indexOf(`k: '${c.k}'`);
      if (start < 0) { console.error(`  ! ${key}: choice ${c.k} not found`); continue; }
      const end = s.indexOf('\n    }', start);
      let block = s.slice(start, end);
      for (const f of ['text', 'say', 'teach']) {
        const k2 = `${key}.${c.k}.${f}`;
        if (!(k2 in map)) continue;
        const r = setField(block, f, map[k2]);
        if (r === null) { console.error(`  ! ${k2} not found`); continue; }
        block = r; n++;
      }
      s = s.slice(0, start) + block + s.slice(end);
    }
    writeFileSync(path, s);
  }
  return n;
}

// --- go --------------------------------------------------------------------
const [mode, file] = process.argv.slice(2);
if (mode === 'export') {
  const csv = toCSV(readRows());
  if (file) { writeFileSync(file, csv); console.log(`wrote ${file} (${readRows().length} rows)`); }
  else process.stdout.write(csv);
} else if (mode === 'import') {
  if (!file) { console.error('usage: node textsync.mjs import file.csv'); process.exit(1); }
  const raw = readFileSync(file, 'utf8');
  const rows = raw.includes('| :-:') || /^\s*\|.*\|.*\|/m.test(raw)
    ? parseMarkdownTable(raw) : parseCSV(raw);
  const map = {};
  for (const r of rows) {
    const id = (r[0] || '').trim();
    if (!id || id.startsWith('ID')) continue;             // header or blank line
    map[id] = (r[2] ?? '').trim();
  }
  const a = writeStrings(map), b = writeChapter(map);
  console.log(`imported ${Object.keys(map).length} rows -> ${a} UI strings, ${b} chapter strings`);
} else {
  console.error('usage: node textsync.mjs export [file.csv] | import file.csv');
  process.exit(1);
}
