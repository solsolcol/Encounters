# Master Z's Encounters — The Game

A 3D first-person horror-education game based on Master Z's Spiritual
Encounters (encounters.triplegem.asia, Triple Gem Affiliation Consultancy,
Singapore). Multi-chapter; each chapter is one small dense location, one
supernatural encounter, one decision with consequences and a Buddhist
teaching. Chapter 1 (The Hell Note: a void deck, a burner, a note, her) is
complete and live. This file is the contract for how work on this repo
happens — read it before changing anything.

## Who you are working with

Chad (chadsor@gmail.com) has **zero game-dev experience** and often works
from his **phone**. Consequences:

- Explain in plain language. No jargon walls. Paths only in code blocks.
- **Never push him toward git commands or terminal steps.** Rollback for
  him means the Netlify Deploys page (open an older deploy, Publish
  deploy) or the `.bundle` backups he keeps. The claude.ai preview
  artifact was a third route; retired 30 Aug 2026 (below).
- He values care over speed: **"be extremely careful, don't break anything,
  don't lose anything"** is a standing instruction. Two past incidents of
  accidentally deleted code made this a hard rule (see LEARNINGS).
- For anything expensive or destructive: **tell him the options first,
  let him pick.** He decides scope; you decide implementation.
- He dislikes over-testing small changes (see Testing) and once asked
  "why so many commands for a simple change" — keep runs proportionate.
- Deliver a fresh backup bundle and the Netlify zip at every good version.

## The rules that never bend

1. **Never delete code by line-range.** Targeted edits on unique strings
   only. Before every commit, read the FULL diff and account for every
   removed line.
2. **Test proportionately.** Run only the harnesses a change can plausibly
   break; the full suite only before a substantial release. `node
   runtests.mjs <names>` runs picked harnesses two at a time.
3. **Version every good build**: commit with a real message, tag `vN.N`,
   refresh `Encounters-backup.bundle` (`git bundle create
   Encounters-backup.bundle --all`), hand it to Chad.
4. **Both builds must stay green.** One source produces the hosted site
   AND the single-file build; a change that breaks either is not done.
   The single-file build is no longer published or (since v3.4) what the
   suite drives, but it stays, and that was reconsidered and confirmed at
   v3.5: it costs ~5 s of build time, it is the anywhere/offline
   fallback, and it is the ONLY surface csptest can test the strict
   no-blob/no-data CSP on — the policy that shaped the hand-parsed GLB
   and audio loaders. Deleting a working fallback to save five seconds is
   the wrong trade (docs/V3.5-PLAN.md).
5. The generated files (`hellnote.html`, `wrapped.html`, `bundle.js`,
   `dist/`) are never edited by hand.

## Architecture (v4.0)

One source, two builds, built by `npm run build` (esbuild → `build.py` →
`wrap.py`):

- `src/main.js` — THE ENGINE (~3400 lines): renderer, input, viewmodel
  hands, ghost system, audio, cutscene engine + its language, UI flow,
  sky, sanity, inventory. It owns everything every chapter shares and
  nothing that belongs to one.
- `src/chapters/*.js` — THE CHAPTERS. Each is a plain script (no ESM —
  file:// tests and the CSP build both choke on module imports) wrapped in
  one closure, registering itself on `window.__CHAPTERS__`. A chapter
  carries its words, choices, stat deltas, teachings, stage positions,
  asset keys, and **three entry points**:
  - `build(ctx) -> stage` constructs its world and hands back the handle
    the engine drives it through (`pile.*`, `blockers`, `snap/restore/
    reset`, `updateNotes/updatePile/updateFire/updateSlow`, `dispose`).
    `ctx` is the engine's kit passed in — THREE, the scene, the texture
    library — so a chapter never imports anything.
  - `scenes[i](c, s, api)` — one cutscene per choice, written in the
    engine's cutscene language (`api`: the verbs from `A(c)` plus the cast
    a scene may direct, and `api.stage` for its own props).
  - `intro(c, s, api)` — OPTIONAL, added at v4.0. The chapter's opening
    FILM, in the same cutscene language, run against its own world BEFORE
    the chapter card: black, film, title, night. Chapter 2 has one;
    chapter 1 does not, and a chapter without one takes exactly the path
    it always took.
  - `src/chapters/chtest.js` is the FIXTURE chapter: primitives only, no
    location model, no assets. It is not part of the game — it exists so
    "the engine is chapter-agnostic" is a tested claim (`fixturetest`)
    rather than a hope.

**WHAT A CHAPTER OWNS, and the rule behind it.** Building chapter 2 found
eight places where "the engine" was really chapter 1's engine. Every one
was fixed the same way and the pattern is now the law here: **a chapter
declares it, chapter 1's current value is the default, so nothing moves.**
The declarations, all optional:

| field | what it decides | default |
|---|---|---|
| `ghost` | her whole territory: `minDist`, `appearAt`, `near`/`far`, `cross`, `away`, `behind`, and the `roam` box she may stand in | the void deck's numbers |
| `ambience` | `beds` (loops that just run) and `atShrine` (one keyed to distance from the shrine) | `amb` + the burner's `fire` |
| `words` | `approach`, `act`, `actTouch`, `interact`, `interactTouch` — the words that NAME the thing you act on | the string sheet's |
| `lines` | `near`, `close`, `nearAt` — the two proximity narration lines | — |
| `sayPrefix` | the prefix of the four lines under the outcome cards | `'v'` (→ `vA`..`vD`) |
| `voiceLine` | the asset key of the line he says a few seconds into play | — (silence) |
| `noteArt` | the asset key of the chapter's note art | — (the drawn one) |
| `intro` | the opening film | — (straight to the card) |

`shrine` is the engine's anchor for HER, not for the chapter's warm light.
Chapter 1's happens to be both; chapter 2's is the gap beside the bed and
its altar is a separate thing on the other wall. Getting that wrong made
the safest object in the room the source of the haunting.
- Advancing a chapter is `rebuildStage(next)` — `dispose()` then
  `build()`, never a page reload, which would re-pay the GLB parse, the
  shader compile and the whole audio decode. `leaktest` is what keeps
  that honest.
- `assetBytes(name)` in main.js is the asset seam: hosted mode fetches
  fingerprinted URLs from `__ASSET_MAP_B64__`; embedded mode returns
  inline base64. `HOSTED` = the map is non-empty. Loaders never know
  which build they are in.
- **Outputs**: `dist/` (Netlify: real doctype document, preloads, engine
  + chapter + assets all content-hashed under `assets/`, `_headers` with
  year-long immutable caching, only `index.html` revalidates) zipped as
  `masterz-encounters-vN.N.zip`; and `hellnote.html` (everything inlined
  — built for the retired claude.ai preview, kept because it is the
  anywhere-fallback) mirrored to `wrapped.html`, which csptest loads;
  since v3.4 the other harnesses load `dist/` over testlib's server.
- Version lives at the top of `build.py` (`VERSION`)— bump it each release.

Deliberately still in the engine, and correctly so: the ghost (she is the
game's, not chapter 1's), the faint sequence, the cutscene *language*, and
the sky. A chapter owns its location, its props and its four scenes —
nothing else.

## Testing

22 harnesses, listed in `runtests.mjs` with one-line purposes and a
group tag (`node runtests.mjs @engine` / `@release` / `@chapter`).
**The rule that stops the suite growing with the game: adding a chapter
must not add a harness.** Per-chapter correctness is one data-driven
file, `chaptertest.mjs` — keys resolve, deltas are in scale, the stage is
inside its own bounds, every asset key exists in build.py, every choice
has a scene — and it runs in plain Node in under a second, no browser.
`fixturetest.mjs` proves the engine plays a chapter it has never seen,
and `leaktest.mjs` proves a chapter gives the GPU back what it took.
All use `testlib.mjs` (portable browser launch
+ repo-relative paths). Since v3.4 `testlib.PAGE` serves `dist/` over a
local HTTP server, so the suite drives the HOSTED build — the one
players load — and needs `npm run build` first, same as before. The one
deliberate exception is `csptest.mjs`, which serves `wrapped.html`
itself under the strict no-blob/no-data CSP that shaped the hand-parsed
loaders. On a real machine set `REAL_GPU=1` for much faster runs; in a
GPU-less container SwiftShader runs ~1 fps — trust state polls, never
stopwatches. Full suite in batches if the shell has a time cap.
Debug/screenshot one-offs are gitignored by design — write them freely,
they die with the session.

## Live targets

- **Netlify (the real site)**: project `masterz-encounters-game`
  (id 4133ded1-c901-49ac-8a93-0cfd34128e06) →
  masterz-encounters-game.netlify.app. Deploy = the dist zip on the
  site's Deploys page, or the Netlify MCP `deploy-site` npx command run
  from `dist/` when the environment's network allows it.
  **His `chadsor` project is his personal resume site — NEVER touch it.**
- **Retired: the claude.ai preview artifact** (Chad's call, 30 Aug
  2026 — the game is fully on Netlify). Do NOT republish it as part of
  a release. The old link still holds its version history up to v3.3 if
  it is ever wanted:
  https://claude.ai/code/artifact/21317842-7db2-4d6a-95a4-eef816d9e68a
- He may later point `game.triplegem.asia` at the Netlify site.

## Audio pipeline

Voice/music/SFX come from ElevenLabs (his account, connector or manual).
Full-fidelity spec (Chad's call, v2.3 — replaces the old mono/low-bitrate
one): keep each source's native channel layout (stereo stays stereo),
44.1 kHz, 128 kbps for generated sounds; the explore music keeps its
original bytes untouched. Always strip metadata (`ffmpeg -map_metadata
-1`). The 16 MB ceiling on the embedded build was the preview
artifact's and no longer applies; the hosted build streams assets
separately, so audio budget is now a download-time judgement, not a hard
cap. All playback through
the shared Web Audio context — never `<audio src=data:>` — and everything
obeys the one mute button. Since v2.3 the game runs a full generated
soundscape: 56 sounds in one `audiopack` asset (assets/audio/ packed by
build.py) + the James opening line — loops, UI cues, ghost vocalisations,
cutscene stings, ending music beds, and in-world narration lines (voice:
"James - Husky, Engaging and Bold", eleven_v3). The procedural stings in
main.js remain only as the decode-time fallback. docs/AUDIO-PLAN.md has
the full inventory, cue map, and the generation flow IDs; the v3.7
cutscene pass is in docs/V3.7-PLAN.md.

A cutscene reaches sound through `sfx(at, kind, vol)` and nothing else.
`kind` is a row in `STING_SAMPLE` in main.js — that table IS the
vocabulary a scene has, so giving a chapter a new noise means adding a
row there, not reaching past the seam. `STING_SYNTH` names the handful
of kinds the procedural fallback can fake; every other kind is
sample-only and simply stays silent if its buffer has not decoded, which
is why `startDecision()` warms the whole cutscene set. `chaptertest`
fails the build if any chapter's cue names a kind that does not exist or
a sample with no file — a mistyped cue is silent with no error, and that
is not a bug a screenshot can catch.

## Changing the words

Every string in the game is editable from ONE Google Sheet — Chad edits it
on his phone, and `node textsync.mjs import <sheet>` applies the lot in one
pass. UI words live in `src/strings.js` (reaching the screen through
`data-t` attributes in `shell.html` and `T()` in code); the chapter's own
words stay in the chapter file. An empty cell removes that text. Full
workflow, guarantees and the sheet id: `docs/EDITING-TEXT.md`. **Never
hand-edit a string without re-exporting the sheet afterwards**, or his copy
of the text goes stale.

## Content ground truth

`docs/SOURCE-NOTES.md` + `docs/source/` hold the studied originals: all
43 site case files and the 2D trial game (15 chapters, every choice,
score and teaching). **Read them before writing chapter content — the
material is already written in Master Z's voice.** Chapter 1's current
choices are placeholders; the real "THE OFFERINGS" data is in
`docs/source/trial-game-chapters.md` waiting to be swapped in. The trial's
scoring model (only wisdom decides passing; sanity is a cost, not a fail
state) differs from ours — a deliberate divergence to revisit with Chad.
Attributions must stay in the credits panel; he adds more as they come.

## Current state and roadmap

**v3.3 is the reference standard for the base game** (Chad's call,
30 Aug 2026). Everything below it is settled: chapter 1 plays end to
end and the engine's feel — how she behaves, how she sounds, how the
cards perform, how the equipment screen works — is the bar new chapters
are held to, not a thing to be renegotiated while building them. Treat
a change that alters base-game feel as its own decision to put to Chad,
separately from the chapter work that prompted it.

What the baseline contains, by release:
- **v2.1** the chapter-1 loop (explore → the pile → four choices →
  in-engine cutscenes → teaching card → rank), sanity drain, instant
  restart, split-file hosting with preloads and immutable caching.
- **v2.3** the full generated soundscape (one audiopack + the James
  narration).
- **v2.5–v2.9** stat icons, flowing bars, volume slider, the logo, the
  reactive ECG.
- **v3.0–v3.01** the one-sheet text pipeline (`textsync` + `texttest`).
- **v3.1** the equipment/inventory system and the pointer-lock fix.
- **v3.2** the drama pass: faint at sanity zero, performing outcome and
  complete cards, the paper-doll equipment screen.
- **v3.3** the terror pass: her four-variant repertoire, directional
  audio, James's scared reactions, chunk sanity drain.
- **v3.4–v3.6** the scaling foundation (below) and autosave/resume.
- **v3.7** the presentation pass: every outcome card reads as glass, the
  title screen plays a darkened looping video, the teaching types with a
  key tick, and all four cutscenes got their voice — 32 cues across the
  four scenes, up from 19, with the cartoonish `whoosh` retired.
- **v4.0** CHAPTER 2 · The Presence — a bedroom, an opening film, and the
  eight chapter-1 leaks that building it exposed (the table above). Also:
  `textsync` now discovers every chapter rather than naming chapter 1, so
  a new chapter's words reach Chad's sheet with no edit to the tool.
- **v3.8** real art where there was code: a bought first-person ARM rig
  (`arms.glb`, credited to Fab) replaces the wrist-only hand pack and the
  forearm that was built out of cylinders to cover for it, and the hell
  notes are a real photographed note (`assets/hellnote.webp`) instead of
  a canvas drawing. The kicking leg built in v3.7 is gone — Chad's call;
  the kick is told by the camera again.

  Two things to know before touching either. **glTF strips dots from node
  names**: `hand.R` in the file is `handR` in the scene, and a bone lookup
  that gets this wrong fails silently — every name returns undefined and
  the hand simply never poses. And the arm model is **scaled at load to a
  measured hand length**, wrist to middle fingertip, rather than trusted:
  packs export in different units (this one arrives through Blender's FBX
  path with a ×100 armature) and a viewmodel a hundred times life size is
  a wall of skin. Measure from BONES, never from `Box3.setFromObject` —
  on a skinned mesh that reports the bind pose.

  The note art loads through `loadImageTexture()` (bytes → Blob →
  `createImageBitmap`, the same CSP-safe path as the logo) and reaches the
  chapter through `stage.setNoteTexture()`, re-applied after every
  rebuild. The chapter builds with the drawn note immediately and swaps,
  so a 330 KB download is never on the first frame's path. It is also
  BRIGHTENED as it goes in (colour ×1.75, a little emissive): a saturated
  print at this light level collapses into a dark tile and reads worse
  than the flat card it replaced — the opposite of what you would guess.

The anchors for that baseline: tag `v3.3`, commit `c8abf61`, the
`Encounters-backup.bundle` Chad holds (it carries the tag), and the
22 harnesses — which are what actually *enforce* the standard. A
chapter-2 change that reddens a base-game harness is a regression in
the reference build, not a test that needs relaxing.

Deferred by explicit choice: ghost mesh compression (1.6 MB, the
biggest download win, but it touches the fragile `rescueTextures` GLB
parsing — visual verification required), service worker/offline,
canvas-resolution and backdrop-blur thermal options. Retiring the
preview artifact removed the 16 MB cap that was making compression
urgent, so it is now a plain download-speed improvement to schedule when
convenient, not a blocker on new assets.

**The scaling foundation is DONE** (v3.4 + v3.5 — Chad's call to do all
of it now rather than alongside chapter 2). `docs/SCALING-FOUNDATION.md`
holds the reasoning and `docs/V3.5-PLAN.md` the execution. What is now
true, and must stay true:
- a run is plain JSON (`worldState`/`applyState`) and **autosaves while
  you play** — Chad's call at v3.6. Continue is the default action on the
  title screen; New game is always reachable and always asks first. Only
  `state === 'play'` is ever saved, so nothing restores into a half-open
  decision or a cutscene, and fainting rewrites the save to the START of
  the chapter rather than three seconds before the faint;
- `?ch=<key>` selects any registered chapter, unknown keys fall back;
- the playing chapter is not fixed: `setChapter(key)` swaps it (resume
  into another chapter, and the advance path when one is sealed). The
  chapter-derived values are MUTATED in place, never reassigned —
  `OFFER_POS` aliases SHRINE and closures captured BOUNDS;
- a chapter owns its world and its scenes behind `build(ctx)`/`scenes[]`,
  and advancing is `rebuildStage()` in place, never a page reload;
- only the shared assets and the booting chapter's own are preloaded;
- **adding a chapter must not add a harness.**

**Chapter 2 is built** (v4.0) — THE PRESENCE, from the trial game's own
episode 1: the bedroom, days after the void deck. Its choices, ranking and
teachings are Master Z's verbatim; only the delta magnitudes are rescaled
from the trial's ±12 to this game's ±30. `docs/V4-CHAPTER2-PLAN.md` is the
build's memory — read it before touching chapter 2.

Next up: **chapter 3**, and the still-outstanding job of replacing chapter
1's placeholder choices with the real "THE OFFERINGS" data in
`docs/source/trial-game-chapters.md`. Chapter 3 should be much cheaper
than chapter 2 was: the eight leaks are fixed, so the next chapter
declares what it needs and the engine already knows how to be told.

`docs/LEARNINGS.md` is the catalog of every hard-won lesson (CSP traps,
audio traps, cutscene staging, test flakiness). When something in this
repo looks weird, it is probably load-bearing — check there first.
