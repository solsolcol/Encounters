/* Run the harnesses and print one line each.

   Everything here renders through SwiftShader on a two-core box, so the cost
   is pixels and wall-clock waiting, not cleverness. Two run at once; more
   just makes each one slower. Pick the ones you need:

     node runtests.mjs                 every test
     node runtests.mjs pile step       only those
     node runtests.mjs --quick         the ones that do not need a real
                                       viewport, for a change mid-flight     */

import { spawn } from 'child_process';

const ALL = [
  { name: 'census',   file: 'census.mjs',    quick: true,  why: 'every system present and running' },
  { name: 'csp',      file: 'csptest.mjs',   quick: true,  why: 'textures and logo survive a strict policy' },
  { name: 'ghost',    file: 'ghosttest.mjs', quick: true,  why: 'she appears, closes, and stays in the deck' },
  { name: 'motion',   file: 'motion.mjs',    quick: true,  why: 'the hands bob, sway and lean' },
  { name: 'pile',     file: 'piletest.mjs',  quick: true,  why: 'the heap highlights, prompts and opens' },
  { name: 'step',     file: 'steptest.mjs',  quick: true,  why: 'nothing opens by itself; stepping back works' },
  { name: 'sanity',   file: 'sanitytest.mjs',quick: true,  why: 'the drain, the freeze, and losing' },
  { name: 'tick',     file: 'ticktest.mjs',  quick: true,  why: 'damage numbers and the type scale' },
  { name: 'sound',    file: 'soundtest.mjs', quick: true,  why: 'music, the mute button, the credits' },
  { name: 'perf',     file: 'perftest.mjs',  quick: true,  why: 'frame pacing, frozen shadows, drift' },
  { name: 'cine',     file: 'cinetest.mjs',  quick: true,  why: 'all four cutscenes, skip, restore' },
  { name: 'restart',  file: 'restarttest.mjs', quick: true, why: 'both endings start a fresh run in place' },
  { name: 'title',    file: 'titletest.mjs', quick: false, why: 'logo, button, chapter card' },
  { name: 'final',    file: 'final.mjs',     quick: false, why: 'the whole walk, on a real phone and desktop' },
];

const args = process.argv.slice(2);
const quickOnly = args.includes('--quick');
const picked = args.filter(a => !a.startsWith('--'));
const jobs = ALL.filter(t =>
  (picked.length ? picked.includes(t.name) : true) && (!quickOnly || t.quick));

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
    const kid = spawn('node', [t.file], { cwd: '/tmp/g' });
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
