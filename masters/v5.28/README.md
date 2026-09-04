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
