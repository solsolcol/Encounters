/* v15.2: THE FONTS, TAKEN HOME — and checked against Google while doing it.
   shell.html asks fonts.googleapis.com for one stylesheet URL, and Google
   answers it with different font files for different browsers. This asks
   Google that same URL as every browser in tools/fontuas.txt, runs
   src/fontpick.js (the selector the hosted page inlines) on each, and FAILS
   unless every browser the selector puts in a class was answered by Google
   with exactly that class's stylesheet, byte for byte. Then (unless --check)
   it downloads each class's font files, checks each is the font it says it
   is, and writes:
     assets/fonts/<file>          the files, under Google's own names
     assets/fonts/<class>.css     Google's stylesheet for the class, every
                                  url() pointing at the file beside it
     assets/fonts/manifest.json   what was asked, what came back, the hashes
   build.py fingerprints them into dist/assets/fonts/. A browser the
   selector does not recognise keeps Google's link, so it is never checked
   here and never changed.
   Usage: node tools/fontsnap.mjs [--check]                                 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join, basename } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHECK = process.argv.includes('--check');
const sha = (b) => createHash('sha256').update(b).digest('hex');
const fontClass = new Function(readFileSync(join(ROOT, 'src/fontpick.js'), 'utf8') + '\nreturn fontClass;')();

const shell = readFileSync(join(ROOT, 'shell.html'), 'utf8');
const link = /<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)">/.exec(shell);
if (!link) throw new Error('no Google Fonts link in shell.html');
const CSS_URL = link[1].replace(/&amp;/g, '&');

const curl = (args) => execFileSync('curl', ['-sS', '--fail', '--retry', '3', '--retry-delay', '2', ...args],
                                    { maxBuffer: 64 << 20 });
const uas = readFileSync(join(ROOT, 'tools/fontuas.txt'), 'utf8').split('\n').filter(Boolean)
  .map(l => { const i = l.indexOf('|'); return { label: l.slice(0, i), ua: l.slice(i + 1) }; });

/* one question per browser */
const answers = [];
for (const { label, ua } of uas) {
  const css = curl(['--compressed', '-A', ua, CSS_URL]).toString('utf8');
  answers.push({ label, ua, cls: fontClass(ua), css, cssSha: sha(css) });
}
/* GOOGLE IS NOT ALWAYS DETERMINISTIC. Asked the same question ten times,
   every class got one answer every time — except a Mac's Safari/Firefox
   class, which is sometimes (about one ask in ten) answered with Google's
   on-the-fly "kit" fonts (/l/font?kit=..., the variable fonts cut to the
   weights this page asks for) instead of its usual files. So each class's
   FIRST member is asked ASKS more times; the class ships the answer Google
   gives it MOST, which must be at least three in four of those asks and
   made only of Google's static files (a kit URL is refused below), and
   every other member of the class must have been given one of the answers
   the first member was given. */
const ASKS = 12;
const classes = {};
let bad = 0;
for (const a of answers) {
  if (!a.cls || classes[a.cls]) continue;
  const seen = new Map([[a.cssSha, { css: a.css, n: 1 }]]);
  for (let i = 0; i < ASKS; i++) {
    const css = curl(['--compressed', '-A', a.ua, CSS_URL]).toString('utf8'), h = sha(css);
    if (!seen.has(h)) seen.set(h, { css, n: 0 });
    seen.get(h).n++;
  }
  const [topSha, top] = [...seen].sort((x, y) => y[1].n - x[1].n)[0];
  classes[a.cls] = { ua: a.ua, label: a.label, css: top.css, cssSha: topSha,
                     answers: Object.fromEntries([...seen].map(([h, v]) => [h.slice(0, 10), v.n])) };
  const share = top.n / (ASKS + 1);
  console.log(`class ${a.cls.padEnd(9)} asked as ${a.label}: ${[...seen].map(([h, v]) => h.slice(0, 10) + '×' + v.n).join(', ')}`);
  if (share < 0.75) { console.log(`  no answer Google gives this class three times in four (${(share * 100).toFixed(0)}%)`); bad++; }
}
for (const a of answers) {
  a.agrees = !a.cls || Object.keys(classes[a.cls].answers).includes(a.cssSha.slice(0, 10));
  if (!a.agrees) bad++;
  console.log(`${a.agrees ? 'ok  ' : 'DIFF'} ${a.label.padEnd(24)} -> ${a.cls || '(keeps Google)'}  ${a.cssSha.slice(0, 10)}` +
              (a.cls && a.cssSha !== classes[a.cls].cssSha && a.agrees ? '  (Google\'s other answer for this class)' : ''));
}
/* the selector must not be vacuous: every class it can return was reached */
for (const c of ['mobile', 'winlinux', 'mac', 'macchrome', 'winff'])
  if (!classes[c]) { console.log(`NO BROWSER reached class ${c}`); bad++; }
if (bad) { console.log(`FAILED: ${bad} disagreement(s) — nothing written`); process.exit(1); }
console.log(`all ${answers.filter(a => a.cls).length} classified browsers agree with Google; ` +
            `${answers.filter(a => !a.cls).length} keep Google's link`);
if (CHECK) process.exit(0);

/* the files */
const DIR = join(ROOT, 'assets/fonts');
mkdirSync(DIR, { recursive: true });
const URL_RE = /url\((https:\/\/fonts\.gstatic\.com\/s\/[a-z0-9]+\/v\d+\/([A-Za-z0-9_-]+\.(woff2|woff|ttf)))\)/g;
const files = {};
for (const [cls, c] of Object.entries(classes)) {
  for (const m of c.css.matchAll(URL_RE)) {
    const [, url, name, ext] = m;
    if (files[name]) { if (files[name].url !== url) throw new Error(`${name} named twice`); continue; }
    const body = curl([url]);
    const magic = body.subarray(0, 4).toString('latin1');
    const okMagic = ext === 'woff2' ? magic === 'wOF2' : ext === 'woff' ? magic === 'wOFF'
      : (magic === '\x00\x01\x00\x00' || magic === 'true');
    if (!okMagic) throw new Error(`${name}: not a ${ext} (starts ${JSON.stringify(magic)})`);
    files[name] = { url, bytes: body.length, sha256: sha(body) };
    writeFileSync(join(DIR, name), body);
  }
  const local = c.css.replace(URL_RE, (_all, _url, name) => `url(${name})`);
  if (/fonts\.gstatic\.com/.test(local)) throw new Error(`${cls}: a url() was not rewritten`);
  writeFileSync(join(DIR, `${cls}.css`), local);
}
/* nothing stale left beside them */
for (const f of readdirSync(DIR))
  if (!files[f] && !/^(mobile|winlinux|mac|macchrome|winff)\.css$|^manifest\.json$/.test(f)) unlinkSync(join(DIR, f));
writeFileSync(join(DIR, 'manifest.json'), JSON.stringify({
  source: CSS_URL,
  taken: new Date().toISOString(),
  classes: Object.fromEntries(Object.entries(classes).map(([k, c]) => [k, { asked: c.label, ua: c.ua, cssSha256: c.cssSha,
                                                                            googleAnswers: c.answers }])),
  files,
  browsers: answers.map(a => ({ label: a.label, class: a.cls, googleCssSha256: a.cssSha, agrees: a.agrees })),
}, null, 1) + '\n');
const total = Object.values(files).reduce((s, f) => s + f.bytes, 0);
console.log(`wrote ${Object.keys(classes).length} stylesheets and ${Object.keys(files).length} files (${(total / 1024).toFixed(0)} KB) to assets/fonts/`);
