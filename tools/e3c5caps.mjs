/* v23.0 CP10 · THE M1 PREVIEW'S PLACEHOLDERS — episode 3 chapter 5's lines not yet recorded, as subtitles where their
   voices will go: each line's words at its estimated length, the speaker under them.

   Reads the registry (src/voicelines.js — the words Chad edits on the sheet's VOICE LINES tab) and writes the table
   between the markers in src/chapters/e3/e3c5.js:  /* PREVIEW CAPTIONS BEGIN *\/ … /* PREVIEW CAPTIONS END *\/
   Re-run it after the sheet's words change (textsync import → node tools/e3c5caps.mjs). CP11, when the takes are
   recorded, deletes the table, its markers and the two calls that read it, and this file with them.

   Left out on purpose: the monk's verse (mk5yatha — chapter 4's take, captioned in its own four lines by the ending)
   and the four card lines (z5A–z5D — they play under the outcome card, which prints the same words).
   The direction tags in square brackets are stripped; a take with no words left (a gasp, a sob, a giggle) shows its
   direction in brackets instead.   node tools/e3c5caps.mjs [--check] */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REG = path.join(ROOT, 'src/voicelines.js');
const CH = path.join(ROOT, 'src/chapters/e3/e3c5.js');
const BEGIN = '/* PREVIEW CAPTIONS BEGIN */', END = '/* PREVIEW CAPTIONS END */';
const SKIP = new Set(['mk5yatha', 'z5A', 'z5B', 'z5C', 'z5D']);

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(REG, 'utf8'), ctx);
const rows = ctx.window.__VOICE__.LINES.filter(r => r.ch === 'e3c5' && r.est && !SKIP.has(r.id));

function speaker(r) {
  if (r.who === 'owner3') return 'the owner';
  if (r.who === 'mother') return 'Ma, on his voicemail';
  if (r.who === 'monk5') return 'the monk';
  if (/^z5b\d$/.test(r.id)) return 'the red one, through him';
  if (/^z5s\d$/.test(r.id)) return 'the shy one, through him';
  if (/^z5l\d$/.test(r.id) || r.id === 'z5sob') return 'the little one, through him';
  return 'him';
}
function words(r) {
  const tags = [...r.text.matchAll(/\[([^\]]*)\]/g)].map(m => m[1]);
  const said = r.text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();
  if (said && !/^[hae.\s—–!-]*$/i.test(said)) return said;
  const dir = (tags[0] || '').replace(/^as an? [^,]*,\s*/i, '');
  return '(' + dir + ')';
}
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const body = rows.map(r => `    ${r.id}: [${q(words(r))}, ${q(speaker(r))}],`).join('\n');
const block = `${BEGIN}\n  const PREVIEW_CAPS = {\n${body}\n  };\n  ${END}`;

const src = fs.readFileSync(CH, 'utf8');
const a = src.indexOf(BEGIN), b = src.indexOf(END);
if (a < 0 || b < 0 || src.indexOf(BEGIN, a + 1) >= 0 || src.indexOf(END, b + 1) >= 0 || b < a) {
  console.error('the markers must each appear exactly once, BEGIN before END'); process.exit(1);
}
const next = src.slice(0, a) + block + src.slice(b + END.length);
if (process.argv.includes('--check')) {
  if (next !== src) { console.error('PREVIEW_CAPS is out of date with the registry: run node tools/e3c5caps.mjs'); process.exit(1); }
  console.log(`PREVIEW_CAPS up to date (${rows.length} lines)`);
} else {
  fs.writeFileSync(CH, next);
  console.log(`PREVIEW_CAPS: ${rows.length} lines written`);
}
