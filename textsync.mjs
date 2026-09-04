/* textsync — every word in the game, out to one sheet and back in.
   ---------------------------------------------------------------------------
     node textsync.mjs export [file.csv]   read the game -> write the sheet
     node textsync.mjs export file.xlsx    the same, as a TABBED workbook (UI text,
                                           one tab per episode, voice lines)
     node textsync.mjs import file         read the sheet -> write the game
                                           (.csv, .xlsx, or the markdown the
                                           Drive connector returns)

   Three kinds of file hold text: src/strings.js (the engine's UI words),
   EVERY chapter in src/chapters/ (each chapter's own words) and, since
   v5.14, src/voicelines.js (the words of every spoken take — who says it,
   where it plays, how long it runs). They are hand-written and stay that
   way — import edits values in place and never regenerates a file, so
   comments and structure survive.

   The sheet has TWO TABS: GAME TEXT (everything on screen) and VOICE LINES
   (everything heard). A CSV export carries both as rows; an .xlsx export
   carries them as two tabs, which is what Chad's Google Sheet is made from.
   Voice rows are keyed 'voice.<sample>', so they can never collide with a
   UI key or a chapter's. Import reports every voice line whose TEXT
   changed — that list is the list of takes to regenerate.

   Chapters are DISCOVERED, not listed. Adding a chapter is dropping a file
   in that folder, and its words appear in the sheet on the next export with
   no edit here — which is the same promise build.py makes about assets. The
   fixture chapter is skipped: nothing a player will ever read lives in it.

   The sheet's TEXT column is the only editable one. An empty cell means
   "remove this from the game": the engine hides an empty UI string, and an
   empty chapter string is left as an empty string for the chapter to skip.  */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { createRequire } from 'module';
import { DIR } from './testlib.mjs';
import { join } from 'path';

const P_STRINGS = join(DIR, 'src', 'strings.js');
const P_VOICE = join(DIR, 'src', 'voicelines.js');
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
  menu: 'The pause menu (M, or the gear button)',
  chapters: 'The chapter selector',
  ep: 'The episodes — the ten case files (v6.0)',
  a11y: 'Screen readers only',
  inv: 'Equipment panel', slot: 'Equipment panel — slot names',
  item: 'Equipment panel — the items'
};
/* v6.0: where a chapter's rows belong — episode 1's `chN` as always, and a
   later episode's `eNcM` (docs/EPISODES-PLAN.md) — and the notes for the
   twenty episode rows, which are the same two sentences ten times. */
const chapterWhere = head => {
  let m;
  if ((m = /^ch(\d+)$/.exec(head))) return `CHAPTER ${m[1]} — the story itself`;
  if ((m = /^e(\d+)c(\d+)$/.exec(head))) return `EPISODE ${m[1]} · CHAPTER ${m[2]} — the story itself`;
  if (/^ep\d+$/.test(head)) return WHERE.ep;          // ep1.label, ep1.title ... — the prefix carries the number
  return '';
};
const noteFor = k => NOTES[k]
  || (/^ep\d+\.label$/.test(k) ? 'The line above "Chapter N" on the chapter card, and the heading under the episode tabs'
    : /^ep\d+\.title$/.test(k) ? 'The name of the case — shown under the episode tabs in the selector' : '');
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
  'a11y.menuButton': 'Never seen on screen',
  'inv.button': 'The label beside the button, desktop only',
  'inv.buttonKey': 'The keycap on that label — keep it short',
  'slot.head': "On the figure's head",
  'slot.neck': "On the figure's neck",
  'slot.body': "On the figure's torso",
  'slot.hand': "His hand — the beads or the phone",
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
  'title.chapters': 'The button under it that opens the chapter selector',
  'menu.button': 'The label beside the gear button, desktop only',
  'menu.buttonKey': 'The keycap on that label — keep it short',
  'menu.resume': 'Closes the menu and carries on',
  'menu.chapters': 'Opens the chapter selector',
  'menu.toTitle': 'Saves where you stand and goes to the title screen',
  'chapters.hint': 'The line under the heading',
  'chapters.locked': 'Shown in place of a chapter name you have not reached yet',
  'chapters.ask': 'Asked before replaying a chapter — {chapter} is filled in for you',
  'chapters.yes': 'Confirms the replay',
  'chapters.no': 'Backs out to the list',
  'chapters.unwritten': 'Shown in place of a chapter that is not written yet',
  'chapters.episode': 'The name of an episode tab, for screen readers — {n} is filled in for you',
  'chapters.chapter': 'The label of a chapter that is not written yet — {n} is filled in for you',
  'chapters.inProgress': 'The word beside a chapter you have reached but not finished, and under an episode you are partway through',
  'chapters.here': 'The word beside the chapter you are in right now',
  'chapters.progress': 'The line under the case name in the selector — {n} and {m} are filled in for you',
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

/* --- the voice lines (v5.14) ------------------------------------------------
   src/voicelines.js registers window.__VOICE__: SPEAKERS, CHAPTERS and one
   LINES row per take. Nothing in the engine reads it; this tool does. */
function readVoice() {
  const V = loadGlobals(P_VOICE).__VOICE__;
  const chapters = Object.fromEntries(chapterFiles().map(c => [c.key, c.ch]));
  return V.LINES.map(l => {
    const sp = V.SPEAKERS[l.who] || {};
    // a line under an outcome card names its choice, read from the chapter
    // so the sheet shows which button it follows without anyone typing it
    let where = l.where;
    const m = /^Under the outcome card after choice ([A-D])$/.exec(l.where || '');
    const c = m && chapters[l.ch] && (chapters[l.ch].choices || []).find(x => x.k === m[1]);
    if (c) where += ` — “${c.text}”`;
    return { id: l.id, who: sp.name || l.who, chapter: V.CHAPTERS[l.ch] || l.ch,
             where, text: l.text, secs: l.secs, note: l.note || '' };
  });
}
// the same rows in the four-column shape of the text sheet, for the CSV
function voiceRows() {
  return readVoice().map(v => [`voice.${v.id}`, v.text, `${v.chapter} — ${v.who}: ${v.where}`,
    `${v.secs.toFixed(2)} s${v.note ? ' · ' + v.note : ''}`]);
}

// --- csv -------------------------------------------------------------------
const q = s => `"${String(s).replace(/"/g, '""')}"`;
function toCSV(rows) {
  const out = [['ID (do not edit)', 'Where it appears', 'TEXT — edit this column', 'Notes'].map(q).join(',')];
  for (const [k, v, w, n] of rows) {
    const head = k.split('.')[0];
    const where = w ?? (WHERE[head] || chapterWhere(head));
    out.push([q(k), q(where), q(v), q(n ?? noteFor(k))].join(','));
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

/* --- the tabbed workbook -------------------------------------------------
   The Drive connector turns an .xlsx into a Google Sheet with one tab per
   worksheet, which is how Chad's sheet gets its tabs (v6.1). Written
   by hand as the smallest valid package — two worksheets with inline
   strings, no styles, no theme, deflated — because the connector takes the
   file as base64 INSIDE a tool call, and the 111 KB the xlsx package
   writes for the same rows (a theme, a shared-string table, a styles part)
   was too big to carry that way; this comes out under 30 KB. Reading an
   .xlsx back (import) still uses the xlsx package. */
const require = createRequire(import.meta.url);
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const xmlEsc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const colName = i => { let n = ''; for (i += 1; i > 0; i = Math.floor((i - 1) / 26)) n = String.fromCharCode(64 + ((i - 1) % 26) + 1) + n; return n; };
function sheetXML(rows, widths) {
  let x = XML_HEAD + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>';
  widths.forEach((w, i) => { x += `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`; });
  x += '</cols><sheetData>';
  rows.forEach((row, r) => {
    x += `<row r="${r + 1}">`;
    row.forEach((v, c) => {
      const ref = `${colName(c)}${r + 1}`;
      if (typeof v === 'number') x += `<c r="${ref}"><v>${v}</v></c>`;
      else if (v !== '' && v != null) x += `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEsc(v)}</t></is></c>`;
    });
    x += '</row>';
  });
  return x + '</sheetData></worksheet>';
}
// a zip writer small enough to live here: local headers, central directory, deflate
function zipWrite(file, entries) {
  const zlib = require('zlib');
  const table = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc32 = b => { let c = -1; for (const x of b) c = table[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const parts = [], dir = []; let off = 0;
  for (const { name, data } of entries) {
    const raw = Buffer.from(data), comp = zlib.deflateRawSync(raw, { level: 9 }), n = Buffer.from(name), crc = crc32(raw);
    const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(8, 8);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(comp.length, 18); lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(n.length, 26);
    const ch = Buffer.alloc(46); ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(8, 10);
    ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(comp.length, 20); ch.writeUInt32LE(raw.length, 24); ch.writeUInt16LE(n.length, 28); ch.writeUInt32LE(off, 42);
    parts.push(lh, n, comp); dir.push(ch, n); off += lh.length + n.length + comp.length;
  }
  const cd = Buffer.concat(dir), eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(entries.length, 8); eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12); eocd.writeUInt32LE(off, 16);
  writeFileSync(file, Buffer.concat([...parts, cd, eocd]));
}
/* v6.1 — TABS (Chad: "the sheet must be tabbed, google sheets wont be
   sustainable in the long run" otherwise). One worksheet per kind of text:
   the engine's UI strings, one tab per EPISODE holding its chapters' rows,
   and the voice lines. Chapter rows are grouped by the chapter's own
   `episode`, so episode 2's chapters make their own tab the day the first
   one exists. The Drive connector turns this file, sent as base64, into a
   Google Sheet with one tab per worksheet and reads it back as one table
   per tab — proven at v6.1 on a two-tab test before the real one went up. */
function toXLSX(file) {
  const HEAD = ['ID (do not edit)', 'Where it appears', 'TEXT — edit this column', 'Notes'];
  const epOf = Object.fromEntries(chapterFiles().map(c => [c.key, Number.isInteger(c.ch.episode) ? c.ch.episode : 1]));
  const ui = [HEAD], byEp = new Map();
  for (const [k, v] of readRows()) {
    const head = k.split('.')[0];
    const row = [k, WHERE[head] || chapterWhere(head), v, noteFor(k)];
    const m = /^(?:ch\d+|e(\d+)c\d+)$/.exec(head);
    if (m) {
      const ep = m[1] ? +m[1] : (epOf[head] || 1);
      if (!byEp.has(ep)) byEp.set(ep, [HEAD]);
      byEp.get(ep).push(row);
    } else ui.push(row);
  }
  const tabs = [{ name: 'UI TEXT', rows: ui, widths: [26, 30, 70, 44] }];
  for (const ep of [...byEp.keys()].sort((a, b) => a - b)) tabs.push({ name: `EPISODE ${ep}`, rows: byEp.get(ep), widths: [26, 30, 70, 44] });
  const voice = [['ID (do not edit)', 'Who', 'Chapter', 'When it plays', 'TEXT — edit this column', 'Length (s)', 'Notes']];
  for (const v of readVoice()) voice.push([`voice.${v.id}`, v.who, v.chapter, v.where, v.text, v.secs, v.note]);
  tabs.push({ name: 'VOICE LINES', rows: voice, widths: [18, 22, 26, 44, 70, 10, 44] });
  const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const P = 'http://schemas.openxmlformats.org/package/2006/relationships';
  const entries = [
    { name: '[Content_Types].xml', data: XML_HEAD + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
      + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      + tabs.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')
      + '</Types>' },
    { name: '_rels/.rels', data: XML_HEAD + `<Relationships xmlns="${P}"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: 'xl/workbook.xml', data: XML_HEAD + `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="${R}"><sheets>`
      + tabs.map((t, i) => `<sheet name="${xmlEsc(t.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('') + '</sheets></workbook>' },
    { name: 'xl/_rels/workbook.xml.rels', data: XML_HEAD + `<Relationships xmlns="${P}">`
      + tabs.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${R}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('') + '</Relationships>' },
    ...tabs.map((t, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXML(t.rows, t.widths) }))
  ];
  zipWrite(file, entries);
  return tabs.map(t => `${t.name} (${t.rows.length - 1})`);
}
/* Whatever shape the sheet comes back in — the CSV this tool wrote, the
   markdown table(s) the Drive connector returns, or an .xlsx download with
   both tabs — it is read to plain rows, header rows included. */
function readSheet(file) {
  if (file.endsWith('.xlsx')) {
    const XLSX = require('xlsx');
    const wb = XLSX.readFile(file);
    return wb.SheetNames.flatMap(n =>
      XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: false, defval: '' }));
  }
  const raw = readFileSync(file, 'utf8');
  return raw.includes('| :-:') || /^\s*\|.*\|.*\|/m.test(raw)
    ? parseMarkdownTable(raw) : parseCSV(raw);
}

// --- writing ---------------------------------------------------------------
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');

function writeStrings(map) {
  let s = readFileSync(P_STRINGS, 'utf8'); let n = 0;
  for (const [k, v] of Object.entries(map)) {
    /* a chapter's key is chN.<field>; the DIGIT matters — the engine's own
       `chapters.*` strings (the selector) start with the same two letters
       and must NOT be skipped, which they were from v5.12 until this fix */
    if (/^(ch\d+|e\d+c\d+|voice)\./.test(k)) continue;
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

/* The voice registry, edited in place like the chapters: each row is found
   by its own id and only its text is replaced. Texts there are double-quoted
   (they are full of apostrophes), so the escaping differs from the chapter
   fields. A changed text is reported by name — that is the regeneration
   list. An empty cell is refused: a take cannot be removed from the sheet,
   and a wordless take already carries its direction in brackets. */
const escD = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
function writeVoice(map) {
  let s = readFileSync(P_VOICE, 'utf8'); let n = 0; const changed = [];
  for (const [k, v] of Object.entries(map)) {
    if (!k.startsWith('voice.')) continue;
    const id = k.slice(6);
    const start = s.indexOf(`{ id: "${id}",`);
    if (start < 0) { console.error(`  ! unknown voice line, skipped: ${k}`); continue; }
    const end = s.indexOf('}', start);
    let block = s.slice(start, end);
    const m = /(\btext:\s*)"((?:[^"\\]|\\.)*)"/.exec(block);
    if (!m) { console.error(`  ! ${k}: text not found`); continue; }
    if (!v) { console.error(`  ! ${k}: empty cell ignored — a take cannot be removed from the sheet`); continue; }
    let old = m[2];
    try { old = JSON.parse(`"${m[2]}"`); } catch { /* keep the raw form */ }
    if (old !== v) changed.push(id);
    block = block.replace(m[0], () => `${m[1]}"${escD(v)}"`);
    s = s.slice(0, start) + block + s.slice(end);
    n++;
  }
  writeFileSync(P_VOICE, s); return { n, changed };
}

// --- go --------------------------------------------------------------------
const [mode, file] = process.argv.slice(2);
if (mode === 'export') {
  /* one CSV, both kinds of row: the voice lines follow the text under a
     divider whose ID cell is EMPTY, which import skips — it is there for the
     person reading the sheet, and it is how a one-tab Google Sheet made from
     this CSV still shows where the words end and the takes begin */
  const rows = [...readRows(),
    ['', 'Edit the TEXT column; a changed line is regenerated in that speaker\'s voice',
     'VOICE LINES — every spoken take, every speaker', 'Length of the current take'],   // [id, text, where, notes]
    ...voiceRows()];
  if (file && file.endsWith('.xlsx')) {
    const tabs = toXLSX(file);
    console.log(`wrote ${file} — ${tabs.length} tabs: ${tabs.join(', ')}`);
  } else if (file) { writeFileSync(file, toCSV(rows)); console.log(`wrote ${file} (${rows.length} rows)`); }
  else process.stdout.write(toCSV(rows));
} else if (mode === 'import') {
  if (!file) { console.error('usage: node textsync.mjs import file'); process.exit(1); }
  const rows = readSheet(file);
  /* Every tab and every table has its own header row, and the TEXT column is
     not in the same place on both tabs (the voice tab puts Who, Chapter and
     When before it) — so the column is found from each header row rather
     than assumed to be the third. */
  const map = {}; let col = 2;
  for (const r of rows) {
    const id = (r[0] ?? '').toString().trim();
    if (!id) continue;
    if (id.startsWith('ID')) {                            // a header row
      const at = r.findIndex(c => /^TEXT/i.test((c ?? '').toString().trim()));
      col = at >= 0 ? at : 2; continue;
    }
    map[id] = (r[col] ?? '').toString().trim();
  }
  const a = writeStrings(map), b = writeChapter(map), v = writeVoice(map);
  console.log(`imported ${Object.keys(map).length} rows -> ${a} UI strings, ${b} chapter strings, ${v.n} voice lines`);
  if (v.changed.length) {
    console.log(`\n${v.changed.length} voice line(s) changed — regenerate these takes:\n  ${v.changed.join(' ')}`);
  } else console.log('no voice line changed');
} else {
  console.error('usage: node textsync.mjs export [file.csv|file.xlsx] | import file');
  process.exit(1);
}
