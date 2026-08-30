/* The state seam: a run serialises to plain JSON and comes back exactly.

   This is the foundation piece for many chapters — the same mechanism a
   save/resume will use is what lets a test stage chapter N directly. So
   the promises here are load-bearing:

     1. worldState() is the full checkpoint: version, chapter, stats, inv
     2. it survives JSON (if it cannot be JSON, it is not state)
     3. applyState() seeds a run: values land, HUD follows
     4. round-trip is exact (inherently non-vacuous: a no-op fails it)
     5. a checkpoint is COMPLETE, not a patch: unspecified slots empty
     6. garbage is rejected without disturbing play
     7. applying over a lifted item cannot duplicate it
     8. ?ch= selects a registered chapter and falls back safely          */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const errs = [];
const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 640, height: 420 } });
p.on('pageerror', e => errs.push('ERR ' + e.message));
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto(PAGE); await p.waitForTimeout(5000);
await p.click('#startBtn');
await p.waitForFunction(() => window.__enc && window.__enc.getState() === 'play',
                        null, { timeout: 90000, polling: 120 });
await p.waitForTimeout(600);

const out = await p.evaluate(() => {
  const e = window.__enc, log = {};
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // 1+2. the fresh checkpoint, and it IS json
  const s0 = e.worldState();
  log.shape = s0.v === 1 && s0.ch === 'ch1'
    && s0.stats.sanity === 100 && s0.stats.awareness === 50 && s0.stats.wisdom === 50
    && s0.inv.gear.rightHand === 'beads'
    && s0.inv.bag[0] === 'phone' && s0.inv.bag[1] === 'keys';
  log.survivesJson = eq(JSON.parse(JSON.stringify(s0)), s0);

  // 3+5. seed a different run; unspecified gear/bag places come back empty
  log.seedAccepted = e.applyState({ v: 1, ch: 'ch1',
    stats: { sanity: 37.5, awareness: 80, wisdom: 12 },
    inv: { gear: { leftHand: 'phone' }, bag: ['note', 'beads'] } });
  const s1 = e.worldState();
  log.seedLanded = s1.stats.sanity === 37.5 && s1.stats.awareness === 80
    && s1.stats.wisdom === 12 && s1.inv.gear.leftHand === 'phone'
    && s1.inv.gear.rightHand === null
    && s1.inv.bag[0] === 'note' && s1.inv.bag[1] === 'beads'
    && s1.inv.bag[2] === null && s1.inv.bag.length === 15;
  log.hudFollows = document.getElementById('vSan').textContent === '38'
    && document.getElementById('vWis').textContent === '12';

  // 4. exact round-trip: back to the original through JSON text
  log.roundTripBack = e.applyState(JSON.parse(JSON.stringify(s0)))
    && eq(e.worldState(), s0);

  // 6. garbage: rejected, nothing disturbed, still playing
  const before = e.worldState();
  const rejected = [null, 42, {}, { v: 2, stats: {} },
                    { v: 1 }, { v: 1, stats: 'no' }]
    .every(x => e.applyState(x) === false);
  const softened = e.applyState({ v: 1,
    stats: { sanity: 'zzz', awareness: -50, wisdom: 900 },
    inv: { gear: { leftHand: 'dragonsword' }, bag: ['nosuchitem'] } });
  const after = e.worldState();
  log.garbageRejected = rejected;
  log.garbageSoftened = softened
    && after.stats.sanity === before.stats.sanity   // unparseable → kept
    && after.stats.awareness === 0                  // clamped
    && after.stats.wisdom === 100                   // clamped
    && after.inv.gear.leftHand === null             // unknown item dropped
    && after.inv.bag[0] === null;
  log.stillPlaying = e.getState() === 'play';

  return log;
});

// 7. a lifted item cannot be duplicated by a restore
await p.evaluate(() => window.__enc.applyState({ v: 1, ch: 'ch1',
  stats: { sanity: 90, awareness: 50, wisdom: 50 },
  inv: { gear: {}, bag: ['phone'] } }));
await p.evaluate(() => window.__enc.invOpen());
await p.waitForTimeout(400);
out.liftGuard = await p.evaluate(() => {
  const e = window.__enc;
  const slot = document.querySelector('#invBag .slot');       // holds the phone
  const at = slot.getBoundingClientRect();
  const ev = t => new PointerEvent(t, { bubbles: true, cancelable: true,
    clientX: at.x + at.width / 2, clientY: at.y + at.height / 2,
    pointerId: 1, pointerType: 'touch', isPrimary: true });
  slot.dispatchEvent(ev('pointerdown'));
  slot.dispatchEvent(ev('pointerup'));                        // tap = lift
  const lifted = e.inv().held === 'phone';
  e.applyState({ v: 1, ch: 'ch1',
    stats: { sanity: 90, awareness: 50, wisdom: 50 },
    inv: { gear: {}, bag: ['phone'] } });
  const s = e.worldState();
  const phones = [...Object.values(s.inv.gear), ...s.inv.bag]
    .filter(x => x === 'phone').length;
  return lifted && phones === 1 && e.inv().held === null;
});
await p.evaluate(() => window.__enc.invClose());

// 8. the ?ch= seam: unknown keys fall back, never a broken boot
const sep = PAGE.includes('?') ? '&' : '?';
await p.goto(PAGE + sep + 'ch=nonexistent'); await p.waitForTimeout(5000);
out.badChapterFallsBack = await p.evaluate(() =>
  !!window.__enc && window.__enc.worldState().ch === 'ch1');
await p.goto(PAGE + sep + 'ch=ch1'); await p.waitForTimeout(5000);
out.namedChapterBoots = await p.evaluate(() =>
  !!window.__enc && window.__enc.worldState().ch === 'ch1');

console.log(JSON.stringify(out, null, 1));
const MUST = ['shape', 'survivesJson', 'seedAccepted', 'seedLanded', 'hudFollows',
  'roundTripBack', 'garbageRejected', 'garbageSoftened', 'stillPlaying',
  'liftGuard', 'badChapterFallsBack', 'namedChapterBoots'];
for (const k of MUST) if (out[k] !== true) errs.push(`ERR state promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
