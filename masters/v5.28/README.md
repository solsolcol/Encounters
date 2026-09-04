# v5.28 — the boy re-voiced as AARON

Chad: *"i'm still not satisfied with this voice. lets completely change all
of the main character's voicelines ... to Aaron. It must cover everything
and leave nothing behind. do it cleanly."*

**Voice:** Aaron — `B6uUx2p7cRgxseOUyP6P`, "Aaron - Conversational American
Male", model `eleven_v3`.
**Flow:** https://elevenlabs.io/app/flows/1ok1A4liUyO4SLIS8vRy

## The succession, now four deep

| | voice | id |
|---|---|---|
| v2.3 – v5.14 | James — Husky, Engaging and Bold | `EkK5I93UQWFDigLMpZcX` |
| v5.15 – v5.17 | VALF | `loY1uopAz31XyhAEhNSa` |
| v5.18 – v5.27 | River Faith | `v6KgbPaQh6lAmMpmmtcH` |
| **v5.28 –** | **Aaron** | `B6uUx2p7cRgxseOUyP6P` |

## What "leave nothing behind" is enforced by

The regeneration list is not a list anybody typed: it is
`LINES.filter(l => l.who === 'james')` out of `src/voicelines.js` — **79
takes**. That is the same set `chaptertest` checks the shipped files
against, and the same set `JAMES_TAKES` in main.js must equal in both
directions (v5.26). So "everywhere, nothing left behind" is enforced by the
build rather than promised in a commit message.

## Resuming after a context loss

`progress.json` holds every take's state (`todo` / `downloaded`) and the
flow id. `lines.json` holds the 79 ids and their exact text. A new session
reads those two files, regenerates only what is still `todo`, and nothing
is done twice.

## Traps re-learned here, before they cost anything

- **`vrelief` is a tags-only prompt** — `[a quiet, shaken exhale — no
  words]`. LEARNINGS says eleven_v3 fails those EVERY time (six consecutive
  failures at v4.8, not the usual one-in-three). Generated with the v4.8
  recipe instead: the tags given voiceable breath text to shape
  (`Hoohh... hahh...`). It succeeded first try.
- **eleven_v3 given a direction with no text invents words for it** (v5.14).
  So every wordless/tagged take here must be TRANSCRIBED after generation
  and checked against what the registry says is heard — `vgasp`, `vscoff`,
  `vpant`, `vrelief`. That is a CP2 step, not optional.
- eleven_v3 fails about one line in three at random: check `has_failures`,
  re-run with the text **unchanged**, never rewrite a line that failed.

## Pace

Aaron is faster than River, measurably. The opening line `voice`:
River 4.60 s -> Aaron 3.16 s. Shorter takes cannot newly collide with the
cue after them, but they can open gaps a beat was written to fill, so CP3
re-scans every timeline rather than assuming the change is safe.

## PAUSED at 22/79 — Chad heard Aaron and stopped it

*"why is aaron so monotonous, this is worse than river"* — mid-run, after
chapter 2 finished. Generation stopped there; no further credits spent.

**Nothing shipped changed.** Not one file in `assets/audio/` or
`assets/audio-opus/` was replaced. The only tracked change is
`SPEAKERS.james.voice` in the registry, which is not shipped and has no
runtime effect. The live game is still River, still v5.27. Reverting is
one line.

### Measured, because "monotonous" can be checked

Within-take variation (spread of per-50 ms RMS across the voiced parts —
how much the delivery MOVES) over the 17 lines both voices have recorded:

| | mean spread |
|---|---|
| Aaron | 7.69 dB |
| River | 8.07 dB |

Aaron is flatter on 11 of 17 lines, by **0.38 dB** on average. That is a
real effect but a small one — it does not by itself explain "worse than
River". The monotony Chad hears is mostly in PITCH and inflection, which
this measure does not capture and his ear does. Recorded honestly rather
than claimed as vindication.

### The directed test (Chad's pick from four options)

Every one of the 22 takes was generated from BARE TEXT with no performance
direction, and Aaron's own billing is "Conversational American Male" — an
undirected Aaron is exactly a flat conversational read. Four lines were
re-generated with direction written into the prompt (`masters/v5.28/directed/`):

| line | undirected | directed | River |
|---|---|---|---|
| opening | 6.11 | **6.10** | 7.84 |
| the shout | 9.00 | **11.02** | 9.78 |

**Direction rescues the shout and does nothing for the opening.** Where
there is an emotion to play, the tags work — the shout now moves more than
River's. Where the line is a boy thinking out loud, Aaron delivers it flat
whatever the prompt says, and a lot of this game is a boy thinking out loud.

**And direction inflates the takes badly**: the opening 3.16 s -> 8.80 s,
the breakdown 14.72 s. The model performs the stage directions as pauses
and breaths. Every directed take would need re-timing against its cutscene
and some would not fit their beat at all. Cost also triples, ~1c -> ~3c
per line.

### Where it stands

Awaiting Chad's ear on the four directed takes. If they read as a person,
redo all 79 directed and absorb the re-timing. If the opening still sounds
dead — and it measures dead — it is Aaron's register, not the direction,
and he should be dropped.

## The directed test was WRONG, and Chad heard it (4 Sep)

*"this is better, but why is he saying the direction out loud?"*

Because he was. Transcribing the take rather than assuming:

> `[a teenage boy alone on a dark walkway at night, uneasy, talking himself
> into it, voice dropping on the second half] Almost midnight... [swallows]
> and this is the only way home.`

The model spoke the entire prompt, stage direction included. That is the
whole of the 8.8 s, not a performance choice.

`creative_get_model_guide` for eleven_v3 says it outright: **"There is no
scene description."** The prompt IS the spoken text. Only SHORT tags are
recognised (`[whispering]`, `[laughs softly]`); anything else in brackets
is read aloud. Emphasis is meant to come from CAPITALS and pacing from
punctuation (ellipses, em-dashes, commas).

**The conclusion drawn from that test is withdrawn.** "Direction rescues
the shout, 9.00 -> 11.02" was measuring the model reading my instructions
with varied intonation, not delivering the line better. The whole directed
comparison measured nothing about Aaron.

Redone with correct short tags (`E*` files beside the `D*` ones), and the
durations alone show the difference:

| line | prose tags (spoke them) | short tags |
|---|---|---|
| opening | 8.83 s | **3.32 s** |
| whisper | 7.47 s | **3.63 s** |
| shout | 5.15 s | **3.40 s** |
| breakdown | 14.75 s | **5.49 s** |

The re-timing problem this created disappears with the bug: the corrected
takes are close to the shipped River lengths, so most cues would not move
at all.

**Note the 22 undirected takes are NOT affected by this bug** — their tags
came from the registry (`[beat]`, `[panting]`, `[exhale]`), which is the
style River's shipped takes used. Their durations are all in the normal
range. They stand as a fair sample of undirected Aaron.

## Directing a line: what actually works (Chad's ellipsis idea)

*"why dont you sometimes use like '...' to get a more moody feeling"* — he
is right, and it is in the model guide I had already read: **"Ellipses
create longer thoughtful pauses. Em-dashes create short beats."** The first
directed pass used a tag and CAPITALS and no punctuation shaping at all,
which is the one lever that changes delivery without forcing anything.

Chad's other note, *"the chp 1 opening sounds weird"*, has a specific
cause: **I capitalised ONLY**. "and this is the ONLY way home" puts a hard
stress on a word the line was never written to stress — declamatory, not a
kid walking home. That was my addition, not the script's.

The six variants of the same line (`directed/F*`, `directed/G*`), words
identical to the registry throughout:

| file | length | prompt |
|---|---|---|
| `F0-plain` | 3.16 s | the bare registry text — what the 22-take run produced |
| `E1-opening` | 3.31 s | `[nervously]` + **ONLY** in caps — the "weird" one |
| `F1-nervous-nocaps` | 4.59 s | `[nervously]`, caps removed |
| `F2-quietly` | 4.08 s | `[quietly]`, caps removed |
| `G1-ellipsis` | 3.92 s | no tag, a second ellipsis before the admission |
| `G2-ellipsis-quiet` | 6.32 s | `[quietly]` + ellipses throughout |

**Punctuation is the safe lever and capitals are the dangerous one.**
An ellipsis buys a pause the actor fills; a capital forces an emphasis that
may be wrong for the sentence. Prefer ellipses and em-dashes; use capitals
only where the writing itself is emphatic.

Note the length spread: 3.16 s to 6.32 s for the same words. Whatever style
is chosen has to be applied consistently across all 79 or the cutscene
timings become unpredictable — this is a per-line authoring decision, not a
switch.
