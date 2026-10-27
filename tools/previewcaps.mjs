/* THE PREVIEW'S PLACEHOLDERS — a preview chapter's lines not yet recorded, as subtitles where their voices will go:
   each line's words at its estimated length, the speaker under them. (v23.0 CP10 wrote this for episode 3 chapter 5
   alone as tools/e3c5caps.mjs, and CP11 deleted it with the table; v24.0 makes it any chapter's.)

   Reads the registry (src/voicelines.js — the words Chad edits on the sheet's VOICE LINES tab) and writes the table
   between the markers in the chapter's own file:  /* PREVIEW CAPTIONS BEGIN *\/ … /* PREVIEW CAPTIONS END *\/
   Only rows still PLANNED (`est`) are written; a recorded line needs none of it. Re-run it after the sheet's words
   change (textsync import → node tools/previewcaps.mjs <key>); chaptertest runs it with --check.

   A line said in Thai shows its English (`gloss`) — the preview is read by someone who cannot read Thai; the finished
   chapter does not caption the Thai at all. The direction tags in square brackets are stripped; a take with no words
   left shows its direction in brackets. Left out: the card lines (the outcome card prints the same words), a row
   marked `nocap` (a chant is captioned in its own lines) and any id given with --skip.

   node tools/previewcaps.mjs <chapterKey> [--skip id,id] [--check] */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const key = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--skip');
if (!key) { console.error('usage: node tools/previewcaps.mjs <chapterKey> [--skip id,id] [--check]'); process.exit(2); }
const si = args.indexOf('--skip');
const SKIP = new Set(si >= 0 ? String(args[si + 1] || '').split(',').filter(Boolean) : []);

function findChapter(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { const r = findChapter(p); if (r) return r; }
    else if (e.name === key + '.js') return p;
  }
  return null;
}
const CH = findChapter(path.join(ROOT, 'src/chapters'));
if (!CH) { console.error(`no chapter file ${key}.js under src/chapters`); process.exit(2); }

const BEGIN = '/* PREVIEW CAPTIONS BEGIN */', END = '/* PREVIEW CAPTIONS END */';
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'src/voicelines.js'), 'utf8'), ctx);
const V = ctx.window.__VOICE__;
const src = fs.readFileSync(CH, 'utf8');
const pre = (/sayPrefix:\s*'([^']+)'/.exec(src) || [])[1] || '';
const cards = new Set(['A', 'B', 'C', 'D'].map(k => pre + k));
const rows = V.LINES.filter(r => r.ch === key && r.est && !r.nocap && !SKIP.has(r.id) && !cards.has(r.id));

const THAI = /[฀-๿]/;
function speaker(r) {
  if (/^james/.test(r.who)) return 'him';
  const n = String((V.SPEAKERS[r.who] || {}).name || r.who).split(/,| \(/)[0].trim();
  return n.replace(/^The /, 'the ');
}
function words(r) {
  if (r.gloss) return r.gloss;
  const tags = [...r.text.matchAll(/\[([^\]]*)\]/g)].map(m => m[1]);
  const said = r.text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();
  if (said && !/^[hae.\s—–!-]*$/i.test(said)) return said;
  return '(' + (tags[0] || '').replace(/^as an? [^,]*,\s*/i, '') + ')';
}
function sub(r) {
  const s = speaker(r);
  if (!THAI.test(r.text)) return s;
  const latin = r.text.replace(/\[[^\]]*\]/g, '').replace(/[฀-๿]/g, '');
  return /[A-Za-z]{2,}/.test(latin) ? s : s + ', in Thai';
}
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const body = rows.map(r => `    ${r.id}: [${q(words(r))}, ${q(sub(r))}],`).join('\n');
const block = `${BEGIN}\n  const PREVIEW_CAPS = {\n${body}\n  };\n  ${END}`;

const a = src.indexOf(BEGIN), b = src.indexOf(END);
if (a < 0 || b < 0 || src.indexOf(BEGIN, a + 1) >= 0 || src.indexOf(END, b + 1) >= 0 || b < a) {
  console.error(`${path.relative(ROOT, CH)}: the markers must each appear exactly once, BEGIN before END`); process.exit(1);
}
const next = src.slice(0, a) + block + src.slice(b + END.length);
if (args.includes('--check')) {
  if (next !== src) { console.error(`${key}: PREVIEW_CAPS is out of date with the registry: run node tools/previewcaps.mjs ${key}${SKIP.size ? ' --skip ' + [...SKIP].join(',') : ''}`); process.exit(1); }
  console.log(`${key}: PREVIEW_CAPS up to date (${rows.length} lines)`);
} else {
  fs.writeFileSync(CH, next);
  console.log(`${key}: PREVIEW_CAPS — ${rows.length} lines written`);
}
