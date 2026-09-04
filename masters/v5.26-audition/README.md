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

## eleven_v4 is NOT available on this account (tested, 4 Sep 2026)

Chad's pick from the options was "try the newer model first" — cheap, and if
v4 held a child voice steady where v3 re-rolls it, the whole problem went
away. It does not work: **all eight takes failed with "Your account is not
authorized to access this model."**

That is an entitlement, not a bug and not a prompt problem. `eleven_v4` is
listed by `creative_get_flow_node_types` as a model this workspace can run,
so the only way to discover the block is to spend a generation on it — which
cost about 4 cents in credits. **Do not retry v4 until Chad confirms his
ElevenLabs plan has been upgraded to include it.** If it is ever enabled, the
test to run is the one that failed here: VALF and Teddy Twinkle (the two
genuine child voices) on the opening line and the whispered 3 a.m. line, two
takes each — the question is whether v4 holds a child steady across takes.

## Why no "proper child voice" exists, and this is the important part

Chad: "isnt there a proper young male child voice?" Searched the library
this round on `boy`, `child`, `teen`, `young male teenage boy`,
`teenager shy nervous timid soft-spoken male`, and
`Singaporean Singapore Malaysian young male English`.

Every English male "child" voice in the library is one of two things:

1. **A cartoon.** Teddy Twinkle ("cute cartoon boy"), VALF ("playful,
   sarcastic... cartoon sidekicks"), Amit ("kids cartoon character"). Built
   for children's animation. Wrong register for horror at any quality.
2. **An adult performing a child.** One is literally named *"Adult-made
   child-like character Riya"*.

There is no natural, non-cartoon boy speaking English in the library, and
the reason is structural rather than bad luck: **a voice library is built
from adult contributors who can consent to their own voice being cloned and
sold.** Children generally cannot, so real children's voices are not
crowd-sourced assets. Every "child" voice on the shelf is an adult doing a
kid — which is exactly why they all sound like cartoons, and why round six
of the same search will return the same thing.

**Searching harder is not the answer. The routes that remain are:**

- **Age the character up** to 14–16 and use a natural young voice (Aaron).
  Free, works today, and the writing survives — see below.
- **Record a real boy.** The only route that gets the right age AND a
  Singaporean accent, which no library voice will ever give. Needs a kid and
  a parent's consent; a phone in a quiet room is enough to work from.
- **Voice-changer.** This workspace has a `voice-changer` node
  (`eleven_multilingual_sts_v2`) that keeps a real performance's timing and
  emotion and swaps the timbre. It cannot conjure a child out of nothing,
  but it fixes the flat generated feel, which may be part of the complaint.
- **eleven_v4**, if and when the account is authorised for it.

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

## Round 5 — Riya, Teddy Twinkle, Amit (Chad's pick, 4 Sep 2026)

Chad asked to hear the three I had dismissed from their descriptions
rather than take my word for it. Fair — a description is not a listen.

| voice | id | notes |
|---|---|---|
| Riya | `4RloeZf2FRvGiu4uoKOf` | Hindi-language voice; Indian accent |
| Teddy Twinkle | `XjGYkUkzth8BPs29fmcV` | English; the most overtly "cartoon" of the three by description |
| Amit | `NbvR1eY6Q8ivACdEO8PV` | Hindi-language voice; Indian accent |

Two lines each, two takes each (12 files), on `eleven_v3`, flow
`b6hTf3IJetFxUl0t0zCy`. The lines are the two most diagnostic in the
game — if a voice survives both it survives the part:

- **`voice`** — "Almost midnight... and this is the only way home."
  (calm, level, the boy before anything happens)
- **`v4wake3am`** — "[whispering] ...the clock. Why can't I hear the clock?"
  (whispered, frightened, the register that broke every previous candidate)

All 12 generated clean — `has_failures: false` on every one, no re-runs
needed. Sent to Chad. **Decision still open; nothing in the game changed.**
`SPEAKERS.james.voice` remains River Faith (`v6KgbPaQh6lAmMpmmtcH`).

On the accent: for a Singapore-set game an Indian-accented boy is not a
defect — it is a plausible boy in that block. It is a character decision,
which is Chad's, not a technical disqualification.
