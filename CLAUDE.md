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
  him means the artifact version picker or the `.bundle` backups he keeps.
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
   AND the single-file preview; a change that breaks either is not done.
5. The generated files (`hellnote.html`, `wrapped.html`, `bundle.js`,
   `dist/`) are never edited by hand.

## Architecture (v2.1)

One source, two builds, built by `npm run build` (esbuild → `build.py` →
`wrap.py`):

- `src/main.js` — THE ENGINE (~2700 lines): renderer, input, viewmodel
  hands, ghost system, notes, pile interactable, audio, cutscene engine,
  UI flow, sky. It reads the current chapter off `window.__CHAPTERS__`.
- `src/chapters/ch1.js` — THE CHAPTER: words, choices, stat deltas,
  teachings, card title, stage positions (spawn/shrine/ghostHome/bounds),
  and the chapter's asset keys. Plain script (no ESM — file:// tests and
  the sandboxed preview both choke on module imports); registers itself
  on a global registry. **Chapter 2 starts by copying this file.**
- `assetBytes(name)` in main.js is the asset seam: hosted mode fetches
  fingerprinted URLs from `__ASSET_MAP_B64__`; embedded mode returns
  inline base64. `HOSTED` = the map is non-empty. Loaders never know
  which build they are in.
- **Outputs**: `dist/` (Netlify: real doctype document, preloads, engine
  + chapter + assets all content-hashed under `assets/`, `_headers` with
  year-long immutable caching, only `index.html` revalidates) zipped as
  `masterz-encounters-vN.N.zip`; and `hellnote.html` (everything inlined,
  for the claude.ai preview artifact whose sandbox cannot fetch) mirrored
  to `wrapped.html` for the harnesses.
- Version lives at the top of `build.py` (`VERSION`)— bump it each release.

Still deliberately in the engine, to be extracted as **step one of
chapter 2**: the void-deck world builder and the four cutscene scripts
(both already parameterized on the chapter's positions).

## Testing

17 harnesses, listed in `runtests.mjs` with one-line purposes. All use
`testlib.mjs` (portable browser launch + repo-relative paths). On a real
machine set `REAL_GPU=1` for much faster runs; in a GPU-less container
SwiftShader runs ~1 fps — trust state polls, never stopwatches. Full
suite in batches if the shell has a time cap. `hostedtest.mjs` serves
`dist/` over local HTTP and is the only harness for the hosted build;
everything else drives `wrapped.html`. Debug/screenshot one-offs are
gitignored by design — write them freely, they die with the session.

## Live targets

- **Netlify (the real site)**: project `masterz-encounters-game`
  (id 4133ded1-c901-49ac-8a93-0cfd34128e06) →
  masterz-encounters-game.netlify.app. Deploy = the dist zip on the
  site's Deploys page, or the Netlify MCP `deploy-site` npx command run
  from `dist/` when the environment's network allows it.
  **His `chadsor` project is his personal resume site — NEVER touch it.**
- **Preview artifact** (claude.ai, private to Chad):
  https://claude.ai/code/artifact/21317842-7db2-4d6a-95a4-eef816d9e68a
  — republish `hellnote.html` to that URL with a `vN.N-name` label each
  release. It holds the full version history picker.
- He may later point `game.triplegem.asia` at the Netlify site.

## Audio pipeline

Voice/music/SFX come from ElevenLabs (his account, connector or manual).
Full-fidelity spec (Chad's call, v2.3 — replaces the old mono/low-bitrate
one): keep each source's native channel layout (stereo stays stereo),
44.1 kHz, 128 kbps for generated sounds; the explore music keeps its
original bytes untouched. Always strip metadata (`ffmpeg -map_metadata
-1`). Watch the embedded build: the claude.ai preview artifact caps at
16 MB and v2.3 ships ~13.8 MB. All playback through
the shared Web Audio context — never `<audio src=data:>` — and everything
obeys the one mute button. Since v2.3 the game runs a full generated
soundscape: 34 sounds in one `audiopack` asset (assets/audio/ packed by
build.py) + the James opening line — loops, UI cues, ghost vocalisations,
cutscene stings, ending music beds, and in-world narration lines (voice:
"James - Husky, Engaging and Bold", eleven_v3). The procedural stings in
main.js remain only as the decode-time fallback. docs/AUDIO-PLAN.md has
the full inventory, cue map, and the generation flow IDs.

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

The anchors for that baseline: tag `v3.3`, commit `c8abf61`, the
`Encounters-backup.bundle` Chad holds (it carries the tag), and the
17 harnesses — which are what actually *enforce* the standard. A
chapter-2 change that reddens a base-game harness is a regression in
the reference build, not a test that needs relaxing.

Deferred by explicit choice: ghost mesh compression (1.6 MB, the
biggest download win, but it touches the fragile `rescueTextures` GLB
parsing — visual verification required), service worker/offline,
canvas-resolution and backdrop-blur thermal options. Worth revisiting
before the next heavy asset: the embedded preview build sits at 15.0 MB
against a 16 MB cap.

Next up: **chapter 2** — extract the world builder + cutscenes into the
chapter module, add a chapter picker (registry + on-demand chapter
script loading is already the mechanism), build the new location, swap
in Master Z's real chapter-1 text along the way. The extraction is a
pure refactor of the reference build: the base game must play
identically after it, and the suite is how that is proved.

`docs/LEARNINGS.md` is the catalog of every hard-won lesson (CSP traps,
audio traps, cutscene staging, test flakiness). When something in this
repo looks weird, it is probably load-bearing — check there first.
