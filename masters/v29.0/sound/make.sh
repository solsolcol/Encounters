#!/bin/bash
# v29.0 · episode 5 chapter 1, The Love Spell That Followed Me Home: ITS EFFECTS, BEDS AND MUSIC, and the auditions of the
# two new voices (milestone M8, CP8.1 to CP8.3 and CP8.4's first half; the spoken lines come once
# masters/v29.0/script/lines.json is frozen). THE RECORD, in v28.0's style (masters/v28.0/sound/make.sh): how each file was
# made, every pick and why (picks.json has the line of each), the spend. A record, not a script to run end to end: every
# generation costs credits and a take on disk is never asked again (v24.3). The tracker: docs/V29.0-E5C1-BUILD.md (M8).
#
# ---- THE ACCOUNT (v22.4: the real balance, read from the service)
#   27 Nov 2026, before anything: 72,288 left (to 4 Dec). This part's ceiling 35,000 (floor 37,288 in api.py: FLOOR), and
#   never under 25,000. After the music (35 takes, 1,906 s): about 42,600; after the effects and beds (127 takes): 39,056;
#   after the auditions: 38,492. THE PRICE: an effect 11 credits a second (the service's character-cost header, every call
#   in spend.log: 3,874 for all of them); the auditions 17 to 31 a line (276); music reports no cost (v28.0's measure, 13.75
#   a second, puts this part's 1,906 s at about 26,200). THIS PART: about 30,400. The other pieces (people, things) spent
#   on the same account at the same time; the drop of the account, 33,796, holds both.
#   No job ids: the API answers with the file and no id. Nothing of the key or an address is written anywhere.
#
# ---- HOW IT WAS MADE (each step a file of its own here; its head says how)
#   api.py       the calls (v28.0's): eleven_text_to_sound_v3 for effects and beds (the length and the loop the model's own
#                parameters, v9.2), music_v2_5 instrumental (force_instrumental) for music, the length the model's own.
#                Two calls at once at most. Takes land in scratch and move into raw/ with their save.
#   music.json   the plan's eight cues (§11.2), thirteen pieces: M1, M2, M3, M4, M5, M7 three takes each; M6 its three
#                layers two each; M8 its four colourings two each (35 takes). Every prompt ends "no singing, no choir, no
#                humming, no vocals of any kind" (the plan's 11.2: the only voice in this chapter's music is Pho's chant).
#   music2.json  M2, M3 and M6's second layer MADE AGAIN (two takes each): the first takes of all three lay 77 to 95 % under
#                120 Hz, 3 to 17 % of them where a phone plays (v10.4); asked again with nothing deep.
#   sfx.json     the plan's 11.3 beds (six asked; DAWN a copy; THREE made from the night) and 11.4 effects (71), one take
#                each over 2 s, two each at 2 s and under (127 takes, none failed). sfx2.json: u51pour asked again (below).
#   measure.py   every take measured (measures-*.json), v28.0's: its level where it sounds, its loudest 50 ms, its silence,
#                where it begins and ends, the share a phone plays (over 150 Hz), the voice's band, under 120 Hz, a loop's
#                seam, a piece's seconds and its holes; and EVERY TAKE through the transcriber (faster-whisper small.en, here).
#                Refused for the words it wrote: u51pour a ("Thank you."), u51pour2 b ("Thanks for watching!"), u51bottle b
#                ("Thank you."), u51m5city c ("Mm."), u51m6b2 a ("you").
#   pick.py      THE PICKS BY MEASURE (picks.json, each with its line): effects by v28.0's rule (no word, the share a phone
#                plays within 0.08 of the best, then the fuller); under 35 % for a phone HARMONISED at encode (ten: u51fantick, u51flick, u51whoosh, u51carpet, u51door, u51gtick1, u51knee, u51swell,
#                u51slide, u51slam); a silent head over 0.12 s cut; `hit` the second of its loudest 50 ms (where a cue lands).
#                BY HAND: u51threads is a COPY of chapter 5's u5threads: the one take asked was 96 % under 120 Hz and near full
#                scale, a rumble where a dry rustle was asked. THE ENDS CHECKED (endcheck.py, both encodings): fourteen ended
#                on their own sound and were given a fade over their last 0.08 or 0.12 s and 40 ms of quiet after
#                (u51band, burn, carpet, charger, dip, flick, foil, palms, pour, press, slam, taxiin, walk, wax). Left: u51palms'
#                Opus smears 0.1 s past the mp3's end at -33 dBFS (its loudest -17.6): a quiet sound, said, not mended.
#   encode.py    the game's files (v28.0's chain): one-shot at its loudest 50 ms -14 dBFS, peaks -2 by the numpy limiter
#                (../../v26.0/sound/level_fx.py); bed 60 Hz high-pass, RMS -30 dBFS, ceiling -12 (../../v21.12/level_rms.py),
#                cued near 0.55 (-35 dBFS in the mix: the house's -34 to -37); music peak -3 dBFS, set again from each
#                encoding's own measure (v9.6). NEW HERE: xloop, A LOOP MADE BY HAND (v9.2): the take's last 2 s (0.5 s for a
#                short loop) laid over its first in an equal-power crossfade, the loop the take less that, so the joint is
#                the take's own continuity; each seam measured (below); then padded for the engine's insets
#                (../../v24.34/music/padloop.py). cutout: a stretch taken out of a piece (M4's silence). A music loop is cut
#                from its body (../../v21.2/musicloop.py: the flattest window, its end where the take meets its head, 2 s).
#                mp3 128k 44.1 kHz and Opus 48 kHz (96k effects, 128k music), each from the same levelled master and
#                measured after (measures-out.json); metadata stripped.
#   previews.py  THE REELS FOR CHAD'S EAR (previews/): one a cue, every take (the made-again after the first, so his ear hears
#                why), each at -18 LUFS; M6's three picked layers mixed (u51m6mix); one reel a voice part.
#   audition.py, audmeasure.py   the voices (below).
#   Remade with (from the repo root; RAW only while takes sit in scratch):
#     python3 -I masters/v29.0/sound/pick.py
#     OUT=<scratch> python3 -I masters/v29.0/sound/encode.py [name ...]   (then audio/ and audio-opus/ into assets/)
#     python3 -I masters/v29.0/sound/endcheck.py <scratch>
#     python3 -I masters/v29.0/sound/previews.py
#
# ---- THE MUSIC PICKS (the measured pick stands in the game until Chad names a letter: v10.6)
#   M1 u51m1blue a     62.0 s  92 % where a phone plays (b 76, c 68); from the opening's 3.5 s, its last sound at 57.9 s
#   M2 u51m2room       45.0 s loop from u51m2room2 a (MADE AGAIN; 94 %), its joint -56.9 dBFS
#   M3 u51m3pull       28.9 s loop from u51m3pull2 b (MADE AGAIN; 100 %), the 52-a-minute pulse and the violin's slides
#   M4 u51m4break b   102.9 s  37 % (a 33, c 15); its surges at about 36, 49 and 65 s; its snap a full stop at 70.9 s; the
#                     silence before the warm chord CUT from 8.6 s to 1.5 s (72.3 to 79.4 out), the chord at 72.45 s
#   M5 u51m5city b     40.0 s  72 % (c refused: "Mm."), its fade from 35 s
#   M6 u51m6a b, u51m6b (u51m6b2 b, MADE AGAIN), u51m6c a: three loops of 29.4 to 31.0 s, no melody, each peak -3 (cue
#                     near 0.45 each, stacked by pressure 0.2, 0.5, 0.8; their mix in previews/u51m6mix.mp3)
#   M7 u51m7circle a   30.0 s  91 % (b 28, c 24): quiet for its first 12 s under the chant, the swell at 19 s
#   M8 u51m8dawnA a, u51m8dawnB b, u51m8dawnC b, u51m8dawnD b   45.0 s each
#   WHAT I AM UNSURE OF: M4's three surges were asked for "the event's three surges" but the event's length is the player's;
#   the films' helper times it against the event (its snap at 70.9 s). M1 and M8 are judged by measure only.
#
# ---- THE BEDS (one take each; the seam of each loop made by hand, measured at its joint: the step from its last sample
#   to its first against a sample to the next, and the level 250 ms either side)
#   u51bstreet 20.0 s (-54.5 against -53.4; -27.2 / -27.5)   u51bstair 10.0 s (-35.8 / -39.9; -30.0 / -30.1)
#   u51bflat 20.0 s (-56.5 / -52.0; -31.1 / -30.3)          u51bcorr 18.0 s (-52.6 / -52.6; -29.5 / -29.7)
#   u51bnight 20.0 s (-54.2 / -56.2; -30.7 / -30.7)         u51bbalc 18.0 s (-53.4 / -50.5; -29.9 / -30.0)
#   u51bthree MADE from u51bnight a (low-passed at 900 Hz, 8 dB down before levelling): 20.0 s (-65.2; -30.8 / -30.7)
#   u51bdawn a COPY of episode 3 chapter 5's k5dawnbed (a koel, mynas, morning)
#   Short loops: u51lap 5.5 s, u51breath 3.5 s (its joint falls on a breath: -17.8 before, -26.1 after, the take's own),
#   u51tinnitus, u51drag 2.5 s.
#
# ---- THE EFFECTS: 71 generated (picks.json: each one's take, why, where, its hit), and 25 COPIES of what the game already
#   has that IS the thing, byte for byte under this chapter's name (v7.1): u51busaway (busaway), u51tube (u4tubetick),
#   u51knock (doorknock: its two knocks at 0.82 and 1.11 s, so cue it 0.82 s early), u51hinge (u4doorease), u51gecko
#   (u4os5), u51brass (x3baiset), u51buzz (x2buzz), u51zip (x2bagzip), u51shower and u51showeroff (showerrun, showeroff),
#   u51clock (u5clock), u51heart (u4heart), u51vison and u51visoff (u4vison, u4visoff: "chapter 4's"), u51spool (u5unwind),
#   u51knot (u5string), u51ring (x2ring), u51mynah (u5mynah), u51koel (k5koel), u51liftfar (u4os1), u51shoe (u5step1),
#   u51tile (u4tile), u51wick (x3wick), u51threads (u5threads), u51bdawn (k5dawnbed).
#   The rows to add to STING_SAMPLE: STING_ROWS.txt (gain 1 each, a suggested cue volume and where in the comment).
#   NOT HERE (each is the voices' or the engine's): the phone call's band-limit (300-3400 Hz) is a treatment of Pho's
#   lines; the two chants are voice takes (CP8.4).
#   UNTIL THE CHAPTER NAMES THEM, build.py puts every u51 sound in the SHARED pack (every player's boot download, about
#   29 MB): CLAIM.js names all 115 once, for the coordinator to paste into a part.
#
# ---- THE VOICES AUDITIONED (CP8.4's first half; audition.json, audition-measures.json, previews/voice_*.mp3)
#   Three Singaporean-English voices of ElevenLabs' shared library for each part, eleven_v3, each saying two of the plan's
#   §10 lines once with one tag. Grace: Adrina, Cynthia, Jacqueline. Marcus: Gavin, Wayne, Amir. THE MEASURED PICKS (picks.json
#   _voices): Grace ADRINA (KdGcLjKviIhd1TJjgsuv: both lines whole, neither ending on signal, 2.27 and 3.0 words a second);
#   Marcus AMIR (PHS7Re4X5gu9oeMk7Pms: each of the three ends one line on signal, so by pace, 2.22 words a second, the
#   game's median; the others 3.4 to 3.6, rushed). Unsure: the library calls Amir middle-aged; Marcus is about thirty.
#   Chad picks by ear (v5.18); his word changes one id.
