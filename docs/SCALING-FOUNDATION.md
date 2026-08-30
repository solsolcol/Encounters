# The foundation for many chapters

Decision note, 30 Aug 2026, from Chad's question: what has to be true so
the game scales to ~10 chapters without bloating the download or the
test suite. Written before chapter 2 starts, because every item here is
cheaper now than after a second chapter exists.

The governing insight: the thing blocking "test chapter 10 directly" is
not the build shape. It is that **the engine can construct exactly one
world state** — `stats` is a literal at `main.js:1897`, the inventory is
two hardcoded lines at 2624-2625, `STATS_AT_START` snapshots them at
load. Delivery (file:// vs http://) is downstream of that and mostly a
detail. Fix state first.

Two facts make this cheap. The V3 blueprint commits to one linear spine
— choices move three numbers and swap a teaching, they never fork — so
saved state is small and flat, not combinatorial. And the save/resume
system the blueprint already wants IS the test-seeding mechanism. Build
it once, two consumers.

---

## A. The state seam  — small, first, unlocks the rest

1. `worldState()` returns plain JSON: `{ ch, stats, inv, seen }`.
   `applyState(s)` sets them. Nothing else.
2. Persist on chapter complete; restore on boot. localStorage, one slot.
3. Expose `applyState` on `window.__enc` — that is the test entry point.

**Anti-bloat rule: if it cannot be JSON, it is not state.** No engine
objects, no THREE refs, no save slots, no branching histories. One save.

## B. The chapter as a unit  — the planned extraction, now with an interface

4. Move the void-deck world builder and the four cutscenes out of
   `main.js` into the chapter module. A chapter exports:
   `{ text, choices, stage, assets[], scenes[], build(ctx), dispose() }`.
5. `CH` stops being a module-scope const bound to `.ch1`. Chapter is
   chosen at boot from `?ch=N` (tests and deep links get this free).
6. In-game advance runs the same path: `dispose()` then `build()` of the
   next chapter. **One code path, two entry points.** No page reload
   between chapters (reload re-pays GLB parse, shader compile and audio
   decode — the cost `restart()` was built to avoid), and no hot-swap
   machinery beyond dispose/build.
7. `dispose()` must actually free geometries, materials and textures.
   This is the one real new discipline; three.js leaks without it.

## C. Assets per chapter  — stops download bloat

8. Split `build.py`'s `ASSETS` into **shared** (hands, ghost, audiopack,
   music, logo — the engine's) and **per-chapter** (location GLB, that
   chapter's voice/sfx). Correction to make while doing it: `ch1.js`
   currently declares `ghost` as its own; the ghost system is engine, so
   `ghost` moves to shared.
9. Emit a per-chapter manifest; `index.html` preloads shared + the
   current chapter only. A player on chapter 1 never downloads
   chapter 7's location.

## D. Test layering  — stops test bloat. The item that matters most.

Today every harness boots the whole world and plays chapter 1: ~10-15 s
of fixed cost before any assertion, and the full suite ran ~14 minutes
for ONE chapter. Multiplying that by chapters is how this dies.

10. Add a **synthetic fixture chapter** (`src/chapters/chtest.js`): a
    bare room from primitives, no location GLB, engine positions only.
11. Re-point the ~13 engine harnesses (census, csp, motion, perf, tick,
    text, inv, sanity, step, pile, restart, title, fade) at the fixture.
    They get much faster, and they stop silently depending on the void
    deck — if an "engine" test fails on the fixture, the engine had a
    chapter coupling worth knowing about.
12. **Per-chapter tests stay small and data-driven**, one parameterized
    file over all chapters: text keys resolve, choice deltas are sane,
    stage positions sit inside bounds, declared assets exist, each
    cutscene runs to completion. Cheap; most of it needs no browser.
13. Keep exactly two full integration harnesses (`final`, `hosted`) on
    the real chapter, release-only.
14. `runtests.mjs` gains groups: `engine` (always), `chapter N`
    (when that chapter changes), `release` (everything).

**The rule: most tests must never load a real chapter.** That is the
whole anti-bloat move, and it is already worth doing at one chapter.

## E. Retire the embedded build  — last, after D

15. Point `testlib.PAGE` at a local server over `dist/` (the ~15 lines
    already proven in `hostedtest.mjs`; spiked this session — `motion`
    passed unchanged, `census` needed only its console filter relaxed,
    which assumed "the page never fetches").
16. Then delete `hellnote.html` / `wrap.py`. Frees ES modules (currently
    blocked only by `file://`), kills the 31 % base64 inflation
    (measured: 15.0 MB embedded vs 11.4 MB hosted), and ends the
    inverted coverage where 16 harnesses test a build nobody runs.

## Do NOT build

Branching saves or save slots · chapter hot-swap mid-scene · the full
suite per chapter · any inlining · a framework · a level editor. The
linear spine is the simplification — spend it.

---

## Order and shape of the work

`A → B → D → C → E`. A is small and independent. B is the extraction
chapter 2 needs anyway. D depends on B's interface (the fixture chapter
needs `build()`). C depends on B. E is cleanup once D lands.

A + B + D are the foundation; C and E follow mechanically. The base game
must play identically after all of it — v3.3 is the reference standard
and the suite is what proves it.
