# v4 · Chapter 2 — THE PRESENCE. Live checkpoint doc.

**This file is the memory of this build.** It is written to survive a context
compaction: anyone (including a later me) should be able to read this file
alone and know what chapter 2 is, what is done, what is not, and what the
next action is. Update STATUS as work lands. Commit at every checkpoint.

Chad, 30 Aug 2026: *"i want to start building chapter 2 … it should start as
a cinematic cutscene right after chapter 1, after user click continue, they
go straight into this cutscene for chapter 2. after the cutscene finishes,
show the title chapter 2 with title, then fade out into a new playable scene.
build out the complete scene, characters, props, objects, environment,
interactable objects, the flow, story according to reference, the options,
the cutscenes for each and every option, the results, outcomes, score cards,
everything just like what we had in chapter 1. Complete with its own sfx,
music, voicelines, the complete works."*

---

## STATUS BOARD

| # | Phase | State |
|---|---|---|
| 0 | Map the engine seams a chapter must satisfy | done |
| 1 | This plan doc | live — keep updating |
| 2 | Chapter-advance flow: ch1 complete → ch2 opening cutscene → title → play | **done** |
| 3 | `src/chapters/ch2.js` — DATA block | **done** |
| 4 | `build(ctx)` — the bedroom world | **done** |
| 5 | The opening cinematic (`intro` scene) | **done** (silent until phase 7) |
| 6 | The four choice cutscenes | **done** (silent until phase 7) |
| 7 | Audio: generate, encode, wire | **done** |
| 8 | Strings + sheet re-export | not started |
| 9 | Tests (full suite), docs, release | not started |

---

## THE SOURCE (ground truth, not invention)

`docs/source/trial-game-chapters.md`, episode 1 chapter 2 · **THE PRESENCE**:

> Later at home, unexplained crying and an oppressive feeling begin. One
> night you sense something in the bedroom.

| | Choice | S | A | W | Teaching (Master Z's words — use verbatim) |
|---|---|--:|--:|--:|---|
| A | LOOK BEHIND THE BED | −7 | +9 | +1 | Awareness can reveal more, but investigation without preparation has a cost. |
| B | CALL FOR MOTHER | +5 | +4 | +9 | Seeking help is not weakness. Knowing your limits is part of wisdom. |
| C | LEAVE THE ROOM | −2 | +7 | +6 | Creating distance can reduce exposure even when it does not solve the cause. |
| D | STAY SILENT & STILL | −3 | +5 | +4 | Stillness may prevent escalation, but enduring fear indefinitely is not the same as solving the problem. |

Ranking by wisdom: **B best · C good · D bad · A worst**. Note the shape of
that: the bravest option is the worst one, which is the whole teaching.

**Delta scaling.** The trial scores on a ±12 scale; this game runs ch1 at
roughly ±30. Chapter 2 keeps the trial's SHAPE and RANKING and scales the
magnitude to match ch1, so one rank formula serves both. (The trial's own
model — only wisdom decides passing, sanity is a cost not a fail state —
remains a divergence to revisit with Chad; see CLAUDE.md.)

| | S | A | W |
|---|--:|--:|--:|
| A LOOK BEHIND THE BED | −25 | +25 | +5 |
| B CALL FOR MOTHER | +15 | +12 | +25 |
| C LEAVE THE ROOM | −8 | +20 | +18 |
| D STAY SILENT & STILL | −12 | +14 | +12 |

---

## THE CHAPTER, AS A PIECE OF FILM

**Where.** A bedroom in a Singapore HDB flat, late 80s. Small and dense —
one room, and you can cross it in four steps. That is deliberate: chapter 1
was a void deck you could run across, and the terror there was distance.
Here there is nowhere to run, and the terror is that the room is small.

**When.** Days after the void deck. The note came home, one way or another.

**What is in the room** (all built in code, as ch1 builds its deck):

- the **bed** against the left wall, and the **gap** between it and the wall
  — a black slot the streetlight never reaches. This is the interactable.
- a **ceiling fan**, turning slowly, ticking on every pass
- a **louvred window** with a security grille, sodium streetlight coming
  through it in slats across the floor and up the wall
- the **opposite block** seen through that window — `hdb.glb` again, a few
  windows still lit. Reused, not new: it costs nothing and it is the single
  most Singaporean thing in the shot.
- a **wardrobe**, tall and dark, doors not quite shut
- a **desk** with schoolbooks, a **chair**, a small **desk lamp** (off)
- the **door** to the hallway, ajar, a strip of hall dark beyond it
- a small **altar shelf** with a red electric candle — the family's, and the
  only warm light in the room
- **dust** in the streetlight, and a curtain that moves when nothing does

**Who.** James (the player, voiced). Mother (heard, never fully seen — a
silhouette in the doorway in scene B). Her — the same ghost the engine owns,
because she is the game's, not chapter 1's.

**The interactable** is the gap beside the bed. It marks and glows exactly
as ch1's pile does, through the same `stage.pile.*` handle — the engine's
one interactable seam, renamed in the fiction only.

---

## THE OPENING CINEMATIC

Chad's ask: chapter 1 ends → Continue → straight into a cinematic → the
chapter 2 title card → fade into play. This is a NEW capability: today a
chapter card is a static black card (`playChapterCard`), and there is no
cutscene-before-a-chapter path at all.

Design: a chapter may carry an **`intro` scene** — the same cutscene
language as the four choice scenes, run against the chapter's own world
before the chapter card. The engine gains one path: build the world, play
`intro` if present, show the card, then hand over to play. Chapter 1 has no
`intro`, so its flow is unchanged — which is the test that this did not
break anything.

Beats (~34 s):

| t | beat |
|---|---|
| 0.0 | black; a clock ticking; James: *"It followed me home."* |
| 2.5 | fade up on the **ceiling**, from the pillow. The fan turns. |
| 6.0 | the head rolls: the room at night, streetlight in slats |
| 10.0 | a woman **crying**, somewhere in the flat. Not outside. Not mother. |
| 14.0 | the camera finds the **door**, ajar, dark beyond |
| 18.0 | the crying **stops**. The fan slows. The altar candle dims. |
| 22.0 | James, whisper: *"…Ma?"* — no answer |
| 25.0 | something moves in the **gap beside the bed**. Not seen: heard. |
| 28.0 | James: *"There's someone in the room."* |
| 31.0 | fade to black under the last word |
| — | **CHAPTER 2 · THE PRESENCE** card, then fade into play |

---

## THE FOUR CUTSCENES

**A · LOOK BEHIND THE BED** (worst). You take the edge of the mattress and
lean over into the gap. The camera goes down with you. She is face-up in the
slot, eyes open, and she has been there the whole time. Boom, scream, black.

**B · CALL FOR MOTHER** (best). You shout for her. A long, awful pause with
nothing in it. Then a door in the hallway, slippers on terrazzo, and the
room floods with warm hall light as the door opens. The cold goes. Mother's
silhouette in the doorway. The gap is just a gap.

**C · LEAVE THE ROOM** (good). Out the far side of the bed, three steps to
the door, into the hallway. You turn back at the threshold. The bedroom is
dark and ordinary — and then the door swings quietly shut on its own.

**D · STAY SILENT & STILL** (bad). You lie back and fix on the fan. Time
passes: the slats of light crawl across the ceiling. The mattress **dips**
beside your head. Nothing resolves; the scene simply ends, which is the
point of it.

---

## AUDIO PLAN

Reuse first (already in the pack): `sobbing`, `whisper`, `breath`, `dread`,
`strings`, `boom`, `clang`, `heart`, `scream`, `gscream`, `swoosh`, `gsigh`,
`chime`, `step1-4`, `uicard`, `uiconfirm`, `uirank`, `ulost`, `endgood`,
`endbad`, `type`, `vscare1-4`, `vfaint`, `vlost`, `vlow`.

New for chapter 2 (names provisional; see the table in AUDIO-PLAN.md once
generated):

| name | what | where |
|---|---|---|
| `roomamb` | bedroom night tone: distant traffic, a fridge, a fan | loop, the whole chapter |
| `fan` | ceiling fan, slow tick on each pass | loop |
| `clock` | a wall clock ticking | loop, quiet |
| `doorcreak` | a bedroom door swinging on a dry hinge | intro, C |
| `hallsteps` | slippers on terrazzo, approaching | B |
| `bedcreak` | a mattress and frame taking weight | A, D |
| `vmaOff` | mother, off-screen: *"What is it? Go to sleep."* | B |
| `v2intro1` | James: *"It followed me home."* | intro |
| `v2intro2` | James, whisper: *"…Ma?"* | intro |
| `v2intro3` | James: *"There's someone in the room."* | intro |
| `v2A` / `v2B` / `v2C` / `v2D` | James, under each outcome card | the cards |

Contract (CLAUDE.md, unchanged): ElevenLabs, James =
`EkK5I93UQWFDigLMpZcX`, eleven_v3, stability 0; SFX =
`eleven_text_to_sound_v2` with an explicit `duration_seconds`; encode
`-map_metadata -1`, 44.1 kHz, 128 kbps, keep native channels, drop into
`assets/audio/` and build.py packs them. Mother needs a NEW voice — pick a
Singaporean/Asian mature female from `creative_list_voices` and record the
id here when chosen.

---

## RULES THIS BUILD MUST NOT BREAK

1. **Adding a chapter must not add a harness.** ch2 is validated by the
   existing `chaptertest` (data), `fixturetest` (engine is chapter-agnostic)
   and `leaktest` (dispose gives the GPU back). If ch2 needs a new harness,
   the design is wrong.
2. **v3.3 is the reference standard for the base game.** A ch2 change that
   reddens a base-game harness is a regression in ch1, not a test to relax.
3. **`dispose()` discipline is copied exactly from ch1** or leaktest fails.
4. **Mutate, never reassign** the chapter-derived values (`SHRINE`,
   `BOUNDS`, `GHOST_HOME`, `SPAWN`) — aliases exist.
5. **No ESM.** ch2.js is a plain script in one closure registering on
   `window.__CHAPTERS__`, like ch1 and chtest.
6. **Never hand-edit a string without re-exporting the sheet.**
7. Both builds stay green; `?ch=ch2` must boot chapter 2 directly, which is
   also how it gets tested without playing chapter 1 first.

---

## LOG

- **30 Aug 2026** — source read, design fixed, this doc written. Seam-mapping
  workflow `wf_445eee23-067` run to document the chapter contract before any
  code is written.


## HOW THE OPENING FILM WORKS (built, phase 2)

A chapter may carry `intro` — a scene function in exactly the same cutscene
language as its four choice scenes. `enterWorld(place, { intro: true })`
then runs, in order: black → the film → the chapter card → the night.
A chapter with no `intro` (ch1, chtest) takes the path it always took,
which is the test that this changed nothing.

The three entry points that pass `{ intro: true }`:

- `againBtn` on the complete card, when `nextChapterKey()` returns a chapter.
  It calls `restart()` first — the one piece of code that knows everything a
  fresh run must put back — and `enterWorld` takes it straight back out in
  the same tick, so no frame of play is ever drawn.
- `resumeRun()`, but ONLY when the save carries no position. A save written
  at a chapter boundary means the player finished the last chapter and never
  saw this one; a save with a position is a run in progress and drops
  straight back in. Sitting through an opening again to get back to where
  you were would be a punishment.
- `newGame()`, so a `?ch=ch2` deep link opens on the film too — which is
  also how the film gets tested without playing chapter 1 first.

Three supporting engine changes, all small:

- `c.keepFade` — a scene that hands over to something else still black says
  so, and `cineEnd()` leaves the black alone instead of dissolving it.
- `whenWorldReady(then, cap)` — extracted from the chapter card's own gate
  and now used by both. A card over an unloaded world is just a card; a FILM
  over one is a camera move through an empty room.
- `playChapterCard`'s `cover()` drops any leftover cutscene black once the
  card is opaque, or the card would fade out at the end and reveal the black
  instead of the night.


## THREE MORE CHAPTER-1 LEAKS FOUND AND FIXED (phase 4)

Placing a bedroom found three more places where the engine was really
chapter 1's engine. All three are fixed the same way: a chapter declares
it, and chapter 1's current value is the default, so nothing moves.

- **The ghost's whole territory** (phase 2b, its own commit).
- **`voiceLine`** — the line he says a few seconds into a chapter.
  "Almost midnight, and this is still the fastest way home" is about a void
  deck. A chapter names its own asset key; one that names none opens in
  silence, which is what chapter 2 does, because its film has just spoken
  three lines and a fourth would crowd them.
- **`lines` and `sayPrefix`** — the two proximity lines about the thing you
  can act on (chapter 1: "someone's been burning offerings"), and the prefix
  of the four spoken under the outcome cards (`vA`..`vD` for chapter 1,
  `v2A`..`v2D` for chapter 2).

## THE SOUNDS CHAPTER 2 STILL NEEDS (phase 7)

`chaptertest`'s cue check names them exactly, which is what it is for:

`bedcreak` · `clock` · `doorcreak` · `fan` · `hallsteps` · `heart` (exists
as a loop, needs a STING_SAMPLE row) · `v2call` · `v2ma` · `v2wake1` ·
`v2wake2` · `v2wake3`

Plus, not cues but needed: `v2near`, `v2gap` (the two proximity lines) and
`v2A`..`v2D` (under the outcome cards).


## THE SIXTEEN SOUNDS, AS BUILT (phase 7)

ElevenLabs flow `q7aeSWHTTHg8qW28OmlM`. James is `EkK5I93UQWFDigLMpZcX`;
**Mother is `XrExE9yKIg1WjnnlVkGX` (Matilda)** — the workspace has no
Singaporean or Asian female voice, and of what it has, a middle-aged alto
is the closest to a tired woman woken at two in the morning. She is
off-screen through a doorway, which forgives the accent.

| name | what | where |
|---|---|---|
| `clock` | a cheap wall clock, 4 s loop | a bed of the room; the silences |
| `fan` | the ceiling fan, 5 s loop | a bed of the room |
| `doorcreak` | a dry hinge | the intro, B, C |
| `hallsteps` | slippers on terrazzo, coming | B |
| `bedcreak` | a mattress taking weight | the intro, A, D |
| `v2wake1` | *"It followed me home."* | intro, over black |
| `v2wake2` | *"Ma? Ma, is that you?"* | intro, and nothing answers |
| `v2wake3` | *"There is someone in the room."* | intro, under the fade |
| `v2call` | *"MA! MA, COME HERE! PLEASE!"* | B |
| `v2ma` | Mother: *"Aiyah. What is it now? Go back to sleep, boy. I am here."* | B |
| `v2near` / `v2gap` | the two proximity lines about the gap | play |
| `v2A`–`v2D` | the four under the outcome cards | the cards |

**Two things worth remembering.** Five of eleven eleven_v3 lines FAILED on
the first run, and the pattern was length plus fussy punctuation — an
ellipsis mid-line, an inline `[exhale]`, a comma splice. Shortening each to
two plain sentences fixed all five. That is the same class of failure as
the em-dash note in LEARNINGS.

And the generator's output level is not to be trusted: `fan` came back at
−42 dB mean and `clock` at −45, against a pack that sits at −20 to −25.
They needed +18 and +12; `doorcreak` came back HOT at −9 and needed −8.
Measure with `volumedetect` against the existing pack, every time.

The pack is now 72 sounds and 7.3 MB. Worth a compression pass before
chapter 3, not before shipping this one.
