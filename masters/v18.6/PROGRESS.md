# v18.6 · Brian, the grown man's voice in episode 3

Chad, 6 Oct 2026, after the audition (audition/): "Go with brian, make sure
everything using player voiceline in episode 3 chapter 1 and 2 is replaced by
this new adult voice. Be very careful and detailed."

Voice: Brian Nguyen, `bP8FJDHmWVEgXJDitdQd` (young Asian American, deep,
relaxed), eleven_v3. Replaces Louis (`rOVKXrU0YcQMzmTNwaDq`).

## The set (proven complete)
All 44 `who: "jamesAdult"` rows in src/voicelines.js — 22 in e3c1 (z1*), 22 in
e3c2 (z2*). Checked: the chapters cue no boy/recruit line (scripted scan of
both files against the registry); the engine's boy lines (vlow, vfaint,
vlost) are gated off by `boyVoiced()` since v18.5; the scared gasps fire only
on her appearance and both chapters declare `ghost: null`. ADULT_TAKES in
main.js names the same 44 (chaptertest asserts it both ways).

## Recipe (same as v16.0/v18.0's `him()`)
Prompt = the registry's words exactly, tags included. Two takes per line.
Pick: clean edges first, no spoken tag (pauses.py), then the tighter read.
High-pass 70 Hz, mono, peak -6.85 mp3 / -6.6 ogg (64k opus). Re-measure secs
into the registry and each chapter's SECS table; static overlap scan of every
cue in the two films and eight scenes; re-time only where a take now collides.

## Checkpoints
- [x] CP1 generate 44 x 2 (sessions.json)
- [x] CP2 fetch, measure, pick (make.sh)
- [x] CP3 encode, install, registry voice + secs, chapter SECS
- [x] CP4 overlap scan, re-time
- [x] CP5 build, listen-check (levels vs Louis), deploy, harnesses, sheet v87, docs, commit

## Record
- CP1: 88 takes, flow 0Ph5Iz76DE1GsN1wvxVM, sessions.json; no failures.
- CP2: picks in make.sh; fetch.py letter bug fixed (z2C1, z2arrive refetched).
- CP3: assets/audio + audio-opus z1*/z2* re-encoded; registry voice id + 44 secs; e3c1/e3c2 SECS.
- CP4: overlap.mjs — 7 new collisions found, re-timed, 0 after. Level -1.0 dB vs Louis avg; no change.
- CP5: build 18.6, chaptertest clean, deploy 6ac4a480ba0c06c0c02c2862 (203 site files byte-identical),
  sheet v87 (42 length cells only).
- harnesses: chapter + cine, text, csp, hosted, menu, walk — 6/6 in 877 s.
