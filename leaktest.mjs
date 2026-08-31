/* Does a chapter give the GPU back what it took?

   Advancing a chapter is dispose() then build(), never a page reload — a
   reload re-pays the GLB parse, the shader compile and the audio decode, and
   at ten chapters that is the whole feel of the game. The price of not
   reloading is that a chapter which forgets to free something leaks it for
   the rest of the session, and ten chapters of leaked geometry is a phone
   that runs out of memory somewhere in the middle.

   Removing an object from the scene frees NOTHING in three.js: geometries,
   materials and textures live on the GPU until .dispose() is called on each
   one. That is easy to get wrong and impossible to see by reading, so this
   harness measures it: build and dispose the chapter's world many times over
   and watch renderer.info, which counts what the GPU is actually holding.

   The pass condition is not "zero growth" — the engine itself allocates
   during a frame, and the first cycle warms caches — but "flat": the counts
   after many cycles must be close to the counts after the first, not
   climbing with every cycle.

   Since v4.1 it also builds EVERY registered chapter once before it starts
   measuring. That is not about leaks: it is the only place in the suite
   where a chapter's build() runs at all other than chapter 1's, and a
   chapter that throws in build() was otherwise green everywhere. It stays
   here rather than becoming a harness of its own, because a new chapter
   must never add one.                                                     */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';

// enough cycles for a per-cycle leak to be unmissable, but each one now waits
// for two real frames and SwiftShader gives about one a second
const CYCLES = 8;
const WARM = 3;          // rebuilds before the baseline is taken (see below)
const errs = [];

const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 800, height: 520 } });
p.on('pageerror', e => errs.push('pageerror: ' + e.message));

await p.goto(PAGE, { waitUntil: 'load' });
await p.waitForFunction(() => !!window.__enc && window.__enc.ready().hdb, null,
  { timeout: 120000 });

const out = await p.evaluate(async ({ CYCLES, WARM }) => {
  const e = window.__enc;
  const log = {};
  const count = () => {
    const m = e.renderer.info.memory;
    return { geometries: m.geometries, textures: m.textures };
  };

  log.hasRebuild = typeof e.rebuildStage === 'function';
  if (!log.hasRebuild) return log;

  /* A rebuild alone proves little: renderer.info counts what has been
     UPLOADED to the GPU, and a freshly built world has uploaded nothing
     until it is drawn. So every cycle draws — two animation frames, which
     is the engine's own tick doing a real render — and only then is
     counted. Without this the numbers sit at whatever the last dispose
     left behind and a leak walks straight past. */
  const drawn = () => new Promise(r =>
    requestAnimationFrame(() => requestAnimationFrame(r)));

  /* The BASELINE has to be warm too, and one cycle is not enough to make it
     so. renderer.info counts uploads, and an upload only happens when the
     object is actually drawn — so on a loaded box (two harnesses at once on
     two cores, and since v3.7 a title video decoding behind all of it) the
     two frames after the first rebuild can miss part of the world. That
     undercounts `first`, and an undercounted baseline manufactures a
     positive slope out of nothing: a run that failed at 1.88 geometries per
     cycle had simply sampled 55 where every other cycle reads 70.

     Three warm cycles instead of one, so both ends of the measurement are
     taken from a fully uploaded world and the slope between them is the
     steady-state slope, which is the thing this harness is actually about. */
  await drawn();

  /* FIRST: EVERY REGISTERED CHAPTER, BUILT ONCE.

     The slope below is measured on ONE chapter, which is the right way to
     measure a leak — and it left the suite with a hole big enough to ship a
     crash through. Nothing else calls a chapter's build() either:
     chaptertest never runs one (it is plain Node, no WebGL), fixturetest
     builds the fixture, and every remaining harness plays chapter 1. So a
     chapter whose build() THROWS is green everywhere.

     Chapter 3 did exactly that at v4.1 — one stale name in the object it
     returns — and the whole suite passed while `?ch=ch3` was a black screen.
     Two rebuilds per chapter is a few seconds, it needs no per-chapter code,
     and it means the next chapter cannot ship broken the same way.       */
  log.chapters = {};
  const KEYS = Object.keys(window.__CHAPTERS__ || {})
    .filter(k => (window.__CHAPTERS__[k].id || 0) < 90)
    .sort((a, b) => (window.__CHAPTERS__[a].id || 0) - (window.__CHAPTERS__[b].id || 0));
  for (const k of KEYS) {
    try {
      e.rebuildStage(window.__CHAPTERS__[k]);
      await drawn();
      const w = e.chapterWorld();
      log.chapters[k] = !!w && w.children.length > 3
                        && isFinite(e.pileDist()) && e.blockers.length > 0;
    } catch (err) {
      log.chapters[k] = 'threw: ' + (err && err.message);
    }
  }
  log.everyChapterBuilds = KEYS.length > 0 && KEYS.every(k => log.chapters[k] === true);
  // back to the booted chapter, so everything below measures one world
  try { e.rebuildStage(window.__CHAPTERS__[KEYS[0]]); await drawn(); } catch (err) {}

  log.before = count();
  for (let i = 0; i < WARM; i++) { await e.rebuildStage(); await drawn(); }
  /* Warm cycles were supposed to make the baseline honest and were not
     enough twice: under load the two frames after a rebuild still upload
     only part of the world, the baseline reads 55 where steady state is 70,
     and the missing fifteen come back as a fictitious 1.88-per-cycle slope.
     So the baseline is now taken only once the count has actually stopped
     moving: draw, count, and accept the number when two reads in a row
     agree (a few extra frames also give the chapters' async props time to
     land, which v4.7's five bought models made a real factor). */
  let first = count();
  for (let tries = 0; tries < 10; tries++) {
    await drawn();
    const again = count();
    if (again.geometries === first.geometries && again.textures === first.textures) break;
    first = again;
  }
  for (let i = 0; i < CYCLES; i++) { await e.rebuildStage(); await drawn(); }
  const after = count();
  // and the world really is back on the GPU, not an empty scene reading zero
  log.uploadedAgain = after.geometries > 10 && after.textures > 3;

  log.first = first;
  log.after = after;
  log.cycles = CYCLES;
  log.warmCycles = WARM;
  // per-cycle growth after the first build; a real leak shows up as a
  // constant positive slope
  log.geoPerCycle = +((after.geometries - first.geometries) / CYCLES).toFixed(2);
  log.texPerCycle = +((after.textures - first.textures) / CYCLES).toFixed(2);
  log.geoFlat = log.geoPerCycle <= 0.5;
  log.texFlat = log.texPerCycle <= 0.5;

  // and the world still works after all that churn
  log.worldRebuilt = !!e.chapterWorld() && e.chapterWorld().children.length > 5;
  log.pileAlive = typeof e.pileDist() === 'number' && isFinite(e.pileDist());
  log.blockersAlive = e.blockers.length > 0;
  log.stillPlayable = e.getState() !== 'error';
  return log;
}, { CYCLES, WARM });

console.log(JSON.stringify(out, null, 1));

const MUST = ['hasRebuild', 'everyChapterBuilds', 'geoFlat', 'texFlat', 'uploadedAgain',
              'worldRebuilt', 'pileAlive', 'blockersAlive', 'stillPlayable'];
for (const k of MUST) if (out[k] !== true) errs.push(`ERR leak promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
