#!/bin/sh
# v21.2 · episode 3 chapter 3 — the shop radio's chant, replaced.
# Chad: "after taking the lp tim amulet, there is some background chanting
# sound that sounds eerie. Replace that with a proper buddhist chanting
# music/sound." The v21.0 bed (`shopchant`, the take named vesakchant) came
# from the SOUND-EFFECTS model asked for "lay people chanting in Pali": what
# that model makes is wordless voice texture — measured, a continuous wall
# with NO breaths in 20 s, at 216 Hz (men and women), the ghost-choir shape.
#
# Flow qapQMCX9SGeqWVMjA91j (sessions.json). Two routes, four takes each:
#   chantmusic — eleven_music_v2 with the Itipiso as CUSTOM LYRICS (Buddha,
#     Dhamma, Sangha), "a group of monks reciting Pali in unison, a cappella,
#     one steady low reciting tone", 75 s.
#   chantiti — eleven_v3 TTS, Arthur (episode 3 chapter 1's monk), the same
#     text romanised as a Thai monk says it (mk1iti's way) — a SOLO voice,
#     kept in raw/ as the fallback; not used.
# chantmeas.py (pulse = the syllable rhythm, f0 IQR = how far the reciting
# tone wanders, breaths, the band a phone plays):
#   shopchant (old)  phone 93.5%  f0 216 Hz IQR 0.42 st  breaths 0 in 20 s
#   chantmusic_a     phone 82.5%  f0 145 Hz IQR 2.49 st  pulse 3.6 Hz
#   chantmusic_b     phone 61.1%  f0 182 Hz IQR 5.94 st  (sung, melodic) — out
#   chantmusic_c     phone 84.7%  f0 162 Hz IQR 0.25 st  pulse 5.0 Hz
#   chantmusic_d     phone 62.1%  f0 103 Hz IQR 2.15 st  sub 18 %
# TRANSCRIBED (eleven_scribe_v1), because a measure cannot say WHAT is sung:
#   c chants the whole Itipiso, 0.18-74.96 s ("itipi so bhagava araham samma
#   sambuddho ... anuttaram punnakkhettam lokassati"), a the same 5.0-67 s.
# PICK: c — one calm reciting tone (IQR 0.25 st), every syllable on an even
# pulse, the whole text from its first word to its last, 85 % of it in the
# band a phone plays. a and d went to Chad as previews (the v10.6 rule: his
# ear can swap them).
# It ends on its own decay (the last word at 72.9 s, the hall's tail to
# -72 dB at 75 s) and begins 0.1 s in, so the file loops as it is: the
# recording repeating after a breath.
# The radio: high-passed at 90 Hz, low-passed at 10 kHz; levelled by RMS to
# -15.5 dBFS (the old bed was -14.2, a denser sound) under a -1.5 dBFS
# lookahead limiter (levelst.py); encoded straight from that WAV.
#
# (the chant was installed by: chantmusic_c, the same radio filters, levelst.py
# to -15.5 dBFS RMS under -1.5 / -3.0 dBFS limits; measured after: mp3 RMS
# -15.5 peak -0.6, ogg RMS -15.2 peak -0.3, 75.0 s, f0 162 Hz, IQR 0.25 st)
#
# ---- SUPERSEDED the same day. Chad, on the previews of c, a and d: "All 3
# generated chant music choices are terrible. Remove the chant music, and
# replace with thai traditional music instead." The chant takes stay in raw/
# as the record; nothing ships them.
#
# THE RADIO PLAYS THAI TRADITIONAL MUSIC (same flow; sessions.json):
#   thaistrings — eleven_music_v2, instrumental, 75 s: a khrueang sai string
#     ensemble (saw duang, saw u, jakhe, khlui, soft ching), calm and even.
#   thaimahori — the same, a mahori (khim, saw sam sai, jakhe, khlui, ching),
#     "no xylophones, no gongs": the trance's own melody (`e3dance`) is a
#     PIPHAT — ranat, khong wong, pi — and the radio must not sound like it.
# musicmeas.py against e3dance (phone band, the 1 s level's spread, onsets,
# and the chroma correlation with the melody the radio plays under), then
# musicloop.py (the flattest 50 s of the body, its end placed where the take
# runs on most like the window's head, a 2 s crossfade):
#   take          phone  sub   loop 1s std  min    chroma~dance
#   strings_a     99.0%  0.0%  2.54 dB     -24.0  +0.73   (preview)
#   strings_b     90.7%  6.3%  3.78        -27.6  +0.71
#   strings_c     98.9%  0.0%  5.12        -32.9  -0.32
#   strings_d     96.6%  0.0%  4.00        -31.6  +0.64
#   mahori_a      82.8% 12.5%  1.48        -20.7  +0.74   (preview: the steadiest)
#   mahori_b      99.2%  0.0%  3.24        -28.5  +0.77
#   mahori_c      99.2%  0.0%  2.36        -25.3  +0.83   PICK
#   mahori_d      98.0%  0.0%  2.36        -21.4  +0.20
# PICK (v21.2): mahori_c — all of it in the band a phone plays, an even
# level, and of the eight the nearest in pitch to the melody it sits under
# once the hands part (the chapter also sinks the radio under that melody).
# mahori_a and strings_a went to Chad as previews (his ear swaps them) — and
# it did. v21.3, Chad: "Thai radio music 2 is better." Preview no. 2 was
# mahori_a, the steadiest of the eight (a 1.5 dB spread over its loop), so it
# is the radio's music now; mahori_c stays in raw/.
# The radio: high-passed at 90 Hz, low-passed at 10 kHz; levelled by RMS to
# -15.5 dBFS under a -1.5 dBFS lookahead limiter (levelst.py), the Opus copy
# from its own -3.0 source (libopus overshoots; the v9.6 law).
set -e
cd "$(dirname "$0")"
python3 musicloop.py raw/thaimahori_a.mp3 50
ffmpeg -v error -y -i w_thaimahori_a.wav -af "highpass=f=90:poles=2,lowpass=f=10000:poles=2" -ar 48000 -ac 2 f_r.wav
python3 levelst.py f_r.wav lv_r.wav -15.5 -1.5
python3 levelst.py f_r.wav lv_r3.wav -15.5 -3.0
ffmpeg -v error -y -i lv_r.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 -ac 2 ../../assets/audio/shopchant.mp3
ffmpeg -v error -y -i lv_r3.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 -ac 2 ../../assets/audio-opus/shopchant.ogg
rm -f f_r.wav lv_r.wav lv_r3.wav w_thai*.wav
echo "shopchant <- thaimahori_a (the radio's Thai music, Chad's pick; the key keeps its name)"
