# v28.0 · episode 4 chapter 5 · THE VOICES (M10): the record

Every spoken line of the chapter but the fight's (its 50 rows are FIGHT-DRAFT: the fight is being redesigned after R14,
so they are voiced when its specification is written). The words are masters/v28.0/script/lines.json's, the one copy;
Grandmaster Pho's are docs/V28.0-PHO-LINES.md's, voiced as drafted (Chad, 21 Nov 2026, R14: "Just do it").

Made through ElevenLabs' own API with Chad's key (it lives only at /root/.config/elevenlabs/key: never in this public
repository, printed, or on a command line), eleven_v3, 128 kbps 44.1 kHz. Every call's characters are in spend.log.

## How to make it again (from the repo root)

    python3 -I masters/v28.0/voices/prompts.py           # lines.json + one tag a line -> prompts.json, copies.json
    python3 -I masters/v28.0/voices/api.py <key> <a|b|c> ...      # a take (a failed one re-run unchanged, v24.3)
    python3 -I masters/v28.0/voices/pick.py              # every take transcribed here (faster-whisper small.en) and measured; picks.json
    python3 -I masters/v28.0/voices/chain.py             # the picks levelled and encoded -> assets/audio, assets/audio-opus; CHAIN.txt
    python3 -I masters/v28.0/voices/registry.py          # words heard against the script; the copies; secs into lines.json; registry.json
    python3 -I masters/v28.0/assemble.py                 # the measured lengths into the chapter's SECS
    python3 -I masters/v28.0/voices/install.py           # ONLY when the engine is free: main.js and voicelines.js rows

## 1 · The voices

| speaker | registry | voice | how |
|---|---|---|---|
| Master Zavier (he) | `jamesAdult` | Brian, `bP8FJDHmWVEgXJDitdQd` | his since episode 3; his own bus (peak -6.85 / -6.6) |
| Grandmaster Pho | `pho` | Songkran, `xYmBpJREC3WfqEFpbPvO` | chapters 3 and 4; three takes, the unhurried read |
| Ton | `ton` | Kirin, `uI1epevl1X6hqrxEciKt` | chapter 3's (a declared reuse: the same man) |
| Jun | `jun5` | **Sam**, `c86brOBXdSSYxT5FqIUS` | NEW: the measured pick of six (below) |
| Mr Koh | `koh5` | **Mr David**, `76X7rrvQajZEHM3u9zcd` | NEW: the measured pick of three |
| the collector | `collector5` | **Shawn Ng**, `eWKcOFrcmRNtJMcUZYOm` | NEW: the measured pick of three |

None of the three new voices is heard anywhere else in the game (checked against every speaker in src/voicelines.js).

### 1.1 · The auditions (audition/: audition.json the candidates and lines, audition.py the measure, measures.json)

Each candidate said two of the part's own lines once, with the tag the line is voiced with. A session has no ears: the
measure SCREENS and Chad's ear DECIDES (v10.6). The measure: every word heard (all 27 takes: every word); words a second
over the voice; median pitch by YIN; the two lines' pitch apart (one person across takes, or two); the recording's
FLOOR (its quietest 100 ms against its speaking level: hiss or a room under the voice shows here, and a clean take is
50 dB and more under); its end (pick.py's own test: every take clean).

**Jun** (a Singaporean Chinese man of about 27, stocky, friendly, a little joking). The first three all came back with a
floor only 26 to 37 dB under the voice: a hiss under every word, where every other speaker's takes are 54 to 78 dB under.
None was clean, so three more were screened first on the library's own previews (their floors 53, 54 and 69 dB under)
and auditioned the same way.

| candidate | floor (two lines) | pitch | apart | pace (w/s) | |
|---|---|---|---|---|---|
| James - Playful (`aSXZu6bgEOS8MXVRzjPi`) | -35 / -35 dB | 103 / 163 Hz | 8.0 st | 2.36 / 1.45 | refused: hiss; two people across two lines |
| Jake (`BHyvQU4czkhWdOZH4Rdq`) | -26 / -30 | 113 / 113 | 0.0 | 2.86 / 1.28 | refused: the noisiest |
| Darryl Lim (`O8ykjWKd0RjX6e5EyDuE`) | -35 / -37 | 216 / 184 | 2.8 | 2.91 / 1.94 | refused: hiss; high for a stocky man |
| **Sam** (`c86brOBXdSSYxT5FqIUS`) | **-55 / -66** | 140 / 126 | 1.9 | 2.43 / 1.66 | **PICKED**: clean, steady, the game's pace, lively on the joke |
| Jack (`yJ83gnYhwi5mhFPAai2P`) | -29 / -34 | 116 / 115 | 0.1 | 2.23 / 1.18 | refused: hiss; flat (spread 1.1 st) |
| Cedric Xu (`43txzXEL1HzTzsHDGXpl`) | -54 / -67 | 100 / 138 | 5.6 | 2.39 / 1.26 | clean, but drifts 5.6 st between lines |

**Mr Koh** (about 56, heavy-set, tired, short-tempered from three weeks without sleep, frightened).

| candidate | floor | pitch | apart | pace | |
|---|---|---|---|---|---|
| Lazarus Liew (`yEgon8WYkQ5wZh49byZr`) | -76 / -75 | 250 / 155 | 8.2 st | 3.07 / 2.33 | clean, but his anxious line went up to 250 Hz: two people |
| Louis (`rOVKXrU0YcQMzmTNwaDq`) | -34 / -36 | 127 / 114 | 1.8 | 2.38 / 2.34 | refused: hiss |
| **Mr David** (`76X7rrvQajZEHM3u9zcd`) | **-78 / -68** | 161 / 134 | 3.2 | 3.02 / 2.95 | **PICKED**: clean, steadier than Lazarus, a plain man's read |

**The collector** (about 35, lean, tired; curious, not a fool; a small laugh at himself).

| candidate | floor | pitch | apart | pace | |
|---|---|---|---|---|---|
| Mun (`owsLoyJNU4K7ctU6NF7F`) | -67 / -70 | 115 / 180 | 7.7 st | 2.32 / 3.54 | clean, but two people, and the short line rushed |
| **Shawn Ng** (`eWKcOFrcmRNtJMcUZYOm`) | **-74 / -73** | 143 / 150 | **0.8** | 2.78 / 2.76 | **PICKED**: the cleanest and the steadiest |
| Ivan (`HDVDearvsECwhyI3Y21m`) | -36 / -33 | 135 / 162 | 3.3 | 2.32 / 3.15 | refused: hiss |

Said plainly: the three picks sit near one another in pitch (Sam 126-140 Hz, Mr David 134-161, Shawn 143-150): they are
three different voices, but not three registers. Mr Koh and Jun are heard in the same scene (at the door). If Chad's ear
wants Mr Koh lower and older, the library has no older Singaporean man (searched: "uncle", age "old", Hokkien): it would
be a designed voice, which the connector refused in chapter 4.

**THE REELS FOR CHAD'S EAR** (every take levelled by RMS to -16 dBFS under the -1.5 dBFS limiter, the cast's own level,
so none wins by being louder; each candidate's two lines 0.6 s apart, 1.5 s between candidates; audition/reel.py):
- `audition/reel-jun.mp3` (70 s): James, Jake, Darryl Lim, **Sam**, Jack, Cedric Xu
- `audition/reel-koh.mp3` (37 s): Lazarus Liew, Louis, **Mr David**
- `audition/reel-collector.mp3` (53 s): Mun, **Shawn Ng**, Ivan

The build goes on with the measured picks until he answers. The picked voices' audition takes ARE the take `a` of
those six lines (the same prompt, the same voice: copied into raw/, nothing said twice).

## 2 · The lines

96 lines said, 3 copied (copies.json), of the 99 that are not the fight's:
- `ph5v1` and `ph5v2` are chapter 4's `ph4b9` and `ph4b8` (lines.json `same`: Chad's own words, R128 and R129 of chapter
  4), copied as files of this chapter's own, byte for byte: no chapter cues another's sound by name (v7.1).
- `ph5t5` ("SMELL." at the table) is `ph5w6` (the same word on the walkway), byte for byte.

Tags: one a line, naming an emotion (prompts.py's TAG). The script's capitals are its own ("SMELL.": the word on the
screen); none added, no ellipsis added. No line says "LP" or Grandmaster Pho's name (so none needs "Puu"). Takes: three
for Grandmaster Pho, two for everyone else (as chapter 4). 222 takes made: NONE failed.

The pick (pick.py, chapter 4's rule unchanged): a CLEAN END first, then NO ODD HOLE, then NOT RUSHED, then the tighter
read (the unhurried one for Grandmaster Pho); every pick transcribed here, and its words held against the script by
registry.py (refused if they differ). The chain (chain.py, chapter 4's): his lines high-passed and peak-matched for his
bus; the cast by RMS to -16 dBFS; silent tails and leads trimmed; the last 0.12 s faded; mp3 128 kbps 44.1 kHz and
Opus 64 kbps 48 kHz, each from its own source, metadata stripped. Every line's row: CHAIN.txt.

Every pick came out clean by the house rule (pick.py: "needing a look: []"): every end clean, no odd hole, none rushed,
no tag spoken, every word heard. registry.py held every transcript against the script: two differed only in the
transcriber's writing (q5o1 "quarreling", ju5b1 "o 'clock"), folded in registry.py's norm, nothing else.

## 3 · The cost (the account's own balance, read before and after: v22.4)

| | used of 298,182 characters | left |
|---|---|---|
| before anything (21 Nov) | 145,272 | 152,910 |
| after the 27 audition takes | 146,170 | 152,012 |
| after the 222 line takes | 151,694 | **146,488** |

6,422 characters in all (the account bills eleven_v3 under its prompt length: spend.log counts 14,426 characters of
prompts in 246 calls). Nothing failed, so nothing was said twice.

## 4 · Into the game (install.py: held until the engine is free)

The 99 lines' files are in assets/audio and assets/audio-opus (9.8 MB, both encodings), their measured lengths in
lines.json (`secs`: assemble.py then writes them into the chapter's SECS). What is NOT yet in: their rows. src/main.js
is the engine helper's while M4 runs, and chaptertest fails a jamesAdult row in src/voicelines.js that ADULT_TAKES
lacks, so BOTH files' rows are held in registry.json and written together by install.py (ADULT_TAKES 26, CAST_TAKES
73, STING_SAMPLE 99, the three speakers, 99 registry rows, the chapter's name on the sheet), each between markers of
its own after chapter 4's; proved on a scratch copy of both files: a second run changes nothing. Until it runs, a cue
of these lines plays nothing (the M11 release gate counts this).

## 5 · The fight (21 Nov 2026: its 94 rows, frozen from docs/V28.0-FIGHT.md §10)

94 rows (`"at": "fight"`): Grandmaster Pho 80, him 6, Ton 4, Mr Koh 2, Jun 2. 93 said, 1 copied: `ph5nf3` ("SMELL.",
the short one of the hidden needs) is `ph5w6` byte for byte (lines.json `same`; the same word said with the same
firmness), as `ph5t5` is. The chapter now has 193 lines: 189 said, 4 copied.

**Tags** (prompts.py, one a line). Grandmaster Pho calm, firm and unhurried even when it is urgent: a teacher guiding a
cleansing, never shouting. `firm` for the orders (FIRE, BIND, BAG, SMELL, LEND, SHOCKWAVE, the switches), `calm` for
the lesson's explanations and the gentler hand-offs, `urgent` where a cage is breaking or a Prai is at him or under
him, `serious` for the gold and the holds, `stern` once (ph5fg, opening himself for nothing), `gentle` for the last
bag and the fight lost, `warm` for the praise and "You are safe beside me". His thoughts: reflective (q5c0, q5c4),
shaken (q5c1, q5c2), quiet (q5c3), awed (q5c5). Behind the thread: Ton concerned / firm / afraid, Mr Koh puzzled and
awed, Jun awed and afraid. No capitals added (the script's FIRE, BIND, BAG, SMELL, LEND, SHOCKWAVE are its own: the
words on the screen); no ellipsis added (ko5c2's is the script's); no "LP", no name said that needs "Puu".

**Takes**: three for Grandmaster Pho, two for everyone else: 265, NONE failed. Eight more were said for four lines the
pick flagged (below): 273 calls, 11,066 characters of prompts in spend.log.

**The pick** (pick.py, the house rule unchanged). Two takes REFUSED BY THEIR WORDS, a new table in pick.py (`REFUSED`),
because the words-heard measure counts the script's words found and so passes a word said twice: `ph5na2` a ("FIRE.
FIRE.") and `ph5c1` a ("Three Pai"); both lines took another take, clean. Four lines where every take fails one test
the same way (the voice's read, not one take's fault) were picked by reading the measures, each reason in pick.py
(`CHOSEN`) and CHAIN.txt; all four are the ones to hear first:
- `ph5fc` "Now they all come. BIND them, and I will gather them.": all five takes (two said again) end on the word's
  release 13 to 21 dB under the voice with a breath rising in the last 40 ms, which the end test refuses; take c, the
  unhurried read, whose rise lies inside the chain's 0.12 s fade.
- `ph5f7` "It is hiding. SMELL.": all five drag (0.97 to 1.16 words a second over 4 words: the long pause before SMELL
  is how the voice reads it); c, the least, its end the cleanest.
- `ph5l1` "Enough. Breathe. We begin again.": all five drag (1.03 to 1.29); b, the least, as the card opens.
- `q5c4` (his thought after the first shockwave): both whole takes hold 1.80 s between the two sentences (his hole
  limit 1.7); of the two said again, c ended on a word and d dropped the first sentence; a, the tighter.
Every other fight pick passed clean (clean end, no odd hole, not rushed, no tag spoken, every word heard).

**The chain** (chain.py, unchanged), then registry.py: every transcript held against the script (no difference), the
copy made, every length into lines.json; assemble.py (193 lines measured, 0 FIGHT-DRAFT); `node chaptertest.mjs` 0.
Said plainly: chain.py re-encodes every line when run whole, and the Opus encoder writes a new stream serial each
time, so the earlier 99 lines' .ogg files took new bytes with the same sound (committed in the lead's checkpoint
3926813; ph5t5 copied again from ph5w6 so the copy stays byte for byte). Their mp3s are byte-identical.

**Install**: install.py carries the fight with no change: it writes every row of registry.json (193), and
registry.py and prompts.py skip only a row marked `draft` (none is). Not run here (the engine is another helper's).

**The cost** (the account's own balance): 151,694 used before (146,488 left) → 156,364 after the 265 takes
(141,818 left) → 212,923 at the end (85,259 left). The account is shared at the same time with the chapter's sound and
music; this run's own share is its 11,066 prompt characters (by section 3's ratio, about 4,900 billed); the rest of
the 61,229 is the sound helper's.
