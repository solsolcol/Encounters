# v5.30 — thirteen takes re-said: chapter 3 slower and with feeling, and two of chapter 4's

Chad: *"All of chapter 3 intro's and some cutscenes voicelines are talking too
fast and with little emotion, i think you can add more '...' in those
voicelines to slightly slow it down at least. Or manually reduce the speed of
his voicelines to 0.9x speed."* And: *"['Start from the beginning'] should
have '...' at the back to sound more brooding. The 'same block, same me....'
line should sound more afraid."*

**Voice:** Aaron — `B6uUx2p7cRgxseOUyP6P`, `eleven_v3` (unchanged since v5.28).

## Why these thirteen

Measured, not picked by ear: words per second over every one of his 79
takes. The game's median is 2.3 w/s. Chapter 3's opening film starts at
**3.97** (`v3wake1`, the fastest line in the game), and `v3seen` (3.58) and
`v3C` (3.47) are the fastest lines in its scenes. Every one of the thirteen
was also UNTAGGED at v5.28 — the pass that tagged 26 of 79 left chapter 3's
film with no emotion direction at all, and an untagged eleven_v3 read is a
brisk, level one. So: all six film lines, the four scene lines, the one fast
card line, and Chad's two from chapter 4.

## The prompts (`lines.json`)

The v5.28 rules hold — the registry's words exactly, no added capitals, a
tag that names an EMOTION — with one rule relaxed on Chad's instruction:
more than one ellipsis where the line wants to slow. The ellipses are in the
PROMPT only; the registry text is unchanged for twelve of the thirteen. The
one text change is `v4sit`: "Start from the beginning." -> "Start from the
beginning..." (sheet v31 carries it).

## The fallback if a take is still fast

Offline `atempo=0.9` (pitch-preserving) on the encode, per Chad's second
option — never a playback-rate change in the engine, which would drop a
boy's voice two semitones.

## Resuming

`progress.json` holds every take's state and session; `lines.json` the
ids, texts and prompts. Regenerate only what is still `todo`.

## Outcome (as shipped)

All thirteen done in one flow (`QQFMBc7vo8htSK1i8X53`); `v3left` was re-taken
once — the first read came out FASTER than the original (3.29 w/s against
2.77) and a stronger direction fixed it. The `atempo` fallback was not
needed. Peak-matched to the take each replaced, both encodings, `secs`
re-measured into `src/voicelines.js`; words per second before → after:

| take | words | length | rate |
|---|---|---|---|
| v3wake1 | 11 | 2.77 → 5.33 s | 3.97 → 2.06 |
| v3wake2 | 12 | 4.28 → 5.15 s | 2.80 → 2.33 |
| v3wake3 | 6 | 2.93 → 4.21 s | 2.05 → 1.43 |
| v3chair | 9 | 3.71 → 4.75 s | 2.43 → 1.89 |
| v3out1 | 5 | 2.59 → 2.93 s | 1.93 → 1.71 |
| v3out2 | 4 | 2.27 → 2.85 s | 1.76 → 1.40 |
| v3seen | 13 | 3.63 → 6.11 s | 3.58 → 2.13 |
| v3grip | 13 | 4.60 → 5.72 s | 2.83 → 2.27 |
| v3ask | 4 | 1.41 → 2.12 s | 2.84 → 1.89 |
| v3left | 15 | 5.41 → 6.92 s | 2.77 → 2.17 |
| v3C | 9 | 2.59 → 3.87 s | 3.47 → 2.33 |
| v4sit | 4 | 1.07 → 1.49 s | 3.74 → 2.68 |
| v4thinkA3 | 13 | 6.11 → 9.09 s | 2.13 → 1.43 |

`noteflight.mp3` beside them is not a voice: the sound-effects take for
chapter 5 scene C's flying note (6.5 s; `noteflight-1s.mp3` is the first
attempt, which came back at the node's default one second and is kept as
the record of why `duration_seconds` must be set).
