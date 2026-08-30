# The foundation for many chapters

Decision note, 30 Aug 2026, revised the same day after a full
reconsideration (Chad: account for every scaling/bloat/testing/waste
possibility, then execute). The revision splits every item into
**NOW** (executed in v3.4 — zero feel change, provable by the suite)
and **WITH CHAPTER 2** (needs the extraction, or only means something
once a second chapter exists). v3.3 remains the reference standard;
v3.4 must play identically, and the suite is the proof.

The governing insight, unchanged: the thing that blocked "test chapter
10 directly" was never the build shape. It was that **the engine could
construct exactly one world state** (stats a literal, inventory two
hardcoded lines, `STATS_AT_START` a load-time snapshot). Fix state
first; delivery is downstream. Two facts keep it cheap: the V3
blueprint's linear spine means saved state is small and flat, and the
save/resume the blueprint wants IS the test-seeding mechanism — one
mechanism, two consumers.

---

## Executed NOW (v3.4)

### A. The state seam
- `worldState()` → plain JSON `{ v: 1, ch, stats, inv }`.
  `applyState(s)` validates and applies: numbers coerced and clamped
  0–100, gear keys limited to GEAR_SLOTS, bag normalised to BAG_SIZE,
  unknown item ids dropped (forward-compat when items change), any
  lifted item cancelled first (or a held item could duplicate), bars
  synced. Returns false on garbage without disturbing play.
- Both exposed on `window.__enc` — that is the test entry point, and
  later the save/resume entry point. `statetest.mjs` (harness #18)
  proves round-trip, seeding, and garbage rejection; the round-trip
  design is inherently non-vacuous (a no-op applyState fails it).
- **What state is:** CHECKPOINT state, at chapter boundaries. Not a
  quicksave. Her position/phase, cutscene progress, timers are
  deliberately not state — she re-arms from hidden on any restore,
  which is also correct staging. **If it cannot be JSON, it is not
  state.** No slots, no histories.

### B1. The chapter-select seam
- `CH` is chosen at boot from `?ch=<key>` against the registry, safe
  fallback to `ch1` (never a broken boot). Identical behavior today;
  it is the hook per-chapter tests and deep links need, and it makes
  hosted's per-chapter script loading meaningful later.

### D1. Test groups
- Every harness carries a group: `engine` or `release` (a `chapter`
  group arrives with per-chapter data tests). `node runtests.mjs
  @engine` runs a group; default behavior unchanged.

### E1. The suite tests what ships
- `testlib.PAGE` is now a local static server over `dist/` — the same
  ~15 lines `hostedtest.mjs` proved, unref'd so processes still exit,
  with `/favicon.ico` answered (file:// never requests it; http does —
  this was the census "404" in the spike). Harnesses change little to
  not at all; the suite now drives the build players load, and drives
  it against the frozen baseline — the one moment any embedded/hosted
  behavioral difference is guaranteed to surface as a clean diff.
- `csptest` deliberately keeps `wrapped.html`: its job is the strict
  no-blob/no-data CSP that SHAPED the fragile loaders, and it is the
  guard against "simplifying" one back to a blob: URL.
- Note what is lost: wrapped.html was also the no-viewport-meta "worst
  case". Players get index.html's meta; testing reality wins.

## Ordering reversal, with the reason
The first draft put E last. Wrong: E does not depend on D, and the
best time to re-point the suite is against a frozen reference build,
not mid-extraction — any difference shows up now as a clean signal.
Conversely the first draft put the fixture chapter early; it actually
requires conditional world-building, which is the extraction. Moved.

---

## WITH CHAPTER 2 (deliberately not now, with reasons)

### A2. Persistence wiring
Persist on chapter complete, restore on boot, recap card. NOT now:
with one chapter it is meaningless, and restore-on-boot is a
player-visible behavior change to the frozen baseline — its feel
(auto-resume vs title screen) is Chad's call when resume exists.

### B2. The extraction (the big one)
Void-deck builder + the four cutscenes out of `main.js`; a chapter
exports `{ text, choices, stage, assets[], scenes[], build(ctx),
dispose() }`; advancing runs `dispose()` → `build()` — one code path
for boot and advance, no page reload (a reload re-pays GLB parse,
shader compile, audio decode). NOT now: it is the highest-risk change
in the repo, the `ctx` the scenes need (drum, ash, embers, heroNote,
fireLight, noteProp, arms, pile/burner positions…) should be designed
against chapter 2's REAL needs, not guessed; and nothing before
chapter 2 benefits. `dispose()` must genuinely free geometries,
materials, textures — add a leak harness that builds/disposes 50× and
watches `renderer.info` counts.

### C. Per-chapter assets
Split build.py's ASSETS into shared (hands, ghost, audiopack, music,
logo — and note `ch1.js` wrongly lists `ghost` as its own; the ghost
is engine) vs per-chapter (location GLB, that chapter's lines).
Manifest per chapter; preload shared + current only. NOT now: with
one chapter it is bookkeeping with real regression surface in
build.py and zero payoff until a second chapter exists.

### D2. The fixture chapter
`chtest.js`: bare primitive room, no location GLB; re-point the
~13 engine harnesses at it (fast, decoupled); per-chapter tests
become one small data-driven file (keys resolve, deltas sane, stage
in bounds, assets exist, scenes complete — mostly no browser); keep
exactly two full-integration harnesses (`final`, `hosted`) on a real
chapter, release-tier. **The rule that stops test bloat: most tests
must never load a real chapter.** Requires B2's conditional build.

### E2. Delete the embedded build
Only after D2, and after csptest is re-thought (its CSP guard must
survive in some form). Until then hellnote.html stays buildable: it
costs ~5.5 s, is the offline fallback, and deleting things early is
how code gets lost.

## Do NOT build — the linear spine is the simplification; spend it
Branching saves or slots · mid-scene hot-swap · full suite per
chapter · any new inlining · a framework · a level editor.

---

## Sequence

NOW (v3.4): A → B1 → D1 → E1, one release, full suite green on the
hosted target, adversarially reviewed. WITH CH2: B2 → D2 → C → A2 →
E2, in that order, each with the suite green before and after.
