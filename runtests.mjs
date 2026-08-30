/* Run the harnesses and print one line each.

   Everything here renders through SwiftShader on a two-core box, so the cost
   is pixels and wall-clock waiting, not cleverness. Two run at once; more
   just makes each one slower. Pick the ones you need:

     node runtests.mjs                 every test
     node runtests.mjs pile step       only those
     node runtests.mjs @engine         a group (engine | release); chapter
                                       groups arrive with chapter 2
     node runtests.mjs --quick         the ones that do not need a real
                                       viewport, for a change mid-flight     */

import { spawn } from 'child_process';
import { DIR } from './testlib.mjs';

const ALL = [
  { name: 'census',   file: 'census.mjs',    quick: true,  group: 'engine', why: 'every system present and running' },
  { name: 'csp',      file: 'csptest.mjs',   quick: true,  group: 'engine', why: 'the hand-parsed loaders still work with no blob:/data:' },
  { name: 'ghost',    file: 'ghosttest.mjs', quick: true,  group: 'engine', why: 'her repertoire: flee, chase, cross, close; upright, in view' },
  { name: 'motion',   file: 'motion.mjs',    quick: true,  group: 'engine', why: 'the hands bob, sway and lean' },
  { name: 'pile',     file: 'piletest.mjs',  quick: true,  group: 'engine', why: 'the heap highlights, prompts and opens' },
  { name: 'step',     file: 'steptest.mjs',  quick: true,  group: 'engine', why: 'nothing opens by itself; stepping back works' },
  { name: 'sanity',   file: 'sanitytest.mjs',quick: true,  group: 'engine', why: 'the drain, the freeze, and losing' },
  { name: 'tick',     file: 'ticktest.mjs',  quick: true,  group: 'engine', why: 'damage numbers and the type scale' },
  { name: 'sound',    file: 'soundtest.mjs', quick: true,  group: 'engine', why: 'music, the voice line, mute, credits' },
  { name: 'perf',     file: 'perftest.mjs',  quick: true,  group: 'engine', why: 'frame pacing, frozen shadows, drift' },
  { name: 'cine',     file: 'cinetest.mjs',  quick: true,  group: 'engine', why: 'all four cutscenes, skip, restore' },
  { name: 'restart',  file: 'restarttest.mjs', quick: true, group: 'engine', why: 'both endings start a fresh run in place' },
  { name: 'hosted',   file: 'hostedtest.mjs', quick: true, group: 'release', why: 'the split-file build over real HTTP' },
  { name: 'text',     file: 'texttest.mjs',  quick: true,  group: 'engine', why: 'every word on screen is editable from the sheet' },
  { name: 'state',    file: 'statetest.mjs', quick: true,  group: 'engine', why: 'a run is JSON: save, seed, round-trip exactly' },
  { name: 'resume',   file: 'resumetest.mjs',quick: true,  group: 'engine', why: 'autosave, Continue lands where you were, New game asks' },
  { name: 'inv',      file: 'invtest.mjs',   quick: true,  group: 'engine', why: 'equipment opens, moves and loses nothing, on both' },
  { name: 'leak',     file: 'leaktest.mjs',  quick: true,  group: 'engine', why: 'a chapter gives the GPU back everything it took' },
  { name: 'chapter',  file: 'chaptertest.mjs', quick: true, group: 'chapter', why: 'every chapter\'s data is complete and in bounds' },
  { name: 'fixture',  file: 'fixturetest.mjs', quick: true, group: 'chapter', why: 'the engine plays a chapter it has never seen' },
  { name: 'title',    file: 'titletest.mjs', quick: false, group: 'release', why: 'logo, button, chapter card' },
  { name: 'final',    file: 'final.mjs',     quick: false, group: 'release', why: 'the whole walk, on a real phone and desktop' },
];

const args = process.argv.slice(2);
const quickOnly = args.includes('--quick');
const picked = args.filter(a => !a.startsWith('--'));
const jobs = ALL.filter(t =>
  (picked.length ? picked.includes(t.name) || picked.includes('@' + t.group) : true)
  && (!quickOnly || t.quick));

if (!jobs.length) {
  console.log('nothing matched. known:', ALL.map(t => t.name).join(' '));
  process.exit(1);
}

const CONCURRENCY = 2;
const started = Date.now();
let failed = 0;

function run(t) {
  return new Promise(resolve => {
    const t0 = Date.now();
    const kid = spawn('node', [t.file], { cwd: DIR });
    let out = '', err = '';
    kid.stdout.on('data', d => out += d);
    kid.stderr.on('data', d => err += d);
    kid.on('close', code => {
      const secs = ((Date.now() - t0) / 1000).toFixed(0).padStart(3);
      const bad = code !== 0 || /"errors":\s*\[|errors: \[|ERR /.test(out);
      if (bad) failed++;
      console.log(`${bad ? 'FAIL' : ' ok '} ${secs}s  ${t.name.padEnd(7)} ${t.why}`);
      if (bad) {
        console.log(out.trim().split('\n').map(l => '        ' + l).join('\n'));
        if (err.trim()) console.log(err.trim().split('\n').slice(0, 12)
          .map(l => '        ! ' + l).join('\n'));
      }
      resolve();
    });
  });
}

const queue = jobs.slice();
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) await run(queue.shift());
}));

console.log(`\n${jobs.length - failed}/${jobs.length} passed in ` +
            `${((Date.now() - started) / 1000).toFixed(0)}s`);
process.exit(failed ? 1 : 0);
