# The boy, round 4 — Aaron re-auditioned, plus three new candidates

Chad, 4 Sep 2026:

> i want you to generate more aaron voicelines samples, im not satisfied
> with the current voice

The record of the round. **No pick made yet**, and nothing in the game
has changed: `SPEAKERS.james.voice` is still River Faith.

ElevenLabs flow (all takes live here):
<https://elevenlabs.io/app/flows/b6hTf3IJetFxUl0t0zCy>

## Where we are

| round | voices heard | outcome |
|---|---|---|
| v5.14 | VALF, Teddy Twinkle, Toru, **Aaron** | Chad: "aaron is the closest, but still not quite there" |
| v5.15 | Johnny, River, Edison, Ahmed, Gabriel; then range tests | picked **VALF** |
| v5.18 | — | VALF rejected: "sometimes sounding like a girl", switched to **River Faith** |
| v5.26 | **Aaron across the full range** + Kryuu, Don Kim, Kuya Boy | pending |

## What was generated

The prompts are the shipped registry text **verbatim**, tags included —
the same recipe `masters/v5.18/progress.json` used, so these are directly
comparable with what is in the game today. Model `eleven_v3`, two takes of
each line so the per-take character re-roll (the thing that killed VALF)
is audible.

**Aaron** (`B6uUx2p7cRgxseOUyP6P`) — six lines, the full emotional range:

| file | game id | prompt |
|---|---|---|
| `aaron-1-opening` | `voice` | Almost midnight... and this is the only way home. |
| `aaron-2-thegap` | `v2gap` | I have slept beside that gap my whole life. Never has this happened. |
| `aaron-3-shout` | `v2call` | [shouting] MA! MA, COME HERE! PLEASE! |
| `aaron-4-whisper` | `v4wake3am` | [whispering] ...the clock. Why can't I hear the clock? |
| `aaron-5-breakdown` | `v4regret` | [whispering] okay... okay. stupid. stupid. stupid me... |
| `aaron-6-closing` | `v5learnD` | The first one. He says every case teaches you the next. |

**Three candidates never heard before**, screening on the opening line only:

| file | voice | id | why |
|---|---|---|---|
| `alt-kryuu` | Kryuu — Male Protagonist | `T7TOOaZZ6tdlmJhBoEjH` | calm, soft, melancholic young male; the only voice in the workspace described for a tragic-hero lead |
| `alt-donkim` | Don Kim | `UI9arZeSp7bIUhGbx36K` | young Korean-American, calm, slightly raspy — the closest thing to an Asian young male speaking English |
| `alt-kuyaboy` | Kuya Boy | `Z0J3eW5H8x7rllGL9dBS` | Filipino, twenty — the FIRST Southeast Asian young male voice found in any round |

All 18 takes generated first time; no `has_failures`. (eleven_v3 fails
about one take in three at random, so that was luck, not a property.)

## The thing worth deciding before the voice

`docs/V5.14-VOICE-LINES.md` said it plainly: **"Aaron is not twelve."** He
reads as a teenager or a young man, not a child. If Aaron is the pick, the
protagonist quietly becomes older — which the writing survives (the auntie's
"ah boy" and Ma's "go back to sleep, boy" both still work for a teenager in
Singapore, and chapter 1's midnight walk home is EASIER to believe), but it
is a character decision, not just a timbre one, and it should be made on
purpose rather than by accident.

**The workspace still has no Singaporean voice.** Searched again this round:
zero results. Kuya Boy is the nearest geography has got.

## If a voice is picked

The v5.18 route, unchanged and proven: change `SPEAKERS.james.voice` in
`src/voicelines.js` — ONE line — then regenerate every row where
`who === 'james'` (79 takes), peak-match each to the file it replaces,
encode both mp3 and Opus, re-measure every `secs`, and re-run the overlap
scan. `masters/v5.18/` holds the scripts that did it last time.

Note from the audit: two scenes finish their last line with **0.03 s and
0.08 s of headroom** (ch1 `scLeave`, ch2 `scCall` — both `vrelief`). A
slower voice than River truncates them. See `docs/AUDIT-2026-09.md` Part
Three.

The audition mp3s are not committed — they are throwaway until a pick is
made, and the flow above holds them.
