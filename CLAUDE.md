# Master Z's Encounters — The Game

A 3D first-person horror-education game based on Master Z's Spiritual
Encounters (encounters.triplegem.asia, Triple Gem Affiliation Consultancy,
Singapore). Multi-chapter; each chapter is one small dense location, one
supernatural encounter, one decision with consequences and a Buddhist
teaching. Five chapters — one complete episode — are live: The Hell Note
(a void deck, a burner, a note, her), The Presence (a bedroom, a fan, the
gap beside the bed), The Gathering (a seventh-month tentage in the car
park at ten in the morning, and one chair facing the wrong way), Back
Home (the evening after, the flat misbehaving on a poltergeist clock)
and The Lesson (the tang-ki's morning visit, the note found, taught
over, and returned to the fire). All five happen at the same block. This
file is the contract for how work on this repo happens — read it before
changing anything.

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
   push the branch, hand Chad the dist zip.
   **The backup bundle is MILESTONE-ONLY since v4.81** (Chad's call — "i
   feel it is unnecesary", and he was right): refresh
   `Encounters-backup.bundle` (`git bundle create
   Encounters-backup.bundle --all`, split at 20 MB for the upload limit)
   when a CHAPTER ships, or whenever he asks — not every release. Why the
   old rule is retired: GitHub now holds the branch and its whole history,
   Netlify holds every published build with two-tap rollback, so the
   bundle was a third copy of what two durable places already had. What it
   still uniquely buys is an OFFLINE copy in his own hands, dependent on
   no account — worth having occasionally, not every time.
   The one real gap it papered over: **tags cannot be pushed from these
   sessions** (`git push --tags` → 403; the GitHub grant covers branch
   refs, not tag refs), so `vN.N` labels live only locally and in the
   bundle. That costs nothing, because every release commit's message
   BEGINS with its version — a version is findable on GitHub by message
   whether or not a tag survived. Keep writing them that way.
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

## Architecture (v4.1)

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
    it always took. It begins on BLACK and stays there until its own
    `fade()` lifts it (v4.6: `playCineFn`'s `startFade`) — so a film opens
    on the dark it was written to open on, and `cinetest` checks it.
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
| `ghost` | her whole territory: `minDist`, `appearAt`, `near`/`far`, `cross`, `away`, `behind`, and the `roam` box she may stand in — or `null`, which switches the haunting OFF for the chapter (no appearances, no drain, no banner; cutscenes may still drive her mesh) | the void deck's numbers |
| `ambience` | `beds` (loops that just run) and `atShrine` (one keyed to distance from the shrine) | `amb` + the burner's `fire` |
| `words` | `approach`, `act`, `actTouch`, `interact`, `interactTouch` — the words that NAME the thing you act on | the string sheet's |
| `lines` | `near`, `close`, `nearAt` — the two proximity narration lines | — |
| `sayPrefix` | the prefix of the four lines under the outcome cards | `'v'` (→ `vA`..`vD`) |
| `voiceLine` | the line he says a few seconds into play — an asset key, or since v4.3 a pack sound's name | — (silence) |
| `noteArt` | the asset key of the chapter's note art | — (the drawn one) |
| `intro` | the opening film | — (straight to the card) |
| `daylight` | the sky, the fog, the three global lights — and since v4.3 the sun (`sun`), the cloud layer (`clouds`) and the viewmodel's own rig (`vmHemi`/`vmKey`), so a bright chapter lights the HANDS too | chapter 1's midnight |

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

**The tenth leak, also v4.1**: the SKY was chapter 1's sky. Chapter 3 is a
ceremony in a car park and those happen in the MORNING (Chad's call), so a
chapter now declares `daylight` — the dome's gradient, the background, the
fog, the hemisphere, the key light and its direction, the fill, and the
opacity of the stars and the moon. `applyDaylight()` MUTATES them in place
beside `applyGhostTerritory()`; chapters 1 and 2 declare nothing and stay at
midnight. It is worth saying why the change is good rather than merely
asked-for: chapters 1 and 2 hide her in the dark because that is what dark
is for, and there is nowhere to hide at ten in the morning. (Where she is
in that daylight changed again at v4.3 — see below.)

**The ninth leak, found at v4.1**: a cutscene may now hold a chapter's own
ambience loops down, through `api.duck(name, k)`. Chapters 1 and 2 run room
tones and a room tone never stops; chapter 3 runs a ceremony, and its
opening film is built on the moment the drum does. A scene cannot call
`loopVol()` directly — the ambient frame re-asserts every declared volume
every frame — so this is a multiplier that frame respects, cleared at both
ends of every cutscene. Chapters 1 and 2 are untouched: `duckOf()` returns
1 unless a scene says otherwise.

**THE FIGURE IN THE EQUIPMENT PANEL IS KEYED TO THE EPISODE** (Chad's
rule, v5.29 — "take note of this entire context in memory, remember it
well"). The rotating Master Zav in the inventory is the man the player is
*becoming*, so his AGE tracks the story:

| episode | chapters | figure | asset |
|---|---|---|---|
| 1 | ch1-ch5 | young | `zavyoung` — shipping now |
| 2 | ch1-ch5 | teenager | `zavteen` — **Chad supplies the model** |
| later | the adult phase | adult | `zav`, the 990k-tri scan |

`ZAV_FIGURE` in main.js is that table and `zavKey()` reads it; the adult
scan and every number that shaped it (v5.08-v5.11: the meshopt pack, the
no-mipmap rule for his atlas, the seam padding) is **kept, not deleted** —
it returns when the adult phase does, and `ZAV_ADULT` is the fallback for
any chapter not listed. It is keyed by CHAPTER because the chapter key is
what the engine actually knows; the episode is the reason behind the
grouping, not a thing the engine tracks. Swapping ages is a real swap —
`zavLoad()` disposes the standing figure when `zav.key` no longer matches —
so episode 2's chapters need only their own rows, nothing else.

## Testing

23 harnesses, listed in `runtests.mjs` with one-line purposes and a
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
  site's Deploys page, or the Netlify MCP `deploy-site` npx command —
  **run from INSIDE `dist/`, never the repo root**: the uploader ships
  its cwd verbatim, and from the root it publishes the repo (no index at
  /, site down — it happened at v4.3, LEARNINGS has the write-up).
  Byte-verify against dist/ after every deploy.
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
soundscape: 95 sounds + the James opening line — loops, UI cues, ghost vocalisations,
cutscene stings, ending music beds, and in-world narration lines. Four
speakers now: the boy (**Aaron, `B6uUx2p7cRgxseOUyP6P` — since v5.28**,
Chad's third pick for the part after VALF, v5.15, drifted between a girl
and a grown man across takes and River, v5.18, never satisfied him; the
registry still calls him `james` and the files `v*`, because renaming
eighty-two keys buys nothing), chapter
2's Mother (Matilda, `XrExE9yKIg1WjnnlVkGX`), chapter
3's auntie (Alice, `Xb7hH8MSUJpSbSDYk0k2`) and the tang-ki (Bill,
`pqHfZKP75CvOlQylNhV4`) — all eleven_v3. The workspace has no Southeast
Asian voice at all; what those two were actually chosen for is that they do
not sound like each other. The procedural stings in main.js remain only as
the decode-time fallback. docs/AUDIO-PLAN.md has the full inventory, cue map
and generation flow IDs; the v3.7 cutscene pass is in docs/V3.7-PLAN.md and
chapter 3's twenty-three sounds are in docs/V4.1-CHAPTER3-PLAN.md.

**HOW THE SOUND REACHES THE PLAYER, since v4.2** (Chad's question: "it
shouldnt grow like that as a single download right?" — he was right).
There is no longer ONE pack. There is a shared pack plus one per chapter,
and `build.py` COMPUTES the split rather than any chapter declaring it:
**a sound is a chapter's when exactly one chapter can ask for it and the
engine never does; everything else is shared.** The bias to shared is
deliberate and asymmetric — a sound wrongly left shared costs a few KB, a
sound wrongly moved out of it is a cue that plays nothing with no error.
Shared and the booting chapter's load at boot, `setChapter()` loads a new
chapter's, and `startDecision()` fetches the NEXT chapter's, which is late
enough that a player who never finishes chapter 1 never pays for chapter 2
and early enough that a cutscene, a card and a rank screen cover the
download. `sndBuf()` never changed: packs `Object.assign` into the same
`packJson`.

And there are TWO ENCODINGS of every sound. The mp3s are exactly the bytes
that always shipped and must stay untouched — they are the proven fallback.
Beside them, `assets/audio-opus/` holds the same 95 at 96 kbps stereo /
64 kbps mono: 4.5 MB against 6.9, encoded from the surviving ElevenLabs
MASTERS, so it is a FIRST-generation copy where the mp3 is a second, and
measurably closer to the master than the file now live. Stereo stays stereo
(the 48 spoken lines were always mono — that is what one voice is). The one
contract term that moved is sample rate: Opus is 48 kHz only, which
discards nothing, since Web Audio resamples every buffer anyway. **AAC is
disqualified, not overlooked** — it is smaller still, but Playwright's
Chromium cannot decode it (the same missing proprietary codecs that gave
the title video a VP9 encode), so the suite could never defend it. And the
codec is never GUESSED: a 179-byte Opus file is DECODED through an
`OfflineAudioContext` before anything is fetched, and only a browser that
really produced an AudioBuffer from it gets the Opus packs. Guessing wrong
is not a bigger download, it is a game with no sound at all.
Chapter 1's sound download: 6830 KB -> 3864 KB, and chapter 4 adds nothing
to it. Full reasoning, the measurements and the traps:
docs/V4.2-AUDIO-DELIVERY.md.

**eleven_v3 fails about one line in three, at random.** Seven of sixteen
failed on the first run at v4.1 and every one succeeded on a plain re-run
with the text unchanged. Do not rewrite a line that failed — check
`has_failures`, re-run, repeat. (The v4.0 note blaming line length and
punctuation was wrong; LEARNINGS carries the correction.)

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
**And ALWAYS HAND HIM THE LINK** (Chad's rule, v5.23: "always give me the
latest sheet link"). A sheet he cannot find is a sheet he cannot edit, and
he works from his phone where a bare version number is useless — so every
time a new sheet is published, the full
`https://docs.google.com/spreadsheets/d/<id>/edit` URL goes in the reply
that reports the release, not just "sheet v26". If a session ends without
publishing a new one, give him the current one's link anyway when the text
comes up.
Since v5.14 the sheet carries the VOICE LINES too, made from
`src/voicelines.js` — every spoken take, who says it, where it plays, its
words and its measured length — and **every sheet version must carry
them** (Chad's rule). They are a second tab in the .xlsx the tool exports
and a labelled block under the text on the Google Sheet (made from the
CSV; the connector cannot carry the workbook). `import` reads either shape and names every voice line whose text changed,
which is the list of takes to regenerate. A new line in a chapter is not
done until it has a row there — `chaptertest` says so.

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
- **v4.1** CHAPTER 3 · The Gathering — a seventh-month tentage in the car
  park under the same block at ten in the morning, forty-eight red chairs, an
  altar, a tang-ki in trance, a crowd of thirty, and one of them facing the
  wrong way. Twenty-three new sounds and a third speaker. Two engine seams:
  the ninth leak (a cutscene may duck the chapter's loops) and the tenth (a
  chapter declares its own daylight). Also `leaktest` now builds EVERY
  registered chapter, which is how a chapter that throws in `build()` stops
  being invisible to all twenty-two harnesses.
- **v4.2** the sound stopped being one download that grew with the game:
  the pack is split per chapter (computed, not declared) and there is a
  second, smaller Opus encoding made from the surviving ElevenLabs masters,
  chosen by decode-testing a 179-byte probe rather than by guessing. Chapter
  1's sound: 6830 KB -> 3864 KB, and chapter 4 will add nothing to it.
- **v4.3** THE GATHERING REVISED — the ghost left chapter 3 (Chad's call:
  "the focus is on the medium event"), surviving only as the opening film's
  one image: her, far out on the tarmac, in full sun, not coming in. All
  four scenes recentred on the medium; a constant tang-ki ceremony bed plus
  13 more new sounds; the eleventh leak (`ghost: null` — a chapter with no
  haunting); daylight now reaches the VIEWMODEL (the hands were exposed for
  midnight in a bright chapter); a chapter can declare a sun and clouds;
  `voiceLine` may name a pack sound; two more blocks and fourteen rain
  trees fill the skyline. docs/V4.3-CH3-REVISION.md is the build's memory.
- **v4.4 / v4.5** chapter 3's sound: the ceremony became THE music (the
  twelfth leak — `musicVol`, because the engine's explore bed was chapter
  1's and buried it), overlapping narration re-timed against measured take
  durations, then four crowd rows with walkable lanes, horns, cymbals, an
  audience, and three lines re-said in Chad's own words.
- **v4.6** THE DOORWAY PASS — the three things Chad found by playing:
  chapter 2's door swung the WRONG WAY in both scenes that touch it (the
  sign was never written down, so both guessed, and the mother arrived by
  closing the door in your face); there was no corridor to leave into, and
  scene C turned away from the room to watch a blank wall; and every
  chapter's opening FILM played its first seconds in full view before its
  own fade-in snapped the screen black and showed them again. Now: a named
  swing contract (`DOOR_AJAR` / `DOOR_OPEN`), a real corridor with the
  mother's door, a switch, a calendar and the living room round the corner,
  a MOTHER who opens the door, comes in, says her line and shuts it behind
  her, and `playCineFn(fn, done, startFade)` so a film begins on the black
  the caller already raised. Chapter 3's prayer clasp also sits 3 cm lower
  with half the tremble, which is what it takes to keep the thumbs out of
  frame at both ends of the shake. docs/V4-CHAPTER2-PLAN.md carries the
  beat sheets.
- **v4.7** REAL MODELS — Chad's five Sketchfab uploads, shrunk from 31 MB
  to 4 with gltf-transform and placed exactly where he said: the rigged
  woman IS the ch2 mother (same `mother` group contract, idle clip cut past
  its bind-pose lead-in, grounded and sized from POSED BONES — the arms
  rig's lesson striking twice); the plastic chair is every seat in ch3 (a
  fourth InstancedMesh behind the same `placeChair`); the low-poly cars
  replace the boxes; the Guan Gong scan stands on a plinth where the paper
  effigy stood; and the seated audience is the sitting encik BAKED to one
  static geometry and shared by ~25 tinted, half-mirrored meshes. All five
  credited in the credits panel; the sheet is GAME TEXT v9 for the new
  rows. Everything loads async over invisible primitive fallbacks, so a
  failed download costs a nicer prop, never the chapter.
  docs/V4.7-MODELS.md is the build's memory, traps included.
- **v4.8** THE LIVING CROWD — Chad's second play-through list. The chairs
  face the altar (settled by arithmetic on the file's vertices, not by
  eyeballing renders) and the bake centres on the seat pan; the encik
  audience ANIMATES — four offstage skeletons run the file's idle and
  every sitter's mesh points at one, `bindMode 'detached'` because
  'attached' cancels a skinned mesh's node transform and stacked all
  thirty into one giant (LEARNINGS); the tang-ki is Chad's praying-man
  model with his clip preserved and rate-tied to `drumBeat`; a chinese
  boy stands in the crowd and a seated shrine figure (769k tris → 27k)
  sits beside Guan Gong; the mother TALKS through her one line
  (head-bone nods — the file ships only a standing idle, no walk/talk
  clips); resume no longer flashes the previous chapter (place before
  the card); the ch2 door/photo frames stop flickering (trim clear of
  the wall's cut planes); vrelief was TRANSCRIBED, found to say "Just
  keep walking. Don't look back", and remade as the wordless exhale it
  was designed to be; the door sound is a real domestic door; standers
  6 → 4 and the 'half the block' line retired with them. CHCTX gained
  `cloneSkinned` — the only engine seam this cost. Sheet v10.
  docs/V4.8-NOTES.md is the build's memory.
- **v4.9** CHAPTER 4 · BACK HOME — the evening after the tentage: dusk
  through the window of the family flat, a dining table, a 90s house
  phone, and the haunting HOME with him (her territory is the radius
  round the dining chair; the spawn stands just outside it). An opening
  film (keys, the dark flat, the lights, the block outside); scene A's
  flashbacks as three black-box memory dioramas forty metres off (the
  void deck burner, the bedroom fan, ONE red chair in noon white);
  scene B's 3 a.m. wake with her silhouette in the kitchen doorway;
  scene C's provocation (TV static, the phone ringing by itself, then
  everything stopping at once — the handset found OFF THE HOOK); scene
  D's call to Ma on the old phone, her voice phone-EQ'd through the
  handset, and the promise that loads chapter 5: the tang-ki comes to
  the house tomorrow. 41 new sounds (19 SFX + 19 James + 3 Ma —
  Matilda again, because Ma IS ch2's mother); NO hell note anywhere in
  the chapter — the tang-ki finds it in chapter 5. Cost in engine
  seams: ZERO, as planned. Sheet v11.
  docs/V4.9-CHAPTER4-PLAN.md is the build's memory.
- **v4.91** BACK HOME REVISED — Chad's playthrough notes, all five. The
  flashbacks are now VISUAL RECALL: each memory set rebuilt to its own
  chapter's recipe (ch1's drum + ash + oranges + joss + drifted notes;
  ch2's full bed, amber louvres and turning fan; ch3's ROW of real red
  chairs with one facing the wrong way). The haunting became UNSEEN:
  `ghost: null`, no `strings` anywhere, her silhouette cut from scene B —
  presence is footsteps (ch2's slippers), a dipping light, a dragged
  chair (ch3's), a tried door, both in the scenes and via a poltergeist
  clock in play (the THIRTEENTH leak: CHCTX gains `worldSfx`, a chapter's
  world may make a noise outside a cutscene). Hands hidden in scenes
  A/B/C; scene D keeps them and parents the HANDSET INTO THE HAND while
  he speaks. The overlap root-cause: play narration survived into
  cutscenes — playCineFn now stops it (base-game-safe), and scene D's
  phone gaps widened to real turn-taking. v4A–D regenerated as James'
  terse first-person reflections ("It was never random. It followed me
  home.") matching vA–vD / v2 / v3 convention — the old ones read the
  cards aloud.
- **v5.0** CHAPTER 5 · THE LESSON — the morning after: the tang-ki from
  the tentage comes to the flat, reads it room by room, and pulls the
  hell note from under the chair the player thought in — his first
  spoken words in five chapters land on the note held up in the morning
  light, and the title card lands on that image. Ma is home; the flat is
  ch4's set in full sun (morning daylight declaration, lit corridors,
  the altar lamp at ember). Four scenes: the sit-down teaching across
  the table, the fear replay that drains the morning and releases it
  mid-line, the dismissal the flat answers with a lunging curtain and a
  stopped fan, and THE BURNING — the note returned to the fire at the
  home altar, one bell, the flat exhaling, the episode's last lesson
  delivered to camera. Ends the first episode: the five chapters run
  DISTANCE → SMALLNESS → INVERSION → INTRUSION → RELEASE. A fourth
  speaker (the tang-ki, Bill) joins the cast; 28 new sounds; cost in
  engine seams: ZERO. Two laws this build wrote into LEARNINGS: a model
  facing needs `faceFrom(...) + Math.PI` (faceFrom aims cameras), and a
  cast member's stand must clear the furniture footprints. Sheet v12.
  docs/V5.0-CHAPTER5-PLAN.md is the build's memory.
- **v5.01** THE HEAD BONE — `/Head$/` never matched a Mixamo skeleton
  (glTF sanitizes `mixamorig:Head_06` to `mixamorigHead_06`), so from
  v4.8 to v5.0 ch2's mother "talked" without moving and ch3's and ch5's
  tang-ki never bowed — three chapters, no error, nothing on screen. The
  regex now lives once as `CHCTX.HEAD_RE`, beside FINGER_RE's precedent.
  Verified by MEASURING the bone, not by looking at it (LEARNINGS).
- **v5.02** THE MOTHER WALKS — Chad's four Mixamo takes (start walking,
  stop walking, standing idle, talking), retargeted onto her skeleton
  OFFLINE and merged into one 224 KB `motheranim.glb` with four clips.
  Every model in this game had shipped a POSE and slid; she is the first
  with real movement. ch2 scene B now walks her in on real legs, settles
  her, gives her the talking take on her line, and backs her out on
  `walkstop` at rate **-1** — a walk settling to a halt, reversed, is a
  backwards walk, which Mixamo has no take for. ch5's Ma walks her
  withdrawal and her step to the altar, and talks her thank-you.
  Two traps, both measured not guessed: three.js binds tracks BY NAME so
  `mixamorig:Hips` had to become her `mixamorigHips_01` (the same
  silent-failure family as v5.01), and her grounding was calibrated to the
  model's own idle, which rides ~0.8 m above bind — reusing it buried her
  to the neck at -0.79 m, so both chapters RE-GROUND after the swap. The
  procedural head-nod survives as the fallback when the clips do not load.
  Mixamo credited in the panel; sheet v13. docs/V5.02-MOTHER-ANIM.md.
- **v5.03** SOLID FURNITURE, AND A LOOK — Chad found both. The table, sofa
  and chairs of ch4 and ch5 were walk-through, and not because they were
  missing from `blockers()`: `collide()` samples ONE point, at y = 1.0, and
  a tabletop's padded box tops out at 0.98. Furniture blockers are now
  COLUMNS (`solid()`, floor to 1.40, 0.14 pad against a wall's 0.20) and a
  chair is boxed whole, not by its seat slab. Cutscene paths obey no
  collision at all, so all five ch5 timelines were audited against the
  boxes: scene D walked the tang-ki through the table for seven seconds,
  and routing him round it only put him in a chair — the dining set is
  ringed by four. So the NOTE moved to his end instead and the walk is
  gone. Which surfaced the older bug underneath: the note sat at
  `TABLE.top + 0.004`, and TABLE.top is the slab's CENTRE of 45 mm, so
  since v5.0 it lay 19 mm INSIDE the wood — the chapter's premise object,
  never once visible. And the cast LOOKS AT THE PLAYER now: head yaw and
  pitch clamped to a neck's range, eased, laid on after the mixer, on in
  play and opt-in per scene (a film cuts to cameras that are not a person —
  this one's goes under the table). ch2's mother also stops on `walkstop`
  before she speaks rather than snapping from mid-stride to a stand.
- **v5.04** THE LOOK, CORRECTED, AND HER LINE GIVEN BACK — two of Chad's
  notes, both measured. Her chin pointed at the player because two errors
  compounded: the Mixamo head BONE sits ~11 cm below the eyes, so aiming it
  at a 1.62 m camera asks for far more lift than a look needs, and the clips
  carry their own chin-up (-0.16 rad) which an ADDITIVE offset piled onto
  rather than replaced — total -0.247. Now the aim starts at eye level and
  pitch is driven to an ABSOLUTE target (yaw stays additive; the clips
  barely turn the head), with a small downward bias, because a face angled
  a few degrees down reads as attention and one angled up reads as disdain.
  Measured -0.247 -> +0.03.
  And "why is she not using the talking animation" had a real answer: she
  was, for 0.7 s. v4.6 started her backing out at 11.6, one second into a
  five-second line — harmless when the walk was a fake glide and no clip
  existed, wasteful once a real talking take did, since the walk clip takes
  the body back. Scene B's whole tail shifts ~3.8 s later: she stands and
  finishes the sentence, THEN goes. All four takes now read.
- **v5.05** TWO IN THE CROWD WHO ARE NOT ENCIK — Chad's note that the
  tentage audience reads as "too many repetitive ones", which it did:
  since v4.7 every sitter has been one scan cloned nineteen times, tinted
  and half of them mirrored, and no tint makes a face. Two of his Mixamo
  characters take two seats — one clapping along, one sitting through it —
  each with its own skeleton, mixer and clip, frozen and thawed with the
  crowd by `crowdLife`. Shrunk 47/54 MB of FBX to 917/1040 KB by DROPPING
  every map the CSP-safe `rescueTextures()` cannot restore (it only ever
  rescues base colour, so a normal map is pure download), the body sheet to
  512 JPEG, the alpha-carrying hair sheet to 256 PNG, and meshopt at 0.28.
  The seats are chosen against the scatter, not by eye: both occupied,
  both even so they survive `LOW`, both aisle-side in the middle rows where
  the lanes run. The encik loader skips them and leaves their primitive
  placeholder standing until the real bytes land, in whichever order the
  three loaders arrive. One trap, and it generalises: the crowd's crown
  measure is a loose `/Head/i`, which on a Mixamo rig also catches
  `HeadTop_End` — measured with the technically-correct `HEAD_RE` these two
  normalised to the NECK and stood a head over everyone (1.577 → 1.348).
  **When a new thing is placed among existing things, the measure that
  matters is the one the existing things used.** Cost in engine seams:
  zero. Sheet v14. docs/V5.05-CROWD.md is the build's memory.
- **v5.06** THE TANG-KI, REMADE — Chad's rigged Taoist master (white
  beard, ochre robe, scroll and signboard, ~1000 triangles) replaces the
  praying man in chapters 3 and 5. It arrived with its textures beside it
  and NO clips, so it got both: the sheets reattached with alpha MASK (the
  beard is a cutout card) and `tangkianim.glb`, Chad's Standing Idle and
  Talking retargeted onto its skeleton by the v5.02 bake. Measured, the
  idle swings 11° and the talk 99° — so ch3's medium runs the TALK take
  under the drum and ch5's listener runs the idle at full rate (the old
  0.5× was for the praying loop). Every scene verb drives the group, so no
  timeline moved. Engine seams: zero. docs/V5.06-TANGKI.md.
- **v5.07** THE TANG-KI MOVES — Chad's five Mixamo takes for the old man
  (idle, magic attack, catwalk turn, walk in place, grab torch) baked onto
  his rig beside the two from v5.06, pinned in place, and staged: ch3 rests
  on the idle and casts the two-handed magic take in scenes A/B/C; ch5
  walks him on real feet on every glide, turns him on the catwalk take at
  every real turnaround (a 38° corner is WALKED — a half-turn take on a
  corner spins him past and back), and remade the burning to Chad's spec:
  the note vanishes from the table at his lean, he walks to the altar,
  reaches with the torch take, the fire takes with the crackle that
  `noteburn` always was, and no paper is shown burning. His height was
  2.09 m (the rig's top bone is the head JOINT; v5.06 scaled that to a
  crown) and is 1.87 to the hairpin now. The film's floating note is IN
  HIS HAND: it rides the right hand bone, and the hand is put where the
  shot wants it by FREEZING the magic take one fifth in — `tangPlay`'s
  `at` argument; a take parked on one frame is a pose library. Two laws
  from the measuring: on this box a clip's end pose is FORCED via
  `action.time`, never waited for (dt is clamped to 0.05 s); and a fade of
  0 must be a hard cut that bakes the pose, because a mixer whose rate is
  `drumBeat` never advances at 0. Credit moved to Chad's Sketchfab old
  man; sheet v15. docs/V5.07-TANGKI-MOVES.md is the build's memory.
- **v5.08** THE HOME ALTARS, AND MASTER ZAV IN THE ROUND — Chad's
  Vietnamese altar (Sketchfab) stands in the flat (ch4/ch5) as both tiers,
  cabinet and shrine, and hangs in the bedroom (ch2) as the shrine alone;
  which mesh is which tier is MEASURED (the lower centre is the cabinet),
  the offerings are re-seated on surfaces read from the model's own box,
  and the cabinet's box joins the blockers by reference. And the equipment
  screen is Chad's Guild Wars screen: Master Zav's own model (990k tris to
  40k) turns in a second renderer's canvas in the middle of the panel, the
  five worn boxes flank him (his right hand on the viewer's left), and the
  v3.1 drag/tap/double-tap/keyboard model is untouched. Traps in LEARNINGS:
  aspect-ratio in a flex column is not a definite height; a shelf tier's
  board is where its own cups are, not where its box starts. Sheet v16.
  docs/V5.08-ALTAR-AND-DOLL.md is the build's memory.
- **v5.09** THE EQUIPMENT PASS — Chad's notes on the new screen. The
  "crack lines" on Master Zav were not aliasing (it was already on) and
  not the simplifier (the 990k original had them): they are PAINTED in the
  scan's atlas — hundreds of small islands over a cream fill, each rim a
  few texels of lighter blur, drawn from both sides of every seam on the
  face and hair. Fixed offline in three passes over the atlas using the
  full-res mesh's UVs (`tools/prepzav.mjs`): strip only the rim texels
  lighter than the island's own interior (a blanket erosion ate thin
  islands and put white patches on the hair), pad, then feather across
  each seam pair ONLY where the two sides differ by an exposure step (a
  hairline is a content edge and must stay one). Faint tonal steps
  remain — that is the scan's own lighting. The five boxes became FOUR
  (Divine Eyes, Amulet, Sak Yant, Hand — the Light box gone, one hand
  slot for beads or phone), 74 px with the name UNDER the box; the figure
  cell is deliberately narrow (176 px) because at a fixed vertical lens
  the canvas WIDTH is what put air between him and the boxes; the bag is
  two rows of five; old saves fold two hands and a three-row bag into the
  new shape with nothing lost (statetest). Polish: the room environment
  on the figure, a jade pool and a counter-turning ring under his feet, a
  one-shot flash on the box an item lands in. Sheet v17.
  docs/V5.09-EQUIPMENT-PASS.md is the build's memory.
- **v5.10** MASTER ZAV AT FULL DETAIL — Chad's call after seeing v5.09:
  "why dont u use the model file that i originally sent you". Because its
  Draco decoder is a worker built from a blob: URL, which the strict CSP
  forbids; uncompressed, the same geometry is 22.6 MB. The way through is
  meshopt + quantization (a plain WebAssembly decoder, permitted by
  'unsafe-eval', verified on the strict build): full 990k triangles is
  7.3 MB, the 30 % cut 2.5 MB, the 15 % cut 1.4 MB — and the 30 % cut, which
  ships, is indistinguishable from the full one at the close-up he judged
  on. The figure is PREFETCHED: on the first entry into play, in idle
  time, the panel's renderer is created on its hidden canvas, the model
  parsed, and one 64 px frame rendered off-screen, so the panel opens with
  him already standing there. `zavLoader()` is the one GLTFLoader with the
  meshopt decoder. And the v5.09 seam retouching is RETIRED: its refill
  drew a black streak beside the eyebrow, its repaint a brown "birth
  mark", both spotted by Chad and neither in the original. The shipped
  texture touches no painted pixel — only the empty fill between the
  atlas's islands is padded, which removes the cream bleed at the seams
  and can change nothing else. docs/V5.10-ZAV-FULL.md.
- **v5.11** THE WHITE STREAKS IN HIS HAIR — Chad, from his phone: "it may
  look fine in your preview but not when im in the game". He was right:
  every seam render was a 900 px close-up, which MAGNIFIES the texture,
  while the panel on a phone MINIFIES it and samples its mipmaps — and the
  scan's atlas packs black hair patches edge to edge against cream robe
  patches, so every shrunken copy averages the two into a white streak
  along every hair seam. Reproduced the first time it was rendered at the
  panel's real size. Fix: no mipmaps for this one texture (`zavNoMip`, on
  both the normal path and the CSP rescue, which gained an `onMap`
  callback); the model file is byte-identical to v5.10, which is the
  strongest possible "without affecting the face". Also: spin 0.006 →
  0.0085, and he turns again the moment you let go (eased over twenty
  frames) instead of after four seconds. And a correction recorded in the
  doc: v5.10's paint was not "untouched" — 1.1 % of painted texels carry
  the v5.09 seam treatment. docs/V5.11-HAIR-AND-SPIN.md.
- **v5.12** THE PAUSE MENU AND THE CHAPTER SELECTOR — Chad's ask. A gear
  button sits between the mute button and the inventory button (which
  moved down to make room); M or a tap opens a pause menu — Return to the
  game, Select a chapter, Back to the title screen — in a fourth screen
  state, `menu`, that every "is it play?" gate already closes. The
  CHAPTER SELECTOR is one panel reached from a Chapters button on the
  title and from the menu: a chapter is OPEN once REACHED, recorded on
  its own key (`mz.encounters.progress`) separate from the run's save, so
  a new game or a replay never locks a later chapter again; picking one
  asks when there is a run to lose, then replays it from its opening film
  through the same `setChapter` → `restart` → `enterWorld` the sealed
  card's Continue uses. Back to the title saves the position first, so
  Continue returns to the spot. A 23rd harness, `menutest`. Sheet v18.
  docs/V5.12-MENU-AND-CHAPTERS.md.
- **v5.13** THE FILM WAITS FOR ITS SOUNDS — Chad: a chapter replayed from
  the selector opened on a silent film. A cue is sample-only and a sample
  that has not decoded plays nothing; from the selector (and on Continue
  into a chapter sealed-into but never entered) the chapter's pack is
  fetched moments before the film, so every cue fired into the gap. Now
  `enterWorld()`'s film path waits for the pack, then the intro's decodes
  (`whenDecoded`, capped), then the models. Measured with a cue log
  (`__enc.stings()`), which `menutest` now reads: the replayed film must
  hear every cue. Also found by reading the new paths: no menu during a
  faint (it would have saved the zero sanity), every loop down on the way
  to the title (the room tone followed you out), the opening-line timer
  cleared, the panic red cleared, a `?ch=` preview unlocks nothing, the
  volume slider hides under the panels. docs/V5.13-THE-FILM-WAITS.md.
- **v5.14** EVERY VOICE LINE WRITTEN DOWN — Chad's ask, on the way to
  re-voicing the boy: a sheet tab of every spoken line, every speaker, so
  he can review and change them. Until now the words of a take lived in
  whichever plan doc built it, eight lines were written down nowhere, and
  three "wordless" takes (`vgasp`, `vscoff`, `vpant`) turned out to carry
  words nobody knew about — found the way `vrelief`'s were at v4.8, by
  TRANSCRIBING the shipped take. Every take in the game was transcribed
  and the registry says what is HEARD, not what was asked for. Now
  `src/voicelines.js` is the one registry — speaker, chapter, moment,
  text, measured length — NOT shipped (build.py never globs it), read by
  `textsync` and `chaptertest`. The voice lines joined the sheet: as a
  second tab, VOICE LINES, in the .xlsx `export file.xlsx` writes (a
  hand-built minimal workbook, 20 KB), and as a labelled block under the
  text on the Google Sheet itself — which is made from the CSV, because
  the Drive connector takes a workbook only as base64 inside a tool call
  and even 27 KB of it is past what a session can read and re-emit
  faithfully; the CSV route is the proven one. `import` reads CSV, xlsx
  or the connector's markdown (the TEXT column found from each header
  row, not assumed) and REPORTS which voice lines changed — that list is
  the regeneration list. `chaptertest` fails if a take has no row or a row has
  no take. Sheet v19, the first with two tabs. **Every sheet from here on
  carries the voice lines** (Chad's rule). No engine change; the shipped
  bytes differ from v5.13 only by the version under Credits.
  docs/V5.14-VOICE-LINES.md.
- **v5.15** THE BOY — the main character re-voiced as a boy (VALF, Chad's
  pick from three rounds of candidates; "aaron is the closest, but still
  not quite there") and Chad's first full editing pass over the sheet:
  every one of his v19 changes applied — UI words (Equipped, Bag, the
  selector's hint, the credits footer), chapter choices, outcomes and
  teachings (ch2 and ch3's `core` lost their Pali line by his choice),
  and 24 voice lines. All 82 of the boy's takes regenerated, plus the
  changed lines of Ma, the auntie and the tang-ki: 86 masters, each
  peak-matched to the file it replaced (the v4.8 rule), both encodings,
  every `secs` in the registry re-measured. Timing was checked by a
  STATIC SCAN (cue + measured length vs the next cue and the scene end)
  rather than by ear: no new collision; ch3 scene B's tail +0.4 s and
  ch5 scene C's answer +1.0 s were the only moves. Two bugs found on
  the way: `textsync import` had skipped the selector's `chapters.*`
  strings since v5.12 (a `ch` prefix mistaken for a chapter's), and
  `vrelief` failed three times as a tags-only prompt before the v4.8
  recipe in LEARNINGS was re-read — the lesson was already written down.
  Built in five checkpoints against context loss (`masters/v5.15/` holds
  the progress record and the scripts). Sheet v20.
  docs/V5.15-THE-BOY.md is the build's memory.
- **v5.17** THE BEDROOM — Chad's five Sketchfab pieces (bed, wardrobe,
  study table, chair, curtain) replace every box in chapter 2, 11.7 MB
  shrunk to 852 KB. Three needed more than shrinking: the study table's
  materials are `KHR_materials_pbrSpecularGlossiness`, which three.js
  REMOVED from GLTFLoader — it renders flat white and says nothing, so
  `metalRough()` converts it back into colours; the curtain was five
  megabytes of 1,953 triangles because its cloth was baked as 200 MORPH
  TARGETS with a 200x200 weight matrix (deleted — it swings from a rail
  point instead, because a quantized mesh's positions are integers no
  per-frame float can be written into); and the BED IS SCALED BY WIDTH,
  never length, because its left edge is one wall of the gap that is the
  whole chapter. Two things moved and both were forced: the lying camera
  came down to 0.60 (his bed is low — pillow measured at 0.52, so 0.72
  floated a hand's width over it), and the desk grew to his 1.40 x 0.91 and
  shifted left and back to take it. Scene D's mattress still dips: the
  primitive mattress and blanket stay as INVISIBLE PROXIES the scene
  drives, and the model sinks by their delta. `leaktest` was a coin toss
  before this build and is fixed here — it settled only the baseline, so
  the same fifteen-geometry step read as +1.88 or -1.88 at random.
  Sheet v22. docs/V5.17-BEDROOM.md is the build's memory.
- **v5.18** THE RIVER — the boy re-voiced again, and this time the reason
  is a property of the model rather than a taste: eleven_v3 re-rolls a
  voice's character per take, and VALF's range was wide enough to land on
  a girl in one line and a grown man in the next ("horrible and
  inconsistent" — Chad). **River Faith** (`v6KgbPaQh6lAmMpmmtcH`) is
  narrower and stays put. All 79 of his takes across five chapters
  regenerated, peak-matched, both encodings, `secs` re-measured; the
  regeneration list is `who === 'james'` out of the registry, which is the
  same list `chaptertest` checks the shipped files against, so "everywhere,
  leave nothing behind" is enforced rather than promised. **Not one word
  changed** — sheet v23 is identical to v22 in every TEXT cell. River is
  faster (331.5 s -> 273.3 s over 79 takes), so nothing could newly
  collide; the only two moves were the wordless exhale `vrelief`, which
  went the OTHER way (+1.05 s) and now starts earlier in ch1 scene C
  (4.60 -> 3.15) and ch2 scene B (20.0 -> 18.9). Engine seams: zero.
  docs/V5.18-THE-RIVER.md.
- **v5.19** THE TANG-KI MOVES IN THE CUTSCENES TOO — Chad, playing: "why
  is the tangki animation always frozen in the cutscenes". "Always" was
  literal: from the FIRST frame of every chapter-3 cutscene he stopped
  dead, and so did thirty other people. `updateNotes`'s
  `if (getState() === 'cine') return;` is correct — a cutscene must own the
  ambient POSE writes — but every mixer added since v4.8 had been written
  BELOW it, so a guard meant to own the poses silently owned the CLOCKS.
  The mixers move above the return; only the poses stay under it. Under
  that sat a second bug the first was hiding: the mixer's rate was
  `drumBeat`, the RITUAL's tempo, which scenes drive to 0 — so his idle
  froze at every "everything stops" beat and the magic take ran at 3.4x and
  stuck. A named take now plays at its own speed and only the idle follows
  the ritual, floored at 0.45 because a man at rest still breathes;
  `stage.medRate` is the only honest way for a scene to say "he does not
  move". Measured, not eyeballed — a hand BONE's world position across a
  scene: 1 distinct position before, 18 of 22 after. Also: an AUDIT of all
  five takes Chad specified (his catwalk turn, walk-in-place and grab-torch
  in chapter 5 were already right; the ch3 idle and magic attack were the
  two that were not), and `.github/workflows/deploy.yml`, which deploys
  through the Netlify CLI's digest dedup instead of re-zipping the whole
  50 MB site — manual-trigger only, so deploys stay deliberate. Chapter 3's
  four women are deferred to docs/V5.20-THE-WOMEN.md.
  docs/V5.19-TANGKI-IN-CUTSCENES.md.
- **v5.20** THE WOMEN OF CHAPTER 3 — the tentage crowd stops being thirty
  copies of one man plus two. Three of Chad's four arrive: his kana talk
  woman becomes the AUNTIE at the paper table (she is the only one of the
  four with a talking take authored against her own rest pose, and the
  auntie has four spoken lines), gracy_lee sits in the audience on the
  aisle, and the fearful woman STANDS at her back-row seat, turned, looking
  behind her — two seats from the chair that already faces the car park,
  which is the chapter said twice without a word. 145 MB of source down to
  2.5 MB shipped. `tools/prepwoman.mjs` makes the v5.05 crowd recipe
  reusable and adds the step that mattered most: **drop the clip library**
  — fearful_woman's eleven takes were 2742 KB against 258 KB of geometry
  and 74 KB of texture. `tools/retarget.mjs` does REAL cross-rig
  retargeting in world space (source delta from its own rest, applied to
  the target's rest, back to local under the parent's already-retargeted
  world rotation, parents first) because two rigs can pose a body
  identically and still hold their bones at different rest orientations —
  v5.02's rename only worked because the mother's rig WAS Mixamo. It is
  proven on gracy_lee and needed nowhere else, which is the lesson: **reach
  for a character's OWN clips first**; a bought take was authored against
  its own rest pose and beats anything retargeted onto it. Chad found that
  one ("why not make fearful woman stand at her seat using one of her
  animations"). **yinn is unusable as delivered** — all 108 of her bones
  sit at the same point and her mesh is a body lying flattened; the
  untouched file from Drive renders identically. DROPPED at v5.23 (Chad:
  "forget yinn and kungfu man, drop them") — not a pending re-export, a
  closed item. Sheet v24. docs/V5.20-THE-WOMEN.md is the build's memory.
- **v5.21** THE CROWD, SHUFFLED — Chad's play-through of v5.20, all five
  notes, and the honest reason they existed: v5.20 was verified from a wide
  shot. gracy's Valve rig has no crown bone, so the crowd's loose `/Head/`
  stopped at her head JOINT and scaled her up until her face filled the
  frame; a rig with no crown bone is now measured from its POSED SKIN
  (`getVertexPosition` — the pose, not a bind box). The fearful woman
  leaves the chairs for the brazier, taking `standers[2]` exactly as the
  standing man took [1]; the fourth stander is gone; the drummer is hidden
  (his rhythm loop, drum swing, handle and collider all kept). kana idles on
  frame 0 of her one take and talks only while scene C says `auntTalk`.
  And the seated audience is THREE KINDS dealt a third each from a fixed
  seed — 6 encik, 6 sitclap, 6 sitangry — through one `seatKind()` that is
  v4.8's shared-skeleton trick with two corrections it always needed: the
  source mesh's matrix folded into the clone's bindMatrix (identity was
  only right for the encik's file — WRONG, undone at v5.22), and EVERY
  skinned mesh cloned, not the first — the first render of this build was
  a tent of floating heads, after every number had passed.
  docs/V5.21-THE-CROWD-SHUFFLED.md.
- **v5.24** THE SOFA, AND THE CURTAINS — three of Chad's asks, two rooms.
  His Sketchfab SOFA replaces the boxes in the living room of chapters 4
  AND 5 (3.40 MB -> 331 KB): it needed no fitting numbers, because scaled
  uniformly to the primitive's 1.9 m length the file comes out 0.93 deep
  and 0.90 high against the boxes' 0.85 and 0.92, and the same quarter
  turn that puts its length on the group's local x puts its BACK where
  sofaBack was. The primitive stays hidden in the group because
  `sofaBase` is what `blockers()` boxes. The LIVING-ROOM CURTAINS are
  gone from both chapters, and the whole `billow` seam with them (nothing
  else drove it) — which costs both scene Cs their cloth moment; ch4's
  boom still lands, and ch5's camera is ON the window there, so the room's
  dim is what answers in frame now. And the ch2 BEDROOM curtain stopped
  slicing the window: its folds reach 4.9 cm behind its own rail, which at
  a rail of 0.10 put its back face inside the grille bars (0.039-0.061),
  and its swing — positive rotation.x drives the hem AT the window, times
  a `noteStorm` that scene A takes to 6 — threw it 30 cm through the glass.
  The rail moved to 0.21 and the BACKWARD lean alone is clamped at 0.045,
  above the 0.035 the swing reaches by itself, so play is untouched and a
  storm holds 2.9 cm off the bars. docs/V5.24-SOFA-AND-CURTAINS.md.
- **v5.25** THE NOTE ON THE TABLE — Chad's two notes, one idea under
  both: the memory and the reveal should show the REAL thing. Chapter 4's
  flashbacks are visual recall, and two of the three still held what those
  chapters had before their art arrived — the five drifted notes in the
  void-deck memory were the canvas-drawn placeholder v3.8 replaced, and the
  bedroom memory was five boxes while chapter 2 has had Chad's bed since
  v5.17. Both now load the real asset over the primitive (colour x1.75 +
  emissive map on the note, chapter 1's own brightening; the bed scaled by
  WIDTH to ch2's 0.95, never by length, because its left edge is one wall
  of the GAP). And chapter 5's find is no longer a man trying to hold a
  note up: he stands, carries it the 0.37 m to the table, SETS IT DOWN with
  a new `noteset` sound, and the film hard-cuts to the wood. Where it lands
  is not a new number — it is `NOTE_HOME`, the spot play already keeps the
  note in, so the film ends with it exactly where the chapter begins with
  it. Where he STANDS to reach it is measured against the v5.03 collision
  columns (0.11 m clear of the thinking chair) because cutscene paths obey
  no collision. `aimNoteInHand` — v5.07's solver for aiming a plane in a
  bone's frame at the lens — is deleted with the shot it existed for.
  One probing law worth keeping: **`__enc.cine.seek()` PAUSES the film**,
  so seeking past a cue never fires it; `resume()` after the seek is what
  proves a sound plays. Sheet v28 — one description cell, no spoken word
  moved, and verified cell-by-cell against Drive rather than only by an
  import. docs/V5.25-THE-NOTE-ON-THE-TABLE.md.
- **v5.27** THE DUCK — Chad, on v5.26: "he is still soft, especially when
  there are multiple sounds at the same time, he gets buried, this starts
  even in chapter 1". v5.26 fixed a LEVEL problem and this is a MASKING
  one — his own words name it. Measured against his post-bus -16 dBFS:
  `firedie` lands at -11.6 (LOUDER than the narrator), `strings` at -17.4
  (1.4 dB under him), and the three loudest firing together sum to -10.1,
  putting him 5.9 dB UNDERNEATH the mix. Speech wants 10-15 dB of margin.
  He could not come up — `vscare1` already peaks at -0.28 dBFS — so the mix
  comes down: every non-voice source (music, loops, sfx, the procedural
  fallback) now passes through one `bgGain` that dips to 0.40 (-8 dB) while
  ANYONE speaks, fast down (120 ms) and slow up (450 ms). The trigger is a
  Set of live sources, because `stop()` fires `ended` too, and `'ended'` is
  a LISTENER — `.onended` is already taken by every caller and clobbering it
  would wedge the narration floor shut. Two consequences: the v5.26 bus had
  to leave `packGain` (a bus that ducks itself does nothing), so voices run
  to their own `voiceOut` and `packMuteSync` gained it — without that a muted
  game still talks; and `voiceOut` carries the WHOLE cast, since ducking for
  him alone would newly bury the other three. One cue volume moved:
  `firedie` 0.5 -> 0.18, a measured outlier whose file is 9 dB hotter than
  anything else in the pack. Margins after: `strings` +9.4, `firedie` +12.5,
  all three at once +6.3. `__enc.duck()` exposes the node and `dbgduck.mjs`
  reads it across a real line, because a gain node wired wrong sounds exactly
  like one wired right until somebody speaks.
  docs/V5.27-THE-DUCK.md is the build's memory.
- **v5.26** HIS VOICE — Chad kept River ("lets stick to river for now")
  but found him "way too soft". The takes MEASURE fine: -20.8 dBFS mean
  against the cast's -19.6. What explains the ear is the CREST — peaks to
  -1.9 dB, a 19 dB gap — because every take is PEAK-matched (the v4.8
  rule), and peak-matching says nothing about the average; River is a soft,
  breathy read. Against chapter 2's fan bed (-24.3) he had 3.5 dB of margin.
  So a uniform lift could never fix it: the loudest take leaves 1.9 dB
  before it clips. A dynamics problem wants a dynamics tool — his lines now
  ride a BUS (gain 2.0 -> DynamicsCompressor, threshold -18/ratio 4) that
  hangs BEFORE `packGain`, so mute, the volume slider and the cutscene
  ducking keep working untouched. Five call sites moved to `outFor(name)`:
  `snd` (every cutscene line), `say`, `speak` (the card lines), `scaredGasp`
  and chapter 1's opening line, which was on `sfxGain` outside the pack
  entirely. Measured through the REAL compressor in an OfflineAudioContext
  across four configurations: +4.8 dB average, nothing clips, and the
  quietest lines gain most (the 3 a.m. whisper +7.7, the loudest take
  +0.0) — it evens him out rather than turning him up. `JAMES_TAKES` names
  all 79 samples because a prefix rule CANNOT work (the mother's `v2ma` and
  the auntie's `v3aunt1` are also `v*`), and `chaptertest` asserts the set
  equals `who === 'james'` in both directions. Not one audio byte changed;
  the other three speakers are deliberately left flat.
  docs/V5.26-HIS-VOICE.md is the build's memory.
- **v5.29** THE CROWD REDEALT, THE GRANNY, AND THE BOY IN THE PANEL —
  Chad's four Meshy models (CC0) and one instruction that is really a
  constraint problem: *"maximum visual diversity. Mathematically."* The
  seated audience goes from three kinds to SIX, and the arrangement is
  SOLVED rather than shuffled — a balanced deal (every kind guaranteed a
  seat, which is the "represented at least once, don't accidentally remove
  any" half), a seeded shuffle, then a local search over a distance-weighted
  neighbour graph (any two seats within 2.30 m, weighted 1/d) that swaps a
  pair only when it lowers the same-kind cost. Measured on the shipped
  build: **0 same-kind neighbour pairs out of 39** at FULL and 0 of 9 at
  `LOW` — the optimum, not an improvement on it. `stage.seatStats()` reports
  it so the claim stays checkable. `scold` REPLACES kana at the brazier and
  is the right casting where kana never was: her one clip is literally
  `Stand_Talking_Angry` and the line is a shout at a boy who has gone
  somewhere he should not have — so `v3aunt5` was re-voiced with her, moving
  from the auntie to a new `granny` speaker (Lexi, `TiKM6Oo9KZhmYBsTBA2s`),
  3.32 s -> 3.16 s, which incidentally cleared the one standing overlap flag
  in chapter 3. And the equipment panel shows YOUNG Master Zav for the whole
  of episode 1 — the contract above, Chad's "remember it well". All four
  models credited to Meshy AI (CC0). Sheet v30.
  docs/V5.29-THE-CROWD-REDEALT.md is the build's memory.
- **v5.28** AARON — Chad, after two rounds of level work on River: *"i'm still
  not satisfied with this voice."* All 79 of the boy's takes regenerated in a
  THIRD voice (Aaron, `B6uUx2p7cRgxseOUyP6P`), under an approved prompt sheet
  that survived four rounds of his correction: the registry's words exactly, no
  added capitals, at most one added ellipsis, and a tag that names an EMOTION
  rather than only a volume ("whispering is not an emotion") — because a tag
  that says how LOUD gets a flat read at that volume, which is half of what
  makes a pass sound monotone. 26 of the 79 carry a tag, and that every tag was
  ABSORBED rather than spoken is measured: a spoken direction leaves a pause
  before the line, and none of the 26 has one (transcription cannot answer
  this — `creative_transcribe_audio` echoes the prompt). "Leave nothing behind"
  is enforced by construction, not promised: the regeneration list is
  `who === 'james'` out of the registry, which is the same set `chaptertest`
  checks `JAMES_TAKES` and the shipped files against, both directions.
  No word changed and no timeline moved — the overlap scan of all 24 films and
  scenes finds no new collision, and its one flag is the auntie's, from before.
  The engine cost is one node: Aaron reads **3.7 dB quieter than River with a
  3.2 dB wider crest**, so the v5.26 bus left him 1.87 dB under the voice Chad
  already called too soft, and more gain alone clipped his loudest takes. His
  bus gained a LIMITER (threshold -3, knee 0, ratio 20, 1 ms / 50 ms) after the
  compressor, with `VOICE_BOOST` 2.0 -> 3.5 — measured through the real node,
  that is +1.31 dB against River with nothing clipping, and the quietest lines
  gain most. Nothing outside his bus moved. docs/V5.28-AARON.md.
- **v5.23** THE GRANNY IS CHAD'S — her credit row removed (the panel lists
  other people's work, and she is his own), and yinn and the kungfu man
  DROPPED rather than deferred, with the asks withdrawn from every doc
  that carried them. Sheet v26.
- **v5.22** THE TENT, PUT RIGHT — Chad's play-through of v5.21: "a tangled
  mangled texture mess floating in the sky", every sitter sunk into the
  floor, the encik gone. Measured from the shipped build before anything
  moved: the six encik seats rendered 22–58 m up — v5.21's bind-matrix
  "correction" was WRONG (identity is right for EVERY file, because the
  bones' world matrices already carry the node chain; on the encik's
  0.018-scaled Sketchfab root it multiplied every bone translation by 55)
  — and the twelve Mixamo sitters rendered a metre under the tarmac (the
  measure walked down from the first skin's first bone, the SPINE on a
  multi-skin file: no feet, no hips). Both fixed. gracy and the fearful
  woman DELETED at his ask ("unfixable"); kana moved to the burner, facing
  the fire, idle on frame 0, talking through scene B's shout (the camera
  is on the brazier when it plays); his GRANNY is the auntie, with two
  takes of her own — idle and talking as two clips crossfaded, each take's
  root measured so the fade does not walk her through the table; the
  auntie faces the TABLE (a sign error since v4.1 that a featureless
  primitive hid); the prep tool learned that a dropped emissive map leaves
  a white lamp. The probe now measures what RENDERS — a skin box per seat
  against its chair, a ceiling on every skinned part — and photographs
  the sky. The granny's credit row has no source yet (Chad to supply).
  Sheet v25. docs/V5.22-THE-TENT-PUT-RIGHT.md is the build's memory.
- **v5.16** THE MAN AT THE TENT EDGE — Chad's Sketchfab standing man takes
  the RIGHT-edge stander in chapter 3, mirroring the chinese boy on the
  left: the two ends of the back of the tent, where the lane brings you
  closest to a face. 10 MB to 910 KB by v5.05's recipe plus one new step
  worth knowing — **KHR_mesh_quantization is the one compression this game
  gets for free**, handled inside three.js's own GLTFLoader with no
  decoder and no blob (unlike meshopt, which only `zavLoader()` carries);
  it took a third off with no visible change, and for a skinned mesh the
  dequantization scale rides the INVERSE BIND MATRICES, not the node.
  Sized from posed bones to the primitive he replaces (crown 1.732 ->
  1.750) and grounded to the tarmac. Standers 2 and 3 are the brazier
  pair and 3 is the one `LOW` drops, which is why he took 1. Chad's
  second model, a Fab kungfu man, is NOT in: its FBX references an
  external `kungfu_man_v2_texture256.png` it never embeds, and carries no
  clip. DROPPED at v5.23 (Chad's call) — do not ask for the PNG again.
  docs/V5.16-STANDING-MAN.md is the build's memory.
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
23 harnesses — which are what actually *enforce* the standard. A
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

**Chapters 2 and 3 are built** (v4.0, v4.1) — THE PRESENCE and THE
GATHERING, from the trial game's own episode 1. Every choice, ranking and
teaching is Master Z's verbatim; only the delta magnitudes are rescaled
from the trial's ±12 to this game's ±30, by the same factor in both, so one
rank formula serves all three chapters. `docs/V4-CHAPTER2-PLAN.md` and
`docs/V4.1-CHAPTER3-PLAN.md` are those builds' memory — read the right one
before touching either chapter.

**The three chapters escalate on one axis, deliberately.** Chapter 1's
terror is DISTANCE (she is over there, and then she is closer). Chapter 2's
is SMALLNESS (a room you cross in four steps, and nowhere in it to go).
Chapter 3's, since v4.3, is INVERSION: the chapter has NO haunting at all
(`ghost: null` — Chad's call). The focus is the medium event itself — a man
at the altar who has stopped being himself, a constant ceremony, one empty
chair turned to face the car park — and she appears exactly once, in the
opening film, standing far out on the open tarmac in full sun, facing the
tent, NOT COMING IN. The thing that has hunted the player for two chapters
is afraid of this place; the player spends the chapter inside the one
ground she cannot follow them onto, knowing home is on the other side of
her. That is chapter 4 loaded by a single shot. No ghost sound is cued
anywhere in the chapter — not even `strings`, which is, in practice, her
leitmotif. A change that blunts one of those axes is a change to the
chapter's whole reason for existing.

**Chapter 4 is built** (v4.9, revised v4.91) — BACK HOME, from the
trial's episode 1: she followed him home, and the flat with its
lights on is not the refuge the word "home" promises. Since v4.91 the
intrusion is NEVER SEEN (Chad's call): no ghost mesh, no `strings`,
only the flat misbehaving — footsteps, a dipped light, a moved chair —
on a poltergeist clock. The chapter closes on Ma's phone promise — the
tang-ki comes to the house tomorrow.

**Chapter 5 is built** (v5.0) — THE LESSON, and with it the trial's
EPISODE 1 IS COMPLETE. The five chapters escalate DISTANCE → SMALLNESS →
INVERSION → INTRUSION → RELEASE: the tang-ki keeps Ma's promise, finds
the note under the thinking chair, teaches at the table, and returns
what was kept to the fire. The haunting is answered, not fought — the
fifth chapter has no scare that is not the player's own memory replayed
and released. `nextChapterKey()` past ch5 is null, so sealing it ends
the run exactly as it always ended a last chapter.

Next up: **episode 2** (a new location from the case files — the trial
game has fourteen more episodes' worth of material), and the
still-outstanding job of replacing chapter 1's placeholder choices with
the real "THE OFFERINGS" data in
`docs/source/trial-game-chapters.md`.

The sound download is **done** (v4.2, above): split per chapter so it no
longer grows with the game, and re-encoded from the masters. The ghost mesh
is now the biggest single download by a wide margin and the only compression
job left outstanding.

`docs/LEARNINGS.md` is the catalog of every hard-won lesson (CSP traps,
audio traps, cutscene staging, test flakiness). When something in this
repo looks weird, it is probably load-bearing — check there first.

`docs/AUDIT-2026-09.md` is the standing AUDIT — Chad asked for a deep
pass over all five chapters, the engine and the phone-vs-desktop framing
question, to be saved and revisited. NOTHING in it is fixed. It holds
four confirmed bugs (ch3's medium never moves his head in three
cutscenes; ch4's fan keeps spinning through its own silent beat; the
volume slider skips a cutscene; a light dip can stick dimmed), the
fragile-but-not-broken list, and the viewport answer. **Read Part One
before touching cutscene framing**: the camera's 72° is VERTICAL and
fixed, so a portrait phone is a CENTRE CROP at a third of the width — and
that helps as often as it hurts, which is why a global lens change is the
wrong fix and is argued against there in full.

One more that earns its place at the bottom of this file because it now has
TWO notches in it: **a bought rig is sized and grounded from its POSED
BONES, never from any bounding box, and never from the file's own units.**
The arms rig (v3.8) and the mother (v4.7) both arrived through FBX at the
wrong scale with a bind pose standing somewhere their animation does not.
