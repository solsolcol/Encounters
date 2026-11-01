#!/bin/sh
# v24.24 · THE FIRST MASTER'S CHANT, WHISPERED (Chad, 1 Nov 2026: "For the black ajahn in ep 4 chp 1, change all of his
# chanting to something that cannot really hear and intelligible. So that he seem more yin and creepy. Like a whispering
# voice. But still in the same thai voice." — and, of the subtitles that came with it, "Except for his creepy chanting,
# that part will not have any subtitles").
#
# The voice is his own: Patinya (weRAVUYgqjjfUEEu5BsB), eleven_v4, flow kwBPc27mHPYF22Q9MbsR; the words are the shipped
# words (the homage three times, the Nang Kwak trade formula, "mahā-lābhā bhavantu me"); every session is in
# sessions.json and every take in raw/ (fetch.py). Measured with meas.py and a per-phrase split (voiced % = the share of
# loud 40 ms frames with a clear pitch; a real whisper has almost none — Pong's pg1eyes 34 %, the v21.5 medium 46-54 %,
# the chant this replaces 75 %):
#
#   c1, c2   [whispering] once at the head (the v21.5 recipe)  -> a HUSHED VOICE, not a whisper: 68-82 % voiced. Rejected.
#   c1s, c2s the same words with no punctuation                -> the same. Rejected.
#   r2b      [whispers] [breathless] once at the head           -> 74-81 %. Rejected.
#   r2a      [whispers] before EVERY phrase (fm1chant2's words) -> a whisper, 22-38 % in its first phrase, 40-59 % after
#   r3       [whispers] before every phrase (fm1chant's words)  -> the homage a TRUE whisper (4-18 %), then from the trade
#                                                                 formula on a voiced read again (64-82 %), in all four
#   r4f, r4m ONE phrase per take, [whispers] at its head        -> whispered through: the formula 9-24 %, the closing
#                                                                 line 4-23 %
# So a take whispers in its first phrases and drifts back to his voice after. Each chant is laid PHRASE BY PHRASE from
# whispered phrases only (assemble.py: cut at the words' measured edges, each phrase brought to one loudness, the
# model's own half-second breath between them), then levelled as the game's other whisper is (the v21.5 medium's
# -21 dB RMS, 5 dB under the cast's speech: level.py, 3:1 over -22 dB, the limiter at -1.5 dBFS).
# (The [whispers] tag repeats before each phrase because one at the head did not hold: the rule's point, a whisper
#  proven by measurement, is what is kept. No tag was spoken: each phrase's length is the words' own — the homage
#  4.06-4.08 s in every r3 take, the formula 3.40-3.52 s in every r4f take — where a spoken tag adds ~0.6 s.)
#
# THE PICKS, and why:
#   fm1chant  (the blessing, once): r3_a's three homages, whole (4 / 5 / 9 % voiced, its head and tail at -84 / -85 dB:
#             the cleanest of the four r3 takes, which all whisper this half) + the formula from r4f_c (9 %, the least
#             voiced) and r4f_b (10 %) + the closing line from r4m_a (4 %, the least voiced of the four)
#   fm1chant2 (the chant going on through the signs and the storm, looped): the formula from r4f_a (24 %), r2a_a's first
#             phrase (22 %) and r4f_d (12 %) — three different takes, so the loop never repeats one phrase inside itself
#             and never repeats fm1chant's — + the closing line from r4m_d (10 %)
#   fm1chant2D (ending D opens on it, "the chant let finish"): fm1chant2's own last two phrases — r4f_d's formula and
#             r4m_d's closing line — so the chant he hears end is the one he heard going on; 6.5 s, inside the 6.8 s
#             before the bell that says it has ended
# (Tried first and not used: whisperize.py, a whisper made from a voiced take — his formants laid over noise. It
#  works (0-1 % voiced) but it is a treatment of his voice, where the model's own whisper, phrase by phrase, IS his voice.)
set -e
cd "$(dirname "$0")"
R=raw
python3 -I assemble.py w_fm1chant.wav  $R/r3_a.mp3:0.06:13.48 $R/r4f_c.mp3:0.04:3.62 $R/r4f_b.mp3:0.04:3.68 $R/r4m_a.mp3:0.06:2.70
python3 -I assemble.py w_fm1chant2.wav $R/r4f_a.mp3:0.04:3.74 $R/r2a_a.mp3:0.04:3.74 $R/r4f_d.mp3:0.04:3.70 $R/r4m_d.mp3:0.06:2.58
python3 -I assemble.py w_fm1chant2D.wav $R/r4f_d.mp3:0.04:3.70 $R/r4m_d.mp3:0.06:2.58
for k in fm1chant fm1chant2 fm1chant2D; do
  python3 -I ../v11.1/level.py w_$k.wav l_$k.wav -21
  ffmpeg -v error -y -i l_$k.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$k.mp3
  ffmpeg -v error -y -i l_$k.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$k.ogg
  printf '%s: mp3 %s s, opus %s s\n' $k \
    "$(ffprobe -v error -show_entries format=duration -of csv=p=0 ../../assets/audio/$k.mp3)" \
    "$(ffprobe -v error -show_entries format=duration -of csv=p=0 ../../assets/audio-opus/$k.ogg)"
done
rm -f w_*.wav l_*.wav l_*.wav.f32
