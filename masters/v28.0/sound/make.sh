#!/bin/bash
# v28.0 · episode 4 chapter 5, The House With Nine Prai: ITS EFFECTS, BEDS AND MUSIC (milestone M10, the voices' part
# aside: masters/v28.0/voices). THE RECORD, in chapter 4's style (masters/v27.0/sound.sh): how each file was made, every
# pick and why, the spend. It is a record, not a script to run end to end (every generation costs credits and a take on
# disk is never asked again). The tracker: docs/V28.0-E4C5-BUILD.md (M10).
#
# ---- THE ACCOUNT (v22.4: the real balance, read from the service, never an estimate)
#   before anything, 21 Nov 08:44 UTC: 143,765 credits left (154,417 of 298,182 used; the voices' helper had stopped)
#   after the effects (374 takes): 121,997;  after M7 made again (three takes): 118,037 (so a minute of music is 825
#   credits: 13.75 a second, music_v2);  after the nineteen cues, the stems and the voices: 87,755;  after M6 made again:
#   about 86,250. THE PRICE, MEASURED: an effect 11 credits a second (the service's own `character-cost` header, every
#   call in sound/spend.log, 14,484 for all the effects); music 13.75 a second; a stem separation of a 96 s piece about
#   2,400 to 2,700 (read from the balance between calls: the header is absent for music and stems).
#   ALL OF THE CHAPTER'S SOUND: about 57,500 credits. The voices' helper spends on the account at the same time.
#   No job ids: the API answers a generation with its file and no id. Every call is a line of sound/spend.log (its time,
#   the take, its cost, its seconds); nothing of the key or an address is written anywhere.
#
# ---- HOW IT WAS MADE (each step a file of its own in masters/v28.0/sound, its head says how)
#   api.py       the calls: eleven_text_to_sound_v3 for effects and beds (the length and the loop the model's own
#                parameters, v9.2), music_v2 instrumental for music (the newest each: v22.4), six_stems_v1 for the
#                separation. One call at a time (the account allows two at once; the voices' helper has the other).
#                A take lands in the scratch folder and is moved into raw/ with its save (the lead's rule: the tree is
#                never left holding files not committed).
#   sfx.py       144 effects and beds in ten families (sfx.json): the plan's 10.1, with the fight AS REDESIGNED
#                (docs/V28.0-FIGHT.md 2: BIND, SMELL and LEND for Master Zavier, FIRE, the golden SHOCKWAVE and the BAG for
#                Grandmaster Pho). STEADY and its grip are gone, and so are their two sounds (the low bell, the held note
#                of the grip); the held note is now the BOUND Prai's (u5bindhold), the bell is the switch to him (u5swzav).
#                Two takes each, four of every wordless voice. 374 takes, none failed.
#   music.py     nineteen cues (music.json), one palette: the TEACHER's (a Thai piphat colour: ranat, gong circle, pi,
#                taphon) and the STUDENT's (a breathy bamboo flute, a few wordless voices, a small bell); every prompt asks
#                for nothing deep (a phone plays almost nothing under 120 Hz, v10.4). Two takes a cue, three of the opening
#                and of M7. One take failed outright (u5m12lift a, a connection reset) and was re-run unchanged (v24.3).
#   music2.py    M7 MADE AGAIN FOR ITS STEMS (why below). music3.py: its fifth stem, the voices. music4.py: M6 made again.
#   measure.py   every take measured (measures-sfx.json, measures-music*.json): its level where it sounds, its loudest
#                50 ms, its silence, when it begins, the share a phone plays (over 150 Hz), the share in the voice's band
#                (300 to 3400 Hz), under 120 Hz, a loop's seam, a piece's seconds and its holes; and EVERY TAKE put through
#                the transcriber (faster-whisper small.en, here: nothing uploaded). 25 effect takes and 1 music take were
#                refused for the words it wrote ("Whoa", "BAH!", "Hmmm...", "Thanks for watching!" ...: pick.py lists them)
#                or as near silent.
#   pick.py      THE PICK BY MEASURE (picks.json, each with its reason: the line of every pick is there, word for word):
#                effects: no word; not near silent; the share a phone plays (the takes within 0.08 of the best); then a
#                one-shot the fuller, a loop the steadier (of those within 12 dB of the fullest) and the less in the
#                voice's band. ELEVEN HARMONISED (a phone plays under 35 %: their own low end's harmonics laid under the
#                take, kept whole, chapter 4's HARM): the lift's hum, Grandmaster Pho's step, the first fireball, a
#                landing, the ruby strike, the stale landing, Master Zavier's slow step, the turn, the broken cleansing,
#                the Naga rising and its breath. Music: no hole in its body, the share a phone plays, a loop the steadier.
#   notes.py     THE COUNT'S NINE NOTES, MADE from one bowl (u5bowl a: its ring measured at 821.9 Hz) onto a rising D
#                minor pentatonic ladder in the fight's key, D5 to A6, each measured after (587.1 ... 1760.8 Hz). Two
#                faults found by that measure and mended: the strike's spectrum, not the ring's, first set the pitch, and
#                asetrate relabelled the 44.1 kHz take as 48 kHz: the first ladder came out 9 % sharp.
#   stems.py     M7's five stems (below). encode.py: the game's files (below). previews.py: the reels. manifest.py: the
#                manifest (manifest.json: what each sound is for, its kind, the volume to cue it at, the fight's event it
#                answers). install.py: the STING_SAMPLE rows into src/main.js (NOT RUN here: the engine's helper owns
#                main.js; the lead runs it once it is free: `python3 -I masters/v28.0/sound/install.py`).
#
# ---- M7, THE FIGHT'S FIVE STEMS, AND WHY THIS WAY (the plan's 10.2: "one tempo, one key, five stems of one length")
#   First: one full piece (u5m7fight, 96 BPM, D minor) and the service's stem separation. MEASURED, its six stems came
#   back drums 50 % of its energy, other 11, bass 5, vocals 1, piano and guitar EMPTY: its xylophone, flute, gongs and
#   choir all fell into "other". So the piece was asked again (u5m7band, music2.py) with each of its parts written FOR one
#   of the separator's classes, every part playing throughout. Take c, the steadiest (its seconds within 8.5 dB for all 96
#   s), separated: drums 36 % (and the low strings with them: "bass" stays under -90 dBFS), piano 14 % (the struck line,
#   from 8 s), other 14 % (the flute and the bell), guitar a trace, vocals NOTHING (no choir was sung). Its beat measured
#   at 0.625 s exactly, with no drift to 77.5 s (the onsets' autocorrelation peaks at 0.625, 2.5, 10, 20, 40, 60 and 77.5 s
#   to 5 ms), its notes D 27 %, A 20, E 9, F 9: D minor. So:
#     u5m7low    the drums' stem under 200 Hz (a linear-phase split: low + high = the stem exactly), with the traces of
#                bass and vocals and what the separation left out (the piece minus all six, -20.9 dB): the floor
#     u5m7drum   the drums' stem over 200 Hz: the skins and the gongs' strike (the teacher's)
#     u5m7line   piano and the guitar's trace: the struck line (the teacher's)
#     u5m7flute  other: the flute and the small bell (the student's)
#     u5m7voice  the voices, MADE AS THEIR OWN PIECE AND BEATLESS (music3.py u5m7choir a: one held D minor chord, its
#                notes measured D, A, A#, F), so it cannot fall out of a tempo it does not have (a: its steadiest 77 s
#                within 1.5 dB, b 2.0, and less of it in the voice's band, 84 % against 96)
#   The first four SUM TO THE PIECE (checked: under -240 dBFS apart). ONE loop for all of them: 30 bars, 75.000 s, from
#   14.375 s, its end placed where the piece's onsets best meet its head on WHOLE bars (a first search to the nearest 10
#   ms came out 0.11 s short of 31 bars: a beat skipped at the seam, and refused), one 1 s crossfade for each; the voices'
#   own 75 s loop from their 5th second, a 3 s crossfade. One gain for the four (the sum's peak at -3 dBFS, -2.35 dB); the
#   voices 3 dB under the piece's average. Each padded alike for the engine's insets: every file 75.12 s. Seams: -60,
#   -70.7, -38.5, -36.2, -36.0 dBFS (sound/stems.py's report). Not done, and why: the other route, five pieces asked
#   separately, cannot be held in step (each generation keeps its own clock); the plan's grouping ("drums and low
#   strings; a struck wooden line; a breath of flute; gongs and brass; voices and a bell") became floor; drums and
#   gongs; the line; flute and bell; voices, because the separator holds the gongs with the drums and no brass came back.
#   WHAT I AM UNSURE OF: the floor stem is 70 % under 120 Hz (a phone plays little of it: the four above carry the fight
#   on a phone); the choir is 84 % in the voice's band (a line over it is ducked 8 dB by the engine, and the manifest
#   keeps it at 0.2 while Grandmaster Pho is played).
#
# ---- THE ENCODING (encode.py, from picks.json; chapter 4's chain, one rule a kind)
#   one-shot   its loudest 50 ms at -14 dBFS (his own steps and the others' at -16), peaks held at -2 by the numpy
#              limiter (../v26.0/sound/level_fx.py), in its own channels; a silent head over 0.12 s cut
#   bed        60 Hz high-pass, RMS -30 dBFS, ceiling -12 (../v21.12/level_rms.py), padded (../v24.34/music/padloop.py):
#              cued near 0.55, so -35 dBFS in the mix with nobody speaking (the house rule: -34 to -37)
#   loop       levelled as a one-shot, padded as a bed
#   music      peak -3 dBFS (v22.4), each encoding measured and set again from its own measure (v9.6); a play cue a loop
#              cut from its body (../v21.2/musicloop.py: the flattest window, its end where the take meets its head)
#   copies     Spirit Vision's five (u5vison, u5visoff, u5heart, u5visbed, u5vismus): chapter 4's files byte for byte
#              (v7.1: a sound named from another chapter would become every player's download)
#   mp3 128 kbps 44.1 kHz and Opus 48 kHz (96 kbps effects, 128 kbps music), each encoded from the same levelled master
#   and measured after; metadata stripped. Remade with:
#     MADE=<scratch>/e4c5/sound python3 -I masters/v28.0/sound/stems.py masters/v28.0/sound/raw/u5m7band_c.mp3 \
#          masters/v28.0/sound/stems/band_c masters/v28.0/sound/raw/u5m7choir_a.mp3 <scratch>/e4c5/sound/m7
#     python3 -I masters/v28.0/sound/notes.py masters/v28.0/sound/raw/u5bowl_a.mp3 <scratch>/e4c5/sound/notes
#     MADE=<scratch>/e4c5/sound python3 -I masters/v28.0/sound/encode.py            (every name, or the names given)
#
# ---- THE PICKS THAT WAIT ON CHAD'S EAR (v10.6): sound/previews, one reel a cue, every take at -18 LUFS
#   Every music cue (u5m1open ... u5m19card: the measured pick stands in the game until he names a letter); M7's reel
#   (the teacher's mix, the student's, all five, then each stem alone); the nine's three voices (u5ncome, u5nslip,
#   u5nhide: four takes each). Each film's cue is measured against its film once the films are cut (M9): a pick may move.
#
# ---- THE MUSIC PICKS (pick.py; the line of each in picks.json)
#   M1  u5m1open a    the one hole in its body; its 3.95 s silent head cut (b is silent for 9 s, c 37 % for a phone)
#   M2  u5m2walk b    54 % where a phone plays (a 17 %), a loop of 52 s from its body
#   M3  u5m3room b    49 % (a 26 %), no hole before its end at 37.7 s
#   M4  u5m4hunt b    89 % (a 30 %), a loop
#   M5  u5m5nine b    99 %, less in the voice's band (62 % against 92)
#   M6  u5m6prep2 b   MADE AGAIN (the first two: 22 and 6 % for a phone); b builds from near nothing, as the preparation does
#   M7  the five stems (above)
#   M8  u5m8surge b   72 % (a 27 %)
#   M9  u5m9naga a    90 % (b 75 %)
#   M10 u5m10last a   100 % (b 23 %), a loop of 30 s
#   M11 u5m11light b  77 %, 14 % in the voice's band
#   M12 u5m12lift b   99 %
#   M13 u5m13shop a   92 %, swing 5.7 dB, a loop
#   M14 u5m14sight b  100 % (a 56 %), a loop
#   M15 u5m15endA a   71 %   M16 u5m16endB b 99 %   M17 u5m17endC a 48 % (b refused: the transcriber writes "Thanks for
#   watching!")   M18 u5m18endD b 56 %   M19 u5m19card b 100 %, 26 % in the voice's band
