#!/bin/sh
# v13.0 CP3 — the sound. Chad's items 7, 11a, 20a and 22a.
#
#   n3press     re-said under [terrified] (item 7: "needs to sound more scared")
#   b4cyc/k4cyc/r4cyc   THE THREE SHOUTS when the cyclist is first seen, in
#               Chad's own example words, on three DISTINCT voices (item 22:
#               "different voicelines" has to mean different voices too)
#   flarelaunch the flare LEAVING the tube and climbing (item 11)
#   stingcyc    the sting on the frame the cyclist is seen (item 20)
#
# THE PICKS, by measurement (measure.json), because there are no ears in a
# session:
#   n3press_c  — by a clear margin the cleanest EDGES of the four (head -15.4 /
#                tail -26.2 against b's -4.1 / -16.5), and at 6.32 s still
#                0.84 s under the pre-v11.6 take. All four carry [terrified],
#                which is the substantive answer to "more scared" — the shipped
#                take was [panicking].
#   b4cyc_c    — head -68.0 / tail -62.8, the cleanest of four, peak -1.85.
#   k4cyc_a    — of two (two takes failed; eleven_v3 fails about one line in
#                three at random, the v4.1 law — do NOT rewrite a failed line),
#                the shorter and louder: 3.52 s, rms -12.83 against b's -14.79.
#   r4cyc_b    — a's tail is -15.8, i.e. it ends ON signal; b is the same
#                2.32 s with a tail 17 dB cleaner. c is 0.48 s longer and three
#                shouts stacked want to be short.
#   flarelaunch_c — starts from real silence (head -58.9) and is BROAD BAND
#                (mid 27 / voice 36 / air 36) where b is 49 % air hiss and d is
#                -31 dBFS of nothing. sub-120 Hz is 0.5 %, so a phone plays all
#                of it (the v10.4 measure).
#   stingcyc_d — the BRIGHTEST of four (air 21.9 % against 0.9 / 7.3 / 6.5) with
#                a 0.40 s decay, which is what "bright and cutting, almost no
#                low bass" asked for. sub-120 Hz is 0.0 %.
#
# Levels, as every release since v12.1: Aaron peak-matched to -6.85 mp3 /
# -6.6 ogg (his bus carries the compressor and the limiter); THE CAST BY RMS
# to -16 dBFS through ../v11.1/level.py, because the cast bus is FLAT (the
# v11.1 finding); effects -4.0 dBFS peak. And EACH ENCODER GETS ITS OWN
# TARGET — libmp3lame loses ~0.5 dB where libopus gains ~0.7, and the delta is
# PER FILE (the v9.6/v9.7 law), so `enc` iterates until both land.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2 3; do
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f e_$n.wav
}
cast() { # name src — levelled by RMS for the FLAT cast bus, then encoded plainly
  n=$1; src=$2
  python3 ../v11.1/level.py "$src" w_$n.wav -16
  ffmpeg -v error -y -i w_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i w_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  rm -f w_$n.wav w_$n.wav.f32
}
V=-6.85; O=-6.6; E=-4.0

enc  n3press     raw/n3press_c.mp3  $V $O 64k 1     # Aaron, his own bus
cast b4cyc       raw/b4cyc_c.mp3                    # David  · the buddy
cast k4cyc       raw/k4cyc_a.mp3                    # Kelvin · the bunkmate
cast r4cyc       raw/r4cyc_b.mp3                    # Ronan  · the third recruit
enc  flarelaunch w_flarelaunch.wav  $E $E 96k 2
enc  stingcyc    w_stingcyc.wav     $E $E 96k 2
