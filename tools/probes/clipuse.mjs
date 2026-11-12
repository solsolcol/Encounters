/* v26.0: WHICH TAKES A CHAPTER'S BODIES CARRY THAT THE CHAPTER NEVER NAMES (v5.20: an unused clip library is dropped at
   prep; v11.2: a take a rig does not have fails silently, and chaptertest checks that side). A body's file is read for
   its clips' names; a name is "used" when the chapter's source holds it as a whole word anywhere (a quoted take, a
   regex's alternative, a table's key), so this can only err toward calling a take used.
     node tools/probes/clipuse.mjs <chapter.js> <body.glb> [<body.glb> ...]
     node tools/probes/clipuse.mjs src/chapters/e4/e4c3.js assets/e4*.glb
   Exits 0 always: it reports, and the list is a judgement (a walk kept for the next build is a reason to write down). */
import fs from 'node:fs';
const [src, ...files] = process.argv.slice(2);
if (!src || !files.length) { console.error('usage: node tools/probes/clipuse.mjs <chapter.js> <body.glb> ...'); process.exit(2); }
const text = fs.readFileSync(src, 'utf8');
const word = (n) => new RegExp('(^|[^A-Za-z0-9_])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^A-Za-z0-9_])').test(text);
let bodies = 0, unused = 0;
for (const f of files) {
  const b = fs.readFileSync(f);
  if (b.readUInt32LE(0) !== 0x46546c67) continue;
  const j = JSON.parse(b.slice(20, 20 + b.readUInt32LE(12)).toString('utf8'));
  if (!j.animations || !j.animations.length) continue;
  bodies++;
  const no = j.animations.map(a => a.name).filter(n => !word(n));
  unused += no.length;
  console.log(`${f.split('/').pop().padEnd(20)} ${String(j.animations.length).padStart(2)} takes${no.length ? '; NEVER NAMED: ' + no.join(', ') : '; every one named'}`);
}
console.log(`${bodies} bodies with takes; ${unused} takes the chapter never names`);
