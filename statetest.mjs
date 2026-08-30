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
  log.shape = s0.v === 2 && s0.ch === 'ch1'
    && s0.stats.sanity === 100 && s0.stats.awareness === 50 && s0.stats.wisdom === 50
    && s0.inv.gear.rightHand === 'beads'
    && s0.inv.bag[0] === 'phone' && s0.inv.bag[1] === 'keys';
  log.survivesJson = eq(JSON.parse(JSON.stringify(s0)), s0);

  /* 3+5. seed a different run; unspecified gear/bag places come back empty.
     Deliberately still stamped v:1 — a save written by v3.5 must keep
     loading in every build after it, and the only way that stays true is if
     something exercises it. The v:1 literals below are that guard, not a
     leftover from before the bump.                                       */
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

  // null is how JSON spells "absent"; +null is 0, and sanity 0 faints the
  // run. It must fall back, never zero the player.
  e.applyState({ v: 1, ch: 'ch1', stats: { sanity: 88, awareness: 50, wisdom: 50 },
                 inv: { gear: {}, bag: [] } });
  e.applyState({ v: 1, ch: 'ch1', stats: { sanity: null, awareness: null, wisdom: null },
                 inv: { gear: {}, bag: [] } });
  log.nullStatsKept = e.worldState().stats.sanity === 88;

  // inherited keys are not item ids: a truthiness lookup on a plain
  // object accepts 'toString' and friends
  e.applyState({ v: 1, ch: 'ch1', stats: { sanity: 50, awareness: 50, wisdom: 50 },
    inv: { gear: { rightHand: 'toString' }, bag: ['hasOwnProperty', 'constructor'] } });
  const proto = e.worldState().inv;
  log.protoItemsDropped = proto.gear.rightHand === null
    && proto.bag.every(x => x === null);

  // a checkpoint stamped for another chapter is not applicable here
  log.foreignChapterRejected =
    e.applyState({ v: 1, ch: 'ch2', stats: { sanity: 1, awareness: 1, wisdom: 1 },
                   inv: { gear: {}, bag: [] } }) === false
    && e.worldState().stats.sanity !== 1;
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

/* 7b. the checkpoint: the same state, written down and read back. It must
   survive storage (which means it must survive JSON, again) and it must NOT
   be applied on its own — nothing restores at boot, deliberately. */
out.checkpoint = await p.evaluate(() => {
  const e = window.__enc;
  e.clearCheckpoint();
  const empty = e.loadCheckpoint() === null;
  e.applyState({ v: 1, ch: 'ch1', stats: { sanity: 71, awareness: 62, wisdom: 43 },
                 inv: { gear: {}, bag: ['keys'] } });
  const wrote = e.saveCheckpoint();
  const back = e.loadCheckpoint();
  const same = !!back && back.v === 1 && back.ch === 'ch1'
    && back.stats.sanity === 71 && back.stats.awareness === 62 && back.stats.wisdom === 43
    && back.inv.bag.includes('keys');
  // and it applies cleanly, because it is just state
  e.applyState({ v: 1, ch: 'ch1', stats: { sanity: 5, awareness: 5, wisdom: 5 },
                 inv: { gear: {}, bag: [] } });
  const applied = e.applyState(back) && e.worldState().stats.sanity === 71;
  e.clearCheckpoint();
  return empty && wrote && same && applied && e.loadCheckpoint() === null;
});

/* 8. the ?ch= seam. This used to fake a second chapter with a Proxy, because
   only ch1 existed and "?ch=ch1 boots ch1" would pass even if the selector
   ignored the URL entirely. There is a real second chapter now (chtest, the
   fixture), so the check is the real thing: a different chapter, built by
   the engine, from a file it has no special knowledge of. */
const sep = PAGE.includes('?') ? '&' : '?';
await p.goto(PAGE + sep + 'ch=chtest'); await p.waitForTimeout(5000);
out.chParamReallySelects = await p.evaluate(() =>
  !!window.__enc && window.__enc.worldState().ch === 'chtest');
// and it is genuinely a different world, not ch1 wearing a label
out.altChapterIsDifferent = await p.evaluate(() =>
  window.__enc.chapter.id === 99 && window.__enc.chapter.assets.length === 0);

// inherited keys must fall back, not kill the boot
out.protoChapterFallsBack = true;
for (const k of ['constructor', 'toString', '__proto__']) {
  await p.goto(PAGE + sep + 'ch=' + k); await p.waitForTimeout(5000);
  const ok = await p.evaluate(() =>
    !!window.__enc && window.__enc.worldState().ch === 'ch1');
  if (!ok) { out.protoChapterFallsBack = false; out.protoBroke = k; break; }
}
await p.goto(PAGE + sep + 'ch=nonexistent'); await p.waitForTimeout(5000);
out.badChapterFallsBack = await p.evaluate(() =>
  !!window.__enc && window.__enc.worldState().ch === 'ch1');

console.log(JSON.stringify(out, null, 1));
const MUST = ['shape', 'survivesJson', 'seedAccepted', 'seedLanded', 'hudFollows',
  'roundTripBack', 'garbageRejected', 'garbageSoftened', 'nullStatsKept',
  'protoItemsDropped', 'foreignChapterRejected', 'stillPlaying', 'liftGuard',
  'checkpoint',
  'chParamReallySelects', 'altChapterIsDifferent', 'protoChapterFallsBack',
  'badChapterFallsBack'];
for (const k of MUST) if (out[k] !== true) errs.push(`ERR state promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
